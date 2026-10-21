import * as THREE from './three.module.js';
import {tutorialRouteSearch,tutorialRoutePrefix} from './tutorial-route.js';
import {signalPhase} from './city-traffic.js';

// Six shared route arrows; cached planning, live prefix checks twice a second.
export function createTutorialTrail(scene,world,blocked=()=>false){
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute([0,0,-.55,.36,0,0,.13,0,-.04,.13,0,.4,-.13,0,.4,-.13,0,-.04,-.36,0,0],3));geometry.setIndex([0,1,6,2,3,4,2,4,5]);
 const material=new THREE.MeshBasicMaterial({color:'#ffe49a',transparent:true,opacity:.8,side:THREE.DoubleSide,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1,fog:false});
 const mesh=new THREE.InstancedMesh(geometry,material,6);mesh.name='tutorial-ground-arrows';mesh.userData.photoHide=true;mesh.visible=false;mesh.frustumCulled=false;scene.add(mesh);const transform=new THREE.Object3D();
 let route=null,search=null,destination='',lastAttempt=-Infinity,waiting=false,now=0,latest=null;
 function prefix(){const {ctx}=latest,phase=ctx.traffic?signalPhase(ctx.traffic.time,0):null;
  return tutorialRoutePrefix(world,ctx.pos,route,{blocked,canCross:c=>!!phase&&phase.ew==='green'&&phase.remaining>=10&&!(ctx.traffic.agents??[]).some(v=>v.root.visible!==false&&Math.abs(v.root.position.y-26)<3&&v.root.position.z>=56&&v.root.position.z<=76&&v.root.position.x>=c.west&&v.root.position.x<=c.east&&Math.abs(v.travelSpeed??v.speed??0)>.2)});
 }
 function paint(result){waiting=result.waiting;const points=result.points;mesh.visible=points.length>0;mesh.count=points.length;for(const [i,p]of points.entries()){transform.position.set(p.x,p.y,p.z);transform.rotation.set(p.pitch??0,p.yaw,0,'YXZ');const size=p.y<25.5||Math.abs(p.pitch??0)>.05?1.2:1.8;transform.scale.set(size,1,size);transform.updateMatrix();mesh.setMatrixAt(i,transform.matrix);}if(points.length)mesh.instanceMatrix.needsUpdate=true;}
 return {hide(){mesh.visible=false;waiting=false;search=null;latest=null;},get waiting(){return waiting;},work(){if(!search||!latest)return;const step=search.next();if(step.done){route=step.value;search=null;paint(prefix());}},update(state,ctx,goal,enabled=true){now+=.5;const allowed=enabled&&state.phase==='journey'&&state.tracked&&state.index<3&&!ctx.ride;if(!allowed||!world||!goal){mesh.visible=false;waiting=false;search=null;latest=null;route=null;destination='';return;}
  latest={ctx,goal};const signature=[state.index,goal.x,goal.y,goal.z,goal.stage].join(':');if(signature!==destination){destination=signature;route=null;search=null;lastAttempt=-Infinity;}
  const result=prefix();if((!route||result.offRoute||result.invalid)&&!search&&now-lastAttempt>=2){lastAttempt=now;search=tutorialRouteSearch(world,{...ctx.pos},goal,{blocked});mesh.visible=false;waiting=false;}else if(!search)paint(result);
 }};
}
