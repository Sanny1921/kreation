import { useEffect, useRef, useState } from 'react';
import { getTier, setTier, subscribeTier } from '../lib/perf.js';

// Mounts the single fixed WebGL canvas after first paint. Any failure silently leaves the CSS poster.
export default function SceneHost() {
  const ref = useRef(null);
  const [tier, setT] = useState(getTier());
  const [ready, setReady] = useState(false);
  useEffect(() => subscribeTier(setT), []);

  useEffect(() => {
    document.documentElement.dataset.scene = ready ? 'on' : 'off';
  }, [ready]);

  useEffect(() => {
    if (tier === 'lite') return;
    let scene = null;
    let cancelled = false;
    const start = async () => {
      try {
        const mod = await import('../three/scene.js');
        if (cancelled || !ref.current) return;
        scene = await mod.createScene(ref.current, {
          tier,
          onReady: () => !cancelled && setReady(true),
          onFail: () => {
            if (cancelled) return;
            setReady(false);
            setTier('lite');
          }
        });
      } catch (e) {
        try {
          console.warn('[kreation] 3D unavailable', e && e.message);
        } catch {}
        if (!cancelled) {
          setReady(false);
          setTier('lite');
        }
      }
    };
    const idle = window.requestIdleCallback || ((f) => setTimeout(f, 350));
    const h = idle(start, { timeout: 1500 });
    return () => {
      cancelled = true;
      (window.cancelIdleCallback || clearTimeout)(h);
      if (scene) scene.dispose();
      setReady(false);
    };
  }, [tier]);

  if (tier === 'lite') return null;
  return <canvas ref={ref} className={`scene ${ready ? 'ready' : ''}`} aria-hidden="true" />;
}
