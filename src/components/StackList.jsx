import { Children, useRef } from 'react';
import { m, useScroll, useSpring, useTransform, useReducedMotion } from 'framer-motion';

// Stacking cards: each .stk sticks near the top; the card underneath shrinks and
// dims as the next one covers it. Framer Motion scroll progress + springs replace
// the old per-frame measurement loop.
function StackItem({ i, last, selfRef, nextRef, children }) {
  const reduce = useReducedMotion();
  const active = !last && !reduce;
  // Progress of the NEXT card travelling from the viewport bottom to near the pin point.
  const { scrollYProgress } = useScroll({ target: active ? nextRef : selfRef, offset: ['start end', 'start 0.12'] });
  const sp = useSpring(scrollYProgress, { stiffness: 170, damping: 26, mass: 0.7 });
  const scale = useTransform(sp, [0, 1], [1, 0.94]);
  const dim = useTransform(sp, [0, 1], [0, 0.55]);
  return (
    <div className="stk" ref={selfRef} style={{ '--i': i }}>
      <m.div className="stk-in" style={active ? { scale } : undefined}>
        {children}
        {active && <m.div className="stk-dim" aria-hidden="true" style={{ opacity: dim }} />}
      </m.div>
    </div>
  );
}

export default function StackList({ as: Tag = 'div', className = '', children }) {
  const items = Children.toArray(children);
  const refs = useRef(null);
  if (!refs.current || refs.current.length !== items.length) {
    refs.current = items.map(() => ({ current: null }));
  }
  return (
    <Tag className={className}>
      {items.map((child, i) => (
        <StackItem key={child.key ?? i} i={i} last={i === items.length - 1} selfRef={refs.current[i]} nextRef={refs.current[i + 1]}>
          {child}
        </StackItem>
      ))}
    </Tag>
  );
}
