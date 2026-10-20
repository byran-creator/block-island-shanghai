import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import * as THREE from '../game/three.module.js';
import {createBund} from '../game/bund.js';
import {VoxelWorld} from '../game/world.js';
import {BUND_CROSSWALKS} from '../game/crosswalk-layout.js';

// 1. CSS & Layout verification
const styleCss = await readFile('game/style.css', 'utf8');
const dialogueCss = await readFile('game/dialogue.css', 'utf8');
const metroJs = await readFile('game/metro.js', 'utf8');

// Metro caption mobile optimization
assert(styleCss.includes('.metro-caption'), 'style.css should style .metro-caption');
assert(styleCss.includes('max-height:520px'), 'style.css should have max-height:520px responsive rules');
assert(metroJs.includes('isMobile?(speaker+\' · \'+text)'), 'metro.js should display concise announcement on mobile');

// Landscape dialogue and quest browser rules
assert(dialogueCss.includes('@media(orientation: landscape) and (max-height:540px)'), 'dialogue.css should have landscape orientation media query');
assert(dialogueCss.includes('#tasks-dialog.quest-browser-dialog'), 'dialogue.css should style tasks dialog in landscape');
assert(dialogueCss.includes('#npc-dialog.conversation-dialog #npc-actions'), 'dialogue.css should place npc-actions in landscape');

// Landscape map dialog rules
assert(styleCss.includes('@media(orientation: landscape) and (max-height:540px)'), 'style.css should have landscape map media query');
assert(styleCss.includes('#large-map{height:min('), 'style.css should constrain large-map height on landscape');
assert(styleCss.includes('body.force-landscape dialog:modal'), 'style.css should support force-landscape modal rotation');

// 2. Bund Benches and Sitting Interaction
const savedDocument = globalThis.document;
globalThis.document = {
  createElement: () => ({
    getContext: () => ({
      fillRect(){}, clearRect(){}, save(){}, restore(){}, translate(){},
      scale(){}, rotate(){}, fill(){}, closePath(){}, fillText(){},
      beginPath(){}, arc(){}, stroke(){}, moveTo(){}, lineTo(){}
    })
  })
};

try {
  const scene = new THREE.Scene();
  const world = new VoxelWorld();
  let playerPos = {x: 0, y: 26, z: 84};
  let playerYaw = 0, playerPitch = 0;
  let lastNotification = '';

  const civil = createBund({
    scene,
    world,
    getPos: () => playerPos,
    notify: msg => { lastNotification = msg; },
    place: p => { Object.assign(playerPos, p); },
    setView: (yaw, pitch) => { playerYaw = yaw; playerPitch = pitch; }
  });

  // Verify benches exist and are placed along the promenade
  assert(Array.isArray(civil.benches) && civil.benches.length >= 20, 'Bund should have benches along the promenade');
  const bench = civil.benches[0];
  assert(typeof bench.x === 'number' && typeof bench.z === 'number', 'Bench coordinates should be numbers');
  assert.equal(bench.y, 26, 'Bench should be at promenade elevation Y=26');

  // Verify getNearBench
  playerPos = {x: bench.x + 0.3, y: 26, z: bench.z + 0.2};
  const nearBench = civil.getNearBench(playerPos);
  assert.equal(nearBench, bench, 'getNearBench should identify the nearby bench');
  assert(civil.getPrompt(playerPos).includes('坐在长椅上'), 'getPrompt should show sitting instruction');

  // Verify sitting down
  assert.equal(civil.isSeated(), false, 'Player should not be seated initially');
  assert.equal(civil.use(), true, 'civil.use() should sit player down when near bench');
  assert.equal(civil.isSeated(), true, 'Player should be seated after use()');
  assert(lastNotification.includes('已在外滩长椅坐下'), 'Notification should confirm sitting down');
  assert.equal(playerPos.x, bench.seatX, 'Player position should snap to bench seat');
  assert.equal(playerPos.y, bench.seatY, 'Player elevation should be seat height');
  assert.equal(playerYaw, bench.facingYaw, 'Player yaw should face east toward Huangpu River / Lujiazui');
  assert(-Math.sin(playerYaw)>.99,'The actual camera forward axis must face the river to the east');
  scene.updateMatrixWorld(true);
  let lampVertices=0,crossingVertices=0;
  const point=new THREE.Vector3();
  scene.traverse(m=>{
   if(!m.isMesh)return;
   const color=m.material.color?.getHex(),positions=m.geometry.attributes.position;
   if(color===0xffe2a1||color===0xc5bda5)for(let i=0;i<positions.count;i++){
    point.fromBufferAttribute(positions,i).applyMatrix4(m.matrixWorld);lampVertices++;
    assert(civil.benches.every(b=>Math.abs(b.z-point.z)>6.7),'Every actual lamp stays between seats, outside their forward view');
   }
   if(color===0xfaf4df)for(let i=0;i<positions.count;i+=4){
    const corners=Array.from({length:4},(_,j)=>new THREE.Vector3().fromBufferAttribute(positions,i+j).applyMatrix4(m.matrixWorld));
    const minX=Math.min(...corners.map(p=>p.x)),maxX=Math.max(...corners.map(p=>p.x)),minZ=Math.min(...corners.map(p=>p.z)),maxZ=Math.max(...corners.map(p=>p.z));
    assert(Math.abs(maxX-minX-.65)<1e-4&&Math.abs(maxZ-minZ-5.2)<1e-4,'Each bar follows the roadway rather than spanning the whole crossing');
    const x=(minX+maxX)/2,z=(minZ+maxZ)/2;
    assert.equal(BUND_CROSSWALKS.filter(c=>Math.abs(c.z-z)<1e-4&&c.stripes.some(s=>Math.abs(s-x)<1e-4)).length,1,'Each rendered stripe has exactly one crossing owner');
    crossingVertices+=4;
   }
  });
  assert(lampVertices>0);
  assert.equal(crossingVertices,BUND_CROSSWALKS.reduce((n,c)=>n+c.stripes.length*4,0));
  assert(civil.getPrompt().includes('起身'), 'getPrompt should indicate how to stand up');

  // Verify standing up via civil.use()
  assert.equal(civil.use(), true, 'civil.use() should stand player up when seated');
  assert.equal(civil.isSeated(), false, 'Player should no longer be seated');
  assert(lastNotification.includes('已起身'), 'Notification should confirm standing up');
  assert(playerPos.x > bench.seatX, 'Player should stand up forward in front of the bench');

  // Verify civil.sit() directly
  assert.equal(civil.sit(bench), true, 'civil.sit() should sit down directly');
  assert.equal(civil.isSeated(), true);
  assert.equal(civil.standUp(), true, 'civil.standUp() should stand up directly');
  assert.equal(civil.isSeated(), false);

  civil.sit(bench);
  playerPos = {x: -100, y: 26, z: 66};
  civil.leaveSeat();
  assert.equal(civil.isSeated(), false, 'Travel clears the old seat without moving the arrival point');
  assert.equal(civil.standUp(), false);
  assert.deepEqual(playerPos, {x: -100, y: 26, z: 66});

  console.log('PASS: Bund benches, refined teak/iron craftsmanship, sitting/standing interaction, and mobile landscape dialog layouts verified.');
} finally {
  globalThis.document = savedDocument;
}
