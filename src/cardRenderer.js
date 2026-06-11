// Card renderer — composites template/Scryfall base + user art + text overlay
// Card canvas: 745 × 1040px   Art box (transparent in template): x=30, y=124, w=685, h=427
import { parseManaTokens, drawManaCost, drawKeyruneSymbol, rarityColor } from './manaSymbols.js';

export const CARD_W = 745;
export const CARD_H = 1040;
export const ART_BOX = { x: 56, y: 118, w: 634, h: 460 };
export const BLEED = 36;

// Text zone positions scaled from 1500×2100 template pixel analysis
const TZ = {
  name:    { x: 64,  y: 80  },
  mana:    { x: 691, y: 78  },
  type:    { x: 64,  y: 616 },
  textBox: { x: 64,  y: 656, w: 610, h: 288 },
  pt:      { x: 640, y: 958 },
};

const SET_SYMBOL = { cx: 660, cy: 616, size: 46 };

let fontsReady = false;
const imageCache = new Map();

async function ensureFontsLoaded() {
  if (fontsReady) return;
  try {
    const be   = new FontFace('Beleren2016-Bold', 'url(/mtg/fonts/Beleren2016-Bold.woff)');
    const mp   = new FontFace('PlantinMTProRg',   'url(/mtg/fonts/Plantin%20MT%20Pro%20Regular.TTF)');
    const mana = new FontFace('Mana',    'url(/mtg/fonts/mana.woff)');
    const key  = new FontFace('Keyrune', 'url(/mtg/fonts/keyrune.woff)');
    const loaded = await Promise.all([be.load(), mp.load(), mana.load(), key.load()]);
    loaded.forEach(f => document.fonts.add(f));

  } catch (e) {
    console.warn('MTG fonts failed to load, falling back to system fonts', e);
  }
  fontsReady = true;
}

function loadImage(src) {
  if (imageCache.has(src)) return Promise.resolve(imageCache.get(src));
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload  = () => { imageCache.set(src, img); resolve(img); };
    img.onerror = reject;
    img.src = src;
  });
}

function drawArtTransformed(ctx, img, bx, by, bw, bh, t) {
  const base = Math.max(bw / img.width, bh / img.height);
  const s = base * t.scale;
  const dw = img.width * s, dh = img.height * s;
  ctx.drawImage(img, bx + bw / 2 - dw / 2 + t.x, by + bh / 2 - dh / 2 + t.y, dw, dh);
}

function belerenFont(size) {
  return `${size}px 'Beleren2016-Bold', 'Palatino Linotype', serif`;
}

function fitTextSize(ctx, text, fontFn, defaultSize, minSize, maxWidth) {
  ctx.font = fontFn(defaultSize);
  if (ctx.measureText(text).width <= maxWidth) return defaultSize;
  for (let size = defaultSize - 0.5; size >= minSize; size -= 0.5) {
    ctx.font = fontFn(size);
    if (ctx.measureText(text).width <= maxWidth) return size;
  }
  return minSize;
}

function mplantinFont(size, italic = false) {
  return `${italic ? 'italic ' : ''}${size}px 'PlantinMTProRg', 'Palatino Linotype', Georgia, serif`;
}

function wrapText(ctx, text, x, y, maxW, lineH) {
  let cy = y;
  for (const para of text.split('\n')) {
    if (!para.trim()) { cy += lineH * 0.5; continue; }
    const words = para.split(' ');
    let line = '';
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxW && line) {
        ctx.fillText(line, x, cy);
        cy += lineH;
        line = word;
      } else line = test;
    }
    if (line) { ctx.fillText(line, x, cy); cy += lineH; }
  }
  return cy;
}

function countLines(ctx, text, maxW) {
  let n = 0;
  for (const para of text.split('\n')) {
    if (!para.trim()) { n += 0.5; continue; }
    const words = para.split(' ');
    let line = '';
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxW && line) { n++; line = word; }
      else line = test;
    }
    if (line) n++;
  }
  return n;
}

function pickFontSize(ctx, oracle, flavor, maxW, maxH) {
  for (let size = 30; size >= 10; size -= 0.5) {
    const lh = size * 1.38;
    ctx.font = mplantinFont(size);
    const oLines = oracle ? countLines(ctx, oracle, maxW) : 0;
    ctx.font = mplantinFont(Math.max(size - 1, 10), true);
    const fLines = flavor ? countLines(ctx, flavor, maxW) : 0;
    const sep = oracle && flavor ? lh * 1.05 : 0;
    if ((oLines + fLines) * lh + sep <= maxH) return size;
  }
  return 10;
}

