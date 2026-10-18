import { createRoot } from 'react-dom/client';
import '@fontsource-variable/jost/wght.css';
import './styles.css';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

document.documentElement.classList.add('js');
createRoot(document.getElementById('root')).render(
  <ErrorBoundary fullPage>
    <App />
  </ErrorBoundary>
);
