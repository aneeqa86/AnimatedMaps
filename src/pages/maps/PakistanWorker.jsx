import React, { useEffect, useRef, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import { Link } from 'react-router-dom'
import { CHAPTERS, CHAPTER_ICONS, MIGRATION_FLOWS, CITY_MARKERS } from '../../data/pakistanWorker'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const useCounter = (target, duration = 1200) => {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!target) { setValue(0); return }
    let current = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      current += step
      if (current >= target) { setValue(target); clearInterval(timer) }
      else setValue(Math.floor(current * 10) / 10)
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return value
}

// SVG crowd for origin cities (gold)
const crowdOriginSVG = (color = '#C9B88A') => `
  <svg viewBox="0 0 80 60" width="70" height="52" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.5">
      <circle cx="8" cy="6" r="4.5" fill="${color}"/>
      <rect x="4" y="11" width="7" height="13" rx="2" fill="${color}"/>
      <rect x="1" y="13" width="3.5" height="9" rx="1.5" fill="${color}"/>
      <rect x="11" y="13" width="3.5" height="9" rx="1.5" fill="${color}"/>
      <rect x="4" y="24" width="3" height="10" rx="1.5" fill="${color}"/>
      <rect x="8" y="24" width="3" height="10" rx="1.5" fill="${color}"/>
    </g>
    <g>
      <circle cx="26" cy="4" r="5.5" fill="${color}"/>
      <rect x="21" y="10" width="9" height="16" rx="2" fill="${color}"/>
      <rect x="30" y="4" width="4" height="9" rx="2" fill="${color}"/>
      <rect x="17" y="12" width="4" height="11" rx="1.5" fill="${color}"/>
      <rect x="21" y="26" width="4" height="12" rx="1.5" fill="${color}"/>
      <rect x="27" y="26" width="4" height="12" rx="1.5" fill="${color}"/>
    </g>
    <g opacity="0.8">
      <circle cx="45" cy="7" r="4.5" fill="${color}"/>
      <rect x="41" y="12" width="8" height="14" rx="2" fill="${color}"/>
      <rect x="37" y="14" width="3.5" height="9" rx="1.5" fill="${color}"/>
      <rect x="49" y="14" width="3.5" height="9" rx="1.5" fill="${color}"/>
      <rect x="41" y="26" width="3.5" height="10" rx="1.5" fill="${color}"/>
      <rect x="46" y="26" width="3.5" height="10" rx="1.5" fill="${color}"/>
    </g>
    <g opacity="0.45">
      <circle cx="62" cy="10" r="4" fill="${color}"/>
      <rect x="58" y="15" width="7" height="12" rx="2" fill="${color}"/>
      <rect x="58" y="27" width="3" height="9" rx="1.5" fill="${color}"/>
      <rect x="63" y="27" width="3" height="9" rx="1.5" fill="${color}"/>
    </g>
    <line x1="0" y1="46" x2="75" y2="46" stroke="${color}" stroke-width="0.8" opacity="0.3"/>
    <circle cx="37" cy="46" r="36" fill="none" stroke="${color}" stroke-width="0.5" opacity="0.12"/>
  </svg>
`

