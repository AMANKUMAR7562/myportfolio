/**
 * AMAN KUMAR PORTFOLIO — CUSTOM DESIGNER RETICLE CURSOR & FLOATING PREVIEW
 * Coding Language: Modern JavaScript (ES6+)
 */

(function () {
  'use strict';

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!finePointer) return;

  document.body.classList.add('cur-on');

  const curDot = document.getElementById('curDot');
  const curRing = document.getElementById('curRing');
  const hudCoords = document.getElementById('hudCoords');

  if (!curDot || !curRing) return;

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let lastTarget = null;
  let lastTime = performance.now();
  let hudText = '';

  window.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Instant 0ms hardware cursor response for the reticle dot (locks to cursor pointer without frame lag)
    curDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

    // Adaptive contrast: run closest() ONLY when entering a new element (prevents layout/DOM thrashing on every pixel)
    if (e.target && e.target !== lastTarget) {
      lastTarget = e.target;
      const isOverDark = Boolean(lastTarget.closest(
        '#lightbox, .lightbox, #reelModal, .reel-modal, #csLightbox, .cs-lightbox, [data-theme="obsidian"], footer'
      ));
      const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'obsidian' || document.body.getAttribute('data-theme') === 'obsidian';
      const isModalLocked = document.body.classList.contains('lock');

      if (isOverDark || isDarkTheme || isModalLocked) {
        curRing.classList.add('cur-light');
      } else {
        curRing.classList.remove('cur-light');
      }
    }
  }, { passive: true });

  function updateCursor(now) {
    // Delta-time based frame-rate independent tracking: stays buttery smooth across 60Hz, 120Hz, 144Hz+ displays
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    // Fluid, responsive ring tracking (hugs dot smoothly without trailing gaps)
    const factor = 1 - Math.pow(0.0001, dt);
    ringX += (mouseX - ringX) * factor;
    ringY += (mouseY - ringY) * factor;

    // GPU-accelerated translate3d with translate(-50%, -50%) for perfect centering with 0 offsetWidth layout thrashing
    curRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    curDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

    // Update HUD coordinates at most once per RAF frame (eliminates DOM string mutations during fast mouse sweeps)
    if (hudCoords) {
      const xStr = String(Math.round(mouseX)).padStart(3, '0');
      const yStr = String(Math.round(mouseY)).padStart(3, '0');
      const newHud = `X: ${xStr}  Y: ${yStr}`;
      if (newHud !== hudText) {
        hudText = newHud;
        hudCoords.textContent = newHud;
      }
    }

    requestAnimationFrame(updateCursor);
  }
  requestAnimationFrame(updateCursor);

  // Attach hover effect listeners safely
  function attachCursorHover() {
    const hoverTargets = document.querySelectorAll('a, button, input, textarea, select, .stat-box, .g-tab, .tk-swatch, .lb-close, .lb-nav-btn, .reel-modal-close, .reel-nav-btn');
    hoverTargets.forEach((el) => {
      if (el.dataset.curHoverAttached) return;
      el.dataset.curHoverAttached = '1';
      el.addEventListener('mouseenter', () => curRing.classList.add('hover'));
      el.addEventListener('mouseleave', () => curRing.classList.remove('hover'));
    });

    const viewTargets = document.querySelectorAll('.gallery-item, .profile-card, .toolkit-card, .cert-card');
    viewTargets.forEach((el) => {
      if (el.dataset.curViewAttached) return;
      el.dataset.curViewAttached = '1';
      el.addEventListener('mouseenter', () => curRing.classList.add('view'));
      el.addEventListener('mouseleave', () => curRing.classList.remove('view'));
    });
  }

  function resetCursorState() {
    if (curRing) {
      curRing.classList.remove('view', 'hover');
      const isModalLocked = document.body.classList.contains('lock');
      const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'obsidian' || document.body.getAttribute('data-theme') === 'obsidian';
      if (isModalLocked || isDarkTheme) {
        curRing.classList.add('cur-light');
      } else {
        curRing.classList.remove('cur-light');
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachCursorHover);
  } else {
    attachCursorHover();
  }

  window.Cursor = {
    attach: attachCursorHover,
    resetState: resetCursorState,
    get mouseX() { return mouseX; },
    get mouseY() { return mouseY; }
  };
})();
