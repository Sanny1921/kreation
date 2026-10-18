import { useEffect, useState } from 'react';
import { getTier, subscribeTier } from '../lib/perf.js';

// CSS poster of the K. Always visible first (LCP), moves with transform only. The WebGL K fades in over it.
export default function KPoster() {
  const [tier, setT] = useState(getTier());
  useEffect(() => subscribeTier(setT), []);
  return (
    <div className={`kposter ${tier === 'lite' ? 'lite' : ''}`} aria-hidden="true">
      <img
        src="/img/k-poster-sm.webp"
        srcSet="/img/k-poster-sm.webp 420w, /img/k-poster.webp 900w"
        sizes="(max-width:700px) 60vw, 420px"
        width="420"
        height="466"
        alt=""
        decoding="async"
        fetchpriority="high"
      />
    </div>
  );
}
