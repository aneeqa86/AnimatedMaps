// src/pages/maps/TurtleMap.jsx
// World Turtle Day — May 23
// All-green palette: deep forest dark, emerald flows, bioluminescent glow

import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import { CHAPTERS, CHAPTER_ICONS, MIGRATION_FLOWS, NESTING_BEACHES } from '@/data/turtleMap';

// ── Colors ──────────────────────────────────────────────────────────────────
const C = {
  bg: '#080f0a',          // near-black with green tint
  panel: '#0a1a0e',       // dark forest panel
  panelBorder: 'rgba(74,222,128,0.12)',
  gold: '#4ade80',        // bright emerald (replaces gold)
  goldMid: '#34d399',     // teal-green
  goldDim: '#16a34a',     // forest green
  red: '#065f46',         // deep green (replaces red)
  text: '#dcfce7',        // pale mint text
  muted: '#86efac',       // muted green
  mutedDim: '#4ade8055',
  accent: '#bbf7d0',      // light mint
  glow: 'rgba(74,222,128,0.15)',
};

// ── useCounter hook ──────────────────────────────────────────────────────────
const useCounter = (target, duration = 2200, active = false) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) { setVal(0); return; }
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(e * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, active]);
  return val;
};

const StatCounter = ({ target, label, suffix, active }) => {
  const val = useCounter(target, 2200, active);
  return (
    <div style={{ textAlign: 'center', padding: '10px 14px', background: 'rgba(74,222,128,0.05)', border: `1px solid ${C.panelBorder}`, borderRadius: 4 }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 700, color: C.gold, letterSpacing: '-0.02em', lineHeight: 1 }}>
        {val.toLocaleString()}{suffix}
      </div>
      <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, color: C.muted, marginTop: 4, lineHeight: 1.4, letterSpacing: '0.05em' }}>{label}</div>
    </div>
  );
};

