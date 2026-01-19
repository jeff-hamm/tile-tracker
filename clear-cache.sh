#!/bin/bash
# Quick cache clear and browser refresh helper
# Use this if you just need to clear cache without watching

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

HA_CONTAINER="hammassistant"
CARD_PATH="custom_components/tile_tracker/www/tile-tracker-card.js"

echo -e "${CYAN}Clearing Home Assistant cache...${NC}"

# Clear Lovelace cache
docker exec ${HA_CONTAINER} rm -rf /config/.storage/lovelace* 2>/dev/null || true
docker exec ${HA_CONTAINER} rm -rf /config/www/.cache 2>/dev/null || true

# Add timestamp to force browser reload
if [ -f "$CARD_PATH" ]; then
    TIMESTAMP=$(date +%s)
    # Remove old timestamp if exists
    sed -i '/^\/\/ Build:/d' "$CARD_PATH"
    # Add new timestamp
    sed -i "1i// Build: ${TIMESTAMP}" "$CARD_PATH"
    echo -e "${GREEN}✓ Added cache-busting timestamp: ${TIMESTAMP}${NC}"
fi

# Copy to Docker container to ensure sync
echo -e "${CYAN}Syncing to container...${NC}"
docker exec ${HA_CONTAINER} ls -lh /config/custom_components/tile_tracker/www/tile-tracker-card.js

echo ""
echo -e "${GREEN}✓ Cache cleared!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo -e "  1. Hard refresh your browser: ${CYAN}Ctrl+Shift+R${NC}"
echo -e "  2. Or restart HA: ${CYAN}docker restart ${HA_CONTAINER}${NC}"
echo ""
