import { useEffect, useRef, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import { Link } from 'react-router-dom'
import { CHAPTERS, RENAMED_PLACES, RESISTANCE, HUBS, ADMIN_ZONES, C, DUR } from '@/data/europeMap'
import 'mapbox-gl/dist/mapbox-gl.css'

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;0,700;1,300;1,400&family=DM+Mono:wght@300;400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
a { text-decoration: none; color: inherit; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes chapterIn {
  from { opacity: 0; transform: translateY(18px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes nameMorph {
  0%   { opacity: 1; transform: translateY(0); filter: blur(0); }
  40%  { opacity: 0; transform: translateY(-6px); filter: blur(3px); }
  60%  { opacity: 0; transform: translateY(6px); filter: blur(3px); }
  100% { opacity: 1; transform: translateY(0); filter: blur(0); }
}
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(102,118,138,0); }
  50%       { box-shadow: 0 0 0 8px rgba(102,118,138,0.15); }
}
@keyframes breathe {
  0%, 100% { opacity: 0.035; }
  50%       { opacity: 0.07; }
}
@keyframes inkSpread {
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes progressFill {
  from { width: 0; }
}
@keyframes resistancePulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
  50%       { transform: translate(-50%, -50%) scale(1.6); opacity: 0; }
}
@keyframes restoreFloat {
  0%   { opacity: 0; transform: translateY(4px); }
  100% { opacity: 1; transform: translateY(0); }
}

.chapter-panel { animation: chapterIn 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
.name-morph { animation: nameMorph 1.1s ease-in-out forwards; }
.ink-spread { animation: inkSpread 0.9s ease-out both; }
.resistance-ring {
  position: absolute;
  width: 20px; height: 20px;
  border-radius: 50%;
  background: ${C.resistance};
  transform: translate(-50%, -50%);
  cursor: pointer;
  transition: transform 0.2s;
}
.resistance-ring::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1.5px solid ${C.resistance};
  animation: resistancePulse 2.5s ease-out infinite;
}
.resistance-ring:hover { transform: translate(-50%, -50%) scale(1.3); }

.place-label {
  position: absolute;
  transform: translate(-50%, -100%);
  pointer-events: none;
  text-align: center;
  transition: opacity 0.4s;
}
.place-label .native-name {
  font-family: 'Libre Baskerville', serif;
  font-size: 10px;
  color: ${C.ink};
  letter-spacing: 0.04em;
  line-height: 1.4;
  display: block;
}
.place-label .german-name {
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  color: ${C.germanName};
  letter-spacing: 0.08em;
  display: block;
}
.place-label .dot {
  width: 4px; height: 4px;
  border-radius: 50%;
  background: ${C.ink};
  margin: 3px auto 0;
  opacity: 0.5;
}
.place-label.renamed .dot { background: ${C.germanName}; }

.hover-card {
  position: fixed;
  pointer-events: none;
  z-index: 200;
  background: rgba(246,241,232,0.97);
  border: 1px solid rgba(157,143,122,0.4);
  padding: 14px 18px;
  min-width: 200px;
  backdrop-filter: blur(8px);
  animation: fadeUp 0.2s ease-out both;
  box-shadow: 0 4px 24px rgba(47,47,47,0.1);
}
.hub-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
}
.hub-marker .dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: ${C.ink};
  opacity: 0.6;
  border: 1.5px solid rgba(47,47,47,0.3);
  transition: all 0.2s;
}
.hub-marker:hover .dot { transform: scale(1.5); opacity: 0.9; }
.hub-label {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-family: 'DM Mono', monospace;
  font-size: 8px;
  color: ${C.inkMuted};
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.layer-btn {
  background: rgba(246,241,232,0.9);
  border: 1px solid rgba(157,143,122,0.35);
  color: ${C.inkMuted};
  font-family: 'DM Mono', monospace;
  font-size: 8.5px;
  letter-spacing: 0.14em;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
}
.layer-btn.active {
  background: ${C.ink};
  color: ${C.paper};
  border-color: ${C.ink};
}
.layer-btn:hover:not(.active) {
  background: rgba(47,47,47,0.08);
  color: ${C.ink};
}

nav-dot { cursor: pointer; transition: all 0.2s; }

.progress-bar {
  position: absolute;
  bottom: 0; left: 0;
  height: 2px;
  background: ${C.inkMuted};
  animation: progressFill linear forwards;
}
`

// ─── Mapbox style — warm atlas ─────────────────────────────────────────────────
// We use a light style and override via paint properties
const MAP_STYLE = 'mapbox://styles/mapbox/light-v11'

// ─── Occupation zone bounding boxes (approximate, for fill-color paint) ───────
// We paint countries using Mapbox country fill layer

const OCC_YEARS = {
  annexed_1938: ['AT', 'CZ'], // Austria, Czech (simplified)
  poland_1939:  ['PL'],
  west_1940:    ['FR', 'BE', 'NL', 'DK', 'NO'],
  east_1941:    ['SI', 'HR', 'RS', 'GR', 'EE', 'LV', 'LT', 'UA', 'BY'],
}

// Which color per territory type
const OCC_COLOR = {
  annexed_1938: C.annexed,
  poland_1939:  C.occupied,
  west_1940:    C.occupied,
  east_1941:    C.occupied,
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const project = (map, ll) => {
  const p = map.project(ll)
  return { left: p.x, top: p.y }
}

// ─── Place Label Component ────────────────────────────────────────────────────

const PlaceLabel = ({ map, place, showGerman, morphing, onHover, onLeave }) => {
  const [pos, setPos] = useState({ left: 0, top: 0 })
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!map) return
    const update = () => {
      const p = map.project(place.ll)
      const b = map.getBounds()
      const inView = b.contains(place.ll)
      setVisible(inView)
      setPos({ left: p.x, top: p.y })
    }
    update()
    map.on('move', update)
    map.on('zoom', update)
    return () => { map.off('move', update); map.off('zoom', update) }
  }, [map, place])

  if (!visible) return null

  const isGerman = showGerman === 'german' || showGerman === 'restoring'
  const isRestoring = showGerman === 'restoring'

  return (
    <div
      className={`place-label ${isGerman ? 'renamed' : ''}`}
      style={{ left: pos.left, top: pos.top, opacity: visible ? 1 : 0 }}
      onMouseEnter={e => onHover && onHover(place, e)}
      onMouseLeave={() => onLeave && onLeave()}
    >
      {isGerman && !isRestoring ? (
        <span className={`german-name ${morphing ? 'name-morph' : ''}`}>{place.german}</span>
      ) : isRestoring ? (
        <span className={`native-name ${morphing ? 'name-morph' : ''}`}>{place.native}</span>
      ) : (
        <span className="native-name">{place.native}</span>
      )}
      <span className="dot" />
    </div>
  )
}

// ─── Resistance Marker ────────────────────────────────────────────────────────

const ResistanceMarker = ({ map, spot, onHover, onLeave }) => {
  const [pos, setPos] = useState({ left: 0, top: 0 })

  useEffect(() => {
    if (!map) return
    const update = () => {
      const p = map.project(spot.ll)
      setPos({ left: p.x, top: p.y })
    }
    update()
    map.on('move', update)
    return () => map.off('move', update)
  }, [map, spot])

  return (
    <div
      className="resistance-ring"
      style={{ left: pos.left, top: pos.top }}
      onMouseEnter={e => onHover(spot, e)}
      onMouseLeave={onLeave}
    />
  )
}

// ─── Hub Marker ───────────────────────────────────────────────────────────────

const HubMarker = ({ map, hub, onHover, onLeave }) => {
  const [pos, setPos] = useState({ left: 0, top: 0 })

  useEffect(() => {
    if (!map) return
    const update = () => {
      const p = map.project(hub.ll)
      setPos({ left: p.x, top: p.y })
    }
    update()
    map.on('move', update)
    return () => map.off('move', update)
  }, [map, hub])

  return (
    <div
      className="hub-marker"
      style={{ left: pos.left, top: pos.top }}
      onMouseEnter={e => onHover(hub, e)}
      onMouseLeave={onLeave}
    >
      <div className="dot" />
      <div className="hub-label">{hub.label}</div>
    </div>
  )
}

// ─── Admin Zone Label ─────────────────────────────────────────────────────────

const AdminZoneLabel = ({ map, zone }) => {
  const [pos, setPos] = useState({ left: 0, top: 0 })

  useEffect(() => {
    if (!map) return
    const update = () => {
      const p = map.project(zone.center)
      setPos({ left: p.x, top: p.y })
    }
    update()
    map.on('move', update)
    return () => map.off('move', update)
  }, [map, zone])

  return (
    <div style={{
      position: 'absolute',
      left: pos.left, top: pos.top,
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      textAlign: 'center',
      animation: 'fadeIn 0.8s ease both',
    }}>
      {zone.label.split('\n').map((line, i) => (
        <div key={i} style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 8,
          color: zone.color,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          lineHeight: 1.5,
          textShadow: `0 0 12px rgba(246,241,232,0.9), 0 0 4px rgba(246,241,232,0.9)`,
        }}>{line}</div>
      ))}
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 7,
        color: zone.color,
        opacity: 0.6,
        letterSpacing: '0.1em',
        marginTop: 2,
        textShadow: `0 0 8px rgba(246,241,232,0.9)`,
      }}>{zone.years}</div>
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

const EuropeMap = () => {
  const mapEl   = useRef(null)
  const mapRef  = useRef(null)
  const animRef = useRef(null)

  const [ready,    setReady]    = useState(false)
  const [idx,      setIdx]      = useState(0)
  const [playing,  setPlaying]  = useState(true)
  const [progress, setProgress] = useState(0)
  const [hover,    setHover]    = useState(null)   // { data, x, y }
  const [morphing, setMorphing] = useState(false)
  const [panelKey, setPanelKey] = useState(0)

  // Layer overrides from user toggle
  const [layerOverrides, setLayerOverrides] = useState({
    occupation: true,
    names: true,
    admin: true,
    infrastructure: true,
    resistance: true,
  })

  const ch = CHAPTERS[idx]

  // ── Init map ────────────────────────────────────────────────────────────────
  useEffect(() => {
    // Guard against StrictMode double-mount
    if (!mapEl.current || mapEl.current._mapboxInitialized) return
    mapEl.current._mapboxInitialized = true
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN
    const map = new mapboxgl.Map({
      container: mapEl.current,
      style: MAP_STYLE,
      center: [15.0, 50.5],
      zoom: 4.0,
      minZoom: 3,
      maxZoom: 9,
      attributionControl: false,
    })

    map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right')

    map.on('load', () => {
      // Style all layers based on type — safe iteration over whatever light-v11 exposes
      map.getStyle().layers.forEach(layer => {
        try {
          const id = layer.id
          const t  = layer.type
          // Water
          if (id.includes('water') && t === 'fill')
            map.setPaintProperty(id, 'fill-color', C.water)
          // Land / background fills
          if ((id.includes('land') || id === 'background') && t === 'fill')
            map.setPaintProperty(id, 'fill-color', C.land)
          if (id === 'background' && t === 'background')
            map.setPaintProperty(id, 'background-color', C.paper)
          // Admin borders
          if (id.includes('admin') && t === 'line') {
            map.setPaintProperty(id, 'line-color', C.border)
            map.setPaintProperty(id, 'line-opacity', 0.45)
          }
          // Roads — heavily mute
          if (id.includes('road') && t === 'line')
            map.setPaintProperty(id, 'line-opacity', 0.06)
          // Labels — hide all
          if (t === 'symbol')
            map.setLayoutProperty(id, 'visibility', 'none')
        } catch(_) {}
      })

      // Add occupation fill layer (country-level, driven by expressions)
      map.addSource('occupation', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      })
      try {
      map.addLayer({
        id: 'occupation-fill',
        type: 'fill',
        source: 'occupation',
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': 0.42,
        },
      })

      map.addLayer({
        id: 'occupation-stroke',
        type: 'line',
        source: 'occupation',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 1,
          'line-opacity': 0.3,
        },
      })
      } catch(e) { console.warn('Layer add error:', e) }

      // Simplified country polygons for occupation — using bbox approximations
      // In production these would be real GeoJSON country borders
      // We inject approximate bounding polygons per territory cluster

      setReady(true)
      setTimeout(() => map.resize(), 50)
    })

    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
      if (mapEl.current) mapEl.current._mapboxInitialized = false
    }
  }, [])

  // ── Chapter transitions ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!ready || !mapRef.current) return
    const map = mapRef.current

    // Fly to chapter position
    map.flyTo({
      center: ch.mapCenter,
      zoom: ch.mapZoom,
      duration: 2200,
      easing: t => t < 0.5 ? 2*t*t : -1+(4-2*t)*t,
    })

    // Morphing animation for name transitions
    if (ch.showNames === 'german' || ch.showNames === 'restoring') {
      setMorphing(true)
      const t = setTimeout(() => setMorphing(false), 1200)
      return () => clearTimeout(t)
    }
  }, [ready, idx, ch])

  // Panel key for re-animation on chapter change
  useEffect(() => { setPanelKey(k => k + 1) }, [idx])

  // ── Autoplay ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!playing) return
    let elapsed = 0, last = null
    const tick = ts => {
      if (!last) last = ts
      elapsed += ts - last; last = ts
      setProgress(Math.min((elapsed / DUR) * 100, 100))
      if (elapsed >= DUR) {
        setIdx(i => (i + 1) % CHAPTERS.length)
        elapsed = 0; last = null; setProgress(0)
      }
      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [playing, idx])

  // ── Keyboard ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'ArrowRight') { setIdx(i => Math.min(CHAPTERS.length - 1, i + 1)); setProgress(0) }
      if (e.key === 'ArrowLeft')  { setIdx(i => Math.max(0, i - 1)); setProgress(0) }
      if (e.key === ' ')          { setPlaying(p => !p); e.preventDefault() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ── Hover helpers ─────────────────────────────────────────────────────────────
  const showHover = useCallback((data, e) => {
    setHover({ data, x: e.clientX + 14, y: e.clientY - 10 })
  }, [])
  const clearHover = useCallback(() => setHover(null), [])

  // ── Derived visibility ────────────────────────────────────────────────────────
  const showNames = ch.showNames === 'german' || ch.showNames === 'restoring' || ch.showNames === 'transitioning'
  const showGerman = ch.showNames

  // Which renamed places to show
  const visiblePlaces = ch.showAllRenamed
    ? RENAMED_PLACES
    : (ch.highlight
        ? RENAMED_PLACES.filter(p => ch.highlight.includes(p.id))
        : (showNames ? RENAMED_PLACES.slice(0, 20) : []))

  const showResistance = (ch.showResistance || layerOverrides.resistance) && ready
  const showInfrastructure = (ch.showInfrastructure || layerOverrides.infrastructure) && ready
  const showAdmin = (ch.showAdminZones || layerOverrides.admin) && ready

  // ── UI ────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ position: 'fixed', inset: 0, background: C.paper, overflow: 'hidden', fontFamily: "'Libre Baskerville', serif" }}>
      <style>{CSS}</style>

      {/* MAP */}
      <div ref={mapEl} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }} />

      {/* VIGNETTE — very soft, warm */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
        background: `radial-gradient(ellipse at center, transparent 45%, rgba(230,220,200,0.25) 100%)`,
      }} />

      {/* ATLAS GRID — subtle */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        backgroundImage: `
          linear-gradient(rgba(157,143,122,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(157,143,122,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
      }} />

      {/* WATERMARK YEAR */}
      <div style={{
        position: 'fixed', bottom: 60, right: 40,
        fontFamily: "'Playfair Display', serif",
        fontSize: 'clamp(80px, 12vw, 140px)',
        fontWeight: 700, fontStyle: 'italic',
        color: C.ink, opacity: 0.035,
        pointerEvents: 'none', zIndex: 3,
        userSelect: 'none',
        animation: 'breathe 8s ease-in-out infinite',
        lineHeight: 1,
      }}>
        {ch.year}
      </div>

      {/* ── PLACE LABELS LAYER ── */}
      {ready && visiblePlaces.map(place => (
        <PlaceLabel
          key={place.id}
          map={mapRef.current}
          place={place}
          showGerman={showGerman}
          morphing={morphing}
          onHover={showHover}
          onLeave={clearHover}
        />
      ))}

      {/* ── RESISTANCE MARKERS ── */}
      {showResistance && RESISTANCE.map(spot => (
        <ResistanceMarker
          key={spot.id}
          map={mapRef.current}
          spot={spot}
          onHover={showHover}
          onLeave={clearHover}
        />
      ))}

      {/* ── HUB MARKERS ── */}
      {showInfrastructure && HUBS.map(hub => (
        <HubMarker
          key={hub.id}
          map={mapRef.current}
          hub={hub}
          onHover={showHover}
          onLeave={clearHover}
        />
      ))}

      {/* ── ADMIN ZONE LABELS ── */}
      {showAdmin && ADMIN_ZONES.map(zone => (
        <AdminZoneLabel
          key={zone.id}
          map={mapRef.current}
          zone={zone}
        />
      ))}

      {/* ── HOVER CARD ── */}
      {hover && (
        <div className="hover-card" style={{ left: hover.x, top: hover.y }}>
          {hover.data.native ? (
            <>
              <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 14, color: C.ink, fontWeight: 700, marginBottom: 4 }}>
                {hover.data.native}
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.germanName, letterSpacing: '0.1em', marginBottom: 10 }}>
                Germanized: {hover.data.german}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {[['Changed', hover.data.changed], ['Restored', hover.data.restored], ['Territory', hover.data.country]].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: C.inkMuted, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{k}</div>
                    <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 11, color: C.ink, marginTop: 1 }}>{v}</div>
                  </div>
                ))}
              </div>
            </>
          ) : hover.data.role ? (
            <>
              <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 4 }}>{hover.data.label}</div>
              <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 11, color: C.inkMuted, fontStyle: 'italic' }}>{hover.data.role}</div>
            </>
          ) : (
            <>
              <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 2 }}>{hover.data.label}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8.5, color: C.inkMuted, letterSpacing: '0.1em', marginBottom: 6 }}>{hover.data.year}</div>
              <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 11, color: C.ink, lineHeight: 1.6, fontStyle: 'italic' }}>{hover.data.desc}</div>
            </>
          )}
        </div>
      )}

      {/* ── TOP BAR ── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(246,241,232,0.96)',
        borderBottom: `1px solid rgba(157,143,122,0.3)`,
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 28px', height: 52,
      }}>
        {/* Left */}
        <Link to="/maps" style={{
          fontFamily: "'DM Mono', monospace", fontSize: 9,
          color: C.inkMuted, letterSpacing: '0.2em',
          transition: 'color 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.color = C.ink}
          onMouseLeave={e => e.currentTarget.style.color = C.inkMuted}
        >
          ← ANIMATED MAPS
        </Link>

        {/* Centre */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: C.ink, fontWeight: 400, letterSpacing: '0.02em', lineHeight: 1 }}>
            Europe Rewritten
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: C.inkMuted, letterSpacing: '0.18em', marginTop: 3, textTransform: 'uppercase' }}>
            1938–1945 · Occupation · Identity · Renamed Places
          </div>
        </div>

        {/* Right — chapter count */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: C.ink, fontStyle: 'italic', lineHeight: 1 }}>
            {String(idx + 1).padStart(2, '0')}
            <span style={{ color: C.inkMuted, fontSize: 12 }}>/{CHAPTERS.length}</span>
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, color: C.inkMuted, letterSpacing: '0.12em', marginTop: 2 }}>
            {ch.badge}
          </div>
        </div>
      </div>

      {/* ── CHAPTER PANEL (bottom-left) ── */}
      <div
        key={`panel-${panelKey}`}
        className="chapter-panel"
        style={{
          position: 'fixed', bottom: 32, left: 32,
          zIndex: 50, width: 340, maxWidth: 'calc(100vw - 64px)',
          background: 'rgba(246,241,232,0.96)',
          border: `1px solid rgba(157,143,122,0.3)`,
          backdropFilter: 'blur(12px)',
          padding: '22px 24px',
        }}
      >
        {/* Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ width: 16, height: 1, background: C.inkMuted }} />
          <span style={{
            fontFamily: "'DM Mono', monospace", fontSize: 8,
            color: C.inkMuted, letterSpacing: '0.22em', textTransform: 'uppercase',
          }}>
            {ch.badge}
          </span>
        </div>

        {/* Year */}
        <div style={{
          fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
          fontSize: 11, color: C.inkMuted, marginBottom: 6, letterSpacing: '0.04em',
        }}>
          {ch.year}
        </div>

        {/* Title */}
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 22, fontWeight: 700, color: C.ink,
          lineHeight: 1.2, marginBottom: 6,
        }}>
          {ch.title}
        </div>

        {/* Subtitle */}
        {ch.subtitle && (
          <div style={{
            fontFamily: "'Libre Baskerville', serif",
            fontSize: 11, fontStyle: 'italic',
            color: C.inkMuted, marginBottom: 12, lineHeight: 1.5,
          }}>
            {ch.subtitle}
          </div>
        )}

        {/* Divider */}
        <div style={{ width: 28, height: 1, background: `rgba(157,143,122,0.4)`, marginBottom: 12 }} />

        {/* Body */}
        <p style={{
          fontFamily: "'Libre Baskerville', serif",
          fontSize: 12.5, lineHeight: 1.75, color: C.ink,
          fontWeight: 400, marginBottom: 14,
        }}>
          {ch.body}
        </p>

        {/* Quote */}
        {ch.quote && (
          <div style={{
            borderLeft: `2px solid rgba(157,143,122,0.45)`,
            paddingLeft: 12, marginBottom: 4,
          }}>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 11.5, fontStyle: 'italic',
              color: C.inkMuted, lineHeight: 1.65,
              whiteSpace: 'pre-line',
            }}>
              "{ch.quote}"
            </p>
          </div>
        )}

        {/* Progress bar */}
        {playing && (
          <div style={{ position: 'relative', marginTop: 14, height: 2, background: 'rgba(157,143,122,0.2)' }}>
            <div style={{
              position: 'absolute', left: 0, top: 0, height: '100%',
              background: C.inkMuted, width: `${progress}%`,
              transition: 'width 0.1s linear',
            }} />
          </div>
        )}
      </div>

      {/* ── CHAPTER NAVIGATION (right) ── */}
      <div style={{
        position: 'fixed', right: 28, top: '50%', transform: 'translateY(-50%)',
        zIndex: 50, display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {CHAPTERS.map((c, i) => (
          <button
            key={c.id}
            onClick={() => { setIdx(i); setProgress(0) }}
            title={c.title}
            style={{
              width: i === idx ? 6 : 4,
              height: i === idx ? 6 : 4,
              borderRadius: '50%',
              border: 'none',
              background: i === idx ? C.ink : C.border,
              opacity: i === idx ? 1 : 0.5,
              cursor: 'pointer',
              transition: 'all 0.25s',
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* ── BOTTOM CONTROLS ── */}
      <div style={{
        position: 'fixed', bottom: 28, right: 28,
        zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10,
        pointerEvents: 'all',
      }}>

        {/* Layer toggles */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {[
            ['Resistance', 'resistance'],
            ['Infrastructure', 'infrastructure'],
            ['Admin Zones', 'admin'],
          ].map(([label, key]) => (
            <button
              key={key}
              className={`layer-btn ${layerOverrides[key] ? 'active' : ''}`}
              onClick={() => setLayerOverrides(prev => ({ ...prev, [key]: !prev[key] }))}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Playback controls */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button
            onClick={() => { setIdx(i => Math.max(0, i - 1)); setProgress(0) }}
            style={{
              background: 'rgba(246,241,232,0.9)',
              border: `1px solid rgba(157,143,122,0.35)`,
              color: C.inkMuted, cursor: 'pointer',
              fontFamily: "'DM Mono', monospace", fontSize: 11,
              padding: '6px 12px', transition: 'all 0.2s',
            }}
          >←</button>

          <button
            onClick={() => setPlaying(p => !p)}
            style={{
              background: playing ? C.ink : 'rgba(246,241,232,0.9)',
              border: `1px solid ${playing ? C.ink : 'rgba(157,143,122,0.35)'}`,
              color: playing ? C.paper : C.inkMuted,
              cursor: 'pointer',
              fontFamily: "'DM Mono', monospace", fontSize: 8.5,
              letterSpacing: '0.14em', padding: '6px 16px',
              transition: 'all 0.2s', textTransform: 'uppercase',
            }}
          >
            {playing ? 'Pause' : 'Autoplay'}
          </button>

          <button
            onClick={() => { setIdx(i => Math.min(CHAPTERS.length - 1, i + 1)); setProgress(0) }}
            style={{
              background: 'rgba(246,241,232,0.9)',
              border: `1px solid rgba(157,143,122,0.35)`,
              color: C.inkMuted, cursor: 'pointer',
              fontFamily: "'DM Mono', monospace", fontSize: 11,
              padding: '6px 12px', transition: 'all 0.2s',
            }}
          >→</button>
        </div>
      </div>

      {/* ── LEGEND (top-right, context-sensitive) ── */}
      {(ch.showOccupation || ch.type === 'peak') && (
        <div style={{
          position: 'fixed', top: 68, right: 28, zIndex: 40,
          background: 'rgba(246,241,232,0.95)',
          border: `1px solid rgba(157,143,122,0.3)`,
          padding: '14px 16px',
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.5s ease both',
          minWidth: 160,
        }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7.5, letterSpacing: '0.18em', color: C.inkMuted, marginBottom: 10, textTransform: 'uppercase' }}>
            Territory
          </div>
          {[
            [C.annexed,  'Annexed'],
            [C.occupied, 'Occupied'],
            [C.puppet,   'Puppet / Collaboration'],
            [C.axis,     'Axis-aligned'],
          ].map(([color, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 10, height: 10, background: color, opacity: 0.8, flexShrink: 0 }} />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8.5, color: C.inkMuted, letterSpacing: '0.06em' }}>{label}</span>
            </div>
          ))}
          {ch.showResistance && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.resistance, opacity: 0.8, flexShrink: 0 }} />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8.5, color: C.inkMuted, letterSpacing: '0.06em' }}>Resistance</span>
            </div>
          )}
        </div>
      )}

      {/* ── NAME RENAMING LEGEND (chapter 6) ── */}
      {ch.type === 'renaming' && (
        <div style={{
          position: 'fixed', top: 68, left: 28, zIndex: 40,
          background: 'rgba(246,241,232,0.95)',
          border: `1px solid rgba(157,143,122,0.3)`,
          padding: '14px 16px',
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.5s ease both',
          maxWidth: 220,
        }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7.5, letterSpacing: '0.18em', color: C.inkMuted, marginBottom: 10, textTransform: 'uppercase' }}>
            Place Names
          </div>
          <div style={{ marginBottom: 6 }}>
            <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 10, color: C.ink }}>Praha</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: C.inkMuted, margin: '0 6px' }}>→</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.germanName }}>Prag</span>
          </div>
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 10, color: C.ink }}>Gdańsk</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: C.inkMuted, margin: '0 6px' }}>→</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.germanName }}>Danzig</span>
          </div>
          <div style={{ borderTop: `1px solid rgba(157,143,122,0.25)`, paddingTop: 8, marginTop: 2 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 4 }}>
              <div style={{ width: 18, height: 1, background: C.ink, opacity: 0.5 }} />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 7.5, color: C.inkMuted, letterSpacing: '0.1em' }}>Native name</span>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
              <div style={{ width: 18, height: 1, background: C.germanName, opacity: 0.5 }} />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 7.5, color: C.germanName, letterSpacing: '0.1em' }}>Imposed name</span>
            </div>
          </div>
          <div style={{ marginTop: 8, fontFamily: "'Libre Baskerville', serif", fontSize: 10, color: C.inkMuted, fontStyle: 'italic', lineHeight: 1.5 }}>
            Hover a city for detail
          </div>
        </div>
      )}

      {/* ── KEYBOARD HINT (first chapter only) ── */}
      {idx === 0 && (
        <div style={{
          position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          zIndex: 40,
          fontFamily: "'DM Mono', monospace", fontSize: 8,
          color: C.inkMuted, letterSpacing: '0.18em',
          animation: 'fadeIn 2s ease 1.5s both',
        }}>
          ← → ARROW KEYS · SPACE TO AUTOPLAY
        </div>
      )}
    </div>
  )
}

export default EuropeMap