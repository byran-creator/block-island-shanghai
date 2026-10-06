import {createProduct,SHOP_PRODUCTS} from './city-products.js';
import * as THREE from './three.module.js';
import {batchMeshes,staticMeshes} from './mesh-batch.js';
import {DENSE_BUILDINGS} from './city-layout.js';
import {riverWestEdge,riverEastEdge,MAGNOLIA} from './shanghai-map.js';
import {overlaps} from './world.js';
import {boatWorld} from './boat-support.js';
import {shopSignAnchor} from './shop-sign-layout.js';
import {pedestrianBlocked,pedestrianStepClear} from './pedestrian-traffic.js';

export const SHOP_NAMES=['永安百货','先施商厦','上海时装','老字号眼镜','沪上书店','光影唱片','海派咖啡','鲜肉月饼','小笼生煎','南京路礼品'];
export const NEON_COLORS=['#ff4f9c','#42eaff','#ab71ff','#ffe176','#49efbb'];
export const FERRY_STOPS=[{name:'金陵东路渡口',x:riverWestEdge(185)-11,z:185,y:26},{name:'东昌路渡口',x:riverEastEdge(136)+8,z:136,y:26}];
export function ferryPhase(time){const t=((time%94)+94)%94;if(t<12)return {port:0,u:0};if(t<47)return {port:null,u:(t-12)/35};if(t<59)return {port:1,u:1};return {port:null,u:1-(t-59)/35};}
export function ferryPosition(time){const phase=ferryPhase(time),a={x:riverWestEdge(185)+7,z:185},b={x:riverEastEdge(136)-13,z:136};return {...phase,x:a.x+(b.x-a.x)*phase.u,z:a.z+(b.z-a.z)*phase.u,y:22.3,yaw:Math.atan2(b.x-a.x,b.z-a.z)+(time%94<59?Math.PI:0)};}

