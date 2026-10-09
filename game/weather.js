import * as THREE from './three.module.js';
import {createSkyGradient} from './sky-gradient.js';
export const WEATHER_CYCLE_SECONDS=1200;
export const DAY_CYCLE_SECONDS=1200;
export const WEATHER_TYPES={clear:{name:'晴天',humidity:48,rain:0,fog:0},cloudy:{name:'多云',humidity:73,rain:0,fog:.2},rain:{name:'雨天',humidity:89,rain:1,fog:.48},fog:{name:'江雾',humidity:86,rain:0,fog:1}};
export class WeatherState{
 constructor(){this.mode='auto';this.type='clear';this.elapsed=0;this.cycleSeconds=WEATHER_CYCLE_SECONDS;this.rain=0;this.fog=0;this.cloud=0;this.humidity=48;}
 setMode(mode){if(!['auto','clear','cloudy','rain','fog'].includes(mode))return false;this.mode=mode;if(mode!=='auto')this.type=mode;return true;}
 setCycle(seconds){if(![600,1200,3600].includes(seconds))return false;this.elapsed*=seconds/this.cycleSeconds;this.cycleSeconds=seconds;return true;}
 tick(dt){this.elapsed+=dt;if(this.mode==='auto'){const t=(this.elapsed%this.cycleSeconds)/this.cycleSeconds*400;this.type=t<130?'clear':t<195?'cloudy':t<285?'rain':t<355?'fog':'cloudy';}const spec=WEATHER_TYPES[this.type],a=1-Math.exp(-dt/(this.mode==='auto'?55:7));this.rain+=(spec.rain-this.rain)*a;this.fog+=(spec.fog-this.fog)*a;this.cloud+=((this.type==='clear'?.08:this.type==='cloudy'?.65:.92)-this.cloud)*a;this.humidity+=(spec.humidity-this.humidity)*a;return {name:spec.name,humidity:Math.round(this.humidity),rain:this.rain,fog:this.fog,cloud:this.cloud};}
 serialize(){return {timing:3,cycleSeconds:this.cycleSeconds,mode:this.mode,elapsed:this.elapsed,type:this.type,rain:this.rain,fog:this.fog,cloud:this.cloud,humidity:this.humidity};}
 restore(d){this.mode=['auto','clear','cloudy','rain','fog'].includes(d?.mode)?d.mode:'auto';this.cycleSeconds=d?.timing===3&&[600,1200,3600].includes(d.cycleSeconds)?d.cycleSeconds:WEATHER_CYCLE_SECONDS;const oldCycle=d?.timing===3?([600,1200,3600].includes(d.cycleSeconds)?d.cycleSeconds:WEATHER_CYCLE_SECONDS):d?.timing===2?3600:400;this.elapsed=Number.isFinite(d?.elapsed)?Math.max(0,d.elapsed)*this.cycleSeconds/oldCycle:0;this.type=Object.hasOwn(WEATHER_TYPES,d?.type)?d.type:'clear';this.rain=Number.isFinite(d?.rain)?Math.max(0,Math.min(1,d.rain)):0;this.fog=Number.isFinite(d?.fog)?Math.max(0,Math.min(1,d.fog)):0;this.cloud=Number.isFinite(d?.cloud)?Math.max(0,Math.min(1,d.cloud)):this.rain;this.humidity=Number.isFinite(d?.humidity)?Math.max(0,Math.min(100,d.humidity)):WEATHER_TYPES[this.type].humidity;this.tick(0);}
}
function createMoonTexture(){
 if(typeof document==='undefined')return null;
 const c=document.createElement('canvas');c.width=512;c.height=512;
 const ctx=c.getContext('2d');if(!ctx)return null;
 const cx=256,cy=256,r=240;
 const grad=ctx.createRadialGradient(cx,cy,r*.35,cx,cy,r);
 grad.addColorStop(0,'#e4edf7');grad.addColorStop(.82,'#cfdcee');grad.addColorStop(1,'#b0c1d6');
 ctx.fillStyle=grad;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();
 function mare(x,y,rx,ry,rot,alpha){
  ctx.save();ctx.translate(cx+x,cy+y);ctx.rotate(rot);
  const mg=ctx.createRadialGradient(0,0,Math.min(rx,ry)*.15,0,0,Math.max(rx,ry));
  mg.addColorStop(0,`rgba(105,122,142,${alpha})`);mg.addColorStop(.7,`rgba(125,142,162,${alpha*.7})`);mg.addColorStop(1,'rgba(135,152,172,0)');
  ctx.fillStyle=mg;ctx.beginPath();ctx.ellipse(0,0,rx,ry,0,0,Math.PI*2);ctx.fill();ctx.restore();
 }
 mare(-70,-35,75,105,-.2,.68);mare(-40,-95,58,52,.1,.62);
 mare(42,-65,48,42,.3,.58);mare(55,-15,52,44,-.1,.64);
 mare(130,-48,26,20,-.3,.75);mare(95,30,42,34,.2,.52);mare(58,62,32,28,-.2,.50);
 mare(-38,62,45,38,.1,.58);mare(-95,48,32,28,-.1,.54);
 ctx.save();const tx=cx+35,ty=cy+118;
 ctx.strokeStyle='rgba(255,255,255,0.22)';ctx.lineWidth=1.5;
 for(let a=0;a<Math.PI*2;a+=Math.PI/6){
  ctx.beginPath();ctx.moveTo(tx,ty);
  ctx.lineTo(tx+Math.cos(a)*(130+(Math.sin(a*3)*35)),ty+Math.sin(a)*(130+(Math.cos(a*3)*35)));
  ctx.stroke();
 }
 const tg=ctx.createRadialGradient(tx,ty,1,tx,ty,10);
 tg.addColorStop(0,'rgba(255,255,255,0.85)');tg.addColorStop(.4,'rgba(240,248,255,0.4)');tg.addColorStop(1,'rgba(255,255,255,0)');
 ctx.fillStyle=tg;ctx.beginPath();ctx.arc(tx,ty,10,0,Math.PI*2);ctx.fill();ctx.restore();
 const tex=new THREE.CanvasTexture(c);tex.needsUpdate=true;return tex;
}

