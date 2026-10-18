import { Link } from '../lib/router.jsx';
import Img from './Img.jsx';

const ITEMS = [
  ['/', 'Home', <path key="h" d="M3 11.5 12 4l9 7.5M5.5 10v9.5h4.5v-5h4v5h4.5V10" />],
  ['/work', 'Work', <path key="w" d="M4 6h16v12H4zM4 10h16M9 6V4h6v2" />],
  ['/services', 'Services', <path key="s" d="M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12 4 7.5" />],
  ['/contact', 'Contact', <path key="c" d="M4 5h16v11H9l-5 4zM8 10h8M8 13h5" />]
];

export default function Nav() {
  return (
    <>
      <header className="top">
        <Link to="/" className="brand" aria-label="KREATION home">
          <Img src="/img/wordmark-sm.webp" alt="KREATION" width={420} height={140} eager blend />
        </Link>
        <nav className="dnav" aria-label="Main">
          {ITEMS.map(([to, label]) => (
            <Link key={to} to={to}>
              {label}
            </Link>
          ))}
        </nav>
        <a className="btn btn-sm top-cta" href="https://wa.me/919288508305" target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>
      </header>
      <nav className="tabbar" aria-label="Main">
        {ITEMS.map(([to, label, icon]) => (
          <Link key={to} to={to} className="tab">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {icon}
            </svg>
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
