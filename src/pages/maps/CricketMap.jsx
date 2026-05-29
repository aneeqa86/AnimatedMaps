import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { useNavigate } from 'react-router-dom';
import { CHAPTERS, POWER_SHIFT, ICC_MEMBERS, TROPHY_LOG } from '@/data/cricketMap';

// ─── Cricket colour palette ───────────────────────────────────────────────────
const C = {
  pitchGreen:   '#1E4D2B',   // deep outfield green — panels
  feltGreen:    '#265C34',   // slightly lighter — borders / hover
  grassBright:  '#3a7d44',   // mid green
  lime:         '#86efac',   // bright accent
  cream:        '#F5F0E0',   // off-white text / background
  parchment:    '#EDE8D5',   // lighter cream
  gold:         '#D4A017',   // cricket gold / trophy
  goldBright:   '#F5C842',
  red:          '#9B2335',   // England red
  redBright:    '#CC3333',
  white:        '#FAFAF8',
  dimText:      'rgba(245,240,224,0.55)',
  panelBg:      'rgba(20,50,28,0.97)',   // main panel bg
  panelBorder:  'rgba(58,125,68,0.45)',
  headerBg:     'rgba(18,44,24,0.99)',
  bottomBg:     'rgba(16,40,20,0.99)',
  scoreBugBg:   'rgba(20,50,28,0.95)',
};

