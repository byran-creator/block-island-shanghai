import {boatWorld} from './boat-support.js';

// Six additional visitors per ship, on safe short walks beside the windows and
// on the upper terrace. Keep the central door and both stair flights open.
const spots=[[-1.75,-3.6,1.1],[1.75,-6.15,1.1],[-1.75,-3.6,3.65],[1.75,-6.15,3.65],[-.75,4.9,6.2],[.75,4.9,6.2]];
export function createCruisePassengerLife({scene,ships,passenger}){
 const people=ships.flatMap((ship,index)=>spots.map(([x,z,deck],i)=>{
  const p=passenger(scene,2+index*spots.length+i);
  Object.assign(p,{resident:true,state:'sightseeing',ship,deck,homeZ:z,local:{x,z},targetZ:z+(i%2?.32:-.32),localYaw:x>0?-Math.PI/2:Math.PI/2,pause:2+i*1.7+index*.8});
  return p;
 }));
 const point=(p,local=p.local)=>({...boatWorld(p.ship.root,local),y:p.ship.root.position.y+p.deck});
 function carry(){for(const p of people){const w=point(p);p.root.position.set(w.x,w.y,w.z);}}
 function tick(dt,player,others){for(const p of people){
  for(const limb of [...p.arms,...p.legs])limb.rotation.x=0;
  p.pause-=dt;const dz=p.targetZ-p.local.z;
  if(p.pause<=0&&Math.abs(dz)<.025){p.targetZ=p.homeZ+(p.targetZ<p.homeZ?.32:-.32);p.pause=4+(p.slot*2.7%7);}
  const wanted=p.pause<=0?Math.sign(dz)*Math.min(Math.abs(dz),dt*.4):0;
  const goal=wanted?(wanted>0?Math.PI:0):(p.local.x>0?-Math.PI/2:Math.PI/2),turn=Math.atan2(Math.sin(goal-p.localYaw),Math.cos(goal-p.localYaw));
  p.localYaw+=Math.sign(turn)*Math.min(Math.abs(turn),dt*3.2);
  const step=Math.abs(turn)<.25?wanted:0;
  const next={x:p.local.x,z:p.local.z+step},w=point(p,next);
  const blocked=Math.abs(player.y-w.y)<1.8&&Math.hypot(player.x-w.x,player.z-w.z)<.95||others.some(o=>o!==p&&Math.abs(o.root.position.y-w.y)<1.8&&Math.hypot(o.root.position.x-w.x,o.root.position.z-w.z)<.95);
  if(step&&!blocked){p.local=next;p.root.position.set(w.x,w.y,w.z);p.phase+=dt*4;for(let i=0;i<2;i++){p.legs[i].rotation.x=Math.sin(p.phase)*(i?-.18:.18);p.arms[i].rotation.x=-p.legs[i].rotation.x;}}
  p.root.rotation.y=p.ship.root.rotation.y+p.localYaw;
 }}
 carry();return {people,carry,tick};
}
