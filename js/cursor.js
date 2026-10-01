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

  window.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (hudCoords) {
      const xStr = String(Math.round(mouseX)).padStart(3, '0');
      const yStr = String(Math.round(mouseY)).padStart(3, '0');
      hudCoords.textContent = `X: ${xStr}  Y: ${yStr}`;
    }

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

  function updateCursor() {
    // Smooth 60-144 FPS fluid interpolation on every native animation frame without artificial throttling
    ringX = lerp(ringX, mouseX, 0.22);
    ringY = lerp(ringY, mouseY, 0.22);

    // Use GPU-accelerated translate3d with translate(-50%, -50%) for perfect centering with 0 offsetWidth layout thrashing
    curDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    curRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

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
