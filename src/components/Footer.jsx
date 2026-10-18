import { Link } from '../lib/router.jsx';
import { EMAIL, getTier, setTier } from '../lib/perf.js';
import { useState } from 'react';

export default function Footer() {
  const [lite, setLite] = useState(getTier() === 'lite');
  return (
    <footer className="foot">
      <div className="wrap foot-grid">
        <div>
          <p className="brand-t">KREATION</p>
          <p className="muted small">Web development, ads and video editing. Based in Patna, India.</p>
        </div>
        <div className="foot-links">
          <Link to="/work">Work</Link>
          <Link to="/services">Services</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="foot-links">
          <a href="https://wa.me/919288508305" target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
          <a href={`mailto:${EMAIL}`}>Email</a>
          <a href="https://github.com/Sanny1921" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </div>
      </div>
      <div className="wrap foot-bar">
        <span className="muted small">&copy; 2026 KREATION</span>
        <button
          className="lite-toggle"
          aria-pressed={lite}
          onClick={() => {
            const next = !lite;
            setLite(next);
            setTier(next ? 'lite' : 'high', true);
            if (!next) location.reload();
          }}
        >
          {lite ? 'Lite mode: on' : 'Lite mode: off'}
        </button>
      </div>
    </footer>
  );
}
