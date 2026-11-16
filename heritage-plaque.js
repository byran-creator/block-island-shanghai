import * as THREE from './three.module.js';

export function addHeritagePlaque(group,x,y,z,w,h,lines,yaw=0){
 const canvas=document.createElement('canvas');
 canvas.width=512;canvas.height=Math.round(canvas.width*h/w);
 const c=canvas.getContext('2d'),{width,height}=canvas;
 c.fillStyle='#26302f';c.fillRect(0,0,width,height);
 c.strokeStyle='#947b59';c.lineWidth=3;c.strokeRect(4,4,width-8,height-8);
 c.textAlign='center';c.textBaseline='middle';
 for(const [i,line] of lines.entries()){
  c.font=`600 ${Math.min(45,height/(lines.length+.5))}px "Microsoft YaHei",sans-serif`;
  c.fillStyle=i===0?'#f0deba':'#e0d8c7';
  c.fillText(line,width/2,(i+.5)*height/lines.length,width-34);
 }
 const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;
 const plaque=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map}));
 plaque.position.set(x,y,z);
 plaque.rotation.y=yaw;
 plaque.userData.panel=true;group.add(plaque);
}
