# Tile Tracker

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/v/release/jeff-hamm/tile-tracker)](https://github.com/jeff-hamm/tile-tracker/releases)
[![GitHub License](https://img.shields.io/github/license/jeff-hamm/tile-tracker)](LICENSE)

A Home Assistant custom integration for Tile Bluetooth trackers. Track your Tile devices and ring them directly via Bluetooth - no cloud relay needed for ring commands!

## Features

- 📍 **Device Tracking** - Track the last known location of your Tile devices
- 🔔 **Ring via Bluetooth** - Ring your Tiles directly via BLE (no cloud relay)
- 🔐 **Full BLE Authentication** - Implements the complete Tile authentication handshake
- ⚡ **Smart Caching** - UUID→MAC mapping and scan results are cached for fast repeat operations
- 🎵 **Song Selection** - Choose which ringtone to play on your Tiles
- 🎼 **Song Composer** - Create custom ringtones with notation or visual piano keyboard
- 🔄 **Cloud Sync** - Automatically syncs device data from the Tile API
- 🎴 **Built-in Lovelace Card** - Beautiful row-based card with ring button, map, and config panel
- ⚙️ **Configurable Device Filtering** - Auto-disable old or invisible devices

## Installation

### HACS (Recommended)

1. Open HACS in Home Assistant
2. Click on **Integrations**
3. Click the **⋮** menu in the top right and select **Custom repositories**
4. Add `https://github.com/jeff-hamm/tile-tracker` with category **Integration**
5. Click **Add**
6. Search for "Tile Tracker" and install it
7. Restart Home Assistant

### Manual Installation

1. Download the latest release from [GitHub](https://github.com/jeff-hamm/tile-tracker/releases)
2. Extract and copy the `tile_tracker` folder to your `config/custom_components/` directory
3. Restart Home Assistant

## Configuration

1. Go to **Settings** → **Devices & Services**
2. Click **+ Add Integration**
3. Search for "Tile Tracker"
4. Enter your Tile account email and password
5. Click **Submit**

Your Tile devices will be automatically discovered and added as device trackers.

## Services

### `tile_tracker.play_sound`

Ring a Tile device via Bluetooth.

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `tile_id` | Yes | - | The UUID or name of the Tile to ring |
| `volume` | No | `medium` | Volume level: `low`, `medium`, or `high` |
| `duration` | No | `5` | Ring duration in seconds (1-30) |
| `song_id` | No | - | Song ID to play (0=Default, 1=Chirp, etc.) |

**Example:**

```yaml
service: tile_tracker.play_sound
data:
  tile_id: "Crewtopia Shed"
  volume: medium
  duration: 5
```

### `tile_tracker.scan_tiles`

Scan for nearby Tile devices via Bluetooth.

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `timeout` | No | `10.0` | Scan duration in seconds |
| `force_refresh` | No | `false` | Force new scan even if cache is valid |

### `tile_tracker.refresh_tiles`

Refresh all Tile device data from the Tile API.

### `tile_tracker.clear_cache`

Clear the Bluetooth device cache. Use this if a Tile has moved or if you're having connection issues.

## Lovelace Card

This integration includes a custom Lovelace card for Tile devices. The card is automatically registered when the integration loads.

### Adding the Card

1. Go to your Lovelace dashboard
2. Click **+ Add Card**
3. Search for "Tile Tracker Card"
4. Select your Tile device tracker entity

### Card Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `entity` | string | **Required** | The device_tracker entity ID |
| `name` | string | Entity name | Custom display name |
| `show_map` | boolean | `true` | Show location map |
| `map_height` | number | `150` | Map height in pixels |
| `show_attributes` | list | See below | Attributes to display |

**Default Attributes:** `last_seen`, `latitude`, `longitude`, `source_type`

**Available Attributes:**
- `last_seen` - When the Tile was last detected
- `latitude` / `longitude` - GPS coordinates
- `source_type` - Location source
- `tile_id` - Tile UUID
- `battery_status` - Battery level
- `ring_state` - Current ring state
- `voip_state` - VoIP state
- `firmware_version` / `hardware_version`

### YAML Example

```yaml
type: custom:tile-tracker-card
entity: device_tracker.crewtopia_shed
name: Shed Key Finder
show_map: true
map_height: 200
show_attributes:
  - last_seen
  - battery_status
  - ring_state
```

### Card Features

- **Header** - Shows Tile name, product type, ring button, and battery
- **Ring Button** - Click to ring the Tile (changes color based on ring state)
- **Map** - Interactive map showing last known location
- **Attributes** - Configurable list of device attributes

## Entities

Each Tile device creates:

- **Device Tracker** - Shows last known location with GPS coordinates
- **Song Select** - Select which ringtone the Tile will play
- **Ring Button** - Quick button to ring the Tile (uses the account-level refresh)

## Bluetooth Requirements

For ring functionality to work, your Home Assistant instance needs:

- Bluetooth adapter with BLE support
- The Tile device must be within Bluetooth range (~30 feet / 10 meters)
- Home Assistant's Bluetooth integration enabled

## How It Works

This integration implements the full Tile Bluetooth authentication protocol:

1. **TDI Sequence** - Retrieves device info (Tile ID, firmware, model)
2. **RandA/RandT Exchange** - Mutual authentication with random challenges
3. **Channel Open** - Establishes a dedicated encrypted channel
4. **HMAC Signing** - All post-auth packets are signed with HMAC-SHA256

The authentication typically takes 5-10 seconds, after which ring commands are acknowledged immediately.

## Caching Strategy

To improve performance and reduce BLE scan overhead:

- **UUID→MAC Mapping** - Cached for 1 hour (MAC addresses rarely change)
- **Scan Results** - Cached for 60 seconds (rapid re-scans use cache)
- **Tile Data** - Cached by the coordinator with configurable update interval

## Troubleshooting

### Ring not working

1. Ensure the Tile is within Bluetooth range
2. Try running `tile_tracker.clear_cache` to reset the BLE cache
3. Run `tile_tracker.scan_tiles` to verify the Tile is discoverable
4. Check Home Assistant logs for detailed error messages

### Device not found

1. Make sure your Tile account credentials are correct
2. Verify the Tile appears in the official Tile app
3. Try `tile_tracker.refresh_tiles` to force a sync

## Credits

- **Jeff Hamm** ([@jeff-hamm](https://github.com/jeff-hamm)) - Author
- **Claude** (Anthropic) - Development assistance
- **lesleyxyz** - [node-tile](https://github.com/lesleyxyz/node-tile) - BLE protocol reference (MIT License)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

The Tile BLE protocol implementation is based on [node-tile](https://github.com/lesleyxyz/node-tile) by lesleyxyz, also licensed under MIT.
