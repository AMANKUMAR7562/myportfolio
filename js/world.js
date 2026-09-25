/**
 * js/world.js — Dynamic Ambient Fluid Shader
 * Adapts to Studio Cream (warm luminous watercolor), Obsidian (deep ember fluid),
 * and Spectrum (chromatic rainbow).
 */

(function () {
  'use strict';

  const canvas = document.getElementById('canvas-bg');
  if (!canvas) return;

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) {
    canvas.style.background = 'transparent';
    return;
  }

  // ——— SHADERS ———
  const VERT = `
    attribute vec2 a_pos;
    void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
  `;

  const FRAG = `
    precision highp float;
    uniform float u_time;
    uniform vec2  u_res;
    uniform vec2  u_mouse;
    uniform float u_hue;
    uniform float u_light_mode; /* 1.0 for cream, 0.0 for dark */

    vec3 hsl2rgb(float h, float s, float l) {
      float c = (1.0 - abs(2.0*l - 1.0)) * s;
      float x = c * (1.0 - abs(mod(h/60.0, 2.0) - 1.0));
      float m = l - c*0.5;
      vec3 rgb;
      if      (h < 60.0)  rgb = vec3(c, x, 0.0);
      else if (h < 120.0) rgb = vec3(x, c, 0.0);
      else if (h < 180.0) rgb = vec3(0.0, c, x);
      else if (h < 240.0) rgb = vec3(0.0, x, c);
      else if (h < 300.0) rgb = vec3(x, 0.0, c);
      else                rgb = vec3(c, 0.0, x);
      return rgb + m;
    }

    vec2 hash2(vec2 p) {
      p = vec2(dot(p, vec2(127.1,311.7)), dot(p, vec2(269.5,183.3)));
      return -1.0 + 2.0*fract(sin(p)*43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      vec2 u = f*f*(3.0-2.0*f);
      return mix(mix(dot(hash2(i+vec2(0,0)),f-vec2(0,0)),
                     dot(hash2(i+vec2(1,0)),f-vec2(1,0)),u.x),
                 mix(dot(hash2(i+vec2(0,1)),f-vec2(0,1)),
                     dot(hash2(i+vec2(1,1)),f-vec2(1,1)),u.x),u.y);
    }

    float fbm(vec2 p) {
      float v=0.0, a=0.5;
      for(int i=0;i<4;i++){ v+=a*noise(p); p=p*2.0+vec2(1.7,9.2); a*=0.5; }
      return v;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_res.xy;
      uv.y = 1.0 - uv.y;

      // Mouse influence
      vec2 mouse = u_mouse / u_res;
      float mDist = length(uv - mouse);
      float mPull = smoothstep(0.45, 0.0, mDist) * 0.14;
      vec2 p = uv * 2.2 - 1.0;
      p += (uv - mouse) * mPull;

      float t  = u_time * 0.10;
      float q1 = fbm(p + t);
      float q2 = fbm(p + vec2(q1, q1*0.7) + vec2(t*0.7, t*0.3));
      float f  = clamp(fbm(p + 2.0*vec2(q2, -q2)) * 0.5 + 0.5, 0.0, 1.0);

      vec3 col;

      if (u_light_mode > 0.5) {
        // ——— STUDIO CREAM: Delicate Warm Watercolor Ink on Art Paper ———
        vec3 paperBase = vec3(0.972, 0.960, 0.933); /* #F8F5EE */
        vec3 warmTint  = hsl2rgb(u_hue, 0.35, 0.91); /* Soft tinted mist */
        vec3 accentTone= hsl2rgb(u_hue, 0.85, 0.65); /* Vibrant ink veil */

        col = paperBase;
        col = mix(col, warmTint,   smoothstep(0.2, 0.6, f) * 0.45);
        col = mix(col, accentTone, smoothstep(0.55, 0.85, f) * 0.18);

        // Gentle vignette
        float vig = smoothstep(0.0, 0.6, 1.0 - length(uv - 0.5)*0.8);
        col = mix(paperBase, col, vig);
      } else {
        // ——— DARK / OBSIDIAN: Deep Atmospheric Ink ———
        vec3 deepBg  = hsl2rgb(u_hue, 0.35, 0.04);
        float midHue = mod(u_hue + 210.0, 360.0);
        vec3 midCol  = hsl2rgb(midHue, 0.60, 0.14);
        vec3 accent  = hsl2rgb(u_hue, 0.96, 0.55);

        col = deepBg;
        col = mix(col, midCol, smoothstep(0.15, 0.5, f));
        col = mix(col, accent, smoothstep(0.48, 0.8, f) * 0.50);

        float vig = smoothstep(0.0, 0.5, 1.0 - length(uv - 0.5)*1.1);
        col *= (vig * 0.85 + 0.15);
      }

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  function compileShader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  const prog = gl.createProgram();
  gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,  1, -1, -1,  1,
    -1,  1,  1, -1,  1,  1,
  ]), gl.STATIC_DRAW);

  const aPos = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uTime      = gl.getUniformLocation(prog, 'u_time');
  const uRes       = gl.getUniformLocation(prog, 'u_res');
  const uMouse     = gl.getUniformLocation(prog, 'u_mouse');
  const uHue       = gl.getUniformLocation(prog, 'u_hue');
  const uLightMode = gl.getUniformLocation(prog, 'u_light_mode');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let sMouseX = mouseX;
  let sMouseY = mouseY;

  window.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  let start = performance.now();

  function render(now) {
    const elapsed = (now - start) * 0.001;

    sMouseX += (mouseX - sMouseX) * 0.06;
    sMouseY += (mouseY - sMouseY) * 0.06;

    let currentHue = 16;
    let isLight = 1.0; // Studio Cream default

    if (window.ThemeManager) {
      currentHue = window.ThemeManager.themeHue;
      isLight = window.ThemeManager.isDarkMode ? 0.0 : 1.0;
    }

    gl.uniform1f(uTime, elapsed);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform2f(uMouse, sMouseX * (canvas.width / window.innerWidth), sMouseY * (canvas.height / window.innerHeight));
    gl.uniform1f(uHue, currentHue);
    gl.uniform1f(uLightMode, isLight);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();
