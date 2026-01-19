# Tile Tracker for Home Assistant

A Home Assistant custom integration for tracking Tile Bluetooth trackers with advanced features including BLE ring control and device management.

## Features

- **Device Tracking**: Track your Tile devices through Home Assistant
- **BLE Ring Control**: Ring your Tiles directly via Bluetooth Low Energy
- **Multiple Tile Types**: Support for various Tile models (Slim, Sticker, Mate, Pro)
- **Device Information**: View battery status, RSSI, and other device details
- **Custom Lovelace Card**: Beautiful UI card for managing your Tiles
- **Song Programming**: Advanced feature for programming custom ringtones (experimental)

## Installation

### HACS (Recommended)

1. Add this repository as a custom repository in HACS
2. Search for "Tile Tracker" in HACS
3. Install the integration
4. Restart Home Assistant

### Manual Installation

1. Copy the `custom_components/tile_tracker` folder to your Home Assistant `custom_components` directory
2. Restart Home Assistant

## Configuration

1. Go to Settings → Devices & Services
2. Click "Add Integration"
3. Search for "Tile Tracker"
4. Follow the configuration steps to log in with your Tile account

## Lovelace Card

The integration includes a custom Lovelace card for a rich UI experience:

```yaml
type: custom:tile-tracker-card
entity: device_tracker.my_tile
show_map: true
map_height: 150
show_attributes:
  - last_seen
  - battery_status
  - ring_state
```

## Services

The integration provides several services:

- `tile_tracker.play_sound`: Ring a Tile device
- `tile_tracker.program_song`: Program a custom ringtone (experimental)
- `tile_tracker.compose_song`: Create a custom song (experimental)

## Development

This integration was developed with assistance from Claude (Anthropic).

### Building the Frontend

```bash
# Production build
./build.sh

# Development watch mode (auto-rebuild on changes)
./dev-watch.sh

# Development watch with auto-restart
./dev-watch.sh --auto-restart

# Clear cache only (no rebuild)
./clear-cache.sh

# Manual build
cd custom_components/tile_tracker/frontend
npm install
npm run build
```

**Development Tips:**
- Use `dev-watch.sh` for active development - it rebuilds on file changes and clears cache
- Use `--auto-restart` flag to automatically restart Home Assistant after each build
- Always hard-refresh your browser (Ctrl+Shift+R) after rebuilding
- Check `custom_components/tile_tracker/www/` for build timestamp comments

### Creating a Release

See [RELEASING.md](RELEASING.md) for detailed release instructions.

```bash
# Create and prepare a new release
./release.sh 1.1.0

# Push to GitHub to trigger automated build and release
git push && git push origin v1.1.0
```

The release process is automated via GitHub Actions:
- Frontend is built from TypeScript source
- Release artifacts are created automatically
- HACS-compatible ZIP is generated
- GitHub Release is published with changelog

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Credits

- Jeff Hamm (@jeff-hamm) - Main developer
- Based on the Tile API reverse engineering
- Frontend built with Lit and TypeScript
