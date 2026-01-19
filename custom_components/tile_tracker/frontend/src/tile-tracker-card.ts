/**
 * Tile Tracker Card - Lovelace card for Tile device trackers
 * 
 * Copyright (c) 2024-2026 Jeff Hamm <jeff.hamm@gmail.com>
 * Developed with assistance from Claude (Anthropic)
 * 
 * SPDX-License-Identifier: MIT
 */

import {
  CSSResultGroup,
  LitElement,
  PropertyValues,
  TemplateResult,
  css,
  html,
  nothing,
} from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  ActionHandlerEvent,
  HomeAssistant,
  LovelaceCard,
  LovelaceCardConfig,
  LovelaceCardEditor,
  fireEvent,
  handleAction,
  hasAction,
} from "custom-card-helpers";

// Card version
const CARD_VERSION = "1.2.1";

// Log card info on load
console.info(
  `%c TILE-TRACKER-CARD %c ${CARD_VERSION} `,
  "color: white; font-weight: bold; background: #1E88E5",
  "color: #1E88E5; font-weight: bold; background: white"
);

// Ring state colors
const RING_STATE_COLORS: Record<string, string> = {
  ringing: "#4CAF50",
  silent: "#9E9E9E",
  unknown: "#FF9800",
};

// Battery level colors
const BATTERY_COLORS = {
  high: "#4CAF50",
  medium: "#FF9800",
  low: "#F44336",
};

// Battery icons by level
const BATTERY_ICONS = {
  full: "mdi:battery",
  90: "mdi:battery-90",
  80: "mdi:battery-80",
  70: "mdi:battery-70",
  60: "mdi:battery-60",
  50: "mdi:battery-50",
  40: "mdi:battery-40",
  30: "mdi:battery-30",
  20: "mdi:battery-20",
  10: "mdi:battery-10",
  outline: "mdi:battery-outline",
  unknown: "mdi:battery-unknown",
};

// Song composer notes and durations
const PIANO_NOTES = [
  'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
  'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5',
  'C6', 'C#6', 'D6', 'D#6', 'E6', 'F6', 'F#6', 'G6',
];

const DURATIONS = [
  { value: '1/32', label: '1/32', symbol: '𝅘𝅥𝅱' },
  { value: '1/16', label: '1/16', symbol: '𝅘𝅥𝅰' },
  { value: '1/8', label: '1/8', symbol: '♪' },
  { value: 'dotted 1/8', label: '1/8.', symbol: '♪·' },
  { value: '1/4', label: '1/4', symbol: '♩' },
  { value: 'dotted 1/4', label: '1/4.', symbol: '♩·' },
  { value: '1/2', label: '1/2', symbol: '𝅗𝅥' },
  { value: '3/4', label: '3/4', symbol: '𝅗𝅥·' },
  { value: 'whole', label: 'whole', symbol: '𝅝' },
];

const PRESET_SONGS = [
  { value: 'simple_scale', label: 'C Major Scale' },
  { value: 'doorbell', label: 'Doorbell' },
  { value: 'alert_beeps', label: 'Alert Beeps' },
  { value: 'happy_tune', label: 'Happy Tune' },
  { value: 'twinkle_twinkle', label: 'Twinkle Twinkle' },
  { value: 'mario_coin', label: 'Mario Coin' },
];

// Card configuration interface
export interface TileTrackerCardConfig extends LovelaceCardConfig {
  type: string;
  entity: string;
  name?: string;
  show_map?: boolean;
  map_height?: number;
  show_attributes?: string[];
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}

interface ActionConfig {
  action: string;
  navigation_path?: string;
  service?: string;
  service_data?: Record<string, unknown>;
}

interface ComposerNote {
  note: string;
  duration: string;
}

// Default attributes to show
const DEFAULT_ATTRIBUTES = [
  "last_seen",
  "latitude",
  "longitude",
  "source_type",
];

// Register card with Home Assistant
(window as unknown as { customCards: unknown[] }).customCards =
  (window as unknown as { customCards: unknown[] }).customCards || [];
(window as unknown as { customCards: unknown[] }).customCards.push({
  type: "tile-tracker-card",
  name: "Tile Tracker Card",
  description: "A card for displaying Tile device trackers with ring control and song composer",
});

