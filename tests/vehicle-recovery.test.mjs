import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {VoxelWorld,overlaps,trace} from '../game/world.js';
import {MAGNOLIA} from '../game/shanghai-map.js';
import {createCommute} from '../game/commute.js';
import {vehiclePenetration} from '../game/vehicle-dynamics.js';
const keys=(...k)=>new Set(k),flat={get:(x,y)=>y===25?9:0};
let pos={x:50,y:26,z:50};const other={root:new THREE.Group(),halfWidth:.9,halfLength:1.65};
const commute=createCommute({scene:new THREE.Scene(),world:flat,civil:{traffic:{buses:[],time:0}},activity:{heli:new THREE.Group()},getPos:()=>pos,blocked:(x,y,z)=>overlaps(flat,x,y,z),place:p=>Object.assign(pos,p),setView(){},turnView(){},notify(){},getActors:()=>[other]});
for(const kind of ['car','bicycle']){
 const v=commute.vehicles.find(v=>v.kind===kind);for(const [i,parked]of commute.vehicles.entries())if(parked!==v)parked.root.position.set(90+i*5,26,90);v.root.position.set(50,26,50);v.root.rotation.set(0,0,0);v.yaw=0;v.speed=0;commute.mount(v);
 other.root.position.set(50,26,50-v.halfLength-other.halfLength+.15);const before=v.root.position.clone(),initial=vehiclePenetration(v,50,26,50,0,other);assert(initial>0,'Start with an overlap caused by another moving vehicle');
 for(let i=0;i<30;i++)commute.tick(1/60,keys('KeyW'));assert(v.root.position.z>=before.z-.001,'Driving deeper into the collision must stay blocked');
 for(let i=0;i<180;i++)commute.tick(1/60,keys('KeyS'));assert(v.root.position.z>before.z+1,kind+' must reverse out of an existing overlap');assert.equal(vehiclePenetration(v,v.root.position.x,v.root.position.y,v.root.position.z,v.yaw,other),0);
 assert(commute.end());other.root.position.set(80,26,80);v.root.position.set(50,26,50);v.speed=0;commute.mount(v);
 for(let i=0;i<120;i++)commute.tick(1/60,keys('KeyS'));assert(v.speed<0&&v.root.position.z>51,kind+' must reverse from rest');assert(commute.end());
 other.halfLength=5;other.root.position.set(50,26,50);v.root.position.set(50,26,50);v.speed=0;commute.mount(v);for(let i=0;i<300;i++)commute.tick(1/60,keys('KeyS'));assert.equal(vehiclePenetration(v,v.root.position.x,v.root.position.y,v.root.position.z,v.yaw,other),0,kind+' must escape even a deep overlap with a long bus');assert(commute.end());other.halfLength=1.65;
}
const world=new VoxelWorld(),heli=new THREE.Group();heli.position.set(MAGNOLIA.x-1.5,83,MAGNOLIA.z-1);let exits=0,view=null;
const roof=createCommute({scene:new THREE.Scene(),world,civil:{traffic:{buses:[],time:0}},activity:{heli},getPos:()=>pos,blocked:(x,y,z)=>overlaps(world,x,y,z),place:p=>Object.assign(pos,p),setView:(yaw,pitch)=>view={yaw,pitch},turnView(){},notify(){},onExit:()=>exits++});
const h=roof.vehicles.find(v=>v.kind==='helicopter');roof.mount(h);const home=h.root.position.clone();
for(let i=0;i<120;i++)roof.tick(1/60,keys('Space'));assert(h.root.position.y>home.y+15);assert(!roof.end(),'Midair exits remain blocked');
for(let i=0;i<150;i++)roof.tick(1/60,keys('ShiftLeft'));assert(Math.abs(h.root.position.y-home.y)<.16,'Landing must stop at the rooftop');
const pose=roof.cameraPose(0,-.2),from=new THREE.Vector3(pose.focus.x,pose.focus.y,pose.focus.z),to=new THREE.Vector3(pose.position.x,pose.position.y,pose.position.z),ray=to.clone().sub(from);assert(ray.length()>5,'Landed helicopter camera must stay outside the opaque cabin');assert(!trace(world,from,ray.normalize(),to.distanceTo(from)),'Landing camera must not cross the roof');
assert(roof.end(),'A landed helicopter must allow ordinary V exit');assert.equal(exits,1);assert(!roof.isRiding()&&!roof.collides(pos.x,pos.y,pos.z));assert(!overlaps(world,pos.x,pos.y,pos.z)&&overlaps(world,pos.x,pos.y-.1,pos.z),'Exit must have free headroom and solid support');assert(view&&Number.isFinite(view.yaw)&&view.pitch===-.12);
const walked={x:pos.x-Math.sin(view.yaw)*.3,y:pos.y,z:pos.z-Math.cos(view.yaw)*.3};assert(!overlaps(world,walked.x,walked.y,walked.z)&&!roof.collides(walked.x,walked.y,walked.z),'Walking away after landing must be unobstructed');
const cameraWorld={get:(x,y,z)=>y===25?9:z===52&&y>=26&&y<=32?3:0},cameraHeli=new THREE.Group();cameraHeli.position.set(50,26,50);const closeWall=createCommute({scene:new THREE.Scene(),world:cameraWorld,civil:{traffic:{buses:[]}},activity:{heli:cameraHeli},getPos:()=>pos,blocked:(x,y,z)=>overlaps(cameraWorld,x,y,z),place:p=>Object.assign(pos,p),setView(){},turnView(){},notify(){}});closeWall.mount(closeWall.vehicles.find(v=>v.kind==='helicopter'));const fallback=closeWall.cameraPose(0,-.2);assert(fallback.position.y>=35,'A close wall must switch the landed helicopter to a clear overhead camera');
console.log('PASS: car and bicycle reverse from rest and escape existing traffic overlaps, deeper collisions stay blocked, helicopter lands/ordinary exits/clear camera/supported walk-away.');
