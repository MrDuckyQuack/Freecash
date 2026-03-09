// ==UserScript==
// @name         Freecash Duck Loading
// @namespace    freecash-duck-Loading
// @version      1.9.2
// @description  Shows a cute duck loading screen on Freecash with animated floating ducks and balloons
// @author       DuckyQuack
// @match        https://freecash.com/*
// @match        https://www.freecash.com/*
// @run-at       document-end
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  'use strict';

  const duckMessages = [
    "WELCOME TO FREECASH!",
    "DUCKYQUACK WAS HERE",
    "QUACK QUACK!",
    "READY TO EARN?",
    "LET'S GET THIS BREAD",
    "DUCK MODE: ACTIVATED",
    "LOADING DUCK MAGIC",
    "WADDLE YOU WAITING FOR?",
    "MONEH SEASON!",
    "FREE MONEH DUCK"
  ];

  const duckEmojis = ["🦆", "🦆✨", "🦆🌟", "🦆💫", "🦆⚡", "🦆🌈", "🦆🔥", "🦆💦", "🐥", "🦆🦆"];
  const balloonEmojis = ["🎈", "🎈🎈", "🎈✨", "🎈🌟", "🎈⭐"];

  GM_addStyle(`
    #duck-Loading-screen {
      position: fixed !important;
      inset: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%) !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      z-index: 2147483647 !important;
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif !important;
      opacity: 0 !important;
      transition: opacity 0.4s ease !important;
      pointer-events: all !important;
      overflow: hidden !important;
    }
    #duck-Loading-screen.duck-visible { opacity: 1 !important; }
    #duck-Loading-screen.duck-hiding { opacity: 0 !important; pointer-events: none !important; }

    .duck-float-container { position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; pointer-events: none !important; z-index: 1 !important; }

    .duck-main-content { position: relative !important; z-index: 2 !important; display: flex !important; flex-direction: column !important; align-items: center !important; justify-content: center !important; width: 100% !important; height: 100% !important; }

    .duck-float, .balloon-float {
      position: absolute !important;
      user-select: none !important;
      pointer-events: none !important;
      filter: drop-shadow(0 5px 15px rgba(16,185,129,0.2)) !important;
      animation-iteration-count: infinite !important;
      animation-timing-function: ease-in-out !important;
    }

    .duck-float { font-size: 40px !important; opacity: 0.15 !important; }
    .balloon-float { font-size: 32px !important; opacity: 0.2 !important; filter: drop-shadow(0 5px 15px rgba(255,255,255,0.1)) !important; }

    @keyframes floatAroundRandom {
      0% { transform: translate(0px, 0px) rotate(0deg); }
      20% { transform: translate(20px, -15px) rotate(5deg); }
      40% { transform: translate(-25px, -20px) rotate(-5deg); }
      60% { transform: translate(15px, 10px) rotate(3deg); }
      80% { transform: translate(-10px, 25px) rotate(-3deg); }
      100% { transform: translate(0px, 0px) rotate(0deg); }
    }

    .duck-emoji {
      font-size: 120px !important;
      line-height: 1 !important;
      margin-bottom: 24px !important;
      display: block !important;
      animation: duckWobble 1.8s ease-in-out infinite !important;
      filter: drop-shadow(0 10px 30px rgba(16,185,129,0.6)) !important;
      position: relative !important;
      z-index: 3 !important;
    }

    @keyframes duckWobble {
      0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
      25%       { transform: translateY(-20px) rotate(-8deg) scale(1.08); }
      75%       { transform: translateY(-12px) rotate(8deg) scale(1.04); }
    }

    .duck-title {
      font-size: 42px !important;
      font-weight: 900 !important;
      letter-spacing: 3px !important;
      background: linear-gradient(90deg, #10b981, #34d399, #6ee7b7, #34d399, #10b981) !important;
      background-size: 300% auto !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      animation: duckShimmer 2.5s linear infinite !important;
      margin: 0 0 12px 0 !important;
      text-align: center !important;
      position: relative !important;
      z-index: 3 !important;
    }

    @keyframes duckShimmer { 0% { background-position: 0% center; } 100% { background-position: 300% center; } }

    .duck-sub { color: #94a3b8 !important; font-size: 18px !important; letter-spacing: 2px !important; font-weight: 300 !important; margin: 0 0 36px 0 !important; position: relative !important; z-index: 3 !important; }

    .duck-bar-wrap {
      width: 360px !important;
      height: 8px !important;
      background: rgba(255,255,255,0.08) !important;
      border-radius: 99px !important;
      overflow: hidden !important;
      border: 1px solid rgba(16,185,129,0.25) !important;
      box-shadow: 0 0 20px rgba(16,185,129,0.15) !important;
      position: relative !important;
      z-index: 3 !important;
    }

    .duck-bar-fill {
      height: 100% !important;
      width: 0% !important;
      border-radius: 99px !important;
      background: linear-gradient(90deg, #10b981, #34d399, #10b981) !important;
      background-size: 200% auto !important;
    }

    .duck-footer { position: absolute !important; bottom: 32px !important; color: #334155 !important; font-size: 14px !important; letter-spacing: 1px !important; z-index: 3 !important; }
  `);

  function createFloatingElements(container) {
    function createFloatElement(emojis, className, minSize, maxSize, minDuration, maxDuration, minDelay, maxDelay, minOpacity, maxOpacity) {
      const el = document.createElement('div');
      el.className = className;
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      const left = Math.random() * 90 + 5;
      const top = Math.random() * 90 + 5;
      const size = Math.random() * (maxSize - minSize) + minSize;
      const opacity = Math.random() * (maxOpacity - minOpacity) + minOpacity;
      const duration = Math.random() * (maxDuration - minDuration) + minDuration;
      const delay = Math.random() * (maxDelay - minDelay) + minDelay;

      el.style.left = left + '%';
      el.style.top = top + '%';
      el.style.fontSize = size + 'px';
      el.style.opacity = opacity;
      el.style.animationDuration = duration + 's';
      el.style.animationDelay = delay + 's';
      el.style.animationName = 'floatAroundRandom';
      container.appendChild(el);
    }

    for (let i = 0; i < 8; i++) createFloatElement(duckEmojis, 'duck-float', 30, 50, 15, 25, 0, 10, 0.1, 0.25);
    for (let i = 0; i < 5; i++) createFloatElement(balloonEmojis, 'balloon-float', 25, 40, 12, 20, 0, 8, 0.15, 0.3);
  }

  let activeTimer = null;
  let isShowing = false;
  let hasShownInitial = false;
  let modalObserver = null;
  let lastUrl = window.location.href;
  let lastPath = window.location.pathname; // Track last path for navigation comparisons

  // Function to check if duck Loading is enabled
  function isDuckLoadingEnabled() {
    if (window.userConfig && window.userConfig.showDuckLoading !== undefined) {
      return window.userConfig.showDuckLoading === true;
    }
    try {
      const saved = localStorage.getItem('fc-ducky-config');
      if (saved) {
        const config = JSON.parse(saved);
        return config.showDuckLoading !== false;
      }
    } catch (e) {
      console.log('Error reading config:', e);
    }
    return true;
  }

  // ========== FUNCTION TO CHECK IGNORED NAVIGATIONS ==========
  function shouldIgnoreNavigation() {
    const currentPath = window.location.pathname;
    const previousPath = lastPath; // Use the tracked last path

    // Define the paths
    const offersGamePath = '/offers/game';
    const earnPath = '/earn';
    const offerPathPattern = /^\/offer\//; // Matches any /offer/... path

    // Case 1: /offers/game <--> /offer/
    if ((previousPath === offersGamePath && offerPathPattern.test(currentPath)) ||
        (offerPathPattern.test(previousPath) && currentPath === offersGamePath)) {
        console.log('🦆 Ignoring navigation: Between /offers/game and /offer/');
        return true;
    }

    // Case 2: /earn <--> /offer/
    if ((previousPath === earnPath && offerPathPattern.test(currentPath)) ||
        (offerPathPattern.test(previousPath) && currentPath === earnPath)) {
        console.log('🦆 Ignoring navigation: Between /earn and /offer/');
        return true;
    }

    return false;
  }

  function showDuck() {
    if (!isDuckLoadingEnabled()) {
      console.log('🦆 Duck Loading screen is disabled');
      return;
    }
    if (isShowing) return;
    if (activeTimer) clearTimeout(activeTimer);

    const existing = document.getElementById('duck-Loading-screen');
    if (existing) existing.remove();

    isShowing = true;
    const msg = duckMessages[Math.floor(Math.random() * duckMessages.length)];
    const emoji = duckEmojis[Math.floor(Math.random() * duckEmojis.length)];

    const el = document.createElement('div');
    el.id = 'duck-Loading-screen';

    const floatContainer = document.createElement('div');
    floatContainer.className = 'duck-float-container';
    createFloatingElements(floatContainer);

    const mainContent = document.createElement('div');
    mainContent.className = 'duck-main-content';

    const emojiEl = document.createElement('span');
    emojiEl.className = 'duck-emoji';
    emojiEl.textContent = emoji;

    const titleEl = document.createElement('div');
    titleEl.className = 'duck-title';
    titleEl.textContent = '🦆 ' + msg;

    const subEl = document.createElement('div');
    subEl.className = 'duck-sub';
    subEl.textContent = 'Quack Quack!';

    const barWrap = document.createElement('div');
    barWrap.className = 'duck-bar-wrap';
    const bar = document.createElement('div');
    bar.className = 'duck-bar-fill';
    barWrap.appendChild(bar);

    const footer = document.createElement('div');
    footer.className = 'duck-footer';
    footer.textContent = '🐤 Created by DuckyQuack';

    mainContent.appendChild(emojiEl);
    mainContent.appendChild(titleEl);
    mainContent.appendChild(subEl);
    mainContent.appendChild(barWrap);
    mainContent.appendChild(footer);

    el.appendChild(floatContainer);
    el.appendChild(mainContent);
    document.body.appendChild(el);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.classList.add('duck-visible');
        bar.style.transition = 'width 3.5s cubic-bezier(0.4,0,0.2,1)';
        requestAnimationFrame(() => { bar.style.width = '100%'; });
      });
    });

    activeTimer = setTimeout(() => {
      el.classList.add('duck-hiding');
      setTimeout(() => { el.remove(); isShowing = false; }, 500);
    }, 2000);
  }

  function triggerAfterDelay() {
    if (isShowing) return;
    if (!isDuckLoadingEnabled()) {
      console.log('🦆 Duck Loading screen is disabled, not showing');
      return;
    }
    // Check if this navigation should be ignored
    if (shouldIgnoreNavigation()) {
        return;
    }
    setTimeout(showDuck, 10);
  }

  // ========== MODAL DETECTION ==========
  function setupModalDetection() {
    const modalSelectors = [
      '[class*="modal"]', '[class*="Modal"]', '[class*="dialog"]', '[class*="Dialog"]',
      '[class*="profile"]', '[class*="Profile"]', '[class*="user"]', '[class*="User"]',
      '[role="dialog"]', '[aria-modal="true"]'
    ];

    modalObserver = new MutationObserver((mutations) => {
      let shouldShow = false;
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) {
              if (node.matches && (node.matches(modalSelectors.join(',')) ||
                  node.querySelector && node.querySelector(modalSelectors.join(',')))) {
                shouldShow = true;
              }
            }
          });
        }
        if (mutation.type === 'attributes' && mutation.target.matches) {
          if (mutation.target.matches(modalSelectors.join(','))) {
            const style = window.getComputedStyle(mutation.target);
            if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') {
              shouldShow = true;
            }
          }
        }
      });
      if (shouldShow && !isShowing && hasShownInitial && isDuckLoadingEnabled()) {
        triggerAfterDelay();
      }
    });

    modalObserver.observe(document.body, {
      childList: true, subtree: true, attributes: true,
      attributeFilter: ['style', 'class', 'display', 'visibility']
    });
    console.log('🔍 Modal detection active');
  }

  // ========== OFFER PAGE DETECTION ==========
  function setupOfferPageDetection() {
    let lastOfferId = null;
    function checkForOfferPage() {
      const offerMatch = window.location.pathname.match(/^\/offer\/([^\/]+)/);
      if (offerMatch) {
        const currentOfferId = offerMatch[1];
        if (currentOfferId !== lastOfferId) {
          lastOfferId = currentOfferId;
          if (hasShownInitial && isDuckLoadingEnabled() && !isShowing && !shouldIgnoreNavigation()) {
            console.log('🦆 Offer page detected:', currentOfferId);
            triggerAfterDelay();
          }
        }
      } else { lastOfferId = null; }
    }
    checkForOfferPage();
    const offerObserver = new MutationObserver(() => {
      if (window.location.pathname.includes('/offer/') && !isShowing && !shouldIgnoreNavigation()) {
        const mainContent = document.querySelector('main, [class*="content"], [class*="offer"]');
        if (mainContent && mainContent.children.length > 0) {
          const currentOfferId = window.location.pathname.match(/\/offer\/([^\/]+)/)?.[1];
          if (currentOfferId && currentOfferId !== lastOfferId) {
            lastOfferId = currentOfferId;
            triggerAfterDelay();
          }
        }
      }
    });
    if (document.body) {
      offerObserver.observe(document.body, { childList: true, subtree: true, attributes: false });
    }
  }

  // Listen for config changes
  window.addEventListener('duckConfigChanged', (e) => {
    console.log('🦆 Config changed in loading.js:', e.detail);
    if (e.detail.showDuckLoading === false && isShowing) {
      const el = document.getElementById('duck-Loading-screen');
      if (el) {
        el.classList.add('duck-hiding');
        setTimeout(() => { el.remove(); isShowing = false; }, 500);
      }
    }
  });

  // Initialization
  if (!isDuckLoadingEnabled()) {
    console.log('🦆 Duck Loading screen is disabled on startup');
  } else if (!hasShownInitial) {
    if (document.readyState === 'complete') {
      hasShownInitial = true;
      triggerAfterDelay();
      setupModalDetection();
      setupOfferPageDetection();
    } else {
      window.addEventListener('load', () => {
        if (!hasShownInitial) {
          hasShownInitial = true;
          triggerAfterDelay();
          setupModalDetection();
          setupOfferPageDetection();
        }
      }, { once: true });
    }
  }

  // History API overrides with path tracking
  const _pushState = history.pushState.bind(history);
  const _replaceState = history.replaceState.bind(history);

  history.pushState = function (...args) {
    _pushState(...args);
    // Update lastPath before checking navigation
    lastPath = window.location.pathname;
    if (hasShownInitial && isDuckLoadingEnabled() && !shouldIgnoreNavigation()) {
      triggerAfterDelay();
      setTimeout(() => {
        if (window.location.pathname.includes('/offer/')) { setupOfferPageDetection(); }
      }, 100);
    }
  };

  history.replaceState = function (...args) {
    _replaceState(...args);
    lastPath = window.location.pathname;
    if (hasShownInitial && isDuckLoadingEnabled() && !shouldIgnoreNavigation()) {
      triggerAfterDelay();
      setTimeout(() => {
        if (window.location.pathname.includes('/offer/')) { setupOfferPageDetection(); }
      }, 100);
    }
  };

  window.addEventListener('popstate', () => {
    // Update lastPath for popstate as well
    const newPath = window.location.pathname;
    if (hasShownInitial && isDuckLoadingEnabled() && !shouldIgnoreNavigation()) {
      triggerAfterDelay();
      setTimeout(() => {
        if (newPath.includes('/offer/')) { setupOfferPageDetection(); }
      }, 100);
    }
    lastPath = newPath; // Update after potential trigger
  });

  // Periodic config check
  let checkCount = 0;
  const configCheck = setInterval(() => {
    checkCount++;
    if (isDuckLoadingEnabled()) {
      if (!hasShownInitial && !isShowing) {
        hasShownInitial = true;
        showDuck();
        setupModalDetection();
        setupOfferPageDetection();
      }
      clearInterval(configCheck);
    } else if (checkCount > 20) { clearInterval(configCheck); }
  }, 100);

  // Click monitoring
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a[href*="/user/"], button[class*="profile"], [class*="avatar"], [class*="Avatar"]');
    if (target && hasShownInitial && isDuckLoadingEnabled() && !isShowing && !shouldIgnoreNavigation()) {
      setTimeout(() => { triggerAfterDelay(); }, 100);
    }
    const offerTarget = e.target.closest('a[href*="/offer/"], [class*="offer"], [class*="Offer"]');
    if (offerTarget && hasShownInitial && isDuckLoadingEnabled() && !isShowing && !shouldIgnoreNavigation()) {
      setTimeout(() => { triggerAfterDelay(); }, 100);
    }
  }, true);

})();a
