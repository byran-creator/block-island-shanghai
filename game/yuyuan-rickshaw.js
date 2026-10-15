import * as THREE from './three.module.js';
import { YUYUAN_SHIFT } from './yuyuan-layout.js';

// Closed-loop 4-corner scenic tour route encircling Yuyuan along its 4 pedestrian streets
const TOUR_ROUTE = [
 // 1. West Pedestrian Street (Southbound along x = -96.5, clear 18m wide avenue)
 [-96.5, 155.0],
 [-96.5, 185.0],
 [-96.5, 215.0],
 [-96.5, 248.0],
 [-96.5, 254.0],
 // Corner 1: West to South Smooth Turn (西南角平滑大圆角)
 [-94.5, 258.0],
 [-91.0, 260.0],
 [-86.0, 260.0],
 // 2. South Connecting Street (Eastbound along z = 260.0, 15米极宽南街中央)
 [-70.0, 260.0],
 [-45.0, 260.0],
 [-20.0, 260.0],
 [0.0,   260.0],
 [8.0,   260.0],
 // Corner 2: South to East Smooth Turn (东南角平滑大圆角)
 [14.0,  258.0],
 [17.5,  254.0],
 // 3. East Pedestrian Street (Northbound along x = 17.5, 9米繁华步行街正中央)
 [17.5,  245.0],
 [17.5,  220.0],
 [17.5,  190.0],
 [17.5,  162.0],
 [17.5,  154.0],
 // Corner 3: East to North Smooth Turn (东北角平滑大圆角)
 [14.5,  151.0],
 [10.0,  150.0],
 // 4. North Approach Plaza (Westbound along z = 150.0, 宽阔前庭广场)
 [0.0,   150.0],
 [-25.0, 150.0],
 [-46.5, 150.0],
 [-70.0, 150.0],
 [-86.0, 150.0],
 // Corner 4: North to West Smooth Turn (西北角平滑大圆角)
 [-92.5, 151.5],
 [-96.5, 155.0]
];

// Precompute cumulative arc length for smooth parametric progression
const SEGMENTS = [];
let TOTAL_LENGTH = 0;
for (let i = 0; i < TOUR_ROUTE.length; i++) {
 const a = TOUR_ROUTE[i], b = TOUR_ROUTE[(i + 1) % TOUR_ROUTE.length];
 const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
 SEGMENTS.push({ from: a, to: b, length: len, startDist: TOTAL_LENGTH });
 TOTAL_LENGTH += len;
}

function getRoutePose(distance) {
 const d = ((distance % TOTAL_LENGTH) + TOTAL_LENGTH) % TOTAL_LENGTH;
 const seg = SEGMENTS.find(s => d >= s.startDist && d < s.startDist + s.length) || SEGMENTS[0];
 const t = (d - seg.startDist) / (seg.length || 1);
 const x = seg.from[0] + t * (seg.to[0] - seg.from[0]);
 const z = seg.from[1] + t * (seg.to[1] - seg.from[1]);
 // Look ahead for continuous smooth curve tangent yaw (平滑四角转向)
 const dNext = (d + 1.2) % TOTAL_LENGTH;
 const segNext = SEGMENTS.find(s => dNext >= s.startDist && dNext < s.startDist + s.length) || seg;
 const tNext = (dNext - segNext.startDist) / (segNext.length || 1);
 const xNext = segNext.from[0] + tNext * (segNext.to[0] - segNext.from[0]);
 const zNext = segNext.from[1] + tNext * (segNext.to[1] - segNext.from[1]);
 const yaw = Math.atan2(xNext - x, zNext - z);
 return { x, z, yaw };
}

let rickshawAudioCtx = null;
let gameGetAudioFn = null;
function getRickshawAudio() {
 try {
  if (gameGetAudioFn) return gameGetAudioFn();
  rickshawAudioCtx ??= new (window.AudioContext || window.webkitAudioContext)();
  if (rickshawAudioCtx.state === 'suspended') rickshawAudioCtx.resume()?.catch?.(() => {});
  return rickshawAudioCtx;
 } catch { return null; }
}

