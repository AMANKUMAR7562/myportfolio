/**
 * AMAN KUMAR PORTFOLIO â€” PAINTERLY GRADIENT CANVAS
 *
 * Full-screen WebGL fragment shader:
 *   - 6 large soft color orbs (bokeh / gradient mesh aesthetic)
 *   - Designer colour palette: deep violet, rose, warm gold, teal
 *   - Silky slow drift + mouse-driven parallax
 *   - Scroll-interpolated palette shifts between sections
 *   - Grain overlay for tactile, painterly depth
 *   - Vignette for premium editorial framing
 *   - "aman" easter egg: warm golden-hour palette
 *
 * Aesthetic reference: Awwwards / Dribbble / senior Figma designer portfolios
 */

(function () {
  'use strict';

  const canvas = document.getElementById('canvas-bg') || document.getElementById('webgl');
  if (!canvas) return;

  /* â”€â”€ WebGL bootstrap â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) { console.warn('[Canvas] WebGL not supported.'); return; }

  const reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  /* â”€â”€ Shaders â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const vert = `
    attribute vec2 aPos;
    void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
  `;

  const frag = `
    precision mediump float;

    uniform vec2  uRes;
    uniform float uTime;
    uniform float uReveal;
    uniform vec2  uMouse;       // -1..1 normalised
    uniform float uGolden;      // easter egg 0/1
    uniform float uScroll;      // 0..1

    // 6 orbs: xy = position (0-1 space), z = radius, w = hue-index
    uniform vec4  uOrbs[6];

    // Section palette: 4 Ã— RGB (current blend)
    uniform vec3  uCol0;
    uniform vec3  uCol1;
    uniform vec3  uCol2;
    uniform vec3  uCol3;

    // â”€â”€ hash noise â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    float hash(vec2 p) {
      p = fract(p * vec2(234.34, 435.345));
      p += dot(p, p + 34.23);
      return fract(p.x * p.y);
    }
    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i), hash(i + vec2(1,0)), f.x),
        mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x),
        f.y
      );
    }

    // â”€â”€ soft orb contribution â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    float orb(vec2 uv, vec2 center, float radius) {
      float d = length(uv - center);
      return exp(-d * d / (radius * radius * 0.42));
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / uRes;           // 0..1
      vec2 uvC = uv * 2.0 - 1.0;                 // -1..1 centred

      // Background: very dark near-black with faint warm tint
      vec3 bg = mix(vec3(0.043, 0.039, 0.067), vec3(0.055, 0.047, 0.082), uv.y);

      // Accumulate colour from each orb
      vec3 col = bg;
      float totalW = 0.0;

      for (int i = 0; i < 6; i++) {
        vec2  center = uOrbs[i].xy;
        float radius = uOrbs[i].z;
        float idx    = uOrbs[i].w;   // 0-3 palette index

        // Pick colour from section palette
        vec3 orbCol;
        if      (idx < 0.5) orbCol = uCol0;
        else if (idx < 1.5) orbCol = uCol1;
        else if (idx < 2.5) orbCol = uCol2;
        else                orbCol = uCol3;

        float w = orb(uv, center, radius);
        col    += orbCol * w * 0.72;
        totalW += w;
      }

      // Soft clamp â€” keep it painterly, never clip to pure white
      col = col / (col + 0.65);

      // â”€â”€ Film grain (tactile designer texture) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      float grain = noise(uv * 420.0 + uTime * 0.7) * 0.028 - 0.014;
      col += grain;

      // â”€â”€ Vignette â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      float vg = 1.0 - dot(uvC * vec2(0.72, 0.88), uvC * vec2(0.72, 0.88));
      vg = pow(max(vg, 0.0), 0.55);
      col *= mix(0.55, 1.0, vg);

      // â”€â”€ Reveal fade-in â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      col *= uReveal;

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
      console.warn('[Canvas] Shader error:', gl.getShaderInfoLog(s));
    return s;
  }

  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER,   vert));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  /* â”€â”€ Full-screen quad â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  /* â”€â”€ Uniform locations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const U = {
    res:    gl.getUniformLocation(prog, 'uRes'),
    time:   gl.getUniformLocation(prog, 'uTime'),
    reveal: gl.getUniformLocation(prog, 'uReveal'),
    mouse:  gl.getUniformLocation(prog, 'uMouse'),
    golden: gl.getUniformLocation(prog, 'uGolden'),
    scroll: gl.getUniformLocation(prog, 'uScroll'),
    orbs:   gl.getUniformLocation(prog, 'uOrbs[0]'),
    col0:   gl.getUniformLocation(prog, 'uCol0'),
    col1:   gl.getUniformLocation(prog, 'uCol1'),
    col2:   gl.getUniformLocation(prog, 'uCol2'),
    col3:   gl.getUniformLocation(prog, 'uCol3'),
  };

  /* â”€â”€ Designer colour palettes (per scroll section) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  // Each palette: [violet-deep, rose-mist, warm-gold, teal-smoke]
  const PALETTES = [
    // Hero â€” deep violet night
    [[0.29, 0.13, 0.62], [0.72, 0.28, 0.50], [0.94, 0.52, 0.18], [0.06, 0.54, 0.68]],
    // About â€” warm lavender dusk
    [[0.38, 0.18, 0.72], [0.82, 0.38, 0.60], [0.96, 0.62, 0.28], [0.10, 0.52, 0.66]],
    // Work â€” rich jewel tones
    [[0.22, 0.08, 0.52], [0.68, 0.18, 0.52], [0.94, 0.44, 0.12], [0.04, 0.48, 0.72]],
    // Gallery â€” dreamy rose
    [[0.42, 0.14, 0.58], [0.88, 0.34, 0.62], [0.96, 0.68, 0.38], [0.08, 0.58, 0.62]],
    // Skills â€” electric indigo
    [[0.24, 0.12, 0.72], [0.60, 0.22, 0.58], [0.86, 0.48, 0.20], [0.12, 0.62, 0.72]],
    // Experience â€” slate dusk
    [[0.30, 0.16, 0.54], [0.66, 0.28, 0.52], [0.92, 0.56, 0.22], [0.08, 0.50, 0.64]],
    // Contact â€” warm midnight
    [[0.26, 0.10, 0.58], [0.74, 0.30, 0.52], [0.92, 0.58, 0.24], [0.06, 0.46, 0.60]],
  ];

  // Golden-hour palette (easter egg)
  const GOLDEN_PAL = [
    [0.92, 0.62, 0.08], [0.94, 0.42, 0.22], [0.78, 0.34, 0.62], [0.96, 0.78, 0.30]
  ];

  /* â”€â”€ Orb definitions: [startX, startY, radius, paletteIdx] â”€â”€â”€â”€â”€ */
  // Orbs wander in a pseudo-random Lissajous path
  const ORB_DEF = [
    { fx: 0.11, fy: 0.13, px: 0.5, py: 0.5, r: 0.48, ci: 0 },
    { fx: 0.07, fy: 0.09, px: 0.7, py: 0.3, r: 0.40, ci: 1 },
    { fx: 0.13, fy: 0.08, px: 0.2, py: 0.7, r: 0.44, ci: 2 },
    { fx: 0.09, fy: 0.11, px: 0.8, py: 0.6, r: 0.36, ci: 3 },
    { fx: 0.06, fy: 0.14, px: 0.3, py: 0.2, r: 0.38, ci: 1 },
    { fx: 0.12, fy: 0.07, px: 0.6, py: 0.8, r: 0.32, ci: 2 },
  ];

  /* â”€â”€ State â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  let t          = 0;
  let scrollP    = 0;
  let mx = 0, my = 0;     // raw mouse 0..1
  let smx = 0.5, smy = 0.5; // smoothed
  let goldenMode = 0;
  let revealP    = 0;
  let lastFrame  = performance.now();

  /* â”€â”€ Lerp helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const lerp = (a, b, t) => a + (b - a) * t;
  function lerpPal(A, B, e) {
    return A.map((c, i) => [lerp(c[0], B[i][0], e), lerp(c[1], B[i][1], e), lerp(c[2], B[i][2], e)]);
  }

  /* â”€â”€ Events â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function updateScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scrollP = max > 0 ? Math.min(1, Math.max(0, (window.pageYOffset || 0) / max)) : 0;
  }
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  window.addEventListener('mousemove', function (e) {
    mx = e.clientX / window.innerWidth;
    my = e.clientY / window.innerHeight;
  }, { passive: true });

  /* â”€â”€ Easter egg â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  let typed = '';
  const toast    = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  window.addEventListener('keydown', function (e) {
    if (!e.key || e.key.length !== 1) return;
    typed = (typed + e.key.toLowerCase()).slice(-4);
    if (typed === 'aman') {
      goldenMode = goldenMode ? 0 : 1;
      const msg = goldenMode ? 'âœ¦ GOLDEN HOUR â€” ON' : 'âœ¦ GOLDEN HOUR â€” OFF';
      if (toastMsg) toastMsg.textContent = msg;
      else if (toast) toast.textContent = msg;
      if (toast) { toast.classList.add('on'); setTimeout(() => toast.classList.remove('on'), 2400); }
    }
  });

  /* â”€â”€ Reveal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  window.__revealBlob = function () {
    const t0 = performance.now(), DUR = 1800;
    (function step() {
      const p = Math.min(1, (performance.now() - t0) / DUR);
      revealP = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
      if (p < 1) requestAnimationFrame(step);
    })();
  };
  setTimeout(() => { if (revealP === 0 && typeof window.__revealBlob === 'function') window.__revealBlob(); }, 400);

  /* â”€â”€ Main loop â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function animate() {
    requestAnimationFrame(animate);

    const now = performance.now();
    const dt  = Math.min((now - lastFrame) / 1000, 0.05);
    lastFrame = now;
    t += dt * (reduced ? 0.08 : 0.38);   // slow, meditative drift

    smx = lerp(smx, mx, 0.035);
    smy = lerp(smy, my, 0.035);

    /* Scroll section blend */
    const SECTIONS = 7;
    const f  = scrollP * (SECTIONS - 1);
    const i0 = Math.min(SECTIONS - 2, Math.floor(f));
    const e  = f - i0;
    const sm = e * e * (3 - 2 * e);

    let curPal = lerpPal(PALETTES[i0], PALETTES[i0 + 1], sm);
    if (goldenMode) {
      curPal = lerpPal(curPal, GOLDEN_PAL, 0.72);
    }

    /* Build orb data â€” Lissajous drift + mouse parallax */
    const orbData = [];
    for (let i = 0; i < ORB_DEF.length; i++) {
      const o = ORB_DEF[i];
      const ox = o.px + Math.sin(t * o.fx + i * 1.27) * 0.22 + (smx - 0.5) * 0.10;
      const oy = o.py + Math.cos(t * o.fy + i * 0.91) * 0.18 + (smy - 0.5) * 0.08;
      orbData.push(ox, oy, o.r, o.ci);
    }

    /* Upload uniforms */
    gl.uniform2f(U.res,    canvas.width, canvas.height);
    gl.uniform1f(U.time,   t);
    gl.uniform1f(U.reveal, revealP);
    gl.uniform2f(U.mouse,  smx, smy);
    gl.uniform1f(U.golden, goldenMode);
    gl.uniform1f(U.scroll, scrollP);
    gl.uniform4fv(U.orbs,  orbData);
    gl.uniform3fv(U.col0,  curPal[0]);
    gl.uniform3fv(U.col1,  curPal[1]);
    gl.uniform3fv(U.col2,  curPal[2]);
    gl.uniform3fv(U.col3,  curPal[3]);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  animate();
  console.log('âœ¦ Aman Kumar Portfolio â€” Painterly Gradient Canvas Initialized.');
})();
