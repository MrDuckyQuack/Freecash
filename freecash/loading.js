// ==UserScript==
// @name         Freecash Duck Welcome
// @namespace    freecash-duck-welcome
// @version      1.0
// @description  Shows a cute duck loading screen for 4 seconds on Freecash
// @author       DuckyQuack
// @match        https://freecash.com/*
// @match        https://www.freecash.com/*
// @run-at       document-start
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  'use strict';

  console.log('🦆 Duck Welcome Screen ready');

  // Add styles for the duck loader
  GM_addStyle(`
    /* Duck Welcome Screen Styles */
    .duck-welcome-container {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      background: linear-gradient(135deg, #0f172a, #1e293b) !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      z-index: 9999999 !important;
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif !important;
      animation: fadeOut 0.5s ease 3.5s forwards !important;
      pointer-events: none !important;
    }

    @keyframes fadeOut {
      to {
        opacity: 0;
        visibility: hidden;
      }
    }

    .duck-welcome-duck {
      font-size: 120px !important;
      line-height: 1 !important;
      margin-bottom: 20px !important;
      animation: duckWave 2s ease-in-out infinite !important;
      filter: drop-shadow(0 20px 30px rgba(16,185,129,0.3)) !important;
    }

    @keyframes duckWave {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      25% { transform: translateY(-20px) rotate(-5deg); }
      75% { transform: translateY(-10px) rotate(5deg); }
    }

    .duck-welcome-text {
      font-size: 36px !important;
      font-weight: 800 !important;
      background: linear-gradient(135deg, #10b981, #34d399, #10b981) !important;
      background-size: 200% auto !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      animation: gradient 2s linear infinite !important;
      margin-bottom: 30px !important;
      text-shadow: 0 0 30px rgba(16,185,129,0.3) !important;
    }

    @keyframes gradient {
      0% { background-position: 0% center; }
      100% { background-position: 200% center; }
    }

    .duck-welcome-subtext {
      color: #94a3b8 !important;
      font-size: 18px !important;
      margin-top: 20px !important;
      letter-spacing: 1px !important;
    }

    .duck-welcome-progress {
      width: 300px !important;
      height: 6px !important;
      background: rgba(255,255,255,0.1) !important;
      border-radius: 10px !important;
      overflow: hidden !important;
      margin: 30px 0 !important;
    }

    .duck-welcome-progress-fill {
      height: 100% !important;
      width: 0% !important;
      background: linear-gradient(90deg, #10b981, #34d399) !important;
      animation: progress 4s linear forwards !important;
    }

    @keyframes progress {
      0% { width: 0%; }
      100% { width: 100%; }
    }

    .duck-welcome-footer {
      position: absolute !important;
      bottom: 30px !important;
      color: #475569 !important;
      font-size: 14px !important;
    }
  `);

  // Array of fun duck messages
  const duckMessages = [
    "🦆 Welcome to Freecash!",
    "🦆 DuckyQuack was here",
    "🦆 Quack!",
    "🦆 Ready to earn?",
    "🦆 Let's get this bread",
    "🦆 Duck mode: ON",
    "🦆 Loading ducky magic",
    "🦆 Waddle you waiting for?"
  ];

  // Array of duck emojis
  const duckEmojis = ["🦆", "🦆✨", "🦆🌟", "🦆💫", "🦆⚡", "🦆🌈"];

  // Create welcome screen
  function createWelcomeScreen() {
    // Don't show if already shown in this session
    if (sessionStorage.getItem('duckWelcomeShown')) {
      return;
    }

    const randomMessage = duckMessages[Math.floor(Math.random() * duckMessages.length)];
    const randomDuck = duckEmojis[Math.floor(Math.random() * duckEmojis.length)];

    const welcomeScreen = document.createElement('div');
    welcomeScreen.className = 'duck-welcome-container';
    welcomeScreen.id = 'duck-welcome-screen';
    welcomeScreen.innerHTML = `
      <div class="duck-welcome-duck">${randomDuck}</div>
      <div class="duck-welcome-text">${randomMessage}</div>
      <div class="duck-welcome-progress">
        <div class="duck-welcome-progress-fill"></div>
      </div>
      <div class="duck-welcome-subtext">Making Freecash ducky since 2024</div>
      <div class="duck-welcome-footer">🐤 DuckyQuack</div>
    `;

    return welcomeScreen;
  }

  // Show the welcome screen
  function showWelcomeScreen() {
    // Check if already shown
    if (sessionStorage.getItem('duckWelcomeShown')) {
      return;
    }

    const welcomeScreen = createWelcomeScreen();
    if (welcomeScreen) {
      document.documentElement.appendChild(welcomeScreen);
      
      // Mark as shown
      sessionStorage.setItem('duckWelcomeShown', 'true');
      
      // Remove after animation completes (4 seconds + fade out)
      setTimeout(() => {
        const screen = document.getElementById('duck-welcome-screen');
        if (screen && screen.parentNode) {
          screen.parentNode.removeChild(screen);
        }
      }, 4500); // 4s progress + 0.5s fade
    }
  }

  // Show welcome screen when page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showWelcomeScreen);
  } else {
    showWelcomeScreen();
  }

  // Also show on page navigation (but not on refresh thanks to sessionStorage)
  window.addEventListener('pageshow', (event) => {
    // Don't show on page back/forward if already shown
    if (!sessionStorage.getItem('duckWelcomeShown')) {
      showWelcomeScreen();
    }
  });

})();
