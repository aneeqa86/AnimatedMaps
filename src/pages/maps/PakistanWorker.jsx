// PakistanWorker.jsx — DEFINITIVE CINEMATIC EDITION
// Aesthetic: NEWSPAPER ARCHIVE / WIRE DISPATCH
// Panel: top-right floating clipping (preserved from original design)
// Added: autoplay, bezier arcs, moving walker particles, pulsing Gulf,
//        cinematic camera, animated counters, telegraph sound + drone,
//        breaking news headlines, floating particles, typewriter titles

import { useEffect, useRef, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import { Link } from 'react-router-dom'
import { CHAPTERS, MIGRATION_FLOWS, CITY_MARKERS } from '@/data/pakistanWorker'
import 'mapbox-gl/dist/mapbox-gl.css'

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const INK      = '#1a1208'
const AGED     = '#8B7355'
const RED_INK  = '#8B1A1A'
const GOLD     = '#FF6B35'
const CREAM    = '#F4E8C8'

const CHAPTER_DURATION_MS = 11000

const BREAKING_HEADLINES = [
  '🔴 BREAKING — NEW NATION BORN: 32 MILLION SOULS, 75 UNIONS, ZERO RIGHTS',
  '🔴 BREAKING — MARTIAL LAW: TRADE UNION ACT ABOLISHED OVERNIGHT BY DECREE',
  '🔴 BREAKING — KARACHI ERUPTS: WORKERS & STUDENTS DEFY AYUB IN THE STREETS',
  '🔴 BREAKING — SHOTS FIRED AT FEROZ MILLS: LABOUR LEADER DEAD, 58 ARRESTED',
  '🔴 BREAKING — GULF DOORS OPEN: FIRST 30,000 PAKISTANIS DEPART FOR RIYADH',
  '🔴 BREAKING — ZIA COUP: 8,000 UNIONS IN CROSSHAIRS — CRACKDOWN IMMINENT',
  '🔴 BREAKING — EXODUS: 200,000 LEAVE THIS YEAR ALONE — FAMILIES LEFT BEHIND',
  '🔴 BREAKING — ZIA BANS ALL STRIKES: "GOD WILL PROVIDE" — WORKERS FLEE ABROAD',
  '🔴 BREAKING — FACTORY INFERNO BALDIA TOWN: 260 DEAD, EXITS WERE PADLOCKED',
  '🔴 BREAKING — RECORD YEAR: 946,571 REGISTERED FOR WORK ABROAD IN 12 MONTHS',
  '🔴 BREAKING — $35 BILLION FLOWS HOME: REMITTANCES NOW 85× THEIR 1976 LEVEL',
]

const TICKER_ITEMS = [
  'KARACHI — 14 MILLION PAKISTANIS WORK ABROAD',
  'GULF STATES ACCOUNT FOR 73% OF OVERSEAS PAKISTANI WORKFORCE',
  'REMITTANCES REACH $35 BILLION IN FY2024 — SECOND LARGEST FOREIGN EXCHANGE EARNER',
  '1972: POLICE OPEN FIRE ON WORKERS AT FEROZ TEXTILE MILLS, SITE KARACHI',
  'ZIA-UL-HAQ BANS STRIKES 1977 — EIGHT THOUSAND UNIONS SILENCED',
  'ALI ENTERPRISES FIRE 2012 — 259 WORKERS KILLED, FACTORY GATE PADLOCKED',
  'DUBAI 1973: FIRST WAVE OF GULF MIGRATION BEGINS — 30,000 WORKERS',
  'MAID FROM LAHORE EARNS MORE IN RIYADH THAN DOCTOR IN MULTAN',
  'WE BUILT THEIR TOWERS. WE PAVED THEIR ROADS. WE WILL NEVER BE ALLOWED TO STAY.',
]

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=DM+Mono:wght@300;400;500&family=Lato:ital,wght@0,300;0,400;1,300;1,400&family=Playfair+Display:ital,wght@0,700;1,400&display=swap');

@keyframes tickerScroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes clippingIn {
  0%   { opacity: 0; transform: translateY(-22px) rotate(-2deg); filter: blur(6px); }
  100% { opacity: 1; transform: translateY(0) rotate(-0.5deg); filter: blur(0); }
}
@keyframes stampIn {
  0%   { opacity: 0; transform: scale(1.4) rotate(-6deg); }
  60%  { transform: scale(0.93) rotate(-3deg); }
  100% { opacity: 0.7; transform: scale(1) rotate(-3deg); }
}
@keyframes floatPaper {
  0%,100% { transform: rotate(-0.5deg) translateY(0px); }
  50%     { transform: rotate(0.3deg) translateY(-5px); }
}
@keyframes pulse {
  0%,100% { opacity: 0.6; transform: scale(1); }
  50%     { opacity: 1;   transform: scale(1.15); }
}
@keyframes floatUp {
  0%   { opacity: 0; transform: translateY(0) rotate(0deg); }
  10%  { opacity: 0.7; }
  90%  { opacity: 0.5; }
  100% { opacity: 0; transform: translateY(-100vh) rotate(360deg); }
}
@keyframes breakingSlide {
  0%   { opacity: 0; transform: translateX(-50px); }
  12%  { opacity: 1; transform: translateX(0); }
  85%  { opacity: 1; transform: translateX(0); }
  100% { opacity: 0; transform: translateX(50px); }
}
@keyframes panelIn {
  0%   { opacity: 0; transform: translateY(-18px) rotate(-2deg); }
  100% { opacity: 1; transform: translateY(0) rotate(-0.5deg); }
}
@keyframes countUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes grain {
  0%,100%{transform:translate(0,0)}
  20%{transform:translate(-2%,3%)}
  40%{transform:translate(2%,-2%)}
  60%{transform:translate(-3%,1%)}
  80%{transform:translate(1%,-3%)}
}

.dispatch-clip {
  animation: clippingIn 0.6s cubic-bezier(0.34,1.2,0.64,1) both;
}
.float-paper {
  animation: floatPaper 5s ease-in-out 0.8s infinite;
}
.stamp-in {
  animation: stampIn 0.5s cubic-bezier(0.34,1.2,0.64,1) 0.5s both;
  opacity: 0;
}
.pulse { animation: pulse 2s ease-in-out infinite; }

.mapboxgl-ctrl-bottom-left,
.mapboxgl-ctrl-bottom-right,
.mapboxgl-ctrl-attrib { display: none !important; }
`

// ─── ANIMATED COUNTER ─────────────────────────────────────────────────────────
const useCounter = (target, duration = 1300) => {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!target) { setVal(0); return }
    let start = null
    const tick = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(target * ease * 10) / 10)
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])
  return val
}

// ─── TYPEWRITER ───────────────────────────────────────────────────────────────
const TypewriterText = ({ text, speed = 48 }) => {
  const [displayed, setDisplayed] = useState('')
  const [i, setI] = useState(0)
  useEffect(() => { setDisplayed(''); setI(0) }, [text])
  useEffect(() => {
    if (i >= text.length) return
    const t = setTimeout(() => { setDisplayed(prev => prev + text[i]); setI(p => p + 1) }, speed)
    return () => clearTimeout(t)
  }, [i, text, speed])
  return <>{displayed}<span style={{ opacity: i < text.length ? 1 : 0 }}>|</span></>
}

// ─── FLOATING PARTICLE ────────────────────────────────────────────────────────
const FloatingParticle = ({ delay, duration, size, left }) => (
  <div style={{
    position: 'absolute', left: `${left}%`, bottom: '-10px',
    width: size, height: size,
    background: `radial-gradient(circle, ${GOLD}bb, transparent)`,
    borderRadius: '50%',
    animation: `floatUp ${duration}s linear infinite`,
    animationDelay: `${delay}s`,
    pointerEvents: 'none', zIndex: 3,
  }} />
)

// ─── BEZIER ARC ───────────────────────────────────────────────────────────────
const makeBezierArc = (from, to, steps = 80) => {
  const midLng = (from[0] + to[0]) / 2
  const midLat = (from[1] + to[1]) / 2 + 13
  const coords = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps, mt = 1 - t
    coords.push([
      mt*mt*from[0] + 2*mt*t*midLng + t*t*to[0],
      mt*mt*from[1] + 2*mt*t*midLat + t*t*to[1],
    ])
  }
  return coords
}

// ─── WALKER SVG ───────────────────────────────────────────────────────────────
const walkerSVG = `
  <svg viewBox="0 0 24 44" width="15" height="27" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="5" r="4.5" fill="${GOLD}"/>
    <rect x="8" y="10" width="8" height="14" rx="2" fill="${GOLD}"/>
    <rect x="16" y="9" width="6" height="5" rx="1" fill="${GOLD}" opacity="0.7"/>
    <rect x="2" y="11" width="4" height="12" rx="2" fill="${GOLD}" transform="rotate(-12 4 11)"/>
    <rect x="18" y="12" width="4" height="12" rx="2" fill="${GOLD}" transform="rotate(12 20 12)"/>
    <rect x="7" y="24" width="4" height="14" rx="2" fill="${GOLD}" transform="rotate(-8 9 24)"/>
    <rect x="13" y="24" width="4" height="14" rx="2" fill="${GOLD}" transform="rotate(8 15 24)"/>
  </svg>`

// ─── WEB AUDIO ────────────────────────────────────────────────────────────────
const buildAudio = () => {
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  const ctx = new AC()

  const playTelegraph = () => {
    const now = ctx.currentTime
    ;[0, 0.09, 0.18, 0.30, 0.39].forEach((t, i) => {
      const osc = ctx.createOscillator()
      const g   = ctx.createGain()
      osc.type = 'square'
      osc.frequency.value = i % 2 === 0 ? 820 : 640
      g.gain.setValueAtTime(0, now + t)
      g.gain.linearRampToValueAtTime(0.11, now + t + 0.005)
      g.gain.linearRampToValueAtTime(0, now + t + 0.038)
      osc.connect(g); g.connect(ctx.destination)
      osc.start(now + t); osc.stop(now + t + 0.05)
    })
  }

  let droneNodes = null
  const startDrone = () => {
    if (droneNodes) return
    const o1 = ctx.createOscillator()
    const o2 = ctx.createOscillator()
    const filt = ctx.createBiquadFilter()
    const gain = ctx.createGain()
    o1.type = 'sine'; o1.frequency.value = 55
    o2.type = 'sine'; o2.frequency.value = 82
    filt.type = 'lowpass'; filt.frequency.value = 180
    gain.gain.value = 0.035
    o1.connect(filt); o2.connect(filt)
    filt.connect(gain); gain.connect(ctx.destination)
    o1.start(); o2.start()
    droneNodes = { o1, o2 }
  }
  const stopDrone = () => {
    if (!droneNodes) return
    try { droneNodes.o1.stop(); droneNodes.o2.stop() } catch {}
    droneNodes = null
  }

  return { ctx, playTelegraph, startDrone, stopDrone }
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const PakistanWorker = () => {
  const mapContainer    = useRef(null)
  const mapRef          = useRef(null)
  const audioRef        = useRef(null)
  const walkersRef      = useRef([])
  const walkerAnimsRef  = useRef([])
  const arcAnimRef      = useRef(null)
  const gulfPulseRef    = useRef(null)
  const autoplayRef     = useRef(null)

  const [idx, setIdx]               = useState(0)
  const [mapReady, setMapReady]     = useState(false)
  const [playing, setPlaying]       = useState(true)   // ← autoplay on
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [particles]                 = useState(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i, delay: Math.random() * 6,
      duration: 9 + Math.random() * 8,
      size: `${2 + Math.random() * 5}px`,
      left: Math.random() * 100,
    }))
  )
  const [breaking, setBreaking]     = useState({ show: false, text: '' })
  const [panelKey, setPanelKey]     = useState(0)

  const chapter    = CHAPTERS[idx]
  const isMigration = chapter.type === 'migration' || chapter.type === 'both'
  const isLabor     = chapter.type === 'labor'     || chapter.type === 'both'
  const typeLabel   = isMigration && !isLabor ? 'OVERSEAS DISPATCH' : 'LABOUR BUREAU'
  const chKey       = `ch-${idx}-${chapter.id}`

  const workerCount = useCounter(chapter.stats.workers)
  const remittCount = useCounter(chapter.stats.remittance)

  // ── fire breaking news ────────────────────────────────────────────────────
  const fireBreaking = useCallback((i) => {
    const text = BREAKING_HEADLINES[i]
    if (!text) return
    setBreaking({ show: true, text })
    setTimeout(() => setBreaking({ show: false, text: '' }), 5800)
  }, [])

  // ── navigate ──────────────────────────────────────────────────────────────
  const goTo = useCallback((i) => {
    const clamped = Math.max(0, Math.min(CHAPTERS.length - 1, i))
    setIdx(clamped)
    setPanelKey(k => k + 1)
    fireBreaking(clamped)
    if (audioRef.current && soundEnabled) audioRef.current.playTelegraph()
  }, [fireBreaking, soundEnabled])

  // ── autoplay ──────────────────────────────────────────────────────────────
  useEffect(() => {
    clearInterval(autoplayRef.current)
    if (!playing) return
    autoplayRef.current = setInterval(() => {
      setIdx(prev => {
        const next = prev + 1
        if (next >= CHAPTERS.length) { setPlaying(false); return prev }
        setPanelKey(k => k + 1)
        fireBreaking(next)
        if (audioRef.current && soundEnabled) audioRef.current.playTelegraph()
        return next
      })
    }, CHAPTER_DURATION_MS)
    return () => clearInterval(autoplayRef.current)
  }, [playing, soundEnabled, fireBreaking])

  // ── fire breaking on mount ────────────────────────────────────────────────
  useEffect(() => { fireBreaking(0) }, [fireBreaking])

  // ── sound toggle ──────────────────────────────────────────────────────────
  const toggleSound = useCallback(() => {
    if (!audioRef.current) audioRef.current = buildAudio()
    if (!soundEnabled) { audioRef.current?.startDrone(); setSoundEnabled(true) }
    else               { audioRef.current?.stopDrone();  setSoundEnabled(false) }
  }, [soundEnabled])

  // ── map init ──────────────────────────────────────────────────────────────
  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [60.0, 28.0],
      zoom: 3.5,
      projection: 'globe',
      attributionControl: false,
      pitch: 45,
    })

    map.on('style.load', () => {
      map.setFog({
        color: 'rgb(30, 20, 10)',
        'high-color': 'rgb(55, 38, 18)',
        'horizon-blend': 0.1,
        'space-color': 'rgb(6, 4, 2)',
        'star-intensity': 0.8,
      })
    })

    map.on('load', () => {
      const gulfISOs = ['SAU','ARE','KWT','QAT','BHR','OMN']

      // Country source
      map.addSource('cb', { type: 'vector', url: 'mapbox://mapbox.country-boundaries-v1' })

      // Pakistan fills + glow
      map.addLayer({ id:'pk-fill',   type:'fill', source:'cb', 'source-layer':'country_boundaries',
        filter:['==','iso_3166_1_alpha_3','PAK'], paint:{'fill-color':GOLD,'fill-opacity':0.22,'fill-antialias':true} })
      map.addLayer({ id:'pk-line',   type:'line', source:'cb', 'source-layer':'country_boundaries',
        filter:['==','iso_3166_1_alpha_3','PAK'], paint:{'line-color':GOLD,'line-width':2,'line-opacity':0.9} })
      map.addLayer({ id:'pk-glow',   type:'line', source:'cb', 'source-layer':'country_boundaries',
        filter:['==','iso_3166_1_alpha_3','PAK'], paint:{'line-color':GOLD,'line-width':7,'line-opacity':0.25,'line-blur':4} })

      // Gulf fills — individual so we can pulse each
      gulfISOs.forEach(iso => {
        map.addLayer({ id:`gulf-${iso}`, type:'fill', source:'cb', 'source-layer':'country_boundaries',
          filter:['==','iso_3166_1_alpha_3',iso],
          paint:{'fill-color':RED_INK,'fill-opacity':0,'fill-antialias':true} })
        map.addLayer({ id:`gulf-b-${iso}`, type:'line', source:'cb', 'source-layer':'country_boundaries',
          filter:['==','iso_3166_1_alpha_3',iso],
          paint:{'line-color':RED_INK,'line-width':0,'line-opacity':0} })
      })

      // Arc source + layers
      const arcFeatures = MIGRATION_FLOWS.map((f, i) => ({
        type:'Feature', id:i,
        geometry:{ type:'LineString', coordinates: makeBezierArc(f.from, f.to) },
        properties: { idx: i }
      }))
      map.addSource('arcs', { type:'geojson', data:{ type:'FeatureCollection', features:arcFeatures } })
      map.addLayer({ id:'arc-glow', type:'line', source:'arcs',
        paint:{'line-color':GOLD,'line-width':0,'line-opacity':0,'line-blur':5},
        layout:{'line-cap':'round'} })
      map.addLayer({ id:'arc-line', type:'line', source:'arcs',
        paint:{'line-color':GOLD,'line-width':0,'line-opacity':0,'line-dasharray':[2,3]},
        layout:{'line-cap':'round'} })

      // Walker markers
      const container = map.getContainer()
      const walkers = MIGRATION_FLOWS.map((flow) => {
        const el = document.createElement('div')
        el.style.cssText = `position:absolute;opacity:0;pointer-events:none;
          transform:translate(-50%,-50%);z-index:5;
          filter:drop-shadow(0 0 5px ${GOLD}88);`
        el.innerHTML = walkerSVG
        container.appendChild(el)
        return { el, arc: makeBezierArc(flow.from, flow.to) }
      })
      walkersRef.current = walkers

      // 3D terrain
      map.addSource('dem', { type:'raster-dem', url:'mapbox://mapbox.mapbox-terrain-dem-v1', tileSize:512, maxzoom:14 })
      map.setTerrain({ source:'dem', exaggeration: 1.4 })

      mapRef.current = map
      setMapReady(true)
    })

    // Inject styles
    const s = document.createElement('style')
    s.textContent = CSS + `
      @keyframes walkerBob{0%,100%{transform:translate(-50%,-50%) rotate(-1.5deg)}50%{transform:translate(-50%,-54%) rotate(1.5deg)}}`
    document.head.appendChild(s)

    return () => {
      clearInterval(autoplayRef.current)
      walkerAnimsRef.current.forEach(id => cancelAnimationFrame(id))
      if (arcAnimRef.current)  clearInterval(arcAnimRef.current)
      if (gulfPulseRef.current) clearInterval(gulfPulseRef.current)
      map.remove()
    }
  }, [])

  // ── animate walker along bezier ───────────────────────────────────────────
  const animateWalker = useCallback((map, arc, el, duration) => {
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const t = Math.min((ts - start) / duration, 1)
      const ci = Math.min(Math.floor(t * (arc.length - 1)), arc.length - 1)
      const pos = map.project(arc[ci])
      el.style.left = `${pos.x}px`
      el.style.top  = `${pos.y}px`
      el.style.opacity = t < 0.05 ? `${t/0.05}` : t > 0.92 ? `${(1-t)/0.08}` : '1'
      if (t < 1) return requestAnimationFrame(step)
      // loop
      start = null
      return requestAnimationFrame(step)
    }
    return requestAnimationFrame(step)
  }, [])

  // ── chapter effect ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapReady || !mapRef.current) return
    const map = mapRef.current
    const gulfISOs = ['SAU','ARE','KWT','QAT','BHR','OMN']

    const set = (id, props) =>
      Object.entries(props).forEach(([p,v]) => { try { map.setPaintProperty(id,p,v) } catch {} })

    // Pakistan highlight
    set('pk-fill', { 'fill-opacity': isLabor ? 0.18 : 0.06 })
    set('pk-line', { 'line-width': isLabor ? 2 : 1, 'line-opacity': isLabor ? 0.9 : 0.35 })
    set('pk-glow', { 'line-width': isLabor ? 7 : 2, 'line-opacity': isLabor ? 0.22 : 0.05 })

    // Gulf pulse
    if (gulfPulseRef.current) clearInterval(gulfPulseRef.current)
    if (isMigration) {
      gulfISOs.forEach(iso => {
        set(`gulf-${iso}`, { 'fill-opacity': 0.22 })
        set(`gulf-b-${iso}`, { 'line-width': 1.2, 'line-opacity': 0.7 })
      })
      let hi = false
      gulfPulseRef.current = setInterval(() => {
        hi = !hi
        gulfISOs.forEach(iso => set(`gulf-${iso}`, { 'fill-opacity': hi ? 0.42 : 0.16 }))
      }, 850)
    } else {
      gulfISOs.forEach(iso => {
        set(`gulf-${iso}`, { 'fill-opacity': 0 })
        set(`gulf-b-${iso}`, { 'line-width': 0, 'line-opacity': 0 })
      })
    }

    // Arc lines
    set('arc-glow', { 'line-width': isMigration ? 7 : 0, 'line-opacity': isMigration ? 0.14 : 0 })
    set('arc-line', { 'line-width': isMigration ? 1.8 : 0, 'line-opacity': isMigration ? 0.88 : 0 })

    // Animated dash
    if (arcAnimRef.current) clearInterval(arcAnimRef.current)
    if (isMigration) {
      let offset = 0
      arcAnimRef.current = setInterval(() => {
        offset = (offset + 0.22) % 5
        try { map.setPaintProperty('arc-line','line-dasharray',[2 + offset * 0.1, 3]) } catch {}
      }, 80)
    }

    // Walker animations
    walkerAnimsRef.current.forEach(id => cancelAnimationFrame(id))
    walkerAnimsRef.current = []
    walkersRef.current.forEach(({ el, arc }, i) => {
      if (isMigration) {
        el.style.animation = 'walkerBob 0.5s ease-in-out infinite'
        setTimeout(() => {
          const id = animateWalker(map, arc, el, 8500 + i * 1200)
          walkerAnimsRef.current.push(id)
        }, i * 700)
      } else {
        el.style.opacity = '0'
        el.style.animation = 'none'
      }
    })

    // Cinematic camera
    map.flyTo({
      center:   chapter.location.center,
      zoom:     chapter.location.zoom,
      pitch:    isMigration ? 58 : isLabor ? 42 : 48,
      bearing:  isMigration ? 12 : isLabor ? -4 : 0,
      duration: 2700,
      essential: true,
      curve: 1.45,
    })

  }, [idx, mapReady, chapter, isMigration, isLabor, animateWalker])

  // ─── RENDER ──────────────────────────────────────────────────────────────
  const progress = (idx / (CHAPTERS.length - 1)) * 100

  return (
    <div style={{ position:'fixed', inset:0, background:'#080503', overflow:'hidden' }}>

      {/* MAP */}
      <div ref={mapContainer} style={{ position:'absolute', inset:0 }} />

      {/* FLOATING PARTICLES */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:3 }}>
        {particles.map(p => <FloatingParticle key={p.id} {...p} />)}
      </div>

      {/* FILM GRAIN */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none', zIndex:2, opacity:0.06,
        backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize:'160px 160px',
        animation:'grain 0.35s steps(1) infinite',
      }} />

      {/* SCANLINES */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none', zIndex:2,
        background:'linear-gradient(transparent 50%, rgba(0,0,0,0.08) 50%)',
        backgroundSize:'100% 4px',
      }} />

      {/* VIGNETTE */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none', zIndex:2,
        background:'radial-gradient(ellipse at center, transparent 35%, rgba(4,3,1,0.72) 100%)',
      }} />

      {/* BREAKING NEWS BANNER */}
      {breaking.show && (
        <div style={{
          position:'fixed', top:68, left:0, right:0, zIndex:45,
          background:`${RED_INK}f0`, padding:'7px 28px',
          fontFamily:"'DM Mono', monospace", fontSize:11, color:CREAM,
          letterSpacing:'0.1em', textTransform:'uppercase',
          animation:'breakingSlide 5.8s ease forwards',
          borderBottom:'1px solid rgba(255,200,150,0.18)',
        }}>
          {breaking.text}
        </div>
      )}

      {/* ── MASTHEAD ─────────────────────────────────────────────────────── */}
      <div style={{
        position:'fixed', top:0, left:0, right:0, zIndex:30,
        background:'rgba(10,8,4,0.97)',
        borderBottom:`3px solid ${AGED}66`,
        backdropFilter:'blur(8px)',
        padding:'0 32px',
      }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0 10px' }}>

          <Link to="/maps" style={{
            fontFamily:"'DM Mono',monospace", fontSize:9,
            color:AGED, letterSpacing:'0.2em', textDecoration:'none',
          }} onMouseEnter={e=>e.target.style.color=GOLD} onMouseLeave={e=>e.target.style.color=AGED}>
            ← ANIMATED MAPS
          </Link>

          <div style={{ textAlign:'center' }}>
            <div style={{
              fontFamily:"'UnifrakturMaguntia',cursive",
              fontSize:32, color:'#F4E8C8', letterSpacing:'0.04em', lineHeight:1,
            }}>The Pakistani Worker</div>
            <div style={{
              display:'flex', alignItems:'center', gap:22, justifyContent:'center',
              fontFamily:"'DM Mono',monospace", fontSize:8.5, color:AGED,
              letterSpacing:'0.14em', marginTop:4,
            }}>
              <span>EST. 1947</span>
              <span className="pulse" style={{ color:RED_INK }}>◆</span>
              <span>LABOUR · MIGRATION · RESISTANCE</span>
              <span className="pulse" style={{ color:RED_INK, animationDelay:'0.6s' }}>◆</span>
              <span>14 MILLION WORKERS</span>
            </div>
          </div>

          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <button onClick={toggleSound} style={{
              background:'transparent',
              border:`1px solid ${soundEnabled ? GOLD : AGED}66`,
              color: soundEnabled ? GOLD : AGED,
              cursor:'pointer', fontFamily:"'DM Mono',monospace",
              fontSize:9, padding:'4px 9px', letterSpacing:'0.12em',
              transition:'all 0.25s',
            }}>
              {soundEnabled ? '◉ WIRE ON' : '○ WIRE OFF'}
            </button>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:AGED, textAlign:'right', letterSpacing:'0.12em' }}>
              <div>{chapter.year}</div>
              <div style={{ color:GOLD }}>{idx+1} / {CHAPTERS.length}</div>
            </div>
          </div>
        </div>
        <div style={{ height:1, background:AGED, opacity:0.25 }} />
      </div>

      {/* ── DISPATCH CLIPPING — top right ────────────────────────────────── */}
      <div
        key={panelKey}
        className="dispatch-clip float-paper"
        style={{
          position:'fixed', top:115, right:28, zIndex:30, width:340,
          background:'rgba(240,228,196,0.97)',
          border:`1px solid ${AGED}99`,
          padding:'18px 20px 20px',
          boxShadow:'8px 12px 35px rgba(0,0,0,0.85), 0 0 0 1px rgba(139,115,85,0.25)',
        }}
      >
        {/* Dispatch header */}
        <div style={{
          fontFamily:"'DM Mono',monospace", fontSize:7.5, color:RED_INK,
          letterSpacing:'0.2em', borderBottom:`1px solid ${AGED}88`,
          paddingBottom:6, marginBottom:10,
          display:'flex', justifyContent:'space-between', textTransform:'uppercase',
        }}>
          <span>{typeLabel}</span>
          <span>VOL. XLII • NO. {idx+1}</span>
        </div>

        {/* Title with typewriter */}
        <h2 style={{
          fontFamily:"'UnifrakturMaguntia',cursive", fontSize:23,
          color:INK, lineHeight:1.2, margin:'0 0 5px',
        }}>
          <TypewriterText text={chapter.title} speed={45} />
        </h2>

        <div style={{
          fontFamily:"'DM Mono',monospace", fontSize:9, color:'#5a4a32',
          letterSpacing:'0.06em', marginBottom:12, fontStyle:'italic',
        }}>{chapter.subtitle}</div>

        <div style={{ width:'100%', height:1, background:`${AGED}55`, margin:'8px 0' }} />

        <p style={{
          fontFamily:"'Lato',sans-serif", fontSize:12.5,
          color:'#2a1e0e', lineHeight:1.78, margin:0, fontWeight:400,
        }}>{chapter.body}</p>

        {/* Quote */}
        {chapter.quote && (
          <div style={{ marginTop:13, borderLeft:`3px solid ${RED_INK}`, paddingLeft:11 }}>
            <p style={{
              fontFamily:"'Lato',sans-serif", fontStyle:'italic',
              fontSize:11, color:'#4a3020', lineHeight:1.62, margin:'0 0 4px',
            }}>"{chapter.quote.text}"</p>
            <span style={{
              fontFamily:"'DM Mono',monospace", fontSize:8.5,
              color:RED_INK, letterSpacing:'0.08em',
            }}>— {chapter.quote.author}</span>
          </div>
        )}

        {/* Animated stats */}
        {(chapter.stats.workers > 0 || chapter.stats.remittance > 0) && (
          <div style={{
            display:'flex', gap:16, marginTop:14,
            paddingTop:12, borderTop:`1px solid ${AGED}66`,
          }}>
            {chapter.stats.workers > 0 && (
              <div style={{ flex:1, textAlign:'center', animation:'countUp 0.5s ease both' }}>
                <div style={{
                  fontFamily:"'Playfair Display',serif", fontSize:26,
                  fontWeight:700, color:RED_INK, lineHeight:1,
                }}>
                  {Math.round(workerCount).toLocaleString()}
                  <span style={{ fontSize:13, opacity:0.6 }}>K</span>
                </div>
                <div style={{
                  fontFamily:"'DM Mono',monospace", fontSize:7, color:'#6a5038',
                  letterSpacing:'0.1em', marginTop:3, textTransform:'uppercase',
                }}>Workers / yr</div>
              </div>
            )}
            {chapter.stats.remittance > 0 && (
              <div style={{ flex:1, textAlign:'center', animation:'countUp 0.5s 0.15s ease both' }}>
                <div style={{
                  fontFamily:"'Playfair Display',serif", fontSize:26,
                  fontWeight:700, color:INK, lineHeight:1,
                }}>
                  ${remittCount.toFixed(1)}
                  <span style={{ fontSize:13, opacity:0.6 }}>B</span>
                </div>
                <div style={{
                  fontFamily:"'DM Mono',monospace", fontSize:7, color:'#6a5038',
                  letterSpacing:'0.1em', marginTop:3, textTransform:'uppercase',
                }}>Remittances</div>
              </div>
            )}
          </div>
        )}

        {/* Stamp */}
        <div className="stamp-in" style={{
          position:'absolute', bottom:10, right:12,
          fontFamily:"'DM Mono',monospace", fontSize:7.5, color:RED_INK,
          border:`1.5px solid ${RED_INK}`, padding:'2px 6px', letterSpacing:'0.18em',
        }}>VERIFIED • AP</div>
      </div>

      {/* ── CHAPTER DOT NAV — left side ──────────────────────────────────── */}
      <div style={{
        position:'fixed', left:22, top:'50%', transform:'translateY(-50%)',
        zIndex:30, display:'flex', flexDirection:'column', gap:11, alignItems:'center',
      }}>
        {CHAPTERS.map((ch, i) => (
          <button key={ch.id} onClick={() => { goTo(i); setPlaying(false) }}
            title={`${ch.year}: ${ch.title}`}
            style={{
              width: i===idx ? 12 : 6, height: i===idx ? 12 : 6,
              borderRadius:'50%',
              background: i===idx ? GOLD : i<idx ? `${GOLD}55` : 'rgba(201,168,74,0.22)',
              border:`1px solid ${i===idx ? GOLD : 'rgba(201,168,74,0.28)'}`,
              cursor:'pointer', padding:0,
              transition:'all 0.3s cubic-bezier(0.34,1.2,0.64,1)',
              transform: i===idx ? 'scale(1.2)' : 'scale(1)',
            }}
          />
        ))}
      </div>

      {/* ── YEAR WATERMARK ───────────────────────────────────────────────── */}
      <div style={{
        position:'fixed', bottom:95, left:28, zIndex:3,
        fontFamily:"'UnifrakturMaguntia',cursive",
        fontSize:130, color:'rgba(201,168,74,0.04)',
        lineHeight:1, pointerEvents:'none', letterSpacing:'-0.02em',
        userSelect:'none',
      }}>
        {chapter.year.split(' ')[0].split('–')[0]}
      </div>

      {/* ── CONTROLS ─────────────────────────────────────────────────────── */}
      <div style={{
        position:'fixed', bottom:46, left:'50%', transform:'translateX(-50%)',
        zIndex:30, display:'flex', alignItems:'center', gap:14,
      }}>
        <button
          onClick={() => { goTo(idx-1); setPlaying(false) }} disabled={idx===0}
          style={{
            background:'rgba(240,228,196,0.08)',
            border:`1px solid ${idx===0 ? '#2a2015' : AGED}66`,
            color: idx===0 ? '#2a2015' : AGED, cursor: idx===0 ? 'default' : 'pointer',
            fontFamily:"'DM Mono',monospace", fontSize:11, padding:'8px 18px',
            letterSpacing:'0.1em', transition:'all 0.25s',
          }}
          onMouseEnter={e=>{ if(idx>0){e.target.style.borderColor=GOLD;e.target.style.background='rgba(240,228,196,0.15)'}}}
          onMouseLeave={e=>{ if(idx>0){e.target.style.borderColor=`${AGED}66`;e.target.style.background='rgba(240,228,196,0.08)'}}}
        >← PREV</button>

        <button onClick={() => setPlaying(p => !p)} style={{
          background: playing ? `${RED_INK}35` : 'rgba(240,228,196,0.08)',
          border:`1px solid ${playing ? RED_INK : GOLD}`,
          color: playing ? '#ffaa88' : GOLD,
          cursor:'pointer', fontFamily:"'DM Mono',monospace",
          fontSize:11, padding:'8px 26px', letterSpacing:'0.14em', transition:'all 0.25s',
        }}>
          {playing ? '⏹ STOP' : '▶ PLAY'}
        </button>

        <button
          onClick={() => { goTo(idx+1); setPlaying(false) }} disabled={idx===CHAPTERS.length-1}
          style={{
            background:'rgba(240,228,196,0.08)',
            border:`1px solid ${idx===CHAPTERS.length-1 ? '#2a2015' : AGED}66`,
            color: idx===CHAPTERS.length-1 ? '#2a2015' : AGED,
            cursor: idx===CHAPTERS.length-1 ? 'default' : 'pointer',
            fontFamily:"'DM Mono',monospace", fontSize:11, padding:'8px 18px',
            letterSpacing:'0.1em', transition:'all 0.25s',
          }}
          onMouseEnter={e=>{ if(idx<CHAPTERS.length-1){e.target.style.borderColor=GOLD;e.target.style.background='rgba(240,228,196,0.15)'}}}
          onMouseLeave={e=>{ if(idx<CHAPTERS.length-1){e.target.style.borderColor=`${AGED}66`;e.target.style.background='rgba(240,228,196,0.08)'}}}
        >NEXT →</button>
      </div>

      {/* PROGRESS BAR */}
      <div style={{
        position:'fixed', bottom:40, left:0, right:0, height:2,
        background:'rgba(201,168,74,0.08)', zIndex:29,
      }}>
        <div style={{
          height:'100%', width:`${progress}%`,
          background:`linear-gradient(90deg,${RED_INK},${GOLD})`,
          transition:'width 0.7s ease',
        }}/>
      </div>

      {/* ── TICKER TAPE ──────────────────────────────────────────────────── */}
      <div style={{
        position:'fixed', bottom:0, left:0, right:0, zIndex:30,
        height:38, background:`linear-gradient(90deg,${RED_INK}cc,${RED_INK})`,
        overflow:'hidden', display:'flex', alignItems:'center',
        borderTop:'1px solid rgba(255,200,150,0.25)',
        boxShadow:'0 -2px 12px rgba(0,0,0,0.4)',
      }}>
        <div style={{
          display:'inline-flex', alignItems:'center',
          animation:'tickerScroll 55s linear infinite',
          whiteSpace:'nowrap', willChange:'transform',
        }}>
          {[...TICKER_ITEMS,...TICKER_ITEMS].map((item, i) => (
            <span key={i} style={{
              fontFamily:"'DM Mono',monospace", fontSize:10,
              color:'rgba(255,238,210,0.93)', letterSpacing:'0.14em',
              textTransform:'uppercase', padding:'0 32px',
              textShadow:'0 1px 2px rgba(0,0,0,0.35)',
            }}>
              {item}
              <span style={{ color:'rgba(255,215,150,0.5)', marginLeft:30, fontSize:11 }}>◆</span>
            </span>
          ))}
        </div>
      </div>

    </div>
  )
}

export default PakistanWorker