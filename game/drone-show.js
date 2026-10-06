import * as THREE from './three.module.js';
export const DRONE_CENTER={x:145,y:80,z:105};
export const SHOW_VIEW={x:52.5,y:26,z:90.5};
// Each sampled stroke is a separate flying light, rather than a flat text billboard.
export function createDroneShow(scene){
 const canvas=document.createElement('canvas');canvas.width=112;canvas.height=32;const ctx=canvas.getContext('2d');// Fixed Chinese stroke paths keep the four glyphs legible even without CJK fonts.
 ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.lineCap='square';ctx.lineJoin='miter';
 const glyphs=[
  [[[3,4],[22,4],[22,24],[3,24],[3,4]],[[7,9],[18,9]],[[7,14],[18,14]],[[7,20],[18,20]],[[12,9],[12,20]],[[16,17],[18,18]]],
  [[[12,2],[14,4]],[[5,6],[23,6]],[[5,6],[5,16],[2,24]],[[9,13],[22,13]],[[15,9],[14,17],[8,24]],[[14,16],[18,21],[23,24]]],
  [[[5,3],[5,24]],[[2,10],[1,15]],[[8,9],[10,12]],[[12,8],[20,8],[20,15]],[[10,15],[24,15]],[[16,3],[16,15],[13,21],[10,24]],[[16,16],[19,21],[24,24]]],
  [[[22,3],[7,7]],[[7,7],[6,14],[23,14]],[[15,7],[15,23],[12,24]],[[10,18],[5,23]],[[19,18],[24,23]]]
 ];
 glyphs.forEach((paths,i)=>paths.forEach(path=>{ctx.beginPath();path.forEach(([x,y],j)=>j?ctx.lineTo(3+i*27+x,y+2):ctx.moveTo(3+i*27+x,y+2));ctx.stroke();}));
 const pixels=ctx.getImageData(0,0,112,32).data,targets=[];
 for(let y=2;y<30;y+=2)for(let x=2;x<110;x+=2)if(pixels[(y*112+x)*4+3]>100)targets.push({x:DRONE_CENTER.x,y:80+(16-y)*.65,z:105+(x-56)*.65});
 const group=new THREE.Group(),geometry=new THREE.BoxGeometry(.43,.43,.43),red=new THREE.MeshBasicMaterial({color:'#ff6752',fog:false}),gold=new THREE.MeshBasicMaterial({color:'#ffe891',fog:false});scene.add(group);group.visible=false;
 const drones=targets.map((target,i)=>{const mesh=new THREE.Mesh(geometry,i%5?gold:red);mesh.userData.range=230;group.add(mesh);return {mesh,target};});let elapsed=0,phase='待机';
 function start(){elapsed=0;phase='升空';group.visible=true;for(let i=0;i<drones.length;i++){const a=i*2.39996,r=4+Math.sqrt(i/drones.length)*14;drones[i].mesh.position.set(DRONE_CENTER.x+Math.cos(a)*r,25+i%3*.4,105+Math.sin(a)*r);}}
 function tick(dt,active){if(!active){group.visible=false;phase='待机';return;}group.visible=true;elapsed+=dt;phase=elapsed<6?'升空':elapsed<12?'爱心':elapsed<34?'国庆快乐':'星光谢幕';const smoothing=1-Math.exp(-dt*3.5);
  for(let i=0;i<drones.length;i++){const d=drones[i],a=i/drones.length*Math.PI*2;let target;
   if(elapsed<6){const r=8+Math.sqrt(i/drones.length)*12;target=new THREE.Vector3(DRONE_CENTER.x+Math.cos(a+elapsed*.35)*r,26+Math.min(1,elapsed/5)*54,105+Math.sin(a+elapsed*.35)*r);}
   else if(elapsed<12){target=new THREE.Vector3(DRONE_CENTER.x,80+(13*Math.cos(a)-5*Math.cos(2*a)-2*Math.cos(3*a)-Math.cos(4*a))*.9,105+16*Math.sin(a)**3*.9);}
   else if(elapsed<34){target=new THREE.Vector3(d.target.x,d.target.y,d.target.z);}
   else{const r=(i%2?15:7),angle=a+elapsed*.18;target=new THREE.Vector3(DRONE_CENTER.x,80+Math.cos(angle)*r,105+Math.sin(angle)*r);}
   d.mesh.position.lerp(target,smoothing);d.mesh.scale.setScalar(elapsed>39?Math.max(0,(42-elapsed)/3):.92+Math.sin(elapsed*2+i*.3)*.08);
  }
 }
 return {start,tick,drones,get phase(){return phase},get elapsed(){return elapsed}};
}
