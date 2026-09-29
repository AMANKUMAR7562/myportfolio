/**
 * CAREER PLAN B — WEBSITE REDESIGN CASE STUDY INTERACTION ENGINE
 * Unified with the Aman Kumar Portfolio Theme & Interaction System
 */

(function () {
  'use strict';

  // 1. Reading Progress Bar & Scrollspy
  const progressBar = document.getElementById('csProgressBar');
  const qlinks = document.querySelectorAll('.cs-qlink');
  const sections = document.querySelectorAll('.cs-sec');

  function updateScroll() {
    const scrollY = window.scrollY;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0 && progressBar) {
      const progress = Math.min(100, Math.max(0, (scrollY / totalHeight) * 100));
      progressBar.style.width = progress + '%';
    }

    // Scrollspy for active quick link
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 180;
      const height = sec.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    qlinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentId) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  // 2. Structured Interface Suite Cockpit Tabs (Section 05)
  const suiteTabs = document.querySelectorAll('.cs-suite-tab');
  const suitePanes = document.querySelectorAll('.cs-suite-pane');

  suiteTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      suiteTabs.forEach(t => t.classList.remove('active'));
      suitePanes.forEach(p => p.classList.remove('active'));

      this.classList.add('active');
      const targetPaneId = this.getAttribute('data-suite-target');
      const targetPane = document.getElementById(targetPaneId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // 3. Interactive Decision Loop Stepper (Section 07)
  const loopData = {
    discover: {
      step: '01 / Discover & Frame',
      title: 'Intent-Based Career Exploration',
      desc: 'Instead of dense static lists, students start with clear intent: self-discovery, degree pathways, or quota insights. The interface filters 200+ specialized career trajectories into approachable cards.',
      action: '✦ Intent Filtered · 18 Medical & Allied Specializations Loaded',
      img: 'assets/works/careerplanb/cpb-homepage.png',
      alt: 'Career Plan B Homepage Discovery Interface'
    },
    understand: {
      step: '02 / Understand Requirements',
      title: 'Eligibility & Institutional Frameworks',
      desc: 'Translating complex regulatory notices, domicile quotas, and examination dates into plain-English timelines and structured card layouts, eliminating student uncertainty.',
      action: '✦ Regulatory Synthesis · 2026 Examination & Counseling Calendar Active',
      img: 'assets/works/careerplanb/cpb-student-counselling.png',
      alt: 'Career Plan B Student Counseling & Pathways'
    },
    explore: {
      step: '03 / Explore Interactively',
      title: 'MBBS Service Bond Explorer',
      desc: 'Replaces confusing government PDFs with a multi-state interactive database. Students compare mandatory rural service tenures and penalty stipulations side-by-side across 28 states.',
      action: '✦ Multi-State Matrix · 28 State Health Service Bonds Filtered',
      img: 'assets/works/careerplanb/cpb-bond-explorer.png',
      alt: 'Career Plan B MBBS Bond Explorer'
    },
    evaluate: {
      step: '04 / Evaluate True Costs & Rank',
      title: 'True Cost Calculator & College Predictor',
      desc: 'Calculates the real comprehensive investment—including hidden hostel, security, examination, and bond risk fees—alongside live NEET rank seat allocation probability models.',
      action: '✦ Financial Clarity · 5-Year True Expenditure Model Calculated',
      img: 'assets/works/careerplanb/cpb-true-cost.png',
      alt: 'Career Plan B True Cost Calculator'
    },
    action: {
      step: '05 / Take Guided Action',
      title: 'Certified 1-on-1 Mentorship Booking',
      desc: 'Connects educated students and reassured parents directly with senior educational advisors and counseling sessions, turning exploration into decisive admission roadmaps.',
      action: '✦ Direct Engagement · Certified Career Counselor Session Scheduled',
      img: 'assets/works/careerplanb/cpb-college-predictor.png',
      alt: 'Career Plan B NEET College Predictor & Action Engine'
    }
  };

  const loopTabs = document.querySelectorAll('.cs-loop-tab-btn');
  const loopStepLabel = document.getElementById('loopStepLabel');
  const loopStepTitle = document.getElementById('loopStepTitle');
  const loopStepDesc = document.getElementById('loopStepDesc');
  const loopStepAction = document.getElementById('loopStepAction');
  const loopStepImg = document.getElementById('loopStepImg');

  loopTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      loopTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      const key = this.getAttribute('data-loop-key');
      const data = loopData[key];
      if (!data) return;

      if (loopStepLabel) loopStepLabel.textContent = data.step;
      if (loopStepTitle) loopStepTitle.textContent = data.title;
      if (loopStepDesc) loopStepDesc.textContent = data.desc;
      if (loopStepAction) loopStepAction.textContent = data.action;

      if (loopStepImg) {
        loopStepImg.style.opacity = '0';
        setTimeout(() => {
          loopStepImg.src = data.img;
          loopStepImg.alt = data.alt;
          loopStepImg.style.opacity = '1';
        }, 150);
      }
    });
  });

  // 4. Click-to-Copy Color Swatches
  document.querySelectorAll('.cs-swatch').forEach(swatch => {
    swatch.addEventListener('click', function () {
      const hex = this.getAttribute('data-hex');
      if (!hex) return;
      navigator.clipboard.writeText(hex).then(() => {
        const hexSpan = this.querySelector('.cs-swatch-hex span:first-child');
        const orig = hexSpan.textContent;
        hexSpan.textContent = 'COPIED!';
        setTimeout(() => {
          hexSpan.textContent = orig;
        }, 1400);
      });
    });
  });

  // 5. Full-Resolution Lightbox Modal
  const lightbox = document.getElementById('csLightbox');
  const lbImg = document.getElementById('csLbImg');
  const lbTitle = document.getElementById('csLbTitle');
  const lbClose = document.getElementById('csLbClose');

  function openLightbox(src, title) {
    if (!lightbox || !lbImg) return;
    lbImg.src = src;
    if (lbTitle) lbTitle.textContent = title || 'Career Plan B High-Resolution Interface';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (window.Cursor) {
      if (typeof window.Cursor.resetState === 'function') {
        window.Cursor.resetState();
      }
      if (typeof window.Cursor.attach === 'function') {
        window.Cursor.attach();
      }
    }
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';

    if (window.Cursor && typeof window.Cursor.resetState === 'function') {
      window.Cursor.resetState();
    }
  }

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target.closest('#csLbImg')) return;
      closeLightbox();
    });
  }

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });

  // Attach Lightbox to all mockup frames
  document.querySelectorAll('.cs-mockup-frame, .cs-screen-card').forEach(wrapper => {
    wrapper.addEventListener('click', function () {
      const img = this.querySelector('img');
      const title = this.getAttribute('data-title') || (img ? img.alt : 'Career Plan B Interface');
      if (img && img.src) {
        openLightbox(img.src, title);
      }
    });
  });
})();
