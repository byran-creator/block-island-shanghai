import * as THREE from './three.module.js';
import {riverCenter,inRiver} from './shanghai-map.js';
import {SHOW_DURATION} from './show-cues.js';

export const FIREWORK_COLORS=['#ffcb66','#fff0c3','#70dfff','#ed8fc7','#ff685f','#acdfb7'];
export const FIREWORK_BARGES=[62,103,144].map(z=>({x:riverCenter(z)-10,y:22.5,z}));
export function fireworksScore(){
 const score=[];
 const shell=(time,barge,height,kind,color,size=1)=>score.push({time,barge,height,kind,color,size});
 for(let t=0;t<6;t+=1.2)for(const barge of [0,1,2])shell(t+barge*.12,barge,0,'fan',0);
 for(let t=2;t<10;t+=2.4)for(const barge of [0,1,2])shell(t+barge*.22,barge,90+barge*16,'chrysanthemum',barge%2,1.1);
 for(let t=10.5;t<21;t+=2.4)for(const barge of [0,1,2])shell(t+barge*.18,barge,104+(barge%2)*28,t%2<1?'ring':'peony',2,1.05);
 for(let t=21;t<31.5;t+=2.7)for(const barge of [0,1,2])shell(t+barge*.24,barge,112+(barge%2)*23,barge===1?'ring':'peony',3,1.1);
 for(let t=31.5;t<39.2;t+=1.8)for(const barge of [0,1,2])shell(t+barge*.15,barge,122+(barge%2)*24,'willow',0,1.25);
 for(const barge of [0,1,2]){shell(37.8+barge*.1,barge,0,'fan',0);shell(37.5+barge*.12,barge,145,'willow',1,1.4);}
 return score.sort((a,b)=>a.time-b.time);
}
export function createHarbourFireworks(scene){
 const root=new THREE.Group();root.name='choreographed-harbour-fireworks';scene.add(root);
 const particles=[],shells=[],score=fireworksScore(),batches=[],capacity=900;let clock=0,cursor=0,running=false,seed=1729;
 const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 // Six reusable batches keep thousands of trails from becoming thousands of draw calls.
 for(const color of FIREWORK_COLORS){const vertices=capacity*12,positions=new Float32Array(vertices*3),colors=new Float32Array(vertices*3),indices=[];
  for(let i=0;i<vertices;i+=4)indices.push(i,i+1,i+2,i,i+2,i+3);
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3).setUsage(THREE.DynamicDrawUsage));geometry.setAttribute('color',new THREE.BufferAttribute(colors,3).setUsage(THREE.DynamicDrawUsage));geometry.setIndex(indices);geometry.setDrawRange(0,0);
  const material=new THREE.MeshBasicMaterial({color,vertexColors:true,transparent:true,opacity:.94,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending,fog:false}),mesh=new THREE.Mesh(geometry,material);mesh.frustumCulled=false;mesh.userData.range=450;root.add(mesh);batches.push({mesh,geometry,positions,colors,count:0});
 }
 const barges=FIREWORK_BARGES.map(p=>{const hull=new THREE.Mesh(new THREE.BoxGeometry(5,.6,9),new THREE.MeshLambertMaterial({color:'#394f59'}));hull.position.set(p.x,p.y-.1,p.z);hull.userData.range=350;root.add(hull);return hull;});
 function particle(p){if(particles.length>=4200)return;particles.push({...p,age:0,max:p.life});}
 function burst(s){const kind=s.kind,n=kind==='willow'?168:kind==='ring'?100:128;
  for(let i=0;i<n;i++){const a=i*2.399963,polar=Math.acos(1-2*(i+.5)/n),ring=kind==='ring',palm=kind==='willow',speed=(palm?13:15)*s.size*(.8+rand()*.25),angle=ring?i/n*Math.PI*2:a;
   const vx=ring?Math.sin(angle)*2:Math.cos(angle)*Math.sin(polar)*speed,vy=ring?Math.cos(angle)*speed:Math.cos(polar)*speed+(palm?4:0),vz=ring?Math.sin(angle)*speed:Math.sin(angle)*Math.sin(polar)*speed;
   particle({x:s.x,y:s.y,z:s.z,vx,vy,vz,life:palm?5.5:3.2,color:s.color,gravity:palm?3.5:4,drag:palm?.22:.3,width:palm?.19:.24,tail:palm?.45:.24,seed:rand()*6.28});
  }
  if(kind==='peony')for(let i=0;i<40;i++){const a=i*2.399963,b=Math.acos(1-2*(i+.5)/40),v=8;particle({x:s.x,y:s.y,z:s.z,vx:Math.cos(a)*Math.sin(b)*v,vy:Math.cos(b)*v,vz:Math.sin(a)*Math.sin(b)*v,life:2.1,color:1,gravity:4,drag:.3,width:.27,tail:.2,seed:rand()*6.28});}
 }
 function fire(cue){const p=FIREWORK_BARGES[cue.barge];
  if(cue.kind==='fan'){for(let i=-4;i<=4;i++)particle({x:p.x,y:24,z:p.z,vx:1.5,vy:23*Math.cos(i*.16),vz:23*Math.sin(i*.16),life:2.4,color:cue.color,gravity:8,drag:.16,width:.22,tail:.3,seed:rand()*6.28});return;}
  const rise=2.2+(cue.height-90)*.012;shells.push({...cue,x:p.x,y:24,z:p.z,launch:clock,rise,vy:(cue.height-24)/rise});
 }
 function quad(batch,points,brightness){if(batch.count+4>batch.positions.length/3)return;for(const p of points){const i=batch.count++*3;batch.positions.set(p,i);batch.colors[i]=batch.colors[i+1]=batch.colors[i+2]=brightness;}}
 function trails(p){const b=batches[p.color],fade=Math.min(1,p.age/.12)*Math.min(1,(p.max-p.age)/.9),flicker=p.age>1.2?.72+.28*Math.sin(p.seed+p.age*20)**2:1,brightness=fade*flicker,w=p.width*(.55+fade*.45),tail=p.tail;
  const q=[p.x-p.vx*tail,p.y-p.vy*tail,p.z-p.vz*tail],r=[p.x,p.y,p.z];
  for(const axis of [0,2]){const a=[...q],c=[...q],d=[...r],e=[...r];a[axis]-=w;c[axis]+=w;d[axis]+=w*.5;e[axis]-=w*.5;quad(b,[a,c,d,e],brightness);}
  // Small, broken reflections on the water rather than a second copy of the sky.
  if(p.seed<.5&&p.y>40&&inRiver(p.x,p.z)){const z=p.z+Math.sin(clock*3+p.seed)*.2,l=.8+(p.y-30)*.015;quad(b,[[p.x-.3,22.32,z-l],[p.x+.3,22.32,z-l],[p.x+.3,22.32,z+l],[p.x-.3,22.32,z+l]],brightness*.24);}
 }
 function render(){for(const b of batches)b.count=0;for(const p of particles)trails(p);for(const s of shells)trails({...s,color:s.color,age:1,max:10,seed:0,width:.18,tail:.14,vx:0,vz:0});for(const b of batches){b.geometry.setDrawRange(0,b.count/4*6);b.geometry.attributes.position.needsUpdate=true;b.geometry.attributes.color.needsUpdate=true;b.mesh.visible=b.count>0;}}
 function start(){particles.length=0;shells.length=0;clock=0;cursor=0;seed=1729;running=true;render();}
 function tick(dt){if(!running&&!particles.length&&!shells.length)return;clock+=dt;
  while(running&&cursor<score.length&&score[cursor].time<=clock)fire(score[cursor++]);if(clock>=SHOW_DURATION)running=false;
  for(let i=shells.length-1;i>=0;i--){const s=shells[i];s.y=24+Math.min(s.rise,clock-s.launch)*s.vy;if(clock-s.launch>=s.rise){burst(s);shells.splice(i,1);}}
  for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.age+=dt;if(p.age>=p.max){particles.splice(i,1);continue;}p.vx*=Math.exp(-p.drag*dt);p.vz*=Math.exp(-p.drag*dt);p.vy=(p.vy-p.gravity*dt)*Math.exp(-p.drag*dt*.4);p.x+=(p.vx+.7)*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;}
  render();
 }
 return {start,tick,root,barges,batches,score,get particleCount(){return particles.length},get shellCount(){return shells.length},get elapsed(){return clock}};
}
