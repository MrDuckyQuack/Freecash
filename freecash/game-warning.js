// ==UserScript==
// @name         Freecash Game Warning
// @namespace    freecash-game-warning
// @version      1.0.2
// @description  Shows a warning popup on /offer/ pages to remind users about VPN/Adblocker
// @author       DuckyQuack
// @match        https://freecash.com/offer/*
// @match        https://www.freecash.com/offer/*
// @run-at       document-idle
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // Store users who have already seen and acknowledged the warning for a specific offer
    let warnedOffers = new Set();

    // Load previously warned offers from localStorage
    try {
        const saved = localStorage.getItem('fc-warned-offers');
        if (saved) {
            warnedOffers = new Set(JSON.parse(saved));
        }
    } catch (e) {
        console.log('Could not load warned offers');
    }

    // Add styles for the warning popup
    GM_addStyle(`
        .fc-warning-overlay {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: rgba(0, 0, 0, 0.8) !important;
            backdrop-filter: blur(8px) !important;
            z-index: 2147483646 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            animation: warningFadeIn 0.3s ease !important;
        }

        .fc-warning-modal {
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%) !important;
            border: 2px solid #10b981 !important;
            border-radius: 24px !important;
            padding: 32px !important;
            max-width: 500px !important;
            width: 90% !important;
            box-shadow: 0 20px 60px rgba(16, 185, 129, 0.3), 0 0 0 4px rgba(16, 185, 129, 0.1) !important;
            animation: modalPop 0.4s ease !important;
            position: relative !important;
        }

        .fc-warning-header {
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
            margin-bottom: 24px !important;
        }

        .fc-warning-icon {
            font-size: 48px !important;
            animation: warningShake 0.5s ease !important;
        }

        .fc-warning-title {
            font-size: 28px !important;
            font-weight: 900 !important;
            background: linear-gradient(90deg, #10b981, #ef4444, #10b981) !important;
            background-size: 200% auto !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            animation: warningShimmer 2s linear infinite !important;
        }

        .fc-warning-content {
            color: #e2e8f0 !important;
            font-size: 18px !important;
            line-height: 1.6 !important;
            margin-bottom: 32px !important;
            text-align: center !important;
            padding: 16px !important;
            background: rgba(255, 255, 255, 0.05) !important;
            border-radius: 16px !important;
            border-left: 4px solid #ef4444 !important;
        }

        .fc-warning-timer {
            font-size: 48px !important;
            font-weight: 900 !important;
            color: #10b981 !important;
            text-align: center !important;
            margin-bottom: 24px !important;
            font-family: monospace !important;
            text-shadow: 0 0 20px rgba(16, 185, 129, 0.5) !important;
        }

        .fc-warning-buttons {
            display: flex !important;
            gap: 16px !important;
            justify-content: center !important;
        }

        .fc-warning-btn {
            padding: 12px 32px !important;
            border-radius: 40px !important;
            font-size: 18px !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            border: none !important;
            outline: none !important;
        }

        .fc-warning-btn.primary {
            background: #10b981 !important;
            color: white !important;
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4) !important;
        }

        .fc-warning-btn.primary:hover:not(:disabled) {
            background: #059669 !important;
            transform: scale(1.05) !important;
            box-shadow: 0 6px 20px rgba(16, 185, 129, 0.6) !important;
        }

        .fc-warning-btn.secondary {
            background: transparent !important;
            color: #94a3b8 !important;
            border: 2px solid #475569 !important;
        }

        .fc-warning-btn.secondary:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.1) !important;
            border-color: #10b981 !important;
            color: #10b981 !important;
        }

        .fc-warning-btn:disabled {
            opacity: 0.5 !important;
            cursor: not-allowed !important;
        }

        .fc-warning-duck {
            position: absolute !important;
            bottom: -20px !important;
            right: -20px !important;
            font-size: 64px !important;
            opacity: 0.2 !important;
            transform: rotate(15deg) !important;
            pointer-events: none !important;
        }

        @keyframes warningFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes modalPop {
            0% { transform: scale(0.8) translateY(20px); opacity: 0; }
            100% { transform: scale(1) translateY(0); opacity: 1; }
        }

        @keyframes warningShake {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(10deg); }
            50% { transform: rotate(-10deg); }
            75% { transform: rotate(5deg); }
        }

        @keyframes warningShimmer {
            0% { background-position: 0% center; }
            100% { background-position: 200% center; }
        }
    `);

    // Function to extract offer ID from the current page URL
    function getCurrentOfferId() {
        const match = window.location.pathname.match(/\/offer\/([^\/]+)/);
        return match ? match[1] : null;
    }

    // Function to check if user has already been warned for this offer
    function hasBeenWarned(offerId) {
        return offerId && warnedOffers.has(offerId);
    }

    // Function to mark user as warned for this offer
    function markAsWarned(offerId) {
        if (!offerId) return;
        warnedOffers.add(offerId);
        try {
            localStorage.setItem('fc-warned-offers', JSON.stringify([...warnedOffers]));
        } catch (e) {
            console.log('Could not save warned offers');
        }
    }

    // Function to show warning popup
    function showWarning(offerElement, offerId, originalClickHandler) {
        // Remove any existing overlay
        const existingOverlay = document.querySelector('.fc-warning-overlay');
        if (existingOverlay) existingOverlay.remove();

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'fc-warning-overlay';

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'fc-warning-modal';

        // Timer countdown (3 seconds)
        let countdown = 3;

        // Modal content
        modal.innerHTML = `
            <div class="fc-warning-header">
                <span class="fc-warning-icon">⚠️</span>
                <span class="fc-warning-title">ATTENTION DUCK!</span>
            </div>
            <div class="fc-warning-content">
                🦆 <strong>Please disable your VPN and Adblocker</strong> 🦆
                <br><br>
                For better tracking of the game and to avoid any issues with crediting your rewards, make sure:
                <br><br>
                • VPN is turned OFF<br>
                • Adblocker is disabled for this site<br>
                • Your browser allows tracking
                <br><br>
                <span style="color: #fbbf24; font-size: 16px;">⏱️ This warning auto-closes in:</span>
            </div>
            <div class="fc-warning-timer" id="warning-timer">3</div>
            <div class="fc-warning-buttons">
                <button class="fc-warning-btn secondary" id="warning-cancel">Cancel</button>
                <button class="fc-warning-btn primary" id="warning-continue" disabled>Continue (3s)</button>
            </div>
            <div class="fc-warning-duck">🦆</div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Prevent body scrolling
        document.body.style.overflow = 'hidden';

        // Get buttons and timer
        const continueBtn = document.getElementById('warning-continue');
        const cancelBtn = document.getElementById('warning-cancel');
        const timerEl = document.getElementById('warning-timer');

        // Timer interval
        const timerInterval = setInterval(() => {
            countdown--;
            if (timerEl) timerEl.textContent = countdown;
            if (continueBtn) continueBtn.textContent = `Continue (${countdown}s)`;
            if (countdown <= 0) {
                clearInterval(timerInterval);
                if (continueBtn) {
                    continueBtn.disabled = false;
                    continueBtn.textContent = 'Continue →';
                }
            }
        }, 1000);

        // Continue button handler
        continueBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            clearInterval(timerInterval);

            // Mark this offer as warned
            if (offerId) markAsWarned(offerId);

            // Remove overlay
            overlay.remove();
            document.body.style.overflow = '';

            // Trigger the original click after a tiny delay
            setTimeout(() => {
                if (originalClickHandler) {
                    originalClickHandler();
                } else {
                    offerElement.click();
                }
            }, 50);
        });

        // Cancel button handler
        cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            clearInterval(timerInterval);
            overlay.remove();
            document.body.style.overflow = '';
        });

        // Click outside to close
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                clearInterval(timerInterval);
                overlay.remove();
                document.body.style.overflow = '';
            }
        });
    }

    // Function to setup warning on the /offer/ page
    function setupOfferPageWarning() {
        const currentOfferId = getCurrentOfferId();

        // Selector for the main play button (based on the HTML you provided)
        const playButtonSelector = '.chakra-button.css-1wilzt8, button[class*="chakra-button"], button:has(svg.chakra-icon)';

        // Intercept clicks on the play button
        document.addEventListener('click', (e) => {
            const playButton = e.target.closest(playButtonSelector);

            // Only trigger if we're on an offer page, the button is clicked, and user hasn't been warned for THIS offer
            if (playButton && currentOfferId && !hasBeenWarned(currentOfferId) && !e.defaultPrevented) {

                // Prevent default action
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                // Store original click handler reference
                let originalHandler = () => {
                    const newClick = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
                    document.removeEventListener('click', setupOfferPageWarning, true);
                    playButton.dispatchEvent(newClick);
                    document.addEventListener('click', setupOfferPageWarning, true);
                };

                // Show warning
                showWarning(playButton, currentOfferId, originalHandler);
            }
        }, true); // Use capture phase
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupOfferPageWarning);
    } else {
        setupOfferPageWarning();
    }

    // Watch for dynamically loaded content on the offer page
    const observer = new MutationObserver((mutations) => {
        // Check if the main button has been added to the page
        const playButton = document.querySelector('.chakra-button.css-1wilzt8, button[class*="chakra-button"]');
        if (playButton) {
            // Our click handler is already set up, nothing more needed
        }
    });

    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    } else {
        window.addEventListener('DOMContentLoaded', () => {
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    console.log('🦆 Game warning script loaded for /offer/ pages');
})();
