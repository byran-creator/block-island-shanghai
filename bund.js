import {styleNpc} from './npc-appearance.js';
import {createCustomsClock} from './customs-clock.js';
import * as THREE from './three.module.js';
import {riverCenter,CITY,MAP_BOUNDS,BUND_SHIFT} from './shanghai-map.js';
import {windowLightGroup,lightGroupVisible} from './city-lighting.js';
import {createCityTraffic,trafficSeed} from './city-traffic.js';
import {pedestrianBlocked,pedestrianStepClear} from './pedestrian-traffic.js';
import {buildingStyle,buildingSection,facadeRuns} from './city-architecture.js';
import {nanpuFloor,nanpuSurfaceAt} from './bridge-road.js';
import {showCue} from './show-cues.js';
import {createWaibaidu} from './waibaidu.js';
import {inSuzhou} from './waibaidu-layout.js';
import {promenadeX,roadX,westSpine,roadContains,BUND_BUILDINGS,BUND_STREETS,ALL_BUILDINGS,CITY_BUILDINGS,buildingEntrance,AVENUE,AVENUE_POINTS,CENTURY,ROADS,CAR_ROUTES,routeSamples,layoutProtected,buildCity} from './city-layout.js';
export {promenadeX,roadX,BUND_BUILDINGS,BUND_STREETS,ALL_BUILDINGS,CITY_BUILDINGS,buildingEntrance,AVENUE,AVENUE_POINTS,CENTURY,CAR_ROUTES};
export const bundProtected=layoutProtected;
export function buildBund(w){
 for(let z=MAP_BOUNDS.min;z<=242;z++){const p=promenadeX(z),r=Math.round(roadX(z));for(let x=r-5;x<=p+2;x++){w.fill(x,18,z,x,24,z,3);w.set(x,25,z,x>=p-10?9:x>=r-3&&x<=r+3?3:1);w.fill(x,26,z,x,38,z,0);}}
 buildCity(w);
 w.fill(258,25,214,262,25,218,7);w.fill(258,26,214,262,30,230,0);w.fill(258,24,219,262,24,220,7);w.fill(258,23,221,262,23,222,7);w.fill(258,22,223,262,22,230,7);
 for(let x=178;x<=214;x++)for(let z=40;z<=58;z++)if(Math.abs(x-195)<2||Math.abs(z-49)<2)w.set(x,25,z,6);
 w.fill(200,21,43,208,24,47,0);w.fill(200,20,43,208,20,47,6);
 for(const [x,z]of [[120,308],[137,304],[140,314],[117,315],[132,315],[124,313]]){w.fill(x,26,z,x,30,z,4);for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)if(Math.abs(dx)+Math.abs(dz)<4)w.fill(x+dx,30,z+dz,x+dx,32,z+dz,5);}
}
export function routePose(samples,d,lane=0){const length=samples.lengthMeters;
 function center(d){d=((d%length)+length)%length;let lo=0,hi=samples.length-1;while(lo+1<hi){const m=(lo+hi)>>1;if(samples[m].d<=d)lo=m;else hi=m;}const a=samples[lo],b=samples[hi],t=(d-a.d)/(b.d-a.d||1);return {x:a.x+(b.x-a.x)*t,z:a.z+(b.z-a.z)*t,y:a.y+(b.y-a.y)*t};}
 const p=center(d),a=center(d-1.3),b=center(d+1.3),dx=b.x-a.x,dz=b.z-a.z,n=Math.hypot(dx,dz)||1;return {x:p.x+dz/n*lane,z:p.z-dx/n*lane,y:Math.round(p.y),yaw:Math.atan2(dx,dz)+Math.PI};}
