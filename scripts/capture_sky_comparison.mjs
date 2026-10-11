import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const ARTIFACT_DIR = 'C:\\Users\\黄启言\\.gemini\\antigravity\\brain\\0231937a-9265-4d1e-87cd-cf1b3e60633a';
const profileDir = path.join(process.env.TEMP, 'chrome_sky_cap_' + Date.now());

const vite = spawn('npx', ['vite', '--port', '5230'], {
  cwd: 'c:\\Users\\黄启言\\Desktop\\我的世界gemini',
  shell: true
});

let chrome = null;

async function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
      this.ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const { resolve, reject } = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) reject(new Error(msg.error.message || JSON.stringify(msg.error)));
          else resolve(msg.result);
        }
      };
    });
  }

  async send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(code) {
    return this.send('Runtime.evaluate', { expression: code, returnByValue: true });
  }

  async screenshot(filename) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    if (!fs.existsSync(ARTIFACT_DIR)) fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
    const fullPath = path.join(ARTIFACT_DIR, filename);
    fs.writeFileSync(fullPath, Buffer.from(res.data, 'base64'));
    console.log('Saved screenshot:', filename, 'to', fullPath);
    return fullPath;
  }
}

async function main() {
  console.log('Waiting for Vite server on 5230...');
  await delay(3000);

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9240',
    '--user-data-dir=' + profileDir,
    '--window-size=1600,900',
    '--disable-gpu-sandbox',
    '--no-sandbox',
    '--enable-unsafe-webgpu',
    '--ignore-gpu-blocklist',
    '--use-gl=angle',
    '--use-angle=d3d11',
    'http://localhost:5230/'
  ]);

  let versionData = null;
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch('http://localhost:9240/json/version');
      versionData = await res.json();
      break;
    } catch {
      await delay(500);
    }
  }

  if (!versionData) throw new Error('Chrome failed to start or debug port unavailable');

  const targetsRes = await fetch('http://localhost:9240/json');
  const targets = await targetsRes.json();
  const pageTarget = targets.find(t => t.type === 'page');
  if (!pageTarget) throw new Error('No page target found');

  const cdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await cdp.connect();
  console.log('Connected to CDP');

  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  console.log('Waiting for initial load and entering game...');
  await delay(5000);

  await cdp.eval(`
    if (globalThis.__game) {
      globalThis.__game.setActive(true);
    }
    document.getElementById('update-dialog')?.close();
    document.body.classList.remove('in-menu');
    document.getElementById('menu')?.classList.add('hidden');
    document.getElementById('play')?.click();
  `);
  await delay(5000);

  // Frame Bund promenade looking up at Lujiazui skyline and sun/clouds
  console.log('Framing Lujiazui skyline and sky from the Bund...');
  await cdp.eval(`(() => {
    document.getElementById('update-dialog')?.close();
    if (!window.__game) return;
    window.__game.setActive(true);
    window.__game.setPos(24.0, 27.0, 75.0);
    window.__game.setRotation(-1.35, 0.22);
    window.__game.setTime(38); // Morning bright sun in sky
    window.__game.render();
  })()`);
  await delay(3000);

  // Capture CURRENT upgraded sky (After)
  console.log('Capturing current upgraded sky (After)...');
  await cdp.screenshot('shot_sky_current_after.png');

  // Now emulate earliest sky (Before): plain sphere sun with simple halo, opaque sphere clouds, simple background
  console.log('Injecting earliest sky components...');
  await cdp.eval(`(() => {
    const { scene, THREE, sunBlock, clouds } = window.__game;
    
    // Hide current clouds
    if (clouds) clouds.visible = false;
    
    // Hide current sun custom elements/corona
    sunBlock.children.forEach(c => c.visible = false);
    
    // Replace sunBlock geometry and material with earliest SphereGeometry(7, 32, 20) #fff8ce
    const oldSunGeo = sunBlock.geometry;
    const oldSunMat = sunBlock.material;
    sunBlock.geometry = new THREE.SphereGeometry(7, 32, 20);
    sunBlock.material = new THREE.MeshBasicMaterial({ color: '#fff8ce' });
    
    // Add earliest simple halo SphereGeometry(8.7, 24, 14) opacity .14
    const earlyHalo = new THREE.Mesh(
      new THREE.SphereGeometry(8.7, 24, 14),
      new THREE.MeshBasicMaterial({ color: '#ffc85b', transparent: true, opacity: 0.14, depthWrite: false, fog: false })
    );
    earlyHalo.name = 'earliest-halo';
    sunBlock.add(earlyHalo);
    
    // Create earliest clouds: MeshLambertMaterial SphereGeometry clumps
    const earlyClouds = new THREE.Group();
    earlyClouds.name = 'earliest-clouds';
    const cloudMat = new THREE.MeshLambertMaterial({ color: '#ffffff', vertexColors: true });
    const cloudGeo = new THREE.SphereGeometry(1, 12, 8);
    const colors = [];
    for (let i = 0; i < cloudGeo.attributes.normal.count; i++) {
      const shade = 0.72 + 0.28 * Math.max(0, cloudGeo.attributes.normal.getY(i));
      colors.push(shade, shade, Math.min(1, shade + 0.04));
    }
    cloudGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    for (let i = 0; i < 22; i++) {
      const root = new THREE.Group();
      root.position.set(-145 + ((i * 89) % 490), 147 + ((i % 4) * 5), -125 + ((i * 137) % 450));
      const s = 0.75 + (i % 5) * 0.12;
      for (const [x, y, z, rx, ry, rz] of [
        [0, 0, 0, 11, 2.2, 6],
        [-7, 1.2, 0.5, 5, 3.8, 4],
        [6, 1.4, 0, 6, 4.8, 4.5],
        [-2, 3, -0.5, 6.2, 5.6, 5],
        [2, 2.2, 3, 5.5, 4.2, 4],
        [-3, 1, -3.5, 5, 3.2, 3.5]
      ]) {
        const m = new THREE.Mesh(cloudGeo, cloudMat);
        m.position.set(x * s, y * s, z * s);
        m.scale.set(rx * s, ry * s, rz * s);
        root.add(m);
      }
      root.rotation.y = i * 1.73;
      earlyClouds.add(root);
    }
    scene.add(earlyClouds);
    
    // Set earliest flat sky background
    scene.background = new THREE.Color('#9fd4e8');
    scene.fog.color = new THREE.Color('#9fd4e8');
    
    window.__game.render();
  })()`);
  await delay(3000);

  // Capture EARLIEST sky (Before)
  console.log('Capturing earliest sky (Before)...');
  await cdp.screenshot('shot_sky_earliest_before.png');

  console.log('Done capturing sky comparisons!');
  try { chrome.kill(); } catch {}
  try { vite.kill(); } catch {}
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  try { if (chrome) chrome.kill(); } catch {}
  try { if (vite) vite.kill(); } catch {}
  process.exit(1);
});
