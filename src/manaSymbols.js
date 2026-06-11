// Unicode private-use codepoints from mana-font and keyrune webfonts.
// Generated from node_modules CSS — do not edit manually.

const MANA_CHARS = {
  'W': '\uE600',
  'U': '\uE601',
  'B': '\uE602',
  'R': '\uE603',
  'G': '\uE604',
  'C': '\uE904',
  'S': '\uE619',
  'X': '\uE615',
  'Y': '\uE616',
  'Z': '\uE617',
  'P': '\uE618',
  'T': '\uE61A',
  'Q': '\uE61B',
  'E': '\uE907',
  '0': '\uE605',
  '1': '\uE606',
  '2': '\uE607',
  '3': '\uE608',
  '4': '\uE609',
  '5': '\uE60A',
  '6': '\uE60B',
  '7': '\uE60C',
  '8': '\uE60D',
  '9': '\uE60E',
  '10': '\uE60F',
  '11': '\uE610',
  '12': '\uE611',
  '13': '\uE612',
  '14': '\uE613',
  '15': '\uE614',
  '16': '\uE62A',
  '17': '\uE62B',
  '18': '\uE62C',
  '19': '\uE62D',
  '20': '\uE62E'
};

const HYBRID_PAIRS = {
  'W/U': ['W','U'], 'W/B': ['W','B'],
  'U/B': ['U','B'], 'U/R': ['U','R'],
  'B/R': ['B','R'], 'B/G': ['B','G'],
  'R/W': ['R','W'], 'R/G': ['R','G'],
  'G/W': ['G','W'], 'G/U': ['G','U'],
  '2/W': ['2','W'], '2/U': ['2','U'], '2/B': ['2','B'],
  '2/R': ['2','R'], '2/G': ['2','G'],
  'W/P': ['W','P'], 'U/P': ['U','P'], 'B/P': ['B','P'],
  'R/P': ['R','P'], 'G/P': ['G','P'],
};

