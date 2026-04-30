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

// ─── Pakistan Worker card visual ──────────────────────────────────────────────
const PakistanWorkerSVG = () => (
  <svg style={svgStyle} viewBox="0 0 400 260">
    {/* Ghost year */}
    <text x="14" y="230" fontFamily="'Playfair Display', serif" fontSize="80"
      fill="#C9B88A" opacity="0.035" fontWeight="900">1947</text>

    {/* Pakistan faint circle */}
    <circle cx="118" cy="148" r="52" fill="none" stroke="#C9B88A" strokeWidth="0.6" opacity="0.1"/>
    <ellipse cx="118" cy="148" rx="52" ry="16" fill="none" stroke="#C9B88A" strokeWidth="0.4" opacity="0.06"/>

    {/* Gulf faint circle */}
    <circle cx="250" cy="122" r="26" fill="none" stroke="#8B1A1A" strokeWidth="0.5" opacity="0.1"/>

    {/* Origin dot — Pakistan */}
    <circle cx="118" cy="148" r="5" fill="#C9B88A" opacity="0.9"/>
    <circle cx="118" cy="148" r="14" fill="none" stroke="#C9B88A" strokeWidth="0.7" opacity="0">
      <animate attributeName="r" values="8;20;8" dur="3s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite"/>
    </circle>

    {/* Flow 1 — main arc */}
    <path d="M 126 140 Q 192 72 250 110" fill="none" stroke="#C9B88A"
      strokeWidth="1.2" strokeDasharray="5 4" opacity="0.65">
      <animate attributeName="stroke-dashoffset" from="0" to="-200" dur="3s" repeatCount="indefinite"/>
    </path>
    <circle r="2.8" fill="#C9B88A" opacity="0.9">
      <animateMotion dur="3s" repeatCount="indefinite"
        path="M 126 140 Q 192 72 250 110"/>
    </circle>

    {/* Flow 2 */}
    <path d="M 122 136 Q 194 62 254 100" fill="none" stroke="#C9B88A"
      strokeWidth="0.75" strokeDasharray="4 6" opacity="0.38">
      <animate attributeName="stroke-dashoffset" from="0" to="-200" dur="4.3s" repeatCount="indefinite"/>
    </path>
    <circle r="2" fill="#C9B88A" opacity="0.65">
      <animateMotion dur="4.3s" repeatCount="indefinite"
        path="M 122 136 Q 194 62 254 100"/>
    </circle>

    {/* Flow 3 */}
    <path d="M 118 154 Q 195 88 248 128" fill="none" stroke="#C9B88A"
      strokeWidth="0.5" strokeDasharray="3 7" opacity="0.2">
      <animate attributeName="stroke-dashoffset" from="0" to="-200" dur="5.8s" repeatCount="indefinite"/>
    </path>

    {/* Flow 4 */}
    <path d="M 114 152 Q 190 96 244 134" fill="none" stroke="#C9B88A"
      strokeWidth="0.4" strokeDasharray="2 8" opacity="0.14">
      <animate attributeName="stroke-dashoffset" from="0" to="-200" dur="7s" repeatCount="indefinite"/>
    </path>

    {/* Remittance return — faint reverse */}
    <path d="M 244 118 Q 178 168 124 156" fill="none" stroke="#C9B88A"
      strokeWidth="0.4" strokeDasharray="2 9" opacity="0.12">
      <animate attributeName="stroke-dashoffset" from="0" to="200" dur="5s" repeatCount="indefinite"/>
    </path>

    {/* Gulf destination dots */}
    <circle cx="250" cy="110" r="4" fill="#8B1A1A" opacity="0.85">
      <animate attributeName="opacity" values="0.85;0.25;0.85" dur="2.3s" repeatCount="indefinite"/>
    </circle>
    <circle cx="254" cy="100" r="2.8" fill="#8B1A1A" opacity="0.6">
      <animate attributeName="opacity" values="0.6;0.18;0.6" dur="2.9s" repeatCount="indefinite"/>
    </circle>
    <circle cx="248" cy="128" r="2.2" fill="#8B1A1A" opacity="0.45">
      <animate attributeName="opacity" values="0.45;0.12;0.45" dur="3.5s" repeatCount="indefinite"/>
    </circle>
    <circle cx="244" cy="134" r="1.8" fill="#8B1A1A" opacity="0.35">
      <animate attributeName="opacity" values="0.35;0.08;0.35" dur="4s" repeatCount="indefinite"/>
    </circle>

    {/* Region labels */}
    <text x="72" y="210" fontFamily="'DM Mono', monospace" fontSize="7.5"
      fill="#C9B88A" opacity="0.28" letterSpacing="0.18em">PAKISTAN</text>
    <text x="228" y="155" fontFamily="'DM Mono', monospace" fontSize="7.5"
      fill="#8B1A1A" opacity="0.28" letterSpacing="0.14em">GULF</text>
  </svg>
)

