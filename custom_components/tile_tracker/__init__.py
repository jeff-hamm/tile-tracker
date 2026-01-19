"""Tile Tracker integration for Home Assistant.

Copyright (c) 2024-2026 Jeff Hamm <jeff.hamm@gmail.com>
Developed with assistance from Claude (Anthropic)

SPDX-License-Identifier: MIT
"""
from __future__ import annotations

import asyncio
from datetime import timedelta, datetime, timezone
import logging
import os
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import (
    CONF_EMAIL,
    CONF_PASSWORD,
    Platform,
)
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.components.http import StaticPathConfig
from homeassistant.exceptions import ConfigEntryAuthFailed, ConfigEntryNotReady
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers.update_coordinator import (
    CoordinatorEntity,
    DataUpdateCoordinator,
    UpdateFailed,
)
import voluptuous as vol


from .const import (
    DOMAIN,
    CONF_EMAIL,
    CONF_PASSWORD,
    CONF_SCAN_INTERVAL,
    DEFAULT_SCAN_INTERVAL,
    CONF_EXCLUDE_DAYS,
    DEFAULT_EXCLUDE_DAYS,
    CONF_EXCLUDE_INVISIBLE,
    DEFAULT_EXCLUDE_INVISIBLE,
    SERVICE_PLAY_SOUND,
    SERVICE_REFRESH_TILES,
    SERVICE_SCAN_TILES,
    SERVICE_CLEAR_CACHE,
    SERVICE_SET_LOST,
    SERVICE_PROGRAM_SONG,
    SERVICE_COMPOSE_SONG,
    SERVICE_PLAY_PRESET_SONG,
    ATTR_TILE_ID,
    ATTR_VOLUME,
    ATTR_DURATION,
    ATTR_SONG_ID,
    ATTR_LOST,
    ATTR_NOTATION,
    ATTR_SONG_NAME,
    ATTR_PRESET,
    PRESET_SONGS,
)
from .tile_api import TileApiClient, TileDevice, TileAuthError
from .tile_service import get_tile_service, async_cleanup_services
from .websocket_api import async_setup_websocket_api

_LOGGER = logging.getLogger(__name__)

PLATFORMS: list[Platform] = [
    Platform.DEVICE_TRACKER,
    Platform.BUTTON,
    Platform.SELECT,
    Platform.NUMBER,
    Platform.BINARY_SENSOR,
    Platform.SENSOR,
    Platform.SWITCH,
]

# Service schemas
SERVICE_PLAY_SOUND_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_TILE_ID): str,
        vol.Optional(ATTR_VOLUME, default="medium"): vol.In(["low", "medium", "high"]),
        vol.Optional(ATTR_DURATION, default=5): vol.All(
            vol.Coerce(int), vol.Range(min=1, max=30)
        ),
        vol.Optional(ATTR_SONG_ID): vol.All(
            vol.Coerce(int), vol.Range(min=0, max=20)
        ),
    }
)

SERVICE_SET_LOST_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_TILE_ID): str,
        vol.Required(ATTR_LOST): bool,
    }
)

SERVICE_PROGRAM_SONG_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_TILE_ID): str,
    }
)

SERVICE_COMPOSE_SONG_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_TILE_ID): str,
        vol.Required(ATTR_NOTATION): str,  # e.g., "C4:1/8 | D4:1/8 | E4:1/4"
        vol.Optional(ATTR_SONG_NAME, default="Custom Song"): str,
    }
)

SERVICE_PLAY_PRESET_SONG_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_TILE_ID): str,
        vol.Required(ATTR_PRESET): vol.In(PRESET_SONGS),
    }
)


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Tile Tracker from a config entry."""
    hass.data.setdefault(DOMAIN, {})
    
    email = entry.data[CONF_EMAIL]
    password = entry.data[CONF_PASSWORD]
    scan_interval = entry.options.get(CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL)
    exclude_days = entry.options.get(CONF_EXCLUDE_DAYS, DEFAULT_EXCLUDE_DAYS)
    exclude_invisible = entry.options.get(CONF_EXCLUDE_INVISIBLE, DEFAULT_EXCLUDE_INVISIBLE)
    
    # Create API client
    api = TileApiClient(email, password)
    
    # Test authentication
    try:
        await api.login()
    except TileAuthError as err:
        raise ConfigEntryAuthFailed(f"Authentication failed: {err}") from err
    except Exception as err:
        raise ConfigEntryNotReady(f"Unable to connect to Tile: {err}") from err
    
    # Create update coordinator
    coordinator = TileDataUpdateCoordinator(
        hass,
        api,
        update_interval=timedelta(minutes=scan_interval),
        exclude_days=exclude_days,
        exclude_invisible=exclude_invisible,
    )
    
    # Fetch initial data
    await coordinator.async_config_entry_first_refresh()
    
    # Store coordinator
    hass.data[DOMAIN][entry.entry_id] = {
        "coordinator": coordinator,
        "api": api,
    }
    
    # Set up platforms
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    
    # Register services
    await _async_setup_services(hass)
    
    # Register WebSocket API for frontend
    await async_setup_websocket_api(hass)
    
    # Register frontend card
    await _async_register_frontend(hass)
    
    # Handle options updates
    entry.async_on_unload(entry.add_update_listener(_async_update_options))
    
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    
    if unload_ok:
        # Close API session
        data = hass.data[DOMAIN].pop(entry.entry_id)
        await data["api"].close()
    
    # Remove services if no more entries
    if not hass.data[DOMAIN]:
        _async_remove_services(hass)
    
    return unload_ok


async def _async_update_options(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Update options."""
    await hass.config_entries.async_reload(entry.entry_id)


