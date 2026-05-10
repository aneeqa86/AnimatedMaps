// src/pages/maps/HajjMap.jsx
import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import mapboxgl from 'mapbox-gl'
import {
  CHAPTERS, ANCIENT_ROUTES, SEA_ROUTES, AIR_ROUTES, WAYPOINTS, MECCA
} from '@/data/hajjMap'

// ─── Amiri Arabic font import ─────────────────────────────────────────────────
const AMIRI_FONT = "https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&display=swap"

// ─── Animated counter hook ────────────────────────────────────────────────────
const useCounter = (target, duration = 2200, active = false) => {
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

// ─── Color palette ────────────────────────────────────────────────────────────
const C = {
  bg:         '#12110E',
  gold:       '#C9B88A',
  goldDim:    '#8a7a5a',
  camel:      '#C4935A',
  sea:        '#3A7A8C',
  air:        '#E8DFC0',
  text:       '#F0E8D8',
  muted:      '#7a7469',
  dark:       '#1a1710',
  glow:       'rgba(201,184,138,0.12)',
  arabicGold: '#D4AF6A',
}

// ─── Bezier arc helper ────────────────────────────────────────────────────────
const getBezierPoint = (p0, p1, cp, t) => {
  const x = (1-t)**2*p0[0] + 2*(1-t)*t*cp[0] + t**2*p1[0]
  const y = (1-t)**2*p0[1] + 2*(1-t)*t*cp[1] + t**2*p1[1]
  return [x, y]
}

const getArcControlPoint = (from, to) => {
  const mid = [(from[0]+to[0])/2, (from[1]+to[1])/2]
  const dx = to[0]-from[0], dy = to[1]-from[1]
  const len = Math.sqrt(dx*dx+dy*dy)
  // Push control point toward globe center (upward on globe)
  return [mid[0] - dy*0.3, mid[1] + dx*0.3 - len*0.15]
}

// ─── Camel footprint SVG path ─────────────────────────────────────────────────
// Two teardrop shapes side by side (left/right hoof)
const CAMEL_FOOT_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="22" viewBox="0 0 16 22">
    <ellipse cx="4" cy="14" rx="3.2" ry="4.5" fill="COLOR" opacity="0.92"/>
    <ellipse cx="4" cy="9" rx="2.2" ry="2.8" fill="COLOR" opacity="0.92"/>
    <ellipse cx="12" cy="11" rx="3.2" ry="4.5" fill="COLOR" opacity="0.92"/>
    <ellipse cx="12" cy="6" rx="2.2" ry="2.8" fill="COLOR" opacity="0.92"/>
  </svg>
`

// ─── Ship wake SVG path ───────────────────────────────────────────────────────
const WAKE_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" viewBox="0 0 20 14">
    <path d="M10,7 L0,1" stroke="COLOR" strokeWidth="1.5" strokeLinecap="round" opacity="0.85"/>
    <path d="M10,7 L0,13" stroke="COLOR" strokeWidth="1.5" strokeLinecap="round" opacity="0.85"/>
    <path d="M10,7 L18,7" stroke="COLOR" strokeWidth="1.8" strokeLinecap="round" opacity="0.9"/>
    <path d="M10,7 L3,4" stroke="COLOR" strokeWidth="0.8" strokeLinecap="round" opacity="0.5"/>
    <path d="M10,7 L3,10" stroke="COLOR" strokeWidth="0.8" strokeLinecap="round" opacity="0.5"/>
  </svg>
`

// ─── Plane SVG ────────────────────────────────────────────────────────────────
const PLANE_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
    <path d="M9,1 L13,9 L18,8 L18,10 L13,10 L10,17 L8,17 L9,10 L0,12 L0,8 L9,9 Z" fill="COLOR" opacity="0.95"/>
  </svg>
`

// ─── Main Component ───────────────────────────────────────────────────────────
const HajjMap = () => {
  const navigate = useNavigate()
  const mapContainer = useRef(null)
  const map = useRef(null)
  const animFrames = useRef([])
  const markers = useRef([])
  const stampTimers = useRef([])

  const [idx, setIdx] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [arabicVisible, setArabicVisible] = useState(false)
  const [titleVisible, setTitleVisible] = useState(false)
  const [statVisible, setStatVisible] = useState(false)
  const [transitioning, setTransitioning] = useState(false)

  const chapter = CHAPTERS[idx]
  const statVal = useCounter(chapter.stat, 2000, statVisible)

  // ─── Font injection ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!document.querySelector('#amiri-font')) {
      const link = document.createElement('link')
      link.id = 'amiri-font'
      link.rel = 'stylesheet'
      link.href = AMIRI_FONT
      document.head.appendChild(link)
    }
  }, [])

  // ─── Map init ──────────────────────────────────────────────────────────────
  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [39.8262, 21.4225],
      zoom: 2.5,
      projection: 'globe',
      antialias: true,
    })

    map.current.on('style.load', () => {
      const m = map.current

      // ── Rich atmosphere: warm amber haze at horizon ──
      m.setFog({
        color: 'rgb(18, 14, 8)',
        'high-color': 'rgb(38, 26, 10)',
        'horizon-blend': 0.08,
        'space-color': 'rgb(4, 3, 6)',
        'star-intensity': 0.85,
      })

      // ── Land: near-black globally ──
      m.setPaintProperty('land', 'background-color', '#0D0B07')

      // ── Water: deep navy ──
      if (m.getLayer('water')) m.setPaintProperty('water', 'fill-color', '#060B14')

      // ── Mute all labels except country names ──
      const layersToMute = ['road-label','street-label','poi-label','transit-label']
      layersToMute.forEach(l => { if (m.getLayer(l)) m.setLayoutProperty(l, 'visibility', 'none') })

      // ── Country fill layer for special colouring ──
      m.addSource('countries', {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1',
      })

      // Arabian Peninsula warm amber glow
      m.addLayer({
        id: 'arabia-warm',
        type: 'fill',
        source: 'countries',
        'source-layer': 'country_boundaries',
        filter: ['in', 'iso_3166_1', 'SA', 'YE', 'OM', 'AE', 'QA', 'KW', 'BH'],
        paint: {
          'fill-color': '#2C1A06',
          'fill-opacity': 0.85,
        },
      })

      // Subtle country borders
      m.addLayer({
        id: 'country-borders',
        type: 'line',
        source: 'countries',
        'source-layer': 'country_boundaries',
        paint: {
          'line-color': 'rgba(201,184,138,0.06)',
          'line-width': 0.5,
        },
      })

      // ── Mecca glow layers ──
      // Outer soft halo
      m.addSource('mecca-point', {
        type: 'geojson',
        data: { type: 'Feature', geometry: { type: 'Point', coordinates: [MECCA.lng, MECCA.lat] } }
      })
      m.addLayer({
        id: 'mecca-halo-outer',
        type: 'circle',
        source: 'mecca-point',
        paint: {
          'circle-radius': 30,
          'circle-color': '#C9B88A',
          'circle-opacity': 0.04,
          'circle-blur': 1,
        }
      })
      m.addLayer({
        id: 'mecca-halo-mid',
        type: 'circle',
        source: 'mecca-point',
        paint: {
          'circle-radius': 14,
          'circle-color': '#C9B88A',
          'circle-opacity': 0.12,
          'circle-blur': 0.5,
        }
      })
      m.addLayer({
        id: 'mecca-dot',
        type: 'circle',
        source: 'mecca-point',
        paint: {
          'circle-radius': 5,
          'circle-color': '#C9B88A',
          'circle-opacity': 0.95,
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#F0E8D8',
        }
      })

      setLoaded(true)
    })

    return () => {
      clearAll()
      map.current?.remove()
    }
  }, [])

  // ─── Clear helpers ─────────────────────────────────────────────────────────
  const clearAll = useCallback(() => {
    animFrames.current.forEach(id => cancelAnimationFrame(id))
    animFrames.current = []
    stampTimers.current.forEach(id => clearTimeout(id))
    stampTimers.current = []
    markers.current.forEach(m => m.remove())
    markers.current = []
    if (!map.current) return
    // Remove dynamic layers/sources
    const dynIds = ['route-stamps','air-arcs','air-planes','waypoint-labels']
    dynIds.forEach(id => {
      if (map.current.getLayer(id)) map.current.removeLayer(id)
      if (map.current.getSource(id)) map.current.removeSource(id)
    })
    // Remove stamp markers (canvas markers we add manually)
    document.querySelectorAll('.hajj-stamp').forEach(el => el.remove())
  }, [])

  // ─── Animate camel footprints along a path ─────────────────────────────────
  const animateCamelRoute = useCallback((routeData, routeId, delay = 0) => {
    const coords = routeData.coords
    const color = routeData.color || C.camel

    const svgStr = CAMEL_FOOT_SVG.replace(/COLOR/g, color)
    const blob = new Blob([svgStr], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)

    // ms between each footprint stamp — larger = more spacing
    const STAMP_MS = 600
    // min geographic distance between stamps (degrees) — prevents clustering
    const MIN_SPACING = 1.8

    const stampAt = (lngLat, angle) => {
      if (!map.current) return
      const el = document.createElement('div')
      el.className = 'hajj-stamp'
      el.style.cssText = `
        position:absolute; width:18px; height:24px; pointer-events:none;
        transform: rotate(${angle}deg) scale(0.9);
        transition: opacity 0.5s;
        opacity: 0;
      `
      const img = document.createElement('img')
      img.src = url
      img.style.cssText = 'width:100%;height:100%;'
      el.appendChild(img)
      const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
        .setLngLat(lngLat)
        .addTo(map.current)
      markers.current.push(marker)
      requestAnimationFrame(() => { el.style.opacity = '0.88' })
    }

    // Flatten all coords into evenly-spaced stamp positions
    // then fire them sequentially with STAMP_MS delay between each
    const buildStampPoints = () => {
      const points = []
      for (let seg = 0; seg < coords.length - 1; seg++) {
        const from = coords[seg], to = coords[seg + 1]
        const dx = to[0] - from[0], dy = to[1] - from[1]
        const dist = Math.sqrt(dx * dx + dy * dy)
        const angle = Math.atan2(dy, dx) * 180 / Math.PI
        // How many stamps fit in this segment with MIN_SPACING?
        const count = Math.max(1, Math.floor(dist / MIN_SPACING))
        for (let i = 0; i <= count; i++) {
          const t = i / count
          points.push({
            lng: from[0] + dx * t,
            lat: from[1] + dy * t,
            angle: angle - 90,
          })
        }
      }
      return points
    }

    const points = buildStampPoints()
    points.forEach((pt, i) => {
      const tid = setTimeout(() => {
        if (!map.current) return
        stampAt([pt.lng, pt.lat], pt.angle)
      }, delay + i * STAMP_MS)
      stampTimers.current.push(tid)
    })
  }, [])

  // ─── Animate ship wakes along a path ──────────────────────────────────────
  const animateSeaRoute = useCallback((routeData, delay = 0) => {
    const coords = routeData.coords
    const color = routeData.color || C.sea

    const svgStr = WAKE_SVG.replace(/COLOR/g, color)
    const blob = new Blob([svgStr], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)

    // ms between each wake stamp
    const STAMP_MS = 480
    // min spacing in degrees between wake marks — dhows sail faster than camels
    const MIN_SPACING = 2.2

    const wakeAt = (lngLat, angle) => {
      if (!map.current) return
      const el = document.createElement('div')
      el.className = 'hajj-stamp'
      el.style.cssText = `
        position:absolute; width:22px; height:15px; pointer-events:none;
        transform: rotate(${angle}deg);
        opacity: 0; transition: opacity 0.5s;
      `
      const img = document.createElement('img')
      img.src = url
      img.style.cssText = 'width:100%;height:100%;'
      el.appendChild(img)
      const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
        .setLngLat(lngLat)
        .addTo(map.current)
      markers.current.push(marker)
      requestAnimationFrame(() => { el.style.opacity = '0.75' })
    }

    // Flatten all segments into evenly-spaced stamp positions
    const buildStampPoints = () => {
      const points = []
      for (let seg = 0; seg < coords.length - 1; seg++) {
        const from = coords[seg], to = coords[seg + 1]
        const dx = to[0] - from[0], dy = to[1] - from[1]
        const dist = Math.sqrt(dx * dx + dy * dy)
        const angle = Math.atan2(dy, dx) * 180 / Math.PI
        const count = Math.max(1, Math.floor(dist / MIN_SPACING))
        for (let i = 0; i <= count; i++) {
          const t = i / count
          points.push({
            lng: from[0] + dx * t,
            lat: from[1] + dy * t,
            angle,
          })
        }
      }
      return points
    }

    const points = buildStampPoints()
    points.forEach((pt, i) => {
      const tid = setTimeout(() => {
        if (!map.current) return
        wakeAt([pt.lng, pt.lat], pt.angle)
      }, delay + i * STAMP_MS)
      stampTimers.current.push(tid)
    })
  }, [])

  // ─── Animate air arc ───────────────────────────────────────────────────────
  const animateAirRoute = useCallback((routeData, delay = 0) => {
    const { origin, dest, color } = routeData
    const cp = getArcControlPoint(origin, dest)

    // Draw the arc by progressively adding GeoJSON
    const sourceId = `air-arc-${routeData.id}`
    const lineId = `air-line-${routeData.id}`
    const planeId = `air-plane-${routeData.id}`

    // Plane marker
    const svgStr = PLANE_SVG.replace(/COLOR/g, color || C.air)
    const blob = new Blob([svgStr], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)

    const el = document.createElement('div')
    el.className = 'hajj-stamp'
    el.style.cssText = `width:18px;height:18px;pointer-events:none;opacity:0;transition:opacity 0.3s;`
    const img = document.createElement('img')
    img.src = url
    img.style.cssText = 'width:100%;height:100%;'
    el.appendChild(img)

    const tid = setTimeout(() => {
      if (!map.current) return

      // Add arc source & layer
      if (!map.current.getSource(sourceId)) {
        map.current.addSource(sourceId, {
          type: 'geojson',
          data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [origin] } }
        })
        map.current.addLayer({
          id: lineId,
          type: 'line',
          source: sourceId,
          paint: {
            'line-color': color || C.air,
            'line-width': 1.2,
            'line-opacity': 0.6,
          }
        })
      }

      const planeMarker = new mapboxgl.Marker({ element: el, anchor: 'center' })
        .setLngLat(origin)
        .addTo(map.current)
      markers.current.push(planeMarker)

      const TOTAL = 120
      let t = 0
      const DURATION_PER_FRAME = 16 // ~60fps
      const step = () => {
        if (!map.current || t > TOTAL) {
          el.style.opacity = '0'
          return
        }
        const pt = getBezierPoint(origin, dest, cp, t / TOTAL)
        planeMarker.setLngLat(pt)

        // Angle
        const pt2 = getBezierPoint(origin, dest, cp, Math.min((t+2)/TOTAL, 1))
        const angle = Math.atan2(pt2[1]-pt[1], pt2[0]-pt[0]) * 180 / Math.PI
        el.style.transform = `rotate(${angle - 90}deg)`
        el.style.opacity = t < 5 ? (t/5).toString() : t > 110 ? ((120-t)/10).toString() : '0.9'

        // Update arc line
        const points = []
        for (let i = 0; i <= t; i++) {
          points.push(getBezierPoint(origin, dest, cp, i / TOTAL))
        }
        if (map.current.getSource(sourceId)) {
          map.current.getSource(sourceId).setData({
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: points }
          })
        }
        t++
        const id = requestAnimationFrame(step)
        animFrames.current.push(id)
      }
      const id = requestAnimationFrame(step)
      animFrames.current.push(id)
    }, delay)
    stampTimers.current.push(tid)
  }, [])

  // ─── Chapter change ────────────────────────────────────────────────────────
  const applyChapter = useCallback((chapterIdx) => {
    const ch = CHAPTERS[chapterIdx]
    if (!map.current || !loaded) return

    clearAll()

    // Animate text out first, then in
    setArabicVisible(false)
    setTitleVisible(false)
    setStatVisible(false)
    setTransitioning(true)

    setTimeout(() => {
      setTransitioning(false)
      setArabicVisible(true)
      setTimeout(() => setTitleVisible(true), 400)
      setTimeout(() => setStatVisible(true), 900)
    }, 350)

    // Fly map
    map.current.flyTo({
      center: ch.mapCenter,
      zoom: ch.mapZoom,
      duration: 2200,
      easing: t => t < 0.5 ? 2*t*t : -1+(4-2*t)*t,
    })

    // Render routes based on chapter
    const routes = ch.showRoutes || []

    // Ancient routes
    routes.forEach((rId, i) => {
      if (ANCIENT_ROUTES[rId]) {
        animateCamelRoute(ANCIENT_ROUTES[rId], rId, i * 800)
      }
      if (SEA_ROUTES[rId]) {
        animateSeaRoute(SEA_ROUTES[rId], i * 600)
      }
      if (AIR_ROUTES[rId]) {
        animateAirRoute(AIR_ROUTES[rId], i * 300)
      }
    })

    // Mecca glow intensity per chapter type
    if (map.current.getLayer('mecca-halo-outer')) {
      const isReveal = ch.type === 'reveal'
      const isMeccaChapter = ch.id === 'mecca'
      map.current.setPaintProperty('mecca-halo-outer', 'circle-radius', isMeccaChapter ? 60 : isReveal ? 40 : 30)
      map.current.setPaintProperty('mecca-halo-outer', 'circle-opacity', isMeccaChapter ? 0.12 : 0.04)
      map.current.setPaintProperty('mecca-halo-mid', 'circle-radius', isMeccaChapter ? 25 : 14)
      map.current.setPaintProperty('mecca-halo-mid', 'circle-opacity', isMeccaChapter ? 0.3 : 0.12)
    }

    // Arabia warmth: brighten for Mecca chapter
    if (map.current.getLayer('arabia-warm')) {
      map.current.setPaintProperty('arabia-warm', 'fill-color',
        ch.id === 'mecca' ? '#3A2208' : '#2C1A06')
    }
  }, [loaded, clearAll, animateCamelRoute, animateSeaRoute, animateAirRoute])

  // Run on idx change
  useEffect(() => {
    if (loaded) applyChapter(idx)
  }, [idx, loaded, applyChapter])

  // Initial chapter on load
  useEffect(() => {
    if (loaded) {
      setTimeout(() => applyChapter(0), 500)
    }
  }, [loaded])

  // ─── Auto-play ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!playing) return
    const DURATION = 8000
    let startTime = Date.now()
    let rafId

    const tick = () => {
      const elapsed = Date.now() - startTime
      const p = Math.min(elapsed / DURATION, 1)
      setProgress(p)
      if (p >= 1) {
        setIdx(i => {
          const next = (i + 1) % CHAPTERS.length
          return next
        })
        startTime = Date.now()
        setProgress(0)
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [playing, idx])

  const goTo = (i) => {
    setIdx(i)
    setProgress(0)
  }

  const formatStat = (n) => {
    if (n >= 1000000) return (n/1000000).toFixed(1) + 'M'
    if (n >= 1000) return n.toLocaleString()
    return n.toString()
  }

  // ─── Era label ─────────────────────────────────────────────────────────────
  const ERA_LABELS = {
    ancient: { label: 'ANCIENT ERA', color: C.camel },
    sea:     { label: 'SEA ROUTES',  color: C.sea   },
    transition: { label: 'AGE OF STEAM', color: '#aaa' },
    modern:  { label: 'MODERN ERA',  color: C.air   },
    eternal: { label: 'ETERNAL',     color: C.gold  },
  }
  const era = ERA_LABELS[chapter.era] || ERA_LABELS.eternal

  // ─── Dot progress indicator ────────────────────────────────────────────────
  const DOT_COLORS = {
    reveal: C.gold,
    ancient: C.camel,
    sea: C.sea,
    modern: C.air,
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: C.bg, overflow: 'hidden', fontFamily: 'Lato, sans-serif' }}>

      {/* ── MAP ── */}
      <div ref={mapContainer} style={{ position: 'absolute', inset: 0 }} />

      {/* ── GRID OVERLAY ── */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1,
        backgroundImage: `linear-gradient(rgba(201,184,138,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(201,184,138,0.025) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      {/* ── HERO GLOW top-left ── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '600px', height: '400px',
        background: 'radial-gradient(ellipse at top left, rgba(201,184,138,0.045) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* ── MECCA GLOW RIGHT (ambient) ── */}
      <div style={{
        position: 'fixed', right: 0, bottom: '20%', width: '400px', height: '400px',
        background: 'radial-gradient(ellipse at center right, rgba(196,147,90,0.06) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* ══════════════════════════════════════════════════════════════════════
          FLOATING UI LAYER
      ══════════════════════════════════════════════════════════════════════ */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}>

        {/* ── TOP LEFT: Back + Era ── */}
        <div style={{ position: 'absolute', top: 28, left: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={() => navigate('/maps')}
            style={{
              pointerEvents: 'all', background: 'rgba(18,17,14,0.7)',
              border: '1px solid rgba(201,184,138,0.15)', color: C.gold,
              fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.15em',
              padding: '7px 14px', cursor: 'pointer', backdropFilter: 'blur(8px)',
              textTransform: 'uppercase',
            }}
          >← Maps</button>

          {/* Era label */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible ? 'translateY(0)' : 'translateY(-8px)',
            transition: 'all 0.5s ease',
          }}>
            <div style={{ width: 20, height: 1, background: era.color }} />
            <span style={{
              fontFamily: "'DM Mono', monospace", fontSize: 9,
              letterSpacing: '0.22em', color: era.color, textTransform: 'uppercase',
            }}>{era.label}</span>
          </div>
        </div>

        {/* ── TOP RIGHT: Chapter counter ── */}
        <div style={{
          position: 'absolute', top: 28, right: 32,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4,
          opacity: titleVisible ? 1 : 0, transition: 'opacity 0.5s ease',
        }}>
          <span style={{
            fontFamily: "'DM Mono', monospace", fontSize: 9,
            letterSpacing: '0.18em', color: C.muted, textTransform: 'uppercase',
          }}>Chapter</span>
          <span style={{
            fontFamily: "'Playfair Display', serif", fontSize: 28,
            color: C.gold, lineHeight: 1, fontWeight: 700,
          }}>
            {String(idx + 1).padStart(2, '0')}
            <span style={{ fontSize: 14, color: C.muted, fontWeight: 400 }}>/{CHAPTERS.length}</span>
          </span>
        </div>

        {/* ── CENTRE: Arabic calligraphy ── */}
        <div style={{
          position: 'absolute', top: '15%', left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          opacity: arabicVisible ? 1 : 0,
          transition: `opacity ${transitioning ? '0.3s' : '0.8s'} ease`,
          pointerEvents: 'none',
        }}>
          <div style={{
            fontFamily: "'Amiri', serif",
            fontSize: chapter.era === 'eternal' ? 'clamp(28px, 4vw, 52px)' : 'clamp(18px, 2.5vw, 32px)',
            color: C.arabicGold,
            letterSpacing: '0.04em',
            lineHeight: 1.4,
            textShadow: '0 0 40px rgba(201,184,138,0.4)',
            direction: 'rtl',
          }}>
            {chapter.arabicTitle}
          </div>
          {chapter.arabicSub && (
            <div style={{
              fontFamily: "'Amiri', serif",
              fontSize: 'clamp(13px, 1.8vw, 20px)',
              color: C.goldDim,
              marginTop: 8,
              direction: 'rtl',
              opacity: 0.8,
            }}>
              {chapter.arabicSub}
            </div>
          )}
        </div>

        {/* ── BOTTOM LEFT: Chapter text block ── */}
        <div style={{
          position: 'absolute', bottom: 110, left: 32,
          maxWidth: 440,
          opacity: titleVisible ? 1 : 0,
          transform: titleVisible ? 'translateY(0)' : 'translateY(16px)',
          transition: `all ${transitioning ? '0.2s' : '0.7s'} ease`,
        }}>
          {/* Badge */}
          <div style={{
            fontFamily: "'DM Mono', monospace", fontSize: 9,
            letterSpacing: '0.22em', color: C.muted,
            textTransform: 'uppercase', marginBottom: 10,
          }}>
            {chapter.badge}
            {chapter.year && (
              <span style={{ color: era.color, marginLeft: 12 }}>{chapter.year}</span>
            )}
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(22px, 3vw, 38px)',
            color: C.text,
            fontWeight: 700,
            margin: '0 0 6px',
            lineHeight: 1.15,
            letterSpacing: '-0.01em',
          }}>
            {chapter.title}
          </h1>

          {/* Subtitle */}
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11, color: C.goldDim,
            letterSpacing: '0.08em', marginBottom: 14,
          }}>
            {chapter.subtitle}
          </div>

          {/* Body — glass card */}
          <div style={{
            background: 'rgba(12,10,7,0.72)',
            border: '1px solid rgba(201,184,138,0.1)',
            backdropFilter: 'blur(12px)',
            padding: '14px 18px',
            marginBottom: 14,
          }}>
            <p style={{
              fontFamily: "'Lato', sans-serif", fontSize: 13,
              color: 'rgba(240,232,216,0.78)', lineHeight: 1.75,
              margin: 0, fontWeight: 300,
            }}>
              {chapter.body}
            </p>
          </div>

          {/* Quote */}
          {chapter.quote && (
            <div style={{
              borderLeft: `2px solid ${era.color}`,
              paddingLeft: 14,
            }}>
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 12, fontStyle: 'italic',
                color: C.goldDim, lineHeight: 1.65, margin: 0,
              }}>
                "{chapter.quote}"
              </p>
              {chapter.quoteAuthor && (
                <p style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 9,
                  letterSpacing: '0.15em', color: C.muted,
                  margin: '6px 0 0', textTransform: 'uppercase',
                }}>
                  — {chapter.quoteAuthor}
                </p>
              )}
            </div>
          )}
        </div>

        {/* ── BOTTOM RIGHT: Animated stat ── */}
        <div style={{
          position: 'absolute', bottom: 110, right: 32,
          textAlign: 'right',
          opacity: statVisible ? 1 : 0,
          transform: statVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: `all ${transitioning ? '0.2s' : '0.8s'} ease`,
        }}>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(42px, 6vw, 72px)',
            color: era.color,
            fontWeight: 700,
            lineHeight: 1,
            textShadow: `0 0 30px ${era.color}44`,
          }}>
            {formatStat(statVal)}
          </div>
          <div style={{
            fontFamily: "'DM Mono', monospace", fontSize: 9,
            letterSpacing: '0.18em', color: C.muted,
            textTransform: 'uppercase', marginTop: 6,
            maxWidth: 180,
          }}>
            {chapter.statLabel}
          </div>
        </div>

        {/* ── LEGEND (middle right) ── */}
        {(chapter.type === 'ancient' || chapter.era === 'ancient') && (
          <div style={{
            position: 'absolute', right: 32, top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(12,10,7,0.7)',
            border: '1px solid rgba(201,184,138,0.1)',
            backdropFilter: 'blur(8px)',
            padding: '14px 16px',
            display: 'flex', flexDirection: 'column', gap: 10,
            opacity: titleVisible ? 1 : 0, transition: 'opacity 0.5s',
          }}>
            <LegendRow color={C.camel} label="Camel Route" icon="🐪" />
            <LegendRow color={C.sea}   label="Sea Route"   icon="⛵" />
          </div>
        )}
        {(chapter.type === 'modern' || chapter.era === 'modern') && (
          <div style={{
            position: 'absolute', right: 32, top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(12,10,7,0.7)',
            border: '1px solid rgba(201,184,138,0.1)',
            backdropFilter: 'blur(8px)',
            padding: '14px 16px',
            display: 'flex', flexDirection: 'column', gap: 10,
            opacity: titleVisible ? 1 : 0, transition: 'opacity 0.5s',
          }}>
            <LegendRow color={C.air} label="Air Corridor" icon="✈️" />
            {chapter.id === 'today' && <LegendRow color={C.gold} label="2.5M Pilgrims" icon="🕋" />}
          </div>
        )}

        {/* ── BOTTOM: Progress bar + dot scrubber ── */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'rgba(12,10,7,0.85)',
          borderTop: '1px solid rgba(201,184,138,0.08)',
          backdropFilter: 'blur(8px)',
          padding: '12px 32px',
        }}>
          {/* Progress bar */}
          <div style={{ height: 1, background: 'rgba(201,184,138,0.08)', marginBottom: 12, position: 'relative' }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, height: '100%',
              width: `${progress * 100}%`,
              background: era.color,
              transition: 'width 0.1s linear',
            }} />
          </div>

          {/* Dot scrubber + controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            {/* Play/Pause */}
            <button
              onClick={() => setPlaying(p => !p)}
              style={{
                pointerEvents: 'all',
                background: 'none', border: 'none', cursor: 'pointer',
                color: C.gold, fontSize: 14, padding: '0 16px 0 0',
                fontFamily: "'DM Mono', monospace",
              }}
            >{playing ? '⏸' : '▶'}</button>

            {/* Dots */}
            <div style={{ display: 'flex', gap: 6, flex: 1, alignItems: 'center' }}>
              {CHAPTERS.map((ch, i) => {
                const dotColor = DOT_COLORS[ch.type] || C.gold
                const isActive = i === idx
                return (
                  <button
                    key={ch.id}
                    onClick={() => { goTo(i); setPlaying(false) }}
                    title={ch.title}
                    style={{
                      pointerEvents: 'all',
                      width: isActive ? 24 : 8,
                      height: 8,
                      borderRadius: 4,
                      background: isActive ? dotColor : 'rgba(201,184,138,0.15)',
                      border: 'none', cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  />
                )
              })}
            </div>

            {/* Prev/Next */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => { goTo(Math.max(0, idx - 1)); setPlaying(false) }}
                style={{ pointerEvents: 'all', background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 16, padding: '0 4px' }}
              >‹</button>
              <button
                onClick={() => { goTo(Math.min(CHAPTERS.length - 1, idx + 1)); setPlaying(false) }}
                style={{ pointerEvents: 'all', background: 'none', border: 'none', cursor: 'pointer', color: C.gold, fontSize: 16, padding: '0 4px' }}
              >›</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Legend row ───────────────────────────────────────────────────────────────
const LegendRow = ({ color, label, icon }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <span style={{ fontSize: 12 }}>{icon}</span>
    <div style={{ width: 16, height: 2, background: color, opacity: 0.8 }} />
    <span style={{
      fontFamily: "'DM Mono', monospace", fontSize: 9,
      letterSpacing: '0.14em', color: 'rgba(240,232,216,0.6)',
      textTransform: 'uppercase',
    }}>{label}</span>
  </div>
)

export default HajjMap