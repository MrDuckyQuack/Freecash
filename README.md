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
// @name         Freecash Loader - DuckyQuack
// @namespace    freecash-loader-ducky
// @version      2.2
// @description  Dynamic loader for Freecash scripts
// @author       DuckyQuack
// @match        https://freecash.com/*
// @match        https://www.freecash.com/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      raw.githubusercontent.com
// ==/UserScript==

(function () {
    "use strict";

    const BASE_URL = "https://raw.githubusercontent.com/MrDuckyQuack/Freecash-Progress-Percentage/main/freecash/";
    const MANIFEST_URL = BASE_URL + "loader-manifest.json?v=" + Date.now();

    async function fetchFile(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                timeout: 10000,
                onload: (res) => {
                    if (res.status === 200) resolve(res.responseText);
                    else reject("HTTP " + res.status + " for " + url);
                },
                onerror: reject,
                ontimeout: () => reject("Timeout for " + url)
            });
        });
    }

    async function start() {
        try {
            console.log("🦆 Loading manifest...");
            const manifestText = await fetchFile(MANIFEST_URL);
            const manifest = JSON.parse(manifestText);

            if (!Array.isArray(manifest.scripts) || manifest.scripts.length === 0) {
                console.error("❌ Manifest scripts array empty or invalid");
                return;
            }

            for (const file of manifest.scripts) {
                const fileUrl = BASE_URL + file + "?v=" + Date.now();
                const code = await fetchFile(fileUrl);

                try {
                    // Execute inside userscript sandbox → GM_* works
                    eval(code);
                    console.log("✅ Loaded:", file);
                } catch (e) {
                    console.error("❌ Script execution error in", file, e);
                }
            }

            console.log("🦆 All scripts loaded!");

        } catch (err) {
            console.error("❌ Loader failed:", err);
            if (typeof GM_addStyle !== "undefined") {
                GM_addStyle(`
                    .fc-error {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        background: #ef4444;
                        color: white;
                        padding: 12px 20px;
                        border-radius: 20px;
                        z-index: 999999;
                        font-family: monospace;
                        font-size: 14px;
                    }
                `);
                const div = document.createElement("div");
                div.className = "fc-error";
                div.textContent = "❌ Freecash loader failed. Check console.";
                document.body.appendChild(div);
            }
        }
    }

    start();
})();
```

This version will automatically update whenever I push improvements! 🚀

### Option 2: Manual (No Auto-Updates)
If you prefer to read the code or don't want auto-updates, use the main script directly:
https://github.com/MrDuckyQuack/Freecash-Progress-Percentage/tree/main/freecash

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
