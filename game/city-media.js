import * as THREE from './three.module.js';
import {CITY} from './shanghai-map.js';
import {towerProfile} from './world.js';
import {ALL_BUILDINGS} from './city-layout.js';
import {showCue} from './show-cues.js';

export const MEDIA_MESSAGES=['上海欢迎你','文明出行','滨江夜游'];
export function mediaSchedule(dayClock){const hour=(dayClock/240*24+6)%24;return {crown:hour>=18&&hour<22,podium:hour>=8&&hour<22};}
export function createCityMedia({scene}){
 const root=new THREE.Group();root.name='photo-referenced-led-media';scene.add(root);const screens=[],strips=[],frameColors=['#629cff','#be74e8','#44d7c7'];let clock=0,lastFrame=-1,lastFestival=false;
 function canvasScreen(name,width,height){const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d'),texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;const material=new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide});const screen={name,canvas,ctx,texture,material};screens.push(screen);return screen;}
 const crown=canvasScreen('上海中心塔冠屏',1024,256);
 // Narrow curved panels follow the existing taper; the observation deck stays open.
 const positions=[],uv=[],indices=[];const n=64;
 // Four repetitions and separate quarter seams keep the short message readable from all banks.
 for(let level=124;level<140;level++)for(let i=0;i<n;i++){const start=positions.length/3;for(const [j,y]of [[i,level],[i,level+1],[i+1,level],[i+1,level+1]]){const a=j/n*Math.PI*2,r=(y<135?towerProfile(y,a):y===135?Math.max(5,towerProfile(y,a)):5-(y-136)*.65)+1.1;positions.push(CITY.shanghai.x+Math.cos(a)*r,y,CITY.shanghai.z+Math.sin(a)*r);uv.push((j-i+(i%16))/16,(y-124)/16);}indices.push(start,start+1,start+2,start+1,start+3,start+2);}
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geometry.setIndex(indices);geometry.computeVertexNormals();geometry.computeBoundingSphere();const crownMesh=new THREE.Mesh(geometry,crown.material);crownMesh.userData.range=285;crownMesh.userData.panel=true;root.add(crownMesh);crown.mesh=crownMesh;
 const tubeGeo=new THREE.BoxGeometry(1,1,1);
 for(let y=32;y<129;y+=1.2){const t=(y-26)/110,a=Math.PI+t*Math.PI*2/3,r=towerProfile(y,a)+1.2;const material=new THREE.MeshBasicMaterial({color:'#6bd6ef'}),m=new THREE.Mesh(tubeGeo,material);m.position.set(CITY.shanghai.x+Math.cos(a)*r,y,CITY.shanghai.z+Math.sin(a)*r);m.rotation.y=-a;m.scale.set(.65,1.12,.45);m.userData.range=285;root.add(m);strips.push(m);}
 const podium=ALL_BUILDINGS.find(b=>b.id==='jinmao-podium'),ad=canvasScreen('金茂裙楼东侧广告屏',768,288);
 const panel=new THREE.Mesh(new THREE.PlaneGeometry(6.2,2.4),ad.material);panel.rotation.y=Math.PI/2;panel.position.set(podium.x+.5+podium.rx+.7,30.3,podium.z+.5);panel.userData.panel=true;panel.userData.range=240;root.add(panel);ad.mesh=panel;
 function draw(screen,frame,festival){const {ctx,canvas,texture}=screen,w=canvas.width,h=canvas.height;ctx.fillStyle=festival?'#18252c':'#102344';ctx.fillRect(0,0,w,h);ctx.fillStyle=festival?'#ffffff':frameColors[frame];ctx.fillRect(0,0,w,h*.12);ctx.fillRect(0,h*.88,w,h*.12);ctx.fillStyle='#e7f9ff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`bold ${screen===crown?196:90}px sans-serif`;ctx.fillText(screen===crown?['上海','欢迎','夜游'][frame]:MEDIA_MESSAGES[frame],w/2,h*.5,w*.87);if(screen===ad){ctx.font='30px sans-serif';ctx.fillStyle=festival?'#ffffff':'#94e4dd';ctx.fillText('CITY LIFE · SHANGHAI',w/2,h*.77);}texture.needsUpdate=true;}
 const white=new THREE.Color('#d9f5ff');
 function tick(dt,{dayClock=36,festival=false,showTime=0}={}){clock+=dt;const frame=Math.floor(clock/8)%3;if(frame!==lastFrame||festival!==lastFestival){screens.forEach(s=>draw(s,frame,festival));lastFrame=frame;lastFestival=festival;}const schedule=mediaSchedule(dayClock),cue=showCue(showTime);crown.mesh.visible=schedule.crown||festival;ad.mesh.visible=schedule.podium||festival;for(const s of screens)festival?s.material.color.setHSL(cue.hue,.78,.68*cue.brightness):s.material.color.set('#ffffff');for(const [i,m]of strips.entries()){m.visible=schedule.crown||festival;if(festival)m.material.color.setHSL(cue.hue,.82,.62*cue.brightness);else m.material.color.set(frameColors[frame]).lerp(white,(.5+.5*Math.sin(clock*.6-i*.07))*.35);}}
 tick(0,{});return {tick,screens,strips};
}
