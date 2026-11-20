import * as THREE from './three.module.js';

const PAGE_WIDTH=2048;
const PAGE_MAX_HEIGHT=1024;
const PAGE_HEIGHTS=[256,512,1024];

function align8(n){
 return (n+7)&~7;
}

function createSkylinePage(atlasW,atlasH,pad){
 const nodes=[{x:0,y:0,w:atlasW}];
 const placements=new Map();
 let maxUsedY=0;
 function tryInsert(item){
  const rw=align8(item.w+pad*2),rh=align8(item.h+pad*2);
  if(rw>atlasW||rh>atlasH)return false;
  let bestY=Infinity,bestX=Infinity,bestIdx=-1;
  for(let i=0;i<nodes.length;i++){
   const x=nodes[i].x;
   if(x+rw>atlasW)break;
   let y=nodes[i].y,widthLeft=rw,j=i;
   while(widthLeft>0){
    if(j>=nodes.length)return false;
    if(nodes[j].y>y)y=nodes[j].y;
    if(y+rh>atlasH){y=Infinity;break;}
    widthLeft-=nodes[j].w;
    j++;
   }
   if(y+rh<=atlasH&&(y<bestY||(y===bestY&&x<bestX))){
    bestY=y;bestX=x;bestIdx=i;
   }
  }
  if(bestIdx===-1)return false;
  nodes.splice(bestIdx,0,{x:bestX,y:bestY+rh,w:rw});
  for(let i=bestIdx+1;i<nodes.length;i++){
   const prev=nodes[i-1],cur=nodes[i];
   if(cur.x<prev.x+prev.w){
    const shrink=prev.x+prev.w-cur.x;
    cur.x+=shrink;
    cur.w-=shrink;
    if(cur.w<=0){nodes.splice(i,1);i--;}
    else break;
   }else break;
  }
  for(let i=0;i<nodes.length-1;i++){
   if(nodes[i].y===nodes[i+1].y){
    nodes[i].w+=nodes[i+1].w;
    nodes.splice(i+1,1);
    i--;
   }
  }
  if(bestY+rh>maxUsedY)maxUsedY=bestY+rh;
  placements.set(item.key,{dx:bestX+pad,dy:bestY+pad,w:item.w,h:item.h,slotX:bestX,slotY:bestY,slotW:rw,slotH:rh});
  return true;
 }
 return {
  tryInsert,
  finalize(){
   let finalH=PAGE_MAX_HEIGHT;
   for(const h of PAGE_HEIGHTS){if(h>=maxUsedY){finalH=h;break;}}
   const finalW=maxUsedY<=256&&[...placements.values()].every(s=>s.slotX+s.slotW<=512)?512
    :maxUsedY<=512&&[...placements.values()].every(s=>s.slotX+s.slotW<=1024)?1024:atlasW;
   return {atlasW:finalW,atlasH:finalH,placements};
  }
 };
}

export function packSignAtlasPages(items,pad=8){
 const pages=[],itemPage=new Map();
 for(let i=0;i<items.length;i++){
  const item=items[i];
  if(align8(item.w+pad*2)>PAGE_WIDTH||align8(item.h+pad*2)>PAGE_MAX_HEIGHT)return null;
  let placedPage=-1;
  for(let p=0;p<pages.length;p++){
   if(pages[p].tryInsert(item)){placedPage=p;break;}
  }
  if(placedPage===-1){
   const page=createSkylinePage(PAGE_WIDTH,PAGE_MAX_HEIGHT,pad);
   if(!page.tryInsert(item))return null;
   placedPage=pages.length;
   pages.push(page);
  }
  itemPage.set(item.key,placedPage);
 }
 return {pages:pages.map(p=>p.finalize()),itemPage};
}

