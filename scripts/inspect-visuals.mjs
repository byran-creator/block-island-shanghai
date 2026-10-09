import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const ARTIFACT_DIR = 'C:\\Users\\黄启言\\.gemini\\antigravity\\brain\\0231937a-9265-4d1e-87cd-cf1b3e60633a';
const profileDir = path.join(process.env.TEMP, 'chrome_inspect_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9227',
  '--user-data-dir=' + profileDir,
  '--no-first-run',
  '--window-size=1280,720',
  'http://localhost:5173/'
]);

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

  send(method, params = {}) {
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
    console.log('Saved:', fullPath);
    return fullPath;
  }

  close() {
    this.ws.close();
  }
}

async function run() {
  await delay(2500);
  const list = await (await fetch('http://127.0.0.1:9227/json/list')).json();
  const target = list.find(t => t.type === 'page' && t.url.includes('5173'));
  console.log('Target page found:', target.id);

  const client = new CDPClient(target.webSocketDebuggerUrl);
  await client.connect();
  await client.send('Page.enable');
  await client.send('Runtime.enable');

  await delay(2500);

  // 1. Enter game directly via go-bund
  console.log('Entering game via go-bund...');
  await client.eval(`
    (() => {
      const btn = document.getElementById('go-bund');
      if (btn) btn.click();
      document.getElementById('menu')?.classList.add('hidden');
      document.body.classList.remove('in-menu');
    })()
  `);
  await delay(2000);

  // 2. Daytime 12:00 + 晴天 (万里无云检验)
  console.log('Testing 晴天 (万里无云检验) at 12:00 Noon...');
  await client.eval(`
    (() => {
      document.querySelector('[data-time="720"]')?.click();
      const wSelect = document.getElementById('weather-choice');
      if (wSelect) {
        wSelect.value = 'clear';
        wSelect.dispatchEvent(new Event('change'));
      }
      document.getElementById('menu')?.classList.add('hidden');
      document.body.classList.remove('in-menu');
    })()
  `);
  await delay(1500);
  await client.screenshot('shot_clear_daytime_cloudless.png');

  // 2.1 Daytime 12:00 + 多云 (多云积云检验)
  console.log('Testing 多云 (积云层检验) at 12:00 Noon...');
  await client.eval(`
    (() => {
      const wSelect = document.getElementById('weather-choice');
      if (wSelect) {
        wSelect.value = 'cloudy';
        wSelect.dispatchEvent(new Event('change'));
      }
    })()
  `);
  await delay(1500);
  await client.screenshot('shot_cloudy_daytime.png');

  // 2.2 Tilt up under 多云 to inspect cloud billow softness
  console.log('Tilting camera upwards to inspect cloudy billow softness...');
  await client.eval(`
    (() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp', bubbles: true }));
    })()
  `);
  await delay(1600);
  await client.eval(`
    (() => {
      document.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowUp', bubbles: true }));
    })()
  `);
  await delay(500);
  await client.screenshot('shot_cloudy_upwards.png');
  await client.screenshot('shot_clouds_upwards.png');

  // 3. Reset view to Bund, set Night (22:00) + 晴天 (夜晚无云月朗星稀检验)
  console.log('Testing 晴夜无云 (月朗星稀检验) at 22:00 Night...');
  await client.eval(`
    (() => {
      document.getElementById('go-bund')?.click();
      document.querySelector('[data-time="1320"]')?.click();
      const wSelect = document.getElementById('weather-choice');
      if (wSelect) {
        wSelect.value = 'clear';
        wSelect.dispatchEvent(new Event('change'));
      }
      document.getElementById('menu')?.classList.add('hidden');
      document.body.classList.remove('in-menu');
    })()
  `);
  await delay(2000);
  await client.screenshot('shot_clear_night_cloudless.png');

  // 4. Sunset 18:00 + 晴天 (纯净晚霞蓝调检验)
  console.log('Testing 晴朗晚霞 (纯净蓝调无云检验) at 18:00 Sunset...');
  await client.eval(`
    (() => {
      document.getElementById('go-bund')?.click();
      document.querySelector('[data-time="1080"]')?.click();
      const wSelect = document.getElementById('weather-choice');
      if (wSelect) {
        wSelect.value = 'clear';
        wSelect.dispatchEvent(new Event('change'));
      }
      document.getElementById('menu')?.classList.add('hidden');
      document.body.classList.remove('in-menu');
    })()
  `);
  await delay(2000);
  await client.screenshot('shot_clear_sunset_cloudless.png');

  // 5. Sunset 18:00 + 多云 + Tier 0 (大火烧云天幕检验)
  console.log('Testing 多云大火烧云天幕 (Tier 0: 好几层一大片壮丽火烧云)...');
  await client.eval(`
    (() => {
      const wSelect = document.getElementById('weather-choice');
      if (wSelect) {
        wSelect.value = 'cloudy';
        wSelect.dispatchEvent(new Event('change'));
      }
      if (window.weather?.setFieryTier) window.weather.setFieryTier(0);
    })()
  `);
  await delay(1500);
  await client.screenshot('shot_fiery_sunset_major_canopy.png');
  await client.screenshot('shot_fiery_sunset_cinematic.png');
  await client.screenshot('shot_fiery_sunset_skyline.png');

  client.close();
  chrome.kill();
  console.log('Visual capture complete!');
}

run().catch(err => {
  console.error('Inspect failed:', err);
  chrome.kill();
  process.exit(1);
});
