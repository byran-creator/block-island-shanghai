// A touch-capable laptop is not automatically a phone. Prefer the device UA
// or the primary pointer, and allow iPadOS desktop-style user agents.
export function isMobileDevice(navigator,matchMedia){
 const ua=navigator?.userAgent??'';
 if(/Android|iPhone|iPad|iPod|Mobile/i.test(ua))return true;
 let coarse=false,fine=false;
 try{coarse=!!matchMedia?.('(pointer:coarse)')?.matches;fine=!!matchMedia?.('(pointer:fine)')?.matches;}catch{}
 if(coarse)return true;
 if(fine)return false;
 return /Macintosh|MacIntel/i.test(ua+' '+(navigator?.platform??''))&&(navigator?.maxTouchPoints??0)>1;
}
