import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const ARTIFACT_DIR = 'C:\\Users\\黄启言\\.gemini\\antigravity\\brain\\0231937a-9265-4d1e-87cd-cf1b3e60633a';
const profileDir = path.join(process.env.TEMP, 'chrome_modal_cap_' + Date.now());

const vite = spawn('npx', ['vite', '--port', '5240'], {
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
    '--remote-debugging-port=9250',
    '--user-data-dir=' + profileDir,
    '--window-size=1600,900',
    '--disable-gpu-sandbox',
    '--no-sandbox',
    '--enable-unsafe-webgpu',
    '--ignore-gpu-blocklist',
    '--use-gl=angle',
    '--use-angle=d3d11',
    'http://localhost:5240/'
  ]);

  let versionData = null;
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch('http://localhost:9250/json/version');
      versionData = await res.json();
      break;
    } catch {
      await delay(500);
    }
  }

  const targetsRes = await fetch('http://localhost:9250/json');
  const targets = await targetsRes.json();
  const pageTarget = targets.find(t => t.type === 'page');
  const cdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await cdp.connect();

  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await delay(4000);

  // Ensure update dialog is open
  await cdp.eval(`(() => {
    const d = document.getElementById('update-dialog');
    if (d && !d.open) d.showModal();
    d.scrollTop = 0;
  })()`);
  await delay(1500);

  console.log('Capturing initial version update dialog (top view)...');
  await cdp.screenshot('shot_final_version_update_dialog.png');

  // Scroll dialog to view Lujiazui comparison section
  await cdp.eval(`(() => {
    const dialog = document.getElementById('update-dialog');
    if (dialog) dialog.scrollTop = 560;
  })()`);
  await delay(1000);

  console.log('Capturing scrolled version update dialog (Lujiazui sky comparison view)...');
  await cdp.screenshot('shot_final_version_update_dialog_scroll.png');

  console.log('All modal screenshots captured successfully!');
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
