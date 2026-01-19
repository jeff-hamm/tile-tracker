"""Tests for Tile Tracker song composer."""
import pytest
from custom_components.tile_tracker.song_composer import (
    Note,
    Song,
    PresetSongs,
    decode_bionic_birdie,
    MIDI_NOTES,
    DURATIONS,
    NOTE_TO_MIDI,
)


def test_note_creation():
    """Test creating a note."""
    note = Note(pitch=60, duration=0x06)
    assert note.pitch == 60
    assert note.duration == 0x06
    assert note.name == "C4"
    assert note.duration_name == "1/8"


def test_note_from_name():
    """Test creating a note from name."""
    note = Note.from_name("E4", "1/4")
    assert note.pitch == 64
    assert note.duration == 0x0D
    assert note.name == "E4"


def test_note_to_bytes():
    """Test converting note to bytes."""
    note = Note(pitch=67, duration=0x03)
    data = note.to_bytes()
    assert data == bytes([67, 0x03])


def test_note_from_bytes():
    """Test creating note from bytes."""
    data = bytes([60, 0x06])
    note = Note.from_bytes(data)
    assert note.pitch == 60
    assert note.duration == 0x06


def test_song_creation():
    """Test creating a song."""
    song = Song(name="Test Song")
    assert song.name == "Test Song"
    assert len(song.notes) == 0


def test_add_note_to_song():
    """Test adding notes to a song."""
    song = Song()
    song.add_note("C4", "1/4")
    song.add_note("E4", "1/4")
    song.add_note("G4", "1/2")
    
    assert len(song.notes) == 3
    assert song.notes[0].name == "C4"
    assert song.notes[1].name == "E4"
    assert song.notes[2].name == "G4"


def test_add_rest_to_song():
    """Test adding rests to a song."""
    song = Song()
    song.add_rest("1/4")
    
    assert len(song.notes) == 1
    assert song.notes[0].pitch == 0
    assert song.notes[0].name == "Rest"


def test_song_to_bytes():
    """Test converting song to bytes."""
    song = Song()
    song.add_note("C4", "1/4")
    song.add_rest("1/8")
    
    data = song.to_bytes()
    
    # Should have header + scramble + notes + terminator
    assert len(data) > 110  # Header(6) + Scramble(98) + Notes(4) + Terminator(4)
    assert data[:6] == Song.HEADER
    assert data[-4:] == Song.TERMINATOR


def test_song_from_notation():
    """Test parsing song from notation."""
    notation = "C4:1/4 | D4:1/4 | E4:1/8 | R:1/8 | G4:1/2"
    song = Song.from_notation(notation)
    
    assert len(song.notes) == 5
    assert song.notes[0].name == "C4"
    assert song.notes[1].name == "D4"
    assert song.notes[2].name == "E4"
    assert song.notes[3].name == "Rest"
    assert song.notes[4].name == "G4"


def test_song_to_compact_notation():
    """Test converting song to compact notation."""
    song = Song()
    song.add_note("C4", "1/4")
    song.add_note("D4", "1/4")
    song.add_rest("1/8")
    
    notation = song.to_compact_notation()
    assert "C4:1/4" in notation
    assert "D4:1/4" in notation
    assert "R:1/8" in notation


def test_song_from_bytes():
    """Test parsing song from bytes."""
    # Create a song and convert to bytes
    original = Song(name="Original")
    original.add_note("G4", "1/4")
    original.add_note("A4", "1/4")
    
    data = original.to_bytes()
    
    # Parse it back
    parsed = Song.from_bytes(data, name="Parsed")
    
    assert len(parsed.notes) == len(original.notes)
    assert parsed.notes[0].pitch == original.notes[0].pitch
    assert parsed.notes[1].pitch == original.notes[1].pitch


def test_preset_doorbell():
    """Test doorbell preset."""
    song = PresetSongs.doorbell()
    assert song.name == "Doorbell"
    assert len(song.notes) == 2
    # E5, C5
    assert song.notes[0].name == "E5"
    assert song.notes[1].name == "C5"


def test_preset_mario_coin():
    """Test mario coin preset."""
    song = PresetSongs.mario_coin()
    assert song.name == "Mario Coin"
    assert len(song.notes) == 2
    assert song.notes[0].name == "B5"
    assert song.notes[1].name == "E6"


def test_preset_twinkle_twinkle():
    """Test twinkle twinkle preset."""
    song = PresetSongs.twinkle_twinkle()
    assert song.name == "Twinkle Twinkle"
    assert len(song.notes) == 14


def test_preset_simple_scale():
    """Test simple scale preset."""
    song = PresetSongs.simple_scale()
    assert song.name == "C Major Scale"
    assert len(song.notes) == 8
    # C, D, E, F, G, A, B, C
    assert song.notes[0].name == "C4"
    assert song.notes[-1].name == "C5"


def test_decode_bionic_birdie():
    """Test decoding Bionic Birdie song."""
    song = decode_bionic_birdie()
    assert song.name == "Bionic Birdie"
    assert len(song.notes) > 100  # Should have many notes


def test_notation_with_different_formats():
    """Test notation parsing with various formats."""
    # With pipes
    song1 = Song.from_notation("C4:1/4 | D4:1/4")
    assert len(song1.notes) == 2
    
    # Without explicit duration
    song2 = Song.from_notation("C4 | D4")
    assert len(song2.notes) == 2
    assert song2.notes[0].duration == DURATIONS["1/8"]  # Default
    
    # Mixed rests
    song3 = Song.from_notation("C4:1/4 | Rest:1/8 | -:1/4")
    assert len(song3.notes) == 3
    assert song3.notes[1].pitch == 0
    assert song3.notes[2].pitch == 0


def test_midi_notes_mapping():
    """Test MIDI notes mapping."""
    # Middle C
    assert NOTE_TO_MIDI["C4"] == 60
    # Octave higher
    assert NOTE_TO_MIDI["C5"] == 72
    # With sharps
    assert NOTE_TO_MIDI["C#4"] == 61
    assert NOTE_TO_MIDI["D#4"] == 63


def test_durations_mapping():
    """Test durations mapping."""
    assert DURATIONS["1/32"] == 0x02
    assert DURATIONS["1/16"] == 0x03
    assert DURATIONS["1/8"] == 0x06
    assert DURATIONS["1/4"] == 0x0D
    assert DURATIONS["1/2"] == 0x16


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
