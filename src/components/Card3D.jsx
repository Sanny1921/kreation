import { useEffect, useRef } from 'react';
import { observeScroll } from '../lib/scrollfx.js';

// 3D card: scroll-driven tilt on phones (via --sp), pointer tilt on mouse/touch-drag. Transform-only.
export default function Card3D({ children, as: Tag = 'div', className = '', ...rest }) {
  const ref = useRef(null);
  useEffect(() => observeScroll(ref.current), []);
  const move = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--ry', `${(x * 14).toFixed(2)}deg`);
    el.style.setProperty('--rx', `${(-y * 10).toFixed(2)}deg`);
  };
  const leave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--rx', '0deg');
  };
  return (
    <Tag ref={ref} className={`c3d ${className}`} onPointerMove={move} onPointerLeave={leave} onPointerUp={leave} {...rest}>
      {children}
    </Tag>
  );
}
