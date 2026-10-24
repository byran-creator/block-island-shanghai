import assert from 'node:assert/strict';
import * as T from '../game/three.module.js';
import {createMetroNetwork} from '../game/metro-network.js';
import {createMetroVisuals} from '../game/metro-visuals.js';
const previous=globalThis.document,ctx=new Proxy({},{get:(_,k)=>k==='measureText'?t=>({width:t.length*15}):()=>{}}),node=()=>({children:[],appendChild(c){this.children.push(c);},append(){},setAttribute(){},getContext:()=>ctx,classList:{toggle(){}}});
globalThis.document={createElement:node,body:node(),hidden:false};
const visible=o=>{for(;o;o=o.parent)if(!o.visible)return false;return true;};
try{
 const scene=new T.Scene(),pos={x:10,y:26,z:170};let edits=false;
 const network=createMetroNetwork({scene,getPos:()=>pos,place:q=>Object.assign(pos,q),setView(){},notify(){},getSound:()=>false,canCullInteriors:()=>!edits});
 const passageRoot=scene.getObjectByName('nanjing-paid-transfer-passage'),passage=passageRoot?.getObjectByName('occluded-metro-interior');assert(passage);assert(!visible(passage),'The late transfer passage belongs to an underground visibility owner');assert(passage.children.length>10);
 const lines=[network.lines[2],network.lines[10]],screens=lines.flatMap(line=>line.stations.flatMap(s=>s.screens.map(v=>v.screen))),routes=lines.flatMap(line=>line.trains.map(t=>t.route)),boards=[...screens,...routes];
 assert(boards.length>4);assert(boards.every(b=>!visible(b.mesh)));
 const versions=boards.map(b=>b.texture.version),texts=boards.map(b=>JSON.stringify(b.mesh.userData.signText));
 for(let n=0;n<300;n++)network.tick(.1,{night:false});
 assert.deepEqual(boards.map(b=>b.texture.version),versions,'Hidden screens do not redraw or mark their private textures for upload');assert(boards.some((b,i)=>JSON.stringify(b.mesh.userData.signText)!==texts[i]),'Service clocks/arrival text continue while hidden');
 pos.y=16;network.tick(0,{night:false});assert(visible(passage));assert(boards.every(b=>visible(b.mesh)));assert(boards.some((b,i)=>b.texture.version>versions[i]),'Reentry flushes the latest pending content in the same simulation second');
 const versionsAfter=boards.map(b=>b.texture.version);network.tick(0,{night:false});assert.deepEqual(boards.map(b=>b.texture.version),versionsAfter,'An unchanged visible display does not upload again');
 pos.y=26;network.tick(0,{night:false});assert(!visible(passage));edits=true;network.tick(0,{night:false});assert(visible(passage),'Player edits retain the occlusion opt-out');
 const sign=lines[0].addSign(['测试换乘'],{x:0,y:16,z:0},4,1);assert(sign.mesh.parent.name==='occluded-metro-interior','Late addSign registers below-ground signs');edits=false;network.tick(0,{night:false});assert(!visible(sign.mesh));sign.paint(['立即绘制']);assert.deepEqual(sign.mesh.userData.signText.front,['立即绘制'],'The public paint API remains immediate');
 const street=lines[0].addSign(['地面入口'],{x:0,y:27,z:0},4,1);assert(visible(street.mesh),'A late street entrance is never classified as underground');
 const root=new T.Group();root.position.set(100,0,10);scene.add(root);const v=createMetroVisuals(root,{getPos:()=>pos,exits:[]}),late=new T.Mesh(new T.BoxGeometry(1,1,1));late.position.set(2,16,3);root.add(late);assert(v.register(late));assert.deepEqual(late.getWorldPosition(new T.Vector3()).toArray(),[102,16,13],'Registration preserves world transforms');assert(!v.register(late),'A child cannot be registered twice or moved from another owner');
}finally{globalThis.document=previous;}
console.log('PASS: late transfer/sign ownership, hidden private display redraw suppression, clock advancement, immediate reentry/unchanged upload suppression, public paint, street and edit opt-outs.');