export function renderTextOverlay(ctx, customText) {
  const { name, manaCost, typeLine, oracleText, flavorText, pt } = customText;

  ctx.save();

  if (name) {
    const MANA_SYMBOL_SIZE = 40;
    const MANA_GAP = 4;
    const manaTokens = manaCost ? parseManaTokens(manaCost) : [];
    const manaWidth = manaTokens.length > 0
      ? manaTokens.length * (MANA_SYMBOL_SIZE + MANA_GAP) - MANA_GAP
      : 0;
    const nameMaxW = (TZ.mana.x - manaWidth) - TZ.name.x - 16;
    const nameSize = fitTextSize(ctx, name, belerenFont, 40, 20, nameMaxW);
    ctx.font = belerenFont(nameSize);
    ctx.fillStyle = '#000';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, TZ.name.x, TZ.name.y);
  }

  if (manaCost) {
    const tokens = parseManaTokens(manaCost);
    drawManaCost(ctx, tokens, TZ.mana.x, TZ.mana.y, 40);
  }

  if (typeLine) {
    // Stop before the set symbol
    const typeMaxW = SET_SYMBOL.cx - SET_SYMBOL.size / 2 - TZ.type.x - 16;
    const typeSize = fitTextSize(ctx, typeLine, belerenFont, 32, 16, typeMaxW);
    ctx.font = belerenFont(typeSize);
    ctx.fillStyle = '#000';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(typeLine, TZ.type.x, TZ.type.y);
  }

  const { x, y, w, h } = TZ.textBox;
  const size = pickFontSize(ctx, oracleText || '', flavorText || '', w, h);
  const lh = size * 1.38;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  let cy = y + size;

  if (oracleText) {
    ctx.font = mplantinFont(size);
    ctx.fillStyle = '#000';
    cy = wrapText(ctx, oracleText, x, cy, w, lh);
  }

  if (flavorText) {
    if (oracleText) {
      cy += lh * 0.05;
      ctx.save();
      ctx.strokeStyle = '#888';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(x + w * 0.25, cy - size * 0.35);
      ctx.lineTo(x + w * 0.75, cy - size * 0.35);
      ctx.stroke();
      ctx.restore();
      cy += lh * 1.0;
    }
    const fSize = Math.max(size - 1, 10);
    ctx.font = mplantinFont(fSize, true);
    ctx.fillStyle = '#222';
    wrapText(ctx, flavorText, x, cy, w, fSize * 1.38);
  }

  if (pt) {
    ctx.font = belerenFont(40);
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(pt, TZ.pt.x, TZ.pt.y);
  }

  ctx.restore();
}

export async function renderCard(
  canvas,
  cardData,
  artImageUrl,
  artTransform = { x: 0, y: 0, scale: 1 },
  setSymbolUrl = null,
  customText = null,
  templateUrl = null,
  artOpacity = 1,
) {
  await ensureFontsLoaded();

  canvas.width  = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, CARD_W, CARD_H);

  const scryfallUrl = cardData?.image_uris?.png || cardData?.image_uris?.large;
  const baseUrl = templateUrl || scryfallUrl;

  const [baseImg, artImg, symbolImg] = await Promise.all([
    baseUrl     ? loadImage(baseUrl).catch(() => null)     : Promise.resolve(null),
    artImageUrl ? loadImage(artImageUrl).catch(() => null) : Promise.resolve(null),
    setSymbolUrl ? loadImage(setSymbolUrl).catch(() => null) : Promise.resolve(null),
  ]);

  if (!baseImg) {
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, CARD_W, CARD_H);
  }

  if (templateUrl) {
    // Art first so the template frame (transparent art box) composites on top
    if (artImg) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(ART_BOX.x, ART_BOX.y, ART_BOX.w, ART_BOX.h);
      ctx.clip();
      ctx.globalAlpha = artOpacity;
      drawArtTransformed(ctx, artImg, ART_BOX.x, ART_BOX.y, ART_BOX.w, ART_BOX.h, artTransform);
      ctx.restore();
    }
    if (baseImg) ctx.drawImage(baseImg, 0, 0, CARD_W, CARD_H);
  } else {
    if (baseImg) ctx.drawImage(baseImg, 0, 0, CARD_W, CARD_H);
    if (artImg) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(ART_BOX.x, ART_BOX.y, ART_BOX.w, ART_BOX.h);
      ctx.clip();
      ctx.globalAlpha = artOpacity;
      drawArtTransformed(ctx, artImg, ART_BOX.x, ART_BOX.y, ART_BOX.w, ART_BOX.h, artTransform);
      ctx.restore();
    }
  }

  if (symbolImg) {
    // User-uploaded image takes priority
    const s = SET_SYMBOL.size;
    const sx = SET_SYMBOL.cx - s / 2;
    const sy = SET_SYMBOL.cy - s / 2;
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(symbolImg, sx, sy, s, s);
    ctx.restore();
  } else if (templateUrl && cardData?.set) {
    // Auto keyrune symbol from card's set code
    drawKeyruneSymbol(
      ctx,
      cardData.set,
      SET_SYMBOL.cx, SET_SYMBOL.cy,
      SET_SYMBOL.size,
      rarityColor(cardData.rarity),
    );
  }

  if (customText && templateUrl) {
    renderTextOverlay(ctx, customText);
  }
}

export async function renderCardWithBleed(
  canvas,
  cardData,
  artImageUrl,
  artTransform,
  setSymbolUrl = null,
  customText = null,
  templateUrl = null,
) {
  const totalW = CARD_W + BLEED * 2;
  const totalH = CARD_H + BLEED * 2;
  canvas.width  = totalW;
  canvas.height = totalH;

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, totalW, totalH);

  const tmp = document.createElement('canvas');
  await renderCard(tmp, cardData, artImageUrl, artTransform, setSymbolUrl, customText, templateUrl);
  ctx.drawImage(tmp, BLEED, BLEED);

  ctx.strokeStyle = '#000';
  ctx.lineWidth = 0.75;
  const G = 4, ML = 18;
  const bx = BLEED, by = BLEED, bw = CARD_W, bh = CARD_H;
  [
    [bx-G-ML, by,    bx-G,       by   ], [bx,    by-G-ML,  bx,    by-G      ],
    [bx+bw+G, by,    bx+bw+G+ML, by   ], [bx+bw, by-G-ML,  bx+bw, by-G     ],
    [bx-G-ML, by+bh, bx-G,       by+bh], [bx,    by+bh+G,  bx,    by+bh+G+ML],
    [bx+bw+G, by+bh, bx+bw+G+ML, by+bh], [bx+bw, by+bh+G, bx+bw, by+bh+G+ML],
  ].forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  });
}
