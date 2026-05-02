import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { useNavigate } from 'react-router-dom';
import { CHAPTERS, POWER_SHIFT, ICC_MEMBERS, TROPHY_LOG } from '@/data/cricketMap';

// ─── useCounter ───────────────────────────────────────────────────────────────
const useCounter = (target, duration = 1200) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * ease));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
};

// ─── Map helpers ──────────────────────────────────────────────────────────────
const FLOW_SRC  = 'cricket-flows';
const FILL_SRC  = 'country-boundaries';
const FILL_LYR  = 'cricket-fills';
const LINE_LYR  = 'cricket-lines';
const DASH_LYR  = 'cricket-dash';

const clearMarkers = (ref) => { ref.current.forEach(m => m.remove()); ref.current = []; };

const placeMarkers = (map, markers, ref) => {
  clearMarkers(ref);
  markers.forEach(({ ll, e, label, pulse }) => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;pointer-events:none;user-select:none';
    const ico = document.createElement('div');
    ico.textContent = e;
    ico.style.cssText = `font-size:20px;line-height:1;filter:drop-shadow(0 1px 4px rgba(0,0,0,0.2));${pulse ? 'animation:mPulse 1.6s ease-in-out infinite;' : ''}`;
    const lbl = document.createElement('div');
    lbl.textContent = label;
    lbl.style.cssText = 'font-family:"DM Mono",monospace;font-size:8px;color:#3a2a1a;background:rgba(245,240,232,0.95);padding:1px 5px;border-radius:2px;margin-top:2px;white-space:nowrap;border:1px solid rgba(139,80,40,0.15);';
    wrap.appendChild(ico); wrap.appendChild(lbl);
    ref.current.push(new mapboxgl.Marker({ element: wrap, anchor: 'bottom' }).setLngLat(ll).addTo(map));
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
  map.flyTo({ center: ch.focus.center, zoom: ch.focus.zoom, duration: 2000, essential: true });
};

// ─── Trophy scoreboard — compact ─────────────────────────────────────────────
const TrophyBoard = ({ trophies }) => {
  const { WC, T20WC, CT } = trophies;
  const hasAny = WC.length > 0 || T20WC.length > 0 || CT.length > 0;
  if (!hasAny) return (
    <div style={{ background: '#EEE8D8', border: '1px solid #d4c8a8', borderRadius: '5px', padding: '7px 10px', marginBottom: '10px' }}>
      <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '8px', color: '#b0a090' }}>TROPHY CABINET · No titles yet</span>
    </div>
  );

  const Row = ({ label, color, items }) => items.length === 0 ? null : (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '5px', marginBottom: '4px' }}>
      <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '7px', color, letterSpacing: '0.08em', whiteSpace: 'nowrap', paddingTop: '1px', minWidth: '28px' }}>{label}</span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
        {items.map((item, i) => (
          <span key={i} style={{ fontFamily: "'DM Mono',monospace", fontSize: '7px', background: 'rgba(255,255,255,0.6)', border: '1px solid #d4c8a8', borderRadius: '2px', padding: '1px 3px', color: '#4a3a28', whiteSpace: 'nowrap' }}>{item}</span>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ background: '#EEE8D8', border: '1px solid #d4c8a8', borderRadius: '5px', padding: '7px 10px', marginBottom: '10px' }}>
      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '7px', color: '#9a8a78', letterSpacing: '0.1em', marginBottom: '5px', textTransform: 'uppercase' }}>Trophy Cabinet</div>
      <Row label="ODI WC" color="#2D5A1B" items={WC} />
      <Row label="T20 WC" color="#8B6020" items={T20WC} />
      <Row label="CT"     color="#8B1A1A" items={CT} />
    </div>
  );
};



// ─── Tick colors ──────────────────────────────────────────────────────────────
const TICK = { empire: '#8B1A1A', rivalry: '#b85a40', milestone: '#C9A84A', shift: '#2D5A1B', today: '#2D5A1B' };
const AUTO = 5500;

