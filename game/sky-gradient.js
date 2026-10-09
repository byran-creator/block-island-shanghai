import * as THREE from './three.module.js';

export function createSkyGradient(scene,camera){
 const geometry=new THREE.SphereGeometry(270,24,16),colors=new THREE.Float32BufferAttribute(new Float32Array(geometry.attributes.position.count*3),3);geometry.setAttribute('color',colors);
 const material=new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide,fog:false,depthWrite:false}),dome=new THREE.Mesh(geometry,material);dome.name='graduated-sky';dome.userData.skyGradient=true;dome.renderOrder=-1000;dome.frustumCulled=false;scene.add(dome);
 const horizon=new THREE.Color(),zenith=new THREE.Color(),sample=new THREE.Color();let previous='';
 const fireGold=new THREE.Color('#ffa644');
 const fireVermilion=new THREE.Color('#f85e36');
 const fireCoral=new THREE.Color('#e23b6c');
 const fireAmethyst=new THREE.Color('#643a88');
 const fireBlueHour=new THREE.Color('#224494');
 const fireZenith=new THREE.Color('#162a64');
 const gold=new THREE.Color('#ffa848');
 const coral=new THREE.Color('#f05e52');
 const rose=new THREE.Color('#d83e74');
 const violet=new THREE.Color('#583e84');
 const blueHour=new THREE.Color('#1e3a7c');
 const sunsetGrad=new THREE.Color();

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
  const sunsetHorizon=new THREE.Color(isSunset?(isFiery?'#ffa442':'#ffa850'):'#ffaa58');
  const sunsetZenith=new THREE.Color(isSunset?(isFiery?'#1c3876':'#223a78'):'#35487a');

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
     if(isFiery){
      // Dramatic "火烧云 + 蓝调时刻" (Fiery Sunset & Sapphire Blue Hour) matching user reference photo:
      // Horizon (y < 0.08): Warm glowing apricot flame ->
      // Low sky (0.08 ~ 0.18): Fiery vermilion to radiant coral-rose ->
      // Mid sky (0.18 ~ 0.28): Radiant coral-rose through soft twilight amethyst ->
      // Upper sky (0.28 ~ 0.48): Luminous sapphire cobalt blue hour ->
      // Zenith (y >= 0.48): Deep luminous sapphire twilight blue
      if(y<0.08){
       sunsetGrad.copy(fireGold).lerp(fireVermilion,y/0.08);
      }else if(y<0.18){
       sunsetGrad.copy(fireVermilion).lerp(fireCoral,(y-0.08)/0.10);
      }else if(y<0.28){
       sunsetGrad.copy(fireCoral).lerp(fireAmethyst,(y-0.18)/0.10);
      }else if(y<0.48){
       sunsetGrad.copy(fireAmethyst).lerp(fireBlueHour,(y-0.28)/0.20);
      }else{
       sunsetGrad.copy(fireBlueHour).lerp(fireZenith,(y-0.48)/0.52);
      }
     }else{
      // Romantic Rose-Purple Twilight Sunset:
      if(y<0.10){
       sunsetGrad.copy(gold).lerp(coral,y/0.10);
      }else if(y<0.22){
       sunsetGrad.copy(coral).lerp(rose,(y-0.10)/0.12);
      }else if(y<0.36){
       sunsetGrad.copy(rose).lerp(violet,(y-0.22)/0.14);
      }else{
       sunsetGrad.copy(violet).lerp(blueHour,(y-0.36)/0.64);
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
