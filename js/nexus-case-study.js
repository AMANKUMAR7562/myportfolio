/**
 * NEXUS LOGISTICS CONTROL TOWER — INTERACTIVE CASE STUDY ENGINE
 * Coding Language: Modern JavaScript (ES6+)
 */

(function () {
  'use strict';

  // 1. Scroll Progress Bar & ScrollSpy
  const progressBar = document.getElementById('csProgressBar');
  const navLinks = document.querySelectorAll('.cs-nav-link');
  const sections = document.querySelectorAll('.cs-section');

  function updateScroll() {
    const scrollY = window.scrollY;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0 && progressBar) {
      const progress = Math.min(100, Math.max(0, (scrollY / totalHeight) * 100));
      progressBar.style.width = progress + '%';
    }

    // Scrollspy for active nav link
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 150;
      const height = sec.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentId) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  // 2. Interactive Flow Stepper (Section 06)
  const flowData = {
    detect: {
      step: '01 / Detect',
      title: 'Real-Time Exception Detection',
      desc: 'An abnormal variance in estimated transit time triggers an automated flag in the priority queue before customer SLA is breached. The system highlights affected routes and carrier reliability score.',
      action: '✦ Priority Flag Generated · SLA Variance +2.4h',
      img: 'assets/works/nexus/nexus-exceptions.png',
      alt: 'Nexus Exceptions Queue Screen'
    },
    inspect: {
      step: '02 / Inspect',
      title: 'Contextual Shipment Deep Dive',
      desc: 'The operator selects the exception to reveal complete consignment telemetry: manifest items, temperature sensor logs, driver telemetry, and weather disruption along the Mumbai-Delhi corridor.',
      action: '✦ Manifest & Telemetry Synced · Node Context Loaded',
      img: 'assets/works/nexus/nexus-shipment.png',
      alt: 'Nexus Shipment Detail Screen'
    },
    ai: {
      step: '03 / AI Assist',
      title: 'Predictive Explanation Drawer',
      desc: 'The predictive AI engine analyzes traffic patterns and vehicle density, providing a plain-language explanation of the bottleneck and confidence ratings for alternative delivery channels.',
      action: '✦ Neural Predictor Active · 94.2% Confidence Score',
      img: 'assets/works/nexus/nexus-ai-drawer.png',
      alt: 'Nexus AI Explanation Drawer Screen'
    },
    simulate: {
      step: '04 / Simulate',
      title: 'Impact Simulation & Rerouting',
      desc: 'Before taking action, the operator runs a dynamic simulation comparing two recovery routes: standard ground detour vs. expedited inter-hub transfer through Pune, visualizing cost vs. SLA recovery.',
      action: '✦ Simulation Validated · +18m Saved at $42 Delta',
      img: 'assets/works/nexus/nexus-simulation.png',
      alt: 'Nexus Impact Simulation Screen'
    },
    approve: {
      step: '05 / Approve',
      title: 'Single-Click Authorization Modal',
      desc: 'The dispatcher reviews financial impact and automated notifications before confirming the reroute. Stakeholders across both hubs are instantly alerted and vehicle telemetry updates.',
      action: '✦ Action Dispatched · Fleet Telemetry Re-routed',
      img: 'assets/works/nexus/nexus-approval.png',
      alt: 'Nexus Approval Modal Screen'
    }
  };

  const flowTabs = document.querySelectorAll('.flow-tab-btn');
  const flowStepLabel = document.getElementById('flowStepLabel');
  const flowStepTitle = document.getElementById('flowStepTitle');
  const flowStepDesc = document.getElementById('flowStepDesc');
  const flowStepAction = document.getElementById('flowStepAction');
  const flowStepImg = document.getElementById('flowStepImg');

  flowTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      flowTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      const key = this.getAttribute('data-flow-key');
      const data = flowData[key];
      if (!data) return;

      if (flowStepLabel) flowStepLabel.textContent = data.step;
      if (flowStepTitle) flowStepTitle.textContent = data.title;
      if (flowStepDesc) flowStepDesc.textContent = data.desc;
      if (flowStepAction) flowStepAction.textContent = data.action;

      if (flowStepImg) {
        flowStepImg.style.opacity = '0';
        setTimeout(() => {
          flowStepImg.src = data.img;
          flowStepImg.alt = data.alt;
          flowStepImg.style.opacity = '1';
        }, 150);
      }
    });
  });

  // 3. Click-to-Copy Color Swatches
  const swatches = document.querySelectorAll('.swatch-card');
  swatches.forEach(swatch => {
    swatch.addEventListener('click', function () {
      const hex = this.getAttribute('data-hex');
      if (!hex) return;
      navigator.clipboard.writeText(hex).then(() => {
        const hexEl = this.querySelector('.swatch-hex span:first-child');
        const origText = hexEl.textContent;
        hexEl.textContent = 'COPIED!';
        setTimeout(() => {
          hexEl.textContent = origText;
        }, 1500);
      });
    });
  });

  // 4. Lightbox Modal for High-Resolution Screen Inspection
  const lightbox = document.getElementById('csLightbox');
  const lbImg = document.getElementById('csLbImg');
  const lbTitle = document.getElementById('csLbTitle');
  const lbClose = document.getElementById('csLbClose');

  function openLightbox(src, title) {
    if (!lightbox || !lbImg) return;
    lbImg.src = src;
    if (lbTitle) lbTitle.textContent = title || 'Nexus Interface Detail';
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
      if (e.target === lightbox || e.target.classList.contains('cs-lightbox-body')) {
        closeLightbox();
      }
    });
  }

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });

  // Attach lightbox trigger to all mockup images
  document.querySelectorAll('.mockup-wrapper').forEach(wrapper => {
    wrapper.addEventListener('click', function () {
      const img = this.querySelector('img');
      const title = this.getAttribute('data-title') || (img ? img.alt : 'Nexus Interface Screen');
      if (img && img.src) {
        openLightbox(img.src, title);
      }
    });
  });

  // 5. Animated KPI Counter on scroll into view
  const kpiValues = document.querySelectorAll('.mtt-value, .stat-counter');
  let animated = false;

  function checkCounters() {
    if (animated) return;
    const hero = document.querySelector('.cs-hero');
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    if (rect.top <= window.innerHeight) {
      animated = true;
      kpiValues.forEach(el => {
        const target = el.getAttribute('data-target');
        if (!target) return;
        const count = parseFloat(target);
        const isDecimal = target.includes('.');
        let start = 0;
        const duration = 1200;
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = count / steps;

        const timer = setInterval(() => {
          start += increment;
          if (start >= count) {
            el.textContent = isDecimal ? count.toFixed(1) + '%' : Math.floor(count).toLocaleString();
            clearInterval(timer);
          } else {
            el.textContent = isDecimal ? start.toFixed(1) + '%' : Math.floor(start).toLocaleString();
          }
        }, stepTime);
      });
    }
  }

  window.addEventListener('scroll', checkCounters, { passive: true });
  checkCounters();
})();
