import assert from 'node:assert/strict';
import * as T from '../game/three.module.js';
import {VoxelWorld,overlaps,LANDMARKS,towerProfile} from '../game/world.js';
import {PRIVATE_SUITES,suiteArrival} from '../game/private-suite-layout.js';
import {createPrivateSuites} from '../game/private-suites.js';
import {createTowerInteriors} from '../game/tower-interiors.js';
import {createSkyline} from '../game/skyline.js';
import {createLujiazuiPeople,createLujiazuiFlow} from '../game/lujiazui-life.js';
import {TOWER_OFFICE_DESKS,TOWER_READING_BOOKS,TOWER_ROOMS,towerRoomBoundary} from '../game/tower-interior-layout.js';
import {CITY} from '../game/shanghai-map.js';
import {phaseFromMinutes} from '../game/day-time.js';

const world=new VoxelWorld(),previous=globalThis.document,ids=new Map(),context=new Proxy({measureText:()=>({width:60})},{get:(o,k)=>o[k]??(()=>{})});
const node=()=>({children:[],style:{},events:{},append(...n){this.children.push(...n);},appendChild(n){this.children.push(n);},replaceChildren(...n){this.children=n;},addEventListener(k,v){this.events[k]=v;},setAttribute(){},focus(){},showModal(){this.open=true;},close(){this.open=false;},getContext:()=>context});
globalThis.document={body:node(),createElement:node,getElementById(id){if(!ids.has(id))ids.set(id,node());return ids.get(id);}};
try{
 const scene=new T.Scene();let p={...LANDMARKS.shanghai},paused=0,resumed=0;const readings=[],place=q=>{p={...q};},base={scene,world,getPos:()=>p,place,teleport:place,lookAt(){},notify(){},pause(){paused++;},resume(){resumed++;},onProgress(){},getState:()=>({health:20,hunger:20}),setDay(){}};
 const suites=createPrivateSuites(base),peace=PRIVATE_SUITES[0],clear=q=>!overlaps(world,q.x,q.y,q.z)&&!suites.collides(q.x,q.y,q.z);
 for(let x=peace.x+.5;x<peace.x+peace.rx+peace.balconyDepth-.15;x+=.08){const q={x,y:peace.y,z:peace.z+.5};assert(clear(q),'Suite central doorway must open onto the supported terrace');assert(overlaps(world,q.x,q.y-.1,q.z),'Every step onto the balcony has floor support');}
 const bench=suites.seats[0];assert(bench.exits.some(clear));p={...bench.exits[0]};assert(suites.use());assert(suites.isSeated());assert(suites.cameraPose(0,0).position.y<p.y+1.62);assert.deepEqual(suites.safeSavePoint(),bench.exits[0]);assert(suites.standUp());assert(clear(p));assert(!suites.isSeated());
 for(let x=2.5;x>=peace.lobby.x;x-=.1)assert(clear({x,y:26,z:peace.lobby.z}),'The street-to-hotel lift aisle is open');
 p={...peace.lobby};assert(clear(p));assert(suites.use()&&suites.isPanelOpen());let lift=document.body.children.find(n=>n.id==='peace-lift-dialog');assert.equal(lift.children[1].children.length,3);lift.children[1].children[2].onclick();assert.equal(p.y,47);assert(!suites.isPanelOpen());const exit=suites.actions.find(a=>a.s===peace&&a.kind==='exit');p={x:exit.x,y:exit.y,z:exit.z+.2};assert(clear(p),'The suite lift return point must be reachable');assert(suites.use());lift.children[1].children[0].onclick();assert.equal(p.y,26);
 const cube=()=>{},person=()=>({root:new T.Group(),arms:[new T.Group(),new T.Group()],legs:[new T.Group(),new T.Group()]});const people=createLujiazuiPeople({person,cube}),flow=createLujiazuiFlow(people,{world,others:()=>people});
 const interiors=createTowerInteriors({...base,people,onRead:x=>readings.push(x)}),inside=q=>!overlaps(world,q.x,q.y,q.z)&&!interiors.collides(q.x,q.y,q.z);
 // All arrival points and the whole south lobby approach use real voxels.
 for(const id of ['shanghai','towerOffice','duoyun']){const q=LANDMARKS[id];assert(inside(q),id+' arrival is clear');assert(overlaps(world,q.x,q.y-.1,q.z),id+' arrival is supported');}
 for(let z=CITY.shanghai.z+10;z>=LANDMARKS.shanghai.z;z-=.1)assert(inside({x:CITY.shanghai.x,y:26,z}),'The street-to-lobby aisle is open');
 for(const b of TOWER_READING_BOOKS){p={x:CITY.shanghai.x+b.x,y:66,z:CITY.shanghai.z+b.z};assert(inside(p),'Book interaction is reachable: '+b.title);assert(interiors.use());const dialog=document.body.children.find(n=>n.id==='duoyun-reading-dialog');for(let i=0;i<b.pages.length;i++)dialog.children.at(-1).children.at(-1).onclick();assert(!interiors.isPanelOpen());}assert.equal(readings.length,3);
 for(const seat of interiors.seats){assert(seat.exits.some(inside));p={...seat.exits.find(inside)};assert(interiors.use());assert(interiors.isSeated());assert(interiors.standUp());assert(inside(p));}
 for(const room of Object.values(TOWER_ROOMS))for(let i=0;i<32;i++){const a=i*Math.PI/16,r=towerRoomBoundary(towerProfile,room.y,CITY.shanghai.x+Math.cos(a),CITY.shanghai.z+Math.sin(a));assert(interiors.collides(CITY.shanghai.x+Math.cos(a)*r,room.y,CITY.shanghai.z+Math.sin(a)*r),'The whole glass perimeter remains a safe barrier');}
 // Same existing actors go through the real lobby, with an upstairs render pose.
 flow.tick(0,[],phaseFromMinutes(120));const staff=interiors.staff;assert.equal(staff.length,2);assert(staff.every(p=>p.daily.rooms.work.id==='shanghai-tower-office'));
 for(let t=0;t<400;t+=.1)flow.tick(.1,[],phaseFromMinutes(9*60+30));assert(staff.every(p=>p.daily.state==='work'));
 p={...LANDMARKS.towerOffice};const logical=staff.map(a=>a.root.position.clone());interiors.tick(true);staff.forEach((a,i)=>{assert(a.root.visible);assert(a.root.position.y===46);assert(inside(a.root.position));assert(a.root.position.distanceTo(new T.Vector3(TOWER_OFFICE_DESKS[i].x,46,TOWER_OFFICE_DESKS[i].z))<.01);});interiors.beginTick();assert(staff.every((a,i)=>a.root.position.equals(logical[i])&&!a.root.visible),'Rendering work upstairs never changes commute coordinates or duplicates the actor');
 for(let t=0;t<400;t+=.1)flow.tick(.1,[],phaseFromMinutes(18*60+30));assert(staff.every(p=>p.daily.state==='home'),'Employees leave through the original commute system');
 const skyline=createSkyline({...base,grantGlider(){}});p={...LANDMARKS.shanghai};assert(skyline.use());const options=ids.get('elevator-options').children;assert.equal(options.length,5);options[2].onclick();assert.equal(p.y,66);assert(skyline.use());ids.get('elevator-options').children[0].onclick();assert.equal(p.y,26);assert(inside(p));assert(paused>4&&resumed>4);
 const meshes=[];for(const root of interiors.roots)root.traverse(o=>{assert(!o.isLight,'Interiors do not add realtime lights');if(o.isMesh)meshes.push(o);});assert(meshes.length<90,'Static shelves and furniture are merged into a bounded number of draws');
 console.log(JSON.stringify({passed:true,interiorMeshes:meshes.length,readingBooks:readings.length,reusedWorkers:staff.length,balconySeats:suites.seats.length}));
}finally{globalThis.document=previous;}
