// src/pages/maps/DinosaurMap.jsx
// "When Giants Ruled the Earth" — Cinematic Paleogeographic GIS Story Map

import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import {
  CHAPTERS, SPECIES, FOSSIL_REGIONS, DIET_COLORS, ERA_PALETTES, IMPACT_SITE
} from '@/data/dinosaurMap'

// ─── Fonts ────────────────────────────────────────────────────────────────────
const FONTS_URL = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=Cormorant+SC:wght@300;400;600&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap"

const GLOBAL_CSS = `
@keyframes fadeUp   { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
@keyframes pulseRing {
  0%   { transform:translate(-50%,-50%) scale(0.8); opacity:0.8; }
  100% { transform:translate(-50%,-50%) scale(2.4); opacity:0; }
}
@keyframes impactFlash {
  0%   { background:transparent; }
  8%   { background:rgba(255,160,40,0.85); }
  20%  { background:rgba(200,80,20,0.4); }
  100% { background:transparent; }
}
@keyframes statCount {
  from { opacity:0; transform:translateY(8px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes progressGrow {
  from { transform:scaleX(0); }
  to   { transform:scaleX(1); }
}
@keyframes particleDrift {
  0%   { transform:translateY(0px) translateX(0px); opacity:var(--op,0.5); }
  100% { transform:translateY(-120px) translateX(var(--dx,10px)); opacity:0; }
}
@keyframes markerPop {
  0%   { opacity:0; transform:scale(0.1) translateY(8px); }
  65%  { transform:scale(1.15) translateY(-2px); }
  85%  { transform:scale(0.96) translateY(1px); }
  100% { opacity:1; transform:scale(1) translateY(0); }
}
.mapboxgl-marker { will-change: transform; }
.mapboxgl-ctrl-bottom-left,.mapboxgl-ctrl-bottom-right,.mapboxgl-ctrl-attrib { display:none!important; }
.mapboxgl-popup-content { background:transparent!important; border:none!important; box-shadow:none!important; padding:0!important; }
.mapboxgl-popup-tip { display:none!important; }
.dino-marker { animation: markerPop 0.55s cubic-bezier(.34,1.56,.64,1) both; }
.dino-marker:hover .dino-icon { transform: scale(1.25) !important; }
`

// ─── Colors ───────────────────────────────────────────────────────────────────
const C = {
  ink:     '#F5EDD8',
  inkMid:  '#C8B890',
  inkDim:  '#7A6848',
  rule:    'rgba(200,184,128,0.18)',
  ruleLt:  'rgba(200,184,128,0.08)',
  accent:  '#C8A840',
  carnRed: '#E05030',
  herbGrn: '#70B050',
  omniAmb: '#D09040',
  impactO: '#E84820',
}

