import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MAPS_REGISTRY, LIVE_COUNT } from '@/data/mapsRegistry'

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=DM+Mono:wght@300;400&family=Lato:wght@300;400&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
a { text-decoration: none; color: inherit; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes pulseDot {
  0%,100% { opacity: 1; }
  50%      { opacity: 0.3; }
}
.pulse { animation: pulseDot 2.2s ease-in-out infinite; }

.card-wrap { transition: box-shadow 0.25s, transform 0.25s, border-color 0.25s; }
.card-wrap:hover { transform: translateY(-3px); box-shadow: 0 8px 32px rgba(26,22,18,0.12) !important; border-color: var(--hc) !important; }
.card-wrap:hover .c-title { color: #8B6414 !important; }
.card-wrap:hover .c-cta   { opacity: 1 !important; color: #8B6414 !important; }
.card-wrap:hover .c-arrow { transform: translateX(4px) !important; }
.card-wrap:hover .c-chip  { border-color: rgba(139,100,20,0.3) !important; color: #8B6414 !important; }
nav a:hover { color: #1A1612 !important; }
`

const BG    = '#F5F0E8'
const INK   = '#1A1612'
const INKMD = '#4A4035'
const INKLT = '#8A7A60'
const GOLD  = '#8B6414'
const RULE  = 'rgba(26,22,18,0.1)'

const Logo = () => (
  <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
    <svg width="24" height="24" viewBox="0 0 26 26">
      <circle cx="13" cy="13" r="11" stroke={INK} strokeWidth="1" fill="none" opacity="0.7"/>
      <line x1="2" y1="13" x2="24" y2="13" stroke={INK} strokeWidth="0.6" opacity="0.35"/>
      <ellipse cx="13" cy="13" rx="4.5" ry="11" fill="none" stroke={INK} strokeWidth="0.6" opacity="0.25"/>
      <polygon points="9,8 9,18 20,13" fill={INK} opacity="0.85"/>
    </svg>
    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.22em', color: INK, lineHeight: 1.5, opacity: 0.7 }}>
      ANIMATED<br/>MAPS
    </span>
  </Link>
)

const MapCard = ({ map, index }) => {
  const isLive = map.status === 'live'
  const { Visual, hoverBorderColor, tagColor } = map

  const card = (
    <article className="card-wrap" style={{
      '--hc': hoverBorderColor,
      display: 'flex', flexDirection: 'column',
      background: '#FFFFFF',
      border: `1px solid ${RULE}`,
      cursor: isLive ? 'pointer' : 'default',
      animation: `fadeUp 0.5s ease ${index * 0.06}s both`,
      overflow: 'hidden',
      boxShadow: '0 1px 4px rgba(26,22,18,0.06)',
    }}>
      {/* Visual — dark card backgrounds show through here */}
      <div style={{ position: 'relative', height: 200, overflow: 'hidden', flexShrink: 0, background: map.cardBg || '#1a1814' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          {Visual && <Visual />}
          {!isLive && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, color: 'rgba(255,255,255,0.08)' }}>◎</span>
            </div>
          )}
        </div>
        {/* badges */}
        <div style={{ position: 'absolute', top: 12, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontFamily: "'DM Mono', monospace", fontSize: 7.5,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: tagColor, border: `1px solid ${tagColor}60`,
            padding: '2px 8px', background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
          }}>
            {map.tag}
          </span>
          {isLive && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span className="pulse" style={{ width: 4, height: 4, borderRadius: '50%', background: '#2D8A4E', display: 'inline-block' }}/>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 7.5, letterSpacing: '0.14em', color: '#2D8A4E' }}>LIVE</span>
            </div>
          )}
        </div>
      </div>

      {/* Text */}
      <div style={{ padding: '16px 18px 20px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1, background: '#FFFFFF' }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7.5, letterSpacing: '0.12em', color: INKLT, textTransform: 'uppercase' }}>
          {map.eyebrow} · {map.year}
        </div>
        <h2 className="c-title" style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(16px, 1.6vw, 21px)',
          fontWeight: 700, lineHeight: 1.15,
          letterSpacing: '-0.01em', color: INK,
          transition: 'color 0.2s',
        }}>
          {map.title}
        </h2>
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, lineHeight: 1.8, color: INKMD, fontWeight: 300, flex: 1 }}>
          {map.desc}
        </p>
        {map.stats?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {map.stats.map((s, si) => {
              const label = typeof s === 'object' ? `${s.value} ${s.label}` : s
              return (
                <span key={si} className="c-chip" style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 7.5,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  border: `1px solid ${RULE}`, color: INKLT,
                  padding: '2px 7px', transition: 'border-color 0.2s, color 0.2s',
                }}>
                  {label}
                </span>
              )
            })}
          </div>
        )}
        {isLive && (
          <div className="c-cta" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: "'DM Mono', monospace", fontSize: 8.5,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: INKLT, opacity: 0.6,
            transition: 'opacity 0.2s, color 0.2s',
          }}>
            View Map <span className="c-arrow" style={{ display: 'inline-block', transition: 'transform 0.18s' }}>→</span>
          </div>
        )}
      </div>
    </article>
  )

  return isLive ? <Link to={map.path} style={{ display: 'block' }}>{card}</Link> : card
}

const MapsPage = () => {
  const [vis, setVis] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVis(true), 60); return () => clearTimeout(t) }, [])

  return (
    <div style={{ background: BG, minHeight: '100vh', color: INK }}>
      <style>{CSS}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 48px',
        borderBottom: `1px solid ${RULE}`,
        background: 'rgba(245,240,232,0.97)',
        backdropFilter: 'blur(8px)',
      }}>
        <Logo />
        <div style={{ display: 'flex', gap: 32 }}>
          <Link to="/maps" style={{ fontFamily: "'DM Mono', monospace", fontSize: 9.5, letterSpacing: '0.18em', color: INK, textTransform: 'uppercase' }}>Maps</Link>
          <Link to="/about" style={{ fontFamily: "'DM Mono', monospace", fontSize: 9.5, letterSpacing: '0.18em', color: INKLT, textTransform: 'uppercase', transition: 'color 0.15s' }}>About</Link>
        </div>
      </nav>

      {/* ── HEADER ── */}
      <header style={{
        padding: '52px 48px 40px',
        borderBottom: `1px solid ${RULE}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(10px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div style={{ width: 22, height: 1, background: GOLD }}/>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.24em', color: GOLD, textTransform: 'uppercase' }}>
              The Collection
            </span>
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(40px, 5vw, 64px)',
            fontWeight: 700, lineHeight: 0.95,
            letterSpacing: '-0.025em', color: INK,
          }}>
            The <em style={{ color: GOLD }}>Atlas.</em>
          </h1>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 13.5, lineHeight: 1.8, color: INKMD, fontWeight: 300, maxWidth: 400, marginTop: 14 }}>
            Each map is a self-contained story — data-driven, animated, built on real history.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, paddingBottom: 2 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 700, color: GOLD, lineHeight: 1, letterSpacing: '-0.02em' }}>
              {String(LIVE_COUNT).padStart(2, '0')}
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7.5, letterSpacing: '0.2em', color: INKLT, textTransform: 'uppercase', marginTop: 5 }}>Maps Live</div>
          </div>
          <div style={{ width: 1, height: 36, background: RULE }}/>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 700, color: INKLT, lineHeight: 1, letterSpacing: '-0.02em' }}>∞</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7.5, letterSpacing: '0.2em', color: INKLT, textTransform: 'uppercase', marginTop: 5 }}>In Research</div>
          </div>
        </div>
      </header>

      {/* ── GRID ── */}
      <section style={{ padding: '32px 48px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.26em', color: INKLT, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>All Maps</span>
          <div style={{ flex: 1, height: 1, background: RULE }}/>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: 16,
        }}>
          {MAPS_REGISTRY.map((map, i) => <MapCard key={map.id} map={map} index={i} />)}
        </div>
      </section>

      <footer style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 48px', borderTop: `1px solid ${RULE}` }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.14em', color: INKLT, textTransform: 'uppercase' }}>AnimatedMaps © {new Date().getFullYear()}</span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.14em', color: INKLT }}>Mapbox · React · Real Data</span>
      </footer>
    </div>
  )
}

export default MapsPage