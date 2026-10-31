import { createContext, useContext, useEffect, useState, useCallback, forwardRef } from 'react';

const Ctx = createContext({ path: '/', go: () => {} });
const TITLES = {
  '/': 'KREATION',
  '/work': 'Work | KREATION',
  '/services': 'Services | KREATION',
  '/contact': 'Contact | KREATION',
  '/privacy': 'Privacy | KREATION'
};
const DESCS = {
  '/': 'KREATION is a web development agency in India. Fast, mobile-first websites and web apps for businesses.',
  '/work': "Explore KREATION's work: the Valor Cup live platform, Prashant Pizza and Mething Media redesign concepts, and a Zynex store build.",
  '/services': 'Websites, web apps and 3D from KREATION. Start with a fast mobile-first website.',
  '/contact': 'Contact KREATION on WhatsApp or by email. WhatsApp is the fastest way to reach us.',
  '/privacy': 'How KREATION treats your information: what this site collects, and what it never touches.'
};
const NOTFOUND_TITLE = 'Page not found | KREATION';
const NOTFOUND_DESC = 'This page does not exist on the KREATION site. Open the home page, our work, or contact us.';

const split = (p) => {
  const [base, hash] = (p || '/').split('#');
  const b = base.replace(/\/+$/, '') || '/';
  return [TITLES[b] ? b : null, hash || ''];
};
const clean = (p) => split(p)[0];

export function Router({ children }) {
  const [path, setPath] = useState(() => clean(location.pathname) || '404');
  useEffect(() => {
    const onPop = () => setPath(clean(location.pathname) || '404');
    addEventListener('popstate', onPop);
    return () => removeEventListener('popstate', onPop);
  }, []);
  useEffect(() => {
    document.title = path === '404' ? NOTFOUND_TITLE : TITLES[path];
    const m = document.querySelector('meta[name=description]');
    if (m) m.setAttribute('content', path === '404' ? NOTFOUND_DESC : DESCS[path]);
  }, [path]);
  const go = useCallback((to) => {
    const [t, hash] = split(to);
    const target = t || '/';
    const same = target === (clean(location.pathname) || '404');
    if (same) {
      if (hash) {
        const el = document.getElementById(hash);
        if (el) {
          history.replaceState({}, '', target + '#' + hash);
          el.scrollIntoView({ block: 'start' });
          return;
        }
      }
      scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    history.pushState({}, '', target + (hash ? '#' + hash : ''));
    setPath(target);
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ block: 'start' });
        else scrollTo(0, 0);
      }, 80);
    } else {
      scrollTo(0, 0);
    }
  }, []);
  return <Ctx.Provider value={{ path, go }}>{children}</Ctx.Provider>;
}
export const useRoute = () => useContext(Ctx);

export const Link = forwardRef(function Link({ to, children, className, onClick, ...rest }, ref) {
  const { go, path } = useRoute();
  const base = (to || '').split('#')[0];
  return (
    <a
      ref={ref}
      href={to}
      className={className}
      aria-current={path === base ? 'page' : undefined}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        onClick && onClick(e);
        go(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
});
