import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import mapboxgl from 'mapbox-gl'
import { CHAPTERS, MIGRATION_FLOWS, NESTING_BEACHES } from '@/data/turtleMap'

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Mono:wght@300;400&display=swap');

@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeOut {
  from { opacity: 1; }
  to   { opacity: 0; }
}
@keyframes breathe {
  0%,100% { opacity: 0.6; }
  50%      { opacity: 1; }
}
@keyframes shimmer {
  0%,100% { opacity: 0.4; transform: scaleX(0.8); }
  50%      { opacity: 0.9; transform: scaleX(1); }
}
@keyframes waveIn {
  from { opacity: 0; transform: translateX(-12px); }
  to   { opacity: 1; transform: translateX(0); }
}

.fade-up     { animation: fadeSlideUp 0.9s cubic-bezier(.22,1,.36,1) both; }
.breathe     { animation: breathe 4s ease-in-out infinite; }
.shimmer     { animation: shimmer 3s ease-in-out infinite; }
.wave-in     { animation: waveIn 0.7s cubic-bezier(.22,1,.36,1) both; }

.mapboxgl-ctrl-bottom-left,
.mapboxgl-ctrl-bottom-right,
.mapboxgl-ctrl-attrib { display: none !important; }
`

// ─── Palette — warm ocean, NOT dark ──────────────────────────────────────────
// Think: dawn light over Pacific. Aquamarine, warm sand, seafoam, soft coral.
const C = {
  bg:       '#D4EFE8',   // washed seafoam — main bg behind map
  panel:    'rgba(232, 246, 241, 0.92)', // frosted glass panel
  border:   'rgba(0, 100, 80, 0.15)',
  ink:      '#0D3D30',   // deep teal ink — readable but not black
  inkMid:   '#2D6B56',   // mid teal
  inkSoft:  '#5B9E88',   // soft teal
  accent:   '#00A878',   // vivid ocean green — CTA, highlights
  accentLt: '#4ECBA0',   // lighter accent
  sand:     '#F0E0C0',   // warm sand for threat/danger chapters
  coral:    '#D9624A',   // danger / threat accent
  gold:     '#C8960A',   // stat numerals
  white:    '#FAFCFB',
}

const CHAPTER_DURATION = 10000

// ─── Sub-components ───────────────────────────────────────────────────────────

const TurtleGlyph = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" className="breathe">
    <ellipse cx="16" cy="16" rx="9" ry="7" fill="none" stroke={C.accent} strokeWidth="1.8" />
    <ellipse cx="16" cy="16" rx="4.5" ry="3.5" fill={C.accent} opacity="0.35" />
    <line x1="8"  y1="13" x2="3"  y2="10" stroke={C.accent} strokeWidth="1.3" strokeLinecap="round" />
    <line x1="8"  y1="19" x2="3"  y2="22" stroke={C.accent} strokeWidth="1.3" strokeLinecap="round" />
    <line x1="24" y1="13" x2="29" y2="10" stroke={C.accent} strokeWidth="1.3" strokeLinecap="round" />
    <line x1="24" y1="19" x2="29" y2="22" stroke={C.accent} strokeWidth="1.3" strokeLinecap="round" />
    <ellipse cx="16" cy="22" rx="2.5" ry="4" fill="none" stroke={C.accent} strokeWidth="1" opacity="0.6" />
  </svg>
)

const ProgressBar = ({ progress, playing }) => (
  <div style={{
    position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
    height: 3, background: C.border,
  }}>
    <div style={{
      height: '100%',
      width: `${progress * 100}%`,
      background: `linear-gradient(90deg, ${C.accent}, ${C.accentLt})`,
      transition: playing ? 'none' : 'width 0.2s',
      borderRadius: '0 2px 2px 0',
    }} />
  </div>
)

const ChapterDots = ({ idx, total, onSelect }) => (
  <div style={{
    display: 'flex', gap: 6, alignItems: 'center',
  }}>
    {Array.from({ length: total }).map((_, i) => (
      <button
        key={i}
        onClick={e => { e.stopPropagation(); onSelect(i) }}
        style={{
          width: i === idx ? 20 : 7,
          height: 7,
          borderRadius: 4,
          background: i === idx ? C.accent : C.border,
          border: 'none', cursor: 'pointer',
          transition: 'all 0.3s ease',
          padding: 0,
        }}
      />
    ))}
  </div>
)

// ─── TurtleMap ────────────────────────────────────────────────────────────────
const TurtleMap = () => {
  const navigate     = useNavigate()
  const mapContainer = useRef(null)
  const mapRef       = useRef(null)
  const flowTimers   = useRef([])

  const [idx, setIdx]           = useState(0)
  const [mapReady, setMapReady] = useState(false)
  const [playing, setPlaying]   = useState(true)
  const [progress, setProgress] = useState(0)

  const chapter   = CHAPTERS[idx]
  const isThreat  = chapter?.type === 'threat'
  const chKey     = String(idx)

  // ── Map init ──
  useEffect(() => {
    if (mapRef.current) return
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',  // bright base map
      center: [0, 10],
      zoom: 1.6,
      projection: 'globe',
      attributionControl: false,
    })

    map.on('style.load', () => {
      // Warm, slightly golden atmosphere — not deep space
      map.setFog({
        color:          'rgb(210, 235, 228)',
        'high-color':   'rgb(180, 220, 210)',
        'horizon-blend': 0.05,
        'space-color':  'rgb(165, 200, 192)',
        'star-intensity': 0.1,
      })
    })

    map.on('load', () => {
      map.addSource('cb', { type: 'vector', url: 'mapbox://mapbox.country-boundaries-v1' })

      map.addLayer({
        id: 'country-highlight', type: 'fill', source: 'cb',
        'source-layer': 'country_boundaries',
        filter: ['in', 'iso_3166_1_alpha_3', 'AU', 'BR', 'US', 'ID', 'CR', 'MY'],
        paint: { 'fill-color': C.accent, 'fill-opacity': 0 },
      })

      MIGRATION_FLOWS.forEach(flow => {
        const coords = flow.coords || []
        map.addSource(`flow-${flow.id}`, {
          type: 'geojson',
          data: { type: 'Feature', geometry: { type: 'LineString', coordinates: coords } }
        })
        map.addLayer({
          id: `flow-glow-${flow.id}`, type: 'line', source: `flow-${flow.id}`,
          paint: { 'line-color': C.accent, 'line-width': 7, 'line-opacity': 0, 'line-blur': 5 }
        })
        map.addLayer({
          id: `flow-line-${flow.id}`, type: 'line', source: `flow-${flow.id}`,
          paint: { 'line-color': C.ink, 'line-width': 1.5, 'line-opacity': 0, 'line-dasharray': [4, 5] }
        })
        map.addSource(`turtle-${flow.id}`, {
          type: 'geojson',
          data: { type: 'Feature', geometry: { type: 'Point', coordinates: coords[0] || [0, 0] } }
        })
        map.addLayer({
          id: `turtle-dot-${flow.id}`, type: 'circle', source: `turtle-${flow.id}`,
          layout: { visibility: 'none' },
          paint: { 'circle-radius': 6, 'circle-color': C.accent, 'circle-opacity': 0.95, 'circle-blur': 0.2,
                   'circle-stroke-color': C.white, 'circle-stroke-width': 1.5, 'circle-stroke-opacity': 0.9 },
        })
      })

      NESTING_BEACHES.forEach(beach => {
        map.addSource(`beach-${beach.id}`, {
          type: 'geojson',
          data: { type: 'Feature', geometry: { type: 'Point', coordinates: beach.coords || [0, 0] } }
        })
        map.addLayer({
          id: `beach-ring-${beach.id}`, type: 'circle', source: `beach-${beach.id}`,
          paint: { 'circle-radius': 12, 'circle-color': 'transparent',
                   'circle-stroke-color': C.accent, 'circle-stroke-width': 1.5,
                   'circle-stroke-opacity': 0, 'circle-blur': 0 },
        })
        map.addLayer({
          id: `beach-dot-${beach.id}`, type: 'circle', source: `beach-${beach.id}`,
          paint: { 'circle-radius': 5, 'circle-color': C.accentLt, 'circle-opacity': 0,
                   'circle-stroke-color': C.accent, 'circle-stroke-width': 1.5,
                   'circle-stroke-opacity': 0 },
        })
      })

      mapRef.current = map
      setMapReady(true)
    })

    return () => { map.remove(); flowTimers.current.forEach(clearTimeout) }
  }, [])

  // ── Clear flows ──
  const clearFlows = useCallback(() => {
    flowTimers.current.forEach(clearTimeout)
    flowTimers.current = []
    const map = mapRef.current
    if (!map) return
    MIGRATION_FLOWS.forEach(f => {
      try { map.setPaintProperty(`flow-glow-${f.id}`, 'line-opacity', 0) } catch {}
      try { map.setPaintProperty(`flow-line-${f.id}`, 'line-opacity', 0) } catch {}
      try { map.setLayoutProperty(`turtle-dot-${f.id}`, 'visibility', 'none') } catch {}
    })
    NESTING_BEACHES.forEach(b => {
      try { map.setPaintProperty(`beach-ring-${b.id}`, 'circle-stroke-opacity', 0) } catch {}
      try { map.setPaintProperty(`beach-dot-${b.id}`, 'circle-opacity', 0) } catch {}
      try { map.setPaintProperty(`beach-dot-${b.id}`, 'circle-stroke-opacity', 0) } catch {}
    })
  }, [])

  // ── Animate turtle along flow ──
  const animateTurtle = useCallback((flowId, coords, startIdx, duration) => {
    if (!coords || coords.length < 2) return
    const STEP_MS = Math.round(duration / coords.length)
    let step = startIdx
    const walk = () => {
      const map = mapRef.current
      if (!map || step >= coords.length) return
      try { map.getSource(`turtle-${flowId}`)?.setData({ type: 'Feature', geometry: { type: 'Point', coordinates: coords[step] } }) } catch {}
      step++
      flowTimers.current.push(setTimeout(walk, STEP_MS))
    }
    walk()
  }, [])

  // ── Chapter change → map update ──
  useEffect(() => {
    if (!mapReady) return
    clearFlows()
    const map = mapRef.current
    const ch  = chapter
    const ANIM_DURATION = CHAPTER_DURATION - 1500

    const currentFlows = MIGRATION_FLOWS.filter(f => f.chapter === ch.id)
    currentFlows.forEach((flow, i) => {
      const t = setTimeout(() => {
        try {
          map.setPaintProperty(`flow-glow-${flow.id}`, 'line-opacity', 0.3)
          map.setPaintProperty(`flow-line-${flow.id}`, 'line-opacity', 0.9)
          map.setLayoutProperty(`turtle-dot-${flow.id}`, 'visibility', 'visible')
        } catch {}
        animateTurtle(flow.id, flow.coords || [], 0, ANIM_DURATION)
      }, i * 350)
      flowTimers.current.push(t)
    })

    const beachChapters = ['leatherback', 'loggerhead', 'green_turtle', 'hawksbill', 'flatback', 'hope']
    if (beachChapters.includes(ch.id)) {
      NESTING_BEACHES
        .filter(b => b.chapter === ch.id || ch.id === 'hope')
        .forEach((beach, i) => {
          const t = setTimeout(() => {
            try {
              map.setPaintProperty(`beach-ring-${beach.id}`, 'circle-stroke-opacity', 0.8)
              map.setPaintProperty(`beach-dot-${beach.id}`, 'circle-opacity', 1)
              map.setPaintProperty(`beach-dot-${beach.id}`, 'circle-stroke-opacity', 1)
            } catch {}
          }, i * 250)
          flowTimers.current.push(t)
        })
    }

    try { map.setPaintProperty('country-highlight', 'fill-opacity', ch.type === 'migration' ? 0.08 : 0) } catch {}

    const flyTargets = {
      intro:       [0, 10, 1.6],
      leatherback: [170, 15, 2],
      loggerhead:  [-40, 30, 2.2],
      green_turtle:[-25, -8, 3.2],
      hawksbill:   [-65, 15, 3.5],
      flatback:    [138, -16, 3.8],
      threats:     [0, 10, 1.6],
      hope:        [0, 10, 1.6],
    }
    const [cx, cy, cz] = flyTargets[ch.id] || [0, 10, 1.8]
    map.flyTo({ center: [cx, cy], zoom: cz, duration: 2000, essential: true })
  }, [idx, mapReady, clearFlows, animateTurtle])

  // ── Autoplay ──
  useEffect(() => {
    if (!playing) return
    const start = Date.now()
    setProgress(0)
    let raf
    const tick = () => {
      const pct = Math.min((Date.now() - start) / CHAPTER_DURATION, 1)
      setProgress(pct)
      if (pct < 1) raf = requestAnimationFrame(tick)
      else setIdx(i => (i + 1) % CHAPTERS.length)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, idx])

  // ── Keyboard ──
  useEffect(() => {
    const h = e => {
      if (e.key === 'ArrowRight') setIdx(i => (i + 1) % CHAPTERS.length)
      if (e.key === 'ArrowLeft')  setIdx(i => Math.max(0, i - 1))
      if (e.key === ' ') { e.preventDefault(); setPlaying(p => !p) }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: C.bg, overflow: 'hidden', cursor: 'pointer' }}
      onClick={() => setIdx(i => (i + 1) % CHAPTERS.length)}
    >
      <style>{CSS}</style>

      {/* Map */}
      <div ref={mapContainer} style={{ position: 'absolute', inset: 0 }} />

      {/* Soft vignette — keeps text legible without darkening */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
        background: 'radial-gradient(ellipse at center, transparent 55%, rgba(212,239,232,0.35) 100%)',
      }} />

      {/* ── TOP BAR ── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 28px',
        background: 'linear-gradient(180deg, rgba(212,239,232,0.95) 0%, transparent 100%)',
      }}>
        <button
          onClick={e => { e.stopPropagation(); navigate('/') }}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: "'DM Mono', monospace", fontSize: 9,
            color: C.inkSoft, letterSpacing: '0.2em',
          }}
        >
          ← ANIMATED MAPS
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <TurtleGlyph />
          <span style={{
            fontFamily: "'DM Mono', monospace", fontSize: 9,
            color: C.inkMid, letterSpacing: '0.2em', textTransform: 'uppercase',
          }}>
            WORLD TURTLE DAY · MAY 23
          </span>
        </div>

        <span style={{
          fontFamily: "'DM Mono', monospace", fontSize: 9,
          color: C.inkSoft, letterSpacing: '0.12em',
        }}>
          {idx + 1} / {CHAPTERS.length}
        </span>
      </div>

      {/* ── CHAPTER PANEL — bottom, frosted glass ── */}
      <div
        key={`panel-${chKey}`}
        className="fade-up"
        onClick={e => e.stopPropagation()}
        style={{
          position: 'fixed',
          bottom: 20, left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 30,
          width: 'calc(100% - 80px)',
          maxWidth: 680,
          background: C.panel,
          border: `1px solid ${C.border}`,
          borderRadius: 3,
          padding: '24px 28px 20px',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 4px 32px rgba(0,80,60,0.12), 0 1px 4px rgba(0,80,60,0.06)',
        }}
      >
        {/* Badge + nav row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 8, letterSpacing: '0.28em', textTransform: 'uppercase',
            color: isThreat ? C.coral : C.accent,
            background: isThreat ? `${C.coral}18` : `${C.accent}18`,
            border: `1px solid ${isThreat ? `${C.coral}40` : `${C.accent}40`}`,
            padding: '3px 9px', borderRadius: 2,
          }}>
            {chapter?.badge}
          </span>

          <ChapterDots idx={idx} total={CHAPTERS.length} onSelect={setIdx} />
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 26, fontWeight: 400,
          color: isThreat ? C.coral : C.ink,
          lineHeight: 1.2, margin: '0 0 8px',
          letterSpacing: '0.01em',
        }}>
          {chapter?.title}
        </h2>

        {/* Body */}
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 15, fontStyle: 'italic', fontWeight: 300,
          color: C.inkMid, lineHeight: 1.75, margin: '0 0 14px',
        }}>
          {chapter?.body?.slice(0, 180)}{(chapter?.body || '').length > 180 ? '…' : ''}
        </p>

        {/* Bottom row: stat + quote + controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          {/* Stat */}
          {chapter?.stat && (
            <div>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 38, fontWeight: 600, lineHeight: 1,
                color: isThreat ? C.coral : C.gold,
                letterSpacing: '-0.02em',
              }}>
                {chapter.stat?.toLocaleString?.() ?? chapter.stat}
              </div>
              <div style={{
                fontFamily: "'DM Mono', monospace", fontSize: 8,
                color: C.inkSoft, letterSpacing: '0.12em',
                marginTop: 3, maxWidth: 180,
              }}>
                {chapter.statLabel}
              </div>
            </div>
          )}

          {/* Quote snippet */}
          {chapter?.quote && (
            <div style={{
              maxWidth: 260, textAlign: 'right',
              borderLeft: `2px solid ${isThreat ? C.coral : C.accentLt}`,
              paddingLeft: 12, marginLeft: 16,
            }}>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 12, fontStyle: 'italic', fontWeight: 300,
                color: C.inkMid, lineHeight: 1.6, margin: '0 0 4px',
              }}>
                "{chapter.quote.slice(0, 80)}…"
              </p>
              <span style={{
                fontFamily: "'DM Mono', monospace", fontSize: 8,
                color: C.inkSoft, letterSpacing: '0.1em',
              }}>
                — {chapter.quoteAuthor}
              </span>
            </div>
          )}
        </div>

        {/* Controls row */}
        <div style={{
          marginTop: 16, paddingTop: 12,
          borderTop: `1px solid ${C.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{
            fontFamily: "'DM Mono', monospace", fontSize: 8,
            color: C.inkSoft, letterSpacing: '0.14em',
          }}>
            CLICK MAP · ← → · SPACE TO PAUSE
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={e => { e.stopPropagation(); setIdx(i => Math.max(0, i - 1)) }}
              style={{
                background: 'none', border: `1px solid ${C.border}`, cursor: 'pointer',
                fontFamily: "'DM Mono', monospace", fontSize: 11,
                color: C.inkSoft, padding: '4px 12px', borderRadius: 2,
              }}
            >
              ←
            </button>
            <button
              onClick={e => { e.stopPropagation(); setPlaying(p => !p) }}
              style={{
                background: playing ? C.accent : 'none',
                border: `1px solid ${playing ? C.accent : C.border}`,
                cursor: 'pointer',
                fontFamily: "'DM Mono', monospace", fontSize: 8,
                color: playing ? C.white : C.inkSoft,
                padding: '4px 14px', borderRadius: 2,
                letterSpacing: '0.12em',
              }}
            >
              {playing ? '⏸ PAUSE' : '▶ PLAY'}
            </button>
            <button
              onClick={e => { e.stopPropagation(); setIdx(i => (i + 1) % CHAPTERS.length) }}
              style={{
                background: 'none', border: `1px solid ${C.border}`, cursor: 'pointer',
                fontFamily: "'DM Mono', monospace", fontSize: 11,
                color: C.inkSoft, padding: '4px 12px', borderRadius: 2,
              }}
            >
              →
            </button>
          </div>
        </div>
      </div>

      <ProgressBar progress={progress} playing={playing} />
    </div>
  )
}

export default TurtleMap