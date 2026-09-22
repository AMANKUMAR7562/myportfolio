/**
 * AMAN KUMAR PORTFOLIO — CORE APPLICATION COORDINATOR
 * Coding Language: Modern JavaScript (ES6+)
 */

(function () {
  'use strict';

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  /* ============ PRELOADER & COUNTER ============ */
  const ldNum = $('#ldNum');
  const ldBar = $('#ldBar');
  const ldWord = $('#ldWord');
  const loader = $('#loader');

  const ldWords = ['quiet intelligence', 'high conversion', 'vector precision', 'pure systems'];
  let wordIdx = 0;
  let count = 0;

  const ldInterval = setInterval(function () {
    count += Math.floor(Math.random() * 9) + 4;
    if (count > 100) count = 100;

    if (ldNum) ldNum.textContent = count;
    if (ldBar) ldBar.style.width = count + '%';

    if (count % 25 === 0 && count < 100 && ldWord) {
      wordIdx = (wordIdx + 1) % ldWords.length;
      ldWord.textContent = ldWords[wordIdx];
    }

    if (count >= 100) {
      clearInterval(ldInterval);
      setTimeout(function () {
        if (loader) loader.classList.add('done');
        document.body.classList.remove('lock');
        initReveals();
      }, 250);
    }
  }, 30);

  /* ============ REVEAL ANIMATIONS ON SCROLL ============ */
  function initReveals() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px'
      });

      $$('.rv').forEach((el) => observer.observe(el));
    } else {
      $$('.rv').forEach((el) => el.classList.add('in'));
    }
  }

  /* ============ NATIVE SMOOTH SCROLLING ============ */
  function scrollToTarget(target) {
    const el = typeof target === 'string' ? $(target) : target;
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth' });
  }

  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', function (e) {
      const href = a.getAttribute('href');
      if (href && href.length > 1) {
        e.preventDefault();
        document.body.classList.remove('menu');
        scrollToTarget(href);
      }
    });
  });

  const topBtn = $('#top');
  if (topBtn) {
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const burgerBtn = $('#burger');
  if (burgerBtn) {
    burgerBtn.addEventListener('click', function () {
      document.body.classList.toggle('menu');
    });
  }

  /* ============ SPEC MODE (FIGMA INSPECTION) ============ */
  function initSpecMode() {
    const specBtns = $$('.spec-toggle-btn');
    specBtns.forEach((btn) => {
      btn.addEventListener('click', function () {
        document.body.classList.toggle('spec-mode-active');
        const isActive = document.body.classList.contains('spec-mode-active');

        const toastEl = $('#toast');
        const toastMsg = $('#toastMsg');
        if (toastEl && toastMsg) {
          toastMsg.textContent = isActive ? '✦ FIGMA SPEC MODE: ACTIVE' : '✦ SPEC MODE: OFF';
          toastEl.classList.add('on');
          setTimeout(() => toastEl.classList.remove('on'), 2500);
        }
      });
    });
  }
  initSpecMode();

  /* ============ COLOR SWATCHES CLICK TO COPY ============ */
  function initColorSwatches() {
    $$('.tk-swatch').forEach((swatch) => {
      swatch.addEventListener('click', function () {
        const hex = this.getAttribute('data-hex');
        if (hex && navigator.clipboard) {
          navigator.clipboard.writeText(hex).then(() => {
            const toastEl = $('#toast');
            const toastMsg = $('#toastMsg');
            if (toastEl && toastMsg) {
              toastMsg.textContent = `✦ COPIED: ${hex}`;
              toastEl.classList.add('on');
              setTimeout(() => toastEl.classList.remove('on'), 2200);
            }
          }).catch(() => { });
        }
      });
    });
  }
  initColorSwatches();

  /* ============ HUD & SCROLL TRACKER ============ */
  const hud = $('.hud');
  const hudCluster = $('.hud-cluster');
  const hudIdx = $('#hudIdx');
  const hudName = $('#hudName');
  const hudPct = $('#hudPct');
  const progressBar = $('#bar');
  const nav = $('#nav');
  const footer = $('footer');
  const heroStrip = $('.h-bottom-strip');

  const sections = [
    { id: 'hero', num: '01', label: 'Intro' },
    { id: 'about', num: '02', label: 'About' },
    { id: 'work', num: '03', label: 'Works' },
    { id: 'skills', num: '04', label: 'Toolkit' },
    { id: 'experience', num: '05', label: 'Journey' },
    { id: 'contact', num: '06', label: 'Contact' }
  ];

  let lastHudIdx = '01';
  let isTicking = false;

  function onScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const pct = maxScroll > 0 ? Math.round((scrollY / maxScroll) * 100) : 0;

    if (hudPct) hudPct.textContent = pct + '%';
    if (progressBar) progressBar.style.width = pct + '%';

    if (nav) {
      if (scrollY > 50) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }

    // Dock HUD elements so they never overlap Hero Bottom Strip or Footer
    if (hud || hudCluster) {
      const vh = window.innerHeight;
      let targetTranslateY = 0;

      // 1. Check Footer Collision (when near bottom of page)
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        const footerOverlap = vh - footerRect.top;
        if (footerOverlap > 0) {
          targetTranslateY = -footerOverlap;
        }
      }

      // 2. Check Hero Bottom Strip Collision (when near top of page)
      if (targetTranslateY === 0 && heroStrip) {
        const stripRect = heroStrip.getBoundingClientRect();
        if (stripRect.top < vh && stripRect.bottom > 0) {
          // Upward offset required to sit 16px above the top line of the hero strip
          const requiredOffset = (stripRect.top - 16) - (vh - 24);
          // Distance from bottom of strip to normal top of HUD (vh - 48)
          const clearance = (vh - 48) - stripRect.bottom;

          if (clearance <= 0) {
            // Strip is overlapping or below normal HUD position -> lock HUD above strip
            targetTranslateY = requiredOffset;
          } else if (clearance < 100) {
            // Strip has slid past normal HUD position -> smoothly blend back down to normal
            const progress = clearance / 100;
            const blend = (1 - Math.cos(progress * Math.PI)) / 2;
            targetTranslateY = requiredOffset * (1 - blend);
          } else {
            targetTranslateY = 0;
          }
        }
      }

      const transformStr = targetTranslateY !== 0 ? `translate3d(0, ${Math.round(targetTranslateY)}px, 0)` : 'translate3d(0, 0, 0)';
      if (hud) hud.style.transform = transformStr;
      if (hudCluster) hudCluster.style.transform = transformStr;
    }

    // Determine current active section
    let current = '01';
    for (let i = sections.length - 1; i >= 0; i--) {
      const secEl = document.getElementById(sections[i].id);
      if (secEl) {
        const top = secEl.offsetTop - 220;
        if (scrollY >= top) {
          current = sections[i].num;
          break;
        }
      }
    }

    if (current !== lastHudIdx) {
      lastHudIdx = current;
      const sec = sections.find((s) => s.num === current);
      if (sec) {
        if (hudIdx) hudIdx.textContent = sec.num;
        if (hudName) hudName.textContent = sec.label;
      }
      // Update nav link active underline
      $$('.n-links a').forEach((link) => {
        if (link.getAttribute('href') === `#${sec?.id}`) {
          link.classList.add('on');
        } else {
          link.classList.remove('on');
        }
      });
    }

    isTicking = false;
  }

  window.addEventListener('scroll', function () {
    if (!isTicking) {
      window.requestAnimationFrame(onScroll);
      isTicking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', function () {
    if (!isTicking) {
      window.requestAnimationFrame(onScroll);
      isTicking = true;
    }
  }, { passive: true });

  onScroll();

  /* ============ LIVE CLOCK (NEW DELHI IST) ============ */
  function updateClock() {
    const now = new Date();
    const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const h = String(ist.getHours()).padStart(2, '0');
    const m = String(ist.getMinutes()).padStart(2, '0');
    const s = String(ist.getSeconds()).padStart(2, '0');
    const str = `${h}:${m}:${s} IST`;

    const c1 = $('#clock');
    const c2 = $('#clock2');
    if (c1) c1.textContent = str;
    if (c2) c2.textContent = `${h}:${m} IST`;
  }
  updateClock();
  setInterval(updateClock, 1000);
  /* ============ WORKS SPLIT SHOWCASE COORDINATOR ============ */
  function initWorksShowcase() {
    const rows = $$('.case-study-row');
    const wpNum = $('#wpNum');
    const wpTag = $('#wpTag');
    const wpTitle = $('#wpTitle');
    const wpSub = $('#wpSub');
    const wpCardLink = $('#wpCardLink');
    const wpOrb = $('#wpOrb');
    const posterCard = $('#worksPosterCard');
    const eqSpans = $$('.wp-equalizer span');

    if (!rows.length || !posterCard) return;

    function activateRow(row) {
      rows.forEach((r) => {
        r.classList.remove('active');
        const prevIdx = r.querySelector('.csr-idx');
        if (prevIdx) prevIdx.style.color = '';
      });
      row.classList.add('active');

      const num = row.getAttribute('data-study') || '01';
      const title = row.getAttribute('data-title') || 'NEXUS AI';
      const tag = row.getAttribute('data-tag') || 'ENTERPRISE UX';
      const sub = row.getAttribute('data-sub') || 'CONTROL TOWER';
      const color = row.getAttribute('data-color') || '#D4FF00';
      const orbClass = row.getAttribute('data-orb-class') || 'orb-nexus';
      const link = row.getAttribute('data-link') || 'nexus.html';

      const activeIdx = row.querySelector('.csr-idx');
      if (activeIdx) activeIdx.style.color = color;

      if (wpNum) wpNum.textContent = num;
      if (wpTag) wpTag.textContent = tag;
      if (wpTitle) wpTitle.textContent = title;
      if (wpSub) {
        wpSub.textContent = sub;
        wpSub.style.color = color;
      }
      if (wpCardLink) {
        wpCardLink.href = link;
        if (link.startsWith('http')) {
          wpCardLink.target = '_blank';
          wpCardLink.rel = 'noopener';
        } else {
          wpCardLink.removeAttribute('target');
          wpCardLink.removeAttribute('rel');
        }
      }

      if (wpOrb) {
        wpOrb.className = 'wp-orb ' + orbClass;
      }

      eqSpans.forEach((span) => {
        span.style.background = color;
      });

      posterCard.style.borderColor = `${color}44`;
    }

    rows.forEach((row) => {
      row.addEventListener('mouseenter', () => activateRow(row));
      row.addEventListener('focus', () => activateRow(row));
      row.addEventListener('click', (e) => {
        if (!e.target.closest('a')) {
          const link = row.getAttribute('data-link');
          if (link) {
            if (link.startsWith('http')) {
              window.open(link, '_blank');
            } else {
              window.location.href = link;
            }
          }
        }
      });
    });

    if (rows[0]) {
      activateRow(rows[0]);
    }
  }

  initWorksShowcase();

  console.log('✦ Aman Kumar Portfolio — Studio Atelier Architecture Initialized.');
})();
