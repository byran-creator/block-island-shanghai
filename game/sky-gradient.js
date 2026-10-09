import * as THREE from './three.module.js';

export function createSkyGradient(scene,camera){
 const geometry=new THREE.SphereGeometry(270,24,16),colors=new THREE.Float32BufferAttribute(new Float32Array(geometry.attributes.position.count*3),3);geometry.setAttribute('color',colors);
 const material=new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide,fog:false,depthWrite:false}),dome=new THREE.Mesh(geometry,material);dome.name='graduated-sky';dome.userData.skyGradient=true;dome.renderOrder=-1000;dome.frustumCulled=false;scene.add(dome);
 const horizon=new THREE.Color(),zenith=new THREE.Color(),sample=new THREE.Color();let previous='';
 function tick(dayClock,cloud,fog,visible){dome.visible=visible;dome.position.copy(camera.position);const alt=Math.sin(dayClock/240*Math.PI*2),day=THREE.MathUtils.smoothstep(alt,-.12,.45),dusk=(1-THREE.MathUtils.smoothstep(Math.abs(alt),.03,.38))*(alt>-.2?1:0);
  const isSunset=dayClock>70&&dayClock<160;
  const dayZenith=new THREE.Color('#186fe8'),nightZenith=new THREE.Color('#081020');
  const dayHorizon=new THREE.Color('#d5e9f8'),nightHorizon=new THREE.Color('#152238');
  const sunsetHorizon=new THREE.Color(isSunset?'#f3612d':'#ff9d5e');
  const twilightZenith=new THREE.Color(isSunset?'#1a204d':'#1e4075');
  zenith.copy(nightZenith).lerp(dayZenith,day).lerp(twilightZenith,dusk*.5).lerp(new THREE.Color(alt<0?'#243447':'#8295a8'),cloud*.78);
  horizon.copy(nightHorizon).lerp(dayHorizon,day).lerp(sunsetHorizon,dusk*.75).lerp(new THREE.Color(alt<0?'#2d3c4e':'#bac6cd'),Math.max(fog*.7,cloud*.55));
  const key=[...zenith.toArray(),...horizon.toArray()].map(v=>v.toFixed(3)).join(',');if(key!==previous){for(let i=0;i<colors.count;i++){const t=Math.pow(Math.max(0,geometry.attributes.normal.getY(i)),.55);sample.copy(horizon).lerp(zenith,t);colors.setXYZ(i,sample.r,sample.g,sample.b);}colors.needsUpdate=true;previous=key;}
  scene.userData.skyGradient=visible?{zenith:zenith.getStyle(),horizon:horizon.getStyle()}:null;
 }
 return {tick,horizon,dome};
}
