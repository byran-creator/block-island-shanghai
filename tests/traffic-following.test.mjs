import assert from 'node:assert/strict';import * as T from '../game/three.module.js';import {trafficTravel} from '../game/city-traffic.js';
const route={lengthMeters:100},pose=(a,t)=>({x:a.lane,y:26,z:-t,yaw:0});
const riders=[0,.99].map((lane,i)=>{const root=new T.Group();root.position.set(lane,26,-10-i*.02);return {root,route,lane,t:10+i*.02,dir:1,speed:2,halfWidth:.45,halfLength:1.06};});
for(const a of riders)assert(trafficTravel(a,.05,0,riders,pose)>0,'Adjacent riders must not reserve each other as a vehicle ahead');
const leader={...riders[1],lane:0,t:12,root:new T.Group()};leader.root.position.set(0,26,-12);assert.equal(trafficTravel(riders[0],.05,0,[riders[0],leader],pose),0,'A true leader still stops the following rider');
console.log('PASS: side-by-side padded probes cannot create mutual following; genuine leader spacing remains.');
