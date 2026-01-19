"""Server-side storage for custom songs.

This provides persistent storage for user-composed songs that can be
accessed by all Home Assistant users.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Mapping
import uuid

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util
from typing_extensions import Self

from .const import DOMAIN

SONG_STORAGE_VERSION = 1
SONG_STORAGE_KEY = f"{DOMAIN}.songs"


@dataclass
class StoredSong:
    """A custom song stored in Home Assistant."""
    
    id: str
    name: str
    notation: str
    created_at: datetime
    updated_at: datetime
    created_by: str | None = None  # User ID who created it
    
    def as_dict(self) -> dict[str, Any]:
        """Return dict representation."""
        return {
            "id": self.id,
            "name": self.name,
            "notation": self.notation,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "created_by": self.created_by,
        }
    
    @classmethod
    def from_dict(cls, data: Mapping[str, Any]) -> Self:
        """Create from dict."""
        created_at = data.get("created_at")
        updated_at = data.get("updated_at")
        
        if isinstance(created_at, str):
            created_at = dt_util.parse_datetime(created_at)
        if isinstance(updated_at, str):
            updated_at = dt_util.parse_datetime(updated_at)
        
        return cls(
            id=data["id"],
            name=data["name"],
            notation=data["notation"],
            created_at=created_at or dt_util.utcnow(),
            updated_at=updated_at or dt_util.utcnow(),
            created_by=data.get("created_by"),
        )


@dataclass
class SongStorageData:
    """Complete song storage data."""
    
    songs: dict[str, StoredSong] = field(default_factory=dict)
    
    def as_dict(self) -> dict[str, Any]:
        """Return dict representation."""
        return {
            "songs": {song_id: song.as_dict() for song_id, song in self.songs.items()},
        }
    
    @classmethod
    def from_dict(cls, data: Mapping[str, Any]) -> Self:
        """Create from dict."""
        songs = {}
        for song_id, song_data in data.get("songs", {}).items():
            songs[song_id] = StoredSong.from_dict(song_data)
        return cls(songs=songs)


class SongStorage:
    """Persistent storage for custom songs."""
    
    _loaded: bool = False
    data: SongStorageData
    
    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize storage."""
        self._store: Store[dict[str, Any]] = Store(
            hass, SONG_STORAGE_VERSION, SONG_STORAGE_KEY
        )
        self.data = SongStorageData()
    
    @property
    def loaded(self) -> bool:
        """Return if storage has been loaded."""
        return self._loaded
    
    async def load(self) -> bool:
        """Load data from storage."""
        try:
            store_data = await self._store.async_load()
            if store_data:
                self.data = SongStorageData.from_dict(store_data)
                self._loaded = True
                return True
        except Exception:
            pass
        
        self.data = SongStorageData()
        self._loaded = True
        return False
    
    async def save(self) -> None:
        """Save data to storage."""
        await self._store.async_save(self.data.as_dict())
    
    def get_all_songs(self) -> list[dict[str, Any]]:
        """Get all saved songs."""
        return [song.as_dict() for song in self.data.songs.values()]
    
    def get_song(self, song_id: str) -> StoredSong | None:
        """Get a specific song by ID."""
        return self.data.songs.get(song_id)
    
    async def save_song(
        self,
        name: str,
        notation: str,
        song_id: str | None = None,
        created_by: str | None = None,
    ) -> StoredSong:
        """Save a new or update an existing song."""
        now = dt_util.utcnow()
        
        if song_id and song_id in self.data.songs:
            # Update existing
            song = self.data.songs[song_id]
            song.name = name
            song.notation = notation
            song.updated_at = now
        else:
            # Create new
            song_id = str(uuid.uuid4())[:8]  # Short ID
            song = StoredSong(
                id=song_id,
                name=name,
                notation=notation,
                created_at=now,
                updated_at=now,
                created_by=created_by,
            )
            self.data.songs[song_id] = song
        
        await self.save()
        return song
    
    async def delete_song(self, song_id: str) -> bool:
        """Delete a song by ID."""
        if song_id in self.data.songs:
            del self.data.songs[song_id]
            await self.save()
            return True
        return False


# Global instance
_song_storage: SongStorage | None = None


def get_song_storage(hass: HomeAssistant) -> SongStorage:
    """Get or create the song storage instance."""
    global _song_storage
    if _song_storage is None:
        _song_storage = SongStorage(hass)
    return _song_storage


async def async_setup_song_storage(hass: HomeAssistant) -> SongStorage:
    """Set up song storage and load data."""
    storage = get_song_storage(hass)
    if not storage.loaded:
        await storage.load()
    return storage