function createSunFlareTexture(){
 if(typeof document==='undefined')return null;
 const c=document.createElement('canvas');c.width=256;c.height=256;
 const ctx=c.getContext('2d');if(!ctx)return null;
 const cx=128,cy=128,r=124;
 const grad=ctx.createRadialGradient(cx,cy,4,cx,cy,r);
 grad.addColorStop(0,'rgba(255,255,255,1)');
 grad.addColorStop(.12,'rgba(255,248,205,0.88)');
 grad.addColorStop(.32,'rgba(255,200,85,0.42)');
 grad.addColorStop(.62,'rgba(255,145,40,0.15)');
 grad.addColorStop(1,'rgba(255,100,20,0)');
 ctx.fillStyle=grad;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();
 ctx.save();ctx.translate(cx,cy);
 ctx.strokeStyle='rgba(255,235,160,0.15)';ctx.lineWidth=2;
 for(let i=0;i<8;i++){
  const a=i*Math.PI/4;
  ctx.beginPath();ctx.moveTo(-Math.cos(a)*r*.85,-Math.sin(a)*r*.85);
  ctx.lineTo(Math.cos(a)*r*.85,Math.sin(a)*r*.85);ctx.stroke();
 }
 ctx.restore();
 const tex=new THREE.CanvasTexture(c);tex.needsUpdate=true;return tex;
}

function createLunarGlowTexture(){
 if(typeof document==='undefined')return null;
 const c=document.createElement('canvas');c.width=256;c.height=256;
 const ctx=c.getContext('2d');if(!ctx)return null;
 const cx=128,cy=128,r=124;
 const grad=ctx.createRadialGradient(cx,cy,12,cx,cy,r);
 grad.addColorStop(0,'rgba(210,235,255,0.72)');
 grad.addColorStop(.35,'rgba(165,205,255,0.32)');
 grad.addColorStop(.7,'rgba(130,175,250,0.1)');
 grad.addColorStop(1,'rgba(100,150,245,0)');
 ctx.fillStyle=grad;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();
 const tex=new THREE.CanvasTexture(c);tex.needsUpdate=true;return tex;
}

