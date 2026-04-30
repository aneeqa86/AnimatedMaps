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
    id: 'partition-1947',
    title: 'The Partition',
    eyebrow: 'Punjab & Bengal',
    year: '1947',
    tag: 'Migration · Violence',
    tagColor: '#C9B88A',
    desc: 'The largest forced migration in human history. 14.5 million people. Two lines drawn in five weeks. Told through the poets who witnessed it.',
    stats: ['14.5M Displaced', '1.3M Missing', '7 Chapters'],
    status: 'live',
    path: '/maps/partition-1947',
  },
  {
    id: 'coming-soon-1',
    title: 'Coming Soon',
    eyebrow: 'Next Map',
    year: '—',
    tag: 'In Production',
    tagColor: '#2a2a2a',
    desc: 'The next animated map is in research and production.',
    stats: [],
    status: 'soon',
    path: null,
  },
]

// ─── Pakistan Worker: single bold arc, moving dot ─────────────────────────────
const WorkerVisual = () => (
  <svg
    viewBox="0 0 500 260"
    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
  >
    {/* Origin dot — Karachi */}
    <circle cx="140" cy="168" r="5" fill="#C9B88A" opacity="0.95"/>
    {/* Pulse ring */}
    <circle cx="140" cy="168" r="5" fill="none" stroke="#C9B88A" strokeWidth="1">
      <animate attributeName="r" values="8;24;8" dur="3s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite"/>
    </circle>

    {/* Single bold arc */}
    <path
      d="M 140 168 Q 310 30 390 118"
      fill="none"
      stroke="#C9B88A"
      strokeWidth="1.8"
      strokeLinecap="round"
      opacity="0.7"
    />

    {/* Animated dot traveling the arc */}
    <circle r="5" fill="#C9B88A" opacity="0.95">
      <animateMotion
        dur="3.5s"
        repeatCount="indefinite"
        path="M 140 168 Q 310 30 390 118"
      />
      <animate attributeName="opacity" values="0;1;1;0" dur="3.5s" repeatCount="indefinite"/>
    </circle>

    {/* Destination dot — Gulf */}
    <circle cx="390" cy="118" r="5" fill="#C9B88A" opacity="0.85">
      <animate attributeName="opacity" values="0.85;0.3;0.85" dur="2s" repeatCount="indefinite"/>
    </circle>

    {/* Origin label */}
    <text
      x="140" y="192"
      textAnchor="middle"
      fontFamily="'DM Mono', monospace"
      fontSize="9"
      fill="#C9B88A"
      opacity="0.45"
      letterSpacing="0.18em"
    >
      KARACHI
    </text>

    {/* Destination label */}
    <text
      x="390" y="142"
      textAnchor="middle"
      fontFamily="'DM Mono', monospace"
      fontSize="9"
      fill="#C9B88A"
      opacity="0.45"
      letterSpacing="0.18em"
    >
      GULF
    </text>
  </svg>
)

