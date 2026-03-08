// ==UserScript==
// @name         Freecash Duck Welcome
// @namespace    freecash-duck-welcome
// @version      1.1
// @description  Shows a cute duck loading screen for 4 seconds on Freecash
// @author       DuckyQuack
// @match        https://freecash.com/*
// @match        https://www.freecash.com/*
// @run-at       document-start
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  'use strict';

  console.log('🦆 Duck Welcome Screen loading...');

  // Add styles immediately
  GM_addStyle(`
    /* Duck Welcome Screen - FORCED FULL PAGE */
    .duck-welcome-container {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      background: linear-gradient(135deg, #0f172a, #1e293b) !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      z-index: 999999999 !important;
      margin: 0 !important;
      padding: 0 !important;
      box-sizing: border-box !important;
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif !important;
      animation: duckFadeOut 0.5s ease 4s forwards !important;
      pointer-events: none !important;
    }

    @keyframes duckFadeOut {
      to {
        opacity: 0;
        visibility: hidden;
      }
    }

    .duck-welcome-duck {
      font-size: 150px !important;
      line-height: 1 !important;
      margin-bottom: 30px !important;
      animation: duckWobble 2s ease-in-out infinite !important;
      filter: drop-shadow(0 20px 40px rgba(16,185,129,0.5)) !important;
      transform-origin: center center !important;
    }

    @keyframes duckWobble {
      0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
      25% { transform: translateY(-25px) rotate(-8deg) scale(1.1); }
      75% { transform: translateY(-15px) rotate(8deg) scale(1.05); }
    }

    .duck-welcome-text {
      font-size: 48px !important;
      font-weight: 900 !important;
      background: linear-gradient(135deg, #10b981, #34d399, #10b981, #34d399) !important;
      background-size: 300% auto !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      animation: duckGradient 3s linear infinite !important;
      margin: 20px 0 !important;
      text-shadow: 0 0 40px rgba(16,185,129,0.3) !important;
      letter-spacing: 2px !important;
    }

    @keyframes duckGradient {
      0% { background-position: 0% center; }
      100% { background-position: 300% center; }
    }

    .duck-welcome-subtext {
      color: #94a3b8 !important;
      font-size: 24px !important;
      margin: 20px 0 !important;
      letter-spacing: 2px !important;
      font-weight: 300 !important;
    }

    .duck-welcome-progress {
      width: 400px !important;
      height: 8px !important;
      background: rgba(255,255,255,0.1) !important;
      border-radius: 20px !important;
      overflow: hidden !important;
      margin: 40px 0 !important;
      border: 2px solid rgba(16,185,129,0.2) !important;
      box-shadow: 0 0 30px rgba(16,185,129,0.2) !important;
    }

    .duck-welcome-progress-fill {
      height: 100% !important;
      width: 0% !important;
      background: linear-gradient(90deg, #10b981, #34d399, #10b981) !important;
      background-size: 200% auto !important;
      animation: duckProgress 4s linear forwards, duckShine 1s linear infinite !important;
      border-radius: 20px !important;
    }

    @keyframes duckProgress {
      0% { width: 0%; }
      100% { width: 100%; }
    }

    @keyframes duckShine {
      0% { background-position: 0% center; }
      100% { background-position: 200% center; }
    }

    .duck-welcome-footer {
      position: absolute !important;
      bottom: 40px !important;
      color: #475569 !important;
      font-size: 16px !important;
      font-weight: 300 !important;
      letter-spacing: 1px !important;
    }

    /* Force hide everything else while loading */
    .duck-welcome-container ~ * {
      opacity: 0 !important;
      pointer-events: none !important;
    }
  `);

  // Array of fun duck messages
  const duckMessages = [
    "🦆 WELCOME TO FREECASH!",
    "🦆 DUCKYQUACK WAS HERE",
    "🦆 QUACK QUACK!",
    "🦆 READY TO EARN?",
    "🦆 LET'S GET THIS BREAD",
    "🦆 DUCK MODE: ACTIVATED",
    "🦆 LOADING DUCKY MAGIC",
    "🦆 WADDLE YOU WAITING FOR?",
    "🦆 DUCK SEASON!",
    "🦆 FREE MONEY DUCK"
  ];

  // Array of duck emojis
  const duckEmojis = ["🦆", "🦆✨", "🦆🌟", "🦆💫", "🦆⚡", "🦆🌈", "🦆🔥", "🦆💦", "🐥", "🦆🦆"];

  // Show welcome screen immediately
  function showWelcomeScreen() {
    // Check if already shown in this session
    if (sessionStorage.getItem('duckWelcomeShown')) {
      return;
    }

    console.log('🦆 Showing welcome screen...');

    // Random selections
    const randomMessage = duckMessages[Math.floor(Math.random() * duckMessages.length)];
    const randomDuck = duckEmojis[Math.floor(Math.random() * duckEmojis.length)];

    // Create welcome screen
    const welcomeScreen = document.createElement('div');
    welcomeScreen.className = 'duck-welcome-container';
    welcomeScreen.id = 'duck-welcome-screen';
    welcomeScreen.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      background: linear-gradient(135deg, #0f172a, #1e293b) !important;
      z-index: 999999999 !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
    `;

    welcomeScreen.innerHTML = `
      <div class="duck-welcome-duck">${randomDuck}</div>
      <div class="duck-welcome-text">${randomMessage}</div>
      <div class="duck-welcome-subtext">Making Freecash ducky since 2024</div>
      <div class="duck-welcome-progress">
        <div class="duck-welcome-progress-fill"></div>
      </div>
      <div class="duck-welcome-footer">🐤 Created by DuckyQuack</div>
    `;

    // Force add to document
    if (document.documentElement) {
      document.documentElement.appendChild(welcomeScreen);
    } else {
      document.appendChild(welcomeScreen);
    }

    // Mark as shown
    sessionStorage.setItem('duckWelcomeShown', 'true');
    
    // Remove after 4.5 seconds
    setTimeout(() => {
      const screen = document.getElementById('duck-welcome-screen');
      if (screen && screen.parentNode) {
        screen.parentNode.removeChild(screen);
        console.log('🦆 Welcome screen removed');
      }
    }, 4500);
  }

  // Try to show immediately
  if (document.documentElement) {
    showWelcomeScreen();
  } else {
    // Wait for document to be ready
    document.addEventListener('readystatechange', () => {
      if (document.readyState === 'interactive' || document.readyState === 'complete') {
        showWelcomeScreen();
      }
    });
  }

  // Force show on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', showWelcomeScreen);

  // Also try on load
  window.addEventListener('load', showWelcomeScreen);

  // Manual override
  window.showDuckWelcome = showWelcomeScreen;

})();
