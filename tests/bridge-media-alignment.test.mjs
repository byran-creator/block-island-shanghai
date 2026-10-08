import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {roadSegmentOrientation} from '../game/road-orientation.js';
import {nanpuSurfaceAt} from '../game/bridge-road.js';
import {createCityMedia} from '../game/city-media.js';
import {CITY} from '../game/shanghai-map.js';
import {VoxelWorld} from '../game/world.js';

for(let x=192;x<281;x+=.5){const rise=nanpuSurfaceAt(x+.5,206.5)-nanpuSurfaceAt(x,206.5),d=new THREE.Vector3(.5,rise,0),q=roadSegmentOrientation(d),width=new THREE.Vector3(1,0,0).applyQuaternion(q),length=new THREE.Vector3(0,0,1).applyQuaternion(q);
 assert(Math.abs(width.y)<1e-10,'Deck width must not bank across the carriageway');assert(length.distanceTo(d.normalize())<1e-10,'Deck length must follow the actual slope');
 for(const yaw of [-Math.PI/2,Math.PI/2]){const root=new THREE.Object3D(),pitch=Math.atan2(rise*(yaw<0?1:-1),.5);root.rotation.set(pitch,yaw,0,'YXZ');const side=new THREE.Vector3(1,0,0).applyQuaternion(root.quaternion),front=new THREE.Vector3(0,0,-1).applyQuaternion(root.quaternion);assert(Math.abs(side.y)<1e-10,'Pitch must not lean the car sideways');assert(Math.abs(front.y-Math.sin(pitch))<1e-10,'Car forward axis must pitch with the slope');}
}
const old=globalThis.document,calls=[],ctx={fillRect(){},fillText(...a){calls.push(a);}};globalThis.document={createElement:()=>({getContext:()=>ctx})};
try{const media=createCityMedia({scene:new THREE.Scene()}),crown=media.screens[0],p=crown.mesh.geometry.attributes.position,uv=crown.mesh.geometry.attributes.uv;
 assert.equal(crown.canvas.height/crown.canvas.width,2);assert.equal(crown.material.fog,false);assert.equal(crown.material.side,THREE.FrontSide,'Advertisement must not block the observatory from inside');for(const a of calls.filter(a=>['上','海','欢','迎','夜','游'].includes(a[0])))assert.equal(a.length,3,'Crown glyphs must not be squeezed by maxWidth');assert(calls.some(a=>a[0]==='上')&&calls.some(a=>a[0]==='海'));
 // The Bund faces west. Its front centre must be the middle of one complete ad,
 // rather than the old U=0/1 boundary between two repetitions.
 const west=[];for(let i=0;i<p.count;i++)if(p.getX(i)<CITY.shanghai.x&&Math.abs(p.getZ(i)-CITY.shanghai.z)<1e-4)west.push(uv.getX(i));assert(west.length);assert(west.every(u=>Math.abs(u-.5)<1e-6),'West-facing advertisement must not lie on a seam');
 for(let i=0;i<p.count;i++)if(p.getX(i)<CITY.shanghai.x-4&&p.getZ(i)>CITY.shanghai.z+.5&&p.getZ(i)<CITY.shanghai.z+4)assert(uv.getX(i)>.5,'Text must read left-to-right from the Bund, not mirrored');
 const world=new VoxelWorld();for(let i=0;i<p.count;i+=4){const x=(p.getX(i)+p.getX(i+1)+p.getX(i+2)+p.getX(i+3))/4,y=(p.getY(i)+p.getY(i+1)+p.getY(i+2)+p.getY(i+3))/4,z=(p.getZ(i)+p.getZ(i+1)+p.getZ(i+2)+p.getZ(i+3))/4;assert(!world.get(Math.floor(x),Math.floor(y),Math.floor(z)),'Voxel crown rim must not cover the advertisement');}
}finally{globalThis.document=old;}
console.log('PASS: both bridge ramps, horizontal lane width, correctly pitched vehicles, tall unsqueezed glyphs and a complete Bund-facing crown advertisement.');
