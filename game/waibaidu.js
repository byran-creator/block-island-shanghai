import * as THREE from './three.module.js';
import {WAIBAIDU} from './waibaidu-layout.js';
import {batchMeshes,staticMeshes} from './mesh-batch.js';
export function createWaibaidu(scene){
 const root=new THREE.Group();root.name='waibaidu-double-steel-truss';scene.add(root);
 const steel=new THREE.MeshLambertMaterial({color:'#7e9395'}),stone=new THREE.MeshLambertMaterial({color:'#b8b6a8'}),road=new THREE.MeshLambertMaterial({color:'#34424b'}),lamp=new THREE.MeshBasicMaterial({color:'#ffd691'}),white=new THREE.MeshBasicMaterial({color:'#e8e4d5'}),lights=[];
 const box=new THREE.BoxGeometry(1,1,1);
 function cube(x,y,z,w,h,d,mat){const m=new THREE.Mesh(box,mat);m.position.set(x,y,z);m.scale.set(w,h,d);m.userData.range=300;root.add(m);return m;}
 function beam(a,b,width=.18){const d=new THREE.Vector3().subVectors(b,a),m=new THREE.Mesh(new THREE.BoxGeometry(width,d.length(),width),steel);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());m.userData.range=300;root.add(m);}
 const {x,north,south,y}=WAIBAIDU;
 cube(x+.5,y+.018,(north+south+1)/2,8.05,.04,south-north+1,road);
 for(let z=north;z<=south;z+=4)cube(x+.5,y+.065,z+.5,.12,.025,1.4,white);
 for(const side of [-1,1]){cube(x+.5+side*4.85,y+.04,(north+south+1)/2,1.5,.08,south-north+1,stone);for(let z=north;z<=south;z+=2)cube(x+.5+side*6.1,26.6,z+.5,.09,1.2,.09,steel);cube(x+.5+side*6.1,27.22,(north+south+1)/2,.12,.12,south-north+1,steel);}
 for(const [a,b]of [[north,-21],[-21,south]]){
  const top=z=>y+4.1+2.1*Math.sin(Math.PI*(z-a)/(b-a));
  for(const side of [-1,1]){const xx=x+.5+side*4.1;
   for(let i=0;i<6;i++){const z=a+(b-a)*i/6,zz=a+(b-a)*(i+1)/6;
    beam(new THREE.Vector3(xx,y+.2,z+.5),new THREE.Vector3(xx,y+.2,zz+.5),.27);
    beam(new THREE.Vector3(xx,top(z),z+.5),new THREE.Vector3(xx,top(zz),zz+.5),.27);
    beam(new THREE.Vector3(xx,y+.2,z+.5),new THREE.Vector3(xx,top(z),z+.5),.21);
    beam(new THREE.Vector3(xx,y+.2,z+.5),new THREE.Vector3(xx,top(zz),zz+.5),.17);
    beam(new THREE.Vector3(xx,top(z),z+.5),new THREE.Vector3(xx,y+.2,zz+.5),.17);
    if(side===1)beam(new THREE.Vector3(x+.5-4.1,top(z),z+.5),new THREE.Vector3(x+.5+4.1,top(z),z+.5),.19);
   }
   beam(new THREE.Vector3(xx,y+.2,b+.5),new THREE.Vector3(xx,top(b),b+.5),.21);
  }
 }
 for(const side of [-1,1])for(const z of [north,-21,south]){cube(x+.5+side*5.2,27.5,z+.5,.11,3,.11,steel);lights.push(cube(x+.5+side*5.2,29.1,z+.5,.34,.4,.34,lamp));}
 batchMeshes(root,staticMeshes(root,new Set(lights)),'waibaidu-steel');const glow=batchMeshes(root,lights,'waibaidu-lamps');
 return {tick:night=>glow.forEach(m=>m.visible=night)};
}