// Authentic Old Shanghai Rickshaw Foot Pedal Bell (双音铜铃 "叮——当！")
function playRickshawBell() {
 const ctx = getRickshawAudio();
 if (!ctx) return;
 const now = ctx.currentTime;
 [[1760, 0, 0.42], [1318, 0.12, 0.45]].forEach(([freq, delay, dur]) => {
  try {
   const osc = ctx.createOscillator();
   const oscHarm = ctx.createOscillator();
   const gain = ctx.createGain();
   osc.type = 'sine'; osc.frequency.value = freq;
   oscHarm.type = 'triangle'; oscHarm.frequency.value = freq * 2.76;
   const t = now + delay;
   gain.gain.setValueAtTime(0.0001, t);
   gain.gain.exponentialRampToValueAtTime(0.09, t + 0.008);
   gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
   osc.connect(gain); oscHarm.connect(gain);
   gain.connect(ctx.destination);
   osc.start(t); osc.stop(t + dur + 0.02);
   oscHarm.start(t); oscHarm.stop(t + dur * 0.4);
  } catch {}
 });
}

// Authentic Chinese Male Vocal Hawking/Shouting Voice (真人男中音原声号子共振合成)
function playRickshawMaleVoice(type = 'warn') {
 const ctx = getRickshawAudio();
 if (!ctx) return;
 const now = ctx.currentTime;
 const syllables = type === 'mount' 
  ? [{ f0: 165, f0End: 145, dur: 0.22, delay: 0.15 }, { f0: 178, f0End: 152, dur: 0.35, delay: 0.42 }, { f0: 140, f0End: 110, dur: 0.48, delay: 0.82 }]
  : type === 'arrive'
  ? [{ f0: 172, f0End: 158, dur: 0.28, delay: 0.12 }, { f0: 164, f0End: 138, dur: 0.32, delay: 0.44 }, { f0: 145, f0End: 112, dur: 0.52, delay: 0.80 }]
  : [
    { f0: 182, f0End: 164, dur: 0.18, delay: 0.18 },
    { f0: 175, f0End: 150, dur: 0.22, delay: 0.40 },
    { f0: 195, f0End: 172, dur: 0.25, delay: 0.72 },
    { f0: 168, f0End: 122, dur: 0.55, delay: 1.02 }
  ];

 for (const syl of syllables) {
  try {
   const t = now + syl.delay;
   const osc = ctx.createOscillator();
   osc.type = 'sawtooth';
   osc.frequency.setValueAtTime(syl.f0, t);
   osc.frequency.exponentialRampToValueAtTime(Math.max(70, syl.f0End), t + syl.dur);

   const f1 = ctx.createBiquadFilter(); f1.type = 'bandpass'; f1.frequency.value = 620; f1.Q.value = 4.2;
   const f2 = ctx.createBiquadFilter(); f2.type = 'bandpass'; f2.frequency.value = 1320; f2.Q.value = 5.5;
   const f3 = ctx.createBiquadFilter(); f3.type = 'peaking'; f3.frequency.value = 2650; f3.gain.value = 8.0; f3.Q.value = 3.0;

   const gain = ctx.createGain();
   gain.gain.setValueAtTime(0.0001, t);
   gain.gain.exponentialRampToValueAtTime(0.12, t + 0.04);
   gain.gain.exponentialRampToValueAtTime(0.0001, t + syl.dur);

   osc.connect(f1); f1.connect(f2); f2.connect(f3); f3.connect(gain);
   gain.connect(ctx.destination);

   osc.start(t);
   osc.stop(t + syl.dur + 0.02);
  } catch {}
 }
}

// Authentic Hawking Voice Synthesis (结合浏览器原生中文真人发音 + 双音铜铃 + 喉鸣共振)
function speakRickshawHawking(text, type = 'warn') {
 playRickshawBell();
 playRickshawMaleVoice(type);
 if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  try {
   if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
   const utt = new SpeechSynthesisUtterance(text);
   utt.lang = 'zh-CN';
   utt.rate = 1.15;
   utt.pitch = 0.92;
   const voices = window.speechSynthesis.getVoices();
   const zhVoices = voices.filter(v => v.lang && (v.lang.includes('zh') || v.lang.includes('cmn')));
   const maleVoice = zhVoices.find(v => /male|男|yunyang|kangkang|breeze|qiang/i.test(v.name)) || zhVoices[0];
   if (maleVoice) utt.voice = maleVoice;
   window.speechSynthesis.speak(utt);
  } catch {}
 }
}

