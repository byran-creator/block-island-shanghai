import * as THREE from './three.module.js';
import {HEIGHT} from './world.js';

export function rainExposure(world,p){
 if(p.y<23)return 0;
 for(let y=Math.floor(p.y+2.1);y<HEIGHT;y++){const block=world.get(Math.floor(p.x),y,Math.floor(p.z));if(block&&block!==5)return .12;}
 return 1;
}
const palettes=['#456778','#804f65','#a38b68','#48786c'];
const shaftGeometry=new THREE.CylinderGeometry(.012,.012,1.34,6),shaftMaterial=new THREE.MeshLambertMaterial({color:'#73818b'});
const canopyGeometry=new THREE.BufferGeometry(),vertices=[],colors=[];
for(let i=0;i<8;i++)for(const [a,r,y,b,s,h]of [[i,0,.31,i,.40,.23],[i,.40,.23,i,.73,0]]){
 const angle=n=>n*Math.PI/4,points=[[r*Math.cos(angle(a)),y,r*Math.sin(angle(a))],[s*Math.cos(angle(b)),h,s*Math.sin(angle(b))],[s*Math.cos(angle(b+1)),h,s*Math.sin(angle(b+1))]];
 if(r){points.push([r*Math.cos(angle(a+1)),y,r*Math.sin(angle(a+1))]);for(const j of [0,1,2,0,2,3]){vertices.push(...points[j]);colors.push(...[1,1,1].map(()=>i%2?.85:1));}}
 else for(const p of points){vertices.push(...p);colors.push(...[1,1,1].map(()=>i%2?.85:1));}
}
canopyGeometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));canopyGeometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));canopyGeometry.computeVertexNormals();
const materials=palettes.map(color=>new THREE.MeshLambertMaterial({color,vertexColors:true,side:THREE.DoubleSide}));

export function createRainCrowd(people,{world}){
 const entries=[],seen=new Set();
 for(const [i,p]of people.entries()){
  if(!p.root||seen.has(p.root))continue;seen.add(p.root);
  // A minority carry umbrellas; photographers keep their two-handed camera pose.
  if(i%3!==1||p.camera||p.indoor||!p.arms?.length)continue;
  const root=new THREE.Group(),canopy=new THREE.Mesh(canopyGeometry,materials[i%4]),shaft=new THREE.Mesh(shaftGeometry,shaftMaterial);
  root.name='rain-umbrella';root.position.set(-.29,0,-.25);root.visible=false;
  canopy.position.y=2.06;shaft.position.y=1.7;canopy.userData.range=shaft.userData.range=65;
  root.add(canopy,shaft);p.root.add(root);entries.push({person:p,root,arm:p.arms[0],tag:p.root.children.find(o=>o.userData.npcName),held:false,check:0,exposure:0});
 }
 function beginTick(){for(const e of entries)if(e.held){e.arm.rotation.x=e.previousArm;e.held=false;}}
 function tick(dt,rain){if(rain<=.13){for(const e of entries){e.root.visible=false;if(e.tag)e.tag.position.y=2.2;}return;}for(const e of entries){
  const p=e.person.root.position,cell=[Math.floor(p.x),Math.floor(p.y),Math.floor(p.z)].join(',');
  e.check-=dt;if(e.check<=0||cell!==e.cell){e.check=.5;e.cell=cell;e.exposure=rainExposure(world,p);}
  const exposed=e.exposure>.5&&e.person.root.position.y>=23;
  e.root.visible=rain>(e.root.visible?.13:.25)&&exposed&&e.person.root.visible!==false&&e.person.ready!==false;
  if(e.tag)e.tag.position.y=e.root.visible?2.68:2.2;
  if(e.root.visible){e.previousArm=e.arm.rotation.x;e.arm.rotation.x=e.arm.isMesh?1.4:1.05;e.held=true;}
 }}
 return {entries,beginTick,tick};
}