// ─── Marker icon SVGs by diet ─────────────────────────────────────────────────
// Vivid SVG shapes — no emoji dependency, always render with full color
const MARKER_SVG = {
  // Carnivore — angular red predator silhouette
  carnivore: (size) => `
    <svg width="${size}" height="${size}" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="rgba(10,4,2,0.85)" stroke="#E05030" stroke-width="1.5"/>
      <!-- T-rex style theropod silhouette -->
      <g fill="#E05030">
        <!-- body -->
        <ellipse cx="22" cy="21" rx="8" ry="5" />
        <!-- head -->
        <ellipse cx="31" cy="16" rx="5" ry="3.5" />
        <!-- jaw -->
        <path d="M28 18 L34 19 L33 21 Z"/>
        <!-- tail -->
        <path d="M14 21 Q8 20 6 24 Q10 22 14 23 Z"/>
        <!-- legs -->
        <rect x="18" y="25" width="3" height="5" rx="1"/>
        <rect x="23" y="25" width="3" height="5" rx="1"/>
        <!-- arm -->
        <line x1="26" y1="19" x2="28" y2="23" stroke="#E05030" stroke-width="1.5"/>
      </g>
    </svg>`,

  // Herbivore — rounded green sauropod / armoured dino silhouette
  herbivore: (size) => `
    <svg width="${size}" height="${size}" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="rgba(2,8,4,0.85)" stroke="#70B050" stroke-width="1.5"/>
      <!-- long-neck sauropod -->
      <g fill="#70B050">
        <!-- body -->
        <ellipse cx="20" cy="24" rx="9" ry="6"/>
        <!-- neck -->
        <path d="M26 20 Q30 16 32 11 Q29 13 27 17 Z"/>
        <!-- head -->
        <ellipse cx="32" cy="10" rx="4" ry="2.5"/>
        <!-- tail -->
        <path d="M11 24 Q6 22 5 26 Q9 24 12 26 Z"/>
        <!-- legs -->
        <rect x="14" y="28" width="3" height="4" rx="1"/>
        <rect x="22" y="28" width="3" height="4" rx="1"/>
      </g>
    </svg>`,

  // Omnivore — amber warm-toned small dino
  omnivore: (size) => `
    <svg width="${size}" height="${size}" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="rgba(8,5,2,0.85)" stroke="#D09040" stroke-width="1.5"/>
      <g fill="#D09040">
        <!-- small bipedal body -->
        <ellipse cx="20" cy="22" rx="6" ry="4"/>
        <!-- head -->
        <circle cx="27" cy="17" r="3.5"/>
        <!-- tail -->
        <path d="M14 22 Q9 21 8 24 Q12 22 14 24 Z"/>
        <!-- legs -->
        <rect x="17" y="25" width="2.5" height="5" rx="1"/>
        <rect x="21" y="25" width="2.5" height="5" rx="1"/>
        <!-- arms -->
        <line x1="24" y1="20" x2="27" y2="23" stroke="#D09040" stroke-width="1.2"/>
      </g>
    </svg>`,
}

// ─── ERA_BADGE ────────────────────────────────────────────────────────────────
const ERA_BADGE = {
  triassic:   { bg:'rgba(180,100,40,0.2)', border:'rgba(180,100,40,0.5)', text:'#E8A060' },
  jurassic:   { bg:'rgba(80,140,60,0.2)',  border:'rgba(80,140,60,0.5)',  text:'#90C870' },
  cretaceous: { bg:'rgba(180,150,40,0.2)', border:'rgba(180,150,40,0.5)', text:'#E8C860' },
  extinction: { bg:'rgba(200,60,20,0.25)', border:'rgba(200,60,20,0.6)',  text:'#F08040' },
  modern:     { bg:'rgba(60,120,180,0.2)', border:'rgba(60,120,180,0.5)', text:'#80C0E8' },
}

// ─── Diet color map ───────────────────────────────────────────────────────────
const DIET_COLOR = {
  carnivore: C.carnRed,
  herbivore: C.herbGrn,
  omnivore:  C.omniAmb,
}

// ─── Size scale: icon px from body length ────────────────────────────────────
const markerSize = (lengthM) => Math.max(28, Math.min(52, Math.round(28 + lengthM * 0.8)))

