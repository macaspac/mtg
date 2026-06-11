export const TEMPLATE_MAP = {
  'W-creature':  '/mtg/templates/white-creature.png',
  'W-non':       '/mtg/templates/white-noncreature.png',
  'U-creature':  '/mtg/templates/blue-creature.png',
  'U-non':       '/mtg/templates/blue-noncreature.png',
  'B-creature':  '/mtg/templates/black-creature.png',
  'B-non':       '/mtg/templates/black-noncreature.png',
  'R-creature':  '/mtg/templates/red-creature.png',
  'R-non':       '/mtg/templates/red-noncreature.png',
  'G-creature':  '/mtg/templates/green-creature.png',
  'G-non':       '/mtg/templates/green-noncreature.png',
  'M-creature':  '/mtg/templates/gold-creature.png',
  'M-non':       '/mtg/templates/gold-noncreature.png',
  'C-creature':  '/mtg/templates/colorless-creature.png',
  'C-non':       '/mtg/templates/colourless-noncreature.png',
};

export function getTemplateUrl(key) {
  return key ? (TEMPLATE_MAP[key] ?? null) : null;
}

export function cardColorKey(colors) {
  if (!colors || colors.length === 0) return 'C';
  if (colors.length > 1) return 'M';
  return colors[0];
}

export function isCreatureType(typeLine) {
  if (!typeLine) return false;
  return typeLine.split('—')[0].toLowerCase().includes('creature');
}

export function getTemplateKey(cardData) {
  const color = cardColorKey(cardData.colors);
  const creature = isCreatureType(cardData.type_line);
  return `${color}-${creature ? 'creature' : 'non'}`;
}
