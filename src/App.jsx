import { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import 'mana-font/css/mana.css';
import 'keyrune/css/keyrune.css';
import { renderCard, CARD_W, CARD_H, ART_BOX } from './cardRenderer.js';
import { exportSingleCard, exportPrintSheet, exportAllDigital } from './exportUtils.js';
import { getTemplateUrl, getTemplateKey } from './templates.js';
import { parseManaTokens, manaTokenToClass } from './manaSymbols.js';

const SCRYFALL_SEARCH = 'https://api.scryfall.com/cards/named?fuzzy=';
const ARCHIDEKT_BASE = import.meta.env.DEV
  ? '/archidekt-api'
  : 'https://corsproxy.io/?url=https://archidekt.com/api';
const DEFAULT_TRANSFORM = () => ({ x: 0, y: 0, scale: 1 });

const DISPLAY_W = 375;
const DISPLAY_H = 525;

async function fetchCard(name) {
  const res = await fetch(SCRYFALL_SEARCH + encodeURIComponent(name));
  if (!res.ok) throw new Error('Card not found');
  return res.json();
}

const EXPORT_MODES = [
  { id: 'digital-one', label: 'Export current card as PNG' },
  { id: 'digital-all', label: 'Export all cards as ZIP' },
  { id: 'print',       label: 'Export all as print sheets (bleed marks, 3×3 per page)' },
];

function parseArchidektId(input) {
  const match = input.match(/archidekt\.com\/decks\/(\d+)/);
  if (match) return match[1];
  if (/^\d+$/.test(input.trim())) return input.trim();
  return null;
}

function initCustomText(card) {
  return {
    name:       card.name        || '',
    manaCost:   card.mana_cost   || '',
    typeLine:   card.type_line   || '',
    oracleText: card.oracle_text || card.card_faces?.[0]?.oracle_text || '',
    flavorText: card.flavor_text || card.card_faces?.[0]?.flavor_text || '',
    pt: card.power != null
      ? `${card.power}/${card.toughness}`
      : (card.loyalty || ''),
  };
}

function makeCard(data) {
  const imageUris = data.image_uris ?? data.card_faces?.[0]?.image_uris;
  const cardData = { ...data, image_uris: imageUris };
  return {
    cardData,
    customText:   initCustomText(data),
    artImageUrl:  null,
    artTransform: DEFAULT_TRANSFORM(),
    setSymbolUrl: null,
    templateId:   getTemplateKey(cardData),
  };
}

export default function App() {
  const [searchQuery, setSearchQuery]     = useState('');
  const [loadedCards, setLoadedCards]     = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('mtg_cards') || '[]');
      return saved.map(c => {
        const defaults = initCustomText(c.cardData);
        const ct = c.customText ?? {};
        return {
          ...c,
          customText: {
            name:       ct.name       ?? defaults.name,
            manaCost:   ct.manaCost   ?? defaults.manaCost,
            typeLine:   ct.typeLine   ?? defaults.typeLine,
            oracleText: ct.oracleText ?? defaults.oracleText,
            flavorText: ct.flavorText ?? defaults.flavorText,
            pt:         ct.pt         ?? defaults.pt,
          },
          templateId: getTemplateKey(c.cardData),
        };
      });
    } catch { return []; }
  });
  const [activeIndex, setActiveIndex]     = useState(() => {
    try {
      const saved = localStorage.getItem('mtg_active');
      const cards = JSON.parse(localStorage.getItem('mtg_cards') || '[]');
      const idx = saved !== null ? Number(saved) : null;
      return idx !== null && idx < cards.length ? idx : (cards.length > 0 ? 0 : null);
    } catch { return null; }
  });
  const [savedIndicator, setSavedIndicator] = useState(false);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');
  const [dragging, setDragging]           = useState(false);
  const [exporting, setExporting]           = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportMode, setExportMode]         = useState('digital-one');
  const [dropdownOpen, setDropdownOpen]     = useState(false);
  const [archidektInput, setArchidektInput] = useState('');
  const [importing, setImporting]         = useState(false);
  const [importError, setImportError]     = useState('');
  const [importProgress, setImportProgress] = useState('');
  const [textImporting, setTextImporting]   = useState(false);
  const [textImportError, setTextImportError] = useState('');
  const [textImportProgress, setTextImportProgress] = useState('');
  const [isPanning, setIsPanning]         = useState(false);

  const dropdownRef    = useRef(null);
  const textFileInputRef = useRef(null);

  useEffect(() => {
    if (!dropdownOpen) return;
    const close = (e) => { if (!dropdownRef.current?.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [dropdownOpen]);

  // Persist cards
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem('mtg_cards', JSON.stringify(loadedCards));
        if (activeIndex !== null) localStorage.setItem('mtg_active', String(activeIndex));
        setSavedIndicator(true);
        setTimeout(() => setSavedIndicator(false), 1500);
      } catch (e) {
        if (e.name === 'QuotaExceededError') console.warn('localStorage full');
      }
    }, 600);
    return () => clearTimeout(t);
  }, [loadedCards, activeIndex]);

  const panStart   = useRef(null);
  const touchStart = useRef(null);
  const canvasRef  = useRef(null);
  const fileInputRef = useRef(null);
  const symbolInputRef = useRef(null);

  const activeCard = activeIndex !== null ? loadedCards[activeIndex] : null;

  useEffect(() => {
    if (!canvasRef.current || !activeCard) return;
    renderCard(
      canvasRef.current,
      activeCard.cardData,
      activeCard.artImageUrl,
      activeCard.artTransform,
      activeCard.setSymbolUrl ?? null,
      activeCard.customText ?? null,
      getTemplateUrl(activeCard.templateId),
    );
  }, [activeCard]);

  // ── Single card search ──────────────────────────────────────────────────────
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await fetchCard(searchQuery.trim());
      const exists = loadedCards.findIndex(c => c.cardData.id === data.id);
      if (exists >= 0) {
        setActiveIndex(exists);
      } else {
        const newCards = [...loadedCards, makeCard(data)];
        setLoadedCards(newCards);
        setActiveIndex(newCards.length - 1);
      }
      setSearchQuery('');
    } catch {
      setError(`Card not found: "${searchQuery}"`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSearch(); };

  // ── Archidekt import ────────────────────────────────────────────────────────
  const handleArchidektImport = async () => {
    const deckId = parseArchidektId(archidektInput);
    if (!deckId) { setImportError('Paste a full Archidekt deck URL or deck ID'); return; }
    setImporting(true);
    setImportError('');
    setImportProgress('Fetching deck…');
    try {
      const res = await fetch(`${ARCHIDEKT_BASE}/decks/${deckId}/`);
      if (!res.ok) throw new Error(`Archidekt returned ${res.status}`);
      const deck = await res.json();
      const cards = deck.cards ?? [];
      if (!cards.length) throw new Error('No cards found in deck');

      const BASIC_LANDS = new Set(['Plains','Island','Swamp','Mountain','Forest','Wastes']);
      const alreadyLoaded = new Set(loadedCards.map(c => c.cardData.name));
      const seenNames = new Set();
      const toFetch = [];
      for (const entry of cards) {
        const name = entry.card?.oracleCard?.name ?? entry.card?.displayName;
        const scryfallId = entry.card?.uid;
        if (!name || BASIC_LANDS.has(name) || alreadyLoaded.has(name) || seenNames.has(name)) continue;
        seenNames.add(name);
        toFetch.push({ scryfallId, name });
      }
      if (!toFetch.length) { setImportProgress('All cards already loaded.'); setImporting(false); return; }

      const newCards = [];
      const BATCH = 75;
      for (let i = 0; i < toFetch.length; i += BATCH) {
        const batch = toFetch.slice(i, i + BATCH);
        setImportProgress(`Fetching cards ${i + 1}–${Math.min(i + BATCH, toFetch.length)} of ${toFetch.length}…`);
        const identifiers = batch.map(({ scryfallId, name }) => scryfallId ? { id: scryfallId } : { name });
        const sfRes = await fetch('https://api.scryfall.com/cards/collection', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifiers }),
        });
        const sfData = await sfRes.json();
        for (const card of (sfData.data ?? [])) {
          const imageUris = card.image_uris ?? card.card_faces?.[0]?.image_uris;
          if (imageUris) newCards.push(makeCard(card));
        }
        if (i + BATCH < toFetch.length) await new Promise(r => setTimeout(r, 100));
      }
      setLoadedCards(prev => [...prev, ...newCards]);
      setActiveIndex(prev => prev ?? (newCards.length > 0 ? loadedCards.length : null));
      setImportProgress(`Imported ${newCards.length} card${newCards.length !== 1 ? 's' : ''}.`);
      setArchidektInput('');
      setTimeout(() => setImportProgress(''), 3000);
    } catch (e) {
      setImportError(e.message);
    } finally {
      setImporting(false);
    }
  };

  // ── Text file import ────────────────────────────────────────────────────────
  function parseTextDeck(text) {
    const names = [];
    const seen = new Set();
    for (const raw of text.split('\n')) {
      const line = raw.trim();
      if (!line || line.includes('{noDeck}')) continue;
      const m = line.match(/^\d+x (.+?) \([^)]+\) \S+/);
      if (!m) continue;
      const name = m[1].trim();
      if (!seen.has(name)) { seen.add(name); names.push(name); }
    }
    return names;
  }

  const handleTextFileImport = async (file) => {
    if (!file) return;
    setTextImporting(true);
    setTextImportError('');
    setTextImportProgress('Reading file…');
    try {
      const text = await file.text();
      const names = parseTextDeck(text);
      if (!names.length) throw new Error('No valid card names found in file');
      const BASIC_LANDS = new Set(['Plains','Island','Swamp','Mountain','Forest','Wastes']);
      const alreadyLoaded = new Set(loadedCards.map(c => c.cardData.name));
      const toFetch = names.filter(n => !BASIC_LANDS.has(n) && !alreadyLoaded.has(n));
      if (!toFetch.length) {
        setTextImportProgress('All cards already loaded.');
        setTextImporting(false);
        setTimeout(() => setTextImportProgress(''), 3000);
        return;
      }
      const newCards = [];
      const BATCH = 75;
      for (let i = 0; i < toFetch.length; i += BATCH) {
        const batch = toFetch.slice(i, i + BATCH);
        setTextImportProgress(`Fetching cards ${i + 1}–${Math.min(i + BATCH, toFetch.length)} of ${toFetch.length}…`);
        const sfRes = await fetch('https://api.scryfall.com/cards/collection', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifiers: batch.map(name => ({ name })) }),
        });
        const sfData = await sfRes.json();
        for (const card of (sfData.data ?? [])) {
          const imageUris = card.image_uris ?? card.card_faces?.[0]?.image_uris;
          if (imageUris) newCards.push(makeCard(card));
        }
        if (i + BATCH < toFetch.length) await new Promise(r => setTimeout(r, 100));
      }
      setLoadedCards(prev => [...prev, ...newCards]);
      setActiveIndex(prev => prev ?? (newCards.length > 0 ? loadedCards.length : null));
      setTextImportProgress(`Imported ${newCards.length} card${newCards.length !== 1 ? 's' : ''}.`);
      setTimeout(() => setTextImportProgress(''), 3000);
    } catch (e) {
      setTextImportError(e.message);
    } finally {
      setTextImporting(false);
      if (textFileInputRef.current) textFileInputRef.current.value = '';
    }
  };

  // ── Custom text editing ─────────────────────────────────────────────────────
  const updateCustomText = useCallback((field, value) => {
    if (activeIndex === null) return;
    setLoadedCards(prev => {
      const next = [...prev];
      next[activeIndex] = {
        ...next[activeIndex],
        customText: { ...next[activeIndex].customText, [field]: value },
      };
      return next;
    });
  }, [activeIndex]);

  const resetCustomText = useCallback(() => {
    if (activeIndex === null) return;
    setLoadedCards(prev => {
      const next = [...prev];
      next[activeIndex] = {
        ...next[activeIndex],
        customText: initCustomText(next[activeIndex].cardData),
      };
      return next;
    });
  }, [activeIndex]);

  // ── Set symbol ──────────────────────────────────────────────────────────────
  const applySetSymbol = useCallback((file) => {
    if (!file || activeIndex === null) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setLoadedCards(prev => {
        const next = [...prev];
        next[activeIndex] = { ...next[activeIndex], setSymbolUrl: e.target.result };
        return next;
      });
    };
    reader.readAsDataURL(file);
  }, [activeIndex]);

  // ── Art ─────────────────────────────────────────────────────────────────────
  const applyArt = useCallback((file) => {
    if (!file || activeIndex === null) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 1200;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width  = Math.round(img.width  * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setLoadedCards(prev => {
          const next = [...prev];
          next[activeIndex] = { ...next[activeIndex], artImageUrl: dataUrl, artTransform: DEFAULT_TRANSFORM() };
          return next;
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }, [activeIndex]);

  const updateTransform = useCallback((updater) => {
    if (activeIndex === null) return;
    setLoadedCards(prev => {
      const next = [...prev];
      next[activeIndex] = { ...next[activeIndex], artTransform: updater(next[activeIndex].artTransform) };
      return next;
    });
  }, [activeIndex]);

  // ── Pan / zoom ──────────────────────────────────────────────────────────────
  const cssToCanvas = (dx, dy) => ({
    x: dx * (CARD_W / DISPLAY_W),
    y: dy * (CARD_H / DISPLAY_H),
  });

  const onMouseDown = (e) => {
    if (!activeCard?.artImageUrl) return;
    e.preventDefault();
    setIsPanning(true);
    panStart.current = { mouseX: e.clientX, mouseY: e.clientY, tx: activeCard.artTransform.x, ty: activeCard.artTransform.y };
  };

  const onMouseMove = useCallback((e) => {
    if (!isPanning || !panStart.current) return;
    const d = cssToCanvas(e.clientX - panStart.current.mouseX, e.clientY - panStart.current.mouseY);
    updateTransform(t => ({ ...t, x: panStart.current.tx + d.x, y: panStart.current.ty + d.y }));
  }, [isPanning, updateTransform]);

  const onMouseUp = () => { setIsPanning(false); panStart.current = null; };

  const onTouchStart = (e) => {
    if (!activeCard?.artImageUrl) return;
    if (e.touches.length === 1) {
      const t = e.touches[0];
      setIsPanning(true);
      panStart.current = { mouseX: t.clientX, mouseY: t.clientY, tx: activeCard.artTransform.x, ty: activeCard.artTransform.y };
    } else if (e.touches.length === 2) {
      const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      touchStart.current = { dist: d, scale: activeCard.artTransform.scale };
    }
  };

  const onTouchMove = useCallback((e) => {
    e.preventDefault();
    if (e.touches.length === 1 && isPanning && panStart.current) {
      const t = e.touches[0];
      const d = cssToCanvas(t.clientX - panStart.current.mouseX, t.clientY - panStart.current.mouseY);
      updateTransform(tr => ({ ...tr, x: panStart.current.tx + d.x, y: panStart.current.ty + d.y }));
    } else if (e.touches.length === 2 && touchStart.current) {
      const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      updateTransform(tr => ({ ...tr, scale: Math.max(0.5, Math.min(4, touchStart.current.scale * (dist / touchStart.current.dist))) }));
    }
  }, [isPanning, updateTransform]);

  const onTouchEnd = () => { setIsPanning(false); panStart.current = null; touchStart.current = null; };

  const onWheel = (e) => {
    if (!activeCard?.artImageUrl) return;
    e.preventDefault();
    updateTransform(t => ({ ...t, scale: Math.max(0.5, Math.min(4, t.scale - e.deltaY * 0.001)) }));
  };

  const zoomIn  = () => updateTransform(t => ({ ...t, scale: Math.min(4, +(t.scale + 0.1).toFixed(2)) }));
  const zoomOut = () => updateTransform(t => ({ ...t, scale: Math.max(0.5, +(t.scale - 0.1).toFixed(2)) }));


  // ── Art drop zone ───────────────────────────────────────────────────────────
  const handleDropZoneClick = () => fileInputRef.current?.click();
  const handleFileChange    = (e) => applyArt(e.target.files[0]);
  const handleDragOver      = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave     = () => setDragging(false);
  const handleDrop          = (e) => { e.preventDefault(); setDragging(false); applyArt(e.dataTransfer.files[0]); };

  const removeCard = (i) => {
    setLoadedCards(prev => {
      const next = [...prev];
      next.splice(i, 1);
      return next;
    });
    setActiveIndex(prev => {
      if (prev === null || loadedCards.length <= 1) return null;
      if (prev === i) return Math.min(i, loadedCards.length - 2);
      if (prev > i) return prev - 1;
      return prev;
    });
  };

  // ── Export ──────────────────────────────────────────────────────────────────
  const handleExport = async () => {
    if (exporting) return;
    setExporting(true);
    setExportProgress(0);
    try {
      const progress = (done, total) => setExportProgress(Math.round((done / total) * 100));
      if (exportMode === 'print') {
        await exportPrintSheet(loadedCards, progress);
      } else if (exportMode === 'digital-all') {
        await exportAllDigital(loadedCards, progress);
      } else if (exportMode === 'digital-one' && activeCard) {
        await exportSingleCard(activeCard, false);
      }
    } finally {
      setExporting(false);
      setExportProgress(0);
    }
  };


  const hasArt   = !!activeCard?.artImageUrl;
  const curScale = activeCard?.artTransform?.scale ?? 1;
  const ct       = activeCard?.customText;

  return (
    <div className="app">
      <header className="app-header">
        <span style={{ fontSize: 22 }}>🃏</span>
        <h1>MTG Card Builder</h1>
        <span className="subtitle">
          {loadedCards.length} card{loadedCards.length !== 1 ? 's' : ''} loaded · {loadedCards.filter(c => c.artImageUrl).length} with art
          {savedIndicator && <span className="saved-indicator"> · Saved</span>}
        </span>
        <div className="header-export">
          <div className="export-split-btn" ref={dropdownRef}>
            <button
              className="btn-main"
              onClick={handleExport}
              disabled={exporting || loadedCards.length === 0 || (exportMode === 'digital-one' && !activeCard)}
            >
              {exporting ? `Exporting… ${exportProgress}%` : EXPORT_MODES.find(m => m.id === exportMode)?.label}
            </button>
            <button className="btn-caret" onClick={() => setDropdownOpen(o => !o)}>▾</button>
            {dropdownOpen && (
              <div className="export-dropdown">
                {EXPORT_MODES.map(m => (
                  <button
                    key={m.id}
                    className={exportMode === m.id ? 'active' : ''}
                    onClick={() => { setExportMode(m.id); setDropdownOpen(false); }}
                  >
                    {exportMode === m.id ? '✓ ' : ''}{m.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="app-body">

        {/* ── Left Sidebar: deck navigation ── */}
        <aside className="sidebar">

          <div className="sidebar-section">
            <h2>Add Card</h2>
            <div className="search-row">
              <input
                className="search-input"
                placeholder="Card name…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="btn btn-primary" onClick={handleSearch} disabled={loading || !searchQuery.trim()}>
                {loading ? <span className="spinner" /> : 'Load'}
              </button>
            </div>
            {error && <div className="error-msg">{error}</div>}
          </div>

          <div className="sidebar-section">
            <h2>Import from Archidekt</h2>
            <div className="search-row">
              <input
                className="search-input"
                placeholder="Deck URL or ID…"
                value={archidektInput}
                onChange={e => setArchidektInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleArchidektImport(); }}
              />
              <button className="btn btn-primary" onClick={handleArchidektImport} disabled={importing || !archidektInput.trim()}>
                {importing ? <span className="spinner" /> : 'Import'}
              </button>
            </div>
            {importError    && <div className="error-msg">{importError}</div>}
            {importProgress && <div className="loading-msg"><span className={importing ? 'spinner' : ''} />{importProgress}</div>}
          </div>

          <div className="sidebar-section">
            <h2>Import from Text File</h2>
            <p style={{ fontSize: 13, color: '#475569', marginBottom: 8 }}>
              Format: <code style={{ fontSize: 11 }}>1x Card Name (set) num</code>
            </p>
            <input
              ref={textFileInputRef}
              type="file"
              accept=".txt,text/plain"
              style={{ display: 'none' }}
              onChange={e => handleTextFileImport(e.target.files[0])}
            />
            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={() => textFileInputRef.current?.click()}
              disabled={textImporting}
            >
              {textImporting ? <><span className="spinner" /> Importing…</> : 'Choose .txt file'}
            </button>
            {textImportError    && <div className="error-msg">{textImportError}</div>}
            {textImportProgress && <div className="loading-msg"><span className={textImporting ? 'spinner' : ''} />{textImportProgress}</div>}
          </div>

          <div className="sidebar-section sidebar-section-row">
            <h2>Cards ({loadedCards.length})</h2>
            {loadedCards.length > 0 && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => { setLoadedCards([]); setActiveIndex(null); }}
              >
                Remove All
              </button>
            )}
          </div>
          <div className="card-list">
            {loadedCards.length === 0 && (
              <div className="empty-list">No cards yet.<br />Search above to add one.</div>
            )}
            {loadedCards.map((c, i) => (
              <div
                key={c.cardData.id + i}
                className={`card-list-item ${i === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(i)}
              >
                <div className={`item-indicator ${c.artImageUrl ? 'has-art' : ''}`} />
                <span className="item-name">{c.customText?.name || c.cardData.name}</span>
                <span className="item-color">
                  {!c.cardData.colors || c.cardData.colors.length === 0
                    ? <i className="ms ms-c ms-cost ms-shadow" />
                    : c.cardData.colors.map(col => <i key={col} className={`ms ms-${col.toLowerCase()} ms-cost ms-shadow`} />)
                  }
                </span>
                <button
                  className="btn btn-secondary"
                  style={{ padding: '2px 8px', fontSize: 11 }}
                  onClick={e => { e.stopPropagation(); removeCard(i); }}
                >✕</button>
              </div>
            ))}
          </div>
        </aside>

        {/* ── Canvas ── */}
        <main className="main-area">
          {activeCard ? (
            <div className="canvas-section">
              <div
                className="canvas-wrapper"
                style={{ cursor: hasArt ? (isPanning ? 'grabbing' : 'grab') : 'default' }}
                onMouseLeave={onMouseUp}
              >
                <canvas
                  ref={canvasRef}
                  style={{ width: DISPLAY_W, height: DISPLAY_H, userSelect: 'none', display: 'block' }}
                  onMouseDown={onMouseDown}
                  onMouseMove={onMouseMove}
                  onMouseUp={onMouseUp}
                  onWheel={onWheel}
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                />
                {hasArt && (
                  <div
                    className="canvas-grid-overlay"
                    style={{
                      left:   `${(ART_BOX.x / CARD_W) * 100}%`,
                      top:    `${(ART_BOX.y / CARD_H) * 100}%`,
                      width:  `${(ART_BOX.w / CARD_W) * 100}%`,
                      height: `${(ART_BOX.h / CARD_H) * 100}%`,
                    }}
                  >
                    <div className="grid-rule-h" style={{ top: '33.33%' }} />
                    <div className="grid-rule-h" style={{ top: '66.66%' }} />
                    <div className="grid-rule-v" style={{ left: '33.33%' }} />
                    <div className="grid-rule-v" style={{ left: '66.66%' }} />
                    <div className="canvas-zoom-controls">
                      <button className="canvas-zoom-btn" onMouseDown={e => e.stopPropagation()} onClick={zoomOut}>−</button>
                      <span className="canvas-zoom-label">{Math.round(curScale * 100)}%</span>
                      <button className="canvas-zoom-btn" onMouseDown={e => e.stopPropagation()} onClick={zoomIn}>+</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="no-card-placeholder">
              <div className="placeholder-icon">🃏</div>
              <p>Search for a card or import a deck to get started.</p>
            </div>
          )}
        </main>

        {/* ── Right Sidebar: card details ── */}
        <aside className="right-sidebar">
          {activeCard ? (
            <>
              {/* Card header */}
              <div className="sidebar-section right-sidebar-header">
                <div className="right-sidebar-title">
                  <span className="right-sidebar-card-name">{ct?.name || activeCard.cardData.name}</span>
                  <button className="btn btn-secondary btn-sm" onClick={resetCustomText} title="Reset to Scryfall data">
                    Reset
                  </button>
                </div>
              </div>

              {/* Art */}
              <div className="sidebar-section">
                <h2>Art</h2>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                {hasArt ? (
                  <div className="art-preview">
                    <img src={activeCard.artImageUrl} alt="art preview" />
                    <div className="art-preview-actions">
                      <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handleDropZoneClick}>Replace</button>
                      <button className="btn btn-danger" onClick={() => {
                        setLoadedCards(prev => {
                          const next = [...prev];
                          next[activeIndex] = { ...next[activeIndex], artImageUrl: null, artTransform: DEFAULT_TRANSFORM() };
                          return next;
                        });
                      }}>Clear</button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`drop-zone ${dragging ? 'dragging' : ''}`}
                    onClick={handleDropZoneClick}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="drop-icon">🖼</div>
                    <div>Click or drag image here</div>
                  </div>
                )}
              </div>

              {/* Set Symbol */}
              <div className="sidebar-section">
                <h2>Set Symbol</h2>
                <input
                  ref={symbolInputRef}
                  type="file"
                  accept="image/*,.svg"
                  style={{ display: 'none' }}
                  onChange={e => { applySetSymbol(e.target.files[0]); e.target.value = ''; }}
                />
                {activeCard?.setSymbolUrl ? (
                  <div className="art-preview">
                    <img src={activeCard.setSymbolUrl} alt="set symbol preview" style={{ background: '#1e293b', padding: 6, borderRadius: 4 }} />
                    <div className="art-preview-actions">
                      <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => symbolInputRef.current?.click()}>Replace</button>
                      <button className="btn btn-danger" onClick={() => {
                        setLoadedCards(prev => {
                          const next = [...prev];
                          next[activeIndex] = { ...next[activeIndex], setSymbolUrl: null };
                          return next;
                        });
                      }}>Clear</button>
                    </div>
                    <button
                      className="btn btn-secondary"
                      style={{ width: '100%', marginTop: 6 }}
                      onClick={() => {
                        const sym = activeCard.setSymbolUrl;
                        setLoadedCards(prev => prev.map(c => ({ ...c, setSymbolUrl: sym })));
                      }}
                    >Apply to all cards</button>
                  </div>
                ) : (
                  <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => symbolInputRef.current?.click()}>
                    Upload symbol image
                  </button>
                )}
              </div>

              {/* Card Text */}
              <div className="sidebar-section">
                <h2>Card Text</h2>
                <div className="card-text-fields">
                  <div className="field-group">
                    <label className="field-label">Name</label>
                    <input
                      className="field-input"
                      value={ct?.name ?? ''}
                      onChange={e => updateCustomText('name', e.target.value)}
                      placeholder="Card name"
                    />
                  </div>

                  <div className="field-group">
                    <label className="field-label">Mana Cost</label>
                    <input
                      className="field-input"
                      value={ct?.manaCost ?? ''}
                      onChange={e => updateCustomText('manaCost', e.target.value)}
                      placeholder="{1}{R}"
                    />
                    {ct?.manaCost && (
                      <div className="mana-preview">
                        {parseManaTokens(ct.manaCost).map((tok, i) => (
                          <i key={i} className={`ms ms-${manaTokenToClass(tok)} ms-cost ms-shadow`} />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="field-group">
                    <label className="field-label">Type Line</label>
                    <input
                      className="field-input"
                      value={ct?.typeLine ?? ''}
                      onChange={e => updateCustomText('typeLine', e.target.value)}
                      placeholder="Instant"
                    />
                  </div>

                  <div className="field-group">
                    <label className="field-label">Oracle Text</label>
                    <textarea
                      className="field-input"
                      rows={5}
                      value={ct?.oracleText ?? ''}
                      onChange={e => updateCustomText('oracleText', e.target.value)}
                      placeholder="Rules text…"
                    />
                  </div>

                  <div className="field-group">
                    <label className="field-label">Flavour Text</label>
                    <textarea
                      className="field-input"
                      rows={3}
                      value={ct?.flavorText ?? ''}
                      onChange={e => updateCustomText('flavorText', e.target.value)}
                      placeholder="Italic flavour text…"
                    />
                  </div>

                  <div className="field-group">
                    <label className="field-label">P/T or Loyalty</label>
                    <input
                      className="field-input"
                      value={ct?.pt ?? ''}
                      onChange={e => updateCustomText('pt', e.target.value)}
                      placeholder="3/3"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="right-sidebar-empty">
              <div style={{ fontSize: 32, opacity: 0.2, marginBottom: 10 }}>☰</div>
              <p>Select a card to edit its details</p>
            </div>
          )}
        </aside>

      </div>
    </div>
  );
}
