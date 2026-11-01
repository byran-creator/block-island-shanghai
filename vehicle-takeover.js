import * as THREE from './three.module.js';
import {safeLanding} from './map-travel.js';
import {roadContains} from './city-layout.js';
// Scene-owned owners are created once, only when a traffic car is taken over.
// Hand the original car root to commuting; never clone a second traffic car.
export function createVehicleTakeover({scene,world,traffic,cars,getPos,blocked,mount,vehicles,canStart=()=>true,notify=()=>{}}){
 const owners=[],geometry=new THREE.BoxGeometry(1,1,1),materials=[new THREE.MeshLambertMaterial({color:'#536c86'}),new THREE.MeshLambertMaterial({color:'#dcb38e'}),new THREE.MeshLambertMaterial({color:'#303f50'})];
 function candidate(){const p=getPos();let result=null,best=3.4;for(const c of cars){if(c.kind==='bus'||vehicles.includes(c)||Math.abs(c.root.position.y-p.y)>2)continue;const d=Math.hypot(c.root.position.x-p.x,c.root.position.z-p.z);if(d<best){best=d;result=c;}}return result;}
 function begin(){if(!canStart())return false;const c=candidate();if(!c)return false;
  const at=c.root.position,a=c.root.rotation.y;let point=null;
  for(const side of [1,-1]){point=safeLanding(world,{x:at.x+Math.cos(a)*side*3,y:at.y,z:at.z-Math.sin(a)*side*3},(x,y,z)=>blocked(x,y,z)||roadContains(x,z)||Math.hypot(x-at.x,z-at.z)<2.6||owners.some(o=>o.root.position.distanceTo(new THREE.Vector3(x,y,z))<1));if(point)break;}
  if(!point){notify('车旁没有安全下车位置，请换一辆车');return true;}
  const index=traffic.agents.indexOf(c);if(index<0)return false;traffic.agents.splice(index,1);const root=new THREE.Group();root.position.set(point.x,point.y,point.z);root.rotation.y=a;scene.add(root);
  for(const [m,x,y,z,sx,sy,sz]of [[0,0,1,0,.48,.65,.3],[1,0,1.55,0,.33,.34,.33],[2,-.13,.4,0,.19,.8,.23],[2,.13,.4,0,.19,.8,.23],[0,-.33,1,0,.16,.6,.18],[0,.33,1,0,.16,.6,.18]]){const mesh=new THREE.Mesh(geometry,materials[m]);mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);mesh.userData.range=100;root.add(mesh);}owners.push({root,person:true,height:1.8});
  c.kind='car';c.speed=0;c.travelSpeed=0;c.throttle=0;c.wheels??=[];c.steerRigs??=[];c.maxSpeed=19;vehicles.push(c);mount(c);return true;
 }
 return {begin,candidate,owners};
}
