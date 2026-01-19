"""Button platform for Tile Tracker.

Copyright (c) 2024-2026 Jeff Hamm <jeff.hamm@gmail.com>
Developed with assistance from Claude (Anthropic)

SPDX-License-Identifier: MIT
"""
from __future__ import annotations

import logging
from datetime import datetime, timezone

from homeassistant.components.button import ButtonEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity
from homeassistant.helpers.restore_state import RestoreEntity
from homeassistant.helpers.entity import EntityCategory

from .const import DOMAIN
from .tile_api import TileDevice
from .tile_service import get_tile_service

_LOGGER = logging.getLogger(__name__)

ATTR_LAST_REFRESHED = "last_refreshed"
ATTR_LAST_LOCATED = "last_located"


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up Tile buttons based on a config entry."""
    coordinator = hass.data[DOMAIN][entry.entry_id]["coordinator"]
    
    entities = []
    
    # Add global refresh button
    entities.append(TileRefreshButton(coordinator, entry))
    
    # Add per-device buttons (locate, refresh, and program ringtone)
    for tile_uuid, tile in coordinator.data.items():
        # Check if tile should be disabled based on coordinator settings
        entity_enabled = not coordinator.should_disable_tile(tile)
        
        entities.extend([
            TileLocateButton(hass, coordinator, tile_uuid, entity_enabled),
            TileRefreshDeviceButton(coordinator, tile_uuid, entity_enabled),
            TileProgramRingtoneButton(hass, coordinator, tile_uuid, entity_enabled),
        ])
    
    async_add_entities(entities)
    
    # Listen for new tiles
    @callback
    def async_check_new_tiles() -> None:
        """Check for new tiles and add them."""
        existing_uuids = set()
        for state in hass.states.async_all("button"):
            if "_locate" in state.entity_id:
                # Try to extract UUID from unique_id pattern
                entity_id = state.entity_id
                if "tile_" in entity_id and "_locate" in entity_id:
                    # Parse uuid from entity_id pattern
                    parts = entity_id.split("_")
                    if len(parts) >= 2:
                        existing_uuids.add("_".join(parts[1:-1]))
        
        new_entities = []
        for tile_uuid, tile in coordinator.data.items():
            if tile_uuid not in existing_uuids:
                entity_enabled = not coordinator.should_disable_tile(tile)
                new_entities.extend([
                    TileLocateButton(hass, coordinator, tile_uuid, entity_enabled),
                    TileRefreshDeviceButton(coordinator, tile_uuid, entity_enabled),
                    TileProgramRingtoneButton(hass, coordinator, tile_uuid, entity_enabled),
                ])
        
        if new_entities:
            async_add_entities(new_entities)
    
    entry.async_on_unload(
        coordinator.async_add_listener(async_check_new_tiles)
    )


class TileRefreshButton(CoordinatorEntity, ButtonEntity):
    """Button to refresh all Tile devices."""

    _attr_has_entity_name = True
    _attr_name = "Refresh Tiles"
    _attr_icon = "mdi:refresh"

    def __init__(
        self,
        coordinator,
        entry: ConfigEntry,
    ) -> None:
        """Initialize the refresh button."""
        super().__init__(coordinator)
        self._entry = entry
        self._attr_unique_id = f"tile_refresh_{entry.entry_id}"

    @property
    def device_info(self):
        """Return device info."""
        return {
            "identifiers": {(DOMAIN, self._entry.entry_id)},
            "name": "Tile Tracker",
            "manufacturer": "Tile",
            "model": "Tile Account",
            "entry_type": "service",
        }

    async def async_press(self) -> None:
        """Handle the button press."""
        _LOGGER.debug("Refresh Tiles button pressed")
        await self.coordinator.async_request_refresh()


class TileLocateButton(CoordinatorEntity, ButtonEntity, RestoreEntity):
    """Button to ring/locate a specific Tile."""

    _attr_has_entity_name = True
    _attr_icon = "mdi:bell-ring"
    _attr_translation_key = "locate"

    def __init__(
        self,
        hass: HomeAssistant,
        coordinator,
        tile_uuid: str,
        entity_enabled: bool = True,
    ) -> None:
        """Initialize the locate button."""
        super().__init__(coordinator)
        self._hass = hass
        self._tile_uuid = tile_uuid
        self._attr_unique_id = f"tile_{tile_uuid}_locate"
        self._attr_name = "Locate"
        self._attr_entity_registry_enabled_default = entity_enabled
        self._last_located: datetime | None = None

    async def async_added_to_hass(self) -> None:
        """Restore last_located from previous state."""
        await super().async_added_to_hass()
        if (last_state := await self.async_get_last_state()) is not None:
            if ATTR_LAST_LOCATED in last_state.attributes:
                try:
                    self._last_located = datetime.fromisoformat(
                        last_state.attributes[ATTR_LAST_LOCATED]
                    )
                except (ValueError, TypeError):
                    pass

    @property
    def tile(self) -> TileDevice | None:
        """Return the tile device data."""
        if self.coordinator.data:
            return self.coordinator.data.get(self._tile_uuid)
        return None

    @property
    def extra_state_attributes(self):
        """Return extra state attributes."""
        attrs = {}
        if self._last_located:
            attrs[ATTR_LAST_LOCATED] = self._last_located.isoformat()
        return attrs

    @property
    def device_info(self):
        """Return device info."""
        if not self.tile:
            return None
        return {
            "identifiers": {(DOMAIN, self.tile.tile_uuid)},
            "name": self.tile.name,
            "manufacturer": "Tile",
            "model": self.tile.tile_type or "Tile Tracker",
            "sw_version": self.tile.firmware_version,
            "hw_version": self.tile.hardware_version,
        }

    @property
    def available(self) -> bool:
        """Return True if entity is available."""
        tile = self.tile
        return (
            self.coordinator.last_update_success
            and tile is not None
            and bool(tile.auth_key)
        )

    async def async_press(self) -> None:
        """Handle the button press - ring the Tile."""
        tile = self.tile
        if not tile:
            _LOGGER.error("Tile not found: %s", self._tile_uuid)
            return
        
        _LOGGER.info("Locating Tile: %s", tile.name)
        
        # Get default settings from entities
        volume = self._get_default_volume()
        duration = self._get_default_duration()
        song_id = self._get_default_song_id()
        
        _LOGGER.debug(
            "Ring settings for %s: volume=%s, duration=%d, song_id=%s",
            tile.name, volume, duration, song_id
        )
        
        tile_service = get_tile_service(self._hass)
        success = await tile_service.ring_tile(
            tile=tile,
            volume=volume,
            duration=duration,
            song_id=song_id,
        )
        
        if success:
            self._last_located = datetime.now(timezone.utc)
            self.async_write_ha_state()
        else:
            _LOGGER.warning("Failed to ring Tile %s", tile.name)

    def _get_default_volume(self) -> str:
        """Get the default volume from the volume select entity."""
        entity_id = f"select.{self._make_entity_slug()}_default_volume"
        state = self._hass.states.get(entity_id)
        if state and state.state in ("low", "medium", "high"):
            return state.state
        return "medium"

    def _get_default_duration(self) -> int:
        """Get the default duration from the number entity."""
        entity_id = f"number.{self._make_entity_slug()}_default_duration"
        state = self._hass.states.get(entity_id)
        if state:
            try:
                return int(float(state.state))
            except (ValueError, TypeError):
                pass
        return 5

    def _get_default_song_id(self) -> int | None:
        """Get the default song ID from the song select entity."""
        entity_id = f"select.{self._make_entity_slug()}_song"
        state = self._hass.states.get(entity_id)
        if state and "selected_song" in state.attributes:
            return state.attributes["selected_song"]
        return None

    def _make_entity_slug(self) -> str:
        """Create entity ID slug from tile name."""
        tile = self.tile
        if tile and tile.name:
            # Convert "My Tile Name" to "my_tile_name"
            import re
            slug = tile.name.lower()
            slug = re.sub(r'[^a-z0-9]+', '_', slug)
            slug = slug.strip('_')
            return f"tile_{slug}"
        return f"tile_{self._tile_uuid[:8]}"


class TileRefreshDeviceButton(CoordinatorEntity, ButtonEntity, RestoreEntity):
    """Button to refresh a specific Tile's data."""

    _attr_has_entity_name = True
    _attr_icon = "mdi:refresh"
    _attr_translation_key = "refresh"

    def __init__(
        self,
        coordinator,
        tile_uuid: str,
        entity_enabled: bool = True,
    ) -> None:
        """Initialize the refresh button."""
        super().__init__(coordinator)
        self._tile_uuid = tile_uuid
        self._attr_unique_id = f"tile_{tile_uuid}_refresh"
        self._attr_name = "Refresh"
        self._attr_entity_registry_enabled_default = entity_enabled
        self._last_refreshed: datetime | None = None

    async def async_added_to_hass(self) -> None:
        """Restore last_refreshed from previous state."""
        await super().async_added_to_hass()
        if (last_state := await self.async_get_last_state()) is not None:
            if ATTR_LAST_REFRESHED in last_state.attributes:
                try:
                    self._last_refreshed = datetime.fromisoformat(
                        last_state.attributes[ATTR_LAST_REFRESHED]
                    )
                except (ValueError, TypeError):
                    pass

    @property
    def tile(self) -> TileDevice | None:
        """Return the tile device data."""
        if self.coordinator.data:
            return self.coordinator.data.get(self._tile_uuid)
        return None

    @property
    def extra_state_attributes(self):
        """Return extra state attributes."""
        attrs = {}
        if self._last_refreshed:
            attrs[ATTR_LAST_REFRESHED] = self._last_refreshed.isoformat()
        return attrs

    @property
    def device_info(self):
        """Return device info."""
        if not self.tile:
            return None
        return {
            "identifiers": {(DOMAIN, self.tile.tile_uuid)},
            "name": self.tile.name,
            "manufacturer": "Tile",
            "model": self.tile.tile_type or "Tile Tracker",
            "sw_version": self.tile.firmware_version,
            "hw_version": self.tile.hardware_version,
        }

    @property
    def available(self) -> bool:
        """Return True if entity is available."""
        return self.coordinator.last_update_success and self.tile is not None

    async def async_press(self) -> None:
        """Handle the button press - refresh tile data."""
        _LOGGER.debug("Refreshing Tile: %s", self._tile_uuid)
        await self.coordinator.async_request_refresh()
        self._last_refreshed = datetime.now(timezone.utc)
        self.async_write_ha_state()


