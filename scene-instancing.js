import * as THREE from './three.module.js';

// Three's instance normal transform supports rotation and scale, but not shear.
export function supportedTransform(m){
 const e=m.elements,a=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],b=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],c=e[8]*e[8]+e[9]*e[9]+e[10]*e[10],ab=e[0]*e[4]+e[1]*e[5]+e[2]*e[6],ac=e[0]*e[8]+e[1]*e[9]+e[2]*e[10],bc=e[4]*e[8]+e[5]*e[9]+e[6]*e[10];
 return m.determinant()>=0&&ab*ab<=1e-12*a*b&&ac*ac<=1e-12*a*c&&bc*bc<=1e-12*b*c;
}

function isUnitBox(geo){
 const p=geo.parameters;
 return geo.type==='BoxGeometry'&&p&&p.width===1&&p.height===1&&p.depth===1&&(p.widthSegments??1)===1&&(p.heightSegments??1)===1&&(p.depthSegments??1)===1;
}

function isPlainSolidMaterial(mat){
 if(!mat||(!mat.isMeshLambertMaterial&&!mat.isMeshBasicMaterial))return false;
 if(mat.transparent||mat.opacity!==1||mat.map||mat.alphaMap||mat.envMap||mat.lightMap||mat.aoMap||mat.emissiveMap||mat.vertexColors)return false;
 if(mat.clippingPlanes?.length||!mat.colorWrite||!mat.depthWrite||!mat.depthTest||mat.polygonOffset||mat.wireframe)return false;
 if(mat.onBeforeCompile!==THREE.Material.prototype.onBeforeCompile||mat.customProgramCacheKey!==THREE.Material.prototype.customProgramCacheKey)return false;
 if(mat.isMeshLambertMaterial&&mat.emissive&&mat.emissive.getHex()!==0)return false;
 return true;
}

function isStaticChain(o,scene){
 if(o.userData?.dynamicColor)return false;
 for(let p=o;p&&p!==scene;p=p.parent)if(p.matrixAutoUpdate)return false;
 return true;
}

function fastSkipOwner(o,scene){
 for(let p=o.parent;p&&p!==scene;p=p.parent){
  if(p.userData?.sealedHiddenInstances||p.userData?.skipHiddenMatrices||p.name==='occluded-metro-interior'||p.name==='drone-show'||p.name==='lujiazui-searchlight-beams'||p.name==='choreographed-harbour-fireworks'||p.name==='yuyuan-eaves-and-window-light')return p;
 }
 return null;
}

let globalFrame=0;

