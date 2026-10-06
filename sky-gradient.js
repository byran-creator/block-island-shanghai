import * as THREE from './three.module.js';

export function createSkyGradient(scene,camera){
 const geometry=new THREE.SphereGeometry(270,24,16),colors=new THREE.Float32BufferAttribute(new Float32Array(geometry.attributes.position.count*3),3);geometry.setAttribute('color',colors);
 const material=new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide,fog:false,depthWrite:false}),dome=new THREE.Mesh(geometry,material);dome.name='graduated-sky';dome.userData.skyGradient=true;dome.renderOrder=-1000;dome.frustumCulled=false;scene.add(dome);
 const horizon=new THREE.Color(),zenith=new THREE.Color(),sample=new THREE.Color();let previous='';
 function tick(dayClock,cloud,fog,visible){dome.visible=visible;dome.position.copy(camera.position);const alt=Math.sin(dayClock/240*Math.PI*2),day=THREE.MathUtils.smoothstep(alt,-.12,.45),dusk=(1-THREE.MathUtils.smoothstep(Math.abs(alt),.03,.38))*(alt>-.2?1:0);
  zenith.set('#09162f').lerp(new THREE.Color('#397dcc'),day).lerp(new THREE.Color(alt<0?'#293a51':'#8798aa'),cloud*.78);
  horizon.set('#263857').lerp(new THREE.Color('#cedde5'),day).lerp(new THREE.Color('#edb593'),dusk*.6).lerp(new THREE.Color(alt<0?'#344354':'#bac4ca'),Math.max(fog*.7,cloud*.55));
  const key=[...zenith.toArray(),...horizon.toArray()].map(v=>v.toFixed(3)).join(',');if(key!==previous){for(let i=0;i<colors.count;i++){const t=Math.pow(Math.max(0,geometry.attributes.normal.getY(i)),.55);sample.copy(horizon).lerp(zenith,t);colors.setXYZ(i,sample.r,sample.g,sample.b);}colors.needsUpdate=true;previous=key;}
  scene.userData.skyGradient=visible?{zenith:zenith.getStyle(),horizon:horizon.getStyle()}:null;
 }
 return {tick,horizon,dome};
}
