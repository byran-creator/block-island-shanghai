import {createMetroService} from './metro-service.js';

function lanePath(center,first,last,offset){
 // Keep equal distance between car centers on both rails, even through bends.
 const start=Math.floor(first)-45,end=Math.ceil(last)+45,steps=Math.ceil((end-start)*2),points=[];
 let d=0;
 for(let i=0;i<=steps;i++){
  const s=start+i/2,p=center(s),x=p.x-p.dz*offset,z=p.z+p.dx*offset,prev=points.at(-1);
  if(prev)d+=Math.hypot(x-prev.x,z-prev.z);
  points.push({x,z,s,d});
 }
 function distance(s){
  const i=Math.max(0,Math.min(points.length-2,Math.floor((s-start)*2))),p=points[i],q=points[i+1];
  return p.d+(q.d-p.d)*(s-p.s)*2;
 }
 function point(d){
  let lo=0,hi=points.length-1;
  while(hi-lo>1){const i=(lo+hi)>>1;if(points[i].d<d)lo=i;else hi=i;}
  const a=points[lo],b=points[hi],u=(d-a.d)/(b.d-a.d);
  return {x:a.x+(b.x-a.x)*u,z:a.z+(b.z-a.z)*u};
 }
 function pose(d,half=2.6){
  const mid=point(d),a=point(d-half),b=point(d+half);
  return {...mid,y:6,yaw:-Math.atan2(b.z-a.z,b.x-a.x)};
 }
 return {distance,pose};
}

export function createRoutedMetro(stations,travel,center,{terminalRoll=2.8}={}){
 const service=createMetroService(stations,travel);
 const lanes=new Map([1,-1].map(dir=>[dir,lanePath(center,stations[0].x,stations.at(-1).x,-dir*8)]));
 const stops=new Map([...lanes].map(([dir,p])=>[dir,stations.map(s=>p.distance(s.x))]));
 function trainPose(s){
  const distances=stops.get(s.direction),p=lanes.get(s.direction),a=distances[s.station];
  const d=s.phase==='travel'?a+(distances[s.next]-a)*s.progress:
   s.phase==='through'?a+s.direction*Math.min(terminalRoll,s.tail)*4:a;
  return {...p.pose(d),visible:s.visible&&(s.phase!=='through'||s.tail<terminalRoll),distance:d};
 }
 function updateCars(train,state,pose){
  const rail=lanes.get(state.direction),cos=Math.cos(pose.yaw),sin=Math.sin(pose.yaw);
  for(const car of train.carriages){
   const at=rail.pose(pose.distance+car.x),dx=at.x-pose.x,dz=at.z-pose.z;
   car.root.position.set(dx*cos-dz*sin,0,dx*sin+dz*cos);
   car.root.rotation.y=at.yaw-pose.yaw;
  }
 }
 return {service,trainPose,updateCars};
}
