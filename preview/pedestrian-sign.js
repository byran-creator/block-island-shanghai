import * as THREE from './three.module.js';

// The blade points south (+world Z). This is walking wayfinding, not a metro portal.
export function createYuyuanWayfinding(){
 const root=new THREE.Group();root.name='yuyuan-pedestrian-wayfinding';root.rotation.y=-Math.PI/2;
 const metal=new THREE.MeshLambertMaterial({color:'#43584e'}),rim=new THREE.MeshLambertMaterial({color:'#b5b7a2'}),box=new THREE.BoxGeometry(1,1,1);
 const part=(material,x,y,z,w,h,d)=>{const m=new THREE.Mesh(box,material);m.position.set(x,y,z);m.scale.set(w,h,d);root.add(m);};
 part(metal,0,.075,0,.4,.15,.4);part(metal,0,1.6,0,.11,3.2,.11);part(rim,0,3.23,0,.16,.08,.16);
 const shape=new THREE.Shape();shape.moveTo(-.16,0);shape.lineTo(1.6,0);shape.lineTo(1.88,.31);shape.lineTo(1.6,.62);shape.lineTo(-.16,.62);shape.closePath();
 const blade=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.09,bevelEnabled:false}),metal);blade.position.set(0,2.48,-.045);root.add(blade);
 const canvas=document.createElement('canvas');canvas.width=768;canvas.height=256;const c=canvas.getContext('2d');
 c.fillStyle='#43584e';c.fillRect(0,0,768,256);c.textAlign='center';c.fillStyle='#fff4d5';c.font='600 94px "Microsoft YaHei",sans-serif';c.fillText('豫 园',384,113);c.font='32px "Microsoft YaHei",sans-serif';c.fillText('步行 · 沿街向南',384,181);c.font='22px sans-serif';c.fillText('YUYUAN GARDEN',384,222);
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;const material=new THREE.MeshBasicMaterial({map:texture}),geometry=new THREE.PlaneGeometry(1.65,.55);
 for(const side of [-1,1]){const m=new THREE.Mesh(geometry,material);m.position.set(.72,2.79,side*.052);m.rotation.y=side<0?Math.PI:0;m.userData.panel=true;root.add(m);}
 return root;
}
