/**
 * AMAN KUMAR PORTFOLIO — VIDEO EDITING & MOTION SHOWCASE
 * Features: High-retention short-form reels for Career Plan B,
 * interactive on-page player modal & deep links.
 * Coding Language: Modern JavaScript (ES6+)
 */

(function () {
  'use strict';

  // 5 Career Plan B Video Works
  const videoReels = [
    {
      id: 'DdtKAa7pdlT',
      url: 'https://www.instagram.com/p/DdtKAa7pdlT/',
      thumb: 'assets/works/video/reel-1.jpg',
      title: 'NEET UG Round 3 Seat Matrix',
      specs: 'Edited by me. Cuts, captions, sound. DaVinci Resolve. 2026',
      desc: "Breaking news edit covering MCC's 183 new MBBS & BDS seats addition. Dynamic pacing, urgent hook & audio mastering.",
      tags: ['Cuts & Pacing', 'Kinetic Captions', 'Sound Design']
    },
    {
      id: 'DdoSikrvorj',
      url: 'https://www.instagram.com/p/DdoSikrvorj/',
      thumb: 'assets/works/video/reel-2.jpg',
      title: 'NATS Apprenticeship Portal Guide',
      specs: 'Edited by me. Screen motion, text tracking, audio. DaVinci Resolve. 2026',
      desc: 'Step-by-step application walkthrough for freshers and students. Clean visual pointers, zoom transitions & synced voiceover.',
      tags: ['Motion Graphics', 'UI Walkthrough', 'Sound Design']
    },
    {
      id: 'DdlEk6EOLUa',
      url: 'https://www.instagram.com/p/DdlEk6EOLUa/',
      thumb: 'assets/works/video/reel-3.jpg',
      title: 'NTA Exam Calendar 2026–27',
      specs: 'Edited by me. Pacing, kinetic typography, SFX. DaVinci Resolve. 2026',
      desc: 'Fast-moving schedule alert for JEE Main, UGC-NET, CMAT & CUET PG. High-energy countdowns and animated date cards.',
      tags: ['Hook & Pacing', 'Kinetic Typography', 'Sound Design']
    },
    {
      id: 'DdENgJlTY_d',
      url: 'https://www.instagram.com/p/DdENgJlTY_d/',
      thumb: 'assets/works/video/reel-4.jpg',
      title: 'UP NEET UG Round 1 Result Alert',
      specs: 'Edited by me. Broadcast lower-thirds, subtitles, sound. DaVinci Resolve. 2026',
      desc: 'Official seat allotment and reporting deadline breakdown. Broadcast lower-thirds, checklist animation & urgent sound design.',
      tags: ['Broadcast Graphics', 'Kinetic Captions', 'Audio Sync']
    },
    {
      id: 'DdUAgKUvNGm',
      url: 'https://www.instagram.com/p/DdUAgKUvNGm/',
      thumb: 'assets/works/video/reel-5.jpg',
      title: 'LinkedIn Career Guide for Students',
      specs: 'Edited by me. Explainer animation, sound design. DaVinci Resolve. 2026',
      desc: 'Value-driven career explainer on proof of work for teenagers and students. Slick infographic animations, typography & pacing.',
      tags: ['Explainer Cuts', 'Infographics', 'Sound Design']
    }
  ];

  // DOM Elements
  const reelModal = document.getElementById('reelModal');
  const reelModalTitle = document.getElementById('reelModalTitle');
  const reelModalPlayerWrap = document.getElementById('reelModalPlayerWrap');
  const reelCurrentIdx = document.getElementById('reelCurrentIdx');
  const reelExternalLink = document.getElementById('reelExternalLink');
  const reelModalClose = document.getElementById('reelModalClose');
  const reelPrevBtn = document.getElementById('reelPrevBtn');
  const reelNextBtn = document.getElementById('reelNextBtn');

  let currentReelIdx = 0;

  function loadReelInModal(idx) {
    if (!reelModal || !videoReels[idx]) return;
    currentReelIdx = idx;
    const item = videoReels[idx];

    if (reelModalTitle) {
      reelModalTitle.textContent = item.title;
    }
    if (reelCurrentIdx) {
      reelCurrentIdx.textContent = String(idx + 1).padStart(2, '0');
    }
    if (reelExternalLink) {
      reelExternalLink.href = item.url;
    }

    if (reelModalPlayerWrap) {
      reelModalPlayerWrap.innerHTML = `
        <div class="reel-loading-spinner" id="reelSpinner">Loading Instagram Player...</div>
        <iframe 
          class="reel-modal-iframe" 
          src="https://www.instagram.com/p/${item.id}/embed/" 
          frameborder="0" 
          scrolling="no" 
          allowtransparency="true" 
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" 
          onload="const s = document.getElementById('reelSpinner'); if(s) s.style.display='none';">
        </iframe>
      `;
    }
  }

  function openReelModal(idx) {
    if (!reelModal) return;
    loadReelInModal(idx);
    reelModal.classList.add('active');
    document.body.classList.add('lock');

    if (window.Cursor) {
      if (typeof window.Cursor.resetState === 'function') {
        window.Cursor.resetState();
      }
      if (typeof window.Cursor.attach === 'function') {
        window.Cursor.attach();
      }
    }
  }

  function closeReelModal() {
    if (!reelModal) return;
    reelModal.classList.remove('active');
    document.body.classList.remove('lock');

    if (window.Cursor && typeof window.Cursor.resetState === 'function') {
      window.Cursor.resetState();
    }

    // Clean up iframe to stop audio immediately
    setTimeout(() => {
      if (reelModalPlayerWrap) {
        reelModalPlayerWrap.innerHTML = '<div class="reel-loading-spinner" id="reelSpinner">Loading Reel...</div>';
      }
    }, 250);
  }

  // Setup Event Listeners for Cards
  function initVideoCards() {
    // Thumbnails & Play button triggers
    const thumbWraps = document.querySelectorAll('.video-thumb-wrap');
    thumbWraps.forEach((wrap) => {
      wrap.addEventListener('click', function () {
        const idx = parseInt(this.getAttribute('data-reel-idx'), 10) || 0;
        openReelModal(idx);
      });
    });

    // "Watch on Page" button triggers
    const previewBtns = document.querySelectorAll('.video-preview-btn');
    previewBtns.forEach((btn) => {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const idx = parseInt(this.getAttribute('data-reel-idx'), 10) || 0;
        openReelModal(idx);
      });
    });

    // Close button
    if (reelModalClose) {
      reelModalClose.addEventListener('click', closeReelModal);
    }

    // Modal Background click to close
    if (reelModal) {
      reelModal.addEventListener('click', function (e) {
        if (!e.target.closest('.reel-modal-container')) {
          closeReelModal();
        }
      });
    }

    // Prev / Next Controls
    if (reelPrevBtn) {
      reelPrevBtn.addEventListener('click', function () {
        const prevIdx = (currentReelIdx - 1 + videoReels.length) % videoReels.length;
        loadReelInModal(prevIdx);
      });
    }

    if (reelNextBtn) {
      reelNextBtn.addEventListener('click', function () {
        const nextIdx = (currentReelIdx + 1) % videoReels.length;
        loadReelInModal(nextIdx);
      });
    }

    // Keyboard Shortcuts
    window.addEventListener('keydown', function (e) {
      if (!reelModal || !reelModal.classList.contains('active')) return;
      if (e.key === 'Escape') {
        closeReelModal();
      } else if (e.key === 'ArrowLeft' && reelPrevBtn) {
        reelPrevBtn.click();
      } else if (e.key === 'ArrowRight' && reelNextBtn) {
        reelNextBtn.click();
      }
    });
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVideoCards);
  } else {
    initVideoCards();
  }
})();
