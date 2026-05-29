// ChagaiMap.jsx — v4 BOLD REDESIGN
// Layout: full-bleed left text panel + map right half
// Mood: each chapter shifts the ENTIRE color atmosphere
// No more tiny amber-on-dark. Big type. Dramatic color per chapter.

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { Link } from 'react-router-dom'
import { CHAPTERS, CHAGAI_SITE, POKHRAN_SITE, SEISMIC_EVENTS, CHAPTER_DURATION } from '@/data/chagaiMap'

// ─── Per-chapter mood palettes ────────────────────────────────────────────────
const MOODS = [
  // 0 — The Long Road: aged sepia, patient
  { bg:'#2B1F0E', panel:'#3A2910', accent:'#C8912A', text:'#F0DFB8', sub:'#9A7D55', map:'sepia' },
  // 1 — The Provocation: India tests — angry crimson
  { bg:'#2A0C06', panel:'#3D1008', accent:'#E84020', text:'#FFCAB8', sub:'#B06050', map:'red' },
  // 2 — The Decision: tension, electric teal on near-black
  { bg:'#060E1A', panel:'#0C1828', accent:'#30B8E8', text:'#B8D8F0', sub:'#507090', map:'night' },
  // 3 — DETONATION: blinding white-hot then amber
  { bg:'#1A1000', panel:'#2A1A00', accent:'#FFD020', text:'#FFF0C0', sub:'#B08020', map:'heat' },
  // 4 — Aftermath: green radiation / isolation
  { bg:'#061208', panel:'#0C2010', accent:'#50D870', text:'#C0F0C8', sub:'#408050', map:'fallout' },
]

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Special+Elite&display=swap');

* { box-sizing: border-box; }

