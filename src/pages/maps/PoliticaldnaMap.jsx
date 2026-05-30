// src/pages/maps/PoliticalDnaMap.jsx
// RAFCE · autoplay-first · cinematic markers + animated arcs · no plain choropleth
import { useEffect, useRef, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import { useNavigate } from 'react-router-dom'
import {
  CHAPTERS, EVENTS, POLITICAL_ERAS, DEMOCRACY_ARC,
  WORLD_PULSE, REGIME_LABELS, C, DUR_PER_CHAPTER,
} from '@/data/politicalDnaMap'
import 'mapbox-gl/dist/mapbox-gl.css'

const MAP_STYLE = 'mapbox://styles/mapbox/light-v11'

// ─── Era year snapshots ───────────────────────────────────────────────────────
const ERA_YEARS  = [1900, 1920, 1938, 1950, 1965, 1980, 1995, 2010, 2026]
const getNearestEraYear = y => [...ERA_YEARS].reverse().find(ey => ey <= y) || 1900

// ─── Bezier helpers ───────────────────────────────────────────────────────────
const bezierPt = (p0, p1, cp, t) => [
  (1-t)**2*p0[0] + 2*(1-t)*t*cp[0] + t**2*p1[0],
  (1-t)**2*p0[1] + 2*(1-t)*t*cp[1] + t**2*p1[1],
]
const arcCP = (a, b) => {
  const mid = [(a[0]+b[0])/2, (a[1]+b[1])/2]
  const dx = b[0]-a[0], dy = b[1]-a[1]
  const len = Math.sqrt(dx*dx+dy*dy)
  return [mid[0]-dy*0.28, mid[1]+dx*0.28-len*0.12]
}

// ─── Build Mapbox color expression ────────────────────────────────────────────
const buildColorExpr = year => {
  const data = POLITICAL_ERAS[getNearestEraYear(year)] || []
  const expr = ['match', ['get', 'iso_3166_1_alpha_3']]
  for (const [iso, sys] of data) expr.push(iso, C[sys] || C.land)
  expr.push(C.land)
  return expr
}

const yearToProgress = y => (y - 1900) / (2026 - 1900)

// ─── Icon canvas builders ─────────────────────────────────────────────────────
const buildIconCanvas = (type, color, size = 28) => {
  const cv = document.createElement('canvas')
  cv.width = cv.height = size
  const ctx = cv.getContext('2d')
  const s = size, h = s / 2

  ctx.fillStyle = color
  ctx.strokeStyle = color

  if (type === 'crown') {
    ctx.beginPath()
    ctx.moveTo(4, s-4); ctx.lineTo(4, h); ctx.lineTo(h/2, h+4)
    ctx.lineTo(h, 4); ctx.lineTo(h+h/2, h+4); ctx.lineTo(s-4, h)
    ctx.lineTo(s-4, s-4); ctx.closePath()
    ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.beginPath(); ctx.arc(h, 4, 3, 0, Math.PI*2); ctx.fill()
  } else if (type === 'star') {
    ctx.beginPath()
    for (let i = 0; i < 5; i++) {
      const a = (i * 4 * Math.PI / 5) - Math.PI/2
      const b = (i * 4 * Math.PI / 5 + 2*Math.PI/5) - Math.PI/2
      i === 0 ? ctx.moveTo(h + (h-4)*Math.cos(a), h + (h-4)*Math.sin(a))
               : ctx.lineTo(h + (h-4)*Math.cos(a), h + (h-4)*Math.sin(a))
      ctx.lineTo(h + (h/2-2)*Math.cos(b), h + (h/2-2)*Math.sin(b))
    }
    ctx.closePath(); ctx.fill()
  } else if (type === 'fire') {
    ctx.beginPath()
    ctx.moveTo(h, 3)
    ctx.bezierCurveTo(s-4, h-2, s-2, h+4, h, s-2)
    ctx.bezierCurveTo(4, h+4, 4, h-2, h, 3)
    ctx.fill()
    ctx.fillStyle = 'rgba(255,200,100,0.6)'
    ctx.beginPath()
    ctx.moveTo(h, 7)
    ctx.bezierCurveTo(h+6, h, h+5, h+5, h, s-5)
    ctx.bezierCurveTo(h-5, h+5, h-6, h, h, 7)
    ctx.fill()
  } else if (type === 'fist') {
    ctx.fillRect(h-5, h-2, 10, s/2)
    ctx.beginPath()
    ctx.roundRect(h-7, h-8, 14, 10, 3)
    ctx.fill()
    ctx.fillRect(h-9, h-4, 4, 6)
    ctx.fillRect(h+5, h-4, 4, 4)
  } else if (type === 'flag') {
    ctx.fillRect(h-2, 3, 3, s-6)
    ctx.beginPath()
    ctx.moveTo(h+1, 3); ctx.lineTo(s-3, h-3); ctx.lineTo(h+1, h-1)
    ctx.fill()
  } else if (type === 'vote') {
    ctx.strokeStyle = color; ctx.lineWidth = 2.5
    ctx.strokeRect(4, h, s-8, s/2-2)
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(h-4, h-4); ctx.lineTo(h, h-8); ctx.lineTo(h+5, h-2)
    ctx.stroke()
    ctx.fillRect(h-4, h, 8, 2.5)
  } else if (type === 'wall') {
    ctx.fillRect(3, h-2, s-6, s/2-1)
    ctx.strokeStyle = C.bg; ctx.lineWidth = 1.5
    ctx.strokeRect(3, h-2, s-6, s/2-1)
    ctx.strokeRect(3, h+4, s/2-3, s/2-7)
    ctx.strokeRect(h, h+4, s/2-3, s/2-7)
    ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(h, h-2); ctx.lineTo(h-3, h+3); ctx.lineTo(h+2, h+8); ctx.lineTo(h-1, h+s/2-1)
    ctx.stroke()
  } else if (type === 'eagle') {
    ctx.beginPath()
    ctx.ellipse(h, h, 5, 7, 0, 0, Math.PI*2)
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(h, h-2); ctx.lineTo(3, h-8); ctx.lineTo(h-2, h-4)
    ctx.moveTo(h, h-2); ctx.lineTo(s-3, h-8); ctx.lineTo(h+2, h-4)
    ctx.fill()
  } else {
    ctx.beginPath(); ctx.arc(h, h, h-3, 0, Math.PI*2); ctx.fill()
  }
  return cv
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@300;400&family=Lato:ital,wght@0,300;0,400;0,700;1,300&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

@keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeIn   { from{opacity:0} to{opacity:1} }
@keyframes chapterIn{ from{opacity:0;transform:translateY(18px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
@keyframes breathe  { 0%,100%{opacity:0.03} 50%{opacity:0.065} }
@keyframes markerPop{ 0%{transform:translate(-50%,-50%) scale(0)} 70%{transform:translate(-50%,-50%) scale(1.2)} 100%{transform:translate(-50%,-50%) scale(1)} }
@keyframes ringOut  { 0%{opacity:0.65;transform:translate(-50%,-50%) scale(0.5)} 100%{opacity:0;transform:translate(-50%,-50%) scale(1.9)} }
@keyframes ringPulse { 0%{opacity:0.6;transform:translate(-50%,-50%) scale(0.5)} 100%{opacity:0;transform:translate(-50%,-50%) scale(2.2)} }
@keyframes eventSlide { from{opacity:0;transform:translateX(-18px)} to{opacity:1;transform:translateX(0)} }
@keyframes countUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
@keyframes labelPop { from{opacity:0;transform:translateX(-50%) translateY(4px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
@keyframes ambientPop { 0%{opacity:0;transform:scale(0.6)} 70%{opacity:1;transform:scale(1.1)} 100%{opacity:1;transform:scale(1)} }

.chapter-panel { animation: chapterIn 0.7s cubic-bezier(0.25,0.46,0.45,0.94) both; }
.event-banner  { animation: eventSlide 0.5s cubic-bezier(0.22,1,0.36,1) both; }
.marker-wrap   { animation: markerPop 0.45s cubic-bezier(0.34,1.56,0.64,1) both; }
.ring-anim     { animation: ringOut 1.8s ease-out infinite; }
.label-pop     { animation: labelPop 0.35s ease both; }
.ambient-wrap  { animation: ambientPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
.mapboxgl-ctrl-bottom-left,.mapboxgl-ctrl-bottom-right,.mapboxgl-ctrl-attrib{display:none!important;}

.hover-card {
  position: fixed; pointer-events: none; z-index: 200;
  background: rgba(240,234,216,0.97);
  border: 1px solid rgba(168,152,128,0.45);
  padding: 14px 18px; min-width: 210px;
  backdrop-filter: blur(10px);
  box-shadow: 0 6px 32px rgba(42,34,24,0.12);
  animation: fadeUp 0.18s ease-out both;
}
.regime-dot {
  display: inline-block; width: 9px; height: 9px;
  border-radius: 50%; margin-right: 6px; flex-shrink: 0;
  vertical-align: middle;
}
.ctrl-btn {
  background: rgba(240,234,216,0.92);
  border: 1px solid rgba(168,152,128,0.35);
  color: ${C.inkMuted};
  font-family: 'DM Mono', monospace; font-size: 8.5px;
  letter-spacing: 0.14em; padding: 6px 12px;
  cursor: pointer; transition: all 0.2s; text-transform: uppercase;
}
.ctrl-btn:hover  { background: rgba(42,34,24,0.08); color: ${C.ink}; }
.ctrl-btn.active { background: ${C.ink}; color: #F0EAD8; border-color: ${C.ink}; }
.timeline-track {
  position: relative; height: 3px;
  background: rgba(168,152,128,0.25); border-radius: 2px; cursor: pointer;
}
.tl-fill {
  position: absolute; left: 0; top: 0; height: 100%;
  background: ${C.ink}; border-radius: 2px; transition: width 0.1s linear;
}
.tl-thumb {
  position: absolute; top: 50%; width: 10px; height: 10px;
  border-radius: 50%; background: ${C.ink};
  transform: translate(-50%,-50%); transition: left 0.1s linear; cursor: grab;
}
.evt-pip {
  position: absolute; top: 50%; width: 7px; height: 7px;
  border-radius: 50%; transform: translate(-50%,-50%);
  cursor: pointer; z-index: 2; transition: transform 0.2s;
  border: 1.5px solid rgba(240,234,216,0.8);
}
.evt-pip:hover { transform: translate(-50%,-50%) scale(1.7); }
`

// ─── Event Banner ─────────────────────────────────────────────────────────────
const EventBanner = ({ event, onDismiss }) => (
  <div className="event-banner" style={{
    position:'fixed', top:68, left:'50%', transform:'translateX(-50%)',
    zIndex:60, background:'rgba(240,234,216,0.97)',
    border:'1px solid rgba(168,152,128,0.4)',
    backdropFilter:'blur(12px)', padding:'12px 20px',
    maxWidth:440, display:'flex', gap:14, alignItems:'flex-start',
    boxShadow:'0 4px 24px rgba(42,34,24,0.1)',
  }}>
    <div style={{
      width:40, height:40, flexShrink:0,
      background:`${C.ink}0E`, border:'1px solid rgba(168,152,128,0.3)',
      display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
    }}>
      <div style={{ fontSize:16, lineHeight:1 }}>{event.icon}</div>
      <div style={{
        fontFamily:"'DM Mono', monospace", fontSize:7,
        color:C.inkMuted, letterSpacing:'0.08em', marginTop:2,
      }}>{event.year}</div>
    </div>
    <div style={{ flex:1 }}>
      <div style={{
        fontFamily:"'Playfair Display', serif",
        fontSize:14, fontWeight:700, color:C.ink, marginBottom:3,
      }}>{event.title}</div>
      <p style={{
        fontFamily:"'Lato', sans-serif",
        fontSize:11, color:C.inkMuted, lineHeight:1.65, fontWeight:300,
      }}>{event.desc}</p>
    </div>
    <button onClick={onDismiss} style={{
      background:'none', border:'none', cursor:'pointer',
      color:C.inkLight, fontSize:15, flexShrink:0, padding:'2px 4px',
    }}>×</button>
  </div>
)

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const PoliticalDnaMap = () => {
  const mapEl      = useRef(null)
  const mapRef     = useRef(null)
  const animRef    = useRef(null)
  const markers    = useRef([])
  const arcSources = useRef([])
  const arcFrames  = useRef([])
  const timers     = useRef([])
  const shownEvts  = useRef(new Set())
  const yearRef    = useRef(1900)
  const playRef    = useRef(true)
  const speedRef   = useRef(1)
  const tlRef      = useRef(null)
  const navigate   = useNavigate()

  const [ready,       setReady]       = useState(false)
  const [loaded,      setLoaded]      = useState(false)
  const [year,        setYear]        = useState(1900)
  const [playing,     setPlaying]     = useState(true)
  const [chIdx,       setChIdx]       = useState(0)
  const [panelKey,    setPanelKey]    = useState(0)
  const [activeEvent, setActiveEvent] = useState(null)
  const [hoverData,   setHoverData]   = useState(null)
  const [showLegend,  setShowLegend]  = useState(false)
  const [speed,       setSpeed]       = useState(1)

  useEffect(() => { yearRef.current  = year  }, [year])
  useEffect(() => { playRef.current  = playing }, [playing])
  useEffect(() => { speedRef.current = speed }, [speed])

  const ch = CHAPTERS[chIdx]

  // ── Clear all overlays ────────────────────────────────────────────────────────
  const clearOverlays = useCallback(() => {
    arcFrames.current.forEach(cancelAnimationFrame)
    arcFrames.current = []
    timers.current.forEach(clearTimeout)
    timers.current = []
    markers.current.forEach(m => m.remove())
    markers.current = []
    if (mapRef.current) {
      arcSources.current.forEach(id => {
        try { mapRef.current.removeLayer(id+'-glow') } catch(_) {}
        try { mapRef.current.removeLayer(id+'-line') } catch(_) {}
        try { mapRef.current.removeSource(id) } catch(_) {}
      })
    }
    arcSources.current = []
  }, [])

  // ── Draw an icon marker on the map ────────────────────────────────────────────
  // Fixed-size container (120×52px), anchor:'bottom'.
  // The bottom-center of the container = the pulse dot = icon.ll on the map.
  // All children are position:absolute inside so Mapbox always measures the
  // same bounding box, and 'bottom' anchor math is predictable.
  //   top 0–22px:  pill label (centered)
  //   22–30px:     stem line
  //   38–52px:     pulse dot + rings  ← bottom edge = coordinate
  const drawIcon = useCallback((icon, map, delay = 0) => {
    const tid = setTimeout(() => {
      if (!map) return

      const wrap = document.createElement('div')
      wrap.style.cssText = `
        position: relative;
        width: 120px; height: 52px;
        cursor: default; pointer-events: none;
      `

      // Pill — centered top
      const pill = document.createElement('div')
      pill.style.cssText = `
        position: absolute; top: 0; left: 50%;
        transform: translateX(-50%);
        display: flex; align-items: center; gap: 5px;
        background: rgba(240,234,216,0.96);
        border: 1.5px solid ${icon.color};
        border-radius: 3px; padding: 4px 7px 4px 5px;
        box-shadow: 0 2px 10px rgba(42,34,24,0.18), 0 0 0 3px ${icon.color}18;
        white-space: nowrap;
        animation: fadeUp 0.35s ease both;
      `
      const dot = document.createElement('div')
      dot.style.cssText = `width:7px;height:7px;border-radius:50%;background:${icon.color};flex-shrink:0;`
      pill.appendChild(dot)
      if (icon.label) {
        const lbl = document.createElement('span')
        lbl.style.cssText = `font-family:'DM Mono',monospace;font-size:7px;color:${icon.color};
          letter-spacing:0.1em;text-transform:uppercase;line-height:1;font-weight:400;`
        lbl.textContent = icon.label
        pill.appendChild(lbl)
      }
      wrap.appendChild(pill)

      // Stem
      const stem = document.createElement('div')
      stem.style.cssText = `
        position: absolute; top: 22px; left: 50%;
        transform: translateX(-50%);
        width: 1.5px; height: 16px;
        background: ${icon.color}; opacity: 0.4;
      `
      wrap.appendChild(stem)

      // Pulse dot + rings at bottom
      const pulse = document.createElement('div')
      pulse.style.cssText = `
        position: absolute; bottom: 0; left: 50%;
        transform: translateX(-50%);
        width: 14px; height: 14px;
      `
      const center = document.createElement('div')
      center.style.cssText = `
        position:absolute;top:50%;left:50%;
        transform:translate(-50%,-50%);
        width:6px;height:6px;border-radius:50%;
        background:${icon.color};
      `
      pulse.appendChild(center)
      ;[0, 700].forEach(rd => {
        const ring = document.createElement('div')
        ring.style.cssText = `
          position:absolute;top:50%;left:50%;
          transform:translate(-50%,-50%) scale(0.5);
          width:14px;height:14px;border-radius:50%;
          border:1.5px solid ${icon.color};
          animation:ringPulse 1.6s ease-out ${rd}ms infinite;
          opacity:0;
        `
        pulse.appendChild(ring)
      })
      wrap.appendChild(pulse)

      const mk = new mapboxgl.Marker({ element: wrap, anchor: 'bottom' })
        .setLngLat(icon.ll)
        .addTo(map)
      markers.current.push(mk)

      const checkIconEdge = () => {
        if (!map) return
        const pt = map.project(icon.ll)
        const w = map.getCanvas().width, h = map.getCanvas().height
        wrap.style.visibility = (pt.x < 20 || pt.x > w - 20 || pt.y < 60 || pt.y > h - 80)
          ? 'hidden' : 'visible'
      }
      requestAnimationFrame(checkIconEdge)
      map.on('move', checkIconEdge)
    }, delay)
    timers.current.push(tid)
  }, [])


  // ── Draw ambient world-pulse marker ──────────────────────────────────────────
  // Just a 10×10px pulsing dot at the coordinate. anchor:'center' means the
  // dot center = item.ll exactly. Label shown on hover via a fixed-position
  // element appended to document.body (never affects marker bounding box).
  const drawAmbientIcon = useCallback((item, map, delay = 0) => {
    const tid = setTimeout(() => {
      if (!map) return

      const dot = document.createElement('div')
      dot.style.cssText = `
        width:10px; height:10px; border-radius:50%;
        background:${item.color}; opacity:0.75;
        cursor:pointer; pointer-events:all;
        box-shadow:0 0 0 2px ${item.color}30;
        animation:ambientPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
        position:relative; transition:opacity 0.15s, transform 0.15s;
      `

      const ring = document.createElement('div')
      ring.style.cssText = `
        position:absolute; top:50%; left:50%;
        transform:translate(-50%,-50%) scale(0.5);
        width:10px; height:10px; border-radius:50%;
        border:1px solid ${item.color};
        animation:ringPulse 2s ease-out 0.3s infinite; opacity:0;
      `
      dot.appendChild(ring)

      // Floating label detached from marker DOM — no impact on anchor math
      const floatLabel = document.createElement('div')
      floatLabel.style.cssText = `
        position:fixed; z-index:300;
        background:rgba(240,234,216,0.97);
        border:1px solid ${item.color}99;
        border-radius:2px; padding:4px 8px;
        font-family:'DM Mono',monospace; font-size:7px;
        color:${item.color}; letter-spacing:0.1em;
        text-transform:uppercase; white-space:nowrap;
        pointer-events:none; display:none;
        box-shadow:0 2px 8px rgba(42,34,24,0.12);
        transform:translateX(-50%);
      `
      floatLabel.textContent = item.label
      document.body.appendChild(floatLabel)

      dot.onmouseenter = () => {
        dot.style.opacity = '1'
        dot.style.transform = 'scale(1.5)'
        const r = dot.getBoundingClientRect()
        floatLabel.style.left = `${r.left + r.width/2}px`
        floatLabel.style.top  = `${r.top - 26}px`
        floatLabel.style.display = 'block'
      }
      dot.onmouseleave = () => {
        dot.style.opacity = '0.75'
        dot.style.transform = 'scale(1)'
        floatLabel.style.display = 'none'
      }

      const mk = new mapboxgl.Marker({ element: dot, anchor: 'center' })
        .setLngLat(item.ll)
        .addTo(map)
      markers.current.push(mk)
      markers.current.push({ remove: () => floatLabel.remove() })

      const checkEdge = () => {
        if (!map) return
        const pt = map.project(item.ll)
        const cw = map.getCanvas().width, ch = map.getCanvas().height
        dot.style.visibility = (pt.x < 4 || pt.x > cw - 4 || pt.y < 56 || pt.y > ch - 76)
          ? 'hidden' : 'visible'
      }
      requestAnimationFrame(checkEdge)
      map.on('move', checkEdge)
    }, delay)
    timers.current.push(tid)
  }, [])

    // ── Animate an arc flow ───────────────────────────────────────────────────────
  const animateArc = useCallback((flow, map, delay = 0, idx = 0) => {
    const srcId = `arc-${Date.now()}-${idx}`
    arcSources.current.push(srcId)

    const tid = setTimeout(() => {
      if (!map) return
      const { from, to, color } = flow
      const cp = arcCP(from, to)

      try {
        map.addSource(srcId, { type:'geojson', data:{ type:'Feature', geometry:{ type:'LineString', coordinates:[from] } } })
        map.addLayer({ id:srcId+'-glow', type:'line', source:srcId, paint:{ 'line-color':color, 'line-width':8, 'line-opacity':0.12, 'line-blur':8 } })
        map.addLayer({ id:srcId+'-line', type:'line', source:srcId, paint:{ 'line-color':color, 'line-width':1.8, 'line-opacity':0.75 } })
      } catch(_) { return }

      const dotEl = document.createElement('div')
      dotEl.style.cssText = `width:8px;height:8px;border-radius:50%;background:${color};
        box-shadow:0 0 10px ${color},0 0 20px ${color}55;pointer-events:none;opacity:0;transition:opacity 0.3s;`
      const dotMk = new mapboxgl.Marker({ element:dotEl, anchor:'center' }).setLngLat(from).addTo(map)
      markers.current.push(dotMk)

      let t = 0; const TOTAL = 90
      const step = () => {
        if (!map) return
        t++
        if (t > TOTAL + 30) { dotEl.style.opacity = '0'; return }
        const pt = bezierPt(from, to, cp, Math.min(t / TOTAL, 1))
        dotMk.setLngLat(pt)
        dotEl.style.opacity = t < 5 ? (t/5).toString() : t > TOTAL ? ((TOTAL+30-t)/30).toString() : '0.95'
        const pts = []; for (let i = 0; i <= Math.min(t, TOTAL); i++) pts.push(bezierPt(from, to, cp, i/TOTAL))
        try { map.getSource(srcId)?.setData({ type:'Feature', geometry:{ type:'LineString', coordinates:pts } }) } catch(_) {}
        arcFrames.current.push(requestAnimationFrame(step))
      }
      arcFrames.current.push(requestAnimationFrame(step))
    }, delay)
    timers.current.push(tid)
  }, [])

  // ── Apply chapter visuals ─────────────────────────────────────────────────────
  const applyChapter = useCallback((ci) => {
    const chapter = CHAPTERS[ci]
    if (!mapRef.current || !loaded) return
    clearOverlays()

    mapRef.current.flyTo({
      center: chapter.mapCenter, zoom: chapter.mapZoom,
      duration: 2600, easing: t => t<0.5?2*t*t:-1+(4-2*t)*t,
    })

    chapter.icons?.forEach((icon, i) => {
      drawIcon(icon, mapRef.current, 600 + i * 250)
    })

    chapter.flows?.forEach((flow, i) => {
      animateArc(flow, mapRef.current, 800 + i * 400, i)
    })

    const pulseItems = WORLD_PULSE.filter(p => p.era === chapter.id)
    pulseItems.forEach((item, i) => {
      drawAmbientIcon(item, mapRef.current, 1200 + i * 180)
    })
  }, [loaded, clearOverlays, drawIcon, drawAmbientIcon, animateArc])

  // ── Init Mapbox ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapEl.current || mapEl.current._pdnaInit) return
    mapEl.current._pdnaInit = true
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

    const map = new mapboxgl.Map({
      container: mapEl.current, style: MAP_STYLE,
      center: [15.0, 25.0], zoom: 1.8,
      minZoom: 1.2, maxZoom: 8,
      attributionControl: false,
      projection: 'mercator',
    })
    mapRef.current = map

    map.on('load', () => {
      map.getStyle().layers.forEach(layer => {
        try {
          const id = layer.id, t = layer.type
          if (id === 'background' && t === 'background') map.setPaintProperty(id, 'background-color', C.bg)
          if (id.includes('water') && t === 'fill')       map.setPaintProperty(id, 'fill-color', C.ocean)
          if (id.includes('land') && t === 'fill' && !id.includes('label')) map.setPaintProperty(id, 'fill-color', C.land)
          if (id.includes('admin') && t === 'line') {
            map.setPaintProperty(id, 'line-color', C.border)
            map.setPaintProperty(id, 'line-opacity', 0.45)
            map.setPaintProperty(id, 'line-width', id.includes('-0-') ? 0.7 : 0.3)
          }
          if (id.includes('road') && t === 'line') map.setPaintProperty(id, 'line-opacity', 0)
          if (t === 'symbol') map.setLayoutProperty(id, 'visibility', 'none')
        } catch(_) {}
      })

      try {
        map.addSource('countries', { type:'vector', url:'mapbox://mapbox.country-boundaries-v1' })

        map.addLayer({
          id: 'regime-fill', type: 'fill',
          source: 'countries', 'source-layer': 'country_boundaries',
          paint: {
            'fill-color': buildColorExpr(1900),
            'fill-opacity': ['interpolate',['linear'],['zoom'], 1.5,0.72, 6,0.62],
          },
        }, 'waterway-label')

        map.addLayer({
          id: 'regime-stroke', type: 'line',
          source: 'countries', 'source-layer': 'country_boundaries',
          paint: { 'line-color': C.border, 'line-width': 0.4, 'line-opacity': 0.35 },
        })

        map.addLayer({
          id: 'regime-hover', type: 'fill',
          source: 'countries', 'source-layer': 'country_boundaries',
          paint: { 'fill-color': C.ink, 'fill-opacity': 0 },
          filter: ['==', ['get', 'iso_3166_1_alpha_3'], ''],
        })

        map.on('mousemove', 'regime-fill', e => {
          if (!e.features?.length) return
          const iso3 = e.features[0].properties?.iso_3166_1_alpha_3
          const name = e.features[0].properties?.name_en
          map.setFilter('regime-hover', ['==', ['get','iso_3166_1_alpha_3'], iso3||''])
          map.setPaintProperty('regime-hover', 'fill-opacity', 0.1)
          map.getCanvas().style.cursor = 'pointer'
          const eraYear = getNearestEraYear(yearRef.current)
          const entry = (POLITICAL_ERAS[eraYear]||[]).find(([id]) => id === iso3)
          setHoverData(entry
            ? { name: entry[2]||name, iso3, system: entry[1], x: e.originalEvent.clientX+14, y: e.originalEvent.clientY-10 }
            : { name, iso3, system: null, x: e.originalEvent.clientX+14, y: e.originalEvent.clientY-10 }
          )
        })
        map.on('mouseleave', 'regime-fill', () => {
          map.setFilter('regime-hover', ['==', ['get','iso_3166_1_alpha_3'], ''])
          map.setPaintProperty('regime-hover', 'fill-opacity', 0)
          map.getCanvas().style.cursor = ''
          setHoverData(null)
        })
      } catch(e) { console.warn('Layer error:', e) }

      setReady(true)
      setTimeout(() => { setLoaded(true); map.resize() }, 100)
    })

    return () => {
      clearOverlays()
      map.remove()
      mapRef.current = null
      if (mapEl.current) mapEl.current._pdnaInit = false
    }
  }, [])

  // ── Apply chapter when loaded ────────────────────────────────────────────────
  useEffect(() => {
    if (loaded) { setTimeout(() => applyChapter(0), 400) }
  }, [loaded])

  // ── Update fill colors as year changes ────────────────────────────────────────
  useEffect(() => {
    if (!ready || !mapRef.current) return
    try { mapRef.current.setPaintProperty('regime-fill', 'fill-color', buildColorExpr(year)) } catch(_) {}
  }, [ready, year])

  // ── Sync chapter with year ────────────────────────────────────────────────────
  useEffect(() => {
    for (let i = CHAPTERS.length - 1; i >= 0; i--) {
      if (year >= CHAPTERS[i].year) {
        if (i !== chIdx) {
          setChIdx(i); setPanelKey(k => k+1)
          if (loaded) setTimeout(() => applyChapter(i), 200)
        }
        break
      }
    }
  }, [Math.floor(year / 3)])

  // ── Show event banners ────────────────────────────────────────────────────────
  useEffect(() => {
    const evt = EVENTS.find(e => Math.abs(e.year - year) < 0.8 && !shownEvts.current.has(e.id))
    if (!evt) return
    shownEvts.current.add(evt.id)
    setActiveEvent(evt)
    mapRef.current?.flyTo({ center: evt.center, zoom: evt.zoom, duration: 2200 })
    const t = setTimeout(() => setActiveEvent(null), 7000)
    return () => clearTimeout(t)
  }, [Math.floor(year)])

  // ── Main animation loop ───────────────────────────────────────────────────────
  const YEARS_PER_MS = 126 / (DUR_PER_CHAPTER * CHAPTERS.length)
  useEffect(() => {
    if (!playing) return
    let last = null
    const tick = ts => {
      if (!last) last = ts
      const dt = ts - last; last = ts
      const ny = Math.min(2026, yearRef.current + dt * YEARS_PER_MS * speedRef.current)
      if (ny >= 2026) { setYear(2026); setPlaying(false); return }
      setYear(ny)
      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [playing, speed])

  // ── Keyboard ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = e => {
      if (e.key === ' ')          { setPlaying(p => !p); e.preventDefault() }
      if (e.key === 'ArrowRight') setYear(y => Math.min(2026, Math.round(y) + 5))
      if (e.key === 'ArrowLeft')  setYear(y => Math.max(1900, Math.round(y) - 5))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ── Timeline click ────────────────────────────────────────────────────────────
  const onTlClick = useCallback(e => {
    if (!tlRef.current) return
    const r = tlRef.current.getBoundingClientRect()
    const p = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width))
    setYear(Math.round(1900 + p * 126))
  }, [])

  const displayYear = Math.round(year)
  const progress    = yearToProgress(year)

  const dStats = [...DEMOCRACY_ARC].reverse().find(d => d.year <= displayYear) || DEMOCRACY_ARC[0]

  // ─── UI ───────────────────────────────────────────────────────────────────────
  return (
    <div style={{ position:'fixed', inset:0, background:C.bg, overflow:'hidden', fontFamily:"'Lato', sans-serif" }}>
      <style>{CSS}</style>

      {/* MAP */}
      <div ref={mapEl} style={{ position:'absolute', inset:0, width:'100%', height:'100%', overflow:'hidden' }} />

      {/* Soft vignette */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:2,
        background:`radial-gradient(ellipse at center, transparent 50%, rgba(210,200,180,0.18) 100%)` }} />

      {/* Year watermark */}
      <div style={{ position:'fixed', bottom:88, right:36,
        fontFamily:"'Playfair Display', serif",
        fontSize:'clamp(88px,13vw,170px)', fontWeight:700, fontStyle:'italic',
        color:C.ink, opacity:0.035, pointerEvents:'none', zIndex:3,
        userSelect:'none', animation:'breathe 8s ease-in-out infinite', lineHeight:1,
      }}>
        {displayYear}
      </div>

      {/* ── EVENT BANNER ── */}
      {activeEvent && <EventBanner event={activeEvent} onDismiss={() => setActiveEvent(null)} />}

      {/* ── TOP BAR ── */}
      <div style={{
        position:'fixed', top:0, left:0, right:0, zIndex:50,
        background:'rgba(240,234,216,0.96)', borderBottom:'1px solid rgba(168,152,128,0.3)',
        backdropFilter:'blur(8px)', display:'flex', alignItems:'center',
        justifyContent:'space-between', padding:'0 28px', height:52,
      }}>
        <button onClick={() => navigate('/maps')} style={{
          background:'none', border:'none', cursor:'pointer',
          fontFamily:"'DM Mono', monospace", fontSize:9,
          color:C.inkMuted, letterSpacing:'0.2em', transition:'color 0.2s',
        }} onMouseEnter={e=>e.currentTarget.style.color=C.ink} onMouseLeave={e=>e.currentTarget.style.color=C.inkMuted}>
          ← ANIMATED MAPS
        </button>

        <div style={{ textAlign:'center' }}>
          <div style={{ fontFamily:"'Playfair Display', serif", fontSize:14, color:C.ink, fontWeight:400, letterSpacing:'0.02em', lineHeight:1 }}>
            The Political DNA of the World
          </div>
          <div style={{ fontFamily:"'DM Mono', monospace", fontSize:8, color:C.inkMuted, letterSpacing:'0.18em', marginTop:3, textTransform:'uppercase' }}>
            1900–2026 · How Governments Evolved
          </div>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <button className={`ctrl-btn ${showLegend?'active':''}`} onClick={() => setShowLegend(s=>!s)}>Legend</button>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontFamily:"'Playfair Display', serif", fontSize:18, color:C.ink, fontStyle:'italic', lineHeight:1 }}>
              {displayYear}
            </div>
            <div style={{ fontFamily:"'DM Mono', monospace", fontSize:7, color:C.inkMuted, letterSpacing:'0.12em', marginTop:1 }}>
              {ch.badge}
            </div>
          </div>
        </div>
      </div>

      {/* ── LEGEND ── */}
      {showLegend && (
        <div style={{
          position:'fixed', top:64, right:24, zIndex:50,
          background:'rgba(240,234,216,0.95)', border:'1px solid rgba(168,152,128,0.3)',
          backdropFilter:'blur(10px)', padding:'14px 16px',
          maxHeight:'260px', overflowY:'auto', minWidth:178,
          animation:'fadeIn 0.3s ease both',
        }}>
          <div style={{ fontFamily:"'DM Mono', monospace", fontSize:7.5, letterSpacing:'0.2em', color:C.inkMuted, textTransform:'uppercase', marginBottom:10 }}>
            Political System
          </div>
          {Object.entries(REGIME_LABELS).map(([key, label], i) => (
            <div key={key} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5.5, animationDelay:`${i*0.03}s` }}>
              <div style={{ width:10, height:10, flexShrink:0, background:C[key], opacity:0.85 }} />
              <span style={{ fontFamily:"'DM Mono', monospace", fontSize:8, color:C.inkMuted, letterSpacing:'0.04em' }}>{label}</span>
            </div>
          ))}

          <div style={{ marginTop:12, borderTop:'1px solid rgba(168,152,128,0.2)', paddingTop:10 }}>
            <div style={{ fontFamily:"'DM Mono', monospace", fontSize:7, color:C.inkMuted, letterSpacing:'0.15em', marginBottom:6, textTransform:'uppercase' }}>
              {displayYear} snapshot
            </div>
            {[
              ['Democracies', dStats.democracies, C.liberalDem],
              ['Autocracies', dStats.autocracies, C.authoritarian],
              ['Transitional', dStats.transitional, C.transitional],
            ].map(([label, val, color]) => (
              <div key={label} style={{ marginBottom:5 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}>
                  <span style={{ fontFamily:"'DM Mono', monospace", fontSize:7, color:C.inkMuted }}>{label}</span>
                  <span style={{ fontFamily:"'Playfair Display', serif", fontSize:11, color, fontStyle:'italic' }}>{val}</span>
                </div>
                <div style={{ height:4, background:'rgba(168,152,128,0.15)', borderRadius:2 }}>
                  <div style={{ height:'100%', width:`${(val/195)*100}%`, background:color, borderRadius:2, opacity:0.8, transition:'width 0.6s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CHAPTER PANEL ── */}
      <div key={`panel-${panelKey}`} className="chapter-panel" style={{
        position:'fixed',
        bottom:96, right:24,
        zIndex:50,
        width:300,
        maxWidth:'calc(100vw - 48px)',
        maxHeight:'calc(100vh - 64px - 96px - 16px)',
        overflowY:'auto',
        background:'rgba(240,234,216,0.97)',
        border:'1px solid rgba(168,152,128,0.3)',
        backdropFilter:'blur(14px)',
        padding:'16px 18px',
        boxShadow:'0 4px 24px rgba(42,34,24,0.1)',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
          <div style={{ width:12, height:1, background:C.inkMuted, flexShrink:0 }} />
          <span style={{
            fontFamily:"'DM Mono', monospace", fontSize:7,
            color:C.inkMuted, letterSpacing:'0.22em', textTransform:'uppercase',
          }}>
            {ch.badge} · {ch.era}
          </span>
        </div>

        <div style={{
          fontFamily:"'Playfair Display', serif",
          fontSize:18, fontWeight:700, color:C.ink,
          lineHeight:1.2, marginBottom:4,
        }}>
          {ch.title}
        </div>

        <div style={{
          fontFamily:"'Lato', sans-serif", fontSize:10, fontStyle:'italic',
          color:C.inkMuted, marginBottom:10, lineHeight:1.5,
        }}>
          {ch.subtitle}
        </div>

        <div style={{ width:22, height:1, background:'rgba(168,152,128,0.4)', marginBottom:10 }} />

        <p style={{
          fontFamily:"'Lato', sans-serif",
          fontSize:11, lineHeight:1.75, color:C.ink,
          fontWeight:300, marginBottom:10,
        }}>
          {ch.body}
        </p>

        {ch.quote && (
          <div style={{
            borderLeft:'2px solid rgba(168,152,128,0.4)',
            paddingLeft:9, marginBottom:12,
          }}>
            <p style={{
              fontFamily:"'Playfair Display', serif",
              fontSize:10.5, fontStyle:'italic',
              color:C.inkMuted, lineHeight:1.6,
            }}>
              "{ch.quote}"
            </p>
            {ch.quoteAuthor && (
              <p style={{
                fontFamily:"'DM Mono', monospace",
                fontSize:7.5, color:C.inkLight,
                letterSpacing:'0.1em', marginTop:3,
              }}>
                — {ch.quoteAuthor}
              </p>
            )}
          </div>
        )}

        <div style={{
          display:'flex', alignItems:'baseline', gap:7,
          borderTop:'1px solid rgba(168,152,128,0.18)',
          paddingTop:10,
        }}>
          <span style={{
            fontFamily:"'Playfair Display', serif",
            fontSize:26, fontWeight:700, fontStyle:'italic',
            color:C.ink, lineHeight:1,
          }}>
            {ch.statsValue}
          </span>
          <span style={{
            fontFamily:"'DM Mono', monospace",
            fontSize:7.5, color:C.inkMuted,
            letterSpacing:'0.1em', textTransform:'uppercase',
            lineHeight:1.3,
          }}>
            {ch.statsLabel}
          </span>
        </div>
      </div>

      {/* ── HOVER CARD ── */}
      {hoverData && (
        <div className="hover-card" style={{ left:hoverData.x, top:hoverData.y }}>
          <div style={{ fontFamily:"'Playfair Display', serif", fontSize:14, fontWeight:700, color:C.ink, marginBottom:6 }}>
            {hoverData.name}
          </div>
          {hoverData.system ? (
            <div style={{ display:'flex', alignItems:'center', gap:0 }}>
              <div className="regime-dot" style={{ background:C[hoverData.system] }} />
              <span style={{ fontFamily:"'DM Mono', monospace", fontSize:8.5, color:C[hoverData.system], letterSpacing:'0.08em' }}>
                {REGIME_LABELS[hoverData.system]}
              </span>
            </div>
          ) : (
            <span style={{ fontFamily:"'DM Mono', monospace", fontSize:8, color:C.inkLight }}>No data for this period</span>
          )}
          <div style={{ fontFamily:"'DM Mono', monospace", fontSize:7.5, color:C.inkLight, letterSpacing:'0.1em', marginTop:6 }}>
            Snapshot year: {getNearestEraYear(displayYear)}
          </div>
        </div>
      )}

      {/* ── TIMELINE ── */}
      <div style={{
        position:'fixed', bottom:0, left:0, right:0, zIndex:50,
        background:'rgba(240,234,216,0.97)',
        borderTop:'1px solid rgba(168,152,128,0.3)',
        backdropFilter:'blur(8px)', padding:'10px 28px 14px',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8, flexWrap:'wrap' }}>
          <button className={`ctrl-btn ${playing?'active':''}`} onClick={() => setPlaying(p=>!p)} style={{ minWidth:68 }}>
            {playing ? '⏸ Pause' : '▶ Play'}
          </button>
          <button className="ctrl-btn" onClick={() => { setYear(1900); shownEvts.current.clear(); setPlaying(true) }}>
            ↺ Restart
          </button>
          <div style={{ display:'flex', gap:4, alignItems:'center' }}>
            <span style={{ fontFamily:"'DM Mono', monospace", fontSize:8, color:C.inkMuted, letterSpacing:'0.1em' }}>SPEED</span>
            {[0.5,1,2,4].map(s => (
              <button key={s} className={`ctrl-btn ${speed===s?'active':''}`}
                onClick={() => setSpeed(s)} style={{ padding:'5px 9px', fontSize:8 }}>{s}×</button>
            ))}
          </div>
          <div style={{ display:'flex', gap:4, marginLeft:'auto', flexWrap:'wrap' }}>
            {CHAPTERS.map((c,i) => (
              <button key={c.id} className={`ctrl-btn ${i===chIdx?'active':''}`}
                onClick={() => { setYear(c.year); setPlaying(true) }}
                style={{ padding:'5px 10px', fontSize:7 }} title={c.title}>
                {c.year}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
          {[1900,1920,1938,1950,1965,1980,1995,2010,2026].map(y => (
            <span key={y} style={{
              fontFamily:"'DM Mono', monospace", fontSize:7.5,
              color: Math.abs(displayYear-y) < 4 ? C.ink : C.inkLight,
              letterSpacing:'0.08em', transition:'color 0.3s',
            }}>{y}</span>
          ))}
        </div>

        <div ref={tlRef} className="timeline-track" onClick={onTlClick}>
          <div className="tl-fill" style={{ width:`${progress*100}%` }} />
          {EVENTS.map(evt => (
            <div key={evt.id} className="evt-pip"
              title={`${evt.year}: ${evt.title}`}
              style={{ left:`${yearToProgress(evt.year)*100}%`, background:C.authoritarian }}
              onClick={e => {
                e.stopPropagation()
                setYear(evt.year)
                setActiveEvent(evt)
                mapRef.current?.flyTo({ center:evt.center, zoom:evt.zoom, duration:2000 })
              }}
            />
          ))}
          <div className="tl-thumb" style={{ left:`${progress*100}%` }} />
        </div>

        <div style={{ display:'flex', justifyContent:'space-between', marginTop:5 }}>
          {CHAPTERS.map((c,i) => (
            <span key={c.id} style={{
              fontFamily:"'DM Mono', monospace", fontSize:6.5,
              color: i===chIdx ? C.ink : C.inkLight,
              letterSpacing:'0.06em', textTransform:'uppercase', transition:'color 0.3s',
            }}>
              {c.title.split(' ').slice(0,2).join(' ')}
            </span>
          ))}
        </div>
      </div>

      {year < 1902 && (
        <div style={{
          position:'fixed', bottom:100, left:'50%', transform:'translateX(-50%)',
          zIndex:40, fontFamily:"'DM Mono', monospace", fontSize:8,
          color:C.inkMuted, letterSpacing:'0.18em',
          animation:'fadeIn 2s ease 2.5s both', pointerEvents:'none',
        }}>
          SPACE TO PAUSE · ← → SCRUB · CLICK EVENTS ON TIMELINE
        </div>
      )}
    </div>
  )
}

export default PoliticalDnaMap