"""WebSocket API for Tile Tracker.

Provides WebSocket commands for the frontend to interact with
song storage and other real-time features.
"""
from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN
from .song_storage import get_song_storage, async_setup_song_storage

_LOGGER = logging.getLogger(__name__)


async def async_setup_websocket_api(hass: HomeAssistant) -> None:
    """Set up the WebSocket API."""
    # Ensure song storage is loaded
    await async_setup_song_storage(hass)
    
    # Register commands
    websocket_api.async_register_command(hass, ws_get_songs)
    websocket_api.async_register_command(hass, ws_save_song)
    websocket_api.async_register_command(hass, ws_delete_song)


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/songs/list",
    }
)
@websocket_api.async_response
async def ws_get_songs(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Get all saved songs."""
    storage = get_song_storage(hass)
    
    if not storage.loaded:
        await storage.load()
    
    songs = storage.get_all_songs()
    
    connection.send_result(
        msg["id"],
        {"songs": songs},
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/songs/save",
        vol.Required("name"): str,
        vol.Required("notation"): str,
        vol.Optional("song_id"): str,
    }
)
@websocket_api.async_response
async def ws_save_song(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Save a song."""
    storage = get_song_storage(hass)
    
    if not storage.loaded:
        await storage.load()
    
    # Get user ID from connection if available
    user_id = None
    if connection.user:
        user_id = connection.user.id
    
    song = await storage.save_song(
        name=msg["name"],
        notation=msg["notation"],
        song_id=msg.get("song_id"),
        created_by=user_id,
    )
    
    _LOGGER.info(
        "Saved song '%s' (id=%s) with %d chars of notation",
        song.name,
        song.id,
        len(song.notation),
    )
    
    connection.send_result(
        msg["id"],
        {"song": song.as_dict()},
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/songs/delete",
        vol.Required("song_id"): str,
    }
)
@websocket_api.async_response
async def ws_delete_song(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Delete a song."""
    storage = get_song_storage(hass)
    
    if not storage.loaded:
        await storage.load()
    
    success = await storage.delete_song(msg["song_id"])
    
    if success:
        _LOGGER.info("Deleted song %s", msg["song_id"])
    
    connection.send_result(
        msg["id"],
        {"success": success},
    )