@customElement("tile-tracker-card")
export class TileTrackerCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: TileTrackerCardConfig;
  @state() private _showConfig = false;
  @state() private _showComposer = false;
  @state() private _composerNotes: ComposerNote[] = [];
  @state() private _selectedDuration = '1/8';
  @state() private _songName = 'Custom Song';
  @state() private _isRingLoading = false;
  @state() private _showLostConfirm = false;
  private _ringTimer: ReturnType<typeof setTimeout> | null = null;

  // Get card editor
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("./tile-tracker-card-editor");
    return document.createElement("tile-tracker-card-editor") as LovelaceCardEditor;
  }

  // Stub config for card picker
  public static getStubConfig(): Record<string, unknown> {
    return {
      type: "custom:tile-tracker-card",
      entity: "",
      show_map: true,
      show_attributes: DEFAULT_ATTRIBUTES,
    };
  }

  // Set card configuration
  public setConfig(config: TileTrackerCardConfig): void {
    if (!config.entity) {
      throw new Error("You must specify an entity");
    }
    if (!config.entity.startsWith("device_tracker.")) {
      throw new Error("Entity must be a device_tracker");
    }

    this._config = {
      show_map: true,
      map_height: 150,
      show_attributes: DEFAULT_ATTRIBUTES,
      tap_action: { action: "more-info" },
      ...config,
    };
  }

  // Card size for layout
  public getCardSize(): number {
    let size = 2;
    if (this._config?.show_map) size += 3;
    if (this._config?.show_attributes?.length) {
      size += Math.ceil(this._config.show_attributes.length / 2);
    }
    if (this._showConfig) size += 4;
    if (this._showComposer) size += 6;
    return size;
  }

  // Should update?
  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this._config) return false;
    if (changedProps.has("_config")) return true;
    if (changedProps.has("_showConfig")) return true;
    if (changedProps.has("_showComposer")) return true;
    if (changedProps.has("_showLostConfirm")) return true;
    if (changedProps.has("_composerNotes")) return true;
    if (changedProps.has("_selectedDuration")) return true;
    if (!changedProps.has("hass")) return false;

    const oldHass = changedProps.get("hass") as HomeAssistant | undefined;
    if (!oldHass) return true;

    const entityId = this._config.entity;
    return oldHass.states[entityId] !== this.hass.states[entityId];
  }

  // Get related entity IDs for this tile
  private _getRelatedEntities(): {
    tileId: string;
    volumeEntity: string;
    durationEntity: string;
    songEntity: string;
    lostSwitch: string;
    locateButton: string;
  } {
    const stateObj = this.hass.states[this._config.entity];
    const tileId = stateObj?.attributes?.tile_uuid || stateObj?.attributes?.tile_id || "";
    const friendlyName = stateObj?.attributes?.friendly_name || "";
    
    // Convert friendly name to entity slug - match HA entity naming pattern
    const slug = friendlyName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    // Entities are named without the 'tile_' prefix (e.g., button.camera_locate, not button.tile_camera_locate)
    const prefix = slug || tileId.substring(0, 8);
    
    const result = {
      tileId,
      volumeEntity: `select.${prefix}_default_volume`,
      durationEntity: `number.${prefix}_default_duration`,
      songEntity: `select.${prefix}_song`,
      lostSwitch: `switch.${prefix}_lost`,
      locateButton: `button.${prefix}_locate`,
    };
    
    // Debug logging
    console.debug('[Tile Tracker Card] Related entities:', {
      configEntity: this._config.entity,
      friendlyName,
      computedSlug: slug,
      prefix,
      entities: result,
      volumeStateExists: !!this.hass.states[result.volumeEntity],
      durationStateExists: !!this.hass.states[result.durationEntity],
      lostStateExists: !!this.hass.states[result.lostSwitch],
    });
    
    return result;
  }

  // Format timestamp as relative time (e.g., "5 minutes ago")
  private _formatRelativeTime(timestamp: string | null | undefined): string | null {
    if (!timestamp) return null;
    
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      
      // Handle future dates
      if (diffMs < 0) return "just now";
      
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      const diffWeeks = Math.floor(diffDays / 7);
      const diffMonths = Math.floor(diffDays / 30);
      
      if (diffSecs < 60) return "just now";
      if (diffMins === 1) return "1 minute ago";
      if (diffMins < 60) return `${diffMins} minutes ago`;
      if (diffHours === 1) return "1 hour ago";
      if (diffHours < 24) return `${diffHours} hours ago`;
      if (diffDays === 1) return "1 day ago";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffWeeks === 1) return "1 week ago";
      if (diffWeeks < 4) return `${diffWeeks} weeks ago`;
      if (diffMonths === 1) return "1 month ago";
      if (diffMonths < 12) return `${diffMonths} months ago`;
      return date.toLocaleDateString();
    } catch {
      return null;
    }
  }

  // Render card
  protected render(): TemplateResult | typeof nothing {
    if (!this._config || !this.hass) {
      return nothing;
    }

    const entityId = this._config.entity;
    const stateObj = this.hass.states[entityId];

    if (!stateObj) {
      return html`
        <ha-card>
          <div class="warning">
            Entity not found: ${entityId}
          </div>
        </ha-card>
      `;
    }

    const name = this._config.name || stateObj.attributes.friendly_name || entityId;
    const product = stateObj.attributes.product || stateObj.attributes.tile_type || "Tile";
    const ringState = stateObj.attributes.ring_state || "silent";
    const batteryLevel = this._getBatteryLevel(stateObj);
    // Filter out 'none', 'None', null, undefined as battery status
    const rawBatteryStatus = stateObj.attributes.battery_status as string | undefined;
    const batteryStatus = (rawBatteryStatus && rawBatteryStatus.toLowerCase() !== "none") ? rawBatteryStatus : "unknown";
    // Get last seen timestamp
    const lastTimestamp = stateObj.attributes.last_timestamp as string | undefined;
    const lastSeen = this._formatRelativeTime(lastTimestamp);
    // Get lost state from device_tracker attribute
    const isLost = stateObj.attributes.lost === true;

    return html`
      <ha-card>
        ${this._renderHeader(name, product, ringState, batteryLevel, batteryStatus, lastSeen, isLost)}
        ${this._config.show_map ? this._renderMap(stateObj) : nothing}
        ${this._renderAttributes(stateObj)}
        ${this._showConfig ? this._renderConfigPanel() : nothing}
        ${/* SONG COMPOSER DISABLED - see comment above compose button for details */ nothing && this._showComposer ? this._renderSongComposer() : nothing}
      </ha-card>
    `;
  }

  // Render header row
  private _renderHeader(
    name: string,
    product: string,
    ringState: string,
    batteryLevel: number | null,
    batteryStatus: string,
    lastSeen: string | null,
    isLost: boolean
  ): TemplateResult {
    const isRinging = ringState === "ringing";
    const batteryInfo = this._getBatteryInfo(batteryLevel, batteryStatus);
    // Ring button styling: only show active (green) when actually ringing
    const ringColor = isRinging ? RING_STATE_COLORS.ringing : "var(--secondary-background-color)";
    const ringIconColor = isRinging ? "white" : "var(--primary-text-color)";
    const ringIcon = this._isRingLoading ? "mdi:loading" : (isRinging ? "mdi:bell-ring" : "mdi:bell");
    // Lost button styling
    const lostColor = isLost ? "var(--error-color, #f44336)" : "var(--secondary-background-color)";
    const lostIconColor = isLost ? "white" : "var(--primary-text-color)";

    return html`
      <div class="header" @click=${this._handleHeaderClick}>
        <div class="info">
          <div class="name">${name}</div>
          <div class="subtitle">
            <span class="product">${product}</span>
            ${lastSeen ? html`<span class="last-seen">• ${lastSeen}</span>` : nothing}
          </div>
        </div>
        <div class="controls">
          <div
            class="config-button"
            @click=${this._toggleConfig}
            title="Configure"
          >
            <ha-icon icon="mdi:cog"></ha-icon>
          </div>
          <button
            class="action-icon-button ${isLost ? 'active-lost' : ''}"
            style="--btn-bg: ${lostColor}; --btn-icon-color: ${lostIconColor}"
            @click=${this._handleLostClick}
            title="${isLost ? 'Tile is marked as lost' : 'Mark as lost'}"
          >
            <ha-icon icon="${isLost ? 'mdi:alert-circle' : 'mdi:crosshairs-question'}"></ha-icon>
          </button>
          <button
            class="action-icon-button ${isRinging ? 'active-ring' : ''} ${this._isRingLoading ? 'loading' : ''}"
            style="--btn-bg: ${ringColor}; --btn-icon-color: ${ringIconColor}"
            @click=${this._handleRingClick}
            title="Ring Tile"
            ?disabled=${this._isRingLoading}
          >
            <ha-icon icon="${ringIcon}" class="${this._isRingLoading ? 'spin' : ''}"></ha-icon>
          </button>
          <div class="battery" title="${batteryInfo.tooltip}">
            <ha-icon
              icon="${batteryInfo.icon}"
              style="color: ${batteryInfo.color}"
            ></ha-icon>
            <span class="battery-text" style="color: ${batteryInfo.color}">${batteryInfo.text}</span>
          </div>
        </div>
      </div>
      ${this._showLostConfirm ? this._renderLostConfirmDialog() : nothing}
    `;
  }

  // Render config panel
  private _renderConfigPanel(): TemplateResult {
    const entities = this._getRelatedEntities();
    const volumeState = this.hass.states[entities.volumeEntity];
    const durationState = this.hass.states[entities.durationEntity];
    const songState = this.hass.states[entities.songEntity];
    const lostState = this.hass.states[entities.lostSwitch];

    const currentVolume = volumeState?.state || "medium";
    const currentDuration = durationState?.state || "5";
    const currentSong = songState?.state || "Default";
    
    // Get available songs from attributes
    const availableSongs = songState?.attributes?.available_songs || [
      { id: 0, name: "Default" },
      { id: 1, name: "Chirp" },
    ];

    return html`
      <div class="divider"></div>
      <div class="config-panel">
        <div class="config-header">
          <span class="config-title">⚙️ Settings</span>
          <button class="close-btn" @click=${this._toggleConfig}>×</button>
        </div>

        <div class="config-grid">
          <!-- Default Song -->
          <div class="config-item">
            <label>Default Song</label>
            <div class="song-row">
              <select 
                .value=${currentSong}
                @change=${(e: Event) => this._setSongOption((e.target as HTMLSelectElement).value)}
              >
                ${availableSongs.map((song: {id: number, name: string}) => 
                  html`<option value="${song.name}" ?selected=${song.name === currentSong}>${song.name}</option>`
                )}
              </select>
              <!-- 
                SONG COMPOSER DISABLED: The song programming feature requires additional
                research. While the BLE protocol for sending song data blocks has been
                implemented following the node-tile reference, the Tile device returns
                ERROR_HASH on the final block. This suggests either:
                1. Songs may require device-specific encryption/signing with a private key
                2. The song data format may require specific header/metadata structure  
                3. There may be additional handshake or validation steps not yet discovered
                The underlying services (program_song, compose_song, play_preset_song) remain
                available for testing via Developer Tools > Services.
                See: https://github.com/lesleyxyz/node-tile for reference implementation.
              -->
              <!-- <button 
                class="compose-btn" 
                @click=${this._toggleComposer}
                title="Compose new song"
              >
                🎵
              </button> -->
            </div>
          </div>

          <!-- Default Volume -->
          <div class="config-item">
            <label>Default Volume</label>
            <select 
              .value=${currentVolume}
              @change=${(e: Event) => this._setVolume((e.target as HTMLSelectElement).value)}
            >
              <option value="low" ?selected=${currentVolume === "low"}>🔈 Low</option>
              <option value="medium" ?selected=${currentVolume === "medium"}>🔉 Medium</option>
              <option value="high" ?selected=${currentVolume === "high"}>🔊 High</option>
            </select>
          </div>

          <!-- Default Duration -->
          <div class="config-item">
            <label>Default Duration (seconds)</label>
            <input 
              type="range" 
              min="1" 
              max="30" 
              .value=${currentDuration}
              @input=${(e: Event) => this._setDuration(parseInt((e.target as HTMLInputElement).value))}
            />
            <span class="duration-value">${currentDuration}s</span>
          </div>
        </div>
      </div>
    `;
  }

  // Render song composer
  private _renderSongComposer(): TemplateResult {
    return html`
      <div class="divider"></div>
      <div class="composer-panel">
        <div class="composer-header">
          <span class="composer-title">🎹 Song Composer</span>
          <button class="close-btn" @click=${this._toggleComposer}>×</button>
        </div>

        <!-- Song Name -->
        <div class="composer-row">
          <label>Song Name:</label>
          <input 
            type="text" 
            .value=${this._songName}
            @input=${(e: Event) => this._songName = (e.target as HTMLInputElement).value}
            placeholder="My Custom Song"
          />
        </div>

        <!-- Duration Selector -->
        <div class="composer-row">
          <label>Note Duration:</label>
          <div class="duration-buttons">
            ${DURATIONS.map(d => html`
              <button 
                class="dur-btn ${d.value === this._selectedDuration ? 'selected' : ''}"
                @click=${() => this._selectedDuration = d.value}
                title="${d.label}"
              >
                ${d.symbol}
              </button>
            `)}
            <button class="dur-btn rest-btn" @click=${this._addRest} title="Add Rest">
              🔇
            </button>
          </div>
        </div>

        <!-- Piano -->
        <div class="piano-wrapper">
          <div class="piano">
            ${this._renderPianoKeys()}
          </div>
        </div>

        <!-- Notes Display -->
        <div class="notes-display">
          ${this._composerNotes.length === 0 
            ? html`<span class="empty-notes">Click piano keys to add notes...</span>`
            : this._composerNotes.map((n, i) => html`
                <span 
                  class="note-chip ${n.note === 'Rest' ? 'rest' : ''}"
                  @click=${() => this._removeNote(i)}
                  title="Click to remove"
                >
                  ${n.note === 'Rest' ? '🔇' : n.note}:${n.duration}
                </span>
              `)
          }
        </div>
        <div class="notes-count">${this._composerNotes.length} notes</div>

        <!-- Composer Actions -->
        <div class="composer-actions">
          <button class="action-btn danger" @click=${this._clearNotes}>Clear</button>
          <button class="action-btn secondary" @click=${this._undoNote} ?disabled=${this._composerNotes.length === 0}>Undo</button>
          <button class="action-btn secondary" @click=${this._toggleComposer}>Cancel</button>
          <button 
            class="action-btn primary" 
            @click=${this._programCustomSong}
            ?disabled=${this._composerNotes.length === 0}
          >
            Program to Tile
          </button>
        </div>
      </div>
    `;
  }

  // Render piano keys
  private _renderPianoKeys(): TemplateResult {
    const whiteNotes = PIANO_NOTES.filter(n => !n.includes('#'));
    
    return html`
      ${whiteNotes.map((note, i) => {
        const blackNote = PIANO_NOTES.find(n => n.startsWith(note[0]) && n.includes('#') && n.endsWith(note.slice(-1)));
        return html`
          <div class="white-key" @click=${() => this._addNote(note)} data-note="${note}">
            ${note}
          </div>
          ${blackNote ? html`
            <div 
              class="black-key" 
              @click=${(e: Event) => { e.stopPropagation(); this._addNote(blackNote); }}
              style="left: ${(i + 1) * 28 - 9}px"
            >
              ${blackNote.replace('#', '♯')}
            </div>
          ` : nothing}
        `;
      })}
    `;
  }

  // Render map
  private _renderMap(stateObj: { attributes: Record<string, unknown> }): TemplateResult | typeof nothing {
    const lat = stateObj.attributes.latitude as number | undefined;
    const lon = stateObj.attributes.longitude as number | undefined;

    if (!lat || !lon) {
      return html`
        <div class="map-placeholder">
          <ha-icon icon="mdi:map-marker-question"></ha-icon>
          <span>Location unavailable</span>
        </div>
      `;
    }

    const mapHeight = this._config.map_height || 150;
    
    // Use OpenStreetMap embed as a reliable fallback (ha-map requires complex setup)
    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.005}%2C${lat - 0.005}%2C${lon + 0.005}%2C${lat + 0.005}&layer=mapnik&marker=${lat}%2C${lon}`;
    
    return html`
      <div class="map-container" style="height: ${mapHeight}px">
        <iframe
          src="${mapUrl}"
          style="border: 0; width: 100%; height: 100%;"
          loading="lazy"
          title="Tile Location Map"
        ></iframe>
      </div>
    `;
  }

  // Render attributes section
  private _renderAttributes(stateObj: { attributes: Record<string, unknown> }): TemplateResult | typeof nothing {
    const attrs = this._config.show_attributes || [];
    if (!attrs.length) return nothing;

    const displayAttrs = attrs.filter((attr) => 
      stateObj.attributes[attr] !== undefined
    );

    if (!displayAttrs.length) return nothing;

    return html`
      <div class="divider"></div>
      <div class="attributes">
        ${displayAttrs.map((attr) => this._renderAttribute(attr, stateObj.attributes[attr]))}
      </div>
    `;
  }

  // Render single attribute
  private _renderAttribute(name: string, value: unknown): TemplateResult {
    const displayName = this._formatAttributeName(name);
    const displayValue = this._formatAttributeValue(name, value);

    return html`
      <div class="attribute">
        <div class="attr-name">${displayName}</div>
        <div class="attr-value">${displayValue}</div>
      </div>
    `;
  }

  // Format attribute name
  private _formatAttributeName(name: string): string {
    return name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  // Format attribute value
  private _formatAttributeValue(name: string, value: unknown): string {
    if (value === null || value === undefined) return "Unknown";

    if (name === "last_seen" && typeof value === "string") {
      try {
        const date = new Date(value);
        return date.toLocaleString();
      } catch {
        return String(value);
      }
    }

    if ((name === "latitude" || name === "longitude") && typeof value === "number") {
      return value.toFixed(6);
    }

    return String(value);
  }

  // Get battery level
  private _getBatteryLevel(stateObj: { attributes: Record<string, unknown> }): number | null {
    const level = stateObj.attributes.battery_level;
    if (typeof level === "number") return level;
    if (typeof level === "string") {
      const parsed = parseInt(level, 10);
      return isNaN(parsed) ? null : parsed;
    }
    return null;
  }

  // Get battery info
  private _getBatteryInfo(
    level: number | null,
    status: string
  ): { icon: string; color: string; tooltip: string; text: string } {
    // Format status text for display (capitalize first letter)
    const formatStatus = (s: string): string => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
    
    if (level === null) {
      const statusLower = status.toLowerCase();
      if (statusLower.includes("full") || statusLower.includes("high")) {
        return { icon: BATTERY_ICONS.full, color: BATTERY_COLORS.high, tooltip: `Battery: ${status}`, text: formatStatus(status) };
      }
      if (statusLower.includes("medium") || statusLower.includes("ok")) {
        return { icon: BATTERY_ICONS[50], color: BATTERY_COLORS.medium, tooltip: `Battery: ${status}`, text: formatStatus(status) };
      }
      if (statusLower.includes("low")) {
        return { icon: BATTERY_ICONS[20], color: BATTERY_COLORS.low, tooltip: `Battery: ${status}`, text: formatStatus(status) };
      }
      // Show status text if available, otherwise empty for unknown
      return { icon: BATTERY_ICONS.unknown, color: "#9E9E9E", tooltip: `Battery: ${status}`, text: status !== "unknown" ? formatStatus(status) : "" };
    }

    let icon = BATTERY_ICONS.outline;
    let color = BATTERY_COLORS.low;

    if (level >= 95) { icon = BATTERY_ICONS.full; color = BATTERY_COLORS.high; }
    else if (level >= 85) { icon = BATTERY_ICONS[90]; color = BATTERY_COLORS.high; }
    else if (level >= 75) { icon = BATTERY_ICONS[80]; color = BATTERY_COLORS.high; }
    else if (level >= 65) { icon = BATTERY_ICONS[70]; color = BATTERY_COLORS.high; }
    else if (level >= 55) { icon = BATTERY_ICONS[60]; color = BATTERY_COLORS.high; }
    else if (level >= 45) { icon = BATTERY_ICONS[50]; color = BATTERY_COLORS.medium; }
    else if (level >= 35) { icon = BATTERY_ICONS[40]; color = BATTERY_COLORS.medium; }
    else if (level >= 25) { icon = BATTERY_ICONS[30]; color = BATTERY_COLORS.medium; }
    else if (level >= 15) { icon = BATTERY_ICONS[20]; color = BATTERY_COLORS.low; }
    else if (level >= 5) { icon = BATTERY_ICONS[10]; color = BATTERY_COLORS.low; }

    return { icon, color, tooltip: `Battery: ${level}%`, text: `${level}%` };
  }

  // Event handlers
  private _handleHeaderClick(ev: Event): void {
    ev.stopPropagation();
    fireEvent(this, "hass-more-info", { entityId: this._config.entity });
  }

  private _toggleConfig(ev: Event): void {
    ev.stopPropagation();
    this._showConfig = !this._showConfig;
    if (this._showConfig) {
      this._showComposer = false;
    }
  }

  private _toggleComposer(ev?: Event): void {
    ev?.stopPropagation();
    this._showComposer = !this._showComposer;
  }

  private _handleLostClick(ev: Event): void {
    ev.stopPropagation();
    
    const stateObj = this.hass.states[this._config.entity];
    const isLost = stateObj?.attributes?.lost === true;
    
    if (isLost) {
      // Already lost, just turn it off
      this._toggleLost(false);
    } else {
      // Show confirmation dialog before marking as lost
      this._showLostConfirm = true;
    }
  }

  private _confirmMarkLost(): void {
    this._showLostConfirm = false;
    this._toggleLost(true);
  }

  private _cancelLostConfirm(): void {
    this._showLostConfirm = false;
  }

  private _renderLostConfirmDialog(): TemplateResult {
    return html`
      <div class="confirm-overlay" @click=${this._cancelLostConfirm}>
        <div class="confirm-dialog" @click=${(e: Event) => e.stopPropagation()}>
          <div class="confirm-icon">🔍</div>
          <div class="confirm-title">Mark Tile as Lost?</div>
          <div class="confirm-message">
            This will notify Tile's community network to help locate your device.
            Your Tile will be flagged as lost in the Tile app and network.
          </div>
          <div class="confirm-actions">
            <button class="confirm-btn cancel" @click=${this._cancelLostConfirm}>Cancel</button>
            <button class="confirm-btn confirm" @click=${this._confirmMarkLost}>Mark as Lost</button>
          </div>
        </div>
      </div>
    `;
  }

  private _handleRingClick(ev: Event): void {
    ev.stopPropagation();
    
    if (this._isRingLoading) return;
    
    const entities = this._getRelatedEntities();
    const stateObj = this.hass.states[this._config.entity];
    const duration = stateObj?.attributes?.duration || 5;
    
    // Start loading state
    this._isRingLoading = true;
    
    // Clear any existing timer
    if (this._ringTimer) {
      clearTimeout(this._ringTimer);
    }
    
    // Set timer to stop loading after duration
    this._ringTimer = setTimeout(() => {
      this._isRingLoading = false;
      this._ringTimer = null;
    }, (duration as number) * 1000);
    
    // Press the locate button which uses default settings
    this.hass.callService("button", "press", {
      entity_id: entities.locateButton,
    });
  }

  // Config actions
  private _setVolume(volume: string): void {
    const entities = this._getRelatedEntities();
    console.info('[Tile Tracker Card] Setting volume:', volume, 'on entity:', entities.volumeEntity);
    this.hass.callService("select", "select_option", {
      entity_id: entities.volumeEntity,
      option: volume,
    });
  }

  private _setDuration(duration: number): void {
    const entities = this._getRelatedEntities();
    console.info('[Tile Tracker Card] Setting duration:', duration, 'on entity:', entities.durationEntity);
    this.hass.callService("number", "set_value", {
      entity_id: entities.durationEntity,
      value: duration,
    });
  }

  private _setSongOption(song: string): void {
    const entities = this._getRelatedEntities();
    console.info('[Tile Tracker Card] Setting song:', song, 'on entity:', entities.songEntity);
    this.hass.callService("select", "select_option", {
      entity_id: entities.songEntity,
      option: song,
    });
  }

  private _toggleLost(lost: boolean): void {
    const entities = this._getRelatedEntities();
    console.info('[Tile Tracker Card] Toggling lost:', lost, 'on entity:', entities.lostSwitch);
    this.hass.callService("switch", lost ? "turn_on" : "turn_off", {
      entity_id: entities.lostSwitch,
    });
  }

  private _programPreset(preset: string): void {
    const entities = this._getRelatedEntities();
    this.hass.callService("tile_tracker", "play_preset_song", {
      tile_id: entities.tileId,
      preset: preset,
    });
  }

  // Composer actions
  private _addNote(note: string): void {
    this._composerNotes = [...this._composerNotes, { note, duration: this._selectedDuration }];
  }

  private _addRest(): void {
    this._composerNotes = [...this._composerNotes, { note: 'Rest', duration: this._selectedDuration }];
  }

  private _removeNote(index: number): void {
    this._composerNotes = this._composerNotes.filter((_, i) => i !== index);
  }

  private _undoNote(): void {
    this._composerNotes = this._composerNotes.slice(0, -1);
  }

  private _clearNotes(): void {
    this._composerNotes = [];
  }

  private _programCustomSong(): void {
    if (this._composerNotes.length === 0) return;

    const entities = this._getRelatedEntities();
    const notation = this._composerNotes
      .map(n => n.note === 'Rest' ? `R:${n.duration}` : `${n.note}:${n.duration}`)
      .join(' | ');

    this.hass.callService("tile_tracker", "compose_song", {
      tile_id: entities.tileId,
      notation: notation,
      song_name: this._songName,
    });

    // Close composer after programming
    this._showComposer = false;
    this._composerNotes = [];
  }

  // Styles
  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: block;
      }

      ha-card {
        padding: 0;
        overflow: hidden;
      }

      .warning {
        padding: 16px;
        color: var(--warning-color, #ffc107);
        text-align: center;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        cursor: pointer;
      }

      .header:hover {
        background: var(--secondary-background-color);
      }

      .info {
        flex: 1;
        min-width: 0;
      }

      .name {
        font-weight: 500;
        font-size: 1.1em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .product {
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }

      .subtitle {
        display: flex;
        align-items: center;
        gap: 6px;
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }

      .last-seen {
        opacity: 0.8;
      }

      .controls {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .config-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        cursor: pointer;
        transition: background 0.2s;
      }

      .config-button:hover {
        background: var(--secondary-background-color);
      }

      .action-icon-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--btn-bg, var(--secondary-background-color));
        color: var(--btn-icon-color, var(--primary-text-color));
        border: none;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
      }

      .action-icon-button:hover:not(:disabled) {
        transform: scale(1.1);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }

      .action-icon-button:active:not(:disabled) {
        transform: scale(0.95);
      }

      .action-icon-button:disabled {
        cursor: not-allowed;
        opacity: 0.7;
      }

      .action-icon-button.active-ring {
        background: #4CAF50;
        color: white;
      }

      .action-icon-button.active-lost {
        background: var(--error-color, #f44336);
        color: white;
      }

      .action-icon-button.loading {
        background: var(--primary-color);
        color: white;
      }

      .action-icon-button ha-icon {
        --mdc-icon-size: 24px;
      }

      .action-icon-button ha-icon.spin {
        animation: spin 1s linear infinite;
      }

      /* Keep old class for backwards compatibility */
      .ring-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--ring-bg, var(--secondary-background-color));
        color: var(--ring-icon-color, var(--primary-text-color));
        border: none;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
      }

      /* Confirmation Dialog */
      .confirm-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
      }

      .confirm-dialog {
        background: var(--card-background-color, #fff);
        border-radius: 12px;
        padding: 24px;
        max-width: 320px;
        width: 90%;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        text-align: center;
      }

      .confirm-icon {
        font-size: 48px;
        margin-bottom: 16px;
      }

      .confirm-title {
        font-size: 1.2em;
        font-weight: 600;
        margin-bottom: 12px;
        color: var(--primary-text-color);
      }

      .confirm-message {
        font-size: 0.9em;
        color: var(--secondary-text-color);
        margin-bottom: 24px;
        line-height: 1.4;
      }

      .confirm-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
      }

      .confirm-btn {
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 0.95em;
        font-weight: 500;
        cursor: pointer;
        transition: opacity 0.2s;
        border: none;
      }

      .confirm-btn:hover {
        opacity: 0.9;
      }

      .confirm-btn.cancel {
        background: var(--secondary-background-color);
        color: var(--primary-text-color);
        border: 1px solid var(--divider-color);
      }

      .confirm-btn.confirm {
        background: var(--error-color, #f44336);
        color: white;
      }

      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      .battery {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .battery ha-icon {
        --mdc-icon-size: 24px;
      }

      .battery-text {
        font-size: 0.85em;
        color: var(--secondary-text-color);
      }

      .divider {
        height: 1px;
        background-color: var(--divider-color);
        margin: 0 16px;
      }

      /* Config Panel */
      .config-panel {
        padding: 16px;
        background: var(--secondary-background-color);
      }

      .config-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .config-title {
        font-weight: 500;
        font-size: 1.1em;
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 1.5em;
        cursor: pointer;
        color: var(--secondary-text-color);
        padding: 4px 8px;
      }

      .close-btn:hover {
        color: var(--primary-text-color);
      }

      .config-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }

      .config-item {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .config-item.full-width {
        grid-column: 1 / -1;
      }

      .config-item label {
        font-size: 0.85em;
        color: var(--secondary-text-color);
      }

      .config-item select,
      .config-item input[type="text"] {
        padding: 8px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
      }

      .config-item input[type="range"] {
        width: 100%;
      }

      .duration-value {
        font-size: 0.9em;
        color: var(--primary-color);
        font-weight: 500;
      }

      .song-row {
        display: flex;
        gap: 8px;
      }

      .song-row select {
        flex: 1;
      }

      .compose-btn {
        padding: 8px 12px;
        border: none;
        border-radius: 4px;
        background: var(--primary-color);
        cursor: pointer;
        font-size: 1.1em;
      }

      .compose-btn:hover {
        opacity: 0.9;
      }

      .preset-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
      }

      .preset-btn {
        padding: 8px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        cursor: pointer;
        font-size: 0.85em;
        transition: all 0.2s;
      }

      .preset-btn:hover {
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
        border-color: var(--primary-color);
      }

      /* Switch toggle */
      .switch {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 26px;
      }

      .switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .3s;
        border-radius: 26px;
      }

      .slider:before {
        position: absolute;
        content: "";
        height: 20px;
        width: 20px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: .3s;
        border-radius: 50%;
      }

      input:checked + .slider {
        background-color: var(--error-color, #f44336);
      }

      input:checked + .slider:before {
        transform: translateX(24px);
      }

      .lost-badge {
        color: var(--error-color, #f44336);
        font-size: 0.85em;
        font-weight: 500;
      }

      /* Song Composer */
      .composer-panel {
        padding: 16px;
        background: var(--secondary-background-color);
      }

      .composer-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .composer-title {
        font-weight: 500;
        font-size: 1.1em;
      }

      .composer-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
      }

      .composer-row label {
        font-size: 0.9em;
        color: var(--secondary-text-color);
        min-width: 100px;
      }

      .composer-row input[type="text"] {
        flex: 1;
        padding: 8px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
      }

      .duration-buttons {
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
      }

      .dur-btn {
        padding: 6px 10px;
        border: 2px solid var(--divider-color);
        border-radius: 4px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        cursor: pointer;
        font-size: 1em;
        transition: all 0.2s;
      }

      .dur-btn:hover {
        border-color: var(--primary-color);
      }

      .dur-btn.selected {
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
        border-color: var(--primary-color);
      }

      .rest-btn {
        background: var(--warning-color, #ffc107);
        border-color: var(--warning-color, #ffc107);
        color: #000;
      }

      /* Piano */
      .piano-wrapper {
        overflow-x: auto;
        margin: 12px 0;
      }

      .piano {
        display: flex;
        position: relative;
        height: 100px;
        min-width: 500px;
      }

      .white-key {
        width: 28px;
        height: 100%;
        background: linear-gradient(to bottom, #fff 0%, #f0f0f0 100%);
        border: 1px solid #ccc;
        border-radius: 0 0 4px 4px;
        cursor: pointer;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        padding-bottom: 4px;
        font-size: 8px;
        color: #666;
        user-select: none;
        transition: background 0.1s;
      }

      .white-key:hover {
        background: linear-gradient(to bottom, #e8f4fc 0%, #d0e8f0 100%);
      }

      .white-key:active {
        background: linear-gradient(to bottom, #4fc3f7 0%, #29b6f6 100%);
      }

      .black-key {
        width: 18px;
        height: 60%;
        background: linear-gradient(to bottom, #333 0%, #000 100%);
        border-radius: 0 0 3px 3px;
        position: absolute;
        z-index: 1;
        cursor: pointer;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        padding-bottom: 4px;
        font-size: 7px;
        color: #999;
        user-select: none;
        transition: background 0.1s;
      }

      .black-key:hover {
        background: linear-gradient(to bottom, #444 0%, #222 100%);
      }

      .black-key:active {
        background: linear-gradient(to bottom, #0277bd 0%, #01579b 100%);
      }

      /* Notes Display */
      .notes-display {
        background: var(--card-background-color);
        border-radius: 4px;
        padding: 12px;
        min-height: 50px;
        max-height: 100px;
        overflow-y: auto;
      }

      .empty-notes {
        color: var(--secondary-text-color);
        font-style: italic;
        font-size: 0.9em;
      }

      .note-chip {
        display: inline-block;
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
        padding: 4px 8px;
        border-radius: 12px;
        margin: 2px;
        font-size: 0.75em;
        cursor: pointer;
        transition: opacity 0.2s;
      }

      .note-chip.rest {
        background: var(--warning-color, #ffc107);
        color: #000;
      }

      .note-chip:hover {
        opacity: 0.7;
      }

      .notes-count {
        font-size: 0.8em;
        color: var(--secondary-text-color);
        margin-top: 8px;
      }

      .composer-actions {
        display: flex;
        gap: 8px;
        margin-top: 16px;
        flex-wrap: wrap;
      }

      .action-btn {
        padding: 10px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9em;
        font-weight: 500;
        transition: opacity 0.2s;
      }

      .action-btn:hover:not(:disabled) {
        opacity: 0.9;
      }

      .action-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .action-btn.primary {
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
        margin-left: auto;
      }

      .action-btn.secondary {
        background: var(--secondary-background-color);
        color: var(--primary-text-color);
        border: 1px solid var(--divider-color);
      }

      .action-btn.danger {
        background: var(--error-color, #f44336);
        color: #fff;
      }

      /* Map */
      .map-container {
        width: 100%;
        position: relative;
        overflow: hidden;
      }

      .map-container ha-map {
        height: 100%;
        width: 100%;
      }

      .map-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100px;
        color: var(--secondary-text-color);
        gap: 8px;
      }

      .map-placeholder ha-icon {
        --mdc-icon-size: 32px;
        opacity: 0.5;
      }

      /* Attributes */
      .attributes {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
        padding: 12px 16px;
      }

      .attribute {
        display: flex;
        flex-direction: column;
      }

      .attr-name {
        font-size: 0.8em;
        color: var(--secondary-text-color);
        text-transform: capitalize;
      }

      .attr-value {
        font-size: 0.95em;
        word-break: break-word;
      }

      @media (max-width: 500px) {
        .config-grid {
          grid-template-columns: 1fr;
        }

        .preset-grid {
          grid-template-columns: repeat(2, 1fr);
        }

        .attributes {
          grid-template-columns: 1fr;
        }
      }
    `;
  }
}

// Declare for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    "tile-tracker-card": TileTrackerCard;
  }
}