export function bridgeRoadFloor(world,x,z){return nanpuFloor(world,x,z)??26;}
export function createBund({scene,world,getPos,getObstacles=()=>[]}){
 const existingObjects=new Set(scene.children);
 const waibaidu=createWaibaidu(scene);existingObjects.add(scene.children.at(-1));
 const box=new THREE.BoxGeometry(1,1,1),materials=new Map(),cars=[],boats=[],lamps=[],windows=[],facadeLights=[],goldSurfaces=[],pedestrians=[],skylineLEDs=[];let clock=0;
 const skylineMaterial=new THREE.MeshBasicMaterial({color:'#68bddf'});
 function mat(color,glow=false){const key=color+glow;if(!materials.has(key))materials.set(key,glow?new THREE.MeshBasicMaterial({color}):new THREE.MeshLambertMaterial({color}));return materials.get(key);}
 function cube(root,color,x,y,z,sx,sy,sz,glow=false){const m=new THREE.Mesh(box,mat(color,glow));m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.userData.range=285;root.add(m);return m;}
 function label(text,x,y,z){const c=document.createElement('canvas');c.width=512;c.height=80;const ctx=c.getContext('2d');ctx.fillStyle='#142d38eb';ctx.fillRect(0,0,512,80);ctx.fillStyle='#ffe5ac';ctx.font='bold 28px sans-serif';ctx.textAlign='center';ctx.fillText(text,256,51);const m=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c)}));m.position.set(x,y,z);m.scale.set(5.5,.86,1);m.userData.wayfinding=true;scene.add(m);}
 const roadMat=new THREE.MeshPhongMaterial({color:'#34424b',shininess:22});
 function roadSegment(ax,az,bx,bz,y,width=7.1){const a=new THREE.Vector3(ax,y,az),b=new THREE.Vector3(bx,y,bz),v=b.clone().sub(a),m=new THREE.Mesh(new THREE.PlaneGeometry(width,v.length()+.2),roadMat);m.rotation.set(-Math.PI/2,0,-Math.atan2(v.x,v.z));m.position.copy(a.add(b).multiplyScalar(.5));m.userData.range=170;scene.add(m);}
 for(const r of ROADS)for(let i=4;i<r.samples.length;i+=4){const a=r.samples[i-4],b=r.samples[i];roadSegment(a.x+.5,a.z+.5,b.x+.5,b.z+.5,26.015,r.width*2+.5);if(i%16===0){const stripe=new THREE.Mesh(new THREE.PlaneGeometry(.12,1.2),mat('#f8df8c',true));stripe.rotation.set(-Math.PI/2,0,-Math.atan2(b.x-a.x,b.z-a.z));stripe.position.set(b.x+.5,26.04,b.z+.5);stripe.userData.range=285;scene.add(stripe);}}
 for(const s of BUND_STREETS){label(s.name+' · '+(s.kind==='pedestrian'?'步行':'车行'),roadX(s.z)-6,29,s.z);for(const x of [roadX(s.z),westSpine(s.z)])for(let i=-3;i<=3;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(8,.35),mat('#faf4df',true));m.rotation.x=-Math.PI/2;m.position.set(x+.5,26.04,s.z+.5+i*.7);m.userData.range=285;scene.add(m);}}
 const bridgeFloor=(x,z=206)=>bridgeRoadFloor(world,x,z);
 const bridgeDeck=new THREE.Group();bridgeDeck.name='nanpu-continuous-carriageway';scene.add(bridgeDeck);
 const roadForward=new THREE.Vector3(0,0,1);
 function slopeSegment(ax,ay,az,bx,by,bz,width,material,thickness=.08){const a=new THREE.Vector3(ax,ay,az),b=new THREE.Vector3(bx,by,bz),direction=b.clone().sub(a),m=new THREE.Mesh(new THREE.BoxGeometry(width,thickness,direction.length()+.015),material);m.position.copy(a.add(b).multiplyScalar(.5));m.quaternion.setFromUnitVectors(roadForward,direction.normalize());m.userData.range=300;bridgeDeck.add(m);return m;}
 for(let x=120;x<282.5;x+=.5){const y=nanpuSurfaceAt(x,206.5),yy=nanpuSurfaceAt(x+.5,206.5);slopeSegment(x,y-.34,206.5,x+.5,yy-.34,206.5,7,mat('#899599'),.7);slopeSegment(x,y+.025,206.5,x+.5,yy+.025,206.5,6.35,roadMat);if(Math.floor(x)%4===0)slopeSegment(x,y+.075,206.5,x+.5,yy+.075,206.5,.13,mat('#fff0a7',true));}
 roadSegment(120.5,187.5,120.5,206.5,26.025,6.35);
 for(let z=-140;z<=234;z+=14){if(inSuzhou(promenadeX(z),z))continue;const root=new THREE.Group();root.position.set(promenadeX(z)+.5,26,z+.5);for(const dz of [-.65,.65])cube(root,'#5d6d6b',-1,.35,dz,.17,.7,.17);cube(root,'#9f7755',-1,.72,0,.7,.16,1.8);cube(root,'#bc9570',-1,1.05,-.8,.7,.7,.12);cube(root,'#687879',1,1.6,0,.15,3.2,.15);const light=cube(root,'#ffe2a1',1,3.25,0,.45,.5,.45,true);lamps.push(light);scene.add(root);}
 const warmWash=new THREE.MeshBasicMaterial({color:'#ffd58b',transparent:true,opacity:.42,depthWrite:false}),coolWash=new THREE.MeshBasicMaterial({color:'#88c5dc',transparent:true,opacity:.09,depthWrite:false}),warmWindow=new THREE.MeshBasicMaterial({color:'#ffce73',transparent:true,opacity:.88}),coolWindow=new THREE.MeshBasicMaterial({color:'#b9efff',transparent:true,opacity:.88});
 function panel(root,width,height,x,y,z,angle,material){const m=new THREE.Mesh(new THREE.PlaneGeometry(width,height),material);m.position.set(x,y,z);m.rotation.y=angle;m.userData.range=285;root.add(m);return m;}
 function architecturalFacade(r,b,s){
  const dayGlass=mat(s.color),glow=s.modern?'#b8d9dc':'#e8c68e',nightMaterial=s.modern?coolWindow:warmWindow;
  // Group consecutive levels with the same outline so glass follows the actual setbacks.
  let start=s.modern?5:0;
  while(start<s.height){
   const q=buildingSection(b,s,start);let end=start+1;
   while(end<s.height&&JSON.stringify(buildingSection(b,s,end))===JSON.stringify(q))end++;
   for(const face of facadeRuns(q)){
    const {xx,zz,angle,width,axis,side}=face;
    if(!s.modern&&end>4){const base=Math.max(start,4);panel(r,width,end-base,xx,26+(base+end)/2,zz,angle,dayGlass);}
    if(s.modern){
     panel(r,width,end-start,xx,26+(start+end)/2,zz,angle,dayGlass);
     for(let level=start;level<end;level++)if(level%s.floor===0)cube(r,s.seed%2?'#a8b7b8':'#67787e',xx,26+level+.12,zz,axis==='x'?.08:width,.18,axis==='z'?.08:width);
     for(let u=face.from;u<=face.to;u+=s.spacing)cube(r,'#87989a',axis==='x'?xx:u,26+(start+end)/2,axis==='z'?zz:u,axis==='x'?.08:.1,end-start,axis==='z'?.08:.1);
    }
    for(let level=start;level<end-1;level++)if(level%s.floor===1){
     for(let u=face.from;u<=face.to;u++){
      if((u+s.seed)%s.spacing!==0||Math.abs(u)<=1&&level<4)continue;
      const px=axis==='x'?xx+side*.015:u,pz=axis==='z'?zz+side*.015:u;
      if(!s.modern)panel(r,.8,1.7,px,27+level,pz,angle,mat('#58747a'));
      // Occupied rooms vary per building and floor, avoiding identical luminous grids.
      const window=panel(r,.7,1.35,axis==='x'?px+side*.02:px,27+level,axis==='z'?pz+side*.02:pz,angle,nightMaterial);window.userData.lightGroup=windowLightGroup(b,level,u,`${axis}:${side}:${face.at}`);windows.push(window);
     }
    }
    if((start===0||end===s.height)&&(!/back|infill|front|density/.test(b.id)||s.seed%4===0))facadeLights.push(cube(r,glow,xx,26+end+.12,zz,axis==='x'?.12:width,.12,axis==='z'?.12:width,true));
   }
   start=end;
  }
  if((s.form==='lantern'||s.form==='deco')&&s.seed%3===0)facadeLights.push(cube(r,glow,0,28+s.height,0,2.15,3,2.15,true));
 }
 for(const b of ALL_BUILDINGS){const {x,z,rx,rz,h}=b,r=new THREE.Group(),west=b.bank==='west',gold=b.kind==='gold',side=b.entranceSide??1,front=side>0?rx+.515:-rx-.515;r.position.set(x+.5,0,z+.5);
  if(!/back|infill|front|density/.test(b.id)||b.id==='pudong-infill-187-89'||b.id.startsWith('nanjing-')&&b.name!=='南京东路沿街商厦')label(b.name,buildingEntrance(b,2).x,30,buildingEntrance(b,2).z);
  const style=buildingStyle(b);
  if(b.bank==='east'&&style.modern){
   for(let level=6;level<=style.height;level+=6){const q=buildingSection(b,style,Math.min(level,style.height-1));for(const face of facadeRuns(q)){const {xx,zz,axis,width}=face,m=cube(r,'#68bddf',xx*1.007,26+level+.18,zz*1.007,axis==='x'?.12:width,.15,axis==='z'?.12:width,true);m.material=skylineMaterial;skylineLEDs.push(m);}}
   for(let level=6;level<style.height;level+=2){const q=buildingSection(b,style,level);for(const side of [-1,1]){const m=cube(r,'#68bddf',-q.rx-.55,27+level,side*(q.rz-q.cut),.12,1.85,.13,true);m.material=skylineMaterial;skylineLEDs.push(m);}}
  }
  if(b.id==='pudong-infill-southeast-2'){
   // Warm stone piers, recessed glazing and deep horizontal residential balconies.
   for(let level=4;level<58;level+=4){const y=26+level;
    for(const zz of [-rz-.55,rz+.55])cube(r,'#c9bc97',0,y,zz,rx*2+1.1,.28,.36);
    for(const xx of [-rx-.55,rx+.55])if(xx>0||y<77||y>80)cube(r,'#c9bc97',xx,y,0,.36,.28,rz*2+1.1);
   }
   for(const xx of [-rx+.5,rx-.5])for(const zz of [-rz-.55,rz+.55])cube(r,'#d2c5a3',xx,56,zz,.4,59,.25);
   for(const xx of [-rx-.55,rx+.55])for(const zz of [-rz+.5,rz-.5])cube(r,'#d2c5a3',xx,56,zz,.25,59,.4);
   cube(r,'#c5b68e',0,86.7,0,rx*2+2,1.1,rz*2+2);
  }
  if(style.form!=='landmark'){architecturalFacade(r,b,style);scene.add(r);continue;}
  for(const [xx,zz,angle,width]of [[rx+.516,0,Math.PI/2,rz*2+1],[-rx-.516,0,-Math.PI/2,rz*2+1],[0,rz+.516,0,rx*2+1],[0,-rz-.516,Math.PI,rx*2+1]]){if(west&&b.kind!=='brick'){panel(r,width,h-4,xx,30+(h-4)/2,zz,angle,mat(style.color));for(let y=33;y<26+h;y+=4)for(let u=-width/2+2;u<width/2-1;u+=3)panel(r,.8,1.7,xx?xx*1.002:u,y,zz?zz*1.002:u,angle,mat('#627e87'));}goldSurfaces.push(panel(r,width,h,xx*1.004,26+h/2,zz*1.004,angle,west||gold?warmWash:coolWash));}
  for(let y=29;y<26+h;y+=4)for(let dz=-rz+2;dz<=rz-1;dz+=3){const window=panel(r,.78,1.5,front+.04*side,y,dz,side*Math.PI/2,west||gold?warmWindow:coolWindow);window.userData.lightGroup=windowLightGroup(b,y-26,dz,'front');windows.push(window);}
  const glow=west||gold?'#ffd183':'#88daed';for(const y of [26.15,30,26+h+.15]){for(const zz of [-rz-.53,rz+.53])facadeLights.push(cube(r,glow,0,y,zz,rx*2+1.3,.18,.14,true));for(const xx of [-rx-.53,rx+.53])facadeLights.push(cube(r,glow,xx,y,0,.14,.18,rz*2+1.3,true));}
  if(west){for(const dz of [-rz+.2,-rz/2,rz/2,rz-.2])facadeLights.push(cube(r,'#ffdfa0',front+.055,26+h/2,dz,.12,h-.5,.19,true));for(const dx of [-rx+.2,rx-.2])for(const zz of [-rz-.54,rz+.54])facadeLights.push(cube(r,'#ffd795',dx,26+h/2,zz,.18,h,.13,true));
   for(const dz of [-rz+1,rz-1]){cube(r,'#c5b8a1',rx+1,27.6,dz,.55,3.2,.6);facadeLights.push(cube(r,'#ffe4a4',rx+1.32,27.6,dz,.055,3.2,.4,true));}
   if(b.kind==='dome'){const crown=new THREE.Mesh(new THREE.SphereGeometry(5.1,16,10),new THREE.MeshBasicMaterial({color:'#efc475',transparent:true,opacity:.52}));crown.position.set(0,27+h,0);crown.userData.range=285;r.add(crown);facadeLights.push(crown);}
   if(b.kind==='copper')for(let i=0;i<4;i++)facadeLights.push(cube(r,'#ffdc85',0,32+h+i,-4+i,9-i*2,.17,.15,true));
  }scene.add(r);
 }
 const cc=CITY_BUILDINGS.find(b=>b.id==='convention');for(const dx of [-4,4]){const orb=new THREE.Mesh(new THREE.SphereGeometry(3.2,20,12),new THREE.MeshPhongMaterial({color:'#9bcbd3',shininess:85}));orb.position.set(cc.x+dx,26+cc.h+1,cc.z);orb.userData.range=285;scene.add(orb);const ring=new THREE.Mesh(new THREE.TorusGeometry(3.25,.06,4,28),mat('#dbe5d7',true));ring.position.copy(orb.position);ring.rotation.x=Math.PI/2;ring.userData.range=285;scene.add(ring);}
 // A broad continuous observation deck, with seats and warm riverside edge lights.
 for(let z=-148;z<=240;z+=8){if(Math.abs(z-185)<9||inSuzhou(promenadeX(z),z))continue;const p=promenadeX(z),r=new THREE.Group();r.position.set(p+2.4,26,z+.5);cube(r,'#deded5',0,.62,0,.2,1.2,7.5);facadeLights.push(cube(r,'#ffdea0',0,.03,0,.3,.12,7.5,true));scene.add(r);}
 label('外滩大观景台 · 对岸陆家嘴',promenadeX(86)-15,29.2,86);
 const customsClock=createCustomsClock(scene,BUND_BUILDINGS.find(b=>b.kind==='clock'));
 function carModel(i){const root=new THREE.Group(),body=['#e7b44d','#75b7b2','#dc7274','#7395c6','#f0ecdb','#607181'][i%6];cube(root,body,0,.48,0,1.2,.7,2.5);cube(root,'#b5dde2',0,1,.1,1.04,.5,1.3);for(const x of [-.62,.62])for(const z of [-.78,.78])cube(root,'#263137',x,.25,z,.18,.48,.48);const lights=[];for(const x of [-.39,.39])lights.push(cube(root,'#fff5b8',x,.55,-1.28,.22,.16,.08,true));scene.add(root);return {root,lights};}
 for(const [routeIndex,route]of CAR_ROUTES.entries()){const count=route.id==='bund'?8:route.id==='bridge'?12:6;for(let i=0;i<count;i++){const dir=i%2?1:-1,span=route.samples.find(p=>p.x>=185&&p.x<=188&&Math.abs(p.z-206)<.1);cars.push({...carModel(i),kind:route.id,route:route.samples,t:route.id==='bridge'&&i<4?span.d+[0,17,39,61][i]:route.samples.lengthMeters*(i+.1+trafficSeed(i,routeIndex)*.72)/count,dir,lane:dir>0?2.2:-2.2,speed:2.2+trafficSeed(i,routeIndex+30)*3.2});}}
 function person(i,kind,route,point){const root=new THREE.Group(),shirt=['#ecb447','#759ecd','#d68179','#73a895','#eee4c9','#967caf'][i%6];cube(root,shirt,0,1,0,.46,.62,.26);cube(root,'#e6b995',0,1.53,0,.35,.37,.33);cube(root,'#3e342d',0,1.72,0,.36,.08,.34);const limbs=[];for(const side of [-1,1]){const leg=new THREE.Group();leg.position.set(side*.12,.7,0);cube(leg,'#485770',0,-.34,0,.16,.68,.18);cube(leg,'#e8e9e3',0,-.66,-.04,.19,.13,.3);root.add(leg);const arm=new THREE.Group();arm.position.set(side*.3,1.23,0);cube(arm,shirt,0,-.17,0,.14,.34,.17);cube(arm,'#e6b995',0,-.4,0,.12,.2,.14);root.add(arm);limbs.push({leg,arm,side});}styleNpc({root,torso:root.children[0],head:root.children[1],hair:root.children[2],arms:limbs.map(l=>l.arm),legs:limbs.map(l=>l.leg)},i,'visitor');const camera=kind==='photo'?cube(root,'#26363e',0,1.32,-.48,.28,.16,.14):null;if(camera)cube(root,'#87c4d9',0,1.32,-.56,.12,.11,.025,true);scene.add(root);pedestrians.push({root,limbs,kind,route,t:route?route.lengthMeters*(i*.137%1):0,point,phase:i*1.7,speed:.65+(i%4)*.1,camera});}
 const walkXs=new Map();function walkX(z,offset){const key=z+':'+offset;if(!walkXs.has(key)){let x=promenadeX(z)-offset;while(roadContains(x-.4,z)&&x<promenadeX(z)+.5)x+=.25;walkXs.set(key,x);}return walkXs.get(key);}
 // The north bridge approach and the widened bend cross the former walking loop.
 for(let i=0;i<24;i++){const start=24+(i%4)*44,end=start+41,points=[];for(let z=start;z<=end;z++)points.push([walkX(z,2+i%3),z]);for(let z=end;z>=start;z--)points.push([walkX(z,3+i%3),z]);points.push(points[0]);person(i,'walk',routeSamples(points));}
 for(let i=0;i<9;i++){const z=24+i*24;person(i+24,i%3?'photo':'view',null,{x:promenadeX(z)-2,y:26,z});}
 for(let i=0;i<12;i++){const x=-90+i%3*14;person(i+33,'shop',routeSamples([[x,64],[x+11,64],[x+11,68],[x,68],[x,64]]));}
 const canopy=new THREE.SphereGeometry(1,10,7);for(let z=-132;z<234;z+=12){if(BUND_STREETS.some(s=>Math.abs(s.z-z)<s.width+3)||inSuzhou(riverCenter(z)-33-BUND_SHIFT,z))continue;const r=new THREE.Group();r.position.set(riverCenter(z)-33-BUND_SHIFT,26,z);cube(r,'#6d5037',0,1.1,0,.25,2.2,.25);const leaves=new THREE.Mesh(canopy,mat('#588d50'));leaves.position.y=2.6;leaves.scale.set(1.2,1.25,1.15);leaves.userData.range=285;r.add(leaves);scene.add(r);}
 for(let i=0;i<3;i++){const root=new THREE.Group();cube(root,['#dbeced','#a88652','#6e9fb1'][i],0,.35,0,2.3,.7,5.4);cube(root,'#4f7884',0,.78,0,2.15,.2,4.8);cube(root,'#f3e7c9',0,1.32,.1,1.75,.95,2.6);cube(root,'#7ab8cf',0,1.46,-1.22,1.5,.4,.08);cube(root,'#e4b985',0,1.95,0,1.9,.12,2.85);for(const x of [-.9,.9])cube(root,'#ffdea4',x,.92,-2.1,.14,.2,.14,true);const wake=new THREE.Mesh(new THREE.PlaneGeometry(2.8,3),new THREE.MeshBasicMaterial({color:'#d5f4ed',transparent:true,opacity:.3,side:THREE.DoubleSide,depthWrite:false}));wake.rotation.x=-Math.PI/2;wake.position.set(0,.04,4.2);root.add(wake);scene.add(root);boats.push({root,z:64+i*21,dir:i%2?-1:1,lane:i%2?-2.5:2.5});}
 function tick(dt,{night=false,rain=0,dayClock=36,festival=false,showTime=0}={}){clock+=dt;const p=getPos(),cue=showCue(showTime);skylineMaterial.color.setHSL(festival?cue.hue:.55,festival?.82:.5,festival?.57*cue.brightness:.45);for(const m of skylineLEDs)m.visible=night||festival;customsClock.tick(dayClock,night);for(const m of windows)m.visible=lightGroupVisible(m.userData.lightGroup,night,dayClock);for(const m of [...facadeLights,...goldSurfaces])m.visible=night;roadMat.shininess=22+rain*90;roadMat.color.set(rain>.3?'#293b46':'#34424b');for(const l of lamps)l.material.color.set(night?'#ffe2a1':'#c5bda5');
  waibaidu.tick(night);traffic.tick(dt,{night,rain});
  for(const car of cars){const at=car.root.position,a=car.root.rotation.y,front=nanpuFloor(world,at.x-Math.sin(a),at.z-Math.cos(a)),back=nanpuFloor(world,at.x+Math.sin(a),at.z+Math.cos(a));car.root.rotation.x=front!==null&&back!==null?Math.atan2(front-back,2):0;}
  const vehicles=[...traffic.agents,...getObstacles().filter(o=>!o.person)];
  for(const person of pedestrians){if(person.crowdManaged)continue;const close=Math.hypot(p.x-person.root.position.x,p.z-person.root.position.z)<1.1&&Math.abs(p.y-26)<2;if(person.route){const next=close?person.t:(person.t+dt*person.speed)%person.route.lengthMeters,at=routePose(person.route,next);if(pedestrianStepClear(person.root.position,{x:at.x,y:26,z:at.z},vehicles)){person.t=next;person.root.position.set(at.x,26,at.z);person.root.rotation.y=at.yaw;}for(const limb of person.limbs){limb.leg.rotation.x=Math.sin(clock*4+person.phase)*.34*limb.side;limb.arm.rotation.x=-limb.leg.rotation.x*.6;}}else{person.root.position.set(person.point.x,26,person.point.z);person.root.rotation.y=Math.atan2(CITY.shanghai.x-person.point.x,CITY.shanghai.z-person.point.z)+Math.PI;const taking=person.kind==='photo'&&Math.sin(clock*.4+person.phase)>.1;for(const limb of person.limbs)limb.arm.rotation.x=taking?-1.2:0;if(person.camera)person.camera.visible=taking;}person.root.visible=!pedestrianBlocked(person.root.position,vehicles)&&(Math.hypot(p.x-person.root.position.x,p.z-person.root.position.z)>1||Math.abs(p.y-26)>2);}
  for(const boat of boats){boat.z+=dt*boat.dir*1.9;if(boat.z>122){boat.z=122;boat.dir=-1;}if(boat.z<63){boat.z=63;boat.dir=1;}const avoidPier=(boat.lane<0?7:2)*Math.max(0,Math.min(1,(boat.z-106)/8));boat.root.position.set(riverCenter(boat.z)+boat.lane+avoidPier,22.28+Math.sin(clock*1.5+boat.z)*.06,boat.z);boat.root.rotation.y=Math.atan2((riverCenter(boat.z+.2)-riverCenter(boat.z-.2))/.4,1)+(boat.dir>0?Math.PI:0);}
 }
 // Merge static streets, windows and facade details by material. Moving people/cars stay animated.
 const animated=new Set([...cars,...boats,...pedestrians].map(o=>o.root).concat(customsClock.root)),nightSet=new Map([...windows.map(m=>[m,'window']),...facadeLights.map(m=>[m,'facade']),...goldSurfaces.map(m=>[m,'wash']),...skylineLEDs.map(m=>[m,'skyline-led'])]),batches=new Map(),v=new THREE.Vector3(),n=new THREE.Vector3(),normalMatrix=new THREE.Matrix3();
 scene.updateMatrixWorld(true);
 for(const root of [...scene.children]){if(existingObjects.has(root)||animated.has(root)||root.isSprite)continue;
  root.traverse(o=>{if(!o.isMesh||o.userData.panel)return;const kind=nightSet.get(o),group=o.userData.lightGroup;const key=o.material.uuid+':'+kind+':'+(group??'');let b=batches.get(key);if(!b){b={material:o.material,kind,group,position:[],normal:[],uv:[],index:[]};batches.set(key,b);}const g=o.geometry,p=g.attributes.position,no=g.attributes.normal,uv=g.attributes.uv,base=b.position.length/3;normalMatrix.getNormalMatrix(o.matrixWorld);for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld);b.position.push(v.x,v.y,v.z);n.fromBufferAttribute(no,i).applyMatrix3(normalMatrix).normalize();b.normal.push(n.x,n.y,n.z);b.uv.push(uv?.getX(i)??0,uv?.getY(i)??0);}if(g.index){for(let i=0;i<g.index.count;i++)b.index.push(base+g.index.getX(i));}else for(let i=0;i<p.count;i++)b.index.push(base+i);});scene.remove(root);
 }
 windows.length=0;facadeLights.length=0;goldSurfaces.length=0;skylineLEDs.length=0;
 for(const b of batches.values()){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(b.position,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(b.normal,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(b.uv,2));g.setIndex(b.index);g.computeBoundingSphere();const m=new THREE.Mesh(g,b.material);m.userData.range=285;scene.add(m);if(b.kind==='window'){m.userData.lightGroup=b.group;windows.push(m);}else if(b.kind==='facade')facadeLights.push(m);else if(b.kind==='wash')goldSurfaces.push(m);else if(b.kind==='skyline-led')skylineLEDs.push(m);}
 for(const p of pedestrians){const at=p.route?routePose(p.route,p.t):p.point;p.root.position.set(at.x,26,at.z);}
 const traffic=createCityTraffic({scene,world,getPos,routePose,cars,getObstacles:()=>[...getObstacles(),...pedestrians.map(p=>({root:p.root,person:true}))]});
 tick(0,{});
 return {tick,customsClock,cars,boats,pedestrians,windows,facadeLights,goldSurfaces,skylineLEDs,traffic,collides:(x,y,z)=>traffic.collides(x,y,z)||cars.some(c=>{if(y>=c.root.position.y+1.3||y+1.75<=c.root.position.y)return false;const dx=x-c.root.position.x,dz=z-c.root.position.z,a=c.root.rotation.y;return Math.abs(dx*Math.cos(a)-dz*Math.sin(a))<.9&&Math.abs(dx*Math.sin(a)+dz*Math.cos(a))<1.55;})};
}
