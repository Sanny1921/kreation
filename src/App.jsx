import { lazy, Suspense } from 'react';
import { Router, useRoute } from './lib/router.jsx';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import SceneHost from './components/SceneHost.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import Home from './pages/Home.jsx';

const Work = lazy(() => import('./pages/Work.jsx'));
const Privacy = lazy(() => import('./pages/Privacy.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));
const Services = lazy(() => import('./pages/Services.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));

function Skeleton() {
  return (
    <div className="wrap page-skel" aria-hidden="true">
      <div className="sk sk-l" />
      <div className="sk sk-h" />
      <div className="sk sk-b" />
      <div className="sk sk-b" />
    </div>
  );
}

function Pages() {
  const { path } = useRoute();
  const Page = { '/': Home, '/work': Work, '/services': Services, '/contact': Contact, '/privacy': Privacy }[path] || NotFound;
  return (
    <main key={path} className="page" data-route={path}>
      <ErrorBoundary>
        <Suspense fallback={<Skeleton />}>
          <Page />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}

export default function App() {
  return (
    <Router>
      <ErrorBoundary silent>
        <SceneHost />
      </ErrorBoundary>
      <div className="shade" aria-hidden="true" />
      <Nav />
      <Pages />
      <Footer />
    </Router>
  );
}