// ─── Partition card visual ────────────────────────────────────────────────────
const PartitionSVG = () => (
  <svg style={svgStyle} viewBox="0 0 400 260">
    {/* Ghost year */}
    <text x="14" y="230" fontFamily="'Playfair Display', serif" fontSize="82"
      fill="#C9B88A" opacity="0.03" fontWeight="900">1947</text>

    {/* Subcontinent fill */}
    <polygon
      points="172,22 226,20 264,36 294,66 308,104 302,146 280,176 248,202 204,218 164,212 138,190 118,162 108,130 114,94 130,64 152,40"
      fill="#C9B88A" opacity="0.035"/>
    {/* Subcontinent outline */}
    <polygon
      points="172,22 226,20 264,36 294,66 308,104 302,146 280,176 248,202 204,218 164,212 138,190 118,162 108,130 114,94 130,64 152,40"
      fill="none" stroke="#C9B88A" strokeWidth="0.75" opacity="0.16"/>

    {/* Radcliffe Line — Punjab */}
    <line x1="185" y1="25" x2="167" y2="100"
      stroke="#fff" strokeWidth="1.4" strokeDasharray="4 3" opacity="0">
      <animate attributeName="opacity" values="0;0;0.55;0.55" dur="2.2s" fill="freeze"/>
    </line>

    {/* Radcliffe Line — Bengal */}
    <line x1="278" y1="118" x2="282" y2="178"
      stroke="#fff" strokeWidth="1.4" strokeDasharray="4 3" opacity="0">
      <animate attributeName="opacity" values="0;0;0;0;0.55;0.55" dur="3.4s" fill="freeze"/>
    </line>

    {/* Pakistan side — Punjab */}
    <polygon points="172,22 185,25 167,100 138,66 130,44 152,40"
      fill="#1B5E20" opacity="0">
      <animate attributeName="opacity" values="0;0;0.15;0.15" dur="2.4s" fill="freeze"/>
    </polygon>

    {/* India side — Punjab */}
    <polygon points="185,25 226,20 234,62 204,80 170,86 167,100"
      fill="#FF8F00" opacity="0">
      <animate attributeName="opacity" values="0;0;0.15;0.15" dur="2.4s" fill="freeze"/>
    </polygon>

    {/* East Pakistan — Bengal */}
    <polygon points="278,118 304,112 308,140 294,166 282,178"
      fill="#1B5E20" opacity="0">
      <animate attributeName="opacity" values="0;0;0;0;0.15;0.15" dur="3.6s" fill="freeze"/>
    </polygon>

    {/* West Bengal */}
    <polygon points="262,132 278,118 282,178 270,178 258,156"
      fill="#FF8F00" opacity="0">
      <animate attributeName="opacity" values="0;0;0;0;0.15;0.15" dur="3.6s" fill="freeze"/>
    </polygon>

    {/* Violence — Rawalpindi */}
    <circle cx="173" cy="60" r="3" fill="#8B1A1A" opacity="0">
      <animate attributeName="opacity" values="0;0;0.9;0.9" dur="2.6s" fill="freeze" begin="0s"/>
      <animate attributeName="r" values="3;8;3" dur="2.8s" repeatCount="indefinite" begin="2.6s"/>
      <animate attributeName="opacity" values="0.9;0.15;0.9" dur="2.8s" repeatCount="indefinite" begin="2.6s"/>
    </circle>

    {/* Violence — Amritsar */}
    <circle cx="202" cy="74" r="3" fill="#8B1A1A" opacity="0">
      <animate attributeName="opacity" values="0;0;0;0.85;0.85" dur="3s" fill="freeze" begin="0s"/>
      <animate attributeName="r" values="3;7;3" dur="2.5s" repeatCount="indefinite" begin="3s"/>
      <animate attributeName="opacity" values="0.85;0.12;0.85" dur="2.5s" repeatCount="indefinite" begin="3s"/>
    </circle>

    {/* Violence — Sheikhupura */}
    <circle cx="186" cy="68" r="2.5" fill="#8B1A1A" opacity="0">
      <animate attributeName="opacity" values="0;0;0.7;0.7" dur="2.8s" fill="freeze" begin="0s"/>
      <animate attributeName="r" values="2.5;6;2.5" dur="3.2s" repeatCount="indefinite" begin="2.8s"/>
      <animate attributeName="opacity" values="0.7;0.1;0.7" dur="3.2s" repeatCount="indefinite" begin="2.8s"/>
    </circle>

    {/* Violence — Calcutta */}
    <circle cx="270" cy="150" r="2.5" fill="#8B1A1A" opacity="0">
      <animate attributeName="opacity" values="0;0;0;0;0.75;0.75" dur="3.8s" fill="freeze" begin="0s"/>
      <animate attributeName="r" values="2.5;6;2.5" dur="3s" repeatCount="indefinite" begin="3.8s"/>
      <animate attributeName="opacity" values="0.75;0.1;0.75" dur="3s" repeatCount="indefinite" begin="3.8s"/>
    </circle>

    {/* Migration flows — Punjab */}
    <path d="M 202 80 Q 180 74 167 98" fill="none"
      stroke="#1B5E20" strokeWidth="1" strokeDasharray="4 3" opacity="0.5">
      <animate attributeName="stroke-dashoffset" from="0" to="-60" dur="2.5s" repeatCount="indefinite" begin="2.6s"/>
    </path>
    <path d="M 170 90 Q 188 95 202 88" fill="none"
      stroke="#FF8F00" strokeWidth="1" strokeDasharray="4 3" opacity="0.5">
      <animate attributeName="stroke-dashoffset" from="0" to="-60" dur="2.8s" repeatCount="indefinite" begin="2.6s"/>
    </path>

    {/* City labels */}
    <text x="148" y="54" fontFamily="'DM Mono', monospace" fontSize="6"
      fill="#C9B88A" opacity="0.28" letterSpacing="0.1em">LAHORE</text>
    <text x="204" y="70" fontFamily="'DM Mono', monospace" fontSize="6"
      fill="#C9B88A" opacity="0.28" letterSpacing="0.1em">AMRITSAR</text>
    <text x="252" y="147" fontFamily="'DM Mono', monospace" fontSize="6"
      fill="#C9B88A" opacity="0.28" letterSpacing="0.1em">CALCUTTA</text>
  </svg>
)

