import assert from 'node:assert/strict';
import {VoxelWorld,overlaps} from '../game/world.js';
import {planTutorialRoute,tutorialRouteSearch,tutorialRoutePrefix,tutorialSegment,tutorialCrossing} from '../game/tutorial-route.js';
import {roadContains,DENSE_BUILDINGS} from '../game/city-layout.js';
import {questTarget} from '../game/quest-guidance.js';
import {JOURNEY_ACTORS} from '../game/shanghai-journey-content.js';
import {readFileSync} from 'node:fs';

const world=new VoxelWorld(),start={x:35,y:26,z:66},goal={x:-92,y:26,z:66};
const search=tutorialRouteSearch(world,start,goal);let step,turns=0,maxSlice=0;do{const t=performance.now();step=search.next();maxSlice=Math.max(maxSlice,performance.now()-t);turns++;}while(!step.done);
const route=step.value;assert(route&&route.length>100);assert(turns>1,'Planning yields rather than blocking one game frame');
const vendors=DENSE_BUILDINGS.filter(b=>b.id.startsWith('nanjing-')).flatMap((b,index)=>{const i=b.streetIndex??index;if(i%3!==0)return [];const indoor=i%12!==0,x=b.x+2.4,z=indoor?b.z:b.entranceSide>0?63.1:69.9;return [{root:{position:{x,y:26,z}},indoor,x,z,building:b,name:b.id,remaining:6}];});
const shopGoal=questTarget('shop',{pos:JOURNEY_ACTORS.lin,vendors}),stele=(x,y,z)=>Math.abs(x+35)<.65&&Math.abs(z-66)<1.85,shopping=planTutorialRoute(world,JOURNEY_ACTORS.lin,shopGoal,{blocked:stele});assert(shopping?.length>50,'The real second-chapter merchant entrance is reachable');assert(shopping.every(p=>!stele(p.x,p.y,p.z)),'The route also avoids the non-voxel street monument');
for(let i=1;i<route.length;i++){assert(tutorialSegment(world,route[i-1],route[i]));assert(!overlaps(world,route[i].x,route[i].y,route[i].z));assert(!roadContains(route[i].x,route[i].z)||tutorialCrossing(route[i]),'Only marked zebra crossings may cross a road');}
const red=tutorialRoutePrefix(world,start,route);assert(red.waiting);assert(red.points.length>0&&red.points.every(p=>p.x>29.05),'Large arrows stop before the crossing waiting line');
const green=tutorialRoutePrefix(world,start,route,{canCross:()=>true});assert(!green.waiting);assert(green.points.some(p=>p.x<28.1),'A permitted crossing continues the visible route');
const cleared=tutorialRoutePrefix(world,{x:22,y:26,z:66},route,{canCross:()=>false});assert(cleared.points.some(p=>p.x<20),'A player already crossing receives an exit direction when the light changes');
const wallWorld={get:(x,y,z)=>y===25?7:x===-164&&z>=60&&z<=70&&y>=26&&y<28?3:0};
const around=planTutorialRoute(wallWorld,{x:-160,y:26,z:66},{x:-172,y:26,z:66});assert(around?.some(p=>p.z<60||p.z>70),'The route turns around a wall, rather than hiding a straight heading');for(let i=1;i<around.length;i++)assert(tutorialSegment(wallWorld,around[i-1],around[i]));
assert.equal(planTutorialRoute({get:()=>0},{x:-160,y:26,z:66},{x:-172,y:26,z:66}),null,'Water is not a walking shortcut');
const rampStart={x:-134,y:25.4444444444,z:61.35},rampGoal={x:-116,y:16,z:61.35},ramp=planTutorialRoute(world,rampStart,rampGoal);assert(ramp?.length>10);assert(ramp.some(p=>p.y<24&&p.y>17));for(let i=1;i<ramp.length;i++)assert(tutorialSegment(world,ramp[i-1],ramp[i]));
const rampArrows=tutorialRoutePrefix(world,rampStart,ramp);assert(rampArrows.points.some(p=>p.pitch<-.1),'Sloping arrows tilt with the down escalator');
const obstructed=tutorialRoutePrefix(world,start,route,{blocked:(x,y,z)=>x<33,canCross:()=>true});assert(obstructed.invalid);assert(obstructed.points.every(p=>p.x>=33),'A new player-built obstruction is checked before showing the next arrow');
// Chapters 4/5 reuse the existing forecourts, tower lift and both station levels.
const cityLegs=[
 ['3号口到职员',{x:206,y:26,z:24},{x:194,y:26,z:51}],
 ['职员到工牌',{x:194,y:26,z:51},{x:194.5,y:26,z:54.5}],
 ['工牌到游客',{x:194.5,y:26,z:54.5},{x:203,y:26,z:100}],
 ['游客到观光电梯',{x:203,y:26,z:100},{x:189.5,y:26,z:103.5}],
 ['观景台返回电梯',{x:190,y:136,z:110},{x:189.5,y:136,z:106.5}],
 ['地面电梯返回站口',{x:189.5,y:26,z:103.5},{x:205,y:26,z:24}],
 ['陆家嘴下行入口扶梯',{x:204,y:25.444444444,z:24},{x:187,y:16,z:24}],
 ['陆家嘴站台上行扶梯',{x:180,y:6,z:34},{x:161,y:16,z:34}],
 ['南京东路站台返回站厅',{x:-70,y:6,z:69},{x:-107,y:16,z:69}],
];
for(const [name,a,b]of cityLegs){const path=planTutorialRoute(world,a,b);assert(path?.length>1,name+' has a supported walking route');for(let i=1;i<path.length;i++)assert(tutorialSegment(world,path[i-1],path[i]),name+' has no wall, void or unsupported level jump');assert(tutorialRoutePrefix(world,a,path,{canCross:()=>true}).points.length>0,name+' shows nearby arrows');}
assert.equal(planTutorialRoute(world,{x:189.5,y:136,z:106.5},{x:189.5,y:26,z:103.5}),null,'The lift is an interaction, not a route through the floors');
const html=readFileSync('game/index.html','utf8');assert(/id="start-survival"[^>]*hidden[^>]*display:none/.test(html));assert(html.includes('id="survival-toggle"'));assert(/id="tracked-arrow"[^>]*><svg/.test(html));assert(!html.includes('id="tracked-arrow">▲'));
console.log(JSON.stringify({passed:true,routePoints:route.length,searchSlices:turns,maxSliceMilliseconds:maxSlice,escalatorPoints:ramp.length,groundArrows:6,desktopDuplicateEntryHidden:true}));
