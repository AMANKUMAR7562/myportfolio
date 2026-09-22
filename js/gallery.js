/**
 * AMAN KUMAR PORTFOLIO — GRAPHIC DESIGN GALLERY & LIGHTBOX MODAL
 * Coding Language: Modern JavaScript (ES6+)
 */

(function () {
  'use strict';

  // Exact 12 Curated Graphic Design Works matching Portfolio Showcase
  const galleryItems = [
    // Row 1
    {
      id: '01',
      category: 'banners',
      title: 'YouTube Banner',
      desc: 'High-energy creator YouTube banner architecture with custom 3D typography and vibrant accents.',
      file: 'assets/works/skysidebanner.png'
    },
    {
      id: '02',
      category: 'banners',
      title: 'Gaming Banner',
      desc: 'Dark-mode gaming channel identity featuring 3D vector illustration and custom broadcast typography.',
      file: 'assets/works/ozogaming.png'
    },
    {
      id: '03',
      category: 'banners',
      title: 'Channel Banner',
      desc: 'High-impact anime channel banner featuring custom flame composition and bold typography.',
      file: 'assets/works/editedguynewbanner.png'
    },
    {
      id: '04',
      category: 'banners',
      title: 'Esports Banner',
      desc: 'Competitive esports broadcast identity kit with glowing vector accents and high-contrast styling.',
      file: 'assets/works/kingbanner.png'
    },

    // Row 2
    {
      id: '05',
      category: 'thumbnails',
      title: 'BGMI Thumbnail',
      desc: 'Esports tournament livestream thumbnail engineered with dynamic focal points for high mobile tap rate.',
      file: 'assets/works/bgmilivestreamthumbnail.png'
    },
    {
      id: '06',
      category: 'thumbnails',
      title: 'Gaming Thumbnail',
      desc: 'Cyberpunk neon profile composition designed for creator streaming engagement and feed visibility.',
      file: 'assets/works/zendrolive.png'
    },
    {
      id: '07',
      category: 'thumbnails',
      title: 'Valorant Thumbnail',
      desc: 'High-contrast FPS montage artwork optimized for eye-tracking contrast and peak click-through rate.',
      file: 'assets/works/valothumbnail.png'
    },
    {
      id: '08',
      category: 'thumbnails',
      title: 'Anime Thumbnail',
      desc: 'Rich saturation and expressive character focus designed for entertainment media retention.',
      file: 'assets/works/animethumbnail.png'
    },

    // Row 3
    {
      id: '09',
      category: 'headers',
      title: 'Twitter Header',
      desc: 'Minimalist editorial social header with Japanese typography and stylized vector line work.',
      file: 'assets/works/MINATOPCnew.png'
    },
    {
      id: '10',
      category: 'headers',
      title: 'Anime Header',
      desc: 'Warm textured character artwork header featuring bold vertical typography and clean layout.',
      file: 'assets/works/minatopc.png'
    },
    {
      id: '11',
      category: 'banners',
      title: 'Brand Banner',
      desc: 'Teal anime creator banner with integrated social handles and minimalist broadcast aesthetic.',
      file: 'assets/works/flobybanner.png'
    },
    {
      id: '12',
      category: 'banners',
      title: 'Tutorial Banner',
      desc: 'Clean monochrome anime channel header with pop-culture illustration and sharp vector details.',
      file: 'assets/works/OZOANIMEBANNER.png'
    }
  ];

  const galleryGrid = document.getElementById('galleryGrid');
  let currentActiveFilter = 'all';

  function renderGallery(filter) {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = '';

    const filtered = galleryItems.filter((item) => {
      if (filter === 'all') return true;
      return item.category === filter;
    });

    filtered.forEach((item) => {
      const globalIdx = galleryItems.indexOf(item);
      const card = document.createElement('div');
      card.className = 'gallery-item rv in';
      card.setAttribute('data-idx', globalIdx);
      card.innerHTML = `
        <img src="${item.file}" alt="${item.title}" loading="lazy" />
        <div class="gallery-item-overlay">
          <h4 class="gallery-item-title">${item.title}</h4>
          <span class="gallery-item-tag">${item.category.toUpperCase()} ✦ CLICK TO VIEW</span>
        </div>
      `;

      card.addEventListener('click', () => openLightbox(globalIdx));
      galleryGrid.appendChild(card);
    });

    if (window.Cursor && typeof window.Cursor.attach === 'function') {
      window.Cursor.attach();
    }
  }

  // Filter Tabs Event
  const filterTabs = document.querySelectorAll('.g-tab');
  filterTabs.forEach((tab) => {
    tab.addEventListener('click', function () {
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      currentActiveFilter = tab.getAttribute('data-filter');
      renderGallery(currentActiveFilter);
    });
  });

  // Buttons pointing to specific categories
  const categoryJumpButtons = document.querySelectorAll('.open-lightbox-btn');
  categoryJumpButtons.forEach((btn) => {
    btn.addEventListener('click', function () {
      const cat = btn.getAttribute('data-category');
      const targetTab = document.querySelector(`.g-tab[data-filter="${cat}"]`);
      if (targetTab) targetTab.click();
      const gallerySec = document.getElementById('gallery');
      if (gallerySec) gallerySec.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Lightbox Modal System
  const lightbox = document.getElementById('lightbox');
  const lbTitle = document.getElementById('lbTitle');
  const lbDesc = document.getElementById('lbDesc');
  const lbImg = document.getElementById('lbImg');
  const lbCurrent = document.getElementById('lbCurrent');
  const lbTotal = document.getElementById('lbTotal');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');

  let activeLightboxIdx = 0;

  function updateLightboxContent() {
    const item = galleryItems[activeLightboxIdx];
    if (!item) return;
    if (lbTitle) lbTitle.textContent = item.title;
    if (lbDesc) lbDesc.textContent = item.desc;
    if (lbImg) {
      lbImg.src = item.file;
      lbImg.alt = item.title;
    }
    if (lbCurrent) lbCurrent.textContent = String(activeLightboxIdx + 1).padStart(2, '0');
    if (lbTotal) lbTotal.textContent = String(galleryItems.length).padStart(2, '0');
  }

  function openLightbox(idx) {
    if (!lightbox) return;
    activeLightboxIdx = idx;
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.classList.add('lock');
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.classList.remove('lock');
  }

  if (lbClose) lbClose.addEventListener('click', closeLightbox);

  if (lbPrev) {
    lbPrev.addEventListener('click', function () {
      activeLightboxIdx = (activeLightboxIdx - 1 + galleryItems.length) % galleryItems.length;
      updateLightboxContent();
    });
  }

  if (lbNext) {
    lbNext.addEventListener('click', function () {
      activeLightboxIdx = (activeLightboxIdx + 1) % galleryItems.length;
      updateLightboxContent();
    });
  }

  window.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && lbPrev) lbPrev.click();
    if (e.key === 'ArrowRight' && lbNext) lbNext.click();
  });

  // Initialize Gallery on Load
  renderGallery('all');
})();