const KEYRUNE_CHARS = {
  '40k': '\uE999',
  'dmc': '\uE995',
  'drc': '\uE9E9',
  'khc': '\uE9C5',
  'ltc': '\uE9B7',
  'ncc': '\uE98F',
  'lea': '\uE600',
  'leb': '\uE601',
  '2ed': '\uE602',
  '3ed': '\uE603',
  '4ed': '\uE604',
  'psum': '\uE605',
  '5ed': '\uE606',
  '6ed': '\uE607',
  '7ed': '\uE608',
  '8ed': '\uE609',
  '9ed': '\uE60A',
  '10e': '\uE60B',
  'm10': '\uE60C',
  'm11': '\uE60D',
  'm12': '\uE60E',
  'm13': '\uE60F',
  'm14': '\uE610',
  'm15': '\uE611',
  'bcore': '\uE612',
  'ori': '\uE697',
  'm19': '\uE941',
  'm20': '\uE95D',
  '1e': '\uE947',
  '2e': '\uE948',
  '2u': '\uE949',
  '3e': '\uE94A',
  'm21': '\uE960',
  'xdnd': '\uE972',
  'afr': '\uE972',
  'fdn': '\uE9D8',
  'arn': '\uE613',
  'atq': '\uE614',
  'leg': '\uE615',
  'drk': '\uE616',
  'fem': '\uE617',
  'hml': '\uE618',
  'ice': '\uE619',
  'ice2': '\uE925',
  'all': '\uE61A',
  'csp': '\uE61B',
  'mir': '\uE61C',
  'vis': '\uE61D',
  'wth': '\uE61E',
  'tmp': '\uE61F',
  'sth': '\uE620',
  'exo': '\uE621',
  'usg': '\uE622',
  'ulg': '\uE623',
  'uds': '\uE624',
  'mmq': '\uE625',
  'nem': '\uE626',
  'nms': '\uE626',
  'pcy': '\uE627',
  'inv': '\uE628',
  'pls': '\uE629',
  'apc': '\uE62A',
  'ody': '\uE62B',
  'tor': '\uE62C',
  'jud': '\uE62D',
  'ons': '\uE62E',
  'lgn': '\uE62F',
  'scg': '\uE630',
  'mrd': '\uE631',
  'dst': '\uE632',
  '5dn': '\uE633',
  'chk': '\uE634',
  'bok': '\uE635',
  'sok': '\uE636',
  'rav': '\uE637',
  'gpt': '\uE638',
  'dis': '\uE639',
  'tsp': '\uE63A',
  'plc': '\uE63B',
  'fut': '\uE63C',
  'lrw': '\uE63D',
  'mor': '\uE63E',
  'shm': '\uE63F',
  'eve': '\uE640',
  'ala': '\uE641',
  'con': '\uE642',
  'arb': '\uE643',
  'zen': '\uE644',
  'wwk': '\uE645',
  'roe': '\uE646',
  'som': '\uE647',
  'mbs': '\uE648',
  'nph': '\uE649',
  'isd': '\uE64A',
  'dka': '\uE64B',
  'avr': '\uE64C',
  'rtr': '\uE64D',
  'gtc': '\uE64E',
  'dgm': '\uE64F',
  'ths': '\uE650',
  'bng': '\uE651',
  'jou': '\uE652',
  'ktk': '\uE653',
  'frf': '\uE654',
  'dtk': '\uE693',
  'bfz': '\uE699',
  'ogw': '\uE901',
  'soi': '\uE902',
  'emn': '\uE90B',
  'kld': '\uE90E',
  'aer': '\uE90F',
  'akh': '\uE914',
  'hou': '\uE924',
  'xln': '\uE92E',
  'rix': '\uE92F',
  'dom': '\uE93F',
  'grn': '\uE94B',
  'gk1': '\uE94B',
  'rna': '\uE959',
  'gk2': '\uE959',
  'war': '\uE95A',
  'eld': '\uE95E',
  'thb': '\uE961',
  'iko': '\uE962',
  'znr': '\uE963',
  'xkld': '\uE974',
  'khm': '\uE974',
  'xssm': '\uE975',
  'stx': '\uE975',
  'mid': '\uE978',
  'vow': '\uE977',
  'neo': '\uE98C',
  'snc': '\uE98B',
  'dmu': '\uE993',
  'bro': '\uE99D',
  'one': '\uE9A1',
  'mom': '\uE9A2',
  'mat': '\uE9A3',
  'woe': '\uE9AE',
  'lci': '\uE9C2',
  'mkm': '\uE9C9',
  'otj': '\uE9CC',
  'blb': '\uE9CD',
  'dsk': '\uE9D7',
  'dft': '\uE9E0',
  'tdm': '\uE9E6',
  'fin': '\uE9ED',
  'eoe': '\uE9F0',
  'spm': '\uE9F1',
  'tla': '\uE9FB',
  'ecl': '\uEA04',
  'tmt': '\uEA06',
  'sos': '\uEA18',
  'msh': '\uEA1A',
  'hob': '\uEA19',
  'fra': '\uEA22',
  'van': '\uE655',
  'hop': '\uE656',
  'arc': '\uE657',
  'cmd': '\uE658',
  'pc2': '\uE659',
  'cm1': '\uE65A',
  'c13': '\uE65B',
  'cns': '\uE65C',
  'c14': '\uE65D',
  'c15': '\uE900',
  'cn2': '\uE904',
  'c16': '\uE9E5',
  'pca': '\uE911',
  'cma': '\uE916',
  'e01': '\uE92D',
  'ann': '\uE92D',
  'e02': '\uE931',
  'c17': '\uE934',
  'cm2': '\uE940',
  'bbd': '\uE942',
  'c18': '\uE946',
  'c19': '\uE95F',
  'c20': '\uE966',
  'znc': '\uE967',
  'cc1': '\uE968',
  'cmr': '\uE969',
  'cmc': '\uE969',
  'c21': '\uE97E',
  'afc': '\uE981',
  'mic': '\uE985',
  'voc': '\uE986',
  'cc2': '\uE987',
  'nec': '\uE98D',
  'clb': '\uE991',
  'brc': '\uE99F',
  'onc': '\uE9A8',
  'moc': '\uE9A9',
  'scd': '\uE9AB',
  'cmm': '\uE9B5',
  'woc': '\uE9B9',
  'lcc': '\uE9C7',
  'mkc': '\uE9CA',
  'otc': '\uE9D2',
  'blc': '\uE9D4',
  'm3c': '\uE9D0',
  'dsc': '\uE9DC',
  'fdc': '\uE9E4',
  'tdc': '\uE9F4',
  'fic': '\uE9F5',
  'eoc': '\uE9F6',
  'ecc': '\uEA11',
  'tmc': '\uEA15',
  'soc': '\uEA1C',
  'hoc': '\uEA1E',
  'msc': '\uEA1F',
  'chr': '\uE65E',
  'ath': '\uE65F',
  'brb': '\uE660',
  'btd': '\uE661',
  'dkm': '\uE662',
  'mma': '\uE663',
  'mm2': '\uE695',
  'ema': '\uE903',
  'mm3': '\uE912',
  'ren': '\uE917',
  'xren': '\uE917',
  'rin': '\uE918',
  'xrin': '\uE918',
  'ima': '\uE935',
  'a25': '\uE93D',
  'uma': '\uE958',
  'mh1': '\uE95B',
  '2xm': '\uE96E',
  'jmp': '\uE96F',
  'mb1': '\uE971',
  'mh2': '\uE97B',
  'sta': '\uE980',
  'j21': '\uE983',
  '2x2': '\uE99C',
  'brr': '\uE9A0',
  'j22': '\uE9AD',
  'mul': '\uE9BA',
  'wot': '\uE9C0',
  'br': '\uE9C1',
  'spg': '\uE9C8',
  'otp': '\uE9D5',
  'big': '\uE9D6',
  'mb2': '\uE9D9',
  'j25a': '\uE9DB',
  'j25': '\uE9DF',
  'pio': '\uE9E7',
  'fca': '\uE9F8',
  'mar': '\uE9F9',
  'soa': '\uEA20',
  'por': '\uE664',
  'p02': '\uE665',
  'po2': '\uE665',
  'ptk': '\uE666',
  's99': '\uE667',
  's00': '\uE668',
  'w16': '\uE907',
  'w17': '\uE923',
  'evg': '\uE669',
  'dd2': '\uE66A',
  'ddc': '\uE66B',
  'ddd': '\uE66C',
  'dde': '\uE66D',
  'ddf': '\uE66E',
  'ddg': '\uE66F',
  'ddh': '\uE670',
  'ddi': '\uE671',
  'ddj': '\uE672',
  'ddk': '\uE673',
  'ddl': '\uE674',
  'ddm': '\uE675',
  'ddn': '\uE676',
  'ddo': '\uE677',
  'ddp': '\uE698',
  'ddq': '\uE908',
  'ddr': '\uE90D',
  'td2': '\uE91C',
  'dds': '\uE921',
  'ddt': '\uE933',
  'ddu': '\uE93E',
  'drb': '\uE678',
  'v09': '\uE679',
  'v10': '\uE67A',
  'v11': '\uE67B',
  'v12': '\uE67C',
  'v13': '\uE67D',
  'v14': '\uE67E',
  'v15': '\uE905',
  'v16': '\uE906',
  'v0x': '\uE920',
  'v17': '\uE939',
  'h09': '\uE67F',
  'pd2': '\uE680',
  'pd3': '\uE681',
  'md1': '\uE682',
  'ss1': '\uE944',
  'ss2': '\uE95C',
  'ss3': '\uE96D',
  'gs1': '\uE945',
  'azorius': '\uE94E',
  'boros': '\uE94F',
  'dimir': '\uE950',
  'golgari': '\uE951',
  'gruul': '\uE952',
  'izzet': '\uE953',
  'orzhov': '\uE954',
  'rakdos': '\uE955',
  'selesnya': '\uE956',
  'simic': '\uE957',
  'gnt': '\uE94D',
  'gn2': '\uE964',
  'tsr': '\uE976',
  'dmr': '\uE9A4',
  'gn3': '\uE9A5',
  'ltr': '\uE9AF',
  'who': '\uE9B0',
  'rvr': '\uE9BB',
  'pip': '\uE9C3',
  'clu': '\uE9CB',
  'acr': '\uE9CE',
  'mh3': '\uE9CF',
  'inr': '\uE9E2',
  'spe': '\uE9F3',
  'tle': '\uEA0B',
  'pza': '\uEA08',
  'pgru': '\uE683',
  'pmtg1': '\uE684',
  'pmtg2': '\uE685',
  'pleaf': '\uE686',
  'pmei': '\uE687',
  'htr': '\uE687',
  'htr17': '\uE687',
  'parl': '\uE688',
  'dpa': '\uE689',
  'pbook': '\uE68A',
  'past': '\uE68B',
  'parl2': '\uE68C',
  'exp': '\uE69A',
  'psalvat05': '\uE909',
  'psalvat11': '\uE90A',
  'mps': '\uE913',
  'mp1': '\uE913',
  'pxbox': '\uE915',
  'pmps': '\uE919',
  'pmpu': '\uE91A',
  'mp2': '\uE922',
  'pidw': '\uE92C',
  'pdrc': '\uE932',
  'pheart': '\uE936',
  'h17': '\uE938',
  'pdep': '\uE93A',
  'psega': '\uE93B',
  'ptsa': '\uE93C',
  'parl3': '\uE943',
  'med': '\uE94C',
  'ptg': '\uE965',
  'j20': '\uE96A',
  'zne': '\uE97A',
  'bot': '\uE99E',
  'rex': '\uE9C4',
  'eos': '\uEA00',
  'slu': '\uE687',
  'sld': '\uE687',
  'psld': '\uE687',
  'sld2': '\uE9BC',
  'me1': '\uE68D',
  'me2': '\uE68E',
  'me3': '\uE68F',
  'me4': '\uE690',
  'tpr': '\uE694',
  'vma': '\uE696',
  'pz1': '\uE90C',
  'xlcu': '\uE90C',
  'modo': '\uE91B',
  'pmodo': '\uE91B',
  'duels': '\uE91D',
  'xduels': '\uE91D',
  'xmods': '\uE91E',
  'pz2': '\uE91F',
  'ha1': '\uE96B',
  'akr': '\uE970',
  'klr': '\uE97C',
  'y22': '\uE989',
  'ymid': '\uE989',
  'yneo': '\uE989',
  'ysnc': '\uE989',
  'hbg': '\uE9A6',
  'y23': '\uE9A7',
  'ybro': '\uE9A7',
  'ydmu': '\uE9A7',
  'yone': '\uE9A7',
  'sir': '\uE9B1',
  'sis': '\uE9B2',
  'ea1': '\uE9B4',
  'y24': '\uE9BD',
  'ylci': '\uE9BD',
  'ymkm': '\uE9BD',
  'yotj': '\uE9BD',
  'ywoe': '\uE9BD',
  'y25': '\uE9DA',
  'yblb': '\uE9DA',
  'ydft': '\uE9DA',
  'ydsk': '\uE9DA',
  'ytdm': '\uE9DA',
  'yeoe': '\uE9DA',
  'pma': '\uEA01',
  'pm2': '\uEA02',
  'dvk': '\uEA03',
  'om1': '\uEA0E',
  'omb': '\uEA10',
  'y26': '\uEA1B',
  'ugl': '\uE691',
  'unh': '\uE692',
  'ust': '\uE930',
  'und': '\uE96C',
  'unf': '\uE98A',
  'una': '\uE9BE',
  'xcle': '\uE926',
  'xice': '\uE927',
  'x2ps': '\uE928',
  'x4ea': '\uE929',
  'papac': '\uE92A',
  'peuro': '\uE92B',
  'pfnm': '\uE937',
  '30a': '\uE9AA'
};

