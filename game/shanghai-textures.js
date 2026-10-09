// Procedural architectural textures and heritage signage for Shanghai The Bund & Nanjing Road.
import * as THREE from './three.module.js';

const cache = new Map();

// Helper to create and cache CanvasTextures
function getCachedTexture(key, drawFn, width = 256, height = 256) {
  if (cache.has(key)) return cache.get(key);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  drawFn(ctx, width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  cache.set(key, texture);
  return texture;
}

// 1. Neoclassical Bund granite facade texture (with rusticated stone courses and pilaster reliefs)
export function getBundGraniteTexture(tone = 'warm') {
  const baseColor = tone === 'warm' ? '#dfd5bd' : '#cdc9be';
  return getCachedTexture(`bund-granite-${tone}`, (ctx, w, h) => {
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, w, h);

    // Stone grain noise
    let seed = 42;
    const rand = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    for (let y = 0; y < h; y += 2) {
      for (let x = 0; x < w; x += 2) {
        const r = rand();
        if (r > 0.6) {
          ctx.fillStyle = `rgba(255, 255, 245, ${r * 0.18})`;
          ctx.fillRect(x, y, 2, 2);
        } else if (r < 0.35) {
          ctx.fillStyle = `rgba(50, 45, 35, ${r * 0.22})`;
          ctx.fillRect(x, y, 2, 2);
        }
      }
    }

    // Horizontal rustication grooves (classical stone block masonry)
    const blockH = 32;
    for (let y = 0; y < h; y += blockH) {
      // Deep shadow groove
      ctx.fillStyle = 'rgba(40, 35, 25, 0.45)';
      ctx.fillRect(0, y, w, 2);
      // Highlight on lower stone lip
      ctx.fillStyle = 'rgba(255, 255, 245, 0.55)';
      ctx.fillRect(0, y + 2, w, 1.5);

      // Vertical block joints staggered every row
      const offset = (y / blockH) % 2 === 0 ? 0 : 32;
      for (let x = offset; x < w; x += 64) {
        ctx.fillStyle = 'rgba(40, 35, 25, 0.35)';
        ctx.fillRect(x, y, 1.5, blockH);
        ctx.fillStyle = 'rgba(255, 255, 245, 0.4)';
        ctx.fillRect(x + 1.5, y, 1, blockH);
      }
    }

    // Classical fluted pilaster relief bands on borders
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(4, 0, 8, h);
    ctx.fillRect(w - 12, 0, 8, h);
    ctx.fillStyle = 'rgba(30, 25, 20, 0.25)';
    ctx.fillRect(0, 0, 4, h);
    ctx.fillRect(w - 4, 0, 4, h);
  });
}