# Frontend card URL path
CARD_URL_PATH = f"/{DOMAIN}/tile-tracker-card.js"


async def _async_register_frontend(hass: HomeAssistant) -> None:
    """Register the frontend card as a static resource."""
    # Get the path to the card JS file
    card_path = os.path.join(
        os.path.dirname(__file__),
        "www",
        "tile-tracker-card.js"
    )
    
    if not os.path.exists(card_path):
        _LOGGER.warning(
            "Frontend card not found at %s. Card will not be auto-registered.",
            card_path
        )
        return
    
    # Register static path for the JS file
    try:
        await hass.http.async_register_static_paths(
            [StaticPathConfig(CARD_URL_PATH, card_path, cache_headers=False)]
        )
        _LOGGER.info(
            "✓ Tile Tracker card available at: %s\n"
            "  Add to Lovelace resources:\n"
            "  URL: %s\n"
            "  Type: JavaScript Module",
            CARD_URL_PATH,
            CARD_URL_PATH
        )
    except Exception as err:
        _LOGGER.warning("Static path registration failed: %s", err)


async def _async_setup_services(hass: HomeAssistant) -> None:
    """Set up Tile Tracker services."""
    
    async def handle_play_sound(call: ServiceCall) -> None:
        """Handle play_sound service call."""
        tile_id = call.data[ATTR_TILE_ID]
        volume = call.data.get(ATTR_VOLUME, "medium")
        duration = call.data.get(ATTR_DURATION, 5)
        song_id = call.data.get(ATTR_SONG_ID)  # None = use tile's selected song
        
        _LOGGER.info(
            "Playing sound on Tile %s with volume %s for %d seconds (song=%s)",
            tile_id,
            volume,
            duration,
            song_id,
        )
        
        # Get the tile service (uses caching)
        tile_service = get_tile_service(hass)
        
        # Find the tile in coordinator cache
        tile = tile_service.get_tile_from_coordinator(tile_id)
        
        if not tile:
            _LOGGER.error("Tile not found: %s", tile_id)
            return
        
        # Ring the tile (service handles BLE scanning, caching, and auth)
        success = await tile_service.ring_tile(
            tile=tile,
            volume=volume,
            duration=duration,
            song_id=song_id,
        )
        
        if not success:
            _LOGGER.warning("Failed to play sound on Tile %s", tile.name)
    
    async def handle_refresh_tiles(call: ServiceCall) -> None:
        """Handle refresh_tiles service call."""
        _LOGGER.debug("Refreshing all Tiles")
        
        for entry_id, data in hass.data[DOMAIN].items():
            if not isinstance(data, dict):
                continue
            coordinator = data.get("coordinator")
            if coordinator:
                await coordinator.async_request_refresh()
    
    async def handle_scan_tiles(call: ServiceCall) -> None:
        """Handle scan_tiles service call."""
        timeout = call.data.get("timeout", 10.0)
        force_refresh = call.data.get("force_refresh", False)
        
        _LOGGER.info("Scanning for Tiles (timeout=%s, force=%s)", timeout, force_refresh)
        
        tile_service = get_tile_service(hass)
        tiles = await tile_service.scan_for_tiles(
            timeout=timeout,
            force_refresh=force_refresh,
        )
        
        _LOGGER.info("Found %d Tile(s) via BLE", len(tiles))
        
        # Return results (will be in service response)
        return {
            "found": len(tiles),
            "tiles": [
                {
                    "address": device.address,
                    "name": device.name or "Unknown",
                    "rssi": adv_data.rssi if adv_data else -100,
                }
                for device, adv_data in tiles
            ],
        }
    
    async def handle_clear_cache(call: ServiceCall) -> None:
        """Handle clear_cache service call."""
        _LOGGER.info("Clearing Tile BLE cache")
        tile_service = get_tile_service(hass)
        tile_service.clear_cache()
    
    # Service schemas for new services
    scan_tiles_schema = vol.Schema({
        vol.Optional("timeout", default=10.0): vol.Coerce(float),
        vol.Optional("force_refresh", default=False): bool,
    })
    
    # Only register if not already registered
    if not hass.services.has_service(DOMAIN, SERVICE_PLAY_SOUND):
        hass.services.async_register(
            DOMAIN,
            SERVICE_PLAY_SOUND,
            handle_play_sound,
            schema=SERVICE_PLAY_SOUND_SCHEMA,
        )
    
    if not hass.services.has_service(DOMAIN, SERVICE_REFRESH_TILES):
        hass.services.async_register(
            DOMAIN,
            SERVICE_REFRESH_TILES,
            handle_refresh_tiles,
        )
    
    if not hass.services.has_service(DOMAIN, SERVICE_SCAN_TILES):
        hass.services.async_register(
            DOMAIN,
            SERVICE_SCAN_TILES,
            handle_scan_tiles,
            schema=scan_tiles_schema,
        )
    
    if not hass.services.has_service(DOMAIN, SERVICE_CLEAR_CACHE):
        hass.services.async_register(
            DOMAIN,
            SERVICE_CLEAR_CACHE,
            handle_clear_cache,
        )
    
    async def handle_set_lost(call: ServiceCall) -> None:
        """Handle set_lost service call."""
        tile_id = call.data[ATTR_TILE_ID]
        lost = call.data[ATTR_LOST]
        
        _LOGGER.info("Setting lost=%s for Tile %s", lost, tile_id)
        
        # Find the tile and API client
        tile_service = get_tile_service(hass)
        tile = tile_service.get_tile_from_coordinator(tile_id)
        
        if not tile:
            _LOGGER.error("Tile not found: %s", tile_id)
            return
        
        # Get API client from entry data
        for entry_id, data in hass.data[DOMAIN].items():
            if not isinstance(data, dict):
                continue
            api = data.get("api")
            if api:
                success = await api.set_lost(tile.tile_uuid, lost)
                if success:
                    # Refresh to get updated state
                    coordinator = data.get("coordinator")
                    if coordinator:
                        await coordinator.async_request_refresh()
                    return
        
        _LOGGER.error("Could not find API client for tile %s", tile_id)
    
    if not hass.services.has_service(DOMAIN, SERVICE_SET_LOST):
        hass.services.async_register(
            DOMAIN,
            SERVICE_SET_LOST,
            handle_set_lost,
            schema=SERVICE_SET_LOST_SCHEMA,
        )

    # Program song service (Bionic Birdie)
    async def handle_program_song(call: ServiceCall) -> None:
        """Handle the program_song service call."""
        tile_id = call.data[ATTR_TILE_ID]
        
        tile_service = get_tile_service(hass)
        tile = tile_service.get_tile_from_coordinator(tile_id)
        
        if not tile:
            _LOGGER.error("Tile not found: %s", tile_id)
            return
        
        success = await tile_service.program_bionic_birdie(tile)
        
        if not success:
            _LOGGER.error("Failed to program song to tile %s", tile_id)
    
    if not hass.services.has_service(DOMAIN, SERVICE_PROGRAM_SONG):
        hass.services.async_register(
            DOMAIN,
            SERVICE_PROGRAM_SONG,
            handle_program_song,
            schema=SERVICE_PROGRAM_SONG_SCHEMA,
        )

    # Compose song service - program a custom song from notation
    async def handle_compose_song(call: ServiceCall) -> None:
        """Handle the compose_song service call."""
        from .song_composer import Song
        
        tile_id = call.data[ATTR_TILE_ID]
        notation = call.data[ATTR_NOTATION]
        song_name = call.data.get(ATTR_SONG_NAME, "Custom Song")
        
        tile_service = get_tile_service(hass)
        tile = tile_service.get_tile_from_coordinator(tile_id)
        
        if not tile:
            _LOGGER.error("Tile not found: %s", tile_id)
            return
        
        try:
            song = Song.from_notation(notation, name=song_name)
            _LOGGER.info(
                "Programming custom song '%s' (%d notes) to tile %s",
                song_name,
                len(song.notes),
                tile_id,
            )
            
            success = await tile_service.program_custom_song(tile, song)
            
            if not success:
                _LOGGER.error("Failed to program song to tile %s", tile_id)
        except Exception as err:
            _LOGGER.error("Failed to parse notation: %s", err)

    if not hass.services.has_service(DOMAIN, SERVICE_COMPOSE_SONG):
        hass.services.async_register(
            DOMAIN,
            SERVICE_COMPOSE_SONG,
            handle_compose_song,
            schema=SERVICE_COMPOSE_SONG_SCHEMA,
        )

    # Play preset song service
    async def handle_play_preset_song(call: ServiceCall) -> None:
        """Handle the play_preset_song service call."""
        from .song_composer import PresetSongs
        
        tile_id = call.data[ATTR_TILE_ID]
        preset = call.data[ATTR_PRESET]
        
        tile_service = get_tile_service(hass)
        tile = tile_service.get_tile_from_coordinator(tile_id)
        
        if not tile:
            _LOGGER.error("Tile not found: %s", tile_id)
            return
        
        # Get the preset song
        preset_method = getattr(PresetSongs, preset, None)
        if not preset_method:
            _LOGGER.error("Unknown preset song: %s", preset)
            return
        
        song = preset_method()
        _LOGGER.info(
            "Programming preset song '%s' (%d notes) to tile %s",
            song.name,
            len(song.notes),
            tile_id,
        )
        
        success = await tile_service.program_custom_song(tile, song)
        
        if not success:
            _LOGGER.error("Failed to program preset song to tile %s", tile_id)

    if not hass.services.has_service(DOMAIN, SERVICE_PLAY_PRESET_SONG):
        hass.services.async_register(
            DOMAIN,
            SERVICE_PLAY_PRESET_SONG,
            handle_play_preset_song,
            schema=SERVICE_PLAY_PRESET_SONG_SCHEMA,
        )


