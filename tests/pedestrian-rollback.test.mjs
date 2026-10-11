import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {createStreetCrowd} from '../game/street-crowd.js';
const root=new THREE.Group(),p={root,arms:[{rotation:{x:0}},{rotation:{x:0}}],legs:[{rotation:{x:0}},{rotation:{x:0}}]};
const clear=q=>Math.hypot(q.x+95,q.z-66)>.65;
const crowd=createStreetCrowd([p],{clear});p.ready=true;root.position.set(-98,26,66);p.crowd.goal={x:-90,y:26,z:66};p.crowd.wait=0;p.crowd.breakIn=1000;
let travel=0,turned=false;for(let i=0;i<3600;i++){const before=root.position.clone();crowd.tick(1/60);assert(clear(root.position),'Original avoidance must not enter the post');travel+=root.position.distanceTo(before);turned ||= Math.abs(root.position.z-66)>.5;}
assert(travel>10&&turned,'A pedestrian must turn away and keep walking after meeting a post');
const pose=[...root.position.toArray(),root.rotation.y,...p.legs.map(l=>l.rotation.x)];crowd.tick(0);assert.deepEqual([...root.position.toArray(),root.rotation.y,...p.legs.map(l=>l.rotation.x)],pose);
console.log('PASS: restored crowd turns around a pole and keeps moving at 60 Hz, without entering the pole or changing its paused pose.');