// ─── Keyframes ────────────────────────────────────────────────────────────────
const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,300;0,400;0,600;0,700;0,800;1,400&family=DM+Mono:wght@300;400;500&family=Playfair+Display:ital,wght@0,700;1,400&display=swap');

  @keyframes lowerThirdIn  { 0%{transform:translateX(-110%);opacity:0} 100%{transform:translateX(0);opacity:1} }
  @keyframes scoreBugIn    { 0%{transform:translateY(36px);opacity:0}  100%{transform:translateY(0);opacity:1} }
  @keyframes statReveal    { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes tvCut         { 0%{opacity:0} 100%{opacity:1} }
  @keyframes liveFlash     { 0%,49%{opacity:1} 50%,100%{opacity:0} }
  @keyframes mPulse        { 0%,100%{transform:scale(1)} 50%{transform:scale(1.45)} }
  @keyframes shimmer       { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  @keyframes fadeUp        { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  @keyframes borderPulse   { 0%,100%{border-color:rgba(134,239,172,0.35)} 50%{border-color:rgba(134,239,172,0.8)} }

  .lt-anim    { animation: lowerThirdIn 0.45s cubic-bezier(.22,1,.36,1) both; }
  .bug-anim   { animation: scoreBugIn   0.5s  cubic-bezier(.22,1,.36,1) both; }
  .sr-anim    { animation: statReveal   0.4s  ease both; }
  .tv-anim    { animation: tvCut        0.3s  ease both; }
  .live-dot   { animation: liveFlash    1s    steps(1) infinite; }
  .fade-up    { animation: fadeUp       0.35s ease both; }

  .mapboxgl-ctrl-bottom-left,.mapboxgl-ctrl-bottom-right,.mapboxgl-ctrl-attrib{display:none!important;}
  .mapboxgl-popup-content{background:transparent!important;border:none!important;box-shadow:none!important;padding:0!important;}
  .mapboxgl-popup-tip{display:none!important;}

  .panel-scroll::-webkit-scrollbar{width:3px;}
  .panel-scroll::-webkit-scrollbar-track{background:transparent;}
  .panel-scroll::-webkit-scrollbar-thumb{background:rgba(134,239,172,0.25);border-radius:2px;}

  .dot-btn:hover > div { transform: scale(1.3) !important; }
  .dot-btn { transition: all 0.2s; }

  .ctrl-btn {
    background: transparent;
    border: 1px solid rgba(58,125,68,0.4);
    color: rgba(134,239,172,0.6);
    cursor: pointer;
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    padding: 5px 14px;
    letter-spacing: 0.14em;
    transition: all 0.18s;
  }
  .ctrl-btn:hover {
    background: rgba(58,125,68,0.2);
    border-color: rgba(134,239,172,0.6);
    color: #86efac;
  }

  .nation-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 8px;
    border-radius: 2px;
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.06em;
    border: 1px solid;
    transition: opacity 0.3s;
  }
`;

// ─── Map source/layer IDs ─────────────────────────────────────────────────────
const FLOW_SRC = 'cricket-flows';
const FILL_SRC = 'country-boundaries';
const FILL_LYR = 'cricket-fills';
const DASH_LYR = 'cricket-dash';
const LINE_LYR = 'cricket-lines';
const AUTO_MS  = 7500;

// ─── Chapter type → accent colour ────────────────────────────────────────────
const TYPE_COLOR = {
  empire:    C.red,
  rivalry:   '#b85a40',
  milestone: C.gold,
  shift:     C.lime,
  today:     C.lime,
};

const powerColor = (v) => v < 30 ? '#b85a40' : v < 60 ? C.goldBright : C.lime;

// ─── Format taxonomy — derived from chapter badge ─────────────────────────────
// Every chapter belongs to exactly one ERA and one FORMAT
const ERA_FROM_ID = {
  origins: 'HISTORY', first_test: 'HISTORY', test_era: 'HISTORY',
  first_odi_wc: 'ODI', wc_1979: 'ODI', wc_1983: 'ODI', wc_1987: 'ODI',
  wc_1992: 'ODI', wc_1996: 'ODI', wc_1999: 'ODI', wc_2003: 'ODI',
  wc_2007: 'ODI', wc_2011: 'ODI', wc_2015: 'ODI', wc_2019: 'ODI', wc_2023: 'ODI',
  t20_born: 'T20', t20wc_2007: 'T20', t20_expansion: 'T20',
  ct_era: 'CHAMPIONS TROPHY',
  ipl_era: 'FRANCHISE',
  today: 'TODAY',
};

const ERA_STYLE = {
  HISTORY:           { color: '#c87941', bg: 'rgba(200,121,65,0.15)',  label: 'TEST & ORIGINS',     icon: '📜' },
  ODI:               { color: '#2a7abf', bg: 'rgba(42,122,191,0.15)',  label: 'ODI WORLD CUP',      icon: '🏆' },
  T20:               { color: '#9333ea', bg: 'rgba(147,51,234,0.15)',  label: 'T20 CRICKET',        icon: '⚡' },
  'CHAMPIONS TROPHY':{ color: '#d97706', bg: 'rgba(217,119,6,0.15)',   label: 'CHAMPIONS TROPHY',   icon: '🥈' },
  FRANCHISE:         { color: '#dc2626', bg: 'rgba(220,38,38,0.15)',   label: 'FRANCHISE / IPL',    icon: '💸' },
  TODAY:             { color: C.lime,    bg: 'rgba(134,239,172,0.12)', label: 'MODERN CRICKET',     icon: '👑' },
};

// ─── ISO-2 → { name, cdn } ─────────────────────────────────────────────────────
// cdn: lowercase code for flagcdn.com  (gb-eng = St George's Cross for England)
const ISO_META = {
  GB: { name: 'England',      cdn: 'gb-eng' },
  AU: { name: 'Australia',    cdn: 'au'     },
  IN: { name: 'India',        cdn: 'in'     },
  PK: { name: 'Pakistan',     cdn: 'pk'     },
  NZ: { name: 'New Zealand',  cdn: 'nz'     },
  ZA: { name: 'South Africa', cdn: 'za'     },
  LK: { name: 'Sri Lanka',    cdn: 'lk'     },
  BD: { name: 'Bangladesh',   cdn: 'bd'     },
  JM: { name: 'West Indies',  cdn: 'jm'     },
  TT: { name: 'West Indies',  cdn: 'tt'     },
  BB: { name: 'West Indies',  cdn: 'bb'     },
  GY: { name: 'West Indies',  cdn: 'gy'     },
  AG: { name: 'West Indies',  cdn: 'ag'     },
  ZW: { name: 'Zimbabwe',     cdn: 'zw'     },
  IE: { name: 'Ireland',      cdn: 'ie'     },
  AF: { name: 'Afghanistan',  cdn: 'af'     },
};

// flagcdn.com — 32×24 px rectangular flag images
const flagUrl = (cdn) => `https://flagcdn.com/32x24/${cdn}.png`;

// ISO-2 → approximate lng/lat centre for flag pin
const ISO_CENTER = {
  GB: [-1.5, 52.5], AU: [134.0, -25.0], IN: [78.9, 22.0],
  PK: [69.3, 30.4], NZ: [172.5, -41.5], ZA: [25.0, -29.0],
  LK: [80.7, 7.9],  BD: [90.4, 23.7],
  JM: [-77.3, 18.1], TT: [-61.2, 10.7], GY: [-58.9, 4.9],
  BB: [-59.5, 13.1], AG: [-61.8, 17.1],
  ZW: [29.8, -19.0], IE: [-8.2, 53.2], AF: [67.7, 33.9],
};

// Deduplicate WI islands — show one flag pin in the Caribbean
const dedupeForFlags = (fills) => {
  const seen = new Set();
  return fills.filter(f => {
    const key = ['JM','TT','BB','GY','AG'].includes(f.iso) ? 'WI' : f.iso;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

// ─── Map helpers ──────────────────────────────────────────────────────────────
const clearMarkers = (ref) => { ref.current.forEach(m => m.remove()); ref.current = []; };

const placeMarkers = (map, markers, ref) => {
  clearMarkers(ref);
  markers.forEach(({ ll, e, label, pulse }) => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;pointer-events:none;user-select:none';
    const ico = document.createElement('div');
    ico.textContent = e;
    ico.style.cssText = `font-size:22px;line-height:1;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.35));${
      pulse ? 'animation:mPulse 1.6s ease-in-out infinite;' : ''
    }`;
    const lbl = document.createElement('div');
    lbl.textContent = label;
    lbl.style.cssText = "font-family:'DM Mono',monospace;font-size:8px;color:#1a2a1a;" +
      'background:rgba(245,240,224,0.96);padding:2px 7px;border-radius:2px;margin-top:3px;' +
      'white-space:nowrap;border:1px solid rgba(27,77,46,0.25);box-shadow:0 1px 5px rgba(0,0,0,0.14);';
    wrap.appendChild(ico); wrap.appendChild(lbl);
    ref.current.push(new mapboxgl.Marker({ element: wrap, anchor: 'bottom' }).setLngLat(ll).addTo(map));
  });
};

const placeFlagMarkers = (map, fills, ref) => {
  clearMarkers(ref);
  dedupeForFlags(fills).filter(f => ISO_CENTER[f.iso]).forEach(({ iso, color }) => {
    const isWI   = ['JM','TT','BB','GY','AG'].includes(iso);
    // For West Indies use Jamaica's flag as representative
    const cdnIso = isWI ? 'jm' : (ISO_META[iso]?.cdn || iso.toLowerCase());
    const name   = isWI ? 'West Indies' : (ISO_META[iso]?.name || iso);
    const ll     = isWI ? [-59.5, 13.1] : ISO_CENTER[iso];

    // ── Outer wrapper ─────────────────────────────────────────────────────────
    const el = document.createElement('div');
    el.style.cssText = 'display:flex;flex-direction:column;align-items:center;pointer-events:none;user-select:none;';

    // ── Pin body — rectangular flag image with border ─────────────────────────
    const pin = document.createElement('div');
    pin.style.cssText = [
      'border:2.5px solid ' + color,
      'border-radius:3px',
      'overflow:hidden',
      'box-shadow:0 3px 12px rgba(0,0,0,0.32)',
      'background:#eee',
      'width:38px',
      'height:26px',
      'position:relative',
    ].join(';');

    const img = document.createElement('img');
    img.src    = flagUrl(cdnIso);
    img.alt    = name;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
    // Fallback: show ISO text if image fails
    img.onerror = () => { img.style.display='none'; pin.style.fontSize='8px'; pin.style.display='flex'; pin.style.alignItems='center'; pin.style.justifyContent='center'; pin.style.color='#333'; pin.style.fontFamily="'DM Mono',monospace"; pin.textContent=iso; };

    pin.appendChild(img);

    // ── Pointer triangle at bottom of pin ────────────────────────────────────
    const pointer = document.createElement('div');
    pointer.style.cssText = [
      'width:0', 'height:0',
      'border-left:6px solid transparent',
      'border-right:6px solid transparent',
      'border-top:7px solid ' + color,
      'margin-top:-1px',
    ].join(';');

    // ── Country name label ────────────────────────────────────────────────────
    const lbl = document.createElement('div');
    lbl.textContent = name;
    lbl.style.cssText = [
      "font-family:'DM Mono',monospace",
      'font-size:7.5px',
      'color:#1a2a1a',
      'background:rgba(245,240,224,0.97)',
      'padding:1px 5px',
      'border-radius:2px',
      'margin-top:3px',
      'white-space:nowrap',
      'border:1px solid rgba(27,77,46,0.2)',
      'box-shadow:0 1px 4px rgba(0,0,0,0.12)',
    ].join(';');

    el.appendChild(pin);
    el.appendChild(pointer);
    el.appendChild(lbl);

    ref.current.push(
      new mapboxgl.Marker({ element: el, anchor: 'bottom' }).setLngLat(ll).addTo(map)
    );
  });
};
const flowGeoJSON = (flows) => ({
  type: 'FeatureCollection',
  features: flows.map((f, i) => ({
    type: 'Feature', id: i,
    properties: { color: f.color },
    geometry: { type: 'LineString', coordinates: [f.from, f.to] },
  })),
});

const applyChapter = (map, ch) => {
  const fe = ['match', ['get', 'iso_3166_1']];
  ch.fills.forEach(f => fe.push(f.iso, f.color));
  fe.push('rgba(0,0,0,0)');
  const oe = ['match', ['get', 'iso_3166_1']];
  ch.fills.forEach(f => oe.push(f.iso, f.opacity));
  oe.push(0);
  if (map.getLayer(FILL_LYR)) {
    map.setPaintProperty(FILL_LYR, 'fill-color', fe);
    map.setPaintProperty(FILL_LYR, 'fill-opacity', oe);
  }
  if (map.getSource(FLOW_SRC)) map.getSource(FLOW_SRC).setData(flowGeoJSON(ch.flows));
  map.flyTo({ center: ch.focus.center, zoom: ch.focus.zoom, duration: 2200, essential: true });
};

// ─── useCounter ───────────────────────────────────────────────────────────────
const useCounter = (target, duration = 1100) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
};

// ─── NationChips ─────────────────────────────────────────────────────────────
// Shows flag + name chips for each highlighted nation in the chapter
const NationChips = ({ fills }) => {
  // Deduplicate WI + filter to known ISOs
  const unique = [];
  const seen = new Set();
  fills.forEach(f => {
    const isWI = ['JM','TT','BB','GY','AG'].includes(f.iso);
    const key  = isWI ? 'WI' : f.iso;
    if (seen.has(key)) return;
    seen.add(key);
    const cdnIso = isWI ? 'jm' : (ISO_META[f.iso]?.cdn || f.iso.toLowerCase());
    const name   = isWI ? 'West Indies' : (ISO_META[f.iso]?.name || f.iso);
    unique.push({ ...f, key, cdnIso, name });
  });

  if (unique.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
      {unique.map(({ key, cdnIso, name, color }) => (
        <span
          key={key}
          className="nation-chip"
          style={{
            background: color + '18',
            borderColor: color + '55',
            color: C.cream,
          }}
        >
          <img
            src={flagUrl(cdnIso)}
            alt={name}
            style={{
              width: 20, height: 14, objectFit: 'cover',
              borderRadius: 1,
              border: '1px solid rgba(255,255,255,0.25)',
              flexShrink: 0,
              display: 'block',
            }}
          />
          <span>{name}</span>
        </span>
      ))}
    </div>
  );
};

// ─── TrophyBoard ─────────────────────────────────────────────────────────────
const TrophyBoard = ({ trophies, open, onToggle }) => {
  const { WC, T20WC, CT } = trophies;
  const hasAny = WC.length > 0 || T20WC.length > 0 || CT.length > 0;

  return (
    <div style={{
      background: 'rgba(16,40,22,0.9)',
      border: `1px solid ${C.panelBorder}`,
      marginBottom: 8,
    }}>
      <div onClick={onToggle} style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '8px 14px', cursor: 'pointer',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: 14 }}>🏆</span>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 8, letterSpacing: '0.2em', color: C.gold }}>
            WORLD CUP RECORD
          </span>
        </div>
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: C.grassBright }}>
          {open ? '▲' : '▼'}
        </span>
      </div>

      {open && (
        <div style={{ padding: '0 14px 10px' }}>
          {!hasAny ? (
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 8, color: C.grassBright }}>
              No titles yet
            </span>
          ) : (
            [
              { key: 'WC',    label: 'ODI WC', items: WC,    color: C.lime  },
              { key: 'T20WC', label: 'T20 WC', items: T20WC, color: C.goldBright },
              { key: 'CT',    label: 'CT',      items: CT,    color: C.red   },
            ].map(({ key, label, items, color }) =>
              items.length > 0 && (
                <div key={key} style={{ marginBottom: 7 }}>
                  <div style={{
                    fontFamily: "'DM Mono',monospace", fontSize: 7,
                    color, letterSpacing: '0.18em', marginBottom: 4,
                    textTransform: 'uppercase',
                  }}>
                    {label}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 6px' }}>
                    {items.map((t, i) => (
                      <span key={i} style={{
                        fontFamily: "'Barlow Condensed',sans-serif",
                        fontSize: 12, color: C.cream, letterSpacing: '0.03em',
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )
            )
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main component (RAFCE) ───────────────────────────────────────────────────
const CricketMap = () => {
  const mapContainer = useRef(null);
  const mapRef       = useRef(null);
  const markersRef   = useRef([]);
  const flagRef      = useRef([]);
  const animRef      = useRef(null);
  const timerRef     = useRef(null);
  const navigate     = useNavigate();

  const [ready,        setReady]        = useState(false);
  const [idx,          setIdx]          = useState(0);
  const [playing,      setPlaying]      = useState(true);
  const [progress,     setProgress]     = useState(0);
  const [showTrophies, setShowTrophies] = useState(false);
  const [panelKey,     setPanelKey]     = useState(0);

  const ch       = CHAPTERS[idx];
  const statVal  = useCounter(ch.stat, 1100);
  const shift    = POWER_SHIFT[ch.id] || 0;
  const icc      = ICC_MEMBERS[ch.id] || 0;
  const trophies = TROPHY_LOG[ch.id]  || { WC: [], T20WC: [], CT: [] };
  const pc       = powerColor(shift);
  const typeCol  = TYPE_COLOR[ch.type] || C.lime;
  const era      = ERA_FROM_ID[ch.id] || 'TODAY';
  const eraStyle = ERA_STYLE[era];

  // ── Inject keyframes once ─────────────────────────────────────────────────
  useEffect(() => {
    if (document.getElementById('cm-kf')) return;
    const s = document.createElement('style');
    s.id = 'cm-kf'; s.textContent = KEYFRAMES;
    document.head.appendChild(s);
  }, []);

  // ── Init map ──────────────────────────────────────────────────────────────
  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: CHAPTERS[0].focus.center,
      zoom: CHAPTERS[0].focus.zoom,
      projection: 'globe',
      attributionControl: false,
    });
    mapRef.current = map;

    map.on('style.load', () => {
      map.setFog({
        color: 'rgba(235,240,250,0.9)',
        'high-color': 'rgba(180,205,235,1)',
        'horizon-blend': 0.04,
        'space-color': 'rgba(25,40,70,1)',
        'star-intensity': 0.2,
      });

      map.addSource(FILL_SRC, { type: 'vector', url: 'mapbox://mapbox.country-boundaries-v1' });

      const c0 = CHAPTERS[0];
      const fe = ['match', ['get', 'iso_3166_1']];
      c0.fills.forEach(f => fe.push(f.iso, f.color)); fe.push('rgba(0,0,0,0)');
      const oe = ['match', ['get', 'iso_3166_1']];
      c0.fills.forEach(f => oe.push(f.iso, f.opacity)); oe.push(0);

      map.addLayer({ id: FILL_LYR, type: 'fill', source: FILL_SRC, 'source-layer': 'country_boundaries', paint: { 'fill-color': fe, 'fill-opacity': oe } });
      map.addSource(FLOW_SRC, { type: 'geojson', data: flowGeoJSON(c0.flows) });
      map.addLayer({ id: LINE_LYR, type: 'line', source: FLOW_SRC, paint: { 'line-color': ['get', 'color'], 'line-width': 1.5, 'line-opacity': 0.3 } });
      map.addLayer({ id: DASH_LYR, type: 'line', source: FLOW_SRC, paint: { 'line-color': ['get', 'color'], 'line-width': 2.5, 'line-opacity': 0.85, 'line-dasharray': [0, 4, 3] } });

      let t = 0;
      const dash = () => {
        t = (t + 1) % 20;
        if (mapRef.current?.getLayer(DASH_LYR))
          mapRef.current.setPaintProperty(DASH_LYR, 'line-dasharray', [(t / 20) * 7, 4, 3]);
        animRef.current = requestAnimationFrame(dash);
      };
      animRef.current = requestAnimationFrame(dash);

      placeMarkers(map, c0.markers, markersRef);
      placeFlagMarkers(map, c0.fills, flagRef);
      setReady(true);
    });

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      clearMarkers(markersRef); clearMarkers(flagRef);
      map.remove();
    };
  }, []);

  // ── Apply chapter ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    applyChapter(mapRef.current, CHAPTERS[idx]);
    placeMarkers(mapRef.current, CHAPTERS[idx].markers, markersRef);
    placeFlagMarkers(mapRef.current, CHAPTERS[idx].fills, flagRef);
    setPanelKey(k => k + 1);
  }, [idx, ready]);

  // ── Autoplay ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!playing) { setProgress(0); return; }
    const start = Date.now();
    const tick = () => {
      const pct = Math.min((Date.now() - start) / AUTO_MS, 1);
      setProgress(pct);
      if (pct < 1) { timerRef.current = requestAnimationFrame(tick); }
      else { setIdx(i => (i + 1) % CHAPTERS.length); }
    };
    timerRef.current = requestAnimationFrame(tick);
    return () => { if (timerRef.current) cancelAnimationFrame(timerRef.current); };
  }, [playing, idx]);

  // ── Keyboard nav ──────────────────────────────────────────────────────────
  useEffect(() => {
    const h = e => {
      if (e.key === 'ArrowRight') goTo((idx + 1) % CHAPTERS.length);
      if (e.key === 'ArrowLeft')  goTo((idx - 1 + CHAPTERS.length) % CHAPTERS.length);
      if (e.key === ' ')          setPlaying(p => !p);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [idx]);

  const goTo = useCallback(i => {
    if (timerRef.current) cancelAnimationFrame(timerRef.current);
    setProgress(0); setIdx(i);
  }, []);

  const prev = () => goTo((idx - 1 + CHAPTERS.length) % CHAPTERS.length);
  const next = () => goTo((idx + 1) % CHAPTERS.length);

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#e8eee0', overflow: 'hidden', fontFamily: "'Barlow Condensed',sans-serif" }}>

      {/* ── Map canvas ── */}
      <div ref={mapContainer} style={{ position: 'absolute', inset: 0 }} />

      {/* Subtle vignette overlay */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        background: 'radial-gradient(ellipse at 55% 50%, transparent 40%, rgba(20,50,28,0.08) 100%)' }} />

      {/* ══════════════ TOP BAR ══════════════ */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40,
        background: C.headerBg,
        borderBottom: `3px solid ${C.feltGreen}`,
        height: 52,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px',
      }}>
        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate('/maps')} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: "'DM Mono',monospace", fontSize: 9,
            color: C.grassBright, letterSpacing: '0.18em', padding: 0,
          }}>
            ← ANIMATED MAPS
          </button>          
        </div>

        {/* Centre */}
        <div style={{ textAlign: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: -3, left: '15%', right: '15%', height: 2, background: eraStyle.color, transition: 'background 0.6s', borderRadius: 1 }} />
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 18, fontWeight: 800, color: C.cream, letterSpacing: '0.1em', lineHeight: 1 }}>
            🏟 CRICKET: THE EMPIRE'S GAME
          </div>
          {/* ERA pill — the key addition */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 4 }}>
            <span style={{
              fontFamily: "'DM Mono',monospace", fontSize: 8.5, letterSpacing: '0.14em',
              padding: '2px 10px',
              background: eraStyle.bg,
              color: eraStyle.color,
              border: `1px solid ${eraStyle.color}66`,
              transition: 'all 0.5s',
            }}>
              {eraStyle.icon} {eraStyle.label}
            </span>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 7.5, color: C.grassBright, letterSpacing: '0.1em' }}>
              {ch.year} · {icc} NATIONS
            </span>
          </div>
        </div>

        {/* Right — chapter counter */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 20, color: C.goldBright, fontWeight: 700, letterSpacing: '0.06em', lineHeight: 1 }}>
            {String(idx + 1).padStart(2, '0')}
            <span style={{ color: C.grassBright, fontSize: 14 }}>/{CHAPTERS.length}</span>
          </div>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 7, color: C.grassBright, letterSpacing: '0.12em', marginTop: 2 }}>
            {ch.badge}
          </div>
        </div>
      </div>

      {/* ══════════════ LOWER-THIRD ══════════════ */}
      <div
        key={`lt-${panelKey}`}
        className="lt-anim"
        style={{
          position: 'fixed', top: 68, left: 0, zIndex: 30,
          background: `linear-gradient(90deg, ${C.pitchGreen} 0%, rgba(30,77,43,0.88) 60%, transparent 100%)`,
          padding: '11px 44px 11px 20px',
          borderBottom: `2px solid ${eraStyle.color}`,
          borderRight: 'none',
          maxWidth: '58%',
        }}
      >
        {/* ERA label + chapter badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
          <span style={{
            fontFamily: "'DM Mono',monospace", fontSize: 8.5, letterSpacing: '0.12em',
            padding: '2px 9px',
            background: eraStyle.bg,
            color: eraStyle.color,
            border: `1px solid ${eraStyle.color}55`,
            fontWeight: 600,
          }}>
            {eraStyle.icon} {eraStyle.label}
          </span>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 7.5, color: 'rgba(245,240,224,0.45)', letterSpacing: '0.1em' }}>
            {ch.badge}
          </span>
        </div>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 28, fontWeight: 800, color: C.cream, letterSpacing: '0.06em', lineHeight: 1.05 }}>
          {(ch.title || '').toUpperCase()}
        </div>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: C.lime, letterSpacing: '0.1em', marginTop: 5 }}>
          {ch.subtitle}
        </div>
      </div>

      {/* ══════════════ SCORE BUG — bottom-left ══════════════ */}
      <div
        key={`bug-${panelKey}`}
        className="bug-anim"
        style={{ position: 'fixed', bottom: 128, left: 20, zIndex: 30, width: 304 }}
      >
        {/* Power Index — styled like a cricket scoreboard */}
        <div style={{
          background: C.scoreBugBg,
          border: `1px solid ${C.panelBorder}`,
          padding: '11px 15px',
          marginBottom: 8,
        }}>
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 9 }}>
            <span style={{ fontSize: 12 }}>⚖️</span>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 8, letterSpacing: '0.2em', color: C.gold }}>
              POWER BALANCE
            </span>
          </div>

          {/* Labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 12 }}>🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 7, color: '#c07070', letterSpacing: '0.06em' }}>ENG / AUS</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 7, color: C.lime, letterSpacing: '0.06em' }}>SOUTH ASIA</span>
              <span style={{ fontSize: 12 }}>🇮🇳</span>
            </div>
          </div>

          {/* Bar */}
          <div style={{ height: 10, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
            <div style={{
              height: '100%',
              width: `${shift}%`,
              background: `linear-gradient(90deg, #9B2335, ${C.goldBright} 55%, ${pc})`,
              transition: 'width 1.2s ease',
              borderRadius: 2,
            }} />
            {/* centre tick */}
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, background: 'rgba(255,255,255,0.25)' }} />
          </div>

          {/* Score */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline', gap: 2, marginTop: 5 }}>
            <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 26, fontWeight: 700, color: pc, lineHeight: 1 }}>
              {shift}
            </span>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: C.grassBright }}>/100</span>
          </div>
        </div>

        {/* Trophy log */}
        <TrophyBoard trophies={trophies} open={showTrophies} onToggle={() => setShowTrophies(t => !t)} />
      </div>

      {/* ══════════════ RIGHT STORY PANEL ══════════════ */}
      <div
        key={`story-${panelKey}`}
        className="sr-anim panel-scroll"
        style={{
          position: 'fixed', top: 68, right: 16, zIndex: 30,
          width: 292,
          maxHeight: 'calc(100vh - 148px)',
          overflowY: 'auto',
          background: C.panelBg,
          border: `1px solid ${C.panelBorder}`,
          borderTop: `3px solid ${eraStyle.color}`,
          padding: '14px 16px',
          transition: 'border-top-color 0.5s',
        }}
      >
        {/* ── Chapter icon + stat ── */}
        <div
          key={`stat-${panelKey}`}
          className="tv-anim"
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${C.panelBorder}`,
            padding: '10px 12px', marginBottom: 13,
          }}
        >
          {/* Big icon */}
          <div style={{
            width: 46, height: 46, borderRadius: '50%',
            background: `${typeCol}22`,
            border: `2px solid ${typeCol}55`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, flexShrink: 0,
          }}>
            {ch.icon}
          </div>
          {/* Stat */}
          <div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 36, fontWeight: 700, color: eraStyle.color, lineHeight: 1 }}>
              {statVal}{ch.statSuffix}
            </div>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 8, color: C.grassBright, letterSpacing: '0.05em', lineHeight: 1.4, marginTop: 2 }}>
              {ch.statLabel}
            </div>
          </div>
        </div>

        {/* ── Nation chips ── */}
        <NationChips fills={ch.fills} />

        {/* ── Body text ── */}
        <p style={{
          fontFamily: "'Barlow Condensed',sans-serif",
          fontSize: 14.5, fontWeight: 300,
          color: C.dimText,
          lineHeight: 1.7, margin: '0 0 13px',
        }}>
          {ch.body}
        </p>

        {/* ── Divider with cricket ball ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 11 }}>
          <div style={{ flex: 1, height: 1, background: C.panelBorder }} />
          <span style={{ fontSize: 13, opacity: 0.7 }}>🏏</span>
          <div style={{ flex: 1, height: 1, background: C.panelBorder }} />
        </div>

        {/* ── Quote ── */}
        {ch.quote && (
          <div style={{ borderLeft: `3px solid ${eraStyle.color}`, paddingLeft: 11 }}>
            <p style={{
              fontFamily: "'Playfair Display',serif",
              fontStyle: 'italic', fontSize: 13,
              color: C.parchment, lineHeight: 1.65, margin: '0 0 5px',
            }}>
              "{ch.quote}"
            </p>
            {ch.quoteAuthor && (
              <span style={{
                fontFamily: "'DM Mono',monospace", fontSize: 8,
                color: C.grassBright, letterSpacing: '0.1em',
              }}>
                — {ch.quoteAuthor}
              </span>
            )}
          </div>
        )}

        {/* ── ICC Nations count pill ── */}
        <div style={{
          marginTop: 14, display: 'flex', alignItems: 'center', gap: 7,
          padding: '6px 10px',
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${C.panelBorder}`,
        }}>
          <span style={{ fontSize: 14 }}>🌍</span>
          <div>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 7, color: C.grassBright, letterSpacing: '0.12em' }}>ICC FULL MEMBERS</div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 18, fontWeight: 700, color: C.lime, lineHeight: 1.1 }}>
              {icc} nations
            </div>
          </div>
          {/* Power index mini pill */}
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 7, color: C.grassBright, letterSpacing: '0.1em' }}>SA DOMINANCE</div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 18, fontWeight: 700, color: pc, lineHeight: 1.1 }}>
              {shift}%
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════ BOTTOM TIMELINE ══════════════ */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
        background: C.bottomBg,
        borderTop: `2px solid ${C.feltGreen}`,
        padding: '8px 20px 12px',
      }}>
        {/* Progress bar */}
        <div style={{ position: 'relative', height: 2, background: 'rgba(58,125,68,0.2)', marginBottom: 8 }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            width: `${progress * 100}%`,
            background: `linear-gradient(90deg, ${C.red}, ${C.goldBright} 50%, ${C.lime})`,
            transition: 'none',
          }} />
        </div>

        {/* Chapter scrubber — grouped by ERA with colour coding */}
        <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: 8, overflowX: 'auto', paddingBottom: 2, gap: 0 }}>
          {CHAPTERS.map((c, i) => {
            const cEra = ERA_FROM_ID[c.id] || 'TODAY';
            const cES  = ERA_STYLE[cEra];
            const isActive = i === idx;
            return (
              <button
                key={c.id}
                className="dot-btn"
                onClick={() => goTo(i)}
                title={`[${cES.label}] ${c.year} — ${c.title}`}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: '2px 3px',
                  flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                  borderBottom: isActive ? `2px solid ${cES.color}` : `2px solid ${cES.color}33`,
                  transition: 'border-color 0.3s',
                }}
              >
                <div style={{
                  fontSize: isActive ? 15 : 11, lineHeight: 1,
                  opacity: i < idx ? 0.35 : isActive ? 1 : 0.55,
                  filter: isActive ? `drop-shadow(0 0 4px ${cES.color})` : 'none',
                  transition: 'all 0.3s',
                  transform: isActive ? 'scale(1.15)' : 'scale(1)',
                }}>
                  {c.icon}
                </div>
                <div style={{
                  fontFamily: "'DM Mono',monospace", fontSize: 6,
                  color: isActive ? cES.color : C.grassBright,
                  opacity: isActive ? 1 : 0.45,
                  transition: 'all 0.3s', whiteSpace: 'nowrap',
                }}>
                  {c.year.length > 6 ? c.year.slice(0, 4) : c.year}
                </div>
              </button>
            );
          })}
        </div>
        {/* ERA legend strip */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 7, flexWrap: 'wrap' }}>
          {Object.entries(ERA_STYLE).map(([key, es]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 10, height: 3, background: es.color, borderRadius: 1 }} />
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 6.5, color: es.color, letterSpacing: '0.08em', opacity: 0.85 }}>
                {es.label}
              </span>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
          <button className="ctrl-btn" onClick={prev}>◀ PREV</button>

          <button
            onClick={() => setPlaying(p => !p)}
            style={{
              background:    playing ? `${C.lime}18` : 'transparent',
              border:        `1px solid ${playing ? C.lime : C.feltGreen}`,
              color:         playing ? C.lime : C.grassBright,
              cursor:        'pointer',
              fontFamily:    "'DM Mono',monospace",
              fontSize:      9,
              padding:       '5px 22px',
              letterSpacing: '0.14em',
              transition:    'all 0.18s',
            }}
          >
            {playing ? '■ PAUSE' : '▶ PLAY'}
          </button>

          <button className="ctrl-btn" onClick={next}>NEXT ▶</button>

          {/* Speed info */}
          <span style={{
            fontFamily: "'DM Mono',monospace", fontSize: 7.5,
            color: C.grassBright, letterSpacing: '0.1em', marginLeft: 6,
          }}>
            {String(idx + 1).padStart(2, '0')}/{CHAPTERS.length} · 7s
          </span>
        </div>
      </div>
    </div>
  );
};

export default CricketMap;