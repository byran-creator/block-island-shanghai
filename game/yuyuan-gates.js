import * as THREE from './three.module.js';
import {INNER_GARDEN,INNER_GATES,GARDEN_WINDOWS,innerGardenContains} from './yuyuan-layout.js';

// The voxel slots are rectangular; the matching round frame remains solid.
export function moonFrameCollides(p,e,r=2.6,cy=28.1){
 const normal=e.axis==='z'?p.z:p.x,plane=(e.axis==='z'?e.z:e.x)+.5;
 const u=(e.axis==='z'?p.x-e.x:p.z-e.z);
 if(Math.abs(normal-plane)>.56+.29||Math.abs(u)>3.5+.29||p.y>=32||p.y+1.75<=26)return false;
 return [u-.29,u+.29].some(v=>[p.y,p.y+1.75].some(y=>v*v+(y-cy)**2>r*r));
}
export function insideGarden(p){return innerGardenContains(p.x,p.z);}
export function createYuyuanGates(root,{cube,mat,getPos,onProgress=()=>{},onEvent=()=>{}}){
 let ticket=false,entered=false;const gates=INNER_GATES.map(e=>({...e,open:0,last:null})),dynamicRoots=new Set();
 for(const e of gates){
  const group=new THREE.Group();group.position.set(e.x+(e.axis==='x'?.5:0),26,e.z+(e.axis==='z'?.5:0));if(e.axis==='x')group.rotation.y=Math.PI/2;root.add(group);dynamicRoots.add(group);
  function part(color,x,y,w,h,d){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(color));m.position.set(x,y,0);group.add(m);return m;}
  for(const side of [-1,1]){part('#596d63',side*1.13,.6,.45,1.2,.7);part('#8aa492',side*1.91,1.15,1.15,2.3,.09);part('#d3b778',side*1.13,1.23,.42,.07,.66);}
  e.leaf=part('#92b6a4',0,1.35,1.8,2.7,.08);e.indicator=part('#c58567',-1.13,1.3,.18,.035,.2);
 }
 const windowCollides=p=>GARDEN_WINDOWS.some(e=>moonFrameCollides(p,e,e.r,e.y));
 function collides(x,y,z){const p={x,y,z};if(windowCollides(p))return true;return gates.some(e=>{
  if(moonFrameCollides(p,e))return true;const u=e.axis==='z'?x-e.x:z-e.z,n=e.axis==='z'?z-e.z-.5:x-e.x-.5;
  return Math.abs(n)<.36+.29&&Math.abs(u)<2.6+.29&&y<28.7&&y+1.75>26&&(e.open<=0||Math.abs(u)>.9-.29);
 });}
 function near(p){return gates.find(e=>Math.hypot(p.x-e.x,p.z-e.z)<3.8&&p.y>=25&&p.y<28);}
 function claim(){if(!ticket){ticket=true;onProgress();}return ticket;}
 function open(e){const p=getPos();if(!ticket&&!insideGarden(p))return false;e.open=8;e.last=null;return true;}
 function tick(dt){const p=getPos();for(const e of gates){
  const previous=e.open;e.open=Math.max(0,e.open-dt);const u=e.axis==='z'?p.x-e.x:p.z-e.z,n=e.axis==='z'?p.z-e.z-.5:p.x-e.x-.5;
  // Leave enough time to clear the plane, including when a panel pauses time.
  if(previous>0&&Math.abs(n)<.8&&Math.abs(u)<1.2)e.open=Math.max(e.open,.5);
  e.leaf.visible=e.open<=0;e.indicator.material=mat(e.open>0?'#72cda0':'#c58567');
  if(e.open>0&&Math.abs(u)<.65&&p.y>=25.9&&p.y<27){const side=Math.sign(n);if(Math.abs(n)>.5){if(e.last!==null&&side!==e.last){const inward=e.axis==='z'?side>0:side>0;if(inward){if(ticket&&!entered){entered=true;onEvent({type:'yuyuan-entry'});onProgress();}}else{entered=false;ticket=false;onProgress();}}e.last=side;}}
  else e.last=null;
 }}
 return {gates,dynamicRoots,near,claim,open,collides,tick,get ticket(){return ticket;},get entered(){return entered;},serialize:()=>({ticket,entered}),restore(d){ticket=!!d?.ticket;entered=!!d?.entered;for(const e of gates){e.open=0;e.last=null;}}};
}