function blitWithExtrude(ctx,img,dx,dy,w,h,pad){
 if(pad>0){
  // Stretch-fill the padded slot with a single draw call so outer border pixels
  // cover the guard band, then crisp-blit the exact 1:1 image over the interior.
  ctx.drawImage(img,dx-pad,dy-pad,w+pad*2,h+pad*2);
 }
 ctx.drawImage(img,dx,dy,w,h);
}

function defaultMakeCanvas(w,h){
 if(typeof document==='undefined'||typeof HTMLCanvasElement==='undefined')return null;
 const c=document.createElement('canvas');
 if(!(c instanceof HTMLCanvasElement))return null;
 c.width=w;c.height=h;
 const ctx=c.getContext('2d');
 if(typeof ctx?.drawImage!=='function')return null;
 return {canvas:c,ctx};
}

function validUnitPlaneUv(geo){
 const pos=geo?.attributes?.position,norm=geo?.attributes?.normal,uv=geo?.attributes?.uv;
 if(!pos||!norm||!uv)return false;
 for(let i=0;i<uv.count;i++){
  const u=uv.getX(i),v=uv.getY(i);
  if(u<-1e-5||u>1+1e-5||v<-1e-5||v>1+1e-5)return false;
 }
 return true;
}

function buildCellGeometry(records,atlasW,atlasH){
 let totalVerts=0,totalIndices=0;
 for(let i=0;i<records.length;i++){
  const g=records[i].mesh.geometry;
  const vc=g.attributes.position.count;
  totalVerts+=vc;
  totalIndices+=g.index?g.index.count:vc;
 }
 if(totalVerts===0||totalVerts>65535)return null;
 const positions=new Float32Array(totalVerts*3);
 const normals=new Float32Array(totalVerts*3);
 const uvs=new Float32Array(totalVerts*2);
 const indices=totalVerts>65535?new Uint32Array(totalIndices):new Uint16Array(totalIndices);
 const vTmp=new THREE.Vector3(),nTmp=new THREE.Vector3(),nMat=new THREE.Matrix3();
 let vOff=0,iOff=0;
 for(let r=0;r<records.length;r++){
  const {mesh,slot}=records[r],g=mesh.geometry,m=mesh.matrix;
  const pos=g.attributes.position,norm=g.attributes.normal,uv=g.attributes.uv,idx=g.index;
  const flipWinding=m.determinant()<0;
  nMat.getNormalMatrix(m);
  const vc=pos.count;
  for(let i=0;i<vc;i++){
   vTmp.fromBufferAttribute(pos,i).applyMatrix4(m);
   nTmp.fromBufferAttribute(norm,i).applyMatrix3(nMat).normalize();
   const p3=(vOff+i)*3,p2=(vOff+i)*2;
   positions[p3]=vTmp.x;positions[p3+1]=vTmp.y;positions[p3+2]=vTmp.z;
   normals[p3]=nTmp.x;normals[p3+1]=nTmp.y;normals[p3+2]=nTmp.z;
   const u0=Math.min(1,Math.max(0,uv.getX(i))),v0=Math.min(1,Math.max(0,uv.getY(i)));
   uvs[p2]=(slot.dx+u0*slot.w)/atlasW;
   uvs[p2+1]=1-(slot.dy+(1-v0)*slot.h)/atlasH;
  }
  if(idx){
   for(let i=0;i<idx.count;i+=3){
    indices[iOff++]=vOff+idx.getX(i);
    indices[iOff++]=vOff+idx.getX(flipWinding?i+2:i+1);
    indices[iOff++]=vOff+idx.getX(flipWinding?i+1:i+2);
   }
  }else{
   for(let i=0;i<vc;i+=3){
    indices[iOff++]=vOff+i;
    indices[iOff++]=vOff+(flipWinding?i+2:i+1);
    indices[iOff++]=vOff+(flipWinding?i+1:i+2);
   }
  }
  vOff+=vc;
 }
 const geo=new THREE.BufferGeometry();
 geo.setAttribute('position',new THREE.BufferAttribute(positions,3));
 geo.setAttribute('normal',new THREE.BufferAttribute(normals,3));
 geo.setAttribute('uv',new THREE.BufferAttribute(uvs,2));
 geo.setIndex(new THREE.BufferAttribute(indices,1));
 geo.computeBoundingBox();
 geo.computeBoundingSphere();
 return geo;
}

