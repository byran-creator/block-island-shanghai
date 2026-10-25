import * as THREE from './three.module.js';
import {drawHeritageSign} from './shanghai-textures.js';

// Owned by one street scene. These signs are immutable; dynamic displays must
// keep private canvases/materials. Dispose only after all scene users detach.
export function createStreetSignArt(){
 const artwork=new Map(),planes=new Map();
 function get(text,color,w,h,graffiti=false,brandIndex=-1,style='horizontal'){
  let cw=512,ch=144;
  if(style==='vertical-blade'){cw=192;ch=512;}
  else if(style==='medallion'||graffiti){cw=256;ch=256;}
  else if(style==='arch'){cw=512;ch=192;}
  if(graffiti&&[...text].length===1)cw=ch=128;
  const index=brandIndex>=0?brandIndex:(typeof color==='number'?color:0),key=JSON.stringify([text,color,index,style,cw,ch]);
  let art=artwork.get(key);
  if(!art){
   const maps=[];
   for(const night of [false,true]){
    const canvas=document.createElement('canvas');canvas.width=cw;canvas.height=ch;
    if(text==='H'){
     const c=canvas.getContext('2d'),col=night?'#ffe66d':'#f9f2c6';c.fillStyle='#232c33';c.fillRect(0,0,cw,ch);c.strokeStyle=col;c.lineWidth=14;c.strokeRect(10,10,cw-20,ch-20);c.font='bold 80px sans-serif';c.fillStyle=col;c.textAlign='center';c.textBaseline='middle';c.fillText('H',cw/2,ch/2);
    }else drawHeritageSign(canvas,text,index,false,night,color,style);
    const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;map.generateMipmaps=true;map.minFilter=THREE.LinearMipmapLinearFilter;map.anisotropy=8;maps.push(map);
   }
   const params={side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-4};
   art={day:new THREE.MeshLambertMaterial({...params,map:maps[0]}),night:new THREE.MeshBasicMaterial({...params,map:maps[1]})};artwork.set(key,art);
  }
  const shape=JSON.stringify([w,h]);if(!planes.has(shape))planes.set(shape,new THREE.PlaneGeometry(w,h));
  return {...art,geometry:planes.get(shape)};
 }
 return {get,dispose(){for(const a of artwork.values())for(const m of [a.day,a.night]){m.map.dispose();m.dispose();}for(const g of planes.values())g.dispose();artwork.clear();planes.clear();}};
}
