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
console.log('Setting up shot: 登录前版本更新展示弹窗');
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
    name: 'shot1_yuyuan_signage_details.png',
    title: '豫园老字号3D屋檐门头与大红绸花双面招牌（悬山小灰瓦挑檐、透雕雀替牛腿、大红真丝挽结八瓣绸花、径向熟漆金字匾额与双层回纹金边、非遗朱红印章、双面悬挑竖招）',
    setup: `
      window.__game.setFlight(true);
      window.__game.setPos(15.2, 26.6, 227);
      window.__game.lookAt(12, 28.2, 232);
      window.__game.render();
    `
  },
  {
    name: 'shot2_yuyuan_walk_in_luxury_interior.png',
    title: '老字号商铺极致奢华步入式内部（3.4米全开敞无阻入口、青石门槛铜条收口、通顶错落大博古架、青花瓷器/仿古铜炉/翡翠山子、太师椅八仙桌工夫茶具、紫檀雕花折叠屏风、曲尺账台算盘药柜）',
    setup: `
      window.__game.setFlight(true);
      window.__game.setPos(7.2, 26.3, 266.5);
      window.__game.lookAt(4.2, 26.8, 263.2);
      window.__game.render();
    `
  },
  {
    name: 'shot3_yuyuan_stealthy_hawkers.png',
    title: '街巷隐秘流动商贩与特色摊点（游商糖人张木轮推车、栩栩如生吹糖金龙、透亮晶莹糖葫芦草把子、熬糖铜锅、地摊古董刘蓝布地摊金石古币）',
    setup: `
      window.__game.setFlight(true);
      window.__game.setPos(-99.6, 26.3, 272.5);
      window.__game.lookAt(-101.8, 26.5, 272.5);
      window.__game.render();
    `
  },
  {
    name: 'shot4_bund_photography_tourist.png',
    title: '外滩大观景台拍照人物逼真连贯动作（双手举机/半蹲仰拍/审阅屏幕连贯编排，高精镁合金微单相机高精模型配金属变焦环与闪光灯，对岸陆家嘴天际线）',
    setup: `
      window.__game.setFlight(true);
      window.__game.setPos(26.2, 26.3, 50.2);
      window.__game.lookAt(29.0, 26.8, 48.0);
      window.__game.render();
    `
  },
  {
    name: 'shot5_upgraded_npc_textures.png',
    title: '全新升级高精人物贴图细节（清澈眼神高光双眼皮、腮红唇蜜鼻梁微高光、多层次发型、高定风衣围巾/牛仔夹克/连帽卫衣/金线盘扣唐装、腕表配饰与复古运动鞋底）',
    setup: `
      window.__game.setFlight(true);
      window.__game.setPos(30.6, 26.8, 48.0);
      window.__game.lookAt(29.0, 26.8, 48.0);
      window.__game.render();
    `
  },
  {
    name: 'shot6_compact_east_street.png',
    title: '紧凑繁华东市商业街全景（街道缩窄至9米更显热闹、两侧开敞步入式商铺、南京路同款3D悬挑招牌与幌子、彩灯人流）',
    setup: `
      window.__game.setFlight(true);
      window.__game.setPos(16.5, 26.2, 225);
      window.__game.lookAt(16.5, 27.5, 285);
      window.__game.render();
    `
  },
  {
    name: 'shot7_garden_moon_bridge_and_willow.png',
    title: '园林水景与江南单孔石拱桥（半月石拱桥水面倒影成月、临水垂柳丝丝摇曳、亲水石阶石埠头、太湖石驳岸叠石、白鹭仙鹤立于石上观鱼）',
    setup: `
      window.__game.setFlight(true);
      window.__game.setPos(-43.0, 24.6, 229.5);
      window.__game.lookAt(-51.0, 24.0, 231.5);
      window.__game.render();
    `
  },
  {
    name: 'shot8_garden_wildlife_and_lake.png',
    title: '园林生机动物与荷塘清波（4色逼真流线型游动锦鲤、鸳鸯戏水荡起层层水波涟漪、石龟晒背伸颈、蜻蜓点水、荷塘翠盖与粉嫩红莲睡莲）',
    setup: `
      window.__game.setFlight(true);
      window.__game.setPos(-41.0, 24.8, 231.5);
      window.__game.lookAt(-45.0, 22.8, 234.0);
      window.__game.render();
    `
  },
  {
    name: 'shot9_huxinting_panoramic_garden.png',
    title: '九曲桥湖心亭水榭与核心园林全景（单层开放通透水上茶亭、古松罗汉松盘曲迎客、大假山叠石、水廊挑檐飞燕与苍翠绿毯）',
    setup: `
      window.__game.setFlight(true);
      window.__game.setPos(-56.0, 26.5, 234.0);
      window.__game.lookAt(-46.0, 27.2, 238.0);
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
