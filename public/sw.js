// Service Worker para Estoque Mobile Multi-Supermercado
// Permite funcionamento 100% offline mesmo ao recarregar a página (F5 ou abrir app sem conexão)

const CACHE_NAME = 'estoque-mobile-pwa-v189';

const ASSETS_PARA_CACHE_INICIAL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/pdf.worker.min.js',
  '/som_novo_pedido.mp3',
];

// Instalação do Service Worker: pré-armazena o shell da aplicação e ativa imediatamente
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        await cache.addAll(ASSETS_PARA_CACHE_INICIAL);
      } catch (err) {
        console.warn('Aviso ao pré-carregar assets no cache offline:', err);
      }
    })
  );
});

// Ativação: remove IMEDIATAMENTE todos os caches antigos (v44, v45, etc.) e assume controle
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.info('[SW] Removendo cache legado expirado:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptação de requisições:
// 1. Requisições de navegação e bundles JS/CSS: Network-first com fallback para cache offline
// 2. Imagens e fontes: Stale-While-Revalidate
// 3. APIs externas ou Firebase: Pass-through de rede
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Ignorar métodos que não sejam GET
  if (request.method !== 'GET') {
    return;
  }

  // Ignorar requisições de outros domínios (fotos S3/CDN sem CORS, Firebase, etc.) para não bloquear <img> externas
  if (url.origin !== self.location.origin) {
    return;
  }

  // Ignorar chamadas de APIs locais, Firebase Auth/Firestore e Focus NFe (nunca cachear)
  if (
    url.pathname.startsWith('/api/') ||
    url.hostname.includes('firestore.googleapis.com') ||
    url.hostname.includes('firebase.googleapis.com') ||
    url.hostname.includes('identitytoolkit.googleapis.com') ||
    url.hostname.includes('securetoken.googleapis.com') ||
    url.hostname.includes('focusnfe.com.br')
  ) {
    return;
  }

  // 1. Requisições de Navegação (HTML) e Bundles JS/CSS (/assets/) -> SEMPRE Network-First
  if (
    request.mode === 'navigate' ||
    request.destination === 'document' ||
    request.destination === 'script' ||
    request.destination === 'style' ||
    url.pathname.startsWith('/assets/')
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          if (request.mode === 'navigate' || request.destination === 'document') {
            const indexResponse = (await caches.match('/index.html')) || (await caches.match('/'));
            if (indexResponse) {
              return indexResponse;
            }
            return new Response(
              '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Estoque Mobile</title></head><body><div id="root"></div></body></html>',
              { headers: { 'Content-Type': 'text/html' } }
            );
          }
          return new Response('', { status: 503, statusText: 'Offline' });
        })
    );
    return;
  }

  // 2. Demais Recursos Estáticos (Fontes, Imagens)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (networkResponse.type === 'basic' || networkResponse.type === 'cors')
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