// ─── Main component ───────────────────────────────────────────────────────────
const CricketMap = () => {
  const mapContainer = useRef(null);
  const mapRef       = useRef(null);
  const markersRef   = useRef([]);
  const animRef      = useRef(null);
  const timerRef     = useRef(null);
  const navigate     = useNavigate();

  const [ready,   setReady]   = useState(false);
  const [idx,     setIdx]     = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress,setProgress]= useState(0);

  const ch      = CHAPTERS[idx];
  const statVal = useCounter(ch.stat, 1100);
  const shift   = POWER_SHIFT[ch.id] || 0;
  const icc     = ICC_MEMBERS[ch.id] || 0;
  const trophies= TROPHY_LOG[ch.id]  || { WC: [], T20WC: [], CT: [] };

  // ── Init map ──────────────────────────────────────────────────────────────
  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: CHAPTERS[0].focus.center,
      zoom:   CHAPTERS[0].focus.zoom,
      projection: 'globe',
      attributionControl: false,
    });
    mapRef.current = map;
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right');

    map.on('style.load', () => {
      map.getStyle().layers.forEach(layer => {
        try {
          if (layer.type === 'symbol' && layer.layout?.['text-field']) {
            map.setPaintProperty(layer.id, 'text-color', '#5a4a32');
            map.setPaintProperty(layer.id, 'text-halo-color', '#f0e8d8');
            map.setPaintProperty(layer.id, 'text-halo-width', 1.5);
          }
          if (layer.type === 'line' && layer.id.includes('admin')) {
            map.setPaintProperty(layer.id, 'line-color', '#c0a870');
            map.setPaintProperty(layer.id, 'line-opacity', 0.4);
          }
          if (layer.type === 'line' && (layer.id.includes('road') || layer.id.includes('street') || layer.id.includes('highway'))) {
            map.setPaintProperty(layer.id, 'line-opacity', 0.15);
            map.setPaintProperty(layer.id, 'line-color', '#d4c8a8');
          }
          if (layer.id === 'background') map.setPaintProperty('background', 'background-color', '#f0e8d8');
          if (layer.id.includes('water') && layer.type === 'fill') map.setPaintProperty(layer.id, 'fill-color', '#c2d4da');
          if (layer.id.includes('building')) map.setLayoutProperty(layer.id, 'visibility', 'none');
          if (layer.id.includes('disputed') || layer.id.includes('dash')) map.setLayoutProperty(layer.id, 'visibility', 'none');
        } catch {}
      });

      map.setFog({
        color: 'rgba(220,210,190,0.8)',
        'high-color': 'rgba(170,195,210,0.9)',
        'horizon-blend': 0.06,
        'space-color': 'rgba(40,55,70,1)',
        'star-intensity': 0.3,
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
      map.addLayer({ id: DASH_LYR, type: 'line', source: FLOW_SRC, paint: { 'line-color': ['get', 'color'], 'line-width': 2, 'line-opacity': 0.8, 'line-dasharray': [0, 4, 3] } });

      let t = 0;
      const dash = () => {
        t = (t + 1) % 20;
        if (mapRef.current?.getLayer(DASH_LYR)) mapRef.current.setPaintProperty(DASH_LYR, 'line-dasharray', [(t / 20) * 7, 4, 3]);
        animRef.current = requestAnimationFrame(dash);
      };
      animRef.current = requestAnimationFrame(dash);

      placeMarkers(map, c0.markers, markersRef);
      setReady(true);
    });

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      clearMarkers(markersRef);
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (!ready || !mapRef.current) return;
    applyChapter(mapRef.current, CHAPTERS[idx]);
    placeMarkers(mapRef.current, CHAPTERS[idx].markers, markersRef);
  }, [idx, ready]);

  useEffect(() => {
    if (!playing) { setProgress(0); return; }
    const start = Date.now();
    const tick = () => {
      const pct = Math.min((Date.now() - start) / AUTO, 1);
      setProgress(pct);
      if (pct < 1) { timerRef.current = requestAnimationFrame(tick); }
      else { setIdx(i => (i + 1) % CHAPTERS.length); }
    };
    timerRef.current = requestAnimationFrame(tick);
    return () => { if (timerRef.current) cancelAnimationFrame(timerRef.current); };
  }, [playing, idx]);

  const goTo = useCallback((i) => {
    setIdx(i); setProgress(0);
    if (timerRef.current) cancelAnimationFrame(timerRef.current);
  }, []);

  const prev = () => goTo((idx - 1 + CHAPTERS.length) % CHAPTERS.length);
  const next = () => goTo((idx + 1) % CHAPTERS.length);

  useEffect(() => {
    if (document.getElementById('cm-kf')) return;
    const s = document.createElement('style'); s.id = 'cm-kf';
    s.textContent = '@keyframes mPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.4)}}';
    document.head.appendChild(s);
  }, []);

  // Badge colors
  const badgeBg    = ch.type === 'empire' ? '#fce8e8' : ch.type === 'milestone' ? '#fdf5dc' : ch.type === 'shift' ? '#e8f0e0' : '#e8f0e0';
  const badgeColor = ch.type === 'empire' ? '#8B1A1A' : ch.type === 'milestone' ? '#7a5a10' : ch.type === 'shift' ? '#2D5A1B' : '#2D5A1B';
  const badgeBorder= ch.type === 'empire' ? '#f0c0c0' : ch.type === 'milestone' ? '#e8d080' : '#b0cc90';

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#f0e8d8', fontFamily: "'Lato',sans-serif", overflow: 'hidden' }}>
      {/* Map */}
      <div ref={mapContainer} style={{ position: 'absolute', inset: 0 }} />

      {/* ── Left panel — 280px ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0, width: '280px',
        background: '#F5F0E8', borderRight: '2px solid #d4c8a8',
        display: 'flex', flexDirection: 'column', zIndex: 10, overflowY: 'auto',
      }}>
        {/* Scrollable content */}
        <div style={{ padding: '20px 18px 16px', flex: 1 }}>

          {/* Nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <button onClick={() => navigate('/maps')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B6040', fontFamily: "'DM Mono',monospace", fontSize: '11px', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '5px', padding: 0 }}>
              ← MAPS
            </button>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '8px', color: '#b0a090', letterSpacing: '0.08em', textTransform: 'uppercase' }}>CRICKET</span>
          </div>

          {/* Icon + badge + year */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#E8F0DC', border: '2px solid #b8d0a0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
              {ch.icon}
            </div>
            <div>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '8px', letterSpacing: '0.1em', padding: '2px 7px', borderRadius: '2px', background: badgeBg, color: badgeColor, border: `1px solid ${badgeBorder}` }}>
                {ch.badge}
              </span>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', color: '#9a8a78', marginTop: '4px', letterSpacing: '0.04em' }}>
                {ch.year}
              </div>
            </div>
          </div>

          {/* Title + subtitle */}
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '18px', lineHeight: 1.25, color: '#2a1a0e', fontWeight: 700, marginBottom: '3px' }}>
            {ch.title}
          </div>
          <div style={{ fontFamily: "'Lato',sans-serif", fontSize: '11px', color: '#8a7a68', marginBottom: '14px', lineHeight: 1.4 }}>
            {ch.subtitle}
          </div>

          {/* Stat box — compact 2-col: big number left, label right */}
          <div style={{ background: '#E8F0DC', border: '1px solid #b8d0a0', borderRadius: '5px', padding: '10px 12px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '40px', color: '#2D5A1B', lineHeight: 1, fontWeight: 700, flexShrink: 0 }}>
              {statVal}{ch.statSuffix}
            </div>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', color: '#5a8040', letterSpacing: '0.04em', lineHeight: 1.4 }}>
              {ch.statLabel}
            </div>
          </div>

          {/* Quote — single line truncated, no bg block */}
          <div style={{ borderLeft: '2px solid #8B1A1A', paddingLeft: '8px', marginBottom: '12px' }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: '11px', color: '#6a3a2a', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              "{ch.quote}"
            </div>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '8px', color: '#9a7060', marginTop: '3px', letterSpacing: '0.06em' }}>
              — {ch.quoteAuthor}
            </div>
          </div>

          {/* Trophy cabinet — single compact row per format */}
          <TrophyBoard trophies={trophies} />

          {/* Power shift — slim single line */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '8px', color: '#8B1A1A', flexShrink: 0 }}>ENG</span>
            <div style={{ flex: 1, height: '5px', background: '#d4c8a8', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: '3px', width: `${shift}%`, background: shift > 60 ? 'linear-gradient(to right,#8B1A1A,#C9A84A)' : 'linear-gradient(to right,#8B1A1A,#8B6020)', transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)' }} />
            </div>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '8px', color: '#2D5A1B', flexShrink: 0 }}>SA</span>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '8px', color: '#9a8a78', flexShrink: 0 }}>· {icc} nations</span>
          </div>

        </div>

        {/* Footer controls */}
        <div style={{ borderTop: '2px solid #d4c8a8', padding: '12px 16px', background: '#ECE6D6' }}>
          {/* Progress bar */}
          <div style={{ height: '3px', background: '#d4c8a8', borderRadius: '2px', marginBottom: '10px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress * 100}%`, background: TICK[ch.type] || '#C9A84A', borderRadius: '2px', transition: 'none' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={prev} style={{ background: '#F5F0E8', border: '1px solid #c8b898', color: '#5a4a38', borderRadius: '3px', width: '28px', height: '28px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
            <button onClick={() => setPlaying(p => !p)} style={{ background: '#2D5A1B', border: 'none', color: '#fff', borderRadius: '3px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {playing ? '⏸' : '▶'}
            </button>
            <button onClick={next} style={{ background: '#F5F0E8', border: '1px solid #c8b898', color: '#5a4a38', borderRadius: '3px', width: '28px', height: '28px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', color: '#b0a090', marginLeft: 'auto' }}>{idx + 1} / {CHAPTERS.length}</span>
          </div>
        </div>
      </div>

      {/* ── Legend top-right ── */}
      <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(245,240,232,0.97)', border: '1px solid #c8b898', borderRadius: '5px', padding: '12px 14px', width: '200px', zIndex: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.07)' }}>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '8px', color: '#7a6a58', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '8px' }}>Legend</div>
        {[
          { color: '#8B1A1A', label: 'British Empire / runners-up' },
          { color: '#C9A84A', label: 'Champions / powerhouses' },
          { color: '#2D5A1B', label: 'Competitive nations' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '5px' }}>
            <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: color, flexShrink: 0 }} />
            <span style={{ fontFamily: "'Lato',sans-serif", fontSize: '10px', color: '#5a4a38' }}>{label}</span>
          </div>
        ))}
        <div style={{ height: '1px', background: '#d4c8a8', margin: '8px 0' }} />
        {[
          { color: '#8B1A1A', label: 'Empire spread flows' },
          { color: '#C9A84A', label: 'Player flows → IPL' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '5px' }}>
            <div style={{ width: '16px', height: '2px', background: color, flexShrink: 0 }} />
            <span style={{ fontFamily: "'Lato',sans-serif", fontSize: '10px', color: '#5a4a38' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* ── Timeline scrubber ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: '280px', right: 0,
        height: '42px', background: '#ECE6D6', borderTop: '2px solid #d4c8a8',
        display: 'flex', alignItems: 'stretch', zIndex: 10,
        overflowX: 'auto', overflowY: 'hidden',
      }}>
        {CHAPTERS.map((c, i) => (
          <div key={c.id} onClick={() => goTo(i)} style={{
            minWidth: '38px', width: '38px', flexShrink: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            borderRight: '1px solid #d4c8a8',
            background: i === idx
              ? (TICK[c.type] === '#8B1A1A' ? 'rgba(139,26,26,0.12)' : TICK[c.type] === '#C9A84A' ? 'rgba(201,168,74,0.2)' : 'rgba(45,90,27,0.12)')
              : 'transparent',
            borderTop: `3px solid ${i === idx ? TICK[c.type] : 'transparent'}`,
            transition: 'background 0.2s',
          }}>
            <span style={{ fontSize: '11px', lineHeight: 1 }}>{c.icon}</span>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '6px', color: i === idx ? '#2a1a0e' : '#9a8a78', marginTop: '2px', letterSpacing: 0 }}>
              {c.year.length > 6 ? c.year.slice(0, 4) : c.year}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CricketMap;