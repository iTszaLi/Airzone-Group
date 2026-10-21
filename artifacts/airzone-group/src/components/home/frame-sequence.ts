export type FrameSet = {
  url: (i: number) => string;
  count: number;
  width: number;
  height: number;
  /**
   * Usable rows per frame. Early frames carry a baked-in letterbox, so only the
   * band [top, bottom) may be shown; from `cleanFrom` the crop eases out to the
   * full frame height (more real detail on screen, no bars ever visible).
   */
  band: { top: number; bottom: number; cleanFrom: number };
};

type Rect = { sx: number; sy: number; sw: number; sh: number };
type Source = ImageBitmap | HTMLImageElement;
type Renderer = {
  kind: 'webgl' | '2d';
  resize(w: number, h: number): void;
  /** Draw frame a, blended towards frame b by weight t (0..1), from source rectangle r. */
  draw(a: Source, ai: number, b: Source | null, bi: number, t: number, r: Rect): void;
  /** Forget uploaded copies of a frame whose decoded image was released. */
  forget(i: number): void;
  dispose(): void;
};

/*
 * GPU path. The source frames are only 1280 x 720 and are always enlarged on
 * large or high-density screens, so the reconstruction filter decides how sharp
 * they look. Canvas 2D smoothing ("high") measures as soft as bilinear; this
 * shader uses Catmull-Rom bicubic sampling (9 taps via hardware bilinear),
 * which keeps edges noticeably crisper without any artificial sharpening.
 * It also blends two neighbouring frames, so slow scrolling moves smoothly
 * between the clip's 24 fps frames instead of stepping.
 */
const VERT = `attribute vec2 aPos; varying vec2 vUv;
void main() { vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5); gl_Position = vec4(aPos, 0.0, 1.0); }`;
const FRAG_BICUBIC = `precision highp float;
varying vec2 vUv; uniform sampler2D uA; uniform sampler2D uB; uniform float uT; uniform vec4 uRect; uniform vec2 uSize;
vec4 catmullRom(sampler2D tex, vec2 uv) {
  vec2 p = uv * uSize; vec2 t1 = floor(p - 0.5) + 0.5; vec2 f = p - t1;
  vec2 w0 = f * (-0.5 + f * (1.0 - 0.5 * f)); vec2 w1 = 1.0 + f * f * (-2.5 + 1.5 * f);
  vec2 w2 = f * (0.5 + f * (2.0 - 1.5 * f)); vec2 w3 = f * f * (-0.5 + 0.5 * f);
  vec2 w12 = w1 + w2; vec2 t12 = (t1 + w2 / w12) / uSize; vec2 t0 = (t1 - 1.0) / uSize; vec2 t3 = (t1 + 2.0) / uSize;
  return texture2D(tex, vec2(t0.x, t0.y)) * w0.x * w0.y + texture2D(tex, vec2(t12.x, t0.y)) * w12.x * w0.y + texture2D(tex, vec2(t3.x, t0.y)) * w3.x * w0.y
    + texture2D(tex, vec2(t0.x, t12.y)) * w0.x * w12.y + texture2D(tex, vec2(t12.x, t12.y)) * w12.x * w12.y + texture2D(tex, vec2(t3.x, t12.y)) * w3.x * w12.y
    + texture2D(tex, vec2(t0.x, t3.y)) * w0.x * w3.y + texture2D(tex, vec2(t12.x, t3.y)) * w12.x * w3.y + texture2D(tex, vec2(t3.x, t3.y)) * w3.x * w3.y;
}
void main() {
  vec2 uv = uRect.xy + vUv * uRect.zw;
  vec4 c = catmullRom(uA, uv);
  if (uT > 0.0) c = mix(c, catmullRom(uB, uv), uT);
  gl_FragColor = vec4(clamp(c.rgb, 0.0, 1.0), 1.0);
}`;
const FRAG_LINEAR = `precision mediump float;
varying vec2 vUv; uniform sampler2D uA; uniform sampler2D uB; uniform float uT; uniform vec4 uRect; uniform vec2 uSize;
void main() { vec2 uv = uRect.xy + vUv * uRect.zw; gl_FragColor = vec4(mix(texture2D(uA, uv), texture2D(uB, uv), uT).rgb, 1.0); }`;

