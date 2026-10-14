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
  '--window-size=1280,800',
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

// 1. Capture Login Update Dialog
console.log('Setting up shot: 登录前版本更新展示弹窗（展示两张精修图片与V54更新公告）');
await evalCode(`
  const dlg = document.getElementById('update-dialog');
  if (dlg) {
    dlg.showModal();
    dlg.scrollTop = 0;
  }
`);
await new Promise(r => setTimeout(r, 1200));

const updateScreenshot = await send('Page.captureScreenshot', { format: 'png' });
const updateOutPath = join(ARTIFACT_DIR, 'shot0_login_update_dialog.png');
writeFileSync(updateOutPath, Buffer.from(updateScreenshot.data, 'base64'));
console.log(`Saved screenshot to ${updateOutPath}`);

// 2. Close dialogs, enter game, enable flight mode, set golden hour dusk
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
    name: 'shot1_compact_east_street.png',
    title: '紧凑繁华东市商业街（街道缩窄至9米更显热闹、两侧开敞步入式商铺、南京路同款3D悬挑招牌与幌子、彩灯人流）',
    setup: `
      window.__game.setFlight(true);
      window.__game.setPos(16.5, 26.2, 225);
      window.__game.lookAt(16.5, 27.5, 285);
      window.__game.render();
    `
  },
  {
    name: 'shot2_compact_west_street.png',
    title: '西市老街紧凑繁荣街景（街道缩窄至11米、两边老字号商铺、飘动商幌、随风摇曳灯火与穿梭游客）',
    setup: `
      window.__game.setFlight(true);
      window.__game.setPos(-96.5, 26.2, 225);
      window.__game.lookAt(-96.5, 27.5, 285);
      window.__game.render();
    `
  },
  {
    name: 'shot3_walk_in_shop_interior.png',
    title: '老字号商铺豪华内部（玩家可走入店内：通顶金边多宝格、陈列奇珍名品、祥云红毯木地板、掌柜迎客服务台）',
    setup: `
      window.__game.setFlight(true);
      window.__game.setPos(9.0, 26.2, 264);
      window.__game.lookAt(4.45, 27.2, 264);
      window.__game.render();
    `
  },
  {
    name: 'shot4_shopfront_3d_signage_details.png',
    title: '立面对齐南京路高规格门头（3D立体雕花横匾带大红绸花、双面悬挑式竖向招牌、燕尾织锦商幌、开敞门洞）',
    setup: `
      window.__game.setFlight(true);
      window.__game.setPos(15.5, 26.5, 227);
      window.__game.lookAt(12, 28.2, 232);
      window.__game.render();
    `
  },
  {
    name: 'shot5_walk_in_west_shop.png',
    title: '西街名酿老坊内部步入视角（老酒坛封坛美酒、多宝格陈列、红木曲尺柜台与算盘、青砖门槛）',
    setup: `
      window.__game.setFlight(true);
      window.__game.setPos(-104, 26.2, 296);
      window.__game.lookAt(-109.5, 27.0, 296);
      window.__game.render();
    `
  },
  {
    name: 'shot6_huxinting_and_garden.png',
    title: '九曲桥湖心亭水榭与核心园林（单层通透开放休息亭、全域青翠草毯环抱、湖面锦鲤倒影）',
    setup: `
      window.__game.setFlight(true);
      window.__game.setPos(-56, 26.2, 234);
      window.__game.lookAt(-46, 27.2, 238);
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
console.log('All screenshots captured successfully!');
