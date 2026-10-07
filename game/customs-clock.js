import * as THREE from './three.module.js';

// Original clock artwork observed from the Shanghai tourism office's close-up.
export function customsClockAngles(dayClock){const hour=((dayClock/240*24+6)%24+24)%24;return {hour:-(hour%12)/12*Math.PI*2,minute:-(hour%1)*Math.PI*2};}
export function drawCustomsDial(ctx,size=1024){
 const c=size/2,u=size/1024;
 ctx.clearRect(0,0,size,size);ctx.save();ctx.translate(c,c);ctx.scale(u,u);
 const circle=(r,color,width)=>{ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.stroke();};
 ctx.fillStyle='#f4f1df';ctx.beginPath();ctx.arc(0,0,478,0,Math.PI*2);ctx.fill();
 circle(478,'#282d2b',18);circle(432,'#282d2b',10);circle(270,'#53554e',5);
 for(let i=0;i<60;i++){const a=i*Math.PI/30;ctx.strokeStyle='#2d322f';ctx.lineWidth=i%5?7:11;ctx.beginPath();ctx.moveTo(Math.sin(a)*437,-Math.cos(a)*437);ctx.lineTo(Math.sin(a)*470,-Math.cos(a)*470);ctx.stroke();}
 const numbers=['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI'];
 for(let i=0;i<12;i++){const a=i*Math.PI/6;ctx.strokeStyle='#bbbcae';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(Math.sin(a)*276,-Math.cos(a)*276);ctx.lineTo(Math.sin(a)*424,-Math.cos(a)*424);ctx.stroke();ctx.save();ctx.rotate(a);ctx.fillStyle='#242b28';ctx.font='bold 84px "Times New Roman",serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(numbers[i],0,-357);ctx.restore();}
 // Interlocking twelve-point leaded-glass pattern, not a blank generic watch.
 ctx.strokeStyle='#444b46';ctx.lineWidth=6;
 for(const offset of [0,Math.PI/6]){ctx.beginPath();for(let i=0;i<=12;i++){const a=i*Math.PI/6+offset,r=i%2?142:258;(i?ctx.lineTo:ctx.moveTo).call(ctx,Math.sin(a)*r,-Math.cos(a)*r);}ctx.closePath();ctx.stroke();}
 circle(93,'#444b46',5);circle(42,'#444b46',4);ctx.restore();
}
export function createCustomsClock(scene,building){
 const root=new THREE.Group();root.name='customs-four-sided-clock';scene.add(root);
 const canvas=document.createElement('canvas');canvas.width=canvas.height=1024;drawCustomsDial(canvas.getContext('2d'));
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;
 const glass=new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false}),metal=new THREE.MeshBasicMaterial({color:'#262c28'}),dialGeometry=new THREE.PlaneGeometry(5.6,5.6),rimGeometry=new THREE.TorusGeometry(2.66,.095,6,64);
 const faces=[],hands=[];
 for(const [x,z,yaw]of [[building.x+4.06,building.z+.5,Math.PI/2],[building.x-3.06,building.z+.5,-Math.PI/2],[building.x+.5,building.z+4.06,0],[building.x+.5,building.z-3.06,Math.PI]]){
  const face=new THREE.Group();face.position.set(x,building.h+34,z);face.rotation.y=yaw;root.add(face);
  const dial=new THREE.Mesh(dialGeometry,glass);dial.position.z=.035;face.add(dial);faces.push(dial);
  const rim=new THREE.Mesh(rimGeometry,metal);rim.position.z=.075;face.add(rim);
  const pair=[];
  for(const [index,length]of [1.56,2.13].entries()){
   const shape=new THREE.Shape(),w=index?.052:.095;shape.moveTo(-w,-.28);shape.lineTo(-w,.4);shape.lineTo(-w*2,length*.68);shape.lineTo(0,length);shape.lineTo(w*2,length*.68);shape.lineTo(w,.4);shape.lineTo(w,-.28);shape.closePath();
   const pivot=new THREE.Group(),hand=new THREE.Mesh(new THREE.ShapeGeometry(shape),metal);pivot.position.z=.1+index*.025;pivot.add(hand);face.add(pivot);pair.push(pivot);
  }
  const hub=new THREE.Mesh(new THREE.CircleGeometry(.12,20),metal);hub.position.z=.16;face.add(hub);hands.push(pair);
 }
 root.traverse(o=>{o.userData.range=285;});
 function tick(dayClock,night){const angles=customsClockAngles(dayClock);for(const pair of hands){pair[0].rotation.z=angles.hour;pair[1].rotation.z=angles.minute;}glass.color.set(night?'#fff0c4':'#ffffff');}
 tick(36,false);return {root,faces,hands,texture,tick};
}
