import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { MAPS_REGISTRY, LIVE_COUNT } from '@/data/mapsRegistry'

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=DM+Mono:wght@300;400;500&family=Lato:wght@300;400;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
a { text-decoration: none; color: inherit; }
html { scroll-behavior: smooth; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes pulseDot {
  0%,100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.4; transform: scale(0.85); }
}
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes tickIn {
  from { transform: scaleX(0); opacity: 0; }
  to   { transform: scaleX(1); opacity: 1; }
}

.live-pulse { animation: pulseDot 2.4s ease-in-out infinite; }

/* Card */
.map-card {
  position: relative;
  background: #FEFCF8;
  border: 1px solid rgba(26,22,18,0.08);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.2,0,0,1), box-shadow 0.3s cubic-bezier(0.2,0,0,1), border-color 0.3s;
  animation: fadeUp 0.55s ease both;
}
.map-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 48px rgba(26,22,18,0.13), 0 2px 8px rgba(26,22,18,0.06);
  border-color: var(--accent, rgba(139,100,20,0.4));
}

/* Thumbnail overlay that fades in on hover */
.card-thumb-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to bottom, transparent 40%, rgba(10,8,5,0.55) 100%);
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 2;
  pointer-events: none;
}
.map-card:hover .card-thumb-overlay { opacity: 1; }