const svgStyle = {
  position: 'absolute', inset: 0, width: '100%', height: '100%',
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

  const bgGradient = isWorker
    ? 'radial-gradient(ellipse at 32% 65%, #130e05 0%, #080808 100%)'
    : isPartition
      ? 'radial-gradient(ellipse at 45% 45%, #110606 0%, #080808 100%)'
      : 'radial-gradient(ellipse at 50% 50%, #0e0e0e 0%, #080808 100%)'

  const card = (
    <article
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        ...S.card,
        borderColor: hovered ? 'rgba(201,184,138,0.3)' : 'transparent',
        animation: `fadeUp 0.5s ease ${index * 0.1}s both`,
        cursor: isLive ? 'pointer' : 'default',
      }}
    >
      {/* Visual panel */}
      <div style={S.cardVisual}>
        <div style={{ ...S.cardBg, background: bgGradient }}>
          {isWorker    && <PakistanWorkerSVG/>}
          {isPartition && <PartitionSVG/>}
          {!isLive && (
            <div style={S.comingSoon}>
              <span style={S.comingSoonGlyph}>◎</span>
            </div>
          )}
        </div>

        {/* Bottom gradient — always present, stronger on hover */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(to top, rgba(8,8,8,0.85) 0%, transparent 55%)',
          opacity: hovered ? 1 : 0.6,
          transition: 'opacity 0.4s ease',
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

        {/* Sub-type label */}
        {isLive && (
          <div style={S.cardSubLabel}>
            {isWorker ? 'Labor · Migration · 1947–2024' : 'Migration · Violence · 1947'}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={S.cardContent}>
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
                borderColor: hovered && isLive ? 'rgba(201,184,138,0.22)' : '#1a1a1a',
                color: hovered && isLive ? '#C9B88A' : '#444',
                transition: 'border-color 0.3s, color 0.3s',
              }}>
                {s}
              </span>
            ))}
          </div>
        )}

        {isLive && (
          <div style={{ ...S.cardCta, color: hovered ? '#C9B88A' : '#2a2a2a' }}>
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
    border: '1px solid transparent',
    background: '#080808',
    display: 'flex', flexDirection: 'column',
    transition: 'border-color 0.35s ease',
    position: 'relative',
  },
  cardVisual: { position: 'relative', height: '260px', overflow: 'hidden' },
  cardBg: { position: 'absolute', inset: 0, transition: 'background 0.4s ease' },
  comingSoon: {
    position: 'absolute', inset: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  comingSoonGlyph: {
    fontSize: '36px', color: '#181818', fontFamily: "'DM Mono', monospace",
  },
  cardTag: {
    position: 'absolute', top: '18px', left: '18px',
    fontFamily: "'DM Mono', monospace",
    fontSize: '8px', letterSpacing: '0.2em',
    border: '1px solid', padding: '4px 9px', textTransform: 'uppercase',
  },
  liveBadge: {
    position: 'absolute', top: '18px', right: '18px',
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
  cardSubLabel: {
    position: 'absolute', bottom: '18px', left: '18px',
    fontFamily: "'DM Mono', monospace", fontSize: '7.5px',
    color: 'rgba(201,184,138,0.28)', letterSpacing: '0.16em', textTransform: 'uppercase',
  },
  cardContent: {
    padding: '26px 30px 30px',
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
    fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 700,
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