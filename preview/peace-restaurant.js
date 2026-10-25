import {createProduct} from './city-products.js';
import {BUND_BUILDINGS} from './city-layout.js';
import {trace} from './world.js';
import * as THREE from './three.module.js';
export const PEACE=BUND_BUILDINGS.find(b=>b.id==='peace');
export const PEACE_DINING={y:42,lift:{x:PEACE.x+3.5,y:26,z:PEACE.z+.5},arrival:{x:PEACE.x+3.5,y:42,z:PEACE.z+.5},counter:{x:PEACE.x-3.5,y:42,z:PEACE.z+.5}};
export const PEACE_MEALS=[{id:'noodles',name:'葱油拌面',food:2},{id:'rice',name:'本帮红烧肉饭',food:3},{id:'tea',name:'龙凤下午茶',food:2}];
export function buildPeaceDining(w){
 const b=PEACE,{x,z}=b;
 w.fill(x-b.rx+1,41,z-b.rz+1,x+b.rx-1,41,z+b.rz-1,9);
 w.fill(x-b.rx+1,42,z-b.rz+1,x+b.rx-1,44,z+b.rz-1,0);
 w.fill(x-b.rx+1,45,z-b.rz+1,x+b.rx-1,45,z+b.rz-1,9);
 // River-facing windows have a low sill so guests can look out without walking off the floor.
 w.fill(x+b.rx,43,z-b.rz+2,x+b.rx,44,z+b.rz-2,0);
 for(const dz of [-3,3])for(const dx of [-2,1]){
  w.set(x+dx,42,z+dz,4);
 }
 w.fill(x-b.rx+1,42,z-1,x-b.rx+2,42,z+1,8);
 for(const dx of [-5,5])for(const dz of [-4,4])w.fill(x+dx,42,z+dz,x+dx,44,z+dz,8);
 // A clear central aisle joins the doorway, lift and service counter.
 w.fill(x-b.rx+3,42,z-1,x+b.rx-1,44,z+1,0);
 w.fill(x+2,26,z-1,x+4,30,z+1,0);
 w.set(x+3,25,z,12);w.set(x+3,41,z,12);
}
export function orderPeaceMeal(state,mealId,dining){
 const meal=PEACE_MEALS.find(m=>m.id===mealId);
 if(!meal||dining.cooldown>0)return false;
 state.food+=meal.food;
 if(state.hunger<20)state.eat();
 dining.cooldown=45;dining.served++;dining.lastMeal=meal.id;return true;
}
export function createPeaceRestaurant({scene,world,getPos,getState,teleport,lookAt=()=>{},notify,pause,resume,onProgress,onEvent=()=>{}}){
 const $=id=>document.getElementById(id),dining={cooldown:0,served:0,lastMeal:null};let panel=false;const mealDisplay=new THREE.Group(),mealViews=new Map();mealDisplay.name='peace-served-meal';mealDisplay.position.set(PEACE.x+1.5,43.13,PEACE.z+3.5);scene?.add(mealDisplay);
 function displayMeal(){if(dining.lastMeal&&!mealViews.has(dining.lastMeal)){const food=createProduct(dining.lastMeal,{meal:true});mealDisplay.add(food);mealViews.set(dining.lastMeal,food);}for(const [id,view]of mealViews)view.visible=id===dining.lastMeal;mealDisplay.visible=!!dining.lastMeal;}
 const atMeal=p=>!!dining.lastMeal&&Math.abs(p.y-42)<1.5&&Math.hypot(p.x-mealDisplay.position.x,p.z-mealDisplay.position.z)<2.2;
 if(scene){
  const root=new THREE.Group();root.name='peace-restaurant-interior';root.position.set(PEACE.x+.5,42,PEACE.z+.5);scene.add(root);
  const cube=(color,x,y,z,sx,sy,sz,glow=false)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),glow?new THREE.MeshBasicMaterial({color}):new THREE.MeshLambertMaterial({color}));m.position.set(x,y,z);m.userData.range=70;root.add(m);};
  cube('#f2ecdc',-5.5,1.05,0,.6,.8,.35);cube('#d9af89',-5.5,1.64,0,.36,.4,.35);cube('#fff3db',-5.5,1.93,0,.48,.18,.43);
  for(const side of [-1,1])cube('#292e32',-5.5+side*.15,.35,0,.21,.7,.25);
  for(const dx of [-2,1])for(const dz of [-3,3]){
   cube('#987548',dx,1.05,dz,2.4,.12,1.7);cube('#fff4dd',dx,1.14,dz,.75,.05,.75);cube('#b78841',dx,1.2,dz,.38,.09,.38);cube('#ffe5a3',dx,2.75,dz,.4,.15,.4,true);
   for(const side of [-1,1]){const seat=dz+side*1.6;cube('#71553f',dx,.49,seat,.65,.12,.65);cube('#71553f',dx,1.02,seat+side*.27,.65,.94,.12);for(const leg of [-1,1])cube('#6b503a',dx+leg*.24,.22,seat,.1,.44,.5);}
  }
 }
 const distance=(p,q)=>Math.hypot(p.x-q.x,p.z-q.z),onFloor=(p,y)=>Math.abs(p.y-y)<1.5;
 function atCounter(p){
  if(!onFloor(p,42)||distance(p,PEACE_DINING.counter)>3.2)return false;
  const target={x:PEACE_DINING.counter.x,y:43.3,z:PEACE_DINING.counter.z},origin={x:p.x,y:p.y+1.62,z:p.z},d={x:target.x-origin.x,y:target.y-origin.y,z:target.z-origin.z},length=Math.hypot(d.x,d.y,d.z);
  return !trace(world,origin,{x:d.x/length,y:d.y/length,z:d.z/length},Math.max(0,length-.3));
 }
 function close(){if(!panel)return;$('peace-dialog').close();panel=false;resume();}
 for(const meal of PEACE_MEALS){const button=document.createElement('button');button.className='recipe-card';button.textContent=meal.name+' · 食物 +'+meal.food;button.onclick=()=>{
  if(!atCounter(getPos())){close();return;}
  if(!orderPeaceMeal(getState(),meal.id,dining)){notify('刚吃过一餐，请稍后再点。');return;}
  displayMeal();$('peace-result').textContent=meal.name+'已摆在右侧江景餐桌上，含瓷盘、餐具；餐点也已加入背包。';notify('龙凤厅：'+meal.name+'上桌了。');onEvent({type:'meal'});onProgress();
 };$('peace-meals').appendChild(button);}
 $('peace-close').onclick=close;$('peace-dialog').addEventListener('cancel',e=>{e.preventDefault();close();});
 function use(){const p=getPos();if(atMeal(p)){if(getState().eat()){dining.lastMeal=null;displayMeal();onProgress();notify('已享用餐点，收起餐盘。');}else notify('餐点已经上桌，你目前不饿，可以稍后享用。');return true;}if(atCounter(p)){pause();panel=true;$('peace-result').textContent=dining.cooldown>0?'刚吃过一餐，稍后可再次点餐。':'欢迎来到龙凤厅，请选一份餐点。';$('peace-dialog').showModal();return true;}
  if(distance(p,PEACE_DINING.lift)<2.8&&(onFloor(p,26)||onFloor(p,42))){const up=onFloor(p,26);teleport(up?PEACE_DINING.arrival:PEACE_DINING.lift);lookAt(up?{...PEACE_DINING.counter,y:43.3}:{x:PEACE.front+3,y:27.6,z:PEACE.z+.5});notify(up?'八楼龙凤厅：走向柜台，按 V 点餐。':'已返回和平饭店大堂。');return true;}return false;
 }
 function tick(dt){dining.cooldown=Math.max(0,dining.cooldown-dt);const p=getPos(),nearLift=distance(p,PEACE_DINING.lift)<2.8&&(onFloor(p,26)||onFloor(p,42));const text=atMeal(p)?'江景餐桌 · V 享用餐点':atCounter(p)?'和平饭店 · V 点餐':nearLift?onFloor(p,26)?'和平饭店 · V 乘电梯到龙凤厅':'V 乘电梯返回大堂':'';$('peace-prompt').textContent=text;$('peace-prompt').hidden=!text;}
 const collides=(x,y,z)=>y<43.2&&y+1.75>42&&[-2,1].some(dx=>[-3,3].some(dz=>Math.abs(x-(PEACE.x+.5+dx))<1.49&&Math.abs(z-(PEACE.z+.5+dz))<1.14));
 return {use,tick,close,collides,mealDisplay,isPanelOpen:()=>panel,serialize:()=>({...dining}),restore:d=>{dining.lastMeal=PEACE_MEALS.some(m=>m.id===d?.lastMeal)?d.lastMeal:null;displayMeal();dining.served=Math.max(0,Math.floor(Number(d?.served)||0));dining.cooldown=Math.max(0,Math.min(45,Number(d?.cooldown)||0));}};
}
