import * as THREE from './three.module.js';
import {createStreetCrowd} from './street-crowd.js';
import {overlaps} from './world.js';
import {CITY} from './shanghai-map.js';

// Four existing, connected forecourts; no new paving or routes across roads.
export const LUJIAZUI_FORECOURTS=[
 {id:'financial-plaza',role:'office',count:4,x1:183,x2:198,z1:40,z2:58,target:CITY.jinmao},
 {id:'tower-offices',role:'office',count:4,x1:176,x2:182,z1:110,z2:118,target:CITY.shanghai},
 {id:'swfc-visitors',role:'visitor',count:5,x1:200,x2:206,z1:95,z2:106,target:CITY.swfc},
 {id:'jinmao-visitors',role:'visitor',count:5,x1:173,x2:179,z1:74,z2:85,target:CITY.jinmao}
];
export function createLujiazuiPeople({person,cube}){
 const people=[];
 for(const [index,area]of LUJIAZUI_FORECOURTS.entries())for(let i=0;i<area.count;i++){
  const p={...person(320+index*8+i,undefined,area.role),district:'lujiazui',forecourt:area.id,kind:area.role==='office'?'office-walk':'tower-visitor',phase:i*1.7+index};
  if(area.role==='office'){
   cube(p.root,i%2?'#283645':'#69523e',.39,.57,.04,.22,.34,.38);
   cube(p.root,'#b8b2a0',.39,.77,.04,.13,.06,.17);
  }else if(i%2===0){
   // Shoulder pivots keep raised hands in front of the face, around the lens.
   p.arms=p.arms.map(arm=>{const pivot=new THREE.Group();pivot.position.copy(arm.position);pivot.position.y=1.28;arm.position.set(0,-.26,0);pivot.add(arm);p.root.add(pivot);return pivot;});
   p.camera=new THREE.Group();p.root.add(p.camera);
   cube(p.camera,'#27343c',0,0,0,.25,.17,.13);
   cube(p.camera,'#7ba3af',0,0,-.09,.13,.13,.05);
   cube(p.camera,'#243c49',0,0,-.12,.08,.08,.015);
  }else cube(p.root,'#b99865',.3,.7,.12,.19,.28,.17);
  people.push(p);
 }
 return people;
}
export function createLujiazuiFlow(people,{world,others}){
 const clear=q=>[6,7,9].includes(world.get(Math.floor(q.x),25,Math.floor(q.z)))&&!overlaps(world,q.x,q.y,q.z)&&overlaps(world,q.x,q.y-.1,q.z);
 const flows=LUJIAZUI_FORECOURTS.map((area,i)=>createStreetCrowd(people.filter(p=>p.forecourt===area.id),{area,clear,others,seedOffset:500+i*41}));
 return {tick(dt,vehicles=[]){
  for(const flow of flows)flow.tick(dt,vehicles);
  for(const p of people)if(p.camera&&p.ready){
   const area=LUJIAZUI_FORECOURTS.find(a=>a.id===p.forecourt),taking=p.crowd.state==='browse';
   p.photoLift=(p.photoLift??0)+((taking?1:0)-(p.photoLift??0))*(1-Math.exp(-dt*5));
   const lift=p.photoLift;p.camera.position.set(.08*(1-lift),1+lift*.49,-.24-lift*.17);
   if(taking){p.crowd.targetYaw=Math.atan2(area.target.x-p.root.position.x,area.target.z-p.root.position.z)+Math.PI;for(let i=0;i<2;i++)p.arms[i].rotation.set(.15+lift*1.85,0,(i?-.4:.4)*lift);}
  }
 }};
}
