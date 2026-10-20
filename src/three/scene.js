import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Shape, ExtrudeGeometry, Mesh, MeshStandardMaterial,
  TextureLoader, SRGBColorSpace, PMREMGenerator, Points, BufferGeometry, Float32BufferAttribute,
  PointsMaterial, AdditiveBlending, CanvasTexture, Sprite, SpriteMaterial, DirectionalLight, MathUtils,
  NoToneMapping, Color
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import shapes from './kshape.json';

const smooth = (a, b, x) => {
  const t = MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

function dotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 32;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  gr.addColorStop(0, 'rgba(255,255,255,1)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr;
  g.fillRect(0, 0, 32, 32);
  return new CanvasTexture(c);
}
function glowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(210,216,228,.55)');
  gr.addColorStop(0.5, 'rgba(120,128,145,.14)');
  gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr;
  g.fillRect(0, 0, 128, 128);
  return new CanvasTexture(c);
}

export async function createScene(canvas, opts) {
  const { tier: tier0, onReady, onFail } = opts;
  let tier = tier0;
  const [bx, by, bw, bh] = shapes.bbox;
  const aspect = bw / bh;

  const renderer = new WebGLRenderer({ canvas, antialias: tier === 'high', alpha: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = NoToneMapping;
  let dprCap = tier === 'high' ? 1.75 : 1.25;
  const scene = new Scene();
  const camera = new PerspectiveCamera(35, 1, 0.1, 60);
  camera.position.set(0, 0, 6);

  const pm = new PMREMGenerator(renderer);
  const env = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;
  pm.dispose();

  // --- K ---
  const tex = await new Promise((res, rej) => new TextureLoader().load('/img/k-face.webp', res, undefined, rej));
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 4;
  const faceMat = new MeshStandardMaterial({
    map: tex, emissiveMap: tex, emissive: new Color(0xffffff), emissiveIntensity: 1.35,
    color: new Color(0x55555a), metalness: 0.6, roughness: 0.4, envMapIntensity: 0.7
  });
  const sideMat = new MeshStandardMaterial({ color: 0xd8dbe2, metalness: 1, roughness: 0.22, envMapIntensity: 1.3 });
  const K = new Group();
  const parts = {};
  const depth = { slab: 0.05, blade: 0.065, leg: 0.05 };
  for (const name of ['slab', 'blade', 'leg']) {
    const pts = shapes.parts[name].map(([x, y]) => [(x - bx) / bw, 1 - (y - by) / bh]);
    const sh = new Shape();
    pts.forEach(([u, v], i) => (i ? sh.lineTo(u, v) : sh.moveTo(u, v)));
    sh.closePath();
    const geo = new ExtrudeGeometry(sh, {
      depth: depth[name], bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.004, bevelSegments: 1, curveSegments: 1
    });
    geo.translate(-0.5, -0.5, -depth[name] / 2);
    const m = new Mesh(geo, [faceMat, sideMat]);
    m.scale.set(aspect, 1, 1);
    parts[name] = m;
    K.add(m);
  }
  const base = { slab: [0, 0, 0], blade: [0, 0, 0.07], leg: [0, 0, 0.03] };
  scene.add(K);

  // glow
  const glow = new Sprite(new SpriteMaterial({ map: glowTexture(), blending: AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.5 }));
  glow.position.z = -1.2;
  scene.add(glow);

  // dust
  const N = tier === 'high' ? 220 : 110;
  const pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 9;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
    pos[i * 3 + 2] = -3 + Math.random() * 7;
  }
  const dg = new BufferGeometry();
  dg.setAttribute('position', new Float32BufferAttribute(pos, 3));
  const dm = new PointsMaterial({ size: 0.05, map: dotTexture(), color: 0xc9ced8, transparent: true, opacity: 0.55, depthWrite: false, blending: AdditiveBlending, sizeAttenuation: true });
  const dust = new Points(dg, dm);
  scene.add(dust);

  const key = new DirectionalLight(0xffffff, 1.2);
  key.position.set(2, 3, 4);
  scene.add(key);

  // --- layout / sizing ---
  let W = 0, H = 0;
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    if (w === W && Math.abs(h - H) < 120) return; // ignore mobile URL-bar jitter
    W = w; H = h;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    readSlot();
  }
  let slot = null; // hero anchor from DOM (document coords)
  function readSlot() {
    const el = document.querySelector('[data-kslot]');
    if (!el) { slot = null; return; }
    const r = el.getBoundingClientRect();
    slot = { cx: r.left + r.width / 2, cy: r.top + scrollY + r.height / 2, h: r.height, w: r.width };
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const worldH = () => 2 * Math.tan(MathUtils.degToRad(camera.fov / 2)) * camera.position.z;

  // --- input ---
  const tgt = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
  const onMove = (e) => {
    const p = e.touches ? e.touches[0] : e;
    if (!p) return;
    tgt.x = (p.clientX / innerWidth - 0.5) * 2;
    tgt.y = (p.clientY / innerHeight - 0.5) * 2;
  };
  addEventListener('pointermove', onMove, { passive: true });
  addEventListener('touchmove', onMove, { passive: true });

  // --- state ---
  const st = { fh: 0.4, nx: 0, ny: 0, op: 1 };
  let route = location.pathname;
  if (location.search.includes('debug')) window.__kdbg = {};
  const t0 = performance.now();
  let introStart = 0;
  let raf = 0, disposed = false, last = performance.now(), frames = 0, readyFired = false;
  const dts = [];
  let strikes = 0, stage = 0;

  function layout(tSec) {
    const vw = innerWidth, vh = Math.min(innerHeight, H || innerHeight);
    const wide = vw / vh > 1.1;
    const home = route === '/' || route === '';
    const sy = scrollY;
    const s = smooth(0, vh * 0.85, sy);
    const hh = worldH();
    let hero, away;
    if (home && slot) {
      const cy = slot.cy - sy;
      hero = { fh: Math.min(slot.h * 0.92, vh * (wide ? 0.62 : 0.4)) / vh, nx: (slot.cx / vw) * 2 - 1, ny: 1 - (cy / vh) * 2 };
    } else {
      hero = { fh: wide ? 0.3 : 0.2, nx: wide ? 0.78 : 0.62, ny: wide ? 0.62 : 0.8 };
    }
    away = wide ? { fh: 0.2, nx: 0.84, ny: 0.7 } : { fh: 0.15, nx: 0.7, ny: 0.84 };
    const mix = home ? s : 1;
    const tgtS = {
      fh: MathUtils.lerp(hero.fh, away.fh, mix),
      nx: MathUtils.lerp(hero.nx, away.nx, mix),
      ny: MathUtils.lerp(hero.ny, away.ny, mix)
    };
    return tgtS;
  }

  function frame(now) {
    if (disposed) return;
    raf = requestAnimationFrame(frame);
    if (document.hidden) { last = now; return; }
    const dt = Math.min(now - last, 250);
    last = now;
    frames++;

    // governor
    if (frames > 50 && dt < 200) {
      dts.push(dt);
      if (dts.length >= 75) {
        const sorted = [...dts].sort((a, b) => a - b);
        const med = sorted[sorted.length >> 1];
        dts.length = 0;
        if (med > 26) strikes++; else strikes = Math.max(0, strikes - 1);
        if (strikes >= 2) {
          strikes = 0;
          if (stage === 0) {
            stage = 1; dprCap = 1; dust.visible = false; W = 0; resize();
          } else {
            onFail && onFail('slow');
            return;
          }
        }
      }
    }

    const t = (now - t0) / 1000;
    const L = layout(t);
    // smooth follow so route changes glide
    const k = 1 - Math.pow(0.0015, dt / 1000);
    st.fh += (L.fh - st.fh) * k;
    st.nx += (L.nx - st.nx) * k;
    st.ny += (L.ny - st.ny) * k;
    cur.x += (tgt.x - cur.x) * Math.min(1, dt / 120);
    cur.y += (tgt.y - cur.y) * Math.min(1, dt / 120);

    const hh = worldH();
    const ww = hh * camera.aspect;
    let size = st.fh * hh;
    size = Math.min(size, (ww * 0.9) / aspect);
    K.scale.setScalar(size);
    K.position.set(st.nx * ww * 0.5, st.ny * hh * 0.5, 0);

    // intro assemble
    if (!introStart && readyFired) introStart = now;
    const ip = introStart ? MathUtils.clamp((now - introStart) / 1700, 0, 1) : 0;
    const e = easeOut(ip);
    const off = { slab: [-1.4, -0.4, -2.2], blade: [1.8, 0.8, 1.2], leg: [1.2, -1.4, -1.6] };
    for (const n of ['slab', 'blade', 'leg']) {
      const p = parts[n];
      p.position.set(
        base[n][0] + off[n][0] * (1 - e) + Math.sin(t * 0.8 + n.length) * 0.006,
        base[n][1] + off[n][1] * (1 - e),
        base[n][2] + off[n][2] * (1 - e)
      );
      p.rotation.z = (1 - e) * (n === 'blade' ? 0.9 : -0.7);
    }
    const sp = scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const spin = (route === '/' ? smooth(0, innerHeight * 1.2, scrollY) * Math.PI * 1.2 : 0) + sp * Math.PI * 0.8;
    K.rotation.y = Math.sin(t * 0.55) * 0.5 + cur.x * 0.35 + spin + (1 - e) * 1.6;
    K.rotation.x = cur.y * 0.18 + Math.sin(t * 0.4) * 0.05;
    glow.position.x = K.position.x;
    glow.position.y = K.position.y;
    glow.scale.setScalar(size * 3.2);
    glow.material.opacity = 0.5 * e;

    // dust parallax + camera dolly through it
    dust.rotation.y = t * 0.02 + sp * 0.8;
    dust.position.y = sp * 3 + t * 0.03 % 1;
    camera.position.z = 6 - sp * 1.2;
    key.position.x = Math.sin(t * 0.7) * 3;

    // dim on text-heavy pages
    const wideNow = innerWidth / Math.min(innerHeight, H || innerHeight) > 1.1;
    canvas.style.opacity = !readyFired ? '' : route === '/' ? String(1 - smooth(innerHeight * 0.4, innerHeight * 1.6, scrollY) * 0.5) : wideNow ? '0.6' : '0';

    if (window.__kdbg) window.__kdbg.v = { size, pos: K.position.toArray(), st: { ...st }, W, H, slot, ww, hh, rot: K.rotation.toArray().slice(0, 3) };
    renderer.render(scene, camera);
    if (!readyFired && frames > 2) {
      readyFired = true;
      onReady && onReady();
    }
  }
  raf = requestAnimationFrame(frame);

  const routeTimer = setInterval(() => {
    if (location.pathname !== route) {
      route = location.pathname;
      setTimeout(readSlot, 60);
    }
  }, 120);
  const onCtxLost = (e) => { e.preventDefault(); onFail && onFail('lost'); };
  canvas.addEventListener('webglcontextlost', onCtxLost);
  addEventListener('resize', () => setTimeout(readSlot, 100), { passive: true });

  return {
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      clearInterval(routeTimer);
      ro.disconnect();
      removeEventListener('pointermove', onMove);
      removeEventListener('touchmove', onMove);
      canvas.removeEventListener('webglcontextlost', onCtxLost);
      Object.values(parts).forEach((m) => m.geometry.dispose());
      faceMat.dispose(); sideMat.dispose(); tex.dispose(); dg.dispose(); dm.dispose(); env.dispose();
      renderer.dispose();
      canvas.style.opacity = '';
    }
  };
}
