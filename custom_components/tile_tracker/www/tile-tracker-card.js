// Build: 202601191530
        <ha-card>
          <div class="warning">
            Entity not found: ${t}
          </div>
        </ha-card>
      `;const o=this._config.name||e.attributes.friendly_name||t,i=e.attributes.product||e.attributes.tile_type||"Tile",s=e.attributes.ring_state||"silent",r=this._getBatteryLevel(e),n=e.attributes.battery_status,a=n&&"none"!==n.toLowerCase()?n:"unknown",c=e.attributes.last_timestamp,l=this._formatRelativeTime(c),d=!0===e.attributes.lost;return V`
      <ha-card>
        ${this._renderHeader(o,i,s,r,a,l,d)}
        ${this._config.show_map?this._renderMap(e):W}
        ${this._renderAttributes(e)}
        ${this._showConfig?this._renderConfigPanel():W}
        ${W&&this._showComposer?this._renderSongComposer():W}
      </ha-card>
    `}_renderHeader(t,e,o,i,s,r,n){const a="ringing"===o,c=this._getBatteryInfo(i,s),l=a?bt:"var(--secondary-background-color)",d=a?"white":"var(--primary-text-color)",h=this._isRingLoading?"mdi:loading":a?"mdi:bell-ring":"mdi:bell",p=n?"var(--error-color, #f44336)":"var(--secondary-background-color)",u=n?"white":"var(--primary-text-color)";return V`
      <div class="header" @click=${this._handleHeaderClick}>
        <div class="info">
          <div class="name">${t}</div>
          <div class="subtitle">
            <span class="product">${e}</span>
            ${r?V`<span class="last-seen">• ${r}</span>`:W}
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
            class="action-icon-button ${n?"active-lost":""}"
            style="--btn-bg: ${p}; --btn-icon-color: ${u}"
            @click=${this._handleLostClick}
            title="${n?"Tile is marked as lost":"Mark as lost"}"
          >
            <ha-icon icon="${n?"mdi:alert-circle":"mdi:crosshairs-question"}"></ha-icon>
          </button>
          <button
            class="action-icon-button ${a?"active-ring":""} ${this._isRingLoading?"loading":""}"
            style="--btn-bg: ${l}; --btn-icon-color: ${d}"
            @click=${this._handleRingClick}
            title="Ring Tile"
            ?disabled=${this._isRingLoading}
          >
            <ha-icon icon="${h}" class="${this._isRingLoading?"spin":""}"></ha-icon>
          </button>
          <div class="battery" title="${c.tooltip}">
            <ha-icon
              icon="${c.icon}"
              style="color: ${c.color}"
            ></ha-icon>
            <span class="battery-text" style="color: ${c.color}">${c.text}</span>
          </div>
        </div>
      </div>
      ${this._showLostConfirm?this._renderLostConfirmDialog():W}
    `}_renderConfigPanel(){const t=this._getRelatedEntities(),e=this.hass.states[t.volumeEntity],o=this.hass.states[t.durationEntity],i=this.hass.states[t.songEntity];this.hass.states[t.lostSwitch];const s=e?.state||"medium",r=o?.state||"5",n=i?.state||"Default",a=i?.attributes?.available_songs||[{id:0,name:"Default"},{id:1,name:"Chirp"}];return V`
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
                .value=${n}
                @change=${t=>this._setSongOption(t.target.value)}
              >
                ${a.map(t=>V`<option value="${t.name}" ?selected=${t.name===n}>${t.name}</option>`)}
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
              .value=${s}
              @change=${t=>this._setVolume(t.target.value)}
            >
              <option value="low" ?selected=${"low"===s}>🔈 Low</option>
              <option value="medium" ?selected=${"medium"===s}>🔉 Medium</option>
              <option value="high" ?selected=${"high"===s}>🔊 High</option>
            </select>
          </div>

          <!-- Default Duration -->
          <div class="config-item">
            <label>Default Duration (seconds)</label>
            <input 
              type="range" 
              min="1" 
              max="30" 
              .value=${r}
              @input=${t=>this._setDuration(parseInt(t.target.value))}
            />
            <span class="duration-value">${r}s</span>
          </div>
        </div>
      </div>
    `}_renderSongComposer(){return V`
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
            @input=${t=>this._songName=t.target.value}
            placeholder="My Custom Song"
          />
        </div>

        <!-- Duration Selector -->
        <div class="composer-row">
          <label>Note Duration:</label>
          <div class="duration-buttons">
            ${Lt.map(t=>V`
              <button 
                class="dur-btn ${t.value===this._selectedDuration?"selected":""}"
                @click=${()=>this._selectedDuration=t.value}
                title="${t.label}"
              >
                ${t.symbol}
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
          ${0===this._composerNotes.length?V`<span class="empty-notes">Click piano keys to add notes...</span>`:this._composerNotes.map((t,e)=>V`
                <span 
                  class="note-chip ${"Rest"===t.note?"rest":""}"
                  @click=${()=>this._removeNote(e)}
                  title="Click to remove"
                >
                  ${"Rest"===t.note?"🔇":t.note}:${t.duration}
                </span>
              `)}
        </div>
        <div class="notes-count">${this._composerNotes.length} notes</div>

        <!-- Composer Actions -->
        <div class="composer-actions">
          <button class="action-btn danger" @click=${this._clearNotes}>Clear</button>
          <button class="action-btn secondary" @click=${this._undoNote} ?disabled=${0===this._composerNotes.length}>Undo</button>
          <button class="action-btn secondary" @click=${this._toggleComposer}>Cancel</button>
          <button 
            class="action-btn primary" 
            @click=${this._programCustomSong}
            ?disabled=${0===this._composerNotes.length}
          >
            Program to Tile
          </button>
        </div>
      </div>
    `}_renderPianoKeys(){const t=Dt.filter(t=>!t.includes("#"));return V`
      ${t.map((t,e)=>{const o=Dt.find(e=>e.startsWith(t[0])&&e.includes("#")&&e.endsWith(t.slice(-1)));return V`
          <div class="white-key" @click=${()=>this._addNote(t)} data-note="${t}">
            ${t}
          </div>
          ${o?V`
            <div 
              class="black-key" 
              @click=${t=>{t.stopPropagation(),this._addNote(o)}}
              style="left: ${28*(e+1)-9}px"
            >
              ${o.replace("#","♯")}
            </div>
          `:W}
        `})}
    `}_renderMap(t){const e=t.attributes.latitude,o=t.attributes.longitude;if(!e||!o)return V`
        <div class="map-placeholder">
          <ha-icon icon="mdi:map-marker-question"></ha-icon>
          <span>Location unavailable</span>
        </div>
      `;const i=this._config.map_height||150;return V`
      <div class="map-container" style="height: ${i}px">
        <iframe
          src="${`https://www.openstreetmap.org/export/embed.html?bbox=${o-.005}%2C${e-.005}%2C${o+.005}%2C${e+.005}&layer=mapnik&marker=${e}%2C${o}`}"
          style="border: 0; width: 100%; height: 100%;"
          loading="lazy"
          title="Tile Location Map"
        ></iframe>
      </div>
    `}_renderAttributes(t){const e=this._config.show_attributes||[];if(!e.length)return W;const o=e.filter(e=>void 0!==t.attributes[e]);return o.length?V`
      <div class="divider"></div>
      <div class="attributes">
        ${o.map(e=>this._renderAttribute(e,t.attributes[e]))}
      </div>
    `:W}_renderAttribute(t,e){const o=this._formatAttributeName(t),i=this._formatAttributeValue(t,e);return V`
      <div class="attribute">
        <div class="attr-name">${o}</div>
        <div class="attr-value">${i}</div>
      </div>
    `}_formatAttributeName(t){return t.split("_").map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" ")}_formatAttributeValue(t,e){if(null==e)return"Unknown";if("last_seen"===t&&"string"==typeof e)try{return new Date(e).toLocaleString()}catch{return String(e)}return"latitude"!==t&&"longitude"!==t||"number"!=typeof e?String(e):e.toFixed(6)}_getBatteryLevel(t){const e=t.attributes.battery_level;if("number"==typeof e)return e;if("string"==typeof e){const t=parseInt(e,10);return isNaN(t)?null:t}return null}_getBatteryInfo(t,e){const o=t=>t?t.charAt(0).toUpperCase()+t.slice(1).toLowerCase():"";if(null===t){const t=e.toLowerCase();return t.includes("full")||t.includes("high")?{icon:$t,color:_t,tooltip:`Battery: ${e}`,text:o(e)}:t.includes("medium")||t.includes("ok")?{icon:At,color:vt,tooltip:`Battery: ${e}`,text:o(e)}:t.includes("low")?{icon:Nt,color:yt,tooltip:`Battery: ${e}`,text:o(e)}:{icon:Rt,color:"#9E9E9E",tooltip:`Battery: ${e}`,text:"unknown"!==e?o(e):""}}let i=Pt,s=yt;return t>=95?(i=$t,s=_t):t>=85?(i=xt,s=_t):t>=75?(i=wt,s=_t):t>=65?(i=kt,s=_t):t>=55?(i=Ct,s=_t):t>=45?(i=At,s=vt):t>=35?(i=Et,s=vt):t>=25?(i=St,s=vt):t>=15?(i=Nt,s=yt):t>=5&&(i=Tt,s=yt),{icon:i,color:s,tooltip:`Battery: ${t}%`,text:`${t}%`}}_handleHeaderClick(t){t.stopPropagation(),ft(this,"hass-more-info",{entityId:this._config.entity})}_toggleConfig(t){t.stopPropagation(),this._showConfig=!this._showConfig,this._showConfig&&(this._showComposer=!1)}_toggleComposer(t){t?.stopPropagation(),this._showComposer=!this._showComposer}_handleLostClick(t){t.stopPropagation();const e=this.hass.states[this._config.entity];!0===e?.attributes?.lost?this._toggleLost(!1):this._showLostConfirm=!0}_confirmMarkLost(){this._showLostConfirm=!1,this._toggleLost(!0)}_cancelLostConfirm(){this._showLostConfirm=!1}_renderLostConfirmDialog(){return V`
      <div class="confirm-overlay" @click=${this._cancelLostConfirm}>
        <div class="confirm-dialog" @click=${t=>t.stopPropagation()}>
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
    `}_handleRingClick(t){if(t.stopPropagation(),this._isRingLoading)return;const e=this._getRelatedEntities(),o=this.hass.states[this._config.entity],i=o?.attributes?.duration||5;this._isRingLoading=!0,this._ringTimer&&clearTimeout(this._ringTimer),this._ringTimer=setTimeout(()=>{this._isRingLoading=!1,this._ringTimer=null},1e3*i),this.hass.callService("button","press",{entity_id:e.locateButton})}_setVolume(t){const e=this._getRelatedEntities();this.hass.callService("select","select_option",{entity_id:e.volumeEntity,option:t})}_setDuration(t){const e=this._getRelatedEntities();this.hass.callService("number","set_value",{entity_id:e.durationEntity,value:t})}_setSongOption(t){const e=this._getRelatedEntities();this.hass.callService("select","select_option",{entity_id:e.songEntity,option:t})}_toggleLost(t){const e=this._getRelatedEntities();this.hass.callService("switch",t?"turn_on":"turn_off",{entity_id:e.lostSwitch})}_programPreset(t){const e=this._getRelatedEntities();this.hass.callService("tile_tracker","play_preset_song",{tile_id:e.tileId,preset:t})}_addNote(t){this._composerNotes=[...this._composerNotes,{note:t,duration:this._selectedDuration}]}_addRest(){this._composerNotes=[...this._composerNotes,{note:"Rest",duration:this._selectedDuration}]}_removeNote(t){this._composerNotes=this._composerNotes.filter((e,o)=>o!==t)}_undoNote(){this._composerNotes=this._composerNotes.slice(0,-1)}_clearNotes(){this._composerNotes=[]}_programCustomSong(){if(0===this._composerNotes.length)return;const t=this._getRelatedEntities(),e=this._composerNotes.map(t=>"Rest"===t.note?`R:${t.duration}`:`${t.note}:${t.duration}`).join(" | ");this.hass.callService("tile_tracker","compose_song",{tile_id:t.tileId,notation:e,song_name:this._songName}),this._showComposer=!1,this._composerNotes=[]}static get styles(){return n`
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
    `}};t([pt({attribute:!1})],zt.prototype,"hass",void 0),t([ut()],zt.prototype,"_config",void 0),t([ut()],zt.prototype,"_showConfig",void 0),t([ut()],zt.prototype,"_showComposer",void 0),t([ut()],zt.prototype,"_composerNotes",void 0),t([ut()],zt.prototype,"_selectedDuration",void 0),t([ut()],zt.prototype,"_songName",void 0),t([ut()],zt.prototype,"_isRingLoading",void 0),t([ut()],zt.prototype,"_showLostConfirm",void 0),zt=t([lt("tile-tracker-card")],zt);const Ot=[{value:"last_seen",label:"Last Seen"},{value:"latitude",label:"Latitude"},{value:"longitude",label:"Longitude"},{value:"source_type",label:"Source Type"},{value:"tile_id",label:"Tile ID"},{value:"battery_status",label:"Battery Status"},{value:"ring_state",label:"Ring State"},{value:"voip_state",label:"VoIP State"},{value:"firmware_version",label:"Firmware Version"},{value:"hardware_version",label:"Hardware Version"}];let Ut=class extends at{setConfig(t){this._config=t}_getDeviceTrackers(){return this.hass?Object.keys(this.hass.states).filter(t=>t.startsWith("device_tracker.")).filter(t=>{const e=this.hass.states[t];return"tile"===e.attributes?.source||void 0!==e.attributes?.tile_id||t.toLowerCase().includes("tile")}).sort():[]}render(){if(!this.hass||!this._config)return V``;const t=this._getDeviceTrackers(),e=Object.keys(this.hass.states).filter(t=>t.startsWith("device_tracker.")).sort();return V`
      <div class="card-config">
        <div class="field">
          <label>Entity *</label>
          <select
            .value=${this._config.entity||""}
            @change=${this._entityChanged}
          >
            <option value="">Select a Tile tracker...</option>
            ${t.length>0?V`
              <optgroup label="Tile Trackers">
                ${t.map(t=>V`
                  <option value=${t} ?selected=${this._config.entity===t}>
                    ${this.hass.states[t]?.attributes?.friendly_name||t}
                  </option>
                `)}
              </optgroup>
            `:W}
            ${e.length>t.length?V`
              <optgroup label="Other Device Trackers">
                ${e.filter(e=>!t.includes(e)).map(t=>V`
                    <option value=${t} ?selected=${this._config.entity===t}>
                      ${this.hass.states[t]?.attributes?.friendly_name||t}
                    </option>
                  `)}
              </optgroup>
            `:W}
          </select>
        </div>

        <div class="field">
          <label>Name (optional)</label>
          <input
            type="text"
            .value=${this._config.name||""}
            @input=${this._nameChanged}
            placeholder="Override display name"
          />
        </div>

        <div class="field checkbox">
          <label>
            <input
              type="checkbox"
              .checked=${!1!==this._config.show_map}
              @change=${this._showMapChanged}
            />
            Show Map
          </label>
        </div>

        ${!1!==this._config.show_map?V`
          <div class="field">
            <label>Map Height (px)</label>
            <input
              type="number"
              min="50"
              max="500"
              .value=${this._config.map_height||150}
              @input=${this._mapHeightChanged}
            />
          </div>
        `:W}

        <div class="field">
          <label>Attributes to Display</label>
          <div class="checkboxes">
            ${Ot.map(t=>V`
              <label class="checkbox-item">
                <input
                  type="checkbox"
                  .checked=${(this._config.show_attributes||[]).includes(t.value)}
                  @change=${e=>this._attributeChanged(t.value,e.target.checked)}
                />
                ${t.label}
              </label>
            `)}
          </div>
        </div>
      </div>
    `}_entityChanged(t){const e=t.target.value;e!==this._config.entity&&this._updateConfig({entity:e})}_nameChanged(t){const e=t.target.value;if(e!==this._config.name)if(e)this._updateConfig({name:e});else{const t={...this._config};delete t.name,this._config=t,ft(this,"config-changed",{config:this._config})}}_showMapChanged(t){const e=t.target.checked;this._updateConfig({show_map:e})}_mapHeightChanged(t){const e=parseInt(t.target.value,10);isNaN(e)||e===this._config.map_height||this._updateConfig({map_height:e})}_attributeChanged(t,e){const o=this._config.show_attributes||[];let i;if(e&&!o.includes(t))i=[...o,t];else{if(e||!o.includes(t))return;i=o.filter(e=>e!==t)}this._updateConfig({show_attributes:i})}_updateConfig(t){this._config={...this._config,...t},ft(this,"config-changed",{config:this._config})}static get styles(){return n`
      .card-config {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 16px;
      }

      .field {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .field > label {
        font-weight: 500;
        font-size: 0.9em;
        color: var(--primary-text-color);
      }

      .field.checkbox > label {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
      }

      input[type="text"],
      input[type="number"],
      select {
        padding: 8px 12px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font-size: 1em;
      }

      input[type="text"]:focus,
      input[type="number"]:focus,
      select:focus {
        outline: none;
        border-color: var(--primary-color);
      }

      .checkboxes {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
      }

      .checkbox-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.9em;
        cursor: pointer;
      }

      .checkbox-item input {
        cursor: pointer;
      }

      @media (max-width: 400px) {
        .checkboxes {
          grid-template-columns: 1fr;
        }
      }
    `}};t([pt({attribute:!1})],Ut.prototype,"hass",void 0),t([ut()],Ut.prototype,"_config",void 0),Ut=t([lt("tile-tracker-card-editor")],Ut);var Ht=Object.freeze({__proto__:null,get TileTrackerCardEditor(){return Ut}});export{zt as TileTrackerCard};
