import './style.css';
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Shape, Path, ExtrudeGeometry, Mesh, MeshStandardMaterial, MeshBasicMaterial,
  TextureLoader, SRGBColorSpace, PMREMGenerator, Points, BufferGeometry, Float32BufferAttribute, PointsMaterial, AdditiveBlending,
  CanvasTexture, Sprite, SpriteMaterial, DirectionalLight, MathUtils, PlaneGeometry, BoxGeometry, RingGeometry, CircleGeometry,
  LatheGeometry, TorusGeometry, Vector2, Vector3, Raycaster, FogExp2, Color, NoToneMapping, CylinderGeometry
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import shapes from './kshape.json';
import { PROJECTS, SERVICES } from './data.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const q = new URLSearchParams(location.search);
const FORCE = q.has('force');
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = MathUtils.clamp;
const smooth = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
const trap = (p, a, b, c, d) => smooth((p - a) / (b - a)) * (1 - smooth((p - c) / (d - c)));

// ---- scroll timeline ----
const SEGS = [
  [0, 0.05, 7, 7], [0.05, 0.18, 7, -11], [0.18, 0.44, -11, -11], [0.44, 0.54, -11, -33],
  [0.54, 0.84, -33, -33], [0.84, 0.94, -33, -53], [0.94, 1.01, -53, -53]
];
const STOPS = [0, 0.3, 0.68, 1];
function pathAt(p) {
  for (const [a, b, z0, z1] of SEGS) {
    if (p >= a && p <= b) { const u = smooth((p - a) / (b - a)); return { z: z0 + (z1 - z0) * u, u: z0 === z1 ? 0 : u }; }
  }
  return { z: -53, u: 0 };
}
const FADES = [[-1, -1, 0.04, 0.11], [0.12, 0.2, 0.40, 0.46], [0.5, 0.56, 0.82, 0.87], [0.9, 0.95, 2, 3]];

function showNotice(id) { $(id).hidden = false; $('#loader').classList.add('gone'); }