// ── Main Component ───────────────────────────────────────────────────────────
const TurtleMap = () => {
  const navigate = useNavigate();
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const animFrames = useRef([]);
  const flowTimers = useRef([]);

  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [mapReady, setMapReady] = useState(false);
  const [counterActive, setCounterActive] = useState(false);

  const chapter = CHAPTERS[idx];
  const DURATION = 10000; // ms per chapter — turtle walk is synced to this

  // ── cancel all animations ──────────────────────────────────────────────────
  const clearAll = useCallback(() => {
    animFrames.current.forEach(cancelAnimationFrame);
    flowTimers.current.forEach(clearTimeout);
    animFrames.current = [];
    flowTimers.current = [];
  }, []);

  // ── Mapbox init ────────────────────────────────────────────────────────────
  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      projection: 'globe',
      center: [0, 20],
      zoom: 1.8,
      interactive: true,
    });
    mapRef.current = map;

    map.on('style.load', () => {
      // ── Draw turtle icon onto canvas and register as Mapbox image ──────────
      const SIZE = 80;
      const canvas = document.createElement('canvas');
      canvas.width = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext('2d');

      // Helper: draw the turtle facing right
      const drawTurtle = (ctx, s) => {
        ctx.clearRect(0, 0, s, s);

        const cx = s * 0.44;
        const cy = s * 0.50;

        // Drop shadow / glow
        ctx.shadowColor = '#4ade80';
        ctx.shadowBlur = s * 0.18;

        // Shell — dark green base
        ctx.beginPath();
        ctx.ellipse(cx, cy, s * 0.28, s * 0.22, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#166534';
        ctx.fill();

        // Shell — hex pattern segments
        ctx.shadowBlur = 0;
        const hexCenters = [
          [0, 0], [s*0.10, -s*0.08], [-s*0.10, -s*0.08],
          [s*0.10, s*0.08], [-s*0.10, s*0.08], [0, -s*0.14], [0, s*0.14],
        ];
        hexCenters.forEach(([dx, dy]) => {
          ctx.beginPath();
          ctx.ellipse(cx + dx, cy + dy, s * 0.07, s * 0.055, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#15803d';
          ctx.fill();
          ctx.strokeStyle = '#4ade80';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        });

        // Shell outline
        ctx.beginPath();
        ctx.ellipse(cx, cy, s * 0.28, s * 0.22, 0, 0, Math.PI * 2);
        ctx.strokeStyle = '#4ade80';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#4ade80';
        ctx.shadowBlur = s * 0.1;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Head (right side)
        ctx.beginPath();
        ctx.ellipse(cx + s * 0.34, cy - s * 0.03, s * 0.10, s * 0.08, -0.2, 0, Math.PI * 2);
        ctx.fillStyle = '#16a34a';
        ctx.fill();
        ctx.strokeStyle = '#4ade80';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Eye
        ctx.beginPath();
        ctx.arc(cx + s * 0.40, cy - s * 0.06, s * 0.025, 0, Math.PI * 2);
        ctx.fillStyle = '#bbf7d0';
        ctx.fill();

        // Front flippers
        // Top-right
        ctx.beginPath();
        ctx.ellipse(cx + s * 0.18, cy - s * 0.26, s * 0.09, s * 0.055, -0.8, 0, Math.PI * 2);
        ctx.fillStyle = '#15803d';
        ctx.fill();
        ctx.strokeStyle = '#4ade80';
        ctx.lineWidth = 0.8;
        ctx.stroke();
        // Bottom-right
        ctx.beginPath();
        ctx.ellipse(cx + s * 0.18, cy + s * 0.26, s * 0.09, s * 0.055, 0.8, 0, Math.PI * 2);
        ctx.fillStyle = '#15803d';
        ctx.fill();
        ctx.strokeStyle = '#4ade80';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Back flippers
        // Top-left
        ctx.beginPath();
        ctx.ellipse(cx - s * 0.20, cy - s * 0.22, s * 0.075, s * 0.045, 0.7, 0, Math.PI * 2);
        ctx.fillStyle = '#14532d';
        ctx.fill();
        ctx.strokeStyle = '#4ade80';
        ctx.lineWidth = 0.7;
        ctx.stroke();
        // Bottom-left
        ctx.beginPath();
        ctx.ellipse(cx - s * 0.20, cy + s * 0.22, s * 0.075, s * 0.045, -0.7, 0, Math.PI * 2);
        ctx.fillStyle = '#14532d';
        ctx.fill();
        ctx.strokeStyle = '#4ade80';
        ctx.lineWidth = 0.7;
        ctx.stroke();

        // Tail (left)
        ctx.beginPath();
        ctx.moveTo(cx - s * 0.28, cy);
        ctx.quadraticCurveTo(cx - s * 0.40, cy + s * 0.06, cx - s * 0.44, cy + s * 0.02);
        ctx.strokeStyle = '#16a34a';
        ctx.lineWidth = s * 0.035;
        ctx.lineCap = 'round';
        ctx.stroke();
      };

      drawTurtle(ctx, SIZE);
      const imageData = ctx.getImageData(0, 0, SIZE, SIZE);
      map.addImage('turtle-icon', imageData, { pixelRatio: 2 });

      // Globe atmosphere — deep green ocean tint
      map.setFog({
        color: '#0a1a0e',
        'high-color': '#061209',
        'horizon-blend': 0.04,
        'space-color': '#020804',
        'star-intensity': 0.6,
      });

      // Restyle ocean layers to deep green
      const styleLayers = map.getStyle().layers;
      styleLayers.forEach(layer => {
        if (layer.type === 'background') {
          map.setPaintProperty(layer.id, 'background-color', '#020c05');
        }
        if (layer.id.includes('water') && layer.type === 'fill') {
          map.setPaintProperty(layer.id, 'fill-color', '#041208');
        }
        if (layer.id.includes('land') && layer.type === 'fill') {
          map.setPaintProperty(layer.id, 'fill-color', '#0a1a0e');
        }
      });

      // Country boundaries source
      map.addSource('countries', {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1',
      });

      // Country fill — deep forest
      map.addLayer({
        id: 'country-fill',
        type: 'fill',
        source: 'countries',
        'source-layer': 'country_boundaries',
        paint: {
          'fill-color': '#0f2a14',
          'fill-opacity': 0.7,
        },
      });

      // Country outline
      map.addLayer({
        id: 'country-outline',
        type: 'line',
        source: 'countries',
        'source-layer': 'country_boundaries',
        paint: {
          'line-color': '#1a3a20',
          'line-width': 0.4,
          'line-opacity': 0.6,
        },
      });

      // Highlighted country fill
      map.addLayer({
        id: 'country-highlight',
        type: 'fill',
        source: 'countries',
        'source-layer': 'country_boundaries',
        paint: {
          'fill-color': '#16a34a',
          'fill-opacity': 0,
        },
      });

      // ── Migration flow sources & layers ──────────────────────────────────
      MIGRATION_FLOWS.forEach(flow => {
        map.addSource(`flow-${flow.id}`, {
          type: 'geojson',
          data: { type: 'Feature', geometry: { type: 'LineString', coordinates: flow.coords } },
        });

        // Background glow line
        map.addLayer({
          id: `flow-glow-${flow.id}`,
          type: 'line',
          source: `flow-${flow.id}`,
          paint: {
            'line-color': flow.color,
            'line-width': 8,
            'line-opacity': 0,
            'line-blur': 6,
          },
        });

        // Main dashed flow line
        map.addLayer({
          id: `flow-line-${flow.id}`,
          type: 'line',
          source: `flow-${flow.id}`,
          paint: {
            'line-color': flow.color,
            'line-width': 2,
            'line-opacity': 0,
            'line-dasharray': [3, 4],
          },
        });

        // Animated turtle icon — canvas-drawn SVG image
        map.addSource(`turtle-${flow.id}`, {
          type: 'geojson',
          data: { type: 'Feature', geometry: { type: 'Point', coordinates: flow.coords[0] } },
        });
        map.addLayer({
          id: `turtle-dot-${flow.id}`,
          type: 'symbol',
          source: `turtle-${flow.id}`,
          layout: {
            'icon-image': 'turtle-icon',
            'icon-size': 0.55,
            'icon-allow-overlap': true,
            'icon-ignore-placement': true,
            'icon-rotate': 0,
            'visibility': 'none',
          },
          paint: {
            'icon-opacity': 1,
          },
        });
      });

      // ── Nesting beach markers ─────────────────────────────────────────────
      NESTING_BEACHES.forEach(beach => {
        map.addSource(`beach-${beach.id}`, {
          type: 'geojson',
          data: { type: 'Feature', geometry: { type: 'Point', coordinates: beach.coords } },
        });

        // Outer pulse ring
        map.addLayer({
          id: `beach-ring-${beach.id}`,
          type: 'circle',
          source: `beach-${beach.id}`,
          paint: {
            'circle-radius': 14,
            'circle-color': 'transparent',
            'circle-stroke-color': '#4ade80',
            'circle-stroke-width': 1,
            'circle-opacity': 0,
            'circle-stroke-opacity': 0,
          },
        });

        // Center dot
        map.addLayer({
          id: `beach-dot-${beach.id}`,
          type: 'circle',
          source: `beach-${beach.id}`,
          paint: {
            'circle-radius': 5,
            'circle-color': '#4ade80',
            'circle-opacity': 0,
            'circle-stroke-width': 1.5,
            'circle-stroke-color': '#bbf7d0',
            'circle-stroke-opacity': 0,
          },
        });
      });

      setMapReady(true);
    });

    return () => {
      clearAll();
      map.remove();
    };
  }, []);

  // ── Animate turtle along a route ──────────────────────────────────────────
  // walkDuration: total ms the turtle should take to traverse the full route
  const animateTurtle = useCallback((flowId, coords, delay = 0, walkDuration = 9000) => {
    const map = mapRef.current;
    if (!map) return;
    const STEPS = 240;
    // Compute step interval so all steps complete within walkDuration
    const STEP_MS = Math.floor(walkDuration / STEPS);

    const flatCoords = [];
    for (let i = 0; i < coords.length - 1; i++) {
      const segSteps = Math.round(STEPS / (coords.length - 1));
      for (let s = 0; s < segSteps; s++) {
        const t = s / segSteps;
        flatCoords.push([
          coords[i][0] + (coords[i + 1][0] - coords[i][0]) * t,
          coords[i][1] + (coords[i + 1][1] - coords[i][1]) * t,
        ]);
      }
    }
    flatCoords.push(coords[coords.length - 1]);

    let step = 0;
    const walk = () => {
      if (!mapRef.current || step >= flatCoords.length) return;
      try {
        map.getSource(`turtle-${flowId}`)?.setData({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: flatCoords[step] },
        });
      } catch {}
      step++;
      const tid = setTimeout(walk, STEP_MS);
      flowTimers.current.push(tid);
    };

    const tid = setTimeout(walk, delay);
    flowTimers.current.push(tid);
  }, []);

  // ── Show/hide layers per chapter ──────────────────────────────────────────
  const applyChapter = useCallback((ch, chIdx) => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    clearAll();

    const currentFlows = MIGRATION_FLOWS.filter(f => f.chapter === ch.id);

    // Hide all flows first
    MIGRATION_FLOWS.forEach(flow => {
      try { map.setPaintProperty(`flow-glow-${flow.id}`, 'line-opacity', 0); } catch {}
      try { map.setPaintProperty(`flow-line-${flow.id}`, 'line-opacity', 0); } catch {}
      try { map.setLayoutProperty(`turtle-dot-${flow.id}`, 'visibility', 'none'); } catch {}
    });

    // Hide all beaches
    NESTING_BEACHES.forEach(beach => {
      ['beach-ring', 'beach-dot'].forEach(prefix => {
        try {
          map.setPaintProperty(`${prefix}-${beach.id}`, prefix === 'beach-ring' ? 'circle-stroke-opacity' : 'circle-opacity', 0);
          if (prefix === 'beach-dot') map.setPaintProperty(`${prefix}-${beach.id}`, 'circle-stroke-opacity', 0);
        } catch {}
      });
    });

    // Country highlight
    const countriesForType = {
      migration: ['AU', 'BR', 'US', 'ID', 'PG', 'MY'],
      nesting: ['AU', 'CR', 'US'],
      threat: [],
    };
    try {
      map.setPaintProperty('country-highlight', 'fill-opacity',
        ch.type === 'migration' ? 0.25 : ch.type === 'nesting' ? 0.2 : 0
      );
    } catch {}

    // Show current flows with fade-in
    currentFlows.forEach((flow, i) => {
      const delay = i * 300;
      const t1 = setTimeout(() => {
        try {
          map.setPaintProperty(`flow-glow-${flow.id}`, 'line-opacity', 0.3);
          map.setPaintProperty(`flow-line-${flow.id}`, 'line-opacity', 0.9);
          map.setLayoutProperty(`turtle-dot-${flow.id}`, 'visibility', 'visible');
        } catch {}
        animateTurtle(flow.id, flow.coords, 0, DURATION - 1000);
      }, delay);
      flowTimers.current.push(t1);
    });

    // Show nesting beaches for relevant chapters
    const beachChapters = ['leatherback', 'loggerhead', 'green_turtle', 'hawksbill', 'flatback', 'hope'];
    if (beachChapters.includes(ch.id)) {
      NESTING_BEACHES.filter(b => b.chapter === ch.id || ch.id === 'hope').forEach((beach, i) => {
        const t2 = setTimeout(() => {
          try {
            map.setPaintProperty(`beach-ring-${beach.id}`, 'circle-stroke-opacity', 0.7);
            map.setPaintProperty(`beach-dot-${beach.id}`, 'circle-opacity', 1);
            map.setPaintProperty(`beach-dot-${beach.id}`, 'circle-stroke-opacity', 0.9);
          } catch {}
        }, i * 200);
        flowTimers.current.push(t2);
      });
    }

    // Fly to relevant region
    const flyTargets = {
      intro:       { center: [0, 10], zoom: 1.6 },
      leatherback: { center: [170, 15], zoom: 2.0 },
      loggerhead:  { center: [-40, 30], zoom: 2.2 },
      green_turtle:{ center: [-25, -8], zoom: 3.2 },
      hawksbill:   { center: [-65, 15], zoom: 3.5 },
      flatback:    { center: [138, -16], zoom: 3.8 },
      threats:     { center: [0, 10], zoom: 1.6 },
      hope:        { center: [0, 10], zoom: 1.6 },
    };
    const target = flyTargets[ch.id] || { center: [0, 10], zoom: 1.8 };
    map.flyTo({ center: target.center, zoom: target.zoom, duration: 1800, essential: true });
  }, [mapReady, animateTurtle, clearAll]);

  // ── Apply chapter when idx or mapReady changes ────────────────────────────
  useEffect(() => {
    if (!mapReady) return;
    setCounterActive(false);
    const t = setTimeout(() => setCounterActive(true), 400);
    applyChapter(chapter, idx);
    return () => clearTimeout(t);
  }, [idx, mapReady]);

  // ── Auto-play ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!playing) return;
    setProgress(0);
    const startTime = Date.now();
    let rafId;
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(elapsed / DURATION, 1);
      setProgress(pct);
      if (pct < 1) { rafId = requestAnimationFrame(tick); }
      else {
        setIdx(i => (i + 1) % CHAPTERS.length);
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [playing, idx]);

  const goTo = (i) => { setIdx(i); setProgress(0); };

  // ── Type color ─────────────────────────────────────────────────────────────
  const typeColor = (type) => {
    if (type === 'nesting') return '#34d399';
    if (type === 'threat') return '#16a34a';
    return '#4ade80';
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ position: 'fixed', inset: 0, background: C.bg, overflow: 'hidden', fontFamily: "'Lato', sans-serif" }}>

      {/* Grid overlay */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1,
        backgroundImage: `
          linear-gradient(rgba(74,222,128,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(74,222,128,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      {/* Hero glow — green tint top-left */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: 600, height: 600,
        background: 'radial-gradient(ellipse at top left, rgba(74,222,128,0.04), transparent 70%)',
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* Map */}
      <div ref={mapContainer} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

      {/* Nav bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 20,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 28px',
        borderBottom: '1px solid rgba(74,222,128,0.06)',
        background: 'linear-gradient(to bottom, rgba(8,15,10,0.95), transparent)',
      }}>
        <button onClick={() => navigate('/')} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: "'DM Mono', monospace", fontSize: 10,
          letterSpacing: '0.2em', color: C.muted,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          ← ANIMATED MAPS
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.18em', color: C.goldDim, textTransform: 'uppercase' }}>
            🐢 WORLD TURTLE DAY — MAY 23
          </span>
          <div style={{ width: 1, height: 12, background: 'rgba(74,222,128,0.2)' }} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.1em', color: '#2d6a35' }}>
            {idx + 1} / {CHAPTERS.length}
          </span>
        </div>
      </div>

      {/* Chapter panel — left side */}
      <div style={{
        position: 'fixed', top: 70, left: 24, bottom: 80, zIndex: 20,
        width: 340, display: 'flex', flexDirection: 'column',
        background: 'rgba(8,15,10,0.82)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${C.panelBorder}`,
        borderRadius: 6,
        overflow: 'hidden',
      }}>
        {/* Top accent bar */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${C.gold}, ${C.goldMid}, transparent)` }} />

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px' }}>

          {/* Badge + icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 22 }}>{chapter.icon}</span>
            <div>
              <div style={{
                fontFamily: "'DM Mono', monospace", fontSize: 8,
                letterSpacing: '0.22em', color: C.gold,
                textTransform: 'uppercase',
                border: `1px solid ${C.panelBorder}`,
                padding: '2px 8px', display: 'inline-block',
                background: 'rgba(74,222,128,0.06)',
              }}>
                {chapter.badge}
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: C.mutedDim, marginTop: 3, letterSpacing: '0.08em' }}>
                {chapter.year}
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 22, fontWeight: 700,
            color: C.text, lineHeight: 1.2,
            margin: '0 0 6px',
            letterSpacing: '-0.01em',
          }}>
            {chapter.title}
          </h1>

          {/* Subtitle */}
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10, color: C.muted,
            letterSpacing: '0.06em', lineHeight: 1.5,
            margin: '0 0 14px',
          }}>
            {chapter.subtitle}
          </p>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(74,222,128,0.08)', margin: '0 0 14px' }} />

          {/* Body */}
          <p style={{
            fontFamily: "'Lato', sans-serif",
            fontSize: 12.5, color: '#a7f3c0',
            lineHeight: 1.8, margin: '0 0 16px', fontWeight: 300,
          }}>
            {chapter.body}
          </p>

          {/* Stat counter */}
          <div style={{ margin: '0 0 16px' }}>
            <StatCounter
              target={chapter.stat}
              label={chapter.statLabel}
              suffix={chapter.statSuffix || ''}
              active={counterActive}
            />
          </div>

          {/* Quote */}
          <div style={{
            borderLeft: `2px solid ${C.gold}`,
            paddingLeft: 14, margin: '0 0 8px',
          }}>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 12, fontStyle: 'italic',
              color: C.accent, lineHeight: 1.6, margin: '0 0 4px',
            }}>
              "{chapter.quote}"
            </p>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: C.mutedDim, letterSpacing: '0.08em' }}>
              — {chapter.quoteAuthor}
            </span>
          </div>
        </div>

        {/* Progress + controls */}
        <div style={{ borderTop: '1px solid rgba(74,222,128,0.07)', padding: '12px 22px 16px' }}>
          {/* Progress bar */}
          <div style={{ height: 2, background: 'rgba(74,222,128,0.1)', borderRadius: 1, marginBottom: 10, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 1,
              background: `linear-gradient(90deg, ${C.gold}, ${C.goldMid})`,
              width: `${progress * 100}%`,
              transition: playing ? 'none' : 'width 0.2s',
            }} />
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => goTo((idx - 1 + CHAPTERS.length) % CHAPTERS.length)}
              style={{ background: 'none', border: `1px solid rgba(74,222,128,0.15)`, color: C.muted, cursor: 'pointer', padding: '5px 10px', fontFamily: "'DM Mono', monospace", fontSize: 12, borderRadius: 3 }}>
              ‹
            </button>
            <button onClick={() => setPlaying(p => !p)}
              style={{
                background: playing ? 'rgba(74,222,128,0.15)' : 'rgba(74,222,128,0.05)',
                border: `1px solid rgba(74,222,128,0.2)`,
                color: C.gold, cursor: 'pointer',
                padding: '5px 16px', fontFamily: "'DM Mono', monospace",
                fontSize: 9, letterSpacing: '0.12em', borderRadius: 3, flex: 1,
              }}>
              {playing ? '⏸ PAUSE' : '▶ PLAY'}
            </button>
            <button onClick={() => goTo((idx + 1) % CHAPTERS.length)}
              style={{ background: 'none', border: `1px solid rgba(74,222,128,0.15)`, color: C.muted, cursor: 'pointer', padding: '5px 10px', fontFamily: "'DM Mono', monospace", fontSize: 12, borderRadius: 3 }}>
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Legend — bottom right */}
      <div style={{
        position: 'fixed', bottom: 88, right: 24, zIndex: 20,
        background: 'rgba(8,15,10,0.82)',
        backdropFilter: 'blur(8px)',
        border: `1px solid ${C.panelBorder}`,
        borderRadius: 6, padding: '12px 16px',
        minWidth: 180,
      }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.18em', color: C.goldDim, marginBottom: 10, textTransform: 'uppercase' }}>
          Species Guide
        </div>
        {[
          { color: '#4ade80', label: 'Leatherback' },
          { color: '#86efac', label: 'Loggerhead' },
          { color: '#34d399', label: 'Green Turtle' },
          { color: '#10b981', label: 'Hawksbill' },
          { color: '#059669', label: 'Flatback' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 20, height: 2, background: item.color, borderRadius: 1 }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: C.muted, letterSpacing: '0.08em' }}>{item.label}</span>
          </div>
        ))}
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(74,222,128,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: C.muted, letterSpacing: '0.08em' }}>Nesting Beach</span>
          </div>
        </div>
      </div>

      {/* Timeline scrubber */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 20,
        height: 68,
        background: 'rgba(8,15,10,0.92)',
        backdropFilter: 'blur(8px)',
        borderTop: '1px solid rgba(74,222,128,0.07)',
        display: 'flex', alignItems: 'stretch',
      }}>
        {CHAPTERS.map((ch, i) => {
          const active = i === idx;
          const tc = typeColor(ch.type);
          return (
            <div key={ch.id} onClick={() => goTo(i)} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', padding: '0 4px',
              borderRight: '1px solid rgba(74,222,128,0.05)',
              borderTop: `2px solid ${active ? tc : 'transparent'}`,
              background: active ? 'rgba(74,222,128,0.07)' : 'transparent',
              transition: 'background 0.2s',
            }}>
              <span style={{ fontSize: 13, lineHeight: 1 }}>{ch.icon}</span>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 7, color: active ? tc : '#2a4a30',
                letterSpacing: '0.04em', marginTop: 3,
                overflow: 'hidden', textOverflow: 'ellipsis',
                whiteSpace: 'nowrap', maxWidth: 60, textAlign: 'center',
              }}>
                {ch.year}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TurtleMap;
