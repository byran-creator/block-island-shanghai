import * as THREE from './three.module.js';
import {createDroneShow} from './drone-show.js';
import {WORLD_SHIFT,LANDMARKS} from './world.js';
import {createHarbourFireworks} from './harbour-fireworks.js';
import {SHOW_DURATION,showCue} from './show-cues.js';
export function createPearlShow(scene){
 const drones=createDroneShow(scene),leds=[],fireworks=createHarbourFireworks(scene);let remaining=0,clock=0,elapsed=0;
 function light(geometry,x,y,z){const mesh=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color:'#ff69bc'}));mesh.position.set(x+36,y+WORLD_SHIFT,z);mesh.userData.range=150;scene.add(mesh);leds.push(mesh);return mesh;}
 for(const [y,r] of [[22,3.2],[24,4.8],[26,5.2],[28,4.8],[30,3.2],[50,2.3],[52,4.2],[54,4.7],[56,4.2],[58,2.3],[67,2.3]]){
  const ring=light(new THREE.TorusGeometry(r,.17,4,48),90,y,42);ring.rotation.x=Math.PI/2;
 }
 const bar=new THREE.BoxGeometry(.32,1.25,.32);
 for(let y=34;y<50;y+=1.5)for(let a=0;a<8;a++){const angle=a*Math.PI/4;light(bar,90+Math.cos(angle)*1.65,y,42+Math.sin(angle)*1.65);}
 for(let y=70;y<=82;y+=1.4)light(bar,90,y,42);
 function start(){remaining=SHOW_DURATION;elapsed=0;drones.start();fireworks.start();return true;}
 function tick(dt,night=false){
  clock+=dt;const active=remaining>0;if(active)elapsed=Math.min(SHOW_DURATION,elapsed+dt);drones.tick(dt,active);fireworks.tick(dt);const cue=showCue(elapsed);
  for(let i=0;i<leds.length;i++){leds[i].visible=night||active;leds[i].material.color.setHSL(active?cue.hue:.92,.88,active?.62*cue.brightness:.62);leds[i].scale.setScalar(1);}
  if(active)remaining=Math.max(0,remaining-dt);
 }
 return {start,tick,drones,leds,fireworks,get elapsed(){return elapsed},get active(){return remaining>0},get lightCount(){return leds.length}};
}
