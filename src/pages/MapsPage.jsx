import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const maps = [
  {
    id: 'pakistan-worker',
    title: 'The Pakistani Worker',
    eyebrow: 'Pakistan → Gulf States',
    year: '1947 – 2024',
    tag: 'Labor Day Edition',
    tagColor: '#8B1A1A',
    desc: 'From factory floors of Karachi to construction sites of Riyadh. 14 million workers, two threads, one human story.',
    stats: ['14M Workers', '$35B Remittances', '77yr Arc'],
    status: 'live',
    path: '/maps/pakistan-worker',
  },
  {
    id: 'coming-soon-1',
    title: 'Coming Soon',
    eyebrow: 'Next Map',
    year: '—',
    tag: 'In Production',
    tagColor: '#333',
    desc: 'The next animated map is in research and production.',
    stats: [],
    status: 'soon',
    path: null,
  },
]

const MapsPage = () => {
  const [hovered, setHovered] = useState(null)

  return (
    <div style={styles.root}>
      <div style={styles.gridOverlay} />

      {/* NAV */}
      <nav style={styles.nav}>
        <Link to="/" style={styles.navLogo}>ANIMATED<br />MAPS</Link>
        <div style={styles.navLinks}>
          <Link to="/maps" style={{...styles.navLink, color: '#C9B88A'}}>Maps</Link>
          <Link to="/about" style={styles.navLink}>About</Link>
        </div>
      </nav>

      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <p style={styles.eyebrow}>— The Collection</p>
          <h1 style={styles.title}>The Atlas</h1>
          <p style={styles.subtitle}>
            Each map is a self-contained story. Data-driven, animated, built on real history.
          </p>
        </div>
        <div style={styles.headerMeta}>
          <div style={styles.metaItem}>
            <span style={styles.metaNum}>01</span>
            <span style={styles.metaLabel}>Maps Live</span>
          </div>
          <div style={styles.metaDivider} />
          <div style={styles.metaItem}>
            <span style={styles.metaNum}>∞</span>
            <span style={styles.metaLabel}>In Research</span>
          </div>
        </div>
      </header>

      {/* DIVIDER */}
      <div style={styles.divider}>
        <div style={styles.dividerLine} />
        <span style={styles.dividerText}>All Maps</span>
        <div style={styles.dividerLine} />
      </div>

      {/* MAPS GRID */}
      <section style={styles.grid}>
        {maps.map((map, i) => (
          <MapCard
            key={map.id}
            map={map}
            index={i}
            hovered={hovered === map.id}
            onHover={() => setHovered(map.id)}
            onLeave={() => setHovered(null)}
          />
        ))}
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <span style={styles.footerText}>Animated Maps © 2025</span>
        <span style={styles.footerText}>Built with Mapbox · React · Real Data</span>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Mono:wght@300;400;500&family=Lato:wght@300;400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

const MapCard = ({ map, index, hovered, onHover, onLeave }) => {
  const isLive = map.status === 'live'

  const card = (
    <article
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        ...styles.card,
        borderColor: hovered ? '#C9B88A' : '#1e1e1e',
        opacity: 1,
        animation: `fadeUp 0.6s ease ${index * 0.15}s both`,
        cursor: isLive ? 'pointer' : 'default',
      }}
    >
      {/* Visual panel */}
      <div style={styles.cardVisual}>
        <div style={{
          ...styles.cardBg,
          background: isLive
            ? 'radial-gradient(ellipse at 40% 40%, #1a1a0e 0%, #0a0a0a 100%)'
            : 'radial-gradient(ellipse at 40% 40%, #111 0%, #0a0a0a 100%)',
        }}>
          {isLive && (
            <svg style={styles.flowSvg} viewBox="0 0 400 220">
              <path d="M 140 110 Q 220 60 310 75" stroke="#C9B88A" strokeWidth="1"
                fill="none" strokeDasharray="5 5" opacity="0.5">
                <animate attributeName="stroke-dashoffset" from="100" to="0" dur="3s" repeatCount="indefinite" />
              </path>
              <path d="M 140 110 Q 240 40 330 50" stroke="#C9B88A" strokeWidth="0.7"
                fill="none" strokeDasharray="5 5" opacity="0.3">
                <animate attributeName="stroke-dashoffset" from="100" to="0" dur="4.5s" repeatCount="indefinite" />
              </path>
              <circle cx="140" cy="110" r="4" fill="#C9B88A" opacity="0.9" />
              <circle cx="310" cy="75" r="3" fill="#C9B88A" opacity="0.7">
                <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="330" cy="50" r="2.5" fill="#C9B88A" opacity="0.5">
                <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2.5s" repeatCount="indefinite" />
              </circle>
            </svg>
          )}
          {!isLive && (
            <span style={styles.comingSoonIcon}>◎</span>
          )}
        </div>

        {/* Tag */}
        <div style={{...styles.cardTag, borderColor: map.tagColor, color: map.tagColor}}>
          {map.tag}
        </div>

        {/* Live indicator */}
        {isLive && (
          <div style={styles.liveIndicator}>
            <span style={styles.liveDot} />
            <span style={styles.liveText}>Live</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={styles.cardContent}>
        <div style={styles.cardMeta}>
          <span style={styles.cardMetaText}>{map.eyebrow}</span>
          <span style={styles.cardMetaDot}>·</span>
          <span style={styles.cardMetaText}>{map.year}</span>
        </div>

        <h2 style={{
          ...styles.cardTitle,
          color: hovered && isLive ? '#C9B88A' : '#E8E0D0',
        }}>
          {map.title}
        </h2>

        <p style={styles.cardDesc}>{map.desc}</p>

        {map.stats.length > 0 && (
          <div style={styles.cardTags}>
            {map.stats.map((s) => (
              <span key={s} style={styles.statTag}>{s}</span>
            ))}
          </div>
        )}

        {isLive && (
          <div style={{
            ...styles.cardCta,
            color: hovered ? '#C9B88A' : '#444',
          }}>
            View Map →
          </div>
        )}
      </div>
    </article>
  )

  return isLive ? <Link to={map.path} style={{display: 'block'}}>{card}</Link> : card
}

const styles = {
  root: {
    background: '#0D0D0D',
    minHeight: '100vh',
    fontFamily: "'Lato', sans-serif",
    color: '#E8E0D0',
    overflowX: 'hidden',
  },
  gridOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(201,184,138,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,184,138,0.03) 1px, transparent 1px)
    `,
    backgroundSize: '60px 60px',
    pointerEvents: 'none',
    zIndex: 0,
  },
  nav: {
    position: 'fixed',
    top: 0, left: 0, right: 0,
    zIndex: 100,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '28px 48px',
    background: 'linear-gradient(to bottom, rgba(13,13,13,0.98), transparent)',
  },
  navLogo: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '11px',
    letterSpacing: '0.2em',
    color: '#C9B88A',
    lineHeight: 1.4,
    fontWeight: 500,
  },
  navLinks: { display: 'flex', gap: '40px' },
  navLink: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '11px',
    letterSpacing: '0.15em',
    color: '#555',
    textTransform: 'uppercase',
    transition: 'color 0.2s',
  },
  header: {
    position: 'relative',
    zIndex: 1,
    padding: '160px 48px 80px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottom: '1px solid #1a1a1a',
  },
  headerInner: { maxWidth: '600px' },
  eyebrow: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '12px',
    letterSpacing: '0.2em',
    color: '#C9B88A',
    marginBottom: '24px',
    opacity: 0.8,
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(56px, 7vw, 96px)',
    fontWeight: 900,
    lineHeight: 0.95,
    color: '#E8E0D0',
    letterSpacing: '-0.02em',
    marginBottom: '24px',
  },
  subtitle: {
    fontFamily: "'Lato', sans-serif",
    fontSize: '15px',
    lineHeight: 1.8,
    color: '#555',
    fontWeight: 300,
  },
  headerMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
    paddingBottom: '8px',
  },
  metaItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  metaNum: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '40px',
    fontWeight: 700,
    color: '#C9B88A',
    lineHeight: 1,
  },
  metaLabel: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '9px',
    letterSpacing: '0.2em',
    color: '#444',
    textTransform: 'uppercase',
  },
  metaDivider: {
    width: '1px',
    height: '48px',
    background: '#222',
  },
  divider: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '40px 48px',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: '#1a1a1a',
  },
  dividerText: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '10px',
    letterSpacing: '0.25em',
    color: '#333',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  },
  grid: {
    position: 'relative',
    zIndex: 1,
    padding: '0 48px 120px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(560px, 1fr))',
    gap: '2px',
  },
  card: {
    border: '1px solid #1e1e1e',
    transition: 'border-color 0.3s',
    background: '#0a0a0a',
    display: 'flex',
    flexDirection: 'column',
  },
  cardVisual: {
    position: 'relative',
    height: '280px',
    overflow: 'hidden',
  },
  cardBg: {
    position: 'absolute',
    inset: 0,
    transition: 'background 0.3s',
  },
  flowSvg: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
  },
  comingSoonIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '48px',
    color: '#222',
    fontFamily: "'DM Mono', monospace",
  },
  cardTag: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    fontFamily: "'DM Mono', monospace",
    fontSize: '9px',
    letterSpacing: '0.2em',
    border: '1px solid',
    padding: '5px 10px',
    textTransform: 'uppercase',
  },
  liveIndicator: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  liveDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#4ade80',
    boxShadow: '0 0 8px #4ade80',
  },
  liveText: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '9px',
    letterSpacing: '0.15em',
    color: '#4ade80',
    textTransform: 'uppercase',
  },
  cardContent: {
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  cardMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  cardMetaText: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '10px',
    letterSpacing: '0.12em',
    color: '#444',
    textTransform: 'uppercase',
  },
  cardMetaDot: { color: '#2a2a2a' },
  cardTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(24px, 2.5vw, 36px)',
    fontWeight: 700,
    lineHeight: 1.15,
    letterSpacing: '-0.01em',
    transition: 'color 0.3s',
  },
  cardDesc: {
    fontFamily: "'Lato', sans-serif",
    fontSize: '14px',
    lineHeight: 1.8,
    color: '#555',
    fontWeight: 300,
  },
  cardTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  statTag: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '9px',
    letterSpacing: '0.12em',
    color: '#C9B88A',
    border: '1px solid #2a2a1a',
    padding: '4px 10px',
    textTransform: 'uppercase',
  },
  cardCta: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '11px',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    transition: 'color 0.3s',
    marginTop: '8px',
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

export default MapsPage