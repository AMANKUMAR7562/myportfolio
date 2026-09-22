# Aman Kumar — UI/UX & Brand Designer Portfolio

A production-grade, modular web application engineered with clean separation of concerns: **HTML5**, **CSS3 (Modular Design System)**, **Modern JavaScript (3D WebGL Three.js Engine)**, and **Node.js / Express (Backend API & Static Server)**.

---

## 🏗️ Architecture & Project Structure

```
claude portfolio/
├── index.html                 # Semantic HTML5 markup, SEO & OpenGraph tags
├── server.js                  # Node.js backend runtime (Express server & API)
├── package.json               # NPM configuration, dependencies & scripts
├── README.md                  # System documentation & usage guide
│
├── css/                       # Modular CSS3 Design System
│   ├── variables.css          # Design tokens (colors, typography, easing, dark mode)
│   ├── base.css               # Reset, typography, loader, custom cursor, canvas layout
│   ├── layout.css             # Navigation, mobile menu, HUD indicators, footer
│   ├── components.css         # Cards, buttons, marquee ticker, interactive contact form
│   ├── animations.css         # Keyframes, scroll reveals, pulse animations
│   └── style.css              # Master stylesheet importing all layers
│
├── js/                        # Modern JavaScript (ES6+) Engine
│   ├── theme.js               # Theme color coordinator & "aman" rainbow easter egg
│   ├── cursor.js              # CAD custom cursor with lerp interpolation
│   ├── canvas.js              # 3D interactive WebGL engine (undulating terrain, spotlight, orbitals)
│   ├── gallery.js             # Visual archive & lightbox viewer (15 curated works)
│   ├── contact.js             # Contact form validation & async API transmission
│   ├── app.js                 # App coordinator (preloader, smooth scroll, HUD, clock)
│   └── vendor/
│       └── three.min.js       # Production Three.js r128 bundle (works 100% offline & online)
│
├── data/
│   └── inquiries.json         # Contact inquiries persistent storage
│
└── assets/                    # Static Assets & Media
    ├── images/                # Profile image (aman.png), branding
    ├── docs/                  # Aman_Kumar_CV_Ui_Ux_Graphic_Design.pdf
    └── works/                 # Portfolio artwork, banners, and thumbnails
```

---

## 🚀 How to Run the Website

### Option 1: Full-Stack Mode with Node.js Backend (Recommended)

1. Open your terminal in this directory:
   ```bash
   cd "c:\Users\ZENDRO\Desktop\claude portfolio"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to:
   **[http://localhost:3000](http://localhost:3000)**

> [!NOTE]
> In full-stack mode, contact form submissions are processed by the `/api/contact` endpoint and logged/persisted into `data/inquiries.json`.

---

### Option 2: Static Preview Mode (Zero Configuration)

Simply double-click **`index.html`** or open it in any browser (or use VS Code Live Server / Python `http.server` / GitHub Pages / Vercel).
All client-side features (3D WebGL landscape, preloader, CAD cursor, gallery filtering, lightbox modal) work completely offline.

---

## 🎨 Interactive Features

- **3D Spatial WebGL Landscape**: Real-time undulating terrain mesh, cursor-projected dynamic lighting, floating gyroscopic CAD orbitals, volumetric stardust cloud, camera parallax tilt, scroll-driven spaceflight navigation, and click shockwave ripples.
- **Dynamic Theme Locking Easter Egg**: Type the letters `a-m-a-n` anywhere on the page to trigger live rainbow spectrum cycling or lock the current theme accent hue.
- **Visual Archive Lightbox**: Browse 15 high-resolution case studies, banners, and thumbnails with category filtering, arrow keys navigation (`←` / `→`), and `Esc` to close.
- **Direct Transmission Contact Form**: Real-time validated submission with feedback toasts and persistent storage.