// ─── Partition: centered train, large, gold on dark red ───────────────────────
const PartitionVisual = () => (
  <svg
    viewBox="0 0 500 260"
    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
  >
    {/* Smoke */}
    <ellipse cx="134" cy="62" rx="9" ry="6" fill="#C9B88A" opacity="0.12">
      <animate attributeName="cy" values="62;50;62" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.12;0.04;0.12" dur="2s" repeatCount="indefinite"/>
    </ellipse>
    <ellipse cx="130" cy="52" rx="7" ry="5" fill="#C9B88A" opacity="0.08">
      <animate attributeName="cy" values="52;40;52" dur="2.6s" repeatCount="indefinite"/>
    </ellipse>
    <ellipse cx="127" cy="43" rx="5" ry="4" fill="#C9B88A" opacity="0.05">
      <animate attributeName="cy" values="43;30;43" dur="3.2s" repeatCount="indefinite"/>
    </ellipse>

    {/* Chimney */}
    <rect x="128" y="72" width="10" height="18" rx="2" fill="#C9B88A" opacity="0.85"/>

    {/* Boiler dome */}
    <ellipse cx="188" cy="82" rx="16" ry="10" fill="#C9B88A" opacity="0.8"/>

    {/* Main boiler body */}
    <rect x="80" y="88" width="180" height="44" rx="5" fill="#C9B88A" opacity="0.85"/>

    {/* Cab */}
    <rect x="240" y="64" width="68" height="68" rx="4" fill="#C9B88A" opacity="0.85"/>
    {/* Cab windows */}
    <rect x="250" y="74" width="20" height="14" rx="2" fill="#1a0505" opacity="0.7"/>
    <rect x="278" y="74" width="20" height="14" rx="2" fill="#1a0505" opacity="0.7"/>
    {/* Cab door line */}
    <line x1="240" y1="112" x2="308" y2="112" stroke="#1a0505" strokeWidth="1.5" opacity="0.4"/>

    {/* Carriage 1 */}
    <rect x="312" y="76" width="100" height="56" rx="4" fill="#C9B88A" opacity="0.72"/>
    <rect x="322" y="86" width="16" height="12" rx="2" fill="#1a0505" opacity="0.5"/>
    <rect x="346" y="86" width="16" height="12" rx="2" fill="#1a0505" opacity="0.5"/>
    <rect x="370" y="86" width="16" height="12" rx="2" fill="#1a0505" opacity="0.5"/>

    {/* Carriage 2 */}
    <rect x="418" y="76" width="68" height="56" rx="4" fill="#C9B88A" opacity="0.55"/>
    <rect x="428" y="86" width="14" height="12" rx="2" fill="#1a0505" opacity="0.5"/>
    <rect x="450" y="86" width="14" height="12" rx="2" fill="#1a0505" opacity="0.5"/>

    {/* Coupling 1 */}
    <rect x="306" y="112" width="10" height="5" rx="1" fill="#C9B88A" opacity="0.6"/>
    {/* Coupling 2 */}
    <rect x="412" y="112" width="10" height="5" rx="1" fill="#C9B88A" opacity="0.6"/>

    {/* Wheels — locomotive */}
    <circle cx="110" cy="136" r="20" fill="#1a0505" stroke="#C9B88A" strokeWidth="3"/>
    <circle cx="110" cy="136" r="7" fill="#C9B88A" opacity="0.9"/>
    <circle cx="158" cy="136" r="15" fill="#1a0505" stroke="#C9B88A" strokeWidth="2.5"/>
    <circle cx="158" cy="136" r="5" fill="#C9B88A" opacity="0.9"/>
    <circle cx="202" cy="136" r="15" fill="#1a0505" stroke="#C9B88A" strokeWidth="2.5"/>
    <circle cx="202" cy="136" r="5" fill="#C9B88A" opacity="0.9"/>

    {/* Wheels — carriage 1 */}
    <circle cx="335" cy="135" r="12" fill="#1a0505" stroke="#C9B88A" strokeWidth="2"/>
    <circle cx="335" cy="135" r="4" fill="#C9B88A" opacity="0.8"/>
    <circle cx="375" cy="135" r="12" fill="#1a0505" stroke="#C9B88A" strokeWidth="2"/>
    <circle cx="375" cy="135" r="4" fill="#C9B88A" opacity="0.8"/>

    {/* Wheels — carriage 2 */}
    <circle cx="432" cy="135" r="11" fill="#1a0505" stroke="#C9B88A" strokeWidth="2"/>
    <circle cx="432" cy="135" r="4" fill="#C9B88A" opacity="0.8"/>
    <circle cx="468" cy="135" r="11" fill="#1a0505" stroke="#C9B88A" strokeWidth="2"/>
    <circle cx="468" cy="135" r="4" fill="#C9B88A" opacity="0.8"/>

    {/* Rail */}
    <line x1="20" y1="156" x2="490" y2="156" stroke="#C9B88A" strokeWidth="2" opacity="0.25"/>
    {/* Sleepers */}
    {[30,70,110,150,190,230,270,310,350,390,430,470].map(x => (
      <line key={x} x1={x} y1="150" x2={x} y2="162"
        stroke="#C9B88A" strokeWidth="2" opacity="0.14"/>
    ))}

    {/* Bottom label */}
    <text
      x="250" y="200"
      textAnchor="middle"
      fontFamily="'DM Mono', monospace"
      fontSize="9"
      fill="#C9B88A"
      opacity="0.35"
      letterSpacing="0.22em"
    >
      LAHORE · AMRITSAR · 1947
    </text>

    {/* Ghost year */}
    <text
      x="16" y="240"
      fontFamily="'Playfair Display', serif"
      fontSize="72"
      fill="#C9B88A"
      opacity="0.04"
      fontWeight="900"
    >
      1947
    </text>
  </svg>
)

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
            <span style={S.metaNum}>02</span>
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
        {maps.map((map, i) => (
          <MapCard
            key={map.id} map={map} index={i}
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

// ─── MapCard ──────────────────────────────────────────────────────────────────
const MapCard = ({ map, index, hovered, onHover, onLeave }) => {
  const isLive      = map.status === 'live'
  const isWorker    = map.id === 'pakistan-worker'
  const isPartition = map.id === 'partition-1947'

  // Card background colors
  const cardBgColor = isWorker
    ? '#0e0905'         // very dark warm brown — gold/labor feel
    : isPartition
      ? '#0e0505'       // very dark red — violence/partition feel
      : '#0a0a0a'       // neutral dark

  const card = (
    <article
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        ...S.card,
        background: cardBgColor,
        borderColor: hovered
          ? isWorker ? '#8B1A1A' : isPartition ? '#C9B88A' : '#333'
          : '#161616',
        animation: `fadeUp 0.5s ease ${index * 0.1}s both`,
        cursor: isLive ? 'pointer' : 'default',
      }}
    >
      {/* Visual */}
      <div style={S.cardVisual}>
        {/* Solid bg */}
        <div style={{
          position: 'absolute', inset: 0,
          background: cardBgColor,
        }}/>

        {/* The single graphic element */}
        {isWorker    && <WorkerVisual/>}
        {isPartition && <PartitionVisual/>}

        {/* Coming soon placeholder */}
        {!isLive && (
          <div style={S.comingSoon}>
            <span style={S.comingSoonGlyph}>◎</span>
          </div>
        )}

        {/* Bottom fade */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `linear-gradient(to top, ${cardBgColor} 0%, transparent 60%)`,
        }}/>

        {/* Tag */}
        <div style={{ ...S.cardTag, borderColor: map.tagColor, color: map.tagColor }}>
          {map.tag}
        </div>

        {/* Live dot */}
        {isLive && (
          <div style={S.liveBadge}>
            <span style={S.liveDot}/>
            <span style={S.liveLabel}>Live</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ ...S.cardContent, background: cardBgColor }}>
        <div style={S.cardMeta}>
          <span style={S.cardEyebrow}>{map.eyebrow}</span>
          <span style={S.dot}>·</span>
          <span style={S.cardEyebrow}>{map.year}</span>
        </div>

        <h2 style={{
          ...S.cardTitle,
          color: hovered && isLive ? '#C9B88A' : '#E8E0D0',
        }}>
          {map.title}
        </h2>

        <p style={S.cardDesc}>{map.desc}</p>

        {map.stats.length > 0 && (
          <div style={S.statRow}>
            {map.stats.map(s => (
              <span key={s} style={{
                ...S.statTag,
                borderColor: hovered && isLive
                  ? isPartition ? 'rgba(201,184,138,0.3)' : 'rgba(139,26,26,0.4)'
                  : '#1e1e1e',
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