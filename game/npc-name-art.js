import * as THREE from './three.module.js';

// One NPC-guide owner, one fixed drawing style. Sprites and materials remain
// per actor; only the immutable name texture is shared.
export function createNpcNameArt(){
 const textures=new Map();
 return {get(title){
  if(textures.has(title))return textures.get(title);
  const canvas=document.createElement('canvas'),c=canvas.getContext('2d'),font='600 36px "Microsoft YaHei",sans-serif';c.font=font;canvas.width=Math.ceil((c.measureText?.(title)?.width??title.length*36)+28);canvas.height=64;c.font=font;c.textAlign='center';c.textBaseline='middle';c.shadowColor='#0a1728';c.shadowBlur=5;c.fillStyle='#fff7dd';c.fillText(title,canvas.width/2,32);
  const texture=new THREE.CanvasTexture(canvas);textures.set(title,texture);return texture;
 },dispose(){for(const texture of textures.values())texture.dispose();textures.clear();}};
}
