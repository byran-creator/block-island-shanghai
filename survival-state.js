import {WORLD_MIN,WORLD_MAX,HEIGHT,WATER_LEVEL} from './world.js';
export const RECIPES={
 planks:{name:'木板 × 4',cost:{4:1},block:7,amount:4},
 bed:{name:'床 · 设置重生点 / 睡觉',cost:{7:4},wool:1,item:'bed'},
 chair:{name:'木椅',cost:{7:2},item:'chair'},table:{name:'餐桌',cost:{7:3},item:'table'},
 lamp:{name:'晶石落地灯',cost:{3:2},pearls:1,item:'lamp'},chest:{name:'储物箱',cost:{7:5},item:'chest'},
 campfire:{name:'篝火 · 烤肉',cost:{3:3,4:2},item:'campfire'},bookshelf:{name:'书架',cost:{7:4},item:'bookshelf'},
 planter:{name:'菜圃 · 60 秒后收获食物',cost:{7:2},food:1,item:'planter'},
 woodpick:{name:'木镐 · 32 次采集',cost:{7:3,4:1},gear:'woodpick'},stonepick:{name:'石镐 · 96 次采集',cost:{3:3,4:2},gear:'stonepick'},glider:{name:'滑翔伞 · P 开伞 / 收伞',cost:{7:4},wool:2,gear:'glider'},
 sword:{name:'石剑 · 对付夜影',cost:{3:3,4:1},gear:'sword'},dive:{name:'潜水套装 · 氧气 180 秒',cost:{3:8,7:4},gear:'dive'}
};
const finite=(v,f=0)=>Number.isFinite(v)?v:f,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export class SurvivalState {
 constructor(){this.survivalStarted=false;this.survivalSeconds=0;this.nightSeconds=0;this.survivalGoals={wood:0,nights:0};this.mode='creative';this.health=20;this.hunger=20;this.oxygen=40;this.bag={1:12,3:12,4:8,7:12};this.food=4;this.raw=0;this.wool=0;this.pearls=0;this.dive=false;this.equipped=false;this.sword=false;this.pickaxe=0;this.durability=0;this.glider=false;this.held=null;this.furniture=[];this.home=null;this.treasures=new Set();this.damageClock=0;this.foodClock=0;this.elapsed=0;}
 get survival(){return this.mode==='survival'}
 get maxOxygen(){return this.equipped?180:40}
 setMode(mode){this.mode=mode==='survival'?'survival':'creative';this.health=20;this.hunger=20;this.oxygen=this.maxOxygen;}
 add(id,n=1){this.bag[id]=Math.min(99999,(this.bag[id]||0)+n)}
 consume(id){if(!this.survival)return true;if(!(this.bag[id]>0))return false;this.bag[id]--;return true;}
 craft(id){const r=RECIPES[id];if(!r)return false;if(r.gear==='sword'&&this.sword||r.gear==='dive'&&this.dive||r.gear==='glider'&&this.glider||r.gear==='woodpick'&&this.pickaxe>=1&&this.durability>0||r.gear==='stonepick'&&this.pickaxe===2&&this.durability>0)return false;if(this.held&&r.item)return false;if(this.survival){if(Object.entries(r.cost).some(([k,n])=>(this.bag[k]||0)<n)||this.pearls<(r.pearls||0)||this.wool<(r.wool||0)||this.food<(r.food||0))return false;for(const [k,n] of Object.entries(r.cost))this.bag[k]-=n;this.pearls-=r.pearls||0;this.wool-=r.wool||0;this.food-=r.food||0;}if(r.block)this.add(r.block,r.amount);if(r.item)this.held=r.item;if(r.gear==='woodpick'||r.gear==='stonepick'){this.pickaxe=r.gear==='stonepick'?2:1;this.durability=this.pickaxe===2?96:32;}if(r.gear==='glider')this.glider=true;if(r.gear==='sword')this.sword=true;if(r.gear==='dive'){this.dive=true;this.equipped=true;this.oxygen=this.maxOxygen;}return true;}
 miningTime(id){if(!this.survival)return 0;const hard=[3,8,9,10,11,12].includes(id);return hard?(this.pickaxe===2?.24:this.pickaxe===1?.6:1.65):id===4?(this.pickaxe?.4:.8):.28;}
 useTool(){if(this.survival&&this.pickaxe&&--this.durability<=0){this.pickaxe=0;this.durability=0;return false;}return true;}
 eat(){if(this.food<=0||this.hunger>=20&&this.health>=20)return false;this.food--;this.hunger=Math.min(20,this.hunger+6);this.health=Math.min(20,this.health+2);return true;}
 hurt(amount){if(this.survival)this.health=Math.max(0,this.health-amount);return this.health<=0;}
 tick(dt,{underwater=false,moving=false,night=false}={}){this.elapsed+=dt;if(underwater)this.oxygen=Math.max(0,this.oxygen-dt);else this.oxygen=Math.min(this.maxOxygen,this.oxygen+dt*25);if(!this.survival)return false;this.hunger=Math.max(0,this.hunger-dt*(moving?1/38:1/100));this.damageClock+=dt;this.foodClock+=dt;if(this.damageClock>=3){this.damageClock=0;if(underwater&&this.oxygen===0)this.hurt(2);else if(this.hunger===0&&this.health>1)this.health=Math.max(1,this.health-1);}if(this.foodClock>=8){this.foodClock=0;if(this.hunger>14&&this.health<20){this.health=Math.min(20,this.health+1);this.hunger=Math.max(0,this.hunger-.3);}}return this.health<=0;}
 revive(){this.health=20;this.hunger=16;this.oxygen=this.maxOxygen;this.food=Math.max(0,this.food-1);this.damageClock=0;}
 serialize(){return {survivalStarted:this.survivalStarted,survivalSeconds:this.survivalSeconds,nightSeconds:this.nightSeconds,survivalGoals:{...this.survivalGoals},mode:this.mode,health:this.health,hunger:this.hunger,oxygen:this.oxygen,bag:{...this.bag},food:this.food,raw:this.raw,wool:this.wool,pearls:this.pearls,dive:this.dive,equipped:this.equipped,sword:this.sword,pickaxe:this.pickaxe,durability:this.durability,glider:this.glider,held:this.held,furniture:structuredClone(this.furniture),home:this.home?{...this.home}:null,treasures:[...this.treasures],elapsed:this.elapsed};}
 restore(d){const clean=new SurvivalState();Object.assign(this,clean);if(!d)return;this.survivalStarted=!!d.survivalStarted||d.mode==='survival';this.survivalSeconds=clamp(finite(d.survivalSeconds),0,1e9);this.nightSeconds=clamp(finite(d.nightSeconds),0,240);this.survivalGoals={wood:clamp(finite(d.survivalGoals?.wood),0,99999),nights:clamp(finite(d.survivalGoals?.nights),0,99999)};this.mode=d.mode==='survival'?'survival':'creative';this.health=clamp(finite(d.health,20),1,20);this.hunger=clamp(finite(d.hunger,20),0,20);this.dive=!!d.dive;this.equipped=this.dive&&!!d.equipped;this.sword=!!d.sword;this.pickaxe=[1,2].includes(d.pickaxe)?d.pickaxe:0;this.durability=clamp(Math.floor(finite(d.durability)),0,this.pickaxe===2?96:32);if(!this.durability)this.pickaxe=0;this.glider=!!d.glider;this.oxygen=clamp(finite(d.oxygen,40),0,this.maxOxygen);for(const k of ['food','raw','wool','pearls'])this[k]=clamp(Math.floor(finite(d[k])),0,99999);this.bag={};for(let i=1;i<=12;i++)this.bag[i]=clamp(Math.floor(finite(d.bag?.[i])),0,99999);const items=new Set(Object.values(RECIPES).map(r=>r.item).filter(Boolean));this.held=items.has(d.held)?d.held:null;const point=p=>p&&[p.x,p.y,p.z].every(Number.isFinite)&&p.x>=WORLD_MIN+1&&p.z>=WORLD_MIN+1&&p.x<WORLD_MAX-1&&p.z<WORLD_MAX-1&&p.y>=1&&p.y<HEIGHT-2;this.furniture=(Array.isArray(d.furniture)?d.furniture:[]).filter(f=>items.has(f.type)&&point(f)).slice(0,200).map((f,i)=>({...f,id:i,storage:Object.fromEntries(Array.from({length:12},(_,j)=>[j+1,clamp(Math.floor(finite(f.storage?.[j+1])),0,99999)]))}));this.home=point(d.home)?{x:d.home.x,y:d.home.y,z:d.home.z}:null;this.treasures=new Set((Array.isArray(d.treasures)?d.treasures:[]).filter(id=>['reef','temple','wreck'].includes(id)));this.elapsed=clamp(finite(d.elapsed),0,1e9);}
}
export function isSwimming({feet,dry=false}){return !dry&&feet<WATER_LEVEL+.12;}
export function movementSpeed({flying,gliding,grounded,swimming,equipped,sprint,racing}){return flying?9:gliding&&!grounded&&!swimming?7.5:swimming?(equipped?5.5:3.5):sprint?(racing?7:8.5):4.5;}
export function swimVelocity({feet,velocity,space,down,grounded,dt,dry=false,shore=false}){
 if(isSwimming({feet,dry})){
  if(down)return -3.8;
  if(space){if(shore&&feet>WATER_LEVEL-1.1)return 8;const target=Math.max(-2.4,Math.min(4.8,(WATER_LEVEL-.85-feet)*5));return velocity+(target-velocity)*(1-Math.exp(-10*dt));}
  return Math.max(-1.2,velocity-2.5*dt);
 }
 if(space&&grounded)return 8;return Math.max(-30,velocity-23*dt);
}

export function furnitureBounds(f){let [x,y,z]=({bed:[1,.9,1.8],chair:[.9,1.35,.9],table:[1.3,1.06,1.3],lamp:[.65,1.85,.65],chest:[1.05,.95,.9],campfire:[.9,.6,.9],bookshelf:[1.1,1.4,.6],planter:[1.1,.55,1.1]})[f.type]||[1,1,1];if(Math.abs(Math.sin(f.rotation||0))>.7)[x,z]=[z,x];return {x1:f.x-x/2,x2:f.x+x/2,y1:f.y,y2:f.y+y,z1:f.z-z/2,z2:f.z+z/2};}
export function furnitureCollides(items,x,y,z){return items.some(f=>{const b=furnitureBounds(f);return x+.29>b.x1&&x-.29<b.x2&&z+.29>b.z1&&z-.29<b.z2&&y+1.75>b.y1+.001&&y+.002<b.y2;});}