// SVG protest crowd for labor events (red)
const crowdLaborSVG = (color = '#8B1A1A') => `
  <svg viewBox="0 0 90 75" width="80" height="66" xmlns="http://www.w3.org/2000/svg">
    <rect x="22" y="0" width="38" height="16" rx="0" fill="${color}" opacity="0.85"/>
    <text x="41" y="11" font-family="monospace" font-size="6.5" fill="#E8E0D0" text-anchor="middle" letter-spacing="0.5">WORKERS</text>
    <line x1="41" y1="16" x2="41" y2="28" stroke="${color}" stroke-width="1.5" opacity="0.9"/>
    <g transform="translate(0,22)" opacity="0.85">
      <circle cx="8" cy="6" r="4.5" fill="${color}"/>
      <rect x="4" y="11" width="7" height="14" rx="2" fill="${color}"/>
      <rect x="0" y="7" width="3.5" height="9" rx="1.5" fill="${color}"/>
      <rect x="11" y="13" width="3.5" height="9" rx="1.5" fill="${color}"/>
      <rect x="4" y="25" width="3" height="11" rx="1.5" fill="${color}"/>
      <rect x="8" y="25" width="3" height="11" rx="1.5" fill="${color}"/>
    </g>
    <g transform="translate(16,16)">
      <circle cx="9" cy="6" r="5.5" fill="${color}"/>
      <rect x="4" y="12" width="10" height="17" rx="2" fill="${color}"/>
      <rect x="14" y="2" width="5" height="8" rx="2" fill="${color}"/>
      <rect x="0" y="13" width="4" height="11" rx="1.5" fill="${color}"/>
      <rect x="4" y="29" width="4" height="12" rx="1.5" fill="${color}"/>
      <rect x="10" y="29" width="4" height="12" rx="1.5" fill="${color}"/>
    </g>
    <g transform="translate(33,20)" opacity="0.9">
      <circle cx="8" cy="6" r="4.5" fill="${color}"/>
      <rect x="4" y="11" width="8" height="14" rx="2" fill="${color}"/>
      <rect x="0" y="6" width="3.5" height="10" rx="1.5" fill="${color}"/>
      <rect x="12" y="13" width="3.5" height="9" rx="1.5" fill="${color}"/>
      <rect x="4" y="25" width="3.5" height="10" rx="1.5" fill="${color}"/>
      <rect x="8.5" y="25" width="3.5" height="10" rx="1.5" fill="${color}"/>
    </g>
    <g transform="translate(49,24)" opacity="0.65">
      <circle cx="7" cy="5" r="4" fill="${color}"/>
      <rect x="3" y="10" width="7" height="12" rx="2" fill="${color}"/>
      <rect x="3" y="22" width="3" height="9" rx="1.5" fill="${color}"/>
      <rect x="7" y="22" width="3" height="9" rx="1.5" fill="${color}"/>
    </g>
    <g transform="translate(62,28)" opacity="0.4">
      <circle cx="7" cy="5" r="3.5" fill="${color}"/>
      <rect x="3" y="10" width="7" height="11" rx="2" fill="${color}"/>
      <rect x="3" y="21" width="3" height="8" rx="1.5" fill="${color}"/>
      <rect x="7" y="21" width="3" height="8" rx="1.5" fill="${color}"/>
    </g>
    <line x1="-4" y1="62" x2="82" y2="62" stroke="${color}" stroke-width="0.8" opacity="0.35"/>
  </svg>
`

// Walking migrant SVG (for animated marker)
const walkerSVG = (color = '#C9B88A') => `
  <svg viewBox="0 0 24 44" width="18" height="33" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="5" r="4.5" fill="${color}"/>
    <rect x="8" y="10" width="8" height="14" rx="2" fill="${color}"/>
    <rect x="16" y="9" width="7" height="6" rx="1" fill="${color}" opacity="0.75"/>
    <line x1="16" y1="11" x2="16" y2="11" stroke="${color}" stroke-width="1.5"/>
    <rect x="2" y="11" width="4" height="12" rx="2" fill="${color}" transform="rotate(-12 4 11)"/>
    <rect x="18" y="12" width="4" height="12" rx="2" fill="${color}" transform="rotate(12 20 12)"/>
    <rect x="7" y="24" width="4" height="14" rx="2" fill="${color}" transform="rotate(-8 9 24)"/>
    <rect x="13" y="24" width="4" height="14" rx="2" fill="${color}" transform="rotate(8 15 24)"/>
  </svg>
`

