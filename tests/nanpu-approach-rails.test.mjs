import assert from 'node:assert/strict';
import {BRIDGES} from '../game/shanghai-map.js';
import {bridgeRailSegmentAllowed} from '../game/skyline.js';
const b=BRIDGES.find(b=>b.id==='nanpu');let kept=0,removedWest=0,removedEast=0;
for(let i=0;i<b.samples.length-1;i+=6){const a=b.samples[i],n=b.samples[Math.min(i+6,b.samples.length-1)];if(a.x===n.x&&a.z===n.z)continue;if(bridgeRailSegmentAllowed(b,a,n)){kept++;assert(Math.min(a.x,n.x)>=136&&Math.max(a.x,n.x)<=275);}else if(Math.min(a.x,n.x)<136)removedWest++;else removedEast++;}
assert(kept>20&&removedWest>0&&removedEast>0,'Bridge rails remain on the span but do not continue into either junction');
assert(bridgeRailSegmentAllowed({id:'forest'},{x:0},{x:500}),'Other bridges unchanged');console.log('PASS: Nanpu approach phantom rails removed while bridge span and other bridges remain.');
