"""Tests for Tile Tracker number entities."""
import pytest
from datetime import datetime
from unittest.mock import Mock, AsyncMock, patch

from custom_components.tile_tracker.number import (
    TileDefaultDurationNumber,
    DEFAULT_DURATION,
    MIN_DURATION,
    MAX_DURATION,
)
from custom_components.tile_tracker.tile_api import TileDevice


@pytest.fixture
def mock_coordinator():
    """Create a mock coordinator."""
    coordinator = Mock()
    coordinator.data = {}
    coordinator.last_update_success = True
    return coordinator


@pytest.fixture
def mock_tile():
    """Create a mock tile device."""
    return TileDevice(
        tile_uuid="test-uuid-123",
        name="Test Tile",
        auth_key="test-auth-key",
        archetype="TILE_SLIM",
        firmware_version="01.23.45.67",
        hardware_version="02.34",
        product="Tile Slim",
        visible=True,
        is_dead=False,
        expected_tdt_cmd_config="0x01",
    )


def test_default_duration_initialization(mock_coordinator, mock_tile):
    """Test default duration number entity initialization."""
    entity = TileDefaultDurationNumber(mock_coordinator, mock_tile)
    
    assert entity._attr_unique_id == f"{mock_tile.tile_uuid}_default_duration"
    assert entity._attr_native_value == DEFAULT_DURATION
    assert entity._attr_native_min_value == MIN_DURATION
    assert entity._attr_native_max_value == MAX_DURATION
    assert entity._attr_native_step == 1
    assert entity._attr_icon == "mdi:timer-outline"


@pytest.mark.asyncio
async def test_set_duration_value(mock_coordinator, mock_tile):
    """Test setting duration value."""
    entity = TileDefaultDurationNumber(mock_coordinator, mock_tile)
    
    # Set to 10 seconds
    await entity.async_set_native_value(10)
    assert entity._attr_native_value == 10
    
    # Set to min value
    await entity.async_set_native_value(MIN_DURATION)
    assert entity._attr_native_value == MIN_DURATION
    
    # Set to max value
    await entity.async_set_native_value(MAX_DURATION)
    assert entity._attr_native_value == MAX_DURATION


@pytest.mark.asyncio
async def test_restore_previous_value(mock_coordinator, mock_tile):
    """Test restoring previous value on startup."""
    entity = TileDefaultDurationNumber(mock_coordinator, mock_tile)
    
    # Mock last state
    last_state = Mock()
    last_state.state = "15"
    
    with patch.object(entity, 'async_get_last_state', return_value=last_state):
        await entity.async_added_to_hass()
    
    assert entity._attr_native_value == 15.0


@pytest.mark.asyncio
async def test_restore_invalid_value_uses_default(mock_coordinator, mock_tile):
    """Test that invalid restored value falls back to default."""
    entity = TileDefaultDurationNumber(mock_coordinator, mock_tile)
    
    # Mock last state with invalid value
    last_state = Mock()
    last_state.state = "invalid"
    
    with patch.object(entity, 'async_get_last_state', return_value=last_state):
        await entity.async_added_to_hass()
    
    assert entity._attr_native_value == DEFAULT_DURATION


def test_extra_state_attributes(mock_coordinator, mock_tile):
    """Test extra state attributes."""
    entity = TileDefaultDurationNumber(mock_coordinator, mock_tile)
    
    attrs = entity.extra_state_attributes
    assert attrs["tile_uuid"] == mock_tile.tile_uuid


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
