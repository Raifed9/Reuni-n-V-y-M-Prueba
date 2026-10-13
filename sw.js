const C="vym-v1",SHELL=["./","index.html","datos.json","manifest.webmanifest","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!="GET")return;
  const u=new URL(r.url);
  if(/firestore\.googleapis\.com|identitytoolkit|securetoken|firebaseinstallations/.test(u.hostname))return;
  const key=u.origin==location.origin?u.origin+u.pathname:r;
  e.respondWith(fetch(r).then(res=>{if(res&&(res.ok||res.type=="opaque")){const cp=res.clone();caches.open(C).then(c=>c.put(key,cp))}return res})
    .catch(()=>caches.match(key).then(m=>m||(r.mode=="navigate"?caches.match("index.html"):undefined))));
});
