import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {overlaps} from '../game/world.js';
import {isSwimming,movementSpeed,swimVelocity} from '../game/survival-state.js';
import {createStepCadence} from '../game/footsteps.js';

// Run the real exterior physics and the real audio eligibility expression.
// A final tiny remainder step can clear grounded despite solid support earlier.
const source=await readFile('game/game.js','utf8'),start=source.indexOf('function physics(dt){'),end=source.indexOf('\nlet prev=',start),physics=source.slice(start,end),walking=source.match(/walking:(.*?),travel:footTravel/)?.[1];
assert(start>=0&&end>start&&walking);
const outcomes=[];
for(const fps of [20,30,35,40,60,61,75]){
 const world={get:(x,y,z)=>y===25?3:0},s={world,pos:{x:36,y:26,z:84},vy:0,grounded:true,footContact:true,flying:false,gliding:false,yaw:0,pitch:0,runLocked:false,keys:new Set(),releaseAt:new Map(),inputKeys:{has:()=>false,axes:()=>({forward:1,side:0})},life:{state:{hurt(){}}},metro:null,yuyuan:null,civil:null,commute:null,activity:null,story:null,privateSuites:null,towerInteriors:null,adventure:null,HEIGHT:200,performance,isSwimming,movementSpeed,swimVelocity,snapMetroFloor:()=>null,metroRampFloor:()=>null,nanpuFloor:()=>null,metroInterior:()=>false,shipSurfaces:()=>[],boatSupport:()=>null,nearWaterExit:()=>false,collides:(x,y,z)=>overlaps(world,x,y,z),respawn(){assert.fail('Normal walking must not respawn');}};
 const ctx=vm.createContext(s);vm.runInContext(physics,ctx);let footfalls=0,groundFrames=0;const cadence=createStepCadence(()=>footfalls++),dt=1/fps;
 for(let f=0;f<fps*6;f++){
  s.footContact=s.grounded;const z=s.pos.z;let remaining=dt;while(remaining>0){const step=Math.min(remaining,1/120);s.physics(step);remaining-=step;}
  if(s.grounded)groundFrames++;cadence.update(dt,Math.abs(s.pos.z-z),vm.runInContext(walking,ctx));
 }
 outcomes.push({fps,footfalls,groundFrames});assert(footfalls>=19&&footfalls<=21,`${fps}fps: footsteps must persist for the entire six-second real-physics walk`);
 // Jumping, gliding and riding must still suppress impacts.
 s.flying=true;assert.equal(vm.runInContext(walking,ctx),false);s.flying=false;s.gliding=true;assert.equal(vm.runInContext(walking,ctx),false);
 s.gliding=false;s.footContact=false;s.grounded=false;s.vy=5;assert.equal(vm.runInContext(walking,ctx),false);
}
console.log(JSON.stringify({passed:true,actualPhysicsFootsteps:outcomes}));
