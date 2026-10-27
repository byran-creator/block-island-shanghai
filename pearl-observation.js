import * as THREE from './three.module.js';
import {PEARL} from './shanghai-map.js';
import {batchMeshes,staticMeshes} from './mesh-batch.js';

export function createPearlObservation(scene){
 const root=new THREE.Group();root.name='pearl-observation';root.position.set(PEARL.x,70,PEARL.z);scene.add(root);
 // Same transparent, double-sided, non-depth-writing material strategy as the tower interior.
 const glass=new THREE.MeshBasicMaterial({color:'#b2d5d7',opacity:.14,transparent:true,depthWrite:false,side:THREE.DoubleSide});
 const floor=new THREE.Mesh(new THREE.CircleGeometry(4.0,24),glass);floor.rotation.x=-Math.PI/2;floor.position.y=.005;root.add(floor);
 const windows=new THREE.Mesh(new THREE.CylinderGeometry(4.18,4.18,3,24,1,true),glass);windows.position.y=1.5;root.add(windows);
 // Front faces restore the exterior silhouette while staying invisible from inside.
 const shellMaterial=new THREE.MeshBasicMaterial({color:'#c36d8b',transparent:true,opacity:.91,depthWrite:false,side:THREE.FrontSide});
 const shell=new THREE.Mesh(new THREE.CylinderGeometry(4.26,4.26,4,24,1,true),shellMaterial);shell.name='pearl-outer-glass-band';shell.position.y=0;root.add(shell);
 const box=new THREE.BoxGeometry(1,1,1),materials=new Map();function cube(color,x,y,z,w,h,d){let mat=materials.get(color);if(!mat)materials.set(color,mat=new THREE.MeshBasicMaterial({color}));const m=new THREE.Mesh(box,mat);m.position.set(x,y,z);m.scale.set(w,h,d);root.add(m);return m;}
 // Low central elevator marker, a compact snack counter and visible pastries.
 cube('#8c9693',-.1,.025,-.7,1.1,.05,1.1);
 cube('#9e704f',2.3,.46,1.8,1.05,.92,.55);cube('#e4cfaa',2.3,.97,1.8,1.16,.1,.64);
 for(const dx of [-.3,0,.3])cube('#d8994c',2.3+dx,1.06,1.8,.19,.12,.24);
 for(let i=0;i<12;i++){const a=i*Math.PI/6;const m=cube('#c1cecc',Math.cos(a)*4.08,1.5,Math.sin(a)*4.08,.055,2.95,.055);m.rotation.y=-a;}
 batchMeshes(root,staticMeshes(root,new Set([floor,windows,shell])),'pearl-observation-details');
 // Ground entrance remains a small stationary lift arch, with a clear player path.
 const lobby=new THREE.Group();lobby.name='pearl-ground-lift';lobby.position.set(PEARL.x,26,54);scene.add(lobby);
 for(const x of [-1.15,1.15]){const post=new THREE.Mesh(box,materials.get('#c1cecc'));post.position.set(x,1.55,-1);post.scale.set(.18,3.1,.2);lobby.add(post);}
 const beam=new THREE.Mesh(box,materials.get('#c1cecc'));beam.position.set(0,3.05,-1);beam.scale.set(2.5,.18,.2);lobby.add(beam);
 batchMeshes(lobby,staticMeshes(lobby),'pearl-ground-lift-frame');
 return {root,lobby,floor,windows,glass,shell};
}
