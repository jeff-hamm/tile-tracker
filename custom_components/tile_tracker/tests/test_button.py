"""Tests for Tile Tracker button entities."""
import pytest
from datetime import datetime, timezone
from unittest.mock import Mock, AsyncMock, patch

from custom_components.tile_tracker.button import (
    TileLocateButton,
    TileRefreshDeviceButton,
    TileProgramRingtoneButton,
)
from custom_components.tile_tracker.tile_api import TileDevice


@pytest.fixture
def mock_hass():
    """Create a mock Home Assistant instance."""
    hass = Mock()
    hass.states = Mock()
    hass.states.get = Mock(return_value=None)
    return hass


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


def test_locate_button_initialization(mock_hass, mock_coordinator, mock_tile):
    """Test locate button initialization."""
    entity = TileLocateButton(mock_hass, mock_coordinator, mock_tile.tile_uuid)
    
    assert entity._tile_uuid == mock_tile.tile_uuid
    assert entity._attr_unique_id == f"tile_{mock_tile.tile_uuid}_locate"
    assert entity._attr_icon == "mdi:bell-ring"
    assert entity._last_located is None


def test_locate_button_available(mock_hass, mock_coordinator, mock_tile):
    """Test locate button availability."""
    mock_coordinator.data = {mock_tile.tile_uuid: mock_tile}
    entity = TileLocateButton(mock_hass, mock_coordinator, mock_tile.tile_uuid)
    
    # Should be available when coordinator has data and tile has auth key
    assert entity.available is True
    
    # Should be unavailable when no auth key
    mock_tile.auth_key = None
    assert entity.available is False


def test_make_entity_slug(mock_hass, mock_coordinator, mock_tile):
    """Test entity slug creation from tile name."""
    mock_coordinator.data = {mock_tile.tile_uuid: mock_tile}
    entity = TileLocateButton(mock_hass, mock_coordinator, mock_tile.tile_uuid)
    
    # Test with normal name
    mock_tile.name = "My Test Tile"
    slug = entity._make_entity_slug()
    assert slug == "tile_my_test_tile"
    
    # Test with special characters
    mock_tile.name = "Bob's Tile #1"
    slug = entity._make_entity_slug()
    assert slug == "tile_bob_s_tile_1"
    
    # Test with multiple spaces/hyphens
    mock_tile.name = "Test---Tile   Name"
    slug = entity._make_entity_slug()
    assert slug == "tile_test_tile_name"


def test_get_default_volume(mock_hass, mock_coordinator, mock_tile):
    """Test getting default volume from select entity."""
    mock_coordinator.data = {mock_tile.tile_uuid: mock_tile}
    entity = TileLocateButton(mock_hass, mock_coordinator, mock_tile.tile_uuid)
    
    # Mock the volume select state
    volume_state = Mock()
    volume_state.state = "high"
    mock_hass.states.get = Mock(return_value=volume_state)
    
    volume = entity._get_default_volume()
    assert volume == "high"
    
    # Test default when entity not found
    mock_hass.states.get = Mock(return_value=None)
    volume = entity._get_default_volume()
    assert volume == "medium"


def test_get_default_duration(mock_hass, mock_coordinator, mock_tile):
    """Test getting default duration from number entity."""
    mock_coordinator.data = {mock_tile.tile_uuid: mock_tile}
    entity = TileLocateButton(mock_hass, mock_coordinator, mock_tile.tile_uuid)
    
    # Mock the duration number state
    duration_state = Mock()
    duration_state.state = "10"
    mock_hass.states.get = Mock(return_value=duration_state)
    
    duration = entity._get_default_duration()
    assert duration == 10
    
    # Test default when entity not found
    mock_hass.states.get = Mock(return_value=None)
    duration = entity._get_default_duration()
    assert duration == 5


def test_get_default_song_id(mock_hass, mock_coordinator, mock_tile):
    """Test getting default song ID from select entity."""
    mock_coordinator.data = {mock_tile.tile_uuid: mock_tile}
    entity = TileLocateButton(mock_hass, mock_coordinator, mock_tile.tile_uuid)
    
    # Mock the song select state with attributes
    song_state = Mock()
    song_state.state = "Chirp"
    song_state.attributes = {"selected_song": 1}
    mock_hass.states.get = Mock(return_value=song_state)
    
    song_id = entity._get_default_song_id()
    assert song_id == 1
    
    # Test None when entity not found
    mock_hass.states.get = Mock(return_value=None)
    song_id = entity._get_default_song_id()
    assert song_id is None


@pytest.mark.asyncio
async def test_locate_button_press(mock_hass, mock_coordinator, mock_tile):
    """Test pressing the locate button."""
    mock_coordinator.data = {mock_tile.tile_uuid: mock_tile}
    entity = TileLocateButton(mock_hass, mock_coordinator, mock_tile.tile_uuid)
    
    # Mock tile service
    mock_tile_service = Mock()
    mock_tile_service.ring_tile = AsyncMock(return_value=True)
    
    with patch('custom_components.tile_tracker.button.get_tile_service', return_value=mock_tile_service):
        await entity.async_press()
    
    # Should have called ring_tile
    mock_tile_service.ring_tile.assert_called_once()
    
    # Should have updated last_located
    assert entity._last_located is not None
    assert isinstance(entity._last_located, datetime)


def test_refresh_button_initialization(mock_coordinator, mock_tile):
    """Test refresh button initialization."""
    entity = TileRefreshDeviceButton(mock_coordinator, mock_tile.tile_uuid)
    
    assert entity._tile_uuid == mock_tile.tile_uuid
    assert entity._attr_unique_id == f"tile_{mock_tile.tile_uuid}_refresh"
    assert entity._attr_icon == "mdi:refresh"


@pytest.mark.asyncio
async def test_refresh_button_press(mock_coordinator, mock_tile):
    """Test pressing the refresh button."""
    mock_coordinator.data = {mock_tile.tile_uuid: mock_tile}
    mock_coordinator.async_request_refresh = AsyncMock()
    
    entity = TileRefreshDeviceButton(mock_coordinator, mock_tile.tile_uuid)
    
    await entity.async_press()
    
    # Should have requested refresh
    mock_coordinator.async_request_refresh.assert_called_once()
    assert entity._last_refreshed is not None


def test_program_ringtone_button_initialization(mock_hass, mock_coordinator, mock_tile):
    """Test program ringtone button initialization."""
    entity = TileProgramRingtoneButton(mock_hass, mock_coordinator, mock_tile.tile_uuid)
    
    assert entity._tile_uuid == mock_tile.tile_uuid
    assert entity._attr_unique_id == f"tile_{mock_tile.tile_uuid}_program_ringtone"
    assert entity._attr_icon == "mdi:music-note-plus"
    assert entity._attr_entity_registry_enabled_default is False  # Advanced feature


@pytest.mark.asyncio
async def test_program_ringtone_button_press(mock_hass, mock_coordinator, mock_tile):
    """Test pressing the program ringtone button."""
    mock_coordinator.data = {mock_tile.tile_uuid: mock_tile}
    entity = TileProgramRingtoneButton(mock_hass, mock_coordinator, mock_tile.tile_uuid)
    
    # Mock tile service
    mock_tile_service = Mock()
    mock_tile_service.program_bionic_birdie = AsyncMock(return_value=True)
    
    with patch('custom_components.tile_tracker.button.get_tile_service', return_value=mock_tile_service):
        await entity.async_press()
    
    # Should have called program_bionic_birdie
    mock_tile_service.program_bionic_birdie.assert_called_once()
    assert entity._last_programmed is not None


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
