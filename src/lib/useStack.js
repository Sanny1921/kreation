import { useEffect } from 'react';

// Stacking cards: each .stk sticks near the top; the card underneath shrinks and dims as the next one covers it.
export default function useStack(ref) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    let items = [...root.querySelectorAll('.stk')];
    let raf = 0;
    const tick = () => {
      raf = 0;
      items = [...root.querySelectorAll('.stk')];
      for (let i = 0; i < items.length - 1; i++) {
        const a = items[i];
        const inner = a.firstElementChild;
        if (!inner) continue;
        const ar = a.getBoundingClientRect();
        const nr = items[i + 1].getBoundingClientRect();
        const topA = parseFloat(getComputedStyle(a).top) || 0;
        // d: 0 when next card is far below, 1 when it has fully covered this card's pinned position
        const gap = nr.top - topA - 14;
        const span = Math.max(240, ar.height * 0.9);
        const d = Math.min(1, Math.max(0, 1 - gap / span));
        const pinned = ar.top <= topA + 1 ? 1 : 0;
        const v = pinned ? d : 0;
        const s = (1 - v * 0.06).toFixed(4);
        const k = v.toFixed(3);
        if (inner.dataset.k !== k) {
          inner.dataset.k = k;
          inner.style.setProperty('--s', s);
          inner.style.setProperty('--dim', (v * 0.55).toFixed(3));
        }
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    tick();
    return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf); };
  });
}
