import { useEffect, useRef, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import { Link } from 'react-router-dom'
import { CHAPTERS } from '@/data/partitionMap'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

// ─── Tokens ───────────────────────────────────────────────────────────────────

const ASH   = '#1a1410'
const BONE  = '#F0E6D4'
const BLOOD = '#7a0f0f'

const CHAPTER_MOODS = {
  one_land:       { overlay: 'rgba(40,32,20,0.3)',  accent: '#C9A080' },
  the_line:       { overlay: 'rgba(60,15,15,0.4)',  accent: '#aa3333' },
  punjab_burns:   { overlay: 'rgba(80,10,10,0.55)', accent: '#cc2222' },
  great_crossing: { overlay: 'rgba(50,25,10,0.45)', accent: '#C9A080' },
  bengal_divides: { overlay: 'rgba(30,40,50,0.4)',  accent: '#7a9aa0' },
  the_missing:    { overlay: 'rgba(20,20,20,0.6)',  accent: '#888888' },
  two_nations:    { overlay: 'rgba(10,10,10,0.15)', accent: '#C9A080' },
}

// Approximate bounding polygon for the Punjab region (covers both sides of the border)
const PUNJAB_POLYGON = {
  type: 'Feature',
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [69.5, 27.5], [77.5, 27.5],
      [77.5, 34.5], [69.5, 34.5],
      [69.5, 27.5]
    ]]
  }
}

// Approximate bounding polygon for Bengal region
const BENGAL_POLYGON = {
  type: 'Feature',
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [85.5, 21.0], [93.5, 21.0],
      [93.5, 27.5], [85.5, 27.5],
      [85.5, 21.0]
    ]]
  }
}

// ─── Global styles ────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,200;0,300;0,400;1,200;1,300;1,400&family=DM+Mono:wght@300;400&family=Noto+Nastaliq+Urdu:wght@400;700&display=swap');

