import { useEffect, useRef, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import { Link } from 'react-router-dom'
import { CHAPTERS, CHAGAI_SITE, POKHRAN_SITE, SEISMIC_EVENTS, CHAPTER_DURATION } from '@/data/chagaiMap'

// ─── Keyframes injected once ─────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Mono:wght@300;400;500&family=Lato:wght@300;400;700&display=swap');

  @keyframes shockwave {
    0%   { r: 0px; opacity: 0.8; stroke-width: 2.5; }
    100% { r: 180px; opacity: 0; stroke-width: 0.3; }
  }
  @keyframes shockwave2 {
    0%   { r: 0px; opacity: 0.6; stroke-width: 2; }
    100% { r: 240px; opacity: 0; stroke-width: 0.2; }
  }
  @keyframes shockwave3 {
    0%   { r: 0px; opacity: 0.35; stroke-width: 1.5; }
    100% { r: 300px; opacity: 0; stroke-width: 0.1; }
  }
  @keyframes pkhranPulse {
    0%   { r: 4px; opacity: 0.9; }
    50%  { r: 14px; opacity: 0.15; }
    100% { r: 4px; opacity: 0.9; }
  }
  @keyframes chagaiPulse {
    0%   { r: 5px; opacity: 1; }
    50%  { r: 16px; opacity: 0.1; }
    100% { r: 5px; opacity: 1; }
  }
  @keyframes stampIn {
    0%   { opacity: 0; transform: scale(1.08); }
    100% { opacity: 1; transform: scale(1); }
  }
  @keyframes fadeUp {
    0%   { opacity: 0; transform: translateY(12px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes seismoReveal {
    0%  { clip-path: inset(0 100% 0 0); }
    100%{ clip-path: inset(0 0% 0 0); }
  }
  @keyframes counterTick {
    0%   { transform: translateY(8px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }
  @keyframes scanline {
    0%   { top: -2px; }
    100% { top: 100%; }
  }
  @keyframes redactorBlink {
    0%,49%  { opacity: 1; }
    50%,100% { opacity: 0; }
  }

  .chagai-stamp {
    animation: stampIn 0.4s cubic-bezier(0.22,1,0.36,1) both;
  }
  .chagai-fadeup {
    animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }
  .chagai-body-line {
    animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }
`

// ─── Seismograph SVG component ────────────────────────────────────────────────
const Seismograph = ({ activeChapter }) => {
  const W = 700
  const MID = 28
  const events = SEISMIC_EVENTS

  // Build the baseline with spikes
  const buildPath = () => {
    let d = `M 0 ${MID}`
    events.forEach(ev => {
      const x = ev.x * W
      const h = ev.intensity * 22
      d += ` L ${x - 6} ${MID}`
      d += ` L ${x - 2} ${MID + h * 0.3}`
      d += ` L ${x} ${MID - h}`
      d += ` L ${x + 2} ${MID + h * 0.3}`
      d += ` L ${x + 6} ${MID}`
    })
    d += ` L ${W} ${MID}`
    return d
  }

  return (
    <svg
      width="100%" height="56"
      viewBox={`0 0 ${W} 56`}
      style={{ display: 'block', overflow: 'visible' }}
    >
      {/* Baseline grid ticks */}
      {Array.from({ length: 40 }, (_, i) => (
        <line
          key={i}
          x1={i * (W / 40)} y1={MID - 3}
          x2={i * (W / 40)} y2={MID + 3}
          stroke="#c8bfb0" strokeWidth="0.4"
        />
      ))}

      {/* Flat baseline */}
      <line x1="0" y1={MID} x2={W} y2={MID} stroke="#c8bfb0" strokeWidth="0.6" />

      {/* The waveform */}
      <path
        d={buildPath()}
        fill="none"
        stroke="#1a1814"
        strokeWidth="1.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Coloured spike overlays */}
      {events.map((ev, i) => {
        const x = ev.x * W
        const h = ev.intensity * 22
        return (
          <path
            key={i}
            d={`M ${x - 6} ${MID} L ${x - 2} ${MID + h * 0.3} L ${x} ${MID - h} L ${x + 2} ${MID + h * 0.3} L ${x + 6} ${MID}`}
            fill="none"
            stroke={ev.color}
            strokeWidth="2"
            strokeLinejoin="round"
          />
        )
      })}

      {/* Event date labels */}
      {events.map((ev, i) => (
        <g key={i}>
          <text
            x={ev.x * W}
            y="52"
            textAnchor="middle"
            fontFamily="'DM Mono', monospace"
            fontSize="7"
            fill={ev.color}
            letterSpacing="0.08em"
          >
            {ev.date}
          </text>
          <text
            x={ev.x * W}
            y="8"
            textAnchor="middle"
            fontFamily="'DM Mono', monospace"
            fontSize="6.5"
            fill={ev.color}
            opacity="0.7"
            letterSpacing="0.05em"
          >
            {ev.label}
          </text>
        </g>
      ))}

      {/* 17-day gap label */}
      <text
        x={(0.20 + (0.72 - 0.20) / 2) * W}
        y="52"
        textAnchor="middle"
        fontFamily="'DM Mono', monospace"
        fontSize="7"
        fill="#9a9088"
        letterSpacing="0.12em"
      >
        ── 17 DAYS ──
      </text>
    </svg>
  )
}

// ─── Shockwave SVG overlay ───────────────────────────────────────────────────
const ShockwaveOverlay = ({ visible, chagaiScreenPos }) => {
  if (!visible || !chagaiScreenPos) return null
  const { x, y } = chagaiScreenPos
  return (
    <svg
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 8,
        overflow: 'visible',
      }}
    >
      <circle
        cx={x} cy={y}
        r="0"
        fill="none"
        stroke="#C9B88A"
        style={{ animation: 'shockwave 2.8s ease-out infinite' }}
      />
      <circle
        cx={x} cy={y}
        r="0"
        fill="none"
        stroke="#C9B88A"
        style={{ animation: 'shockwave2 2.8s ease-out 0.6s infinite' }}
      />
      <circle
        cx={x} cy={y}
        r="0"
        fill="none"
        stroke="#C9B88A"
        style={{ animation: 'shockwave3 2.8s ease-out 1.2s infinite' }}
      />
    </svg>
  )
}

// ─── Animated counter ────────────────────────────────────────────────────────
const useCounter = (target, active) => {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) { setVal(0); return }
    let start = null
    const duration = 1200
    const step = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setVal(Math.round(ease * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, active])
  return val
}

// ─── Main component ──────────────────────────────────────────────────────────
const ChagaiMap = () => {
  const mapEl = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])
  const animRef = useRef(null)
  const [chapter, setChapter] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [loaded, setLoaded] = useState(false)
  const [chagaiScreenPos, setChagaiScreenPos] = useState(null)
  const chapterRef = useRef(0)
  const playingRef = useRef(true)
  const FILL_LAYER = 'country-fills-chagai'
  const FILL_SOURCE = 'country-boundaries-chagai'

  const ch = CHAPTERS[chapter]
  const statVal = useCounter(ch.stat.value, loaded)

  // ── Update screen position of Chagai for shockwave overlay ──
  const updateChagaiScreenPos = useCallback(() => {
    const map = mapRef.current
    if (!map) return
    const pos = map.project(CHAGAI_SITE)
    setChagaiScreenPos({ x: pos.x, y: pos.y })
  }, [])

  // ── Apply chapter to map ──────────────────────────────────────────────────
  const applyChapter = useCallback((map, ch) => {
    if (!map.getLayer(FILL_LAYER)) return
    const fillExpr = ['match', ['get', 'iso_3166_1']]
    ch.fills.forEach(f => { fillExpr.push(f.iso, f.color) })
    fillExpr.push('rgba(0,0,0,0)')
    const opacityExpr = ['match', ['get', 'iso_3166_1']]
    ch.fills.forEach(f => { opacityExpr.push(f.iso, f.opacity) })
    opacityExpr.push(0)
    map.setPaintProperty(FILL_LAYER, 'fill-color', fillExpr)
    map.setPaintProperty(FILL_LAYER, 'fill-opacity', opacityExpr)
    map.flyTo({
      center: ch.focus.center,
      zoom: ch.focus.zoom,
      duration: 2200,
      essential: true,
    })
    setTimeout(updateChagaiScreenPos, 2400)
  }, [updateChagaiScreenPos])

  // ── Auto-play ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return
    if (animRef.current) clearTimeout(animRef.current)
    if (!playingRef.current) return
    animRef.current = setTimeout(() => {
      if (!playingRef.current) return
      const next = (chapterRef.current + 1) % CHAPTERS.length
      chapterRef.current = next
      setChapter(next)
    }, CHAPTER_DURATION)
    return () => clearTimeout(animRef.current)
  }, [chapter, loaded])

  useEffect(() => {
    if (!loaded || !mapRef.current) return
    applyChapter(mapRef.current, CHAPTERS[chapter])
  }, [chapter, loaded, applyChapter])

  const goTo = (idx) => {
    chapterRef.current = idx
    setChapter(idx)
    if (animRef.current) clearTimeout(animRef.current)
  }

  const togglePlay = () => {
    const next = !playingRef.current
    playingRef.current = next
    setPlaying(next)
    if (next && loaded) {
      animRef.current = setTimeout(() => {
        const nx = (chapterRef.current + 1) % CHAPTERS.length
        chapterRef.current = nx
        setChapter(nx)
      }, CHAPTER_DURATION)
    } else {
      clearTimeout(animRef.current)
    }
  }

  // ── Map init ──────────────────────────────────────────────────────────────
  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN
    const map = new mapboxgl.Map({
      container: mapEl.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: CHAPTERS[0].focus.center,
      zoom: CHAPTERS[0].focus.zoom,
      projection: 'mercator',
      attributionControl: false,
      minZoom: 3,
      maxZoom: 10,
    })
    mapRef.current = map

    map.on('style.load', () => {
      // ── Bleach & remap the light style ──
      map.getStyle().layers.forEach(l => {
        try {
          if (l.id === 'background') map.setPaintProperty(l.id, 'background-color', '#F4F0E8')
          if (l.id.includes('water') && l.type === 'fill') map.setPaintProperty(l.id, 'fill-color', '#DDE8EE')
          if (l.id.includes('road') && l.type === 'line') {
            map.setPaintProperty(l.id, 'line-color', '#e0d8cc')
            map.setPaintProperty(l.id, 'line-opacity', 0.3)
          }
          if (l.type === 'symbol') {
            map.setPaintProperty(l.id, 'text-color', '#8a8075')
            map.setPaintProperty(l.id, 'text-halo-color', '#F4F0E8')
            map.setPaintProperty(l.id, 'text-opacity', 0.4)
          }
          if (l.id.includes('admin') && l.type === 'line') {
            map.setPaintProperty(l.id, 'line-color', '#c0b8a8')
            map.setPaintProperty(l.id, 'line-opacity', 0.5)
          }
        } catch {}
      })

      // ── Country fill source + layer ──
      map.addSource(FILL_SOURCE, {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1',
      })
      map.addLayer({
        id: FILL_LAYER,
        type: 'fill',
        source: FILL_SOURCE,
        'source-layer': 'country_boundaries',
        paint: {
          'fill-color': 'rgba(0,0,0,0)',
          'fill-opacity': 0,
        },
      })

      // ── Chagai marker (gold dot) ──
      const chagaiEl = document.createElement('div')
      chagaiEl.innerHTML = `
        <svg width="40" height="40" viewBox="0 0 40 40" overflow="visible">
          <circle cx="20" cy="20" r="5" fill="#C9B88A"/>
          <circle cx="20" cy="20" r="5" fill="none" stroke="#C9B88A" stroke-width="1.2"
            style="animation: chagaiPulse 2s ease-in-out infinite"/>
          <line x1="20" y1="4" x2="20" y2="36" stroke="#C9B88A" stroke-width="0.5" opacity="0.35"/>
          <line x1="4" y1="20" x2="36" y2="20" stroke="#C9B88A" stroke-width="0.5" opacity="0.35"/>
        </svg>
      `
      chagaiEl.style.cssText = 'width:40px;height:40px;cursor:default;'
      new mapboxgl.Marker({ element: chagaiEl, anchor: 'center' })
        .setLngLat(CHAGAI_SITE)
        .addTo(map)
      markersRef.current.push(chagaiEl)

      // ── Pokhran marker (red dot) ──
      const pokhranEl = document.createElement('div')
      pokhranEl.innerHTML = `
        <svg width="28" height="28" viewBox="0 0 28 28" overflow="visible">
          <circle cx="14" cy="14" r="4" fill="#8B1A1A"/>
          <circle cx="14" cy="14" r="4" fill="none" stroke="#8B1A1A" stroke-width="1"
            style="animation: pkhranPulse 2.5s ease-in-out infinite"/>
        </svg>
      `
      pokhranEl.style.cssText = 'width:28px;height:28px;cursor:default;'
      new mapboxgl.Marker({ element: pokhranEl, anchor: 'center' })
        .setLngLat(POKHRAN_SITE)
        .addTo(map)

      // Apply first chapter
      applyChapter(map, CHAPTERS[0])
      setLoaded(true)
      updateChagaiScreenPos()
    })

    map.on('move', updateChagaiScreenPos)

    return () => {
      clearTimeout(animRef.current)
      map.remove()
    }
  }, [])

  const key = `ch-${chapter}`

  // ── Styles ────────────────────────────────────────────────────────────────
  const S = {
    root: {
      position: 'fixed', inset: 0,
      background: '#F4F0E8',
      fontFamily: "'Lato', sans-serif",
      color: '#1a1814',
      overflow: 'hidden',
    },
    map: { position: 'absolute', inset: 0 },

    // ── TOP BAR ──
    topBar: {
      position: 'absolute',
      top: 0, left: 0, right: 0,
      height: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      background: 'rgba(244,240,232,0.92)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid rgba(26,24,20,0.12)',
      zIndex: 20,
    },
    topBarLeft: {
      display: 'flex', alignItems: 'center', gap: 20,
    },
    topBarLogoLink: {
      fontFamily: "'DM Mono', monospace",
      fontSize: 10, letterSpacing: '0.18em',
      color: '#1a1814', textDecoration: 'none',
      opacity: 0.6,
    },
    topBarTitle: {
      fontFamily: "'DM Mono', monospace",
      fontSize: 10, letterSpacing: '0.14em',
      color: '#1a1814', opacity: 0.85,
    },
    topBarRight: {
      fontFamily: "'DM Mono', monospace",
      fontSize: 9, letterSpacing: '0.14em',
      color: '#8a8075',
    },

    // ── STAMP (top-left floating) ──
    stamp: {
      position: 'absolute',
      top: 60, left: 28,
      zIndex: 15,
      pointerEvents: 'none',
    },
    stampBox: {
      display: 'inline-block',
      border: '1.5px solid #1a1814',
      padding: '3px 10px',
      fontFamily: "'DM Mono', monospace",
      fontSize: 9, letterSpacing: '0.22em',
      color: '#1a1814',
      background: 'rgba(244,240,232,0.85)',
    },

    // ── CHAPTER OVERLAY — right side ──
    chapterPanel: {
      position: 'absolute',
      top: 60, right: 28,
      width: 320,
      zIndex: 15,
      pointerEvents: 'none',
    },
    chYear: {
      fontFamily: "'DM Mono', monospace",
      fontSize: 9, letterSpacing: '0.18em',
      color: '#8a8075',
      marginBottom: 6,
    },
    chTitle: {
      fontFamily: "'Playfair Display', serif",
      fontSize: 32, fontWeight: 700, lineHeight: 1.05,
      color: '#1a1814',
      margin: '0 0 4px',
    },
    chSub: {
      fontFamily: "'Lato', sans-serif",
      fontSize: 12, color: '#5a5450',
      lineHeight: 1.4,
      margin: '0 0 14px',
      fontStyle: 'italic',
    },
    chRule: {
      border: 'none',
      borderTop: '1px solid rgba(26,24,20,0.18)',
      margin: '0 0 12px',
    },
    chBody: {
      fontFamily: "'Lato', sans-serif",
      fontSize: 12, lineHeight: 1.65,
      color: '#3a3530',
      margin: '0 0 14px',
    },
    chQuote: {
      borderLeft: '2px solid #1a1814',
      paddingLeft: 12,
      margin: '0 0 14px',
      background: 'rgba(26,24,20,0.03)',
      padding: '8px 12px',
    },
    chQuoteText: {
      fontFamily: "'Playfair Display', serif",
      fontSize: 11, fontStyle: 'italic',
      color: '#4a4440',
      lineHeight: 1.55,
      display: 'block',
    },
    chQuoteAuthor: {
      fontFamily: "'DM Mono', monospace",
      fontSize: 9, letterSpacing: '0.1em',
      color: '#8a8075',
      display: 'block',
      marginTop: 5,
    },

    // ── STAT BLOCK ──
    statBlock: {
      display: 'inline-block',
      background: '#1a1814',
      padding: '10px 18px',
      marginTop: 4,
    },
    statVal: {
      fontFamily: "'Playfair Display', serif",
      fontSize: 36, fontWeight: 900,
      color: '#F4F0E8',
      display: 'block',
      lineHeight: 1,
    },
    statLabel: {
      fontFamily: "'DM Mono', monospace",
      fontSize: 8, letterSpacing: '0.18em',
      color: '#C9B88A',
      display: 'block',
      marginTop: 3,
    },

    // ── CHAPTER NAV ──
    chapterNav: {
      position: 'absolute',
      bottom: 110,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      zIndex: 20,
    },
    chapterDot: (i) => ({
      width: i === chapter ? 28 : 8,
      height: 8,
      borderRadius: 4,
      background: i === chapter ? '#1a1814' : 'rgba(26,24,20,0.2)',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      transition: 'all 0.35s ease',
    }),

    // ── BOTTOM SEISMOGRAPH ──
    seismoBar: {
      position: 'absolute',
      bottom: 0, left: 0, right: 0,
      height: 88,
      background: 'rgba(244,240,232,0.94)',
      backdropFilter: 'blur(8px)',
      borderTop: '1px solid rgba(26,24,20,0.12)',
      zIndex: 20,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 28px',
    },
    seismoLabel: {
      fontFamily: "'DM Mono', monospace",
      fontSize: 8, letterSpacing: '0.22em',
      color: '#8a8075',
      marginBottom: 6,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    playBtn: {
      background: 'none',
      border: '1px solid rgba(26,24,20,0.25)',
      padding: '3px 10px',
      fontFamily: "'DM Mono', monospace",
      fontSize: 8, letterSpacing: '0.14em',
      color: '#1a1814',
      cursor: 'pointer',
    },

    // ── POKHRAN LABEL ──
    siteLabel: (side) => ({
      position: 'absolute',
      top: 60,
      ...(side === 'left' ? { left: 28 } : { right: 28 }),
      zIndex: 14,
    }),

    // ── DETONATION FLASH ──
    detonFlash: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(201,184,138,0.06)',
      zIndex: 7,
      pointerEvents: 'none',
      animation: chapter === 3 ? 'stampIn 0.3s ease' : 'none',
    },
  }

  return (
    <div style={S.root}>
      <style>{CSS}</style>

      {/* Map */}
      <div ref={mapEl} style={S.map} />

      {/* Shockwave overlay */}
      <ShockwaveOverlay
        visible={ch.shockwave && loaded}
        chagaiScreenPos={chagaiScreenPos}
      />

      {/* Detonation flash tint */}
      {ch.type === 'detonation' && <div style={S.detonFlash} />}

      {/* ── TOP BAR ── */}
      <div style={S.topBar}>
        <div style={S.topBarLeft}>
          <Link to="/maps" style={S.topBarLogoLink}>← ANIMATEDMAPS</Link>
          <span style={{ width: 1, height: 16, background: 'rgba(26,24,20,0.15)', display: 'inline-block' }} />
          <span style={S.topBarTitle}>NUCLEAR HISTORY · SOUTH ASIA</span>
        </div>
        <span style={S.topBarRight}>CHAGAI · BALOCHISTAN · PAKISTAN</span>
      </div>

      {/* ── STAMP — top left ── */}
      <div style={S.stamp}>
        <div key={`stamp-${chapter}`} className="chagai-stamp">
          <div style={S.stampBox}>
            {ch.stamp}
          </div>
          {/* Declassified watermark only on ch 0 */}
          {chapter === 0 && (
            <div style={{
              marginTop: 8,
              fontFamily: "'DM Mono', monospace",
              fontSize: 8, letterSpacing: '0.3em',
              color: 'rgba(26,24,20,0.3)',
              textTransform: 'uppercase',
            }}>
              CLASSIFIED · DO NOT DISTRIBUTE
            </div>
          )}
        </div>
      </div>

      {/* ── CHAPTER PANEL — right ── */}
      <div style={S.chapterPanel}>
        <div key={key}>
          <p style={{ ...S.chYear, animationDelay: '0ms' }} className="chagai-fadeup">
            {ch.year}
          </p>
          <h1 style={{ ...S.chTitle, animationDelay: '60ms' }} className="chagai-fadeup">
            {ch.title}
          </h1>
          <p style={{ ...S.chSub, animationDelay: '120ms' }} className="chagai-fadeup">
            {ch.subtitle}
          </p>
          <hr style={S.chRule} />
          <p style={{ ...S.chBody, animationDelay: '180ms' }} className="chagai-body-line">
            {ch.body}
          </p>
          <div style={{ ...S.chQuote, animationDelay: '240ms' }} className="chagai-fadeup">
            <span style={S.chQuoteText}>"{ch.quote}"</span>
            <span style={S.chQuoteAuthor}>— {ch.quoteAuthor}</span>
          </div>
          <div style={S.statBlock} className="chagai-stamp">
            <span style={S.statVal}>{statVal.toLocaleString()}</span>
            <span style={S.statLabel}>{ch.stat.label}</span>
          </div>
        </div>
      </div>

      {/* ── CHAPTER DOTS ── */}
      <div style={S.chapterNav}>
        {CHAPTERS.map((_, i) => (
          <button key={i} style={S.chapterDot(i)} onClick={() => goTo(i)} />
        ))}
      </div>

      {/* ── SEISMOGRAPH BAR ── */}
      <div style={S.seismoBar}>
        <div style={S.seismoLabel}>
          <span>SEISMIC RECORD · MAY 1998 · SOUTH ASIA</span>
          <button style={S.playBtn} onClick={togglePlay}>
            {playing ? '⏸ PAUSE' : '▶ PLAY'}
          </button>
        </div>
        <Seismograph activeChapter={chapter} />
      </div>
    </div>
  )
}

export default ChagaiMap