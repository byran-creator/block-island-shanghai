import assert from 'node:assert/strict';
import * as T from '../game/three.module.js';
import {createStreetSignArt} from '../game/street-sign-art.js';
import {createNpcNameArt} from '../game/npc-name-art.js';
import {createNpcGuides} from '../game/npc-guides.js';
import {drawHeritageSign} from '../game/shanghai-textures.js';
import {createCityActivity} from '../game/city-activity.js';
import {VoxelWorld} from '../game/world.js';
const previous=globalThis.document;
function canvas(){
 const calls=[],state={},context=new Proxy(state,{get(o,k){if(k==='measureText')return t=>({width:t.length*16});if(k==='createLinearGradient'||k==='createRadialGradient')return (...v)=>{const g={addColorStop(...s){calls.push(['stop',...s]);}};calls.push([k,...v]);return g;};return k in o?o[k]:(...v)=>calls.push([k,...v]);},set(o,k,v){calls.push(['set',k,typeof v==='object'?'gradient':v]);o[k]=v;return true;}});
 return {calls,getContext:()=>context};
}
const node=()=>({children:[],style:{},classList:{add(){},remove(){},contains(){return false;}},appendChild(c){this.children.push(c);},setAttribute(){},addEventListener(){}}),nodes=new Map();
globalThis.document={createElement:kind=>kind==='canvas'?canvas():node(),body:node(),getElementById:id=>{if(!nodes.has(id))nodes.set(id,node());return nodes.get(id);}};
try{
 const pool=createStreetSignArt(),a=pool.get('上海',0xffaa33,4,1),b=pool.get('上海',0xffaa33,4,1);
 assert.equal(a.day,b.day);assert.equal(a.night,b.night);assert.equal(a.geometry,b.geometry);
 const wide=pool.get('上海',0xffaa33,8,1);assert.equal(wide.day,a.day,'Physical plane dimensions do not change identical artwork');assert.notEqual(wide.geometry,a.geometry);
 for(const [text,style,graffiti,cw,ch]of [['上海','horizontal',false,512,144],['上海','vertical-blade',false,192,512],['上海','medallion',false,256,256],['上海','arch',false,512,192],['沪','horizontal',true,128,128],['𠮷','horizontal',true,128,128]]){
  const art=pool.get(text,0xffaa33,4,1,graffiti,2,style);
  for(const night of [false,true]){const map=art[night?'night':'day'].map,expected=canvas();expected.width=cw;expected.height=ch;drawHeritageSign(expected,text,2,false,night,0xffaa33,style);assert.deepEqual([map.image.width,map.image.height],[cw,ch]);assert.deepEqual(map.image.calls,expected.calls,'Pooled artwork keeps the original drawing operations');assert.equal(map.colorSpace,T.SRGBColorSpace);assert.equal(map.anisotropy,8);assert.equal(map.minFilter,T.LinearMipmapLinearFilter);}
 }
 assert.notEqual(pool.get('上海',0xffffff,4,1).day,a.day);assert.notEqual(pool.get('上海',0xffaa33,4,1,false,1).day,a.day);assert.notEqual(createStreetSignArt().get('上海',0xffaa33,4,1).day,a.day,'No cross-scene ownership');
 const h=pool.get('H',0,2,2);assert(h.day.map.image.calls.some(c=>c[0]==='fillText'&&c[1]==='H'));assert(h.night.map.image.calls.some(c=>c[0]==='set'&&c[1]==='fillStyle'&&c[2]==='#ffe66d'));
 const plain=new T.PlaneGeometry(4,1);for(const key of Object.keys(plain.attributes))assert.deepEqual(a.geometry.attributes[key].array,plain.attributes[key].array);assert.deepEqual(a.geometry.index.array,plain.index.array);plain.dispose();
 const disposed={texture:0,material:0,geometry:0};a.day.map.addEventListener('dispose',()=>disposed.texture++);a.day.addEventListener('dispose',()=>disposed.material++);a.geometry.addEventListener('dispose',()=>disposed.geometry++);pool.dispose();pool.dispose();assert.deepEqual(disposed,{texture:1,material:1,geometry:1});
 const names=createNpcNameArt(),name=names.get('楼宇职员');assert.equal(names.get('楼宇职员'),name);assert.notEqual(names.get('游客'),name);assert.notEqual(createNpcNameArt().get('楼宇职员'),name);assert.equal(name.image.height,64);assert.equal(name.image.width,'楼宇职员'.length*16+28);assert.equal(name.colorSpace,T.NoColorSpace,'Preserve the original nameplate sampling/color configuration');
 const roots=[new T.Group(),new T.Group()];createNpcGuides({scene:new T.Scene(),world:{},civil:{pedestrians:[],traffic:{officers:[],riders:[],agents:[]}},activity:{tourists:[],vendors:[]},extraPeople:roots.map(root=>({root,npcRole:'楼宇职员'})),getPos:()=>({x:0,y:26,z:0}),getVehicles:()=>[],pause(){},resume(){},notify(){}});
 const tags=roots.map(r=>r.children.find(c=>c.userData.npcName));assert.notEqual(tags[0],tags[1]);assert.notEqual(tags[0].material,tags[1].material);assert.equal(tags[0].material.map,tags[1].material.map);tags[0].visible=false;tags[0].material.opacity=.5;assert(tags[1].visible);assert.equal(tags[1].material.opacity,1,'Actor visibility/opacity remain independent');
 let count=0;name.addEventListener('dispose',()=>count++);names.dispose();names.dispose();assert.equal(count,1);
 const activity=createCityActivity({scene:new T.Scene(),world:new VoxelWorld(),getPos:()=>({x:0,y:26,z:66}),getState:()=>({}),notify(){},pause(){},resume(){}});activity.tick(0,{night:false});
 let writes=0;for(const s of activity.signs){let value=s.mesh.material;Object.defineProperty(s.mesh,'material',{get:()=>value,set(m){writes++;value=m;},configurable:true});}
 activity.tick(0,{night:false});assert.equal(writes,0,'Stable day/night state does not rewrite every sign material');activity.tick(0,{night:true});assert.equal(writes,activity.signs.length);assert(activity.signs.every(s=>s.mesh.material===s.night));activity.tick(0,{night:true});assert.equal(writes,activity.signs.length);activity.tick(0,{night:false});assert.equal(writes,activity.signs.length*2);assert(activity.signs.every(s=>s.mesh.material===s.day));assert(new Set(activity.signs.map(s=>s.day.map)).size<activity.signs.length,'Real repeated street signs share their immutable artwork');
}finally{globalThis.document=previous;}
console.log('PASS: street/name artwork reuse, original drawing/dimensions/sampling/geometry, key separation, independent NPC sprites/materials and owner disposal.');