function createWebGlRenderer(canvas: HTMLCanvasElement, set: FrameSet): Renderer | null {
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, premultipliedAlpha: false, powerPreference: 'high-performance' });
  if (!gl) return null;
  let program: WebGLProgram | null = null;
  let loc: Record<'a' | 'b' | 't' | 'rect' | 'size', WebGLUniformLocation | null> | null = null;
  // A small pool of frame-sized textures, reused (texSubImage2D) rather than
  // reallocated; slots are assigned least-recently-used.
  const POOL = 6;
  let pool: WebGLTexture[] = [];
  const slotOf = new Map<number, number>(); // frame -> slot, in LRU order (oldest first)

  const compile = (frag: string) => {
    const make = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src); gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const v = make(gl.VERTEX_SHADER, VERT), f = make(gl.FRAGMENT_SHADER, frag);
    if (!v || !f) return null;
    const p = gl.createProgram()!;
    gl.attachShader(p, v); gl.attachShader(p, f); gl.linkProgram(p);
    return gl.getProgramParameter(p, gl.LINK_STATUS) ? p : null;
  };
  const init = () => {
    slotOf.clear();
    program = compile(FRAG_BICUBIC) ?? compile(FRAG_LINEAR);
    if (!program) return false;
    gl.useProgram(program);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    loc = { a: gl.getUniformLocation(program, 'uA'), b: gl.getUniformLocation(program, 'uB'), t: gl.getUniformLocation(program, 'uT'), rect: gl.getUniformLocation(program, 'uRect'), size: gl.getUniformLocation(program, 'uSize') };
    gl.uniform1i(loc.a, 0); gl.uniform1i(loc.b, 1);
    gl.uniform2f(loc.size, set.width, set.height);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    pool = Array.from({ length: POOL }, () => {
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, set.width, set.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      return tex;
    });
    return true;
  };
  if (!init()) return null;

  const texture = (i: number, img: Source, keep: number) => {
    let slot = slotOf.get(i);
    if (slot !== undefined) { slotOf.delete(i); slotOf.set(i, slot); return pool[slot]; }
    // Reuse the least-recently-used slot that is not the other frame being drawn.
    const used = new Set(slotOf.values());
    slot = pool.findIndex((_, k) => !used.has(k));
    if (slot < 0) {
      for (const [frame, s] of slotOf) if (frame !== keep) { slot = s; slotOf.delete(frame); break; }
    }
    gl.bindTexture(gl.TEXTURE_2D, pool[slot]);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, img);
    slotOf.set(i, slot);
    return pool[slot];
  };

  let lost = false;
  const onLost = (e: Event) => { e.preventDefault(); lost = true; };
  const onRestored = () => { lost = !init(); };
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);

  return {
    kind: 'webgl',
    resize(w, h) { gl.viewport(0, 0, w, h); },
    draw(a, ai, b, bi, t, r) {
      if (lost || !program || !loc) return;
      const ta = texture(ai, a, bi);
      const tb = b && t > 0 ? texture(bi, b, ai) : ta;
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, ta);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, tb);
      gl.uniform1f(loc.t, b ? t : 0);
      gl.uniform4f(loc.rect, r.sx / set.width, r.sy / set.height, r.sw / set.width, r.sh / set.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    forget(i) { slotOf.delete(i); },
    dispose() {
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      for (const t of pool) gl.deleteTexture(t);
      pool = []; slotOf.clear();
    },
  };
}

