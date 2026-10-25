import * as THREE from './three.module.js';
import {trace,WORLD_MIN,WORLD_MAX,HEIGHT,LANDMARKS} from './world.js';
const box=new THREE.BoxGeometry(1,1,1),materials=new Map();
function block(parent,color,x,y,z,w,h,d){let mat=materials.get(color);if(!mat){mat=new THREE.MeshLambertMaterial({color});materials.set(color,mat)}const m=new THREE.Mesh(box,mat);m.position.set(x,y,z);m.scale.set(w,h,d);parent.add(m);return m;}
function label(text,color='#d5fd87'){
 const c=document.createElement('canvas');c.width=256;c.height=64;const ctx=c.getContext('2d');ctx.fillStyle='#14303cdd';ctx.fillRect(0,0,256,64);ctx.fillStyle=color;ctx.font='bold 28px sans-serif';ctx.textAlign='center';ctx.fillText(text,128,43);
 const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;const s=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,depthTest:true}));s.scale.set(1.25,.3125,1);return s;
}
const rounded=new THREE.SphereGeometry(1,14,10);
function round(parent,color,x,y,z,w,h,d){let mat=materials.get(color);if(!mat){mat=new THREE.MeshLambertMaterial({color});materials.set(color,mat)}const m=new THREE.Mesh(rounded,mat);m.position.set(x,y,z);m.scale.set(w,h,d);parent.add(m);return m;}
function makeDragon(){
 const root=new THREE.Group(),body=new THREE.Group();root.add(body);
 round(body,'#f9cb38',0,1.32,-.07,.93,1.15,.7);
 round(body,'#fff0b0',0,1.19,.67,.65,.73,.2);
 const head=new THREE.Group();head.position.set(0,2.18,.18);body.add(head);
 round(head,'#ffd744',0,0,0,.63,.61,.55);
 round(head,'#ffdc4c',0,-.12,.4,.49,.3,.3);
 for(const side of [-1,1]){
  round(head,'#282c29',side*.245,.115,.507,.057,.1,.025);
  round(head,'#ffffff',side*.23,.15,.53,.019,.027,.01);
  const brow=block(head,'#b78326',side*.25,.26,.475,.16,.035,.026);brow.rotation.z=-side*.2;
  round(head,'#dda42c',side*.12,-.08,.69,.028,.018,.01);
 }
 round(head,'#633322',0,-.27,.634,.25,.16,.055);
 block(head,'#fffbe5',0,-.19,.687,.31,.065,.024);
 round(head,'#f48f84',0,-.34,.677,.12,.04,.018);
 const arms=[];for(const side of [-1,1]){const arm=new THREE.Group();arm.position.set(side*.81,1.83,.03);body.add(arm);round(arm,'#f9cd3c',0,-.32,.03,.22,.46,.23);round(arm,'#ffd744',0,-.61,.13,.23,.2,.23);arm.rotation.z=side*.15;arms.push(arm)}
 const legs=[];for(const x of [-.44,.44]){const leg=new THREE.Group();leg.position.set(x,.53,.04);root.add(leg);round(leg,'#edbc30',0,-.14,0,.28,.4,.29);round(leg,'#ffcf39',0,-.39,.13,.32,.16,.39);legs.push(leg)}
 const tail=round(body,'#edbc30',0,.76,-.8,.4,.35,.66);round(tail,'#ffce38',0,.05,-.65,.65,.75,.7);
 return {root,body,head,arms,legs,tail,height:3.35};
}
export function createCompanions(scene,world,notify,onInteraction){
 const npcs=[{kind:'dragon',name:'奶龙',home:{x:LANDMARKS.village.x-1,z:LANDMARKS.village.z-4},...makeDragon()}];
 const particles=[];let nextTalk=0;
 function floorAt(x,z,reference){for(let y=Math.min(HEIGHT-2,Math.floor(reference+1));y>=0;y--)if(world.get(Math.floor(x),y,Math.floor(z)))return y+1;return 1}
 function clear(n,x,y,z){for(let ix=Math.floor(x-.65);ix<=Math.floor(x+.65);ix++)for(let iy=Math.floor(y+.01);iy<=Math.floor(y+(2.85));iy++)for(let iz=Math.floor(z-.7);iz<=Math.floor(z+.7);iz++)if(world.get(ix,iy,iz))return false;return true}
 for(const n of npcs){n.root.position.set(n.home.x,world.ground(n.home.x,n.home.z),n.home.z);n.root.rotation.y=n.kind==='dragon'?.2:-.5;n.follow=false;n.heading=0;n.timer=5;n.phase=0;n.happy=0;n.line=0;const tag=label(n.name,'#ffe776');tag.position.y=n.height;n.root.add(tag);n.tag=tag;scene.add(n.root);}
 function burst(at,color,count=9){for(let i=0;i<count;i++){const m=block(scene,color,at.x,at.y,at.z,.08,.08,.08);particles.push({mesh:m,vx:(Math.random()-.5)*2,vy:1+Math.random()*2,vz:(Math.random()-.5)*2,life:.7+Math.random()*.4})}}
 function nearest(pos,camera){let best=null,dist=4.8;for(const n of npcs){const d=Math.hypot(pos.x-n.root.position.x,pos.z-n.root.position.z,pos.y-n.root.position.y);if(d>=dist)continue;const delta=new THREE.Vector3(n.root.position.x,n.root.position.y+1.4,n.root.position.z).sub(camera.position);const hit=trace(world,camera.position,delta.clone().normalize(),delta.length());if(hit)continue;best=n;dist=d}return best}
 function interact(pos,camera,follow=false){const n=nearest(pos,camera);if(!n){notify('走近奶龙，再按 G 打招呼');return}if(follow){n.follow=!n.follow;notify(n.follow?`${n.name}开始跟着你散步啦`:`${n.name}留在这里自由活动`);return}
  const now=performance.now();if(now<nextTalk)return;nextTalk=now+650;n.happy=2.5;
  const lines=['我是奶龙！这座岛以后就是我们的秘密基地啦！','这里是生活岛！涂鸦就在东边，走跨海桥去外滩看三件套吧。','墙边按 B 涂鸦、塔下按 V 登顶，别忘了带上我！','一起跳个舞吧！今天也要开开心心的。'];
  notify(lines[n.line++%lines.length]);burst({x:n.root.position.x,y:n.root.position.y+2.4,z:n.root.position.z},'#ffe985',12);onInteraction(n.kind);
 }
 function update(dt,pos,camera,time){
  for(const n of npcs){n.phase+=dt;n.timer-=dt;n.happy=Math.max(0,n.happy-dt);const p=n.root.position;const dist=Math.hypot(pos.x-p.x,pos.z-p.z);let moving=false;
   if(n.follow&&dist>2.7&&dist<22){n.heading=Math.atan2(pos.x-p.x,pos.z-p.z);moving=true;}else if(!n.follow&&n.timer<0){n.heading=Math.atan2(n.home.x-p.x,n.home.z-p.z)+(Math.random()-.5)*2.4;n.timer=3+Math.random()*5;}
   if(!n.follow&&n.timer<2&&dist>2.6)moving=true;
   if(n.happy>0)moving=false;
   const floor=floorAt(p.x,p.z,p.y);if(p.y>floor)p.y=Math.max(floor,p.y-dt*8);
   if(moving){const speed=n.follow?1.8:.55;const nx=p.x+Math.sin(n.heading)*speed*dt,nz=p.z+Math.cos(n.heading)*speed*dt,ny=floorAt(nx,nz,p.y);
    if(nx>WORLD_MIN+3&&nz>WORLD_MIN+3&&nx<WORLD_MAX-3&&nz<WORLD_MAX-3&&ny>=23&&Math.abs(ny-p.y)<=1.05&&clear(n,nx,ny,nz)){p.x=nx;p.z=nz;p.y=ny;n.root.rotation.y=n.heading;}
    else{moving=false;n.heading+=Math.PI*.7;n.timer=1.5;}
   }
   if(dist<4&&!moving)n.root.rotation.y=Math.atan2(pos.x-p.x,pos.z-p.z);
   n.body.position.y=n.happy>0&&n.kind==='dragon'?Math.abs(Math.sin(n.phase*8))*.23:moving?Math.sin(n.phase*9)*.035:Math.sin(time*1.7)*.012;
   n.legs.forEach((leg,i)=>leg.rotation.x=moving?Math.sin(n.phase*9+i*Math.PI)*.4:0);
   if(n.arms)n.arms.forEach((a,i)=>a.rotation.z=n.happy>0?Math.sin(n.phase*10+i)*.7:Math.sin(time*2+i)*.06);
   n.head.rotation.x=n.happy>0?Math.sin(n.phase*5)*.08:0;n.tail.rotation.z=Math.sin(time*4)*(n.happy>0?.45:.13);
   n.tag.visible=dist<18;
  }
  for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.life-=dt;p.vy-=dt*3;p.mesh.position.x+=p.vx*dt;p.mesh.position.y+=p.vy*dt;p.mesh.position.z+=p.vz*dt;p.mesh.rotation.x+=dt*4;if(p.life<=0){scene.remove(p.mesh);particles.splice(i,1)}}
 }
 function occupied(p){return npcs.some(n=>p.x+1>n.root.position.x-.65&&p.x<n.root.position.x+.65&&p.z+1>n.root.position.z-.7&&p.z<n.root.position.z+.7&&p.y+1>n.root.position.y&&p.y<n.root.position.y+2.85)}
 function recall(pos){for(const n of npcs){let found=false;for(const [dx,dz] of [[2,2],[-2,2],[2,-2],[-2,-2],[3,0]]){const x=pos.x+dx,z=pos.z+dz,y=floorAt(x,z,pos.y);if(y>6&&Math.abs(y-pos.y)<5&&clear(n,x,y,z)){n.root.position.set(x,y,z);n.follow=true;n.happy=2;found=true;break}}notify(found?'奶龙：我来啦！一起去找灵感晶体吧。':'这里不方便落脚，到平地上再召唤奶龙吧。')}}
 return {update,nearest,interact,burst,occupied,npcs,recall};
}
