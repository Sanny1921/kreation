import { createContext, useContext, useEffect, useState, useCallback, forwardRef } from 'react';

const Ctx = createContext({ path: '/', go: () => {} });
const TITLES = {
  '/': 'KREATION',
  '/work': 'Work | KREATION',
  '/services': 'Services | KREATION',
  '/contact': 'Contact | KREATION'
};
const DESCS = {
  '/': 'KREATION is a small web development agency in India. Fast, mobile-first websites and web apps for businesses.',
  '/work': 'Live projects by KREATION: Valor Cup, VANTA, CutBrief and a Prashant Pizza redesign concept. Every link opens a working site.',
  '/services': 'Websites, web apps and 3D from KREATION. Start with a fast mobile-first website.',
  '/contact': 'Contact KREATION on WhatsApp +91 92885 08305 or by email. WhatsApp is the fastest way to reach us.'
};
const clean = (p) => {
  const x = (p || '/').replace(/\/+$/, '') || '/';
  return TITLES[x] ? x : '/';
};

export function Router({ children }) {
  const [path, setPath] = useState(() => {
    const c = clean(location.pathname);
    if (c !== (location.pathname.replace(/\/+$/, '') || '/')) history.replaceState({}, '', c);
    return c;
  });
  useEffect(() => {
    const onPop = () => setPath(clean(location.pathname));
    addEventListener('popstate', onPop);
    return () => removeEventListener('popstate', onPop);
  }, []);
  useEffect(() => {
    document.title = "KREATION";
    const m = document.querySelector('meta[name=description]');
    if (m) m.setAttribute('content', DESCS[path]);
  }, [path]);
  const go = useCallback((to) => {
    const t = clean(to);
    if (t === clean(location.pathname)) {
      scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    history.pushState({}, '', t);
    setPath(t);
    scrollTo(0, 0);
  }, []);
  return <Ctx.Provider value={{ path, go }}>{children}</Ctx.Provider>;
}
export const useRoute = () => useContext(Ctx);

export const Link = forwardRef(function Link({ to, children, className, onClick, ...rest }, ref) {
  const { go, path } = useRoute();
  return (
    <a
      ref={ref}
      href={to}
      className={className}
      aria-current={path === to ? 'page' : undefined}
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
