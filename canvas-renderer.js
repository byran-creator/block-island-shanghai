import * as THREE from './three.module.js';
// A modest, real CPU fallback for devices with WebGL disabled. Same world and controls.
export class CanvasRenderer {
 constructor({canvas}){this.domElement=canvas;this.ctx=canvas.getContext('2d');this.isSoftware=true;this.ratio=1;this.v=new THREE.Vector3();this.pv=new THREE.Matrix4();this.mvp=new THREE.Matrix4();this.normal=new THREE.Vector3();this.direction=new THREE.Vector3();this.color=new THREE.Color();this.textureColors=new WeakMap();this.last=0;}
 setPixelRatio(){this.ratio=.7}
 setSize(w,h){this.width=w;this.height=h;this.domElement.width=Math.floor(w*this.ratio);this.domElement.height=Math.floor(h*this.ratio);}
 render(scene,camera){
  const now=performance.now();if(now-this.last<65)return;this.last=now;
  const ctx=this.ctx,w=this.domElement.width,h=this.domElement.height;ctx.fillStyle=scene.background.getStyle();if(scene.userData.skyGradient){const sky=scene.userData.skyGradient,g=ctx.createLinearGradient(0,0,0,h*.75);g.addColorStop(0,sky.zenith);g.addColorStop(1,sky.horizon);ctx.fillStyle=g;}ctx.fillRect(0,0,w,h);
  scene.updateMatrixWorld();camera.updateMatrixWorld();this.pv.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);camera.getWorldDirection(this.direction);
  const polygons=[],sprites=[];const point=this.v,color=this.color;
  scene.traverseVisible(obj=>{
   if(obj.isSprite){const p=new THREE.Vector3().setFromMatrixPosition(obj.matrixWorld),distance=p.distanceTo(camera.position);p.project(camera);if(p.z>0&&p.z<1&&distance<22)sprites.push({img:obj.material.map?.image,x:(p.x+1)*w/2,y:(1-p.y)*h/2,width:obj.scale.x*w/(distance*1.6),height:obj.scale.y*w/(distance*1.6),depth:distance});return;}
   if(!obj.isMesh||obj.userData.skyGradient||!obj.geometry.attributes.position)return;
   const geo=obj.geometry,pos=geo.attributes.position,norm=geo.attributes.normal,uv=geo.attributes.uv,colors=geo.attributes.color,ix=geo.index,mat=obj.material;
   if(Array.isArray(mat))return;this.mvp.multiplyMatrices(this.pv,obj.matrixWorld);
   let palette=null;if(mat.map?.image&&uv){palette=this.textureColors.get(mat.map);if(!palette){try{const image=mat.map.image;if(image.width===224){const c=image.getContext('2d');palette=Array.from({length:14},(_,i)=>{const d=c.getImageData(i*16+8,8,1,1).data;return new THREE.Color(`rgb(${d[0]},${d[1]},${d[2]})`)});this.textureColors.set(mat.map,palette)}}catch{}}}
   const start=geo.drawRange.start,count=Math.min(ix?ix.count:pos.count,start+geo.drawRange.count);
   for(let i=start;i<count;i+=3){const ids=[ix?ix.getX(i):i,ix?ix.getX(i+1):i+1,ix?ix.getX(i+2):i+2];
    point.fromBufferAttribute(pos,ids[0]).applyMatrix4(obj.matrixWorld);const dist=point.distanceTo(camera.position);if(dist>(obj.userData.range??65)&&obj!==scene.userData.water)continue;
    const screen=[];let invalid=false;for(const id of ids){point.fromBufferAttribute(pos,id).applyMatrix4(this.mvp);if(point.z<-.99||point.z>=1.001){invalid=true;break}screen.push([(point.x+1)*w/2,(1-point.y)*h/2,point.z])}if(invalid)continue;
    const [a,b,c]=screen;const cross=(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);if(cross>=0&&mat.side!==THREE.DoubleSide)continue;
    if(screen.every(v=>v[0]<0)||screen.every(v=>v[0]>w)||screen.every(v=>v[1]<0)||screen.every(v=>v[1]>h))continue;
    color.copy(mat.color??new THREE.Color('white'));if(palette){const tile=Math.min(13,Math.floor(uv.getX(ids[0])*14));color.multiply(palette[tile]);}
    let light=1;if(!mat.isMeshBasicMaterial){this.normal.fromBufferAttribute(norm,ids[0]).transformDirection(obj.matrixWorld);light=.68+Math.max(0,this.normal.y)*.28+Math.max(0,-this.normal.x)*.06;light*=scene.userData.softwareLight??1;}
    if(colors)light*=colors.getX(ids[0]);color.multiplyScalar(light);const fog=mat.fog===false?0:Math.max(0,Math.min(1,(dist-scene.fog.near)/(scene.fog.far-scene.fog.near)));color.lerp(scene.fog.color,fog);
    polygons.push({screen,depth:(a[2]+b[2]+c[2])/3,fill:color.getStyle(),alpha:mat.opacity??1,image:obj.userData.panel?mat.map?.image:null,tex:obj.userData.panel?ids.map(id=>[uv.getX(id)*mat.map.image.width,(1-uv.getY(id))*mat.map.image.height]):null});
   }
  });
  polygons.sort((a,b)=>b.depth-a.depth);ctx.lineWidth=.5;
  for(const p of polygons){ctx.globalAlpha=p.alpha;ctx.fillStyle=p.fill;ctx.strokeStyle=p.fill;ctx.beginPath();ctx.moveTo(p.screen[0][0],p.screen[0][1]);ctx.lineTo(p.screen[1][0],p.screen[1][1]);ctx.lineTo(p.screen[2][0],p.screen[2][1]);ctx.closePath();ctx.fill();if(p.image&&p.tex){const [u,v,t]=p.tex,[a,b,c]=p.screen,det=(v[0]-u[0])*(t[1]-u[1])-(t[0]-u[0])*(v[1]-u[1]);if(Math.abs(det)>.001){const A=((b[0]-a[0])*(t[1]-u[1])-(c[0]-a[0])*(v[1]-u[1]))/det,B=((b[1]-a[1])*(t[1]-u[1])-(c[1]-a[1])*(v[1]-u[1]))/det,C=((c[0]-a[0])*(v[0]-u[0])-(b[0]-a[0])*(t[0]-u[0]))/det,D=((c[1]-a[1])*(v[0]-u[0])-(b[1]-a[1])*(t[0]-u[0]))/det;ctx.save();ctx.clip();ctx.transform(A,B,C,D,a[0]-A*u[0]-C*u[1],a[1]-B*u[0]-D*u[1]);ctx.drawImage(p.image,0,0);ctx.restore();}}else if(p.alpha===1)ctx.stroke();}
  ctx.globalAlpha=1;for(const s of sprites.sort((a,b)=>b.depth-a.depth))if(s.img)ctx.drawImage(s.img,s.x-s.width/2,s.y-s.height/2,s.width,s.height);
 }
}