// 2. Peace Hotel iconic verdigris copper pyramid roof texture
export function getPeaceCopperRoofTexture() {
  return getCachedTexture('peace-copper-roof', (ctx, w, h) => {
    // Elegant oxidized verdigris teal-green base
    const grad = ctx.createLinearGradient ? ctx.createLinearGradient(0, 0, 0, h) : null;
    if (grad?.addColorStop) {
      grad.addColorStop(0, '#358269');
      grad.addColorStop(0.5, '#2e6f59');
      grad.addColorStop(1, '#255b49');
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = '#2e6f59';
    }
    ctx.fillRect(0, 0, w, h);

    // Weathering copper patina variations
    let seed = 101;
    const rand = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    for (let i = 0; i < 300; i++) {
      const rx = rand() * w, ry = rand() * h, rad = 4 + rand() * 12;
      ctx.fillStyle = rand() > 0.5 ? 'rgba(78, 175, 142, 0.18)' : 'rgba(20, 55, 42, 0.2)';
      if (ctx.beginPath && ctx.arc) {
        ctx.beginPath();
        ctx.arc(rx, ry, rad, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(rx - rad / 2, ry - rad / 2, rad, rad);
      }
    }

    // Vertical standing seams (classical metal sheet roof ribs)
    for (let x = 0; x < w; x += 16) {
      ctx.fillStyle = 'rgba(12, 35, 27, 0.65)';
      ctx.fillRect(x, 0, 2, h);
      ctx.fillStyle = 'rgba(115, 222, 185, 0.55)';
      ctx.fillRect(x + 2, 0, 1.5, h);
    }

    // Horizontal battens
    for (let y = 0; y < h; y += 48) {
      ctx.fillStyle = 'rgba(15, 40, 30, 0.4)';
      ctx.fillRect(0, y, w, 2);
      ctx.fillStyle = 'rgba(100, 210, 170, 0.35)';
      ctx.fillRect(0, y + 2, w, 1);
    }
  });
}

// 3. Classical historic window texture (arched stone mouldings & multi-pane glazing)
export function getHistoricWindowTexture(night = false) {
  return getCachedTexture(`historic-window-${night}`, (ctx, w, h) => {
    // Masonry surround
    ctx.fillStyle = '#b8ad98';
    ctx.fillRect(0, 0, w, h);

    // Arch window recess
    ctx.fillStyle = '#2c251f';
    ctx.fillRect(16, 16, w - 32, h - 32);

    // Glass panes (night: glowing warm amber, day: deep reflective sapphire-slate)
    const glassGrad = ctx.createLinearGradient ? ctx.createLinearGradient(0, 16, 0, h - 16) : null;
    if (glassGrad?.addColorStop) {
      if (night) {
        glassGrad.addColorStop(0, '#fff0a6');
        glassGrad.addColorStop(0.5, '#ffce63');
        glassGrad.addColorStop(1, '#e59728');
      } else {
        glassGrad.addColorStop(0, '#537282');
        glassGrad.addColorStop(0.4, '#395361');
        glassGrad.addColorStop(1, '#21333d');
      }
      ctx.fillStyle = glassGrad;
    } else {
      ctx.fillStyle = night ? '#ffce63' : '#395361';
    }
    ctx.fillRect(22, 22, w - 44, h - 44);

    // Classical window mullions & transoms (wooden frame)
    ctx.fillStyle = night ? '#593e1b' : '#1d272c';
    ctx.fillRect(w / 2 - 3, 22, 6, h - 44);
    ctx.fillRect(22, h * 0.38 - 3, w - 44, 6);
    ctx.fillRect(22, h * 0.70 - 3, w - 44, 6);

    // Arched top fanlight curves
    if (ctx.beginPath && ctx.arc && ctx.stroke) {
      ctx.strokeStyle = night ? '#593e1b' : '#1d272c';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(w / 2, h * 0.38, w * 0.28, Math.PI, 0);
      ctx.stroke();
    }

    // Subtle glass reflection highlight
    if (!night && ctx.beginPath && ctx.moveTo && ctx.lineTo) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      ctx.moveTo(26, 26);
      ctx.lineTo(w * 0.45, 26);
      ctx.lineTo(26, h * 0.65);
      ctx.closePath?.();
      ctx.fill();
    }
  });
}

// 4. European striped awning texture for Nanjing Road shops
export function getStripedAwningTexture(primary = '#a32b2b', secondary = '#f7f4ea') {
  return getCachedTexture(`awning-${primary}-${secondary}`, (ctx, w, h) => {
    ctx.fillStyle = secondary;
    ctx.fillRect(0, 0, w, h);
    const stripeW = 24;
    ctx.fillStyle = primary;
    for (let x = 0; x < w; x += stripeW * 2) {
      ctx.fillRect(x, 0, stripeW, h);
    }
    const shadow = ctx.createLinearGradient ? ctx.createLinearGradient(0, h - 16, 0, h) : null;
    if (shadow?.addColorStop) {
      shadow.addColorStop(0, 'rgba(0, 0, 0, 0)');
      shadow.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
      ctx.fillStyle = shadow;
      ctx.fillRect(0, h - 16, w, 16);
    }
  });
}

// 5. Nanjing Road historic boutique showcase window (沈大成 / 老凤祥 / 永安百货等)
export function getShowcaseDisplayTexture(night = false) {
  return getCachedTexture(`showcase-display-${night}`, (ctx, w, h) => {
    ctx.fillStyle = '#1c1b18';
    ctx.fillRect(0, 0, w, h);

    // Polished brass outer frame
    ctx.fillStyle = '#bda056';
    ctx.fillRect(8, 8, w - 16, h - 16);
    ctx.fillStyle = '#dfc37a';
    ctx.fillRect(12, 12, w - 24, h - 24);

    // Showcase interior display space
    const bgGrad = ctx.createRadialGradient ? ctx.createRadialGradient(w / 2, h * 0.6, 10, w / 2, h * 0.6, w * 0.6) : null;
    if (bgGrad?.addColorStop) {
      if (night) {
        bgGrad.addColorStop(0, '#fff4cb');
        bgGrad.addColorStop(0.6, '#ffd57d');
        bgGrad.addColorStop(1, '#8f6828');
      } else {
        bgGrad.addColorStop(0, '#ede5d0');
        bgGrad.addColorStop(0.7, '#baa98f');
        bgGrad.addColorStop(1, '#665742');
      }
      ctx.fillStyle = bgGrad;
    } else {
      ctx.fillStyle = night ? '#ffd57d' : '#baa98f';
    }
    ctx.fillRect(18, 18, w - 36, h - 36);

    // Velvet pedestal stand
    ctx.fillStyle = '#6b1923';
    ctx.fillRect(w * 0.22, h * 0.58, w * 0.56, h * 0.25);
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(w * 0.22, h * 0.58, w * 0.56, 3);
  });
}

