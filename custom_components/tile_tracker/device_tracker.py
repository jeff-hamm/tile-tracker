"""Device tracker platform for Tile Tracker.

Copyright (c) 2024-2026 Jeff Hamm <jeff.hamm@gmail.com>
Developed with assistance from Claude (Anthropic)

SPDX-License-Identifier: MIT
"""
from __future__ import annotations

import logging
from typing import Any

from homeassistant.components.device_tracker import SourceType
from homeassistant.components.device_tracker.config_entry import TrackerEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import (
    DOMAIN,
    ATTR_ADVERTISED_RSSI,
    ATTR_SPEED,
    ATTR_RING_STATE,
    ATTR_TILE_TYPE,
    ATTR_LAST_TILE_STATE,
    ATTR_TILE_ID,
    ATTR_LAST_TIMESTAMP,
    ATTR_LOST,
    ATTR_VOLUME,
    ATTR_DURATION,
    ATTR_SONG_NAME,
    ATTR_BATTERY_STATUS,
)
from .tile_api import TileDevice

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up Tile device trackers based on a config entry."""
    coordinator = hass.data[DOMAIN][entry.entry_id]["coordinator"]
    
    # Add entities for all tiles
    entities = [
        TileDeviceTracker(coordinator, tile_uuid)
        for tile_uuid in coordinator.data.keys()
    ]
    
    async_add_entities(entities)
    
    # Listen for new tiles
    @callback
    def async_check_new_tiles() -> None:
        """Check for new tiles and add them."""
        existing_uuids = {
            entity.tile_uuid
            for entity in hass.data[DOMAIN].get("entities", [])
        }
        
        new_entities = [
            TileDeviceTracker(coordinator, tile_uuid)
            for tile_uuid in coordinator.data.keys()
            if tile_uuid not in existing_uuids
        ]
        
        if new_entities:
            async_add_entities(new_entities)
    
    # Store reference for future updates
    entry.async_on_unload(
        coordinator.async_add_listener(async_check_new_tiles)
    )


class TileDeviceTracker(CoordinatorEntity, TrackerEntity):
    """Representation of a Tile device tracker."""

    _attr_has_entity_name = True

    def __init__(
        self,
        coordinator,
        tile_uuid: str,
    ) -> None:
        """Initialize the Tile device tracker."""
        super().__init__(coordinator)
        self._tile_uuid = tile_uuid
        self._attr_unique_id = f"tile_{tile_uuid}"
        
        # Initial tile data
        tile = self.tile
        if tile:
            self._attr_name = tile.name

    @property
    def tile_uuid(self) -> str:
        """Return the Tile UUID."""
        return self._tile_uuid

    @property
    def tile(self) -> TileDevice | None:
        """Return the tile device data."""
        if self.coordinator.data:
            return self.coordinator.data.get(self._tile_uuid)
        return None

    @property
    def source_type(self) -> SourceType:
        """Return the source type."""
        return SourceType.BLUETOOTH_LE

    @property
    def latitude(self) -> float | None:
        """Return latitude value of the device."""
        if self.tile and self.tile.latitude:
            return self.tile.latitude
        return None

    @property
    def longitude(self) -> float | None:
        """Return longitude value of the device."""
        if self.tile and self.tile.longitude:
            return self.tile.longitude
        return None

    @property
    def location_accuracy(self) -> int:
        """Return the location accuracy."""
        # Tile doesn't provide accuracy, estimate based on RSSI
        if self.tile and self.tile.advertised_rssi:
            rssi = self.tile.advertised_rssi
            # Better signal = better accuracy (rough estimate)
            if rssi > -60:
                return 5
            elif rssi > -70:
                return 10
            elif rssi > -80:
                return 20
            else:
                return 50
        return 100

    @property
    def battery_level(self) -> int | None:
        """Return the battery level of the device."""
        # Tile API doesn't expose battery level directly
        # Could be added if the API provides it
        return None

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return extra state attributes."""
        attrs = {}
        
        if self.tile:
            # Tile ID is required for ring/service calls
            attrs[ATTR_TILE_ID] = self.tile.tile_uuid
            
            # Last seen timestamp
            if self.tile.last_timestamp is not None:
                attrs[ATTR_LAST_TIMESTAMP] = self.tile.last_timestamp.isoformat()
            
            # Signal strength (RSSI)
            if self.tile.advertised_rssi is not None:
                attrs[ATTR_ADVERTISED_RSSI] = self.tile.advertised_rssi
            
            # Speed
            if self.tile.speed is not None:
                attrs[ATTR_SPEED] = self.tile.speed
            
            # Ring state
            if self.tile.ring_state is not None:
                attrs[ATTR_RING_STATE] = self.tile.ring_state
            
            # Battery status (string like "FULL", "OK", "LOW")
            if self.tile.battery_status is not None:
                attrs[ATTR_BATTERY_STATUS] = self.tile.battery_status
            
            # Lost status
            attrs[ATTR_LOST] = self.tile.lost
            
            # Tile type and state
            attrs[ATTR_TILE_TYPE] = self.tile.tile_type
            attrs[ATTR_LAST_TILE_STATE] = self.tile.last_tile_state
            
            # Default settings from related entities
            # These are looked up from the hass state to get current values
            hass = self.hass
            tile_uuid = self.tile.tile_uuid
            
            # Get default volume from select entity
            volume_entity_id = f"select.{self._get_entity_slug()}_default_volume"
            if volume_state := hass.states.get(volume_entity_id):
                attrs[ATTR_VOLUME] = volume_state.state
            
            # Get default duration from number entity  
            duration_entity_id = f"number.{self._get_entity_slug()}_default_duration"
            if duration_state := hass.states.get(duration_entity_id):
                try:
                    attrs[ATTR_DURATION] = int(float(duration_state.state))
                except (ValueError, TypeError):
                    pass
            
            # Get default song from select entity
            song_entity_id = f"select.{self._get_entity_slug()}_song"
            if song_state := hass.states.get(song_entity_id):
                attrs[ATTR_SONG_NAME] = song_state.state
        
        return attrs

    def _get_entity_slug(self) -> str:
        """Get the entity slug for related entities."""
        # Convert tile name to entity-friendly format
        if self.tile and self.tile.name:
            return self.tile.name.lower().replace(" ", "_").replace("-", "_")
        return self._tile_uuid

    @property
    def device_info(self):
        """Return device info."""
        if not self.tile:
            return None
        
        tile_type = self.tile.tile_type
        model = f"Tile - {tile_type}" if tile_type else "Tile"
        info = {
            "identifiers": {(DOMAIN, self.tile.tile_uuid)},
            "name": self.tile.name,
            "manufacturer": "Tile",
            "model": model,
        }
        
        # Add firmware/hardware versions if available
        if self.tile.firmware_version:
            info["sw_version"] = self.tile.firmware_version
        if self.tile.hardware_version:
            info["hw_version"] = self.tile.hardware_version
        
        # Add serial number (using MAC address)
        if self.tile.mac_address:
            info["serial_number"] = self.tile.mac_address
        
        return info

    @property
    def icon(self) -> str:
        """Return the icon."""
        tile = self.tile
        if not tile:
            return "mdi:bluetooth"
        
        # Use different icons based on tile type
        tile_type = (tile.tile_type or "").lower()
        
        if "slim" in tile_type:
            return "mdi:credit-card-outline"
        elif "sticker" in tile_type:
            return "mdi:sticker-circle-outline"
        elif "pro" in tile_type:
            return "mdi:map-marker-radius"
        elif "mate" in tile_type:
            return "mdi:map-marker"
        else:
            return "mdi:bluetooth"

    @property
    def available(self) -> bool:
        """Return True if entity is available."""
        return self.coordinator.last_update_success and self.tile is not None

    @callback
    def _handle_coordinator_update(self) -> None:
        """Handle updated data from the coordinator."""
        self.async_write_ha_state()
