/**
 * AMAN KUMAR PORTFOLIO — CORE APPLICATION COORDINATOR
 * Coding Language: Modern JavaScript (ES6+)
 */

(function () {
  'use strict';

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  /* ============ CLEAN CANONICAL URL ============ */
  if (window.location.pathname.endsWith('/index.html')) {
    const cleanPath = window.location.pathname.replace(/\/index\.html$/, '/') + window.location.search + window.location.hash;
    try {
      window.history.replaceState(null, '', cleanPath);
    } catch (_) {}
  }

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
        threshold: 0.01,
        rootMargin: '100px 0px 100px 0px'
      });

      $$('.rv').forEach((el) => observer.observe(el));
      setTimeout(() => {
        $$('.rv').forEach((el) => el.classList.add('in'));
      }, 1000);
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
        if (a.closest('.n-links')) {
          $$('.n-links a').forEach((l) => l.classList.remove('on'));
          a.classList.add('on');
        }
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
  const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
  if (burgerBtn) {
    burgerBtn.addEventListener('click', function () {
      document.body.classList.toggle('menu');
    });
  }
  mobileMenuLinks.forEach((link) => {
    link.addEventListener('click', function () {
      document.body.classList.remove('menu');
    });
  });

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
    { id: 'services', num: '02', label: 'Services' },
    { id: 'about', num: '03', label: 'About' },
    { id: 'work', num: '04', label: 'Works' },
    { id: 'testimonials', num: '05', label: 'Clients' },
    { id: 'faq', num: '06', label: 'FAQ' },
    { id: 'experience', num: '07', label: 'Journey' },
    { id: 'contact', num: '08', label: 'Contact' }
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
        const top = secEl.offsetTop - 180;
        if (scrollY >= top) {
          current = sections[i].num;
          break;
        }
      }
    }

    // Edge-case: near bottom of page activates contact
    if (maxScroll > 0 && scrollY >= maxScroll - 80) {
      current = sections[sections.length - 1].num;
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
    if (c1) c1.textContent = str;
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
        if (!e.target.closest('a') && !e.target.closest('.csr-peek-btn') && !e.target.closest('.csr-peek-drawer')) {
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

  /* ============================================================
     INTERACTIVE SECTION CONTROLLERS (Show a little, expand on click)
     ============================================================ */

  // 1. Works Category Segment Tabs
  function initWorksSegments() {
    const tabBtns = document.querySelectorAll('.ws-tab-btn');
    const panes = document.querySelectorAll('.works-pane');
    if (!tabBtns.length || !panes.length) return;

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view');
        tabBtns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        panes.forEach((pane) => {
          pane.classList.remove('active');
        });

        const targetPane = document.getElementById('pane-' + view);
        if (targetPane) {
          targetPane.classList.add('active');
          // If switching to graphic archive or video motion, trigger reveals
          if (typeof window.triggerReveals === 'function') {
            window.triggerReveals();
          }
        }
      });
    });
  }

  // 2. Case Study Row Inline Breakdown Drawers
  function initCaseStudyPeekDrawers() {
    const peekBtns = document.querySelectorAll('.csr-peek-btn');
    peekBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const row = btn.closest('.case-study-row');
        const drawer = row ? row.querySelector('.csr-peek-drawer') : null;
        if (!drawer) return;

        const isOpen = drawer.classList.contains('open');

        // Close all other open drawers first for clean accordion UX
        document.querySelectorAll('.csr-peek-drawer.open').forEach((d) => {
          if (d !== drawer) {
            d.classList.remove('open');
            const parentRow = d.closest('.case-study-row');
            if (parentRow) {
              const otherBtn = parentRow.querySelector('.csr-peek-btn');
              if (otherBtn) {
                otherBtn.classList.remove('active');
                otherBtn.setAttribute('aria-expanded', 'false');
                otherBtn.innerHTML = '<span>✦ Breakdown</span>';
              }
            }
          }
        });

        if (!isOpen) {
          drawer.classList.add('open');
          btn.classList.add('active');
          btn.setAttribute('aria-expanded', 'true');
          btn.innerHTML = '<span>✕ Close</span>';
        } else {
          drawer.classList.remove('open');
          btn.classList.remove('active');
          btn.setAttribute('aria-expanded', 'false');
          btn.innerHTML = '<span>✦ Breakdown</span>';
        }
      });
    });
  }

  // 3. Toolkit Capabilities Expanders
  function initToolkitExpanders() {
    const expandBtns = document.querySelectorAll('.toolkit-expand-btn');
    expandBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('.toolkit-card');
        const drawer = card ? card.querySelector('.toolkit-drawer') : null;
        if (!drawer) return;

        const isOpen = drawer.classList.toggle('open');
        btn.classList.toggle('active', isOpen);
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        const chevron = btn.querySelector('.tk-chevron');
        if (chevron) chevron.style.transform = isOpen ? 'rotate(180deg)' : '';
      });
    });
  }

  // 4. Certification Grid Accordion Teaser
  function initCertTeaser() {
    const teaserCard = document.getElementById('certTeaserCard');
    const drawer = document.getElementById('certDrawer');
    const btnTxt = document.getElementById('certTeaserBtnTxt');
    const chevron = document.getElementById('certTeaserChevron');
    if (!teaserCard || !drawer) return;

    teaserCard.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      teaserCard.classList.toggle('active', isOpen);
      teaserCard.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (btnTxt) {
        btnTxt.textContent = isOpen ? 'Collapse Credentials' : 'View All Credentials (05)';
      }
      if (chevron) {
        chevron.style.transform = isOpen ? 'rotate(180deg)' : '';
      }
    });

    teaserCard.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        teaserCard.click();
      }
    });
  }

  // 5. Portavia FAQ Accordion
  function initFaqAccordion() {
    const faqButtons = document.querySelectorAll('.faq-trigger-btn');
    faqButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const item = btn.closest('.faq-accordion-item');
        if (!item) return;
        const wasActive = item.classList.contains('active');
        document.querySelectorAll('.faq-accordion-item').forEach((i) => {
          i.classList.remove('active');
          const trigger = i.querySelector('.faq-trigger-btn');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        });
        if (!wasActive) {
          item.classList.add('active');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  // Initialize all interactive extensions
  initWorksSegments();
  initCaseStudyPeekDrawers();
  initToolkitExpanders();
  initCertTeaser();
  initFaqAccordion();

})();