// 6. Historic brand signboards (沈大成 / 老凤祥 / 永安百货 / 先施公司 / 泰康食品等)
export const HERITAGE_BRANDS = [
  { name: '永安百货', sub: 'SHANGHAI WING ON', color: '#ff2d60', border: '#e8be56', bg: '#4a101b' },
  { name: '先施公司', sub: 'SINCERE & CO.', color: '#27b6ff', border: '#ffd269', bg: '#102538' },
  { name: '沈大成', sub: 'SHEN DA CHENG · 1875', color: '#ffd043', border: '#ffd76b', bg: '#6b1219' },
  { name: '老凤祥', sub: 'LAO FENG XIANG · 1848', color: '#ffd24d', border: '#e6bd53', bg: '#45160b' },
  { name: '泰康食品', sub: 'TAI KANG FOODS', color: '#ff5c40', border: '#f7cb59', bg: '#54151a' },
  { name: '亨达利钟表', sub: 'HENRY WATCHMAKER', color: '#52e8d1', border: '#c9b885', bg: '#13282a' },
  { name: '朵云轩', sub: 'DUO YUN XUAN · ART', color: '#ffcc52', border: '#e0c175', bg: '#331d16' },
  { name: '和平饭店', sub: 'PEACE HOTEL · 1929', color: '#45e69e', border: '#d9ba66', bg: '#153326' },
  { name: '上海第一食品', sub: 'NO.1 FOOD MALL', color: '#ff7052', border: '#ffd76a', bg: '#4d191c' },
  { name: '培丽丝绸', sub: 'PEI LI SILK & CO', color: '#db69ff', border: '#f0ce75', bg: '#30133b' }
];

// Draw ornate heritage horizontal or vertical sign with traditional gold typography & neon glow
export function drawHeritageSign(canvas, text, brandIndex = 0, isVertical = false, isNight = false) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const brand = HERITAGE_BRANDS[brandIndex % HERITAGE_BRANDS.length];

  // 1. Lacquer background
  ctx.fillStyle = isNight ? '#0b0f15' : brand.bg;
  ctx.fillRect(0, 0, w, h);

  // 2. Ornate dual gold border
  ctx.strokeStyle = brand.border;
  ctx.lineWidth = Math.max(3, Math.min(w, h) * 0.04);
  ctx.strokeRect(6, 6, w - 12, h - 12);
  ctx.lineWidth = Math.max(1.5, Math.min(w, h) * 0.015);
  ctx.strokeRect(12, 12, w - 24, h - 24);

  // Corner decorative brackets
  const bSize = Math.min(w, h) * 0.12;
  ctx.fillStyle = brand.border;
  for (const [cx, cy] of [[6, 6], [w - 6 - bSize, 6], [6, h - 6 - bSize], [w - 6 - bSize, h - 6 - bSize]]) {
    ctx.fillRect(cx, cy, bSize, bSize * 0.35);
    ctx.fillRect(cx, cy, bSize * 0.35, bSize);
  }

  // 3. Text rendering with high-prestige typography
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const chars = [...text];
  if (isVertical) {
    const charSpacing = (h - 36) / Math.max(1, chars.length);
    const fontSize = Math.floor(Math.min(w * 0.65, charSpacing * 0.85));
    ctx.font = `bold ${fontSize}px "Songti SC", "SimSun", "Noto Serif SC", serif`;

    chars.forEach((char, i) => {
      const cy = 20 + charSpacing * (i + 0.5);
      if (isNight) {
        ctx.shadowColor = brand.color;
        ctx.shadowBlur = 18;
        ctx.strokeStyle = brand.color;
        ctx.lineWidth = 6;
        ctx.strokeText(char, w / 2, cy);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(char, w / 2, cy);
      } else {
        ctx.shadowColor = 'rgba(0,0,0,0.7)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillStyle = brand.border;
        ctx.fillText(char, w / 2, cy);
      }
    });
  } else {
    const fontSize = Math.floor(Math.min(h * 0.6, (w / Math.max(3, chars.length)) * 1.05));
    ctx.font = `bold ${fontSize}px "Songti SC", "SimSun", "Noto Serif SC", serif`;

    if (isNight) {
      ctx.shadowColor = brand.color;
      ctx.shadowBlur = 16;
      ctx.strokeStyle = brand.color;
      ctx.lineWidth = 6;
      ctx.strokeText(text, w / 2, h / 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(text, w / 2, h / 2);
    } else {
      ctx.shadowColor = 'rgba(0,0,0,0.7)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fillStyle = brand.border;
      ctx.fillText(text, w / 2, h / 2);
    }
  }

  // Reset shadows
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}
