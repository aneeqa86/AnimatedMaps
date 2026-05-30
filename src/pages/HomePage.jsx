import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MAPS_REGISTRY, LIVE_COUNT } from '@/data/mapsRegistry'

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=DM+Mono:wght@300;400&family=Lato:wght@300;400&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
a { text-decoration: none; color: inherit; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes pulseDot {
  0%,100% { opacity: 1; }
  50%      { opacity: 0.3; }
}
.fade-in { animation: fadeIn 0.7s cubic-bezier(.22,1,.36,1) both; }
.pulse   { animation: pulseDot 2.2s ease-in-out infinite; }

.map-row:hover              { background: rgba(139,100,20,0.06) !important; }
.map-row:hover .row-title   { color: #8B6414 !important; }
.map-row:hover .row-arrow   { transform: translateX(4px) !important; color: #8B6414 !important; }
.hero-cta:hover             { background: #1A1612 !important; color: #F5F0E8 !important; }
nav a:hover                 { color: #1A1612 !important; }
`

const BG      = '#F5F0E8'   /* warm cream */
const INK     = '#1A1612'   /* near-black with warmth */
const INKMD   = '#4A4035'   /* mid brown for body text */
const INKLT   = '#8A7A60'   /* lighter for metadata */
const GOLD    = '#8B6414'   /* deep antique gold */
const RULE    = 'rgba(26,22,18,0.1)'

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

const MapRow = ({ map, index }) => {
  const isLive = map.status === 'live'

  const inner = (
    <div className={isLive ? 'map-row' : ''} style={{
      display: 'grid',
      gridTemplateColumns: '32px 1fr 16px',
      alignItems: 'center',
      gap: '0 14px',
      padding: '11px 8px',
      borderBottom: `1px solid ${RULE}`,
      transition: 'background 0.15s',
      opacity: isLive ? 1 : 0.25,
      borderRadius: 2,
    }}>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8.5, color: INKLT, letterSpacing: '0.08em' }}>
        {String(index + 1).padStart(2, '0')}
      </span>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
          <span className="row-title" style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 15, fontWeight: 700,
            color: INK, letterSpacing: '-0.01em', lineHeight: 1,
            transition: 'color 0.15s',
          }}>
            {map.title}
          </span>
          {isLive && <span className="pulse" style={{ width: 4, height: 4, borderRadius: '50%', background: '#2D8A4E', display: 'inline-block', flexShrink: 0 }}/>}
        </div>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 7.5, color: INKLT, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          {map.eyebrow} · {map.year}
        </p>
      </div>
      {isLive && (
        <span className="row-arrow" style={{ fontSize: 13, color: 'rgba(26,22,18,0.25)', transition: 'transform 0.15s, color 0.15s', display: 'inline-block' }}>
          →
        </span>
      )}
    </div>
  )

  return isLive
    ? <Link to={map.path} style={{ display: 'block', animation: `fadeIn 0.5s ease ${0.3 + index * 0.05}s both` }}>{inner}</Link>
    : <div style={{ animation: `fadeIn 0.5s ease ${0.3 + index * 0.05}s both` }}>{inner}</div>
}

const HomePage = () => (
  <div style={{ background: BG, height: '100vh', overflow: 'hidden', color: INK, display: 'flex', flexDirection: 'column' }}>
    <style>{CSS}</style>

    {/* ── NAV ── */}
    <nav style={{
      flexShrink: 0, zIndex: 10, position: 'relative',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '16px 48px',
      borderBottom: `1px solid ${RULE}`,
    }}>
      <Logo />
      <div style={{ display: 'flex', gap: 32 }}>
        {[['Maps', '/maps'], ['About', '/about']].map(([label, href]) => (
          <Link key={href} to={href} style={{
            fontFamily: "'DM Mono', monospace", fontSize: 9.5,
            letterSpacing: '0.18em', color: INKLT,
            textTransform: 'uppercase', transition: 'color 0.15s',
          }}>
            {label}
          </Link>
        ))}
      </div>
    </nav>

    {/* ── BODY ── */}
    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden', zIndex: 1 }}>

      {/* LEFT */}
      <div style={{
        padding: '0 60px 0 48px',
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        alignItems: 'center',
        borderRight: `1px solid ${RULE}`,
      }}>
        <div className="fade-in" style={{ animationDelay: '0.05s', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ width: 24, height: 1, background: GOLD }}/>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.26em', color: GOLD, textTransform: 'uppercase' }}>
            A Living Atlas
          </span>
        </div>

        <div className="fade-in" style={{ animationDelay: '0.1s', textAlign: 'center' }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(42px, 4.8vw, 70px)',
            fontWeight: 700, lineHeight: 1.05,
            letterSpacing: '-0.025em', color: INK,
          }}>
            History<br/>
            <em style={{ color: GOLD }}>moves.</em><br/>
            We map it.
          </h1>
        </div>

        <div className="fade-in" style={{ animationDelay: '0.18s', marginTop: 28, textAlign: 'center' }}>
          <p style={{
            fontFamily: "'Lato', sans-serif", fontSize: 14,
            lineHeight: 1.85, color: INKMD, fontWeight: 300,
            maxWidth: 340, marginBottom: 32,
          }}>
            Data-driven narratives told through maps, movement, and time.
            Each map is a journey. Each journey is human.
          </p>
          <Link to="/maps" className="hero-cta" style={{
            fontFamily: "'DM Mono', monospace", fontSize: 9.5,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: INK, border: `1px solid ${INK}`,
            padding: '12px 32px', display: 'inline-block',
            transition: 'background 0.2s, color 0.2s',
          }}>
            Enter the Atlas →
          </Link>
        </div>

        <div className="fade-in" style={{ animationDelay: '0.24s', marginTop: 40, marginBottom: 0 }}>
          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 700, color: GOLD, lineHeight: 1, letterSpacing: '-0.02em' }}>
                {String(LIVE_COUNT).padStart(2, '0')}
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7.5, letterSpacing: '0.2em', color: INKLT, textTransform: 'uppercase', marginTop: 4 }}>
                Maps Live
              </div>
            </div>
            <div style={{ width: 1, height: 28, background: RULE }}/>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 700, color: INKLT, lineHeight: 1, letterSpacing: '-0.02em' }}>∞</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7.5, letterSpacing: '0.2em', color: INKLT, textTransform: 'uppercase', marginTop: 4 }}>
                In Research
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div style={{
        padding: '0 48px 0 36px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8.5, letterSpacing: '0.22em', color: INKLT, textTransform: 'uppercase' }}>The Atlas</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8.5, color: INKLT, letterSpacing: '0.1em' }}>{String(LIVE_COUNT).padStart(2,'0')} live</span>
        </div>
        <div style={{ height: 1, background: RULE, marginBottom: 4 }}/>
        {MAPS_REGISTRY.map((map, i) => <MapRow key={map.id} map={map} index={i} />)}
      </div>
    </div>

    {/* ── FOOTER ── */}
    <footer style={{
      flexShrink: 0, zIndex: 1,
      display: 'flex', justifyContent: 'space-between',
      padding: '10px 48px', borderTop: `1px solid ${RULE}`,
    }}>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 7.5, letterSpacing: '0.14em', color: INKLT, textTransform: 'uppercase' }}>AnimatedMaps © {new Date().getFullYear()}</span>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 7.5, letterSpacing: '0.14em', color: INKLT }}>Mapbox · React · Real Data</span>
    </footer>
  </div>
)

export default HomePage