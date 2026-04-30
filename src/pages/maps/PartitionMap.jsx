import { useEffect, useRef, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import { Link } from 'react-router-dom'
import {
  CHAPTERS,
  MIGRATION_FLOWS,
  VIOLENCE_MARKERS,
  CITY_MARKERS,
  RADCLIFFE_LINE,
  SCRIPT_FONTS,
  COLORS,
} from '@/data/partitionMap'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

// ─── Portrait assignments per chapter ────────────────────────────────────────
const PORTRAITS = {
  the_line:      { src: '/Jinnah.jpg',          name: 'M.A. Jinnah',      years: '1876–1948' },
  punjab_burns:  { src: '/Amrita_Pritam.jpg',   name: 'Amrita Pritam',    years: '1919–2005' },
  great_crossing:{ src: '/nehru.jpeg',           name: 'Jawaharlal Nehru', years: '1889–1964' },
  the_missing:   { src: '/Faiz_Ahmed_Faiz.jpg', name: 'Faiz Ahmed Faiz',  years: '1911–1984' },
  two_nations:   { src: '/gandhi.jpeg',          name: 'M.K. Gandhi',      years: '1869–1948' },
}

// ─── Train SVG ────────────────────────────────────────────────────────────────
const TrainSVG = ({ stopped }) => (
  <svg viewBox="0 0 340 80" style={{ width: '100%', height: '58px', opacity: stopped ? 0.45 : 0.8 }}>
    {!stopped && (
      <>
        <ellipse cx="42" cy="13" rx="8" ry="5" fill="#C9B88A" opacity="0.15">
          <animate attributeName="cy" values="13;6;13" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.15;0.04;0.15" dur="2s" repeatCount="indefinite"/>
        </ellipse>
        <ellipse cx="38" cy="7" rx="6" ry="4" fill="#C9B88A" opacity="0.08">
          <animate attributeName="cy" values="7;1;7" dur="2.5s" repeatCount="indefinite"/>
        </ellipse>
      </>
    )}
    <rect x="38" y="17" width="7" height="12" rx="1" fill="#C9B88A" opacity="0.75"/>
    <rect x="20" y="26" width="115" height="28" rx="3" fill="#C9B88A" opacity="0.82"/>
    <ellipse cx="80" cy="30" rx="10" ry="6" fill="#C9B88A" opacity="0.65"/>
    <rect x="122" y="13" width="42" height="41" rx="2" fill="#C9B88A" opacity="0.82"/>
    <rect x="128" y="18" width="12" height="9" rx="1" fill="#0D0D0D" opacity="0.5"/>
    <rect x="146" y="18" width="12" height="9" rx="1" fill="#0D0D0D" opacity="0.5"/>
    <rect x="167" y="22" width="80" height="32" rx="2" fill="#C9B88A" opacity="0.7"/>
    <rect x="173" y="27" width="11" height="8" rx="1" fill="#0D0D0D" opacity="0.38"/>
    <rect x="190" y="27" width="11" height="8" rx="1" fill="#0D0D0D" opacity="0.38"/>
    <rect x="207" y="27" width="11" height="8" rx="1" fill="#0D0D0D" opacity="0.38"/>
    <rect x="250" y="22" width="72" height="32" rx="2" fill="#C9B88A" opacity="0.55"/>
    <rect x="256" y="27" width="10" height="8" rx="1" fill="#0D0D0D" opacity="0.38"/>
    <rect x="272" y="27" width="10" height="8" rx="1" fill="#0D0D0D" opacity="0.38"/>
    <rect x="163" y="49" width="7" height="3" rx="1" fill="#C9B88A" opacity="0.55"/>
    <rect x="246" y="49" width="7" height="3" rx="1" fill="#C9B88A" opacity="0.55"/>
    <circle cx="48"  cy="57" r="12" fill="#0D0D0D" stroke="#C9B88A" strokeWidth="2.5"/>
    <circle cx="48"  cy="57" r="4.5" fill="#C9B88A"/>
    <circle cx="95"  cy="57" r="9"  fill="#0D0D0D" stroke="#C9B88A" strokeWidth="2"/>
    <circle cx="95"  cy="57" r="3.5" fill="#C9B88A"/>
    <circle cx="130" cy="57" r="9"  fill="#0D0D0D" stroke="#C9B88A" strokeWidth="2"/>
    <circle cx="130" cy="57" r="3.5" fill="#C9B88A"/>
    <circle cx="188" cy="56" r="7"  fill="#0D0D0D" stroke="#C9B88A" strokeWidth="1.8"/>
    <circle cx="218" cy="56" r="7"  fill="#0D0D0D" stroke="#C9B88A" strokeWidth="1.8"/>
    <circle cx="265" cy="56" r="7"  fill="#0D0D0D" stroke="#C9B88A" strokeWidth="1.8"/>
    <circle cx="295" cy="56" r="7"  fill="#0D0D0D" stroke="#C9B88A" strokeWidth="1.8"/>
    <line x1="0" y1="70" x2="340" y2="70" stroke="#C9B88A" strokeWidth="1.5" opacity="0.2"/>
    {[10,40,70,100,130,160,190,220,250,280,310].map(x => (
      <line key={x} x1={x} y1="67" x2={x} y2="74" stroke="#C9B88A" strokeWidth="1.5" opacity="0.12"/>
    ))}
    {stopped && (
      <>
        <line x1="148" y1="29" x2="170" y2="51" stroke="#8B1A1A" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="170" y1="29" x2="148" y2="51" stroke="#8B1A1A" strokeWidth="2.5" strokeLinecap="round"/>
      </>
    )}
  </svg>
)

// ─── useCounter ───────────────────────────────────────────────────────────────
const useCounter = (target, active, duration = 1400) => {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active || target === null || target === undefined) { setValue(0); return }
    let current = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      current += step
      if (current >= target) { setValue(target); clearInterval(timer) }
      else setValue(Math.floor(current * 10) / 10)
    }, 16)
    return () => clearInterval(timer)
  }, [target, active, duration])
  return value
}