const PakistanWorker = () => {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])
  const walkerMarkersRef = useRef([])
  const walkerAnimRef = useRef([])
  const [currentChapter, setCurrentChapter] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const intervalRef = useRef(null)

  const chapter = CHAPTERS[currentChapter]
  const workerCount = useCounter(chapter.stats.workers)
  const remittanceCount = useCounter(chapter.stats.remittance)
  const progress = (currentChapter / (CHAPTERS.length - 1)) * 100
  const iconColor = chapter.type === 'labor' ? '#8B1A1A' : '#C9B88A'

  const isLaborChapter = chapter.type === 'labor'

  const buildCityMarkerEl = useCallback((marker) => {
    const isOrigin = marker.type === 'origin'
    const color = isOrigin ? '#C9B88A' : '#8B1A1A'
    const svgContent = isOrigin ? crowdOriginSVG(color) : crowdOriginSVG(color)

    const el = document.createElement('div')
    el.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      opacity: 0;
      transition: opacity 0.8s ease;
      pointer-events: none;
      transform: translate(-50%, -100%);
      cursor: default;
    `
    el.innerHTML = `
      <div style="filter: drop-shadow(0 0 6px ${color}44);">
        ${svgContent}
      </div>
      <div style="
        background: rgba(8,8,8,0.95);
        border: 1px solid ${color}33;
        padding: 3px 8px;
        white-space: nowrap;
      ">
        <div style="font-family:'DM Mono',monospace;font-size:9px;color:${color};letter-spacing:0.12em;line-height:1.5;">${marker.name}</div>
        <div style="font-family:'DM Mono',monospace;font-size:8px;color:#555;letter-spacing:0.08em;line-height:1.4;">${marker.workers}</div>
      </div>
    `
    return el
  }, [])

  // Animate a walker along a line between two coordinates
  const animateWalker = useCallback((map, from, to, walkerEl, duration = 8000) => {
    let start = null
    let animId = null

    const step = (timestamp) => {
      if (!start) start = timestamp
      const elapsed = timestamp - start
      const t = Math.min(elapsed / duration, 1)

      const lng = from[0] + (to[0] - from[0]) * t
      const lat = from[1] + (to[1] - from[1]) * t

      // Get pixel position
      const pos = map.project([lng, lat])
      walkerEl.style.left = `${pos.x}px`
      walkerEl.style.top = `${pos.y}px`
      walkerEl.style.opacity = t < 0.05 ? `${t / 0.05}` : t > 0.92 ? `${(1 - t) / 0.08}` : '1'

      if (t < 1) {
        animId = requestAnimationFrame(step)
      } else {
        // Loop
        start = null
        animId = requestAnimationFrame(step)
      }
    }

    animId = requestAnimationFrame(step)
    return animId
  }, [])

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [67.0, 30.0],
      zoom: 4.5,
      projection: 'globe',
    })

    map.on('load', () => {
      map.setFog({
        color: 'rgb(8,8,8)',
        'high-color': 'rgb(12,12,24)',
        'horizon-blend': 0.02,
        'space-color': 'rgb(3,3,8)',
        'star-intensity': 0.9,
      })

      // Pakistan fill
      map.addLayer({
        id: 'pakistan-fill', type: 'fill',
        source: { type: 'vector', url: 'mapbox://mapbox.country-boundaries-v1' },
        'source-layer': 'country_boundaries',
        filter: ['==', 'iso_3166_1_alpha_3', 'PAK'],
        paint: { 'fill-color': '#C9B88A', 'fill-opacity': 0 },
      })
      map.addLayer({
        id: 'pakistan-border', type: 'line',
        source: { type: 'vector', url: 'mapbox://mapbox.country-boundaries-v1' },
        'source-layer': 'country_boundaries',
        filter: ['==', 'iso_3166_1_alpha_3', 'PAK'],
        paint: { 'line-color': '#C9B88A', 'line-width': 0, 'line-opacity': 0 },
      })

      // Gulf fills
      const gulfISOs = ['SAU', 'ARE', 'QAT', 'KWT', 'OMN', 'BHR']
      map.addLayer({
        id: 'gulf-fill', type: 'fill',
        source: { type: 'vector', url: 'mapbox://mapbox.country-boundaries-v1' },
        'source-layer': 'country_boundaries',
        filter: ['in', 'iso_3166_1_alpha_3', ...gulfISOs],
        paint: { 'fill-color': '#8B1A1A', 'fill-opacity': 0 },
      })
      map.addLayer({
        id: 'gulf-border', type: 'line',
        source: { type: 'vector', url: 'mapbox://mapbox.country-boundaries-v1' },
        'source-layer': 'country_boundaries',
        filter: ['in', 'iso_3166_1_alpha_3', ...gulfISOs],
        paint: { 'line-color': '#8B1A1A', 'line-width': 0, 'line-opacity': 0 },
      })

      // Flow lines
      map.addSource('flows', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: MIGRATION_FLOWS.map((f, i) => ({
            type: 'Feature', id: i,
            properties: {},
            geometry: { type: 'LineString', coordinates: [f.from, f.to] },
          })),
        },
      })
      map.addLayer({
        id: 'flow-glow', type: 'line', source: 'flows',
        paint: { 'line-color': '#C9B88A', 'line-width': 0, 'line-opacity': 0, 'line-blur': 4 },
        layout: { 'line-cap': 'round' },
      })
      map.addLayer({
        id: 'flow-lines', type: 'line', source: 'flows',
        paint: { 'line-color': '#C9B88A', 'line-width': 0, 'line-opacity': 0, 'line-dasharray': [2, 3] },
        layout: { 'line-cap': 'round' },
      })

      // City crowd markers
      const markers = CITY_MARKERS.map(m => {
        const el = buildCityMarkerEl(m)
        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat(m.coords)
          .addTo(map)
        return { marker, el, data: m }
      })
      markersRef.current = markers

      // Walker markers (one per flow)
      const mapContainer = map.getContainer()
      const walkers = MIGRATION_FLOWS.map((flow) => {
        const el = document.createElement('div')
        el.style.cssText = `
          position: absolute;
          opacity: 0;
          transition: opacity 0.4s;
          pointer-events: none;
          transform: translate(-50%, -50%);
          filter: drop-shadow(0 0 4px #C9B88A66);
          z-index: 5;
        `
        el.innerHTML = walkerSVG('#C9B88A')
        mapContainer.appendChild(el)
        return { el, flow }
      })
      walkerMarkersRef.current = walkers

      mapRef.current = map
      setMapLoaded(true)
    })

    const style = document.createElement('style')
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Mono:wght@300;400;500&family=Lato:wght@300;400;700&display=swap');
      .mapboxgl-ctrl-bottom-left,.mapboxgl-ctrl-bottom-right{display:none!important}
      @keyframes walkerBob {
        0%,100%{transform:translate(-50%,-50%) rotate(-1deg)}
        50%{transform:translate(-50%,-52%) rotate(1deg)}
      }
    `
    document.head.appendChild(style)

    return () => {
      walkerAnimRef.current.forEach(id => cancelAnimationFrame(id))
      map.remove()
    }
  }, [buildCityMarkerEl, animateWalker])

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return
    const map = mapRef.current
    const showFlows = chapter.type === 'migration' || chapter.type === 'both'
    const showPak = chapter.type === 'labor' || chapter.type === 'both'
    const showGulf = chapter.type === 'migration' || chapter.type === 'both'

    const set = (id, props) => Object.entries(props).forEach(([p, v]) => {
      try { map.setPaintProperty(id, p, v) } catch (e) {}
    })

    set('pakistan-fill', { 'fill-opacity': showPak ? 0.1 : 0 })
    set('pakistan-border', { 'line-width': showPak ? 1.5 : 0, 'line-opacity': showPak ? 0.9 : 0 })
    set('gulf-fill', { 'fill-opacity': showGulf ? 0.08 : 0 })
    set('gulf-border', { 'line-width': showGulf ? 1 : 0, 'line-opacity': showGulf ? 0.7 : 0 })
    set('flow-glow', { 'line-width': showFlows ? 5 : 0, 'line-opacity': showFlows ? 0.12 : 0 })
    set('flow-lines', { 'line-width': showFlows ? 1.5 : 0, 'line-opacity': showFlows ? 0.85 : 0 })

    // City crowd markers — show on migration, use labor SVG on labor
    markersRef.current.forEach(({ el, data }) => {
      const isOrigin = data.type === 'origin'
      const color = isOrigin ? '#C9B88A' : '#8B1A1A'
      const svgContent = showFlows
        ? (isOrigin ? crowdOriginSVG('#C9B88A') : crowdOriginSVG('#8B1A1A'))
        : (showPak && isOrigin ? crowdLaborSVG('#8B1A1A') : '')

      const svgWrapper = el.querySelector('div:first-child')
      if (svgWrapper) {
        svgWrapper.innerHTML = svgContent
        svgWrapper.style.filter = `drop-shadow(0 0 6px ${color}44)`
      }

      const visible = showFlows || (showPak && isOrigin)
      el.style.opacity = visible ? '1' : '0'
      el.style.pointerEvents = visible ? 'auto' : 'none'
    })

    // Walker animation
    walkerAnimRef.current.forEach(id => cancelAnimationFrame(id))
    walkerAnimRef.current = []

    walkerMarkersRef.current.forEach(({ el, flow }, i) => {
      if (showFlows) {
        el.style.opacity = '1'
        el.style.animation = 'walkerBob 0.6s ease-in-out infinite'
        const duration = 7000 + i * 1200
        const animId = animateWalker(map, flow.from, flow.to, el, duration)
        walkerAnimRef.current.push(animId)
      } else {
        el.style.opacity = '0'
        el.style.animation = 'none'
      }
    })

    map.flyTo({
      center: chapter.location.center,
      zoom: chapter.location.zoom,
      duration: 2600,
      essential: true,
    })
  }, [currentChapter, mapLoaded, chapter, animateWalker])

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setCurrentChapter(prev => {
          const next = prev + 1
          if (next >= CHAPTERS.length) { setPlaying(false); return prev }
          return next
        })
      }, 5500)
    }
    return () => clearInterval(intervalRef.current)
  }, [playing])

  const goToChapter = (i) =>
    setCurrentChapter(Math.max(0, Math.min(CHAPTERS.length - 1, i)))

  return (
    <div style={S.root}>
      <div ref={mapContainerRef} style={S.map} />

      {/* NAV */}
      <nav style={S.nav}>
        <Link to="/maps" style={S.navBack}>← The Atlas</Link>
        <span style={S.navTitle}>The Pakistani Worker</span>
        <span style={S.navMeta}>{currentChapter + 1} / {CHAPTERS.length}</span>
      </nav>

      {/* CHAPTER PANEL */}
      <div style={S.panel}>
        <div style={S.panelTop}>
          <span
            style={{ color: iconColor, display: 'flex', alignItems: 'center' }}
            dangerouslySetInnerHTML={{ __html: CHAPTER_ICONS[chapter.id] }}
          />
          <div style={{ ...S.badge, borderColor: iconColor, color: iconColor }}>
            {chapter.type === 'labor' ? '⚑ Labor' :
              chapter.type === 'migration' ? '→ Migration' : '◎ Both'}
          </div>
        </div>

        <div style={S.year}>{chapter.year}</div>
        <h2 style={S.title}>{chapter.title}</h2>
        <p style={S.subtitle}>{chapter.subtitle}</p>
        <p style={S.body}>{chapter.body}</p>

        {chapter.quote && (
          <div style={S.quoteBlock}>
            <div style={{ ...S.quoteBar, background: iconColor }} />
            <div style={S.quoteInner}>
              <p style={S.quoteText}>"{chapter.quote.text}"</p>
              <p style={S.quoteAuthor}>— {chapter.quote.author}</p>
            </div>
          </div>
        )}

        {(chapter.stats.workers > 0 || chapter.stats.remittance > 0) && (
          <div style={S.statsRow}>
            {chapter.stats.workers > 0 && (
              <div style={S.statBox}>
                <span style={S.statNum}>
                  {Math.round(workerCount).toLocaleString()}
                  <span style={S.statUnit}>K</span>
                </span>
                <span style={S.statLabel}>Workers / yr</span>
              </div>
            )}
            {chapter.stats.remittance > 0 && (
              <div style={S.statBox}>
                <span style={S.statNum}>
                  ${remittanceCount.toFixed(1)}
                  <span style={S.statUnit}>B</span>
                </span>
                <span style={S.statLabel}>Remittances</span>
              </div>
            )}
          </div>
        )}

        <div style={S.controls}>
          <button
            onClick={() => goToChapter(currentChapter - 1)}
            disabled={currentChapter === 0}
            style={{ ...S.btn, opacity: currentChapter === 0 ? 0.25 : 1 }}
          >←</button>
          <button
            onClick={() => setPlaying(p => !p)}
            style={{ ...S.btn, ...S.btnPlay, borderColor: iconColor + '66', color: iconColor }}
          >
            {playing ? '⏸ Pause' : '▶ Play'}
          </button>
          <button
            onClick={() => goToChapter(currentChapter + 1)}
            disabled={currentChapter === CHAPTERS.length - 1}
            style={{ ...S.btn, opacity: currentChapter === CHAPTERS.length - 1 ? 0.25 : 1 }}
          >→</button>
        </div>

        <div style={S.progressTrack}>
          <div style={{ ...S.progressFill, width: `${progress}%`, background: iconColor }} />
        </div>
      </div>

      {/* TIMELINE */}
      <div style={S.timeline}>
        {CHAPTERS.map((ch, i) => (
          <button
            key={ch.id}
            onClick={() => goToChapter(i)}
            title={`${ch.year} — ${ch.title}`}
            style={{
              ...S.tick,
              background: i === currentChapter ? '#C9B88A'
                : i < currentChapter ? '#3a3a3a' : '#1a1a1a',
              transform: i === currentChapter ? 'scaleY(1)' : 'scaleY(0.35)',
              borderColor: ch.type === 'labor' ? '#8B1A1A55'
                : ch.type === 'migration' ? '#C9B88A33' : '#2a2a2a',
            }}
          />
        ))}
      </div>

      {/* LEGEND */}
      <div style={S.legend}>
        <p style={S.legendTitle}>Map Key</p>
        <div style={S.legendItem}>
          <div style={{ ...S.legendDot, background: '#C9B88A' }} />
          <span style={S.legendLabel}>Pakistan / Origin</span>
        </div>
        <div style={S.legendItem}>
          <div style={{ ...S.legendDot, background: '#8B1A1A' }} />
          <span style={S.legendLabel}>Gulf States / Dest.</span>
        </div>
        <div style={S.legendItem}>
          <div style={{ width: 16, height: 0, borderTop: '1px dashed #C9B88A', flexShrink: 0 }} />
          <span style={S.legendLabel}>Migration Flow</span>
        </div>
        <div style={S.legendItem}>
          <div style={{ ...S.legendDot, background: '#C9B88A', borderRadius: 0, width: 10, height: 14 }} />
          <span style={S.legendLabel}>Worker</span>
        </div>
      </div>
    </div>
  )
}

