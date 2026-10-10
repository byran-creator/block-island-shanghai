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

// 5b. Nanjing Road Luxury Storefront Entrance & Showroom (法式大橱窗与璀璨内景)
export function getLuxuryStorefrontTexture(brand = {}, night = false) {
  const brandName = brand.name || '老凤祥';
  const key = `luxury-storefront-${brandName}-${night}`;
  return getCachedTexture(key, (ctx, w, h) => {
    // 1. Base facade background: Classical sandstone / granite portal
    ctx.fillStyle = night ? '#28221c' : '#dfd7c5';
    ctx.fillRect(0, 0, w, h);

    // Subtle stone joint line
    ctx.fillStyle = night ? '#1a1612' : '#c9bfab';
    ctx.fillRect(0, h * 0.12, w, 2);

    // 2. Brass Lintel & Cornice
    ctx.fillStyle = night ? '#7d6129' : '#b8943f';
    ctx.fillRect(w * 0.04, h * 0.12, w * 0.92, 10);
    ctx.fillStyle = night ? '#9e7d38' : '#e0bd60';
    ctx.fillRect(w * 0.04, h * 0.12 + 2, w * 0.92, 4);

    // Flanking Pilasters (brass-trimmed columns)
    const colW = w * 0.07;
    for (const cx of [w * 0.04, w * 0.96 - colW]) {
      ctx.fillStyle = night ? '#30261e' : '#cec3ad';
      ctx.fillRect(cx, h * 0.12, colW, h * 0.88);
      ctx.fillStyle = night ? '#7d6129' : '#c5a34e';
      ctx.fillRect(cx, h * 0.12, colW, 8);
      ctx.fillRect(cx, h - 16, colW, 16);
      ctx.fillRect(cx + colW / 2 - 1, h * 0.14, 2, h * 0.84);
    }

    // 3. Central Grand Showroom (Illuminated Interior)
    const doorX = w * 0.32, doorW = w * 0.36, doorY = h * 0.16, doorH = h * 0.84;
    // Warm interior showroom depth gradient
    const showGrad = ctx.createRadialGradient ? ctx.createRadialGradient(doorX + doorW / 2, doorY + doorH * 0.4, 15, doorX + doorW / 2, doorY + doorH * 0.5, doorW * 0.85) : null;
    if (showGrad?.addColorStop) {
      if (night) {
        showGrad.addColorStop(0, '#fff4cb');
        showGrad.addColorStop(0.35, '#ffdd7b');
        showGrad.addColorStop(0.75, '#c99632');
        showGrad.addColorStop(1, '#5a3b12');
      } else {
        showGrad.addColorStop(0, '#fff8e3');
        showGrad.addColorStop(0.4, '#fae6b8');
        showGrad.addColorStop(0.8, '#d6b77c');
        showGrad.addColorStop(1, '#8f7042');
      }
      ctx.fillStyle = showGrad;
    } else {
      ctx.fillStyle = night ? '#ffdd7b' : '#fae6b8';
    }
    ctx.fillRect(doorX, doorY, doorW, doorH);

    // Ornate coffered ceiling & crystal chandelier glow
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    if (ctx.beginPath && ctx.arc && ctx.fill) {
      ctx.beginPath();
      ctx.arc(doorX + doorW / 2, doorY + 18, 14, 0, Math.PI * 2);
      ctx.fill();
    }
    // Chandelier crystal droplets / tiers
    ctx.fillStyle = night ? '#fffcee' : '#ffffff';
    ctx.fillRect(doorX + doorW / 2 - 8, doorY + 30, 16, 4);
    ctx.fillRect(doorX + doorW / 2 - 5, doorY + 35, 10, 3);
    ctx.fillRect(doorX + doorW / 2 - 2, doorY + 39, 4, 3);

    // Luxury interior back wall: Walnut display cabinets & backlit tiers
    ctx.fillStyle = night ? '#4d3013' : '#694622';
    ctx.fillRect(doorX + 8, doorY + 48, doorW - 16, doorH * 0.45);
    // Backlit glass shelves with glowing gold / jade / porcelain items
    for (let sy = doorY + 68; sy < doorY + doorH * 0.42; sy += 26) {
      ctx.fillStyle = night ? '#ffe999' : '#fff3cf';
      ctx.fillRect(doorX + 12, sy, doorW - 24, 2);
      // Display items on shelf
      for (let ix = doorX + 22; ix < doorX + doorW - 24; ix += 22) {
        ctx.fillStyle = '#e5b839';
        ctx.fillRect(ix, sy - 10, 7, 10);
        ctx.fillStyle = '#4ae290';
        ctx.fillRect(ix + 11, sy - 8, 6, 8);
      }
    }

    // Italian Diamond Checkered Marble Floor (in perspective)
    const floorY = doorY + doorH * 0.62;
    ctx.fillStyle = night ? '#2d2218' : '#735b45';
    ctx.fillRect(doorX, floorY, doorW, doorH - (floorY - doorY));
    const stepH = (doorH - (floorY - doorY)) / 4;
    for (let row = 0; row < 4; row++) {
      const ry = floorY + row * stepH;
      const checker = row % 2 === 0;
      ctx.fillStyle = checker ? (night ? '#3b2f23' : '#b39b82') : (night ? '#1c150f' : '#574230');
      ctx.fillRect(doorX + 4, ry, (doorW - 8) / 2, stepH);
      ctx.fillStyle = !checker ? (night ? '#3b2f23' : '#b39b82') : (night ? '#1c150f' : '#574230');
      ctx.fillRect(doorX + 4 + (doorW - 8) / 2, ry, (doorW - 8) / 2, stepH);
    }

    // Polished Brass Door Frame & Transom Arch
    ctx.fillStyle = night ? '#997632' : '#cca94d';
    ctx.fillRect(doorX, doorY, 4, doorH);
    ctx.fillRect(doorX + doorW - 4, doorY, 4, doorH);
    ctx.fillRect(doorX, doorY, doorW, 5);
    ctx.fillRect(doorX, doorY + doorH * 0.28, doorW, 3);

    // Transom Fanlight Pattern
    if (ctx.beginPath && ctx.moveTo && ctx.lineTo && ctx.stroke) {
      ctx.strokeStyle = night ? '#997632' : '#cca94d';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(doorX, doorY + doorH * 0.28);
      ctx.lineTo(doorX + doorW / 2, doorY + 6);
      ctx.lineTo(doorX + doorW, doorY + doorH * 0.28);
      ctx.stroke();
    }

    // Polished Brass Welcome Threshold Plate
    ctx.fillStyle = night ? '#c49a37' : '#dfbb58';
    ctx.fillRect(doorX - 2, h - 8, doorW + 4, 8);
    ctx.fillStyle = night ? '#ffe48a' : '#fff4b3';
    ctx.fillRect(doorX + 4, h - 6, doorW - 8, 2);

    // 4. Symmetrical French Showcase Windows
    const leftCaseX = w * 0.12, caseW = w * 0.18, caseY = h * 0.18, caseH = h * 0.72;
    const rightCaseX = w * 0.70;

    for (const cx of [leftCaseX, rightCaseX]) {
      ctx.fillStyle = night ? '#221c17' : '#2b231c';
      ctx.fillRect(cx - 3, caseY - 3, caseW + 6, caseH + 6);
      ctx.fillStyle = night ? '#997632' : '#cca94d';
      ctx.fillRect(cx - 2, caseY - 2, caseW + 4, caseH + 4);

      const isJewel = brandName.includes('凤') || brandName.includes('庙') || brandName.includes('祥');
      const velvetColor = isJewel ? '#521017' : '#142e23';
      const caseGrad = ctx.createRadialGradient ? ctx.createRadialGradient(cx + caseW / 2, caseY + caseH * 0.45, 10, cx + caseW / 2, caseY + caseH * 0.45, caseW * 0.7) : null;
      if (caseGrad?.addColorStop) {
        if (night) {
          caseGrad.addColorStop(0, '#fff2c2');
          caseGrad.addColorStop(0.35, isJewel ? '#8a1f2c' : '#265440');
          caseGrad.addColorStop(1, velvetColor);
        } else {
          caseGrad.addColorStop(0, '#ffe8bc');
          caseGrad.addColorStop(0.4, isJewel ? '#701923' : '#1f4434');
          caseGrad.addColorStop(1, velvetColor);
        }
        ctx.fillStyle = caseGrad;
      } else {
        ctx.fillStyle = velvetColor;
      }
      ctx.fillRect(cx + 2, caseY + 2, caseW - 4, caseH - 4);

      // Spotlight
      ctx.fillStyle = 'rgba(255, 255, 240, 0.75)';
      ctx.fillRect(cx + caseW / 2 - 8, caseY + 4, 16, 3);

      // Tiered Velvet Pedestals & Luxury Displays
      ctx.fillStyle = isJewel ? '#751722' : '#1b3d2e';
      ctx.fillRect(cx + 8, caseY + caseH * 0.52, caseW - 16, caseH * 0.44);
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(cx + 8, caseY + caseH * 0.52, caseW - 16, 2);

      ctx.fillStyle = isJewel ? '#911d2b' : '#25543f';
      ctx.fillRect(cx + caseW * 0.25, caseY + caseH * 0.38, caseW * 0.5, caseH * 0.16);
      ctx.fillStyle = '#f0ce6e';
      ctx.fillRect(cx + caseW * 0.25, caseY + caseH * 0.38, caseW * 0.5, 2);

      if (isJewel) {
        ctx.fillStyle = '#ffdf66';
        ctx.fillRect(cx + caseW / 2 - 8, caseY + caseH * 0.33, 16, 6);
        ctx.fillStyle = '#5effb3';
        ctx.fillRect(cx + caseW * 0.3, caseY + caseH * 0.47, 8, 8);
        ctx.fillStyle = '#ffcf33';
        ctx.fillRect(cx + caseW * 0.6, caseY + caseH * 0.47, 9, 7);
      } else {
        ctx.fillStyle = '#f7d070';
        ctx.fillRect(cx + caseW / 2 - 10, caseY + caseH * 0.31, 20, 10);
        ctx.fillStyle = '#ff4d4d';
        ctx.fillRect(cx + caseW / 2 - 2, caseY + caseH * 0.31, 4, 10);
        ctx.fillStyle = '#eed6a1';
        ctx.fillRect(cx + caseW * 0.26, caseY + caseH * 0.47, 10, 7);
        ctx.fillStyle = '#ddaa55';
        ctx.fillRect(cx + caseW * 0.58, caseY + caseH * 0.47, 10, 7);
      }

      if (!night && ctx.beginPath && ctx.moveTo && ctx.lineTo && ctx.fill) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
        ctx.beginPath();
        ctx.moveTo(cx + 2, caseY + 2);
        ctx.lineTo(cx + caseW * 0.65, caseY + 2);
        ctx.lineTo(cx + 2, caseY + caseH * 0.7);
        ctx.closePath?.();
        ctx.fill();
      }
    }
  }, 512, 384);
}