// ─── StatItem ─────────────────────────────────────────────────────────────────
const StatItem = ({ stat, active }) => {
  const count = useCounter(stat.isRange ? null : stat.value, active)
  const displayVal = stat.isRange
    ? stat.range
    : stat.decimals > 0
      ? count.toFixed(stat.decimals)
      : Math.floor(count).toLocaleString()
  return (
    <div style={{ textAlign: 'center', padding: '0 6px', minWidth: '70px' }}>
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: stat.isRange ? '10px' : '15px',
        color: stat.isRange ? COLORS.red : COLORS.gold,
        letterSpacing: '0.03em', lineHeight: 1.2,
      }}>
        {displayVal}{!stat.isRange && stat.suffix}
      </div>
      <div style={{
        fontFamily: "'Lato', sans-serif", fontSize: '8px',
        color: COLORS.muted, marginTop: '3px',
        letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1.4,
      }}>
        {stat.label}
      </div>
      {stat.isRange && stat.rangeNote && (
        <div style={{
          fontFamily: "'Lato', sans-serif", fontSize: '7px',
          color: COLORS.mutedDark, marginTop: '2px', fontStyle: 'italic',
        }}>
          {stat.rangeNote}
        </div>
      )}
    </div>
  )
}

// ─── PortraitStamp ────────────────────────────────────────────────────────────
const PortraitStamp = ({ portrait, visible }) => {
  if (!portrait) return <div style={{ width: '88px', flexShrink: 0 }}/>
  return (
    <div style={{
      width: '88px', flexShrink: 0,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateX(0) scale(1)' : 'translateX(-16px) scale(0.96)',
      transition: 'opacity 0.55s ease 0.25s, transform 0.55s ease 0.25s',
    }}>
      {/* stamp outer — perforated feel via box-shadow dots */}
      <div style={{
        border: '1px solid rgba(201,184,138,0.3)',
        borderRadius: '2px',
        background: '#100f0a',
        padding: '4px 4px 6px',
        position: 'relative',
        boxShadow: 'inset 0 0 12px rgba(0,0,0,0.5)',
      }}>
        {/* top perforations */}
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '3px' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{
              width: '3px', height: '3px', borderRadius: '50%',
              background: '#0D0D0D', outline: '0.5px solid rgba(201,184,138,0.15)',
            }}/>
          ))}
        </div>
        {/* photo */}
        <img
          src={portrait.src}
          alt={portrait.name}
          style={{
            width: '100%', height: '108px',
            objectFit: 'cover', objectPosition: 'top center',
            display: 'block',
            filter: 'grayscale(100%) sepia(15%) contrast(1.08) brightness(0.9)',
          }}
        />
        {/* bottom perforations */}
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '3px' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{
              width: '3px', height: '3px', borderRadius: '50%',
              background: '#0D0D0D', outline: '0.5px solid rgba(201,184,138,0.15)',
            }}/>
          ))}
        </div>
        {/* name */}
        <div style={{
          fontFamily: "'DM Mono', monospace", fontSize: '6.5px',
          color: COLORS.gold, letterSpacing: '0.1em',
          textAlign: 'center', marginTop: '4px',
          textTransform: 'uppercase', lineHeight: 1.4,
        }}>
          {portrait.name}
        </div>
        <div style={{
          fontFamily: "'DM Mono', monospace", fontSize: '5.5px',
          color: COLORS.mutedDark, letterSpacing: '0.07em',
          textAlign: 'center', marginTop: '1px',
        }}>
          {portrait.years}
        </div>
      </div>
    </div>
  )
}

