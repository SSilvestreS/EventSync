// Service Worker para EventSync - Notificações Push e Cache

const CACHE_NAME = 'eventsync-v1.3';
const STATIC_CACHE = 'eventsync-static-v1.3';
const DYNAMIC_CACHE = 'eventsync-dynamic-v1.3';

// Arquivos estáticos para cache
const STATIC_FILES = [
  '/',
  '/offline',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/badge-72x72.png',
  '/manifest.json'
];

// Instalar service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker instalado');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Cache estático aberto');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Arquivos estáticos em cache');
        return self.skipWaiting();
      })
  );
});

// Ativar service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker ativado');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Removendo cache antigo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Cache limpo');
        return self.clients.claim();
      })
  );
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Estratégia de cache para arquivos estáticos
  if (request.method === 'GET' && isStaticFile(url.pathname)) {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(request)
            .then((response) => {
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(DYNAMIC_CACHE)
                  .then((cache) => {
                    cache.put(request, responseClone);
                  });
              }
              return response;
            });
        })
    );
    return;
  }

  // Estratégia network-first para APIs
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // Estratégia network-first para outras requisições
  event.respondWith(
    fetch(request)
      .catch(() => {
        if (request.destination === 'document') {
          return caches.match('/offline');
        }
      })
  );
});

// Receber mensagens push
self.addEventListener('push', (event) => {
  console.log('Mensagem push recebida:', event);
  
  if (!event.data) {
    console.log('Mensagem push sem dados');
    return;
  }

  try {
    const data = event.data.json();
    const options = {
      body: data.body || 'Nova notificação do EventSync',
      icon: data.icon || '/icon-192x192.png',
      badge: data.badge || '/badge-72x72.png',
      data: data.data || {},
      actions: data.actions || [],
      requireInteraction: data.requireInteraction || false,
      tag: data.tag || 'eventsync-notification',
      renotify: data.renotify || true,
      silent: data.silent || false,
      vibrate: data.vibrate || [200, 100, 200],
      timestamp: data.timestamp || Date.now()
    };

    // Mostrar notificação
    event.waitUntil(
      self.registration.showNotification(data.title || 'EventSync', options)
    );

  } catch (error) {
    console.error('Erro ao processar mensagem push:', error);
    
    // Notificação de fallback
    event.waitUntil(
      self.registration.showNotification('EventSync', {
        body: 'Nova notificação recebida',
        icon: '/icon-192x192.png'
      })
    );
  }
});

// Clique na notificação
self.addEventListener('notificationclick', (event) => {
  console.log('Notificação clicada:', event);
  
  event.notification.close();

  const data = event.notification.data;
  
  if (data && data.eventId) {
    // Abrir página do evento
    event.waitUntil(
      clients.openWindow(`/events/${data.eventId}`)
    );
  } else if (data && data.actionUrl) {
    // Abrir URL específica
    event.waitUntil(
      clients.openWindow(data.actionUrl)
    );
  } else {
    // Abrir página principal
    event.waitUntil(
      clients.openWindow('/')
    );
  }
}

// Fechar notificação
self.addEventListener('notificationclose', (event) => {
  console.log('Notificação fechada:', event);
  
  // Aqui você pode enviar analytics sobre notificações fechadas
  const data = event.notification.data;
  if (data && data.eventId) {
    // Enviar evento de analytics
    sendAnalytics('notification_closed', {
      eventId: data.eventId,
      type: data.type,
      timestamp: Date.now()
    });
  }
});

// Receber mensagens do cliente
self.addEventListener('message', (event) => {
  console.log('Mensagem recebida do cliente:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Funções auxiliares
function isStaticFile(pathname) {
  return STATIC_FILES.includes(pathname) ||
         pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/);
}

function sendAnalytics(event, data) {
  // Enviar dados de analytics para o servidor
  fetch('/api/analytics', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      event,
      data,
      source: 'service-worker',
      timestamp: Date.now()
    })
  }).catch(error => {
    console.error('Erro ao enviar analytics:', error);
  });
}

// Sincronização em background
self.addEventListener('sync', (event) => {
  console.log('Sincronização em background:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      performBackgroundSync()
    );
  }
});

async function performBackgroundSync() {
  try {
    // Sincronizar dados offline
    console.log('Executando sincronização em background');
    
    // Aqui você pode implementar lógica de sincronização
    // Por exemplo, enviar dados offline, sincronizar cache, etc.
    
  } catch (error) {
    console.error('Erro na sincronização em background:', error);
  }
}

// Interceptar erros
self.addEventListener('error', (event) => {
  console.error('Erro no Service Worker:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Promise rejeitada não tratada:', event.reason);
});
