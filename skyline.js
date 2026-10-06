import * as THREE from './three.module.js';
import {LANDMARKS,SHANGHAI,towerProfile,WORLD_SHIFT} from './world.js';
import {CITY,BRIDGES} from './shanghai-map.js';
import {showCue} from './show-cues.js';
import {nanpuSurfaceAt} from './bridge-road.js';
const $=id=>document.getElementById(id);
export function createSkyline({scene,getPos,notify,pause,resume,teleport,grantGlider,onProgress,onEvent=()=>{}}){
 let panel=false,visited=false;const lines=[];const material=new THREE.MeshBasicMaterial({color:'#a6e8ff',fog:true});
 function sign(text,p){const c=document.createElement('canvas');c.width=640;c.height=112;const ctx=c.getContext('2d');ctx.fillStyle='#193442ed';ctx.fillRect(0,0,640,112);ctx.textAlign='center';ctx.fillStyle='#c2f1ff';ctx.font='bold 31px sans-serif';ctx.fillText(text,320,68);const root=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c)}));root.position.set(p.x,p.y+3,p.z);root.scale.set(5.7,1,1);root.userData.wayfinding=true;scene.add(root);}
 sign('上海中心大厦 · V 乘电梯',LANDMARKS.shanghai);sign('空中花园 · V 换楼层',LANDMARKS.skyGarden);sign('巅峰观景台 · P 展开滑翔伞',LANDMARKS.skyDeck);
 for(const [id,text] of [['jinmao','金茂大厦 · V 乘电梯'],['jinmaoDeck','金茂观景台 · V 返回'],['swfc','环球金融中心 · V 乘电梯'],['swfcDeck','环球 · 云端天桥 · V 返回'],['nanpu','南浦风格斜拉桥 · 双向车道']])sign(text,LANDMARKS[id]);
 const geometry=new THREE.BoxGeometry(.25,1.8,.25);
 for(let y=30;y<136;y+=2.5)for(let i=0;i<3;i++){const a=(y-26)/110*Math.PI*2/3+i*Math.PI*2/3,r=towerProfile(y,a)+.32,m=new THREE.Mesh(geometry,material);m.position.set(SHANGHAI.x+Math.cos(a)*r,y,SHANGHAI.z+Math.sin(a)*r);m.userData.range=210;scene.add(m);lines.push(m);}
 const halo=new THREE.Mesh(new THREE.TorusGeometry(5.4,.11,4,40),new THREE.MeshBasicMaterial({color:'#e6fcad',fog:true}));halo.rotation.x=Math.PI/2;halo.position.set(SHANGHAI.x,136.6,SHANGHAI.z);halo.userData.range=210;scene.add(halo);
 const cityLights=[];
 function rod(a,b,width,mat){const from=new THREE.Vector3(...a),to=new THREE.Vector3(...b),v=to.clone().sub(from),m=new THREE.Mesh(new THREE.CylinderGeometry(width,width,v.length(),4),mat);m.position.copy(from.add(to).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());m.userData.range=230;scene.add(m);return m;}
 const cableMat=new THREE.MeshLambertMaterial({color:'#e3eadf'}),warm=new THREE.MeshBasicMaterial({color:'#ffc778',fog:true}),cool=new THREE.MeshBasicMaterial({color:'#85e9ff',fog:true});
 for(const x of [208,255])for(const z of [201.5,211.5])for(const side of [-1,1])for(let reach=7;reach<=28;reach+=7){const end=x+side*reach;if(end<193||end>266)continue;rod([x+.5,55,z],[end+.5,31,z],.085,cableMat);}
 // Low rails and edge lighting follow every bridge, away from the walking lane.
 for(const b of BRIDGES){if(b.id==='city'||b.id==='bund')continue;const points=b.samples;for(let i=0;i<points.length-1;i+=6){const a=points[i],n=points[Math.min(i+6,points.length-1)],dx=n.x-a.x,dz=n.z-a.z,l=Math.hypot(dx,dz);if(!l)continue;const nx=-dz/l*(b.width+.8),nz=dx/l*(b.width+.8),ay=b.id==='nanpu'?nanpuSurfaceAt(a.x+.5,a.z+.5):a.y,ny=b.id==='nanpu'?nanpuSurfaceAt(n.x+.5,n.z+.5):n.y;for(const side of [-1,1]){rod([a.x+.5+nx*side,ay+.6,a.z+.5+nz*side],[n.x+.5+nx*side,ny+.6,n.z+.5+nz*side],.08,cableMat);cityLights.push(rod([a.x+.5+nx*side,ay-.1,a.z+.5+nz*side],[n.x+.5+nx*side,ny-.1,n.z+.5+nz*side],.06,cool));}}}
 const bridgeLightCount=cityLights.length;
 for(let y=30;y<96;y+=3)for(const side of [-1,1]){const r=8-Math.floor((y-26)/73*8)*.75;cityLights.push(rod([CITY.jinmao.x+side*(r+.15),y,CITY.jinmao.z],[CITY.jinmao.x+side*(r+.15),y+1.8,CITY.jinmao.z],.12,warm));}
 for(const side of [-1,1]){cityLights.push(rod([CITY.swfc.x+side*3.2,95.8,CITY.swfc.z-4.3],[CITY.swfc.x+side*3.2,95.8,CITY.swfc.z+4.3],.1,cool));cityLights.push(rod([CITY.swfc.x+side*3.2,108.2,CITY.swfc.z-5],[CITY.swfc.x+side*3.2,108.2,CITY.swfc.z+5],.1,cool));}
 for(let y=30;y<94;y+=9){const r=8-Math.floor((y-26)/73*8)*.75+.3;for(let i=0;i<8;i++){const a=i*Math.PI/4,b=(i+1)*Math.PI/4;cityLights.push(rod([CITY.jinmao.x+Math.cos(a)*r,y,CITY.jinmao.z+Math.sin(a)*r],[CITY.jinmao.x+Math.cos(b)*r,y,CITY.jinmao.z+Math.sin(b)*r],.13,warm));}}
 for(let y=28;y<112;y+=4){const rx=9-Math.floor((y-26)/85*4)+.1,rz=7-Math.floor((y-26)/85*4)+.1;for(const side of [-1,1])cityLights.push(rod([CITY.swfc.x-rz,y,CITY.swfc.z+side*rx],[CITY.swfc.x-rz,y+2.5,CITY.swfc.z+side*rx],.13,cool));}
 function near(p){const me=getPos();return Math.hypot(me.x-p.x,me.z-p.z)<4.2&&Math.abs(me.y-p.y)<3;}
 const elevators=[{name:'白玉兰广场',stops:['magnolia','helipad'],labels:['北外滩大厅','楼顶直升机平台'],description:'白玉兰塔冠与 H 停机坪。平台停有直升机，沿中央步道看两岸天际线。'}, {name:'上海中心',stops:['shanghai','skyGarden','skyDeck'],labels:['地面大厅','空中花园','巅峰观景台'],description:'螺旋玻璃塔身与空中花园。登顶免费领取滑翔伞，P 开伞，WASD 控制方向；Shift 加快下降。'}, {name:'金茂大厦',stops:['jinmao','jinmaoDeck'],labels:['地面大厅','金茂观景台'],description:'层层收台的塔冠，登上金茂观景台欣赏陆家嘴与黄浦江湾。'}, {name:'环球金融中心',stops:['swfc','swfcDeck'],labels:['地面大厅','云端天桥'],description:'穿过顶部的开瓶器形天门，在云端天桥俯瞰黄浦江。靠近平台中心按 V 返回地面。'}];
 const currentElevator=()=>elevators.find(e=>e.stops.some(id=>near(LANDMARKS[id])));
 function canUse(){return !!currentElevator()}
 function close(){if(!panel)return;$('elevator-dialog').close();panel=false;resume();}
 function renderStops(e){$('elevator-title').textContent=e.name+' · 观光电梯';$('elevator-description').textContent=e.description;$('elevator-options').replaceChildren();e.stops.forEach((id,i)=>{const b=document.createElement('button');b.className='recipe-card';b.textContent=e.labels[i]+' · 高度 '+LANDMARKS[id].y;b.onclick=()=>{close();teleport(LANDMARKS[id]);if(id==='skyDeck'){grantGlider();const firstVisit=!visited;visited=true;onEvent({type:'sky'});if(firstVisit)onProgress();notify('欢迎登顶上海中心！已领取滑翔伞。走向平台边缘，按 P 开伞，WASD 控制方向。')}else notify('电梯已到达：'+e.labels[i])};$('elevator-options').appendChild(b);});}
 function use(){const e=currentElevator();if(!e)return false;pause();panel=true;renderStops(e);$('elevator-dialog').showModal();return true;}
 renderStops(elevators[0]);
 $('elevator-close').onclick=close;$('elevator-dialog').addEventListener('cancel',e=>{e.preventDefault();close()});
 function tick(dt,{night,festival,time,showTime=0}){const cue=showCue(showTime);material.color.setHSL(festival?cue.hue:.53,festival?.82:.68,festival?.62*cue.brightness:night?.67:.43);for(const m of lines){m.visible=night||festival;m.scale.y=1;}for(const [i,light]of cityLights.entries()){light.visible=night||festival;if(i>=bridgeLightCount)light.material=material;}halo.visible=night||festival;halo.material.color.copy(material.color);const elevator=currentElevator();if(elevator){$('skyline-prompt').hidden=false;$('skyline-prompt').textContent=near(LANDMARKS.skyDeck)?'V 选择楼层 · P 开伞 / 收伞 · 走向平台边缘滑翔':'V 乘坐'+elevator.name+'观光电梯';}else $('skyline-prompt').hidden=true;}
 return {use,close,tick,lines,cityLights,isPanelOpen:()=>panel,serialize:()=>({visited}),restore:d=>{visited=!!d?.visited}};
}
