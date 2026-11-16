import * as THREE from './three.module.js';
import {bundStaticGeometry} from './bund-static-batch.js';
import {CENTURY_PARK} from './century-park.js';

function clockTexture(){
 const canvas=document.createElement('canvas');
 canvas.width=canvas.height=384;
 const c=canvas.getContext('2d');
 c.fillStyle='#33523a';c.fillRect(0,0,384,384);
 const circle=(x,y,r,color)=>{c.fillStyle=color;c.beginPath();c.arc(x,y,r,0,2*Math.PI);c.fill();};
 circle(192,192,166,'#63914f');
 circle(192,192,154,'#653d43');
 const flowers=['#d86a7d','#e98690','#e4a0a4','#f9cab4','#e7aa5f','#ad4d64'];
 for(let y=34;y<352;y+=6)for(let x=34;x<352;x+=6){
  const r=Math.hypot(x-192,y-192),seed=(x*37+y*59)%127;
  if(r>161||r>145&&r<151)continue;
  c.fillStyle=flowers[r<112?seed%4:3+seed%3];
  c.fillRect(x+seed%4,y+(seed>>2)%4,2+seed%3,2+seed%2);
 }
 for(let i=0;i<12;i++){
  const a=i*Math.PI/6,x=192+Math.sin(a)*135,y=192-Math.cos(a)*135;
  circle(x+1,y+2,i%3===0?12:8,'#243b2c');
  circle(x,y,i%3===0?10:6,'#638941');
  circle(x-2,y-2,i%3===0?6:4,'#86ad5b');
 }
 const hands=[[125,122,10],[285,148,7]];
 c.lineCap='round';
 for(const [x,y,width] of hands){
  c.beginPath();c.moveTo(192,192);c.lineTo(x,y);
  c.strokeStyle='#344941';c.lineWidth=width+5;c.stroke();
  c.strokeStyle='#fff5d4';c.lineWidth=width;c.stroke();
 }
 circle(192,192,10,'#9b6c4d');
 circle(192,192,6,'#f3d492');
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
 return texture;
}

export function addCenturyParkDetails(root){
 const bed=CENTURY_PARK.flowerClock;
 const clock=new THREE.PlaneGeometry(bed.maxZ-bed.minZ,bed.maxX-bed.minX);
 const points=clock.attributes.position,centerX=(bed.minX+bed.maxX)/2,centerZ=(bed.minZ+bed.maxZ)/2;
 const clockY=x=>27.025+(x-bed.minX)*.186;
 for(let i=0;i<points.count;i++){
  const x=centerX+points.getY(i),z=centerZ+points.getX(i);
  points.setXYZ(i,x,clockY(x),z);
 }
 clock.computeVertexNormals();
 const face=new THREE.Mesh(clock,new THREE.MeshLambertMaterial({map:clockTexture()}));
 face.name='Century Park flower clock';face.userData.panel=true;root.add(face);
 const skirt=new THREE.BufferGeometry(),rim=[
  [bed.minX,bed.minZ],[bed.maxX,bed.minZ],[bed.maxX,bed.maxZ],[bed.minX,bed.maxZ]
 ];
 const sides=[],triangles=[];
 for(let i=0;i<rim.length;i++){
  const [x,z]=rim[i],[nextX,nextZ]=rim[(i+1)%rim.length],n=sides.length/3;
  sides.push(x,27,z,x,clockY(x),z,nextX,27,nextZ,nextX,clockY(nextX),nextZ);
  triangles.push(n,n+1,n+2,n+2,n+1,n+3);
 }
 skirt.setAttribute('position',new THREE.Float32BufferAttribute(sides,3));skirt.setIndex(triangles);skirt.computeVertexNormals();
 root.add(new THREE.Mesh(skirt,new THREE.MeshLambertMaterial({color:'#517349'})));

 const unit=new THREE.BoxGeometry(1,1,1),pieces=[];
 const metal=new THREE.MeshLambertMaterial({color:'#c7e3e8'});
 const up=new THREE.Vector3(0,1,0),direction=new THREE.Vector3();
 function rod(a,b,width,depth=width){
  const mesh=new THREE.Mesh(unit,metal);
  direction.set(b[0]-a[0],b[1]-a[1],b[2]-a[2]);
  mesh.scale.set(width,direction.length(),depth);
  mesh.position.set((a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2);
  mesh.quaternion.setFromUnitVectors(up,direction.normalize());
  mesh.updateMatrixWorld();pieces.push(mesh);
 }
 for(const z of [bed.minZ,bed.maxZ])rod([bed.minX,clockY(bed.minX),z],[bed.maxX,clockY(bed.maxX),z],.08);
 for(const x of [bed.minX,bed.maxX])rod([x,clockY(x),bed.minZ],[x,clockY(x),bed.maxZ],.08);
 // The lower canopy follows the pavilion entrance's flat slab, with a thin overhang.
 for(const x of [317.05,321.95])rod([x,30.53,54],[x,30.53,63],.12,.18);
 const {rails,fromZ,toZ}=CENTURY_PARK.bridge;
 const bow=t=>27.045+.48*Math.sin(Math.PI*t);
 for(const side of rails){
  const x=side+.5,edgeX=side<358?side+.07:side+.93;
  for(let z=fromZ;z<toZ;z++){
   const y0=bow((z-fromZ)/(toZ-fromZ)),y1=bow((z+1-fromZ)/(toZ-fromZ));
   rod([x,y0,z],[x,y1,z+1],.09);
   rod([edgeX,y0-1.15,z],[edgeX,y1-1.15,z+1],.1,.15);
  }
  for(const [base,sign] of [[fromZ+1.5,1],[toZ-1.5,-1]]){
   const top=base+sign*.8;
   rod([x,27.9,base],[x,32.4,top],.18);
   rod([x,27.16,base-sign*1.25],[x,32.4,top],.12);
   for(let span=2;span<=6;span+=2)rod([x,32.4,top],[x,27.25,base+sign*span],.055);
  }
 }
 const trim=new THREE.Mesh(bundStaticGeometry(pieces),metal);
 trim.name='Century Park bridge and clock trim';root.add(trim);unit.dispose();
}
