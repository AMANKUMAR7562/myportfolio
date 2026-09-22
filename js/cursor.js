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

  window.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    curDot.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;

    if (hudCoords) {
      const xStr = String(Math.round(mouseX)).padStart(3, '0');
      const yStr = String(Math.round(mouseY)).padStart(3, '0');
      hudCoords.textContent = `X: ${xStr}  Y: ${yStr}`;
    }
  }, { passive: true });

  let curFrameSkip = 0;
  function updateCursor() {
    if (++curFrameSkip % 2 === 0) {
      ringX = lerp(ringX, mouseX, 0.20);
      ringY = lerp(ringY, mouseY, 0.20);
      curRing.style.transform = `translate(${ringX - curRing.offsetWidth / 2}px, ${ringY - curRing.offsetHeight / 2}px)`;
    }
    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  // Attach hover effect listeners
  function attachCursorHover() {
    const hoverTargets = document.querySelectorAll('a, button, input, textarea, select, .stat-box, .g-tab, .tk-swatch');
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => curRing.classList.add('hover'));
      el.addEventListener('mouseleave', () => curRing.classList.remove('hover'));
    });

    const viewTargets = document.querySelectorAll('.gallery-item, .profile-card, .toolkit-card, .cert-card');
    viewTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => curRing.classList.add('view'));
      el.addEventListener('mouseleave', () => curRing.classList.remove('view'));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachCursorHover);
  } else {
    attachCursorHover();
  }

  window.Cursor = {
    attach: attachCursorHover,
    get mouseX() { return mouseX; },
    get mouseY() { return mouseY; }
  };
})();
