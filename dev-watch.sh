#!/bin/bash
# Development watch script for Tile Tracker
# Watches for changes, rebuilds, clears cache, and optionally restarts HA

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
HA_CONTAINER="hammassistant"
CARD_PATH="custom_components/tile_tracker/www/tile-tracker-card.js"
FRONTEND_DIR="custom_components/tile_tracker/frontend"

# Parse arguments
AUTO_RESTART=false
CLEAR_CACHE=true

while [[ $# -gt 0 ]]; do
    case $1 in
        --auto-restart)
            AUTO_RESTART=true
            shift
            ;;
        --no-cache-clear)
            CLEAR_CACHE=false
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --auto-restart    Automatically restart Home Assistant on rebuild"
            echo "  --no-cache-clear  Don't clear Home Assistant cache"
            echo "  -h, --help        Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                      # Watch and rebuild with cache clearing"
            echo "  $0 --auto-restart       # Auto-restart HA on each rebuild"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}  Tile Tracker Development Watch Mode${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""
echo -e "${CYAN}Configuration:${NC}"
echo -e "  Frontend dir: ${FRONTEND_DIR}"
echo -e "  Output: ${CARD_PATH}"
echo -e "  HA Container: ${HA_CONTAINER}"
echo -e "  Auto-restart: $([ "$AUTO_RESTART" = true ] && echo -e "${GREEN}Enabled${NC}" || echo -e "${YELLOW}Disabled${NC}")"
echo -e "  Cache clearing: $([ "$CLEAR_CACHE" = true ] && echo -e "${GREEN}Enabled${NC}" || echo -e "${YELLOW}Disabled${NC}")"
echo ""

# Function to clear HA cache
clear_ha_cache() {
    if [ "$CLEAR_CACHE" = false ]; then
        return
    fi
    
    echo -e "${YELLOW}Clearing Home Assistant cache...${NC}"
    
    # Check if container exists
    if ! docker ps -a --format '{{.Names}}' | grep -q "^${HA_CONTAINER}$"; then
        echo -e "${YELLOW}Warning: HA container '${HA_CONTAINER}' not found, skipping cache clear${NC}"
        return
    fi
    
    # Clear HA frontend cache
    docker exec ${HA_CONTAINER} rm -rf /config/.storage/lovelace* 2>/dev/null || true
    docker exec ${HA_CONTAINER} rm -rf /config/www/.cache 2>/dev/null || true
    
    # Add cache-busting timestamp to the JS file
    if [ -f "$CARD_PATH" ]; then
        TIMESTAMP=$(date +%s)
        # Add timestamp comment at the beginning
        sed -i "1i// Build: ${TIMESTAMP}" "$CARD_PATH"
        echo -e "${GREEN}✓ Cache cleared and timestamp added${NC}"
    fi
}

# Function to restart HA
restart_ha() {
    if [ "$AUTO_RESTART" = false ]; then
        return
    fi
    
    echo -e "${YELLOW}Restarting Home Assistant...${NC}"
    docker restart ${HA_CONTAINER} >/dev/null 2>&1 &
    echo -e "${GREEN}✓ Restart initiated${NC}"
}

# Function called on file change
on_rebuild() {
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}File change detected at $(date '+%H:%M:%S')${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    # Clear cache before rebuild
    clear_ha_cache
    
    # Restart if enabled
    restart_ha
    
    if [ "$AUTO_RESTART" = false ]; then
        echo ""
        echo -e "${YELLOW}💡 Browser refresh required:${NC}"
        echo -e "   Press ${CYAN}Ctrl+Shift+R${NC} (hard refresh) in your browser"
        echo ""
        echo -e "${YELLOW}Or restart Home Assistant manually:${NC}"
        echo -e "   ${CYAN}docker restart ${HA_CONTAINER}${NC}"
    fi
    
    echo ""
    echo -e "${CYAN}Watching for changes...${NC}"
}

# Initial build
echo -e "${GREEN}Running initial build...${NC}"
cd "$FRONTEND_DIR"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
fi

# Start rollup in watch mode with our custom handler
echo -e "${GREEN}Starting watch mode...${NC}"
echo -e "${CYAN}Press Ctrl+C to stop${NC}"
echo ""

# Use inotifywait for more reliable file watching
if command -v inotifywait >/dev/null 2>&1; then
    # Initial build
    npm run build
    on_rebuild
    
    # Watch for changes
    while true; do
        inotifywait -q -r -e modify,create,delete src/ rollup.config.js package.json 2>/dev/null
        npm run build
        on_rebuild
    done
else
    # Fallback to npm watch with periodic checks
    echo -e "${YELLOW}Note: Install inotify-tools for better file watching${NC}"
    echo -e "      ${CYAN}sudo apt-get install inotify-tools${NC}"
    echo ""
    
    # Run npm watch with custom handling
    trap 'on_rebuild' USR1
    
    # Start watch in background and monitor output
    npm run watch 2>&1 | while IFS= read -r line; do
        echo "$line"
        if [[ "$line" == *"created"* ]] || [[ "$line" == *"updated"* ]]; then
            on_rebuild
        fi
    done
fi
