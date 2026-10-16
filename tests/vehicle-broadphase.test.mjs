import assert from 'node:assert/strict';import {vehiclePenetration} from '../game/vehicle-dynamics.js';import {referencePenetration} from './fixtures/vehicle-contact-reference.mjs';
let seed=4137;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);let contacts=0;
for(let i=0;i<40000;i++){
 const v={root:{},halfWidth:.2+random()*3,halfLength:.4+random()*8},x=-224+random()*624,z=-224+random()*624,y=20+random()*20,a=random()*Math.PI*2,far=i%3===0;
 const o={root:{position:{x:x+(random()-.5)*(far?800:12),y:y+(random()-.5)*5,z:z+(random()-.5)*(far?800:12)},rotation:{y:random()*Math.PI*2},visible:i%17!==0},person:i%2===0,height:1+random()*3};if(i%7){o.halfWidth=.15+random()*3;o.halfLength=.4+random()*9;}if(i%101===0)o.root=v.root;
 if(o.root===v.root){o.root.position={x,y,z};o.root.rotation={y:a};}
 const expected=referencePenetration(v,x,y,z,a,o);assert.equal(vehiclePenetration(v,x,y,z,a,o),expected,'Contact depth must exactly match the old rule');if(expected>0)contacts++;
}
assert(contacts>1000);console.log('PASS: 40,000 seeded near/far/rotated/person/vehicle/height/hidden/self pairs retain exact collision depth.');
