// TrafficMap.jsx — Cinematic Urban Traffic Fluid Visualization
// City of Karachi — living fluid system
import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import { ROAD_SEGMENTS, TRAFFIC_ZONES, CITY_CENTER, INITIAL_ZOOM, getTrafficColor } from '@/data/trafficMap';

// ─── Fonts ────────────────────────────────────────────────────────────────────
const FONT_URL = 'https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@300;400;600;700&family=Orbitron:wght@400;600;800&display=swap';

// ─── Global CSS ───────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
@import url('${FONT_URL}');

@keyframes fadeUp    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeIn    { from{opacity:0} to{opacity:1} }
@keyframes scanLine  { 0%{top:-2px} 100%{top:100%} }
@keyframes pulse     { 0%,100%{opacity:0.6} 50%{opacity:1} }
@keyframes liveBlink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
@keyframes glowPulse {
  0%,100%{text-shadow:0 0 10px currentColor}
  50%{text-shadow:0 0 40px currentColor,0 0 80px currentColor}
}
@keyframes slideInLeft  { from{transform:translateX(-100%);opacity:0} to{transform:translateX(0);opacity:1} }
@keyframes slideInRight { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
@keyframes countUp {
  from{opacity:0;transform:translateY(8px)}
  to{opacity:1;transform:translateY(0)}
}
@keyframes borderFlow {
  0%{border-color:rgba(45,226,230,0.15)}
  50%{border-color:rgba(45,226,230,0.5)}
  100%{border-color:rgba(45,226,230,0.15)}
}
@keyframes radarSpin {
  from{transform:rotate(0deg)}
  to{transform:rotate(360deg)}
}
@keyframes radarFade {
  0%{opacity:0.85} 100%{opacity:0}
}
@keyframes zoneGlow {
  0%,100%{opacity:0.08} 50%{opacity:0.18}
}
@keyframes hudIn {
  from{opacity:0;transform:scale(0.97) translateY(6px)}
  to{opacity:1;transform:scale(1) translateY(0)}
}
@keyframes cameraShift {
  0%,100%{filter:brightness(1)}
  50%{filter:brightness(1.04)}
}

.fade-up    { animation: fadeUp    0.8s cubic-bezier(.22,1,.36,1) both; }
.fade-in    { animation: fadeIn    0.6s ease both; }
.slide-left { animation: slideInLeft  0.6s cubic-bezier(.22,1,.36,1) both; }
.slide-right{ animation: slideInRight 0.6s cubic-bezier(.22,1,.36,1) both; }
.live-blink { animation: liveBlink 1s steps(1) infinite; }
.glow-pulse { animation: glowPulse 3s ease-in-out infinite; }
.hud-in     { animation: hudIn 0.9s cubic-bezier(.22,1,.36,1) both; }

.mapboxgl-ctrl-bottom-left,
.mapboxgl-ctrl-bottom-right,
.mapboxgl-ctrl-attrib { display:none!important; }

/* Scrollbar */
::-webkit-scrollbar { width:2px; }
::-webkit-scrollbar-track { background:transparent; }
::-webkit-scrollbar-thumb { background:rgba(45,226,230,0.2); border-radius:2px; }
`;

// ─── Color palette ────────────────────────────────────────────────────────────
const C = {
  bg:         '#0B1020',
  panel:      'rgba(11,16,32,0.95)',
  border:     'rgba(45,226,230,0.18)',
  borderHot:  'rgba(45,226,230,0.5)',
  cyan:       '#2DE2E6',
  cyanDim:    'rgba(45,226,230,0.5)',
  blue:       '#1B6EF3',
  amber:      '#FFB703',
  red:        '#FF3B3B',
  white:      '#E8EDF5',
  dim:        'rgba(232,237,245,0.45)',
  dimmer:     'rgba(232,237,245,0.2)',
  navy:       '#111827',
  road:       'rgba(42,52,70,0.30)',
};

// ─── Particle system constants ────────────────────────────────────────────────
// 1800 particles across 89 segments = ~20 particles per road on average.
// Trail length 16 gives a clear streak. Draw loop is now efficient (no blur,
// no per-frame canvas resize, no gradient allocation) so this runs fine.
const PARTICLE_COUNT  = 1800;
const TRAIL_LENGTH    = 16;
const BASE_SPEED      = 0.00018;

// ─── Noise helper (simple 2D) ─────────────────────────────────────────────────
function noise2d(x, y, t) {
  return Math.sin(x * 3.7 + t * 0.4) * Math.cos(y * 2.9 + t * 0.3) * 0.5 + 0.5;
}

// ─── Interpolate along segment ────────────────────────────────────────────────
function lerpSegment(coords, t) {
  const total = coords.length - 1;
  const pos   = t * total;
  const i     = Math.min(Math.floor(pos), total - 1);
  const frac  = pos - i;
  const a     = coords[i], b = coords[i + 1] || coords[i];
  return [a[0] + (b[0] - a[0]) * frac, a[1] + (b[1] - a[1]) * frac];
}

// ─── Project lng/lat → canvas XY using map ───────────────────────────────────
function project(map, lng, lat) {
  const p = map.project([lng, lat]);
  return [p.x, p.y];
}

// ─── Build particle pool ──────────────────────────────────────────────────────
function buildParticles(segments) {
  const particles = [];
  const totalWeight = segments.reduce((s, seg) => s + seg.coords.length, 0);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // Weighted random segment selection
    let r = Math.random() * totalWeight, cumul = 0, seg = segments[0];
    for (const s of segments) { cumul += s.coords.length; if (r <= cumul) { seg = s; break; } }

    const col = getTrafficColor(seg.speed);
    const isFast      = seg.speed >= 70;
    const isCongested = seg.congestion > 0.7;

    // Pre-cache rgba strings — computed once per particle, never inside draw loop
    const primaryRgba   = hexToRgba(col.primary,   1);
    const secondaryRgba = hexToRgba(col.secondary, 1);
    const glowRgba      = hexToRgba(col.glow,      1);

    particles.push({
      seg,
      t:           Math.random(),
      speed:       (seg.speed / 100) * BASE_SPEED * (0.6 + Math.random() * 0.8),
      col,
      primaryRgba,
      secondaryRgba,
      glowRgba,
      opacity:     0.5 + Math.random() * 0.5,
      size:        isFast ? 2.5 + Math.random() * 2 : isCongested ? 3.5 + Math.random() * 2.5 : 2 + Math.random() * 2,
      trail:       [],
      noise:       Math.random() * 1000,
      phase:       Math.random() * Math.PI * 2,
      jitter:      isCongested ? 0.6 + Math.random() * 0.8 : 0.05 + Math.random() * 0.15,
    });
  }
  return particles;
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────
const TrafficMap = () => {
  const navigate    = useNavigate();
  const mapEl       = useRef(null);
  const mapRef      = useRef(null);
  const canvasRef   = useRef(null);
  const particleRef = useRef([]);
  const rafRef      = useRef(null);
  const timeRef     = useRef(0);
  const [ready,     setReady]     = useState(false);
  const [hoveredSeg, setHoveredSeg] = useState(null);
  const [stats,     setStats]     = useState({ fast: 0, moderate: 0, congested: 0, avg: 0 });

  // ── Compute live stats ───────────────────────────────────────────────────
  useEffect(() => {
    const fast      = ROAD_SEGMENTS.filter(s => s.speed >= 60).length;
    const moderate  = ROAD_SEGMENTS.filter(s => s.speed >= 25 && s.speed < 60).length;
    const congested = ROAD_SEGMENTS.filter(s => s.speed < 25).length;
    const avg       = Math.round(ROAD_SEGMENTS.reduce((s, r) => s + r.speed, 0) / ROAD_SEGMENTS.length);
    setStats({ fast, moderate, congested, avg });
  }, []);

  // ── Map init ─────────────────────────────────────────────────────────────
  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapEl.current,
      style:     'mapbox://styles/mapbox/dark-v11',
      center:    CITY_CENTER,
      zoom:      INITIAL_ZOOM,
      pitch:     28,
      bearing:   -8,
      antialias: true,
      interactive: true,
    });

    mapRef.current = map;

    map.on('style.load', () => {
      // ── Deep night basemap overrides ────────────────────────────────────
      const layers = map.getStyle().layers;

      // Set background deep navy
      map.setPaintProperty('background', 'background-color', '#0B1020');
      map.setPaintProperty('background', 'background-opacity', 1);

      layers.forEach(l => {
        try {
          if (l.type === 'fill')   map.setPaintProperty(l.id, 'fill-color', '#0D1428');
          if (l.type === 'fill')   map.setPaintProperty(l.id, 'fill-opacity', 0.95);
          if (l.type === 'line' && l.id.includes('road')) {
            map.setPaintProperty(l.id, 'line-color', '#1E2A40');
            map.setPaintProperty(l.id, 'line-opacity', 0.18);
          }
          if (l.type === 'symbol') {
            try { map.setPaintProperty(l.id, 'text-color', 'rgba(90,110,150,0.55)'); } catch (_) {}
            try { map.setPaintProperty(l.id, 'text-opacity', 0.45); } catch (_) {}
            try { map.setPaintProperty(l.id, 'icon-opacity', 0); } catch (_) {}
          }
          // Hide secondary labels
          if (l.id.includes('poi') || l.id.includes('transit') || l.id.includes('place-neighborhood')) {
            try { map.setLayoutProperty(l.id, 'visibility', 'none'); } catch (_) {}
          }
        } catch (_) {}
      });

      // ── Fog / atmosphere ─────────────────────────────────────────────────
      map.setFog({
        color:            'rgb(10,14,30)',
        'high-color':     'rgb(18,25,50)',
        'horizon-blend':  0.04,
        'space-color':    'rgb(5,8,20)',
        'star-intensity': 0.0,
      });

      setReady(true);
    });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      map.remove();
    };
  }, []);

  // ── Canvas particle engine ────────────────────────────────────────────────
  useEffect(() => {
    if (!ready) return;
    const map = mapRef.current;

    // Overlay canvas on top of map
    const canvas = canvasRef.current;
    particleRef.current = buildParticles(ROAD_SEGMENTS);

    // ── Get context once, never reassign ───────────────────────────────────
    // Canvas dimensions are set on resize only, NOT every frame.
    let W = 0, H = 0;
    const ctx = canvas.getContext('2d');

    const syncSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw  = canvas.offsetWidth;
      const ch  = canvas.offsetHeight;
      if (cw !== W || ch !== H) {
        W = cw; H = ch;
        // Only set canvas dimensions when they actually change
        canvas.width  = cw * dpr;
        canvas.height = ch * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };
    syncSize();
    const ro = new ResizeObserver(syncSize);
    ro.observe(canvas);

    // Pre-build zone screen positions — recomputed only on map move, not every frame
    let zoneScreenPos = [];
    const updateZonePos = () => {
      zoneScreenPos = TRAFFIC_ZONES.map(z => {
        const p = map.project([z.center[0], z.center[1]]);
        return { x: p.x, y: p.y, zone: z };
      });
    };
    updateZonePos();
    map.on('move', updateZonePos);

    // Pre-build road screen coords — recomputed only on map move
    let roadScreenCoords = [];
    const updateRoadCoords = () => {
      roadScreenCoords = ROAD_SEGMENTS.map(seg => {
        const col = getTrafficColor(seg.speed);
        return {
          seg, col,
          pts: seg.coords.map(([lng, lat]) => { const p = map.project([lng, lat]); return [p.x, p.y]; }),
          // unique wave phase per road so they don't all pulse in sync
          waveOffset: (seg.coords[0][0] + seg.coords[0][1]) * 47.3,
        };
      });
    };
    updateRoadCoords();
    map.on('move', updateRoadCoords);

    let lastTs = 0;

    const draw = (ts) => {
      const dt = Math.min((ts - lastTs) / 16.67, 3);
      lastTs   = ts;
      timeRef.current += dt * 0.016;
      const t  = timeRef.current;

      // ── Trail fade (motion blur) ──────────────────────────────────────────
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(11,16,32,0.18)';
      ctx.fillRect(0, 0, W, H);

      // ══════════════════════════════════════════════════════════════════════
      // FLUID ROAD LINES — drawn before particles
      // Each road is rendered as a static dim base + an animated brightness
      // wave that travels from start to end, making the road "flow".
      // Two techniques combined:
      //   1. A slow travelling gradient sweep (energy-in-a-wire effect)
      //   2. A gentle width pulse on fast roads (breathing artery feel)
      // ══════════════════════════════════════════════════════════════════════
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap  = 'round';
      ctx.lineJoin = 'round';

      for (const { seg, col, pts, waveOffset } of roadScreenCoords) {
        if (pts.length < 2) continue;

        const isFast      = seg.speed >= 70;
        const isSlow      = seg.speed < 20;
        const isExpress   = seg.type === 'expressway';

        // ── Base road glow — always visible, very dim ────────────────────
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);

        const baseAlpha = isExpress ? 0.22 : isFast ? 0.14 : isSlow ? 0.09 : 0.11;
        ctx.strokeStyle = col.primary.replace ? col.primary : col.primary;
        // parse hex to rgba for base
        const pr = parseInt(col.primary.slice(1,3),16);
        const pg = parseInt(col.primary.slice(3,5),16);
        const pb = parseInt(col.primary.slice(5,7),16);
        ctx.strokeStyle = `rgba(${pr},${pg},${pb},${baseAlpha})`;
        ctx.lineWidth   = isExpress ? 2.5 : isFast ? 1.8 : 1.2;
        ctx.stroke();

        // ── Travelling wave — a bright band sweeping along the road ──────
        // Wave position: 0→1 cycling at speed proportional to road speed
        const waveSpeed = (seg.speed / 100) * 0.35 + 0.05; // slow roads crawl
        const wavePos   = ((t * waveSpeed + waveOffset) % 1 + 1) % 1; // 0..1

        // Map wave pos to pixel position along the polyline
        // Compute cumulative segment lengths for accurate positioning
        const segLengths = [];
        let totalLen = 0;
        for (let i = 0; i < pts.length - 1; i++) {
          const dx = pts[i+1][0] - pts[i][0];
          const dy = pts[i+1][1] - pts[i][1];
          const l  = Math.sqrt(dx*dx + dy*dy);
          segLengths.push(l);
          totalLen += l;
        }
        if (totalLen < 2) continue;

        // Find the pixel coords at wavePos along the polyline
        const wavePx = wavePos * totalLen;
        let   accum  = 0, wX = pts[0][0], wY = pts[0][1];
        for (let i = 0; i < segLengths.length; i++) {
          if (accum + segLengths[i] >= wavePx) {
            const frac = (wavePx - accum) / segLengths[i];
            wX = pts[i][0] + (pts[i+1][0] - pts[i][0]) * frac;
            wY = pts[i][1] + (pts[i+1][1] - pts[i][1]) * frac;
            break;
          }
          accum += segLengths[i];
        }

        // Wave width in pixels (fraction of total road length, min 30px, max 120px)
        const waveWidth = Math.max(30, Math.min(120, totalLen * 0.25));

        // Draw the wave as a radial gradient centered at the wave position,
        // clipped to the road path by drawing it as a thick stroked line
        // with a gradient that falls off from the wave center.
        // Technique: gradient along the full path, shaped to peak at wavePos.
        const waveAlpha = isExpress ? 0.55 : isFast ? 0.42 : isSlow ? 0.28 : 0.35;

        // Build a per-frame gradient along the full road
        const gx0 = pts[0][0], gy0 = pts[0][1];
        const gx1 = pts[pts.length-1][0], gy1 = pts[pts.length-1][1];
        const wg  = ctx.createLinearGradient(gx0, gy0, gx1, gy1);

        // Stops: dark → bright peak at wavePos → dark, with soft falloff
        const waveHalfFrac = waveWidth / (2 * totalLen);
        const p0 = Math.max(0, wavePos - waveHalfFrac * 2.5);
        const p1 = Math.max(0, wavePos - waveHalfFrac);
        const p2 = Math.min(1, wavePos + waveHalfFrac);
        const p3 = Math.min(1, wavePos + waveHalfFrac * 2.5);

        wg.addColorStop(0,                      `rgba(${pr},${pg},${pb},0)`);
        if (p0 > 0.001) wg.addColorStop(p0,    `rgba(${pr},${pg},${pb},0)`);
        wg.addColorStop(Math.min(p1, 0.9999),   `rgba(${pr},${pg},${pb},${waveAlpha * 0.3})`);
        wg.addColorStop(Math.min(wavePos,0.9999),`rgba(${pr},${pg},${pb},${waveAlpha})`);
        if (p2 < 0.9999) wg.addColorStop(p2,   `rgba(${pr},${pg},${pb},${waveAlpha * 0.3})`);
        if (p3 < 0.9999) wg.addColorStop(p3,   `rgba(${pr},${pg},${pb},0)`);
        wg.addColorStop(1,                      `rgba(${pr},${pg},${pb},0)`);

        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
        ctx.strokeStyle = wg;
        // Fast roads: wave is narrow and bright; slow roads: thick and smeared
        const waveLineW = isExpress ? 4 : isFast ? 3 : isSlow ? 5 : 3.5;
        ctx.lineWidth   = waveLineW * (1 + 0.15 * Math.sin(t * 2.5 + waveOffset));
        ctx.stroke();

        // ── Secondary shimmer — opposite-phase ghost wave on fast roads ──
        if (isFast || isExpress) {
          const wavePos2  = ((wavePos + 0.5) % 1);
          const p0b = Math.max(0, wavePos2 - waveHalfFrac * 2);
          const p3b = Math.min(1, wavePos2 + waveHalfFrac * 2);
          const wg2 = ctx.createLinearGradient(gx0, gy0, gx1, gy1);
          wg2.addColorStop(0,  `rgba(${pr},${pg},${pb},0)`);
          if (p0b > 0.001) wg2.addColorStop(p0b, `rgba(${pr},${pg},${pb},0)`);
          wg2.addColorStop(Math.min(wavePos2, 0.9999), `rgba(${pr},${pg},${pb},${waveAlpha * 0.35})`);
          if (p3b < 0.9999) wg2.addColorStop(p3b, `rgba(${pr},${pg},${pb},0)`);
          wg2.addColorStop(1, `rgba(${pr},${pg},${pb},0)`);
          ctx.beginPath();
          ctx.moveTo(pts[0][0], pts[0][1]);
          for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
          ctx.strokeStyle = wg2;
          ctx.lineWidth   = (isExpress ? 3 : 2) * (1 + 0.1 * Math.sin(t * 1.8 + waveOffset + 1));
          ctx.stroke();
        }
      }

      // ── Draw particles — single pass, NO ctx.filter blur ─────────────────
      // Glow is achieved via compositing mode 'lighter' alone — visually
      // identical at this scale, costs almost nothing vs blur passes.
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap  = 'round';
      ctx.lineJoin = 'round';

      for (const p of particleRef.current) {
        const seg         = p.seg;
        const isCongested = seg.congestion > 0.7;
        const isFast      = seg.speed >= 70;

        // Advance position
        let speed = p.speed * dt;
        if (isCongested) {
          const nx = noise2d(p.t * 10, p.phase, t + p.noise);
          speed   *= 0.3 + nx * 0.7;
        }
        p.t += speed;
        if (p.t > 1) p.t -= 1;

        const [lng, lat] = lerpSegment(seg.coords, p.t);

        let jLng = 0, jLat = 0;
        if (p.jitter > 0.1) {
          const jt = t * 4 + p.phase;
          jLng = Math.sin(jt * 1.7 + p.noise) * p.jitter * 0.0002;
          jLat = Math.cos(jt * 2.1 + p.noise) * p.jitter * 0.0002;
        }

        const [x, y] = project(map, lng + jLng, lat + jLat);
        if (x < -20 || x > W + 20 || y < -20 || y > H + 20) continue;

        p.trail.push([x, y]);
        if (p.trail.length > TRAIL_LENGTH) p.trail.shift();
        if (p.trail.length < 2) continue;

        const trailLen = p.trail.length;
        const head     = p.trail[trailLen - 1];
        const tail     = p.trail[0];

        // ── Single-pass trail — gradient created once per visible particle ──
        // (No blur passes, no ctx.save/restore, no ctx.filter)
        const grad = ctx.createLinearGradient(tail[0], tail[1], head[0], head[1]);
        grad.addColorStop(0,   'rgba(0,0,0,0)');
        grad.addColorStop(0.5, p.secondaryRgba.replace(',1)', `,${p.opacity * 0.55})`));
        grad.addColorStop(1,   p.primaryRgba.replace(',1)',   `,${p.opacity})`));

        ctx.beginPath();
        ctx.moveTo(p.trail[0][0], p.trail[0][1]);
        for (let i = 1; i < trailLen; i++) ctx.lineTo(p.trail[i][0], p.trail[i][1]);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = isFast ? p.size * (0.8 + Math.sin(t * 3 + p.phase) * 0.2) : p.size;
        ctx.stroke();

        // ── Head dot — small radial, no blur ─────────────────────────────
        const rg = ctx.createRadialGradient(head[0], head[1], 0, head[0], head[1], p.size * 2.5);
        rg.addColorStop(0, p.glowRgba.replace(',1)', `,${p.opacity * 0.85})`));
        rg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(head[0], head[1], p.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = rg;
        ctx.fill();
      }

      // ── Zone density glow — using cached screen positions ─────────────────
      ctx.globalCompositeOperation = 'source-over';
      const zoomScale = Math.pow(2, map.getZoom() - 12);
      for (const { x, y, zone } of zoneScreenPos) {
        const r     = zone.radius * zoomScale * 0.4;
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.8 + zone.center[0]);
        if (zone.density > 0.7) {
          const rg = ctx.createRadialGradient(x, y, 0, x, y, r);
          rg.addColorStop(0, `rgba(255,59,59,${zone.density * pulse * 0.06})`);
          rg.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = rg; ctx.fill();
        } else if (zone.density < 0.35) {
          const rg = ctx.createRadialGradient(x, y, 0, x, y, r);
          rg.addColorStop(0, `rgba(45,226,230,${zone.density * pulse * 0.05})`);
          rg.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = rg; ctx.fill();
        }
      }

      // ── Vignette — drawn as a CSS div overlay, not canvas ─────────────────
      // (Removed from canvas; the static div in JSX handles it for free)

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      map.off('move', updateZonePos);
      map.off('move', updateRoadCoords);
    };
  }, [ready]);

  // ── Slow camera drift ────────────────────────────────────────────────────
  useEffect(() => {
    if (!ready) return;
    const map = mapRef.current;
    let angle = -8;
    let dir   = 1;
    const drift = setInterval(() => {
      angle += 0.008 * dir;
      if (angle > 0)   dir = -1;
      if (angle < -18) dir =  1;
      map.setBearing(angle);
    }, 50);
    return () => clearInterval(drift);
  }, [ready]);

  return (
    <div style={{ position: 'fixed', inset: 0, background: C.bg, overflow: 'hidden' }}>
      <style>{GLOBAL_CSS}</style>

      {/* ── MAP ─────────────────────────────────────────────────────────── */}
      <div ref={mapEl} style={{ position: 'absolute', inset: 0 }} />

      {/* ── PARTICLE CANVAS ─────────────────────────────────────────────── */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none',
          zIndex: 10,
          mixBlendMode: 'screen',
        }}
      />

      {/* ── ATMOSPHERIC VIGNETTE ────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 11,
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(5,8,18,0.65) 100%)',
      }} />

      {/* ── SCAN LINE ───────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg,transparent,rgba(45,226,230,0.06),transparent)',
        zIndex: 12, pointerEvents: 'none',
        animation: 'scanLine 8s linear infinite',
      }} />

      {/* ── TOP BAR ─────────────────────────────────────────────────────── */}
      <div className="slide-left" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40,
        height: 52,
        background: 'linear-gradient(90deg,rgba(11,16,32,0.98),rgba(11,16,32,0.92))',
        borderBottom: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px',
      }}>
        <button
          onClick={() => navigate('/maps')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 10, color: C.cyanDim, letterSpacing: '0.22em',
          }}
        >← ANIMATED MAPS</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <span style={{
            fontFamily: "'Orbitron',sans-serif", fontSize: 13,
            fontWeight: 700, color: C.cyan, letterSpacing: '0.25em',
          }}>KARACHI TRAFFIC</span>
          <span style={{
            fontFamily: "'Share Tech Mono',monospace", fontSize: 9,
            color: C.dim, letterSpacing: '0.18em',
          }}>FLUID DYNAMICS SYSTEM</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="live-blink" style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#FF3B3B', display: 'inline-block',
          }} />
          <span style={{
            fontFamily: "'Share Tech Mono',monospace", fontSize: 9,
            color: '#FF3B3B', letterSpacing: '0.18em',
          }}>LIVE</span>
        </div>
      </div>

      {/* ── LEFT PANEL ──────────────────────────────────────────────────── */}
      <div className="hud-in" style={{
        position: 'fixed', left: 20, top: 72, zIndex: 40,
        width: 210,
        animationDelay: '0.3s',
      }}>
        {/* City stats */}
        <div style={{
          background: C.panel, border: `1px solid ${C.border}`,
          padding: '14px 16px', marginBottom: 10,
        }}>
          <div style={{
            fontFamily: "'Share Tech Mono',monospace", fontSize: 8,
            color: C.cyanDim, letterSpacing: '0.28em', marginBottom: 12,
          }}>FLOW ANALYTICS</div>

          <StatRow label="FREEFLOW" value={stats.fast} total={ROAD_SEGMENTS.length} color={C.cyan} icon="▶" />
          <StatRow label="MODERATE" value={stats.moderate} total={ROAD_SEGMENTS.length} color={C.amber} icon="◆" />
          <StatRow label="CONGESTED" value={stats.congested} total={ROAD_SEGMENTS.length} color={C.red} icon="■" />

          <div style={{ height: 1, background: C.border, margin: '12px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, color: C.dimmer, letterSpacing: '0.18em' }}>AVG SPEED</span>
            <span className="glow-pulse" style={{
              fontFamily: "'Orbitron',sans-serif", fontSize: 22, fontWeight: 800,
              color: C.cyan, letterSpacing: '0.05em',
            }}>{stats.avg}<span style={{ fontSize: 9, marginLeft: 3 }}>km/h</span></span>
          </div>
        </div>

        {/* Legend */}
        <div style={{
          background: C.panel, border: `1px solid ${C.border}`,
          padding: '14px 16px',
        }}>
          <div style={{
            fontFamily: "'Share Tech Mono',monospace", fontSize: 8,
            color: C.cyanDim, letterSpacing: '0.28em', marginBottom: 12,
          }}>FLOW LEGEND</div>

          {[
            { label: 'FREEFLOW',   desc: '70+ km/h',   col: '#2DE2E6', glow: '#2DE2E6' },
            { label: 'MODERATE',   desc: '50–69 km/h', col: '#4FC3F7', glow: '#4FC3F7' },
            { label: 'SLOW',       desc: '30–49 km/h', col: '#FFB703', glow: '#FFB703' },
            { label: 'HEAVY',      desc: '15–29 km/h', col: '#FF7043', glow: '#FF7043' },
            { label: 'CONGESTED',  desc: '< 15 km/h',  col: '#FF3B3B', glow: '#FF3B3B' },
            { label: 'STANDSTILL', desc: '< 5 km/h',   col: '#A7B0C0', glow: '#A7B0C0' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
              <div style={{
                width: 28, height: 3, borderRadius: 2,
                background: `linear-gradient(90deg, transparent, ${item.col})`,
                boxShadow: `0 0 6px ${item.glow}80`,
              }} />
              <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 7.5, color: C.dim, letterSpacing: '0.12em', flex: 1 }}>{item.label}</span>
              <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 7, color: C.dimmer }}>{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL — Segments ───────────────────────────────────────── */}
      <div className="hud-in" style={{
        position: 'fixed', right: 20, top: 72, zIndex: 40,
        width: 220, maxHeight: 'calc(100vh - 140px)', overflowY: 'auto',
        animationDelay: '0.5s',
      }}>
        <div style={{
          background: C.panel, border: `1px solid ${C.border}`,
          padding: '14px 16px',
        }}>
          <div style={{
            fontFamily: "'Share Tech Mono',monospace", fontSize: 8,
            color: C.cyanDim, letterSpacing: '0.28em', marginBottom: 12,
          }}>ROAD SEGMENTS</div>

          {ROAD_SEGMENTS.map((seg, i) => {
            const col = getTrafficColor(seg.speed);
            const isHot = seg.congestion > 0.7;
            return (
              <div
                key={seg.id}
                onMouseEnter={() => setHoveredSeg(seg)}
                onMouseLeave={() => setHoveredSeg(null)}
                style={{
                  padding: '7px 0',
                  borderBottom: `1px solid rgba(45,226,230,0.07)`,
                  cursor: 'default',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                  <span style={{
                    fontFamily: "'Rajdhani',sans-serif", fontSize: 11, fontWeight: 600,
                    color: hoveredSeg?.id === seg.id ? col.primary : C.dim,
                    letterSpacing: '0.06em',
                    transition: 'color 0.2s',
                  }}>{seg.name}</span>
                  <span style={{
                    fontFamily: "'Orbitron',sans-serif", fontSize: 9,
                    color: col.primary, letterSpacing: '0.1em',
                    textShadow: `0 0 8px ${col.glow}`,
                  }}>{seg.speed}</span>
                </div>
                <div style={{ position: 'relative', height: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 1 }}>
                  <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    width: `${seg.speed}%`, borderRadius: 1,
                    background: `linear-gradient(90deg,${col.secondary},${col.primary})`,
                    boxShadow: `0 0 6px ${col.glow}60`,
                    transition: 'width 0.4s ease',
                  }} />
                </div>
                {isHot && (
                  <div style={{
                    fontFamily: "'Share Tech Mono',monospace", fontSize: 6.5,
                    color: '#FF3B3B', letterSpacing: '0.18em', marginTop: 2,
                    opacity: 0.8,
                  }}>● CONGESTION DETECTED</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── BOTTOM HUD ──────────────────────────────────────────────────── */}
      <div className="slide-left" style={{
        position: 'fixed', bottom: 20, left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 40, animationDelay: '0.7s',
      }}>
        <div style={{
          background: C.panel, border: `1px solid ${C.border}`,
          padding: '10px 28px', display: 'flex', alignItems: 'center', gap: 28,
        }}>
          {[
            { label: 'TOTAL SEGMENTS', value: ROAD_SEGMENTS.length },
            { label: 'PARTICLES',      value: PARTICLE_COUNT.toLocaleString() },
            { label: 'ZONES TRACKED',  value: TRAFFIC_ZONES.length },
            { label: 'UPDATE',         value: '60fps' },
          ].map(item => (
            <div key={item.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: "'Orbitron',sans-serif", fontSize: 14, fontWeight: 700,
                color: C.cyan, letterSpacing: '0.05em',
              }}>{item.value}</div>
              <div style={{
                fontFamily: "'Share Tech Mono',monospace", fontSize: 7,
                color: C.dimmer, letterSpacing: '0.18em', marginTop: 2,
              }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOVERED SEGMENT TOOLTIP ─────────────────────────────────────── */}
      {hoveredSeg && (() => {
        const col = getTrafficColor(hoveredSeg.speed);
        return (
          <div className="fade-up" style={{
            position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
            zIndex: 50,
            background: C.panel,
            border: `1px solid ${col.primary}80`,
            padding: '10px 20px',
            textAlign: 'center',
            boxShadow: `0 0 20px ${col.glow}30`,
          }}>
            <div style={{
              fontFamily: "'Orbitron',sans-serif", fontSize: 11, fontWeight: 700,
              color: col.primary, letterSpacing: '0.2em', marginBottom: 4,
              textShadow: `0 0 12px ${col.glow}`,
            }}>{hoveredSeg.name.toUpperCase()}</div>
            <div style={{ display: 'flex', gap: 18 }}>
              {[
                { l: 'SPEED',    v: `${hoveredSeg.speed} km/h` },
                { l: 'TYPE',     v: hoveredSeg.type.toUpperCase() },
                { l: 'FLOW',     v: `${Math.round((1 - hoveredSeg.congestion) * 100)}%` },
              ].map(d => (
                <div key={d.l}>
                  <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 7, color: C.dimmer, letterSpacing: '0.18em' }}>{d.l}</div>
                  <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 11, color: C.white }}>{d.v}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* ── RADAR widget ────────────────────────────────────────────────── */}
      <div className="hud-in" style={{
        position: 'fixed', bottom: 80, left: 20, zIndex: 40,
        animationDelay: '0.9s',
      }}>
        <div style={{
          background: C.panel, border: `1px solid ${C.border}`,
          padding: 12, width: 90, height: 90, position: 'relative',
          overflow: 'hidden',
        }}>
          <svg viewBox="0 0 80 80" width="66" height="66" style={{ position: 'absolute', inset: 0, margin: 'auto' }}>
            <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(45,226,230,0.1)" strokeWidth="0.5" />
            <circle cx="40" cy="40" r="22" fill="none" stroke="rgba(45,226,230,0.08)" strokeWidth="0.5" />
            <circle cx="40" cy="40" r="11" fill="none" stroke="rgba(45,226,230,0.06)" strokeWidth="0.5" />
            <line x1="40" y1="6" x2="40" y2="74" stroke="rgba(45,226,230,0.06)" strokeWidth="0.5" />
            <line x1="6" y1="40" x2="74" y2="40" stroke="rgba(45,226,230,0.06)" strokeWidth="0.5" />
            {/* Spinning sweep */}
            <g style={{ animation: 'radarSpin 3s linear infinite', transformOrigin: '40px 40px' }}>
              <path d="M40,40 L40,6" stroke={C.cyan} strokeWidth="1.5" opacity="0.9" />
              <path d="M40,40 L40,6" stroke={C.cyan} strokeWidth="12"
                opacity="0.0"
                style={{
                  transformBox: 'fill-box', transformOrigin: '50% 100%',
                  filter: 'blur(4px)',
                }}
              />
            </g>
            {/* Sweep cone using conic gradient overlay */}
            <circle cx="40" cy="40" r="34"
              fill="url(#radarGrad)"
              style={{ animation: 'radarSpin 3s linear infinite', transformOrigin: '40px 40px' }}
              opacity="0.6"
            />
            <defs>
              <radialGradient id="radarGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={C.cyan} stopOpacity="0" />
                <stop offset="100%" stopColor={C.cyan} stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* Blip dots */}
            {TRAFFIC_ZONES.slice(0, 5).map((z, i) => {
              const angle = (i / 5) * Math.PI * 2;
              const r = 14 + z.density * 16;
              return (
                <circle
                  key={z.id}
                  cx={40 + r * Math.cos(angle)} cy={40 + r * Math.sin(angle)}
                  r={1.5}
                  fill={z.density > 0.7 ? C.red : z.density < 0.35 ? C.cyan : C.amber}
                  opacity="0.8"
                  style={{ animation: `pulse 2s ${i * 0.4}s ease-in-out infinite` }}
                />
              );
            })}
          </svg>
          <div style={{
            position: 'absolute', bottom: 6, left: 0, right: 0,
            textAlign: 'center',
            fontFamily: "'Share Tech Mono',monospace", fontSize: 7,
            color: C.cyanDim, letterSpacing: '0.2em',
          }}>RADAR</div>
        </div>
      </div>

    </div>
  );
};

// ─── Sub-component: stat row ──────────────────────────────────────────────────
const StatRow = ({ label, value, total, color, icon }) => (
  <div style={{ marginBottom: 9 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{ color, fontSize: 8 }}>{icon}</span>
        <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, color: 'rgba(232,237,245,0.5)', letterSpacing: '0.16em' }}>{label}</span>
      </div>
      <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 11, fontWeight: 700, color, letterSpacing: '0.05em' }}>{value}</span>
    </div>
    <div style={{ height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 1 }}>
      <div style={{
        height: '100%', borderRadius: 1,
        width: `${(value / total) * 100}%`,
        background: color,
        boxShadow: `0 0 6px ${color}80`,
        transition: 'width 0.8s ease',
      }} />
    </div>
  </div>
);

// ─── Helper: hex color → rgba string ─────────────────────────────────────────
// Always produces "rgba(r,g,b,1)" so callers can do .replace(',1)', ',0.5)')
function hexToRgba(hex, alpha = 1) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default TrafficMap;