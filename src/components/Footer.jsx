import { Link } from '../lib/router.jsx';
import { EMAIL } from '../lib/perf.js';

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot-grid">
        <div>
          <p className="brand-t">KREATION</p>
          <p className="muted small">Web development for businesses. Based in India.</p>
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
      <div className="wrap made">
        <span>Made by</span>
        <img src="/img/wordmark-sm.webp" alt="KREATION" width="138" height="46" loading="lazy" decoding="async" />
        <span className="heart" aria-hidden="true">&#9829;</span>
      </div>
      <div className="wrap foot-bar">
        <span className="muted small">&copy; 2026 KREATION</span>
      </div>
    </footer>
  );
}
