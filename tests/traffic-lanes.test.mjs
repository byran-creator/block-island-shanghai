import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {VoxelWorld} from '../game/world.js';
import {createBund} from '../game/bund.js';
import {createJunctionControl,JUNCTION_POINTS} from '../game/traffic-junctions.js';
import {trafficTravel} from '../game/city-traffic.js';
const back={...actor(20,0,10,0),speed:3,crossings:[],halfLength:1.32},front={...actor(21,0,6,0),dir:-1,speed:3};
const straight=(a,t)=>({x:0,y:26,z:10-t,yaw:0});
assert.equal(trafficTravel(back,1,0,[back,front],straight),0,'Different route IDs and opposite route parameter directions must still follow a physical leader');
assert.equal(trafficTravel(front,1,0,[back,front],(a,t)=>({x:0,y:26,z:6+t,yaw:0})),3,'The lead vehicle must remain free to move away');
front.root.position.x=4.4;assert.equal(trafficTravel(back,1,0,[back,front],straight),3,'Traffic in the other motor lane must not stop this lane');
const fork=JUNCTION_POINTS.find(([x,z])=>x===226&&z===12);assert(fork,'The Lujiazui north fork must be controlled');
const all=createJunctionControl(),linked=all.groups.find(g=>g.zones.some(z=>z.x===226&&z.z===12));assert(linked.zones.some(z=>z.x===210&&z.z===12),'The formerly unprotected northern road merge must share a reservation with the core fork');assert(linked.zones.some(z=>z.x===213&&z.z===31),'Connecting core turn reservations must not lock each other');
const control=createJunctionControl([fork]),lead={kind:'car',trafficId:0,root:{position:{x:227,z:12}}},incoming={kind:'car',trafficId:1,root:{position:{x:221.2,z:16.4}}};
control.update([lead,incoming]);assert(!control.permits(incoming,{x:221.3,z:16.3}),'The previously wedged fork entry must yield before bodies meet');lead.root.position.x=240;control.update([lead,incoming]);assert(control.permits(incoming,{x:221.3,z:16.3}),'The fork must release after the first vehicle clears');
const eastEnd=createJunctionControl([[282,206]],{getPose:(a,d)=>({x:a.root.position.x+d,y:26,z:206,yaw:Math.PI/2})}),outbound={kind:'bridge',trafficId:0,root:{position:{x:280,z:204}}},inbound={kind:'bridge',trafficId:1,root:{position:{x:290,z:206}}};
eastEnd.update([outbound,inbound]);assert.equal(eastEnd.groups[0].holders.size,1,'The bridge double-back bend must not admit opposite approaches as parallel paths');assert(!eastEnd.permits(inbound,{x:289,z:206}));outbound.root.position.x=305;eastEnd.update([outbound,inbound]);assert(eastEnd.permits(inbound,{x:289,z:206}),'The bridge bend must release to the waiting approach');
function actor(id,x,z,yaw){return {trafficId:id,kind:'car',route:{lengthMeters:100},t:0,dir:1,lane:2.2,halfWidth:.72,halfLength:1.32,root:{position:{x,y:26,z},rotation:{y:yaw}}};}
const first=actor(0,196,1,0),parallel=actor(1,204,8,0),turn=actor(2,208,0,Math.PI/2);
const crossing=createJunctionControl([[200,0]],{getPose:(a,d)=>a===turn?{x:Math.max(202,208-d),y:26,z:Math.max(0,d-6),yaw:d<6?Math.PI/2:Math.PI}:{x:a.root.position.x,y:26,z:a.root.position.z-d,yaw:0}});
crossing.update([first,parallel,turn]);assert(crossing.groups[0].holders.has(first));assert.equal(crossing.groups[0].holders.size,2,'Disjoint streams must be able to move concurrently');assert(!(crossing.groups[0].holders.has(parallel)&&crossing.groups[0].holders.has(turn)),'Two paths disjoint from the first holder must still be checked against each other');
const follower=actor(0,227,12,0),leader=actor(1,225,12,Math.PI/2),tickets=createJunctionControl([fork]);tickets.update([follower]);follower.following=leader;leader.waitTime=3;tickets.update([follower,leader]);assert(tickets.permits(leader,{x:225,z:12}),'A ticket held by a queue follower must not lock out its leader');
const previous=globalThis.document;globalThis.document={createElement:()=>({getContext:()=>({fillRect(){},fillText(){},beginPath(){},arc(){},stroke(){},moveTo(){},lineTo(){}})})};
try{const scene=new THREE.Scene(),city=createBund({scene,world:new VoxelWorld(),getPos:()=>({x:220,y:26,z:20})});assert(city.traffic.riders.every(r=>r.baseLane===4),'Bicycles and electric delivery scooters must start in the dedicated curb lane');for(const rider of city.traffic.riders)assert(rider.baseLane-2.2>rider.halfWidth+.93+.05,'Bus and bicycle full widths must fit side by side on straight shared sections');assert(scene.getObjectByName('curb-cycle-lane'));assert(scene.getObjectByName('cycle-lane-divider'));}finally{globalThis.document=previous;}
console.log('PASS: dedicated curb lanes and markings, full bus/bicycle lateral separation, formerly unprotected Lujiazui fork and neighbouring reservation release.');