/** Parse "{2}{R}{G}" -> ["2","R","G"] */
export function parseManaTokens(manaCost) {
  if (!manaCost) return [];
  const tokens = [];
  const re = /\{([^}]+)\}/g;
  let m;
  while ((m = re.exec(manaCost)) !== null) tokens.push(m[1].toUpperCase());
  return tokens;
}

/** Token -> mana-font CSS class suffix for HTML (e.g. "W/U" -> "wu") */
export function manaTokenToClass(token) {
  return token.toLowerCase().replace('/', '');
}

/** Scryfall set code -> Keyrune char, or null */
export function keyruneChar(setCode) {
  return KEYRUNE_CHARS[(setCode || '').toLowerCase()] ?? null;
}

/** Rarity -> tint color for set symbol */
export function rarityColor(rarity) {
  switch ((rarity || '').toLowerCase()) {
    case 'uncommon': return '#A0B4BC';
    case 'rare':     return '#C8A844';
    case 'mythic':   return '#E8622A';
    default:         return '#1A1A18';
  }
}

// Background colors for each mana token (matches mana-font CSS)
const MANA_BG = {
  'W': '#F0E3B8', 'U': '#B5CAE6', 'B': '#A19C9A',
  'R': '#DEA285', 'G': '#BFD5BF', 'C': '#AAA9A9',
  'S': '#C9D8E2', 'P': '#2C0D44', 'T': '#7B7B7B',
  'Q': '#7B7B7B', 'E': '#7B7B7B',
};
// Light backgrounds that need dark glyph text
const MANA_LIGHT = new Set(['W', 'S', 'C']);

