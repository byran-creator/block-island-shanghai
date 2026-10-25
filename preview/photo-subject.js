import * as THREE from './three.module.js';

// Shutter-time visibility only. No per-frame scene scans or image recognition.
export function photoIncludesPerson(meta,person,world){
 if(!person?.root||person.root.visible===false||!Array.isArray(meta?.viewProjection)||meta.viewProjection.length!==16||!meta.viewProjection.every(Number.isFinite)||!meta.cameraPosition)return false;
 const at=person.root.position,eye=meta.cameraPosition,matrix=new THREE.Matrix4().fromArray(meta.viewProjection);
 if(![eye.x,eye.y,eye.z,at.x,at.y,at.z].every(Number.isFinite))return false;
 const clip=new THREE.Vector4(),point=new THREE.Vector3();
 for(const y of [.25,1,1.65])for(const x of [-.18,0,.18]){
  point.set(at.x+x,at.y+y,at.z);clip.set(point.x,point.y,point.z,1).applyMatrix4(matrix);
  if(clip.w<=0||Math.abs(clip.x)>clip.w||Math.abs(clip.y)>clip.w||Math.abs(clip.z)>clip.w)continue;
  const length=point.distanceTo(eye),steps=Math.ceil(length/.3);let clear=true;
  for(let i=1;world&&i<steps;i++){const t=i/steps,id=world.get(Math.floor(eye.x+(point.x-eye.x)*t),Math.floor(eye.y+(point.y-eye.y)*t),Math.floor(eye.z+(point.z-eye.z)*t));if(id&&id!==11){clear=false;break;}}
  if(clear)return true;
 }
 return false;
}
