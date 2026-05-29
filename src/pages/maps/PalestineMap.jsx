import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Link } from 'react-router-dom';

// ─── POEM ─────────────────────────────────────────────────────────────────────
const DASTOOR = [
  { u: 'دیپ جس کا محلّات ہی میں جلے',      e: 'A lamp that only lights the palaces of the powerful' },
  { u: 'چند لوگوں کی خوشیوں کو لے کر چلے', e: 'They marched forth carrying only the happiness of a few' },
  { u: 'وہ جو سائے میں ہر مصلحت کے پلے',    e: 'Those who were raised in the shadow of every compromise' },
  { u: 'ایسے دستور کو، صبحِ بے نور کو',     e: 'Such a constitution, such a lightless dawn' },
  { u: 'میں نہیں مانتا، میں نہیں جانتا',    e: 'I do not accept this, I do not recognise this' },
  { u: 'تم نے لوٹا ہے صدیوں ہمارا سکوں',    e: 'You have plundered our peace for centuries' },
  { u: 'اب نہ ہم پر چلے گا تمہارا فسوں',    e: 'Your spell will no longer work on us' },
  { u: 'ایسے دستور کو، صبحِ بے نور کو',     e: 'Such a constitution, such a lightless dawn' },
  { u: 'میں نہیں مانتا، میں نہیں جانتا',    e: 'I do not accept this, I do not recognise this' },
];