def _async_remove_services(hass: HomeAssistant) -> None:
    """Remove Tile Tracker services."""
    hass.services.async_remove(DOMAIN, SERVICE_PLAY_SOUND)
    hass.services.async_remove(DOMAIN, SERVICE_REFRESH_TILES)
    hass.services.async_remove(DOMAIN, SERVICE_SCAN_TILES)
    hass.services.async_remove(DOMAIN, SERVICE_CLEAR_CACHE)
    hass.services.async_remove(DOMAIN, SERVICE_SET_LOST)
    hass.services.async_remove(DOMAIN, SERVICE_PROGRAM_SONG)
    hass.services.async_remove(DOMAIN, SERVICE_COMPOSE_SONG)
    hass.services.async_remove(DOMAIN, SERVICE_PLAY_PRESET_SONG)
    # Cleanup tile service instance
    asyncio.create_task(async_cleanup_services(hass))


class TileDataUpdateCoordinator(DataUpdateCoordinator[dict[str, TileDevice]]):
    """Tile data update coordinator."""

    def __init__(
        self,
        hass: HomeAssistant,
        api: TileApiClient,
        update_interval: timedelta,
        exclude_days: int = DEFAULT_EXCLUDE_DAYS,
        exclude_invisible: bool = DEFAULT_EXCLUDE_INVISIBLE,
    ) -> None:
        """Initialize the coordinator."""
        super().__init__(
            hass,
            _LOGGER,
            name=DOMAIN,
            update_interval=update_interval,
        )
        self.api = api
        self.exclude_days = exclude_days
        self.exclude_invisible = exclude_invisible

    def should_disable_tile(self, tile: TileDevice) -> bool:
        """Determine if a tile should be disabled based on configuration.
        
        Args:
            tile: The tile device to check
            
        Returns:
            True if the tile should be created but disabled, False if enabled
        """
        # Check if invisible tiles should be disabled
        if self.exclude_invisible and not tile.visible:
            _LOGGER.debug(
                "Tile %s (%s) will be disabled: visible=False",
                tile.name,
                tile.tile_uuid,
            )
            return True
        
        # Check if old tiles should be disabled
        if self.exclude_days > 0 and tile.last_timestamp:
            now = datetime.now(timezone.utc)
            age_days = (now - tile.last_timestamp).days
            if age_days > self.exclude_days:
                _LOGGER.debug(
                    "Tile %s (%s) will be disabled: %d days old (threshold: %d)",
                    tile.name,
                    tile.tile_uuid,
                    age_days,
                    self.exclude_days,
                )
                return True
        
        return False

    async def _async_update_data(self) -> dict[str, TileDevice]:
        """Fetch data from Tile API."""
        try:
            # Re-login if needed
            if not self.api.is_logged_in:
                await self.api.login()
            
            tiles = await self.api.get_tiles()
            
            # Also get latest states
            if tiles:
                await self.api.get_tile_states()
            
            # Return as dict keyed by tile_uuid
            return {tile.tile_uuid: tile for tile in tiles}
            
        except TileAuthError as err:
            # Trigger reauth flow
            raise ConfigEntryAuthFailed(str(err)) from err
        except Exception as err:
            raise UpdateFailed(f"Error fetching Tile data: {err}") from err
