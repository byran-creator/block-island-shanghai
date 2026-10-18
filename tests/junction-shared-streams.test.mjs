import assert from 'node:assert/strict';import {createJunctionControl} from '../game/traffic-junctions.js';
const make=(id,x,z,yaw,kind='car')=>({trafficId:id,kind,halfWidth:.72,halfLength:1.32,root:{position:{x,y:26,z},rotation:{y:yaw}}});
const pose=(a,d)=>({x:a.root.position.x-Math.sin(a.root.rotation.y)*d,y:26,z:a.root.position.z-Math.cos(a.root.rotation.y)*d,yaw:a.root.rotation.y});
const a=make(0,-2.2,8,0),b=make(1,2.2,-8,Math.PI),crossing=make(2,8,0,Math.PI/2),j=createJunctionControl([[0,0],[0,1]],{getPose:pose});
j.update([a,b]);assert(j.groups[0].holders.has(a)&&j.groups[0].holders.has(b),'Disjoint opposing lanes must clear together');j.update([a,b,crossing]);assert(!j.groups[0].holders.has(crossing),'A conflicting turn must still wait');
const rider=make(3,-2.2,3,0,'delivery');a.following=rider;rider.waitTime=10;j.update([a,b,crossing,rider]);assert(!j.groups[0].holders.has(rider),'A curb-lane delivery stop must not inherit and hold the entire junction');
a.root.position.z=-20;b.root.position.z=20;j.update([a,b,crossing,rider]);assert(j.groups[0].holders.has(crossing),'The queued turn must be admitted after both streams clear');
// A shared heading before a fork does not imply disjoint future paths.
const straight=make(10,-2,8,0),merging=make(11,-2,13,0),fork=createJunctionControl([[0,0],[0,1]],{getPose:pose});
fork.update([straight]);fork.update([straight,merging]);assert(!fork.groups[0].holders.has(merging),'Different routes sharing the same future footprint retain separate reservations');
console.log('PASS: opposing disjoint streams, conflicting turn exclusion/release and independent delivery-rider admission.');
