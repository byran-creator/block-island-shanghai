import * as THREE from './three.module.js';

// Floating information uses transparent lettering; physical signs keep their art.
export function createWorldCaption(text,{color='#ffe5ac',width=5.5}={}){
 const lines=text.split(' · '),title=lines.shift(),hint=lines.join(' · '),canvas=document.createElement('canvas');
 canvas.width=640;canvas.height=hint?116:80;const c=canvas.getContext('2d');
 c.textAlign='center';c.textBaseline='middle';c.shadowColor='#081421';c.shadowBlur=7;c.shadowOffsetY=2;c.lineWidth=3;c.strokeStyle='#10212bb3';
 c.font='600 38px "Microsoft YaHei",sans-serif';c.fillStyle=color;c.strokeText?.(title,320,hint?36:40,608);c.fillText(title,320,hint?36:40,608);
 if(hint){c.font='500 25px "Microsoft YaHei",sans-serif';c.fillStyle='#f2f5ee';c.strokeText?.(hint,320,85,608);c.fillText(hint,320,85,608);}
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
 const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthWrite:false}));
 sprite.scale.set(width,width*canvas.height/canvas.width,1);sprite.userData.wayfinding=true;return sprite;
}
