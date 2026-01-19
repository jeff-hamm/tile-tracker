# GitHub Actions CI/CD Setup - Complete! ✅

## What Was Created

### 1. GitHub Actions Workflows

**`.github/workflows/release.yml`** - Automated Release Pipeline
- Triggers when you push a version tag (e.g., `v1.1.0`)
- Automatically:
  - Builds the TypeScript frontend card
  - Compresses the JS bundle (gzip)
  - Updates manifest.json version
  - Creates a release ZIP file
  - Publishes a GitHub Release with changelog
  - Makes it HACS-compatible

**`.github/workflows/build.yml`** - Continuous Integration
- Triggers on pushes to main/develop branches and pull requests
- Validates manifest.json and hacs.json
- Builds the frontend to ensure no errors
- Uploads build artifacts

### 2. Release Automation Scripts

**`build.sh`** - Local Build Script
```bash
./build.sh
```
- Installs npm dependencies if needed
- Builds the TypeScript card
- Creates gzipped version
- Shows file sizes

**`release.sh`** - Release Preparation Script
```bash
./release.sh 1.1.0
```
- Updates version in manifest.json
- Updates version in package.json
- Updates CARD_VERSION constant
- Builds the frontend
- Commits changes
- Creates git tag

### 3. Documentation

**`RELEASING.md`** - Maintainer's Guide
- Complete release process documentation
- Troubleshooting guide
- Version numbering guidelines
- Emergency manual release procedure

**Updated `README.md`**
- Added release process section
- Contributing guidelines
- Build instructions

### 4. Configuration Updates

**Updated `.gitignore`**
- Now includes built JS files for HACS compatibility
- Keeps `www/*.js` and `www/*.js.gz` in version control

## How to Use

### Creating a New Release

1. **Prepare the release:**
   ```bash
   cd /root/appdata/hammassistant/config/my_components/tile_tracker
   ./release.sh 1.1.0
   ```

2. **Review the changes:**
   ```bash
   git show v1.1.0
   git log --oneline -5
   ```

3. **Push to GitHub:**
   ```bash
   git push && git push origin v1.1.0
   ```

4. **GitHub Actions automatically:**
   - Builds the frontend from source
   - Creates the release
   - Publishes ZIP file
   - Generates changelog
   - Makes it available in HACS

### For Local Development

**Build the frontend:**
```bash
./build.sh
```

**Watch mode (auto-rebuild on changes):**
```bash
cd custom_components/tile_tracker/frontend
npm run watch
```

## Card Fixes Included

The TypeScript source was also fixed to resolve the issues you reported:

1. ✅ **Last seen indicator** - Now shows relative time (e.g., "5 minutes ago") in header
2. ✅ **Battery indicator** - Shows status text when battery level is null
3. ✅ **Ring button styling** - Only active when actually ringing, includes loading state
4. ✅ **Settings persistence** - Fixed entity ID construction (removed incorrect `tile_` prefix)
5. ✅ **Map rendering** - Ready to use (needs rebuild and deploy)

**Note:** To deploy these fixes, you need to rebuild the card:
```bash
./build.sh
```

Then restart Home Assistant or clear the browser cache to see the changes.

## Next Steps

### Option 1: Create a Test Release (Recommended)

Test the entire workflow:
```bash
./release.sh 1.1.0
git push && git push origin v1.1.0
```

Then check:
- https://github.com/jeff-hamm/tile-tracker/actions
- https://github.com/jeff-hamm/tile-tracker/releases

### Option 2: Just Build and Test Locally

Build the fixed card and test locally:
```bash
./build.sh
# Then restart Home Assistant
docker restart hammassistant
```

## Monitoring Releases

**GitHub Actions Status:**
https://github.com/jeff-hamm/tile-tracker/actions

**Releases:**
https://github.com/jeff-hamm/tile-tracker/releases

**HACS Integration:**
After creating a release, users can install via HACS by adding your repository.

## Troubleshooting

**Build fails?**
- Check Node.js is installed: `node --version`
- Clear node_modules: `rm -rf custom_components/tile_tracker/frontend/node_modules`
- Reinstall: `cd custom_components/tile_tracker/frontend && npm install`

**GitHub Actions fails?**
- Check the Actions tab on GitHub
- Ensure package-lock.json is committed
- Verify all TypeScript syntax is correct

**HACS doesn't show the update?**
- Ensure the tag is in format `vX.Y.Z`
- Check that hacs.json is valid JSON
- Verify manifest.json has the correct version

## Summary

You now have a complete CI/CD pipeline that:
- ✅ Automatically builds releases from TypeScript source
- ✅ Creates GitHub Releases with one command
- ✅ Is HACS-compatible out of the box
- ✅ Includes quality checks (build validation, JSON validation)
- ✅ Provides local development tools
- ✅ Includes comprehensive documentation

All changes have been committed and pushed to GitHub!
