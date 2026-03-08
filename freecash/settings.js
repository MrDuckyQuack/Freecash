// ==UserScript==
// @name         Freecash Progress Settings UI
// @namespace    freecash-settings-ui
// @version      1.6
// @description  Settings UI for Freecash Progress Script with auto-save
// @author       DuckyQuack
// @match        https://freecash.com/*
// @match        https://www.freecash.com/*
// @run-at       document-idle
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  'use strict';

  console.log('⚙️ Settings UI loaded');

  // Wait for main script to be ready
  function waitForMainScript() {
    if (typeof window.updateConfig === 'function' && typeof window.saveConfig === 'function') {
      initSettingsUI();
    } else {
      setTimeout(waitForMainScript, 100);
    }
  }

  function initSettingsUI() {
    // Add settings modal styles
    GM_addStyle(`
      /* Settings Modal Styles */
      .fc-settings-modal {
        position: fixed;
        bottom: 140px;
        right: 20px;
        width: 350px;
        background: rgba(20, 20, 30, 0.98);
        backdrop-filter: blur(10px);
        border: 2px solid #10b981;
        border-radius: 20px;
        padding: 0;
        z-index: 999999;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5), 0 0 30px rgba(16,185,129,0.3);
        animation: modalSlideUp 0.3s ease;
        color: white;
        font-family: 'Segoe UI', system-ui, sans-serif;
        overflow: hidden;
        transition: opacity 0.3s ease, transform 0.3s ease;
      }

      .fc-settings-modal.closing {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
        pointer-events: none;
      }

      @keyframes modalSlideUp {
        from {
          opacity: 0;
          transform: translateY(20px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .fc-settings-modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px 20px;
        background: rgba(16,185,129,0.1);
        border-bottom: 2px solid rgba(16,185,129,0.3);
      }

      .fc-settings-modal-header h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        background: linear-gradient(90deg, #10b981, #34d399);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .fc-settings-modal-close {
        background: none;
        border: none;
        color: #9ca3af;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s ease;
      }

      .fc-settings-modal-close:hover {
        background: rgba(255,255,255,0.1);
        color: white;
        transform: rotate(90deg);
      }

      /* Tab Navigation */
      .fc-settings-tabs {
        display: flex;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        background: rgba(0,0,0,0.2);
      }

      .fc-settings-tab {
        flex: 1;
        padding: 12px;
        background: none;
        border: none;
        color: #9ca3af;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }

      .fc-settings-tab:hover {
        color: #10b981;
        background: rgba(16,185,129,0.1);
      }

      .fc-settings-tab.active {
        color: #10b981;
        border-bottom: 3px solid #10b981;
      }

      /* Tab Content */
      .fc-settings-tab-content {
        padding: 20px;
        max-height: 400px;
        overflow-y: auto;
      }

      /* Coming Soon Tab */
      .fc-coming-soon-duck {
        font-size: 48px;
        margin-bottom: 15px;
        animation: duckFloat 2s ease-in-out infinite;
      }

      @keyframes duckFloat {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-10px) rotate(5deg); }
      }

      .fc-coming-soon-text {
        font-size: 28px;
        font-weight: bold;
        background: linear-gradient(90deg, #10b981, #34d399, #10b981);
        background-size: 200% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: textShine 2s linear infinite;
        margin: 10px 0;
      }

      @keyframes textShine {
        0% { background-position: 0% center; }
        100% { background-position: 200% center; }
      }

      .fc-progress-bar {
        width: 100%;
        height: 6px;
        background: rgba(255,255,255,0.1);
        border-radius: 3px;
        overflow: hidden;
        margin: 15px 0;
      }

      .fc-progress-fill {
        height: 100%;
        width: 33%;
        background: linear-gradient(90deg, #10b981, #34d399);
        border-radius: 3px;
        animation: progressPulse 1.5s ease infinite;
      }

      @keyframes progressPulse {
        0%, 100% { opacity: 0.8; }
        50% { opacity: 1; }
      }

      /* Support Tab Styles */
      .fc-support-section {
        padding: 5px 0;
      }

      .fc-support-card {
        background: rgba(255,255,255,0.05);
        border-radius: 12px;
        padding: 15px;
        margin-bottom: 15px;
        border: 1px solid rgba(16,185,129,0.2);
      }

      .fc-support-card h4 {
        margin: 0 0 10px 0;
        color: #10b981;
        font-size: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      /* FAQ Accordion Styles */
      .fc-faq-item {
        margin-bottom: 10px;
        border-radius: 8px;
        overflow: hidden;
        background: rgba(0,0,0,0.2);
      }

      .fc-faq-question {
        font-weight: 600;
        color: #10b981;
        padding: 12px 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        cursor: pointer;
        transition: all 0.2s ease;
        user-select: none;
      }

      .fc-faq-question:hover {
        background: rgba(16,185,129,0.1);
      }

      .fc-faq-question-content {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .fc-faq-arrow {
        font-size: 12px;
        transition: transform 0.3s ease;
        color: #10b981;
      }

      .fc-faq-item.expanded .fc-faq-arrow {
        transform: rotate(90deg);
      }

      .fc-faq-answer {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease, padding 0.3s ease;
        background: rgba(0,0,0,0.3);
        color: #d1d5db;
        font-size: 13px;
        line-height: 1.5;
        padding: 0 15px;
      }

      .fc-faq-item.expanded .fc-faq-answer {
        max-height: 200px;
        padding: 12px 15px;
      }

      .fc-discord-link {
        display: flex;
        align-items: center;
        gap: 10px;
        background: #5865F2;
        color: white;
        padding: 12px 15px;
        border-radius: 10px;
        text-decoration: none;
        margin: 15px 0;
        transition: all 0.3s ease;
        font-weight: 500;
      }

      .fc-discord-link:hover {
        background: #4752c4;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(88, 101, 242, 0.4);
      }

      .fc-pm-note {
        background: rgba(16,185,129,0.1);
        border-left: 4px solid #10b981;
        padding: 12px 15px;
        border-radius: 8px;
        margin: 15px 0;
        font-size: 13px;
        color: #d1d5db;
      }

      .fc-pm-note strong {
        color: #10b981;
      }

      .fc-contact-options {
        display: flex;
        gap: 10px;
        margin-top: 15px;
      }

      .fc-contact-btn {
        flex: 1;
        padding: 10px;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }

      .fc-contact-btn.primary {
        background: #10b981;
        color: white;
      }

      .fc-contact-btn.primary:hover {
        background: #0d9668;
        transform: translateY(-2px);
      }

      .fc-contact-btn.secondary {
        background: rgba(255,255,255,0.1);
        color: white;
      }

      .fc-contact-btn.secondary:hover {
        background: rgba(255,255,255,0.2);
        transform: translateY(-2px);
      }

      /* Performance Tab Styles */
      .fc-performance-section {
        padding: 5px 0;
      }

      .fc-setting-group {
        background: rgba(255,255,255,0.05);
        border-radius: 12px;
        padding: 15px;
        margin-bottom: 15px;
      }

      .fc-setting-group h4 {
        margin: 0 0 15px 0;
        color: #10b981;
        font-size: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
        border-bottom: 1px solid rgba(16,185,129,0.3);
        padding-bottom: 8px;
      }

      .fc-setting-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
        padding: 5px 0;
      }

      .fc-setting-label {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #e5e7eb;
        font-size: 14px;
      }

      .fc-setting-label span {
        font-size: 1.2em;
      }

      /* Circular Toggle Switch - IMPROVED */
      .fc-toggle {
        position: relative;
        display: inline-block;
        width: 52px;
        height: 28px;
        flex-shrink: 0;
      }

      .fc-toggle input {
        opacity: 0;
        width: 0;
        height: 0;
        position: absolute;
      }

      .fc-toggle-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #4b5563;
        transition: .3s;
        border-radius: 34px;
        box-shadow: inset 0 1px 3px rgba(0,0,0,0.3);
      }

      .fc-toggle-slider:before {
        position: absolute;
        content: "";
        height: 24px;
        width: 24px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        transition: .3s;
        border-radius: 50%;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      }

      input:checked + .fc-toggle-slider {
        background-color: #10b981;
      }

      input:checked + .fc-toggle-slider:before {
        transform: translateX(24px);
      }

      /* Select Dropdown */
      .fc-select {
        background: rgba(0,0,0,0.3);
        border: 1px solid #10b981;
        color: white;
        padding: 8px 16px;
        border-radius: 30px;
        font-size: 13px;
        cursor: pointer;
        outline: none;
        min-width: 100px;
        appearance: none;
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2310b981' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");
        background-repeat: no-repeat;
        background-position: right 10px center;
        background-size: 16px;
      }

      .fc-select option {
        background: #1f2937;
        color: white;
      }

      /* Slider */
      .fc-slider-container {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .fc-slider {
        width: 120px;
        height: 6px;
        background: #4b5563;
        border-radius: 6px;
        outline: none;
        -webkit-appearance: none;
      }

      .fc-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 20px;
        height: 20px;
        background: #10b981;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        border: 2px solid white;
      }

      .fc-slider::-webkit-slider-thumb:hover {
        transform: scale(1.15);
        box-shadow: 0 0 15px #10b981;
      }

      .fc-slider-value {
        color: #10b981;
        font-weight: bold;
        min-width: 35px;
        display: inline-block;
        text-align: center;
        background: rgba(16,185,129,0.1);
        padding: 4px 8px;
        border-radius: 20px;
        font-size: 13px;
      }

      .fc-setting-description {
        font-size: 12px;
        color: #9ca3af;
        margin-top: 4px;
        padding-left: 32px;
      }

      .fc-save-btn {
        width: 100%;
        padding: 12px;
        background: linear-gradient(135deg, #10b981, #059669);
        border: none;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .fc-save-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(16,185,129,0.4);
      }

      .fc-save-btn:active {
        transform: translateY(0);
      }

      .fc-settings-modal-footer {
        padding: 12px 20px;
        border-top: 1px solid rgba(255,255,255,0.1);
        text-align: center;
        font-size: 12px;
        color: #6b7280;
        background: rgba(0,0,0,0.2);
      }

      .fc-settings-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        backdrop-filter: blur(4px);
        z-index: 999998;
        animation: fadeIn 0.2s ease;
        transition: opacity 0.3s ease;
      }

      .fc-settings-modal-overlay.closing {
        opacity: 0;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      /* Fix for settings button not being blurred */
      .fc-settings-btn {
        backdrop-filter: none !important;
        filter: none !important;
        -webkit-backdrop-filter: none !important;
      }
    `);

    // Create modal elements
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'fc-settings-modal-overlay';
    modalOverlay.id = 'fc-settings-modal-overlay';
    modalOverlay.style.display = 'none';

    const modal = document.createElement('div');
    modal.className = 'fc-settings-modal';
    modal.id = 'fc-settings-modal';
    
    // Get current config from main script or localStorage
    function loadConfigFromStorage() {
      try {
        const savedConfig = localStorage.getItem('freecashProgressConfig');
        if (savedConfig) {
          return JSON.parse(savedConfig);
        }
      } catch (e) {
        console.error('Error loading config from storage:', e);
      }
      return null;
    }

    // Load config with priority: window.userConfig > localStorage > defaults
    const storedConfig = loadConfigFromStorage();
    const currentConfig = window.userConfig || storedConfig || {
      animationsEnabled: true,
      numberRollEnabled: true,
      duckDanceEnabled: true,
      borderPulseEnabled: true,
      showEmojis: true,
      decimalPrecision: 4,
      updateSpeed: 'normal'
    };

    // Build modal with tabs
    modal.innerHTML = `
      <div class="fc-settings-modal-header">
        <h3>
          <span>🦆</span>
          DuckyQuack Settings
        </h3>
        <button class="fc-settings-modal-close" id="fc-settings-modal-close">✕</button>
      </div>
      
      <div class="fc-settings-tabs">
        <button class="fc-settings-tab active" data-tab="main">
          <span>🏠</span> Main
        </button>
        <button class="fc-settings-tab" data-tab="performance">
          <span>⚡</span> Performance
        </button>
        <button class="fc-settings-tab" data-tab="support">
          <span>❓</span> Support
        </button>
      </div>
      
      <!-- Main Tab Content (Coming Soon) -->
      <div class="fc-settings-tab-content" id="fc-tab-main">
        <div style="text-align: center;">
          <div class="fc-coming-soon-duck">🦆✨</div>
          <div class="fc-coming-soon-text">Coming Soon!</div>
          <div class="fc-progress-bar">
            <div class="fc-progress-fill"></div>
          </div>
          <div style="color: #9ca3af; font-size: 14px; margin: 15px 0;">
            More features are being cooked...
          </div>
          <div style="font-size: 24px; opacity: 0.5;">
            ⚙️ 🎨 🛠️
          </div>
        </div>
      </div>
      
      <!-- Performance Tab Content -->
      <div class="fc-settings-tab-content" id="fc-tab-performance" style="display: none;">
        <div class="fc-performance-section">
          <div class="fc-setting-group">
            <h4><span>🎨</span> Visual Effects</h4>
            
            <div class="fc-setting-item">
              <span class="fc-setting-label">
                <span>🔄</span> Enable All Animations
              </span>
              <label class="fc-toggle">
                <input type="checkbox" id="fc-toggle-animations" ${currentConfig.animationsEnabled ? 'checked' : ''}>
                <span class="fc-toggle-slider"></span>
              </label>
            </div>
            <div class="fc-setting-description">Master switch for all animations</div>
            
            <div class="fc-setting-item">
              <span class="fc-setting-label">
                <span>🔢</span> Number Roll Effect
              </span>
              <label class="fc-toggle">
                <input type="checkbox" id="fc-toggle-number-roll" ${currentConfig.numberRollEnabled ? 'checked' : ''}>
                <span class="fc-toggle-slider"></span>
              </label>
            </div>
            <div class="fc-setting-description">Smooth counting animation when numbers change</div>
            
            <div class="fc-setting-item">
              <span class="fc-setting-label">
                <span>🦆</span> Duck Dance at 100%
              </span>
              <label class="fc-toggle">
                <input type="checkbox" id="fc-toggle-duck-dance" ${currentConfig.duckDanceEnabled ? 'checked' : ''}>
                <span class="fc-toggle-slider"></span>
              </label>
            </div>
            <div class="fc-setting-description">Celebration animation when reaching 100%</div>
            
            <div class="fc-setting-item">
              <span class="fc-setting-label">
                <span>💫</span> Border Pulse Effect
              </span>
              <label class="fc-toggle">
                <input type="checkbox" id="fc-toggle-border-pulse" ${currentConfig.borderPulseEnabled ? 'checked' : ''}>
                <span class="fc-toggle-slider"></span>
              </label>
            </div>
            <div class="fc-setting-description">Pulsing glow effect on progress borders</div>
            
            <div class="fc-setting-item">
              <span class="fc-setting-label">
                <span>😊</span> Show Progress Emojis
              </span>
              <label class="fc-toggle">
                <input type="checkbox" id="fc-toggle-emojis" ${currentConfig.showEmojis ? 'checked' : ''}>
                <span class="fc-toggle-slider"></span>
              </label>
            </div>
            <div class="fc-setting-description">Display emojis based on progress (🥚, 🐢, 🚀, etc.)</div>
          </div>
          
          <div class="fc-setting-group">
            <h4><span>⚙️</span> Performance Settings</h4>
            
            <div class="fc-setting-item">
              <span class="fc-setting-label">
                <span>🎯</span> Decimal Precision
              </span>
              <div class="fc-slider-container">
                <input type="range" id="fc-slider-precision" class="fc-slider" min="0" max="6" value="${currentConfig.decimalPrecision}" step="1">
                <span class="fc-slider-value" id="fc-precision-value">${currentConfig.decimalPrecision}</span>
              </div>
            </div>
            <div class="fc-setting-description">Number of decimal places to show (0-6)</div>
            
            <div class="fc-setting-item">
              <span class="fc-setting-label">
                <span>⏱️</span> Update Speed
              </span>
              <select id="fc-select-speed" class="fc-select">
                <option value="slow" ${currentConfig.updateSpeed === 'slow' ? 'selected' : ''}>Slow</option>
                <option value="normal" ${currentConfig.updateSpeed === 'normal' ? 'selected' : ''}>Normal</option>
                <option value="fast" ${currentConfig.updateSpeed === 'fast' ? 'selected' : ''}>Fast</option>
              </select>
            </div>
            <div class="fc-setting-description">How frequently progress updates (fast may use more CPU)</div>
          </div>
          
          <button class="fc-save-btn" id="fc-save-settings">
            <span>💾</span> Save Settings
          </button>
        </div>
      </div>
      
      <!-- Support Tab Content -->
      <div class="fc-settings-tab-content" id="fc-tab-support" style="display: none;">
        <div class="fc-support-section">
          <div class="fc-support-card">
            <h4><span>❓</span> Frequently Asked Questions</h4>
            
            <div class="fc-faq-item" id="faq-1">
              <div class="fc-faq-question">
                <span class="fc-faq-question-content">
                  <span>🦆</span> Why isn't my progress showing?
                </span>
                <span class="fc-faq-arrow">▶</span>
              </div>
              <div class="fc-faq-answer">
                Make sure you're on a page with progress bars (like offers). The script automatically detects them. Try refreshing the page.
              </div>
            </div>
            
            <div class="fc-faq-item" id="faq-2">
              <div class="fc-faq-question">
                <span class="fc-faq-question-content">
                  <span>🎨</span> Can I change the colors?
                </span>
                <span class="fc-faq-arrow">▶</span>
              </div>
              <div class="fc-faq-answer">
                Coming soon! Check the Performance tab for animation settings. Color customization will be in a future update.
              </div>
            </div>
            
            <div class="fc-faq-item" id="faq-3">
              <div class="fc-faq-question">
                <span class="fc-faq-question-content">
                  <span>⚡</span> The script is slowing down my browser
                </span>
                <span class="fc-faq-arrow">▶</span>
              </div>
              <div class="fc-faq-answer">
                Go to the Performance tab and disable animations or reduce update speed. You can also turn off individual effects.
              </div>
            </div>
            
            <div class="fc-faq-item" id="faq-4">
              <div class="fc-faq-question">
                <span class="fc-faq-question-content">
                  <span>🔄</span> How do I reset settings?
                </span>
                <span class="fc-faq-arrow">▶</span>
              </div>
              <div class="fc-faq-answer">
                Click "Reset to Defaults" in the Performance tab, or clear your browser's localStorage for this site.
              </div>
            </div>
          </div>
          
          <div class="fc-support-card">
            <h4><span>💬</span> Need More Help?</h4>
            
            <a href="https://discord.gg/Y3zZrnEEN4" target="_blank" class="fc-discord-link">
              <span>💬</span>
              <span style="flex: 1;">Join Freecash Discord</span>
              <span>↗</span>
            </a>
            
            <div class="fc-pm-note">
              <strong>📨 DuckyQuack Support:</strong><br>
              Once you're in the Freecash Discord, send a Private Message to <strong>@real_mr.duck</strong> with:
              <ul style="margin-top: 8px; padding-left: 20px;">
                <li>A description of your issue</li>
                <li>Screenshots (if applicable)</li>
                <li>Your browser name and version</li>
              </ul>
              I'll get back to you as soon as possible! 🦆
            </div>
            
            <div class="fc-contact-options">
              <button class="fc-contact-btn primary" id="fc-copy-username">
                <span>📋</span> Copy Username
              </button>
              <button class="fc-contact-btn secondary" id="fc-open-discord">
                <span>💬</span> Open Discord
              </button>
            </div>
          </div>
          
          <div class="fc-support-card">
            <h4><span>🐛</span> Report a Bug</h4>
            <div style="color: #d1d5db; font-size: 13px; line-height: 1.6;">
              Found a bug? Please message me on Discord with:
              <ul style="margin-top: 8px; padding-left: 20px;">
                <li>What happened</li>
                <li>What you expected to happen</li>
                <li>Steps to reproduce</li>
                <li>Browser and OS</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div class="fc-settings-modal-footer">
        Made with 🦆 by DuckyQuack | v3.5
      </div>
    `;

    document.body.appendChild(modalOverlay);
    document.body.appendChild(modal);

    // Hide modal initially
    modal.style.display = 'none';
    modalOverlay.style.display = 'none';

    // Function to load settings into UI
    function loadSettingsIntoUI() {
      // Get the latest config from main script or localStorage
      const latestStored = loadConfigFromStorage();
      const latestConfig = window.userConfig || latestStored || currentConfig;
      
      // Update all toggle switches
      const animationsToggle = document.getElementById('fc-toggle-animations');
      if (animationsToggle) animationsToggle.checked = latestConfig.animationsEnabled !== false;
      
      const numberRollToggle = document.getElementById('fc-toggle-number-roll');
      if (numberRollToggle) numberRollToggle.checked = latestConfig.numberRollEnabled !== false;
      
      const duckDanceToggle = document.getElementById('fc-toggle-duck-dance');
      if (duckDanceToggle) duckDanceToggle.checked = latestConfig.duckDanceEnabled !== false;
      
      const borderPulseToggle = document.getElementById('fc-toggle-border-pulse');
      if (borderPulseToggle) borderPulseToggle.checked = latestConfig.borderPulseEnabled !== false;
      
      const emojisToggle = document.getElementById('fc-toggle-emojis');
      if (emojisToggle) emojisToggle.checked = latestConfig.showEmojis !== false;
      
      const precisionSlider = document.getElementById('fc-slider-precision');
      if (precisionSlider) {
        precisionSlider.value = latestConfig.decimalPrecision || 4;
        updatePrecisionDisplay();
      }
      
      const speedSelect = document.getElementById('fc-select-speed');
      if (speedSelect) {
        speedSelect.value = latestConfig.updateSpeed || 'normal';
      }
    }

    // FAQ Accordion functionality
    function initFaqAccordion() {
      const faqItems = document.querySelectorAll('.fc-faq-item');
      
      faqItems.forEach(item => {
        const question = item.querySelector('.fc-faq-question');
        
        // Remove existing listeners to prevent duplicates
        question.removeEventListener('click', question.clickHandler);
        
        question.clickHandler = () => {
          item.classList.toggle('expanded');
        };
        
        question.addEventListener('click', question.clickHandler);
      });
    }

    // Tab switching functionality
    const tabs = modal.querySelectorAll('.fc-settings-tab');
    const mainTab = document.getElementById('fc-tab-main');
    const perfTab = document.getElementById('fc-tab-performance');
    const supportTab = document.getElementById('fc-tab-support');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        mainTab.style.display = 'none';
        perfTab.style.display = 'none';
        supportTab.style.display = 'none';
        
        const tabName = tab.dataset.tab;
        if (tabName === 'main') {
          mainTab.style.display = 'block';
        } else if (tabName === 'performance') {
          perfTab.style.display = 'block';
          // Load latest settings when switching to performance tab
          loadSettingsIntoUI();
          updatePrecisionDisplay();
        } else if (tabName === 'support') {
          supportTab.style.display = 'block';
          setTimeout(initFaqAccordion, 50);
        }
      });
    });

    // Performance tab helpers
    const precisionSlider = document.getElementById('fc-slider-precision');
    const precisionValue = document.getElementById('fc-precision-value');
    
    function updatePrecisionDisplay() {
      if (precisionSlider && precisionValue) {
        precisionValue.textContent = precisionSlider.value;
      }
    }
    
    if (precisionSlider) {
      precisionSlider.addEventListener('input', updatePrecisionDisplay);
    }

    // Save settings button
    const saveBtn = document.getElementById('fc-save-settings');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        // Gather all settings
        const newConfig = {
          animationsEnabled: document.getElementById('fc-toggle-animations')?.checked ?? true,
          numberRollEnabled: document.getElementById('fc-toggle-number-roll')?.checked ?? true,
          duckDanceEnabled: document.getElementById('fc-toggle-duck-dance')?.checked ?? true,
          borderPulseEnabled: document.getElementById('fc-toggle-border-pulse')?.checked ?? true,
          showEmojis: document.getElementById('fc-toggle-emojis')?.checked ?? true,
          decimalPrecision: parseInt(document.getElementById('fc-slider-precision')?.value ?? '4'),
          updateSpeed: document.getElementById('fc-select-speed')?.value ?? 'normal'
        };
        
        // Save to localStorage
        try {
          localStorage.setItem('freecashProgressConfig', JSON.stringify(newConfig));
          console.log('💾 Settings saved to localStorage:', newConfig);
        } catch (e) {
          console.error('Error saving to localStorage:', e);
        }
        
        // Update config in main script
        if (typeof window.updateConfig === 'function') {
          window.updateConfig(newConfig);
        }
        
        // Also update window.userConfig if it exists
        if (window.userConfig) {
          Object.assign(window.userConfig, newConfig);
        }
        
        // Show save confirmation
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '<span>✅</span> Saved!';
        saveBtn.style.background = 'linear-gradient(135deg, #059669, #047857)';
        
        setTimeout(() => {
          saveBtn.innerHTML = originalText;
          saveBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        }, 2000);
      });
    }

    // Support tab buttons
    const copyUsernameBtn = document.getElementById('fc-copy-username');
    if (copyUsernameBtn) {
      copyUsernameBtn.addEventListener('click', () => {
        navigator.clipboard.writeText('@real_mr.duck').then(() => {
          const originalText = copyUsernameBtn.innerHTML;
          copyUsernameBtn.innerHTML = '<span>✅</span> Copied!';
          setTimeout(() => {
            copyUsernameBtn.innerHTML = originalText;
          }, 2000);
        });
      });
    }

    const openDiscordBtn = document.getElementById('fc-open-discord');
    if (openDiscordBtn) {
      openDiscordBtn.addEventListener('click', () => {
        window.open('https://discord.gg/Y3zZrnEEN4', '_blank');
      });
    }

    // Toggle modal function (exposed globally for main script)
    window.toggleSettingsModal = function(show) {
      const isVisible = show !== undefined ? show : modal.style.display === 'none';
      
      if (isVisible) {
        // Load the latest settings before showing modal
        loadSettingsIntoUI();
        
        modal.classList.remove('closing');
        modalOverlay.classList.remove('closing');
        modal.style.display = 'block';
        modalOverlay.style.display = 'block';
        
        document.body.classList.add('fc-modal-open');
        
        const perfTabContent = document.getElementById('fc-tab-performance');
        if (perfTabContent.style.display === 'block') {
          updatePrecisionDisplay();
        }
      } else {
        modal.classList.add('closing');
        modalOverlay.classList.add('closing');
        
        setTimeout(() => {
          modal.style.display = 'none';
          modalOverlay.style.display = 'none';
          document.body.classList.remove('fc-modal-open');
        }, 300);
      }
    };

    // Event listeners
    document.getElementById('fc-settings-modal-close').addEventListener('click', () => {
      window.toggleSettingsModal(false);
    });

    modalOverlay.addEventListener('click', () => {
      window.toggleSettingsModal(false);
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'block') {
        window.toggleSettingsModal(false);
      }
    });

    // Initial load of settings
    loadSettingsIntoUI();

    console.log('⚙️ Settings UI initialized');
  }

  // Start waiting for main script
  waitForMainScript();
})();
