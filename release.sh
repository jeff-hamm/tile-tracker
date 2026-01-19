#!/bin/bash
# Release script for Tile Tracker
# Usage: ./release.sh <version>
# Example: ./release.sh 1.1.0

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if version is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Version number required${NC}"
    echo "Usage: $0 <version>"
    echo "Example: $0 1.1.0"
    exit 1
fi

VERSION=$1

# Validate version format (semantic versioning)
if ! [[ $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo -e "${RED}Error: Invalid version format${NC}"
    echo "Version must be in format X.Y.Z (e.g., 1.1.0)"
    exit 1
fi

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}  Tile Tracker Release Script${NC}"
echo -e "${BLUE}  Version: ${VERSION}${NC}"
echo -e "${BLUE}================================================${NC}"
echo

# Check if git repo is clean
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}Warning: You have uncommitted changes${NC}"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Update manifest.json version
echo -e "${GREEN}Updating manifest.json...${NC}"
MANIFEST="custom_components/tile_tracker/manifest.json"
if [ -f "$MANIFEST" ]; then
    sed -i "s/\"version\": \"[^\"]*\"/\"version\": \"$VERSION\"/" "$MANIFEST"
    echo -e "  ✓ Updated to version ${VERSION}"
else
    echo -e "${RED}Error: manifest.json not found${NC}"
    exit 1
fi

# Update frontend package.json version
echo -e "${GREEN}Updating frontend package.json...${NC}"
PACKAGE_JSON="custom_components/tile_tracker/frontend/package.json"
if [ -f "$PACKAGE_JSON" ]; then
    sed -i "s/\"version\": \"[^\"]*\"/\"version\": \"$VERSION\"/" "$PACKAGE_JSON"
    echo -e "  ✓ Updated to version ${VERSION}"
fi

# Update card version constant in TypeScript
echo -e "${GREEN}Updating card version constant...${NC}"
TS_FILE="custom_components/tile_tracker/frontend/src/tile-tracker-card.ts"
if [ -f "$TS_FILE" ]; then
    sed -i "s/const CARD_VERSION = \"[^\"]*\"/const CARD_VERSION = \"$VERSION\"/" "$TS_FILE"
    echo -e "  ✓ Updated card version"
fi

# Build frontend
echo -e "${GREEN}Building frontend...${NC}"
./build.sh

# Commit changes
echo -e "${GREEN}Committing changes...${NC}"
git add .
git commit -m "Release v${VERSION}" || echo -e "${YELLOW}No changes to commit${NC}"

# Create and push tag
echo -e "${GREEN}Creating git tag...${NC}"
git tag -a "v${VERSION}" -m "Release version ${VERSION}"

echo
echo -e "${BLUE}================================================${NC}"
echo -e "${GREEN}Release preparation complete!${NC}"
echo -e "${BLUE}================================================${NC}"
echo
echo -e "Next steps:"
echo -e "  1. Review the changes: ${YELLOW}git show v${VERSION}${NC}"
echo -e "  2. Push to GitHub: ${YELLOW}git push && git push origin v${VERSION}${NC}"
echo -e "  3. GitHub Actions will automatically:"
echo -e "     - Build the frontend"
echo -e "     - Create a GitHub release"
echo -e "     - Publish to HACS"
echo
echo -e "${YELLOW}To cancel this release:${NC}"
echo -e "  git tag -d v${VERSION}"
echo -e "  git reset --soft HEAD~1"
echo
