import * as THREE from './three.module.js';
import {styleNpc} from './npc-appearance.js';
import {WUKANG_HOUSES,WUKANG_SHOPS} from './wukang-layout.js';

export function createWukangShopkeepers(){
 const shops=WUKANG_HOUSES.filter(house=>house.shop);
 const people=shops.map(({x,z,face,shop})=>{
  const root=new THREE.Group(),info=WUKANG_SHOPS[shop];
  root.position.set(x+.5,26,z+.5);
  root.rotation.y=-face*Math.PI/2;
  root.visible=false;
  return {root,person:true,district:'wukang',kind:'shopkeeper',npcRole:info.keeper,guide:{intro:info.intro,choices:[[info.question,info.answer]]}};
 });
 function decorate(group){
  const geometry=new THREE.BoxGeometry(),material=new THREE.MeshLambertMaterial({color:'#d8bd9e'}),signPlane=new THREE.PlaneGeometry(3.9,.65);
  for(const [index,house] of shops.entries()){
   const actor=people[index],root=actor.root,info=WUKANG_SHOPS[house.shop];
   function part(y,width,height,depth,x=0){
    const mesh=new THREE.Mesh(geometry,material);
    mesh.position.set(x,y,0);
    mesh.scale.set(width,height,depth);
    root.add(mesh);
    return mesh;
   }
   const head=part(1.57,.34,.36,.34),torso=part(1.07,.44,.65,.29);
   const arms=[-.29,.29].map(x=>part(1.02,.13,.59,.22,x));
   const legs=[-.115,.115].map(x=>part(.35,.18,.69,.22,x));
   styleNpc({root,head,torso,arms,legs},index+2,'vendor');
   root.visible=true;
   group.add(root);

   const canvas=document.createElement('canvas');canvas.width=320;canvas.height=54;
   const ctx=canvas.getContext('2d');
   ctx.fillStyle=info.color;ctx.fillRect(0,0,320,54);
   ctx.strokeStyle='#cbb495';ctx.strokeRect(4,4,312,46);
   ctx.font='500 30px "Microsoft YaHei",sans-serif';
   ctx.fillStyle='#ffecd0';ctx.textAlign='center';ctx.textBaseline='middle';
   ctx.fillText(info.name,160,27);
   const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;
   const sign=new THREE.Mesh(signPlane,new THREE.MeshBasicMaterial({map}));
   sign.rotation.y=house.face*Math.PI/2;
   sign.position.set(house.x+house.face*(house.rx+1.52)+(house.face<0?1:0),29.6,house.z+.5);
   group.add(sign);
  }
 }
 return {people,decorate,setNear:visible=>{for(const actor of people)actor.root.visible=visible;}};
}
