import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';
import { spawn } from 'node:child_process';

const PORT = 8123;
const GAME_DIR = join(process.cwd(), 'game');
const ARTIFACT_DIR = 'C:\\Users\\黄启言\\.gemini\\antigravity\\brain\\0231937a-9265-4d1e-87cd-cf1b3e60633a\\yuyuan_screenshots';

if (!existsSync(ARTIFACT_DIR)) {
  mkdirSync(ARTIFACT_DIR, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg'
};

const server = createServer((req, res) => {
  let url = req.url.split('?')[0];
  if (url === '/') url = '/index.html';
  const filePath = join(GAME_DIR, url.replace(/^\//, ''));
  if (existsSync(filePath)) {
    const ext = extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType, 'Access-Control-Allow-Origin': '*' });
    res.end(readFileSync(filePath));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

await new Promise(resolve => server.listen(PORT, resolve));
console.log(`Server listening on http://localhost:${PORT}`);

const browserPath = existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

console.log(`Launching browser: ${browserPath}`);
const browserProcess = spawn(browserPath, [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--disable-gpu',
  '--window-size=1280,720',
  '--no-first-run',
  '--no-default-browser-check',
  `http://localhost:${PORT}/index.html`
]);

let wsUrl = null;
for (let i = 0; i < 30; i++) {
  await new Promise(r => setTimeout(r, 500));
  try {
    const resp = await fetch('http://localhost:9222/json/list');
    const list = await resp.json();
    const gameTarget = list.find(t => t.type === 'page' && t.url.includes(String(PORT))) || list.find(t => t.type === 'page');
    if (gameTarget && gameTarget.webSocketDebuggerUrl) {
      wsUrl = gameTarget.webSocketDebuggerUrl;
      console.log('Connected to game target:', gameTarget.title, gameTarget.url);
      break;
    }
  } catch {}
}

if (!wsUrl) {
  console.error('Failed to get WebSocket debugger URL');
  browserProcess.kill();
  server.close();
  process.exit(1);
}

const ws = new WebSocket(wsUrl);
await new Promise((resolve, reject) => {
  ws.onopen = resolve;
  ws.onerror = reject;
});

let msgId = 1;
const pending = new Map();
ws.onmessage = e => {
  const data = JSON.parse(e.data);
  if (data.id && pending.has(data.id)) {
    const { resolve, reject } = pending.get(data.id);
    pending.delete(data.id);
    if (data.error) reject(data.error);
    else resolve(data.result);
  }
};

function send(method, params = {}) {
  const id = msgId++;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function evalCode(expression) {
  const res = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  return res.result?.value;
}

await send('Page.enable');

console.log('Waiting for __game to initialize...');
for (let i = 0; i < 40; i++) {
  const ready = await evalCode('typeof window.__game !== "undefined" && typeof window.__game.setPos === "function"');
  if (ready) {
    console.log('Game initialized!');
    break;
  }
  await new Promise(r => setTimeout(r, 500));
}

// Close dialogs, enter game, enable flight mode, set golden hour dusk
await evalCode(`
  document.querySelectorAll('dialog').forEach(d => { try { d.close(); } catch(e){} d.style.display = 'none'; });
  const menu = document.getElementById('menu');
  if (menu) menu.style.display = 'none';
  const shade = document.getElementById('shade');
  if (shade) shade.style.display = 'none';
  window.__game.enter();
  window.__game.setFlight(true);
  window.__game.setTime(1080); // Dusk golden sunset with glowing lanterns
`);

await new Promise(r => setTimeout(r, 1500));

const shots = [
  {
    name: 'shot1_east_street.png',
    title: '东侧商业步行街（开阔大道、无阻挡石盒墙壁、彩灯天幕高悬）',
    setup: `
      window.__game.setFlight(true);
      window.__game.setPos(18, 26, 218);
      window.__game.lookAt(18, 27, 280);
      window.__game.render();
    `
  },
  {
    name: 'shot2_huxinting_pavilion.png',
    title: '九曲桥与湖心亭（精致小巧开放式水榭，无封闭房间，四面通透配美人靠坐凳）',
    setup: `
      window.__game.setFlight(true);
      window.__game.setPos(-56, 26.2, 234);
      window.__game.lookAt(-46, 27.2, 238);
      window.__game.render();
    `
  },
  {
    name: 'shot3_metro_exit1.png',
    title: '10号线豫园站1号口（戏台已彻底移开，站口开阔集散广场畅通无阻）',
    setup: `
      window.__game.setFlight(true);
      window.__game.setPos(-86, 26, 210);
      window.__game.lookAt(-86, 27.2, 226);
      window.__game.render();
    `
  },
  {
    name: 'shot4_garden_green_overview.png',
    title: '核心古典园林全域绿化俯瞰（100%全绿草毯覆盖，无黄土地，外围商铺围合内园）',
    setup: `
      window.__game.setFlight(true);
      window.__game.setPos(-50, 42, 310); // Elevated aerial position overlooking the whole garden
      window.__game.lookAt(-50, 26, 240); // Looking north across the emerald green lawn, trees, rockeries and ponds
      window.__game.render();
    `
  },
  {
    name: 'shot5_west_shops_no_dividing_wall.png',
    title: '西侧老字号商铺（对应用户图3：围墙已往外扩退，石壁不再切割商铺，店铺融于街区）',
    setup: `
      window.__game.setFlight(true);
      window.__game.setPos(-104, 26, 212); // Facing Shanghai Pear Syrup Candy shop
      window.__game.lookAt(-114, 27.5, 216); // Looking directly at the storefront and wide street
      window.__game.render();
    `
  }
];

for (const shot of shots) {
  console.log(`Setting up shot: ${shot.title}`);
  await evalCode(shot.setup);
  await new Promise(r => setTimeout(r, 1200));
  await evalCode('window.__game.render();');
  await new Promise(r => setTimeout(r, 300));

  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  const outPath = join(ARTIFACT_DIR, shot.name);
  writeFileSync(outPath, Buffer.from(screenshot.data, 'base64'));
  console.log(`Saved screenshot to ${outPath}`);
}

ws.close();
browserProcess.kill();
server.close();
console.log('All 5 screenshots captured successfully!');
