// ==UserScript==
// @name         Freecash Easter Egg Smooth Gem
// @namespace    freecash-easter-egg
// @version      1.2.5
// @description  Smooth animated gem-shaped diamond with duck/goat inside, triggered by Konami code
// @author       DuckyQuack
// @match        https://freecash.com/*
// @match        https://www.freecash.com/*
// @run-at       document-end
// @grant        GM_addStyle
// ==/UserScript==

(function() {
  'use strict';

  const konamiCode = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a','Enter'];
  let codeIndex = 0;

  GM_addStyle(`
    #easteregg-overlay {
      position: fixed !important;
      inset: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      background: rgba(0,0,0,0.75) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      z-index: 2147483647 !important;
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif !important;
      opacity: 0 !important;
      transition: opacity 0.5s ease !important;
    }

    #easteregg-overlay.show { opacity: 1 !important; }

    #diamond-container {
      position: relative !important;
      width: 500px !important;
      height: 500px !important;
      filter: drop-shadow(0 0 40px rgba(120, 200, 255, 0.6)) drop-shadow(0 0 80px rgba(200, 100, 255, 0.3)) !important;
    }

    #diamond-svg {
      width: 100% !important;
      height: 100% !important;
    }

    #diamond-content {
      position: absolute !important;
      top: 52% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-size: 90px !important;
      gap: 30px !important;
      pointer-events: none !important;
    }

    /* Outer wrapper mirrors the duck without touching the animation transform */
    #diamond-content .duck-mirror {
      display: inline-block !important;
      transform: scaleX(-1) !important;
    }

    /* Inner span is what actually animates */
    #diamond-content .duck-mirror span,
    #diamond-content .goat-span {
      display: inline-block !important;
    }

    #diamond-content .duck-mirror span {
      animation: bounceDuck 1.6s infinite alternate ease-in-out !important;
    }

    #diamond-content .goat-span {
      animation: bounceGoat 1.6s 0.4s infinite alternate ease-in-out !important;
    }

    @keyframes bounceDuck {
      0%   { transform: translateY(0px) rotate(0deg); }
      50%  { transform: translateY(-18px) rotate(-8deg); }
      100% { transform: translateY(0px) rotate(0deg); }
    }

    @keyframes bounceGoat {
      0%   { transform: translateY(0px) rotate(0deg); }
      50%  { transform: translateY(-18px) rotate(8deg); }
      100% { transform: translateY(0px) rotate(0deg); }
    }
  `);

  function hslToHex(h, s, l) {
    s /= 100; l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  function showEasterEgg() {
    if (document.getElementById('easteregg-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'easteregg-overlay';

    const diamondContainer = document.createElement('div');
    diamondContainer.id = 'diamond-container';

    const diamondSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    diamondSVG.id = 'diamond-svg';
    diamondSVG.setAttribute("viewBox", "0 0 100 100");
    diamondSVG.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

    // Main gradient (top-to-bottom)
    const linearGrad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    linearGrad.id = "gemGrad";
    linearGrad.setAttribute("x1","20%");
    linearGrad.setAttribute("y1","0%");
    linearGrad.setAttribute("x2","80%");
    linearGrad.setAttribute("y2","100%");

    const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop1.setAttribute("offset","0%");
    stop1.setAttribute("stop-color","#ff6688");   // pink-red
    
    const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop2.setAttribute("offset","45%");
    stop2.setAttribute("stop-color","#cc2266");   // deep red

    const stop3 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop3.setAttribute("offset","100%");
    stop3.setAttribute("stop-color","#8800cc");   // purple

    linearGrad.appendChild(stop1);
    linearGrad.appendChild(stop2);
    linearGrad.appendChild(stop3);

    // Shine gradient (radial, white highlight top-left)
    const radialGrad = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient");
    radialGrad.id = "gemShine";
    radialGrad.setAttribute("cx","35%");
    radialGrad.setAttribute("cy","25%");
    radialGrad.setAttribute("r","45%");

    const rs1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    rs1.setAttribute("offset","0%");
    rs1.setAttribute("stop-color","white");
    rs1.setAttribute("stop-opacity","0.55");

    const rs2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    rs2.setAttribute("offset","100%");
    rs2.setAttribute("stop-color","white");
    rs2.setAttribute("stop-opacity","0");

    radialGrad.appendChild(rs1);
    radialGrad.appendChild(rs2);

    // Clip path matching diamond shape
    const clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
    clipPath.id = "gemClip";
    const clipPoly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    // 💎 shape: flat top band, wide faceted middle, pointed bottom
    clipPoly.setAttribute("points", "30,0 70,0 100,35 50,100 0,35");
    clipPath.appendChild(clipPoly);

    defs.appendChild(linearGrad);
    defs.appendChild(radialGrad);
    defs.appendChild(clipPath);
    diamondSVG.appendChild(defs);

    // === FACET LINES (inner gem detail) ===
    // Top horizontal divider (top band / girdle)
    const facetGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    facetGroup.setAttribute("clip-path", "url(#gemClip)");
    facetGroup.setAttribute("stroke", "rgba(255,255,255,0.25)");
    facetGroup.setAttribute("stroke-width", "0.5");
    facetGroup.setAttribute("fill", "none");

    const facetLines = [
      // Horizontal girdle line
      "M0,35 L100,35",
      // Diagonals from top-left to center bottom
      "M30,0 L50,100",
      // Diagonals from top-right to center bottom
      "M70,0 L50,100",
      // Left facet
      "M0,35 L30,0",
      // Right facet
      "M100,35 L70,0",
      // Center top
      "M50,0 L50,35",
      // Left lower center
      "M50,35 L25,67",
      // Right lower center
      "M50,35 L75,67",
    ];

    facetLines.forEach(d => {
      const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
      line.setAttribute("d", d);
      facetGroup.appendChild(line);
    });

    // Base color fill (diamond shape)
    const basePoly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    basePoly.setAttribute("points", "30,0 70,0 100,35 50,100 0,35");
    basePoly.setAttribute("fill", "url(#gemGrad)");
    basePoly.setAttribute("opacity", "0.92");

    // Shine overlay
    const shinePoly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    shinePoly.setAttribute("points", "30,0 70,0 100,35 50,100 0,35");
    shinePoly.setAttribute("fill", "url(#gemShine)");

    diamondSVG.appendChild(basePoly);
    diamondSVG.appendChild(facetGroup);
    diamondSVG.appendChild(shinePoly);

    // === Emojis ===
    const diamondContent = document.createElement('div');
    diamondContent.id = 'diamond-content';

    const duckWrapper = document.createElement('span');
    duckWrapper.className = 'duck-mirror';
    const duck = document.createElement('span');
    duck.textContent = '🦆';
    duckWrapper.appendChild(duck);

    const goat = document.createElement('span');
    goat.className = 'goat-span';
    goat.textContent = '🐐';

    diamondContent.appendChild(duckWrapper);
    diamondContent.appendChild(goat);
    diamondContainer.appendChild(diamondSVG);
    diamondContainer.appendChild(diamondContent);
    overlay.appendChild(diamondContainer);
    document.body.appendChild(overlay);

    // === Smooth gradient color animation — sine wave per stop, no jumps ===
    let animId = null;
    let frame = 0;

    // Each stop oscillates its hue independently using a sine wave
    // All hues stay within the red(0/360°)–pink(330°)–purple(280°) band
    function sineHue(base, amplitude, speed, offset) {
      // base: center hue, amplitude: how far it swings, speed/offset: wave params
      return base + amplitude * Math.sin(frame * speed + offset);
    }

    function animateGradient() {
      frame += 0.012;

      // Stop 1: oscillates between pink (340°) and red (10°)
      const h1 = sineHue(345, 20, 1.0, 0);
      // Stop 2: oscillates between red (5°) and deep pink (320°)
      const h2 = sineHue(355, 40, 0.7, 2.1);
      // Stop 3: oscillates between purple (280°) and hot pink (310°)
      const h3 = sineHue(295, 20, 0.9, 4.2);

      const col1 = hslToHex((h1 + 360) % 360, 95, 75);
      const col2 = hslToHex((h2 + 360) % 360, 100, 58);
      const col3 = hslToHex((h3 + 360) % 360, 90, 52);

      stop1.setAttribute("stop-color", col1);
      stop2.setAttribute("stop-color", col2);
      stop3.setAttribute("stop-color", col3);

      // Also shift the glow shadow
      const r = parseInt(col2.slice(1,3),16);
      const g = parseInt(col2.slice(3,5),16);
      const b = parseInt(col2.slice(5,7),16);
      diamondContainer.style.filter = `drop-shadow(0 0 40px rgba(${r},${g},${b},0.7)) drop-shadow(0 0 80px rgba(${r},${g},${b},0.3))`;

      animId = requestAnimationFrame(animateGradient);
    }

    requestAnimationFrame(() => {
      overlay.classList.add('show');
      animateGradient();
    });

    overlay.addEventListener('click', () => {
      overlay.classList.remove('show');
      if (animId) cancelAnimationFrame(animId);
      setTimeout(() => overlay.remove(), 500);
    });
  }

  window.addEventListener('keydown', (e) => {
    const key = e.key;
    if (key === konamiCode[codeIndex]) {
      codeIndex++;
      if (codeIndex === konamiCode.length) {
        showEasterEgg();
        codeIndex = 0;
      }
    } else {
      codeIndex = 0;
    }
  });

})();
