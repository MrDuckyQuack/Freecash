# 🦆 Freecash Progress Percentage with Colored Borders

A Tampermonkey script that adds beautiful progress indicators to Freecash.com with dynamic colors, smooth animations, and a special duck dance at 100%!

## 📸 Preview

<img width="1474" height="794" alt="image" src="https://github.com/user-attachments/assets/a1630f4a-5958-48fb-8a89-58e7e83dea80" />

## ✨ Features

- 🎨 **Colored borders** based on progress (red → orange → green)
- 🎯 **4 decimal precision** for accurate progress tracking
- 🦆 **Duck dance celebration** when you hit 100%!
- 📊 **Smooth number roll animations**
- 🟢 **Green highlighting** during progress changes
- 🔄 **Auto-updates** via GitHub

-------------------------------------------------------------------------------

## 🎮 How to Use

1. Install Tampermonkey extension in your browser
2. Click the Tampermonkey icon → "Create a new script"
3. Delete the template code
4. Copy and paste the script URL or code
5. Press `Ctrl+S` to save
6. Visit https://freecash.com and watch the magic happen! ✨

## 🎨 Progress Colors

- **0-25%** 🔴 Red - Just starting!
- **25-50%** 🟠 Orange - Making progress
- **50-75%** 🟡 Yellow/Gold - Halfway there!
- **75-100%** 🟢 Green - Almost done!
- **100%** 🦆 DUCK DANCE! 🎉

## 🦆 Duck Dance at 100%

When you reach 100%, a special duck appears and dances:

## 📥 Installation

### Option 1: Auto-Updates (Recommended)
Add this loader script to your Tampermonkey. It will automatically fetch the latest version!

