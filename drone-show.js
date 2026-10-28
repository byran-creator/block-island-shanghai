import * as THREE from './three.module.js';
import {DRONE_COUNT,droneWordTargets} from './drone-lettering.js';
export const DRONE_CENTER={x:145,y:120,z:105};
export const SHOW_VIEW={x:52.5,y:26,z:90.5};
export function createDroneShow(scene){
 const chinese=droneWordTargets('zh'),english=droneWordTargets('en');
 const group=new THREE.Group(),geometry=new THREE.BoxGeometry(.62,.62,.62),red=new THREE.MeshBasicMaterial({color:'#ff6752',fog:false}),gold=new THREE.MeshBasicMaterial({color:'#ffe891',fog:false});scene.add(group);group.visible=false;
 const drones=chinese.map((p,i)=>{const mesh=new THREE.Mesh(geometry,i%5?gold:red);mesh.userData.range=230;group.add(mesh);return {mesh,target:new THREE.Vector3(DRONE_CENTER.x,DRONE_CENTER.y+p.y,DRONE_CENTER.z+p.z)};});
 const scratch=new THREE.Vector3(),warmRed=new THREE.Color('#ff6752'),warmGold=new THREE.Color('#ffe891'),titleAccent=new THREE.Color('#ffcf78'),iceAccent=new THREE.Color('#a9dfff'),iceWhite=new THREE.Color('#e1f5ff');let elapsed=0,phase='待机',word=null;
 function setWord(next){if(word===next)return;word=next;const points=next==='zh'?chinese:english;for(let i=0;i<DRONE_COUNT;i++){const p=points[i];drones[i].target.set(DRONE_CENTER.x,DRONE_CENTER.y+p.y,DRONE_CENTER.z+p.z);}}
 function start(){elapsed=0;phase='升空';word=null;group.visible=true;for(let i=0;i<drones.length;i++){const a=i*2.39996,r=4+Math.sqrt(i/drones.length)*14;drones[i].mesh.position.set(DRONE_CENTER.x+Math.cos(a)*r,25+i%3*.4,105+Math.sin(a)*r);}}
 function tick(dt,active){if(!active){group.visible=false;phase='待机';return;}group.visible=true;elapsed+=dt;phase=elapsed<6?'升空':elapsed<10?'爱心':elapsed<25?'欢迎来到上海':'WELCOME';const smoothing=1-Math.exp(-dt*3.5),titleMix=THREE.MathUtils.smoothstep(elapsed,9,11),iceMix=THREE.MathUtils.smoothstep(elapsed,24,27);red.color.copy(warmRed).lerp(titleAccent,titleMix).lerp(iceAccent,iceMix);gold.color.copy(warmGold).lerp(iceWhite,iceMix);if(elapsed>=10)setWord(elapsed<25?'zh':'en');
  for(let i=0;i<drones.length;i++){const d=drones[i],a=i/drones.length*Math.PI*2;let target=d.target;
   if(elapsed<6){const r=8+Math.sqrt(i/drones.length)*12;target=scratch.set(DRONE_CENTER.x+Math.cos(a+elapsed*.35)*r,26+Math.min(1,elapsed/5)*(DRONE_CENTER.y-26),105+Math.sin(a+elapsed*.35)*r);}
   else if(elapsed<10)target=scratch.set(DRONE_CENTER.x,DRONE_CENTER.y+(13*Math.cos(a)-5*Math.cos(2*a)-2*Math.cos(3*a)-Math.cos(4*a))*.9,105+16*Math.sin(a)**3*.9);
   d.mesh.position.lerp(target,smoothing);d.mesh.scale.setScalar(elapsed>39?Math.max(0,(42-elapsed)/3):.92+Math.sin(elapsed*2+i*.3)*.08);
  }
 }
 return {start,tick,drones,get phase(){return phase},get elapsed(){return elapsed}};
}
