import { useRef } from 'react';
import { m, useScroll, useSpring, useTransform, useMotionValue, useReducedMotion } from 'framer-motion';

// 3D card: scroll-driven tilt + pointer tilt, spring-smoothed by Framer Motion.
// Framer measures and updates transforms in its own rAF loop, so scrolling no
// longer forces a getBoundingClientRect() pass over every card per frame.
const cache = new Map();
function motionTag(Tag) {
  if (!cache.has(Tag)) cache.set(Tag, typeof Tag === 'string' ? m[Tag] : m.create(Tag));
  return cache.get(Tag);
}

export default function Card3D({ children, as: Tag = 'div', className = '', ...rest }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  // 0 when the card finishes entering at the bottom, 1 when its top reaches the viewport top.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['end end', 'start start'] });
  const scrollTilt = useSpring(useTransform(scrollYProgress, [0, 1], [4.5, -4.5]), { stiffness: 160, damping: 24, mass: 0.7 });
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spx = useSpring(px, { stiffness: 220, damping: 18 });
  const spy = useSpring(py, { stiffness: 220, damping: 18 });
  const rotateX = useTransform([scrollTilt, spy], (v) => v[0] + v[1]);
  const move = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width - 0.5) * 14);
    py.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
  };
  const leave = () => {
    px.set(0);
    py.set(0);
  };
  const M = motionTag(Tag);
  return (
    <M
      ref={ref}
      className={`c3d ${className}`}
      onPointerMove={move}
      onPointerLeave={leave}
      onPointerUp={leave}
      style={reduce ? undefined : { rotateX, rotateY: spx, transformPerspective: 900 }}
      {...rest}
    >
      {children}
    </M>
  );
}
