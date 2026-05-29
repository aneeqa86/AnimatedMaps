// src/pages/maps/HajjMap.jsx
// REDESIGN: RAFCE · autoplay on · vivid route colors · Kaaba icon · max animation
import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import mapboxgl from 'mapbox-gl'
import {
  CHAPTERS, ANCIENT_ROUTES, SEA_ROUTES, AIR_ROUTES, WAYPOINTS, MECCA
} from '@/data/hajjMap'

// ─── Fonts ───────────────────────────────────────────────────────────────────
const FONTS_URL = "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;900&family=Lora:ital,wght@0,400;0,600;1,400&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap"

// ─── CSS animations injected globally ────────────────────────────────────────
const GLOBAL_CSS = `
@keyframes fadeUp {
  from { opacity:0; transform:translateY(18px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes fadeIn {
  from { opacity:0; } to { opacity:1; }
}
@keyframes goldPulse {
  0%,100% { text-shadow:0 0 12px rgba(201,168,80,0.5); }
  50%      { text-shadow:0 0 32px rgba(201,168,80,0.95),0 0 60px rgba(201,168,80,0.4); }
}
@keyframes kaabaPulse {
  0%,100% { box-shadow:0 0 0 0 rgba(201,168,80,0); transform:scale(1) rotate(0deg); }
  25%     { box-shadow:0 0 30px 12px rgba(201,168,80,0.25); transform:scale(1.04) rotate(1deg); }
  75%     { box-shadow:0 0 20px 6px rgba(201,168,80,0.15); transform:scale(0.97) rotate(-1deg); }
}
@keyframes kaabaRing {
  0%   { transform:translate(-50%,-50%) scale(0.9); opacity:0.6; }
  100% { transform:translate(-50%,-50%) scale(2.2); opacity:0; }
}
@keyframes kaabaRingB {
  0%   { transform:translate(-50%,-50%) scale(0.9); opacity:0.4; }
  100% { transform:translate(-50%,-50%) scale(3); opacity:0; }
}
@keyframes tawaf {
  from { transform:rotate(0deg); }
  to   { transform:rotate(360deg); }
}
@keyframes arabicFloat {
  0%,100% { transform:translateX(-50%) translateY(0); }
  50%     { transform:translateX(-50%) translateY(-6px); }
}
@keyframes shimmer {
  0%   { background-position:200% center; }
  100% { background-position:-200% center; }
}
@keyframes routeGlow {
  0%,100% { opacity:0.6; } 50% { opacity:1; }
}
@keyframes stampAppear {
  0%   { opacity:0; }
  40%  { opacity:1; }
  100% { opacity:0.88; }
}
@keyframes progressPulse {
  0%,100% { opacity:0.8; } 50% { opacity:1; }
}
@keyframes orbitDot {
  from { transform:rotate(0deg) translateX(40px) rotate(0deg); }
  to   { transform:rotate(360deg) translateX(40px) rotate(-360deg); }
}
@keyframes meccaHaloExpand {
  0%   { transform:translate(-50%,-50%) scale(1);   opacity:0.7; }
  100% { transform:translate(-50%,-50%) scale(2.8); opacity:0; }
}
.fade-up   { animation:fadeUp 0.9s cubic-bezier(.22,1,.36,1) both; }
.fade-in   { animation:fadeIn 0.7s ease both; }
.gold-pulse{ animation:goldPulse 3s ease-in-out infinite; }
.arabic-float { animation:arabicFloat 5s ease-in-out infinite; }
.mapboxgl-ctrl-bottom-left,.mapboxgl-ctrl-bottom-right,.mapboxgl-ctrl-attrib{display:none!important;}
.mapboxgl-popup-content{background:transparent!important;border:none!important;box-shadow:none!important;padding:0!important;}
.mapboxgl-popup-tip{display:none!important;}
`

// ─── Colors ───────────────────────────────────────────────────────────────────
const C = {
  bg:       '#F5EFE0',
  gold:     '#8B5E00',
  goldBr:   '#C9910A',
  goldDim:  '#A07828',
  // VIVID route colors — stand out on dark map
  camel:    '#D4620A',   // deep burnt orange — pops on parchment
  sea:      '#1A6B8A',   // deep ocean teal — visible on parchment
  air:      '#C0392B',   // deep crimson — visible on parchment
  mecca:    '#FFD700',   // pure gold for Mecca chapter
  text:     '#1A1208',
  muted:    '#8a7050',
  dark:     '#1a1710',
  arabicGold:'#8B5E00',
}

// ─── Animated counter ─────────────────────────────────────────────────────────
const useCounter = (target, duration = 2000, active = false) => {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) { setVal(0); return }
    let start = null
    const step = ts => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setVal(Math.floor(e * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, active])
  return val
}

// ─── Bezier helpers ───────────────────────────────────────────────────────────
const getBezierPoint = (p0, p1, cp, t) => [
  (1-t)**2*p0[0] + 2*(1-t)*t*cp[0] + t**2*p1[0],
  (1-t)**2*p0[1] + 2*(1-t)*t*cp[1] + t**2*p1[1],
]
const getArcCP = (from, to) => {
  const mid = [(from[0]+to[0])/2, (from[1]+to[1])/2]
  const dx = to[0]-from[0], dy = to[1]-from[1]
  const len = Math.sqrt(dx*dx+dy*dy)
  return [mid[0]-dy*0.3, mid[1]+dx*0.3-len*0.15]
}

