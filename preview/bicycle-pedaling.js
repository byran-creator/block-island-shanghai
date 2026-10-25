// A small two-link leg rig. Phase follows actual travel, so red lights freeze it.
export function createBicyclePedaling({legs,makePart,phase=0}){
 let angle=phase;const rigs=legs.map((upper,i)=>{
  const side=i===0?-1:1,shin=makePart('#415069',0,0,0,.16,.4,.18),shoe=makePart('#273740',0,0,0,.18,.1,.3),pedal=makePart('#65777b',0,0,0,.23,.05,.18),crank=makePart('#65777b',0,0,0,.04,.16,.04);
  shin.material=upper.material;return {side,upper,shin,shoe,pedal,crank};
 });
 function segment(mesh,ay,az,by,bz,x){mesh.position.set(x,(ay+by)/2,(az+bz)/2);mesh.scale.y=Math.hypot(by-ay,bz-az);mesh.rotation.x=Math.atan2(bz-az,by-ay);}
 function pose(){for(const r of rigs){const a=angle+(r.side<0?0:Math.PI),fy=.6+Math.cos(a)*.15,fz=.01+Math.sin(a)*.15,hy=1.2,hz=.15,dy=fy-hy,dz=fz-hz,d=Math.hypot(dy,dz),bend=Math.sqrt(Math.max(0,.41*.41-d*d/4)),ky=(hy+fy)/2-dz/d*bend,kz=(hz+fz)/2+dy/d*bend,x=r.side*.15;
   segment(r.upper,hy,hz,ky,kz,x);segment(r.shin,ky,kz,fy,fz,x);r.shoe.position.set(x,fy-.035,fz-.04);r.pedal.position.set(r.side*.2,fy-.09,fz);segment(r.crank,.51,.01,fy-.09,fz,r.side*.18);
  }}
 pose();return {rigs,get phase(){return angle;},advance(distance){if(!Number.isFinite(distance)||!distance)return;angle=(angle+distance/.72)%(Math.PI*2);pose();}};
}
