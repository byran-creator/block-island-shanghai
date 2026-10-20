import * as THREE from './three.module.js';

// Two shared small labels, attached to the existing people; no extra actors.
export function createJourneyMeetings(){
 const materials=new Map(),badges=new Map();
 function material(kind){
  if(!materials.has(kind)){
   const canvas=document.createElement('canvas');canvas.width=256;canvas.height=112;const c=canvas.getContext('2d');
   c.lineJoin='round';c.lineWidth=5;c.strokeStyle='#b18a37';c.fillStyle='#ffe499';c.beginPath();c.moveTo(128,6);c.lineTo(148,26);c.lineTo(128,46);c.lineTo(108,26);c.closePath();c.fill();c.stroke();
   c.font='600 24px "Microsoft YaHei",sans-serif';c.textAlign='center';c.textBaseline='middle';c.shadowColor='#132129';c.shadowBlur=5;c.fillStyle='#ffe7a0';c.fillText(kind==='office-walk'?'交谈 · 职员':'交谈 · 游客',128,82);
   const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;materials.set(kind,new THREE.SpriteMaterial({map,depthWrite:false,fog:false}));
  }return materials.get(kind);
 }
 return {sync(people){for(const [p,badge]of badges)badge.visible=false;for(const p of people){if(!badges.has(p)){const badge=new THREE.Sprite(material(p.kind));badge.name='journey-meeting-'+p.kind;badge.scale.set(.9,.9*112/256,1);badge.position.y=2.64;p.root.add(badge);badges.set(p,badge);}badges.get(p).visible=true;}},tick(playing,pos){for(const [p,badge]of badges){badge.visible=!!playing&&p.journeyMeeting&&p.root.visible!==false&&p.root.position.distanceToSquared(pos)<100*100;badge.position.y=p.root.children.some(c=>c.name==='rain-umbrella'&&c.visible)?3.05:2.64;}}};
}
