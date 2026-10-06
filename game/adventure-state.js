import {CRYSTALS,courseById} from './world.js';
export class AdventureState {
 constructor(){this.collected=new Set();this.painted=false;this.towerVisited=false;this.best=null;this.bestTimes={};this.race=null;this.completed=false;this.showWatched=false;}
 available(c){return !this.collected.has(c.id)&&(!c.requires||this.painted)}
 collectAt(pos){const found=[];for(const c of CRYSTALS)if(this.available(c)&&Math.hypot(pos.x-c.x,pos.y+.9-c.y,pos.z-c.z)<1.9){this.collected.add(c.id);found.push(c)}this.completed=this.collected.size===CRYSTALS.length;return found;}
 startRace(previousFlying=false,id='harbor'){this.race={time:0,checkpoint:0,previousFlying,course:courseById(id).id};}
 stepRace(dt,pos){if(!this.race)return null;this.race.time+=dt;const c=courseById(this.race.course),next=c.platforms[this.race.checkpoint+1];if(next&&Math.abs(pos.x-next.x)<next.radius+.65&&Math.abs(pos.z-next.z)<next.radius+.65&&Math.abs(pos.y-next.y)<.35)this.race.checkpoint++;
  if(this.race.checkpoint===c.platforms.length-1){const result={type:'finish',time:this.race.time,course:c.id,restoreFlight:this.race.previousFlying};this.bestTimes[c.id]=Math.min(this.bestTimes[c.id]??Infinity,result.time);this.best=this.bestTimes.harbor??null;this.race=null;return result;}
  if(pos.y<c.fallY)return {type:'fall',point:c.platforms[this.race.checkpoint]};return null;
 }
 serialize(){return {collected:[...this.collected],painted:this.painted,towerVisited:this.towerVisited,best:this.best,bestTimes:{...this.bestTimes},courseVersion:6,showWatched:this.showWatched,race:this.race?{...this.race}:null}}
 restore(data){const valid=new Set(CRYSTALS.map(c=>c.id));this.collected=new Set((Array.isArray(data?.collected)?data.collected:[]).filter(x=>valid.has(x)));this.painted=!!data?.painted;this.towerVisited=!!data?.towerVisited;this.showWatched=!!data?.showWatched;this.bestTimes={};for(const id of ['harbor','forest','cliff'])if(data?.courseVersion===6&&Number.isFinite(data.bestTimes?.[id])&&data.bestTimes[id]>0)this.bestTimes[id]=data.bestTimes[id];this.best=this.bestTimes.harbor??null;const r=data?.race,c=courseById(r?.course);this.race=data?.courseVersion===6&&r&&Number.isInteger(r.checkpoint)&&r.checkpoint>=0&&r.checkpoint<c.platforms.length-1&&Number.isFinite(r.time)&&r.time>=0?{checkpoint:r.checkpoint,time:r.time,previousFlying:!!r.previousFlying,course:c.id}:null;this.completed=this.collected.size===CRYSTALS.length;}
}