@keyframes moodBg {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes slideInLeft {
  from { opacity:0; transform: translateX(-40px); }
  to   { opacity:1; transform: translateX(0); }
}
@keyframes slideInRight {
  from { opacity:0; transform: translateX(24px); }
  to   { opacity:1; transform: translateX(0); }
}
@keyframes popIn {
  0%   { opacity:0; transform: scale(0.7) rotate(-8deg); }
  60%  { transform: scale(1.06) rotate(-4deg); }
  100% { opacity:1; transform: scale(1) rotate(-4deg); }
}
@keyframes fadeUp {
  from { opacity:0; transform: translateY(14px); }
  to   { opacity:1; transform: translateY(0); }
}
@keyframes countNum {
  from { opacity:0; transform: scale(0.5); }
  to   { opacity:1; transform: scale(1); }
}
@keyframes seismoReveal {
  from { clip-path: inset(0 100% 0 0); }
  to   { clip-path: inset(0 0% 0 0); }
}
@keyframes progressFill {
  from { width: 0%; }
  to   { width: 100%; }
}
@keyframes shockExpand {
  0%   { r: 0;   opacity: 0.9; }
  100% { r: 500; opacity: 0; }
}
@keyframes detonFlash {
  0%   { opacity: 0; }
  8%   { opacity: 1; }
  100% { opacity: 0; }
}
@keyframes scanLine {
  0%   { top: -2px; }
  100% { top: 100%; }
}
@keyframes pulseAccent {
  0%,100% { opacity: 0.7; }
  50%      { opacity: 1; }
}
@keyframes glowPulse {
  0%,100% { text-shadow: 0 0 20px currentColor; }
  50%      { text-shadow: 0 0 60px currentColor, 0 0 120px currentColor; }
}
@keyframes trefoilSpin {
  to { transform: rotate(360deg); }
}
@keyframes redactSlide {
  from { transform: scaleX(0); transform-origin: left; }
  to   { transform: scaleX(1); transform-origin: left; }
}

.seismo { animation: seismoReveal 3s ease 0.3s both; }

.mapboxgl-ctrl-bottom-left,
.mapboxgl-ctrl-bottom-right,
.mapboxgl-ctrl-attrib { display:none!important; }
`

// ─── Trefoil ──────────────────────────────────────────────────────────────────
const Trefoil = ({ size, color, spin }) => {
  const r = 18, inner = 6, lobe = 14
  const lobes = [0, 120, 240].map(deg => {
    const rad = (deg - 90) * Math.PI / 180
    return { cx: 50 + r * Math.cos(rad), cy: 50 + r * Math.sin(rad) }
  })
  return (
    <svg width={size} height={size} viewBox="0 0 100 100"
      style={{ display:'block', flexShrink:0,
        animation: spin ? 'trefoilSpin 6s linear infinite' : 'none' }}>
      {lobes.map((p, i) => <circle key={i} cx={p.cx} cy={p.cy} r={lobe} fill={color}/>)}
      <circle cx="50" cy="50" r="22" fill="currentColor"/>
      <circle cx="50" cy="50" r={inner} fill={color}/>
    </svg>
  )
}

// ─── Seismograph ──────────────────────────────────────────────────────────────
const Seismograph = ({ activeIdx, accent }) => {
  const W = 900, MID = 26
  const buildPath = () => {
    let d = `M 0 ${MID}`
    SEISMIC_EVENTS.forEach(ev => {
      const x = ev.x * W, h = ev.intensity * 22
      d += ` L ${x-12} ${MID} L ${x-3} ${MID-h} L ${x} ${MID+h*0.8} L ${x+3} ${MID-h*0.35} L ${x+11} ${MID}`
    })
    return d + ` L ${W} ${MID}`
  }
  const path = buildPath()
  return (
    <svg width="100%" height="54" viewBox={`0 0 ${W} ${MID*2}`} preserveAspectRatio="none">
      <path d={path} stroke={`${accent}28`} strokeWidth="7" fill="none" className="seismo" style={{filter:'blur(4px)'}}/>
      <path d={path} stroke={accent} strokeWidth="1.8" fill="none" className="seismo"/>
      {SEISMIC_EVENTS.map((ev, i) => {
        const col = i < 2 ? '#E84020' : accent
        return (
          <g key={i}>
            <line x1={ev.x*W} y1="0" x2={ev.x*W} y2={MID*2} stroke={col} strokeWidth="1" strokeDasharray="2 3" opacity="0.5"/>
            <text x={ev.x*W} y={MID*2-2} textAnchor="middle" fontSize="7" fill={col} opacity="0.9"
              fontFamily="'Courier Prime',monospace" letterSpacing="0.5">{ev.date}</text>
            <text x={ev.x*W} y="9" textAnchor="middle" fontSize="6.5" fill={col} opacity="0.6"
              fontFamily="'Courier Prime',monospace">{ev.label}</text>
          </g>
        )
      })}
      {activeIdx === 3 && (
        <circle cx={SEISMIC_EVENTS[2].x*W} cy={MID} r="0" fill="none" stroke={accent} strokeWidth="2.5">
          <animate attributeName="r" values="2;28;2" dur="1.4s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;0;1" dur="1.4s" repeatCount="indefinite"/>
        </circle>
      )}
    </svg>
  )
}

// ─── Shockwave overlay ────────────────────────────────────────────────────────
const ShockwaveOverlay = ({ active, accent }) => {
  if (!active) return null
  return (
    <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:20}}>
      {/* White-hot flash */}
      <div style={{
        position:'absolute', inset:0,
        background:'radial-gradient(circle at 62% 50%, rgba(255,255,220,0.55) 0%, rgba(255,200,50,0.2) 20%, transparent 55%)',
        animation:'detonFlash 3.5s ease infinite',
      }}/>
      <svg width="100%" height="100%" style={{position:'absolute',inset:0,overflow:'visible'}}>
        {[0, 0.6, 1.2].map((d,i) => (
          <g key={i}>
            <circle cx="62%" cy="50%" r="0" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0">
              <animate attributeName="r" from="0" to="600" dur="3.5s" begin={`${d}s`} repeatCount="indefinite"/>
              <animate attributeName="opacity" from="0.7" to="0" dur="3.5s" begin={`${d}s`} repeatCount="indefinite"/>
              <animate attributeName="stroke-width" from="4" to="0.2" dur="3.5s" begin={`${d}s`} repeatCount="indefinite"/>
            </circle>
            <circle cx="62%" cy="50%" r="0" fill="none" stroke={accent} strokeWidth="2" opacity="0">
              <animate attributeName="r" from="0" to="350" dur="2.5s" begin={`${d+0.25}s`} repeatCount="indefinite"/>
              <animate attributeName="opacity" from="0.9" to="0" dur="2.5s" begin={`${d+0.25}s`} repeatCount="indefinite"/>
            </circle>
          </g>
        ))}
      </svg>
    </div>
  )
}

// ─── Animated counter ─────────────────────────────────────────────────────────
const Counter = ({ target }) => {
  const [val, setVal] = useState(0)
  const ref = useRef(target)
  useEffect(() => {
    ref.current = target; setVal(0)
    let s = null
    const f = ts => {
      if (!s) s = ts
      const p = Math.min((ts-s)/1200,1)
      setVal(Math.round((1-Math.pow(1-p,3))*target))
      if (p < 1 && ref.current === target) requestAnimationFrame(f)
    }
    requestAnimationFrame(f)
  }, [target])
  return <>{val}</>
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const ChagaiMap = () => {
  const mapEl   = useRef(null)
  const mapRef  = useRef(null)
  const [idx, setIdx]       = useState(0)
  const [ready, setReady]   = useState(false)
  const [playing, setPlaying] = useState(true)

  const mood    = MOODS[idx]
  const chapter = CHAPTERS[idx]
  const ck      = `ck-${idx}`

  // ── Map init ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (mapRef.current) return
    const map = new mapboxgl.Map({
      container: mapEl.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [65.5, 29.5], zoom: 4.5,
      attributionControl: false,
    })
    map.on('load', () => {
      map.addSource('cb', { type:'vector', url:'mapbox://mapbox.country-boundaries-v1' })
      ;['PAK','IND','AFG','CHN'].forEach(iso => {
        map.addLayer({ id:`fill-${iso}`, type:'fill', source:'cb',
          'source-layer':'country_boundaries', filter:['==','iso_3166_1_alpha_3',iso],
          paint:{'fill-color':'#000','fill-opacity':0}
        })
        map.addLayer({ id:`line-${iso}`, type:'line', source:'cb',
          'source-layer':'country_boundaries', filter:['==','iso_3166_1_alpha_3',iso],
          paint:{'line-color':'rgba(255,255,255,0.2)','line-width':1}
        })
      })
      // Chagai
      map.addSource('chagai',{ type:'geojson', data:{ type:'Feature', geometry:{ type:'Point', coordinates:CHAGAI_SITE }}})
      map.addLayer({ id:'chagai-dot', type:'circle', source:'chagai',
        paint:{'circle-radius':7,'circle-color':'#FFD020','circle-stroke-width':2,'circle-stroke-color':'#FFFFFF','circle-opacity':1}
      })
      // Pokhran
      map.addSource('pokhran',{ type:'geojson', data:{ type:'Feature', geometry:{ type:'Point', coordinates:POKHRAN_SITE }}})
      map.addLayer({ id:'pokhran-dot', type:'circle', source:'pokhran',
        paint:{'circle-radius':6,'circle-color':'#E84020','circle-stroke-width':1.5,'circle-stroke-color':'#FF8060','circle-opacity':0}
      })
      mapRef.current = map
      setReady(true)
    })
    return () => map.remove()
  }, [])

  // ── Chapter transitions ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!ready || !mapRef.current) return
    const map = mapRef.current
    const ch  = chapter

    map.flyTo({ center:ch.focus.center, zoom:ch.focus.zoom, duration:2600, essential:true })

    // Tint based on mood
    const tints = {
      sepia:   { PAK:'#3A2000', IND:'#2A1800', AFG:'#3A2400', CHN:'#3A2800' },
      red:     { PAK:'#1A0800', IND:'#3A0800', AFG:'#2A0A00', CHN:'#2A0800' },
      night:   { PAK:'#00081A', IND:'#00061A', AFG:'#000C20', CHN:'#000818' },
      heat:    { PAK:'#200800', IND:'#180600', AFG:'#200A00', CHN:'#1A0800' },
      fallout: { PAK:'#001808', IND:'#001206', AFG:'#001A08', CHN:'#001408' },
    }
    const t = tints[mood.map] || tints.sepia
    ;['PAK','IND','AFG','CHN'].forEach(iso => {
      const fill = ch.fills?.find(f => f.iso === iso)
      try {
        map.setPaintProperty(`fill-${iso}`, 'fill-color', t[iso] || '#100800')
        map.setPaintProperty(`fill-${iso}`, 'fill-opacity', (fill?.opacity ?? 0) * 0.28)
      } catch(_){}
    })

    // Line color match accent
    ;['PAK','IND','AFG','CHN'].forEach(iso => {
      try { map.setPaintProperty(`line-${iso}`, 'line-color', `${mood.accent}40`) } catch(_){}
    })

    const showPokhran = ch.type === 'tension' || ch.pokhranPulse
    try {
      map.setPaintProperty('pokhran-dot','circle-opacity', showPokhran ? 1 : 0)
    } catch(_){}

    // Chagai dot color = current accent
    try {
      map.setPaintProperty('chagai-dot','circle-color', mood.accent)
    } catch(_){}
  }, [idx, ready])

  // ── Autoplay ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => setIdx(i => {
      if (i >= CHAPTERS.length-1) { setPlaying(false); return i }
      return i+1
    }), CHAPTER_DURATION)
    return () => clearInterval(t)
  }, [playing])

  // ── Keys ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const h = e => {
      if (e.key==='ArrowRight') setIdx(i=>Math.min(CHAPTERS.length-1,i+1))
      if (e.key==='ArrowLeft')  setIdx(i=>Math.max(0,i-1))
      if (e.key===' ') { e.preventDefault(); setPlaying(p=>!p) }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  const goTo = i => { setIdx(i); setPlaying(false) }

  return (
    <div style={{
      position:'fixed', inset:0, overflow:'hidden',
      background: mood.bg,
      transition: 'background 1.2s ease',
      display:'flex', flexDirection:'column',
      fontFamily:"'Courier Prime',monospace",
      color: mood.text,
    }}>
      <style>{CSS}</style>

      {/* ── SHOCKWAVE ── */}
      <ShockwaveOverlay active={chapter.shockwave} accent={mood.accent}/>

      {/* ── SCANLINE ── */}
      <div style={{
        position:'fixed', left:0, right:0, height:2, pointerEvents:'none', zIndex:5,
        background:`linear-gradient(90deg,transparent,${mood.accent}20,transparent)`,
        animation:'scanLine 9s linear infinite',
      }}/>

      {/* ═══════════════════════════════════════════════════════
          TOP BAR
      ═══════════════════════════════════════════════════════ */}
      <div style={{
        height:50, flexShrink:0,
        background:`${mood.panel}F0`,
        borderBottom:`2px solid ${mood.accent}50`,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0 24px', zIndex:40,
      }}>
        <Link to="/maps" style={{
          color:mood.sub, fontSize:9, letterSpacing:'0.2em',
          textDecoration:'none', fontFamily:"'Courier Prime',monospace",
        }}>← ANIMATED MAPS</Link>

        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ color: mood.bg }}>
            <Trefoil size={20} color={mood.accent} spin={chapter.type==='detonation'}/>
          </div>
          <span style={{
            fontFamily:"'Anton',sans-serif",
            fontSize:18, color:mood.accent, letterSpacing:'0.3em',
            animation: chapter.type==='detonation' ? 'glowPulse 1.5s ease-in-out infinite' : 'none',
          }}>
            YOUM-E-TAKBIR
          </span>
          <div style={{
            fontSize:8, color:mood.accent, border:`1.5px solid ${mood.accent}`,
            padding:'2px 8px', letterSpacing:'0.3em',
            fontFamily:"'Courier Prime',monospace",
            background:`${mood.accent}15`,
          }}>
            CLASSIFIED
          </div>
        </div>

        <div style={{ fontSize:9, color:mood.sub, letterSpacing:'0.14em' }}>
          28 MAY 1998 &nbsp;·&nbsp; {idx+1} / {CHAPTERS.length}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          BODY: LEFT PANEL + MAP
      ═══════════════════════════════════════════════════════ */}
      <div style={{ flex:1, display:'flex', overflow:'hidden', position:'relative' }}>

        {/* ── LEFT PANEL ─────────────────────────────────────────────────── */}
        <div
          key={ck}
          style={{
            width: 380, flexShrink:0,
            background:`linear-gradient(180deg, ${mood.panel} 0%, ${mood.bg} 100%)`,
            borderRight:`2px solid ${mood.accent}35`,
            padding:'14px 22px 10px',
            display:'flex', flexDirection:'column',
            overflow:'hidden', zIndex:10,
            animation:'slideInLeft 0.5s cubic-bezier(.22,1,.36,1) both',
            position:'relative',
          }}
        >
          {/* Year label */}
          <div style={{
            fontSize:8.5, color:mood.sub, letterSpacing:'0.28em',
            textTransform:'uppercase', marginBottom:5, flexShrink:0,
            animation:'fadeUp 0.4s ease 0.05s both', opacity:0,
          }}>
            {chapter.year}
          </div>

          {/* TITLE */}
          <h1 style={{
            fontFamily:"'Anton',sans-serif",
            fontSize:42, lineHeight:0.95,
            color:mood.text, margin:'0 0 4px', flexShrink:0,
            letterSpacing:'0.02em',
            animation:'fadeUp 0.45s ease 0.1s both', opacity:0,
          }}>
            {chapter.title.toUpperCase()}
          </h1>

          <div style={{
            fontSize:10, color:mood.sub, fontStyle:'italic', marginBottom:8, flexShrink:0,
            animation:'fadeUp 0.45s ease 0.16s both', opacity:0,
          }}>
            {chapter.subtitle}
          </div>

          {/* Accent rule */}
          <div style={{
            height:2, background:`linear-gradient(90deg, ${mood.accent}, transparent)`,
            marginBottom:8, flexShrink:0,
            animation:'fadeUp 0.4s ease 0.2s both', opacity:0,
          }}/>

          {/* Body text */}
          <p style={{
            fontSize:10.5, lineHeight:1.65, color:mood.text,
            opacity:0, margin:'0 0 8px', flexShrink:0,
            animation:'fadeUp 0.5s ease 0.25s both',
          }}>
            {chapter.body}
          </p>

          {/* REDACTED */}
          <div style={{
            marginBottom:8, opacity:0, flexShrink:0,
            animation:'fadeUp 0.4s ease 0.32s both',
            display:'flex', alignItems:'center', gap:8,
          }}>
            <span style={{ fontSize:8, color:mood.sub, letterSpacing:'0.15em' }}>AUTHORISED BY</span>
            <div style={{
              background:mood.accent, height:13, width:130,
              animation:'redactSlide 0.4s ease 0.5s both', transformOrigin:'left',
            }}/>
          </div>

          {/* Quote */}
          <div style={{
            borderLeft:`2px solid ${mood.accent}`,
            paddingLeft:10, marginBottom:0, flexShrink:0,
            opacity:0, animation:'fadeUp 0.5s ease 0.38s both',
          }}>
            <p style={{ fontSize:10, fontStyle:'italic', color:mood.text, lineHeight:1.5, margin:'0 0 3px' }}>
              "{chapter.quote}"
            </p>
            <span style={{ fontSize:8, color:mood.accent, letterSpacing:'0.12em' }}>
              — {chapter.quoteAuthor}
            </span>
          </div>

          {/* STAT at bottom */}
          <div style={{
            opacity:0, animation:'fadeUp 0.5s ease 0.45s both',
            display:'flex', alignItems:'flex-end', gap:10,
            marginTop:'auto', flexShrink:0,
            paddingTop:8,
            borderTop:`1px solid ${mood.accent}25`,
          }}>
            <span style={{
              fontFamily:"'Anton',sans-serif",
              fontSize:72, lineHeight:0.88,
              color:mood.accent,
              textShadow:`0 0 28px ${mood.accent}55`,
            }}>
              <Counter target={chapter.stat.value}/>
            </span>
            <span style={{
              fontSize:8.5, color:mood.sub, letterSpacing:'0.18em',
              textTransform:'uppercase', paddingBottom:6,
              lineHeight:1.4, maxWidth:80,
            }}>
              {chapter.stat.label}
            </span>
            <div style={{
              marginLeft:'auto', alignSelf:'center',
              fontFamily:"'Special Elite',cursive",
              fontSize:8.5, color:mood.accent,
              border:`2px solid ${mood.accent}`,
              padding:'3px 7px', letterSpacing:'0.15em',
              transform:'rotate(-3deg)',
              background:`${mood.accent}12`,
              animation:'popIn 0.5s cubic-bezier(.22,1,.36,1) 0.4s both', opacity:0,
            }}>
              {chapter.stamp || 'DECLASSIFIED'}
            </div>
          </div>
        </div>

        {/* ── MAP ──────────────────────────────────────────────────────────── */}
        <div style={{ flex:1, position:'relative' }}>
          <div ref={mapEl} style={{ position:'absolute', inset:0 }}/>

          {/* Detonation heat bloom over map */}
          {chapter.type === 'detonation' && (
            <div style={{
              position:'absolute', inset:0, pointerEvents:'none', zIndex:3,
              background:'radial-gradient(ellipse at 60% 52%, rgba(255,220,50,0.22) 0%, rgba(220,120,10,0.1) 30%, transparent 60%)',
              animation:'detonFlash 3s ease infinite',
            }}/>
          )}

          {/* Mood-tinted vignette */}
          <div style={{
            position:'absolute', inset:0, pointerEvents:'none', zIndex:2,
            background:`radial-gradient(ellipse at 50% 50%, transparent 45%, ${mood.bg}99 100%)`,
            transition:'background 1.2s ease',
          }}/>

          {/* Chapter number — big watermark */}
          <div style={{
            position:'absolute', bottom:16, right:16, zIndex:5,
            fontFamily:"'Anton',sans-serif",
            fontSize:200, lineHeight:1,
            color:`${mood.accent}08`,
            letterSpacing:'-0.05em',
            userSelect:'none', pointerEvents:'none',
          }}>
            {idx+1}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SEISMOGRAPH BAR
      ═══════════════════════════════════════════════════════ */}
      <div style={{
        flexShrink:0,
        background:`${mood.panel}F0`,
        borderTop:`1px solid ${mood.accent}25`,
        padding:'5px 24px 0',
        zIndex:30,
      }}>
        <div style={{
          display:'flex', justifyContent:'space-between',
          fontSize:7.5, color:mood.sub, letterSpacing:'0.2em', marginBottom:2,
        }}>
          <span>SEISMOGRAPH · CTBTO · MAY 1998</span>
          <span style={{
            color: chapter.type==='detonation' ? mood.accent : mood.sub,
            animation: chapter.type==='detonation' ? 'pulseAccent 0.9s ease-in-out infinite' : 'none',
          }}>
            {chapter.type==='detonation' ? '◉ DETONATION DETECTED' : '○ MONITORING'}
          </span>
        </div>
        <Seismograph activeIdx={idx} accent={mood.accent}/>
      </div>

      {/* ═══════════════════════════════════════════════════════
          CONTROLS
      ═══════════════════════════════════════════════════════ */}
      <div style={{
        height:46, flexShrink:0,
        background:`${mood.bg}FC`,
        borderTop:`1px solid ${mood.accent}30`,
        display:'flex', alignItems:'center', justifyContent:'center', gap:8,
        position:'relative', zIndex:40,
      }}>
        {/* Progress bar */}
        {playing && (
          <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:`${mood.accent}15`}}>
            <div key={`pb-${idx}`} style={{
              height:'100%',
              background:`linear-gradient(90deg, ${mood.sub}, ${mood.accent}, ${mood.text})`,
              animation:`progressFill ${CHAPTER_DURATION}ms linear both`, width:0,
            }}/>
          </div>
        )}

        {CHAPTERS.map((ch, i) => (
          <button key={i} onClick={() => goTo(i)} style={{
            background: i===idx ? `${mood.accent}20` : 'transparent',
            border:`1px solid ${i===idx ? mood.accent : `${mood.accent}25`}`,
            color: i===idx ? mood.accent : mood.sub,
            padding:'4px 12px', cursor:'pointer',
            fontFamily:"'Courier Prime',monospace", fontSize:8.5, letterSpacing:'0.1em',
            transition:'all 0.3s ease',
            boxShadow: i===idx ? `0 0 12px ${mood.accent}30` : 'none',
          }}>
            {String(ch.year||'').split('–')[0].trim().slice(0,7)}
          </button>
        ))}

        <div style={{ width:1, height:16, background:`${mood.accent}25`, margin:'0 4px' }}/>

        <button onClick={() => setPlaying(p=>!p)} style={{
          background: playing ? `${mood.accent}20` : 'transparent',
          border:`1px solid ${mood.accent}50`,
          color: playing ? mood.accent : mood.sub,
          padding:'4px 14px', cursor:'pointer',
          fontFamily:"'Courier Prime',monospace", fontSize:8.5, letterSpacing:'0.14em',
          transition:'all 0.2s',
        }}>
          {playing ? '■ HALT' : '▶ PLAY'}
        </button>

        <button onClick={() => { setIdx(0); setPlaying(true) }} style={{
          background:'transparent', border:`1px solid ${mood.accent}25`,
          color:mood.sub, padding:'4px 10px', cursor:'pointer', fontSize:11,
        }}>
          ↺
        </button>
      </div>
    </div>
  )
}

export default ChagaiMap