/* BEC · service worker de avisos (sin caché: la página siempre carga la versión más nueva) */
self.addEventListener('install',function(){self.skipWaiting()});
self.addEventListener('activate',function(e){e.waitUntil(self.clients.claim())});

/* Aviso que llega desde el servidor (Web Push), incluso con el celular bloqueado */
self.addEventListener('push',function(e){
  var d={};
  try{d=e.data?e.data.json():{}}catch(x){d={body:e.data?e.data.text():''}}
  e.waitUntil(self.registration.showNotification(d.title||'BEC',{
    body:d.body||'Tienes un aviso nuevo',
    icon:d.icon||'icon-192.png',
    badge:'badge-96.png',
    tag:d.tag||('bec-'+Date.now()),
    renotify:false,
    vibrate:[120,60,120],
    timestamp:Date.now(),
    lang:'es',
    data:{url:d.url||'./'}
  }));
});

/* Al tocar el aviso se abre BEC */
self.addEventListener('notificationclick',function(e){
  e.notification.close();
  var url=new URL((e.notification.data&&e.notification.data.url)||'./',self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(function(l){
    for(var i=0;i<l.length;i++){if('focus' in l[i])return l[i].focus()}
    return self.clients.openWindow(url);
  }));
});
