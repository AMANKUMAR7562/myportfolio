/**
 * AMAN KUMAR PORTFOLIO — 3D PANEL SCROLL DRIVER
 *
 * Responsibilities:
 *   - Reveal sections as they enter viewport (panel-visible class)
 *   - Mark past sections (panel-past class)
 *   - Apply mouse-tilt CSS vars to sections within view
 *   - Drive smooth CSS 3D transforms via rAF
 */

(function () {
  'use strict';

  const SECTIONS = Array.from(document.querySelectorAll('section.hero, section.sec'));
  if (!SECTIONS.length) return;

  let mx = 0.5, my = 0.5;

  window.addEventListener('mousemove', e => {
    mx = e.clientX / window.innerWidth;
    my = e.clientY / window.innerHeight;
  }, { passive: true });

  /* ── Reveal hero immediately, others when they enter view ─── */
  function revealVisiblePanels() {
    SECTIONS.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.95 && rect.bottom > 0;
      if (inView) {
        sec.classList.add('panel-visible');
        sec.classList.remove('panel-past');
      }
    });
  }

  // Trigger initial reveal when loader dismisses
  // app.js fires __revealBlob after 300ms; we use a similar small delay
  setTimeout(revealVisiblePanels, 400);
  window.addEventListener('scroll', revealVisiblePanels, { passive: true });


  /* ── Panel visibility observer ────────────────────────────── */
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        const el = e.target;
        if (e.isIntersecting) {
          el.classList.add('panel-visible');
          el.classList.remove('panel-past');
        } else {
          // Was it above the viewport? (scrolled past)
          const rect = el.getBoundingClientRect();
          if (rect.bottom < 0) {
            el.classList.remove('panel-visible');
            el.classList.add('panel-past');
          } else {
            // Below viewport — not yet reached
            el.classList.remove('panel-visible', 'panel-past');
          }
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });

    SECTIONS.forEach(s => obs.observe(s));
  } else {
    // Fallback: reveal all
    SECTIONS.forEach(s => s.classList.add('panel-visible'));
  }

  /* ── Mouse-tilt on hovered section ───────────────────────── */
  const MAX_TILT = 2.5; // degrees

  function tick() {
    requestAnimationFrame(tick);

    SECTIONS.forEach(sec => {
      if (!sec.classList.contains('panel-visible')) return;

      const rect = sec.getBoundingClientRect();
      const inView =
        rect.top < window.innerHeight * 0.9 &&
        rect.bottom > window.innerHeight * 0.1;

      if (!inView) return;

      // Mouse position relative to section centre
      const cx = (rect.left + rect.width  / 2) / window.innerWidth;
      const cy = (rect.top  + rect.height / 2) / window.innerHeight;

      const dx = (mx - cx) * MAX_TILT;
      const dy = (my - cy) * -MAX_TILT;

      sec.style.setProperty('--tiltX', `${dy.toFixed(2)}deg`);
      sec.style.setProperty('--tiltY', `${dx.toFixed(2)}deg`);
      sec.classList.add('tilt-active');
    });
  }

  tick();

})();