export function createWeather({scene,camera,world,sunBlock,clouds,cloudMat,water,terrainMaterial}){
 const skyGradient=createSkyGradient(scene,camera),state=new WeatherState();
 const moon=new THREE.Group(),moonTex=createMoonTexture();
 const moonMat=new THREE.MeshBasicMaterial({color:'#d8e5f5',map:moonTex,transparent:true,opacity:.62,depthWrite:false,fog:false});
 const moonBody=new THREE.Mesh(new THREE.CircleGeometry(2.3,48),moonMat);
 moon.name='distant-moon';moon.add(moonBody);
 const craterMat=new THREE.MeshBasicMaterial({color:'#8295b0',transparent:true,opacity:.13,depthWrite:false,fog:false});
 for(const [x,y,r] of [[-.65,.45,.36],[.55,-.5,.3],[.2,.75,.23],[-.5,-.8,.16],[-.25,-.15,.45],[.4,-.2,.32],[-.7,.1,.25]]){
  const m=new THREE.Mesh(new THREE.CircleGeometry(r,18),craterMat);m.position.set(x,y,.015);moon.add(m);
 }
 const lunarGlowTex=createLunarGlowTexture();
 const lunarHaloMat=new THREE.MeshBasicMaterial({color:'#b8d8ff',map:lunarGlowTex,transparent:true,opacity:.16,depthWrite:false,fog:false});
 const lunarInnerHalo=new THREE.Mesh(new THREE.CircleGeometry(5.6,36),lunarHaloMat);lunarInnerHalo.position.z=-.01;moon.add(lunarInnerHalo);
 const lunarOuterHaloMat=new THREE.MeshBasicMaterial({color:'#8ab4f8',map:lunarGlowTex,transparent:true,opacity:.07,depthWrite:false,fog:false});
 const lunarOuterHalo=new THREE.Mesh(new THREE.CircleGeometry(12.8,36),lunarOuterHaloMat);lunarOuterHalo.position.z=-.02;moon.add(lunarOuterHalo);
 scene.add(moon);moon.children.forEach(m=>m.userData.range=320);

 sunBlock.scale.setScalar(1);sunBlock.material.fog=false;sunBlock.userData.range=280;
 const innerHalo=new THREE.Mesh(new THREE.SphereGeometry(11.5,24,14),new THREE.MeshBasicMaterial({color:'#fff3b5',transparent:true,opacity:.28,depthWrite:false,fog:false}));innerHalo.userData.range=280;sunBlock.add(innerHalo);
 const midHalo=new THREE.Mesh(new THREE.SphereGeometry(22,24,14),new THREE.MeshBasicMaterial({color:'#ffb44a',transparent:true,opacity:.15,depthWrite:false,fog:false}));midHalo.userData.range=280;sunBlock.add(midHalo);
 const outerHalo=new THREE.Mesh(new THREE.SphereGeometry(46,24,14),new THREE.MeshBasicMaterial({color:'#ffa035',transparent:true,opacity:.07,depthWrite:false,fog:false}));outerHalo.userData.range=280;sunBlock.add(outerHalo);
 const sunFlareTex=createSunFlareTexture();
 let flareMesh=null;
 if(sunFlareTex){
  const flareMat=new THREE.MeshBasicMaterial({map:sunFlareTex,transparent:true,opacity:.72,depthWrite:false,fog:false,blending:THREE.AdditiveBlending});
  flareMesh=new THREE.Mesh(new THREE.PlaneGeometry(88,88),flareMat);flareMesh.userData.range=280;sunBlock.add(flareMesh);
 }

 const stars=new THREE.Group();for(let i=0;i<38;i++){const m=new THREE.Mesh(new THREE.BoxGeometry(.32,.32,.32),new THREE.MeshBasicMaterial({color:'#d9e9ff',fog:false}));const a=i*2.399,y=30+(i*37%115),r=Math.sqrt(180*180-y*y);m.position.set(Math.cos(a)*r,y,Math.sin(a)*r);m.userData.range=280;stars.add(m);}scene.add(stars);
 const count=180,positions=new Float32Array(count*18),geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));const rainMat=new THREE.MeshBasicMaterial({color:'#c7e6ed',transparent:true,opacity:.4,side:THREE.DoubleSide,depthWrite:false});const rainMesh=new THREE.Mesh(geometry,rainMat);rainMesh.frustumCulled=false;rainMesh.userData.range=50;scene.add(rainMesh);
 let seed=1731;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};const drops=Array.from({length:count},()=>({x:0,y:-100,z:0,roof:0}));
 function reset(d){d.x=camera.position.x+(rand()-.5)*38;d.z=camera.position.z+(rand()-.5)*38;d.y=camera.position.y+5+rand()*18;d.roof=world.ground(Math.floor(d.x),Math.floor(d.z));}
 function tick(dt,dayClock){const info=state.tick(dt),phase=dayClock/240*Math.PI*2,night=Math.sin(phase)<0,alt=Math.abs(Math.sin(phase)),cloudiness=Math.max(info.cloud,info.rain,info.fog*.75);const sunDir=new THREE.Vector3(Math.cos(phase)*125,18+alt*50,-90),elevation=.22+alt*.67,azimuth=phase-Math.PI,moonDir=new THREE.Vector3(Math.cos(azimuth)*Math.cos(elevation),Math.sin(elevation),Math.sin(azimuth)*Math.cos(elevation)).multiplyScalar(245);
  sunBlock.position.copy(camera.position).add(sunDir);sunBlock.lookAt(camera.position);sunBlock.visible=!night&&cloudiness<.8;
  const isSunset=dayClock>70&&dayClock<160;
  const duskFactor=(1-THREE.MathUtils.smoothstep(Math.abs(Math.sin(phase)),.03,.38))*(Math.sin(phase)>-.2?1:0);
  const noonSunColor=new THREE.Color('#fffef4'),duskSunColor=new THREE.Color(isSunset?'#ff6324':'#ff9242');
  const baseSunColor=new THREE.Color().copy(noonSunColor).lerp(duskSunColor,duskFactor*.85);
  sunBlock.material.color.copy(info.rain>.35?new THREE.Color('#cccebd'):baseSunColor);
  innerHalo.material.color.set(isSunset?'#ff8035':'#fff2a8').lerp(new THREE.Color('#a8b0b8'),cloudiness*.6);
  innerHalo.material.opacity=(.28+.12*duskFactor)*(1-cloudiness*.75);
  midHalo.material.color.set(isSunset?'#f4521e':'#ffa638').lerp(new THREE.Color('#909aa5'),cloudiness*.7);
  midHalo.material.opacity=(.15+.09*duskFactor)*(1-cloudiness*.8);
  outerHalo.material.color.set(isSunset?'#e84014':'#ff9225').lerp(new THREE.Color('#808892'),cloudiness*.7);
  outerHalo.material.opacity=(.07+.05*duskFactor)*(1-cloudiness*.85);
  if(flareMesh){flareMesh.material.opacity=(.72+.18*duskFactor)*(1-cloudiness*.85);}

  moon.position.copy(camera.position).add(moonDir);moon.lookAt(camera.position);moon.visible=night&&cloudiness<.85;
  moonMat.opacity=(.35+.27*THREE.MathUtils.smoothstep(alt,0,.4))*(1-cloudiness*.75);
  craterMat.opacity=moonMat.opacity*.22;
  lunarHaloMat.opacity=(.16+.08*THREE.MathUtils.smoothstep(alt,0,.4))*(1-cloudiness*.8);
  lunarOuterHaloMat.opacity=(.07+.04*THREE.MathUtils.smoothstep(alt,0,.4))*(1-cloudiness*.88);
  stars.position.copy(camera.position);stars.visible=night&&cloudiness<.35;

  const dayCloudColor=new THREE.Color('#fffaf0'),sunsetCloudTint=new THREE.Color(isSunset?'#ffad8a':'#ffc4a2');
  const baseCloud=new THREE.Color('#586e94').lerp(dayCloudColor,THREE.MathUtils.smoothstep(Math.sin(phase),-.12,.45));
  baseCloud.lerp(sunsetCloudTint,duskFactor*.55);
  cloudMat.color.copy(baseCloud).lerp(new THREE.Color('#394754').lerp(new THREE.Color('#a7b4bd'),THREE.MathUtils.smoothstep(Math.sin(phase),-.12,.45)),cloudiness);
  cloudMat.transparent=true;cloudMat.depthWrite=false;
  cloudMat.opacity=Math.max(.2,(.74-info.fog*.12)*(1-info.rain*.08));
  clouds.position.y=info.rain* -8;

  const underwater=camera.position.y<22.25;skyGradient.tick(dayClock,cloudiness,info.fog,!underwater);if(!underwater){const mist=new THREE.Color(night?'#3b4a59':'#b5c5cc');scene.background.copy(skyGradient.horizon).lerp(mist,info.fog*.32+info.rain*.13);scene.fog.color.copy(scene.background);scene.fog.near=48*(1-info.fog)+26*info.fog;scene.fog.far=440*(1-info.fog)+185*info.fog;scene.fog.far-=info.rain*12;}
  terrainMaterial.color.setScalar(1-info.rain*.16);water.material.color.set('#173e5a').lerp(new THREE.Color('#3d9bab'),THREE.MathUtils.smoothstep(Math.sin(phase),-.12,.45)).lerp(new THREE.Color('#627b85'),info.rain*.75+info.fog*.15);rainMesh.visible=info.rain>.04&&!underwater;rainMat.opacity=info.rain*.5;
  if(rainMesh.visible)for(let i=0;i<count;i++){const d=drops[i];d.y-=dt*17;d.x-=dt*.8;if(d.y<Math.max(d.roof,camera.position.y-14)||Math.hypot(d.x-camera.position.x,d.z-camera.position.z)>27)reset(d);const visible=d.y>d.roof&&i<count*info.rain;const x=visible?d.x:0,y=visible?d.y:-200,z=visible?d.z:0,a=i*18;positions.set([x,y,z,x+.045,y,z,x+.2,y+1.3,z,x,y,z,x+.2,y+1.3,z,x+.15,y+1.3,z],a);}
  if(rainMesh.visible)geometry.attributes.position.needsUpdate=true;
  return {...info,night,moonVisible:moon.visible};
 }
 return {state,tick,sun:sunBlock,moon,stars,rainMesh,serialize:()=>state.serialize(),restore:d=>state.restore(d)};
}
