// ==UserScript==
// @name         Freecash Progress Percentage with Colored Borders - Made by DuckyQuack
// @namespace    freecash-percent-4dec
// @version      3.6.2
// @description  Show progress percentage with colored container borders and duck dance at 100% - Customized by DuckyQuack
// @match        https://freecash.com/*
// @match        https://www.freecash.com/*
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function () {
  'use strict';

  // ========== CONFIGURATION STORAGE ==========
  const defaultConfig = {
    animationsEnabled: true,
    numberRollEnabled: true,
    duckDanceEnabled: true,
    borderPulseEnabled: true,
    showEmojis: true,
    decimalPrecision: 4,
    updateSpeed: 'normal',
    showDuckWelcome: true // Added this
  };

  // Load config or use defaults
  let userConfig = { ...defaultConfig };
  
  // Check if GM functions are available
  const hasGmStorage = typeof GM_getValue !== 'undefined' && typeof GM_setValue !== 'undefined';
  
  function loadConfig() {
    if (hasGmStorage) {
      // Load from GM storage
      Object.keys(defaultConfig).forEach(key => {
        const value = GM_getValue(key, defaultConfig[key]);
        userConfig[key] = value;
      });
    } else {
      // Fallback to localStorage
      try {
        const saved = localStorage.getItem('fc-ducky-config');
        if (saved) {
          const parsed = JSON.parse(saved);
          userConfig = { ...defaultConfig, ...parsed };
        }
      } catch (e) {
        console.log('Using default config');
      }
    }
  }
  
  loadConfig();

  // Save config function
  window.saveConfig = function() {
    if (hasGmStorage) {
      Object.keys(userConfig).forEach(key => {
        GM_setValue(key, userConfig[key]);
      });
    } else {
      try {
        localStorage.setItem('fc-ducky-config', JSON.stringify(userConfig));
      } catch (e) {
        console.log('Could not save config');
      }
    }
    
    applyConfigChanges();
    
    // Dispatch event for loading.js
    window.dispatchEvent(new CustomEvent('duckConfigChanged', { detail: userConfig }));
  };

  // Update config function (called from settings)
  window.updateConfig = function(newConfig) {
    console.log('⚙️ Updating config:', newConfig);
    userConfig = { ...userConfig, ...newConfig };
    saveConfig();
  };

  // Apply config changes to running animations
  function applyConfigChanges() {
    console.log('⚙️ Config updated:', userConfig);
  }

  // ========== LOADER INDICATOR WITH ANIMATION ==========
  console.log('🦆 Freecash Progress Script starting...');

  // Add loader styles with animations - UPDATED settings button style
  GM_addStyle(`
    .fc-loader-script {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(0,0,0,0.9);
      color: #10b981;
      padding: 12px 24px;
      border-radius: 40px;
      font-size: 15px;
      z-index: 999999;
      font-family: 'Segoe UI', monospace;
      font-weight: 600;
      border: 2px solid #10b981;
      box-shadow: 0 0 25px rgba(16,185,129,0.5);
      backdrop-filter: blur(8px);
      animation: slideIn 0.3s ease, glowPulse 1.5s infinite;
      pointer-events: none;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes glowPulse {
      0% { box-shadow: 0 0 15px rgba(16,185,129,0.3); border-color: #10b981; }
      50% { box-shadow: 0 0 30px rgba(16,185,129,0.8); border-color: #34d399; }
      100% { box-shadow: 0 0 15px rgba(16,185,129,0.3); border-color: #10b981; }
    }
    
    .loader-duck {
      display: inline-block;
      animation: duckWiggle 0.8s ease infinite;
      font-size: 1.3em;
    }
    
    @keyframes duckWiggle {
      0% { transform: rotate(0deg) scale(1); }
      25% { transform: rotate(15deg) scale(1.1); }
      50% { transform: rotate(-15deg) scale(1.1); }
      75% { transform: rotate(5deg) scale(1.05); }
      100% { transform: rotate(0deg) scale(1); }
    }
    
    .loader-text {
      display: inline-block;
      background: linear-gradient(90deg, #10b981, #34d399, #10b981);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: textShine 2s linear infinite;
      font-weight: bold;
    }
    
    @keyframes textShine {
      0% { background-position: 0% center; }
      100% { background-position: 200% center; }
    }
    
    .loader-dots {
      display: inline-flex;
      gap: 3px;
      margin-left: 2px;
    }
    
    .loader-dots span {
      width: 4px;
      height: 4px;
      background: #10b981;
      border-radius: 50%;
      display: inline-block;
      animation: dotPulse 1.4s infinite;
    }
    
    .loader-dots span:nth-child(2) { animation-delay: 0.2s; }
    .loader-dots span:nth-child(3) { animation-delay: 0.4s; }
    
    @keyframes dotPulse {
      0%, 100% { transform: scale(0.8); opacity: 0.5; }
      50% { transform: scale(1.3); opacity: 1; }
    }
    
    .fc-loader-script.loaded {
      animation: slideIn 0.3s ease, successPop 0.5s ease;
      border-color: #10b981;
      background: rgba(16,185,129,0.15);
    }
    
    @keyframes successPop {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
    
    .checkmark {
      display: inline-block;
      animation: checkmarkSpin 0.5s ease;
      font-size: 1.3em;
    }
    
    @keyframes checkmarkSpin {
      0% { transform: rotate(-180deg) scale(0); }
      100% { transform: rotate(0) scale(1); }
    }

    /* Settings Button Styles - FULLY GREEN with WHITE GEAR */
    .fc-settings-btn {
      position: fixed;
      bottom: 80px;
      right: 20px;
      width: 45px;
      height: 45px;
      border-radius: 50%;
      background: #10b981 !important; /* Solid green, no gradient */
      border: none !important; /* No white border */
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
      padding: 0;
      margin: 0;
      line-height: 1;
    }

    .fc-settings-btn:hover {
      transform: rotate(90deg) scale(1.1);
      box-shadow: 0 6px 20px rgba(16,185,129,0.6);
      background: #059669 !important; /* Darker green on hover */
    }

    .fc-settings-btn:active {
      transform: rotate(180deg) scale(0.95);
    }

    .fc-settings-btn .gear-icon {
      color: white !important;
      display: inline-block;
    }

    @keyframes settingsPop {
      0% { transform: scale(0) rotate(-180deg); opacity: 0; }
      70% { transform: scale(1.1) rotate(10deg); }
      100% { transform: scale(1) rotate(0); opacity: 1; }
    }

    /* Prevent body scroll when modal is open */
    body.fc-modal-open {
      overflow: hidden !important;
    }
  `);

  // ========== SETTINGS BUTTON ==========
  function createSettingsButton() {
    if (!document.body) {
      setTimeout(createSettingsButton, 50);
      return;
    }

    // Remove any existing button first
    const oldBtn = document.getElementById('fc-settings-btn');
    if (oldBtn) oldBtn.remove();

    // Create settings button with white gear icon
    const settingsBtn = document.createElement('div');
    settingsBtn.className = 'fc-settings-btn';
    settingsBtn.id = 'fc-settings-btn';
    settingsBtn.innerHTML = '<span class="gear-icon">⚙️</span>';
    settingsBtn.title = 'DuckyQuack Settings';
    document.body.appendChild(settingsBtn);

    // Settings button click handler
    settingsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (typeof window.toggleSettingsModal === 'function') {
        window.toggleSettingsModal(true);
      } else {
        console.log('Settings modal not loaded yet');
        // Retry after a delay
        setTimeout(() => {
          if (typeof window.toggleSettingsModal === 'function') {
            window.toggleSettingsModal(true);
          }
        }, 500);
      }
    });

    console.log('⚙️ Settings button created');
  }

  // Wait for body to exist before adding loader and settings
  function addLoader() {
    if (!document.body) {
      setTimeout(addLoader, 50);
      return;
    }
    
    // Remove any existing loader
    const oldLoader = document.getElementById('fc-loader-script');
    if (oldLoader) oldLoader.remove();
    
    const loader = document.createElement('div');
    loader.className = 'fc-loader-script';
    loader.id = 'fc-loader-script';
    loader.innerHTML = `
      <span class="loader-duck">🦆</span>
      <span class="loader-text">Quacking Script</span>
      <span class="loader-dots">
        <span></span><span></span><span></span>
      </span>
    `;
    document.body.appendChild(loader);
    console.log('🦆 Loader added to page with animation');

    // Function to update loader
    window.updateLoader = function(message, isSuccess = true) {
      const loaderEl = document.getElementById('fc-loader-script');
      if (loaderEl && loaderEl.parentNode) {
        loaderEl.classList.add('loaded');
        
        if (isSuccess) {
          loaderEl.innerHTML = `
            <span class="checkmark">✅</span>
            <span class="loader-text" style="background: none; -webkit-text-fill-color: #10b981;">${message}</span>
          `;
        } else {
          loaderEl.style.borderColor = '#ef4444';
          loaderEl.style.color = '#ef4444';
          loaderEl.innerHTML = `
            <span>❌</span>
            <span>${message}</span>
          `;
        }
        
        setTimeout(() => {
          loaderEl.style.transition = 'opacity 0.5s';
          loaderEl.style.opacity = '0';
          setTimeout(() => {
            if (loaderEl.parentNode) loaderEl.remove();
          }, 500);
        }, 2000);
      }
    };
  }

  // Start trying to add loader
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      addLoader();
      createSettingsButton();
    });
  } else {
    addLoader();
    createSettingsButton();
  }

  // Duck dance animation frames
  const duckFrames = ['🦆', '🦆💃', '🦆🕺', '🎉🦆🎉', '🦆✨', '🦆🌟', '🦆🎊', '🦆🎈'];

  // Wait for progress.js to load and initialize
  function initProgress() {
    if (typeof window.initProgressDisplay === 'function') {
      try {
        window.initProgressDisplay(userConfig, duckFrames);
        console.log('📊 Progress display initialized from main.js');
        
        if (typeof window.updateLoader === 'function') {
          window.updateLoader('Quack! 🎉');
        }
      } catch (e) {
        console.error('Error initializing progress display:', e);
      }
    } else {
      console.log('⏳ Waiting for progress display module...');
      setTimeout(initProgress, 200);
    }
  }

  // Try to initialize progress after a short delay
  setTimeout(initProgress, 500);
  setTimeout(initProgress, 1000); // Second attempt just in case

  // Make userConfig available globally for settings.js
  window.userConfig = userConfig;

})();