export function createCityActivity({scene,world,getPos,getState,teleport,lookAt=()=>{},notify,pause,resume,onProgress,getVehicles=()=>[],onEvent=()=>{}}){
 const $=id=>document.getElementById(id),root=new THREE.Group(),signs=[],neons=[],vendors=[],tourists=[],stalls=[],shopLights=[];root.name='nanjing-street-life';scene.add(root);
 const box=new THREE.BoxGeometry(1,1,1),mats=new Map();let clock=0,ride=null,panel=false,cooldown=0,purchases=0;const goods=Object.fromEntries(Object.keys(SHOP_PRODUCTS).map(k=>[k,0]));
 function material(color,glow=false){const key=color+glow;if(!mats.has(key))mats.set(key,glow?new THREE.MeshBasicMaterial({color}):new THREE.MeshLambertMaterial({color}));return mats.get(key);}
 function cube(parent,color,x,y,z,sx,sy,sz,glow=false){const m=new THREE.Mesh(box,material(color,glow));m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.userData.range=240;parent.add(m);return m;}
 function board(text,color,x,y,z,w,h,angle=0,graffiti=false){
  const compact=graffiti&&[...text].length===1,c=document.createElement('canvas');c.width=compact?128:512;c.height=graffiti?128:512;const ctx=c.getContext('2d');ctx.fillStyle='#172232';ctx.fillRect(0,0,c.width,c.height);ctx.strokeStyle=color;ctx.lineWidth=10;ctx.strokeRect(12,12,c.width-24,c.height-24);ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`bold ${graffiti?70:86}px sans-serif`;ctx.strokeStyle='#050b16';ctx.lineWidth=7;ctx.shadowColor=color;ctx.shadowBlur=12;ctx.fillStyle=color;
  if(graffiti){ctx.strokeText(text,c.width/2,64);ctx.fillText(text,c.width/2,64);}else{const letters=[...text];letters.slice(0,5).forEach((c,i)=>{ctx.strokeText(c,256,60+i*92);ctx.fillText(c,256,60+i*92);});}
  const map=new THREE.CanvasTexture(c);map.colorSpace=THREE.SRGBColorSpace;const day=new THREE.MeshLambertMaterial({map,side:THREE.DoubleSide}),night=new THREE.MeshBasicMaterial({map,side:THREE.DoubleSide});const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),day);m.position.set(x,y,z);m.rotation.y=angle;m.userData.range=240;root.add(m);signs.push({mesh:m,day,night});return m;
 }
 const fronts=DENSE_BUILDINGS.filter(b=>b.id.startsWith('nanjing-'));
 for(const [i,b]of fronts.entries()){
  const side=b.entranceSide,name=i%3===0&&i%12!==0?(i%2?'海派文创':'老字号月饼'):SHOP_NAMES[i%SHOP_NAMES.length],color=NEON_COLORS[i%5],front=shopSignAnchor(b,30.3),{z,angle}=front;
  board(name,color,front.x,front.y,z,Math.min(b.rx*2,front.width-.2),1.3,angle,true);
  // Individual letters follow each storey's wall; a tall plane formerly floated in
  // front of the recessed upper floors or even above the building's roof.
  for(const [j,letter]of [...(i%2?'沪上好物':'海派食光')].entries()){
   const a=shopSignAnchor(b,32.5+j,b.rx-1.1);
   board(letter,NEON_COLORS[(i+2)%5],a.x,a.y,a.z,1,.85,a.angle,true);
  }
  const crown=shopSignAnchor(b,25.3+b.h);
  board(name,NEON_COLORS[(i+1)%5],crown.x,crown.y,crown.z,Math.min(b.rx*2,crown.width-.2),1.3,crown.angle,true);
  for(let level=1;level<Math.min(b.h,13);level++)for(const dx of [-b.rx+1,b.rx-1]){const a=shopSignAnchor(b,26+level,dx);neons.push(cube(root,color,a.x,a.y,a.z,.09,.95,.06,true));}
  if(i%4===0){const light=new THREE.PointLight(color,7,12,1.5);light.position.set(b.x+.5,29,z+side*2);root.add(light);shopLights.push(light);}
 }
 function person(i,parent=root){const r=new THREE.Group(),shirt=['#6cd9de','#d66c8e','#eee5d4','#8f9fc9','#dfad5b'][i%5];cube(r,shirt,0,1,0,.45,.64,.28);cube(r,'#dcb08d',0,1.52,0,.34,.35,.33);cube(r,'#40352e',0,1.72,0,.36,.08,.35);const arms=[],legs=[];for(const side of [-1,1]){const arm=cube(r,shirt,side*.29,1.02,0,.15,.55,.18);arms.push(arm);legs.push(cube(r,'#43516b',side*.13,.36,0,.17,.7,.2));}parent.add(r);return {root:r,arms,legs};}
 for(let i=0;i<fronts.length;i+=3){const b=fronts[i],side=b.entranceSide,indoor=i%12!==0,x=b.x+2.4,z=indoor?b.z:side>0?63.1:69.9;
  if(overlaps(world,x,26,z))continue;
  const food=i%2===0,product=food?(indoor?'mooncake':'bun'):'gift',stall=new THREE.Group();stall.name=indoor?'indoor-shop-counter':'street-food-stall';stall.position.set(x,26,z);root.add(stall);cube(stall,food?'#996e47':'#668c99',0,.9,0,2.4,.18,1.2);for(const dx of [-1.05,1.05])cube(stall,'#765c46',dx,.44,0,.12,.88,1);
  if(indoor){for(const dz of [-.59,.59]){const glass=cube(stall,'#b9dde2',0,1.3,dz,2.4,.6,.025);glass.material=new THREE.MeshLambertMaterial({color:'#d2eef2',transparent:true,opacity:.16,depthWrite:false});}const lid=cube(stall,'#d2eef2',0,1.61,0,2.45,.025,1.25);lid.material=new THREE.MeshLambertMaterial({color:'#d2eef2',transparent:true,opacity:.12,depthWrite:false});cube(stall,'#fff0ce',0,3.3,0,2.1,.06,.7,true);}
  else{cube(stall,NEON_COLORS[i%5],0,2.5,0,2.6,.16,1.5);for(const dx of [-1.1,1.1])cube(stall,'#7b8e99',dx,1.7,.6,.07,1.5,.07);}
  const stock=[];for(let j=0;j<6;j++){const unit=createProduct(product);unit.scale.setScalar(.52);unit.position.set((j%3-1)*.7,1.01,(Math.floor(j/3)-.5)*.5);stall.add(unit);stock.push(unit);}
  stalls.push({x,z,rx:1.5,rz:.9});const vendor=person(i);vendor.root.position.set(x,26,z-side*.95);vendor.root.rotation.y=side>0?0:Math.PI;vendors.push({id:b.id,x,z,name:indoor?(food?'老字号月饼 · 店内柜台':'海派文创 · 店内柜台'):'街边生煎摊',food,product,indoor,building:b,stock,remaining:6,root:vendor.root});board(food?(indoor?'鲜肉月饼':'小笼生煎'):'海派好物',NEON_COLORS[i%5],x,indoor?28.6:28.05,z-side*.8,2.6,.7,side>0?0:Math.PI,true);
  const customer=person(i+7);customer.root.position.set(x,26,z+side*1.3);customer.root.rotation.y=side>0?Math.PI:0;const parcel=createProduct(product);parcel.scale.setScalar(.5);parcel.position.set(.38,food?1.35:.6,-.1);customer.root.add(parcel);tourists.push({...customer,kind:food?'eat':'shop',parcel,stationary:true,phase:i});
 }
 for(let i=0;i<40;i++){const p=person(i+13),bag=cube(p.root,['#fc869b','#50caca','#d4b572'][i%3],.35,.57,0,.3,.38,.2);tourists.push({...p,kind:'walk',bag,t:i*8.1,phase:i*.8});}
 // Last-mile delivery is on foot in the pedestrian street, matching the photographed P+W arrangement.
 for(let i=0;i<3;i++){const p=person(i+80),color=i%2?'#55acd4':'#f6c74b';p.root.children[0].material=material(color);for(const arm of p.arms)arm.material=material(color);cube(p.root,color,0,1.82,0,.39,.15,.37);cube(p.root,color,0,1.02,.3,.44,.45,.26);const bag=cube(p.root,'#f4eee1',.36,.63,-.05,.3,.4,.23);tourists.push({...p,kind:'delivery-walk',bag,t:75+i*66,phase:i*.8});}
 const landings=FERRY_STOPS.map(stop=>{for(let r=0;r<=12;r++)for(const [dx,dz]of [[r,0],[-r,0],[0,r],[0,-r]]){const p={...stop,x:Math.floor(stop.x+dx)+.5,z:Math.floor(stop.z+dz)+.5};if(!overlaps(world,p.x,26,p.z)&&overlaps(world,p.x,25.9,p.z))return p;}throw new Error('No safe ferry landing: '+stop.name);});
 for(const [i,p]of landings.entries()){
  board(p.name,'#61daef',p.x,29,p.z,5,1.2,0,true);cube(root,'#718b96',p.x-2,27.3,p.z,.16,2.6,.16);for(let j=0;j<4;j++){const guest=person(60+i*4+j);guest.root.position.set(p.x+(j-1.5)*.7,26,p.z+2);}
 }
 const ferry=new THREE.Group();ferry.name='huangpu-passenger-ferry';scene.add(ferry);cube(ferry,'#e4ebed',0,.45,0,5.4,.9,11);cube(ferry,'#3c91ba',0,.2,0,5.5,.35,11.1);cube(ferry,'#f0ece1',0,1.4,0,4.5,1.35,8.4);cube(ferry,'#d1e7ea',0,2.25,0,4.9,.18,9);cube(ferry,'#f4f3e8',0,2.8,-2.8,3.8,1.1,2.7);
 for(const side of [-1,1]){cube(ferry,'#7bb7cb',side*2.27,1.58,0,.06,.7,7);cube(ferry,'#cedcde',side*2.35,2.65,1,.09,.75,6.2);for(let z=-3;z<=3;z++)cube(ferry,'#e9f2ef',side*2.37,1.58,z,.09,.85,.1);}
 cube(ferry,'#456475',0,3.45,-2.8,4,.16,2.9);for(let i=0;i<6;i++){const guest=person(80+i,ferry);guest.root.position.set(i%2?1.2:-1.2,2.35,i%3*1.4-.4);guest.root.scale.setScalar(.65);}const ferryLamps=[cube(ferry,'#fa8c86',-2.5,1.3,-4.4,.18,.18,.2,true),cube(ferry,'#a8edca',2.5,1.3,-4.4,.18,.18,.2,true)];
 // The main tower has a white petal crown around an unobstructed landing pad.
 const heli=new THREE.Group();heli.name='magnolia-parked-helicopter';heli.position.set(MAGNOLIA.x-1.5,83,MAGNOLIA.z-1);root.add(heli);
 cube(heli,'#dfeaf0',0,1.4,0,2,1.55,3.4);cube(heli,'#61a9c0',0,1.55,-1.75,1.8,.9,.1);cube(heli,'#cedce2',0,1.5,3.2,.4,.45,4.2);cube(heli,'#dbad65',0,2.4,5.1,.2,1.6,1.1);for(const side of [-1,1])cube(heli,'#455966',side*1.1,.22,.3,.15,.16,4);cube(heli,'#445764',0,2.55,0,.18,.8,.18);cube(heli,'#657d88',0,2.9,0,9.5,.09,.18);cube(heli,'#657d88',0,2.9,0,.18,.09,9.5);
 for(let i=0;i<7;i++){const a=i*Math.PI*2/7;cube(root,'#eaf1ee',MAGNOLIA.x+Math.cos(a)*8,85,MAGNOLIA.z+Math.sin(a)*7,1.3,4.5,1.4);}
 const pad=new THREE.Mesh(new THREE.PlaneGeometry(10,9),material('#46606a'));pad.rotation.x=-Math.PI/2;pad.position.set(MAGNOLIA.x,83.02,MAGNOLIA.z);root.add(pad);const h=board('H','#f9f2c6',MAGNOLIA.x,83.05,MAGNOLIA.z,3,3,0,true);h.rotation.x=-Math.PI/2;
 function close(){if(!panel)return;panel=false;$('city-dialog').close();resume();}
 $('city-close').onclick=close;$('city-dialog').addEventListener('cancel',e=>{e.preventDefault();close();});
 function nearestVendor(){const p=getPos();return Math.abs(p.y-26)<2?vendors.find(v=>Math.hypot(p.x-v.x,p.z-v.z)<2.5&&(!v.indoor||Math.abs(p.z-v.building.z)<v.building.rz-.3)):null;}
 function showStock(v){v.stock.forEach((m,i)=>m.visible=i<v.remaining);}
 function use(){if(ride){notify('轮渡正在过江，抵达后会自动下船。');return true;}const p=getPos(),port=landings.findIndex(s=>Math.hypot(p.x-s.x,p.z-s.z)<3&&Math.abs(p.y-26)<2);
  if(port>=0){if(ferryPhase(clock).port!==port){notify('轮渡还未靠岸，请在渡口候船。');return true;}ride={from:port};notify('已登上轮渡，正在前往'+landings[1-port].name+'。');return true;}
  const v=nearestVendor();if(!v)return false;pause();panel=true;$('city-title').textContent=v.name;$('city-result').textContent='柜台现货 '+v.remaining+' 份 · 购物袋已有 '+(goods[v.product]??0)+' 份'+SHOP_PRODUCTS[v.product].name+'。';$('city-actions').replaceChildren();const button=document.createElement('button');button.className='recipe-card';const label=()=>button.textContent=v.remaining?'购买'+SHOP_PRODUCTS[v.product].name+' · 库存 '+v.remaining:'已售罄';label();button.disabled=!v.remaining;button.onclick=()=>{if(!v.remaining)return;if(cooldown>0){$('city-result').textContent='刚买过一份，稍后再来。';return;}if(v.food){const state=getState();state.food+=2;if(state.hunger<20)state.eat();}v.remaining--;goods[v.product]=(goods[v.product]??0)+1;showStock(v);label();button.disabled=!v.remaining;purchases++;cooldown=30;onEvent({type:'shop'});$('city-result').textContent='已购买'+SHOP_PRODUCTS[v.product].name+'，柜台少一份；购物袋共 '+goods[v.product]+' 份'+(v.food?'，食物已加入背包。':'。');onProgress();};$('city-actions').appendChild(button);$('city-dialog').showModal();return true;
 }
 function tick(dt,{night=false}={}){clock+=dt;cooldown=Math.max(0,cooldown-dt);for(const s of signs)s.mesh.material=night?s.night:s.day;for(const m of neons)m.visible=night;for(const m of shopLights)m.visible=night;for(const m of ferryLamps)m.visible=night;const f=ferryPosition(clock);ferry.position.set(f.x,f.y,f.z);ferry.rotation.y=f.yaw;
  if(ride){if(f.port===null)ride.departed=true;if(f.port===1-ride.from){teleport(landings[f.port]);const trip=ride;ride=null;if(trip.departed)onEvent({type:'ferry',from:trip.from,to:f.port,departed:true});notify('已抵达'+landings[f.port].name+'。');onProgress();}else{const deck=boatWorld(ferry,{x:0,z:1.8});teleport({...deck,y:f.y+2.34});}}
  const vehicles=getVehicles();
  for(const p of tourists){if(p.stationary){p.arms[0].rotation.x=p.kind==='eat'?-1.1+Math.sin(clock*1.5+p.phase)*.2:-.3;continue;}const next=(p.t+dt*.9)%290,q=next<145?next:290-next,target={x:-181+q,y:26,z:next<145?65:68};if(!p.ready){for(let i=0;i<3000&&pedestrianBlocked(target,vehicles);i++){p.t=(p.t+.1)%290;const q=p.t<145?p.t:290-p.t;Object.assign(target,{x:-181+q,z:p.t<145?65:68});}p.root.position.set(target.x,26,target.z);p.ready=true;}else if(pedestrianStepClear(p.root.position,target,vehicles)){p.t=next;p.root.position.set(target.x,26,target.z);}p.root.rotation.y=p.t<145?-Math.PI/2:Math.PI/2;for(let i=0;i<2;i++){p.legs[i].rotation.x=Math.sin(clock*4+p.phase)*(i?-.25:.25);p.arms[i].rotation.x=-p.legs[i].rotation.x;}}
  const v=nearestVendor(),port=landings.find(s=>Math.hypot(getPos().x-s.x,getPos().z-s.z)<3&&Math.abs(getPos().y-26)<2);$('city-prompt').hidden=!(v||port||ride);$('city-prompt').textContent=ride?'轮渡过江中 · 抵达自动下船':port?'V 搭乘轮渡 · '+port.name:v?'V '+(v.indoor?'店内购物':'逛摊位')+' · '+v.name:'';
 }
 const moving=new Set([...tourists,...vendors].map(p=>p.root).concat(vendors.flatMap(v=>v.stock),heli,signs.map(s=>s.mesh),neons,shopLights));
 batchMeshes(root,staticMeshes(root,moving),'street-furniture');neons.splice(0,neons.length,...batchMeshes(root,neons,'street-neon'));shopLights.splice(0,shopLights.length,...batchMeshes(root,shopLights,'shop-lights'));
 tick(0);return {tick,use,close,signs,neons,vendors,tourists,stalls,ferry,heli,landings,goods,isPanelOpen:()=>panel,isRiding:()=>!!ride,cancelRide:()=>{if(ride){teleport(landings[ride.from]);ride=null;}},safeSavePoint:()=>ride?{...landings[ride.from]}:null,serialize:()=>({cooldown,purchases,goods:{...goods},stock:Object.fromEntries(vendors.map(v=>[v.id,v.remaining]))}),restore:d=>{ride=null;for(const id of Object.keys(SHOP_PRODUCTS))goods[id]=Math.max(0,Math.min(99999,Math.floor(Number(d?.goods?.[id])||0)));for(const v of vendors){const count=d?.stock?.[v.id];v.remaining=Number.isFinite(count)?Math.max(0,Math.min(6,Math.floor(count))):6;showStock(v);}cooldown=Math.max(0,Math.min(30,Number(d?.cooldown)||0));purchases=Math.max(0,Math.floor(Number(d?.purchases)||0));},collides:(x,y,z)=>y<28&&y+1.75>26&&stalls.some(s=>Math.abs(x-s.x)<s.rx&&Math.abs(z-s.z)<s.rz)||!heli.userData.piloted&&y<heli.position.y+2.5&&y+1.75>heli.position.y&&Math.abs(x-heli.position.x)<1.6&&Math.abs(z-heli.position.z)<2.1};
}