// ─── CinematicPanel ───────────────────────────────────────────────────────────
const CinematicPanel = ({ chapter, chapterIndex, totalChapters, playing, onPlay, onPrev, onNext }) => {
  const [step, setStep] = useState(0)
  const [panelIn, setPanelIn] = useState(false)
  const timers = useRef([])

  const portrait  = PORTRAITS[chapter.id] || null
  const showTrain = chapter.id === 'great_crossing' || chapter.id === 'the_missing'
  const trainStopped = chapter.id === 'the_missing'

  const typeColor = {
    context: COLORS.gold, boundary: '#999',
    migration: '#FF8F00', violence: COLORS.red, aftermath: COLORS.gold,
  }[chapter.type] || COLORS.gold

  useEffect(() => {
    // reset
    setStep(0)
    setPanelIn(false)
    timers.current.forEach(clearTimeout)
    timers.current = []

    const seq = [
      [30,   () => setPanelIn(true)],
      [180,  () => setStep(1)],   // badge + year
      [420,  () => setStep(2)],   // portrait
      [820,  () => setStep(3)],   // title
      [1180, () => setStep(4)],   // subtitle
      [1540, () => setStep(5)],   // body
      [2100, () => setStep(6)],   // quote
      [2700, () => setStep(7)],   // survivor
      [3200, () => setStep(8)],   // stats
      [3900, () => setStep(9)],   // train
    ]
    seq.forEach(([delay, fn]) => {
      timers.current.push(setTimeout(fn, delay))
    })
    return () => timers.current.forEach(clearTimeout)
  }, [chapter.id])

  const progress = (chapterIndex / (totalChapters - 1)) * 100

  return (
    <div style={{
      position: 'fixed',
      top: '50%', left: '22px',
      transform: 'translateY(-50%)',
      zIndex: 40,
      width: '350px',
      maxHeight: '86vh',
      overflowY: 'auto',
      overflowX: 'hidden',
      background: 'rgba(9,9,7,0.93)',
      border: '1px solid rgba(201,184,138,0.11)',
      borderRadius: '3px',
      backdropFilter: 'blur(18px)',
      scrollbarWidth: 'none',
      opacity: panelIn ? 1 : 0,
      transition: 'opacity 0.4s ease',
    }}>

      {/* Type color bar */}
      <div style={{
        height: '2px', background: typeColor,
        opacity: step >= 1 ? 1 : 0,
        transition: 'opacity 0.35s ease, background 0.5s ease',
      }}/>

      <div style={{ padding: '18px 18px 14px' }}>

        {/* Badge + year row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '14px',
          opacity: step >= 1 ? 1 : 0,
          transform: step >= 1 ? 'translateY(0)' : 'translateY(-6px)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
        }}>
          <div style={{
            fontFamily: "'DM Mono', monospace", fontSize: '8px',
            color: typeColor, letterSpacing: '0.14em', textTransform: 'uppercase',
            border: `1px solid ${typeColor}33`, padding: '3px 7px', borderRadius: '2px',
          }}>
            {chapter.type} · {chapterIndex + 1}/{totalChapters}
          </div>
          <div style={{
            fontFamily: "'DM Mono', monospace", fontSize: '12px',
            color: COLORS.gold, letterSpacing: '0.07em',
          }}>
            {chapter.year}
          </div>
        </div>

        {/* Portrait + title row */}
        <div style={{ display: 'flex', gap: '13px', alignItems: 'flex-start', marginBottom: '14px' }}>
          <PortraitStamp portrait={portrait} visible={step >= 2}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '22px', fontWeight: 700,
              color: COLORS.text, lineHeight: 1.15,
              letterSpacing: '-0.01em', marginBottom: '7px',
              opacity: step >= 3 ? 1 : 0,
              transform: step >= 3 ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
            }}>
              {chapter.title}
            </div>
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: '8.5px',
              color: COLORS.muted, letterSpacing: '0.06em', lineHeight: 1.55,
              opacity: step >= 4 ? 1 : 0,
              transition: 'opacity 0.4s ease 0.1s',
            }}>
              {chapter.subtitle}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px', background: 'rgba(201,184,138,0.07)',
          margin: '0 0 11px',
          opacity: step >= 4 ? 1 : 0, transition: 'opacity 0.3s ease',
        }}/>

        {/* Body */}
        <div style={{
          fontFamily: "'Lato', sans-serif", fontSize: '11.5px',
          color: '#b0a890', lineHeight: 1.82, marginBottom: '13px',
          opacity: step >= 5 ? 1 : 0,
          transform: step >= 5 ? 'translateY(0)' : 'translateY(6px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}>
          {chapter.body}
        </div>

        {/* Quote */}
        {chapter.quote && (
          <div style={{
            borderLeft: `2px solid ${typeColor}88`,
            paddingLeft: '11px', margin: '0 0 11px',
            opacity: step >= 6 ? 1 : 0,
            transform: step >= 6 ? 'translateX(0)' : 'translateX(-6px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}>
            {chapter.quote.original && (
              <div style={{
                fontFamily: chapter.quote.originalScript
                  ? SCRIPT_FONTS[chapter.quote.originalScript]
                  : SCRIPT_FONTS.default,
                fontSize: chapter.quote.originalScript === 'urdu' ? '14px' : '11px',
                color: COLORS.text, lineHeight: 2,
                direction: chapter.quote.originalScript === 'urdu' ? 'rtl' : 'ltr',
                marginBottom: '6px', opacity: 0.88, whiteSpace: 'pre-line',
              }}>
                {chapter.quote.original}
              </div>
            )}
            <div style={{
              fontFamily: "'Lato', sans-serif", fontSize: '11px',
              color: COLORS.gold, lineHeight: 1.65,
              fontStyle: 'italic', marginBottom: '4px', whiteSpace: 'pre-line',
            }}>
              {chapter.quote.translation}
            </div>
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: '8px',
              color: COLORS.mutedDark, letterSpacing: '0.04em', whiteSpace: 'pre-line',
            }}>
              {chapter.quote.attribution}
            </div>
          </div>
        )}

        {/* Survivor */}
        {chapter.survivor && (
          <div style={{
            background: 'rgba(139,26,26,0.06)',
            border: '1px solid rgba(139,26,26,0.18)',
            borderRadius: '2px', padding: '9px 11px', marginBottom: '11px',
            opacity: step >= 7 ? 1 : 0,
            transition: 'opacity 0.5s ease 0.1s',
          }}>
            <div style={{
              fontFamily: "'Lato', sans-serif", fontSize: '10.5px',
              color: '#bf9090', lineHeight: 1.68,
              fontStyle: 'italic', marginBottom: '5px',
            }}>
              {chapter.survivor.text}
            </div>
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: '7.5px',
              color: COLORS.mutedDark, letterSpacing: '0.04em',
            }}>
              {chapter.survivor.attribution}
            </div>
          </div>
        )}

        {/* Stats */}
        <div style={{
          display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '8px',
          borderTop: '1px solid rgba(201,184,138,0.07)',
          paddingTop: '11px', marginBottom: '10px',
          opacity: step >= 8 ? 1 : 0,
          transform: step >= 8 ? 'translateY(0)' : 'translateY(5px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}>
          {chapter.stats.map((stat, i) => (
            <StatItem key={i} stat={stat} active={step >= 8}/>
          ))}
        </div>

        {/* Train */}
        {showTrain && (
          <div style={{
            marginBottom: '10px',
            opacity: step >= 9 ? 1 : 0,
            transform: step >= 9
              ? 'translateX(0)'
              : trainStopped ? 'translateX(0)' : 'translateX(-50px)',
            transition: 'opacity 0.6s ease, transform 1.1s ease',
          }}>
            <TrainSVG stopped={trainStopped}/>
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: '7.5px',
              color: trainStopped ? COLORS.red : COLORS.mutedDark,
              letterSpacing: '0.1em', textAlign: 'center',
              marginTop: '3px', textTransform: 'uppercase',
            }}>
              {trainStopped ? 'Train arrived empty · September 1947' : 'Lahore ↔ Amritsar · 1947'}
            </div>
          </div>
        )}

        {/* Controls */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          borderTop: '1px solid rgba(201,184,138,0.07)',
          paddingTop: '11px',
        }}>
          <button onClick={onPrev} disabled={chapterIndex === 0} style={{
            background: 'none',
            border: '1px solid rgba(201,184,138,0.16)',
            color: chapterIndex === 0 ? COLORS.mutedDark : COLORS.gold,
            cursor: chapterIndex === 0 ? 'default' : 'pointer',
            borderRadius: '2px', padding: '6px 10px',
            fontFamily: "'DM Mono', monospace", fontSize: '11px',
          }}>←</button>

          <button onClick={onPlay} style={{
            flex: 1,
            background: 'rgba(201,184,138,0.06)',
            border: '1px solid rgba(201,184,138,0.18)',
            color: COLORS.gold, cursor: 'pointer',
            borderRadius: '2px', padding: '7px 10px',
            fontFamily: "'DM Mono', monospace", fontSize: '9.5px',
            letterSpacing: '0.1em',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
          }}>
            {playing ? '⏸ Pause' : '▶ Play Story'}
          </button>

          <button onClick={onNext} disabled={chapterIndex === totalChapters - 1} style={{
            background: 'none',
            border: '1px solid rgba(201,184,138,0.16)',
            color: chapterIndex === totalChapters - 1 ? COLORS.mutedDark : COLORS.gold,
            cursor: chapterIndex === totalChapters - 1 ? 'default' : 'pointer',
            borderRadius: '2px', padding: '6px 10px',
            fontFamily: "'DM Mono', monospace", fontSize: '11px',
          }}>→</button>
        </div>

        {/* Progress */}
        <div style={{
          height: '2px', background: 'rgba(201,184,138,0.07)',
          borderRadius: '1px', marginTop: '9px', overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', width: `${progress}%`,
            background: typeColor, borderRadius: '1px',
            transition: 'width 0.5s ease, background 0.4s ease',
          }}/>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const PartitionMap = () => {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const rafRef = useRef(null)
  const intervalRef = useRef(null)

  const [currentChapter, setCurrentChapter] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)

  const chapter = CHAPTERS[currentChapter]

  useEffect(() => {
    if (mapRef.current) return
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [78.0, 22.0], zoom: 3.8,
      projection: 'globe', minZoom: 2, maxZoom: 10,
      attributionControl: false,
    })

    map.on('style.load', () => {
      map.setFog({
        color: 'rgb(8,8,12)', 'high-color': 'rgb(18,12,30)',
        'horizon-blend': 0.04, 'space-color': 'rgb(4,4,10)', 'star-intensity': 0.7,
      })
    })

    map.on('load', () => {
      map.addSource('cb', { type: 'vector', url: 'mapbox://mapbox.country-boundaries-v1' })

      const addFill = (id, iso, color, opacity) => {
        map.addLayer({ id, type: 'fill', source: 'cb', 'source-layer': 'country_boundaries',
          filter: Array.isArray(iso) ? ['in', 'iso_3166_1', ...iso] : ['==', 'iso_3166_1', iso],
          paint: { 'fill-color': color, 'fill-opacity': opacity } })
      }
      addFill('india-fill',      'IN', COLORS.gold, 0.25)
      addFill('pakistan-fill',   'PK', COLORS.gold, 0.25)
      addFill('bangladesh-fill', 'BD', COLORS.gold, 0.25)

      map.addLayer({ id: 'region-outline', type: 'line', source: 'cb', 'source-layer': 'country_boundaries',
        filter: ['in', 'iso_3166_1', 'IN', 'PK', 'BD'],
        paint: { 'line-color': COLORS.gold, 'line-opacity': 0.22, 'line-width': 0.8 } })

      const addLine = (id, coords) => {
        map.addSource(id, { type: 'geojson', data: { type: 'Feature', geometry: { type: 'LineString', coordinates: coords } } })
        map.addLayer({ id: `${id}-layer`, type: 'line', source: id,
          paint: { 'line-color': '#fff', 'line-opacity': 0, 'line-width': 1.5, 'line-dasharray': [3, 2] } })
      }
      addLine('radcliffe-punjab', RADCLIFFE_LINE.punjab)
      addLine('radcliffe-bengal', RADCLIFFE_LINE.bengal)

      map.addSource('flows', { type: 'geojson', data: { type: 'FeatureCollection',
        features: MIGRATION_FLOWS.map((f, i) => ({
          type: 'Feature', id: i,
          properties: { color: f.color, chapter: f.chapter },
          geometry: { type: 'LineString', coordinates: [f.from, f.to] },
        })),
      }})
      map.addLayer({ id: 'flow-lines', type: 'line', source: 'flows',
        paint: { 'line-color': ['get','color'], 'line-opacity': 0, 'line-width': 2, 'line-dasharray': [4,3] } })

      map.addSource('violence-pts', { type: 'geojson', data: { type: 'FeatureCollection',
        features: VIOLENCE_MARKERS.map(v => ({
          type: 'Feature',
          properties: { name: v.name, date: v.date, deaths: v.deaths },
          geometry: { type: 'Point', coordinates: v.coords },
        })),
      }})
      map.addLayer({ id: 'v-glow', type: 'circle', source: 'violence-pts',
        paint: { 'circle-radius': 0, 'circle-color': COLORS.red, 'circle-opacity': 0, 'circle-blur': 1.2 } })
      map.addLayer({ id: 'v-dot', type: 'circle', source: 'violence-pts',
        paint: { 'circle-radius': 0, 'circle-color': COLORS.red, 'circle-opacity': 0 } })

      map.on('click', 'v-dot', e => {
        const p = e.features[0].properties
        new mapboxgl.Popup({ closeButton: false })
          .setLngLat(e.lngLat)
          .setHTML(`<div style="font-family:'Lato',sans-serif;font-size:12px;color:#F0E8D8;background:#0D0D0D;border:1px solid rgba(139,26,26,0.4);border-radius:3px;padding:9px 11px;max-width:185px"><div style="font-family:'DM Mono',monospace;font-size:9px;color:#8B1A1A;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:3px">${p.date}</div><div style="font-family:'Playfair Display',serif;font-size:13px;margin-bottom:4px">${p.name}</div><div style="font-size:10px;color:#bf9090;font-style:italic">${p.deaths} killed</div></div>`)
          .addTo(map)
      })
      map.on('mouseenter', 'v-dot', () => { map.getCanvas().style.cursor = 'pointer' })
      map.on('mouseleave', 'v-dot', () => { map.getCanvas().style.cursor = '' })

      CITY_MARKERS.forEach(city => {
        const el = document.createElement('div')
        const c = city.side === 'pakistan' ? COLORS.pakistanGreen : COLORS.indiaOrange
        el.innerHTML = `<div style="width:6px;height:6px;border-radius:50%;background:${c};border:1px solid rgba(255,255,255,0.25);box-shadow:0 0 4px ${c}88;"></div>`
        el.style.cssText = 'width:6px;height:6px;cursor:default;'
        new mapboxgl.Marker({ element: el, anchor: 'center' })
          .setLngLat(city.coords)
          .setPopup(new mapboxgl.Popup({ closeButton: false, offset: 10 })
            .setHTML(`<div style="font-family:'Lato',sans-serif;background:#0D0D0D;border:1px solid rgba(201,184,138,0.18);border-radius:3px;padding:7px 9px;max-width:165px"><div style="font-family:'DM Mono',monospace;font-size:9px;color:#C9B88A;margin-bottom:2px">${city.name}</div><div style="font-size:9px;color:#aaa;line-height:1.5">${city.role}</div></div>`))
          .addTo(map)
      })

      const s = document.createElement('style')
      s.textContent = `.mapboxgl-ctrl-bottom-left,.mapboxgl-ctrl-bottom-right{display:none!important}.mapboxgl-popup-content{background:transparent!important;border:none!important;box-shadow:none!important;padding:0!important}.mapboxgl-popup-tip{display:none!important}`
      document.head.appendChild(s)

      mapRef.current = map
      setMapLoaded(true)
    })

    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); map.remove() }
  }, [])

  const sp = useCallback((id, props) => {
    const map = mapRef.current; if (!map) return
    Object.entries(props).forEach(([k, v]) => { try { map.setPaintProperty(id, k, v) } catch(_){} })
  }, [])

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return
    const map = mapRef.current
    const ch = CHAPTERS[currentChapter]
    map.flyTo({ center: ch.location.center, zoom: ch.location.zoom, duration: 2200, essential: true })
    const mode = ch.mapMode

    if (mode === 'unified') {
      sp('india-fill',      { 'fill-color': COLORS.gold, 'fill-opacity': 0.25 })
      sp('pakistan-fill',   { 'fill-color': COLORS.gold, 'fill-opacity': 0.25 })
      sp('bangladesh-fill', { 'fill-color': COLORS.gold, 'fill-opacity': 0.25 })
    } else if (mode === 'partition_line' || mode === 'aftermath') {
      sp('india-fill',      { 'fill-color': COLORS.indiaOrange,   'fill-opacity': 0.28 })
      sp('pakistan-fill',   { 'fill-color': COLORS.pakistanGreen, 'fill-opacity': 0.28 })
      sp('bangladesh-fill', { 'fill-color': COLORS.pakistanGreen, 'fill-opacity': 0.18 })
    } else if (mode === 'violence_punjab') {
      sp('india-fill',      { 'fill-color': COLORS.indiaOrange, 'fill-opacity': 0.12 })
      sp('pakistan-fill',   { 'fill-color': COLORS.red,         'fill-opacity': 0.32 })
      sp('bangladesh-fill', { 'fill-color': COLORS.gold,        'fill-opacity': 0.05 })
    } else if (mode === 'flows_punjab') {
      sp('india-fill',      { 'fill-color': COLORS.indiaOrange,   'fill-opacity': 0.2 })
      sp('pakistan-fill',   { 'fill-color': COLORS.pakistanGreen, 'fill-opacity': 0.2 })
      sp('bangladesh-fill', { 'fill-color': COLORS.gold,          'fill-opacity': 0.04 })
    } else if (mode === 'flows_bengal') {
      sp('india-fill',      { 'fill-color': COLORS.indiaOrange,   'fill-opacity': 0.1 })
      sp('pakistan-fill',   { 'fill-color': COLORS.pakistanGreen, 'fill-opacity': 0.1 })
      sp('bangladesh-fill', { 'fill-color': COLORS.pakistanGreen, 'fill-opacity': 0.35 })
    } else if (mode === 'violence_both') {
      sp('india-fill',      { 'fill-color': '#1a0505', 'fill-opacity': 0.7 })
      sp('pakistan-fill',   { 'fill-color': '#0a1a05', 'fill-opacity': 0.7 })
      sp('bangladesh-fill', { 'fill-color': '#0a1a05', 'fill-opacity': 0.6 })
    }

    const showLine = mode !== 'unified'
    sp('radcliffe-punjab-layer', { 'line-opacity': showLine ? 0.65 : 0 })
    sp('radcliffe-bengal-layer', { 'line-opacity': showLine ? 0.65 : 0 })

    const showPunjab = mode === 'flows_punjab'
    const showBengal = mode === 'flows_bengal'
    if (showPunjab || showBengal) {
      try { map.setFilter('flow-lines', ['==', ['get','chapter'], showPunjab ? 'great_crossing' : 'bengal_divides']) } catch(_){}
      sp('flow-lines', { 'line-opacity': 0.75, 'line-width': 2 })
    } else {
      sp('flow-lines', { 'line-opacity': 0 })
    }

    const showV = ['violence_punjab','flows_punjab','violence_both'].includes(mode)
    sp('v-glow', { 'circle-radius': showV ? 13 : 0, 'circle-opacity': showV ? 0.2 : 0 })
    sp('v-dot',  { 'circle-radius': showV ? 5  : 0, 'circle-opacity': showV ? 0.9 : 0 })
  }, [currentChapter, mapLoaded, sp])

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setCurrentChapter(prev => {
          if (prev >= CHAPTERS.length - 1) { setPlaying(false); return prev }
          return prev + 1
        })
      }, 7500)
    }
    return () => clearInterval(intervalRef.current)
  }, [playing])

  const goTo = i => { setCurrentChapter(i); setPlaying(false) }
  const togglePlay = () => {
    if (currentChapter >= CHAPTERS.length - 1) { setCurrentChapter(0); setPlaying(true) }
    else setPlaying(p => !p)
  }

  const typeColor = {
    context: COLORS.gold, boundary: '#999',
    migration: '#FF8F00', violence: COLORS.red, aftermath: COLORS.gold,
  }[chapter.type] || COLORS.gold

  return (
    <div style={{ width: '100vw', height: '100vh', background: COLORS.bg, position: 'relative', overflow: 'hidden' }}>
      <div ref={mapContainerRef} style={{ position: 'absolute', inset: 0 }}/>

      {/* Grid */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1,
        backgroundImage: `linear-gradient(rgba(201,184,138,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(201,184,138,0.03) 1px,transparent 1px)`,
        backgroundSize: '60px 60px',
      }}/>

      {/* Nav */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 26px',
        background: 'linear-gradient(to bottom,rgba(13,13,13,0.85) 0%,transparent 100%)',
      }}>
        <Link to="/maps" style={{
          fontFamily: "'DM Mono',monospace", fontSize: '10px',
          color: COLORS.muted, textDecoration: 'none',
          letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>← Maps</Link>
        <div style={{
          fontFamily: "'DM Mono',monospace", fontSize: '9px',
          color: COLORS.mutedDark, letterSpacing: '0.12em', textTransform: 'uppercase',
        }}>
          Animated Maps · 1947 Partition of India
        </div>
      </div>

      {/* Panel */}
      <CinematicPanel
        chapter={chapter}
        chapterIndex={currentChapter}
        totalChapters={CHAPTERS.length}
        playing={playing}
        onPlay={togglePlay}
        onPrev={() => goTo(Math.max(0, currentChapter - 1))}
        onNext={() => goTo(Math.min(CHAPTERS.length - 1, currentChapter + 1))}
      />

      {/* Timeline */}
      <div style={{
        position: 'fixed', bottom: '22px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 40, display: 'flex', alignItems: 'flex-end', gap: '4px',
        background: 'rgba(9,9,7,0.78)', border: '1px solid rgba(201,184,138,0.09)',
        borderRadius: '4px', padding: '9px 13px', backdropFilter: 'blur(12px)',
      }}>
        {CHAPTERS.map((ch, i) => {
          const bc = { context: COLORS.gold, boundary: '#888', migration: '#FF8F00', violence: COLORS.red, aftermath: COLORS.gold }[ch.type] || COLORS.gold
          const isActive = i === currentChapter
          return (
            <button key={ch.id} onClick={() => goTo(i)} title={`${ch.year} — ${ch.title}`} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}>
              <div style={{
                width: '32px', height: isActive ? '24px' : '11px',
                background: isActive ? bc : `${bc}3a`,
                borderRadius: '2px', transition: 'all 0.3s ease',
                boxShadow: isActive ? `0 0 7px ${bc}44` : 'none',
              }}/>
              <div style={{
                fontFamily: "'DM Mono',monospace", fontSize: '7px',
                color: isActive ? bc : COLORS.mutedDark,
                letterSpacing: '0.05em', whiteSpace: 'nowrap', transition: 'color 0.3s',
              }}>
                {ch.year.toString().slice(0, 7)}
              </div>
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div style={{
        position: 'fixed', top: '68px', right: '18px', zIndex: 40,
        background: 'rgba(9,9,7,0.78)', border: '1px solid rgba(201,184,138,0.09)',
        borderRadius: '3px', padding: '9px 12px', backdropFilter: 'blur(12px)',
      }}>
        {[
          { color: COLORS.indiaOrange,   label: 'India' },
          { color: COLORS.pakistanGreen, label: 'Pakistan / Bengal' },
          { color: COLORS.gold,          label: 'Undivided (pre-1947)' },
          { color: COLORS.red,           label: 'Massacre site' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: item.color, flexShrink: 0 }}/>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '7.5px', color: COLORS.muted, letterSpacing: '0.06em' }}>
              {item.label}
            </div>
          </div>
        ))}
        <div style={{ height: '1px', background: 'rgba(201,184,138,0.07)', margin: '6px 0' }}/>
        {[
          { color: '#FF8F00', label: 'Hindus/Sikhs → India' },
          { color: '#1B5E20', label: 'Muslims → Pakistan' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <div style={{ width: '14px', height: 0, borderTop: `2px dashed ${item.color}`, flexShrink: 0 }}/>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '7.5px', color: COLORS.muted, letterSpacing: '0.06em' }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PartitionMap