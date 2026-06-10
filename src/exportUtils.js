import JSZip from 'jszip';
import { renderCard, renderCardWithBleed, CARD_W, CARD_H, BLEED } from './cardRenderer.js';

export async function exportSingleCard(cardData, artImageUrl, artTransform, withBleed = false) {
  const canvas = document.createElement('canvas');
  if (withBleed) {
    await renderCardWithBleed(canvas, cardData, artImageUrl, artTransform);
  } else {
    await renderCard(canvas, cardData, artImageUrl, artTransform);
  }
  const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${cardData.name.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
  a.click();
  URL.revokeObjectURL(url);
}

const PAGE_W = 2550;
const PAGE_H = 3300;
const PAGE_MARGIN = 100;

export async function exportPrintSheet(cards, onProgress) {
  const cardWithBleed = CARD_W + BLEED * 2;
  const cardHeightBleed = CARD_H + BLEED * 2;
  const cols = 3, rows = 3, perPage = cols * rows;
  const pages = Math.ceil(cards.length / perPage);

  for (let p = 0; p < pages; p++) {
    const canvas = document.createElement('canvas');
    canvas.width = PAGE_W;
    canvas.height = PAGE_H;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, PAGE_W, PAGE_H);

    const pageCards = cards.slice(p * perPage, (p + 1) * perPage);
    for (let i = 0; i < pageCards.length; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = PAGE_MARGIN + col * (cardWithBleed + 10);
      const y = PAGE_MARGIN + row * (cardHeightBleed + 10);
      const tmp = document.createElement('canvas');
      await renderCardWithBleed(tmp, pageCards[i].cardData, pageCards[i].artImageUrl, pageCards[i].artTransform);
      ctx.drawImage(tmp, x, y);
      if (onProgress) onProgress(p * perPage + i + 1, cards.length);
    }

    const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `print_sheet_page_${p + 1}.png`;
    a.click();
    await new Promise(r => setTimeout(r, 300));
    URL.revokeObjectURL(url);
  }
}

export async function exportAllDigital(cards, onProgress) {
  const zip = new JSZip();
  for (let i = 0; i < cards.length; i++) {
    const { cardData, artImageUrl, artTransform } = cards[i];
    const canvas = document.createElement('canvas');
    await renderCard(canvas, cardData, artImageUrl, artTransform);
    const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
    const filename = `${cardData.name.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
    zip.file(filename, blob);
    if (onProgress) onProgress(i + 1, cards.length);
  }
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cards.zip';
  a.click();
  URL.revokeObjectURL(url);
}
