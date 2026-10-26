// Prime desktop pointer lock inside the same real welcome click as audio. An
// explicit programmatic release permits later reacquisition after city loading;
// never keep the pointer captured over the loading menu or bypass user Escape.
export function primeStartupPointer(document,navigator){
 const canvas=document.getElementById('world');
 if(!canvas?.requestPointerLock||navigator?.maxTouchPoints>0||/Android|iPhone|iPad|iPod|Mobile/i.test(navigator?.userAgent??''))return;
 let done=false;
 const clear=()=>{document.removeEventListener('pointerlockchange',changed);document.removeEventListener('pointerlockerror',clear);document.removeEventListener('block-island-ready',clear);};
 function changed(){if(done||document.pointerLockElement!==canvas)return;done=true;clear();document.documentElement.dataset.pointerPrimed='true';if(document.documentElement.dataset.gameStarted!=='true')document.exitPointerLock?.();}
 document.addEventListener('pointerlockchange',changed);document.addEventListener('pointerlockerror',clear,{once:true});document.addEventListener('block-island-ready',clear,{once:true});
 try{canvas.requestPointerLock()?.catch?.(clear);}catch{clear();}
}