// 5c. Metro Station Building Portal Texture (上海地铁车站综合出入口大门)
export function getMetroPortalTexture(exitNumber = 4, night = false) {
  const key = `metro-portal-${exitNumber}-${night}`;
  return getCachedTexture(key, (ctx, w, h) => {
    // 1. Dark granite & brushed stainless steel facade
    ctx.fillStyle = night ? '#1b2226' : '#303b40';
    ctx.fillRect(0, 0, w, h);

    // Granite block joints
    ctx.fillStyle = night ? '#12171a' : '#222b2f';
    ctx.fillRect(0, h * 0.15, w, 2);
    ctx.fillRect(0, h * 0.32, w, 2);

    // 2. Line 2 Official Green-Cyan Transit Header Band
    const bandY = h * 0.08, bandH = h * 0.22;
    ctx.fillStyle = night ? '#152b27' : '#203d37';
    ctx.fillRect(w * 0.05, bandY, w * 0.9, bandH);

    // Line 2 Color Accent Strip (#8bc9b9)
    ctx.fillStyle = night ? '#59d6ba' : '#8bc9b9';
    ctx.fillRect(w * 0.05, bandY + bandH - 6, w * 0.9, 6);

    // Metro Station Title & Signage
    ctx.fillStyle = night ? '#ffffff' : '#f5f7f6';
    ctx.font = 'bold 26px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`🚇 上海地铁 2 号线 · 南京东路站`, w * 0.08, bandY + bandH * 0.38);

    ctx.font = '14px sans-serif';
    ctx.fillStyle = night ? '#9ae0d1' : '#b6ede1';
    ctx.fillText(`SHANGHAI METRO LINE 2 · EAST NANJING ROAD · EXIT ${exitNumber}`, w * 0.08, bandY + bandH * 0.72);

    // Exit Number Badge (Yellow Metro Module)
    const badgeW = 44, badgeH = 44, badgeX = w * 0.95 - badgeW - 14, badgeY = bandY + (bandH - badgeH) / 2;
    ctx.fillStyle = '#ffcf2a';
    ctx.fillRect(badgeX, badgeY, badgeW, badgeH);
    ctx.fillStyle = '#171a1b';
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(exitNumber), badgeX + badgeW / 2, badgeY + badgeH / 2);

    // 3. Central Grand Underground Concourse Portal
    const hallX = w * 0.14, hallW = w * 0.72, hallY = h * 0.34, hallH = h * 0.66;
    // Deep illuminated concourse gradient
    const hallGrad = ctx.createRadialGradient ? ctx.createRadialGradient(hallX + hallW / 2, hallY + hallH * 0.35, 10, hallX + hallW / 2, hallY + hallH * 0.5, hallW * 0.7) : null;
    if (hallGrad?.addColorStop) {
      if (night) {
        hallGrad.addColorStop(0, '#e8fbf6');
        hallGrad.addColorStop(0.35, '#8fe3d2');
        hallGrad.addColorStop(0.75, '#2c5e53');
        hallGrad.addColorStop(1, '#0e231e');
      } else {
        hallGrad.addColorStop(0, '#f2fcf9');
        hallGrad.addColorStop(0.4, '#a2e8da');
        hallGrad.addColorStop(0.8, '#3d7a6e');
        hallGrad.addColorStop(1, '#1b3d36');
      }
      ctx.fillStyle = hallGrad;
    } else {
      ctx.fillStyle = night ? '#2c5e53' : '#3d7a6e';
    }
    ctx.fillRect(hallX, hallY, hallW, hallH);

    // Concourse ceiling light strips
    ctx.fillStyle = '#ffffff';
    for (let lx = hallX + 24; lx < hallX + hallW - 24; lx += 48) {
      ctx.fillRect(lx, hallY + 8, 28, 4);
    }

    // Directional Signboards in distance
    ctx.fillStyle = '#192628';
    ctx.fillRect(hallX + hallW * 0.25, hallY + 36, hallW * 0.5, 20);
    ctx.fillStyle = '#8bc9b9';
    ctx.fillRect(hallX + hallW * 0.25, hallY + 54, hallW * 0.5, 2);
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(`往 陆家嘴 / 浦东国际机场 ➔`, hallX + hallW / 2, hallY + 47);

    // Glass automatic sliding doors (partially open in perspective)
    ctx.fillStyle = night ? 'rgba(162, 222, 230, 0.35)' : 'rgba(185, 235, 240, 0.45)';
    ctx.fillRect(hallX, hallY + 28, hallW * 0.3, hallH - 28);
    ctx.fillRect(hallX + hallW * 0.7, hallY + 28, hallW * 0.3, hallH - 28);

    // Brushed steel door frames
    ctx.fillStyle = night ? '#596d75' : '#889ea8';
    ctx.fillRect(hallX, hallY, 6, hallH);
    ctx.fillRect(hallX + hallW - 6, hallY, 6, hallH);
    ctx.fillRect(hallX, hallY, hallW, 8);
    ctx.fillRect(hallX + hallW * 0.3 - 4, hallY + 28, 4, hallH - 28);
    ctx.fillRect(hallX + hallW * 0.7, hallY + 28, 4, hallH - 28);

    // Pavement threshold & yellow tactile paving at ground
    ctx.fillStyle = '#3a3e40';
    ctx.fillRect(hallX - 4, h - 10, hallW + 8, 10);
    ctx.fillStyle = '#ffd13b';
    ctx.fillRect(hallX, h - 8, hallW, 3);
  }, 512, 384);
}

