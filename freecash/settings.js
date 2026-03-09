// ==UserScript==
// @name         Freecash Progress Settings UI
// @namespace    freecash-settings-ui
// @version      1.7.7
// @description  Settings UI for Freecash Progress Script with auto-save
// @author       DuckyQuack
// @match        https://freecash.com/*
// @match        https://www.freecash.com/*
// @run-at       document-idle
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  'use strict';

  // Wait for main script to be ready
  function waitForMainScript() {
    if (typeof window.updateConfig === 'function' && typeof window.saveConfig === 'function') {
      initSettingsUI();
    } else {
      setTimeout(waitForMainScript, 100);
    }
  }

  function initSettingsUI() {
    GM_addStyle(`
      /* Settings Modal Styles */
      .fc-settings-modal {
        position: fixed;
        bottom: 140px;
        right: 20px;
        width: 350px;
        background: rgba(20, 20, 30, 0.85);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 2px solid #10b981;
        border-radius: 20px;
        padding: 0;
        z-index: 999999;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        animation: modalSlideUp 0.2s ease;
        color: white;
        font-family: 'Segoe UI', system-ui, sans-serif;
        overflow: hidden;
        transition: opacity 0.2s ease, transform 0.2s ease;
        will-change: transform, opacity;
      }

      .fc-settings-modal.closing {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
        pointer-events: none;
      }

      @keyframes modalSlideUp {
        from { opacity: 0; transform: translateY(20px) scale(0.95); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
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
        color: #10b981;
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
        transition: background 0.2s ease;
      }

      .fc-settings-modal-close:hover {
        background: rgba(255,255,255,0.1);
        color: white;
      }

      /* ── FIX 2: Tab container – hide scrollbar, drag to scroll ── */
      .fc-settings-tabs-container {
        position: relative;
        width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;
        /* hide scrollbar in all browsers */
        scrollbar-width: none;          /* Firefox */
        -ms-overflow-style: none;       /* IE / Edge */
        cursor: grab;
        user-select: none;
        background: rgba(0,0,0,0.2);
        border-bottom: 1px solid rgba(255,255,255,0.1);
      }

      .fc-settings-tabs-container::-webkit-scrollbar {
        display: none;                  /* Chrome / Safari */
      }

      .fc-settings-tabs-container:active {
        cursor: grabbing;
      }

      .fc-settings-tabs {
        display: flex;
        gap: 4px;
        padding: 0 4px;
        min-width: min-content;
      }

      .fc-settings-tab {
        padding: 12px 16px;
        background: none;
        border: none;
        color: #9ca3af;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: color 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        white-space: nowrap;
        border-bottom: 3px solid transparent;
      }

      .fc-settings-tab:hover { color: #10b981; }
      .fc-settings-tab.active {
        color: #10b981;
        border-bottom-color: #10b981;
      }

      /* Tab Content */
      .fc-settings-tab-content {
        padding: 20px;
        max-height: 400px;
        overflow-y: auto;
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
      }

      /* Main Tab */
      .fc-main-section { padding: 5px 0; }

      .fc-setting-group {
        background: rgba(255,255,255,0.05);
        border-radius: 12px;
        padding: 15px;
        margin-bottom: 15px;
        border: 1px solid rgba(16,185,129,0.2);
        contain: content;
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

      /* Themes – Coming Soon */
      .fc-themes-section {
        padding: 5px 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 250px;
      }

      .fc-coming-soon-container {
        background: rgba(255,255,255,0.05);
        border-radius: 16px;
        padding: 30px 20px;
        text-align: center;
        border: 2px dashed rgba(16,185,129,0.3);
        width: 100%;
      }

      .fc-coming-soon-icon {
        font-size: 64px;
        margin-bottom: 15px;
        animation: floatIcon 3s ease-in-out infinite;
        opacity: 0.8;
      }

      @keyframes floatIcon {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50%       { transform: translateY(-15px) rotate(5deg); }
      }

      .fc-coming-soon-title {
        font-size: 28px;
        font-weight: bold;
        color: #10b981;
        margin-bottom: 10px;
        text-shadow: 0 0 20px rgba(16,185,129,0.3);
      }

      .fc-coming-soon-text  { color: #9ca3af; font-size: 16px; margin-bottom: 20px; }

      .fc-coming-soon-duck {
        font-size: 48px;
        animation: duckWaddle 2s ease-in-out infinite;
        margin-top: 10px;
        opacity: 0.6;
      }

      @keyframes duckWaddle {
        0%, 100% { transform: translateX(0) rotate(0deg); }
        25%       { transform: translateX(-10px) rotate(-5deg); }
        75%       { transform: translateX(10px) rotate(5deg); }
      }

      /* Support */
      .fc-support-section { padding: 5px 0; }

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

      /* FAQ Accordion */
      .fc-faq-item {
        margin-bottom: 10px;
        border-radius: 8px;
        overflow: hidden;
        background: rgba(0,0,0,0.2);
      }

      .fc-faq-question {
        font-weight: 600;
        color: #10b981;
        padding: 10px 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        cursor: pointer;
        user-select: none;
        font-size: 13px;
      }

      .fc-faq-question:hover { background: rgba(16,185,129,0.1); }
      .fc-faq-question-content { display: flex; align-items: center; gap: 6px; }

      .fc-faq-arrow {
        font-size: 11px;
        transition: transform 0.2s ease;
        color: #10b981;
      }

      .fc-faq-item.expanded .fc-faq-arrow { transform: rotate(90deg); }

      .fc-faq-answer {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.2s ease;
        background: rgba(0,0,0,0.3);
        color: #d1d5db;
        font-size: 12px;
        line-height: 1.5;
        padding: 0 12px;
      }

      .fc-faq-item.expanded .fc-faq-answer { max-height: 200px; padding: 10px 12px; }

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
        transition: transform 0.2s ease;
        font-weight: 500;
        will-change: transform;
      }

      .fc-discord-link:hover { background: #4752c4; transform: translateY(-2px); }

      .fc-pm-note {
        background: rgba(16,185,129,0.1);
        border-left: 4px solid #10b981;
        padding: 12px 15px;
        border-radius: 8px;
        margin: 15px 0;
        font-size: 13px;
        color: #d1d5db;
      }

      .fc-pm-note strong { color: #10b981; }

      .fc-contact-options { display: flex; gap: 10px; margin-top: 15px; }

      .fc-contact-btn {
        flex: 1;
        padding: 10px;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        will-change: transform;
        font-size: 13px;
      }

      .fc-contact-btn.primary  { background: #10b981; color: white; }
      .fc-contact-btn.primary:hover  { background: #0d9668; transform: translateY(-2px); }
      .fc-contact-btn.secondary { background: rgba(255,255,255,0.1); color: white; }
      .fc-contact-btn.secondary:hover { background: rgba(255,255,255,0.2); transform: translateY(-2px); }

      /* Performance */
      .fc-performance-section {
        padding: 5px 0;
        content-visibility: auto;
        contain-intrinsic-size: 500px;
      }

      .fc-setting-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
        padding: 5px 0;
        min-height: 40px;
      }

      .fc-setting-label {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #e5e7eb;
        font-size: 14px;
      }

      .fc-setting-label span { font-size: 1.2em; }

      /* Circle toggle */
.fc-toggle {
  position: relative;
  display: inline-block;
  width: 46px !important;
  height: 24px !important;
  min-width: 46px !important;
  min-height: 24px !important;
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
  border-radius: 30px; /* Increased for more rounded appearance */
  transition: background-color 0.25s ease;
  /* Optional: add a subtle inner shadow for depth */
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.3);
}

.fc-toggle-slider::before {
  content: "";
  position: absolute;
  width: 18px;
  height: 18px;
  left: 3px;
  top: 3px;
  background: white;
  border-radius: 50%; /* This is already rounded like a ball */
  transition: transform 0.25s ease;
  /* Optional: add a subtle shadow to make the ball pop */
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.fc-toggle input:checked + .fc-toggle-slider {
  background-color: #10b981;
}

.fc-toggle input:checked + .fc-toggle-slider::before {
  transform: translateX(22px);
}

      /* Select Dropdown */
      .fc-select {
        background: rgba(0,0,0,0.3);
        border: 1px solid #10b981;
        color: white;
        padding: 8px 30px 8px 16px;
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

      .fc-select option { background: #1f2937; color: white; }

      /* Slider */
      .fc-slider-container { display: flex; align-items: center; gap: 10px; }

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
        transition: transform 0.1s ease;
        border: 2px solid white;
        will-change: transform;
      }

      .fc-slider::-webkit-slider-thumb:hover { transform: scale(1.15); }

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

      .fc-setting-description { font-size: 12px; color: #9ca3af; margin-top: 4px; padding-left: 32px; }

      .fc-save-btn {
        width: 100%;
        padding: 12px;
        background: #10b981;
        border: none;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s ease;
        margin-top: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        will-change: transform;
        font-size: 14px;
      }

      .fc-save-btn:hover  { background: #059669; transform: translateY(-2px); }
      .fc-save-btn:active { transform: translateY(0); }

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
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        z-index: 999998;
        animation: fadeIn 0.2s ease;
        transition: opacity 0.2s ease;
        will-change: opacity;
      }

      .fc-settings-modal-overlay.closing { opacity: 0; }

      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

      /* ── FIX 1: Settings button – white gear icon ── */
      .fc-settings-btn {
        position: fixed !important;
        bottom: 80px !important;
        right: 20px !important;
        width: 50px !important;
        height: 50px !important;
        border-radius: 50% !important;
        background: #10b981 !important;
        border: none !important;
        outline: none !important;
        box-shadow: 0 4px 15px rgba(16,185,129,0.4) !important;
        z-index: 999997 !important;
        transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease !important;
        animation: settingsButtonAppear 0.3s ease !important;
        padding: 0 !important;
        margin: 0 !important;
        line-height: 1 !important;
        -webkit-appearance: none !important;
        -moz-appearance: none !important;
        appearance: none !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
      }

      /* White SVG gear – replaces emoji to guarantee colour */
      .fc-settings-btn .gear-icon {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 28px !important;
        height: 28px !important;
        pointer-events: none !important;
      }

      .fc-settings-btn .gear-icon svg {
        width: 28px !important;
        height: 28px !important;
        fill: white !important;
        display: block !important;
        pointer-events: none !important;
      }

      .fc-settings-btn:hover {
        transform: scale(1.1) rotate(90deg) !important;
        box-shadow: 0 6px 20px rgba(16,185,129,0.6) !important;
        background: #059669 !important;
      }

      .fc-settings-btn:active  { transform: scale(0.95) rotate(180deg) !important; }
      .fc-settings-btn:focus   { outline: none !important; border: none !important; box-shadow: 0 4px 15px rgba(16,185,129,0.4) !important; }

      @keyframes settingsButtonAppear {
        0%   { opacity: 0; transform: scale(0) rotate(-180deg); }
        70%  { transform: scale(1.1) rotate(10deg); }
        100% { opacity: 1; transform: scale(1) rotate(0); }
      }

      body.fc-modal-open .fc-settings-btn {
        display: flex !important;
        visibility: visible !important;
        opacity: 1 !important;
        z-index: 999997 !important;
      }
    `);

    // Settings button – use inline SVG for a guaranteed white gear
    const settingsBtn = document.createElement('button');
    settingsBtn.className = 'fc-settings-btn';
    settingsBtn.id = 'fc-settings-btn';
    settingsBtn.setAttribute('aria-label', 'Open Settings');
    settingsBtn.setAttribute('title', 'Duckcash Settings');

    const gearSpan = document.createElement('span');
    gearSpan.className = 'gear-icon';
    // Inline SVG gear – always white, no emoji weirdness
    gearSpan.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a7 7 0 0 0-1.62-.94l-.36-2.54A.48.48 0 0 0 14 3h-4a.48.48 0 0 0-.48.41l-.36 2.54a7.35 7.35 0 0 0-1.62.94l-2.39-.96a.48.48 0 0 0-.59.22L2.64 9.47a.47.47 0 0 0 .12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.3.59.22l2.39-.96c.5.36 1.04.67 1.62.94l.36 2.54c.05.24.27.41.48.41h4c.24 0 .44-.17.48-.41l.36-2.54a7.35 7.35 0 0 0 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.47.47 0 0 0-.12-.61l-2.03-1.58zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z"/>
    </svg>`;
    settingsBtn.appendChild(gearSpan);
    document.body.appendChild(settingsBtn);

    // Modal elements
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'fc-settings-modal-overlay';
    modalOverlay.id = 'fc-settings-modal-overlay';
    modalOverlay.style.display = 'none';

    const modal = document.createElement('div');
    modal.className = 'fc-settings-modal';
    modal.id = 'fc-settings-modal';

    let cachedElements = {};

    function loadConfigFromStorage() {
      try {
        const savedConfig = localStorage.getItem('freecashProgressConfig');
        if (savedConfig) return JSON.parse(savedConfig);
      } catch (e) {}
      return null;
    }

    const storedConfig = loadConfigFromStorage();
    const currentConfig = window.userConfig || storedConfig || {
      animationsEnabled: true,
      numberRollEnabled: true,
      duckDanceEnabled: true,
      borderPulseEnabled: true,
      showEmojis: true,
      decimalPrecision: 4,
      updateSpeed: 'normal',
      showDuckLoading: true
    };

    modal.innerHTML = `
      <div class="fc-settings-modal-header">
        <h3><span>🦆</span> Duckcash Settings</h3>
        <button class="fc-settings-modal-close" id="fc-settings-modal-close">✕</button>
      </div>

      <div class="fc-settings-tabs-container">
        <div class="fc-settings-tabs">
          <button class="fc-settings-tab active" data-tab="main"><span>🏠</span> Main</button>
          <button class="fc-settings-tab" data-tab="performance"><span>⚡</span> Performance</button>
          <button class="fc-settings-tab" data-tab="themes"><span>🎨</span> Themes</button>
          <button class="fc-settings-tab" data-tab="support"><span>❓</span> Support</button>
        </div>
      </div>

      <!-- Main Tab -->
      <div class="fc-settings-tab-content" id="fc-tab-main">
        <div class="fc-main-section">
          <div class="fc-setting-group">
            <h4><span>🦆</span> Loading Screen</h4>
            <div class="fc-setting-item">
              <span class="fc-setting-label"><span>🎬</span> Show Duck Loading Screen</span>
              <label class="fc-toggle">
                <input type="checkbox" id="fc-toggle-duck-loading" ${currentConfig.showDuckLoading !== false ? 'checked' : ''}>
                <span class="fc-toggle-slider"></span>
              </label>
            </div>
            <div class="fc-setting-description">Show duck loading screen with floating ducks and balloons when you first visit the site</div>
          </div>
        </div>
        <button class="fc-save-btn" id="fc-save-main-settings"><span>💾</span> Save Main Settings</button>
      </div>

      <!-- Performance Tab -->
      <div class="fc-settings-tab-content" id="fc-tab-performance" style="display: none;">
        <div class="fc-performance-section">
          <div class="fc-setting-group">
            <h4><span>🎨</span> Visual Effects</h4>
            <div class="fc-setting-item">
              <span class="fc-setting-label"><span>🔄</span> Enable All Animations</span>
              <label class="fc-toggle">
                <input type="checkbox" id="fc-toggle-animations" ${currentConfig.animationsEnabled ? 'checked' : ''}>
                <span class="fc-toggle-slider"></span>
              </label>
            </div>
            <div class="fc-setting-description">Master switch for all animations</div>

            <div class="fc-setting-item">
              <span class="fc-setting-label"><span>🔢</span> Number Roll Effect</span>
              <label class="fc-toggle">
                <input type="checkbox" id="fc-toggle-number-roll" ${currentConfig.numberRollEnabled ? 'checked' : ''}>
                <span class="fc-toggle-slider"></span>
              </label>
            </div>
            <div class="fc-setting-description">Smooth counting animation when numbers change</div>

            <div class="fc-setting-item">
              <span class="fc-setting-label"><span>🦆</span> Duck Dance at 100%</span>
              <label class="fc-toggle">
                <input type="checkbox" id="fc-toggle-duck-dance" ${currentConfig.duckDanceEnabled ? 'checked' : ''}>
                <span class="fc-toggle-slider"></span>
              </label>
            </div>
            <div class="fc-setting-description">Celebration animation when reaching 100%</div>

            <div class="fc-setting-item">
              <span class="fc-setting-label"><span>💫</span> Border Pulse Effect</span>
              <label class="fc-toggle">
                <input type="checkbox" id="fc-toggle-border-pulse" ${currentConfig.borderPulseEnabled ? 'checked' : ''}>
                <span class="fc-toggle-slider"></span>
              </label>
            </div>
            <div class="fc-setting-description">Pulsing glow effect on progress borders</div>

            <div class="fc-setting-item">
              <span class="fc-setting-label"><span>😊</span> Show Progress Emojis</span>
              <label class="fc-toggle">
                <input type="checkbox" id="fc-toggle-emojis" ${currentConfig.showEmojis ? 'checked' : ''}>
                <span class="fc-toggle-slider"></span>
              </label>
            </div>
            <div class="fc-setting-description">Display emojis based on progress</div>
          </div>

          <div class="fc-setting-group">
            <h4><span>⚙️</span> Performance Settings</h4>
            <div class="fc-setting-item">
              <span class="fc-setting-label"><span>🎯</span> Decimal Precision</span>
              <div class="fc-slider-container">
                <input type="range" id="fc-slider-precision" class="fc-slider" min="0" max="6" value="${currentConfig.decimalPrecision}" step="1">
                <span class="fc-slider-value" id="fc-precision-value">${currentConfig.decimalPrecision}</span>
              </div>
            </div>
            <div class="fc-setting-description">Number of decimal places to show (0-6)</div>

            <div class="fc-setting-item">
              <span class="fc-setting-label"><span>⏱️</span> Update Speed</span>
              <select id="fc-select-speed" class="fc-select">
                <option value="slow"   ${currentConfig.updateSpeed === 'slow'   ? 'selected' : ''}>Slow</option>
                <option value="normal" ${currentConfig.updateSpeed === 'normal' ? 'selected' : ''}>Normal</option>
                <option value="fast"   ${currentConfig.updateSpeed === 'fast'   ? 'selected' : ''}>Fast</option>
              </select>
            </div>
            <div class="fc-setting-description">How frequently progress updates</div>
          </div>

          <button class="fc-save-btn" id="fc-save-settings"><span>💾</span> Save Performance Settings</button>
        </div>
      </div>

      <!-- Themes Tab -->
      <div class="fc-settings-tab-content" id="fc-tab-themes" style="display: none;">
        <div class="fc-themes-section">
          <div class="fc-coming-soon-container">
            <div class="fc-coming-soon-icon">🎨✨</div>
            <div class="fc-coming-soon-title">Coming Soon!</div>
            <div class="fc-coming-soon-text">Themes and color customization are on their way</div>
            <div class="fc-coming-soon-duck">🦆🖌️</div>
            <div style="color: #6b7280; font-size: 13px; margin-top: 20px;">
              Future updates will include:<br>
              • Custom color schemes<br>
              • Dark/Light mode toggle<br>
              • Progress bar styles<br>
              • And more!
            </div>
          </div>
        </div>
      </div>

      <!-- Support Tab -->
      <div class="fc-settings-tab-content" id="fc-tab-support" style="display: none;">
        <div class="fc-support-section">
          <div class="fc-support-card">
            <h4><span>❓</span> Frequently Asked Questions</h4>
            <div class="fc-faq-item"><div class="fc-faq-question"><span class="fc-faq-question-content"><span>🦆</span> Why isn't my progress showing?</span><span class="fc-faq-arrow">▶</span></div><div class="fc-faq-answer">Make sure you're on a page with progress bars (like offers). The script automatically detects them. Try refreshing the page.</div></div>
            <div class="fc-faq-item"><div class="fc-faq-question"><span class="fc-faq-question-content"><span>🎨</span> Can I change the colors?</span><span class="fc-faq-arrow">▶</span></div><div class="fc-faq-answer">Coming soon! Check the Performance tab for animation settings. Color customization will be in a future update.</div></div>
            <div class="fc-faq-item"><div class="fc-faq-question"><span class="fc-faq-question-content"><span>⚡</span> The script is slowing down my browser</span><span class="fc-faq-arrow">▶</span></div><div class="fc-faq-answer">Go to the Performance tab and disable animations or reduce update speed. You can also turn off individual effects.</div></div>
            <div class="fc-faq-item"><div class="fc-faq-question"><span class="fc-faq-question-content"><span>🔄</span> How do I reset settings?</span><span class="fc-faq-arrow">▶</span></div><div class="fc-faq-answer">Click "Reset to Defaults" in the Performance tab, or clear your browser's localStorage for this site.</div></div>
          </div>

          <div class="fc-support-card">
            <h4><span>💬</span> Need More Help?</h4>
            <a href="https://discord.gg/Y3zZrnEEN4" target="_blank" class="fc-discord-link"><span>💬</span><span style="flex:1;">Join Freecash Discord</span><span>↗</span></a>
            <div class="fc-pm-note"><strong>📨 DuckyQuack Support:</strong><br>Once you're in the Freecash Discord, send a Private Message to <strong>@real_mr.duck</strong></div>
            <div class="fc-contact-options">
              <button class="fc-contact-btn primary" id="fc-copy-username"><span>📋</span> Copy Username</button>
              <button class="fc-contact-btn secondary" id="fc-open-discord"><span>💬</span> Open Discord</button>
            </div>
          </div>
        </div>
      </div>

      <div class="fc-settings-modal-footer">Made with 🦆 by DuckyQuack | v3.7</div>
    `;

    document.body.appendChild(modalOverlay);
    document.body.appendChild(modal);
    modal.style.display = 'none';
    modalOverlay.style.display = 'none';

    function getCachedElement(id) {
      if (!cachedElements[id]) cachedElements[id] = document.getElementById(id);
      return cachedElements[id];
    }

    function debounce(func, wait) {
      let timeout;
      return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => { clearTimeout(timeout); func(...args); }, wait);
      };
    }

    // ── FIX 4: loadSettingsIntoUI only reads from storage, NEVER overwrites
    //    live UI state. It is only called once when the modal first opens.
    function loadSettingsIntoUI() {
      const latestStored = loadConfigFromStorage();
      const latestConfig = window.userConfig || latestStored || currentConfig;

      requestAnimationFrame(() => {
        const duckLoadingToggle = getCachedElement('fc-toggle-duck-loading');
        if (duckLoadingToggle) duckLoadingToggle.checked = latestConfig.showDuckLoading !== false;

        const animationsToggle = getCachedElement('fc-toggle-animations');
        if (animationsToggle) animationsToggle.checked = latestConfig.animationsEnabled !== false;

        const numberRollToggle = getCachedElement('fc-toggle-number-roll');
        if (numberRollToggle) numberRollToggle.checked = latestConfig.numberRollEnabled !== false;

        const duckDanceToggle = getCachedElement('fc-toggle-duck-dance');
        if (duckDanceToggle) duckDanceToggle.checked = latestConfig.duckDanceEnabled !== false;

        const borderPulseToggle = getCachedElement('fc-toggle-border-pulse');
        if (borderPulseToggle) borderPulseToggle.checked = latestConfig.borderPulseEnabled !== false;

        const emojisToggle = getCachedElement('fc-toggle-emojis');
        if (emojisToggle) emojisToggle.checked = latestConfig.showEmojis !== false;

        const precisionSlider = getCachedElement('fc-slider-precision');
        if (precisionSlider) {
          precisionSlider.value = latestConfig.decimalPrecision ?? 4;
          updatePrecisionDisplay();
        }

        const speedSelect = getCachedElement('fc-select-speed');
        if (speedSelect) speedSelect.value = latestConfig.updateSpeed || 'normal';
      });
    }

    // FAQ accordion via event delegation
    function initFaqAccordion() {
      const supportTab = document.getElementById('fc-tab-support');
      if (!supportTab) return;
      supportTab.addEventListener('click', (e) => {
        const question = e.target.closest('.fc-faq-question');
        if (!question) return;
        const faqItem = question.closest('.fc-faq-item');
        if (faqItem) faqItem.classList.toggle('expanded');
      });
    }

    // Tab bar: smooth momentum drag + mouse-wheel horizontal scroll
    function initTabScrolling() {
      const container = document.querySelector('.fc-settings-tabs-container');
      if (!container || container._fcScrollInit) return;
      container._fcScrollInit = true;

      // ── Mouse-wheel: scroll horizontally (deltaY → scrollLeft) ──
      container.addEventListener('wheel', (e) => {
        e.preventDefault();
        // support both vertical and horizontal wheel gestures
        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        container.scrollLeft += delta;
      }, { passive: false });

      // ── Drag-to-scroll with momentum ──
      let isDown = false;
      let startX, startScrollLeft;
      let velX = 0, lastX = 0, lastT = 0;
      let rafId = null;

      container.addEventListener('mousedown', (e) => {
        // don't hijack tab button clicks – only start drag on the container bg
        if (e.target.closest('.fc-settings-tab')) return;
        isDown = true;
        startX = e.pageX;
        startScrollLeft = container.scrollLeft;
        velX = 0; lastX = e.pageX; lastT = Date.now();
        container.style.cursor = 'grabbing';
        if (rafId) cancelAnimationFrame(rafId);
        e.preventDefault();
      });

      const stopDrag = () => {
        if (!isDown) return;
        isDown = false;
        container.style.cursor = 'grab';
        // kick off momentum glide
        let v = velX;
        function glide() {
          if (Math.abs(v) < 0.5) return;
          container.scrollLeft -= v;
          v *= 0.88;             // friction
          rafId = requestAnimationFrame(glide);
        }
        glide();
      };

      document.addEventListener('mouseup', stopDrag);
      container.addEventListener('mouseleave', stopDrag);

      container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const now = Date.now();
        const dt  = Math.max(now - lastT, 1);
        velX = (e.pageX - lastX) / dt * 16; // pixels per frame @60fps
        lastX = e.pageX; lastT = now;
        container.scrollLeft = startScrollLeft - (e.pageX - startX);
      });

      // Touch support (momentum handled natively by the browser)
      let tStartX, tScrollLeft;
      container.addEventListener('touchstart', (e) => {
        tStartX = e.touches[0].pageX;
        tScrollLeft = container.scrollLeft;
        if (rafId) cancelAnimationFrame(rafId);
      }, { passive: true });

      container.addEventListener('touchmove', (e) => {
        const dx = tStartX - e.touches[0].pageX;
        container.scrollLeft = tScrollLeft + dx;
      }, { passive: true });
    }

    // Tab switching – do NOT call loadSettingsIntoUI on tab change
    const tabs = modal.querySelectorAll('.fc-settings-tab');
    const mainTab   = document.getElementById('fc-tab-main');
    const perfTab   = document.getElementById('fc-tab-performance');
    const themesTab = document.getElementById('fc-tab-themes');
    const supportTab = document.getElementById('fc-tab-support');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        requestAnimationFrame(() => {
          mainTab.style.display   = 'none';
          perfTab.style.display   = 'none';
          themesTab.style.display = 'none';
          supportTab.style.display = 'none';

          switch (tab.dataset.tab) {
            case 'main':        mainTab.style.display   = 'block'; break;
            case 'performance': perfTab.style.display   = 'block'; break;
            case 'themes':      themesTab.style.display = 'block'; break;
            case 'support':
              supportTab.style.display = 'block';
              initFaqAccordion();
              break;
          }
        });
      });
    });

    // Precision slider display update
    const precisionSlider = document.getElementById('fc-slider-precision');
    const precisionValue  = document.getElementById('fc-precision-value');

    function updatePrecisionDisplay() {
      if (precisionSlider && precisionValue) precisionValue.textContent = precisionSlider.value;
    }

    if (precisionSlider) {
      precisionSlider.addEventListener('input', updatePrecisionDisplay);
    }

    // Main tab save
    const saveMainBtn = document.getElementById('fc-save-main-settings');
    if (saveMainBtn) {
      saveMainBtn.addEventListener('click', () => {
        const showDuckLoading = getCachedElement('fc-toggle-duck-loading')?.checked ?? true;
        const newConfig = { ...window.userConfig, showDuckLoading };

        try { localStorage.setItem('freecashProgressConfig', JSON.stringify(newConfig)); } catch (e) {}

        if (typeof window.updateConfig === 'function') window.updateConfig(newConfig);
        if (window.userConfig) Object.assign(window.userConfig, newConfig);
        window.dispatchEvent(new CustomEvent('duckConfigChanged', { detail: newConfig }));

        const orig = saveMainBtn.innerHTML;
        saveMainBtn.innerHTML = '<span>✅</span> Saved!';
        setTimeout(() => { saveMainBtn.innerHTML = orig; }, 2000);
      });
    }

    // Performance tab save
    const saveBtn = document.getElementById('fc-save-settings');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const newConfig = {
          showDuckLoading:   getCachedElement('fc-toggle-duck-loading')?.checked  ?? true,
          animationsEnabled: getCachedElement('fc-toggle-animations')?.checked    ?? true,
          numberRollEnabled: getCachedElement('fc-toggle-number-roll')?.checked   ?? true,
          duckDanceEnabled:  getCachedElement('fc-toggle-duck-dance')?.checked    ?? true,
          borderPulseEnabled:getCachedElement('fc-toggle-border-pulse')?.checked  ?? true,
          showEmojis:        getCachedElement('fc-toggle-emojis')?.checked        ?? true,
          decimalPrecision:  parseInt(getCachedElement('fc-slider-precision')?.value ?? '4'),
          updateSpeed:       getCachedElement('fc-select-speed')?.value           ?? 'normal'
        };

        try { localStorage.setItem('freecashProgressConfig', JSON.stringify(newConfig)); } catch (e) {}

        if (typeof window.updateConfig === 'function') window.updateConfig(newConfig);
        if (window.userConfig) Object.assign(window.userConfig, newConfig);
        window.dispatchEvent(new CustomEvent('duckConfigChanged', { detail: newConfig }));

        const orig = saveBtn.innerHTML;
        saveBtn.innerHTML = '<span>✅</span> Saved!';
        setTimeout(() => { saveBtn.innerHTML = orig; }, 2000);
      });
    }

    // Support tab buttons
    const copyUsernameBtn = document.getElementById('fc-copy-username');
    if (copyUsernameBtn) {
      copyUsernameBtn.addEventListener('click', () => {
        navigator.clipboard.writeText('@real_mr.duck').then(() => {
          const orig = copyUsernameBtn.innerHTML;
          copyUsernameBtn.innerHTML = '<span>✅</span> Copied!';
          setTimeout(() => { copyUsernameBtn.innerHTML = orig; }, 2000);
        });
      });
    }

    const openDiscordBtn = document.getElementById('fc-open-discord');
    if (openDiscordBtn) {
      openDiscordBtn.addEventListener('click', () => {
        window.open('https://discord.gg/Y3zZrnEEN4', '_blank');
      });
    }

    // Settings button click
    settingsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.toggleSettingsModal();
    });

    // Toggle modal – loadSettingsIntoUI only on open, never on tab switch
    window.toggleSettingsModal = function (show) {
      const isVisible = show !== undefined ? show : modal.style.display === 'none';

      requestAnimationFrame(() => {
        if (isVisible) {
          loadSettingsIntoUI();   // ← only runs here, on open

          modal.classList.remove('closing');
          modalOverlay.classList.remove('closing');
          modal.style.display = 'block';
          modalOverlay.style.display = 'block';
          document.body.classList.add('fc-modal-open');

          setTimeout(initTabScrolling, 50);
        } else {
          modal.classList.add('closing');
          modalOverlay.classList.add('closing');

          setTimeout(() => {
            modal.style.display = 'none';
            modalOverlay.style.display = 'none';
            document.body.classList.remove('fc-modal-open');
          }, 200);
        }
      });
    };

    document.getElementById('fc-settings-modal-close').addEventListener('click', () => {
      window.toggleSettingsModal(false);
    });

    modalOverlay.addEventListener('click', () => {
      window.toggleSettingsModal(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'block') {
        window.toggleSettingsModal(false);
      }
    });

    // Initial settings load + tab scroll init
    loadSettingsIntoUI();
    initTabScrolling();
  }

  waitForMainScript();
})();