function configureAtlasTexture(canvas,anisotropy){
 const tex=new THREE.CanvasTexture(canvas);
 tex.colorSpace=THREE.SRGBColorSpace;
 tex.generateMipmaps=true;
 tex.minFilter=THREE.LinearMipmapLinearFilter;
 tex.magFilter=THREE.LinearFilter;
 tex.anisotropy=anisotropy;
 tex.userData.opaqueStreetArt=true;
 return tex;
}

// Non-intrusive atlas batcher for Nanjing Road day/night paired signs.
// Source sign meshes keep their parent, positions and day/night material writes
// while rendering is delegated to cell-partitioned static atlas meshes.
export function batchDualMaterialSigns(parent,signs,{cellSize=96,name='nanjing-sign-batch',pad=8,makeCanvas=defaultMakeCanvas}={}){
 if(!parent||!signs?.length)return null;
 const probe=makeCanvas(16,16);
 if(!probe)return null;
 const candidates=[];
 for(let i=0;i<signs.length;i++){
  const s=signs[i],mesh=s?.mesh,day=s?.day,night=s?.night;
  if(!mesh?.isMesh||mesh.parent!==parent||mesh.matrixAutoUpdate||!mesh.visible||mesh.layers.mask!==1)continue;
  if(!day?.isMeshLambertMaterial||!night?.isMeshBasicMaterial)continue;
  if(day.side!==THREE.DoubleSide||night.side!==THREE.DoubleSide)continue;
  if(!day.polygonOffset||day.polygonOffsetFactor!==-2||day.polygonOffsetUnits!==-4)continue;
  if(day.transparent||day.opacity!==1||night.transparent||night.opacity!==1)continue;
  const dayImg=day.map?.image,nightImg=night.map?.image;
  if(!dayImg?.width||!dayImg?.height||dayImg.width!==nightImg?.width||dayImg.height!==nightImg?.height)continue;
  if(!validUnitPlaneUv(mesh.geometry))continue;
  candidates.push({s,mesh,day,night,dayImg,nightImg});
 }
 if(candidates.length<4)return null;
 candidates.sort((a,b)=>(a.mesh.position.x-b.mesh.position.x)||(a.mesh.position.z-b.mesh.position.z));
 const pairMap=new Map(),uniqueItems=[],eligible=[];
 for(let i=0;i<candidates.length;i++){
  const {s,mesh,day,night,dayImg,nightImg}=candidates[i];
  let pairByNight=pairMap.get(day.map);
  if(!pairByNight){pairByNight=new Map();pairMap.set(day.map,pairByNight);}
  let key=pairByNight.get(night.map);
  if(key===undefined){
   key=uniqueItems.length;
   pairByNight.set(night.map,key);
   uniqueItems.push({key,dayImg,nightImg,w:dayImg.width,h:dayImg.height});
  }
  eligible.push({sign:s,mesh,origGeo:mesh.geometry,origMask:mesh.layers.mask,key});
 }
 const packed=packSignAtlasPages(uniqueItems,pad);
 if(!packed)return null;
 const anisotropy=eligible[0].sign.day.map.anisotropy||8;
 const matParams={side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-4};
 const pageResources=[];
 const itemsByPage=packed.pages.map(()=>[]);
 for(let i=0;i<uniqueItems.length;i++){
  const it=uniqueItems[i];
  itemsByPage[packed.itemPage.get(it.key)].push(it);
 }
 for(let pIdx=0;pIdx<packed.pages.length;pIdx++){
  const pg=packed.pages[pIdx];
  pageResources.push({pg,items:itemsByPage[pIdx],dayTexture:null,nightTexture:null,dayMaterial:null,nightMaterial:null});
 }
 function ensureVariant(wantNight){
  for(let pIdx=0;pIdx<pageResources.length;pIdx++){
   const r=pageResources[pIdx];
   if(wantNight?r.nightMaterial:r.dayMaterial)continue;
   const surface=makeCanvas(r.pg.atlasW,r.pg.atlasH);
   if(!surface)return false;
   for(const it of r.items){
    const slot=r.pg.placements.get(it.key);
    blitWithExtrude(surface.ctx,wantNight?it.nightImg:it.dayImg,slot.dx,slot.dy,it.w,it.h,pad);
   }
   const tex=configureAtlasTexture(surface.canvas,anisotropy);
   if(wantNight){
    r.nightTexture=tex;
    r.nightMaterial=new THREE.MeshBasicMaterial({...matParams,map:tex});
   }else{
    r.dayTexture=tex;
    r.dayMaterial=new THREE.MeshLambertMaterial({...matParams,map:tex});
   }
  }
  return true;
 }

 const cells=new Map();
 for(let i=0;i<eligible.length;i++){
  const e=eligible[i],p=e.mesh.position,pIdx=packed.itemPage.get(e.key);
  const ck=`${pIdx}:${Math.floor(p.x/cellSize)}:${Math.floor(p.z/cellSize)}`;
  let list=cells.get(ck);
  if(!list){list={pIdx,records:[]};cells.set(ck,list);}
  list.records.push({...e,slot:packed.pages[pIdx].placements.get(e.key)});
 }
 const meshes=[],batchedEntries=[];
 const initialNight=eligible[0].mesh.material===eligible[0].sign.night;
 if(!ensureVariant(initialNight))return null;
 for(const {pIdx,records} of cells.values()){
  const res=pageResources[pIdx];
  const geo=buildCellGeometry(records,res.pg.atlasW,res.pg.atlasH);
  if(!geo)continue;
  const batchMesh=new THREE.Mesh(geo,initialNight?res.nightMaterial:res.dayMaterial);
  batchMesh.name=name;
  batchMesh.userData.range=eligible[0].mesh.userData.range??240;
  batchMesh.userData.skipLightBake=true;
  batchMesh.userData.atlasPage=pIdx;
  batchMesh.matrixAutoUpdate=false;
  parent.add(batchMesh);
  meshes.push(batchMesh);
  for(let i=0;i<records.length;i++){
   const item=records[i];
   item.mesh.layers.mask=item.origMask&~1;
   batchedEntries.push(item);
  }
 }
 let currentNight=initialNight,fallenBack=false;
 function fallbackToSources(){
  if(fallenBack)return;
  fallenBack=true;
  for(let i=0;i<meshes.length;i++)meshes[i].visible=false;
  for(let i=0;i<batchedEntries.length;i++){
   const e=batchedEntries[i];
   e.mesh.layers.mask=e.origMask;
  }
 }
 function sync(){
  if(fallenBack||!batchedEntries.length)return;
  const first=batchedEntries[0];
  const wantNight=first.mesh.material===first.sign.night;
  for(let i=0;i<batchedEntries.length;i++){
   const e=batchedEntries[i],m=e.mesh;
   const expectedMat=wantNight?e.sign.night:e.sign.day;
   if(m.parent!==parent||!m.visible||m.matrixAutoUpdate||m.geometry!==e.origGeo||m.material!==expectedMat){
    fallbackToSources();
    return;
   }
  }
  if(wantNight!==currentNight){
   if(!ensureVariant(wantNight)){fallbackToSources();return;}
   currentNight=wantNight;
   for(let i=0;i<meshes.length;i++){
    const res=pageResources[meshes[i].userData.atlasPage];
    meshes[i].material=wantNight?res.nightMaterial:res.dayMaterial;
   }
  }
 }
 return {
  meshes,
  get dayTextures(){ensureVariant(false);return pageResources.map(r=>r.dayTexture);},
  get nightTextures(){ensureVariant(true);return pageResources.map(r=>r.nightTexture);},
  activeTextures(wantNight=currentNight){ensureVariant(wantNight);return pageResources.map(r=>wantNight?r.nightTexture:r.dayTexture);},
  pageSizes:pageResources.map(r=>[r.pg.atlasW,r.pg.atlasH]),
  batchedCount:batchedEntries.length,
  sync,
  dispose(){
   fallbackToSources();
   for(const m of meshes){m.removeFromParent();m.geometry.dispose();}
   for(const r of pageResources){
    r.dayTexture?.dispose();r.nightTexture?.dispose();
    r.dayMaterial?.dispose();r.nightMaterial?.dispose();
   }
  }
 };
}

