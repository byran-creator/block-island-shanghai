import * as THREE from './three.module.js';

// Closed-loop scenic tour route along the perimeter commercial pedestrian streets of Yuyuan
// Total perimeter: ~450 meters encircling West Bazaar, South Street, East Bazaar and North Plaza
const TOUR_ROUTE = [
 [-100, 156],
 [-100, 210],
 [-100, 264],
 [-41,  264],
 [18,   264],
 [18,   210],
 [18,   156],
 [-41,  156]
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
 const yaw = Math.atan2(seg.to[0] - seg.from[0], seg.to[1] - seg.from[1]);
 return { x, z, yaw };
}

export function createYuyuanRickshaws({ scene, root, getPos, setView, place, notify, onEvent = () => {} }) {
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

  // 1. Double large spoked carriage wheels (双大木轮带铁圈)
  const wheels = [];
  const wheelR = 0.58;
  for (const side of [-1, 1]) {
   const wheelGroup = new THREE.Group();
   wheelGroup.position.set(side * 0.72, wheelR, 0);
   group.add(wheelGroup);

   // Outer iron rim
   const rim = new THREE.Mesh(new THREE.TorusGeometry(wheelR, 0.035, 6, 20), mat('#2a231d'));
   wheelGroup.add(rim);

   // Wooden wheel hub
   const hub = new THREE.Mesh(cyl, mat('#7b5534'));
   hub.rotation.z = Math.PI / 2;
   hub.scale.set(0.12, 0.14, 0.12);
   wheelGroup.add(hub);

   // Radial spokes
   for (let s = 0; s < 8; s++) {
    const sp = new THREE.Mesh(box, mat('#9a6f44'));
    sp.rotation.y = s * (Math.PI / 8);
    sp.scale.set(wheelR * 1.9, 0.024, 0.024);
    wheelGroup.add(sp);
   }

   // Curved brass mudguard
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
   seatOffset: new THREE.Vector3(0, 0.88, -0.05),
   pose: getRoutePose(initialDist)
  };
 }

 // Build 2 rickshaws spaced along the tour route
 rickshaws.push(buildRickshaw(1, 0));             // Near West bazaar North Entrance
 rickshaws.push(buildRickshaw(2, TOTAL_LENGTH / 2)); // Near Southeast Corner

 // Active passenger riding state
 let ride = null;
 let elapsed = 0;

 function tick(dt, keys = new Set()) {
  elapsed += dt;

  for (const r of rickshaws) {
   const isRidden = ride?.rickshaw === r;
   // Cruise at 4.6 m/s when carrying a passenger, or idle/crawl when empty
   r.targetSpeed = isRidden ? 4.6 : 0;
   r.speed = THREE.MathUtils.damp(r.speed, r.targetSpeed, 3.5, dt);

   if (r.speed > 0.01) {
    const travel = r.speed * dt;
    r.distance += travel;
    if (isRidden) {
     ride.lapDistance += travel;
    }

    // Spin wheels
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

   // Update position and heading along route
   r.pose = getRoutePose(r.distance);
   r.group.position.set(r.pose.x, 26.0, r.pose.z);
   r.group.rotation.y = r.pose.yaw;
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
  notify('车夫：客官坐稳嘞！环豫园老街一圈走起！(按 空格 或 V 随时下车)');
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
  const ry = r.group.rotation.y;

  // Gentle camera follow behind passenger seat looking forward through street
  const camDist = 3.6;
  const focus = { x: p.x, y: p.y + 1.45, z: p.z };
  const camX = p.x - Math.sin(ry) * camDist;
  const camY = p.y + 2.3;
  const camZ = p.z - Math.cos(ry) * camDist;

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
