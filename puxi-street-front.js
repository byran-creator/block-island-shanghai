const styles=[
 {wall:8,stone:6,roof:3,awning:7},
 {wall:9,stone:6,roof:3,awning:8},
 {wall:6,stone:9,roof:8,awning:4}
];
function frontWall(w,left,right,face,top,side,style){
 const {wall,stone,awning}=style;
 for(let x=left;x<=right;x++){
  const span=x-left,pier=x===right||span%4===0;
  w.fill(x,26,face,x,top,face,pier?stone:wall);
  if(pier)continue;
  if(span%4===2&&x<=right-2){
   w.fill(x,26,face,x,28,face,4);
   w.set(x,29,face,9);
  }else w.fill(x,27,face,x,29,face,11);
  for(let sill=32;sill+2<top;sill+=4){
   w.set(x,sill,face,stone);
   if(span%4!==3)w.fill(x,sill+1,face,x,sill+2,face,11);
  }
 }
 w.fill(left,30,face+side,right,30,face+side,stone);
 w.fill(left,top,face+side,right,top,face+side,stone);
 for(let x=left+1;x+2<right;x+=8){
  w.fill(x,29,face+side,x+2,29,face+side,awning);
  w.set(x+1,29,face+side,stone);
 }
}

export function buildStreetFrontage(w,[left,right,back,face,top,styleId]){
 const style=styles[styleId],side=Math.sign(face-back);
 const north=Math.min(back,face),south=Math.max(back,face);
 w.fill(left,25,north,right,25,south,9);
 // Street-facing display buildings have solid volumes, so terrain meshing
 // only emits the exterior rather than both sides of hidden interior walls.
 w.fill(left,26,north,right,top,south,style.wall);
 for(let y=27;y<top-2;y+=4)for(const x of [left,right]){
  for(let z=north+2;z<=south-2;z+=3)w.fill(x,y,z,x,y+1,z,11);
 }
 for(let x=left+2;x<=right-2;x+=3)w.fill(x,28,back,x,29,back,11);
 frontWall(w,left,right,face,top,side,style);
 w.fill(left,top,north,right,top,south,style.stone);
 w.fill(left+1,top+1,north+1,right-1,top+1,south-1,style.roof);
 if(styleId!==1&&south-north>=5)w.fill(left+2,top+2,north+2,right-2,top+2,south-2,style.roof);
 if(styleId===1)w.fill(left+2,top+2,north+1,left+3,top+2,north+1,3);
}

export function streetFrontageLight([left,right,back,face]){
 const side=Math.sign(face-back),halfWidth=(right-left+1)/2;
 return {x:left+halfWidth,y:28.65,z:face+(side>0?1.42:-.42),radiusSq:halfWidth**2+12,strength:.94};
}
