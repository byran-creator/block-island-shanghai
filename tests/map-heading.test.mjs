import assert from 'node:assert/strict';
import {playerMapArrow,drawMapPlayer} from '../game/map-heading.js';
const near=(a,b)=>assert(Math.abs(a-b)<1e-8);
for(const [yaw,dx,dy]of [[0,0,-7],[Math.PI/2,-7,0],[Math.PI,0,7],[-Math.PI/2,7,0]]){const tip=playerMapArrow(50,60,yaw,7)[0];near(tip[0],50+dx);near(tip[1],60+dy);}
const moves=[],ctx={beginPath(){},moveTo(...p){moves.push(p);},lineTo(){},closePath(){},fill(){},stroke(){}};drawMapPlayer(ctx,{x:0,z:0},0,624,-224,624);assert.deepEqual(moves[0],[224,213]);assert(playerMapArrow(0,0,NaN,7).flat().every(Number.isFinite));
console.log('PASS: north/east/south/west camera bearings, map coordinates, large-map scale and finite heading fallback.');
