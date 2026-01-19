"""Number platform for Tile Tracker integration.

Provides configurable number entities for each Tile device's settings.

Copyright (c) 2024-2026 Jeff Hamm <jeff.hamm@gmail.com>
Developed with assistance from Claude (Anthropic)

SPDX-License-Identifier: MIT
"""
from __future__ import annotations

import logging
from typing import Any

from homeassistant.components.number import (
    NumberEntity,
    NumberMode,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import UnitOfTime
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.restore_state import RestoreEntity
from homeassistant.helpers.update_coordinator import (
    CoordinatorEntity,
    DataUpdateCoordinator,
)

from .const import DOMAIN
from .tile_api import TileDevice

_LOGGER = logging.getLogger(__name__)

# Default values
DEFAULT_DURATION = 5
MIN_DURATION = 1
MAX_DURATION = 30


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up Tile Tracker number entities."""
    coordinator = hass.data[DOMAIN][entry.entry_id]["coordinator"]
    
    entities = []
    for tile in coordinator.data.values():
        entities.append(TileDefaultDurationNumber(coordinator, tile))
    
    async_add_entities(entities)


class TileDefaultDurationNumber(CoordinatorEntity, NumberEntity, RestoreEntity):
    """Number entity for configuring default ring duration for a Tile."""

    _attr_has_entity_name = True
    _attr_translation_key = "default_duration"
    _attr_native_min_value = MIN_DURATION
    _attr_native_max_value = MAX_DURATION
    _attr_native_step = 1
    _attr_native_unit_of_measurement = UnitOfTime.SECONDS
    _attr_mode = NumberMode.SLIDER
    _attr_icon = "mdi:timer-outline"

    def __init__(
        self,
        coordinator: DataUpdateCoordinator,
        tile: TileDevice,
    ) -> None:
        """Initialize the duration number entity."""
        super().__init__(coordinator)
        self._tile = tile
        self._attr_unique_id = f"{tile.tile_uuid}_default_duration"
        self._attr_device_info = {
            "identifiers": {(DOMAIN, tile.tile_uuid)},
            "name": tile.name,
            "manufacturer": "Tile",
            "model": tile.tile_type or "Unknown",
        }
        self._attr_native_value = DEFAULT_DURATION

    async def async_added_to_hass(self) -> None:
        """Restore previous value on startup."""
        await super().async_added_to_hass()
        if (last_state := await self.async_get_last_state()) is not None:
            try:
                self._attr_native_value = float(last_state.state)
            except (ValueError, TypeError):
                self._attr_native_value = DEFAULT_DURATION

    async def async_set_native_value(self, value: float) -> None:
        """Set the duration value."""
        self._attr_native_value = value
        self.async_write_ha_state()
        _LOGGER.debug(
            "Set default duration for Tile %s to %d seconds",
            self._tile.name,
            int(value),
        )

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return extra state attributes."""
        return {
            "tile_uuid": self._tile.tile_uuid,
        }
