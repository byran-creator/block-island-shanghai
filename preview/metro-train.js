import * as THREE from './three.module.js';
import {batchMeshes,staticMeshes} from './mesh-batch.js';

// Eight cars compressed to the existing 70-block station; door positions are shared
// by the model, screen doors, collision openings and passenger paths.
export const METRO_CARS=Array.from({length:8},(_,i)=>-28+i*8);
export const METRO_DOOR_CENTERS=METRO_CARS.flatMap(x=>[x-2,x+2]);
export const METRO_DOOR_WIDTH=1.6;
export function nearestMetroDoor(x){return METRO_DOOR_CENTERS.reduce((a,b)=>Math.abs(b-x)<Math.abs(a-x)?b:a);}
export function createSlidingDoor(parent,cube,{x,z,y=1.62,height=2.9,width=METRO_DOOR_WIDTH,screen=false,lineColor='#8bd047',screenColor='#85b2bf'}){
 const leaves=[];
 for(const sign of [-1,1]){const leaf=new THREE.Group();parent.add(leaf);leaf.position.set(x+sign*width/4,y,z);
  cube(leaf,screen?screenColor:'#b8c1c5',0,0,0,width/2-.025,height,screen?.1:.09,screen?.4:1);
  if(!screen){cube(leaf,'#162d3a',0,.38,Math.sign(z)*.055,width/2-.16,1.05,.025,.75);cube(leaf,lineColor,0,-.88,Math.sign(z)*.06,width/2-.04,.17,.035);}
  leaves.push({mesh:leaf,sign,closed:x+sign*width/4});
 }
 return {x,z,width,leaves,amount:0,set(amount){this.amount=Math.max(0,Math.min(1,amount));for(const l of leaves)l.mesh.position.x=l.closed+l.sign*this.amount*(width/2+.08);}};
}
export function createMetroTrain({parent,direction,cube,board,person,cars=METRO_CARS,lineNumber=2,lineColor='#96d33d',modelName='02A05',stationNames=['南京东路','陆家嘴'],destinationLabels=['浦东方向','市区方向']}){
 const root=new THREE.Group();root.name='line-'+lineNumber+'-'+modelName;parent.add(root);const doors=[],passengers=[];let route=null;
 for(const car of cars){
  cube(root,'#a8b3b9',car,.02,0,7.75,.15,2.65);cube(root,'#cbd1d3',car,3.28,0,7.7,.16,2.72);
  cube(root,'#e5e9e8',car,3.13,0,7.5,.1,2.5);cube(root,'#edf7f5',car,3.02,0,6.5,.055,.16);
  cube(root,'#687882',car,3.48,0,4.6,.22,1.35);
  for(const side of [-1,1]){
   // Side body segments leave real full-height apertures for the paired doors.
   for(const [dx,w] of [[-3.5,.55],[0,2.2],[3.5,.55]]){
    cube(root,'#aeb9bd',car+dx,1.65,side*1.33,w,3.05,.09);
    cube(root,'#27353c',car+dx,2.05,side*1.385,w,1.18,.025);
    if(dx===0)cube(root,'#83aaba',car+dx,2.08,side*1.402,1.8,.87,.025,.42);
    cube(root,lineColor,car+dx,.62,side*1.393,w,.2,.028);
   }
   for(const dx of [-2,2]){cube(root,'#b4c0c4',car+dx,3.04,side*1.33,1.65,.3,.1);doors.push({...createSlidingDoor(root,cube,{x:car+dx,z:side*1.34,lineColor}),side});}
   cube(root,'#a8c7c2',car,.48,side*.98,1.85,.15,.45);cube(root,'#90aba7',car,.82,side*1.17,1.85,.64,.1);
  }
  for(const dx of [-1,1]){cube(root,'#dbe5e7',car+dx,1.64,0,.045,2.95,.045);cube(root,'#313b44',car+dx*2.6,-.24,0,1.1,.3,2.15);}
  for(const side of [-1,1])for(const dx of [-2,2]){let panel;if(!route){route=board(root,[stationNames[direction===1?0:1],stationNames[direction===1?1:0],String(direction)],car+dx,2.85,side*1.25,2.7,.42,'#17201c','#fbfcf7',{layout:'route'});panel=route.mesh;}else{panel=route.mesh.clone();root.add(panel);}if(side===1){const [front,back]=panel.children;const material=front.material;front.material=back.material;back.material=material;panel.userData.signFaces={front:route.mesh.userData.signFaces.back,back:route.mesh.userData.signFaces.front};}panel.position.set(car+dx,2.85,side*1.25);panel.rotation.y=side===1?Math.PI:0;}
  if(car!==cars.at(-1)){for(const side of [-1,1])cube(root,'#323b42',car+4,1.55,side*1.02,.25,2.9,.14);cube(root,'#616d72',car+4,3,0,.25,.12,2.12);cube(root,'#616d72',car+4,.08,0,.25,.12,2.12);}
 }
 // Faceted, sloping black windshield and the characteristic lime headlight band.
 for(const end of [-1,1]){const cab=new THREE.Group();root.add(cab);cab.position.x=end*(cars.at(-1)+3.3);
  cube(cab,'#aeb9bd',end*.25,1.55,0,.65,3.05,2.55);
  const glass=cube(cab,'#182b38',end*.62,2.1,0,.055,1.8,2.1);glass.rotation.z=end*.1;
  cube(cab,'#a8b4b9',end*.67,1.95,0,.065,1.7,.17);
  for(const side of [-1,1]){const stripe=cube(cab,lineColor,end*.7,1.13,side*.57,.07,.14,1.04);stripe.rotation.x=side*.14;cube(cab,end===direction?'#fff3ba':'#ff705a',end*.76,1.18,side*.99,.07,.13,.23);}
  if(lineNumber===10){for(const side of [-1,1]){cube(cab,lineColor,end*.72,1.65,side*1.02,.1,2.15,.48);const light=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,.035,12),new THREE.MeshBasicMaterial({color:end===direction?'#fff2b0':'#ff7563'}));light.rotation.z=Math.PI/2;light.position.set(end*.8,1.12,side*.99);cab.add(light);cube(cab,'#24343c',end*.82,1.63,side*.93,.08,.16,.18);}cube(cab,'#303c45',end*.25,3.11,0,.9,.24,2.48);}
  cube(cab,'#55636b',end*.75,.55,0,.09,.27,1.4);cube(cab,'#313c44',end*.84,.04,0,.35,.22,.42);
  const destination=board(cab,[destinationLabels[direction===1?0:1],lineNumber+'  ·  '+modelName],end*.68,2.7,0,1.75,.47,'#ffb56a');destination.mesh.rotation.y=end*Math.PI/2;
 }
 for(let i=0;i<cars.length*6;i++){const car=i%cars.length,side=(car%2?1:-1)*(i<cars.length*3?1:-1),j=Math.floor((i%(cars.length*3))/cars.length),p=person(root,i,cars[car]+(j-1)*.6,-.13,side*.98);p.rotation.y=side>0?0:Math.PI;p.userData.seatId=car+':'+side+':'+j;for(const index of [4,6])if(p.children[index])p.children[index].rotation.x=1;for(const index of [3,5])if(p.children[index]){p.children[index].position.x=Math.sign(p.children[index].position.x)*.22;p.children[index].rotation.x=1;}batchMeshes(p,staticMeshes(p),'seated-passenger');passengers.push(p);}
 const dynamic=new Set([...doors.flatMap(d=>d.leaves.map(l=>l.mesh)),...passengers]);batchMeshes(root,staticMeshes(root,dynamic),'02A05-body');
 return {root,doors,passengers,route};
}

