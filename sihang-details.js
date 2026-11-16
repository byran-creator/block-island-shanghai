import * as THREE from './three.module.js';
import {SIHANG,SIHANG_IMPACTS} from './sihang-layout.js';
import {addHeritagePlaque} from './heritage-plaque.js';

function addMemorialWall(group){
 const {west,north,south,top}=SIHANG.warehouse;
 const span=south-north+1,height=top-25,scale=32;
 const canvas=document.createElement('canvas');
 canvas.width=span*scale;canvas.height=height*scale;
 const ctx=canvas.getContext('2d'),{width,height:rows}=canvas;
 let seed=1937;
 const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 const plaster=ctx.createLinearGradient(0,0,0,rows);
 plaster.addColorStop(0,'#c8c3b7');plaster.addColorStop(.42,'#bfb9ad');plaster.addColorStop(1,'#aea598');
 ctx.fillStyle=plaster;ctx.fillRect(0,0,width,rows);
 for(let i=0;i<1700;i++){
  const x=random()*width,y=random()*rows;
  ctx.fillStyle=i%3?'#5c514514':'#ebe2cc25';
  ctx.fillRect(x,y,1+random()*7,2+random()*26);
 }
 // The exposed brickwork reads as a broad area of missing render, with strips
 // of concrete still standing proud of the masonry.
 const edge=[[.08,.72],[.15,.69],[.22,.71],[.29,.68],[.37,.71],[.45,.74],[.52,.72],[.60,.66],
  [.67,.69],[.73,.66],[.81,.67],[.86,.63],[.94,.66],[.99,.61],[1,.86],[.92,.88],[.82,.86],
  [.70,.92],[.60,.88],[.46,.92],[.39,.88],[.27,.90],[.17,.87],[.10,.82]];
 ctx.save();ctx.beginPath();for(const [i,[x,y]] of edge.entries()){
  (i?ctx.lineTo:ctx.moveTo).call(ctx,x*width,y*rows);
 }ctx.closePath();
 ctx.strokeStyle='#776b59';ctx.lineWidth=3;ctx.stroke();ctx.clip();
 ctx.fillStyle='#8f7c68';ctx.fillRect(0,0,width,rows);
 const bricks=['#a36f54','#925e47','#a87d61','#9c765d','#86725f','#b0876b'];
 for(let y=Math.floor(rows*.61);y<rows*.94;y+=7)for(let x=(y%2)*-10;x<width;x+=20){
  ctx.fillStyle=bricks[Math.floor(random()*bricks.length)];ctx.fillRect(x,y,18,6);
 }
 ctx.fillStyle='#a69b88';
 for(const x of [.29,.49,.68,.84,.98])ctx.fillRect(x*width,rows*.62,8,rows*.31);
 for(const y of [.74,.83])ctx.fillRect(0,y*rows,width,7);
 ctx.restore();
 // Historic right-to-left lettering, with weathered individual plaster panels.
 ctx.textAlign='center';ctx.textBaseline='middle';
 ctx.font='500 33px "Microsoft YaHei",sans-serif';
 for(const [i,glyph] of [...'庫倉部分海上部託信行四'].entries()){
  const x=(.065+i*.084)*width,y=.146*rows;
  ctx.fillStyle=i%3?'#cec3ae85':'#d8cbb584';ctx.fillRect(x-19,y-24,38,43);
  ctx.fillStyle=[0,1,2,4,6].includes(i)?'#33312b':'#71665c88';ctx.fillText(glyph,x,y);
 }
 const centers=[[.19,.39],[.36,.37],[.46,.51],[.62,.36],[.79,.41],[.85,.25]];
 for(let i=0;i<250;i++){
  const [x,y]=centers[i%centers.length];
  const a=(x+(random()-.5)*.17)*width,b=(y+(random()-.5)*.21)*rows,r=1+random()*2.5;
  ctx.fillStyle='#dfd1b57a';ctx.beginPath();ctx.ellipse(a+1,b+1,r+1,r*.8+1,-.4,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=i%4?'#453b32c4':'#6c5543a8';ctx.beginPath();ctx.ellipse(a,b,r,r*.77,-.4,0,Math.PI*2);ctx.fill();
 }
 // Cut out the actual door and each opening so the 3D brick backing remains
 // visible, including from the side. The mask corresponds to the voxel wall.
 ctx.globalCompositeOperation='destination-out';
 ctx.fillStyle='#000';
 ctx.fillRect((-67-north)*scale,(top+1-30)*scale,3*scale,4*scale);
 for(const {z,y,cells} of SIHANG_IMPACTS)for(const [dz,dy] of cells){
  ctx.fillRect((z+dz-north)*scale,(top-y-dy)*scale,scale,scale);
 }
 ctx.globalCompositeOperation='source-over';
 const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=4;
 const material=new THREE.MeshLambertMaterial({map,alphaTest:.5});
 const wall=new THREE.Mesh(new THREE.PlaneGeometry(span,height),material);
 wall.position.set(west-.019,26+height/2,north+span/2);wall.rotation.y=-Math.PI/2;
 wall.updateMatrix();wall.matrixAutoUpdate=false;wall.name='sihang-west-wall';group.add(wall);
}

export function addSihangDetails(group){
 const {west,north,south}=SIHANG.warehouse;
 addMemorialWall(group);
 addHeritagePlaque(group,-238.5,27.15,-69.986,4.6,.8,['晋元纪念广场']);
 addHeritagePlaque(group,-218.5,30.8,south+1.014,7.1,.74,['四行信托部沪分部仓库']);
 addHeritagePlaque(group,west-.044,30.5,-66,5.1,.7,['上海四行仓库抗战纪念馆'],-Math.PI/2);
 addHeritagePlaque(group,-222.5,28.8,north+1.014,5.8,1.6,
  ['1937年 · 淞沪会战','谢晋元率部在此坚守。']);
 addHeritagePlaque(group,-215.5,28.8,north+1.014,5.8,1.6,
  ['西山墙 · 晋元纪念广场','墙上的创痕，见证了那段历史。']);
}
