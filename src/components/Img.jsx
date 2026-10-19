import { useEffect, useRef, useState } from 'react';

// Reserves space with width/height (no layout shift), shows a skeleton until loaded, fails gracefully.
export default function Img({ src, alt, width, height, className = '', eager = false, srcSet, sizes, blend, wideSrc }) {
  const [state, setState] = useState('loading');
  const [near, setNear] = useState(eager || typeof IntersectionObserver === 'undefined');
  const box = useRef(null);
  // Download only when the image is about 600px from the screen, so it is ready before it scrolls in.
  useEffect(() => {
    if (near || !box.current) return;
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setNear(true); io.disconnect(); } }, { rootMargin: '600px 0px' });
    io.observe(box.current);
    return () => io.disconnect();
  }, [near]);
  return (
    <span ref={box} className={`img ${state} ${className}`} style={{ aspectRatio: `${width} / ${height}` }}>
      {near && state !== 'error' && (
        <picture>
          {wideSrc && <source media="(min-width:700px)" srcSet={wideSrc} />}
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          loading="eager"
          decoding="async"
          fetchpriority={eager ? 'high' : 'auto'}
          
          onLoad={() => setState('ok')}
          onError={() => setState('error')}
        />
        </picture>
      )}
      {state === 'error' && <span className="img-err">Preview unavailable</span>}
    </span>
  );
}
