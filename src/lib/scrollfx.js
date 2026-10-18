// One shared scroll driver. Cards register; only visible ones get a --sp (0..1) var per frame.
const visible = new Set();
let io = null;
let ticking = false;

function update() {
  ticking = false;
  const vh = innerHeight;
  const rects = [];
  visible.forEach((el) => rects.push([el, el.getBoundingClientRect()]));
  for (const [el, r] of rects) {
    const p = Math.min(1, Math.max(0, (r.top + r.height / 2) / vh));
    el.style.setProperty('--sp', p.toFixed(3));
  }
}
function onScroll() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(update);
  }
}
export function observeScroll(el) {
  if (!('IntersectionObserver' in window)) return () => {};
  if (!io) {
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.isIntersecting ? visible.add(e.target) : visible.delete(e.target);
        onScroll();
      },
      { rootMargin: '10% 0px' }
    );
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll, { passive: true });
  }
  io.observe(el);
  return () => {
    io.unobserve(el);
    visible.delete(el);
  };
}
