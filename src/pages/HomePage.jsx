import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { MAPS_REGISTRY, LIVE_COUNT } from '@/data/mapsRegistry'

const HomePage = () => {
  const heroRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollY = window.scrollY
        heroRef.current.style.transform = `translateY(${scrollY * 0.4}px)`
        heroRef.current.style.opacity = 1 - scrollY / 600
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const liveMaps = MAPS_REGISTRY.filter(m => m.status === 'live')
  const countLabel = `${LIVE_COUNT} map${LIVE_COUNT !== 1 ? 's' : ''} · more coming`

  return (
    <div style={styles.root}>
      <div style={styles.heroGlow} />
      <div style={styles.gridOverlay} />
      <div style={styles.grainOverlay} />

      {/* NAV */}
      <nav style={styles.nav}>
        <span style={styles.navLogo}>ANIMATED<br />MAPS</span>
        <div style={styles.navLinks}>
          <Link to="/maps" style={styles.navLink}>Maps</Link>
          <Link to="/about" style={styles.navLink}>About</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={styles.hero}>
        <div ref={heroRef} style={styles.heroInner}>
          <p style={styles.heroEyebrow}>— A Living Atlas</p>
          <h1 style={styles.heroTitle}>
            Stories<br />
            <span style={styles.heroTitleAccent}>Written</span><br />
            in Motion
          </h1>
          <p style={styles.heroSub}>
            Data-driven narratives told through maps, movement, and time.<br />
            Each map is a journey. Each journey is human.
          </p>
          <Link to="/maps" style={styles.heroBtn} className="hero-btn">
            Enter the Atlas <span style={styles.heroBtnArrow}>→</span>
          </Link>
        </div>

        <div style={styles.coordLine1} />
        <div style={styles.coordLine2} />
        <span style={styles.coordLabel1}>24°N 67°E</span>
        <span style={styles.coordLabel2}>25°N 51°E</span>

        <div style={styles.scrollHint}>
          <div style={styles.scrollLine} />
          <span style={styles.scrollText}>Scroll</span>
        </div>
      </section>

      {/* MAPS STRIP — driven entirely by MAPS_REGISTRY */}
      <section style={styles.mapsStrip}>
        <div style={styles.stripHeader}>
          <span style={styles.stripLabel}>The Atlas</span>
          <div style={styles.stripRule} />
          <span style={styles.stripCount}>{countLabel}</span>
        </div>

        {liveMaps.map((map, i) => (
          <Link key={map.id} to={map.path} style={styles.mapRow} className="map-row">
            <div style={styles.mapRowLeft}>
              <span style={styles.mapRowNum}>{String(i + 1).padStart(2, '0')}</span>
              <div style={styles.mapRowInfo}>
                <h2 style={styles.mapRowTitle}>{map.title}</h2>
                <p style={styles.mapRowMeta}>{map.eyebrow} · {map.year}</p>
              </div>
            </div>
            <div style={styles.mapRowRight}>
              <div style={styles.miniPreview}>
                <svg style={styles.miniSvg} viewBox="0 0 160 80">
                  <circle cx="50" cy="40" r="3" fill="#C9B88A" opacity="0.7" />
                  <circle cx="120" cy="30" r="2" fill={map.tagColor || '#C9B88A'} opacity="0.6" />
                  <path d="M 50 40 Q 85 15 120 30" stroke="#C9B88A" strokeWidth="1"
                    fill="none" strokeDasharray="3 3" opacity="0.5">
                    <animate attributeName="stroke-dashoffset" from="60" to="0" dur="3s" repeatCount="indefinite" />
                  </path>
                </svg>
              </div>
              <div style={styles.mapRowTags}>
                {(map.stats || []).slice(0, 2).map((s, si) => {
                  const label = typeof s === 'object' ? `${s.value} ${s.label}` : s
                  return (
                    <span key={si} style={styles.tag}>{label}</span>
                  )
                })}
              </div>
              <span style={styles.mapRowArrow}>→</span>
            </div>
          </Link>
        ))}

        {/* Coming soon — always one upcoming slot */}
        <div style={styles.mapRowDim}>
          <span style={styles.mapRowNum}>{String(liveMaps.length + 1).padStart(2, '0')}</span>
          <div style={styles.mapRowInfo}>
            <h2 style={{ ...styles.mapRowTitle, color: '#2a2a25' }}>Coming Soon</h2>
            <p style={{ ...styles.mapRowMeta, color: '#2a2a25' }}>Next story in progress</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <span style={styles.footerText}>Animated Maps © 2025</span>
        <span style={styles.footerText}>Built with Mapbox · React · Real Data</span>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Mono:wght@300;400;500&family=Lato:wght@300;400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          50% { opacity: 0.8; transform: scaleY(1.4); }
        }
        a { text-decoration: none; color: inherit; }
        .hero-btn:hover { background: #C9B88A !important; color: #12110E !important; }
        .map-row:hover { background: rgba(201,184,138,0.04) !important; }
        .map-row:hover h2 { color: #C9B88A !important; }
      `}</style>
    </div>
  )
}

const styles = {
  root: {
    background: '#12110E', minHeight: '100vh',
    fontFamily: "'Lato', sans-serif", color: '#E8E0D0',
    overflowX: 'hidden', position: 'relative',
  },
  heroGlow: {
    position: 'fixed', top: '-10%', left: '-10%', width: '70%', height: '70%',
    background: 'radial-gradient(ellipse at 30% 30%, rgba(201,184,138,0.045) 0%, transparent 65%)',
    pointerEvents: 'none', zIndex: 0,
  },
  gridOverlay: {
    position: 'fixed', inset: 0,
    backgroundImage: `
      linear-gradient(rgba(201,184,138,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,184,138,0.035) 1px, transparent 1px)
    `,
    backgroundSize: '60px 60px', pointerEvents: 'none', zIndex: 0,
  },
  grainOverlay: {
    position: 'fixed', inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
    pointerEvents: 'none', zIndex: 0, opacity: 0.4,
  },
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    padding: '28px 48px',
    background: 'linear-gradient(to bottom, rgba(18,17,14,0.97), transparent)',
  },
  navLogo: {
    fontFamily: "'DM Mono', monospace", fontSize: '11px',
    letterSpacing: '0.2em', color: '#C9B88A', lineHeight: 1.4, fontWeight: 500,
  },
  navLinks: { display: 'flex', gap: '40px' },
  navLink: {
    fontFamily: "'DM Mono', monospace", fontSize: '11px',
    letterSpacing: '0.15em', color: '#666', transition: 'color 0.2s', textTransform: 'uppercase',
  },
  hero: {
    position: 'relative', minHeight: '100vh',
    display: 'flex', alignItems: 'center',
    padding: '0 48px', zIndex: 1, overflow: 'hidden',
  },
  heroInner: { maxWidth: '700px', animation: 'fadeUp 1.2s ease forwards' },
  heroEyebrow: {
    fontFamily: "'DM Mono', monospace", fontSize: '12px',
    letterSpacing: '0.2em', color: '#C9B88A', marginBottom: '32px', opacity: 0.8,
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(64px, 9vw, 120px)', fontWeight: 900,
    lineHeight: 0.95, color: '#EDE5D4', marginBottom: '32px', letterSpacing: '-0.02em',
  },
  heroTitleAccent: { color: '#C9B88A', fontStyle: 'italic' },
  heroSub: {
    fontFamily: "'Lato', sans-serif", fontSize: '16px',
    lineHeight: 1.8, color: '#7a7469', fontWeight: 300,
    marginBottom: '48px', maxWidth: '480px',
  },
  heroBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '12px',
    padding: '16px 36px', border: '1px solid rgba(201,184,138,0.6)',
    color: '#C9B88A', fontFamily: "'DM Mono', monospace", fontSize: '12px',
    letterSpacing: '0.15em', textTransform: 'uppercase',
    transition: 'all 0.3s', background: 'transparent', cursor: 'pointer',
  },
  heroBtnArrow: { fontSize: '16px' },
  coordLine1: {
    position: 'absolute', top: '20%', left: 0, right: 0, height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(201,184,138,0.1), transparent)',
  },
  coordLine2: {
    position: 'absolute', top: '75%', left: 0, right: 0, height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(201,184,138,0.07), transparent)',
  },
  coordLabel1: {
    position: 'absolute', top: 'calc(20% - 20px)', right: '48px',
    fontFamily: "'DM Mono', monospace", fontSize: '10px',
    color: 'rgba(201,184,138,0.3)', letterSpacing: '0.1em',
  },
  coordLabel2: {
    position: 'absolute', top: 'calc(75% - 20px)', right: '48px',
    fontFamily: "'DM Mono', monospace", fontSize: '10px',
    color: 'rgba(201,184,138,0.2)', letterSpacing: '0.1em',
  },
  scrollHint: {
    position: 'absolute', bottom: '40px', left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
  },
  scrollLine: {
    width: '1px', height: '40px', background: 'rgba(201,184,138,0.3)',
    animation: 'scrollPulse 2s ease-in-out infinite', transformOrigin: 'top',
  },
  scrollText: {
    fontFamily: "'DM Mono', monospace", fontSize: '9px',
    letterSpacing: '0.2em', color: 'rgba(201,184,138,0.3)', textTransform: 'uppercase',
  },
  mapsStrip: { position: 'relative', zIndex: 1, padding: '80px 48px 120px' },
  stripHeader: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '48px' },
  stripLabel: {
    fontFamily: "'DM Mono', monospace", fontSize: '10px',
    letterSpacing: '0.25em', color: '#4a4840', textTransform: 'uppercase', whiteSpace: 'nowrap',
  },
  stripRule: { flex: 1, height: '1px', background: 'linear-gradient(90deg, #2a2820, transparent)' },
  stripCount: {
    fontFamily: "'DM Mono', monospace", fontSize: '10px',
    letterSpacing: '0.15em', color: '#3a3830', whiteSpace: 'nowrap',
  },
  mapRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '28px 12px', borderTop: '1px solid #1e1d19',
    cursor: 'pointer', transition: 'background 0.2s', borderRadius: '2px',
    marginLeft: '-12px', marginRight: '-12px',
  },
  mapRowDim: {
    display: 'flex', alignItems: 'center', gap: '32px',
    padding: '28px 12px', borderTop: '1px solid #1a1916', opacity: 0.4,
  },
  mapRowLeft: { display: 'flex', alignItems: 'center', gap: '32px' },
  mapRowRight: { display: 'flex', alignItems: 'center', gap: '24px' },
  mapRowNum: {
    fontFamily: "'DM Mono', monospace", fontSize: '11px',
    color: '#3a3830', letterSpacing: '0.1em', minWidth: '24px',
  },
  mapRowInfo: { display: 'flex', flexDirection: 'column', gap: '6px' },
  mapRowTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(22px, 2.5vw, 34px)', fontWeight: 700,
    color: '#EDE5D4', letterSpacing: '-0.01em', lineHeight: 1, transition: 'color 0.2s',
  },
  mapRowMeta: {
    fontFamily: "'DM Mono', monospace", fontSize: '10px',
    letterSpacing: '0.15em', color: '#4a4840', textTransform: 'uppercase',
  },
  miniPreview: {
    width: '120px', height: '56px',
    background: 'rgba(201,184,138,0.03)', border: '1px solid #1e1d19',
    borderRadius: '2px', overflow: 'hidden', flexShrink: 0,
  },
  miniSvg: { width: '100%', height: '100%' },
  mapRowTags: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  tag: {
    fontFamily: "'DM Mono', monospace", fontSize: '9px',
    letterSpacing: '0.15em', color: '#C9B88A',
    border: '1px solid rgba(201,184,138,0.2)', padding: '3px 8px',
    textTransform: 'uppercase', borderRadius: '1px',
  },
  mapRowArrow: {
    fontFamily: "'DM Mono', monospace", fontSize: '18px',
    color: '#3a3830', transition: 'color 0.2s, transform 0.2s', display: 'inline-block',
  },
  footer: {
    position: 'relative', zIndex: 1,
    display: 'flex', justifyContent: 'space-between',
    padding: '24px 48px', borderTop: '1px solid #1a1916',
  },
  footerText: {
    fontFamily: "'DM Mono', monospace", fontSize: '10px',
    letterSpacing: '0.15em', color: '#2e2c28', textTransform: 'uppercase',
  },
}

export default HomePage