```javascript
// ==UserScript==
// @name         Freecash Progress Loader - DuckyQuack
// @namespace    freecash-loader-ducky
// @version      1.3.2
// @description  Loads DuckyQuack's Freecash progress script from GitHub with cache busting
// @author       DuckyQuack
// @match        https://freecash.com/*
// @match        https://www.freecash.com/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      raw.githubusercontent.com
// @connect      github.com
// ==/UserScript==

(function() {
    'use strict';

    console.log('🦆 Loader starting...');

    // Try both possible URLs
    const URLS = [
        'https://raw.githubusercontent.com/MrDuckyQuack/Freecash-Progress-Percentage/refs/heads/main/freecash',
        'https://raw.githubusercontent.com/MrDuckyQuack/Freecash-Progress-Percentage/main/freecash'
    ];

    let currentUrlIndex = 0;

    function loadScript(url, scriptName) {
        return new Promise((resolve, reject) => {
            const fullUrl = url + '/' + scriptName + '?t=' + Date.now();
            console.log(`🦆 Attempting to fetch: ${fullUrl}`);

            GM_xmlhttpRequest({
                method: 'GET',
                url: fullUrl,
                timeout: 10000,
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                },
                onload: function(response) {
                    console.log(`🦆 Response status for ${scriptName}:`, response.status);
                    console.log(`🦆 Response headers:`, response.responseHeaders);

                    if (response.status === 200) {
                        console.log(`✅ ${scriptName} fetched (${response.responseText.length} chars)`);
                        console.log(`✅ First 100 chars:`, response.responseText.substring(0, 100));

                        try {
                            // Try to evaluate the script
                            eval(response.responseText);
                            console.log(`✅ ${scriptName} executed`);
                            resolve();
                        } catch (e) {
                            console.error(`❌ Error executing ${scriptName}:`, e);
                            reject(e);
                        }
                    } else {
                        console.error(`❌ HTTP ${response.status} for ${scriptName}`);
                        reject(new Error(`HTTP ${response.status}`));
                    }
                },
                onerror: function(error) {
                    console.error(`❌ Network error for ${scriptName}:`, error);
                    reject(error);
                },
                ontimeout: function() {
                    console.error(`❌ Timeout for ${scriptName}`);
                    reject(new Error('Timeout'));
                }
            });
        });
    }

    async function tryLoadFromUrls(scriptName) {
        for (const baseUrl of URLS) {
            try {
                console.log(`🦆 Trying ${baseUrl} for ${scriptName}`);
                await loadScript(baseUrl, scriptName);
                return true; // Success
            } catch (e) {
                console.log(`🦆 Failed with ${baseUrl}:`, e.message);
                // Continue to next URL
            }
        }
        return false; // All URLs failed
    }

    async function loadScripts() {
        console.log('🦆 Starting to load scripts...');

        // Try settings.js first
        const settingsLoaded = await tryLoadFromUrls('settings.js');
        if (!settingsLoaded) {
            console.error('❌ Could not load settings.js from any URL');
            showError('Failed to load settings.js');
            return;
        }

        // Then try main.js
        const mainLoaded = await tryLoadFromUrls('main.js');
        if (!mainLoaded) {
            console.error('❌ Could not load main.js from any URL');
            showError('Failed to load main.js');
            return;
        }

        console.log('🦆 All scripts loaded successfully!');
        showSuccess();
    }

    function showError(message) {
        GM_addStyle(`
            .fc-error {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #ef4444;
                color: white;
                padding: 15px 25px;
                border-radius: 30px;
                z-index: 999999;
                font-family: monospace;
                font-size: 14px;
                box-shadow: 0 4px 15px rgba(239,68,68,0.3);
                border: 2px solid rgba(255,255,255,0.3);
                animation: slideIn 0.3s ease;
                max-width: 300px;
                word-break: break-word;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `);

        setTimeout(() => {
            if (document.body) {
                const error = document.createElement('div');
                error.className = 'fc-error';
                error.innerHTML = `❌ ${message}<br><small>Check console (F12) for details</small>`;
                document.body.appendChild(error);

                setTimeout(() => {
                    if (error.parentNode) error.remove();
                }, 8000);
            }
        }, 1000);
    }

    function showSuccess() {
        GM_addStyle(`
            .fc-success {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 12px 24px;
                border-radius: 30px;
                z-index: 999999;
                font-family: 'Segoe UI', sans-serif;
                font-weight: 600;
                animation: slideIn 0.3s ease, fadeOut 3s forwards;
                border: 2px solid rgba(255,255,255,0.3);
            }
            @keyframes fadeOut {
                0% { opacity: 1; }
                70% { opacity: 1; }
                100% { opacity: 0; transform: translateX(100%); }
            }
        `);

        setTimeout(() => {
            if (document.body) {
                const success = document.createElement('div');
                success.className = 'fc-success';
                success.textContent = '🦆 DuckyQuack scripts loaded!';
                document.body.appendChild(success);

                setTimeout(() => {
                    if (success.parentNode) success.remove();
                }, 3000);
            }
        }, 1000);
    }

    // Start loading
    loadScripts();

})();
```

This version will automatically update whenever I push improvements! 🚀

### Option 2: Manual (No Auto-Updates)
If you prefer to read the code or don't want auto-updates, use the main script directly:
https://github.com/MrDuckyQuack/Freecash-Progress-Percentage/blob/main/freecash-script

-------------------------------------------------------------------------------

## 🔄 Auto-Updates

The loader script automatically fetches the latest version from GitHub. No need to manually update!

## 📝 Changelog

**Version 3.2**
- Added animated loading indicator
- Fixed loader visibility issues
- Improved animation smoothness

**Version 3.0**
- Added built-in loader
- Enhanced number roll animations
- Better decimal highlighting

-------------------------------------------------------------------------------

## 👤 Author

**DuckyQuack**

- GitHub: [@MrDuckyQuack](https://github.com/MrDuckyQuack)

-------------------------------------------------------------------------------

## 📜 License

This project is open source and available to everyone! Feel free to modify and share.

-------------------------------------------------------------------------------

## 🐛 Bugs & Issues

Found a bug? Something not working right? Let me know!

📱 **Discord:** [Join Freecash Server](https://discord.gg/Y3zZrnEEN4) and Private Message real_mr.duck

When reporting a bug, please include:
- What happened
- What should have happened
- Screenshot (if possible)
- Freecash page you were on

I'll fix it as soon as possible! 🛠️

-------------------------------------------------------------------------------

⭐ **Enjoy your progress bars!** ⭐
