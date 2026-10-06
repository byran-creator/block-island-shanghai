import * as THREE from './three.module.js';
import {batchMeshes,staticMeshes} from './mesh-batch.js';
const mats=new Map(),box=new THREE.BoxGeometry(1,1,1),ball=new THREE.SphereGeometry(1,12,8),disc=new THREE.CylinderGeometry(1,1,1,20);
const material=c=>{if(!mats.has(c))mats.set(c,new THREE.MeshLambertMaterial({color:c}));return mats.get(c);};
export const SHOP_PRODUCTS={mooncake:{name:'鲜肉月饼',food:2},bun:{name:'生煎包',food:2},gift:{name:'海派明信片礼盒',food:0}};
// Individually removable servings. Merge inside each item, never across stock units.
export function createProduct(kind,{meal=false}={}){
 const root=new THREE.Group();root.name='product-'+kind;root.userData.product=kind;
 const part=(geometry,c,x,y,z,w,h,d)=>{const m=new THREE.Mesh(geometry,material(c));m.position.set(x,y,z);m.scale.set(w,h,d);root.add(m);return m;};
 const cube=(...a)=>part(box,...a),round=(...a)=>part(disc,...a),sphere=(...a)=>part(ball,...a);
 const plate=(x=0,z=0,r=.42)=>{round('#f6f0de',x,.035,z,r,.05,r);round('#d8bd81',x,.068,z,r*.91,.015,r*.91);round('#fff9e9',x,.081,z,r*.86,.018,r*.86);};
 if(kind==='gift'){
  cube('#c35759',0,.11,0,.61,.22,.43);cube('#f6e7ca',0,.23,0,.56,.02,.4);
  for(let i=0;i<4;i++){cube(['#3d8792','#d3ac72','#71807d'][i%3],0,.249+i*.013,0,.49,.011,.32);cube('#e6dbc3',-.15+i*.07,.27+i*.013,-.04,.04,.014,.21);}
  cube('#ecdcb8',0,.13,-.223,.28,.09,.01);
 }else if(['mooncake','bun'].includes(kind)){
  plate();sphere(kind==='mooncake'?'#cf9350':'#f1dbb2',0,.18,0,.29,.11,.29);round('#a76b35',0,.1,0,.25,.035,.25);
  if(kind==='mooncake'){for(let i=0;i<9;i++)cube('#e9b16b',(i%3-1)*.12,.27,(Math.floor(i/3)-1)*.12,.085,.016,.025);}else{for(let i=0;i<8;i++){const a=i*Math.PI/4,m=cube('#ded1ab',Math.cos(a)*.12,.275,Math.sin(a)*.12,.15,.017,.024);m.rotation.y=-a;}for(let i=0;i<7;i++)cube(i%2?'#456b35':'#fff0bd',Math.cos(i*2.4)*.2,.27,Math.sin(i*2.4)*.2,.023,.018,.023);}
 }else if(kind==='noodles'){
  round('#f8f3df',0,.1,0,.45,.18,.45);round('#7d5730',0,.2,0,.39,.025,.39);
  for(let i=0;i<15;i++){const m=cube('#e6c887',(i%5-2)*.13,.23+Math.floor(i/5)*.015,(Math.floor(i/5)-1)*.16,.11,.028,.31);m.rotation.y=Math.sin(i*2)*.45;}
  for(let i=0;i<8;i++)cube('#548241',Math.sin(i*2)*.24,.29,Math.cos(i*2)*.24,.11,.024,.025);
 }else if(kind==='rice'){
  plate(0,0,.48);round('#7b3924',0,.09,0,.37,.035,.37);
  for(let i=0;i<6;i++){const x=(i%3-1)*.2,z=(Math.floor(i/3)-.5)*.23;cube('#78391e',x,.21,z,.17,.22,.18);cube('#ba7b45',x,.255,z,.175,.035,.185);cube('#e2bf8c',x,.2,z,.175,.033,.185);}
  for(const x of [-.4,.4])sphere('#557e39',x,.13,.07,.1,.05,.17);
  round('#f4efda',.72,.12,0,.25,.23,.25);sphere('#fcf5de',.72,.24,0,.23,.085,.23);
 }else if(kind==='tea'){
  plate();for(const x of [-.2,.2]){cube('#dfb07b',x,.15,0,.26,.16,.25);cube('#f5e5bf',x,.19,0,.26,.035,.25);sphere('#a34039',x,.255,0,.07,.035,.08);}
  round('#f4efde',.65,.13,0,.17,.23,.17);round('#946b39',.65,.251,0,.145,.012,.145);round('#f6eedb',.65,.025,0,.24,.03,.24);
 }
 if(meal){for(const z of [.49,.55])cube('#3c2b22',.1,.035,z,1.03,.024,.025);cube('#eee6d1',-.66,.06,0,.25,.1,.32);}
 batchMeshes(root,staticMeshes(root),'product-detail');return root;
}