// Non-intrusive atlas batcher for Yuyuan static DoubleSide shop plaques.
export function batchSingleMaterialSigns(parent,{cellSize=96,name='yuyuan-sign-batch',pad=8,wallTarget=false,makeCanvas=defaultMakeCanvas}={}){
 if(!parent)return null;
 const probe=makeCanvas(16,16);
 if(!probe)return null;
 const candidates=[];
 for(let i=0;i<parent.children.length;i++){
  const mesh=parent.children[i],mat=mesh?.material;
  if(!mesh?.isMesh||mesh.isInstancedMesh||mesh.matrixAutoUpdate||!mesh.visible||mesh.layers.mask!==1)continue;
  if(!mesh.userData.panel||!mat?.isMeshBasicMaterial||mat.side!==THREE.DoubleSide)continue;
  if(mat.transparent||mat.opacity!==1||mat.polygonOffset)continue;
  const img=mat.map?.image;
  if(!img?.width||!img?.height||!validUnitPlaneUv(mesh.geometry))continue;
  candidates.push({mesh,mat,img});
 }
 if(candidates.length<4)return null;
 candidates.sort((a,b)=>(a.mesh.position.x-b.mesh.position.x)||(a.mesh.position.z-b.mesh.position.z));
 const texMap=new Map(),uniqueItems=[],eligible=[];
 for(let i=0;i<candidates.length;i++){
  const {mesh,mat,img}=candidates[i];
  let key=texMap.get(mat.map);
  if(key===undefined){
   key=uniqueItems.length;
   texMap.set(mat.map,key);
   uniqueItems.push({key,img,w:img.width,h:img.height});
  }
  eligible.push({mesh,origGeo:mesh.geometry,origMat:mat,origMask:mesh.layers.mask,key});
 }
 const packed=packSignAtlasPages(uniqueItems,pad);
 if(!packed)return null;
 const anisotropy=eligible[0].origMat.map.anisotropy||4;
 const pageResources=[];
 const itemsByPage=packed.pages.map(()=>[]);
 for(let i=0;i<uniqueItems.length;i++){
  const it=uniqueItems[i];
  itemsByPage[packed.itemPage.get(it.key)].push(it);
 }
 for(let pIdx=0;pIdx<packed.pages.length;pIdx++){
  const pg=packed.pages[pIdx];
  const surface=makeCanvas(pg.atlasW,pg.atlasH);
  if(!surface)return null;
  for(const it of itemsByPage[pIdx]){
   const slot=pg.placements.get(it.key);
   blitWithExtrude(surface.ctx,it.img,slot.dx,slot.dy,it.w,it.h,pad);
  }
  const texture=configureAtlasTexture(surface.canvas,anisotropy);
  const material=new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide});
  pageResources.push({pg,texture,material});
 }

 const cells=new Map();
 for(let i=0;i<eligible.length;i++){
  const e=eligible[i],p=e.mesh.position,pIdx=packed.itemPage.get(e.key);
  const ck=`${pIdx}:${Math.floor(p.x/cellSize)}:${Math.floor(p.z/cellSize)}`;
  let list=cells.get(ck);
  if(!list){list={pIdx,records:[]};cells.set(ck,list);}
  list.records.push({...e,slot:packed.pages[pIdx].placements.get(e.key)});
 }
 const meshes=[],batchedEntries=[];
 for(const {pIdx,records} of cells.values()){
  const res=pageResources[pIdx];
  const geo=buildCellGeometry(records,res.pg.atlasW,res.pg.atlasH);
  if(!geo)continue;
  const batchMesh=new THREE.Mesh(geo,res.material);
  batchMesh.name=name;
  batchMesh.userData.skipLightBake=true;
  if(wallTarget)batchMesh.userData.yuyuanWallTarget=true;
  batchMesh.matrixAutoUpdate=false;
  parent.add(batchMesh);
  meshes.push(batchMesh);
  for(let i=0;i<records.length;i++){
   const item=records[i];
   item.mesh.layers.mask=item.origMask&~1;
   batchedEntries.push(item);
  }
 }
 parent.updateMatrixWorld(true);
 let fallenBack=false;
 function fallbackToSources(){
  if(fallenBack)return;
  fallenBack=true;
  for(let i=0;i<meshes.length;i++)meshes[i].visible=false;
  for(let i=0;i<batchedEntries.length;i++){
   const e=batchedEntries[i];
   e.mesh.layers.mask=e.origMask;
  }
 }
 function sync(){
  if(fallenBack||!batchedEntries.length)return;
  for(let i=0;i<batchedEntries.length;i++){
   const e=batchedEntries[i],m=e.mesh;
   if(m.parent!==parent||!m.visible||m.matrixAutoUpdate||m.geometry!==e.origGeo||m.material!==e.origMat){
    fallbackToSources();
    return;
   }
  }
 }
 return {
  meshes,
  textures:pageResources.map(r=>r.texture),
  pageSizes:pageResources.map(r=>[r.pg.atlasW,r.pg.atlasH]),
  batchedCount:batchedEntries.length,
  sync,
  dispose(){
   fallbackToSources();
   for(const m of meshes){m.removeFromParent();m.geometry.dispose();}
   for(const r of pageResources){r.texture.dispose();r.material.dispose();}
  }
 };
}

