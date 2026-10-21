import * as THREE from './three.module.js';
import {overlaps} from './world.js';
import {roadContains} from './city-layout.js';

// A short visible heading cue, never a route through unseen walls or crossings.
// Five shared instances, sampled twice a second only during the first 3 chapters.
export function tutorialTrailPoints(world,pos,goal){
 if(!world||!pos||!goal||Math.abs(goal.y-pos.y)>1||Math.abs(pos.y-Math.round(pos.y))>.15)return [];
 const distance=Math.hypot(goal.x-pos.x,goal.z-pos.z),end=Math.min(9,distance-(goal.arriveRadius??1.3));if(end<1.8)return [];
 const dx=(goal.x-pos.x)/distance,dz=(goal.z-pos.z)/distance,y=Math.round(pos.y);
 for(let d=0;d<=end+.01;d+=.3){const x=pos.x+dx*d,z=pos.z+dz*d;if(roadContains(x,z)||overlaps(world,x,y,z))return [];for(const ox of [-.3,.3])for(const oz of [-.3,.3]){const floor=world.get(Math.floor(x+ox),y-1,Math.floor(z+oz));if(!floor||floor===11)return [];}}
 const points=[];for(let d=1.8;d<=end;d+=1.8)points.push({x:pos.x+dx*d,y:y+.035,z:pos.z+dz*d,yaw:Math.atan2(-dx,-dz)});return points;
}
export function createTutorialTrail(scene,world){
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute([0,0,-.55,.36,0,0,.13,0,-.04,.13,0,.4,-.13,0,.4,-.13,0,-.04,-.36,0,0],3));geometry.setIndex([0,1,6,2,3,4,2,4,5]);
 const material=new THREE.MeshBasicMaterial({color:'#ffe49a',transparent:true,opacity:.8,side:THREE.DoubleSide,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1,fog:false});
 const mesh=new THREE.InstancedMesh(geometry,material,5);mesh.name='tutorial-ground-arrows';mesh.userData.photoHide=true;mesh.visible=false;mesh.frustumCulled=false;scene.add(mesh);const transform=new THREE.Object3D();
 return {hide(){mesh.visible=false;},update(state,ctx,goal,enabled=true){const allowed=enabled&&state.phase==='journey'&&state.tracked&&state.index<3;const points=allowed?tutorialTrailPoints(world,ctx.pos,goal):[];mesh.visible=points.length>0;mesh.count=points.length;for(const [i,p]of points.entries()){transform.position.set(p.x,p.y,p.z);transform.rotation.set(0,p.yaw,0);transform.updateMatrix();mesh.setMatrixAt(i,transform.matrix);}if(points.length)mesh.instanceMatrix.needsUpdate=true;}};
}
