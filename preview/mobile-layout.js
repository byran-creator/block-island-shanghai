export function createMobileLayout({body,view,document,orientation,storage}){
 const key='block-island-mobile-layout-v1';let landscape=true,requested=false,revision=0;
 try{landscape=storage?.getItem(key)!=='portrait';}catch{}
 function apply(){const {width,height}=view();body.style.setProperty('--touch-width',width+'px');body.style.setProperty('--touch-height',height+'px');body.classList.toggle('force-landscape',landscape&&height>width);}
 function setLandscape(value){if(landscape!==!!value)requested=false;landscape=!!value;revision++;try{storage?.setItem(key,landscape?'landscape':'portrait');}catch{}if(!landscape)try{orientation?.unlock?.();}catch{}apply();}
 // Called by the player's entry tap. CSS already supplies the landscape layout
 // when a browser cannot grant fullscreen or native orientation locking.
 async function requestNative(){if(!landscape||requested)return;requested=true;const current=revision;
  try{if(!document.fullscreenElement&&!document.webkitFullscreenElement){const root=document.documentElement;if(root.requestFullscreen)await root.requestFullscreen();else if(root.webkitRequestFullscreen)await root.webkitRequestFullscreen();}
   if(current===revision&&landscape&&orientation?.lock)await orientation.lock('landscape');
  }catch{}finally{if(current===revision)apply();}
 }
 apply();return {apply,setLandscape,requestNative,get landscape(){return landscape;}};
}