// ─── CHAPTERS ────────────────────────────────────────────────────────────────
const CHAPTERS = [
  {
    id: 'intro', year: '1917', badge: 'HISTORIC PALESTINE',
    title: 'One Land', type: 'mandate', ci: 0,
    body: 'Before partition, before displacement — one land stretching from the river to the sea, home to 700,000 Palestinians.',
    focus: { center: [35.2, 31.8], zoom: 6.5 },
    palCol: '#4A5C3A', palO: 0.65, ilCol: '#4A5C3A', ilO: 0.60,
    markers: [
      { ll: [35.2332, 31.7683], e: '🫒', label: 'القدس — Jerusalem' },
      { ll: [34.9896, 32.7940], e: '🫒', label: 'حيفا — Haifa' },
      { ll: [34.7532, 32.0505], e: '🫒', label: 'يافا — Jaffa' },
    ],
    flows: false,
  },
  {
    id: 'balfour', year: '1917', badge: 'BALFOUR DECLARATION',
    title: 'A Promise Not Theirs to Give', type: 'mandate', ci: 1,
    body: 'Britain pledges Palestine to Zionist settlers — without asking the 700,000 Arabs already living there.',
    focus: { center: [35.2, 31.8], zoom: 6.5 },
    palCol: '#4A5C3A', palO: 0.55, ilCol: '#4A5C3A', ilO: 0.45,
    markers: [], flows: false,
  },
  {
    id: 'partition', year: '1947', badge: 'UN PARTITION PLAN',
    title: 'The Map That Broke a People', type: 'partition', ci: 2,
    body: 'The UN divides Palestine. Jewish settlers owned 6% of land but received 56%. Palestinians — the majority — were not consulted.',
    focus: { center: [35.2, 31.8], zoom: 7 },
    palCol: '#4A5C3A', palO: 0.5, ilCol: '#8B6914', ilO: 0.3,
    markers: [
      { ll: [35.2332, 31.7683], e: '🕌', label: 'Jerusalem — contested' },
      { ll: [34.9896, 32.7940], e: '🕊', label: 'Haifa' },
      { ll: [34.7532, 32.0505], e: '🕊', label: 'Jaffa' },
    ],
    flows: false,
  },
  {
    id: 'nakba', year: '1948', badge: 'AL-NAKBA',
    title: 'The Villages That Vanished', type: 'nakba', ci: 3,
    body: '750,000 Palestinians expelled. 530 villages destroyed. The Nakba — the catastrophe — erases a civilisation from the map.',
    focus: { center: [35.0, 31.5], zoom: 7 },
    palCol: '#8B1A1A', palO: 0.5, ilCol: '#0038b8', ilO: 0.25,
    markers: [
      { ll: [34.9896, 32.7940], e: '🩸', label: 'Haifa — expelled', pulse: true },
      { ll: [34.7532, 32.0505], e: '🩸', label: 'Jaffa — expelled', pulse: true },
      { ll: [35.1650, 31.8000], e: '🩸', label: 'Deir Yassin', pulse: true },
    ],
    flows: true,
  },
  {
    id: 'sixday', year: '1967', badge: 'SIX-DAY WAR',
    title: 'The Occupation Begins', type: 'occupation', ci: 4,
    body: 'Israel occupies the West Bank, Gaza, Sinai and the Golan Heights. Palestinians come under full military rule.',
    focus: { center: [35.3, 31.9], zoom: 7 },
    palCol: '#8B1A1A', palO: 0.45, ilCol: '#0038b8', ilO: 0.22,
    markers: [
      { ll: [35.2332, 31.7683], e: '⚔', label: 'Jerusalem — annexed' },
      { ll: [34.4667, 31.5000], e: '⚔', label: 'Gaza — occupied' },
      { ll: [35.2057, 31.9038], e: '⚔', label: 'Ramallah' },
    ],
    flows: false,
  },
  {
    id: 'intifada1', year: '1987', badge: 'FIRST INTIFADA',
    title: 'The Stone Uprising', type: 'resistance', ci: 5,
    body: 'Palestinians rise with stones against tanks. The world watches. The occupation continues.',
    focus: { center: [35.2, 31.9], zoom: 8 },
    palCol: '#8B1A1A', palO: 0.35, ilCol: '#0038b8', ilO: 0.18,
    markers: [
      { ll: [34.4667, 31.5000], e: '✊', label: 'Gaza' },
      { ll: [35.2636, 32.2211], e: '✊', label: 'Nablus' },
      { ll: [35.2960, 32.4647], e: '✊', label: 'Jenin' },
    ],
    flows: false,
  },
  {
    id: 'settlements', year: '2000s', badge: 'SETTLEMENT EXPANSION',
    title: 'The Slow Erasure', type: 'occupation', ci: 6,
    body: 'Illegal settlements fragment the West Bank. Roads for settlers only. Checkpoints. Walls. The map is carved into pieces.',
    focus: { center: [35.3, 31.9], zoom: 8 },
    palCol: '#8B1A1A', palO: 0.35, ilCol: '#0038b8', ilO: 0.2,
    markers: [
      { ll: [35.2636, 32.2211], e: '🏗', label: 'Nablus — settlements' },
      { ll: [35.0998, 31.5326], e: '🏗', label: 'Hebron — settlements' },
    ],
    flows: false,
  },
  {
    id: 'blockade', year: '2007', badge: 'GAZA BLOCKADE',
    title: "The World's Largest Open-Air Prison", type: 'siege', ci: 7,
    body: '2.3 million people sealed inside 365 km². No freedom of movement. No imports without permission. A slow suffocation.',
    focus: { center: [34.4, 31.5], zoom: 10 },
    palCol: '#8B1A1A', palO: 0.55, ilCol: '#0038b8', ilO: 0.15,
    markers: [
      { ll: [34.4667, 31.5000], e: '🔒', label: 'Gaza — blockaded', pulse: true },
      { ll: [34.2553, 31.2867], e: '🔒', label: 'Rafah — sealed', pulse: true },
    ],
    flows: false,
  },
  {
    id: 'oct2023', year: '2023–24', badge: 'GENOCIDE IN GAZA',
    title: 'Gaza Burns', type: 'war', ci: 8,
    body: '45,000+ killed. 90% displaced. Hospitals, schools, mosques, entire neighbourhoods reduced to rubble.',
    focus: { center: [34.45, 31.42], zoom: 10 },
    palCol: '#8B1A1A', palO: 0.7, ilCol: '#0038b8', ilO: 0.12,
    markers: [
      { ll: [34.4667, 31.5000], e: '🔥', label: 'Gaza City', pulse: true },
      { ll: [34.2553, 31.2867], e: '🔥', label: 'Rafah', pulse: true },
      { ll: [34.3067, 31.3414], e: '🩸', label: 'Khan Yunis', pulse: true },
      { ll: [34.4997, 31.5308], e: '🩸', label: 'Jabalia', pulse: true },
    ],
    flows: false,
  },
  {
    id: 'memory', year: 'صمود', badge: 'SUMUD — STEADFASTNESS',
    title: 'We Remain', type: 'memory', ci: 4, isRefrain: true,
    body: 'Despite everything — the land remembers. The olive trees remember. The people remain.',
    focus: { center: [35.2, 31.8], zoom: 6.5 },
    palCol: '#4A5C3A', palO: 0.55, ilCol: '#4A5C3A', ilO: 0.1,
    markers: [
      { ll: [35.2332, 31.7683], e: '🫒', label: 'Jerusalem' },
      { ll: [34.4667, 31.5000], e: '🫒', label: 'Gaza' },
      { ll: [34.9896, 32.7940], e: '🫒', label: 'Haifa' },
      { ll: [34.7532, 32.0505], e: '🫒', label: 'Jaffa' },
      { ll: [35.0998, 31.5326], e: '🫒', label: 'Hebron' },
    ],
    flows: false,
  },
];

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const FLOWS = [
  { id: 'j',  from: [35.1, 31.9], to: [36.8, 31.9], col: '#8B1A1A' },
  { id: 'lb', from: [35.2, 32.5], to: [35.5, 33.8], col: '#8B1A1A' },
  { id: 'g',  from: [34.9, 31.5], to: [34.4, 31.5], col: '#4A5C3A' },
];

