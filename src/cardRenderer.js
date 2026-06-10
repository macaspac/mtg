// Card renderer: composites user art into the art box on a real Scryfall card image.
// Scryfall PNG: 745 × 1040px   Art box: x=57, y=119, w=630, h=465

export const CARD_W = 745;
export const CARD_H = 1040;
export const ART_BOX = { x: 57, y: 119, w: 630, h: 465 };
export const BLEED = 36;

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload  = () => resolve(img);
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

export async function renderCard(canvas, cardData, artImageUrl, artTransform = { x: 0, y: 0, scale: 1 }) {
  canvas.width  = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, CARD_W, CARD_H);

  const scryfallUrl = cardData.image_uris?.png || cardData.image_uris?.large;

  const [baseImg, artImg] = await Promise.all([
    scryfallUrl ? loadImage(scryfallUrl).catch(() => null) : Promise.resolve(null),
    artImageUrl ? loadImage(artImageUrl).catch(() => null)  : Promise.resolve(null),
  ]);

  if (baseImg) ctx.drawImage(baseImg, 0, 0, CARD_W, CARD_H);
  else { ctx.fillStyle = '#333'; ctx.fillRect(0, 0, CARD_W, CARD_H); }

  if (artImg) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(ART_BOX.x, ART_BOX.y, ART_BOX.w, ART_BOX.h);
    ctx.clip();
    drawArtTransformed(ctx, artImg, ART_BOX.x, ART_BOX.y, ART_BOX.w, ART_BOX.h, artTransform);
    ctx.restore();
  }
}

export async function renderCardWithBleed(canvas, cardData, artImageUrl, artTransform) {
  const totalW = CARD_W + BLEED * 2;
  const totalH = CARD_H + BLEED * 2;
  canvas.width  = totalW;
  canvas.height = totalH;

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, totalW, totalH);

  const tmp = document.createElement('canvas');
  await renderCard(tmp, cardData, artImageUrl, artTransform);
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
