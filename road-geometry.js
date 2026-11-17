// Round the corners of closed street loops so two vehicle bodies can pass through turns.
export function roundedRoad(points,radius=6){
 const p=points.slice(0,-1),out=[];
 for(let i=0;i<p.length;i++){
  const a=p[(i+p.length-1)%p.length],b=p[i],c=p[(i+1)%p.length];
  const ab=Math.hypot(b[0]-a[0],b[1]-a[1]),bc=Math.hypot(c[0]-b[0],c[1]-b[1]);
  const dot=((b[0]-a[0])*(c[0]-b[0])+(b[1]-a[1])*(c[1]-b[1]))/(ab*bc||1);
  if(dot>.995||ab<.01||bc<.01){out.push(b);continue;}
  const d=Math.min(radius,ab*.4,bc*.4),start=[b[0]+(a[0]-b[0])*d/ab,b[1]+(a[1]-b[1])*d/ab,b[2]??26],end=[b[0]+(c[0]-b[0])*d/bc,b[1]+(c[1]-b[1])*d/bc,b[2]??26];
  for(let j=0;j<=16;j++){const t=j/16,u=1-t;out.push([u*u*start[0]+2*u*t*b[0]+t*t*end[0],u*u*start[1]+2*u*t*b[1]+t*t*end[1],b[2]??26]);}
 }
 out.push(out[0]);return out;
}

// Offset the two lanes along an existing street and join them inside its
// paved ends, without routing vehicles through the adjacent blocks.
export function returningStreetLoop(points,lane=1.45){
 const directions=points.slice(1).map(([x,z],i)=>{
  const [startX,startZ]=points[i],dx=x-startX,dz=z-startZ,length=Math.hypot(dx,dz);
  return [dx/length,dz/length];
 });
 function offset(side){
  return points.map(([x,z],i)=>{
   const [ax,az]=directions[Math.max(0,i-1)], [bx,bz]=directions[Math.min(i,directions.length-1)];
   const distance=side*lane/(1+ax*bx+az*bz);
   return [x+distance*(az+bz),z-distance*(ax+bx)];
  });
 }
 function turn([x,z],[dx,dz],side,direction){
  return Array.from({length:11},(_,i)=>{
   const angle=(i+1)*Math.PI/12,c=Math.cos(angle)*side,s=Math.sin(angle)*direction;
   return [x+lane*(dz*c+dx*s),z+lane*(-dx*c+dz*s)];
  });
 }
 const outward=offset(-1),inward=offset(1).reverse();
 return roundedRoad([...outward,...turn(points.at(-1),directions.at(-1),-1,1),...inward,
  ...turn(points[0],directions[0],1,-1),outward[0]],2);
}
