# Release Process

## For Maintainers

This document describes how to create a new release of Tile Tracker.

### Prerequisites

- Git configured with push access to the repository
- Node.js 20+ installed for building the frontend
- GitHub CLI (optional, for creating releases manually)

### Automated Release Process

The project uses GitHub Actions to automate the build and release process.

#### 1. Prepare the Release

```bash
# Run the release script with the new version number
./release.sh 1.1.0
```

This script will:
- Update `manifest.json` with the new version
- Update `frontend/package.json` with the new version
- Update the card version constant in TypeScript
- Build the frontend card
- Commit all changes
- Create a git tag

#### 2. Push to GitHub

```bash
# Push commits and tags
git push && git push origin v1.1.0
```

#### 3. Automatic GitHub Actions

Once the tag is pushed, GitHub Actions will automatically:
- Build the frontend from TypeScript source
- Compress the JavaScript bundle (gzip)
- Update the manifest version
- Create a release ZIP file
- Create a GitHub Release with:
  - Release notes
  - Installation instructions
  - Changelog
  - Downloadable ZIP archive

### Manual Build (Development)

To build the frontend locally for testing:

```bash
# Production build
./build.sh

# Development mode with auto-rebuild and cache clearing
./dev-watch.sh

# Development mode with auto-restart of Home Assistant
./dev-watch.sh --auto-restart

# Just clear cache without rebuilding
./clear-cache.sh
```

**Development Workflow:**
1. Start watch mode: `./dev-watch.sh`
2. Edit TypeScript files in `custom_components/tile_tracker/frontend/src/`
3. Script automatically rebuilds and clears cache
4. Hard refresh browser (Ctrl+Shift+R)
5. See changes immediately

Or manually:

```bash
cd custom_components/tile_tracker/frontend
npm install
npm run build
```

### Version Numbering

Follow [Semantic Versioning](https://semver.org/):
- **MAJOR** (X.0.0): Breaking changes
- **MINOR** (1.X.0): New features, backwards compatible
- **PATCH** (1.1.X): Bug fixes, backwards compatible

### Release Checklist

- [ ] Update CHANGELOG.md with new features/fixes
- [ ] Test the integration locally
- [ ] Ensure all GitHub Actions checks pass
- [ ] Run `./release.sh <version>`
- [ ] Review the commit and tag
- [ ] Push to GitHub
- [ ] Verify GitHub Actions completes successfully
- [ ] Test HACS installation from the release
- [ ] Announce release (optional)

### Troubleshooting

**Build fails in GitHub Actions:**
- Check the Actions log for errors
- Ensure `package.json` and `rollup.config.js` are correct
- Verify TypeScript source has no errors locally

**HACS doesn't recognize the release:**
- Ensure `hacs.json` exists and is valid
- Verify `manifest.json` has the correct version
- Check that the tag is in format `vX.Y.Z`

**Frontend not updated after release:**
- Clear Home Assistant frontend cache
- Hard refresh browser (Ctrl+Shift+R)
- Check file timestamps in `custom_components/tile_tracker/www/`

### GitHub Actions Workflows

**Release Workflow** (`.github/workflows/release.yml`):
- Triggered on: Tag push matching `v*`
- Builds frontend, creates release, uploads artifacts

**Build Workflow** (`.github/workflows/build.yml`):
- Triggered on: Push to main/develop, Pull requests
- Validates code and builds frontend
- Used for CI/CD validation

### Manual Release (Emergency)

If GitHub Actions is unavailable:

```bash
# Build frontend
./build.sh

# Create archive
cd custom_components
zip -r ../tile-tracker-1.1.0.zip tile_tracker/ \
  -x "tile_tracker/frontend/*" \
  -x "tile_tracker/.git/*" \
  -x "tile_tracker/__pycache__/*"

# Create release manually on GitHub
# Upload the ZIP file as an asset
```
