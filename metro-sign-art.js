import * as THREE from './three.module.js';
import {paintMetroSign} from './metro-sign-paint.js';

// One owner per metro root. Only immutable artwork is pooled; a changed sign
// detaches once so independently repainted arrival/route boards never interfere.
export function createMetroSignArt(){
 const cache=new Map();
 function draw(context,lines,settings,width,height,color,bg){
  if(settings){paintMetroSign(context,lines,{...settings,width,height,color,bg});return;}
  context.fillStyle=bg;context.fillRect(0,0,768,256);context.fillStyle=color;context.textAlign='center';
  lines.forEach((line,i)=>{context.font=(i===0?'bold ':'')+(lines.length>2?48:64)+'px sans-serif';context.fillText(line,384,55+i*(lines.length>2?68:110),746);});
 }
 function acquire(lines,settings,width,height,color,bg,shared=true){
  const key=JSON.stringify([lines,settings,width,height,color,bg]);if(shared&&cache.has(key))return cache.get(key);
  const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
  const context=canvas.getContext('2d'),texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;
  const art={canvas,context,texture,shared,key,settings,width,height,color,bg};draw(context,lines,settings,width,height,color,bg);
  if(shared)cache.set(key,art);return art;
 }
 function repaint(art,lines){
  const {settings,width,height,color,bg}=art,key=JSON.stringify([lines,settings,width,height,color,bg]);if(key===art.key)return art;
  if(art.shared)return acquire(lines,settings,width,height,color,bg,false);
  draw(art.context,lines,settings,width,height,color,bg);art.key=key;art.texture.needsUpdate=true;return art;
 }
 return {acquire,repaint};
}