// ─── SVG icons ────────────────────────────────────────────────────────────────
const CAMEL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="22" viewBox="0 0 16 22">
  <ellipse cx="4" cy="14" rx="3.2" ry="4.5" fill="COLOR" opacity="0.95"/>
  <ellipse cx="4" cy="9" rx="2.2" ry="2.8" fill="COLOR" opacity="0.95"/>
  <ellipse cx="12" cy="11" rx="3.2" ry="4.5" fill="COLOR" opacity="0.95"/>
  <ellipse cx="12" cy="6" rx="2.2" ry="2.8" fill="COLOR" opacity="0.95"/>
</svg>`

const WAKE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="16" viewBox="0 0 22 16">
  <path d="M11,8 L1,2" stroke="COLOR" stroke-width="2" stroke-linecap="round" opacity="0.9"/>
  <path d="M11,8 L1,14" stroke="COLOR" stroke-width="2" stroke-linecap="round" opacity="0.9"/>
  <path d="M11,8 L20,8" stroke="COLOR" stroke-width="2.2" stroke-linecap="round" opacity="0.95"/>
  <path d="M11,8 L4,5" stroke="COLOR" stroke-width="1" stroke-linecap="round" opacity="0.5"/>
  <path d="M11,8 L4,11" stroke="COLOR" stroke-width="1" stroke-linecap="round" opacity="0.5"/>
</svg>`

const PLANE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
  <path d="M10,1 L14,10 L20,9 L20,11 L14,11 L11,19 L9,19 L10,11 L0,13 L0,9 L10,10 Z" fill="COLOR" opacity="0.98"/>
