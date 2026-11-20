import {createWorldCaption} from './world-caption.js';
import * as THREE from './three.module.js';
import {LANDMARKS,SHANGHAI,towerProfile,WORLD_SHIFT} from './world.js';
import {CITY,BRIDGES} from './shanghai-map.js';
import {showCue} from './show-cues.js';
import {nanpuSurfaceAt,NANPU_PYLONS,NANPU_LEGS} from './bridge-road.js';
import {batchMeshes} from './mesh-batch.js';
import {updateHudHidden,updateHudText} from './hud-text.js';
const $=id=>document.getElementById(id);
// The at-grade Nanpu approaches meet streets and must not carry floating rails.
export function bridgeRailSegmentAllowed(bridge,a,b){return bridge.id!=='nanpu'||Math.min(a.x,b.x)>=136&&Math.max(a.x,b.x)<=275;}
export function createSkyline({scene,getPos,notify,pause,resume,teleport,grantGlider,onProgress,onEvent=()=>{},lookAt=()=>{}}){
 let panel=false,visited=false;const lines=[];const material=new THREE.MeshBasicMaterial({color:'#a6e8ff',fog:true});
 function sign(text,p){const root=createWorldCaption(text,{color:'#c2f1ff',width:5.7});root.position.set(p.x,p.y+3,p.z);root.updateMatrix();root.matrixAutoUpdate=false;scene.add(root);}
 sign('上海中心大厦 · V 乘电梯',LANDMARKS.shanghai);sign('空中花园 · V 换楼层',LANDMARKS.skyGarden);sign('巅峰观景台 · P 展开滑翔伞',LANDMARKS.skyDeck);
 for(const [id,text] of [['jinmao','金茂大厦 · V 乘电梯'],['jinmaoDeck','金茂观景台 · V 返回'],['swfc','环球金融中心 · V 乘电梯'],['swfcDeck','环球 · 云端天桥 · V 返回'],['nanpu','南浦风格斜拉桥 · 双向车道']])sign(text,LANDMARKS[id]);
 const geometry=new THREE.BoxGeometry(.25,1.8,.25),spiralGroup=new THREE.Group();
 for(let y=30;y<136;y+=2.5)for(let i=0;i<3;i++){const a=(y-26)/110*Math.PI*2/3+i*Math.PI*2/3,r=towerProfile(y,a)+.32,m=new THREE.Mesh(geometry,material);m.position.set(SHANGHAI.x+Math.cos(a)*r,y,SHANGHAI.z+Math.sin(a)*r);m.userData.range=210;spiralGroup.add(m);}
 for(const m of batchMeshes(spiralGroup,[...spiralGroup.children],'skyline-tower-spiral')){scene.add(m);lines.push(m);}
 const halo=new THREE.Mesh(new THREE.TorusGeometry(5.4,.11,4,40),new THREE.MeshBasicMaterial({color:'#e6fcad',fog:true}));halo.rotation.x=Math.PI/2;halo.position.set(SHANGHAI.x,136.6,SHANGHAI.z);halo.userData.range=210;halo.updateMatrix();halo.matrixAutoUpdate=false;scene.add(halo);
 const cityLights=[];
 function rod(a,b,width,mat,target=scene){const from=new THREE.Vector3(...a),to=new THREE.Vector3(...b),v=to.clone().sub(from),m=new THREE.Mesh(new THREE.CylinderGeometry(width,width,v.length(),4),mat);m.position.copy(from.add(to).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());m.userData.range=230;target.add(m);return m;}
 const cableMat=new THREE.MeshLambertMaterial({color:'#e3eadf'}),warm=new THREE.MeshBasicMaterial({color:'#ffc778',fog:true}),cool=new THREE.MeshBasicMaterial({color:'#85e9ff',fog:true});
 const nanpuCableGroup=new THREE.Group();
 for(const x of NANPU_PYLONS)for(const z of NANPU_LEGS)for(const side of [-1,1])for(let reach=7;reach<=28;reach+=7){
  const end=x+side*reach;
  const edge=z<206?203.1:209.9;
  rod([x+.5,55,z+.5],[end+.5,nanpuSurfaceAt(end+.5,206.5)+.25,edge],.085,cableMat,nanpuCableGroup);
 }
 for(const m of batchMeshes(nanpuCableGroup,[...nanpuCableGroup.children],'skyline-bridge-cables'))scene.add(m);
 // Low rails and edge lighting follow every bridge, away from the walking lane.
 for(const b of BRIDGES){if(b.id==='city'||b.id==='bund')continue;const points=b.samples,bridgeCableGroup=new THREE.Group(),bridgeLightGroup=new THREE.Group();for(let i=0;i<points.length-1;i+=6){const a=points[i],n=points[Math.min(i+6,points.length-1)],dx=n.x-a.x,dz=n.z-a.z,l=Math.hypot(dx,dz);if(!l||!bridgeRailSegmentAllowed(b,a,n))continue;const nx=-dz/l*(b.width+.8),nz=dx/l*(b.width+.8),ay=b.id==='nanpu'?nanpuSurfaceAt(a.x+.5,a.z+.5):a.y,ny=b.id==='nanpu'?nanpuSurfaceAt(n.x+.5,n.z+.5):n.y;for(const side of [-1,1]){rod([a.x+.5+nx*side,ay+.6,a.z+.5+nz*side],[n.x+.5+nx*side,ny+.6,n.z+.5+nz*side],.08,cableMat,bridgeCableGroup);rod([a.x+.5+nx*side,ay-.1,a.z+.5+nz*side],[n.x+.5+nx*side,ny-.1,n.z+.5+nz*side],.06,cool,bridgeLightGroup);}}for(const m of batchMeshes(bridgeCableGroup,[...bridgeCableGroup.children],'skyline-bridge-cables'))scene.add(m);for(const m of batchMeshes(bridgeLightGroup,[...bridgeLightGroup.children],'skyline-bridge-lights')){scene.add(m);cityLights.push(m);}}
 const bridgeLightCount=cityLights.length;
 const jinmaoLightGroup=new THREE.Group(),swfcLightGroup=new THREE.Group();
 for(let y=30;y<96;y+=3)for(const side of [-1,1]){const r=8-Math.floor((y-26)/73*8)*.75;rod([CITY.jinmao.x+side*(r+.15),y,CITY.jinmao.z],[CITY.jinmao.x+side*(r+.15),y+1.8,CITY.jinmao.z],.12,warm,jinmaoLightGroup);}
 for(const side of [-1,1]){rod([CITY.swfc.x+side*3.2,95.8,CITY.swfc.z-4.3],[CITY.swfc.x+side*3.2,95.8,CITY.swfc.z+4.3],.1,cool,swfcLightGroup);rod([CITY.swfc.x+side*3.2,108.2,CITY.swfc.z-5],[CITY.swfc.x+side*3.2,108.2,CITY.swfc.z+5],.1,cool,swfcLightGroup);}
 for(let y=30;y<94;y+=9){const r=8-Math.floor((y-26)/73*8)*.75+.3;for(let i=0;i<8;i++){const a=i*Math.PI/4,b=(i+1)*Math.PI/4;rod([CITY.jinmao.x+Math.cos(a)*r,y,CITY.jinmao.z+Math.sin(a)*r],[CITY.jinmao.x+Math.cos(b)*r,y,CITY.jinmao.z+Math.sin(b)*r],.13,warm,jinmaoLightGroup);}}
 for(let y=28;y<112;y+=4){const rx=9-Math.floor((y-26)/85*4)+.1,rz=7-Math.floor((y-26)/85*4)+.1;for(const side of [-1,1])rod([CITY.swfc.x-rz,y,CITY.swfc.z+side*rx],[CITY.swfc.x-rz,y+2.5,CITY.swfc.z+side*rx],.13,cool,swfcLightGroup);}
 for(const m of batchMeshes(jinmaoLightGroup,[...jinmaoLightGroup.children],'skyline-tower-lights')){scene.add(m);cityLights.push(m);}
 for(const m of batchMeshes(swfcLightGroup,[...swfcLightGroup.children],'skyline-tower-lights')){scene.add(m);cityLights.push(m);}
 function near(p){const me=getPos();return Math.hypot(me.x-p.x,me.z-p.z)<4.2&&Math.abs(me.y-p.y)<3;}
 const elevators=[{name:'白玉兰广场',stops:['magnolia','helipad'],labels:['北外滩大厅','楼顶直升机平台'],description:'白玉兰塔冠与 H 停机坪。平台停有直升机，沿中央步道看两岸天际线。'}, {name:'上海中心',stops:['shanghai','towerOffice','duoyun','skyGarden','skyDeck'],labels:['1F · 电梯大厅','办公体验层','52F · 朵云书院','空中花园','巅峰观景台'],description:'在大厅、办公层、52F朵云书院与观景楼层间选层；朵云书院可翻阅原创短读、临窗看江景。登顶免费领取滑翔伞，P 开伞，WASD 控制方向；Shift 加快下降。'}, {name:'金茂大厦',stops:['jinmao','jinmaoDeck'],labels:['地面大厅','金茂观景台'],description:'层层收台的塔冠，登上金茂观景台欣赏陆家嘴与黄浦江湾。'}, {name:'环球金融中心',stops:['swfc','swfcDeck'],labels:['地面大厅','云端天桥'],description:'穿过顶部的开瓶器形天门，在云端天桥俯瞰黄浦江。靠近平台中心按 V 返回地面。'}];
 const currentElevator=()=>elevators.find(e=>e.stops.some(id=>near(LANDMARKS[id])));
 function canUse(){return !!currentElevator()}
 function close(){if(!panel)return;$('elevator-dialog').close();panel=false;resume();}
 function renderStops(e){$('elevator-title').textContent=e.name+' · 观光电梯';$('elevator-description').textContent=e.description;$('elevator-options').replaceChildren();e.stops.forEach((id,i)=>{const b=document.createElement('button');b.className='recipe-card';b.textContent=e.name==='上海中心'?e.labels[i]:e.labels[i]+' · 高度 '+LANDMARKS[id].y;b.onclick=()=>{close();teleport(LANDMARKS[id]);if(['shanghai','towerOffice','duoyun'].includes(id))lookAt({x:CITY.shanghai.x,y:LANDMARKS[id].y+1.5,z:CITY.shanghai.z+2});if(id==='skyDeck'){grantGlider();const firstVisit=!visited;visited=true;onEvent({type:'sky'});if(firstVisit)onProgress();notify('欢迎登顶上海中心！已领取滑翔伞。走向平台边缘，按 P 开伞，WASD 控制方向。')}else notify('电梯已到达：'+e.labels[i])};$('elevator-options').appendChild(b);});}
 function use(){const e=currentElevator();if(!e)return false;pause();panel=true;renderStops(e);$('elevator-dialog').showModal();return true;}
 renderStops(elevators[0]);
 $('elevator-close').onclick=close;$('elevator-dialog').addEventListener('cancel',e=>{e.preventDefault();close()});
 function tick(dt,{night,festival,time,showTime=0}){const show=night||festival,cue=showCue(showTime);material.color.setHSL(festival?cue.hue:.53,festival?.82:.68,festival?.62*cue.brightness:night?.67:.43);for(let i=0;i<lines.length;i++)lines[i].visible=show;for(let i=0;i<cityLights.length;i++){const light=cityLights[i];light.visible=show;if(i>=bridgeLightCount&&light.material!==material)light.material=material;}halo.visible=show;halo.material.color.copy(material.color);const elevator=currentElevator(),prompt=$('skyline-prompt');updateHudHidden(prompt,!elevator);if(elevator)updateHudText(prompt,near(LANDMARKS.skyDeck)?'V 选择楼层 · P 开伞 / 收伞 · 走向平台边缘滑翔':'V 乘坐'+elevator.name+'观光电梯');}
 return {use,close,tick,lines,cityLights,isPanelOpen:()=>panel,serialize:()=>({visited}),restore:d=>{visited=!!d?.visited}};
}
