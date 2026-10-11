import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const ARTIFACT_DIR = 'C:\\Users\\黄启言\\.gemini\\antigravity\\brain\\0231937a-9265-4d1e-87cd-cf1b3e60633a';
const profileDir = path.join(process.env.TEMP, 'chrome_nj_cap_' + Date.now());

const vite = spawn('npx', ['vite', '--port', '5235'], {
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
    const fullPath = path.join(ARTIFACT_DIR, filename);
    fs.writeFileSync(fullPath, Buffer.from(res.data, 'base64'));
    console.log('Saved screenshot:', filename, 'to', fullPath);
    return fullPath;
  }
}

async function main() {
  await delay(3000);
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9245',
    '--user-data-dir=' + profileDir,
    '--window-size=1600,900',
    '--disable-gpu-sandbox',
    '--no-sandbox',
    '--enable-unsafe-webgpu',
    '--ignore-gpu-blocklist',
    '--use-gl=angle',
    '--use-angle=d3d11',
    'http://localhost:5235/'
  ]);

  let versionData = null;
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch('http://localhost:9245/json/version');
      versionData = await res.json();
      break;
    } catch {
      await delay(500);
    }
  }

  const targetsRes = await fetch('http://localhost:9245/json');
  const targets = await targetsRes.json();
  const pageTarget = targets.find(t => t.type === 'page');
  const cdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await cdp.connect();

  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
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

  // Position at -135, 26.5, 67.5 facing East along Nanjing Road at night
  await cdp.eval(`(() => {
    document.getElementById('update-dialog')?.close();
    if (!window.__game) return;
    window.__game.setActive(true);
    window.__game.setPos(-135.0, 26.5, 67.5);
    window.__game.setRotation(Math.PI * 0.5, 0.0);
    window.__game.setTime(168); // Night
    window.__game.render();
  })()`);
  await delay(3000);

  await cdp.screenshot('shot_nanjing_night_after_open.png');
  console.log('Captured Nanjing Night After screenshot!');
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
