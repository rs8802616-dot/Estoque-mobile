import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// Limpa caches antigos do Service Worker (v1..v6) para garantir que o layout e bundles mais recentes sejam sempre exibidos
if (typeof window !== 'undefined') {
  if ('caches' in window) {
    caches.keys().then((names) => {
      names.forEach((name) => {
        if (name !== 'estoque-mobile-pwa-v33') {
          caches.delete(name).catch(() => {});
        }
      });
    }).catch(() => {});
  }
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((reg) => {
        reg.update().catch(() => {});
      });
    }).catch(() => {});
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