function _manaBg(token) {
  if (MANA_BG[token]) return MANA_BG[token];
  // Numeric generics and X/Y/Z get beige
  return '#C9B99A';
}

function _manaGlyphColor(token) {
  return MANA_LIGHT.has(token) ? '#1A1A18' : '#000000';
}

/** Draw a single mana symbol circle centered at (cx, cy). */
function _drawManaCircle(ctx, token, cx, cy, r) {
  const ch = MANA_CHARS[token];
  if (!ch) return;

  ctx.save();

  // Shadow
  ctx.shadowColor = 'rgba(0,0,0,0.8)';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = -1;
  ctx.shadowOffsetY = 3;

  // Circle background
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = _manaBg(token);
  ctx.fill();

  // Glyph — shadow off for text
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  const fontSize = r * 1.5;
  ctx.font = `${fontSize}px 'Mana'`;
  ctx.fillStyle = _manaGlyphColor(token);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(ch, cx, cy);

  ctx.restore();
}

/** Draw mana cost icons on canvas, right-aligned to rightX at vertical midY. */
export function drawManaCost(ctx, tokens, rightX, midY, symbolSize) {
  if (!tokens.length) return rightX;
  const r = symbolSize / 2;
  const gap = 4;
  const step = symbolSize + gap;
  const totalW = tokens.length * step - gap;
  let cx = rightX - totalW + r;

  for (const token of tokens) {
    const hybrid = HYBRID_PAIRS[token];
    if (hybrid) {
      _drawHybrid(ctx, hybrid[0], hybrid[1], cx, midY, r);
    } else {
      _drawManaCircle(ctx, token, cx, midY, r);
    }
    cx += step;
  }

  return rightX - totalW;
}

