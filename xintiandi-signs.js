import * as THREE from './three.module.js';
import {bundStaticGeometry} from './bund-static-batch.js';
import {XINTIANDI} from './xintiandi-layout.js';
import {addHeritagePlaque} from './heritage-plaque.js';

export function addXintiandiPlaques(group){
 const {entryX,frontZ,doors}=XINTIANDI.facade;
 addHeritagePlaque(group,entryX+.5,30.5,frontZ+2.014,4.6,.72,['中共一大会址']);
 addHeritagePlaque(group,-158.5,28.25,166.016,7.5,1.65,['兴业路76号 · 树德里','1921年7月，中共一大在这里开幕。']);
 const ring=new THREE.TorusGeometry(.14,.026,5,12),brass=new THREE.MeshLambertMaterial({color:'#ac8d56'});
 const handles=[];
 for(const x of doors){
  if(x===entryX)continue;
  for(const offset of [-.29,.29]){
   const handle=new THREE.Mesh(ring,brass);
   handle.position.set(x+.5+offset,27.44,frontZ+1.045);
   handle.updateMatrixWorld();handles.push(handle);
  }
 }
 group.add(new THREE.Mesh(bundStaticGeometry(handles),brass));ring.dispose();
}
