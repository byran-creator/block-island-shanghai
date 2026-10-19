import * as THREE from './three.module.js';
import {riverCenter} from './shanghai-map.js';
import {batchMeshes,staticMeshes} from './mesh-batch.js';
import {boatLocal} from './boat-support.js';
export const CRUISE_CYCLE=190,CRUISE_DWELL=30,CRUISE_LEVELS=[1.1,3.65,6.2];
export const CRUISE_STAIRS=[{x:1.65,z1:-3.9,z2:1.7,low:1.1,high:3.65},{x:-1.65,z1:3.9,z2:-1.7,low:3.65,high:6.2}];
// Optional sightseeing circuit returns to its west-bank pier. No endpoint flips.
export function cruisePose(time,index=0){
 const t=((time+index*CRUISE_CYCLE/2)%CRUISE_CYCLE+CRUISE_CYCLE)%CRUISE_CYCLE,a=Math.PI*1.5+Math.max(0,t-CRUISE_DWELL)/(CRUISE_CYCLE-CRUISE_DWELL)*Math.PI*2;
 const z=78+40*Math.cos(a),dz=-40*Math.sin(a),slope=(riverCenter(z+.01)-riverCenter(z-.01))/.02,dx=slope*dz+13*Math.cos(a);
 return {x:riverCenter(z)-32+13*Math.sin(a),y:22.22,z,yaw:Math.atan2(dx,dz)+Math.PI,moored:t<CRUISE_DWELL,remaining:CRUISE_DWELL-t};
}
const box=new THREE.BoxGeometry(1,1,1),materials=new Map();
function mat(color,glow=false){const k=color+glow;if(!materials.has(k))materials.set(k,glow?new THREE.MeshBasicMaterial({color}):new THREE.MeshLambertMaterial({color}));return materials.get(k);}
function cube(parent,color,x,y,z,w,h,d,glow=false){const m=new THREE.Mesh(box,typeof color==='string'?mat(color,glow):color);m.position.set(x,y,z);m.scale.set(w,h,d);m.userData.range=285;parent.add(m);return m;}
let deckMaterial,trimMaterial;
function patterned(kind){
 if(typeof document==='undefined')return mat(kind==='deck'?'#ba986d':'#244d63');
 const c=document.createElement('canvas');c.width=512;c.height=128;const g=c.getContext('2d');
 if(kind==='deck'){g.fillStyle='#ba986d';g.fillRect(0,0,512,128);for(let y=0;y<128;y+=16){g.fillStyle=y%32?'#ad8b60':'#c5a477';g.fillRect(0,y,512,15);g.strokeStyle='#735a3c';g.beginPath();g.moveTo(0,y);g.lineTo(512,y);g.stroke();for(let x=(y%32)*8;x<512;x+=128){g.fillStyle='#735a3c';g.fillRect(x,y,1,15);g.strokeStyle='#d6b88d';g.beginPath();g.moveTo(x+10,y+5);g.lineTo(x+100,y+6);g.stroke();}}}
 else{g.fillStyle='#193e55';g.fillRect(0,0,512,128);g.strokeStyle='#dbbf7c';g.lineWidth=3;g.strokeRect?.(0,12,512,104);for(let x=-80;x<550;x+=90){g.beginPath();g.moveTo(x,92);g.bezierCurveTo?.(x+25,20,x+65,20,x+90,92);g.stroke();g.strokeStyle='#72c8d9';g.beginPath();g.moveTo(x,104);g.bezierCurveTo?.(x+25,42,x+65,42,x+90,104);g.stroke();g.strokeStyle='#dbbf7c';}}
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=2;return new THREE.MeshLambertMaterial({map:t});
}
function hull(root,color,low,high){
 const outline=[[0,-9.8],[2.1,-8.3],[2.8,-6.7],[2.8,7.7],[2.3,9.1],[-2.3,9.1],[-2.8,7.7],[-2.8,-6.7],[-2.1,-8.3]],v=[];
 for(let i=0;i<outline.length;i++){const [x,z]=outline[i],[u,w]=outline[(i+1)%outline.length];v.push(x*.86,low,z,x,high,z,u,high,w,x*.86,low,z,u,high,w,u*.86,low,w,0,high,0,u,high,w,x,high,z);}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.computeVertexNormals();const m=new THREE.Mesh(g,mat(color));m.userData.range=285;root.add(m);
}
function plate(root,y,holes=[]){
 const xs=[-2.55,2.55,...holes.flatMap(h=>[h.x1,h.x2])].sort((a,b)=>a-b),zs=[-7.1,7.8,...holes.flatMap(h=>[h.z1,h.z2])].sort((a,b)=>a-b);
 for(let i=1;i<xs.length;i++)for(let j=1;j<zs.length;j++){const x=(xs[i-1]+xs[i])/2,z=(zs[j-1]+zs[j])/2;if(holes.some(h=>x>h.x1&&x<h.x2&&z>h.z1&&z<h.z2))continue;cube(root,deckMaterial,x,y-.08,z,xs[i]-xs[i-1],.16,zs[j]-zs[j-1]);}
}
function rail(root,night,y,x,z,length,axis,tint){const h=axis==='x';cube(root,'#e8e9e0',x,y+.95,z,h?length:.045,.045,h?.045:length);cube(night,tint,x,y+.91,z,h?length:.04,.04,h?.04:length,true);for(let d=-length/2;d<=length/2+.01;d+=.9)cube(root,'#bbc9cc',x+(h?d:0),y+.49,z+(h?0:d),.035,.92,.035);}
function namePanels(root,night,name,tint){
 if(typeof document==='undefined')return;const c=document.createElement('canvas');c.width=512;c.height=128;const g=c.getContext('2d');g.fillStyle='#132c43';g.fillRect(0,0,512,128);g.strokeStyle='#d8c28b';g.lineWidth=3;g.strokeRect?.(7,7,498,114);g.textAlign='center';g.fillStyle='#fff1c4';g.font='600 54px "Microsoft YaHei",sans-serif';g.fillText(name,256,68);g.font='15px sans-serif';g.fillStyle=tint;g.fillText('HUANGPU RIVER · SHANGHAI',256,101);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;const material=new THREE.MeshBasicMaterial({map:t});
 for(const side of [-1,1])for(const [parent,x,y,z]of [[root,side*2.815,.45,-1],[night,side*1.9,8.97,3.4]]){const m=new THREE.Mesh(new THREE.PlaneGeometry(3.6,.9),material);m.rotation.y=side*Math.PI/2;m.position.set(x,y,z);m.userData.range=240;parent.add(m);}
}
export function cruiseFloorAt(ship,x,z,feet){const p=boatLocal(ship.root,x,z);for(const s of CRUISE_STAIRS){const t=(p.z-s.z1)/(s.z2-s.z1);if(Math.abs(p.x-s.x)<.71&&t>=-.06&&t<=1.06){const h=ship.root.position.y+s.low+Math.max(0,Math.min(1,t))*(s.high-s.low);if(Math.abs(feet-h)<.65)return h;}}return null;}
export function createHuangpuCruises(scene){
 deckMaterial??=patterned('deck');trimMaterial??=patterned('trim');
 return ['浦江明珠','云帆华彩'].map((name,index)=>{
  const root=new THREE.Group(),night=new THREE.Group(),glass=new THREE.Group(),glassMaterials=[],tint=index?'#e49bff':'#77dfff',warm='#ffdc97';root.name='huangpu-luxury-cruise-'+index;root.add(night,glass);scene.add(root);hull(root,index?'#354766':'#23465f',-.42,.68);hull(root,'#e9eadf',.67,1.04);
  const surfaces=[{top:1.1,rx:2.55,rz:7.45,z:.35,solidHeight:1.52}],walls=[];
  const wall=(x,y,z,w,h,d)=>walls.push({x,z,rx:w/2,rz:d/2,top:y+h/2,solidHeight:h,solidOnly:true});
  const holes=CRUISE_STAIRS.map(s=>({x1:s.x-.74,x2:s.x+.74,z1:Math.min(s.z1,s.z2)-.25,z2:Math.max(s.z1,s.z2)+.25}));
  for(let level=0;level<3;level++){
   const y=CRUISE_LEVELS[level],opening=level?[holes[level-1]]:[];plate(root,y,opening);if(level)surfaces.push({top:y,rx:2.55,rz:7.45,z:.35,holes:opening});
   for(const side of [-1,1]){cube(root,'#e8e9e0',side*2.59,y-.18,.35,.16,.36,14.9);cube(root,trimMaterial,side*2.69,y-.17,.35,.09,.25,14.9);cube(night,tint,side*2.74,y-.04,.35,.055,.12,14.9,true);cube(night,warm,side*2.74,y-.30,.35,.05,.075,14.9,true);for(let z=-6.8;z<7.7;z+=.58)cube(night,warm,side*2.71,y-.18,z,.045,.055,.09,true);}
   if(level===2)continue;
   const glassMat=new THREE.MeshLambertMaterial({color:'#a2d6df',transparent:true,opacity:.3,emissive:'#000000',emissiveIntensity:.65,depthWrite:false,side:THREE.DoubleSide});
   glassMaterials.push(glassMat);
   for(const side of [-1,1]){const sections=level===0&&side===1?[[-7,3.6],[6.6,7.7]]:[[-7,7.7]];
    for(const [a,b]of sections){cube(root,'#e8e9e0',side*2.5,y+.23,(a+b)/2,.1,.46,b-a);const window=cube(glass,glassMat,side*2.5,y+1.4,(a+b)/2,.025,1.7,b-a);window.name='transparent-panorama';wall(side*2.5,y+1.15,(a+b)/2,.07,2.3,b-a);for(let z=a;z<=b;z+=1.15){cube(root,'#e8e9e0',side*2.5,y+1.47,z,.09,2.05,.09);cube(night,warm,side*2.46,y+1.73,z,.04,1.05,.11,true);}}
    cube(root,'#e8e9e0',side*2.5,y+2.38,.35,.12,.18,14.8);cube(night,warm,side*2.43,y+2.32,.35,.055,.045,14.4,true);
   }
   for(const z of [-7.05,7.75]){cube(glass,glassMat,0,y+1.35,z,4.95,1.8,.03);cube(root,'#e8e9e0',0,y+.2,z,5,.4,.1);wall(0,y+1.15,z,5,2.3,.07);}
   cube(night,'#cfb582',0,y+2.33,.35,1.2,.025,12.8,true);
   for(const z of [-5.7,5.5])for(const x of [-.85,.85]){cube(root,'#283c4f',x,y+.23,z,.58,.46,.65);cube(root,'#bd9c6e',x,y+.53,z,.6,.12,.65);wall(x,y+.28,z,.62,.56,.68);}
   for(const z of [-5.7,5.5]){cube(root,'#bd9c6e',0,y+.73,z,.8,.09,.75);wall(0,y+.4,z,.85,.8,.8);}
  }
  for(const s of CRUISE_STAIRS){const run=Math.abs(s.z2-s.z1),rise=s.high-s.low,sign=Math.sign(s.z2-s.z1),count=22;
   for(let i=0;i<count;i++){const z=s.z1+(i+.5)/count*(s.z2-s.z1),h=rise*(i+1)/count;cube(root,'#c7b58e',s.x,s.low+h-.055,z,1.36,.11,run/count+.01);cube(night,warm,s.x,s.low+h-.03,z-sign*run/count/2,1.25,.025,.025,true);}
   surfaces.push({x:s.x,z:(s.z1+s.z2)/2,rx:.68,rz:run/2+.55,minTop:s.low,maxTop:s.high,top:(s.low+s.high)/2,slopeZ:rise/(s.z2-s.z1),solidHeight:.11,stair:true});
   for(const [z,y]of [[s.z1,s.low],[s.z2,s.high]])cube(root,'#c7b58e',s.x,y-.055,z,1.36,.11,.7);
   for(const side of [-1,1])for(let i=0;i<=8;i++){const t=i/8;cube(root,'#e8e9e0',s.x+side*.72,s.low+t*rise+.5,s.z1+t*(s.z2-s.z1),.035,1,.035);}
  }
  const top=CRUISE_LEVELS[2];for(const side of [-1,1]){rail(root,night,top,side*2.5,.35,14.5,'z',tint);wall(side*2.53,top+.5,.35,.045,1,14.9);}for(const z of [-7.05,7.75]){rail(root,night,top,0,z,5,'x',tint);wall(0,top+.5,z,5,1,.045);}
  cube(root,'#e8e9e0',0,top+.92,-5.65,3.8,1.84,2.5);cube(root,'#4d8396',0,top+1.1,-6.92,3.55,.95,.035);cube(root,'#e8e9e0',0,top+1.91,-5.65,4,.15,2.8);wall(0,top+.92,-5.65,3.8,1.84,2.5);
  for(const x of [-1.9,1.9])for(const z of [.5,6.6])cube(root,'#e8e9e0',x,top+1.15,z,.07,2.3,.07);cube(root,'#e8e9e0',0,top+2.34,3.5,4.1,.12,6.7);
  for(const z of [.16,6.84])cube(night,warm,0,top+2.34,z,4.16,.1,.07,true);
  for(const side of [-1,1]){cube(night,tint,side*2.07,top+2.32,3.5,.05,.06,6.7,true);for(let i=0;i<15;i++){const z=.4+i*.44,y=top+2.1-.25*Math.sin(i/14*Math.PI);cube(night,warm,side*1.93,y,z,.10,.12,.1,true);}}
  for(const x of [-1.75,1.75])for(const z of [3.7,6.5])cube(root,'#6c929c',x,top+.3,z,.56,.6,1.1);
  cube(root,'#c6d5db',0,top+2.6,-5.4,.09,1.5,.09);cube(root,'#e8e9e0',0,top+3.28,-5.4,1.3,.08,.15);
  const ring=new THREE.TorusGeometry(.28,.07,6,16);for(const side of [-1,1])for(const z of [-4,2.4]){const m=new THREE.Mesh(ring,mat('#ef9c49'));m.rotation.y=Math.PI/2;m.position.set(side*2.6,1.8,z);m.userData.range=200;root.add(m);}
  // Bow and stern outline lights continue the deck bands around the pointed hull.
  const edge=[[0,-9.8],[2.1,-8.3],[2.8,-6.7],[2.8,7.7],[2.3,9.1],[-2.3,9.1],[-2.8,7.7],[-2.8,-6.7],[-2.1,-8.3],[0,-9.8]];
  for(let i=1;i<edge.length;i++){const [x,z]=edge[i-1],[xx,zz]=edge[i],m=cube(night,tint,(x+xx)/2,.83,(z+zz)/2,.045,.055,Math.hypot(xx-x,zz-z),true);m.rotation.y=Math.atan2(xx-x,zz-z);}
  for(const side of [-1,1])for(let i=0;i<5;i++){const m=cube(night,warm,side*2.71,1.55+i*.13,-5.7+i*.32,.035,.14,.14,true);m.rotation.x=Math.PI/4;}
  namePanels(root,night,name,tint);batchMeshes(root,staticMeshes(root,new Set([night,glass])),'cruise-body');batchMeshes(night,staticMeshes(night),'cruise-night-decoration');
  const gate=cube(root,'#c9d6d7',2.5,2.1,5.1,.075,1.8,3);gate.name='boarding-gate';surfaces.push({x:2.5,z:5.1,rx:.04,rz:1.5,top:3.1,solidHeight:2,solidOnly:true,active:()=>!boat.moored});
  const boat={root,night,gate,glassMaterials,kind:'luxury-cruise',name,index,deckSurfaces:[...surfaces,...walls],levels:CRUISE_LEVELS};tickHuangpuCruise(boat,0,false);return boat;
 });
}
export function tickHuangpuCruise(boat,time,isNight){const p=cruisePose(time,boat.index);boat.root.position.set(p.x,p.y,p.z);boat.root.rotation.y=p.yaw;boat.moored=p.moored;boat.gate.visible=!p.moored;boat.remaining=p.remaining;boat.night.visible=isNight;for(const m of boat.glassMaterials)m.emissive.set(isNight?'#d7a34a':'#000000');if(deckMaterial?.isMeshLambertMaterial){deckMaterial.emissive.set(isNight?'#6d4f2c':'#000000');deckMaterial.emissiveIntensity=isNight?.5:0;}}
