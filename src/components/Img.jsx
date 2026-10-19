import { useState } from 'react';

// Reserves space with width/height (no layout shift), shows a skeleton until loaded, fails gracefully.
export default function Img({ src, alt, width, height, className = '', eager = false, srcSet, sizes, blend, wideSrc }) {
  const [state, setState] = useState('loading');
  return (
    <span className={`img ${state} ${className}`} style={{ aspectRatio: `${width} / ${height}` }}>
      {state !== 'error' && (
        <picture>
          {wideSrc && <source media="(min-width:700px)" srcSet={wideSrc} />}
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          loading={eager ? 'eager' : 'lazy'}
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
