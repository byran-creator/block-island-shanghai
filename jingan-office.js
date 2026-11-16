const tiles={ribbon:16,frame:17,fin:18,stone:19,metal:20,lobby:21};

// Every profile stays inside its original parcel and starts above the podium.
export function jinganOfficeSection(plot,y){
 const {rx,rz,height,style}=plot,level=y-26,upper=level>=height-10;
 if(y<=31)return {rx,rz,cut:0,shift:0};
 if(style==='ribbon')return {rx:rx-(upper?2:1),rz,cut:2,shift:0};
 if(style==='terrace'){
  const inset=upper?2:level>=15?1:0;
  return {rx:rx-inset,rz:rz-inset,cut:inset+1,shift:0};
 }
 if(style==='split')return {rx:rx-(upper?2:1),rz:rz-1,cut:1,shift:-1};
 if(style==='fin')return {rx:rx-1,rz:rz-(upper?2:1),cut:0,shift:0};
 return {rx:rx-(upper?2:1),rz:rz-(upper?2:1),cut:1,shift:0};
}
function contains(section,dx,dz){
 const a=Math.abs(dx-section.shift),b=Math.abs(dz);
 return a<=section.rx&&b<=section.rz&&a+b<=section.rx+section.rz-section.cut;
}

export function buildJinganOffice(w,plot){
 const {x,z,rx,rz,height,style}=plot,top=25+height;
 w.fill(x-rx,25,z-rz,x+rx,25,z+rz,9);
 for(let y=26;y<=top;y++){
  const section=jinganOfficeSection(plot,y),next=jinganOfficeSection(plot,y+1);
  for(let dx=-rx;dx<=rx;dx++)for(let dz=-rz;dz<=rz;dz++){
   if(!contains(section,dx,dz))continue;
   if(y===top||!contains(next,dx,dz)){
    w.set(x+dx,y,z+dz,9);
    continue;
   }
   const along=Math.abs(dx-section.shift)===section.rx?dz:dx;
   const edge=!contains(section,dx-1,dz)||!contains(section,dx+1,dz)||
    !contains(section,dx,dz-1)||!contains(section,dx,dz+1);
   if(!edge)continue;
   const lobby=y>=27&&y<=30&&Math.abs(along)>=1&&Math.abs(along)<=3;
   const crown=y>=top-2;
   const joint=style==='ribbon'&&(y-32)%4===0||style==='terrace'&&(y-32)%5===0;
   const pier=style==='frame'&&Math.abs(along)===2||style==='fin'&&along%3===0;
   w.set(x+dx,y,z+dz,y<=31?lobby?11:9:crown||pier?3:joint?9:11);
  }
 }
 const upper=jinganOfficeSection(plot,top);
 w.fill(x+upper.shift-2,top+1,z-1,x+upper.shift+2,top+2,z+1,3);
 if(style==='frame'||style==='ribbon'){
  for(const side of [-1,1]){
   const edge=z+side*(upper.rz-1);
   w.fill(x-2,top+1,edge,x+2,top+1,edge,9);
  }
 }
}

export function createJinganOfficeTiles(plots,cx,cz,size){
 const startX=cx*size,startZ=cz*size;
 const nearby=plots.filter(p=>p.height>20&&p.x+p.rx>=startX&&p.x-p.rx<startX+size&&
  p.z+p.rz>=startZ&&p.z-p.rz<startZ+size);
 if(!nearby.length)return;
 return (x,y,z,id)=>{
  if(y<26||id!==3&&id!==9&&id!==11)return;
  const p=nearby.find(p=>Math.abs(x-p.x)<=p.rx&&Math.abs(z-p.z)<=p.rz&&y<=p.height+27);
  if(!p)return;
  if(id===3)return tiles.metal;
  if(id===9)return tiles.stone;
  if(y<=31)return tiles.lobby;
  return tiles[p.style]??(p.style==='terrace'?tiles.ribbon:tiles.fin);
 };
}

export function drawJinganOfficeTiles(ctx){
 function material(id,colors,axis,trim){
  const x=(id%14)*16,y=16;
  const gradient=axis==='x'?ctx.createLinearGradient(x,y,x+16,y):ctx.createLinearGradient(x,y,x,y+16);
  colors.forEach((color,i)=>gradient.addColorStop(i/(colors.length-1),color));
  ctx.fillStyle=gradient;
  ctx.fillRect(x,y,16,16);
  if(trim==='ribbon'){
   ctx.fillStyle='#b5c4cc';ctx.fillRect(x,y,16,1);
   ctx.fillStyle='#2c4353';ctx.fillRect(x,y+15,16,1);
  }else if(trim==='mullion'){
   ctx.fillStyle='#b1bec4';ctx.fillRect(x,y,1,16);
   ctx.fillStyle='#3e515e';ctx.fillRect(x+15,y,1,16);
   ctx.fillStyle='#435868';ctx.fillRect(x,y+15,16,1);
  }else if(trim==='joint'){
   ctx.fillStyle='#758391';ctx.fillRect(x,y+15,16,1);
  }
 }
 material(tiles.ribbon,['#a7bcca','#68879a','#496477'],'y','ribbon');
 material(tiles.frame,['#8ba4b5','#617f93','#7092a5'],'x','mullion');
 material(tiles.fin,['#b5c8cf','#7896a2','#5b768b'],'x','mullion');
 material(tiles.stone,['#e0dbd0','#c8c5bc'],'y','joint');
 material(tiles.metal,['#71818a','#465765'],'x','joint');
 material(tiles.lobby,['#c7b08d','#7b8b94','#526878'],'y','mullion');
}
