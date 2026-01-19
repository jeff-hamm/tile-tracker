"""Song composer for Tile devices.

Copyright (c) 2024-2026 Jeff Hamm <jeff.hamm@gmail.com>
Developed with assistance from Claude (Anthropic)

SPDX-License-Identifier: MIT

Binary song format based on reverse-engineering of Tile BLE protocol.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Final

_LOGGER = logging.getLogger(__name__)

# MIDI note to name mapping
MIDI_NOTES: Final[dict[int, str]] = {
    0: "Rest",
    60: "C4", 61: "C#4", 62: "D4", 63: "D#4", 64: "E4", 65: "F4",
    66: "F#4", 67: "G4", 68: "G#4", 69: "A4", 70: "A#4", 71: "B4",
    72: "C5", 73: "C#5", 74: "D5", 75: "D#5", 76: "E5", 77: "F5",
    78: "F#5", 79: "G5", 80: "G#5", 81: "A5", 82: "A#5", 83: "B5",
    84: "C6", 85: "C#6", 86: "D6", 87: "D#6", 88: "E6", 89: "F6",
    90: "F#6", 91: "G6", 92: "G#6", 93: "A6", 94: "A#6", 95: "B6",
}

# Reverse mapping for name to MIDI
NOTE_TO_MIDI: Final[dict[str, int]] = {v: k for k, v in MIDI_NOTES.items()}

# Duration values
DURATIONS: Final[dict[str, int]] = {
    "1/32": 0x02,
    "1/16": 0x03,
    "1/8": 0x06,
    "dotted 1/8": 0x09,
    "1/4": 0x0D,
    "dotted 1/4": 0x13,
    "1/2": 0x16,
    "3/4": 0x1A,
    "whole": 0x26,
}

DURATION_NAMES: Final[dict[int, str]] = {v: k for k, v in DURATIONS.items()}


@dataclass
class Note:
    """Represents a single note in a song."""
    
    pitch: int = 0  # MIDI note number (0 = rest, 60-95 = C4-B6)
    duration: int = 0x03  # Duration value
    
    @property
    def name(self) -> str:
        """Get human-readable note name."""
        return MIDI_NOTES.get(self.pitch, f"Note {self.pitch}")
    
    @property
    def duration_name(self) -> str:
        """Get human-readable duration name."""
        return DURATION_NAMES.get(self.duration, f"{self.duration} ticks")
    
    def to_bytes(self) -> bytes:
        """Convert note to byte pair."""
        return bytes([self.pitch, self.duration])
    
    @classmethod
    def from_bytes(cls, data: bytes) -> "Note":
        """Create note from byte pair."""
        if len(data) < 2:
            raise ValueError("Need at least 2 bytes for a note")
        return cls(pitch=data[0], duration=data[1])
    
    @classmethod
    def from_name(cls, name: str, duration: str = "1/8") -> "Note":
        """Create note from name and duration string."""
        pitch = NOTE_TO_MIDI.get(name, 0)
        dur = DURATIONS.get(duration, 0x06)
        return cls(pitch=pitch, duration=dur)
    
    def __str__(self) -> str:
        return f"{self.name} ({self.duration_name})"


@dataclass
class Song:
    """Represents a complete song."""
    
    notes: list[Note] = field(default_factory=list)
    name: str = "Custom Song"
    
    # Header template (first 6 bytes)
    HEADER: Final[bytes] = bytes([0x01, 0x01, 0x00, 0x00, 0x18, 0x01])
    
    # Scramble block template (98 bytes of padding/checksum)
    # This is from the Bionic Birdie song - may need adjustment
    SCRAMBLE_BLOCK: Final[bytes] = bytes([
        0x38, 0xEF, 0x1A, 0xF5, 0xFE, 0x3B, 0x48, 0xB5, 0x2C, 0x9A,
        0x53, 0xA3, 0x35, 0xAE, 0xFD, 0xB4, 0x7E, 0x59, 0xB2, 0x57,
        0x3A, 0xDE, 0x75, 0xDE, 0x09, 0x51, 0x43, 0x9F, 0x27, 0x3A,
        0x18, 0x27, 0xDB, 0x9B, 0xA2, 0xCF, 0x42, 0x4B, 0x67, 0x72,
        0x11, 0xCE, 0xC4, 0xE8, 0xC9, 0xBF, 0x33, 0xA7, 0x65, 0xFE,
        0xE2, 0xDC, 0x16, 0xDA, 0x48, 0x44, 0x82, 0x59, 0xE4, 0x54,
        0xC4, 0x91, 0x7E, 0x4B, 0x70, 0x54, 0x45, 0x81, 0x77, 0x34,
        0xF6, 0x68, 0xBC, 0x6A, 0x66, 0xDF, 0x46, 0x04, 0xD4, 0x7B,
        0x5E, 0x6D, 0xE4, 0x54, 0xFB, 0x2D, 0x13, 0x9D, 0x4B, 0x5C,
        0x77, 0xD9, 0x98, 0xF0, 0xA7, 0x63,
    ])
    
    # Song terminator
    TERMINATOR: Final[bytes] = bytes([0x00, 0x00, 0x00, 0x00])
    
    def add_note(self, pitch: int | str, duration: int | str = 0x06) -> None:
        """Add a note to the song."""
        if isinstance(pitch, str):
            pitch = NOTE_TO_MIDI.get(pitch, 0)
        if isinstance(duration, str):
            duration = DURATIONS.get(duration, 0x06)
        self.notes.append(Note(pitch=pitch, duration=duration))
    
    def add_rest(self, duration: int | str = 0x06) -> None:
        """Add a rest to the song."""
        self.add_note(0, duration)
    
    def to_bytes(self) -> bytes:
        """Convert song to byte array for programming."""
        note_data = b"".join(note.to_bytes() for note in self.notes)
        return self.HEADER + self.SCRAMBLE_BLOCK + note_data + self.TERMINATOR
    
    def to_uint8_array(self) -> list[int]:
        """Convert to list of integers (for JavaScript/TypeScript)."""
        return list(self.to_bytes())
    
    @classmethod
    def from_bytes(cls, data: bytes, name: str = "Imported Song") -> "Song":
        """Parse a song from byte data."""
        song = cls(name=name)
        
        # Skip header (6 bytes) and scramble block (98 bytes)
        note_data = data[104:]
        
        # Parse note pairs until terminator
        i = 0
        while i < len(note_data) - 1:
            pitch = note_data[i]
            duration = note_data[i + 1]
            
            # Check for terminator (4 zero bytes)
            if pitch == 0 and duration == 0:
                remaining = note_data[i:i+4]
                if remaining == bytes([0, 0, 0, 0]):
                    break
            
            song.notes.append(Note(pitch=pitch, duration=duration))
            i += 2
        
        return song
    
    def to_notation(self) -> str:
        """Convert song to human-readable notation."""
        lines = []
        for i, note in enumerate(self.notes):
            lines.append(f"{i+1:3d}. {note}")
        return "\n".join(lines)
    
    def to_compact_notation(self) -> str:
        """Convert song to compact notation string."""
        parts = []
        for note in self.notes:
            if note.pitch == 0:
                parts.append(f"R:{note.duration_name}")
            else:
                parts.append(f"{note.name}:{note.duration_name}")
        return " | ".join(parts)
    
    @classmethod
    def from_notation(cls, notation: str, name: str = "Parsed Song") -> "Song":
        """Parse song from compact notation string.
        
        Format: "C4:1/8 | D4:1/8 | R:1/4 | E4:1/4"
        """
        song = cls(name=name)
        
        parts = [p.strip() for p in notation.split("|")]
        for part in parts:
            if not part:
                continue
            
            if ":" in part:
                note_str, dur_str = part.split(":", 1)
            else:
                note_str = part
                dur_str = "1/8"
            
            note_str = note_str.strip()
            dur_str = dur_str.strip()
            
            if note_str.upper() in ("R", "REST", "-"):
                song.add_rest(dur_str)
            else:
                song.add_note(note_str, dur_str)
        
        return song
    
    def __str__(self) -> str:
        return f"Song '{self.name}' ({len(self.notes)} notes)"
    
    def __len__(self) -> int:
        return len(self.notes)


# Preset songs
class PresetSongs:
    """Collection of preset songs."""
    
    @staticmethod
    def simple_scale() -> Song:
        """C major scale."""
        song = Song(name="C Major Scale")
        for note in ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"]:
            song.add_note(note, "1/4")
        return song
    
    @staticmethod
    def doorbell() -> Song:
        """Classic doorbell ding-dong."""
        song = Song(name="Doorbell")
        song.add_note("E5", "1/4")
        song.add_note("C5", "1/2")
        return song
    
    @staticmethod
    def alert_beeps() -> Song:
        """Quick alert beeps."""
        song = Song(name="Alert Beeps")
        for _ in range(3):
            song.add_note("A5", "1/16")
            song.add_rest("1/16")
        return song
    
    @staticmethod
    def happy_tune() -> Song:
        """Short happy melody."""
        song = Song(name="Happy Tune")
        notes = [
            ("C4", "1/8"), ("E4", "1/8"), ("G4", "1/8"), ("C5", "1/4"),
            ("G4", "1/8"), ("C5", "1/2"),
        ]
        for note, dur in notes:
            song.add_note(note, dur)
        return song
    
    @staticmethod
    def twinkle_twinkle() -> Song:
        """Twinkle Twinkle Little Star (first phrase)."""
        song = Song(name="Twinkle Twinkle")
        notes = [
            ("C4", "1/4"), ("C4", "1/4"), ("G4", "1/4"), ("G4", "1/4"),
            ("A4", "1/4"), ("A4", "1/4"), ("G4", "1/2"),
            ("F4", "1/4"), ("F4", "1/4"), ("E4", "1/4"), ("E4", "1/4"),
            ("D4", "1/4"), ("D4", "1/4"), ("C4", "1/2"),
        ]
        for note, dur in notes:
            song.add_note(note, dur)
        return song
    
    @staticmethod
    def mario_coin() -> Song:
        """Mario coin sound effect."""
        song = Song(name="Mario Coin")
        song.add_note("B5", "1/16")
        song.add_note("E6", "dotted 1/4")
        return song


def decode_bionic_birdie() -> Song:
    """Decode the Bionic Birdie song from the original data."""
    data = bytes([
        0x01, 0x01, 0x00, 0x00, 0x18, 0x01, 0x38, 0xEF, 0x1A, 0xF5, 0xFE, 0x3B, 0x48,
        0xB5, 0x2C, 0x9A, 0x53, 0xA3, 0x35, 0xAE, 0xFD, 0xB4, 0x7E, 0x59, 0xB2, 0x57,
        0x3A, 0xDE, 0x75, 0xDE, 0x09, 0x51, 0x43, 0x9F, 0x27, 0x3A, 0x18, 0x27, 0xDB,
        0x9B, 0xA2, 0xCF, 0x42, 0x4B, 0x67, 0x72, 0x11, 0xCE, 0xC4, 0xE8, 0xC9, 0xBF,
        0x33, 0xA7, 0x65, 0xFE, 0xE2, 0xDC, 0x16, 0xDA, 0x48, 0x44, 0x82, 0x59, 0xE4,
        0x54, 0xC4, 0x91, 0x7E, 0x4B, 0x70, 0x54, 0x45, 0x81, 0x77, 0x34, 0xF6, 0x68,
        0xBC, 0x6A, 0x66, 0xDF, 0x46, 0x04, 0xD4, 0x7B, 0x5E, 0x6D, 0xE4, 0x54, 0xFB,
        0x2D, 0x13, 0x9D, 0x4B, 0x5C, 0x77, 0xD9, 0x98, 0xF0, 0xA7, 0x63, 0x3F, 0x03,
        0x43, 0x03, 0x3F, 0x03, 0x43, 0x03, 0x3F, 0x03, 0x43, 0x03, 0x3F, 0x03, 0x43,
        0x03, 0x3F, 0x03, 0x43, 0x06, 0x00, 0x03, 0x4B, 0x0D, 0x43, 0x0D,
        0x44, 0x0D, 0x46, 0x0D, 0x4B, 0x09, 0x00, 0x04, 0x46, 0x06, 0x00, 0x06, 0x52,
        0x06, 0x00, 0x06, 0x46, 0x06, 0x00, 0x13, 0x4F, 0x03, 0x52, 0x03, 0x4F, 0x03,
        0x52, 0x03, 0x4F, 0x03, 0x52, 0x03, 0x00, 0x06, 0x4B, 0x03, 0x4F, 0x03, 0x4B,
        0x03, 0x4F, 0x03, 0x4B, 0x03, 0x4F, 0x03, 0x00, 0x06, 0x44, 0x03, 0x48, 0x03,
        0x44, 0x03, 0x48, 0x03, 0x44, 0x03, 0x48, 0x03, 0x44, 0x03, 0x48, 0x03, 0x44,
        0x03, 0x48, 0x06, 0x00, 0x03, 0x50, 0x0D, 0x48, 0x0D, 0x49, 0x0D, 0x4B, 0x0D,
        0x50, 0x09, 0x00, 0x04, 0x4B, 0x06, 0x00, 0x06, 0x57, 0x06, 0x00, 0x06, 0x4B,
        0x06, 0x00, 0x13, 0x54, 0x03, 0x57, 0x03, 0x54, 0x03, 0x57, 0x03, 0x54, 0x03,
        0x57, 0x03, 0x54, 0x03, 0x57, 0x06, 0x00, 0x16, 0x46, 0x03, 0x4A, 0x03, 0x46,
        0x03, 0x4A, 0x03, 0x46, 0x03, 0x4A, 0x03, 0x46, 0x03, 0x4A, 0x03,
        0x46, 0x03, 0x4A, 0x06, 0x00, 0x03, 0x52, 0x0D, 0x4A, 0x0D, 0x4B, 0x0D, 0x4D,
        0x0D, 0x52, 0x09, 0x00, 0x04, 0x4D, 0x06, 0x00, 0x06, 0x59, 0x06, 0x00, 0x06,
        0x4D, 0x06, 0x00, 0x13, 0x56, 0x03, 0x59, 0x03, 0x56, 0x03, 0x59, 0x03, 0x56,
        0x03, 0x59, 0x03, 0x00, 0x06, 0x52, 0x03, 0x56, 0x03, 0x52, 0x03, 0x56, 0x03,
        0x52, 0x03, 0x56, 0x03, 0x00, 0x06, 0x4B, 0x03, 0x4F, 0x03, 0x4B, 0x03, 0x4F,
        0x03, 0x4B, 0x03, 0x4F, 0x03, 0x4B, 0x03, 0x4F, 0x03, 0x4B, 0x03, 0x4F, 0x06,
        0x00, 0x03, 0x57, 0x0D, 0x4F, 0x0D, 0x50, 0x0D, 0x52, 0x0D, 0x57, 0x09, 0x00,
        0x04, 0x52, 0x06, 0x00, 0x06, 0x5E, 0x06, 0x00, 0x06, 0x52, 0x06, 0x00, 0x13,
        0x5B, 0x03, 0x5E, 0x03, 0x5B, 0x03, 0x5E, 0x03, 0x5B, 0x03, 0x5E, 0x03, 0x5B,
        0x03, 0x5E, 0x06, 0x00, 0x0B, 0x00, 0x00, 0x00, 0x00
    ])
    return Song.from_bytes(data, name="Bionic Birdie")


# Test if run directly
if __name__ == "__main__":
    # Decode and display Bionic Birdie
    song = decode_bionic_birdie()
    print(f"Decoded: {song}")
    print("\nFirst 20 notes:")
    for i, note in enumerate(song.notes[:20]):
        print(f"  {i+1:3d}. {note}")
    
    # Create a simple scale
    scale = PresetSongs.simple_scale()
    print(f"\n{scale}")
    print(f"Bytes: {scale.to_bytes().hex()[:100]}...")
    
    # Parse from notation
    custom = Song.from_notation("C4:1/8 | E4:1/8 | G4:1/4 | R:1/8 | C5:1/2")
    print(f"\nCustom: {custom}")
    print(f"Compact: {custom.to_compact_notation()}")