class TileProgramRingtoneButton(CoordinatorEntity, ButtonEntity):
    """Button to program a custom ringtone to a Tile."""

    _attr_has_entity_name = True
    _attr_icon = "mdi:music-note-plus"
    _attr_entity_category = EntityCategory.CONFIG

    def __init__(
        self,
        hass: HomeAssistant,
        coordinator,
        tile_uuid: str,
        entity_enabled: bool = True,
    ) -> None:
        """Initialize the program ringtone button."""
        super().__init__(coordinator)
        self._hass = hass
        self._tile_uuid = tile_uuid
        self._attr_unique_id = f"tile_{tile_uuid}_program_ringtone"
        self._attr_name = "Program Ringtone"
        # Disabled by default if entity_enabled is False, otherwise disabled as advanced feature
        self._attr_entity_registry_enabled_default = entity_enabled and False
        self._last_programmed: datetime | None = None

    @property
    def tile(self) -> TileDevice | None:
        """Return the tile device data."""
        if self.coordinator.data:
            return self.coordinator.data.get(self._tile_uuid)
        return None

    @property
    def extra_state_attributes(self):
        """Return extra state attributes."""
        attrs = {}
        if self._last_programmed:
            attrs["last_programmed"] = self._last_programmed.isoformat()
        return attrs

    @property
    def device_info(self):
        """Return device info."""
        if not self.tile:
            return None
        return {
            "identifiers": {(DOMAIN, self.tile.tile_uuid)},
            "name": self.tile.name,
            "manufacturer": "Tile",
            "model": self.tile.tile_type or "Tile Tracker",
            "sw_version": self.tile.firmware_version,
            "hw_version": self.tile.hardware_version,
        }

    @property
    def available(self) -> bool:
        """Return True if entity is available."""
        tile = self.tile
        return (
            self.coordinator.last_update_success
            and tile is not None
            and bool(tile.auth_key)
        )

    async def async_press(self) -> None:
        """Handle the button press - program Bionic Birdie ringtone."""
        tile = self.tile
        if not tile:
            _LOGGER.error("Tile not found: %s", self._tile_uuid)
            return
        
        _LOGGER.info("Programming Bionic Birdie ringtone to Tile: %s", tile.name)
        
        tile_service = get_tile_service(self._hass)
        success = await tile_service.program_bionic_birdie(tile)
        
        if success:
            self._last_programmed = datetime.now(timezone.utc)
            self.async_write_ha_state()
            _LOGGER.info("Successfully programmed ringtone to %s", tile.name)
        else:
            _LOGGER.warning("Failed to program ringtone to Tile %s", tile.name)
