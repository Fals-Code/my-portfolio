// Minimal service worker — prevents 404 retry loop in Chrome Mobile
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