@keyframes verseBloom {
  0%   { opacity: 0; letter-spacing: 0.5em; filter: blur(6px); }
  55%  { filter: blur(0); }
  100% { opacity: 1; letter-spacing: 0.02em; }
}
@keyframes verseRise {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0);    }
}
@keyframes infoSlide {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0);    }
}
@keyframes floatPulse {
  0%, 100% { transform: translateY(0px);  }
  50%       { transform: translateY(-5px); }
}
@keyframes breathe {
  0%, 100% { opacity: 0.04; }
  50%       { opacity: 0.09; }
}
@keyframes veilFade {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes bodyDrift {
  from { opacity: 0; transform: translateX(8px); }
  to   { opacity: 1; transform: translateX(0);   }
}
@keyframes bloodDrip {
  from { transform: scaleY(0); transform-origin: top; }
  to   { transform: scaleY(1); transform-origin: top; }
}

.verse-bloom  { animation: verseBloom  1.5s cubic-bezier(0.22, 1, 0.36, 1) both; }
.verse-rise   { animation: verseRise   1.1s cubic-bezier(0.22, 1, 0.36, 1) both; }
.info-slide   { animation: infoSlide   0.9s cubic-bezier(0.22, 1, 0.36, 1) both; }
.float-pulse  { animation: floatPulse  6s   ease-in-out infinite; }
.veil-fade    { animation: veilFade    0.8s ease both; }
.body-drift   { animation: bodyDrift   1.0s cubic-bezier(0.22, 1, 0.36, 1) both; }
.blood-drip   { animation: bloodDrip   1.2s cubic-bezier(0.22, 1, 0.36, 1) both; }

.mapboxgl-ctrl-bottom-left,
.mapboxgl-ctrl-bottom-right,
.mapboxgl-ctrl-attrib     { display: none !important; }
.mapboxgl-popup-content   { background: transparent !important; border: none !important; box-shadow: none !important; padding: 0 !important; }
.mapboxgl-popup-tip       { display: none !important; }
`

// ─── MoodVeil ─────────────────────────────────────────────────────────────────

const MoodVeil = ({ mood, idx }) => (
  <div
    className="veil-fade"
    key={`veil-${idx}`}
    style={{
      position: 'absolute', inset: 0,
      pointerEvents: 'none', zIndex: 2,
      background: mood.overlay,
    }}
  />
)

// ─── GhostNumber ─────────────────────────────────────────────────────────────

const GhostNumber = ({ idx }) => (
  <div
    key={`ghost-${idx}`}
    style={{
      position: 'fixed', top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      fontFamily: "'Crimson Pro', serif",
      fontSize: 'clamp(160px, 26vw, 320px)',
      fontWeight: 200, fontStyle: 'italic',
      color: 'rgba(201,160,128,0.04)',
      lineHeight: 1, pointerEvents: 'none', zIndex: 2,
      userSelect: 'none',
      animation: 'breathe 8s ease-in-out infinite',
    }}
  >
    {String(idx + 1).padStart(2, '0')}
  </div>
)

// ─── TopNav ───────────────────────────────────────────────────────────────────

const TopNav = ({ idx, total }) => (
  <div style={{
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40,
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    padding: '22px 32px',
    pointerEvents: 'none',
  }}>
    <Link
      to="/maps"
      onClick={e => e.stopPropagation()}
      style={{
        fontFamily: "'DM Mono', monospace", fontSize: 9,
        color: 'rgba(240,230,210,0.35)', letterSpacing: '0.2em',
        textDecoration: 'none', pointerEvents: 'all',
        transition: 'color 0.2s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.color = 'rgba(240,230,210,0.65)' }}
      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(240,230,210,0.35)' }}
    >
      ← ANIMATED MAPS
    </Link>
    <div style={{
      fontFamily: "'DM Mono', monospace", fontSize: 9,
      color: 'rgba(240,230,210,0.25)', letterSpacing: '0.16em',
      textAlign: 'right',
    }}>
      <div>1947 PARTITION</div>
      <div style={{ marginTop: 3 }}>{idx + 1} / {total}</div>
    </div>
  </div>
)

// ─── PoetryVerse ─────────────────────────────────────────────────────────────
// Anchored to left side so the map centre stays clear

const PoetryVerse = ({ chapter, mood, idx }) => {
  const q = chapter.quote
  if (!q) return null

  return (
    <div
      key={`verse-${idx}`}
      style={{
        position: 'fixed',
        top: '50%',
        left: 32,
        transform: 'translateY(-50%)',
        zIndex: 20,
        textAlign: 'left',
        pointerEvents: 'none',
        maxWidth: 320,
        width: '30vw',
        minWidth: 200,
        padding: '0 0 0 0',
      }}
    >
      {/* Urdu / script original */}
      {q.original && (
        <div
          className="verse-bloom float-pulse"
          style={{
            fontFamily: "'Noto Nastaliq Urdu', serif",
            fontSize: 22,
            color: BONE,
            lineHeight: 1.85,
            direction: 'rtl',
            textShadow: '0 2px 24px rgba(0,0,0,0.85)',
            marginBottom: 12,
            opacity: 0.9,
            animationDelay: '0s, 1.6s',
          }}
        >
          {q.original}
        </div>
      )}

      {/* Translation */}
      <div
        className="verse-rise"
        style={{
          fontFamily: "'Crimson Pro', serif",
          fontSize: 16,
          fontStyle: 'italic',
          fontWeight: 300,
          color: 'rgba(240,225,200,0.75)',
          lineHeight: 1.65,
          letterSpacing: '0.02em',
          textShadow: '0 2px 18px rgba(0,0,0,0.8)',
          marginBottom: 7,
          whiteSpace: 'pre-line',
          animationDelay: q.original ? '0.45s' : '0s',
        }}
      >
        {q.translation || q.text}
      </div>

      {/* Attribution */}
      <div
        className="verse-rise"
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 9,
          letterSpacing: '0.18em',
          color: mood.accent,
          opacity: 0.7,
          animationDelay: q.original ? '0.8s' : '0.25s',
        }}
      >
        {q.attribution || (q.author && `— ${q.author}`)}
      </div>
    </div>
  )
}

// ─── ChapterInfo ─────────────────────────────────────────────────────────────
// Anchored bottom-left so the map stays unobstructed

const ChapterInfo = ({ chapter, mood, idx }) => (
  <div
    key={`info-${idx}`}
    className="info-slide"
    style={{
      position: 'fixed',
      bottom: 100,
      left: 32,
      zIndex: 20,
      textAlign: 'left',
      pointerEvents: 'none',
      maxWidth: 380,
      width: '32vw',
      minWidth: 220,
      padding: 0,
    }}
  >
    {/* Year badge */}
    <div style={{
      fontFamily: "'DM Mono', monospace", fontSize: 9,
      color: mood.accent, letterSpacing: '0.28em',
      marginBottom: 10, opacity: 0.8,
    }}>
      {chapter.year}
    </div>

    <h2 style={{
      fontFamily: "'Crimson Pro', serif",
      fontSize: 28,
      fontWeight: 300,
      letterSpacing: '0.04em',
      color: BONE,
      lineHeight: 1.2,
      margin: '0 0 8px',
      textShadow: '0 2px 22px rgba(0,0,0,0.9)',
    }}>
      {chapter.title}
    </h2>

    <p style={{
      fontFamily: "'Crimson Pro', serif",
      fontSize: 13,
      fontWeight: 300,
      fontStyle: 'italic',
      color: 'rgba(240,220,190,0.6)',
      lineHeight: 1.65,
      margin: '0 0 10px',
      textShadow: '0 1px 10px rgba(0,0,0,0.8)',
    }}>
      {chapter.subtitle}
    </p>

    {/* Survivor voice */}
    {chapter.survivor && (
      <div style={{
        marginTop: 14,
        fontFamily: "'Crimson Pro', serif",
        fontSize: 12,
        fontStyle: 'italic',
        fontWeight: 300,
        color: 'rgba(201,160,128,0.55)',
        lineHeight: 1.65,
      }}>
        "{chapter.survivor.text}"
        <span style={{
          fontFamily: "'DM Mono', monospace", fontSize: 8.5,
          display: 'block', marginTop: 5,
          color: 'rgba(201,160,128,0.35)', letterSpacing: '0.1em',
        }}>
          — {chapter.survivor.name}
        </span>
      </div>
    )}
  </div>
)

// ─── BodySnippet ─────────────────────────────────────────────────────────────
// Bottom-right, longer excerpt, fades out at bottom edge instead of hard-clipping

const BodySnippet = ({ chapter, idx }) => {
  if (!chapter.body) return null
  // Show more text — fade handles the visual cutoff gracefully
  const text = chapter.body.slice(0, 500) + (chapter.body.length > 500 ? '…' : '')

  return (
    <div
      key={`body-${idx}`}
      className="body-drift"
      style={{
        position: 'fixed',
        bottom: 80,
        right: 28,
        zIndex: 20,
        width: 320,
        maxHeight: 280,
        overflow: 'hidden',
        pointerEvents: 'none',
        animationDelay: '0.5s',
        // Fade out gracefully at the bottom
        maskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
      }}
    >
      <p style={{
        fontFamily: "'Crimson Pro', serif",
        fontSize: 11.5,
        fontWeight: 300,
        lineHeight: 1.85,
        color: 'rgba(240,220,190,0.38)',
        margin: 0,
        textShadow: '0 1px 8px rgba(0,0,0,0.8)',
      }}>
        {text}
      </p>
    </div>
  )
}

// ─── BloodRule ────────────────────────────────────────────────────────────────

const BloodRule = () => (
  <div
    className="blood-drip"
    style={{
      position: 'fixed', top: 0, bottom: 0, left: '50%',
      width: 1,
      background: `linear-gradient(to bottom, transparent, ${BLOOD}30, transparent)`,
      pointerEvents: 'none', zIndex: 5,
      transform: 'translateX(-50%)',
    }}
  />
)

// ─── ChapterDots ─────────────────────────────────────────────────────────────

const ChapterDots = ({ chapters, idx, mood, onGoTo, autoPlay, onTogglePlay }) => (
  <div style={{
    position: 'fixed', bottom: 50, left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 40, display: 'flex', gap: 8, alignItems: 'center',
    pointerEvents: 'all',
  }}>
    {chapters.map((ch, i) => (
      <button
        key={ch.id}
        onClick={e => { e.stopPropagation(); onGoTo(i) }}
        style={{
          width:  i === idx ? 24 : 6,
          height: 4,
          borderRadius: 2,
          background: i === idx ? mood.accent : 'rgba(240,220,190,0.2)',
          border: 'none', cursor: 'pointer', padding: 0,
          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      />
    ))}

    <div style={{
      width: 1, height: 16,
      background: 'rgba(240,220,190,0.1)',
      margin: '0 6px',
    }} />

    <button
      onClick={e => { e.stopPropagation(); onTogglePlay() }}
      style={{
        background: 'none',
        border: `1px solid ${autoPlay ? mood.accent : 'rgba(240,220,190,0.2)'}`,
        color: autoPlay ? mood.accent : 'rgba(240,220,190,0.4)',
        fontFamily: "'DM Mono', monospace", fontSize: 8,
        padding: '3px 8px', cursor: 'pointer',
        letterSpacing: '0.12em',
        transition: 'border-color 0.3s ease, color 0.3s ease',
      }}
    >
      {autoPlay ? '■' : '▶'}
    </button>
  </div>
)

// ─── HintBar ─────────────────────────────────────────────────────────────────

const HintBar = () => (
  <div style={{
    position: 'fixed', bottom: 22, left: '50%',
    transform: 'translateX(-50%)',
    fontFamily: "'DM Mono', monospace", fontSize: 8,
    color: 'rgba(240,220,190,0.18)', letterSpacing: '0.16em',
    zIndex: 40, pointerEvents: 'none', whiteSpace: 'nowrap',
  }}>
    CLICK ANYWHERE TO CONTINUE · SPACE TO AUTOPLAY
  </div>
)

// ─── PartitionMap — main ──────────────────────────────────────────────────────

const PartitionMap = () => {
  const mapContainerRef = useRef(null)
  const mapRef          = useRef(null)

  const [idx,      setIdx]      = useState(0)
  const [mapReady, setMapReady] = useState(false)
  const [showing,  setShowing]  = useState(true)
  const [autoPlay, setAutoPlay] = useState(true)

  const chapter = CHAPTERS[idx]
  const mood    = CHAPTER_MOODS[chapter?.id] || CHAPTER_MOODS.one_land

  // ── Map init ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (mapRef.current) return

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style:     'mapbox://styles/mapbox/dark-v11',
      center:    [74.0, 28.5],
      zoom:      4.2,
      projection: 'globe',
      attributionControl: false,
    })

    map.on('style.load', () => {
      map.setFog({
        color:            'rgb(10, 6, 4)',
        'high-color':     'rgb(25, 10, 10)',
        'horizon-blend':  0.04,
        'space-color':    'rgb(4, 2, 2)',
        'star-intensity': 0.9,
      })
    })

    map.on('load', () => {
      // ── Country boundary source ──────────────────────────────────────────
      map.addSource('cb', { type: 'vector', url: 'mapbox://mapbox.country-boundaries-v1' })

      // Pakistan fill — flag green
      map.addLayer({
        id: 'pk-fill', type: 'fill', source: 'cb', 'source-layer': 'country_boundaries',
        filter: ['==', 'iso_3166_1_alpha_3', 'PAK'],
        paint: { 'fill-color': '#01411C', 'fill-opacity': 0 },
      })
      // India fill — flag saffron
      map.addLayer({
        id: 'in-fill', type: 'fill', source: 'cb', 'source-layer': 'country_boundaries',
        filter: ['==', 'iso_3166_1_alpha_3', 'IND'],
        paint: { 'fill-color': '#FF9933', 'fill-opacity': 0 },
      })
      // Bangladesh fill — flag green
      map.addLayer({
        id: 'bd-fill', type: 'fill', source: 'cb', 'source-layer': 'country_boundaries',
        filter: ['==', 'iso_3166_1_alpha_3', 'BGD'],
        paint: { 'fill-color': '#006A4E', 'fill-opacity': 0 },
      })

      // Undivided subcontinent warm wash (chapter 1 — one_land)
      ;['PAK', 'IND', 'BGD'].forEach(iso => {
        map.addLayer({
          id: `sub-${iso}`, type: 'fill', source: 'cb', 'source-layer': 'country_boundaries',
          filter: ['==', 'iso_3166_1_alpha_3', iso],
          paint: { 'fill-color': '#C9A080', 'fill-opacity': 0 },
        })
      })

      // ── Regional GeoJSON sources ─────────────────────────────────────────
      // Punjab bounding region — used for violence fills instead of whole-country red
      map.addSource('punjab-region', {
        type: 'geojson',
        data: PUNJAB_POLYGON,
      })
      map.addLayer({
        id: 'blood-punjab',
        type: 'fill',
        source: 'punjab-region',
        paint: { 'fill-color': '#7a0f0f', 'fill-opacity': 0 },
      })

      // Bengal bounding region — violence fills for bengal chapter
      map.addSource('bengal-region', {
        type: 'geojson',
        data: BENGAL_POLYGON,
      })
      map.addLayer({
        id: 'blood-bengal',
        type: 'fill',
        source: 'bengal-region',
        paint: { 'fill-color': '#7a0f0f', 'fill-opacity': 0 },
      })

      mapRef.current = map
      setMapReady(true)
    })

    return () => map.remove()
  }, [])

  // ── Layer updates per chapter ─────────────────────────────────────────────
  useEffect(() => {
    if (!mapReady || !mapRef.current) return
    const map = mapRef.current

    map.flyTo({
      center:   chapter.location?.center || [74, 28.5],
      zoom:     chapter.location?.zoom   || 4.2,
      duration: 2400,
      essential: true,
    })

    const id = chapter.id

    // Undivided warm gold wash — chapter 1 only
    ;['PAK', 'IND', 'BGD'].forEach(iso => {
      try { map.setPaintProperty(`sub-${iso}`, 'fill-opacity', id === 'one_land' ? 0.28 : 0) } catch (_) {}
    })

    // Punjab blood fill — only the Punjab region polygon, not the whole country
    const punjabViolence = ['punjab_burns', 'great_crossing', 'the_missing'].includes(id)
    try { map.setPaintProperty('blood-punjab', 'fill-opacity', punjabViolence ? 0.55 : 0) } catch (_) {}

    // Bengal blood fill — only the Bengal region polygon
    const bengalViolence = id === 'bengal_divides'
    try { map.setPaintProperty('blood-bengal', 'fill-opacity', bengalViolence ? 0.45 : 0) } catch (_) {}

    // Flag-colour country fills — the_line and two_nations chapters
    const isFinal = id === 'two_nations'
    const isLine  = ['the_line', 'bengal_divides'].includes(id)
    try { map.setPaintProperty('pk-fill', 'fill-opacity', isFinal ? 0.55 : isLine ? 0.18 : 0) } catch (_) {}
    try { map.setPaintProperty('in-fill', 'fill-opacity', isFinal ? 0.55 : isLine ? 0.18 : 0) } catch (_) {}
    try { map.setPaintProperty('bd-fill', 'fill-opacity', isFinal ? 0.55 : isLine ? 0.18 : 0) } catch (_) {}
  }, [idx, mapReady, chapter])

  // ── Navigation helpers ────────────────────────────────────────────────────
  const transition = useCallback((fn, delay = 600) => {
    setShowing(false)
    setTimeout(() => {
      fn()
      setShowing(true)
    }, delay)
  }, [])

  const advance = useCallback(() => {
    transition(() => {
      setIdx(i => {
        if (i >= CHAPTERS.length - 1) { setAutoPlay(false); return i }
        return i + 1
      })
    })
  }, [transition])

  const retreat = useCallback(() => {
    transition(() => setIdx(i => Math.max(0, i - 1)), 400)
  }, [transition])

  const goTo = useCallback((i) => {
    transition(() => setIdx(i), 300)
  }, [transition])

  const togglePlay = useCallback(() => {
    setAutoPlay(p => !p)
  }, [])

  // ── Autoplay ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!autoPlay) return
    const t = setInterval(advance, 9000)
    return () => clearInterval(t)
  }, [autoPlay, advance])

  // ── Keyboard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') advance()
      if (e.key === 'ArrowLeft')  retreat()
      if (e.key === ' ')          { e.preventDefault(); togglePlay() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [advance, retreat, togglePlay])

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: ASH, overflow: 'hidden',
        cursor: 'pointer',
      }}
      onClick={advance}
    >
      <style>{CSS}</style>

      {/* Map */}
      <div ref={mapContainerRef} style={{ position: 'absolute', inset: 0 }} />

      {/* Chapter mood veil */}
      <MoodVeil mood={mood} idx={idx} />

      {/* Radial vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3,
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,5,3,0.72) 100%)',
      }} />

      {/* Ghost chapter number */}
      <GhostNumber idx={idx} />

      {/* Blood meridian rule */}
      <BloodRule />

      {/* Top navigation */}
      <TopNav idx={idx} total={CHAPTERS.length} />

      {/* Poetry / verse overlay — left panel */}
      {showing && <PoetryVerse chapter={chapter} mood={mood} idx={idx} />}

      {/* Chapter title + subtitle + survivor — bottom-left */}
      {showing && <ChapterInfo chapter={chapter} mood={mood} idx={idx} />}

      {/* Body text snippet — bottom-right, fades gracefully */}
      {showing && <BodySnippet chapter={chapter} idx={idx} />}

      {/* Chapter dot navigation */}
      <ChapterDots
        chapters={CHAPTERS}
        idx={idx}
        mood={mood}
        onGoTo={goTo}
        autoPlay={autoPlay}
        onTogglePlay={togglePlay}
      />

      {/* Hint */}
      <HintBar />
    </div>
  )
}

export default PartitionMap