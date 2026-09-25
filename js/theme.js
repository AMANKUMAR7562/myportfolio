/**
 * AMAN KUMAR PORTFOLIO — THEME & MULTI-MOOD CONTROLLER
 * Supports: Studio Cream (default), Obsidian Luxury Dark, and Dynamic Spectrum.
 * Coding Language: Modern JavaScript (ES6+)
 */

(function () {
  'use strict';

  const root = document.documentElement;
  const toastEl = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  let currentTheme = 'cream';
  let rainbowFlag = 0;
  let themeHue = 16; // International Orange default ~16deg
  let rafId = null;

  // Read saved theme & frozen spectrum hue from localStorage
  try {
    const saved = localStorage.getItem('aman-portfolio-theme');
    if (saved && ['cream', 'obsidian'].includes(saved)) {
      currentTheme = saved;
    } else if (saved === 'acid') {
      currentTheme = 'cream';
      localStorage.setItem('aman-portfolio-theme', 'cream');
    }

    const savedHue = localStorage.getItem('aman-spectrum-hue');
    if (savedHue !== null && !isNaN(parseFloat(savedHue))) {
      themeHue = parseFloat(savedHue);
    }
  } catch (e) {}

  // Apply Theme Preset
  function setTheme(theme, persist = true) {
    currentTheme = theme;
    if (persist) {
      try {
        localStorage.setItem('aman-portfolio-theme', theme);
      } catch (e) {}
    }

    const hasFrozenHue = Boolean(localStorage.getItem('aman-spectrum-hue'));

    if (theme === 'cream') {
      root.removeAttribute('data-theme');
      if (!rainbowFlag && !hasFrozenHue) {
        themeHue = 16;
      }
    } else if (theme === 'obsidian') {
      root.setAttribute('data-theme', 'obsidian');
      if (!rainbowFlag && !hasFrozenHue) {
        themeHue = 16;
      }
    }

    // Reset inline style overrides only if not running spectrum and no frozen hue is active
    if (!rainbowFlag && !hasFrozenHue) {
      clearDynamicStyles();
    } else if (!rainbowFlag && hasFrozenHue) {
      applyHue(themeHue);
    }

    // Update active state in UI buttons
    document.querySelectorAll('.theme-opt-btn').forEach((btn) => {
      const target = btn.getAttribute('data-theme-set');
      if (target === theme && !rainbowFlag) {
        btn.classList.add('active');
      } else if (target !== 'spectrum') {
        btn.classList.remove('active');
      }
    });

    if (typeof window.__onThemeChange === 'function') {
      window.__onThemeChange(currentTheme);
    }
  }

  // Clear dynamic CSS variables to let stylesheet defaults take over
  function clearDynamicStyles() {
    root.style.removeProperty('--acc');
    root.style.removeProperty('--acc-hover');
    root.style.removeProperty('--acc-glow');
    root.style.removeProperty('--acc-rgb');
    root.style.removeProperty('--bg');
    root.style.removeProperty('--bg-subtle');
    root.style.removeProperty('--bg-card');
    root.style.removeProperty('--bg-card-hover');
    root.style.removeProperty('--ink');
    root.style.removeProperty('--line');
    root.style.removeProperty('--nav-bg');
  }

  // Helper: HSL to RGB String
  function hslToRgbString(h, s, l) {
    s /= 100; l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    return `${Math.round((r + m) * 255)}, ${Math.round((g + m) * 255)}, ${Math.round((g + m) * 255)}`;
  }

  // Dynamic Spectrum Mode: cycles ALL colors in harmony
  function applyHue(h) {
    const hInt = Math.round(h) % 360;

    // Accent colors
    root.style.setProperty('--acc', `hsl(${hInt}, 98%, 52%)`);
    root.style.setProperty('--acc-hover', `hsl(${hInt}, 98%, 46%)`);
    root.style.setProperty('--acc-glow', `hsla(${hInt}, 98%, 52%, 0.28)`);
    root.style.setProperty('--acc-rgb', hslToRgbString(hInt, 98, 52));

    if (currentTheme === 'cream') {
      // Warm tinted light palette
      root.style.setProperty('--bg', `hsl(${hInt}, 26%, 96%)`);
      root.style.setProperty('--bg-subtle', `hsl(${hInt}, 28%, 91%)`);
      root.style.setProperty('--bg-card', `hsla(${hInt}, 30%, 99%, 0.85)`);
      root.style.setProperty('--bg-card-hover', `hsl(${hInt}, 35%, 100%)`);
      root.style.setProperty('--ink', `hsl(${hInt}, 25%, 10%)`);
      root.style.setProperty('--line', `hsla(${hInt}, 30%, 20%, 0.10)`);
      root.style.setProperty('--nav-bg', `hsla(${hInt}, 26%, 96%, 0.88)`);
    } else {
      // Rich dark tint palette
      root.style.setProperty('--bg', `hsl(${hInt}, 22%, 5%)`);
      root.style.setProperty('--bg-subtle', `hsl(${hInt}, 24%, 8%)`);
      root.style.setProperty('--bg-card', `hsla(${hInt}, 26%, 10%, 0.75)`);
      root.style.setProperty('--bg-card-hover', `hsla(${hInt}, 30%, 14%, 0.90)`);
      root.style.setProperty('--ink', `hsl(${hInt}, 15%, 96%)`);
      root.style.setProperty('--line', `hsla(${hInt}, 50%, 80%, 0.12)`);
      root.style.setProperty('--nav-bg', `hsla(${hInt}, 22%, 5%, 0.88)`);
    }
  }

  function rainbowLoop() {
    if (!rainbowFlag) return;
    themeHue = (themeHue + 0.5) % 360;
    applyHue(themeHue);
    rafId = requestAnimationFrame(rainbowLoop);
  }

  function toggleRainbow() {
    rainbowFlag = rainbowFlag ? 0 : 1;

    const spectrumBtns = document.querySelectorAll('[data-theme-set="spectrum"]');

    if (rainbowFlag) {
      // Start continuous cycling
      spectrumBtns.forEach((btn) => btn.classList.add('active'));
      rainbowLoop();
      showToast('✦ SPECTRUM MODE — ON');
    } else {
      // Stop continuous cycling: freeze at current exact color & keep as active theme
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      spectrumBtns.forEach((btn) => btn.classList.remove('active'));

      // Lock current color
      applyHue(themeHue);
      try {
        localStorage.setItem('aman-spectrum-hue', themeHue.toFixed(1));
      } catch (e) {}

      showToast('✦ COLOR LOCKED');
    }
  }

  function showToast(msg) {
    if (toastMsg && toastEl) {
      toastMsg.textContent = msg;
      toastEl.classList.add('on');
      setTimeout(() => toastEl.classList.remove('on'), 2500);
    }
  }

  // Keyboard Easter Egg: type "aman" anywhere to toggle Spectrum mode
  let typedKeys = '';
  window.addEventListener('keydown', function (e) {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
    if (e.key.length !== 1) return;

    typedKeys = (typedKeys + e.key.toLowerCase()).slice(-4);
    if (typedKeys === 'aman') {
      toggleRainbow();
    }
  });

  // Attach UI Theme buttons click listener
  function initThemeButtons() {
    document.querySelectorAll('.theme-opt-btn').forEach((btn) => {
      btn.addEventListener('click', function () {
        const target = this.getAttribute('data-theme-set');
        if (target === 'spectrum') {
          toggleRainbow();
        } else {
          // If rainbow mode was running, stop it
          if (rainbowFlag) {
            rainbowFlag = 0;
            if (rafId) {
              cancelAnimationFrame(rafId);
              rafId = null;
            }
            document.querySelectorAll('[data-theme-set="spectrum"]').forEach((b) => b.classList.remove('active'));
          }

          // User manually selected a preset theme: clear frozen hue & restore stylesheet defaults
          try {
            localStorage.removeItem('aman-spectrum-hue');
          } catch (e) {}
          clearDynamicStyles();

          setTheme(target);
          showToast(`✦ MOOD: ${target.toUpperCase()}`);
        }
      });
    });
  }

  function init() {
    setTheme(currentTheme, false);
    if (localStorage.getItem('aman-spectrum-hue')) {
      applyHue(themeHue);
    }
    initThemeButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Global ThemeManager export
  window.ThemeManager = {
    get currentTheme() { return currentTheme; },
    get isDarkMode() { return currentTheme !== 'cream'; },
    get rainbowFlag() { return rainbowFlag; },
    get themeHue() { return themeHue; },
    set themeHue(val) { themeHue = val; },
    setTheme: setTheme,
    toggleRainbow: toggleRainbow
  };
})();