const S = {
  root: {
    position: 'relative', width: '100vw', height: '100vh',
    background: '#0D0D0D', overflow: 'hidden',
    fontFamily: "'Lato', sans-serif",
  },
  map: { position: 'absolute', inset: 0, width: '100%', height: '100%' },
  nav: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 32px',
    background: 'linear-gradient(to bottom, rgba(10,10,10,0.98), transparent)',
  },
  navBack: {
    fontFamily: "'DM Mono', monospace", fontSize: '11px',
    letterSpacing: '0.15em', color: '#555', textTransform: 'uppercase',
    textDecoration: 'none',
  },
  navTitle: {
    fontFamily: "'Playfair Display', serif", fontSize: '16px',
    color: '#E8E0D0', fontStyle: 'italic',
    position: 'absolute', left: '50%', transform: 'translateX(-50%)',
  },
  navMeta: {
    fontFamily: "'DM Mono', monospace", fontSize: '11px',
    letterSpacing: '0.15em', color: '#444',
  },
  panel: {
    position: 'absolute', bottom: '72px', left: '32px', width: '400px',
    zIndex: 10, background: 'rgba(8,8,8,0.95)',
    border: '1px solid #252525', padding: '24px 24px 18px',
    backdropFilter: 'blur(20px)',
    display: 'flex', flexDirection: 'column', gap: '10px',
  },
  panelTop: { display: 'flex', alignItems: 'center', gap: '12px' },
  badge: {
    fontFamily: "'DM Mono', monospace", fontSize: '9px',
    letterSpacing: '0.2em', border: '1px solid',
    padding: '3px 8px', textTransform: 'uppercase',
  },
  year: {
    fontFamily: "'DM Mono', monospace", fontSize: '12px',
    letterSpacing: '0.25em', color: '#C9B88A',
  },
  title: {
    fontFamily: "'Playfair Display', serif", fontSize: '26px',
    fontWeight: 700, color: '#F0E8D8', lineHeight: 1.1,
    letterSpacing: '-0.01em',
  },
  subtitle: {
    fontFamily: "'DM Mono', monospace", fontSize: '9px',
    letterSpacing: '0.18em', color: '#888', textTransform: 'uppercase',
  },
  body: {
    fontFamily: "'Lato', sans-serif", fontSize: '13px',
    lineHeight: 1.8, color: '#aaa', fontWeight: 300,
    borderTop: '1px solid #1e1e1e', paddingTop: '10px',
  },
  quoteBlock: {
    display: 'flex', gap: '10px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid #1e1e1e', padding: '12px',
  },
  quoteBar: { width: '2px', flexShrink: 0, borderRadius: 2, opacity: 0.7 },
  quoteInner: { display: 'flex', flexDirection: 'column', gap: '6px' },
  quoteText: {
    fontFamily: "'Playfair Display', serif", fontSize: '12px',
    fontStyle: 'italic', color: '#bbb', lineHeight: 1.7,
  },
  quoteAuthor: {
    fontFamily: "'DM Mono', monospace", fontSize: '8px',
    letterSpacing: '0.12em', color: '#555', textTransform: 'uppercase',
  },
  statsRow: {
    display: 'flex', gap: '24px',
    borderTop: '1px solid #1e1e1e', paddingTop: '10px',
  },
  statBox: { display: 'flex', flexDirection: 'column', gap: '3px' },
  statNum: {
    fontFamily: "'Playfair Display', serif", fontSize: '28px',
    fontWeight: 700, color: '#C9B88A', lineHeight: 1,
  },
  statUnit: { fontSize: '16px', opacity: 0.6 },
  statLabel: {
    fontFamily: "'DM Mono', monospace", fontSize: '8px',
    letterSpacing: '0.15em', color: '#555', textTransform: 'uppercase',
  },
  controls: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' },
  btn: {
    fontFamily: "'DM Mono', monospace", fontSize: '11px',
    letterSpacing: '0.12em', color: '#666',
    padding: '8px 14px', border: '1px solid #252525',
    background: 'transparent', cursor: 'pointer',
    textTransform: 'uppercase', transition: 'all 0.2s',
  },
  btnPlay: { padding: '8px 20px' },
  progressTrack: {
    height: '2px', background: '#1a1a1a',
    borderRadius: 2, overflow: 'hidden', marginTop: '2px',
  },
  progressFill: {
    height: '100%', borderRadius: 2,
    transition: 'width 0.5s ease',
  },
  timeline: {
    position: 'absolute', bottom: '28px', left: '32px', right: '32px',
    zIndex: 10, display: 'flex', alignItems: 'center', gap: '3px', height: '18px',
  },
  tick: {
    flex: 1, height: '100%', border: '1px solid',
    cursor: 'pointer', transition: 'all 0.35s', background: '#1a1a1a',
  },
  legend: {
    position: 'absolute', top: '72px', right: '32px', zIndex: 10,
    background: 'rgba(8,8,8,0.94)', border: '1px solid #252525',
    padding: '16px 20px', backdropFilter: 'blur(12px)',
    display: 'flex', flexDirection: 'column', gap: '10px',
  },
  legendTitle: {
    fontFamily: "'DM Mono', monospace", fontSize: '9px',
    letterSpacing: '0.2em', color: '#333', textTransform: 'uppercase',
    marginBottom: '2px',
  },
  legendItem: { display: 'flex', alignItems: 'center', gap: '10px' },
  legendDot: { width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0 },
  legendLabel: {
    fontFamily: "'DM Mono', monospace", fontSize: '9px',
    letterSpacing: '0.12em', color: '#666', textTransform: 'uppercase',
  },
}

export default PakistanWorker