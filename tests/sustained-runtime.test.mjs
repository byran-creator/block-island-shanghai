import assert from 'node:assert/strict';
import * as T from '../game/three.module.js';
import {roadContains,ROADS} from '../game/city-layout.js';
import {boatSupport,boatSolid} from '../game/boat-support.js';

import {createTrafficContacts} from '../game/traffic-contacts.js';
import {vehicleContact} from '../game/vehicle-dynamics.js';

// Published predicates remain the oracle, including exact road boundaries.
const oldRoad=(x,z)=>{let best=Infinity;for(const r of ROADS)for(let i=0;i<r.samples.length;i+=4){const p=r.samples[i];best=Math.min(best,Math.hypot(x-p.x,z-p.z)-r.width);}return best<1.2;};
let seed=91;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const queries=Array.from({length:10000},()=>[random()*750-350,random()*500-100]);for(const road of ROADS)for(let i=0;i<road.samples.length;i+=80){const p=road.samples[i];for(const epsilon of [-1e-9,0,1e-9])queries.push([p.x+road.width+1.2+epsilon,p.z]);}
for(const [x,z]of queries)assert.equal(roadContains(x,z),oldRoad(x,z));

const local=(root,x,z)=>{const dx=x-root.position.x,dz=z-root.position.z,a=root.rotation.y;return {x:dx*Math.cos(a)-dz*Math.sin(a),z:dx*Math.sin(a)+dz*Math.cos(a)};};
const height=(s,p)=>Math.max(s.minTop??-Infinity,Math.min(s.maxTop??Infinity,s.top+(s.slopeZ??0)*(p.z-(s.z??0))+(s.slopeX??0)*(p.x-(s.x??0))));
const hole=(s,p)=>s.holes?.some(h=>p.x>h.x1&&p.x<h.x2&&p.z>h.z1&&p.z<h.z2);
const oldSupport=(surfaces,x,y,z)=>{let best=null;for(const s of surfaces){if(s.solidOnly||s.active&&!s.active())continue;const p=local(s.root,x,z);if(Math.abs(p.x-(s.x??0))>=s.rx-(s.edgeInset??.15)||Math.abs(p.z-(s.z??0))>=s.rz-(s.edgeInset??.15)||hole(s,p))continue;const top=height(s,p),h=s.root.position.y+top;if(y>=h-.2&&(!best||h>best.y))best={...s,top,local:p,y:h};}return best;};
const oldSolid=(surfaces,x,y,z)=>surfaces.some(s=>{if(s.active&&!s.active())return false;const p=local(s.root,x,z),h=s.root.position.y+height(s,p);return !hole(s,p)&&Math.abs(p.x-(s.x??0))<s.rx+(s.padding??.29)&&Math.abs(p.z-(s.z??0))<s.rz+(s.padding??.29)&&y<h-.002&&y+1.75>h-(s.solidHeight??.2);});
const surfaces=[];for(let i=0;i<8;i++){const root=new T.Group();root.position.set(random()*300,20+random()*5,random()*300);root.rotation.y=random()*Math.PI*2;for(let j=0;j<12;j++)surfaces.push({root,rx:.5+random()*8,rz:.5+random()*15,x:random()*8-4,z:random()*8-4,top:j*.25,padding:j%2?.29:.1,edgeInset:j%3?.15:-.2,slopeZ:.1,minTop:0,maxTop:5,holes:[{x1:-.3,x2:.3,z1:-.4,z2:.4}],active:()=>j!==10,solidOnly:j===11});}
for(let i=0;i<12000;i++){const x=random()*350-25,y=random()*12+20,z=random()*350-25;assert.deepEqual(boatSupport(surfaces,x,y,z),oldSupport(surfaces,x,y,z));assert.equal(boatSolid(surfaces,x,y,z),oldSolid(surfaces,x,y,z));}

const agents=[],people=[];for(let i=0;i<180;i++){const root=new T.Group();root.position.set(random()*500-250,i%7===0?16:26,random()*500-250);root.rotation.y=random()*Math.PI*2;const item={root,halfWidth:.5+random(),halfLength:1+random()*4,height:1.8,person:i>49};(item.person?people:agents).push(item);}
const player={person:true,root:{position:{x:0,y:26,z:0}},height:1.85},grid=createTrafficContacts(agents,people,player);
for(let i=0;i<12000;i++){const agent=agents[i%agents.length],p={x:random()*500-250,y:i%7===0?16:26,z:random()*500-250,yaw:random()*Math.PI*2},withPlayer=i%2===0;assert.equal(grid.test(agent,p,withPlayer),[...agents,...people,...(withPlayer?[player]:[])].some(o=>vehicleContact(agent,p.x,p.y,p.z,p.yaw,o)));if(i%9===0){agent.root.position.x+=18;agent.root.position.z-=19;grid.update(agent);}}
assert.equal(grid.test(agents[0],{x:0,y:26,z:0,yaw:0},true),true,'Player stays protected at a cell boundary');
console.log(JSON.stringify({passed:true,roadQueries:queries.length,boatQueries:12000,contactQueries:12000}));
