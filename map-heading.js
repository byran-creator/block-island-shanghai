// Camera yaw zero looks north (-Z); increasing yaw turns towards west (-X).
export function playerMapArrow(x,y,yaw,radius){
 const a=Number.isFinite(yaw)?-yaw:0,c=Math.cos(a),s=Math.sin(a);
 return [[0,-radius],[radius*.7,radius*.75],[0,radius*.3],[-radius*.7,radius*.75]].map(([dx,dy])=>[x+dx*c-dy*s,y+dx*s+dy*c]);
}
export function drawMapPlayer(ctx,pos,yaw,size,min,worldSize,minZ=min,mapHeight=size){
 const y=(pos.z-minZ)/worldSize*size,radius=size>=400?11:7;
 const points=playerMapArrow((pos.x-min)/worldSize*size,Math.max(radius+2,Math.min(mapHeight-radius-2,y)),yaw,radius);
 ctx.beginPath();ctx.moveTo(...points[0]);for(const p of points.slice(1))ctx.lineTo(...p);ctx.closePath();
 ctx.strokeStyle='#143844';ctx.lineWidth=5;ctx.stroke();ctx.fillStyle='#64d5f5';ctx.fill();ctx.strokeStyle='#f4fcff';ctx.lineWidth=1.5;ctx.stroke();
}
