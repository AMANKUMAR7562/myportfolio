/**
 * NEXUS LOGISTICS CONTROL TOWER — CASE STUDY ENGINE
 * Ellen Covey Benchmark: Chaptered Sticky Navigation, Visual System Tabs & Lightbox
 * Perfectly matches Aman Kumar portfolio aesthetic
 */

(function () {
  'use strict';

  // 1. Reading Progress Bar & Chapter Scrollspy
  const progressBar = document.getElementById('csProgressBar');
  const chapterItems = document.querySelectorAll('.cs-chapter-item');
  const sections = document.querySelectorAll('.cs-sec');

  function updateScroll() {
    const scrollY = window.scrollY;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0 && progressBar) {
      const progress = Math.min(100, Math.max(0, (scrollY / totalHeight) * 100));
      progressBar.style.width = progress + '%';
    }

    // Scrollspy for active chapter
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 180;
      const height = sec.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    chapterItems.forEach(item => {
      item.classList.remove('active');
      const href = item.getAttribute('href');
      if (href === '#' + currentId) {
        item.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  // Smooth scroll for chapter navigation items
  chapterItems.forEach(item => {
    item.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const navOffset = 130;
          const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navOffset;
          window.scrollTo({
            top: targetPos,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // 2. Interactive "Visual Choices" Tabs (Ellen Covey Style)
  const vtabBtns = document.querySelectorAll('.cs-vtab-btn');
  const vtabPanes = document.querySelectorAll('.cs-vtab-pane');

  vtabBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      vtabBtns.forEach(b => b.classList.remove('active'));
      vtabPanes.forEach(p => p.classList.remove('active'));

      this.classList.add('active');
      const targetPaneId = this.getAttribute('data-vtab-target');
      const targetPane = document.getElementById(targetPaneId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // 3. Structured Interface Suite Cockpit Tabs
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

  // 4. Click-to-Copy Color Swatches
  document.querySelectorAll('.cs-swatch').forEach(swatch => {
    swatch.addEventListener('click', function () {
      const hex = this.getAttribute('data-hex');
      if (!hex) return;
      navigator.clipboard.writeText(hex).then(() => {
        const hexSpan = this.querySelector('.cs-swatch-hex span:first-child');
        if (hexSpan) {
          const orig = hexSpan.textContent;
          hexSpan.textContent = 'COPIED!';
          setTimeout(() => {
            hexSpan.textContent = orig;
          }, 1400);
        }
      });
    });
  });

  // 5. Full-Resolution Lightbox Modal (2560px Retina)
  const lightbox = document.getElementById('csLightbox');
  const lbImg = document.getElementById('csLbImg');
  const lbTitle = document.getElementById('csLbTitle');
  const lbClose = document.getElementById('csLbClose');

  function openLightbox(src, title) {
    if (!lightbox || !lbImg) return;
    lbImg.src = src;
    if (lbTitle) lbTitle.textContent = title || 'Nexus High-Resolution Interface (2560px Retina)';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target.classList.contains('cs-lb-body')) {
        closeLightbox();
      }
    });
  }

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });

  // Attach Lightbox to all mockup frames, step images, and zoom buttons
  document.querySelectorAll('.cs-mockup-frame, .cs-screen-card, .cs-flow-media-frame').forEach(wrapper => {
    wrapper.addEventListener('click', function () {
      const img = this.querySelector('img');
      const title = this.getAttribute('data-title') || (img ? img.alt : 'Nexus Interface');
      if (img && img.src) {
        openLightbox(img.src, title);
      }
    });
  });
})();
