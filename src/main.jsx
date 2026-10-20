import { createRoot } from 'react-dom/client';
import '@fontsource-variable/jost/wght.css';
import './styles.css';
import { inject as injectAnalytics } from '@vercel/analytics';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

injectAnalytics();
document.documentElement.classList.add('js');
if (!window.__d3) createRoot(document.getElementById('root')).render(
  <ErrorBoundary fullPage>
    <App />
  </ErrorBoundary>
);
