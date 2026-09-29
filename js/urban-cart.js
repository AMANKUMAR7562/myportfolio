/**
 * URBAN CART — E-COMMERCE APP UI REDESIGN CASE STUDY
 * Interaction Engine & Responsive Stepper
 * Unified with the Aman Kumar Portfolio Theme System
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

  // 2. Structured Interface Suite Tabs (Section 05)
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

  // 3. Interactive Shopping Journey Loop Stepper (Section 07)
  const loopData = {
    discover: {
      step: 'Stage 01 / Discover & Browse',
      title: 'Home & Seasonal Product Discovery',
      desc: 'Instead of sensory overload, the homepage prioritizes quick category pills, search bar prominence, and clean promotional cards that support discovery without drowning out product cards.',
      action: '✦ Zero Clutter · Priority Focus on Categories & Search',
      img: 'assets/works/urbancart/home_screen.jpg',
      alt: 'Urban Cart Home & Product Discovery Screen'
    },
    search: {
      step: 'Stage 02 / Search & Attribute Filtering',
      title: 'High-Precision Search & Refinement',
      desc: 'Search treated as a primary interaction rather than a secondary utility. Rapid attribute filters for size, price, and in-stock availability close the gap between "I know what I want" and "I found it."',
      action: '✦ Direct Refinement · Rapid Attribute Narrowing',
      img: 'assets/works/urbancart/home_screen.jpg',
      alt: 'Urban Cart Search and Filtering System'
    },
    evaluate: {
      step: 'Stage 03 / Product Evaluation & Details',
      title: 'Decision-Critical Information Hierarchy',
      desc: 'Separates decision-critical data (ratings, real price, shipping speed, model options) from secondary description. Large sticky Add-to-Cart bar with direct quantity selector eliminates purchase hesitation.',
      action: '✦ Critical Clarity · Decision-First Layout',
      img: 'assets/works/urbancart/product_detail.jpg',
      alt: 'Urban Cart Product Details Screen'
    },
    checkout: {
      step: 'Stage 04 / Transparent Cart & Checkout',
      title: 'Zero-Surprise Cart & Order Summary',
      desc: 'Acts as a strict verification milestone before payment. Displays itemized prices, delivery charges, discounts, and final total upfront so users know exactly what they are paying for with zero surprise fees.',
      action: '✦ 100% Price Transparency · 4-Step Checkout Flow',
      img: 'assets/works/urbancart/cart_screen.png',
      alt: 'Urban Cart Transparent Cart Screen'
    },
    track: {
      step: 'Stage 05 / Order Continuity & Conversational Care',
      title: 'Real-Time Order Tracking & AI Assistant',
      desc: 'Post-purchase continuity connecting order dispatch milestones with Maggy Lee conversational shopping assistant. Offers instant issue triage, package tracking, and automated discount vouchers.',
      action: '✦ Customer Continuity · Conversational Care Assistant',
      img: 'assets/works/urbancart/chat_voucher.png',
      alt: 'Urban Cart Conversational Customer Care Screen'
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

  // 5. Ultra-Res Lightbox Modal
  const lightbox = document.getElementById('csLightbox');
  const lbImg = document.getElementById('csLbImg');
  const lbTitle = document.getElementById('csLbTitle');
  const lbClose = document.getElementById('csLbClose');

  function openLightbox(src, title) {
    if (!lightbox || !lbImg) return;
    lbImg.src = src;
    if (lbTitle) lbTitle.textContent = title || 'Urban Cart Interface Preview (Retina Display)';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Bind to cards and hero mockup
  document.querySelectorAll('.cs-screen-card, .cs-mockup-frame').forEach(frame => {
    frame.addEventListener('click', function (e) {
      if (e.target.closest('.cs-suite-nav') || e.target.closest('button')) return;
      const img = this.querySelector('img');
      const title = this.getAttribute('data-title') || this.querySelector('h3')?.textContent || 'Urban Cart Retina Screen Detail';
      if (img && img.src) {
        openLightbox(img.src, title);
      }
    });
  });

  if (lbClose) {
    lbClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target.classList.contains('cs-lb-body')) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

})();
