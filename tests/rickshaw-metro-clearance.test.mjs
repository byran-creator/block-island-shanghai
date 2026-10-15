import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {VoxelWorld} from '../game/world.js';
import {YUYUAN_SHIFT} from '../game/yuyuan-layout.js';
import {createYuyuanRickshaws} from '../game/yuyuan-rickshaw.js';
import {rickshawMetroClear,rickshawMetroSweepClear,RICKSHAW_METRO_BOUNDS} from '../game/rickshaw-clearance.js';
assert.equal(RICKSHAW_METRO_BOUNDS.length,2,'Use both actual Line 10 street entrances');
assert(!rickshawMetroClear(-86,150,-Math.PI/2),'Original north route crosses the entrance canopy');
assert(!rickshawMetroClear(-82,150,-Math.PI/2),'Puller/shafts may collide even when the carriage centre is outside');
assert(rickshawMetroClear(-96.5,155,0));
assert(!rickshawMetroSweepClear({position:{x:-80,z:150},rotation:{y:-Math.PI/2}},-92,150,-Math.PI/2),'A long frame cannot jump through an entrance');
const root=new THREE.Group(),scene=new THREE.Scene(),player={x:1000,y:26,z:1000};scene.add(root);
const system=createYuyuanRickshaws({scene,root,getPos:()=>player,setView(){},place:p=>Object.assign(player,p),notify(){}}),world=new VoxelWorld(),start=system.rickshaws.map(r=>r.distance);
let samples=0;const frame=[1/60,.05,.1,.033,.08];
for(let t=0,k=0;t<720;k++){
 const dt=frame[k%frame.length];t+=dt;
 // Exercise the real lateral avoidance near both station approaches.
 const crowd=t>360?system.rickshaws.filter(r=>r.group.position.x<-76).map(r=>({x:r.group.position.x+Math.sin(r.pose.yaw)*3,z:r.group.position.z+Math.cos(r.pose.yaw)*3})):[];
 system.tick(dt,new Set(),crowd);
 for(const r of system.rickshaws){const p=r.group.position,yaw=r.group.rotation.y;assert(rickshawMetroClear(p.x,p.z,yaw),`Car ${r.id} entered a station at ${t}`);
  // Independent physical body samples against the real world at the changed corner.
  if(p.x>-100&&p.x<-76&&p.z<155){samples++;for(const f of [-.85,0,1.5,2.65])for(const side of [-.72,0,.72]){const x=p.x+Math.sin(yaw)*f+Math.cos(yaw)*side,z=p.z+Math.cos(yaw)*f-Math.sin(yaw)*side+YUYUAN_SHIFT;assert(!world.get(Math.floor(x),26,Math.floor(z)),`Body intersects world at ${x},${z}`);assert(!world.get(Math.floor(x),27,Math.floor(z)));assert(world.get(Math.floor(x),25,Math.floor(z)),`No street support at ${x},${z}`);}}
 }
 if(k%800===799)for(const [i,r]of system.rickshaws.entries())assert(r.distance-start[i]>t*.6,'Clearance cannot permanently freeze a car');
}
assert(samples>200);for(const [i,r]of system.rickshaws.entries())assert(r.distance-start[i]>900,'Each car completes the circuit rather than freezing at the station');
Object.assign(player,system.rickshaws[0].group.position);assert(system.use());assert(system.isRiding());
// A passenger car follows the other 2m/s carts; allow a whole convoy-speed lap.
for(let i=0;i<3600&&system.isRiding();i++){system.tick(.1);for(const r of system.rickshaws)assert(rickshawMetroClear(r.group.position.x,r.group.position.z,r.group.rotation.y),'Ridden car also preserves entrance clearance');}
assert(!system.isRiding(),'Riding a full circuit still reaches automatic dismount');
console.log(`PASS: original collision reproduced; puller/shaft and swept-frame protection; 8 real carts, 12-minute variable-frame circulation with avoidance, ${samples} supported corner body checks, both station entrances clear.`);
