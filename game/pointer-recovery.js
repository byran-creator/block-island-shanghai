// Pointer lock can require a fresh user gesture after asynchronous loading or a film.
export function createPointerRecovery({document,canvas,eligible}){
 const button=document.createElement('button');button.type='button';button.className='pointer-recovery';button.textContent='点击此处启用鼠标视角';button.hidden=true;document.body.appendChild(button);
 function hide(){button.hidden=true;}
 function show(){if(eligible()&&canvas.requestPointerLock)button.hidden=false;}
 button.addEventListener('click',()=>{if(!eligible())return;try{const request=canvas.requestPointerLock();request?.catch?.(()=>show());}catch{show();}});
 document.addEventListener('pointerlockchange',()=>{if(document.pointerLockElement===canvas)hide();});
 return {show,hide};
}
