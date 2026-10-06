import * as THREE from './three.module.js';
import {overlaps} from './world.js';

const hud=p=>`X ${Math.round(p.x-40)} · Z ${Math.round(p.z-40)}`;
export function createNpcGuides({scene,world,civil,activity,getPos,getVehicles,pause,resume,notify,lookAt=()=>{},extraPeople=[]}){
 const $=id=>document.getElementById(id),roles=[],reactions=new Map();let panel=false;
 const people=[...extraPeople,...civil.pedestrians.map(p=>({...p,person:true})),...activity.tourists.map(p=>({...p,person:true})),...activity.vendors.map(p=>({...p,person:true})),...civil.traffic.officers.map(p=>({...p,person:true}))];
 const actors=[...people,...civil.traffic.agents];
 function role(actor,title,color){
  const canvas=document.createElement('canvas');canvas.width=320;canvas.height=64;const c=canvas.getContext('2d');c.fillStyle='#16333be8';c.fillRect(0,0,320,64);c.fillStyle=color;c.font='bold 26px sans-serif';c.textAlign='center';c.fillText(title+' · V 对话',160,43);
  const tag=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(canvas),depthWrite:false}));tag.scale.set(actor.metroRole?1.7:2.3,actor.metroRole ? .34 : .46,1);tag.position.y=2.55;actor.root.add(tag);roles.push({actor,title,tag});
 }
 for(const p of people){if(p.npcRole||p.metroRole)role(p,p.npcRole||p.metroRole,'#9ed6ef');else if(p.signal)role(p,'交警','#a5d9ff');else if(p.name)role(p,p.food?'美食商贩':'纪念品商贩','#ffd58a');else if(p.kind==='delivery-walk')role(p,'外卖小哥','#a9ebc0');}
 for(const p of civil.traffic.riders)if(p.kind==='delivery')role(p,'外卖小哥','#a9ebc0');
 function nearest(){const p=getPos();return roles.filter(r=>r.actor.root.visible!==false&&Math.abs(r.actor.root.position.y-p.y)<2&&r.actor.root.position.distanceTo(new THREE.Vector3(p.x,p.y,p.z))<2.8).sort((a,b)=>a.actor.root.position.distanceToSquared(p)-b.actor.root.position.distanceToSquared(p))[0];}
 function close(resumeGame=true){if(!panel)return;panel=false;$('npc-dialog').close();document.body?.classList.remove('in-dialogue');if(resumeGame)resume();}
 function button(title,action){const b=document.createElement('button');b.className='recipe-card';b.textContent=title;b.onclick=action;$('npc-actions').appendChild(b);}
 function use(){const r=nearest();if(!r)return false;lookAt({x:r.actor.root.position.x,y:r.actor.root.position.y+1.5,z:r.actor.root.position.z});pause();panel=true;document.body?.classList.add('in-dialogue');$('npc-title').textContent=r.title;$('npc-actions').replaceChildren();
  const text=s=>$('npc-answer').textContent=s;
  if(r.actor.guide){text(r.actor.guide.intro);for(const [title,answer]of r.actor.guide.choices)button(title,()=>text(answer));}
  else if(r.actor.signal){text('你好，路口请留意红绿灯，慢行并礼让行人。需要问路吗？');button('自行车和汽车在哪里？',()=>{const v=getVehicles().filter(v=>v.kind==='bicycle'||v.kind==='car').sort((a,b)=>a.root.position.distanceToSquared(getPos())-b.root.position.distanceToSquared(getPos()))[0];text(v?`最近的${v.kind==='bicycle'?'薄荷绿自行车':'黄色汽车'}在 ${hud(v.root.position)}。靠近按 V；1/2/3 调整配速，空格刹车。`:'停车点暂时没有可用车辆。');});button('怎么上公交？',()=>{const bus=civil.traffic.buses.slice().sort((a,b)=>a.root.position.distanceToSquared(getPos())-b.root.position.distanceToSquared(getPos()))[0];text(`找蓝白色公交，路边等它停稳后靠近车门按 V。上车后自动沿线行驶，再按 V 下车。${bus?'最近一辆现在位于 '+hud(bus.root.position)+'。':''}`);});button('路口怎么通行？',()=>text('观察面向你行驶方向的信号灯：绿灯通行，红黄灯停车。W 渐进加速，S 先刹车再倒车；空格急刹。行人会避让，但仍请主动减速。'));}
  else if(r.actor.name){text(r.actor.food?(r.actor.product==='mooncake'?'来一份鲜肉月饼吗？玻璃柜台里的现货买一份少一份，饿了按 Z。':'来一份热乎的生煎包吗？摊上的现货买一份少一份，饿了按 Z。'):'欢迎逛南京路！这里有海派纪念品，也可以问我附近怎么玩。');button('附近有什么好逛的？',()=>text('沿南京路步行街看两侧霓虹店招、广告和摊位；往江边走能到外滩。按 M 可以查看地图并传送到主要景点。'));button(r.actor.indoor?'看看店内柜台':'看看摊位',()=>{close();if(!activity.use())notify('请再靠近售卖柜台按 V。');});}
  else{text('我在送餐。步行街里下车走，外围道路可以骑车。');button('骑车有什么窍门？',()=>text('W 踩踏加速，松开后滑行；A/D 转向，低速更好拐弯。1 慢速、2 巡航、3 快速，空格刹车，V 下车。'));}
  $('npc-dialog').showModal();return true;
 }
 $('npc-close').onclick=()=>close();$('npc-dialog').addEventListener('cancel',e=>{e.preventDefault();close();});
 function impact(actor,vx,vz,strength){if(!actor?.root||!actor.person)return;let r=reactions.get(actor.root);if(!r){r={actor,offset:new THREE.Vector3(),applied:new THREE.Vector3(),velocity:new THREE.Vector3(),roll:actor.root.rotation.z,time:0};reactions.set(actor.root,r);}r.velocity.set(vx,0,vz).normalize().multiplyScalar(Math.min(1.8,strength*.16));r.time=.65;}
 function beginTick(){for(const [root,r]of reactions){root.position.sub(r.applied);root.rotation.z=r.roll;r.applied.set(0,0,0);}}
 function tick(dt){
  for(const [root,r]of reactions){r.time=Math.max(0,r.time-dt);const next=r.offset.clone().addScaledVector(r.velocity,dt);r.velocity.multiplyScalar(Math.exp(-7*dt));if(!r.time)next.multiplyScalar(Math.exp(-6*dt));const p=root.position.clone().add(next);if(!overlaps(world,p.x,p.y,p.z)&&overlaps(world,p.x,p.y-.1,p.z))r.offset.copy(next);root.position.add(r.offset);r.applied.copy(r.offset);root.rotation.z=r.roll+Math.sin(r.time*22)*Math.min(.18,r.time*.2);if(!r.time&&r.offset.length()<.005){root.position.sub(r.applied);root.rotation.z=r.roll;reactions.delete(root);}}
  const p=getPos();for(const r of roles){const d=r.actor.root.position.distanceToSquared(p);r.tag.visible=!panel&&d<22*22&&d>(r.actor.metroRole?3.5*3.5:2.25);}const r=nearest();$('guide-prompt').hidden=panel||!r;$('guide-prompt').textContent=r?`V 与${r.title}对话`:'';
 }
 return {actors,roles,use,close,tick,beginTick,impact,isPanelOpen:()=>panel};
}
