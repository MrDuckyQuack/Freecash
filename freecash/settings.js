// ==UserScript==
// @name         Freecash Progress Settings UI
// @namespace    freecash-settings-ui
// @version      1.4
// @description  Settings UI for Freecash Progress Script with auto-save
// @author       DuckyQuack
// @match        https://freecash.com/*
// @match        https://www.freecash.com/*
// @run-at       document-idle
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  'use strict';

  console.log('⚙️ Settings UI loading...');

  // Wait for main script to be ready
  function waitForMainScript() {
    if (typeof window.updateConfig === 'function' && typeof window.saveConfig === 'function') {
      console.log('⚙️ Main script detected, initializing settings UI');
      initSettingsUI();
    } else {
      console.log('⚙️ Waiting for main script...');
      setTimeout(waitForMainScript, 100);
    }
  }

  function initSettingsUI() {
    // Add settings modal styles - including button styles
    GM_addStyle(`
      /* Settings Button Styles */
      .fc-settings-btn {
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 45px;
        height: 45px;
        border-radius: 50%;
        background: linear-gradient(135deg, #10b981, #059669);
        border: 2px solid rgba(255,255,255,0.3);
        color: white !important;
        font-size: 24px;
        cursor: pointer;
        z-index: 999998;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 15px rgba(16,185,129,0.4);
        transition: all 0.3s ease;
        animation: settingsPop 0.5s ease;
        backdrop-filter: blur(4px);
      }

      .fc-settings-btn:hover {
        transform: rotate(90deg) scale(1.1);
        box-shadow: 0 6px 20px rgba(16,185,129,0.6);
        background: linear-gradient(135deg, #059669, #047857);
      }

      .fc-settings-btn:active {
        transform: rotate(180deg) scale(0.95);
      }

      .fc-settings-btn .gear-icon {
        color: white !important;
        filter: brightness(0) invert(1);
      }

      @keyframes settingsPop {
        0% { transform: scale(0) rotate(-180deg); opacity: 0; }
        70% { transform: scale(1.1) rotate(10deg); }
        100% { transform: scale(1) rotate(0); opacity: 1; }
      }

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

      /* ROUNDED TOGGLE SWITCH - Updated for more rounded appearance */
      .fc-toggle {
        position: relative;
        display: inline-block;
        width: 52px;
        height: 28px;
      }

      .fc-toggle input {
        opacity: 0;
        width: 0;
        height: 0;
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
        border-radius: 34px; /* More rounded */
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
        border-radius: 50%; /* Perfectly circular */
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      }

      input:checked + .fc-toggle-slider {
        background-color: #10b981;
      }

      input:checked + .fc-toggle-slider:before {
        transform: translateX(24px);
        background-color: white;
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

      /* Remove save button styles and add auto-save indicator */
      .fc-auto-save-indicator {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 8px;
        background: rgba(16,185,129,0.1);
        border-radius: 30px;
        margin-top: 15px;
        font-size: 12px;
        color: #10b981;
        border: 1px solid rgba(16,185,129,0.3);
      }

      .fc-auto-save-indicator span {
        animation: pulse 2s infinite;
      }

      @keyframes pulse {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
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

      /* Prevent body scroll when modal is open */
      body.fc-modal-open {
        overflow: hidden !important;
      }

      /* Refresh Notification Styles */
      .fc-refresh-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(20, 20, 30, 0.98);
        backdrop-filter: blur(10px);
        border: 2px solid #10b981;
        border-radius: 16px;
        padding: 16px 20px;
        z-index: 1000000;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5), 0 0 30px rgba(16,185,129,0.3);
        animation: notificationSlide 0.3s ease;
        color: white;
        font-family: 'Segoe UI', system-ui, sans-serif;
        min-width: 280px;
      }

      .fc-refresh-notification.closing {
        animation: notificationSlideOut 0.3s ease forwards;
      }

      @keyframes notificationSlide {
        from {
          opacity: 0;
          transform: translateX(100%);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes notificationSlideOut {
        from {
          opacity: 1;
          transform: translateX(0);
        }
        to {
          opacity: 0;
          transform: translateX(100%);
        }
      }

      .fc-refresh-notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .fc-refresh-icon {
        font-size: 24px;
        animation: spin 2s linear infinite;
      }

      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      .fc-refresh-text {
        flex: 1;
      }

      .fc-refresh-text strong {
        color: #10b981;
        display: block;
        margin-bottom: 4px;
        font-size: 16px;
      }

      .fc-refresh-text p {
        margin: 0;
        font-size: 13px;
        color: #d1d5db;
      }

      .fc-refresh-actions {
        display: flex;
        gap: 8px;
        margin-top: 12px;
      }

      .fc-refresh-btn {
        flex: 1;
        padding: 8px 12px;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        font-size: 13px;
      }

      .fc-refresh-btn.primary {
        background: #10b981;
        color: white;
      }

      .fc-refresh-btn.primary:hover {
        background: #0d9668;
        transform: translateY(-2px);
      }

      .fc-refresh-btn.secondary {
        background: rgba(255,255,255,0.1);
        color: white;
      }

      .fc-refresh-btn.secondary:hover {
        background: rgba(255,255,255,0.2);
      }
    `);

    // ========== CREATE SETTINGS BUTTON ==========
    function createSettingsButton() {
      if (!document.body) {
        setTimeout(createSettingsButton, 50);
        return;
      }

      // Check if button already exists
      if (document.getElementById('fc-settings-btn')) {
        console.log('⚙️ Settings button already exists');
        return;
      }

      // Create settings button with white gear icon
      const settingsBtn = document.createElement('div');
      settingsBtn.className = 'fc-settings-btn';
      settingsBtn.id = 'fc-settings-btn';
      settingsBtn.innerHTML = '<span class="gear-icon" style="color: white !important;">⚙️</span>';
      settingsBtn.title = 'DuckyQuack Settings';
      document.body.appendChild(settingsBtn);

      // Settings button click handler
      settingsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('⚙️ Settings button clicked');
        if (typeof window.toggleSettingsModal === 'function') {
          window.toggleSettingsModal(true);
        } else {
          console.log('⚙️ toggleSettingsModal not available yet');
        }
      });

      console.log('⚙️ Settings button created');
    }

    // Create button first
    createSettingsButton();

    // ========== CREATE MODAL ==========
    
    // Function to get current config from main script
    function getCurrentConfig() {
      return window.userConfig || {
        animationsEnabled: true,
        numberRollEnabled: true,
        duckDanceEnabled: true,
        borderPulseEnabled: true,
        showEmojis: true,
        decimalPrecision: 4,
        updateSpeed: 'normal'
      };
    }

    // Track if settings require refresh
    let refreshRequired = false;
    let settingsChanged = false;

    // Function to show refresh notification
    function showRefreshNotification() {
      // Remove existing notification if any
      const existingNotification = document.getElementById('fc-refresh-notification');
      if (existingNotification) {
        existingNotification.remove();
      }

      const notification = document.createElement('div');
      notification.className = 'fc-refresh-notification';
      notification.id = 'fc-refresh-notification';
      notification.innerHTML = `
        <div class="fc-refresh-notification-content">
          <div class="fc-refresh-icon">🔄</div>
          <div class="fc-refresh-text">
            <strong>Settings Updated!</strong>
            <p>Some changes require a page refresh to take full effect.</p>
          </div>
        </div>
        <div class="fc-refresh-actions">
          <button class="fc-refresh-btn primary" id="fc-refresh-now">
            <span>🔄</span> Refresh Now
          </button>
          <button class="fc-refresh-btn secondary" id="fc-refresh-later">
            <span>⏰</span> Later
          </button>
        </div>
      `;
      
      document.body.appendChild(notification);

      // Refresh now button
      document.getElementById('fc-refresh-now').addEventListener('click', () => {
        notification.classList.add('closing');
        setTimeout(() => {
          location.reload();
        }, 300);
      });

      // Later button
      document.getElementById('fc-refresh-later').addEventListener('click', () => {
        notification.classList.add('closing');
        setTimeout(() => {
          notification.remove();
        }, 300);
      });

      // Auto-hide after 10 seconds if not interacted with
      setTimeout(() => {
        const notif = document.getElementById('fc-refresh-notification');
        if (notif) {
          notif.classList.add('closing');
          setTimeout(() => {
            if (notif.parentNode) notif.remove();
          }, 300);
        }
      }, 10000);
    }

    // Auto-save function
    function autoSaveSettings() {
      if (!settingsChanged) return;
      
      const newConfig = {
        animationsEnabled: document.getElementById('fc-toggle-animations')?.checked ?? true,
        numberRollEnabled: document.getElementById('fc-toggle-number-roll')?.checked ?? true,
        duckDanceEnabled: document.getElementById('fc-toggle-duck-dance')?.checked ?? true,
        borderPulseEnabled: document.getElementById('fc-toggle-border-pulse')?.checked ?? true,
        showEmojis: document.getElementById('fc-toggle-emojis')?.checked ?? true,
        decimalPrecision: parseInt(document.getElementById('fc-slider-precision')?.value ?? '4'),
        updateSpeed: document.getElementById('fc-select-speed')?.value ?? 'normal'
      };
      
      // Update config in main script
      if (typeof window.updateConfig === 'function') {
        window.updateConfig(newConfig);
        
        // Show subtle indicator that settings were saved
        const indicator = document.querySelector('.fc-auto-save-indicator span');
        if (indicator) {
          indicator.textContent = '✓ Saved';
          setTimeout(() => {
            if (indicator) indicator.textContent = '● Auto-save';
          }, 2000);
        }
        
        // Check if refresh is needed (for settings that require page reload)
        const oldConfig = getCurrentConfig();
        if (oldConfig.decimalPrecision !== newConfig.decimalPrecision) {
          refreshRequired = true;
        }
        
        settingsChanged = false;
      }
    }

    // Debounced auto-save
    let saveTimeout;
    function triggerAutoSave() {
      settingsChanged = true;
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(autoSaveSettings, 500); // Save 500ms after last change
    }

    // Create modal elements
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'fc-settings-modal-overlay';
    modalOverlay.id = 'fc-settings-modal-overlay';
    modalOverlay.style.display = 'none';

    const modal = document.createElement('div');
    modal.className = 'fc-settings-modal';
    modal.id = 'fc-settings-modal';
    
    // Build modal with tabs
    function buildModal() {
      const config = getCurrentConfig();
      console.log('⚙️ Building modal with config:', config);
      
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
                  <input type="checkbox" id="fc-toggle-animations" ${config.animationsEnabled ? 'checked' : ''}>
                  <span class="fc-toggle-slider"></span>
                </label>
              </div>
              <div class="fc-setting-description">Master switch for all animations</div>
              
              <div class="fc-setting-item">
                <span class="fc-setting-label">
                  <span>🔢</span> Number Roll Effect
                </span>
                <label class="fc-toggle">
                  <input type="checkbox" id="fc-toggle-number-roll" ${config.numberRollEnabled ? 'checked' : ''}>
                  <span class="fc-toggle-slider"></span>
                </label>
              </div>
              <div class="fc-setting-description">Smooth counting animation when numbers change</div>
              
              <div class="fc-setting-item">
                <span class="fc-setting-label">
                  <span>🦆</span> Duck Dance at 100%
                </span>
                <label class="fc-toggle">
                  <input type="checkbox" id="fc-toggle-duck-dance" ${config.duckDanceEnabled ? 'checked' : ''}>
                  <span class="fc-toggle-slider"></span>
                </label>
              </div>
              <div class="fc-setting-description">Celebration animation when reaching 100%</div>
              
              <div class="fc-setting-item">
                <span class="fc-setting-label">
                  <span>💫</span> Border Pulse Effect
                </span>
                <label class="fc-toggle">
                  <input type="checkbox" id="fc-toggle-border-pulse" ${config.borderPulseEnabled ? 'checked' : ''}>
                  <span class="fc-toggle-slider"></span>
                </label>
              </div>
              <div class="fc-setting-description">Pulsing glow effect on progress borders</div>
              
              <div class="fc-setting-item">
                <span class="fc-setting-label">
                  <span>😊</span> Show Progress Emojis
                </span>
                <label class="fc-toggle">
                  <input type="checkbox" id="fc-toggle-emojis" ${config.showEmojis ? 'checked' : ''}>
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
                  <input type="range" id="fc-slider-precision" class="fc-slider" min="0" max="6" value="${config.decimalPrecision}" step="1">
                  <span class="fc-slider-value" id="fc-precision-value">${config.decimalPrecision}</span>
                </div>
              </div>
              <div class="fc-setting-description">Number of decimal places to show (0-6) - requires refresh</div>
              
              <div class="fc-setting-item">
                <span class="fc-setting-label">
                  <span>⏱️</span> Update Speed
                </span>
                <select id="fc-select-speed" class="fc-select">
                  <option value="slow" ${config.updateSpeed === 'slow' ? 'selected' : ''}>Slow</option>
                  <option value="normal" ${config.updateSpeed === 'normal' ? 'selected' : ''}>Normal</option>
                  <option value="fast" ${config.updateSpeed === 'fast' ? 'selected' : ''}>Fast</option>
                </select>
              </div>
              <div class="fc-setting-description">How frequently progress updates (fast may use more CPU)</div>
            </div>
            
            <!-- Auto-save indicator -->
            <div class="fc-auto-save-indicator">
              <span>●</span> Auto-save enabled
              <span>●</span>
            </div>
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
    }

    // Initial build
    buildModal();
    document.body.appendChild(modalOverlay);
    document.body.appendChild(modal);

    // Hide modal initially
    modal.style.display = 'none';
    modalOverlay.style.display = 'none';

    // FAQ Accordion functionality
    function initFaqAccordion() {
      const faqItems = document.querySelectorAll('.fc-faq-item');
      
      faqItems.forEach(item => {
        const question = item.querySelector('.fc-faq-question');
        
        // Remove any existing listeners
        const newQuestion = question.cloneNode(true);
        question.parentNode.replaceChild(newQuestion, question);
        
        newQuestion.addEventListener('click', () => {
          item.classList.toggle('expanded');
        });
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
      precisionSlider.addEventListener('input', () => {
        updatePrecisionDisplay();
        triggerAutoSave();
      });
    }

    // Add auto-save listeners to all toggles and selects
    const toggleIds = [
      'fc-toggle-animations',
      'fc-toggle-number-roll',
      'fc-toggle-duck-dance',
      'fc-toggle-border-pulse',
      'fc-toggle-emojis'
    ];

    toggleIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('change', triggerAutoSave);
      }
    });

    const speedSelect = document.getElementById('fc-select-speed');
    if (speedSelect) {
      speedSelect.addEventListener('change', triggerAutoSave);
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
      console.log('⚙️ toggleSettingsModal called with:', show);
      
      // Rebuild modal with latest config when opening
      if (show) {
        buildModal();
      }
      
      const isVisible = show !== undefined ? show : modal.style.display === 'none';
      
      if (isVisible) {
        modal.classList.remove('closing');
        modalOverlay.classList.remove('closing');
        modal.style.display = 'block';
        modalOverlay.style.display = 'block';
        
        document.body.classList.add('fc-modal-open');
        
        // Re-attach all event listeners after modal is built
        setTimeout(() => {
          // Tab switching
          const newTabs = modal.querySelectorAll('.fc-settings-tab');
          const newMainTab = document.getElementById('fc-tab-main');
          const newPerfTab = document.getElementById('fc-tab-performance');
          const newSupportTab = document.getElementById('fc-tab-support');
          
          newTabs.forEach(tab => {
            tab.addEventListener('click', () => {
              newTabs.forEach(t => t.classList.remove('active'));
              tab.classList.add('active');
              
              newMainTab.style.display = 'none';
              newPerfTab.style.display = 'none';
              newSupportTab.style.display = 'none';
              
              const tabName = tab.dataset.tab;
              if (tabName === 'main') {
                newMainTab.style.display = 'block';
              } else if (tabName === 'performance') {
                newPerfTab.style.display = 'block';
                updatePrecisionDisplay();
              } else if (tabName === 'support') {
                newSupportTab.style.display = 'block';
                setTimeout(initFaqAccordion, 50);
              }
            });
          });

          // Auto-save listeners
          const newPrecisionSlider = document.getElementById('fc-slider-precision');
          if (newPrecisionSlider) {
            newPrecisionSlider.addEventListener('input', () => {
              updatePrecisionDisplay();
              triggerAutoSave();
            });
          }

          toggleIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
              element.addEventListener('change', triggerAutoSave);
            }
          });

          const newSpeedSelect = document.getElementById('fc-select-speed');
          if (newSpeedSelect) {
            newSpeedSelect.addEventListener('change', triggerAutoSave);
          }

          // Support buttons
          const newCopyBtn = document.getElementById('fc-copy-username');
          if (newCopyBtn) {
            newCopyBtn.addEventListener('click', () => {
              navigator.clipboard.writeText('@real_mr.duck').then(() => {
                const originalText = newCopyBtn.innerHTML;
                newCopyBtn.innerHTML = '<span>✅</span> Copied!';
                setTimeout(() => {
                  newCopyBtn.innerHTML = originalText;
                }, 2000);
              });
            });
          }

          const newDiscordBtn = document.getElementById('fc-open-discord');
          if (newDiscordBtn) {
            newDiscordBtn.addEventListener('click', () => {
              window.open('https://discord.gg/Y3zZrnEEN4', '_blank');
            });
          }

          // Close button
          document.getElementById('fc-settings-modal-close').addEventListener('click', () => {
            window.toggleSettingsModal(false);
          });

          // Update precision display if performance tab is active
          if (newPerfTab && newPerfTab.style.display === 'block') {
            updatePrecisionDisplay();
          }
        }, 50);
        
        console.log('⚙️ Modal opened with config:', getCurrentConfig());
      } else {
        modal.classList.add('closing');
        modalOverlay.classList.add('closing');
        
        // Show refresh notification if needed
        if (refreshRequired) {
          showRefreshNotification();
          refreshRequired = false;
        }
        
        setTimeout(() => {
          modal.style.display = 'none';
          modalOverlay.style.display = 'none';
          document.body.classList.remove('fc-modal-open');
          console.log('⚙️ Modal closed');
        }, 300);
      }
    };

    // Event listeners for initial modal (these will be overridden when modal is rebuilt)
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

    console.log('⚙️ Settings UI fully initialized');
  }

  // Start waiting for main script
  waitForMainScript();
})();
