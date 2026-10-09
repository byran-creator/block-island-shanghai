import * as THREE from './three.module.js';

export function createSkyGradient(scene,camera){
 const geometry=new THREE.SphereGeometry(270,24,16),colors=new THREE.Float32BufferAttribute(new Float32Array(geometry.attributes.position.count*3),3);geometry.setAttribute('color',colors);
 const material=new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide,fog:false,depthWrite:false}),dome=new THREE.Mesh(geometry,material);dome.name='graduated-sky';dome.userData.skyGradient=true;dome.renderOrder=-1000;dome.frustumCulled=false;scene.add(dome);
 const horizon=new THREE.Color(),zenith=new THREE.Color(),sample=new THREE.Color();let previous='';

 function tick(dayClock,cloud,fog,visible,isFiery=false){
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

  // Sunset & Twilight progression
  // Fiery Burning Sunset ("火烧云", matching user reference photo) vs. Gentle Rose Twilight
  const sunsetHorizon=new THREE.Color(isSunset?(isFiery?'#ff7a22':'#ffa23e'):'#ffaa58');
  const sunsetZenith=new THREE.Color(isSunset?(isFiery?'#25204e':'#42366e'):'#35487a');

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

  const key=[...zenith.toArray(),...horizon.toArray(),dusk.toFixed(2),isFiery?1:0].map(v=>typeof v==='number'?v.toFixed(3):v).join(',');
  if(key!==previous){
   for(let i=0;i<colors.count;i++){
    const y=Math.max(0,geometry.attributes.normal.getY(i));
    const t=Math.pow(y,0.52);
    if(dusk>0.02&&isSunset){
     const sunsetGrad=new THREE.Color();
     if(isFiery){
      // Dramatic "火烧云" 4-layer fiery sunset (Image reference):
      // Horizon: Molten fire orange -> Low-sky: Vermilion flame -> Mid-sky: Burning ruby-magenta -> Zenith: Royal indigo
      const fireGold=new THREE.Color('#ff8424');
      const fireCrimson=new THREE.Color('#ee3246');
      const fireMagenta=new THREE.Color('#c21a58');
      const fireZenith=sunsetZenith;
      if(y<0.15){
       sunsetGrad.copy(fireGold).lerp(fireCrimson,y/0.15);
      }else if(y<0.50){
       sunsetGrad.copy(fireCrimson).lerp(fireMagenta,(y-0.15)/0.35);
      }else{
       sunsetGrad.copy(fireMagenta).lerp(fireZenith,(y-0.50)/0.50);
      }
     }else{
      // Romantic Rose-Purple Twilight Sunset:
      const gold=new THREE.Color('#ffa23e');
      const coral=new THREE.Color('#f25f54');
      const rose=new THREE.Color('#dc407a');
      const violet=sunsetZenith;
      if(y<0.16){
       sunsetGrad.copy(gold).lerp(coral,y/0.16);
      }else if(y<0.52){
       sunsetGrad.copy(coral).lerp(rose,(y-0.16)/0.36);
      }else{
       sunsetGrad.copy(rose).lerp(violet,(y-0.52)/0.48);
      }
     }
     sample.copy(horizon).lerp(zenith,t).lerp(sunsetGrad,dusk);
    }else{
     sample.copy(horizon).lerp(zenith,t);
    }
    colors.setXYZ(i,sample.r,sample.g,sample.b);
   }
   colors.needsUpdate=true;previous=key;
  }
  scene.userData.skyGradient=visible?{zenith:zenith.getStyle(),horizon:horizon.getStyle()}:null;
 }
 return {tick,horizon,dome};
}
