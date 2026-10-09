import * as THREE from './three.module.js';

export function createSkyGradient(scene,camera){
 const geometry=new THREE.SphereGeometry(270,24,16),colors=new THREE.Float32BufferAttribute(new Float32Array(geometry.attributes.position.count*3),3);geometry.setAttribute('color',colors);
 const material=new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide,fog:false,depthWrite:false}),dome=new THREE.Mesh(geometry,material);dome.name='graduated-sky';dome.userData.skyGradient=true;dome.renderOrder=-1000;dome.frustumCulled=false;scene.add(dome);
 const horizon=new THREE.Color(),zenith=new THREE.Color(),sample=new THREE.Color();let previous='';

 function tick(dayClock,cloud,fog,visible){
  dome.visible=visible;dome.position.copy(camera.position);
  const alt=Math.sin(dayClock/240*Math.PI*2);
  const day=THREE.MathUtils.smoothstep(alt,-.08,.42);
  const isSunset=dayClock>68&&dayClock<165;
  const dusk=(1-THREE.MathUtils.smoothstep(Math.abs(alt),.02,.38))*(alt>-.2?1:0);

  // Clear day: Vivid Shanghai blue zenith down to clear light-blue airy horizon
  const dayZenith=new THREE.Color('#1e78e8');
  const dayHorizon=new THREE.Color('#d4e9fc');

  // Deep night: Midnight indigo
  const nightZenith=new THREE.Color('#071020');
  const nightHorizon=new THREE.Color('#142236');

  // Sunset & Twilight (matching user reference Image 2 & Image 3!):
  // Horizon glows with warm sunset gold-amber:
  const sunsetHorizon=new THREE.Color(isSunset?'#ff9436':'#ffaa58');
  // Mid-sky glows with rich rosy magenta-pink (like Image 2):
  const sunsetMid=new THREE.Color(isSunset?'#de457e':'#ea6882');
  // Zenith during sunset is soft evening violet-purple, NOT dark black:
  const sunsetZenith=new THREE.Color(isSunset?'#42366e':'#35487a');

  zenith.copy(nightZenith).lerp(dayZenith,day);
  if(dusk>0.01){
   zenith.lerp(sunsetZenith,dusk*0.92);
  }
  zenith.lerp(new THREE.Color(alt<0?'#243447':'#8092a4'),cloud*0.78);

  horizon.copy(nightHorizon).lerp(dayHorizon,day);
  if(dusk>0.01){
   horizon.lerp(sunsetHorizon,dusk*0.95);
  }
  horizon.lerp(new THREE.Color(alt<0?'#2d3c4e':'#bac6cd'),Math.max(fog*0.7,cloud*0.55));

  const key=[...zenith.toArray(),...horizon.toArray(),dusk.toFixed(2)].map(v=>typeof v==='number'?v.toFixed(3):v).join(',');
  if(key!==previous){
   for(let i=0;i<colors.count;i++){
    const y=Math.max(0,geometry.attributes.normal.getY(i));
    const t=Math.pow(y,0.52);
    sample.copy(horizon).lerp(zenith,t);
    // At sunset (Image 2): add the magical middle rosy-magenta glow band!
    if(dusk>0.05&&isSunset&&y>0.08&&y<0.75){
     const midFactor=Math.sin((y-0.08)/0.67*Math.PI)*dusk;
     sample.lerp(sunsetMid,midFactor*0.62);
    }
    colors.setXYZ(i,sample.r,sample.g,sample.b);
   }
   colors.needsUpdate=true;previous=key;
  }
  scene.userData.skyGradient=visible?{zenith:zenith.getStyle(),horizon:horizon.getStyle()}:null;
 }
 return {tick,horizon,dome};
}