// 6. Historic brand signboards (沈大成 / 老凤祥 / 永安百货 / 先施公司 / 泰康食品等)
export const HERITAGE_BRANDS = [
  { name: '永安百货', sub: 'SHANGHAI WING ON', color: '#ff2d60', border: '#f0ce6e', bg: '#3f0c16', seal: '安' },
  { name: '先施公司', sub: 'SINCERE & CO. 1917', color: '#27b6ff', border: '#ffd56b', bg: '#0c2033', seal: '先' },
  { name: '沈大成', sub: 'SHEN DA CHENG · 1875', color: '#ffd043', border: '#ffd76b', bg: '#5e1017', seal: '成' },
  { name: '老凤祥', sub: 'LAO FENG XIANG · 1848', color: '#ffd24d', border: '#e6bd53', bg: '#3b140b', seal: '凤' },
  { name: '泰康食品', sub: 'TAI KANG FOODS · 1914', color: '#ff5c40', border: '#f7cb59', bg: '#481216', seal: '康' },
  { name: '亨达利钟表', sub: 'HENRY WATCH · 1864', color: '#4de2cb', border: '#d4c18c', bg: '#112426', seal: '亨' },
  { name: '朵云轩', sub: 'DUO YUN XUAN · 1900', color: '#ffcc52', border: '#e2c478', bg: '#2c1913', seal: '朵' },
  { name: '和平饭店', sub: 'PEACE HOTEL · 1929', color: '#48e8a2', border: '#dbc06d', bg: '#122e22', seal: '和' },
  { name: '第一食品', sub: 'NO.1 FOOD MALL', color: '#ff7052', border: '#ffd76a', bg: '#441619', seal: '食' },
  { name: '培丽丝绸', sub: 'PEI LI SILK & CO', color: '#da6bff', border: '#f0ce75', bg: '#2a1034', seal: '丽' },
  { name: '冠生园', sub: 'GUAN SHENG YUAN · 1915', color: '#ff8a3d', border: '#fed166', bg: '#421808', seal: '冠' },
  { name: '邵万生', sub: 'SHAO WAN SHENG · 1852', color: '#e8a838', border: '#ffdc73', bg: '#301e14', seal: '邵' },
  { name: '王开照相', sub: 'WANG KAI PHOTO · 1923', color: '#38c2e8', border: '#e0c985', bg: '#14252e', seal: '开' },
  { name: '蔡同德堂', sub: 'CAI TONG DE · 1884', color: '#ffd447', border: '#e4be5e', bg: '#3a1012', seal: '蔡' },
  { name: '亨得利钟表', sub: 'HENDRY WATCH · 1915', color: '#5fe0b5', border: '#d5ba73', bg: '#152924', seal: '得' },
  { name: '茂昌眼镜', sub: 'MAO CHANG OPTICAL', color: '#ffbf42', border: '#f5d47a', bg: '#221d28', seal: '茂' }
];

