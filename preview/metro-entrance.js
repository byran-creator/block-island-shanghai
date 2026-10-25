import * as THREE from './three.module.js';

export function metroEntranceLayout(exit){const width=(exit.width??1.5)*2+.3;return {x:exit.x-exit.dir*1.4,z:exit.z,width,length:2.8,roofY:29.4,signX:exit.x-exit.dir*2.83,signY:28.92,signWidth:width-.08,signHeight:.86};}
export function createMetroEntrance(parent,station,exit,{cube,board}){
 const a=metroEntranceLayout(exit),root=new THREE.Group();root.name='metro-entrance-'+station.id+'-'+exit.number;parent.add(root);
 cube(root,'#727e82',a.x,a.roofY,a.z,a.length,.18,a.width);
 cube(root,'#b9d2d4',a.x,a.roofY+.1,a.z,a.length-.1,.045,a.width-.1,.6);
 // Side supports leave the original ramp centre and walking headroom open.
 for(const z of [-1,1])for(const x of [-1,1])cube(root,'#a7b5b9',a.x+x*(a.length/2-.08),27.7,a.z+z*(a.width/2-.055),.08,3.8,.08);
 for(const side of [-1,1])cube(root,'#a2c3ca',a.x,27.55,a.z+side*(a.width/2-.015),a.length-.2,2.55,.035,.24);
 const front=board(root,[station.name+'站',station.english,String(exit.number)],a.signX,a.signY,a.z,a.signWidth,a.signHeight,'#f5f5ee','#171a1b',{layout:'entrance'});front.mesh.rotation.y=exit.dir*Math.PI/2;
 for(const side of [-1,1]){const sign=board(root,[],a.x,a.signY,a.z+side*(a.width/2+.02),a.length-.1,.75,'#f5f5ee','#171a1b',{sections:[{zh:station.name+'站',en:station.english,line2:true,weight:3.4},{exit:exit.number}],separatorColor:'#f5f5ee'});sign.mesh.rotation.y=side>0?0:Math.PI;}
 return a;
}