// World-space atlas batcher for static surface metro entrance signs & bus stop plates.
export function batchWorldStaticPanels(parent,roots,{cellSize=128,name='surface-panel-batch',pad=8,makeCanvas=defaultMakeCanvas}={}){
 if(!parent||!roots?.length)return null;
 const probe=makeCanvas(16,16);
 if(!probe)return null;
 parent.updateMatrixWorld(true);
 const candidates=[];
 for(const root of roots){
  if(!root)continue;
  root.traverse(mesh=>{
   if(!mesh?.isMesh||mesh.isInstancedMesh||!mesh.visible||mesh.layers.mask!==1||!mesh.userData.panel)return;
   for(let p=mesh;p&&p!==parent;p=p.parent){
    if(!p.visible||p.matrixAutoUpdate||p.name==='occluded-metro-interior'||p.userData?.skipHiddenMatrices)return;
    if(p.userData?.stationSign||p.userData?.exitSign)return;
   }
   const mat=mesh.material;
   if(!mat?.isMeshBasicMaterial||mat.side!==THREE.FrontSide||mat.transparent||mat.opacity!==1||mat.polygonOffset)return;
   const img=mat.map?.image;
   if(!img?.width||!img?.height||img.width>1024||img.height>1024||!validUnitPlaneUv(mesh.geometry))return;
   if(mesh.matrixWorld.elements[13]<24.5)return;
   candidates.push({mesh,mat,img});
  });
 }
 if(candidates.length<4)return null;
 candidates.sort((a,b)=>(a.mesh.matrixWorld.elements[12]-b.mesh.matrixWorld.elements[12])||(a.mesh.matrixWorld.elements[14]-b.mesh.matrixWorld.elements[14]));
 const texMap=new Map(),uniqueItems=[],eligible=[];
 for(let i=0;i<candidates.length;i++){
  const {mesh,mat,img}=candidates[i];
  let key=texMap.get(mat.map);
  if(key===undefined){
   key=uniqueItems.length;
   texMap.set(mat.map,key);
   uniqueItems.push({key,img,w:img.width,h:img.height});
  }
  eligible.push({mesh,origGeo:mesh.geometry,origMat:mat,origMask:mesh.layers.mask,key});
 }
 const packed=packSignAtlasPages(uniqueItems,pad);
 if(!packed)return null;
 const pageResources=[];
 const itemsByPage=packed.pages.map(()=>[]);
 for(let i=0;i<uniqueItems.length;i++){
  const it=uniqueItems[i];
  itemsByPage[packed.itemPage.get(it.key)].push(it);
 }
 for(let pIdx=0;pIdx<packed.pages.length;pIdx++){
  const pg=packed.pages[pIdx];
  const surface=makeCanvas(pg.atlasW,pg.atlasH);
  if(!surface)return null;
  for(const it of itemsByPage[pIdx]){
   const slot=pg.placements.get(it.key);
   blitWithExtrude(surface.ctx,it.img,slot.dx,slot.dy,it.w,it.h,pad);
  }
  const texture=configureAtlasTexture(surface.canvas,8);
  const material=new THREE.MeshBasicMaterial({map:texture});
  pageResources.push({pg,texture,material});
 }
 const cells=new Map();
 for(let i=0;i<eligible.length;i++){
  const e=eligible[i],mw=e.mesh.matrixWorld.elements,pIdx=packed.itemPage.get(e.key);
  const ck=`${pIdx}:${Math.floor(mw[12]/cellSize)}:${Math.floor(mw[14]/cellSize)}`;
  let list=cells.get(ck);
  if(!list){list={pIdx,records:[]};cells.set(ck,list);}
  const proxy={geometry:e.mesh.geometry,matrix:e.mesh.matrixWorld};
  list.records.push({...e,sourceMesh:e.mesh,mesh:proxy,slot:packed.pages[pIdx].placements.get(e.key)});
 }
 const meshes=[],batchedEntries=[];
 for(const {pIdx,records} of cells.values()){
  const res=pageResources[pIdx];
  const geo=buildCellGeometry(records,res.pg.atlasW,res.pg.atlasH);
  if(!geo)continue;
  const batchMesh=new THREE.Mesh(geo,res.material);
  batchMesh.name=name;
  batchMesh.userData.range=180;
  batchMesh.userData.skipLightBake=true;
  batchMesh.matrixAutoUpdate=false;
  parent.add(batchMesh);
  meshes.push(batchMesh);
  for(let i=0;i<records.length;i++){
   const item=records[i];
   item.sourceMesh.layers.mask=item.origMask&~1;
   batchedEntries.push(item);
  }
 }
 let fallenBack=false;
 function fallbackToSources(){
  if(fallenBack)return;
  fallenBack=true;
  for(let i=0;i<meshes.length;i++)meshes[i].visible=false;
  for(let i=0;i<batchedEntries.length;i++)batchedEntries[i].sourceMesh.layers.mask=batchedEntries[i].origMask;
 }
 function sync(){
  if(fallenBack||!batchedEntries.length)return;
  for(let i=0;i<batchedEntries.length;i++){
   const e=batchedEntries[i],m=e.sourceMesh;
   if(!m.visible||m.geometry!==e.origGeo||m.material!==e.origMat){fallbackToSources();return;}
  }
 }
 return {meshes,textures:pageResources.map(r=>r.texture),batchedCount:batchedEntries.length,sync,dispose(){fallbackToSources();for(const m of meshes){m.removeFromParent();m.geometry.dispose();}for(const r of pageResources){r.texture.dispose();r.material.dispose();}}};
}
