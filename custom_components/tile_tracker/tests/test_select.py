"""Tests for Tile Tracker select entities."""
import pytest
from unittest.mock import Mock, AsyncMock, patch

from custom_components.tile_tracker.select import (
    TileSongSelect,
    TileDefaultVolumeSelect,
    VOLUME_OPTIONS,
    DEFAULT_VOLUME,
)
from custom_components.tile_tracker.tile_api import TileDevice
from custom_components.tile_tracker.const import DEFAULT_SONGS


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
        available_songs=DEFAULT_SONGS,
        selected_song_id=0,
    )


def test_song_select_initialization(mock_coordinator, mock_tile):
    """Test song select entity initialization."""
    entity = TileSongSelect(mock_coordinator, mock_tile)
    
    assert entity._attr_unique_id == f"{mock_tile.tile_uuid}_song"
    assert len(entity.options) == len(DEFAULT_SONGS)
    assert entity.current_option == DEFAULT_SONGS[0]["name"]


@pytest.mark.asyncio
async def test_select_song_option(mock_coordinator, mock_tile):
    """Test selecting a song option."""
    entity = TileSongSelect(mock_coordinator, mock_tile)
    
    # Select second song
    song_name = DEFAULT_SONGS[1]["name"]
    await entity.async_select_option(song_name)
    
    assert entity._tile.selected_song_id == DEFAULT_SONGS[1]["id"]


@pytest.mark.asyncio
async def test_select_invalid_song(mock_coordinator, mock_tile):
    """Test selecting an invalid song option."""
    entity = TileSongSelect(mock_coordinator, mock_tile)
    
    original_id = entity._tile.selected_song_id
    
    # Try to select non-existent song
    await entity.async_select_option("NonExistent Song")
    
    # Should remain unchanged
    assert entity._tile.selected_song_id == original_id


def test_volume_select_initialization(mock_coordinator, mock_tile):
    """Test default volume select entity initialization."""
    entity = TileDefaultVolumeSelect(mock_coordinator, mock_tile)
    
    assert entity._attr_unique_id == f"{mock_tile.tile_uuid}_default_volume"
    assert entity._current_volume == DEFAULT_VOLUME
    assert entity.options == VOLUME_OPTIONS
    assert entity.current_option == DEFAULT_VOLUME


@pytest.mark.asyncio
async def test_select_volume_option(mock_coordinator, mock_tile):
    """Test selecting a volume option."""
    entity = TileDefaultVolumeSelect(mock_coordinator, mock_tile)
    
    # Test each volume option
    for volume in VOLUME_OPTIONS:
        await entity.async_select_option(volume)
        assert entity._current_volume == volume
        assert entity.current_option == volume


@pytest.mark.asyncio
async def test_restore_volume(mock_coordinator, mock_tile):
    """Test restoring volume on startup."""
    entity = TileDefaultVolumeSelect(mock_coordinator, mock_tile)
    
    # Mock last state
    last_state = Mock()
    last_state.state = "high"
    
    with patch.object(entity, 'async_get_last_state', return_value=last_state):
        await entity.async_added_to_hass()
    
    assert entity._current_volume == "high"


@pytest.mark.asyncio
async def test_restore_invalid_volume_uses_default(mock_coordinator, mock_tile):
    """Test that invalid restored volume falls back to default."""
    entity = TileDefaultVolumeSelect(mock_coordinator, mock_tile)
    
    # Mock last state with invalid value
    last_state = Mock()
    last_state.state = "invalid"
    
    with patch.object(entity, 'async_get_last_state', return_value=last_state):
        await entity.async_added_to_hass()
    
    assert entity._current_volume == DEFAULT_VOLUME


def test_volume_extra_state_attributes(mock_coordinator, mock_tile):
    """Test extra state attributes."""
    entity = TileDefaultVolumeSelect(mock_coordinator, mock_tile)
    
    attrs = entity.extra_state_attributes
    assert attrs["tile_uuid"] == mock_tile.tile_uuid


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
