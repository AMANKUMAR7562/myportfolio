/**
 * NEXUS LOGISTICS CONTROL TOWER — CASE STUDY ENGINE
 * Seamlessly matches the Aman Kumar portfolio theme & interaction model
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

  // 2. Structured Interface Suite Cockpit Tabs (Section 04)
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

  // 3. Interactive Resolution Loop Stepper (Section 06)
  const loopData = {
    detect: {
      step: '01 / Detect Anomaly',
      title: 'Real-Time Anomaly Flagging',
      desc: 'Transit variance exceeding +2.0 hours automatically injects an incident record into the dispatcher priority queue. Impacted customer accounts and carrier contracts are highlighted instantly.',
      action: '✦ Automated SLA Warning · Mumbai → Delhi Corridor',
      img: 'assets/works/nexus/nexus-exceptions.png',
      alt: 'Nexus Exceptions Queue Screen'
    },
    inspect: {
      step: '02 / Inspect Context',
      title: 'Deep Telemetry & Consignment Manifest',
      desc: 'The dispatcher selects the affected line-haul to open real-time telemetry: manifest items, temperature sensor logs, driver duty hours, and live highway weather alerts along the transit corridor.',
      action: '✦ Telemetry Synced · Dwell Time & Manifest Loaded',
      img: 'assets/works/nexus/nexus-shipment.png',
      alt: 'Nexus Shipment Detail Screen'
    },
    ai: {
      step: '03 / AI Predictor',
      title: 'Predictive Explanation Drawer',
      desc: 'The neural prediction engine explains root-cause probabilities (highway congestion vs hub intake slowdown) and suggests vetted alternative recovery strategies with confidence scoring.',
      action: '✦ AI Engine Active · 94.2% Confidence Recommendation',
      img: 'assets/works/nexus/nexus-ai-drawer.png',
      alt: 'Nexus AI Explanation Drawer Screen'
    },
    simulate: {
      step: '04 / Simulate Impact',
      title: 'Cost vs. SLA Reroute Simulation',
      desc: 'Operators run dynamic multi-modal simulations in real time, comparing express air diversion vs. secondary ground rerouting through Pune Hub, balancing recovery speed against freight cost.',
      action: '✦ Reroute Simulated · 18 Mins Saved at $42 Delta',
      img: 'assets/works/nexus/nexus-simulation.png',
      alt: 'Nexus Impact Simulation Screen'
    },
    approve: {
      step: '05 / Approve & Dispatch',
      title: 'One-Click Confirmation Modal',
      desc: 'With a single authorization, the new route instructions push directly to the driver mobile terminal, the destination hub is rescheduled, and customer tracking portals reflect the updated ETA.',
      action: '✦ Reroute Dispatched · Audit Trail Logged to Blockchain',
      img: 'assets/works/nexus/nexus-approval.png',
      alt: 'Nexus Approval Modal Screen'
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
    if (lbTitle) lbTitle.textContent = title || 'Nexus High-Resolution Interface';
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

  // Attach Lightbox to all mockup frames
  document.querySelectorAll('.cs-mockup-frame, .cs-screen-card').forEach(wrapper => {
    wrapper.addEventListener('click', function (e) {
      const img = this.querySelector('img');
      const title = this.getAttribute('data-title') || (img ? img.alt : 'Nexus Interface');
      if (img && img.src) {
        openLightbox(img.src, title);
      }
    });
  });
})();
