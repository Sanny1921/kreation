// Device tier detection. 'high' | 'mid' | 'lite'. Lite = no WebGL, CSS-only motion.
const KEY = 'kreation-lite';
const listeners = new Set();
let tier = null;

function webglOk() {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return false;
    const ext = gl.getExtension('WEBGL_lose_context');
    if (ext) ext.loseContext();
    return true;
  } catch {
    return false;
  }
}

function detect() {
  const params = new URLSearchParams(location.search);
  const forced = params.get('tier');
  if (forced === 'high' || forced === 'mid' || forced === 'lite') return forced;
  try {
    if (localStorage.getItem(KEY) === '1') return 'lite';
  } catch {}
  const nav = navigator;
  const c = nav.connection || {};
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return 'lite';
  if (c.saveData || /(^|slow-)2g|3g/.test(c.effectiveType || '')) return 'lite';
  if (nav.deviceMemory && nav.deviceMemory <= 2) return 'lite';
  if (nav.hardwareConcurrency && nav.hardwareConcurrency <= 2) return 'lite';
  if (!webglOk()) return 'lite';
  if ((nav.deviceMemory && nav.deviceMemory <= 4) || (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4)) return 'mid';
  return 'high';
}

export function getTier() {
  if (!tier) tier = detect();
  return tier;
}
export function setTier(t, persist = false) {
  tier = t;
  if (persist) {
    try {
      if (t === 'lite') localStorage.setItem(KEY, '1');
      else localStorage.removeItem(KEY);
    } catch {}
  }
  listeners.forEach((f) => f(tier));
}
export function subscribeTier(f) {
  listeners.add(f);
  return () => listeners.delete(f);
}
export const WA_NUMBER = '919288508305';
export const EMAIL = 'sunnykrtiwari192114@gmail.com';
export function waLink(text) {
  return `https://wa.me/${WA_NUMBER}` + (text ? `?text=${encodeURIComponent(text)}` : '');
}
