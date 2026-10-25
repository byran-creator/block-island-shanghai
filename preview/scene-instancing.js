import * as THREE from './three.module.js';

// Three's instance normal transform supports rotation and scale, but not shear.
function supportedTransform(m){
 const e=m.elements,a=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],b=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],c=e[8]*e[8]+e[9]*e[9]+e[10]*e[10],ab=e[0]*e[4]+e[1]*e[5]+e[2]*e[6],ac=e[0]*e[8]+e[1]*e[9]+e[2]*e[10],bc=e[4]*e[8]+e[5]*e[9]+e[6]*e[10];
 return m.determinant()>=0&&ab*ab<=1e-12*a*b&&ac*ac<=1e-12*a*c&&bc*bc<=1e-12*b*c;
}

// Share draw submissions for identical opaque parts. Source scene objects remain
// intact for walking, doors, dialogue, seats, collision and save logic.
export function createSceneInstances(scene){
 const candidates=new Map(),batches=[],sphere=new THREE.Sphere(),frustum=new THREE.Frustum(),projection=new THREE.Matrix4(),inverse=new THREE.Matrix4(),matrix=new THREE.Matrix4();
 const hierarchyCache=new WeakMap();let frame=0;
 function hierarchy(o){if(!o)return 0;if(o===scene)return scene.visible?3:1;let state=hierarchyCache.get(o);if(state?.frame===frame)return state.flags;const parent=hierarchy(o.parent),flags=(parent&1)|((parent&2)&&o.visible?2:0);if(!state){state={};hierarchyCache.set(o,state);}state.frame=frame;state.flags=flags;return flags;}
 scene.updateMatrixWorld(true);
 scene.traverse(o=>{
  if(!o.isMesh||o.isInstancedMesh||o.isSkinnedMesh||o.morphTargetInfluences||o.castShadow||Array.isArray(o.material)||!o.geometry?.attributes.position||o.geometry.isInstancedBufferGeometry||o.material.isShaderMaterial||o.material.transparent||o.material.opacity!==1||o.layers.mask!==1||o.onBeforeRender!==THREE.Object3D.prototype.onBeforeRender||o.matrixWorld.determinant()<=0)return;
  const key=[o.geometry.uuid,o.material.uuid,o.layers.mask,o.renderOrder,o.castShadow,o.receiveShadow,o.userData.range??65,!!o.userData.panel].join(':');
  if(!candidates.has(key))candidates.set(key,[]);candidates.get(key).push(o);
 });
 for(const sources of candidates.values()){
  if(sources.length<3)continue;
  const first=sources[0],mesh=new THREE.InstancedMesh(first.geometry,first.material,sources.length);mesh.name='scene-shared-parts';mesh.frustumCulled=false;mesh.renderOrder=first.renderOrder;mesh.castShadow=first.castShadow;mesh.receiveShadow=first.receiveShadow;mesh.layers.mask=first.layers.mask;mesh.userData.range=first.userData.range??65;mesh.userData.panel=!!first.userData.panel;mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);mesh.count=0;scene.add(mesh);
  // Generated carrier transforms stay identity; all motion is in instance
  // matrices. Keep world updates enabled for a transformed scene parent.
  mesh.matrixAutoUpdate=false;
  if(!first.geometry.boundingSphere)first.geometry.computeBoundingSphere();
  const box=new THREE.Box3(),tempSphere=new THREE.Sphere();let canCull=true;
  const entries=sources.map(source=>{
   tempSphere.copy(source.geometry.boundingSphere).applyMatrix4(source.matrixWorld);
   const r=tempSphere.radius;
   box.expandByPoint(new THREE.Vector3(tempSphere.center.x-r,tempSphere.center.y-r,tempSphere.center.z-r));
   box.expandByPoint(new THREE.Vector3(tempSphere.center.x+r,tempSphere.center.y+r,tempSphere.center.z+r));
   if(!source.frustumCulled)canCull=false;
   let isDynamic=false;
   for(let p=source;p&&p!==scene;p=p.parent){
    if(p.userData?.appearance||p.userData?.actor){isDynamic=true;break;}
    const name=p.name||'';
    if(name.startsWith('city-car-')||name.startsWith('cruise-passenger-')||name.startsWith('nanjing-yuyuan-visitor-')){isDynamic=true;break;}
   }
   if(isDynamic)canCull=false;
   const isStatic=!isDynamic&&source.matrixAutoUpdate===false&&(!source.parent||source.parent===scene||source.parent.matrixAutoUpdate===false);
   const sphere=isStatic?tempSphere.clone():null;
   return {source,mask:source.layers.mask,sphere};
  });
  for(const e of entries)e.source.layers.mask=e.mask&~1;
  batches.push({mesh,entries,box,canCull});
 }
 function update(camera){
  frame++;
  projection.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);frustum.setFromProjectionMatrix(projection);inverse.copy(scene.matrixWorld).invert();
  for(const {mesh,entries,box,canCull}of batches){
   if(canCull&&!frustum.intersectsBox(box)){
    if(mesh.visible){mesh.visible=false;mesh.count=0;}
    for(const {source,mask}of entries){
     if(source.geometry!==mesh.geometry||source.material!==mesh.material||source.material.transparent||source.material.opacity!==1){
      source.layers.mask=mask;
     }
    }
    continue;
   }
   let count=0;
   for(const {source,mask,sphere:cachedSphere}of entries){
    const flags=hierarchy(source),attached=!!(flags&1),visible=!!(flags&2);
    if(attached&&!visible&&source.geometry===mesh.geometry&&source.material===mesh.material){source.layers.mask=mask&~1;continue;}
    // Fall back to its original draw path if another system replaces a part.
    if(!attached||source.geometry!==mesh.geometry||source.material!==mesh.material||source.material.transparent||source.material.opacity!==1){source.layers.mask=mask;continue;}
    source.layers.mask=mask&~1;
    if(!visible||!(mask&camera.layers.mask))continue;
    if(source.frustumCulled&&!frustum.intersectsSphere(cachedSphere??sphere.copy(source.geometry.boundingSphere).applyMatrix4(source.matrixWorld)))continue;
    // A culled source contributes no vertices on either draw path. Defer the
    // determinant/normal-transform check until it can actually be drawn.
    if(!supportedTransform(source.matrixWorld)){source.layers.mask=mask;continue;}
    mesh.setMatrixAt(count++,matrix.multiplyMatrices(inverse,source.matrixWorld));
   }
   mesh.count=count;mesh.visible=count>0;
   // Only the compact visible prefix is drawn. Keep the full allocation for
   // later views, but do not upload the unused tail every rendered frame.
   mesh.instanceMatrix.clearUpdateRanges();
   if(count){mesh.instanceMatrix.addUpdateRange(0,count*16);mesh.instanceMatrix.needsUpdate=true;}
  }
 }
 const before=scene.onBeforeRender,hook=function(renderer,renderScene,camera,...rest){before?.call(this,renderer,renderScene,camera,...rest);update(camera);};scene.onBeforeRender=hook;
 return {batches,update,dispose(){if(scene.onBeforeRender===hook)scene.onBeforeRender=before;for(const {mesh,entries}of batches){for(const e of entries)e.source.layers.mask=e.mask;mesh.removeFromParent();mesh.dispose();}}};
}
