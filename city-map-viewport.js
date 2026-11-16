// The map uses CSS transforms, so panning and zooming reuse the rendered canvas.
const MAX_ZOOM=3.5;
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

function localPoint(event,element,rotated){
 const rect=element.getBoundingClientRect();
 return rotated
  ?{x:event.clientY-rect.top,y:rect.right-event.clientX,width:rect.height,height:rect.width}
  :{x:event.clientX-rect.left,y:event.clientY-rect.top,width:rect.width,height:rect.height};
}

export function createCityMapViewport(view,canvas,isRotated){
 const out=view.querySelector('[data-map-zoom-out]');
 const resetButton=view.querySelector('[data-map-zoom-reset]');
 const plus=view.querySelector('[data-map-zoom-in]');
 let zoom=1,x=0,y=0,drag=null,suppressClick=false;

 function refresh(){
  const limitX=Math.max(0,(canvas.clientWidth*zoom-view.clientWidth)/2);
  const limitY=Math.max(0,(canvas.clientHeight*zoom-view.clientHeight)/2);
  x=clamp(x,-limitX,limitX);
  y=clamp(y,-limitY,limitY);
  canvas.style.transform=zoom===1?'':`translate(${x}px, ${y}px) scale(${zoom})`;
  canvas.classList.toggle('is-zoomed',zoom>1);
  out.disabled=resetButton.disabled=zoom===1;
  plus.disabled=zoom===MAX_ZOOM;
 }

 function zoomBy(factor,anchorX=0,anchorY=0){
  const next=clamp(zoom*factor,1,MAX_ZOOM),ratio=next/zoom;
  x=anchorX-(anchorX-x)*ratio;
  y=anchorY-(anchorY-y)*ratio;
  zoom=next;
  refresh();
 }

 function reset(){
  zoom=1;
  x=y=0;
  suppressClick=false;
  refresh();
 }

 view.addEventListener('wheel',event=>{
  event.preventDefault();
  const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?view.clientHeight:1);
  const {x,y,width,height}=localPoint(event,view,isRotated());
  zoomBy(Math.exp(-clamp(delta,-220,220)*.0025),x-width/2,y-height/2);
 },{passive:false});
 out.addEventListener('click',()=>zoomBy(1/1.28));
 plus.addEventListener('click',()=>zoomBy(1.28));
 resetButton.addEventListener('click',reset);

 canvas.addEventListener('pointerdown',event=>{
  if(!event.isPrimary||event.button!==0)return;
  suppressClick=false;
  if(zoom===1)return;
  drag={id:event.pointerId,start:localPoint(event,view,isRotated()),x,y};
 });
 canvas.addEventListener('pointermove',event=>{
  if(drag?.id!==event.pointerId)return;
  const point=localPoint(event,view,isRotated());
  const dx=point.x-drag.start.x,dy=point.y-drag.start.y;
  if(!suppressClick){
   if(Math.hypot(dx,dy)<5)return;
   canvas.setPointerCapture(drag.id);
   suppressClick=true;
   view.classList.add('is-dragging');
  }
  x=drag.x+dx;
  y=drag.y+dy;
  refresh();
 });
 function finishDrag(event){
  if(drag?.id!==event.pointerId)return;
  drag=null;
  view.classList.remove('is-dragging');
 }
 for(const type of ['pointerup','pointercancel','lostpointercapture','pointerleave']){
  canvas.addEventListener(type,finishDrag);
 }
 new ResizeObserver(refresh).observe(view);
 refresh();

 return {reset,point(event){
  if(suppressClick)return null;
  const p=localPoint(event,canvas,isRotated());
  return {x:p.x/p.width*canvas.width,y:p.y/p.height*canvas.height,radius:28/zoom};
 }};
}