/* Title accent bar */
.card-accent-bar {
  position: absolute; left: 0; top: 0; bottom: 0;
  width: 3px;
  background: var(--accent, #8B6414);
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform 0.3s cubic-bezier(0.2,0,0,1);
}
.map-card:hover .card-accent-bar { transform: scaleY(1); }

/* CTA arrow */
.cta-arrow {
  display: inline-block;
  transition: transform 0.2s;
}
.map-card:hover .cta-arrow { transform: translateX(5px); }

/* Nav link hover */
.nav-link { transition: color 0.15s, opacity 0.15s; }
.nav-link:hover { color: #1A1612 !important; opacity: 1 !important; }

/* Stat chip */
.stat-chip {
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}
.map-card:hover .stat-chip {
  background: rgba(139,100,20,0.06) !important;
  border-color: rgba(139,100,20,0.25) !important;
  color: #8B6414 !important;
}

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(26,22,18,0.15); border-radius: 3px; }
`

// ── Palette ────────────────────────────────────────────────────────────────────
const P = {
  bg:    '#F5F0E8',
  bgAlt: '#EDE8DE',
  ink:   '#1A1612',
  inkMd: '#4A4035',
  inkLt: '#8A7A60',
  gold:  '#8B6414',
  rule:  'rgba(26,22,18,0.08)',
  white: '#FEFCF8',
}

// ── Logo ───────────────────────────────────────────────────────────────────────
const Logo = () => (
  <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <circle cx="13" cy="13" r="11.5" stroke={P.ink} strokeWidth="0.8" opacity="0.6"/>
      <line x1="1.5" y1="13" x2="24.5" y2="13" stroke={P.ink} strokeWidth="0.5" opacity="0.3"/>
      <ellipse cx="13" cy="13" rx="4.5" ry="11.5" stroke={P.ink} strokeWidth="0.5" opacity="0.2"/>
      <polygon points="9.5,8 9.5,18 19.5,13" fill={P.ink} opacity="0.8"/>
    </svg>
    <span style={{
      fontFamily: "'DM Mono', monospace",
      fontSize: 9, letterSpacing: '0.24em',
      color: P.ink, lineHeight: 1.5, opacity: 0.65,
      textTransform: 'uppercase',
    }}>
      Animated<br/>Maps
    </span>
  </Link>
)

// ── Map Card ───────────────────────────────────────────────────────────────────
const MapCard = ({ map, index }) => {
  const isLive = map.status === 'live'
  const { Visual } = map

  const inner = (
    <article
      className="map-card"
      style={{
        '--accent': map.hoverBorderColor,
        animationDelay: `${index * 0.07}s`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className="card-accent-bar" style={{ background: map.hoverBorderColor }} />

      {/* ── Thumbnail ── */}
      <div style={{
        position: 'relative',
        height: 210,
        flexShrink: 0,
        background: map.cardBg || '#1a1814',
        overflow: 'hidden',
      }}>
        {Visual && (
          <div style={{ position: 'absolute', inset: 0 }}>
            <Visual />
          </div>
        )}
        <div className="card-thumb-overlay" />

        {/* Badges row */}
        <div style={{
          position: 'absolute', top: 14, left: 14, right: 14,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          zIndex: 3,
        }}>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 7.5, letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: map.tagColor,
            border: `1px solid ${map.tagColor}55`,
            padding: '3px 9px',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(6px)',
          }}>
            {map.tag}
          </span>
          {isLive && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span className="live-pulse" style={{
                display: 'inline-block', width: 5, height: 5,
                borderRadius: '50%', background: '#3AAA6A',
              }}/>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 7.5, letterSpacing: '0.16em',
                color: '#3AAA6A',
              }}>LIVE</span>
            </div>
          )}
        </div>

        {/* Year stamp — bottom right of thumb */}
        <div style={{
          position: 'absolute', bottom: 12, right: 14, zIndex: 3,
          fontFamily: "'DM Mono', monospace",
          fontSize: 8, letterSpacing: '0.14em',
          color: 'rgba(255,255,255,0.35)',
        }}>
          {map.year}
        </div>
      </div>

      {/* ── Text body ── */}
      <div style={{
        padding: '20px 22px 22px',
        display: 'flex', flexDirection: 'column', gap: 10,
        flex: 1,
        background: P.white,
      }}>
        {/* Eyebrow */}
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 7.5, letterSpacing: '0.14em',
          color: P.inkLt, textTransform: 'uppercase',
        }}>
          {map.eyebrow}
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(17px, 1.5vw, 22px)',
          fontWeight: 700, lineHeight: 1.15,
          letterSpacing: '-0.015em',
          color: P.ink,
        }}>
          {map.title}
        </h2>

        {/* Divider */}
        <div style={{
          width: 28, height: 1,
          background: map.hoverBorderColor,
          opacity: 0.5,
        }}/>

        {/* Description */}
        <p style={{
          fontFamily: "'Lato', sans-serif",
          fontSize: 12.5, lineHeight: 1.85,
          color: P.inkMd, fontWeight: 300,
          flex: 1,
        }}>
          {map.desc}
        </p>

        {/* Stats */}
        {map.stats?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 2 }}>
            {map.stats.map((s, si) => {
              const label = typeof s === 'object' ? `${s.value} ${s.label}` : s
              return (
                <span key={si} className="stat-chip" style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 7.5, letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: P.inkLt,
                  border: `1px solid ${P.rule}`,
                  padding: '3px 8px',
                  background: 'transparent',
                }}>
                  {label}
                </span>
              )
            })}
          </div>
        )}

        {/* CTA */}
        {isLive && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 7,
            fontFamily: "'DM Mono', monospace",
            fontSize: 8.5, letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: map.hoverBorderColor,
            opacity: 0.75,
            marginTop: 4,
          }}>
            Explore Map
            <span className="cta-arrow">→</span>
          </div>
        )}
      </div>
    </article>
  )

  return isLive
    ? <Link to={map.path} style={{ display: 'block', textDecoration: 'none' }}>{inner}</Link>
    : inner
}

// ── Page ───────────────────────────────────────────────────────────────────────
const MapsPage = () => {
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVis(true), 50)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ background: P.bg, minHeight: '100vh', color: P.ink }}>
      <style>{CSS}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 52px',
        borderBottom: `1px solid ${P.rule}`,
        background: 'rgba(245,240,232,0.96)',
        backdropFilter: 'blur(12px)',
      }}>
        <Logo />
        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          {[
            { to: '/maps', label: 'Maps', active: true },
            { to: '/about', label: 'About', active: false },
          ].map(({ to, label, active }) => (
            <Link
              key={to}
              to={to}
              className="nav-link"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 9.5, letterSpacing: '0.2em',
                color: active ? P.ink : P.inkLt,
                textTransform: 'uppercase',
                opacity: active ? 1 : 0.75,
                position: 'relative',
              }}
            >
              {label}
              {active && (
                <span style={{
                  position: 'absolute', bottom: -3, left: 0, right: 0,
                  height: 1, background: P.gold,
                }}/>
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* ── HERO HEADER ── */}
      <header style={{
        padding: '64px 52px 52px',
        borderBottom: `1px solid ${P.rule}`,
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'end',
        gap: 40,
        opacity: vis ? 1 : 0,
        transform: vis ? 'none' : 'translateY(12px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}>
        {/* Left — title block */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <div style={{ width: 28, height: 1, background: P.gold }}/>
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 9, letterSpacing: '0.28em',
              color: P.gold, textTransform: 'uppercase',
            }}>
              The Collection
            </span>
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(44px, 5.5vw, 72px)',
            fontWeight: 700, lineHeight: 0.92,
            letterSpacing: '-0.03em', color: P.ink,
          }}>
            The{' '}
            <em style={{
              color: P.gold,
              fontStyle: 'italic',
            }}>Atlas.</em>
          </h1>
          <p style={{
            fontFamily: "'Lato', sans-serif",
            fontSize: 14, lineHeight: 1.85,
            color: P.inkMd, fontWeight: 300,
            maxWidth: 440, marginTop: 18,
          }}>
            Each map is a self-contained story — data-driven, animated,
            and built on real history. No decoration. Only truth.
          </p>
        </div>

        {/* Right — counters */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 28,
          paddingBottom: 4,
          opacity: vis ? 1 : 0,
          transition: 'opacity 0.9s ease 0.2s',
        }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 44, fontWeight: 700,
              color: P.gold, lineHeight: 1,
              letterSpacing: '-0.025em',
            }}>
              {String(LIVE_COUNT).padStart(2, '0')}
            </div>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 7.5, letterSpacing: '0.22em',
              color: P.inkLt, textTransform: 'uppercase',
              marginTop: 6,
            }}>Maps Live</div>
          </div>
          <div style={{ width: 1, height: 42, background: P.rule }}/>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 44, fontWeight: 700,
              color: P.inkLt, lineHeight: 1,
              letterSpacing: '-0.025em',
            }}>∞</div>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 7.5, letterSpacing: '0.22em',
              color: P.inkLt, textTransform: 'uppercase',
              marginTop: 6,
            }}>In Research</div>
          </div>
        </div>
      </header>

      {/* ── FILTER BAR (decorative / extensible) ── */}
      <div style={{
        padding: '20px 52px',
        borderBottom: `1px solid ${P.rule}`,
        display: 'flex', alignItems: 'center', gap: 20,
        background: P.bgAlt,
        opacity: vis ? 1 : 0,
        transition: 'opacity 0.6s ease 0.15s',
      }}>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 8, letterSpacing: '0.26em',
          color: P.inkLt, textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>All Maps</span>
        <div style={{ flex: 1, height: 1, background: P.rule }}/>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 8, letterSpacing: '0.14em',
          color: P.inkLt,
        }}>
          {LIVE_COUNT} stories published
        </span>
      </div>

      {/* ── GRID ── */}
      <section style={{ padding: '36px 52px 100px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: 20,
        }}>
          {MAPS_REGISTRY.map((map, i) => (
            <MapCard key={map.id} map={map} index={i} />
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 52px',
        borderTop: `1px solid ${P.rule}`,
        background: P.bgAlt,
      }}>
        <Logo />
        <div style={{ display: 'flex', gap: 32 }}>
          {['Mapbox', 'React', 'Real Data'].map((t, i) => (
            <span key={i} style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 8, letterSpacing: '0.16em',
              color: P.inkLt, textTransform: 'uppercase',
            }}>{t}</span>
          ))}
        </div>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 8, letterSpacing: '0.14em',
          color: P.inkLt,
        }}>
          © {new Date().getFullYear()}
        </span>
      </footer>
    </div>
  )
}

export default MapsPage