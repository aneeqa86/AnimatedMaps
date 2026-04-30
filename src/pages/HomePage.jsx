import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

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

  return (
    <div style={styles.root}>
      {/* Grid texture overlay */}
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
          <Link to="/maps" style={styles.heroBtn}>
            Enter the Atlas <span style={styles.heroBtnArrow}>→</span>
          </Link>
        </div>

        {/* Decorative coordinate lines */}
        <div style={styles.coordLine1} />
        <div style={styles.coordLine2} />
        <span style={styles.coordLabel1}>24°N 67°E</span>
        <span style={styles.coordLabel2}>25°N 51°E</span>
      </section>

      {/* DIVIDER */}
      <div style={styles.divider}>
        <span style={styles.dividerText}>Featured Map</span>
        <div style={styles.dividerLine} />
      </div>

      {/* FEATURED CARD */}
      <section style={styles.featured}>
        <Link to="/maps/pakistan-worker" style={styles.cardLink}>
          <article style={styles.card}>
            {/* Card map preview */}
            <div style={styles.cardVisual}>
              <div style={styles.cardGlobe}>
                {/* Animated pulse dots */}
                <div style={{...styles.pulse, top: '35%', left: '48%'}} />
                <div style={{...styles.pulse, top: '28%', left: '62%', animationDelay: '0.5s'}} />
                <div style={{...styles.pulse, top: '42%', left: '55%', animationDelay: '1s'}} />
                {/* Flow lines */}
                <svg style={styles.flowSvg} viewBox="0 0 400 200">
                  <path d="M 192 70 Q 250 40 310 55" stroke="#C9B88A" strokeWidth="1" fill="none" strokeDasharray="4 4" opacity="0.6">
                    <animate attributeName="stroke-dashoffset" from="100" to="0" dur="3s" repeatCount="indefinite" />
                  </path>
                  <path d="M 192 70 Q 270 20 340 35" stroke="#C9B88A" strokeWidth="0.8" fill="none" strokeDasharray="4 4" opacity="0.4">
                    <animate attributeName="stroke-dashoffset" from="100" to="0" dur="4s" repeatCount="indefinite" />
                  </path>
                  <path d="M 192 70 Q 240 60 300 70" stroke="#C9B88A" strokeWidth="0.6" fill="none" strokeDasharray="4 4" opacity="0.3">
                    <animate attributeName="stroke-dashoffset" from="100" to="0" dur="5s" repeatCount="indefinite" />
                  </path>
                </svg>
              </div>
              <div style={styles.cardTag}>Labor Day Edition</div>
            </div>

            {/* Card content */}
            <div style={styles.cardBody}>
              <div style={styles.cardMeta}>
                <span style={styles.cardMetaItem}>Pakistan → Gulf States</span>
                <span style={styles.cardMetaDot}>·</span>
                <span style={styles.cardMetaItem}>1947 – 2024</span>
              </div>
              <h2 style={styles.cardTitle}>The Pakistani Worker</h2>
              <p style={styles.cardDesc}>
                From the factory floors of Karachi to the construction 
                sites of Riyadh. A full arc of Pakistan's labor movement 
                and Gulf migration — 14 million workers, two threads, 
                one human story.
              </p>
              <div style={styles.cardStats}>
                <div style={styles.stat}>
                  <span style={styles.statNum}>14M</span>
                  <span style={styles.statLabel}>Workers Abroad</span>
                </div>
                <div style={styles.stat}>
                  <span style={styles.statNum}>$35B</span>
                  <span style={styles.statLabel}>Remittances/yr</span>
                </div>
                <div style={styles.stat}>
                  <span style={styles.statNum}>77yr</span>
                  <span style={styles.statLabel}>Of History</span>
                </div>
              </div>
              <div style={styles.cardCta}>
                View Map <span>→</span>
              </div>
            </div>
          </article>
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <span style={styles.footerText}>Animated Maps © 2025</span>
        <span style={styles.footerText}>Built with Mapbox · React · Real Data</span>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Mono:wght@300;400;500&family=Lato:wght@300;400;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(3); opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }

        a { text-decoration: none; color: inherit; }

        .card-hover:hover { border-color: #C9B88A !important; }
        .card-hover:hover .card-cta { color: #C9B88A !important; }
        .nav-link-hover:hover { color: #C9B88A !important; }
        .hero-btn:hover { background: #C9B88A !important; color: #0D0D0D !important; }
      `}</style>
    </div>
  )
}

const styles = {
  root: {
    background: '#0D0D0D',
    minHeight: '100vh',
    fontFamily: "'Lato', sans-serif",
    color: '#E8E0D0',
    overflowX: 'hidden',
    position: 'relative',
  },
  gridOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(201,184,138,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,184,138,0.04) 1px, transparent 1px)
    `,
    backgroundSize: '60px 60px',
    pointerEvents: 'none',
    zIndex: 0,
  },
  grainOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
    pointerEvents: 'none',
    zIndex: 0,
    opacity: 0.4,
  },
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '28px 48px',
    background: 'linear-gradient(to bottom, rgba(13,13,13,0.95), transparent)',
  },
  navLogo: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '11px',
    letterSpacing: '0.2em',
    color: '#C9B88A',
    lineHeight: 1.4,
    fontWeight: 500,
  },
  navLinks: {
    display: 'flex',
    gap: '40px',
  },
  navLink: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '11px',
    letterSpacing: '0.15em',
    color: '#888',
    transition: 'color 0.2s',
    textTransform: 'uppercase',
  },
  hero: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    padding: '0 48px',
    zIndex: 1,
    overflow: 'hidden',
  },
  heroInner: {
    maxWidth: '700px',
    animation: 'fadeUp 1.2s ease forwards',
  },
  heroEyebrow: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '12px',
    letterSpacing: '0.2em',
    color: '#C9B88A',
    marginBottom: '32px',
    opacity: 0.8,
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(64px, 9vw, 120px)',
    fontWeight: 900,
    lineHeight: 0.95,
    color: '#E8E0D0',
    marginBottom: '32px',
    letterSpacing: '-0.02em',
  },
  heroTitleAccent: {
    color: '#C9B88A',
    fontStyle: 'italic',
  },
  heroSub: {
    fontFamily: "'Lato', sans-serif",
    fontSize: '16px',
    lineHeight: 1.8,
    color: '#888',
    fontWeight: 300,
    marginBottom: '48px',
    maxWidth: '480px',
  },
  heroBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 36px',
    border: '1px solid #C9B88A',
    color: '#C9B88A',
    fontFamily: "'DM Mono', monospace",
    fontSize: '12px',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    transition: 'all 0.3s',
    background: 'transparent',
    cursor: 'pointer',
  },
  heroBtnArrow: { fontSize: '16px' },
  coordLine1: {
    position: 'absolute',
    top: '20%',
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(201,184,138,0.15), transparent)',
  },
  coordLine2: {
    position: 'absolute',
    top: '75%',
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(201,184,138,0.1), transparent)',
  },
  coordLabel1: {
    position: 'absolute',
    top: 'calc(20% - 20px)',
    right: '48px',
    fontFamily: "'DM Mono', monospace",
    fontSize: '10px',
    color: 'rgba(201,184,138,0.4)',
    letterSpacing: '0.1em',
  },
  coordLabel2: {
    position: 'absolute',
    top: 'calc(75% - 20px)',
    right: '48px',
    fontFamily: "'DM Mono', monospace",
    fontSize: '10px',
    color: 'rgba(201,184,138,0.3)',
    letterSpacing: '0.1em',
  },
  divider: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    padding: '0 48px',
    marginBottom: '48px',
  },
  dividerText: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '10px',
    letterSpacing: '0.25em',
    color: '#555',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'linear-gradient(90deg, #333, transparent)',
  },
  featured: {
    position: 'relative',
    zIndex: 1,
    padding: '0 48px 120px',
  },
  cardLink: { display: 'block' },
  card: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    border: '1px solid #222',
    transition: 'border-color 0.3s',
    cursor: 'pointer',
  },
  cardVisual: {
    position: 'relative',
    background: '#111',
    minHeight: '420px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardGlobe: {
    position: 'relative',
    width: '100%',
    height: '100%',
    background: 'radial-gradient(ellipse at 48% 35%, #1a1a0e 0%, #0D0D0D 70%)',
  },
  flowSvg: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
  },
  pulse: {
    position: 'absolute',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#C9B88A',
    transform: 'translate(-50%, -50%)',
  },
  cardTag: {
    position: 'absolute',
    top: '24px',
    left: '24px',
    fontFamily: "'DM Mono', monospace",
    fontSize: '9px',
    letterSpacing: '0.2em',
    color: '#8B1A1A',
    border: '1px solid #8B1A1A',
    padding: '6px 12px',
    textTransform: 'uppercase',
  },
  cardBody: {
    padding: '56px 48px',
    background: '#0f0f0f',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '20px',
  },
  cardMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  cardMetaItem: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '10px',
    letterSpacing: '0.15em',
    color: '#555',
    textTransform: 'uppercase',
  },
  cardMetaDot: { color: '#333' },
  cardTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(32px, 3.5vw, 52px)',
    fontWeight: 700,
    lineHeight: 1.1,
    color: '#E8E0D0',
    letterSpacing: '-0.02em',
  },
  cardDesc: {
    fontFamily: "'Lato', sans-serif",
    fontSize: '15px',
    lineHeight: 1.85,
    color: '#666',
    fontWeight: 300,
  },
  cardStats: {
    display: 'flex',
    gap: '32px',
    paddingTop: '8px',
    borderTop: '1px solid #1a1a1a',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statNum: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '28px',
    fontWeight: 700,
    color: '#C9B88A',
    lineHeight: 1,
  },
  statLabel: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '9px',
    letterSpacing: '0.15em',
    color: '#444',
    textTransform: 'uppercase',
  },
  cardCta: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '11px',
    letterSpacing: '0.15em',
    color: '#555',
    textTransform: 'uppercase',
    transition: 'color 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  footer: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    padding: '24px 48px',
    borderTop: '1px solid #1a1a1a',
  },
  footerText: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '10px',
    letterSpacing: '0.15em',
    color: '#333',
    textTransform: 'uppercase',
  },
}

export default HomePage