function create2dRenderer(canvas: HTMLCanvasElement): Renderer | null {
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return null;
  return {
    kind: '2d',
    resize() { ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'; },
    draw(a, _ai, b, _bi, t, r) {
      ctx.globalAlpha = 1;
      ctx.drawImage(a, r.sx, r.sy, r.sw, r.sh, 0, 0, canvas.width, canvas.height);
      if (b && t > 0.004) { ctx.globalAlpha = t; ctx.drawImage(b, r.sx, r.sy, r.sw, r.sh, 0, 0, canvas.width, canvas.height); ctx.globalAlpha = 1; }
    },
    forget() {},
    dispose() { ctx.clearRect(0, 0, canvas.width, canvas.height); },
  };
}

/**
 * Draws an image sequence to a canvas at a fractional frame index and zoom.
 *
 * Loading: the compressed frames download coarse-to-fine (every 16th, then 8th,
 * 4th, 2nd, then the rest), six at a time, starting once the page has loaded (or
 * on the first scroll), so they never compete with the first paint.
 *
 * Decoding: drawing straight from <img> elements measured 12-15 ms per new frame
 * (the browser re-decodes them on upload), which dropped frames while scrolling.
 * Frames are therefore decoded off the main thread into ImageBitmaps (~1.6 ms to
 * upload), but only within a window around the current position, biased in the
 * scroll direction, plus sparse anchor frames for fast jumps; the rest stay
 * compressed, so memory stays bounded (~150 MB for the desktop set, ~55 MB for phones).
 *
 * Drawing: the two decoded frames around the requested position are blended, so
 * motion stays continuous between frames. The camera push-in is applied by
 * cropping the source rather than with a CSS transform (one resampling step,
 * not two). The backing store matches the screen's device pixels (capped) and is
 * only reallocated when the displayed size actually changes.
 */
export function createFrameSequence(canvas: HTMLCanvasElement, set: FrameSet, { coarseOnly = false } = {}) {
  const renderer = createWebGlRenderer(canvas, set) ?? create2dRenderer(canvas);
  const canBitmap = typeof createImageBitmap === 'function';
  const blobs: (Blob | undefined)[] = new Array(set.count);
  const imgs: (HTMLImageElement | undefined)[] = new Array(set.count); // only without ImageBitmap support
  const bitmaps = new Map<number, ImageBitmap>();
  const decoding = new Set<number>();
  const small = set.width * set.height < 600_000;
  // ANCHOR matches the first download pass (every 16th frame), so on a slow
  // connection every frame that has arrived can be shown.
  const AHEAD = small ? 14 : 18, BEHIND = small ? 6 : 8, ANCHOR = 16;
  let disposed = false;
  let want = { f: -1, z: 1 };
  let dir = 1;
  let shown = '';
  let aspect = 16 / 9;
  let cssW = 0, cssH = 0;
  canvas.dataset.renderer = renderer?.kind ?? 'none';

  const order: number[] = [];
  const seen = new Set<number>();
  for (const step of coarseOnly ? [16, 8, 4] : [16, 8, 4, 2, 1]) {
    for (let i = 0; i < set.count; i += step) if (!seen.has(i)) { seen.add(i); order.push(i); }
  }
  if (!seen.has(set.count - 1)) order.push(set.count - 1);

  const measure = (force = false) => {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    if (!force && w === cssW && h === cssH) return false;
    cssW = w; cssH = h;
    aspect = w / h;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const scale = Math.min(dpr, 2560 / w);
    canvas.width = Math.max(1, Math.round(w * scale));
    canvas.height = Math.max(1, Math.round(h * scale));
    renderer?.resize(canvas.width, canvas.height);
    shown = '';
    return true;
  };

  // Source rectangle at (fractional) frame position f: object-fit: cover within
  // the usable rows, then narrowed by the zoom factor around the same centre.
  const crop = (f: number, z: number): Rect => {
    const { top, bottom, cleanFrom } = set.band;
    let t = 0;
    if (f >= cleanFrom) {
      const x = Math.min(1, (f - cleanFrom) / Math.max(1, set.count - 1 - cleanFrom));
      t = x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2; // ease in-out
    }
    const y0 = top * (1 - t), y1 = bottom + (set.height - bottom) * t;
    const availH = y1 - y0, cy = (y0 + y1) / 2;
    let sw = set.width, sh = availH;
    if (sw / sh > aspect) sw = sh * aspect; else sh = sw / aspect;
    sw /= z; sh /= z;
    return { sx: (set.width - sw) / 2, sy: cy - sh / 2, sw, sh };
  };

  const source = (i: number): Source | undefined => (canBitmap ? bitmaps.get(i) : imgs[i]);
  const below = (i: number) => { for (let k = i; k >= 0; k--) if (source(k)) return k; return -1; };
  const above = (i: number) => { for (let k = i; k < set.count; k++) if (source(k)) return k; return -1; };

  const draw = () => {
    const { f, z } = want;
    if (f < 0 || !renderer) return;
    let a = below(Math.floor(f)), b = above(Math.ceil(f));
    if (a < 0) a = b;
    if (b < 0) b = a;
    if (a < 0) return;
    // Blend only between near neighbours; across a wider gap (frames still
    // decoding) show the closer one rather than a double exposure.
    let t = b > a ? (f - a) / (b - a) : 0;
    if (b - a > 2) { if (t >= 0.5) a = b; t = 0; }
    t = Math.round(Math.min(1, Math.max(0, t)) * 64) / 64;
    const r = crop(f, z);
    const key = `${a}|${b}|${t}|${r.sx.toFixed(2)}|${r.sy.toFixed(2)}|${r.sw.toFixed(2)}`;
    if (key === shown) return;
    renderer.draw(source(a)!, a, t > 0 ? source(b)! : null, b, t, r);
    shown = key;
    canvas.dataset.ready = '';
    canvas.dataset.frame = String(t >= 0.5 ? b : a);
  };

  // Keep decoded bitmaps for the frames around the current position (more ahead
  // in the scroll direction), every ANCHOR-th frame, and the nearest downloaded
  // frame on each side (so a slow connection still shows the closest arrival);
  // release the rest.
  let near = new Set<number>();
  const wanted = (i: number, c: number) => i % ANCHOR === 0 || i === set.count - 1 || near.has(i)
    || (dir >= 0 ? i >= c - BEHIND && i <= c + AHEAD : i >= c - AHEAD && i <= c + BEHIND);
  const redraw = () => { if (want.f >= 0) { shown = ''; draw(); } };
  const maintain = () => {
    if (!canBitmap || disposed) return;
    const c = Math.round(Math.max(0, want.f));
    near = new Set<number>();
    for (let k = c; k >= 0; k--) if (blobs[k]) { near.add(k); break; }
    for (let k = c; k < set.count; k++) if (blobs[k]) { near.add(k); break; }
    for (const [i, bm] of bitmaps) if (!wanted(i, c)) { bm.close(); bitmaps.delete(i); renderer?.forget(i); }
    // Nearest frames first, up to four decodes in flight.
    const span = AHEAD + 1;
    for (const i of near) {
      if (decoding.size >= 4 || bitmaps.has(i) || decoding.has(i)) continue;
      decoding.add(i);
      createImageBitmap(blobs[i]!).then(bm => {
        decoding.delete(i);
        if (disposed) { bm.close(); return; }
        bitmaps.set(i, bm);
        if (i === 0) resolveReady();
        redraw(); maintain();
      }).catch(() => { decoding.delete(i); });
    }
    for (let d = 0; d <= span && decoding.size < 4; d++) {
      for (const i of dir >= 0 ? [c + d, c - d] : [c - d, c + d]) {
        if (i < 0 || i >= set.count || decoding.size >= 4) continue;
        if (!wanted(i, c) || bitmaps.has(i) || decoding.has(i) || !blobs[i]) continue;
        decoding.add(i);
        createImageBitmap(blobs[i]!).then(bm => {
          decoding.delete(i);
          if (disposed || !wanted(i, Math.round(Math.max(0, want.f)))) { bm.close(); maintain(); return; }
          bitmaps.set(i, bm);
          if (i === 0) resolveReady();
          redraw();
          maintain();
        }).catch(() => { decoding.delete(i); });
      }
    }
    // Anchors (and the frames needed before scrolling starts) once the window is served.
    if (decoding.size < 2) {
      for (let i = 0; i < set.count && decoding.size < 2; i += ANCHOR) {
        if (bitmaps.has(i) || decoding.has(i) || !blobs[i]) continue;
        decoding.add(i);
        createImageBitmap(blobs[i]!).then(bm => { decoding.delete(i); if (disposed) { bm.close(); return; } bitmaps.set(i, bm); if (i === 0) resolveReady(); redraw(); maintain(); })
          .catch(() => { decoding.delete(i); });
      }
    }
  };

  const render = (f: number, z = 1) => {
    const nf = Math.max(0, Math.min(set.count - 1, f));
    if (want.f >= 0 && Math.abs(nf - want.f) > 0.01) dir = nf > want.f ? 1 : -1;
    const moved = Math.round(nf) !== Math.round(want.f);
    want = { f: nf, z: Math.max(1, z) };
    draw();
    if (moved) maintain();
  };

  let next = 0;
  let resolveReady!: () => void;
  const ready = new Promise<void>(r => { resolveReady = r; });
  const pump = () => {
    if (disposed || next >= order.length) return;
    const i = order[next++];
    const done = () => { if (want.f >= 0 && !canvas.dataset.ready) draw(); };
    if (canBitmap) {
      fetch(set.url(i)).then(r => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status))))).then(blob => {
        if (disposed) return;
        blobs[i] = blob;
        maintain();
        done();
      }).catch(() => { /* a missing frame falls back to its neighbours */ }).finally(pump);
    } else {
      const img = new Image();
      img.decoding = 'async';
      img.src = set.url(i);
      img.decode().then(() => {
        if (disposed) return;
        imgs[i] = img;
        if (i === 0) resolveReady();
        if (want.f >= 0 && (Math.abs(i - want.f) <= 2 || !canvas.dataset.ready)) { shown = ''; draw(); }
      }).catch(() => {}).finally(pump);
    }
  };

  measure(true);
  let resizeRaf = 0;
  const onResize = () => {
    if (resizeRaf) return;
    resizeRaf = requestAnimationFrame(() => { resizeRaf = 0; if (measure()) draw(); });
  };
  window.addEventListener('resize', onResize);

  // Frames never compete with the first paint: downloads begin once the page
  // has loaded and the browser is idle, or straight away on the first scroll.
  let started = false;
  let cancelIdle = () => {};
  const start = () => {
    if (started || disposed) return;
    started = true;
    window.removeEventListener('scroll', start);
    for (let k = 0; k < 6; k++) pump();
  };
  const whenIdle = () => {
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    if (ric) {
      const id = ric(start, { timeout: 1200 });
      cancelIdle = () => (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(id);
    } else {
      const id = window.setTimeout(start, 300);
      cancelIdle = () => window.clearTimeout(id);
    }
  };
  window.addEventListener('scroll', start, { passive: true, once: true });
  if (document.readyState === 'complete') whenIdle(); else window.addEventListener('load', whenIdle, { once: true });

  return {
    render,
    ready,
    dispose() {
      disposed = true;
      cancelAnimationFrame(resizeRaf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', start);
      window.removeEventListener('load', whenIdle);
      cancelIdle();
      delete canvas.dataset.ready;
      renderer?.dispose();
      for (const bm of bitmaps.values()) bm.close();
      bitmaps.clear();
    },
  };
}
