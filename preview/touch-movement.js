export function joystickVector(dx,dy,radius,rotated=false){
 if(rotated)[dx,dy]=[dy,-dx];
 const distance=Math.hypot(dx,dy),amount=Math.min(1,distance/Math.max(1,radius)),power=Math.max(0,(amount-.12)/.88);
 return {side:distance?dx/distance*power:0,forward:distance?-dy/distance*power:0,x:distance?dx/distance*Math.min(distance,radius):0,y:distance?dy/distance*Math.min(distance,radius):0};
}
export function movementAxes(keys,stick={side:0,forward:0}){
 let forward=Number(keys.has('KeyW'))-Number(keys.has('KeyS'))+stick.forward,side=Number(keys.has('KeyD'))-Number(keys.has('KeyA'))+stick.side;
 const length=Math.hypot(forward,side);if(length>1){forward/=length;side/=length;}return {forward,side};
}
export function createTouchMovement({pad,thumb,select,body,enabled=()=>true,rotated=()=>false,storage,onMode=()=>{}}){
 const storageKey='block-island-touch-movement-v1';let mode='joystick',pointer=null,origin=null,value={side:0,forward:0};
 try{if(storage?.getItem(storageKey)==='dpad')mode='dpad';}catch{}
 function reset(){pointer=null;origin=null;value={side:0,forward:0};thumb.style.transform='translate(-50%,-50%)';pad.dataset.active='false';}
 function setMode(next,persist=true){mode=next==='dpad'?'dpad':'joystick';reset();body.dataset.touchMovement=mode;if(select)select.value=mode;if(persist)try{storage?.setItem(storageKey,mode);}catch{}onMode(mode);}
 function sample(e){if(pointer!==e.pointerId||!origin)return;if(!enabled()){reset();return;}const v=joystickVector(e.clientX-origin.x,e.clientY-origin.y,origin.radius,rotated());value={side:v.side,forward:v.forward};thumb.style.transform=`translate(calc(-50% + ${v.x}px),calc(-50% + ${v.y}px))`;}
 pad.addEventListener('pointerdown',e=>{if(mode!=='joystick'||pointer!==null||!enabled())return;e.preventDefault();e.stopPropagation();const r=pad.getBoundingClientRect();origin={x:r.left+r.width/2,y:r.top+r.height/2,radius:pad.clientWidth*.32};pointer=e.pointerId;pad.setPointerCapture?.(pointer);pad.dataset.active='true';sample(e);});
 pad.addEventListener('pointermove',e=>{if(pointer!==e.pointerId)return;e.preventDefault();sample(e);});
 for(const type of ['pointerup','pointercancel','lostpointercapture'])pad.addEventListener(type,e=>{if(e.pointerId===pointer)reset();});
 select?.addEventListener('change',()=>setMode(select.value));setMode(mode,false);
 return {reset,setMode,get mode(){return mode;},get vector(){return value;},has(key){const v=value;return key==='KeyW'?v.forward>.08:key==='KeyS'?v.forward<-.08:key==='KeyD'?v.side>.08:key==='KeyA'?v.side<-.08:false;}};
}
