import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Team photo stack: with 2+ members it is a draggable/tappable deck that cycles real members;
// with a single member it is one static card (no animation). Name + role below the card
// always follow the member on top.
export default function PhotoStack({ members, onFrontChange }) {
  const [order, setOrder] = useState(members.map((_, i) => i));
  const reduce = useReducedMotion();
  const multi = members.length > 1;
  const cycle = () => {
    if (!multi) return;
    setOrder((o) => {
      const next = [...o.slice(1), o[0]];
      onFrontChange?.(members[next[0]]);
      return next;
    });
  };
  const visible = multi ? order : [0];
  const front = members[visible[0]];
  return (
    <div className="pstack-wrap">
      <div className="pstack">
        {visible.map((mi, pos) => {
          const m = members[mi];
          const isFront = pos === 0;
          const interactive = multi && isFront;
          return (
            <motion.div
              key={m.id}
              className="pstack-card"
              style={{ zIndex: visible.length - pos }}
              initial={false}
              animate={{
                x: pos * 16,
                y: pos * 12,
                scale: 1 - pos * 0.05,
                opacity: pos > 2 ? 0 : 1,
                filter: `brightness(${1 - pos * 0.16})`,
              }}
              transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 26 }}
              drag={interactive && !reduce}
              dragSnapToOrigin
              onDragEnd={interactive ? (e, info) => { if (Math.hypot(info.offset.x, info.offset.y) > 60) cycle(); } : undefined}
              onClick={interactive ? cycle : undefined}
              onKeyDown={interactive ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cycle(); } } : undefined}
              role={interactive ? 'button' : undefined}
              tabIndex={interactive ? 0 : -1}
              aria-label={interactive ? `Photo of ${m.name}. Activate to see the next team member.` : undefined}
              aria-hidden={isFront ? undefined : true}
            >
              <img src={m.src} srcSet={m.srcSet} sizes={m.sizes} alt={isFront ? m.name : ''} width={m.width} height={m.height} draggable="false" loading="lazy" decoding="async" />
            </motion.div>
          );
        })}
      </div>
      <h3>{front.name}</h3>
      <p className="role">{front.role}</p>
    </div>
  );
}