</svg>`

// ─── ERA CONFIG ───────────────────────────────────────────────────────────────
const ERA = {
  ancient:    { label:'ANCIENT ERA',   color:C.camel,  routeColor:C.camel  },
  sea:        { label:'SEA ROUTES',    color:C.sea,    routeColor:C.sea    },
  transition: { label:'AGE OF STEAM',  color:'#bbb',   routeColor:'#bbb'   },
  modern:     { label:'MODERN ERA',    color:C.air,    routeColor:C.air    },
  eternal:    { label:'ETERNAL',       color:C.gold,   routeColor:C.mecca  },
}

// ─── KAABA SVG component ──────────────────────────────────────────────────────
const KaabaIcon = ({ size = 80, animate = false }) => (
  <div style={{
    position:'relative', width:size, height:size,
    animation: animate ? 'kaabaPulse 3s ease-in-out infinite' : 'none',
  }}>
    {/* Tawaf ring 1 */}
    {animate && <div style={{
      position:'absolute', top:'50%', left:'50%',
      width:size*1.4, height:size*1.4, borderRadius:'50%',
      border:`1px solid ${C.goldBr}`,
      animation:'kaabaRing 2.4s ease-out infinite',
    }}/>}
    {/* Tawaf ring 2 */}
    {animate && <div style={{
      position:'absolute', top:'50%', left:'50%',
      width:size*1.4, height:size*1.4, borderRadius:'50%',
      border:`1px solid ${C.goldBr}`,
      animation:'kaabaRingB 2.4s 1.2s ease-out infinite',
    }}/>}
    {/* Orbiting pilgrim dot */}
    {animate && <div style={{
      position:'absolute', top:'50%', left:'50%',
      width:6, height:6, marginTop:-3, marginLeft:-3,
      background:C.goldBr, borderRadius:'50%',
      animation:'orbitDot 4s linear infinite',
      boxShadow:`0 0 6px ${C.goldBr}`,
    }}/>}
    {/* Kaaba cube */}
    <svg width={size} height={size} viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="40" cy="72" rx="22" ry="5" fill="rgba(0,0,0,0.4)"/>
      {/* Front face */}
      <rect x="16" y="22" width="42" height="44" fill="#1a1208" stroke={C.gold} strokeWidth="1.2"/>
      {/* Top face */}
      <polygon points="16,22 58,22 70,12 28,12" fill="#2a1e0e" stroke={C.gold} strokeWidth="1.2"/>
      {/* Right face */}
      <polygon points="58,22 58,66 70,56 70,12" fill="#120e06" stroke={C.gold} strokeWidth="1.2"/>
      {/* Kiswah (black cloth with gold band) */}
      <rect x="16" y="36" width="42" height="6" fill={C.gold} opacity="0.85"/>
      {/* Gold band on top */}
      <polygon points="16,36 58,36 70,26 28,26" fill={C.goldDim} opacity="0.9"/>
      {/* Muqarna detail lines */}
      <line x1="16" y1="22" x2="58" y2="22" stroke={C.gold} strokeWidth="0.5" opacity="0.4"/>
      <line x1="28" y1="12" x2="70" y2="12" stroke={C.gold} strokeWidth="0.5" opacity="0.4"/>
      {/* Door outline */}
      <rect x="28" y="50" width="14" height="16" fill={C.goldDim} opacity="0.7" rx="1"/>
      <rect x="30" y="52" width="10" height="12" fill="#0a0806" rx="1"/>
    </svg>
  </div>
)

// ─── Main component (RAFCE) ───────────────────────────────────────────────────
const HajjMap = () => {
  const navigate  = useNavigate()
  const mapCont   = useRef(null)
  const map       = useRef(null)
  const animFrames= useRef([])
  const markers   = useRef([])
  const timers    = useRef([])

  const [idx,          setIdx]          = useState(0)
  const [playing,      setPlaying]      = useState(true)   // autoplay ON
  const [progress,     setProgress]     = useState(0)
  const [loaded,       setLoaded]       = useState(false)
  const [arabicVis,    setArabicVis]    = useState(false)
  const [titleVis,     setTitleVis]     = useState(false)
  const [statVis,      setStatVis]      = useState(false)
  const [transitioning,setTransitioning]= useState(false)
  const [meccaOverlay, setMeccaOverlay] = useState(false)

  const chapter = CHAPTERS[idx]
  const era     = ERA[chapter.era] || ERA.eternal
  const statVal = useCounter(chapter.stat, 2000, statVis)
  const isMecca = chapter.id === 'mecca'

  // ─── Font injection ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!document.getElementById('hajj-fonts')) {
      const l = document.createElement('link')
      l.id   = 'hajj-fonts'; l.rel = 'stylesheet'; l.href = FONTS_URL
      document.head.appendChild(l)
    }
    if (!document.getElementById('hajj-css')) {
      const s = document.createElement('style')
      s.id = 'hajj-css'; s.textContent = GLOBAL_CSS
      document.head.appendChild(s)
    }
  }, [])

  // ─── Map init ────────────────────────────────────────────────────────────────
  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN
    map.current = new mapboxgl.Map({
      container: mapCont.current,
      style:  'mapbox://styles/mapbox/light-v11',
      center: [39.8262, 21.4225],
      zoom:   2.5,
      projection: 'globe',
      antialias: true,
    })

    map.current.on('style.load', () => {
      const m = map.current
      m.setFog({
        color:           'rgb(245,237,214)',
        'high-color':    'rgb(230,215,180)',
        'horizon-blend': 0.05,
        'space-color':   'rgb(200,185,155)',
        'star-intensity': 0.0,
      })
      if (m.getLayer('water')) m.setPaintProperty('water','fill-color','#C8DDE8')
      ;['road-label','street-label','poi-label','transit-label'].forEach(l => {
        if (m.getLayer(l)) m.setLayoutProperty(l,'visibility','none')
      })

      // Country source
      m.addSource('countries', { type:'vector', url:'mapbox://mapbox.country-boundaries-v1' })

      // Arabian Peninsula warm tint
      m.addLayer({
        id:'arabia-warm', type:'fill', source:'countries',
        'source-layer':'country_boundaries',
        filter:['in','iso_3166_1','SA','YE','OM','AE','QA','KW','BH'],
        paint:{ 'fill-color':'#E8D4A0', 'fill-opacity':0.55 },
      })
      m.addLayer({
        id:'country-borders', type:'line', source:'countries',
        'source-layer':'country_boundaries',
        paint:{ 'line-color':'rgba(140,110,60,0.18)', 'line-width':0.5 },
      })

      // Mecca glow layers
      m.addSource('mecca-pt',{
        type:'geojson',
        data:{type:'Feature',geometry:{type:'Point',coordinates:[MECCA.lng,MECCA.lat]}}
      })
      m.addLayer({ id:'mecca-halo-outer', type:'circle', source:'mecca-pt',
        paint:{ 'circle-radius':30,'circle-color':'#C9A850','circle-opacity':0.04,'circle-blur':1 }})
      m.addLayer({ id:'mecca-halo-mid', type:'circle', source:'mecca-pt',
        paint:{ 'circle-radius':14,'circle-color':'#C9A850','circle-opacity':0.25,'circle-blur':0.5 }})
      m.addLayer({ id:'mecca-dot', type:'circle', source:'mecca-pt',
        paint:{ 'circle-radius':6,'circle-color':'#8B1A1A','circle-opacity':0.98,
          'circle-stroke-width':1.5,'circle-stroke-color':'#F0D878' }})

      setLoaded(true)
    })

    return () => {
      // Cancel all pending JS work first — don't touch the map DOM
      animFrames.current.forEach(id => cancelAnimationFrame(id)); animFrames.current=[]
      timers.current.forEach(id => clearTimeout(id));             timers.current=[]
      markers.current.forEach(m => { try { m.remove() } catch {} }); markers.current=[]
      document.querySelectorAll('.hajj-stamp').forEach(el => el.remove())
      map.current?.remove()
      map.current = null
    }
  }, [])

  // ─── Style-ready guard ────────────────────────────────────────────────────
  const styleReady = useCallback(() => {
    if (!map.current) return false
    try { map.current.getStyle(); return true } catch { return false }
  }, [])

  // ─── Clear all animations/markers ───────────────────────────────────────────
  const clearAll = useCallback(() => {
    // Always cancel JS-side work immediately
    animFrames.current.forEach(id => cancelAnimationFrame(id)); animFrames.current=[]
    timers.current.forEach(id => clearTimeout(id));             timers.current=[]
    markers.current.forEach(m => { try { m.remove() } catch {} }); markers.current=[]
    document.querySelectorAll('.hajj-stamp').forEach(el => el.remove())
    // Mapbox layer removal — only if map + style are ready
    if (!map.current) return
    try {
      const style = map.current.getStyle() // throws if style not loaded
      ;['route-stamps','air-arcs','waypoint-labels'].forEach(id => {
        try { if (map.current.getLayer(id)) map.current.removeLayer(id) } catch {}
        try { if (map.current.getSource(id)) map.current.removeSource(id) } catch {}
      })
      const layerIds = (style?.layers || []).map(l => l.id)
      layerIds
        .filter(id => id.startsWith('air-line-') || id.startsWith('air-arc-'))
        .forEach(id => { try { if (map.current.getLayer(id)) map.current.removeLayer(id) } catch {} })
      Object.keys(style?.sources || {})
        .filter(k => k.startsWith('air-arc-'))
        .forEach(k => { try { if (map.current.getSource(k)) map.current.removeSource(k) } catch {} })
    } catch {
      // Style not ready — JS cleanup already done above, safe to ignore
    }
  }, [])

  // ─── Camel footprints (canvas-based, no blob URLs) ──────────────────────────
  const animateCamelRoute = useCallback((routeData, _id, delay=0) => {
    const coords = routeData.coords
    const color  = C.camel

    const MIN_SPACING = 3.5, STAMP_MS = 80
    const pts = []
    for (let s=0; s<coords.length-1; s++) {
      const [ax,ay]=coords[s],[bx,by]=coords[s+1]
      const dist=Math.sqrt((bx-ax)**2+(by-ay)**2)
      const angle=Math.atan2(by-ay,bx-ax)*180/Math.PI
      const n=Math.max(1,Math.floor(dist/MIN_SPACING))
      for (let i=0;i<=n;i++) pts.push({
        lng:ax+(bx-ax)*i/n, lat:ay+(by-ay)*i/n, angle:angle-90
      })
    }
    pts.forEach((pt,i) => {
      const tid = setTimeout(() => {
        if (!map.current) return
        // Draw camel footprint on canvas
        const canvas = document.createElement('canvas')
        canvas.width=20; canvas.height=26
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = color
        // Left hoof
        ctx.beginPath(); ctx.ellipse(5,18,3,4.5,0,0,Math.PI*2); ctx.fill()
        ctx.beginPath(); ctx.ellipse(5,11,2.2,2.8,0,0,Math.PI*2); ctx.fill()
        // Right hoof
        ctx.beginPath(); ctx.ellipse(14,14,3,4.5,0,0,Math.PI*2); ctx.fill()
        ctx.beginPath(); ctx.ellipse(14,7,2.2,2.8,0,0,Math.PI*2); ctx.fill()
        const el = document.createElement('div')
        el.className='hajj-stamp'
        el.style.cssText=`width:20px;height:26px;pointer-events:none;opacity:0;transition:opacity 0.3s ease;`
        canvas.style.cssText=`width:100%;height:100%;transform:rotate(${pt.angle}deg);filter:drop-shadow(0 0 2px rgba(200,80,0,0.5))`
        el.appendChild(canvas)
        const mk = new mapboxgl.Marker({element:el,anchor:'center'}).setLngLat([pt.lng,pt.lat]).addTo(map.current)
        markers.current.push(mk)
        requestAnimationFrame(() => { el.style.opacity='0.92' })
      }, delay+i*STAMP_MS)
      timers.current.push(tid)
    })
  }, [])

  // ─── Ship wakes (canvas-based) ───────────────────────────────────────────────
  const animateSeaRoute = useCallback((routeData, delay=0) => {
    const coords = routeData.coords
    const color  = C.sea

    const MIN_SPACING=4.0, STAMP_MS=70
    const pts=[]
    for (let s=0;s<coords.length-1;s++) {
      const [ax,ay]=coords[s],[bx,by]=coords[s+1]
      const dist=Math.sqrt((bx-ax)**2+(by-ay)**2)
      const angle=Math.atan2(by-ay,bx-ax)*180/Math.PI
      const n=Math.max(1,Math.floor(dist/MIN_SPACING))
      for (let i=0;i<=n;i++) pts.push({
        lng:ax+(bx-ax)*i/n, lat:ay+(by-ay)*i/n, angle
      })
    }
    pts.forEach((pt,i) => {
      const tid=setTimeout(() => {
        if (!map.current) return
        const canvas = document.createElement('canvas')
        canvas.width=24; canvas.height=16
        const ctx = canvas.getContext('2d')
        ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.lineCap = 'round'
        // V-wake pointing right
        ctx.beginPath(); ctx.moveTo(12,8); ctx.lineTo(2,2);  ctx.stroke()
        ctx.beginPath(); ctx.moveTo(12,8); ctx.lineTo(2,14); ctx.stroke()
        ctx.lineWidth=2.5
        ctx.beginPath(); ctx.moveTo(12,8); ctx.lineTo(22,8); ctx.stroke()
        // smaller inner lines
        ctx.lineWidth=1; ctx.globalAlpha=0.5
        ctx.beginPath(); ctx.moveTo(12,8); ctx.lineTo(5,5);  ctx.stroke()
        ctx.beginPath(); ctx.moveTo(12,8); ctx.lineTo(5,11); ctx.stroke()
        const el=document.createElement('div')
        el.className='hajj-stamp'
        el.style.cssText=`width:24px;height:16px;pointer-events:none;opacity:0;transition:opacity 0.3s ease;`
        canvas.style.cssText=`width:100%;height:100%;transform:rotate(${pt.angle}deg);filter:drop-shadow(0 0 3px ${color}99)`
        el.appendChild(canvas)
        const mk=new mapboxgl.Marker({element:el,anchor:'center'}).setLngLat([pt.lng,pt.lat]).addTo(map.current)
        markers.current.push(mk)
        requestAnimationFrame(() => { el.style.opacity='0.85' })
      }, delay+i*STAMP_MS)
      timers.current.push(tid)
    })
  }, [])

  // ─── Animated air arcs ───────────────────────────────────────────────────────
  const animateAirRoute = useCallback((routeData, delay=0) => {
    const {origin,dest,color:rColor,id:rId} = routeData
    const color  = C.air   // always vivid green
    const cp     = getArcCP(origin,dest)
    const srcId  = `air-arc-${rId}`
    const lineId = `air-line-${rId}`

    // Canvas plane — no blob URL needed
    const planeCanvas = document.createElement('canvas')
    planeCanvas.width=22; planeCanvas.height=22
    const pctx = planeCanvas.getContext('2d')
    pctx.fillStyle = color
    pctx.beginPath()
    pctx.moveTo(11,1); pctx.lineTo(15,11); pctx.lineTo(21,10)
    pctx.lineTo(21,12); pctx.lineTo(15,12); pctx.lineTo(12,20)
    pctx.lineTo(10,20); pctx.lineTo(11,12); pctx.lineTo(1,14)
    pctx.lineTo(1,10); pctx.lineTo(11,11); pctx.closePath()
    pctx.fill()
    const el = document.createElement('div')
    el.className='hajj-stamp'
    el.style.cssText=`width:22px;height:22px;pointer-events:none;opacity:0;transition:opacity 0.3s;`
    planeCanvas.style.cssText=`width:100%;height:100%;filter:drop-shadow(0 0 5px ${color})`
    el.appendChild(planeCanvas)

    const tid=setTimeout(() => {
      if (!map.current) return
      if (!map.current.getSource(srcId)) {
        map.current.addSource(srcId,{type:'geojson',data:{type:'Feature',geometry:{type:'LineString',coordinates:[origin]}}})
        // Glow line (thick blurred)
        map.current.addLayer({
          id:`${lineId}-glow`, type:'line', source:srcId,
          paint:{'line-color':color,'line-width':6,'line-opacity':0.15,'line-blur':6}
        })
        map.current.addLayer({
          id:lineId, type:'line', source:srcId,
          paint:{'line-color':color,'line-width':1.5,'line-opacity':0.8}
        })
      }
      const planeMk=new mapboxgl.Marker({element:el,anchor:'center'}).setLngLat(origin).addTo(map.current)
      markers.current.push(planeMk)
      const TOTAL=120; let t=0
      const step=() => {
        if (!map.current||t>TOTAL){ el.style.opacity='0'; return }
        const pt=getBezierPoint(origin,dest,cp,t/TOTAL)
        planeMk.setLngLat(pt)
        const pt2=getBezierPoint(origin,dest,cp,Math.min((t+2)/TOTAL,1))
        const angle=Math.atan2(pt2[1]-pt[1],pt2[0]-pt[0])*180/Math.PI
        el.style.transform=`rotate(${angle-90}deg)`
        el.style.opacity=t<5?(t/5).toString():t>110?((120-t)/10).toString():'0.95'
        const pts=[]; for(let i=0;i<=t;i++) pts.push(getBezierPoint(origin,dest,cp,i/TOTAL))
        if (map.current.getSource(srcId)) {
          map.current.getSource(srcId).setData({type:'Feature',geometry:{type:'LineString',coordinates:pts}})
        }
        t++
        animFrames.current.push(requestAnimationFrame(step))
      }
      animFrames.current.push(requestAnimationFrame(step))
    }, delay)
    timers.current.push(tid)
  }, [])

  // ─── Apply chapter ───────────────────────────────────────────────────────────
  const applyChapter = useCallback((ci) => {
    const ch = CHAPTERS[ci]
    if (!map.current || !loaded) return

    clearAll()
    setArabicVis(false); setTitleVis(false); setStatVis(false); setTransitioning(true)
    setMeccaOverlay(false)

    setTimeout(() => {
      setTransitioning(false)
      setArabicVis(true)
      setTimeout(() => setTitleVis(true), 400)
      setTimeout(() => setStatVis(true),  900)
      if (ch.id==='mecca') setTimeout(() => setMeccaOverlay(true), 600)
    }, 350)

    map.current.flyTo({
      center: ch.mapCenter, zoom: ch.mapZoom,
      duration: 2400,
      easing: t => t<0.5 ? 2*t*t : -1+(4-2*t)*t,
    })

    const routes = ch.showRoutes||[]
    routes.forEach((rId,i) => {
      if (ANCIENT_ROUTES[rId]) animateCamelRoute(ANCIENT_ROUTES[rId], rId, i*200)
      if (SEA_ROUTES[rId])     animateSeaRoute(SEA_ROUTES[rId], i*180)
      if (AIR_ROUTES[rId])     animateAirRoute(AIR_ROUTES[rId], i*150)
    })

    // Mecca glow intensity
    if (map.current.getLayer('mecca-halo-outer')) {
      const isMeccaCh = ch.id==='mecca'
      map.current.setPaintProperty('mecca-halo-outer','circle-radius', isMeccaCh?70:ch.type==='reveal'?45:30)
      map.current.setPaintProperty('mecca-halo-outer','circle-opacity', isMeccaCh?0.16:0.04)
      map.current.setPaintProperty('mecca-halo-mid',  'circle-radius', isMeccaCh?30:14)
      map.current.setPaintProperty('mecca-halo-mid',  'circle-opacity', isMeccaCh?0.35:0.14)
    }
    if (map.current.getLayer('arabia-warm'))
      map.current.setPaintProperty('arabia-warm','fill-color', ch.id==='mecca'?'#D4A840':'#E8D4A0')
  }, [loaded, clearAll, animateCamelRoute, animateSeaRoute, animateAirRoute])

  useEffect(() => { if(loaded) applyChapter(idx) }, [idx, loaded, applyChapter])
  useEffect(() => { if(loaded) setTimeout(()=>applyChapter(0),500) }, [loaded])

  // ─── Auto-play loop ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!playing) return
    const DURATION = 12000
    let startTime = Date.now(), rafId
    const tick = () => {
      const p = Math.min((Date.now()-startTime)/DURATION, 1)
      setProgress(p)
      if (p>=1) {
        setIdx(i => (i+1)%CHAPTERS.length)
        startTime=Date.now(); setProgress(0)
      }
      rafId=requestAnimationFrame(tick)
    }
    rafId=requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [playing, idx])

  // ─── Keyboard nav ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const h = e => {
      if (e.key==='ArrowRight') { setIdx(i=>Math.min(CHAPTERS.length-1,i+1)); setProgress(0) }
      if (e.key==='ArrowLeft')  { setIdx(i=>Math.max(0,i-1));                 setProgress(0) }
    }
    window.addEventListener('keydown',h)
    return () => window.removeEventListener('keydown',h)
  }, [])

  const goTo = (i) => { setIdx(i); setProgress(0) }

  const formatStat = n => {
    if (n>=1000000) return (n/1000000).toFixed(1)+'M'
    if (n>=1000)    return n.toLocaleString()
    return n.toString()
  }

  const DOT_COLOR = { reveal:C.gold, ancient:C.camel, sea:C.sea, modern:C.air }

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ position:'fixed', inset:0, background:C.bg, overflow:'hidden' }}>

      {/* MAP */}
      <div ref={mapCont} style={{ position:'absolute', inset:0 }} />

      {/* Subtle grid */}
      <div style={{
        position:'fixed',inset:0,pointerEvents:'none',zIndex:1,
        backgroundImage:`linear-gradient(rgba(140,110,60,0.06) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(140,110,60,0.06) 1px, transparent 1px)`,
        backgroundSize:'60px 60px',
      }}/>

      {/* Vignette */}
      <div style={{
        position:'fixed',inset:0,pointerEvents:'none',zIndex:2,
        background:`radial-gradient(ellipse at center, transparent 38%, rgba(210,190,145,0.55) 100%)`,
      }}/>
      <div style={{
        position:'fixed',inset:0,pointerEvents:'none',zIndex:2,
        background:`linear-gradient(to bottom, rgba(220,200,155,0.45) 0%, transparent 18%, transparent 78%, rgba(220,200,155,0.55) 100%)`,
      }}/>

      {/* ───────────────────── MECCA CHAPTER OVERLAY ───────────────────── */}
      {isMecca && meccaOverlay && (
        <div style={{
          position:'fixed',inset:0,zIndex:15,
          display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
          pointerEvents:'none',
          animation:'fadeIn 1.2s ease both',
          background:'rgba(245,237,210,0.15)',
        }}>
          {/* Pulsing ring halos */}
          {[0,1,2].map(i => (
            <div key={i} style={{
              position:'absolute', top:'50%', left:'50%',
              width:200+i*80, height:200+i*80, borderRadius:'50%',
              border:`1px solid ${C.goldBr}`,
              animation:`meccaHaloExpand ${2+i*0.8}s ${i*0.7}s ease-out infinite`,
              opacity:0,
            }}/>
          ))}
          {/* Central Kaaba */}
          <div style={{ position:'relative', marginBottom:20 }}>
            <KaabaIcon size={120} animate={true}/>
          </div>
        </div>
      )}

      {/* ───────────────────── UI LAYER ───────────────────── */}
      <div style={{ position:'absolute',inset:0,zIndex:20,pointerEvents:'none' }}>

        {/* TOP LEFT: back + era */}
        <div style={{ position:'absolute',top:28,left:32,display:'flex',flexDirection:'column',gap:14 }}>
          <button onClick={()=>navigate('/maps')} style={{
            pointerEvents:'all',
            background:'rgba(245,237,220,0.9)', border:`1px solid ${C.gold}55`,
            color:'#8B5000', fontFamily:"'Cinzel',serif", fontSize:10,
            letterSpacing:'0.18em', padding:'7px 16px', cursor:'pointer',
            backdropFilter:'blur(10px)', textTransform:'uppercase',
            transition:'all 0.2s',
          }}>← ANIMATED MAPS</button>

          <div style={{
            display:'flex',alignItems:'center',gap:10,
            opacity:titleVis?1:0,
            transform:titleVis?'translateY(0)':'translateY(-8px)',
            transition:'all 0.6s ease',
          }}>
            <div style={{ width:24,height:2,background:era.color,boxShadow:'none',opacity:0.9 }}/>
            <span style={{
              fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'0.24em',
              color:era.color,textTransform:'uppercase',
              textShadow:`0 0 12px ${era.color}`,
            }}>{era.label}</span>
          </div>
        </div>

        {/* TOP RIGHT: chapter counter */}
        <div style={{
          position:'absolute',top:28,right:32,
          display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4,
          opacity:titleVis?1:0,transition:'opacity 0.5s',
        }}>
          <span style={{ fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'0.18em',color:'#A07020',textTransform:'uppercase' }}>
            Chapter
          </span>
          <span style={{
            fontFamily:"'Cinzel',serif",fontSize:30,color:'#C9810A',lineHeight:1,fontWeight:900,
            textShadow:'none',
          }}>
            {String(idx+1).padStart(2,'0')}
            <span style={{ fontSize:14,color:'#A07020',fontWeight:400 }}>/{CHAPTERS.length}</span>
          </span>
        </div>

        {/* CENTRE: Arabic calligraphy */}
        <div
          key={`ar-${idx}`}
          className="arabic-float"
          style={{
            position:'absolute',top:'13%',left:'50%',
            transform:'translateX(-50%)',
            textAlign:'center',
            opacity:arabicVis?1:0,
            transition:`opacity ${transitioning?'0.25s':'0.9s'} ease`,
          }}
        >
          <div style={{
            fontFamily:"'Amiri',serif",
            fontSize:chapter.era==='eternal'?'clamp(30px,4.5vw,58px)':'clamp(20px,2.8vw,36px)',
            color:'#8B5000',
            letterSpacing:'0.04em',lineHeight:1.4,direction:'rtl',
            textShadow:`0 2px 8px rgba(200,160,60,0.3)`,
          }}>
            {chapter.arabicTitle}
          </div>
          {chapter.arabicSub && (
            <div style={{
              fontFamily:"'Amiri',serif",
              fontSize:'clamp(13px,1.8vw,20px)',
              color:'#B07030',marginTop:8,direction:'rtl',opacity:0.85,
            }}>
              {chapter.arabicSub}
            </div>
          )}
        </div>

        {/* BOTTOM LEFT: chapter text block */}
        <div
          key={`txt-${idx}`}
          style={{
            position:'absolute',bottom:112,left:32,maxWidth:460,
            opacity:titleVis?1:0,
            transform:titleVis?'translateY(0)':'translateY(18px)',
            transition:`all ${transitioning?'0.2s':'0.75s'} ease`,
          }}
        >
          {/* Badge */}
          <div style={{
            fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'0.26em',
            color:'#A07828',textTransform:'uppercase',marginBottom:10,
            display:'flex',alignItems:'center',gap:10,
          }}>
            <div style={{ width:16,height:1,background:era.color,boxShadow:`0 0 6px ${era.color}` }}/>
            {chapter.badge}
            {chapter.year && <span style={{color:era.color,textShadow:`0 0 8px ${era.color}`}}>{chapter.year}</span>}
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily:"'Cinzel',serif",
            fontSize:'clamp(20px,2.8vw,36px)',
            color:'#6B3A00',fontWeight:900,margin:'0 0 6px',lineHeight:1.15,
            letterSpacing:'0.02em',
            textShadow:'0 2px 20px rgba(0,0,0,0.9)',
          }}>
            {chapter.title}
          </h1>

          {/* Subtitle */}
          <div style={{
            fontFamily:"'Cinzel',serif",fontSize:10,color:era.color,
            letterSpacing:'0.1em',marginBottom:16,
            opacity:0.9,
          }}>
            {chapter.subtitle}
          </div>

          {/* Body glass card */}
          <div style={{
            background:'rgba(250,244,228,0.92)',
            border:`1px solid ${era.color}44`,
            backdropFilter:'blur(14px)',
            padding:'14px 18px', marginBottom:14,
            boxShadow:`inset 0 0 20px rgba(200,170,100,0.1), 0 2px 16px rgba(0,0,0,0.08)`,
          }}>
            <p style={{
              fontFamily:"'Lora',serif",fontSize:13,
              color:'rgba(60,35,5,0.85)',lineHeight:1.8,margin:0,fontWeight:400,
            }}>
              {chapter.body}
            </p>
          </div>

          {/* Quote */}
          {chapter.quote && (
            <div style={{
              borderLeft:`2px solid ${era.color}`,paddingLeft:14,
              boxShadow:`-4px 0 12px ${era.color}22`,
            }}>
              <p style={{
                fontFamily:"'Lora',serif",fontSize:12.5,fontStyle:'italic',
                color:'#7A4A10',lineHeight:1.7,margin:0,
              }}>
                "{chapter.quote}"
              </p>
              {chapter.quoteAuthor && (
                <p style={{
                  fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'0.16em',
                  color:C.muted,margin:'6px 0 0',textTransform:'uppercase',
                }}>
                  — {chapter.quoteAuthor}
                </p>
              )}
            </div>
          )}
        </div>

        {/* BOTTOM RIGHT: animated stat */}
        <div
          key={`stat-${idx}`}
          style={{
            position:'absolute',bottom:112,right:32,textAlign:'right',
            opacity:statVis?1:0,
            transform:statVis?'translateY(0)':'translateY(20px)',
            transition:`all ${transitioning?'0.2s':'0.85s'} ease`,
          }}
        >
          <div style={{
            fontFamily:"'Cinzel',serif",
            fontSize:'clamp(44px,6.5vw,78px)',
            color:era.color,fontWeight:900,lineHeight:1,
            textShadow:`0 0 40px ${era.color}55, 0 0 80px ${era.color}22`,
            background:`linear-gradient(135deg, ${era.color}, #8B4500, ${era.color})`,
            backgroundSize:'200% auto',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            animation:'shimmer 4s linear infinite',
          }}>
            {formatStat(statVal)}
          </div>
          <div style={{
            fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'0.2em',
            color:'#A07020',textTransform:'uppercase',marginTop:6,maxWidth:200,
          }}>
            {chapter.statLabel}
          </div>
        </div>

        {/* LEGEND (right middle) */}
        {(chapter.era==='ancient') && titleVis && (
          <div style={{
            position:'absolute',right:32,top:'50%',transform:'translateY(-50%)',
            background:'rgba(250,244,228,0.95)',
            border:`1px solid ${C.camel}66`,
            backdropFilter:'blur(10px)',
            padding:'14px 18px',display:'flex',flexDirection:'column',gap:12,
            animation:'fadeIn 0.6s ease both',
          }}>
            <LegendRow color={C.camel} label="Camel Route"  icon="🐪" glow />
            <LegendRow color={C.sea}   label="Sea Route"    icon="⛵" glow />
          </div>
        )}
        {(chapter.era==='modern') && titleVis && (
          <div style={{
            position:'absolute',right:32,top:'50%',transform:'translateY(-50%)',
            background:'rgba(250,244,228,0.95)',
            border:`1px solid ${C.air}66`,
            backdropFilter:'blur(10px)',
            padding:'14px 18px',display:'flex',flexDirection:'column',gap:12,
            animation:'fadeIn 0.6s ease both',
          }}>
            <LegendRow color={C.air}  label="Air Corridor"   icon="✈" glow />
            <LegendRow color={C.gold} label="2.5M Pilgrims"  icon="🕋" />
          </div>
        )}

        {/* Mecca legend panel removed — Kaaba shown center-map only */}

        {/* BOTTOM: progress bar + scrubber */}
        <div style={{
          position:'absolute',bottom:0,left:0,right:0,
          background:'rgba(248,240,222,0.96)',
          borderTop:`1px solid ${C.gold}55`,
          backdropFilter:'blur(10px)',
          padding:'10px 32px 14px',
          pointerEvents:'all',
        }}>
          {/* Progress bar */}
          <div style={{ height:2,background:'rgba(201,168,80,0.08)',marginBottom:12,position:'relative',overflow:'hidden' }}>
            <div style={{
              position:'absolute',top:0,left:0,height:'100%',
              width:`${progress*100}%`,
              background:`linear-gradient(90deg, ${era.color}88, ${era.color})`,
              boxShadow:`0 0 8px ${era.color}`,
              transition:'width 0.1s linear',
              animation:'progressPulse 2s ease-in-out infinite',
            }}/>
          </div>

          <div style={{ display:'flex',alignItems:'center',gap:0 }}>
            {/* Play/Pause */}
            <button onClick={()=>setPlaying(p=>!p)} style={{
              background:'none',border:'none',cursor:'pointer',
              color:'#8B5000',fontSize:16,padding:'0 18px 0 0',
              fontFamily:"'Cinzel',serif",
              textShadow:`0 0 8px ${C.gold}`,
              transition:'all 0.2s',
            }}>{playing?'⏸':'▶'}</button>

            {/* Dots */}
            <div style={{ display:'flex',gap:7,flex:1,alignItems:'center' }}>
              {CHAPTERS.map((ch,i) => {
                const dc = DOT_COLOR[ch.type]||C.gold
                const isActive = i===idx
                return (
                  <button key={ch.id} onClick={()=>goTo(i)} title={ch.title} style={{
                    width: isActive?26:8, height:8, borderRadius:4,
                    background: isActive?dc:'rgba(140,110,60,0.2)',
                    border:'none',cursor:'pointer',
                    transition:'all 0.35s ease',
                    boxShadow: isActive?`0 0 8px ${dc}`:undefined,
                  }}/>
                )
              })}
            </div>

            {/* Prev/Next */}
            <div style={{ display:'flex',gap:10 }}>
              <button onClick={()=>{goTo(Math.max(0,idx-1));setPlaying(false)}} style={{
                background:'none',border:'none',cursor:'pointer',
                color:'#9a8060',fontSize:18,padding:'0 4px',
                fontFamily:"'Cinzel',serif",transition:'color 0.2s',
              }}>‹</button>
              <button onClick={()=>{goTo(Math.min(CHAPTERS.length-1,idx+1));setPlaying(false)}} style={{
                background:'none',border:'none',cursor:'pointer',
                color:'#8B5000',fontSize:18,padding:'0 4px',
                fontFamily:"'Cinzel',serif",
                textShadow:'none',transition:'all 0.2s',
              }}>›</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Legend row helper ────────────────────────────────────────────────────────
const LegendRow = ({ color, label, icon, glow }) => (
  <div style={{ display:'flex',alignItems:'center',gap:10 }}>
    <span style={{ fontSize:13 }}>{icon}</span>
    <div style={{
      width:20,height:2,background:color,opacity:0.9,
      boxShadow: glow?`0 0 6px ${color}`:undefined,
    }}/>
    <span style={{
      fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:'0.16em',
      color:'rgba(60,40,10,0.75)',textTransform:'uppercase',
    }}>{label}</span>
  </div>
)

export default HajjMap