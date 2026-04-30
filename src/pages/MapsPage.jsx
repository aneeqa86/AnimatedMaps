import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { MAPS_REGISTRY, LIVE_COUNT } from '@/data/mapsRegistry'

// ─── MapCard ──────────────────────────────────────────────────────────────────
const MapCard = ({ map, index, hovered, onHover, onLeave }) => {
  const isLive = map.status === 'live'
  const { Visual, cardBg, hoverBorderColor } = map

  const card = (
    <article
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        ...S.card,
        background: cardBg,
        borderColor: hovered ? hoverBorderColor : '#161616',
        animation: `fadeUp 0.5s ease ${index * 0.1}s both`,
        cursor: isLive ? 'pointer' : 'default',
      }}
    >
      {/* Visual */}
      <div style={S.cardVisual}>
        <div style={{ position: 'absolute', inset: 0, background: cardBg }}/>

        {Visual && <Visual />}

        {!isLive && (
          <div style={S.comingSoon}>
            <span style={S.comingSoonGlyph}>◎</span>
          </div>
        )}

        {/* Bottom fade */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `linear-gradient(to top, ${cardBg} 0%, transparent 60%)`,
        }}/>

        <div style={{ ...S.cardTag, borderColor: map.tagColor, color: map.tagColor }}>
          {map.tag}
        </div>

        {isLive && (
          <div style={S.liveBadge}>
            <span style={S.liveDot}/>
            <span style={S.liveLabel}>Live</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ ...S.cardContent, background: cardBg }}>
        <div style={S.cardMeta}>
          <span style={S.cardEyebrow}>{map.eyebrow}</span>
          <span style={S.dot}>·</span>
          <span style={S.cardEyebrow}>{map.year}</span>
        </div>

        <h2 style={{ ...S.cardTitle, color: hovered && isLive ? '#C9B88A' : '#E8E0D0' }}>
          {map.title}
        </h2>

        <p style={S.cardDesc}>{map.desc}</p>

        {map.stats.length > 0 && (
          <div style={S.statRow}>
            {map.stats.map(s => (
              <span key={s} style={{
                ...S.statTag,
                borderColor: hovered && isLive ? `${hoverBorderColor}55` : '#1e1e1e',
                color: hovered && isLive ? '#C9B88A' : '#444',
                transition: 'border-color 0.3s, color 0.3s',
              }}>
                {s}
              </span>
            ))}
          </div>
        )}

        {isLive && (
          <div style={{ ...S.cardCta, color: hovered ? '#C9B88A' : '#2e2e2e' }}>
            <span>View Map</span>
            <span style={{
              display: 'inline-block',
              transform: hovered ? 'translateX(5px)' : 'translateX(0)',
              transition: 'transform 0.3s ease',
            }}>→</span>
          </div>
        )}
      </div>
    </article>
  )

  return isLive
    ? <Link to={map.path} style={{ display: 'block', textDecoration: 'none' }}>{card}</Link>
    : card
}