// ─── Component ────────────────────────────────────────────────────────────────
const DinosaurMap = () => {
  const navigate         = useNavigate()
  const mapContainer     = useRef(null)
  const mapRef           = useRef(null)
  const markersRef       = useRef([])
  const fossilMarkersRef = useRef([])
  const autoTimer        = useRef(null)
  const sceneTimers      = useRef([])
  const moveEndHandler   = useRef(null)

  const [mapReady,         setMapReady]         = useState(false)
  const [chapterIdx,       setChapterIdx]        = useState(0)
  const [autoplay,         setAutoplay]          = useState(true)
  const [panelVisible,     setPanelVisible]      = useState(false)
  const [spotlightSpecies, setSpotlightSpecies]  = useState(null)
  const [impactActive,     setImpactActive]      = useState(false)

  const ch    = CHAPTERS[chapterIdx]
  const badge = ERA_BADGE[ch.era] || ERA_BADGE.cretaceous

  const clearSceneTimers = useCallback(() => {
    sceneTimers.current.forEach(clearTimeout)
    sceneTimers.current = []
    if (mapRef.current && moveEndHandler.current) {
      mapRef.current.off('moveend', moveEndHandler.current)
      moveEndHandler.current = null
    }
  }, [])

  const clearSpeciesMarkers = useCallback(() => {
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []
  }, [])

  const clearFossilMarkers = useCallback(() => {
    fossilMarkersRef.current.forEach(m => m.remove())
    fossilMarkersRef.current = []
  }, [])

  const updateAtmosphere = useCallback((map, era) => {
    const fogSettings = {
      triassic:   { color:'rgba(80,40,12,0.9)',  high:'rgba(120,70,20,1)',  space:'rgba(8,4,0,1)',  stars:0.6 },
      jurassic:   { color:'rgba(20,50,20,0.85)', high:'rgba(40,90,30,1)',   space:'rgba(0,6,2,1)',  stars:0.3 },
      cretaceous: { color:'rgba(50,38,8,0.88)',  high:'rgba(100,80,20,1)',  space:'rgba(6,4,0,1)',  stars:0.4 },
      extinction: { color:'rgba(60,12,4,0.95)',  high:'rgba(120,30,8,1)',   space:'rgba(2,0,0,1)',  stars:0.1 },
      modern:     { color:'rgba(8,20,38,0.7)',   high:'rgba(30,60,100,1)',  space:'rgba(0,2,8,1)',  stars:0.9 },
    }
    const f = fogSettings[era] || fogSettings.cretaceous
    try { map.setFog({ color:f.color,'high-color':f.high,'horizon-blend':0.07,'space-color':f.space,'star-intensity':f.stars }) } catch(_){}
    const overlayOpacity = { triassic:0.5, jurassic:0.3, cretaceous:0.38, extinction:0.7, modern:0.15 }
    try { if(map.getLayer('paleo-overlay')) map.setPaintProperty('paleo-overlay','background-opacity',overlayOpacity[era]||0.4) } catch(_){}
  }, [])

  // ─── Place species markers — SVG icon + bright pill label ────────────────
  const placeSpeciesMarkers = useCallback((map, chapter) => {
    chapter.showSpecies.forEach((sid, i) => {
      const sp = SPECIES.find(s => s.id === sid)
      if (!sp) return

      const delay  = i * 280
      const color  = DIET_COLOR[sp.diet] || C.accent
      const sz     = markerSize(sp.lengthM)
      const svgFn  = MARKER_SVG[sp.diet] || MARKER_SVG.herbivore

      const t = setTimeout(() => {
        if (!mapRef.current) return

        // ── Outer wrapper ──
        const wrapper = document.createElement('div')
        wrapper.className = 'dino-marker'
        wrapper.style.cssText = `
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          pointer-events: auto;
          user-select: none;
        `

        // ── SVG icon ──
        const iconWrap = document.createElement('div')
        iconWrap.className = 'dino-icon'
        iconWrap.style.cssText = `
          width: ${sz}px;
          height: ${sz}px;
          transition: transform 0.15s ease;
          filter: drop-shadow(0 2px 8px rgba(0,0,0,0.9)) drop-shadow(0 0 4px ${color}88);
          display: block;
        `
        iconWrap.innerHTML = svgFn(sz)

        // ── Name label — bright pill, always readable ──
        const label = document.createElement('div')
        label.style.cssText = `
          font-family: 'DM Mono', monospace;
          font-size: 8.5px;
          font-weight: 400;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: ${color};
          background: rgba(4,2,0,0.82);
          border: 1px solid ${color}55;
          padding: 2px 7px;
          white-space: nowrap;
          pointer-events: none;
          line-height: 1.4;
          backdrop-filter: blur(4px);
        `
        label.textContent = sp.name

        wrapper.appendChild(iconWrap)
        wrapper.appendChild(label)

        wrapper.addEventListener('mouseenter', () => {
          iconWrap.style.transform = 'scale(1.3)'
          if (sp.spotlight) setSpotlightSpecies(sp)
        })
        wrapper.addEventListener('mouseleave', () => {
          iconWrap.style.transform = 'scale(1)'
        })
        wrapper.addEventListener('click', () => {
          setSpotlightSpecies(prev => prev?.id === sp.id ? null : sp)
        })

        const marker = new mapboxgl.Marker({ element: wrapper, anchor: 'bottom' })
          .setLngLat([sp.location.lng, sp.location.lat])
          .addTo(map)

        markersRef.current.push(marker)
      }, delay)

      sceneTimers.current.push(t)
    })
  }, [])

  // ─── Fossil sites ─────────────────────────────────────────────────────────
  const revealFossilSites = useCallback((map) => {
    try {
      map.setPaintProperty('fossil-dots', 'circle-opacity', 0.7)
      map.setPaintProperty('fossil-dots', 'circle-stroke-opacity', 0.5)
      map.setPaintProperty('fossil-ring', 'circle-stroke-opacity', 0.35)
    } catch(_){}

    FOSSIL_REGIONS.forEach((r, i) => {
      const t = setTimeout(() => {
        if (!mapRef.current) return
        const el = document.createElement('div')
        el.style.cssText = `
          font-family: 'DM Mono', monospace;
          font-size: 7.5px;
          letter-spacing: 0.2em;
          color: #C8A840;
          background: rgba(4,2,0,0.75);
          border: 1px solid rgba(200,168,64,0.3);
          padding: 2px 6px;
          text-transform: uppercase;
          white-space: nowrap;
          pointer-events: none;
          animation: fadeIn 1.2s ease both;
        `
        el.textContent = r.label
        const marker = new mapboxgl.Marker({ element: el, anchor: 'top', offset: [0, 8] })
          .setLngLat([r.lng, r.lat])
          .addTo(mapRef.current)
        fossilMarkersRef.current.push(marker)
      }, i * 300)
      sceneTimers.current.push(t)
    })
  }, [])

  // ─── Impact sequence ──────────────────────────────────────────────────────
  const triggerImpact = useCallback((map) => {
    setImpactActive(true)
    try {
      map.setPaintProperty('impact-circle', 'circle-opacity', 0.7)
      map.setPaintProperty('impact-circle', 'circle-radius', 60)
    } catch(_){}
    const t = setTimeout(() => {
      clearSpeciesMarkers()
      try {
        map.setPaintProperty('paleo-overlay', 'background-color', 'rgba(10,2,0,0.85)')
        map.setPaintProperty('paleo-overlay', 'background-opacity', 0.82)
      } catch(_){}
    }, 2500)
    sceneTimers.current.push(t)
  }, [clearSpeciesMarkers])

  // ─── Map init ─────────────────────────────────────────────────────────────
  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: CHAPTERS[0].mapCenter,
      zoom: CHAPTERS[0].mapZoom,
      projection: 'globe',
      attributionControl: false,
      pitch: 20,
    })
    mapRef.current = map

    map.on('style.load', () => {
      map.setFog({ color:'rgba(40,28,12,0.95)', 'high-color':'rgba(80,50,20,1)', 'horizon-blend':0.08, 'space-color':'rgba(4,2,0,1)', 'star-intensity':0.8 })
      map.addLayer({ id:'paleo-overlay', type:'background', paint:{ 'background-color':'rgba(40,24,8,0.45)', 'background-opacity':1 } })

      map.addSource('impact-site', { type:'geojson', data:{ type:'FeatureCollection', features:[{ type:'Feature', geometry:{ type:'Point', coordinates:[IMPACT_SITE.lng, IMPACT_SITE.lat] }, properties:{} }] } })
      map.addLayer({ id:'impact-circle', type:'circle', source:'impact-site', paint:{ 'circle-radius':0, 'circle-color':'#E84820', 'circle-opacity':0, 'circle-blur':1 } })

      map.addSource('fossil-regions', { type:'geojson', data:{ type:'FeatureCollection', features: FOSSIL_REGIONS.map(r => ({ type:'Feature', geometry:{ type:'Point', coordinates:[r.lng, r.lat] }, properties:{ label:r.label, id:r.id } })) } })
      map.addLayer({ id:'fossil-dots', type:'circle', source:'fossil-regions', paint:{ 'circle-radius':4, 'circle-color':'#C8A840', 'circle-opacity':0, 'circle-stroke-color':'#C8A840', 'circle-stroke-width':1, 'circle-stroke-opacity':0 } })
      map.addLayer({ id:'fossil-ring', type:'circle', source:'fossil-regions', paint:{ 'circle-radius':10, 'circle-color':'transparent', 'circle-opacity':0, 'circle-stroke-color':'#C8A840', 'circle-stroke-width':0.8, 'circle-stroke-opacity':0 } })

      setMapReady(true)
    })

    return () => {
      map.remove()
      sceneTimers.current.forEach(clearTimeout)
      if (autoTimer.current) clearTimeout(autoTimer.current)
    }
  }, []) // eslint-disable-line

  // ─── Autoplay ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapReady || !autoplay) return
    const DURATIONS = [11000, 11000, 11000, 13000, 15000, 11000]
    autoTimer.current = setTimeout(() => {
      setChapterIdx(prev => {
        if (prev < CHAPTERS.length - 1) return prev + 1
        setAutoplay(false)
        return prev
      })
    }, DURATIONS[chapterIdx] ?? 11000)
    return () => { if (autoTimer.current) clearTimeout(autoTimer.current) }
  }, [mapReady, autoplay, chapterIdx])

  // ─── Chapter transitions ──────────────────────────────────────────────────
  useEffect(() => {
    if (!mapReady) return
    const map = mapRef.current
    if (!map) return

    setPanelVisible(false)
    setSpotlightSpecies(null)
    setImpactActive(false)
    clearSpeciesMarkers()
    clearFossilMarkers()
    clearSceneTimers()

    try {
      map.setPaintProperty('fossil-dots', 'circle-opacity', 0)
      map.setPaintProperty('fossil-dots', 'circle-stroke-opacity', 0)
      map.setPaintProperty('fossil-ring', 'circle-stroke-opacity', 0)
      map.setPaintProperty('impact-circle', 'circle-opacity', 0)
      map.setPaintProperty('impact-circle', 'circle-radius', 0)
    } catch(_){}

    const FLY_DURATIONS = [2800, 3200, 3200, 3000, 4000, 3000]
    map.flyTo({
      center: ch.mapCenter,
      zoom: ch.mapZoom,
      duration: FLY_DURATIONS[chapterIdx] ?? 3200,
      pitch: ch.era === 'extinction' ? 45 : 22,
      bearing: chapterIdx * 14,
      easing: t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2,
    })

    updateAtmosphere(map, ch.era)

    const tPanel = setTimeout(() => setPanelVisible(true), 400)
    sceneTimers.current.push(tPanel)

    const onMoveEnd = () => {
      moveEndHandler.current = null
      if (ch.showSpecies?.length) placeSpeciesMarkers(map, ch)
      if (ch.showImpact) { const t = setTimeout(() => triggerImpact(map), 800); sceneTimers.current.push(t) }
      if (ch.showModern) { const t = setTimeout(() => revealFossilSites(map), 500); sceneTimers.current.push(t) }
      if (ch.era === 'cretaceous') {
        ch.showSpecies?.forEach((sid, i) => {
          const sp = SPECIES.find(s => s.id === sid)
          if (sp?.spotlight) {
            const t = setTimeout(() => setSpotlightSpecies(sp), 1800 + i * 1200)
            sceneTimers.current.push(t)
          }
        })
      }
    }
    moveEndHandler.current = onMoveEnd
    map.once('moveend', onMoveEnd)
  }, [mapReady, chapterIdx, ch, clearSpeciesMarkers, clearFossilMarkers, clearSceneTimers, updateAtmosphere, placeSpeciesMarkers, triggerImpact, revealFossilSites])

  // ─── Nav ──────────────────────────────────────────────────────────────────
  const goToChapter = useCallback((idx) => { if(idx!==chapterIdx){ setAutoplay(false); setChapterIdx(idx) } }, [chapterIdx])
  const goNext = useCallback(() => { setAutoplay(false); if(chapterIdx<CHAPTERS.length-1) setChapterIdx(c=>c+1) }, [chapterIdx])
  const goPrev = useCallback(() => { setAutoplay(false); if(chapterIdx>0) setChapterIdx(c=>c-1) }, [chapterIdx])

  // ─── Fonts ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'; link.href = FONTS_URL
    document.head.appendChild(link)
    if (!document.getElementById('dino-kf')) {
      const s = document.createElement('style')
      s.id = 'dino-kf'; s.textContent = GLOBAL_CSS
      document.head.appendChild(s)
    }
  }, [])

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{ position:'fixed', inset:0, background:'#060402', fontFamily:"'Cormorant Garamond', serif", overflow:'hidden' }}>

      <div ref={mapContainer} style={{ position:'absolute', inset:0 }} />

      {/* Impact flash */}
      {impactActive && (
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', animation:'impactFlash 4s ease-out forwards', zIndex:30 }} />
      )}

      {/* Atmospheric particles */}
      {(ch.era === 'triassic' || ch.era === 'jurassic') && (
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:5 }}>
          {[...Array(18)].map((_, i) => (
            <div key={i} style={{
              position:'absolute', left:`${10+(i*5.2)%85}%`, top:`${30+(i*7.3)%55}%`,
              width:`${3+(i%4)}px`, height:`${3+(i%4)}px`, borderRadius:'50%',
              background: ch.era==='triassic' ? 'rgba(200,120,40,0.3)' : 'rgba(80,160,40,0.25)',
              '--op':`${0.15+(i%5)*0.06}`, '--dx':`${-15+(i%7)*5}px`,
              animation:`particleDrift ${4+(i%5)}s linear infinite`,
              animationDelay:`${(i*0.4)%6}s`,
            }} />
          ))}
        </div>
      )}

      {/* Back */}
      <button onClick={() => navigate('/maps')} style={{
        position:'absolute', top:24, left:24, zIndex:100,
        background:'transparent', border:`1px solid ${C.rule}`,
        color:C.inkMid, padding:'8px 14px',
        fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:'0.2em',
        cursor:'pointer', textTransform:'uppercase', backdropFilter:'blur(8px)',
        transition:'all 0.2s ease',
      }}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.color=C.accent}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor=C.rule;e.currentTarget.style.color=C.inkMid}}
      >← All Maps</button>

      {/* Timeline */}
      <div style={{ position:'absolute', top:24, left:'50%', transform:'translateX(-50%)', zIndex:100, display:'flex', gap:6, alignItems:'center' }}>
        {CHAPTERS.map((c,i) => {
          const isActive = i===chapterIdx, isPast = i<chapterIdx
          const bClr = ERA_BADGE[c.era]
          return (
            <button key={c.id} onClick={()=>goToChapter(i)} style={{ background:'transparent', border:'none', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'4px 6px' }}>
              <div style={{ width:isActive?32:18, height:2, background:isActive?bClr.text:isPast?'rgba(200,168,64,0.4)':'rgba(200,168,64,0.15)', transition:'all 0.4s ease', borderRadius:1 }} />
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:7.5, letterSpacing:'0.18em', textTransform:'uppercase', color:isActive?bClr.text:isPast?C.inkDim:'rgba(200,168,64,0.3)', transition:'color 0.4s ease', whiteSpace:'nowrap' }}>{c.mya}</span>
            </button>
          )
        })}
      </div>

      {/* Chapter panel */}
      {panelVisible && (
        <div key={`panel-${chapterIdx}`} style={{
          position:'absolute', bottom:48, left:32, zIndex:100,
          width:380, maxWidth:'calc(100vw - 64px)',
          background:'rgba(6,4,2,0.88)', border:`1px solid ${C.rule}`,
          backdropFilter:'blur(20px)', padding:'28px 30px',
          animation:'fadeUp 0.8s cubic-bezier(.22,1,.36,1) both',
        }}>
          <div style={{ display:'inline-block', padding:'3px 10px', marginBottom:14, background:badge.bg, border:`1px solid ${badge.border}`, fontFamily:"'DM Mono',monospace", fontSize:8, letterSpacing:'0.28em', color:badge.text, textTransform:'uppercase' }}>
            {ch.badge} · {ch.period}
          </div>
          <div style={{ fontFamily:"'Cormorant SC', serif", fontWeight:600, fontSize:28, lineHeight:1.1, color:C.ink, marginBottom:6, letterSpacing:'0.02em' }}>
            {ch.title}
          </div>
          <div style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:'italic', fontSize:13, color:C.inkMid, marginBottom:14, letterSpacing:'0.04em' }}>
            {ch.subtitle}
          </div>
          <div style={{ height:1, background:C.rule, marginBottom:14 }} />
          <div style={{ fontSize:13.5, lineHeight:1.72, color:'rgba(245,237,216,0.78)', fontWeight:300, marginBottom:18 }}>
            {ch.body}
          </div>
          <div style={{ borderLeft:`2px solid ${badge.border}`, paddingLeft:14, marginBottom:20 }}>
            <div style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:'italic', fontSize:13, color:badge.text, lineHeight:1.6 }}>
              "{ch.quote}"
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
            <div style={{ fontFamily:"'Cormorant SC', serif", fontWeight:700, fontSize:32, color:badge.text, lineHeight:1, animation:'statCount 0.6s ease 0.4s both' }}>
              {ch.stat}
            </div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:'0.16em', color:C.inkDim, textTransform:'uppercase' }}>
              {ch.statLabel}
            </div>
          </div>

          {autoplay && (
            <div style={{ marginTop:16, height:1, background:'rgba(200,168,64,0.12)', overflow:'hidden' }}>
              <div style={{ height:'100%', background:badge.text, opacity:0.6, transformOrigin:'left', animation:`progressGrow ${[11,11,11,13,15,11][chapterIdx]??11}s linear both` }} />
            </div>
          )}

          <div style={{ display:'flex', gap:10, marginTop:18 }}>
            <button onClick={goPrev} disabled={chapterIdx===0} style={{
              flex:1, padding:'9px 0', background:'transparent',
              border:`1px solid ${chapterIdx===0?C.ruleLt:C.rule}`,
              color:chapterIdx===0?C.inkDim:C.inkMid,
              fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:'0.18em', textTransform:'uppercase',
              cursor:chapterIdx===0?'not-allowed':'pointer', transition:'all 0.2s',
            }}
              onMouseEnter={e=>{if(chapterIdx>0){e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.color=C.accent}}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.rule;e.currentTarget.style.color=C.inkMid}}
            >← Prev</button>
            <button onClick={goNext} disabled={chapterIdx===CHAPTERS.length-1} style={{
              flex:2, padding:'9px 0',
              background:chapterIdx<CHAPTERS.length-1?'rgba(200,168,64,0.1)':'transparent',
              border:`1px solid ${chapterIdx<CHAPTERS.length-1?badge.border:C.ruleLt}`,
              color:chapterIdx<CHAPTERS.length-1?badge.text:C.inkDim,
              fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:'0.18em', textTransform:'uppercase',
              cursor:chapterIdx<CHAPTERS.length-1?'pointer':'not-allowed', transition:'all 0.2s',
            }}>
              {chapterIdx<CHAPTERS.length-1 ? `Next: ${CHAPTERS[chapterIdx+1].title} →` : '✓ Story Complete'}
            </button>
          </div>
        </div>
      )}

      {/* Species spotlight */}
      {spotlightSpecies && (
        <div key={spotlightSpecies.id} style={{
          position:'absolute', bottom:48, right:32, zIndex:100, width:260,
          background:'rgba(6,4,2,0.92)', border:`1px solid ${DIET_COLOR[spotlightSpecies.diet]}44`,
          backdropFilter:'blur(16px)', padding:'20px 22px',
          animation:'fadeUp 0.7s cubic-bezier(.22,1,.36,1) both',
        }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:7.5, letterSpacing:'0.24em', textTransform:'uppercase', color:DIET_COLOR[spotlightSpecies.diet], marginBottom:10, opacity:0.8 }}>
            {spotlightSpecies.diet} · {spotlightSpecies.region}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
            <div style={{ width:40, height:40, flexShrink:0 }}
              dangerouslySetInnerHTML={{ __html: (MARKER_SVG[spotlightSpecies.diet] || MARKER_SVG.herbivore)(40) }}
            />
            <div style={{ fontFamily:"'Cormorant SC', serif", fontWeight:600, fontSize:18, color:C.ink, lineHeight:1.2 }}>
              {spotlightSpecies.name}
            </div>
          </div>
          <div style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:'italic', fontSize:11.5, color:C.inkMid, marginBottom:14 }}>
            {spotlightSpecies.desc}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {[
              { label:'Length', val:`${spotlightSpecies.lengthM}m` },
              { label:'Mass',   val: spotlightSpecies.massKg>=1000 ? `${(spotlightSpecies.massKg/1000).toFixed(0)}t` : `${spotlightSpecies.massKg}kg` },
              { label:'Period', val:`${spotlightSpecies.mya} Ma` },
              { label:'Region', val: spotlightSpecies.region },
            ].map(({label,val}) => (
              <div key={label}>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:7, letterSpacing:'0.18em', color:C.inkDim, textTransform:'uppercase' }}>{label}</div>
                <div style={{ fontFamily:"'Cormorant SC', serif", fontSize:15, color:DIET_COLOR[spotlightSpecies.diet], lineHeight:1.2 }}>{val}</div>
              </div>
            ))}
          </div>
          <button onClick={()=>setSpotlightSpecies(null)} style={{ position:'absolute', top:8, right:10, background:'none', border:'none', color:C.inkDim, cursor:'pointer', fontSize:14, lineHeight:1, padding:2 }}>×</button>
        </div>
      )}

      {/* Diet legend */}
      {ch.showSpecies?.length > 0 && (
        <div style={{ position:'absolute', top:72, right:24, zIndex:100, background:'rgba(6,4,2,0.82)', border:`1px solid ${C.rule}`, backdropFilter:'blur(12px)', padding:'12px 16px', animation:'fadeIn 0.8s ease both' }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:7.5, letterSpacing:'0.22em', color:C.inkDim, textTransform:'uppercase', marginBottom:10 }}>Species</div>
          {[
            { label:'Carnivore', color:C.carnRed },
            { label:'Herbivore', color:C.herbGrn },
            { label:'Omnivore',  color:C.omniAmb },
          ].map(({label,color}) => (
            <div key={label} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:color, boxShadow:`0 0 5px ${color}` }} />
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:8.5, color:C.inkMid, letterSpacing:'0.12em' }}>{label}</span>
            </div>
          ))}
          <div style={{ height:1, background:C.ruleLt, margin:'8px 0' }} />
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:7, color:C.inkDim, letterSpacing:'0.12em', lineHeight:1.5 }}>
            Hover / click to inspect<br/>Size ∝ body length
          </div>
        </div>
      )}

      {/* Chapter counter */}
      <div style={{ position:'absolute', bottom:24, right:32, zIndex:100, fontFamily:"'DM Mono',monospace", fontSize:8, letterSpacing:'0.22em', color:C.inkDim, textTransform:'uppercase', textAlign:'right' }}>
        <div style={{ fontSize:22, color:C.inkMid, fontFamily:"'Cormorant SC', serif", lineHeight:1 }}>
          {String(chapterIdx+1).padStart(2,'0')}
          <span style={{ fontSize:14, color:C.inkDim }}> / {String(CHAPTERS.length).padStart(2,'0')}</span>
        </div>
        <div style={{ marginTop:3 }}>When Giants Ruled</div>
      </div>

      {/* Autoplay toggle */}
      <button onClick={()=>setAutoplay(a=>!a)} style={{
        position:'absolute', top:24, right:80, zIndex:100,
        background:'transparent', border:`1px solid ${C.rule}`,
        color:C.inkMid, padding:'6px 12px',
        fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:'0.16em',
        cursor:'pointer', textTransform:'uppercase', backdropFilter:'blur(8px)',
        transition:'all 0.2s ease',
      }}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.color=C.accent}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor=C.rule;e.currentTarget.style.color=C.inkMid}}
      >
        {autoplay ? '⏸ Pause' : '▶ Auto'}
      </button>

      {/* Extinction ring */}
      {ch.era === 'extinction' && impactActive && (
        <div style={{ position:'absolute', top:'50%', left:'50%', width:60, height:60, borderRadius:'50%', border:`2px solid ${C.impactO}`, transform:'translate(-50%,-50%)', animation:'pulseRing 1.2s ease-out infinite', zIndex:20, pointerEvents:'none' }} />
      )}

      {/* End quote */}
      {chapterIdx === CHAPTERS.length - 1 && panelVisible && (
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', zIndex:50, textAlign:'center', pointerEvents:'none', animation:'fadeIn 1.5s ease 1.5s both' }}>
          <div style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:'italic', fontSize:18, color:'rgba(200,184,128,0.55)', letterSpacing:'0.08em', lineHeight:1.8 }}>
            "Their footprints still shape our understanding of Earth."
          </div>
        </div>
      )}

    </div>
  )
}

export default DinosaurMap