if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let o={};const l=e=>i(e,t),d={module:{uri:t},exports:o,require:l};s[t]=Promise.all(n.map((e=>d[e]||l(e)))).then((e=>(r(...e),o)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-DCClxlnZ.js",revision:null},{url:"assets/index-JnXomc3C.css",revision:null},{url:"index.html",revision:"857030e2eede2db4e9c5c4137907b152"},{url:"registerSW.js",revision:"be2bd750f2da6ad3b28fab0ec51a4962"},{url:"assets/stickerqr.png",revision:"d51a02ab2c111bece31af7476c1e8da6"},{url:"manifest.webmanifest",revision:"6911c41b19852b21d277240dbecd5f1f"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
