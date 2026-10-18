import { createContext, useContext, useEffect, useState, useCallback, forwardRef } from 'react';

const Ctx = createContext({ path: '/', go: () => {} });
const TITLES = {
  '/': 'KREATION | Web development, ads and video editing',
  '/work': 'Work | KREATION',
  '/services': 'Services | KREATION',
  '/contact': 'Contact | KREATION'
};
const clean = (p) => {
  const x = (p || '/').replace(/\/+$/, '') || '/';
  return TITLES[x] ? x : '/';
};

export function Router({ children }) {
  const [path, setPath] = useState(() => clean(location.pathname));
  useEffect(() => {
    const onPop = () => setPath(clean(location.pathname));
    addEventListener('popstate', onPop);
    return () => removeEventListener('popstate', onPop);
  }, []);
  useEffect(() => {
    document.title = TITLES[path];
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