// Share draw submissions for identical opaque parts. Source scene objects remain
// intact for walking, doors, dialogue, seats, collision and save logic.
export function createSceneInstances(scene,{mergeSolidColors=false,staticMaxDist=Infinity,highStaticMaxDist=staticMaxDist,highDynamicMaxDist=Infinity}={}){
 const candidates=new Map(),batches=[],frustum=new THREE.Frustum(),projection=new THREE.Matrix4(),inverse=new THREE.Matrix4(),matrix=new THREE.Matrix4(),cellBox=new THREE.Box3(),tmpBox=new THREE.Box3();
 let frame=0,lastCamObj=null,lastCamX=NaN,lastCamY=NaN,lastCamZ=NaN,lastCamFar=NaN,lastWe0=NaN,lastWe2=NaN,lastWe5=NaN,lastWe8=NaN,lastWe10=NaN,lastPe0=NaN,lastPe5=NaN,lastPe10=NaN;
 function hierarchy(o){
  if(!o)return 0;
  if(o===scene)return scene.visible?3:1;
  if(o._siFrame===frame)return o._siFlags;
  const parent=hierarchy(o.parent),flags=(parent&1)|((parent&2)&&o.visible?2:0);
  o._siFrame=frame;o._siFlags=flags;
  return flags;
 }
 scene.updateMatrixWorld(true);
 scene.traverse(o=>{
  if(!o.isMesh||o.isInstancedMesh||o.isSkinnedMesh||o.morphTargetInfluences||o.castShadow||Array.isArray(o.material)||!o.geometry?.attributes.position||o.geometry.isInstancedBufferGeometry||o.material.isShaderMaterial||o.material.transparent||o.material.opacity!==1||o.layers.mask!==1||o.onBeforeRender!==THREE.Object3D.prototype.onBeforeRender||o.matrixWorld.determinant()<=0)return;
  let key;
  if(mergeSolidColors&&!o.geometry.attributes.color&&isPlainSolidMaterial(o.material)){
   const geoKey=isUnitBox(o.geometry)?'unit-box':o.geometry.uuid;
   const sc=isStaticChain(o,scene)?'S':'D';
   const cellSuffix=sc==='S'?(':'+Math.floor(o.matrixWorld.elements[12]/128)+':'+Math.floor(o.matrixWorld.elements[14]/128)):'';
   key=['pal',geoKey,o.material.type,o.material.side,!!o.material.flatShading,!!o.material.fog,o.material.blending,o.material.toneMapped?1:0,o.layers.mask,o.renderOrder,o.castShadow,o.receiveShadow,!!o.userData.panel,sc].join(':')+cellSuffix;
  }else if(mergeSolidColors){
   const geoKey=isUnitBox(o.geometry)?'unit-box':o.geometry.uuid;
   const sc=isStaticChain(o,scene)?'S':'D';
   const cellSuffix=sc==='S'?(':'+Math.floor(o.matrixWorld.elements[12]/128)+':'+Math.floor(o.matrixWorld.elements[14]/128)):'';
   key=[geoKey,o.material.uuid,o.layers.mask,o.renderOrder,o.castShadow,o.receiveShadow,!!o.userData.panel,sc].join(':')+cellSuffix;
  }else{
   key=[o.geometry.uuid,o.material.uuid,o.layers.mask,o.renderOrder,o.castShadow,o.receiveShadow,o.userData.range??65,!!o.userData.panel].join(':');
  }
  if(!candidates.has(key))candidates.set(key,[]);candidates.get(key).push(o);
 });
 for(const sources of candidates.values()){
  if(sources.length<3)continue;
  const first=sources[0];
  const firstUnitBox=isUnitBox(first.geometry);
  let sameGeoMat=true;
  if(mergeSolidColors){
   for(let i=1;i<sources.length;i++){
    const gMatch=sources[i].geometry===first.geometry||(firstUnitBox&&isUnitBox(sources[i].geometry));
    if(!gMatch||sources[i].material!==first.material){sameGeoMat=false;break;}
   }
  }
  let batchMat=first.material,paletteMat=null,useColor=false;
  if(!sameGeoMat){
   useColor=true;
   const m=first.material;
   paletteMat=m.isMeshBasicMaterial
    ?new THREE.MeshBasicMaterial({color:'#ffffff',side:m.side,fog:m.fog,blending:m.blending,toneMapped:m.toneMapped})
    :new THREE.MeshLambertMaterial({color:'#ffffff',side:m.side,flatShading:m.flatShading,fog:m.fog,blending:m.blending,toneMapped:m.toneMapped});
   batchMat=paletteMat;
  }
  const isStaticBatch=mergeSolidColors&&isStaticChain(first,scene);
  const mesh=new THREE.InstancedMesh(first.geometry,batchMat,sources.length);mesh.name='scene-shared-parts';mesh.frustumCulled=false;mesh.renderOrder=first.renderOrder;mesh.castShadow=first.castShadow;mesh.receiveShadow=first.receiveShadow;mesh.layers.mask=first.layers.mask;mesh.userData.range=first.userData.range??65;mesh.userData.panel=!!first.userData.panel;mesh.instanceMatrix.setUsage(isStaticBatch?THREE.StaticDrawUsage:THREE.DynamicDrawUsage);mesh.count=0;
  if(useColor){
   mesh.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(sources.length*3),3);
   mesh.instanceColor.setUsage(isStaticBatch?THREE.StaticDrawUsage:THREE.DynamicDrawUsage);
  }
  scene.add(mesh);
  // Generated carrier transforms stay identity; all motion is in instance
  // matrices. Keep world updates enabled for a transformed scene parent.
  mesh.matrixAutoUpdate=false;
  if(!first.geometry.boundingSphere)first.geometry.computeBoundingSphere();
  if(!first.geometry.boundingBox)first.geometry.computeBoundingBox();
  const entries=sources.map(source=>({source,mask:source.layers.mask,origGeo:source.geometry,origMat:source.material,cachedParent:null,cachedVis:false,cachedFlags:0,cr:0,cg:0,cb:0,m0:0,m1:0,m2:0,m4:0,m5:0,m6:0,m8:0,m9:0,m10:0,m12:0,m13:0,m14:0}));for(const e of entries)e.source.layers.mask=e.mask&~1;
  let ownerRuns=null;
  if(!isStaticBatch){
   ownerRuns=[];
   for(let i=0;i<sources.length;i++){
    const s=sources[i],fs=fastSkipOwner(s,scene),owner=fs||s.parent||scene,last=ownerRuns[ownerRuns.length-1];
    if(last&&last.owner===owner)last.end=i+1;
    else ownerRuns.push({owner,start:i,end:i+1,fastSkip:!!fs,sealed:!!owner.userData?.sealedHiddenInstances,hiddenSynced:false,rigid:false,rcx:0,rcy:0,rcz:0,rr:0});
   }
   const invOwner=new THREE.Matrix4(),relMat=new THREE.Matrix4(),centers=[];
   const gbs=first.geometry.boundingSphere,gbx=gbs.center.x,gby=gbs.center.y,gbz=gbs.center.z,gbr=gbs.radius;
   for(let r=0;r<ownerRuns.length;r++){
    const run=ownerRuns[r],{owner,start,end}=run;
    if(owner===scene||end-start<2||owner.matrixWorld.determinant()===0)continue;
    let rigid=true;
    for(let i=start;i<end&&rigid;i++){
     const s=entries[i].source;
     if(!s.frustumCulled)rigid=false;
     for(let p=s;p&&p!==owner;p=p.parent)if(p.matrixAutoUpdate){rigid=false;break;}
    }
    if(!rigid)continue;
    invOwner.copy(owner.matrixWorld).invert();
    centers.length=0;
    let cxSum=0,cySum=0,czSum=0;
    for(let i=start;i<end;i++){
     const e=entries[i],s=e.source;
     e.cachedParent=s.parent;
     relMat.multiplyMatrices(invOwner,s.matrixWorld);
     const re=relMat.elements;
     const lx=re[0]*gbx+re[4]*gby+re[8]*gbz+re[12];
     const ly=re[1]*gbx+re[5]*gby+re[9]*gbz+re[13];
     const lz=re[2]*gbx+re[6]*gby+re[10]*gbz+re[14];
     const sx2=re[0]*re[0]+re[1]*re[1]+re[2]*re[2],sy2=re[4]*re[4]+re[5]*re[5]+re[6]*re[6],sz2=re[8]*re[8]+re[9]*re[9]+re[10]*re[10];
     const lr=gbr*Math.sqrt(sx2>=sy2?(sx2>=sz2?sx2:sz2):(sy2>=sz2?sy2:sz2));
     centers.push(lx,ly,lz,lr);
     cxSum+=lx;cySum+=ly;czSum+=lz;
    }
    const cnt=end-start,rcx=cxSum/cnt,rcy=cySum/cnt,rcz=czSum/cnt;
    let rr=0;
    for(let k=0;k<centers.length;k+=4){
     const d=Math.hypot(centers[k]-rcx,centers[k+1]-rcy,centers[k+2]-rcz)+centers[k+3];
     if(d>rr)rr=d;
    }
    if(rr>0&&rr<=20){
     run.rigid=true;run.rcx=rcx;run.rcy=rcy;run.rcz=rcz;run.rr=rr+1e-4;
    }
   }
  }
  const batch={mesh,entries,ownerRuns,useColor,paletteMat,isStatic:isStaticBatch,staticReady:false,fastOwners:null,staticCount:0,hasUnculled:false,cellSphere:new THREE.Sphere(),cellBox:new THREE.Box3(),uploaded:false,gpuSyncedCount:0,dirtyCount:0,pendingUploadCount:0,gpuSyncedColorCount:0,dirtyColorCount:0,pendingColorUploadCount:0};
  const syncUploaded=()=>{
   if(batch.pendingUploadCount>0){
    if(batch.pendingUploadCount>=batch.dirtyCount){batch.gpuSyncedCount=Math.max(batch.gpuSyncedCount,batch.pendingUploadCount);batch.dirtyCount=0;}
    else{batch.gpuSyncedCount=batch.pendingUploadCount;batch.dirtyCount=0;}
    batch.pendingUploadCount=0;
   }else{
    batch.gpuSyncedCount=entries.length;batch.dirtyCount=0;
   }
  };
  mesh.instanceMatrix.onUpload(()=>{syncUploaded();mesh.instanceMatrix.clearUpdateRanges();});
  if(useColor){
   const syncColorUploaded=()=>{
    if(batch.pendingColorUploadCount>0){
     if(batch.pendingColorUploadCount>=batch.dirtyColorCount){batch.gpuSyncedColorCount=Math.max(batch.gpuSyncedColorCount,batch.pendingColorUploadCount);batch.dirtyColorCount=0;}
     else{batch.gpuSyncedColorCount=batch.pendingColorUploadCount;batch.dirtyColorCount=0;}
     batch.pendingColorUploadCount=0;
    }else{
     batch.gpuSyncedColorCount=entries.length;batch.dirtyColorCount=0;
    }
   };
   mesh.instanceColor.onUpload(()=>{syncColorUploaded();mesh.instanceColor.clearUpdateRanges();});
  }
  batches.push(batch);
 }
 function update(camera){
  frame=++globalFrame;
  const ce=camera.matrixWorld.elements,camX=ce[12],camY=ce[13],camZ=ce[14],camFar=camera.far||270,staticFar=Math.min(camFar,camY>=38?highStaticMaxDist:staticMaxDist),staticFarSq=staticFar*staticFar,dynFar=camY>=40?Math.min(camFar,highDynamicMaxDist):Infinity;
  const pe=camera.projectionMatrix.elements,we=camera.matrixWorldInverse.elements;
  const camMoved=camera!==lastCamObj||Math.abs(camX-lastCamX)>1e-5||Math.abs(camY-lastCamY)>1e-5||Math.abs(camZ-lastCamZ)>1e-5||Math.abs(camFar-lastCamFar)>1e-3||Math.abs(we[0]-lastWe0)>1e-5||Math.abs(we[2]-lastWe2)>1e-5||Math.abs(we[5]-lastWe5)>1e-5||Math.abs(we[8]-lastWe8)>1e-5||Math.abs(we[10]-lastWe10)>1e-5||Math.abs(pe[0]-lastPe0)>1e-5||Math.abs(pe[5]-lastPe5)>1e-5||Math.abs(pe[10]-lastPe10)>1e-5;
  if(camMoved){lastCamObj=camera;lastCamX=camX;lastCamY=camY;lastCamZ=camZ;lastCamFar=camFar;lastWe0=we[0];lastWe2=we[2];lastWe5=we[5];lastWe8=we[8];lastWe10=we[10];lastPe0=pe[0];lastPe5=pe[5];lastPe10=pe[10];}
  projection.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);frustum.setFromProjectionMatrix(projection);
  const planes=frustum.planes,p0=planes[0],p1=planes[1],p2=planes[2],p3=planes[3],p4=planes[4],p5=planes[5];
  const p0n=p0.normal,p1n=p1.normal,p2n=p2.normal,p3n=p3.normal,p4n=p4.normal,p5n=p5.normal;
  const p0nx=p0n.x,p0ny=p0n.y,p0nz=p0n.z,p0c=p0.constant,p1nx=p1n.x,p1ny=p1n.y,p1nz=p1n.z,p1c=p1.constant;
  const p2nx=p2n.x,p2ny=p2n.y,p2nz=p2n.z,p2c=p2.constant,p3nx=p3n.x,p3ny=p3n.y,p3nz=p3n.z,p3c=p3.constant;
  const p4nx=p4n.x,p4ny=p4n.y,p4nz=p4n.z,p4c=p4.constant,p5nx=p5n.x,p5ny=p5n.y,p5nz=p5n.z,p5c=p5.constant;
  const se=scene.matrixWorld.elements;
  const sceneIdentity=se[0]===1&&se[5]===1&&se[10]===1&&se[15]===1&&se[1]===0&&se[2]===0&&se[3]===0&&se[4]===0&&se[6]===0&&se[7]===0&&se[8]===0&&se[9]===0&&se[11]===0&&se[12]===0&&se[13]===0&&se[14]===0;
  if(!sceneIdentity)inverse.copy(scene.matrixWorld).invert();
  const camMask=camera.layers.mask,sceneVis=scene.visible?3:1;
  for(let b=0;b<batches.length;b++){
   const batch=batches[b],{mesh,entries,useColor}=batch,attr=mesh.instanceMatrix,arr=attr.array;
   const colorAttr=useColor?mesh.instanceColor:null,cArr=colorAttr?colorAttr.array:null;
   const bs=mesh.geometry.boundingSphere,bscx=bs.center.x,bscy=bs.center.y,bscz=bs.center.z,bsr=bs.radius,centerZero=bscx===0&&bscy===0&&bscz===0;
   const geoBox=mesh.geometry.boundingBox;
   const initialPopulate=!batch.uploaded;
   if(batch.pendingUploadCount>0&&attr.updateRanges.length===0){
    if(batch.pendingUploadCount>=batch.dirtyCount){batch.gpuSyncedCount=Math.max(batch.gpuSyncedCount,batch.pendingUploadCount);batch.dirtyCount=0;}
    else{batch.gpuSyncedCount=batch.pendingUploadCount;batch.dirtyCount=0;}
    batch.pendingUploadCount=0;
   }
   if(useColor&&batch.pendingColorUploadCount>0&&colorAttr.updateRanges.length===0){
    if(batch.pendingColorUploadCount>=batch.dirtyColorCount){batch.gpuSyncedColorCount=Math.max(batch.gpuSyncedColorCount,batch.pendingColorUploadCount);batch.dirtyColorCount=0;}
    else{batch.gpuSyncedColorCount=batch.pendingColorUploadCount;batch.dirtyColorCount=0;}
    batch.pendingColorUploadCount=0;
   }
   if(batch.isStatic){
    if(!sceneIdentity){batch.staticReady=false;batch.fastOwners=null;}
    if(batch.staticReady&&(entries[0].mask&camMask)){
     let valid=true;
     if(batch.fastOwners){
      const fos=batch.fastOwners;
      for(let r=0;r<fos.length;r++){
       const fo=fos[r],o=fo.owner;
       const flags=o===scene?sceneVis:o.parent===scene?((sceneVis&1)|((sceneVis&2)&&o.visible?2:0)):o._siFrame===frame?o._siFlags:hierarchy(o);
       if(flags!==fo.flags){valid=false;break;}
      }
     }else{
      let prevParent=null,prevFlags=0;
      for(let i=0;i<entries.length;i++){
       const entry=entries[i],s=entry.source,p=s.parent;
       const e=s.matrixWorld.elements;
       if(s.frustumCulled!==entry.cachedFrustumCulled){valid=false;break;}
       if(p!==entry.cachedParent||s.visible!==entry.cachedVis||s.matrixAutoUpdate||s.geometry!==entry.origGeo||s.material!==entry.origMat||e[0]!==entry.m0||e[1]!==entry.m1||e[2]!==entry.m2||e[4]!==entry.m4||e[5]!==entry.m5||e[6]!==entry.m6||e[8]!==entry.m8||e[9]!==entry.m9||e[10]!==entry.m10||e[12]!==entry.m12||e[13]!==entry.m13||e[14]!==entry.m14){valid=false;break;}
       if(useColor){const c=entry.origMat.color;if(c.r!==entry.cr||c.g!==entry.cg||c.b!==entry.cb){valid=false;break;}}
       let flags;
       if(p===prevParent)flags=prevFlags;
       else{
        flags=!p?0:p===scene?sceneVis:p.parent===scene?((sceneVis&1)|((sceneVis&2)&&p.visible?2:0)):p._siFrame===frame?p._siFlags:hierarchy(p);
        prevParent=p;prevFlags=flags;
       }
       if(flags!==entry.cachedFlags){valid=false;break;}
      }
     }
     if(valid){
      let inView;
      if(batch.staticCount<=0)inView=false;
      else if(batch.hasUnculled)inView=true;
      else if(!camMoved&&batch.cachedInView!==undefined)inView=batch.cachedInView;
      else{
       const cb=batch.cellBox,dx=Math.max(cb.min.x-camX,0,camX-cb.max.x),dy=Math.max(cb.min.y-camY,0,camY-cb.max.y),dz=Math.max(cb.min.z-camZ,0,camZ-cb.max.z);
       inView=(dx*dx+dy*dy+dz*dz<=staticFarSq)&&frustum.intersectsBox(cb);
      }
      batch.cachedInView=inView;
      mesh.count=batch.staticCount;mesh.visible=inView;
      continue;
     }
    }
    let count=0,dirty=batch.dirtyCount>0,colorDirty=useColor&&batch.dirtyColorCount>0,hasUnculled=false;
    cellBox.makeEmpty();
    for(let i=0;i<entries.length;i++){
     const entry=entries[i],{source,mask,origGeo,origMat}=entry,parent=source.parent;
     let flags;
     if(!parent)flags=0;
     else if(parent===scene)flags=sceneVis;
     else if(parent.parent===scene)flags=(sceneVis&1)|((sceneVis&2)&&parent.visible?2:0);
     else flags=parent._siFrame===frame?parent._siFlags:hierarchy(parent);
     const se2=source.matrixWorld.elements;
     entry.cachedParent=parent;entry.cachedVis=source.visible;entry.cachedFlags=flags;
     entry.cachedFrustumCulled=source.frustumCulled;
     entry.m0=se2[0];entry.m1=se2[1];entry.m2=se2[2];entry.m4=se2[4];entry.m5=se2[5];entry.m6=se2[6];entry.m8=se2[8];entry.m9=se2[9];entry.m10=se2[10];entry.m12=se2[12];entry.m13=se2[13];entry.m14=se2[14];
     if(useColor){const col=origMat.color;entry.cr=col.r;entry.cg=col.g;entry.cb=col.b;}
     const attached=!!(flags&1),visible=!!(flags&2)&&source.visible;
     const matMatch=useColor
      ?(source.geometry===origGeo&&source.material===origMat&&!origMat.transparent&&origMat.opacity===1&&(!origMat.emissive||(origMat.emissive.r===0&&origMat.emissive.g===0&&origMat.emissive.b===0)))
      :(source.geometry===origGeo&&source.material===origMat&&!origMat.transparent&&origMat.opacity===1);
     if(attached&&!visible&&matMatch){source.layers.mask=mask&~1;continue;}
     if(!attached||!matMatch){source.layers.mask=mask;continue;}
     source.layers.mask=mask&~1;
     if(!visible||!(mask&camMask))continue;
     if(!supportedTransform(source.matrixWorld)){source.layers.mask=mask;continue;}
     if(!source.frustumCulled)hasUnculled=true;
     tmpBox.copy(geoBox).applyMatrix4(source.matrixWorld);
     cellBox.union(tmpBox);
     const e=source.matrixWorld.elements;
     const me=sceneIdentity?e:matrix.multiplyMatrices(inverse,source.matrixWorld).elements;
     const off=count*16,coff=count*3;count++;
     if(initialPopulate||dirty){
      arr[off]=me[0];arr[off+1]=me[1];arr[off+2]=me[2];arr[off+3]=me[3];
      arr[off+4]=me[4];arr[off+5]=me[5];arr[off+6]=me[6];arr[off+7]=me[7];
      arr[off+8]=me[8];arr[off+9]=me[9];arr[off+10]=me[10];arr[off+11]=me[11];
      arr[off+12]=me[12];arr[off+13]=me[13];arr[off+14]=me[14];arr[off+15]=me[15];
     }else{
      const m0=Math.fround(me[0]),m1=Math.fround(me[1]),m2=Math.fround(me[2]),m3=Math.fround(me[3]),
            m4=Math.fround(me[4]),m5=Math.fround(me[5]),m6=Math.fround(me[6]),m7=Math.fround(me[7]),
            m8=Math.fround(me[8]),m9=Math.fround(me[9]),m10=Math.fround(me[10]),m11=Math.fround(me[11]),
            m12=Math.fround(me[12]),m13=Math.fround(me[13]),m14=Math.fround(me[14]),m15=Math.fround(me[15]);
      if(arr[off]!==m0||arr[off+1]!==m1||arr[off+2]!==m2||arr[off+3]!==m3||arr[off+4]!==m4||arr[off+5]!==m5||arr[off+6]!==m6||arr[off+7]!==m7||arr[off+8]!==m8||arr[off+9]!==m9||arr[off+10]!==m10||arr[off+11]!==m11||arr[off+12]!==m12||arr[off+13]!==m13||arr[off+14]!==m14||arr[off+15]!==m15){
       dirty=true;
       arr[off]=m0;arr[off+1]=m1;arr[off+2]=m2;arr[off+3]=m3;arr[off+4]=m4;arr[off+5]=m5;arr[off+6]=m6;arr[off+7]=m7;arr[off+8]=m8;arr[off+9]=m9;arr[off+10]=m10;arr[off+11]=m11;arr[off+12]=m12;arr[off+13]=m13;arr[off+14]=m14;arr[off+15]=m15;
      }
     }
     if(useColor){
      const col=origMat.color;
      if(initialPopulate||colorDirty){cArr[coff]=col.r;cArr[coff+1]=col.g;cArr[coff+2]=col.b;}
      else{const cr=Math.fround(col.r),cg=Math.fround(col.g),cb=Math.fround(col.b);if(cArr[coff]!==cr||cArr[coff+1]!==cg||cArr[coff+2]!==cb){colorDirty=true;cArr[coff]=cr;cArr[coff+1]=cg;cArr[coff+2]=cb;}}
     }
    }
    if(!initialPopulate&&!dirty&&count>batch.gpuSyncedCount)dirty=true;
    if(useColor&&!initialPopulate&&!colorDirty&&count>batch.gpuSyncedColorCount)colorDirty=true;
    if(count>0){batch.cellBox.copy(cellBox);cellBox.getBoundingSphere(batch.cellSphere);}
    else{batch.cellBox.makeEmpty();batch.cellSphere.radius=-1;}
    batch.staticCount=count;batch.hasUnculled=hasUnculled;batch.staticReady=sceneIdentity;
    if(sceneIdentity&&entries.length>16){
     const seen=new Set(),fos=[];
     for(let i=0;i<entries.length;i++){
      const o=fastSkipOwner(entries[i].source,scene)||entries[i].source.parent||scene;
      if(seen.has(o))continue;
      seen.add(o);
      fos.push({owner:o,flags:hierarchy(o)});
     }
     batch.fastOwners=fos;
    }else batch.fastOwners=null;
    const cb=batch.cellBox,dx=Math.max(cb.min.x-camX,0,camX-cb.max.x),dy=Math.max(cb.min.y-camY,0,camY-cb.max.y),dz=Math.max(cb.min.z-camZ,0,camZ-cb.max.z);
    const inView=count>0&&(hasUnculled||((dx*dx+dy*dy+dz*dz<=staticFarSq)&&frustum.intersectsBox(cb)));
    batch.cachedInView=inView;
    mesh.count=count;mesh.visible=inView;
    attr.clearUpdateRanges();
    if(count>0&&initialPopulate){batch.uploaded=true;batch.gpuSyncedCount=entries.length;batch.dirtyCount=0;batch.pendingUploadCount=0;}
    else if(count>0&&dirty){batch.dirtyCount=Math.max(batch.dirtyCount,count);batch.pendingUploadCount=count;attr.addUpdateRange(0,count*16);attr.needsUpdate=true;}
    else if(count===0){batch.pendingUploadCount=0;}
    if(useColor){
     colorAttr.clearUpdateRanges();
     if(count>0&&initialPopulate){batch.gpuSyncedColorCount=entries.length;batch.dirtyColorCount=0;batch.pendingColorUploadCount=0;}
     else if(count>0&&colorDirty){batch.dirtyColorCount=Math.max(batch.dirtyColorCount,count);batch.pendingColorUploadCount=count;colorAttr.addUpdateRange(0,count*3);colorAttr.needsUpdate=true;}
     else if(count===0){batch.pendingColorUploadCount=0;}
    }
    continue;
   }
   let count=0,dirty=batch.dirtyCount>0,colorDirty=useColor&&batch.dirtyColorCount>0;
   const runs=batch.ownerRuns;
   for(let r=0;r<runs.length;r++){
    const run=runs[r],owner=run.owner;
    const ownerFlags=owner===scene?sceneVis:owner.parent===scene?((sceneVis&1)|((sceneVis&2)&&owner.visible?2:0)):owner._siFrame===frame?owner._siFlags:hierarchy(owner);
    const ownerHiddenAttached=(ownerFlags&3)===1;
    if(ownerHiddenAttached&&run.sealed&&run.hiddenSynced)continue;
    if(!ownerHiddenAttached)run.hiddenSynced=false;
    let runAllInside=false;
    if(run.rigid&&(ownerFlags&3)===3){
     let stillRigid=true;
     for(let i=run.start;i<run.end;i++){
      const e=entries[i],s=e.source,m=e.origMat;
      if(s.parent!==e.cachedParent||s.matrixAutoUpdate||!s.frustumCulled||s.geometry!==e.origGeo||s.material!==m||m.transparent||m.opacity!==1){stillRigid=false;break;}
      if(useColor&&m.emissive&&(m.emissive.r!==0||m.emissive.g!==0||m.emissive.b!==0)){stillRigid=false;break;}
     }
     if(!stillRigid){
      run.rigid=false;
     }else{
      const oe=owner.matrixWorld.elements;
      const wx=oe[0]*run.rcx+oe[4]*run.rcy+oe[8]*run.rcz+oe[12];
      const wy=oe[1]*run.rcx+oe[5]*run.rcy+oe[9]*run.rcz+oe[13];
      const wz=oe[2]*run.rcx+oe[6]*run.rcy+oe[10]*run.rcz+oe[14];
      const osx=oe[0]*oe[0]+oe[1]*oe[1]+oe[2]*oe[2],osy=oe[4]*oe[4]+oe[5]*oe[5]+oe[6]*oe[6],osz=oe[8]*oe[8]+oe[9]*oe[9]+oe[10]*oe[10];
      const wr=run.rr*Math.sqrt(osx>=osy?(osx>=osz?osx:osz):(osy>=osz?osy:osz));
      if(dynFar<Infinity){const ddx=wx-camX,ddy=wy-camY,ddz=wz-camZ,dMax=dynFar+wr;if(ddx*ddx+ddy*ddy+ddz*ddz>dMax*dMax){for(let i=run.start;i<run.end;i++){const e=entries[i];if(e.source.layers.mask!==(e.mask&~1))e.source.layers.mask=e.mask&~1;}continue;}}
      const d0=wx*p0nx+wy*p0ny+wz*p0nz+p0c;if(d0<-wr){for(let i=run.start;i<run.end;i++){const e=entries[i];if(e.source.layers.mask!==(e.mask&~1))e.source.layers.mask=e.mask&~1;}continue;}
      const d1=wx*p1nx+wy*p1ny+wz*p1nz+p1c;if(d1<-wr){for(let i=run.start;i<run.end;i++){const e=entries[i];if(e.source.layers.mask!==(e.mask&~1))e.source.layers.mask=e.mask&~1;}continue;}
      const d2=wx*p2nx+wy*p2ny+wz*p2nz+p2c;if(d2<-wr){for(let i=run.start;i<run.end;i++){const e=entries[i];if(e.source.layers.mask!==(e.mask&~1))e.source.layers.mask=e.mask&~1;}continue;}
      const d3=wx*p3nx+wy*p3ny+wz*p3nz+p3c;if(d3<-wr){for(let i=run.start;i<run.end;i++){const e=entries[i];if(e.source.layers.mask!==(e.mask&~1))e.source.layers.mask=e.mask&~1;}continue;}
      const d4=wx*p4nx+wy*p4ny+wz*p4nz+p4c;if(d4<-wr){for(let i=run.start;i<run.end;i++){const e=entries[i];if(e.source.layers.mask!==(e.mask&~1))e.source.layers.mask=e.mask&~1;}continue;}
      const d5=wx*p5nx+wy*p5ny+wz*p5nz+p5c;if(d5<-wr){for(let i=run.start;i<run.end;i++){const e=entries[i];if(e.source.layers.mask!==(e.mask&~1))e.source.layers.mask=e.mask&~1;}continue;}
      runAllInside=d0>=wr&&d1>=wr&&d2>=wr&&d3>=wr&&d4>=wr&&d5>=wr;
     }
    }
    // Unsealed or newly hidden runs still validate detachment, reparenting and
    // material/geometry replacements in the same frame.
    let allHiddenInRun=ownerHiddenAttached,prevParent=null,prevFlags=0;
    for(let i=run.start;i<run.end;i++){
     const entry=entries[i],{source,mask,origGeo,origMat}=entry;
     const parent=source.parent;
     let flags;
     if(parent===owner)flags=ownerFlags;
     else if(parent===prevParent)flags=prevFlags;
     else if(!parent)flags=0;
     else if(parent===scene)flags=sceneVis;
     else if(parent.parent===scene)flags=(sceneVis&1)|((sceneVis&2)&&parent.visible?2:0);
     else{flags=parent._siFrame===frame?parent._siFlags:hierarchy(parent);prevParent=parent;prevFlags=flags;}
     const attached=!!(flags&1),visible=!!(flags&2)&&source.visible;
     const matMatch=useColor
      ?(source.geometry===origGeo&&source.material===origMat&&!origMat.transparent&&origMat.opacity===1&&(!origMat.emissive||(origMat.emissive.r===0&&origMat.emissive.g===0&&origMat.emissive.b===0)))
      :(source.geometry===origGeo&&source.material===origMat&&!origMat.transparent&&origMat.opacity===1);
     if(attached&&!visible&&matMatch){if(source.layers.mask!==(mask&~1))source.layers.mask=mask&~1;continue;}
     allHiddenInRun=false;
     if(!attached||!matMatch){source.layers.mask=mask;continue;}
     source.layers.mask=mask&~1;
     if(!visible||!(mask&camMask))continue;
     const e=source.matrixWorld.elements;
     if(source.frustumCulled&&(!runAllInside||dynFar<Infinity)){
      const wx=centerZero?e[12]:(e[0]*bscx+e[4]*bscy+e[8]*bscz+e[12]),wy=centerZero?e[13]:(e[1]*bscx+e[5]*bscy+e[9]*bscz+e[13]),wz=centerZero?e[14]:(e[2]*bscx+e[6]*bscy+e[10]*bscz+e[14]);
      const sx2=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],sy2=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],sz2=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];
      const r=bsr*Math.sqrt(sx2>=sy2?(sx2>=sz2?sx2:sz2):(sy2>=sz2?sy2:sz2));
      if(dynFar<Infinity){const ddx=wx-camX,ddy=wy-camY,ddz=wz-camZ,dMax=dynFar+r;if(ddx*ddx+ddy*ddy+ddz*ddz>dMax*dMax)continue;}
      if(!runAllInside){
       const negR=-r;
       if(wx*p0nx+wy*p0ny+wz*p0nz+p0c<negR||wx*p1nx+wy*p1ny+wz*p1nz+p1c<negR||wx*p2nx+wy*p2ny+wz*p2nz+p2c<negR||wx*p3nx+wy*p3ny+wz*p3nz+p3c<negR||wx*p4nx+wy*p4ny+wz*p4nz+p4c<negR||wx*p5nx+wy*p5ny+wz*p5nz+p5c<negR)continue;
      }
     }
     if(!supportedTransform(source.matrixWorld)){source.layers.mask=mask;continue;}
     const me=sceneIdentity?e:matrix.multiplyMatrices(inverse,source.matrixWorld).elements;
     const off=count*16,coff=count*3;count++;
     if(initialPopulate||dirty){
      arr[off]=me[0];arr[off+1]=me[1];arr[off+2]=me[2];arr[off+3]=me[3];
      arr[off+4]=me[4];arr[off+5]=me[5];arr[off+6]=me[6];arr[off+7]=me[7];
      arr[off+8]=me[8];arr[off+9]=me[9];arr[off+10]=me[10];arr[off+11]=me[11];
      arr[off+12]=me[12];arr[off+13]=me[13];arr[off+14]=me[14];arr[off+15]=me[15];
     }else{
      const m0=Math.fround(me[0]),m1=Math.fround(me[1]),m2=Math.fround(me[2]),m3=Math.fround(me[3]),
            m4=Math.fround(me[4]),m5=Math.fround(me[5]),m6=Math.fround(me[6]),m7=Math.fround(me[7]),
            m8=Math.fround(me[8]),m9=Math.fround(me[9]),m10=Math.fround(me[10]),m11=Math.fround(me[11]),
            m12=Math.fround(me[12]),m13=Math.fround(me[13]),m14=Math.fround(me[14]),m15=Math.fround(me[15]);
      if(arr[off]!==m0||arr[off+1]!==m1||arr[off+2]!==m2||arr[off+3]!==m3||arr[off+4]!==m4||arr[off+5]!==m5||arr[off+6]!==m6||arr[off+7]!==m7||arr[off+8]!==m8||arr[off+9]!==m9||arr[off+10]!==m10||arr[off+11]!==m11||arr[off+12]!==m12||arr[off+13]!==m13||arr[off+14]!==m14||arr[off+15]!==m15){
       dirty=true;
       arr[off]=m0;arr[off+1]=m1;arr[off+2]=m2;arr[off+3]=m3;arr[off+4]=m4;arr[off+5]=m5;arr[off+6]=m6;arr[off+7]=m7;arr[off+8]=m8;arr[off+9]=m9;arr[off+10]=m10;arr[off+11]=m11;arr[off+12]=m12;arr[off+13]=m13;arr[off+14]=m14;arr[off+15]=m15;
      }
     }
     if(useColor){
      const col=origMat.color;
      if(initialPopulate||colorDirty){cArr[coff]=col.r;cArr[coff+1]=col.g;cArr[coff+2]=col.b;}
      else{const cr=Math.fround(col.r),cg=Math.fround(col.g),cb=Math.fround(col.b);if(cArr[coff]!==cr||cArr[coff+1]!==cg||cArr[coff+2]!==cb){colorDirty=true;cArr[coff]=cr;cArr[coff+1]=cg;cArr[coff+2]=cb;}}
     }
    }
    if(ownerHiddenAttached)run.hiddenSynced=allHiddenInRun;
   }
   if(!initialPopulate&&!dirty&&count>batch.gpuSyncedCount)dirty=true;
   if(useColor&&!initialPopulate&&!colorDirty&&count>batch.gpuSyncedColorCount)colorDirty=true;
   mesh.count=count;mesh.visible=count>0;
   attr.clearUpdateRanges();
   if(count>0&&initialPopulate){batch.uploaded=true;batch.gpuSyncedCount=entries.length;batch.dirtyCount=0;batch.pendingUploadCount=0;}
   else if(count>0&&dirty){batch.dirtyCount=Math.max(batch.dirtyCount,count);batch.pendingUploadCount=count;attr.addUpdateRange(0,count*16);attr.needsUpdate=true;}
   else if(count===0){batch.pendingUploadCount=0;}
   if(useColor){
    colorAttr.clearUpdateRanges();
    if(count>0&&initialPopulate){batch.gpuSyncedColorCount=entries.length;batch.dirtyColorCount=0;batch.pendingColorUploadCount=0;}
    else if(count>0&&colorDirty){batch.dirtyColorCount=Math.max(batch.dirtyColorCount,count);batch.pendingColorUploadCount=count;colorAttr.addUpdateRange(0,count*3);colorAttr.needsUpdate=true;}
    else if(count===0){batch.pendingColorUploadCount=0;}
   }
  }
 }
 const before=scene.onBeforeRender,hook=function(renderer,renderScene,camera,...rest){before?.call(this,renderer,renderScene,camera,...rest);update(camera);};scene.onBeforeRender=hook;
 return {batches,update,dispose(){if(scene.onBeforeRender===hook)scene.onBeforeRender=before;for(const {mesh,entries,paletteMat}of batches){for(const e of entries)e.source.layers.mask=e.mask;mesh.removeFromParent();mesh.dispose();paletteMat?.dispose();}}};
}