async function start() {
  const canvas = $('#gl');
  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  } catch (e) { return showNotice('#fail'); }
  renderer.setClearColor(0x000000, 1);
  renderer.toneMapping = NoToneMapping;
  let dprCap = Math.min(window.devicePixelRatio || 1, 1.6);

  const scene = new Scene();
  scene.fog = new FogExp2(0x000000, 0.021);
  const camera = new PerspectiveCamera(38, 1, 0.1, 140);
  const pm = new PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  pm.dispose();

  const loader = new TextureLoader();
  const load = (url) => new Promise((res) => loader.load(url, (t) => { t.colorSpace = SRGBColorSpace; t.anisotropy = 4; res(t); }, undefined, () => res(null)));
  try { await document.fonts.load('300 64px "Jost Variable"'); await document.fonts.load('500 30px "Jost Variable"'); } catch {}
  const [kTex, ...pTex] = await Promise.all([load('/img/k-face.webp'), ...PROJECTS.map((p) => load(p.img))]);

  const silver = new MeshStandardMaterial({ color: 0xd3d7df, metalness: 1, roughness: 0.24, envMapIntensity: 1.3 });
  const darkMetal = new MeshStandardMaterial({ color: 0x1b1c20, metalness: 0.95, roughness: 0.32, envMapIntensity: 0.9 });

  // ---- K ----
  const [bx, by, bw, bh] = shapes.bbox;
  const kAspect = bw / bh;
  const faceMat = new MeshStandardMaterial({ map: kTex, emissiveMap: kTex, emissive: new Color(0xffffff), emissiveIntensity: 1.35, color: new Color(0x55555a), metalness: 0.6, roughness: 0.4, envMapIntensity: 0.7 });
  const depths = { slab: 0.05, blade: 0.065, leg: 0.05 };
  const kGeos = {};
  for (const name of ['slab', 'blade', 'leg']) {
    const sh = new Shape();
    shapes.parts[name].map(([x, y]) => [(x - bx) / bw, 1 - (y - by) / bh]).forEach(([u, v], i) => (i ? sh.lineTo(u, v) : sh.moveTo(u, v)));
    sh.closePath();
    const g = new ExtrudeGeometry(sh, { depth: depths[name], bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.004, bevelSegments: 1, curveSegments: 1 });
    g.translate(-0.5, -0.5, -depths[name] / 2);
    kGeos[name] = g;
  }
  const makeK = () => {
    const g = new Group();
    const z = { slab: 0, blade: 0.07, leg: 0.03 };
    for (const n of ['slab', 'blade', 'leg']) { const m = new Mesh(kGeos[n], [faceMat, silver]); m.scale.set(kAspect, 1, 1); m.position.z = z[n]; g.add(m); }
    g.scale.setScalar(2.9);
    return g;
  };
  const glowTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(210,216,228,.5)'); gr.addColorStop(.5, 'rgba(120,128,145,.12)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new CanvasTexture(c); })();
  const glowAt = (x, y, z, s) => { const sp = new Sprite(new SpriteMaterial({ map: glowTex, blending: AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.55, fog: false })); sp.position.set(x, y, z); sp.scale.setScalar(s); scene.add(sp); return sp; };

  const K1 = makeK(); K1.position.set(2.5, 0.2, 0); scene.add(K1); glowAt(2.5, 0.2, -1.2, 11);
  const K2 = makeK(); K2.position.set(-2.7, 0.2, -60); scene.add(K2); glowAt(-2.7, 0.2, -61.2, 11);

  // ---- floor + rings ----
  const floor = new Mesh(new PlaneGeometry(90, 150), new MeshStandardMaterial({ color: 0x020203, metalness: 0.6, roughness: 0.55, envMapIntensity: 0.1 }));
  floor.rotation.x = -Math.PI / 2; floor.position.set(0, -2.7, -35); scene.add(floor);
  const ringMat = new MeshBasicMaterial({ color: 0xcfd4de, transparent: true, opacity: 0.28, fog: true });
  const ring = (x, z, r) => { const m = new Mesh(new RingGeometry(r, r + 0.025, 96), ringMat); m.rotation.x = -Math.PI / 2; m.position.set(x, -2.69, z); scene.add(m); };
  ring(2.5, 0, 2.6); ring(2.5, 0, 3.4); ring(-2.7, -60, 2.6); ring(-2.7, -60, 3.4);

  // ---- dust ----
  const N = 1300; const pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - 0.5) * 30; pos[i * 3 + 1] = -2.5 + Math.random() * 9; pos[i * 3 + 2] = 12 - Math.random() * 82; }
  const dg = new BufferGeometry(); dg.setAttribute('position', new Float32BufferAttribute(pos, 3));
  const dotT = (() => { const c = document.createElement('canvas'); c.width = c.height = 32; const g = c.getContext('2d'); const gr = g.createRadialGradient(16, 16, 0, 16, 16, 16); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 32, 32); return new CanvasTexture(c); })();
  const dust = new Points(dg, new PointsMaterial({ size: 0.06, map: dotT, color: 0xc9ced8, transparent: true, opacity: 0.5, depthWrite: false, blending: AdditiveBlending }));
  scene.add(dust);
  const key = new DirectionalLight(0xffffff, 1.1); key.position.set(3, 4, 5); scene.add(key);

  // ---- stacking deck ----
  const CARD_W = 4.5, CARD_H = 2.8;
  function makeDeck(items, cx, cy, cz) {
    const root = new Group(); root.position.set(cx, cy, cz); scene.add(root);
    const cards = items.map((it) => {
      const g = new Group();
      const body = new Mesh(new BoxGeometry(CARD_W + 0.16, CARD_H + 0.16, 0.1), darkMetal.clone());
      const screen = new Mesh(new PlaneGeometry(CARD_W, CARD_H), new MeshBasicMaterial({ map: it.tex, toneMapped: false, color: 0xffffff }));
      screen.position.z = 0.056;
      g.add(body, screen);
      if (it.extra) g.add(it.extra);
      g.userData = { screen, body, url: it.url, extra: it.extra, es: it.extra ? it.extra.scale.x : 1 };
      root.add(g);
      return g;
    });
    function layout(idx, t) {
      cards.forEach((g, i) => {
        const d = idx - i; // >0 buried
        const e = i === 0 ? 1 : clamp(1 + d, 0, 1);
        const eo = 1 - Math.pow(1 - e, 3);
        const bur = Math.max(0, d);
        g.visible = e > 0.001;
        g.position.set(0, (1 - eo) * -6.5 + bur * 0.34, -bur * 0.45 + (1 - eo) * 2.2);
        g.rotation.set((1 - eo) * 0.55, (1 - eo) * -0.25 + (REDUCED ? 0 : Math.sin(t * 0.5 + i) * 0.02), 0);
        g.scale.setScalar(Math.max(0.6, 1 - bur * 0.055));
        if (g.userData.extra) { const k = 1 - clamp(bur * 1.4, 0, 1); g.userData.extra.visible = k > 0.02; g.userData.extra.scale.setScalar(g.userData.es * Math.max(k, 0.01)); }
        const b = clamp(1 - bur * 0.28, 0.25, 1);
        g.userData.screen.material.color.setScalar(b);
        g.userData.body.material.color.setScalar(0.1 + 0.1 * b);
      });
    }
    return { root, cards, layout };
  }

  // work deck
  const workDeck = makeDeck(PROJECTS.map((p, i) => ({ tex: pTex[i] || null, url: p.url })), 2.2, 0.1, -40);

  // services cards: canvas textures + 3D objects
  function wrap(g, text, x, y, w, lh) { const words = text.split(' '); let line = ''; for (const wd of words) { const t = line + wd + ' '; if (g.measureText(t).width > w && line) { g.fillText(line, x, y); line = wd + ' '; y += lh; } else line = t; } g.fillText(line, x, y); return y; }
  function serviceTex(s) {
    const c = document.createElement('canvas'); c.width = 1152; c.height = 720; const g = c.getContext('2d');
    const bg = g.createLinearGradient(0, 0, 1152, 720); bg.addColorStop(0, '#12141a'); bg.addColorStop(1, '#050507');
    const rr = (x, y, w, h, r) => { g.beginPath(); g.roundRect(x, y, w, h, r); };
    g.fillStyle = bg; rr(0, 0, 1152, 720, 44); g.fill();
    const bd = g.createLinearGradient(0, 0, 1152, 0); bd.addColorStop(0, '#f2f4f8'); bd.addColorStop(1, '#555a66'); g.strokeStyle = bd; g.lineWidth = 4; rr(4, 4, 1144, 712, 42); g.stroke();
    g.fillStyle = '#a3a8b3'; g.font = '500 30px "Jost Variable", sans-serif'; g.fillText(s.n, 70, 96);
    g.fillStyle = '#ffffff'; g.font = '300 76px "Jost Variable", sans-serif'; g.fillText(s.title, 70, 190);
    g.fillStyle = '#b7bcc7'; g.font = '400 33px "Jost Variable", sans-serif'; let y = wrap(g, s.text, 70, 270, 560, 46);
    g.fillStyle = '#e8eaef'; g.font = '400 31px "Jost Variable", sans-serif'; y += 80;
    s.points.forEach((p) => { g.fillStyle = '#ffffff'; g.beginPath(); g.arc(80, y - 10, 6, 0, 7); g.fill(); g.fillStyle = '#d5d8df'; g.fillText(p, 106, y); y += 52; });
    const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; t.anisotropy = 4; return t;
  }
  const objs = {};
  // web: browser window
  { const g = new Group(); const f = new Mesh(new BoxGeometry(2.1, 1.4, 0.12), darkMetal); const c = document.createElement('canvas'); c.width = 512; c.height = 340; const x = c.getContext('2d');
    x.fillStyle = '#0a0b0e'; x.fillRect(0, 0, 512, 340); x.fillStyle = '#1b1d23'; x.fillRect(0, 0, 512, 36); ['#888', '#aaa', '#ccc'].forEach((col, i) => { x.fillStyle = col; x.beginPath(); x.arc(24 + i * 22, 18, 6, 0, 7); x.fill(); });
    x.fillStyle = '#fff'; x.fillRect(36, 70, 230, 22); x.fillStyle = '#6b707c'; x.fillRect(36, 104, 300, 10); x.fillRect(36, 122, 250, 10); x.fillStyle = '#d9dce3'; x.fillRect(36, 152, 90, 26);
    for (let i = 0; i < 3; i++) { x.fillStyle = '#16181d'; x.fillRect(36 + i * 150, 208, 136, 100); x.fillStyle = '#3a3e48'; x.fillRect(46 + i * 150, 218, 116, 8); }
    const tx = new CanvasTexture(c); tx.colorSpace = SRGBColorSpace;
    const s = new Mesh(new PlaneGeometry(1.94, 1.28), new MeshBasicMaterial({ map: tx, toneMapped: false })); s.position.z = 0.065; g.add(f, s); objs.web = g; }
  // ads: megaphone
  { const g = new Group(); const prof = [[0.12, -0.7], [0.2, -0.5], [0.34, -0.2], [0.92, 0.75], [1.0, 0.8], [0.98, 0.86]].map(([r, y]) => new Vector2(r, y));
    const m = new Mesh(new LatheGeometry(prof, 48), silver); m.rotation.z = -Math.PI / 2; m.position.x = -0.1; g.add(m);
    const h = new Mesh(new BoxGeometry(0.28, 0.6, 0.2), silver); h.position.set(-0.55, -0.45, 0); h.rotation.z = 0.25; g.add(h);
    [0.55, 0.85, 1.15].forEach((r, i) => { const t = new Mesh(new TorusGeometry(r, 0.025, 8, 40, Math.PI * 0.55), new MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 - i * 0.2 })); t.position.x = 0.95; t.rotation.z = -Math.PI * 0.275; g.add(t); });
    objs.ads = g; }
  // video: film reel + play
  { const g = new Group(); const sh = new Shape(); sh.absarc(0, 0, 0.95, 0, Math.PI * 2, false);
    for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; const p = new Path(); p.absarc(Math.cos(a) * 0.55, Math.sin(a) * 0.55, 0.2, 0, Math.PI * 2, true); sh.holes.push(p); }
    const hole = new Path(); hole.absarc(0, 0, 0.1, 0, Math.PI * 2, true); sh.holes.push(hole);
    const reel = new Mesh(new ExtrudeGeometry(sh, { depth: 0.22, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 1, curveSegments: 24 }), silver); reel.position.z = -0.11; g.add(reel); g.userData.spin = reel;
    const tri = new Shape(); tri.moveTo(-0.18, -0.26); tri.lineTo(0.3, 0); tri.lineTo(-0.18, 0.26); tri.closePath();
    const pl = new Mesh(new ExtrudeGeometry(tri, { depth: 0.06, bevelEnabled: false }), new MeshBasicMaterial({ color: 0xffffff })); pl.position.z = 0.16; g.add(pl);
    objs.video = g; }
  const objList = [objs.web, objs.ads, objs.video];
  const svcDeck = makeDeck(SERVICES.map((s, i) => { const o = objList[i]; o.position.set(1.3, 0.5, 0.7); o.scale.setScalar(0.5); return { tex: serviceTex(s), extra: o }; }), 2.2, 0.1, -18);

  // ---- layout / resize ----
  let W = 0, H = 0, deckX = 2.2;
  function resize() {
    const w = innerWidth, h = innerHeight; W = w; H = h;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, dprCap));
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    const halfW = Math.tan(MathUtils.degToRad(camera.fov / 2)) * 7 * camera.aspect; // at 7 units
    const halfH = Math.tan(MathUtils.degToRad(camera.fov / 2)) * 7;
    const sc = clamp(Math.min((halfW * 2 * 0.46) / CARD_W, (halfH * 2 * 0.62) / CARD_H), 0.6, 1.1);
    deckX = clamp(halfW - (CARD_W * sc) / 2 - 0.35, 1.2, 3);
    for (const d of [workDeck, svcDeck]) { d.root.position.x = deckX; d.root.scale.setScalar(sc); }
    const kx = clamp(halfW * 0.52, 1.6, 3); K1.position.x = kx; K2.position.x = -kx;
  }
  addEventListener('resize', resize); resize();

  // ---- input ----
  const mouse = new Vector2(0, 0), mouseS = new Vector2(0, 0);
  addEventListener('pointermove', (e) => { mouse.set((e.clientX / W) * 2 - 1, (e.clientY / H) * 2 - 1); hoverCheck(e); }, { passive: true });
  const ray = new Raycaster(); let hoverCard = null;
  function topCard() { const i = Math.round(clamp(workIdx, 0, PROJECTS.length - 1)); return workDeck.cards[i]; }
  function hoverCheck(e) {
    if (!workVisible) { if (hoverCard) { canvas.style.cursor = ''; hoverCard = null; } return; }
    ray.setFromCamera(new Vector2((e.clientX / W) * 2 - 1, -(e.clientY / H) * 2 + 1), camera);
    const c = topCard(); const hit = ray.intersectObject(c.userData.screen, false).length > 0;
    hoverCard = hit ? c : null; document.body.style.cursor = hit ? 'pointer' : '';
  }
  addEventListener('click', (e) => { if (hoverCard && !e.target.closest('a,button,nav')) window.open(hoverCard.userData.url, '_blank', 'noopener'); });

  // ---- nav ----
  const maxScroll = () => document.documentElement.scrollHeight - innerHeight;
  const goTo = (i) => scrollTo({ top: STOPS[i] * maxScroll(), behavior: REDUCED ? 'auto' : 'smooth' });
  $$('[data-go]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); goTo(+a.dataset.go); }));
  const navLinks = $$('.top nav a');
  const ruler = $('#ruler i'), chap = $('#chap');
  const stEls = $$('.st');
  const wTitle = $('#w-title'), wKind = $('#w-kind'), wDesc = $('#w-desc'), wLink = $('#w-link'), wDots = $('#w-dots');
  wDots.innerHTML = PROJECTS.map(() => '<i></i>').join('');
  let shownProj = -1;
  function setProject(i) { if (i === shownProj) return; shownProj = i; const p = PROJECTS[i]; wTitle.textContent = p.title; wKind.textContent = p.label; wDesc.textContent = p.blurb; wLink.href = p.url; wLink.setAttribute('aria-label', 'View ' + p.title + ' live'); $$('i', wDots).forEach((d, j) => d.classList.toggle('on', j === i)); }
  setProject(0);

  // ---- loop ----
  let prog = 0, workIdx = 0, svcIdx = 0, workVisible = false;
  let last = performance.now(), frames = 0, acc = 0, bad = 0;
  const clock0 = performance.now();
  const camTarget = new Vector3();
  let started = false;
  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    const t = (now - clock0) / 1000;
    const target = clamp(scrollY / Math.max(1, maxScroll()), 0, 1);
    prog += (target - prog) * (1 - Math.pow(0.0015, dt));
    mouseS.lerp(mouse, 1 - Math.pow(0.02, dt));

    const { z, u } = pathAt(prog);
    const swerve = Math.sin(u * Math.PI) * 1.3 * (prog < 0.5 ? 1 : -1);
    const sway = REDUCED ? 0 : Math.sin(t * 0.25) * 0.12;
    camera.position.set(swerve + sway + mouseS.x * 0.35, 0.25 - mouseS.y * 0.15 + Math.sin(u * Math.PI) * 0.3, z);
    camTarget.set(swerve * 0.3 + mouseS.x * 0.5, 0.1 - mouseS.y * 0.2, z - 10);
    camera.lookAt(camTarget);

    // ks
    const kt = REDUCED ? 0 : t;
    K1.rotation.set(mouseS.y * 0.12 + Math.sin(kt * 0.4) * 0.04, -0.18 + mouseS.x * 0.35 + Math.sin(kt * 0.3) * 0.08, 0);
    K1.position.y = 0.2 + (REDUCED ? 0 : Math.sin(kt * 0.7) * 0.07);
    K2.rotation.set(mouseS.y * 0.12, 0.18 + mouseS.x * 0.35 + Math.sin(kt * 0.3) * 0.08, 0);
    K2.position.y = 0.2 + (REDUCED ? 0 : Math.sin(kt * 0.7 + 1) * 0.07);

    svcIdx = clamp((prog - 0.2) / 0.22 * 2, 0, 2);
    workIdx = clamp((prog - 0.56) / 0.26 * 3, 0, 3);
    svcDeck.root.visible = prog > 0.06 && prog < 0.56; workDeck.root.visible = prog > 0.38 && prog < 0.9;
    svcDeck.layout(svcIdx, t); workDeck.layout(workIdx, t);
    K1.visible = prog < 0.3; K2.visible = prog > 0.8;
    objs.web.rotation.y = Math.sin(t * 0.8) * 0.35; objs.ads.rotation.y = Math.sin(t * 0.7) * 0.4; objs.ads.rotation.z = Math.sin(t * 0.9) * 0.05;
    if (objs.video.userData.spin) objs.video.userData.spin.rotation.z = -t * 0.8;
    objs.video.rotation.y = Math.sin(t * 0.7) * 0.35;
    dust.rotation.y = REDUCED ? 0 : t * 0.01;

    // overlay
    stEls.forEach((el, i) => {
      const [a, b, c, d] = FADES[i]; const o = trap(prog, a, b, c, d);
      el.style.opacity = o.toFixed(3); el.style.visibility = o < 0.01 ? 'hidden' : 'visible';
      el.style.transform = (i === 1 ? '' : 'translateY(-50%) ') + `translate3d(${((1 - o) * -24).toFixed(1)}px,0,0)`;
      if (i === 3) el.style.transform = `translateY(-50%) translate3d(${((1 - o) * 24).toFixed(1)}px,0,0)`;
    });
    workVisible = trap(prog, ...FADES[2]) > 0.5;
    setProject(Math.round(clamp(workIdx, 0, PROJECTS.length - 1)));
    const near = STOPS.reduce((bi, s, i) => (Math.abs(prog - s) < Math.abs(prog - STOPS[bi]) ? i : bi), 0);
    navLinks.forEach((a, i) => a.classList.toggle('on', [0, 1, 2, 3][i] === near));

    ruler.style.transform = `scaleX(${prog.toFixed(4)})`; chap.textContent = ['01 / HOME', '02 / SERVICES', '03 / WORK', '04 / CONTACT'][near];
    renderer.render(scene, camera);
    if (!started) { started = true; $('#loader').classList.add('gone'); }
    // governor
    frames++; acc += dt;
    if (frames >= 80) {
      const avg = acc / frames; frames = 0; acc = 0;
      if (avg > 0.03 && dprCap > 0.8) { dprCap = dprCap > 1.2 ? 1 : 0.75; resize(); }
      else if (avg > 0.05 && !FORCE) { if (++bad > 2) showNotice('#fail'); }
    }
  }
  requestAnimationFrame(frame);
  window.__k3d = { get prog() { return prog; }, setProg: (p) => { prog = p; } };
}

const small = innerWidth < 900 || matchMedia('(pointer: coarse)').matches;
if (small && !FORCE) {
  document.body.classList.add('nogl');
  $('#notice').hidden = false; $('#loader').classList.add('gone');
  $('#enter').addEventListener('click', () => { $('#notice').hidden = true; document.body.classList.remove('nogl'); $('#loader').classList.remove('gone'); start().catch(() => showNotice('#fail')); });
} else start().catch((e) => { console.error(e); showNotice('#fail'); });