const TCOL = {
  mandate: '#4A5C3A', partition: '#8B6914', nakba: '#8B1A1A',
  occupation: '#8B1A1A', resistance: '#4A5C3A', accords: '#8B6914',
  siege: '#8B1A1A', war: '#8B1A1A', memory: '#4A5C3A',
};

const OLIVE = '#4A5C3A';
const RED   = '#8B1A1A';
const CREAM = '#F5F0E8';
const DARK  = '#0E0D0B';
const MUTED = '#7a7060';
const DUR   = 8000;

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Noto+Nastaliq+Urdu:wght@400;600&display=swap');
* { box-sizing: border-box; }
@keyframes mpop    { from { opacity:0; transform:scale(0.3) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }
@keyframes pring   { 0%   { transform:translate(-50%,-50%) scale(0.7); opacity:1; } 100% { transform:translate(-50%,-50%) scale(2.6); opacity:0; } }
@keyframes posterIn{ 0%   { opacity:0; transform:translateX(-18px); } 100% { opacity:1; transform:translateX(0); } }
@keyframes lineIn  { 0%   { opacity:0; transform:translateY(8px); }  100% { opacity:1; transform:translateY(0); } }
@keyframes glowPulse { 0%,100% { text-shadow:0 0 20px rgba(139,26,26,0); } 50% { text-shadow:0 0 30px rgba(139,26,26,0.5); } }
.poster-in   { animation: posterIn  0.45s cubic-bezier(.22,1,.36,1) both; }
.line-in     { animation: lineIn    0.4s ease both; }
.refrain-glow{ animation: glowPulse 2.5s ease infinite; }
.mapboxgl-ctrl-bottom-left, .mapboxgl-ctrl-bottom-right, .mapboxgl-ctrl-attrib { display:none!important; }
.mapboxgl-popup-content { background:transparent!important; border:none!important; box-shadow:none!important; padding:0!important; }
.mapboxgl-popup-tip     { display:none!important; }
::-webkit-scrollbar       { width:2px; }
::-webkit-scrollbar-thumb { background:rgba(139,26,26,0.3); }
`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const sp = (map, id, prop, val) => {
  try { if (map.getLayer(id)) map.setPaintProperty(id, prop, val); } catch (_) {}
};

const applyChapter = (map, ch, mkrsRef) => {
  sp(map, 'pal-fill', 'fill-color',   ch.palCol);
  sp(map, 'pal-fill', 'fill-opacity',  ch.palO);
  sp(map, 'pal-line', 'line-color',   ch.palCol);
  sp(map, 'pal-line', 'line-opacity',  0.9);
  sp(map, 'il-fill',  'fill-color',   ch.ilCol || '#0038b8');
  sp(map, 'il-fill',  'fill-opacity',  ch.ilO);

  FLOWS.forEach(f => {
    sp(map, 'fb-' + f.id, 'line-opacity', ch.flows ? 0.45 : 0);
    sp(map, 'fa-' + f.id, 'line-opacity', ch.flows ? 0.9  : 0);
  });

  mkrsRef.current.forEach(m => m.remove());
  mkrsRef.current = [];

  (ch.markers || []).forEach((def, di) => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:relative;width:36px;height:36px;display:flex;align-items:center;justify-content:center;';

    const span = document.createElement('span');
    span.textContent = def.e;
    span.style.cssText = `font-size:22px;z-index:2;position:relative;animation:mpop 0.4s cubic-bezier(.34,1.56,.64,1) ${di * 80}ms both;`;
    wrap.appendChild(span);

    if (def.pulse) {
      [0, 420].forEach((delay, ri) => {
        const ring = document.createElement('div');
        ring.style.cssText = `position:absolute;top:50%;left:50%;width:${34 + ri * 18}px;height:${34 + ri * 18}px;border-radius:50%;border:2px solid rgba(139,26,26,${ri === 0 ? 0.8 : 0.3});transform:translate(-50%,-50%);animation:pring 1.7s ease-out ${delay}ms infinite;pointer-events:none;`;
        wrap.appendChild(ring);
      });
    }

    const popup = new mapboxgl.Popup({ offset: 20, closeButton: false })
      .setHTML(`<div style="font-family:'IBM Plex Mono',monospace;font-size:10px;color:#F5F0E8;background:rgba(14,13,11,0.97);padding:5px 10px;border:1px solid rgba(139,26,26,0.6);white-space:nowrap;">${def.label}</div>`);

    const marker = new mapboxgl.Marker({ element: wrap, anchor: 'center' })
      .setLngLat(def.ll)
      .setPopup(popup)
      .addTo(map);

    mkrsRef.current.push(marker);
  });
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────
const PalestineMap = () => {
  const mapEl   = useRef(null);
  const mapRef  = useRef(null);
  const mkrs    = useRef([]);
  const animRef = useRef(null);
  const idxRef  = useRef(0);

  const [idx,      setIdx]      = useState(0);
  const [playing,  setPlaying]  = useState(true);
  const [progress, setProgress] = useState(0);
  const [ready,    setReady]    = useState(false);

  useEffect(() => { idxRef.current = idx; }, [idx]);

  // ── MAP INIT ────────────────────────────────────────────────────────────────
  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapEl.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [35.2, 31.8],
      zoom: 6.5,
      projection: 'mercator',
      attributionControl: false,
    });
    mapRef.current = map;

    map.on('style.load', () => {
      map.getStyle().layers.forEach(l => {
        try {
          if (l.type === 'symbol') {
            map.setPaintProperty(l.id, 'text-color',       'rgba(245,240,232,0.5)');
            map.setPaintProperty(l.id, 'text-halo-color',  'rgba(14,13,11,0.8)');
          }
          if (l.id.includes('building')) map.setLayoutProperty(l.id, 'visibility', 'none');
        } catch (_) {}
      });

      map.addSource('cb', { type: 'vector', url: 'mapbox://mapbox.country-boundaries-v1' });
      const firstSym = map.getStyle().layers.find(l => l.type === 'symbol')?.id;

      map.addLayer({
        id: 'il-fill', type: 'fill', source: 'cb', 'source-layer': 'country_boundaries',
        filter: ['==', 'iso_3166_1', 'IL'],
        paint: { 'fill-color': '#4A5C3A', 'fill-opacity': 0 },
      }, firstSym);

      map.addLayer({
        id: 'pal-fill', type: 'fill', source: 'cb', 'source-layer': 'country_boundaries',
        filter: ['==', 'iso_3166_1', 'PS'],
        paint: { 'fill-color': '#4A5C3A', 'fill-opacity': 0 },
      }, firstSym);

      map.addLayer({
        id: 'pal-line', type: 'line', source: 'cb', 'source-layer': 'country_boundaries',
        filter: ['==', 'iso_3166_1', 'PS'],
        paint: { 'line-color': '#4A5C3A', 'line-width': 2.5, 'line-opacity': 0 },
      }, firstSym);

      FLOWS.forEach(f => {
        map.addSource('fl-' + f.id, {
          type: 'geojson',
          data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [f.from, f.to] } },
        });
        map.addLayer({ id: 'fb-' + f.id, type: 'line', source: 'fl-' + f.id, paint: { 'line-color': f.col, 'line-width': 2, 'line-opacity': 0, 'line-dasharray': [3, 4] } });
        map.addLayer({ id: 'fa-' + f.id, type: 'line', source: 'fl-' + f.id, paint: { 'line-color': f.col, 'line-width': 3, 'line-opacity': 0, 'line-dasharray': [0, 4, 3] } });
      });

      const first = CHAPTERS[idxRef.current];
      map.flyTo({ center: first.focus.center, zoom: first.focus.zoom, duration: 600, essential: true });
      applyChapter(map, first, mkrs);
      setReady(true);
    });

    return () => map.remove();
  }, []);

  // ── APPLY CHAPTER ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const ch = CHAPTERS[idx];
    mapRef.current.flyTo({ center: ch.focus.center, zoom: ch.focus.zoom, duration: 1800, essential: true });
    applyChapter(mapRef.current, ch, mkrs);
  }, [idx, ready]);

  // ── FLOW DASH ANIMATION ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!ready) return;
    let step = 0;
    const seq = [[0,4,3],[0.5,4,2.5],[1,4,2],[1.5,4,1.5],[2,4,1],[2.5,4,0.5],[3,4,0]];
    let fid;
    const go = () => {
      const arr = seq[step++ % seq.length];
      FLOWS.forEach(f => {
        try { if (mapRef.current?.getLayer('fa-' + f.id)) mapRef.current.setPaintProperty('fa-' + f.id, 'line-dasharray', arr); }
        catch (_) {}
      });
      fid = requestAnimationFrame(go);
    };
    go();
    return () => cancelAnimationFrame(fid);
  }, [ready]);

  // ── AUTOPLAY ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!playing) return;
    let el = 0, last = null;
    const tick = ts => {
      if (!last) last = ts;
      el += ts - last; last = ts;
      setProgress(Math.min((el / DUR) * 100, 100));
      if (el >= DUR) {
        setIdx(i => (i + 1) % CHAPTERS.length);
        el = 0; last = null; setProgress(0);
      }
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [playing, idx]);

  // ── KEYBOARD ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'ArrowRight') { setIdx(i => Math.min(CHAPTERS.length - 1, i + 1)); setProgress(0); }
      if (e.key === 'ArrowLeft')  { setIdx(i => Math.max(0, i - 1));                   setProgress(0); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // ── DERIVED ─────────────────────────────────────────────────────────────────
  const ch        = CHAPTERS[idx];
  const accent    = TCOL[ch.type] || OLIVE;
  const poemLines = ch.isRefrain
    ? [DASTOOR[4], DASTOOR[8]]
    : [DASTOOR[Math.min(ch.ci, DASTOOR.length - 1)]];

  const goTo = i => { setIdx(i); setProgress(0); };

  // ── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ position: 'fixed', inset: 0, background: DARK, overflow: 'hidden' }}>
      <style>{CSS}</style>

      {/* MAP */}
      <div ref={mapEl} style={{ position: 'absolute', inset: 0 }} />

      {/* VIGNETTE */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
        background: 'linear-gradient(to bottom, rgba(14,13,11,0.7) 0%, transparent 20%, transparent 55%, rgba(14,13,11,0.92) 100%)',
      }} />

      {/* ── TOP BAR ── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 28px', borderBottom: `2px solid ${RED}`,
        background: 'rgba(14,13,11,0.96)', height: 50,
      }}>
        <Link
          to="/maps"
          style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: MUTED, letterSpacing: '0.2em', textDecoration: 'none' }}
        >
          ← ANIMATED MAPS
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, color: CREAM, letterSpacing: '0.14em' }}>
            PALESTINE — DASTOOR
          </span>
          <span style={{ fontFamily: "'Noto Nastaliq Urdu',serif", fontSize: 14, color: OLIVE, direction: 'rtl' }}>
            دستور
          </span>
        </div>

        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, letterSpacing: '0.1em', color: MUTED }}>
          <span style={{ color: RED }}>{idx + 1}</span>/{CHAPTERS.length}
        </div>
      </div>

      {/* ── LEFT PANEL ── */}
      <div
        key={`panel-${idx}`}
        className="poster-in"
        style={{ position: 'fixed', top: 68, left: 28, zIndex: 30, maxWidth: 420, pointerEvents: 'none' }}
      >
        {/* Giant year */}
        <div style={{
          fontFamily: "'Bebas Neue',sans-serif", fontSize: 90, lineHeight: 1,
          color: CREAM, letterSpacing: '0.02em',
          textShadow: '0 4px 40px rgba(0,0,0,0.95)', marginBottom: -8,
        }}>
          {ch.year}
        </div>

        {/* Badge */}
        <div style={{
          fontFamily: "'IBM Plex Mono',monospace", fontSize: 8,
          letterSpacing: '0.22em', color: accent, marginBottom: 4,
        }}>
          {ch.badge}
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Bebas Neue',sans-serif", fontSize: 32, lineHeight: 1.1,
          color: OLIVE, letterSpacing: '0.06em', margin: '0 0 10px',
        }}>
          {ch.title.toUpperCase()}
        </h1>

        {/* Rule */}
        <div style={{ width: 50, height: 3, background: RED, marginBottom: 14 }} />

        {/* Body */}
        <p style={{
          fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 300,
          color: 'rgba(245,240,232,0.6)', lineHeight: 1.75,
          margin: '0 0 20px', maxWidth: 360,
        }}>
          {ch.body}
        </p>

        {/* Poem block */}
        <div style={{
          borderLeft: `3px solid ${RED}`, background: 'rgba(14,13,11,0.55)',
          padding: '12px 16px', maxWidth: 380,
        }}>
          <div style={{
            fontFamily: "'IBM Plex Mono',monospace", fontSize: 7.5,
            letterSpacing: '0.18em', color: MUTED, marginBottom: 10,
          }}>
            HABIB JALIB — دستور
          </div>

          {poemLines.map((line, i) => (
            <div
              key={i}
              className="line-in"
              style={{ marginBottom: i < poemLines.length - 1 ? 12 : 0, animationDelay: `${i * 150}ms` }}
            >
              <div
                className={ch.isRefrain && line.u.includes('مانتا') ? 'refrain-glow' : ''}
                style={{
                  fontFamily: "'Noto Nastaliq Urdu','Noto Serif',serif",
                  fontSize: 15, direction: 'rtl', textAlign: 'right',
                  lineHeight: 1.9, color: CREAM,
                }}
              >
                {line.u}
              </div>
              <div style={{
                fontFamily: "'IBM Plex Mono',monospace", fontSize: 10,
                fontStyle: 'italic', color: 'rgba(245,240,232,0.5)',
                lineHeight: 1.5, marginTop: 2,
              }}>
                {line.e}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── BOTTOM SCRUBBER ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
        background: 'rgba(14,13,11,0.97)', borderTop: `2px solid ${RED}`,
        padding: '12px 28px 20px',
      }}>
        {/* Year labels */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontFamily: "'IBM Plex Mono',monospace", marginBottom: 8,
        }}>
          {CHAPTERS.map((c, i) => (
            <span
              key={i}
              onClick={() => goTo(i)}
              style={{
                fontSize: i === idx ? 9 : 8,
                color: i === idx ? CREAM : 'rgba(122,112,96,0.35)',
                fontWeight: i === idx ? 500 : 300,
                letterSpacing: '0.06em',
                cursor: 'pointer',
                transition: 'color 0.3s',
              }}
            >
              {String(c.year).split('–')[0].trim().slice(0, 4)}
            </span>
          ))}
        </div>

        {/* Track */}
        <div style={{ position: 'relative', height: 22, display: 'flex', alignItems: 'center', marginBottom: 10 }}>
          {/* Rail */}
          <div style={{ position: 'absolute', left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.06)' }} />
          {/* Completed fill */}
          <div style={{
            position: 'absolute', left: 0, height: 2,
            width: `${(idx / (CHAPTERS.length - 1)) * 100}%`,
            background: `linear-gradient(90deg, ${OLIVE}, ${RED})`,
            transition: 'width 0.5s ease',
          }} />
          {/* Current chapter progress sliver */}
          <div style={{
            position: 'absolute',
            left: `${(idx / (CHAPTERS.length - 1)) * 100}%`,
            height: 2,
            width: `${progress * (1 / (CHAPTERS.length - 1))}%`,
            background: RED,
            opacity: 0.5,
          }} />
          {/* Dots */}
          {CHAPTERS.map((_, i) => (
            <div
              key={i}
              onClick={() => goTo(i)}
              style={{
                position: 'absolute',
                left: `${(i / (CHAPTERS.length - 1)) * 100}%`,
                transform: 'translateX(-50%)',
                width:  i === idx ? 14 : 7,
                height: i === idx ? 14 : 7,
                borderRadius: '50%',
                background: i < idx ? RED : i === idx ? CREAM : 'rgba(255,255,255,0.1)',
                border: i === idx ? `2px solid ${RED}` : 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                zIndex: 2,
                boxShadow: i === idx ? `0 0 14px ${RED}` : 'none',
              }}
            />
          ))}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14 }}>
          <button
            onClick={() => goTo(Math.max(0, idx - 1))}
            style={{
              background: 'none', border: `1px solid rgba(122,112,96,0.25)`,
              color: MUTED, cursor: 'pointer',
              fontFamily: "'IBM Plex Mono',monospace", fontSize: 9,
              padding: '4px 14px', letterSpacing: '0.14em',
            }}
          >
            ← PREV
          </button>

          <button
            onClick={() => setPlaying(p => !p)}
            style={{
              background: playing ? `${RED}22` : 'none',
              border: `1px solid ${playing ? RED : 'rgba(139,26,26,0.4)'}`,
              color: playing ? '#ff8888' : RED,
              cursor: 'pointer',
              fontFamily: "'IBM Plex Mono',monospace", fontSize: 9,
              padding: '4px 22px', letterSpacing: '0.14em',
            }}
          >
            {playing ? '■ STOP' : '▶ PLAY'}
          </button>

          <button
            onClick={() => goTo(Math.min(CHAPTERS.length - 1, idx + 1))}
            style={{
              background: 'none', border: `1px solid rgba(122,112,96,0.25)`,
              color: MUTED, cursor: 'pointer',
              fontFamily: "'IBM Plex Mono',monospace", fontSize: 9,
              padding: '4px 14px', letterSpacing: '0.14em',
            }}
          >
            NEXT →
          </button>
        </div>
      </div>
    </div>
  );
};

export default PalestineMap;