import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const ARTIFACT_DIR = 'C:\\Users\\黄启言\\.gemini\\antigravity\\brain\\0231937a-9265-4d1e-87cd-cf1b3e60633a';
const PREVIEW_DIR = 'c:\\Users\\黄启言\\Desktop\\我的世界gemini\\preview';
const profileDir = path.join(process.env.TEMP, 'chrome_cap_verify_' + Date.now());

const vite = spawn('npx', ['vite', '--port', '5218'], {
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
    if (!fs.existsSync(PREVIEW_DIR)) fs.mkdirSync(PREVIEW_DIR, { recursive: true });
    const previewPath = path.join(PREVIEW_DIR, filename);
    fs.writeFileSync(previewPath, Buffer.from(res.data, 'base64'));
    console.log('Saved screenshot:', filename, 'to', fullPath);
    return fullPath;
  }
}

async function main() {
  console.log('Waiting for Vite server on 5218...');
  await delay(3000);

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9238',
    '--user-data-dir=' + profileDir,
    '--window-size=1600,900',
    '--disable-gpu-sandbox',
    '--no-sandbox',
    '--enable-unsafe-webgpu',
    '--ignore-gpu-blocklist',
    '--use-gl=angle',
    '--use-angle=d3d11',
    'http://localhost:5218/game/'
  ]);

  let versionData = null;
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch('http://localhost:9238/json/version');
      versionData = await res.json();
      break;
    } catch {
      await delay(500);
    }
  }

  if (!versionData) throw new Error('Chrome failed to start or debug port unavailable');

  const targetsRes = await fetch('http://localhost:9238/json');
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
    document.body.classList.remove('in-menu');
    document.getElementById('menu')?.classList.add('hidden');
    document.getElementById('play')?.click();
  `);
  await delay(5000);

  // Shot 1: In front of Nanjing Road Pedestrian Street Stele, showing the 4-way traffic light, zebra crossing, and cars stopping
  console.log('Shot 1: In front of Nanjing Stele entrance with 4-way signal...');
  await cdp.eval(`(() => {
    if (!window.__game) return;
    window.__game.setActive(true);
    // Stand east of the road looking west towards the Stele and the new signal mast
    window.__game.teleport({x: -20.0, y: 26.5, z: 66.0});
    window.__game.setRotation(Math.PI * 0.5, -0.04);
    window.__game.setTime(65); // Daytime
    window.__game.render();
  })()`);
  await delay(3000);
  await cdp.screenshot('shot_nanjing_stele_traffic_signal.png');

  // Shot 2: In front of Lao Feng Xiang and Metro Exit 4, showing 100% solid ground in front of shop doors
  console.log('Shot 2: Ground in front of shops beside subway exit (Lao Feng Xiang doorway)...');
  await cdp.eval(`(() => {
    if (!window.__game) return;
    window.__game.setActive(true);
    // Stand outside Lao Feng Xiang doorway at x = -113, looking south down at shop entrance & pavement
    window.__game.teleport({x: -113.0, y: 26.5, z: 68.5});
    window.__game.setRotation(Math.PI, -0.28);
    window.__game.setTime(65);
    window.__game.render();
  })()`);
  await delay(3000);
  await cdp.screenshot('shot_shop_entrance_solid_ground.png');

  // Shot 3: Street view showing the escalator canopy entrance opening and solid ground extending past the shop
  console.log('Shot 3: Escalator entrance opening and solid continuous street pavement...');
  await cdp.eval(`(() => {
    if (!window.__game) return;
    window.__game.setActive(true);
    // Stand east of Exit 4 canopy looking west along Nanjing Road
    window.__game.teleport({x: -101.5, y: 26.5, z: 67.5});
    window.__game.setRotation(Math.PI * 0.5, -0.08);
    window.__game.setTime(65);
    window.__game.render();
  })()`);
  await delay(3000);
  await cdp.screenshot('shot_metro_entrance_opening_and_pavement.png');

  // Shot 4: Bund looking East across Huangpu River at Lujiazui skyline
  console.log('Shot 4: Bund promenade looking East at Lujiazui Skyline...');
  await cdp.eval(`(() => {
    if (!window.__game) return;
    window.__game.setActive(true);
    window.__game.teleport({x: 23.5, y: 27.0, z: 66.0});
    window.__game.setRotation(-Math.PI * 0.5, 0.08);
    window.__game.setTime(65);
    window.__game.render();
  })()`);
  await delay(4000);
  await cdp.screenshot('shot_lujiazui_skyline_bund_view.png');

  console.log('All verification screenshots captured successfully!');
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