// ─── MapsPage ─────────────────────────────────────────────────────────────────
const MapsPage = () => {
  const [hovered, setHovered] = useState(null)

  return (
    <div style={S.root}>
      <div style={S.gridOverlay}/>

      <nav style={S.nav}>
        <Link to="/" style={S.navLogo}>ANIMATED<br/>MAPS</Link>
        <div style={S.navLinks}>
          <Link to="/maps" style={{ ...S.navLink, color: '#C9B88A' }}>Maps</Link>
          <Link to="/about" style={S.navLink}>About</Link>
        </div>
      </nav>

      <header style={S.header}>
        <div style={S.headerInner}>
          <p style={S.eyebrow}>— The Collection</p>
          <h1 style={S.title}>The Atlas</h1>
          <p style={S.subtitle}>
            Each map is a self-contained story. Data-driven, animated, built on real history.
          </p>
        </div>
        <div style={S.headerMeta}>
          <div style={S.metaItem}>
            <span style={S.metaNum}>{String(LIVE_COUNT).padStart(2, '0')}</span>
            <span style={S.metaLabel}>Maps Live</span>
          </div>
          <div style={S.metaDivider}/>
          <div style={S.metaItem}>
            <span style={S.metaNum}>∞</span>
            <span style={S.metaLabel}>In Research</span>
          </div>
        </div>
      </header>

      <div style={S.divider}>
        <div style={S.dividerLine}/>
        <span style={S.dividerText}>All Maps</span>
        <div style={S.dividerLine}/>
      </div>

      <section style={S.grid}>
        {MAPS_REGISTRY.map((map, i) => (
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

      <footer style={S.footer}>
        <span style={S.footerText}>Animated Maps © 2025</span>
        <span style={S.footerText}>Built with Mapbox · React · Real Data</span>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Mono:wght@300;400;500&family=Lato:wght@300;400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  root: {
    background: '#080808', minHeight: '100vh',
    fontFamily: "'Lato', sans-serif", color: '#E8E0D0', overflowX: 'hidden',
  },
  gridOverlay: {
    position: 'fixed', inset: 0,
    backgroundImage: `
      linear-gradient(rgba(201,184,138,0.022) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,184,138,0.022) 1px, transparent 1px)
    `,
    backgroundSize: '60px 60px', pointerEvents: 'none', zIndex: 0,
  },
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    padding: '28px 48px',
    background: 'linear-gradient(to bottom, rgba(8,8,8,0.98), transparent)',
  },
  navLogo: {
    fontFamily: "'DM Mono', monospace", fontSize: '11px',
    letterSpacing: '0.2em', color: '#C9B88A', lineHeight: 1.4, fontWeight: 500,
  },
  navLinks: { display: 'flex', gap: '40px' },
  navLink: {
    fontFamily: "'DM Mono', monospace", fontSize: '11px',
    letterSpacing: '0.15em', color: '#3a3a3a',
    textTransform: 'uppercase', transition: 'color 0.2s',
  },
  header: {
    position: 'relative', zIndex: 1,
    padding: '160px 48px 80px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
    borderBottom: '1px solid #111',
  },
  headerInner: { maxWidth: '580px' },
  eyebrow: {
    fontFamily: "'DM Mono', monospace", fontSize: '12px',
    letterSpacing: '0.2em', color: '#C9B88A', marginBottom: '24px', opacity: 0.7,
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(52px, 7vw, 92px)', fontWeight: 900,
    lineHeight: 0.95, color: '#E8E0D0',
    letterSpacing: '-0.02em', marginBottom: '24px',
  },
  subtitle: {
    fontFamily: "'Lato', sans-serif",
    fontSize: '14px', lineHeight: 1.85, color: '#3a3a3a', fontWeight: 300,
  },
  headerMeta: {
    display: 'flex', alignItems: 'center', gap: '32px', paddingBottom: '8px',
  },
  metaItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' },
  metaNum: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '40px', fontWeight: 700, color: '#C9B88A', lineHeight: 1,
  },
  metaLabel: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '9px', letterSpacing: '0.2em', color: '#2a2a2a', textTransform: 'uppercase',
  },
  metaDivider: { width: '1px', height: '48px', background: '#181818' },
  divider: {
    position: 'relative', zIndex: 1,
    display: 'flex', alignItems: 'center', gap: '20px', padding: '40px 48px',
  },
  dividerLine: { flex: 1, height: '1px', background: '#111' },
  dividerText: {
    fontFamily: "'DM Mono', monospace", fontSize: '9px',
    letterSpacing: '0.28em', color: '#222',
    textTransform: 'uppercase', whiteSpace: 'nowrap',
  },
  grid: {
    position: 'relative', zIndex: 1,
    padding: '0 48px 120px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
    gap: '1px', background: '#111',
  },
  card: {
    border: '1px solid #161616',
    display: 'flex', flexDirection: 'column',
    transition: 'border-color 0.35s ease',
    position: 'relative',
  },
  cardVisual: {
    position: 'relative', height: '280px', overflow: 'hidden',
  },
  comingSoon: {
    position: 'absolute', inset: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  comingSoonGlyph: {
    fontSize: '36px', color: '#1a1a1a', fontFamily: "'DM Mono', monospace",
  },
  cardTag: {
    position: 'absolute', top: '20px', left: '20px',
    fontFamily: "'DM Mono', monospace",
    fontSize: '8px', letterSpacing: '0.2em',
    border: '1px solid', padding: '4px 10px', textTransform: 'uppercase',
  },
  liveBadge: {
    position: 'absolute', top: '20px', right: '20px',
    display: 'flex', alignItems: 'center', gap: '5px',
  },
  liveDot: {
    width: '5px', height: '5px', borderRadius: '50%',
    background: '#4ade80', boxShadow: '0 0 6px #4ade80', display: 'inline-block',
  },
  liveLabel: {
    fontFamily: "'DM Mono', monospace", fontSize: '8px',
    letterSpacing: '0.15em', color: '#4ade80', textTransform: 'uppercase',
  },
  cardContent: {
    padding: '24px 28px 28px',
    display: 'flex', flexDirection: 'column', gap: '13px', flex: 1,
  },
  cardMeta: { display: 'flex', alignItems: 'center', gap: '8px' },
  cardEyebrow: {
    fontFamily: "'DM Mono', monospace", fontSize: '9px',
    letterSpacing: '0.12em', color: '#2e2e2e', textTransform: 'uppercase',
  },
  dot: { color: '#1e1e1e', fontSize: '10px' },
  cardTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(22px, 2.5vw, 34px)', fontWeight: 700,
    lineHeight: 1.12, letterSpacing: '-0.01em', transition: 'color 0.3s ease',
  },
  cardDesc: {
    fontFamily: "'Lato', sans-serif",
    fontSize: '13px', lineHeight: 1.85, color: '#3a3a3a', fontWeight: 300,
  },
  statRow: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  statTag: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '8px', letterSpacing: '0.12em',
    border: '1px solid', padding: '3px 9px', textTransform: 'uppercase',
  },
  cardCta: {
    fontFamily: "'DM Mono', monospace", fontSize: '10px',
    letterSpacing: '0.15em', textTransform: 'uppercase',
    transition: 'color 0.3s ease',
    display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px',
  },
  footer: {
    position: 'relative', zIndex: 1,
    display: 'flex', justifyContent: 'space-between',
    padding: '22px 48px', borderTop: '1px solid #111',
  },
  footerText: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '9px', letterSpacing: '0.15em', color: '#222', textTransform: 'uppercase',
  },
}

export default MapsPage