// Draw ornate heritage horizontal, vertical blade, arched, or medallion sign
export function drawHeritageSign(canvas, text, brandIndex = 0, isVertical = false, isNight = false, customColor = null, signStyle = 'horizontal') {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const brand = HERITAGE_BRANDS[Math.abs(brandIndex) % HERITAGE_BRANDS.length];
  const neonColor = customColor || brand.color;
  const borderColor = brand.border;

  // Resolve style: either explicit style argument, or isVertical flag
  const effectiveStyle = signStyle !== 'horizontal' ? signStyle : (isVertical ? 'vertical-blade' : 'horizontal');

  // Font stacks: Authentic Chinese Calligraphy (楷体/宋体) for dignified historical presence
  const calliFont = '"KaiTi", "STKaiti", "KaiTi_GB2312", "Noto Serif SC", "Songti SC", "SimSun", serif';
  const latinFont = '"Times New Roman", "Baskerville", "Georgia", serif';

  // 1. Lacquer / Enamel Background
  if (isNight) {
    ctx.fillStyle = '#080a10';
    ctx.fillRect(0, 0, w, h);
    // Subtle ambient neon reflection wash on glossy black lacquer
    const rad = ctx.createRadialGradient ? ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, Math.max(w, h) * 0.6) : null;
    if (rad?.addColorStop) {
      rad.addColorStop(0, neonColor + '22');
      rad.addColorStop(1, '#080a10');
      ctx.fillStyle = rad;
      ctx.fillRect(0, 0, w, h);
    }
  } else {
    // Traditional Shanghai Chinese lacquer background (朱漆 / 墨漆 / 黛蓝 / 翡翠) with subtle luster
    const grad = ctx.createLinearGradient ? ctx.createLinearGradient(0, 0, 0, h) : null;
    if (grad?.addColorStop) {
      grad.addColorStop(0, brand.bg);
      grad.addColorStop(0.5, brand.bg);
      grad.addColorStop(1, '#0e0b09');
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = brand.bg;
    }
    ctx.fillRect(0, 0, w, h);
  }

  if (effectiveStyle === 'medallion') {
    // 1. Circular / Oval Medallion Sign (老字号金印徽章)
    const cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.44;
    if (ctx.beginPath && ctx.arc) {
      // Outer ring
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = isNight ? '#121622' : brand.bg;
      ctx.fill();
      ctx.lineWidth = Math.max(3, r * 0.08);
      ctx.strokeStyle = isNight ? neonColor : '#d4af37';
      ctx.stroke();

      // Inner beaded ring
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.84, 0, Math.PI * 2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = isNight ? '#ffffff' : '#ffd97d';
      ctx.stroke();
    }
    const sealChar = brand.seal || [...text][0] || '老';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${Math.floor(r * 0.95)}px ${calliFont}`;
    if (isNight) {
      ctx.shadowColor = neonColor;
      ctx.shadowBlur = 12;
      ctx.strokeStyle = neonColor;
      ctx.lineWidth = Math.max(3, r * 0.08);
      ctx.strokeText(sealChar, cx, cy);
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.fillText(sealChar, cx, cy);
    } else {
      ctx.shadowColor = 'rgba(0,0,0,0.7)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1.5;
      ctx.shadowOffsetY = 1.5;
      ctx.fillStyle = '#fce492';
      ctx.fillText(sealChar, cx, cy);
    }
  } else if (effectiveStyle === 'vertical-blade') {
    // 2. Protruding Vertical Blade Sign (侧悬竖立牌 / 刀旗招牌)
    // Art Deco Gilded Frame (双层海派金箔边框)
    ctx.strokeStyle = isNight ? neonColor : '#cda649';
    ctx.lineWidth = Math.max(3.5, w * 0.04);
    ctx.strokeRect(8, 8, w - 16, h - 16);

    ctx.strokeStyle = isNight ? '#fffae0' : '#eed788';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(14, 14, w - 28, h - 28);

    // Decorative Art Deco corner brackets (四角海派折角包花)
    const cSize = Math.min(26, w * 0.16);
    ctx.fillStyle = isNight ? neonColor : '#dcb556';
    for (const [bx, by] of [[8, 8], [w - 8 - cSize, 8], [8, h - 8 - cSize], [w - 8 - cSize, h - 8 - cSize]]) {
      ctx.fillRect(bx, by, cSize, 3);
      ctx.fillRect(bx, by, 3, cSize);
    }

    // Top Header: Classical Brand Seal Medallion
    const sealR = Math.min(w * 0.22, 38);
    const sealY = 24 + sealR;
    if (ctx.beginPath && ctx.arc) {
      ctx.beginPath();
      ctx.arc(w / 2, sealY, sealR, 0, Math.PI * 2);
      ctx.fillStyle = isNight ? '#161c28' : '#6b171f';
      ctx.fill();
      ctx.strokeStyle = isNight ? neonColor : '#e2be62';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(w / 2, sealY, sealR - 3, 0, Math.PI * 2);
      ctx.strokeStyle = isNight ? '#fff' : '#fedb84';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    const sealChar = brand.seal || '老';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${Math.floor(sealR * 1.15)}px ${calliFont}`;
    if (isNight) {
      ctx.shadowColor = neonColor;
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#ffffff';
      ctx.fillText(sealChar, w / 2, sealY);
    } else {
      ctx.fillStyle = '#ffea9e';
      ctx.fillText(sealChar, w / 2, sealY);
    }

    // Center Characters: Authentic Chinese Calligraphy
    const chars = [...text];
    const topMargin = sealY + sealR + 18;
    const bottomMargin = brand.sub ? 64 : 32;
    const charSpacing = (h - topMargin - bottomMargin) / Math.max(1, chars.length);
    const fontSize = Math.floor(Math.min(w * 0.58, charSpacing * 0.82));
    ctx.font = `bold ${fontSize}px ${calliFont}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    chars.forEach((char, i) => {
      const cy = topMargin + charSpacing * (i + 0.5);
      if (isNight) {
        // True Neon Glass Tube Effect: Vibrant outer glow halo + thin brilliant white gas core
        ctx.shadowColor = neonColor;
        ctx.shadowBlur = 14;
        ctx.strokeStyle = neonColor;
        ctx.lineWidth = Math.max(4, Math.floor(fontSize * 0.12));
        ctx.strokeText(char, w / 2, cy);

        // Brilliant inner neon gas tube filament
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = Math.max(2, Math.floor(fontSize * 0.05));
        ctx.strokeText(char, w / 2, cy);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(char, w / 2, cy);
      } else {
        // Authentic Embossed Gold Leaf Calligraphy (泥金贴箔立体效果)
        // 3D bevel shade
        ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.strokeStyle = '#7f5a18';
        ctx.lineWidth = Math.max(2, Math.floor(fontSize * 0.06));
        ctx.strokeText(char, w / 2, cy);

        // Luminous gold foil body
        const goldGrad = ctx.createLinearGradient ? ctx.createLinearGradient(w / 2 - fontSize / 2, cy - fontSize / 2, w / 2 + fontSize / 2, cy + fontSize / 2) : null;
        if (goldGrad?.addColorStop) {
          goldGrad.addColorStop(0, '#fff4cb');
          goldGrad.addColorStop(0.5, '#eed06d');
          goldGrad.addColorStop(1, '#be8f2e');
          ctx.fillStyle = goldGrad;
        } else {
          ctx.fillStyle = '#f5d36e';
        }
        ctx.fillText(char, w / 2, cy);
      }
    });

    // Bottom Subtitle: Refined Condensed Latin Typography
    if (brand.sub) {
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.font = `bold ${Math.max(14, Math.floor(w * 0.062))}px ${latinFont}`;
      ctx.fillStyle = isNight ? '#ffea9e' : '#dfba5c';
      ctx.fillText(brand.sub, w / 2, h - 28);
    }
  } else if (effectiveStyle === 'arch') {
    // 3. Arched Pediment Plaque (山花拱券门楣招牌)
    ctx.strokeStyle = isNight ? neonColor : '#cba44c';
    ctx.lineWidth = Math.max(3.5, Math.min(w, h) * 0.035);
    ctx.strokeRect(6, 6, w - 12, h - 12);

    ctx.strokeStyle = isNight ? '#fffae0' : '#fedb84';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(12, 12, w - 24, h - 24);

    // Classical arch flourish line at top
    if (ctx.beginPath && ctx.arc) {
      ctx.beginPath();
      ctx.arc(w / 2, h * 0.28, w * 0.38, Math.PI * 1.1, Math.PI * 1.9);
      ctx.strokeStyle = isNight ? neonColor : '#cba44c';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const fontSize = Math.floor(Math.min(h * 0.48, (w / Math.max(3, text.length)) * 1.0));
    ctx.font = `bold ${fontSize}px ${calliFont}`;
    const textY = brand.sub && h > 70 ? h * 0.44 : h * 0.52;

    if (isNight) {
      ctx.shadowColor = neonColor;
      ctx.shadowBlur = 12;
      ctx.strokeStyle = neonColor;
      ctx.lineWidth = Math.max(3.5, Math.floor(fontSize * 0.1));
      ctx.strokeText(text, w / 2, textY);
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.fillText(text, w / 2, textY);
    } else {
      ctx.shadowColor = 'rgba(0,0,0,0.7)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1.5;
      ctx.shadowOffsetY = 1.5;
      ctx.fillStyle = '#fedb84';
      ctx.fillText(text, w / 2, textY);
    }

    if (brand.sub && h > 60) {
      ctx.font = `bold ${Math.floor(fontSize * 0.26)}px ${latinFont}`;
      ctx.fillStyle = isNight ? '#fff9db' : '#dfba5c';
      ctx.shadowBlur = 0;
      ctx.fillText(brand.sub, w / 2, h * 0.82);
    }
  } else {
    // 4. Classic Horizontal Lintel Plaque (传统黑漆/朱漆鎏金大匾)
    ctx.strokeStyle = isNight ? neonColor : '#cda649';
    ctx.lineWidth = Math.max(3.5, Math.min(w, h) * 0.035);
    ctx.strokeRect(6, 6, w - 12, h - 12);

    ctx.strokeStyle = isNight ? '#fffae0' : '#fedb84';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(12, 12, w - 24, h - 24);

    // Corner decorative brackets (海派云纹包角)
    const bSize = Math.min(w, h) * 0.15;
    ctx.fillStyle = isNight ? neonColor : '#dcb556';
    for (const [cx, cy] of [[6, 6], [w - 6 - bSize, 6], [6, h - 6 - bSize], [w - 6 - bSize, h - 6 - bSize]]) {
      ctx.fillRect(cx, cy, bSize, 3);
      ctx.fillRect(cx, cy, 3, bSize);
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const fontSize = Math.floor(Math.min(h * 0.52, (w / Math.max(3, text.length)) * 1.0));
    ctx.font = `bold ${fontSize}px ${calliFont}`;

    const textY = brand.sub && h > 70 ? h * 0.44 : h / 2;
    if (isNight) {
      ctx.shadowColor = neonColor;
      ctx.shadowBlur = 12;
      ctx.strokeStyle = neonColor;
      ctx.lineWidth = Math.max(3.5, Math.floor(fontSize * 0.1));
      ctx.strokeText(text, w / 2, textY);
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.fillText(text, w / 2, textY);
    } else {
      ctx.shadowColor = 'rgba(0,0,0,0.7)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1.5;
      ctx.shadowOffsetY = 1.5;
      ctx.fillStyle = '#fedb84';
      ctx.fillText(text, w / 2, textY);
    }

    if (brand.sub && h > 70) {
      ctx.font = `bold ${Math.floor(fontSize * 0.26)}px ${latinFont}`;
      ctx.fillStyle = isNight ? '#fff9db' : '#dfba5c';
      ctx.shadowBlur = 0;
      ctx.fillText(brand.sub, w / 2, h * 0.80);
    }
  }

  // Reset shadows
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

// 7. Ground-floor rusticated granite stone texture with arched voussoir arcade details
export function getRusticatedGraniteTexture(tone = 'warm') {
  const baseColor = tone === 'warm' ? '#d8ceb5' : '#c8c2b5';
  return getCachedTexture(`rusticated-granite-${tone}`, (ctx, w, h) => {
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, w, h);

    // Fine stone grain
    let seed = 77;
    const rand = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    for (let y = 0; y < h; y += 2) {
      for (let x = 0; x < w; x += 2) {
        const r = rand();
        if (r > 0.6) {
          ctx.fillStyle = `rgba(255, 255, 245, ${r * 0.2})`;
          ctx.fillRect(x, y, 2, 2);
        } else if (r < 0.35) {
          ctx.fillStyle = `rgba(45, 40, 30, ${r * 0.25})`;
          ctx.fillRect(x, y, 2, 2);
        }
      }
    }

    // Heavy rustication horizontal ashlar bevels (粗石条石凹凸接缝)
    const blockH = 48;
    for (let y = 0; y < h; y += blockH) {
      ctx.fillStyle = 'rgba(25, 20, 15, 0.55)';
      ctx.fillRect(0, y, w, 3);
      ctx.fillStyle = 'rgba(255, 255, 250, 0.65)';
      ctx.fillRect(0, y + 3, w, 2.5);

      const offset = (y / blockH) % 2 === 0 ? 0 : 48;
      for (let x = offset; x < w; x += 96) {
        ctx.fillStyle = 'rgba(25, 20, 15, 0.45)';
        ctx.fillRect(x, y, 2.5, blockH);
        ctx.fillStyle = 'rgba(255, 255, 250, 0.45)';
        ctx.fillRect(x + 2.5, y, 1.5, blockH);
      }
    }

    // Classical stone portal plinth base & capital molding lines
    ctx.fillStyle = 'rgba(20, 15, 10, 0.4)';
    ctx.fillRect(0, h - 8, w, 8);
    ctx.fillStyle = 'rgba(255, 255, 245, 0.5)';
    ctx.fillRect(0, 0, w, 6);
  });
}

// 9. Nanjing Road Pedestrian Street Entrance Monument Stele Texture (南京路步行街入口维罗纳红石碑)
export function getNanjingSteleTexture(night = false) {
  const key = `nanjing-stele-front-${night}`;
  return getCachedTexture(key, (ctx, w, h) => {
    // 1. Polished Italian Verona Red Granite (意大利维罗纳红花岗岩)
    ctx.fillStyle = night ? '#54171a' : '#7b2226';
    ctx.fillRect(0, 0, w, h);

    // Granite metamorphic crystal specks & veining
    let seed = 1999;
    const rand = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    for (let y = 0; y < h; y += 3) {
      for (let x = 0; x < w; x += 3) {
        const r = rand();
        if (r > 0.7) {
          ctx.fillStyle = night ? 'rgba(255, 220, 200, 0.12)' : 'rgba(255, 235, 220, 0.18)';
          ctx.fillRect(x, y, 3, 3);
        } else if (r < 0.28) {
          ctx.fillStyle = night ? 'rgba(30, 8, 10, 0.35)' : 'rgba(45, 12, 15, 0.4)';
          ctx.fillRect(x, y, 3, 3);
        }
      }
    }

    // Outer stone beveled edge & golden inset border line
    ctx.strokeStyle = night ? 'rgba(35, 8, 10, 0.7)' : 'rgba(55, 12, 16, 0.6)';
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, w - 10, h - 10);

    // Decorative inner gilded stone border (双层阴刻金线)
    ctx.strokeStyle = night ? '#cf9f3e' : '#dfba60';
    ctx.lineWidth = 3;
    ctx.strokeRect(18, 18, w - 36, h - 36);

    ctx.strokeStyle = night ? 'rgba(207, 159, 62, 0.4)' : 'rgba(223, 186, 96, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(26, 26, w - 52, h - 52);

    // 2. Central Calligraphy Inscription: “南京路步行街”
    const textY = h * 0.48;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 3D Chisel shadow (阴刻立体凹凸阴影)
    ctx.font = 'bold 54px "Kaiti", "STKaiti", "KaiTi", "SimSun", "Microsoft YaHei", serif';
    ctx.fillStyle = night ? '#2a0a0d' : '#3f0e12';
    ctx.fillText('南京路步行街', w / 2 + 3, textY + 4);

    // Brilliant 24K Gold Leaf Calligraphy (镏金行楷大字)
    ctx.fillStyle = night ? '#ffe37d' : '#ffd452';
    ctx.fillText('南京路步行街', w / 2, textY);

    // Subtle highlight bevel (金箔高光)
    ctx.fillStyle = night ? '#fff6be' : '#fff9d6';
    ctx.fillText('南京路步行街', w / 2 - 1, textY - 1);

    // 3. English Subtitle: NANJING ROAD PEDESTRIAN STREET
    ctx.font = 'bold 15px "Times New Roman", Georgia, serif';
    ctx.fillStyle = night ? '#2a0a0d' : '#3f0e12';
    ctx.fillText('NANJING ROAD PEDESTRIAN STREET', w / 2 + 1, h * 0.76 + 1);

    ctx.fillStyle = night ? '#dfb350' : '#f0ca6e';
    ctx.fillText('NANJING ROAD PEDESTRIAN STREET', w / 2, h * 0.76);

    // 4. Red Carved Seal Stamp at bottom right (朱砂印鉴)
    const sealX = w - 62, sealY = h - 60, sealSize = 28;
    ctx.fillStyle = '#941e24';
    ctx.fillRect(sealX, sealY, sealSize, sealSize);
    ctx.strokeStyle = night ? '#dfb350' : '#f0ca6e';
    ctx.lineWidth = 2;
    ctx.strokeRect(sealX, sealY, sealSize, sealSize);
    ctx.fillStyle = night ? '#ffe37d' : '#ffd452';
    ctx.font = 'bold 10px serif';
    ctx.fillText('沪', sealX + sealSize / 2, sealY + sealSize / 2);
  }, 512, 320);
}

export function getNanjingSteleBackTexture(night = false) {
  const key = `nanjing-stele-back-${night}`;
  return getCachedTexture(key, (ctx, w, h) => {
    ctx.fillStyle = night ? '#54171a' : '#7b2226';
    ctx.fillRect(0, 0, w, h);

    // Inner gilded border
    ctx.strokeStyle = night ? '#cf9f3e' : '#dfba60';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(18, 18, w - 36, h - 36);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Emblem & Title
    ctx.fillStyle = night ? '#ffe37d' : '#ffd452';
    ctx.font = 'bold 22px "Microsoft YaHei", sans-serif';
    ctx.fillText('南京路步行街建设志', w / 2, h * 0.28);

    // Inscription text
    ctx.font = '14px "Microsoft YaHei", sans-serif';
    ctx.fillStyle = night ? '#eed082' : '#f5df9e';
    ctx.fillText('一九九九年九月二十日落成', w / 2, h * 0.48);
    ctx.fillText('百年老街 · 世纪华彩 · 中华第一商业街', w / 2, h * 0.62);

    ctx.font = '12px "Times New Roman", serif';
    ctx.fillStyle = night ? '#cf9f3e' : '#dfba60';
    ctx.fillText('ESTABLISHED SEPTEMBER 20, 1999 · SHANGHAI', w / 2, h * 0.78);
  }, 512, 320);
}