function _drawHybrid(ctx, tokenA, tokenB, cx, cy, r) {
  const chA = MANA_CHARS[tokenA], chB = MANA_CHARS[tokenB];
  const fontSize = r * 1.5;

  ctx.save();

  // Shadow on circle
  ctx.shadowColor = 'rgba(0,0,0,0.8)';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = -2;
  ctx.shadowOffsetY = 2;

  // Left half background
  if (chA) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI * 0.5, Math.PI * 1.5);
    ctx.lineTo(cx, cy - r);
    ctx.fillStyle = _manaBg(tokenA);
    ctx.fill();
    ctx.restore();
  }

  // Right half background
  if (chB) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI * 0.5, Math.PI * 0.5);
    ctx.lineTo(cx, cy + r);
    ctx.fillStyle = _manaBg(tokenB);
    ctx.fill();
    ctx.restore();
  }

  // Circle outline
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // Left glyph clipped to left half
  if (chA) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(cx - r, cy - r, r, r * 2);
    ctx.clip();
    ctx.font = `${fontSize}px 'Mana'`;
    ctx.fillStyle = _manaGlyphColor(tokenA);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(chA, cx, cy);
    ctx.restore();
  }

  // Right glyph clipped to right half
  if (chB) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(cx, cy - r, r, r * 2);
    ctx.clip();
    ctx.font = `${fontSize}px 'Mana'`;
    ctx.fillStyle = _manaGlyphColor(tokenB);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(chB, cx, cy);
    ctx.restore();
  }

  ctx.restore();
}

/** Draw a keyrune set symbol centered at (cx, cy). Returns true if drawn. */
export function drawKeyruneSymbol(ctx, setCode, cx, cy, size, color) {
  const ch = keyruneChar(setCode);
  if (!ch) return false;
  ctx.save();
  ctx.font = size + "px 'Keyrune'";
  ctx.fillStyle = color || '#1A1A18';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(ch, cx, cy);
  ctx.restore();
  return true;
}