export function createYuyuanRickshaws({ scene, root, getPos, setView, place, notify, onEvent = () => {}, getAudio = null, getPedestrians = () => [] }) {
 if (getAudio) gameGetAudioFn = getAudio;
 const rickshaws = [];
 const box = new THREE.BoxGeometry(1, 1, 1);
 const cyl = new THREE.CylinderGeometry(1, 1, 1, 16);
 const mats = new Map();
 const mat = (color, glow = false) => {
  const k = color + glow;
  if (!mats.has(k)) mats.set(k, glow ? new THREE.MeshBasicMaterial({ color }) : new THREE.MeshLambertMaterial({ color }));
  return mats.get(k);
 };

 function buildRickshaw(id, initialDist) {
  const group = new THREE.Group();
  group.name = 'yuyuan-rickshaw-' + id;
  root.add(group);

  // 1. Double large spoked carriage wheels (垂直立式双大木轮带铁圈，符合真实物理顺畅向前滚动)
  const wheels = [];
  const wheelR = 0.58;
  for (const side of [-1, 1]) {
   const wheelGroup = new THREE.Group();
   wheelGroup.position.set(side * 0.72, wheelR, 0);
   group.add(wheelGroup);

   // Outer iron rim: rotated into vertical YZ plane (normal along X axle)
   const rim = new THREE.Mesh(new THREE.TorusGeometry(wheelR, 0.035, 6, 20), mat('#2a231d'));
   rim.rotation.y = Math.PI / 2;
   wheelGroup.add(rim);

   // Wooden wheel hub: cylinder horizontal along X axle
   const hub = new THREE.Mesh(cyl, mat('#7b5534'));
   hub.rotation.z = Math.PI / 2;
   hub.scale.set(0.12, 0.14, 0.12);
   wheelGroup.add(hub);

   // Radial spokes: strictly within the vertical YZ rolling plane
   for (let s = 0; s < 8; s++) {
    const sp = new THREE.Mesh(box, mat('#9a6f44'));
    sp.rotation.x = s * (Math.PI / 8);
    sp.scale.set(0.024, wheelR * 1.92, 0.024);
    wheelGroup.add(sp);
   }

   // Curved brass mudguard fixed to chassis above wheel in YZ plane
   const mudguard = new THREE.Mesh(new THREE.TorusGeometry(wheelR + 0.06, 0.03, 4, 14, Math.PI * 0.75), mat('#a88746'));
   mudguard.position.set(side * 0.72, wheelR, 0);
   mudguard.rotation.y = Math.PI / 2;
   mudguard.rotation.x = Math.PI * 0.12;
   group.add(mudguard);

   wheels.push(wheelGroup);
  }

  // 2. Chassis body frame & floorboard (黑漆车身底盘与脚踏板)
  const floor = new THREE.Mesh(box, mat('#1c1713'));
  floor.position.set(0, 0.52, 0.1);
  floor.scale.set(1.2, 0.08, 1.35);
  group.add(floor);

  // Footboard step
  const step = new THREE.Mesh(box, mat('#3b2b1e'));
  step.position.set(0, 0.38, 0.82);
  step.scale.set(0.9, 0.05, 0.38);
  group.add(step);

  // 3. Padded Passenger Seat with Armrests (深红软绒乘客软座与靠背扶手)
  const cushion = new THREE.Mesh(box, mat('#7a1f1d'));
  cushion.position.set(0, 0.76, -0.05);
  cushion.scale.set(1.05, 0.18, 0.65);
  group.add(cushion);

  const backrest = new THREE.Mesh(box, mat('#661715'));
  backrest.position.set(0, 1.18, -0.36);
  backrest.rotation.x = -0.12;
  backrest.scale.set(1.05, 0.68, 0.14);
  group.add(backrest);

  for (const side of [-1, 1]) {
   const armrest = new THREE.Mesh(box, mat('#8c633a'));
   armrest.position.set(side * 0.56, 1.02, -0.05);
   armrest.scale.set(0.08, 0.34, 0.7);
   group.add(armrest);
  }

  // 4. Arched Folding Sun Canopy (折叠防雨车篷)
  const canopy = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 1.16, 12, 1, true, Math.PI, Math.PI * 0.85), mat('#221c17'));
  canopy.position.set(0, 1.48, -0.32);
  canopy.rotation.z = Math.PI / 2;
  canopy.rotation.y = Math.PI / 2;
  group.add(canopy);

  // Canopy brass trim hoops
  for (const zOffset of [-0.48, 0, 0.48]) {
   const hoop = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.02, 4, 16, Math.PI * 0.85), mat('#c8a855'));
   hoop.position.set(zOffset, 1.48, -0.32);
   hoop.rotation.y = Math.PI / 2;
   hoop.rotation.x = Math.PI * 0.08;
   group.add(hoop);
  }

  // 5. Brass Carriage Lanterns on Left and Right (左右精工铜制马灯)
  for (const side of [-1, 1]) {
   const lanternPost = new THREE.Mesh(box, mat('#c8a855'));
   lanternPost.position.set(side * 0.64, 1.12, 0.28);
   lanternPost.scale.set(0.04, 0.22, 0.04);
   group.add(lanternPost);

   const lanternLamp = new THREE.Mesh(box, mat('#ffd255', true));
   lanternLamp.position.set(side * 0.64, 1.25, 0.28);
   lanternLamp.scale.set(0.12, 0.16, 0.12);
   group.add(lanternLamp);
  }

  // 6. Pulling Shafts & Crossbar (双木车辕杆与拉手横梁)
  for (const side of [-1, 1]) {
   const shaft = new THREE.Mesh(box, mat('#8c633a'));
   shaft.position.set(side * 0.42, 0.58, 1.55);
   shaft.rotation.x = -0.06;
   shaft.scale.set(0.06, 0.06, 1.6);
   group.add(shaft);
  }
  const handleBar = new THREE.Mesh(cyl, mat('#baa05e'));
  handleBar.position.set(0, 0.64, 2.32);
  handleBar.rotation.z = Math.PI / 2;
  handleBar.scale.set(0.035, 0.92, 0.035);
  group.add(handleBar);

  // 7. Authentic Puller NPC (车夫 NPC: 短打蓝衫、毛巾搭肩、草帽、奔跑动画)
  const puller = new THREE.Group();
  puller.position.set(0, 0, 2.15);
  group.add(puller);

  // Torso (蓝布短打汗衫)
  const torso = new THREE.Mesh(box, mat('#3a5574'));
  torso.position.set(0, 1.08, 0);
  torso.rotation.x = 0.22; // leaning slightly forward pulling weight
  torso.scale.set(0.42, 0.56, 0.26);
  puller.add(torso);

  // White sweat towel draped over shoulder (白毛巾搭肩)
  const towel = new THREE.Mesh(box, mat('#f0f2f5'));
  towel.position.set(0.12, 1.28, 0.02);
  towel.scale.set(0.14, 0.24, 0.28);
  puller.add(towel);

  // Head and traditional conical straw hat (面庞与竹编斗笠)
  const head = new THREE.Mesh(box, mat('#d29a6e'));
  head.position.set(0, 1.48, 0.1);
  head.scale.set(0.24, 0.26, 0.24);
  puller.add(head);

  const strawHat = new THREE.Mesh(new THREE.ConeGeometry(0.38, 0.14, 12), mat('#b59868'));
  strawHat.position.set(0, 1.63, 0.1);
  puller.add(strawHat);

  // Arms gripping the pulling shafts
  const leftArm = new THREE.Mesh(box, mat('#3a5574'));
  leftArm.position.set(-0.27, 0.95, 0.12);
  leftArm.rotation.x = -0.55;
  leftArm.scale.set(0.11, 0.44, 0.11);
  puller.add(leftArm);

  const rightArm = new THREE.Mesh(box, mat('#3a5574'));
  rightArm.position.set(0.27, 0.95, 0.12);
  rightArm.rotation.x = -0.55;
  rightArm.scale.set(0.11, 0.44, 0.11);
  puller.add(rightArm);

  // Articulated legs for authentic running locomotion
  const leftLeg = new THREE.Mesh(box, mat('#2d3848'));
  leftLeg.position.set(-0.14, 0.42, 0);
  leftLeg.scale.set(0.15, 0.68, 0.18);
  puller.add(leftLeg);

  const rightLeg = new THREE.Mesh(box, mat('#2d3848'));
  rightLeg.position.set(0.14, 0.42, 0);
  rightLeg.scale.set(0.15, 0.68, 0.18);
  puller.add(rightLeg);

  return {
   id,
   group,
   wheels,
   puller,
   torso,
   leftLeg,
   rightLeg,
   distance: initialDist,
   speed: 0,
   targetSpeed: 0,
   lateralOffset: 0,
   targetLateralOffset: 0,
   prevLateralOffset: 0,
   avoidLockTime: 0,
   lastAvoidVoiceTime: 0,
   seatOffset: new THREE.Vector3(0, 0.88, -0.05),
   pose: getRoutePose(initialDist)
  };
 }

 // Build 8 rickshaws spaced along the 4-street tour route (增加至8辆黄包车分布四条街区)
 for (let i = 0; i < 8; i++) {
  rickshaws.push(buildRickshaw(i + 1, TOTAL_LENGTH * (i / 8)));
 }

 // Active passenger riding state
 let ride = null;
 let elapsed = 0;
 let lastVoiceTime = 0;
 let lastPasserbyVoiceTime = 0;

 function tick(dt, keys = new Set(), externalPedestrians = null) {
  elapsed += dt;
  const peds = externalPedestrians ?? (getPedestrians ? getPedestrians() : []);

  for (const r of rickshaws) {
   const isRidden = ride?.rickshaw === r;
   const yaw = r.pose.yaw;
   const fx = Math.sin(yaw), fz = Math.cos(yaw);
   const nx = Math.cos(yaw), nz = -Math.sin(yaw);

   // 1. Collect all nearby obstacles in front
   const allObstacles = [];
   if (!ride || ride.rickshaw !== r) {
    const pp = getPos?.();
    if (pp && Math.abs(pp.y - 26.0) < 2.0) allObstacles.push(pp);
   }
   for (let i = 0; i < peds.length; i++) {
    const p = peds[i];
    if (!p) continue;
    const px = p.root ? p.root.position.x : p.x;
    const pz = p.root ? (p.root.position.z - YUYUAN_SHIFT) : p.z;
    if (!Number.isFinite(px) || !Number.isFinite(pz)) continue;
    if (Math.abs(px - r.pose.x) > 7.5 || Math.abs(pz - r.pose.z) > 7.5) continue;
    allObstacles.push({ x: px, z: pz });
   }
   for (let i = 0; i < rickshaws.length; i++) {
    const o = rickshaws[i];
    if (o !== r) allObstacles.push(o.group.position);
   }

   // 2. Multi-lane clearance evaluation with hysteresis (彻底消除人多时左右摇晃与卡死)
   const candidateLanes = [-1.35, 0, 1.35];
   const laneScores = [0, 0, 0];
   let minFwdDistance = 999;
   let directlyBlocked = false;

   for (let i = 0; i < allObstacles.length; i++) {
    const ob = allObstacles[i];
    const dx = ob.x - r.pose.x;
    const dz = ob.z - r.pose.z;
    const fwd = dx * fx + dz * fz;
    if (fwd < 0.3 || fwd > 6.8) continue;
    const lat = dx * nx + dz * nz;
    if (Math.abs(lat) > 3.0) continue;

    const urgency = (6.8 - fwd) / 6.5;

    for (let l = 0; l < 3; l++) {
     const laneOffset = candidateLanes[l];
     const distToLane = Math.abs(lat - laneOffset);
     if (distToLane < 1.35) {
      laneScores[l] += urgency * 2.0;
     }
    }

    const currentDistToCart = Math.abs(lat - r.lateralOffset);
    if (currentDistToCart < 1.1) {
     if (fwd < minFwdDistance) minFwdDistance = fwd;
     if (fwd < 2.4) directlyBlocked = true;
    }
   }

   // Hysteresis bias: penalty against toggling lanes unless significantly clearer
   for (let l = 0; l < 3; l++) {
    if (candidateLanes[l] === 0) laneScores[l] -= 0.15;
    if (candidateLanes[l] !== r.targetLateralOffset) {
     laneScores[l] += 0.45;
    }
   }

   r.avoidLockTime = Math.max(0, (r.avoidLockTime || 0) - dt);

   if (directlyBlocked || minFwdDistance < 4.8) {
    if (r.avoidLockTime <= 0 || directlyBlocked) {
     let bestLane = candidateLanes[0];
     let lowestScore = laneScores[0];
     for (let l = 1; l < 3; l++) {
      if (laneScores[l] < lowestScore) {
       lowestScore = laneScores[l];
       bestLane = candidateLanes[l];
      }
     }
     if (bestLane !== r.targetLateralOffset) {
      r.targetLateralOffset = bestLane;
      r.avoidLockTime = 2.2;
     }
    }

    if (elapsed - r.lastAvoidVoiceTime > 4.2) {
     r.lastAvoidVoiceTime = elapsed;
     const calls = ['借光！借光！车来喽——！', '让一让嘞！车来喽！', '留神脚下，让条道嘞！'];
     const shout = calls[Math.floor(Math.random() * calls.length)];
     speakRickshawHawking(shout, 'warn');
     notify('车夫及时避让路人：' + shout);
    }
   } else if (r.avoidLockTime <= 0) {
    r.targetLateralOffset = 0;
   }

   r.lateralOffset = THREE.MathUtils.damp(r.lateralOffset, r.targetLateralOffset, 3.2, dt);

   // 3. Smooth forward speed: continuous non-stopping flow, never freezes indefinitely
   let targetBaseSpeed = isRidden ? 4.8 : 2.0;

   // Inter-rickshaw safe headway
   for (let i = 0; i < rickshaws.length; i++) {
    const o = rickshaws[i];
    if (o === r) continue;
    const distDiff = (o.distance - r.distance + TOTAL_LENGTH) % TOTAL_LENGTH;
    if (distDiff > 0.4 && distDiff < 6.0) {
     targetBaseSpeed = Math.min(targetBaseSpeed, Math.max(0.6, o.speed * 0.9));
     if (distDiff < 2.5) targetBaseSpeed = 0.4;
    }
   }

   if (minFwdDistance < 0.6) {
    targetBaseSpeed = 0.0;
   } else if (minFwdDistance < 1.4) {
    targetBaseSpeed = Math.min(targetBaseSpeed, 0.7);
   } else if (minFwdDistance < 2.6) {
    targetBaseSpeed = Math.min(targetBaseSpeed, 1.6);
   } else if (minFwdDistance < 5.0) {
    targetBaseSpeed = Math.min(targetBaseSpeed, 2.8);
   }

   r.targetSpeed = targetBaseSpeed;
   r.speed = THREE.MathUtils.damp(r.speed, r.targetSpeed, targetBaseSpeed < r.speed ? 4.5 : 2.5, dt);

   if (r.speed > 0.01) {
    const travel = r.speed * dt;
    r.distance += travel;
    if (isRidden) {
     ride.lapDistance += travel;
     if (elapsed - lastVoiceTime > 9) {
      lastVoiceTime = elapsed;
      const calls = [
       '借光！借光！车来喽——！',
       '让一让嘞！车来喽！',
       '借光借光，留神脚下！',
       '车来喽！客官慢走！'
      ];
      const shout = calls[Math.floor(Math.random() * calls.length)];
      speakRickshawHawking(shout, 'warn');
      notify('车夫吆喝：' + shout);
     }
    } else if (!ride) {
     const p = getPos();
     const dist = Math.hypot(p.x - r.group.position.x, p.z - r.group.position.z);
     if (dist < 13.0 && Math.abs(p.y - 26.0) < 2.5 && elapsed - lastPasserbyVoiceTime > 8) {
      lastPasserbyVoiceTime = elapsed;
      const shout = '借光！借光！车来喽——！';
      speakRickshawHawking(shout, 'warn');
      notify('黄包车夫吆喝：借光！借光！车来喽——！');
     }
    }

    // 4. Spin wheels vertically along rolling contact axis (垂直立式顺畅前滚)
    const wheelRot = travel / 0.58;
    for (const w of r.wheels) {
     w.rotation.x += wheelRot;
    }

    // Stride legs and bob torso
    const strideFreq = r.speed * 4.2;
    r.leftLeg.rotation.x = Math.sin(elapsed * strideFreq) * 0.65;
    r.rightLeg.rotation.x = -Math.sin(elapsed * strideFreq) * 0.65;
    r.torso.position.y = 1.08 + Math.abs(Math.sin(elapsed * strideFreq * 2)) * 0.04;
   } else {
    r.leftLeg.rotation.x = 0;
    r.rightLeg.rotation.x = 0;
    r.torso.position.y = 1.08;
   }

   // 5. Update position with dynamic lateral avoidance offset and natural steer yaw
   r.pose = getRoutePose(r.distance);
   r.group.position.set(r.pose.x + nx * r.lateralOffset, 26.0, r.pose.z + nz * r.lateralOffset);
   const latDelta = (r.lateralOffset - (r.prevLateralOffset ?? r.lateralOffset)) / Math.max(0.001, dt);
   r.prevLateralOffset = r.lateralOffset;
   const steerAngle = Math.max(-0.22, Math.min(0.22, Math.atan2(latDelta, Math.max(1.0, r.speed)) * 0.35));
   r.group.rotation.y = r.pose.yaw + steerAngle;
  }

  // Handle passenger riding mechanics
  if (ride) {
   const r = ride.rickshaw;
   const p = r.group.position;
   const yaw = r.group.rotation.y;

   // Bind player position to the padded passenger seat
   const seatX = p.x - Math.sin(yaw) * ride.rickshaw.seatOffset.z + Math.cos(yaw) * ride.rickshaw.seatOffset.x;
   const seatZ = p.z - Math.cos(yaw) * ride.rickshaw.seatOffset.z - Math.sin(yaw) * ride.rickshaw.seatOffset.x;
   const seatY = p.y + ride.rickshaw.seatOffset.y;
   place({ x: seatX, y: seatY, z: seatZ });

   // 1. Player presses Space or KeyV to dismount at any time
   if (keys.has('Space')) {
    dismount('随时下车');
    return;
   }

   // 2. Auto dismount after completing 1 full scenic lap (~450m)
   if (ride.lapDistance >= TOTAL_LENGTH - 5) {
    dismount('全程到站');
    return;
   }
  }
 }

 function mount(r) {
  ride = {
   rickshaw: r,
   startDistance: r.distance,
   lapDistance: 0,
   from: { ...getPos() }
  };
  r.targetSpeed = 4.6;
  setView(r.pose.yaw, -0.08);
  lastVoiceTime = elapsed;
  speakRickshawHawking('客官坐稳喽！环豫园老街一圈走起！', 'mount');
  notify('车夫：客官坐稳喽！环豫园老街一圈走起！(按 空格 或 V 随时下车)');
  onEvent({ type: 'yuyuan-rickshaw-ride' });
 }

 function dismount(reason = '下车') {
  if (!ride) return;
  const r = ride.rickshaw;
  const p = r.group.position;
  const yaw = r.group.rotation.y;

  // Step off safely to the sidewalk side
  const exitX = p.x + Math.cos(yaw) * 1.5;
  const exitZ = p.z - Math.sin(yaw) * 1.5;
  place({ x: exitX, y: 26.0, z: exitZ });

  r.speed = 0;
  r.targetSpeed = 0;
  ride = null;

  const farewell = reason === '全程到站' ? '客官，到站嘞！一圈老街逛完咯，您请慢走！' : '客官请慢走！祝您游园愉快！';
  speakRickshawHawking(farewell, 'arrive');
  if (reason === '全程到站') {
   notify('车夫：客官，到站嘞！一圈老街逛完咯，您请慢走！');
  } else {
   notify('已下黄包车。祝您游园愉快！');
  }
 }

 function use() {
  if (ride) {
   dismount('主动下车');
   return true;
  }
  const p = getPos();
  const near = rickshaws.find(r => {
   const rp = r.group.position;
   return Math.hypot(p.x - rp.x, p.z - rp.z) < 3.8 && Math.abs(p.y - rp.y) < 2.5;
  });
  if (near) {
   mount(near);
   return true;
  }
  return false;
 }

 function cameraPose(yaw, pitch) {
  if (!ride) return null;
  const r = ride.rickshaw;
  const p = r.group.position;
  const worldZ = p.z + YUYUAN_SHIFT;
  const ry = r.group.rotation.y;

  // Gentle camera follow behind passenger seat looking forward through street
  const camDist = 3.6;
  const focusY = p.y + 1.45;
  const camX = p.x - Math.sin(ry) * camDist;
  const camY = p.y + 2.3;
  const camZ = worldZ - Math.cos(ry) * camDist;
  const focus = {
   x: p.x + Math.sin(ry) * 2.5,
   y: focusY,
   z: worldZ + Math.cos(ry) * 2.5
  };

  return {
   position: { x: camX, y: camY, z: camZ },
   focus
  };
 }

 return {
  rickshaws,
  tick,
  use,
  isRiding: () => !!ride,
  cameraPose,
  dismount
 };
}
