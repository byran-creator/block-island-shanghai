import assert from 'node:assert/strict';
import * as T from '../game/three.module.js';
import {workboatPose,WORKBOAT_CYCLE} from '../game/river-navigation.js';
import {createHuangpuCruises,cruisePose,CRUISE_LEVELS} from '../game/huangpu-cruises.js';
import {createCruiseService,CRUISE_DOCK as dock} from '../game/huangpu-cruise-service.js';
import {riverCenter,riverEastEdge,riverWestEdge} from '../game/shanghai-map.js';
import {ferryPosition} from '../game/city-activity.js';
const cross=(a,b,p)=>(b.x-a.x)*(p.z-a.z)-(b.z-a.z)*(p.x-a.x);
function area(poly){return Math.abs(poly.reduce((sum,p,i)=>{const q=poly[(i+1)%poly.length];return sum+p.x*q.z-q.x*p.z;},0))/2;}
function intersection(a,b){let out=a;const signed=b.reduce((s,p,i)=>s+p.x*b[(i+1)%b.length].z-b[(i+1)%b.length].x*p.z,0),sign=signed<0?-1:1;for(let i=0;i<b.length&&out.length;i++){const c=b[i],d=b[(i+1)%b.length],input=out;out=[];for(let j=0;j<input.length;j++){const p=input[j],q=input[(j+1)%input.length],u=cross(c,d,p)*sign,v=cross(c,d,q)*sign;if(u>=-1e-8)out.push(p);if((u>=0)!==(v>=0)){const t=u/(u-v);out.push({x:p.x+(q.x-p.x)*t,z:p.z+(q.z-p.z)*t});}}}return out.length>=3?area(out):0;}
const rect=(x1,x2,z1,z2)=>[{x:x1,z:z1},{x:x2,z:z1},{x:x2,z:z2},{x:x1,z:z2}];
function footprint(p,width=1.25,length=2.9){return rect(-width,width,-length,length).map(q=>({x:p.x+q.x*Math.cos(p.yaw)+q.z*Math.sin(p.yaw),z:p.z-q.x*Math.sin(p.yaw)+q.z*Math.cos(p.yaw)}));}
let minPeer=Infinity,minShore=Infinity,maxStep=0,minLane=Infinity;
for(let t=0;t<=WORKBOAT_CYCLE*2;t+=.05){const boats=[0,1,2].map(i=>workboatPose(t,i));for(let i=0;i<3;i++){const p=boats[i],hull=footprint(p),next=workboatPose(t+.05,i);maxStep=Math.max(maxStep,Math.hypot(next.x-p.x,next.z-p.z));for(const q of hull){minShore=Math.min(minShore,q.x-riverWestEdge(q.z),riverEastEdge(q.z)-q.x);minLane=Math.min(minLane,q.x-riverCenter(q.z));assert(q.z<125,'Keep clear of the original ferry corridor');}for(let j=i+1;j<3;j++){assert(intersection(hull,footprint(boats[j]))<1e-7,'No head-on or overtaking hull overlap, including both turns');minPeer=Math.min(minPeer,Math.hypot(p.x-boats[j].x,p.z-boats[j].z));}}}
assert(minShore>1&&minPeer>3&&maxStep<.2);
// The captured old forward pair met after the front boat reflected on the same lane.
const oldMeet=74/3.8;assert(Math.abs((64+1.9*oldMeet)-(138-1.9*oldMeet))<1e-8);assert(intersection(footprint(workboatPose(oldMeet,0)),footprint(workboatPose(oldMeet,2)))<1e-7);
// Spatial corridors must be disjoint for *any* relative clocks: boarding can hold cruises.
let cruiseEast=-Infinity;for(let t=0;t<190;t+=.1){const p=cruisePose(t);for(const q of footprint(p,2.85,9.8))cruiseEast=Math.max(cruiseEast,q.x-riverCenter(q.z));assert(intersection(footprint(p,2.85,9.8),rect(41,61,dock.z-1.02,dock.z+1.02))<1e-7,'Complete rotating cruise, not just its centre, clears fixed dock');}assert(minLane-cruiseEast>1,'Separate workboat and cruise navigation corridors');
for(let t=0;t<94;t+=.1){assert(footprint(ferryPosition(t),2.8,5.6).every(p=>p.z>125),'Original cross-river ferry remains south of workboats');}
// Find positive-area coplanar upward faces after batching: catches deck/landing z-fighting.
function upwardFaces(root){root.updateMatrixWorld(true);const faces=[],v=new T.Vector3();root.traverse(o=>{if(!o.isMesh||o.material.transparent||o.parent?.name==='cruise-night-decoration')return;const g=o.geometry,p=g.attributes.position,n=g.attributes.normal;for(let k=0;k<(g.index?.count??p.count);k+=3){const ids=[0,1,2].map(d=>g.index?g.index.getX(k+d):k+d);if(!ids.every(i=>n.getY(i)>.999))continue;const vs=ids.map(i=>{v.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld);return {x:v.x,y:v.y,z:v.z};});if(vs.some(q=>Math.abs(q.y-vs[0].y)>1e-5))continue;faces.push({y:vs[0].y,poly:vs});}});return faces;}
const scene=new T.Scene(),ships=createHuangpuCruises(scene);for(const ship of ships){const faces=upwardFaces(ship.root).filter(f=>CRUISE_LEVELS.some(y=>Math.abs(f.y-ship.root.position.y-y)<1e-5));for(let i=0;i<faces.length;i++)for(let j=i+1;j<faces.length;j++)if(Math.abs(faces[i].y-faces[j].y)<1e-5)assert(intersection(faces[i].poly,faces[j].poly)<2e-6,JSON.stringify({a:faces[i],b:faces[j],overlap:intersection(faces[i].poly,faces[j].poly)})+' Remove duplicate deck and stair landing faces rather than hiding flicker with material bias');}
const service=createCruiseService({scene,ships});assert(dock.y>26.02,'Pier has physical clearance above the original pavement');assert(dock.deck>ships[0].root.position.y+1.12,'Gangway stays above the ship floor at the overlapping threshold');for(const p of service.people)p.pause=1e9;
for(let t=0;t<400;t+=.05){service.tick(.05);for(const ship of ships){if(!ship.moored)assert(!service.bridge.visible||Math.hypot(ship.root.position.x-service.current.root.position.x,ship.root.position.z-service.current.root.position.z)>20);if(ship.moored&&ship.remaining<2.4){assert(!service.bridge.visible&&ship.gate.visible,'Gangway withdrawn and door closed before turning starts');}}}
console.log(JSON.stringify({workboats:3,minPeer,minShore,maxStep,cruiseCorridorGap:minLane-cruiseEast,duplicateDeckFaces:0,earlyGangwayWithdrawal:true}));
