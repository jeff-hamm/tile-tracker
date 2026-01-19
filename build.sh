#!/bin/bash
# Build script for Tile Tracker frontend card

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Building Tile Tracker Card...${NC}"

# Navigate to frontend directory
cd "$(dirname "$0")/custom_components/tile_tracker/frontend"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
fi

# Build
echo -e "${GREEN}Running build...${NC}"
npm run build

# Check if build succeeded
if [ -f "../www/tile-tracker-card.js" ]; then
    SIZE=$(du -h "../www/tile-tracker-card.js" | cut -f1)
    echo -e "${GREEN}✓ Build successful!${NC}"
    echo -e "  Output: custom_components/tile_tracker/www/tile-tracker-card.js (${SIZE})"
    
    # Create gzip version
    echo -e "${GREEN}Creating compressed version...${NC}"
    gzip -k -f ../www/tile-tracker-card.js
    GZIP_SIZE=$(du -h "../www/tile-tracker-card.js.gz" | cut -f1)
    echo -e "${GREEN}✓ Compressed: ${GZIP_SIZE}${NC}"
else
    echo -e "${RED}✗ Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}Done!${NC}"
