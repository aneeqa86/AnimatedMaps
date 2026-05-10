import React from 'react'

// ─── Visual Components ────────────────────────────────────────────────────────

const WorkerVisual = () => (
  <svg viewBox="0 0 500 260" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
    <circle cx="140" cy="168" r="5" fill="#C9B88A" opacity="0.95"/>
    <circle cx="140" cy="168" r="5" fill="none" stroke="#C9B88A" strokeWidth="1">
      <animate attributeName="r" values="8;24;8" dur="3s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite"/>
    </circle>
    <path d="M 140 168 Q 310 30 390 118" fill="none" stroke="#C9B88A" strokeWidth="1.8" strokeLinecap="round" opacity="0.7"/>
    <circle r="5" fill="#C9B88A" opacity="0.95">
      <animateMotion dur="3.5s" repeatCount="indefinite" path="M 140 168 Q 310 30 390 118"/>
      <animate attributeName="opacity" values="0;1;1;0" dur="3.5s" repeatCount="indefinite"/>
    </circle>
    <circle cx="390" cy="118" r="5" fill="#C9B88A" opacity="0.85">
      <animate attributeName="opacity" values="0.85;0.3;0.85" dur="2s" repeatCount="indefinite"/>
    </circle>
    <text x="140" y="192" textAnchor="middle" fontFamily="'DM Mono', monospace" fontSize="9" fill="#C9B88A" opacity="0.45" letterSpacing="0.18em">KARACHI</text>
    <text x="390" y="142" textAnchor="middle" fontFamily="'DM Mono', monospace" fontSize="9" fill="#C9B88A" opacity="0.45" letterSpacing="0.18em">GULF</text>
  </svg>
)

const PartitionVisual = () => (
  <svg viewBox="0 0 500 260" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
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
    <rect x="128" y="72" width="10" height="18" rx="2" fill="#C9B88A" opacity="0.85"/>
    <ellipse cx="188" cy="82" rx="16" ry="10" fill="#C9B88A" opacity="0.8"/>
    <rect x="80" y="88" width="180" height="44" rx="5" fill="#C9B88A" opacity="0.85"/>
    <rect x="240" y="64" width="68" height="68" rx="4" fill="#C9B88A" opacity="0.85"/>
    <rect x="250" y="74" width="20" height="14" rx="2" fill="#1a0505" opacity="0.7"/>
    <rect x="278" y="74" width="20" height="14" rx="2" fill="#1a0505" opacity="0.7"/>
    <line x1="240" y1="112" x2="308" y2="112" stroke="#1a0505" strokeWidth="1.5" opacity="0.4"/>
    <rect x="312" y="76" width="100" height="56" rx="4" fill="#C9B88A" opacity="0.72"/>
    <rect x="322" y="86" width="16" height="12" rx="2" fill="#1a0505" opacity="0.5"/>
    <rect x="346" y="86" width="16" height="12" rx="2" fill="#1a0505" opacity="0.5"/>
    <rect x="370" y="86" width="16" height="12" rx="2" fill="#1a0505" opacity="0.5"/>
    <rect x="418" y="76" width="68" height="56" rx="4" fill="#C9B88A" opacity="0.55"/>
    <rect x="428" y="86" width="14" height="12" rx="2" fill="#1a0505" opacity="0.5"/>
    <rect x="450" y="86" width="14" height="12" rx="2" fill="#1a0505" opacity="0.5"/>
    <rect x="306" y="112" width="10" height="5" rx="1" fill="#C9B88A" opacity="0.6"/>
    <rect x="412" y="112" width="10" height="5" rx="1" fill="#C9B88A" opacity="0.6"/>
    <circle cx="110" cy="136" r="20" fill="#1a0505" stroke="#C9B88A" strokeWidth="3"/>
    <circle cx="110" cy="136" r="7" fill="#C9B88A" opacity="0.9"/>
    <circle cx="158" cy="136" r="15" fill="#1a0505" stroke="#C9B88A" strokeWidth="2.5"/>
    <circle cx="158" cy="136" r="5" fill="#C9B88A" opacity="0.9"/>
    <circle cx="202" cy="136" r="15" fill="#1a0505" stroke="#C9B88A" strokeWidth="2.5"/>
    <circle cx="202" cy="136" r="5" fill="#C9B88A" opacity="0.9"/>
    <circle cx="335" cy="135" r="12" fill="#1a0505" stroke="#C9B88A" strokeWidth="2"/>
    <circle cx="335" cy="135" r="4" fill="#C9B88A" opacity="0.8"/>
    <circle cx="375" cy="135" r="12" fill="#1a0505" stroke="#C9B88A" strokeWidth="2"/>
    <circle cx="375" cy="135" r="4" fill="#C9B88A" opacity="0.8"/>
    <circle cx="432" cy="135" r="11" fill="#1a0505" stroke="#C9B88A" strokeWidth="2"/>
    <circle cx="432" cy="135" r="4" fill="#C9B88A" opacity="0.8"/>
    <circle cx="468" cy="135" r="11" fill="#1a0505" stroke="#C9B88A" strokeWidth="2"/>
    <circle cx="468" cy="135" r="4" fill="#C9B88A" opacity="0.8"/>
    <line x1="20" y1="156" x2="490" y2="156" stroke="#C9B88A" strokeWidth="2" opacity="0.25"/>
    {[30,70,110,150,190,230,270,310,350,390,430,470].map(x => (
      <line key={x} x1={x} y1="150" x2={x} y2="162" stroke="#C9B88A" strokeWidth="2" opacity="0.14"/>
    ))}
    <text x="250" y="200" textAnchor="middle" fontFamily="'DM Mono', monospace" fontSize="9" fill="#C9B88A" opacity="0.35" letterSpacing="0.22em">LAHORE · AMRITSAR · 1947</text>
    <text x="16" y="240" fontFamily="'Playfair Display', serif" fontSize="72" fill="#C9B88A" opacity="0.04" fontWeight="900">1947</text>
  </svg>
)

const PalestineVisual = () => (
  <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <defs>
      <radialGradient id="palGlow" cx="45%" cy="55%" r="55%">
        <stop offset="0%" stopColor="#4A5C3A" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#0E0D0B" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="280" height="160" fill="#0E0D0B" />
    <rect width="280" height="160" fill="url(#palGlow)" />
    {[0,1,2,3,4,5,6].map(i => (
      <line key={`h${i}`} x1="0" y1={i*28} x2="280" y2={i*28} stroke="rgba(212,197,160,0.04)" strokeWidth="0.5" />
    ))}
    {[0,1,2,3,4,5,6,7,8,9].map(i => (
      <line key={`v${i}`} x1={i*32} y1="0" x2={i*32} y2="160" stroke="rgba(212,197,160,0.04)" strokeWidth="0.5" />
    ))}
    <ellipse cx="145" cy="72" rx="18" ry="30" fill="#4A5C3A" fillOpacity="0.7" />
    <rect x="118" y="90" width="9" height="28" rx="2" fill="#8B1A1A" fillOpacity="0.75" />
    <ellipse cx="145" cy="72" rx="18" ry="30" fill="none" stroke="#6B7F55" strokeWidth="1" strokeOpacity="0.8" />
    {[
      { x1: 150, y1: 75, x2: 195, y2: 68 },
      { x1: 148, y1: 55, x2: 152, y2: 28 },
      { x1: 118, y1: 95, x2: 82,  y2: 90 },
    ].map((l, i) => (
      <g key={i}>
        <line {...l} stroke="#8B1A1A" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="3 3" />
        <line {...l} stroke="#C9A84A" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="2 4" />
      </g>
    ))}
    <circle cx="145" cy="76" r="2.5" fill="#D4C5A0" fillOpacity="0.9" />
    <circle cx="127" cy="96" r="2" fill="#8B1A1A" fillOpacity="0.9" />
    <circle cx="143" cy="52" r="1.5" fill="#C9A84A" fillOpacity="0.8" />
    <g transform="translate(136, 62)">
      <ellipse cx="0" cy="0" rx="4" ry="3" fill="#C9A84A" fillOpacity="0.7" />
      <rect x="-2.5" y="0" width="5" height="4" fill="#C9A84A" fillOpacity="0.5" />
      <line x1="0" y1="-5" x2="0" y2="-3" stroke="#C9A84A" strokeWidth="0.8" strokeOpacity="0.8" />
    </g>
    <text x="22" y="32" fontFamily="serif" fontSize="9" fill="#D4C5A0" fillOpacity="0.6" direction="rtl">میں نہیں مانتا</text>
    <text x="22" y="44" fontFamily="serif" fontSize="7" fill="#6B7F55" fillOpacity="0.7" fontStyle="italic">I do not accept this</text>
    <text x="22" y="128" fontFamily="monospace" fontSize="7" fill="#4a4840" letterSpacing="1">LAND REMAINING</text>
    <rect x="22" y="133" width="100" height="3" fill="#1c1b18" rx="1" />
    <rect x="22" y="133" width="13" height="3" fill="#8B1A1A" rx="1" />
    <text x="138" y="137" fontFamily="monospace" fontSize="7" fill="#8B1A1A">13%</text>
    <text x="22" y="150" fontFamily="monospace" fontSize="7" fill="#333">1917</text>
    <text x="60" y="150" fontFamily="monospace" fontSize="7" fill="#333">1948</text>
    <text x="100" y="150" fontFamily="monospace" fontSize="7" fill="#333">1967</text>
    <text x="140" y="150" fontFamily="monospace" fontSize="7" fill="#4a4840">TODAY</text>
    <circle cx="127" cy="96" r="6" fill="none" stroke="#8B1A1A" strokeWidth="0.8" strokeOpacity="0.4" />
    <circle cx="127" cy="96" r="10" fill="none" stroke="#8B1A1A" strokeWidth="0.5" strokeOpacity="0.2" />
  </svg>
)

const CricketVisual = () => (
  <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <defs>
      <radialGradient id="cg1" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stopColor="#1a2e14" />
        <stop offset="100%" stopColor="#0a0e08" />
      </radialGradient>
      <radialGradient id="cg2" cx="60%" cy="60%" r="50%">
        <stop offset="0%" stopColor="#C9A84A" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#C9A84A" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="280" height="160" fill="url(#cg1)" />
    <rect width="280" height="160" fill="url(#cg2)" />
    <ellipse cx="132" cy="42" rx="8" ry="7" fill="#8B1A1A" opacity="0.7" />
    <ellipse cx="188" cy="72" rx="12" ry="14" fill="#C9A84A" opacity="0.75" />
    <ellipse cx="220" cy="100" rx="11" ry="9" fill="#6a8a5a" opacity="0.5" />
    <ellipse cx="72" cy="72" rx="5" ry="3" fill="#C9A84A" opacity="0.55" />
    <ellipse cx="148" cy="108" rx="7" ry="6" fill="#6a8a5a" opacity="0.4" />
    <line x1="132" y1="42" x2="188" y2="72" stroke="#8B1A1A" strokeWidth="0.8" strokeOpacity="0.6" strokeDasharray="3,2" />
    <line x1="132" y1="42" x2="220" y2="100" stroke="#8B1A1A" strokeWidth="0.8" strokeOpacity="0.5" strokeDasharray="3,2" />
    <line x1="132" y1="42" x2="72" y2="72" stroke="#8B1A1A" strokeWidth="0.8" strokeOpacity="0.5" strokeDasharray="3,2" />
    <line x1="132" y1="42" x2="148" y2="108" stroke="#8B1A1A" strokeWidth="0.8" strokeOpacity="0.45" strokeDasharray="3,2" />
    <line x1="220" y1="100" x2="188" y2="72" stroke="#C9A84A" strokeWidth="1" strokeOpacity="0.7" strokeDasharray="2,3" />
    <line x1="72" y1="72" x2="188" y2="72" stroke="#C9A84A" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="2,3" />
    <line x1="148" y1="108" x2="188" y2="72" stroke="#C9A84A" strokeWidth="0.8" strokeOpacity="0.55" strokeDasharray="2,3" />
    <rect x="183" y="67" width="4" height="12" rx="1" fill="none" stroke="#C9A84A" strokeWidth="0.8" strokeOpacity="0.8" />
    <circle cx="132" cy="42" r="2.5" fill="#8B1A1A" opacity="0.9" />
    <circle cx="188" cy="72" r="4" fill="#C9A84A" opacity="0.9" />
    <text x="14" y="18" fontFamily="DM Mono, monospace" fontSize="9" fill="#3a4a2a" opacity="0.7">1700s</text>
    <text x="220" y="150" fontFamily="DM Mono, monospace" fontSize="9" fill="#C9A84A" opacity="0.8">TODAY</text>
    <text x="252" y="20" fontSize="14">🏏</text>
  </svg>
)

// ─── Hajj Visual ──────────────────────────────────────────────────────────────
const HajjVisual = () => (
  <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <defs>
      <radialGradient id="hajjGlow" cx="58%" cy="55%" r="40%">
        <stop offset="0%" stopColor="#C4935A" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#C4935A" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="hajjBg" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stopColor="#1C1306" />
        <stop offset="100%" stopColor="#0C0A06" />
      </radialGradient>
      <radialGradient id="meccaGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#C9B88A" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#C9B88A" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Background */}
    <rect width="280" height="160" fill="url(#hajjBg)" />
    <rect width="280" height="160" fill="url(#hajjGlow)" />

    {/* Grid */}
    {[0,1,2,3,4,5].map(i => (
      <line key={`h${i}`} x1="0" y1={i*32} x2="280" y2={i*32} stroke="rgba(201,184,138,0.04)" strokeWidth="0.5"/>
    ))}
    {[0,1,2,3,4,5,6,7].map(i => (
      <line key={`v${i}`} x1={i*40} y1="0" x2={i*40} y2="160" stroke="rgba(201,184,138,0.04)" strokeWidth="0.5"/>
    ))}

    {/* Mecca glow */}
    <circle cx="162" cy="86" r="22" fill="url(#meccaGlow)" />
    <circle cx="162" cy="86" r="6" fill="#C9B88A" opacity="0.9"/>
    <circle cx="162" cy="86" r="6" fill="none" stroke="#C9B88A" strokeWidth="1">
      <animate attributeName="r" values="8;18;8" dur="2.5s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.5;0;0.5" dur="2.5s" repeatCount="indefinite"/>
    </circle>

    {/* Ancient camel routes — converging lines */}
    {/* Khorasan (from right) */}
    <path d="M 270 28 Q 220 50 162 86" fill="none" stroke="#C4935A" strokeWidth="1.2" strokeOpacity="0.55" strokeDasharray="3,3"/>
    {/* Saharan (from left) */}
    <path d="M 10 60 Q 80 68 162 86" fill="none" stroke="#C4935A" strokeWidth="1.2" strokeOpacity="0.5" strokeDasharray="3,3"/>
    {/* Nile */}
    <path d="M 100 10 Q 130 48 162 86" fill="none" stroke="#C4935A" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="3,3"/>
    {/* Sea — from bottom right */}
    <path d="M 250 140 Q 210 118 162 86" fill="none" stroke="#3A7A8C" strokeWidth="1.2" strokeOpacity="0.55" strokeDasharray="2,4"/>
    {/* Air — sharp from bottom-left */}
    <path d="M 30 140 Q 100 110 162 86" fill="none" stroke="#E8DFC0" strokeWidth="0.8" strokeOpacity="0.4" />

    {/* Animated pilgrims on routes */}
    <circle r="2.5" fill="#C4935A" opacity="0.9">
      <animateMotion dur="4s" repeatCount="indefinite" path="M 270 28 Q 220 50 162 86"/>
      <animate attributeName="opacity" values="0;0.9;0.9;0" dur="4s" repeatCount="indefinite"/>
    </circle>
    <circle r="2" fill="#C4935A" opacity="0.8">
      <animateMotion dur="5s" repeatCount="indefinite" path="M 10 60 Q 80 68 162 86"/>
      <animate attributeName="opacity" values="0;0.8;0.8;0" dur="5s" repeatCount="indefinite"/>
    </circle>
    <circle r="2" fill="#3A7A8C" opacity="0.85">
      <animateMotion dur="4.5s" repeatCount="indefinite" path="M 250 140 Q 210 118 162 86"/>
      <animate attributeName="opacity" values="0;0.85;0.85;0" dur="4.5s" repeatCount="indefinite"/>
    </circle>
    <circle r="1.5" fill="#E8DFC0" opacity="0.7">
      <animateMotion dur="2.5s" repeatCount="indefinite" path="M 30 140 Q 100 110 162 86"/>
      <animate attributeName="opacity" values="0;0.7;0.7;0" dur="2.5s" repeatCount="indefinite"/>
    </circle>

    {/* Arabic text */}
    <text x="140" y="28" textAnchor="middle" fontFamily="serif" fontSize="11"
      fill="#C9B88A" opacity="0.65" direction="rtl">لَبَّيْكَ</text>

    {/* Labels */}
    <text x="14" y="152" fontFamily="DM Mono, monospace" fontSize="7" fill="#6a5a3a" letterSpacing="1">ANCIENT</text>
    <text x="220" y="152" fontFamily="DM Mono, monospace" fontSize="7" fill="#C9B88A" letterSpacing="1" opacity="0.7">MECCA</text>
  </svg>
)

// ─── THE REGISTRY ─────────────────────────────────────────────────────────────
export const MAPS_REGISTRY = [
  {
    id: 'pakistan-worker',
    title: 'The Pakistani Worker',
    eyebrow: 'Pakistan → Gulf States',
    year: '1947 – 2024',
    tag: 'Labor Day Edition',
    tagColor: '#8B1A1A',
    cardBg: '#0e0905',
    hoverBorderColor: '#8B1A1A',
    desc: 'From factory floors of Karachi to construction sites of Riyadh. 14 million workers, two threads, one human story.',
    stats: ['14M Workers', '$35B Remittances', '77yr Arc'],
    status: 'live',
    path: '/maps/pakistan-worker',
    Visual: WorkerVisual,
  },
  {
    id: 'partition-1947',
    title: 'The Partition',
    eyebrow: 'Punjab & Bengal',
    year: '1947',
    tag: 'Migration · Violence',
    tagColor: '#C9B88A',
    cardBg: '#0e0505',
    hoverBorderColor: '#C9B88A',
    desc: 'The largest forced migration in human history. 14.5 million people. Two lines drawn in five weeks. Told through the poets who witnessed it.',
    stats: ['14.5M Displaced', '1.3M Missing', '7 Chapters'],
    status: 'live',
    path: '/maps/partition-1947',
    Visual: PartitionVisual,
  },
  {
    id: 'palestine-dastoor',
    title: 'Palestine — Dastoor',
    eyebrow: 'Land · Displacement · Resistance',
    year: '1917–Today',
    tag: 'OCCUPIED',
    tagColor: '#4A5C3A',
    cardBg: 'linear-gradient(135deg, #0E0D0B 0%, #1a1e15 50%, #0E0D0B 100%)',
    hoverBorderColor: '#4A5C3A',
    desc: "Watch Palestinian land disappear across a century — narrated chapter by chapter through Habib Jalib's poem دستور. From the Balfour Declaration to Gaza 2023.",
    stats: [
      { value: '530', label: 'Villages Destroyed' },
      { value: '7M+', label: 'In Diaspora' },
      { value: '13%', label: 'Land Remaining' },
    ],
    status: 'live',
    path: '/maps/palestine-dastoor',
    Visual: PalestineVisual,
  },
  {
    id: 'cricket-empire',
    title: "Cricket: The Empire's Game",
    eyebrow: 'Sport · Empire · Resistance',
    year: '1700s–Today',
    tag: 'SPORT',
    tagColor: '#2D5A1B',
    cardBg: 'linear-gradient(135deg, #0a0e08 0%, #1a2e14 50%, #0a0e08 100%)',
    hoverBorderColor: '#2D5A1B',
    desc: "Cricket was England's gift to its colonies. Then the colonies took it back. Watch the centre of cricket power shift from Lord's to Mumbai over 300 years.",
    stats: [
      { value: '12', label: 'Test nations' },
      { value: '1983', label: 'The turning point' },
      { value: '₹', label: 'IPL changed everything' },
    ],
    status: 'live',
    path: '/maps/cricket-empire',
    Visual: CricketVisual,
  },
  {
    id: 'hajj-roads',
    title: 'The Eternal Road to Mecca',
    eyebrow: 'Ancient Routes · Sea Paths · Air Corridors',
    year: '750 CE – Today',
    tag: 'PILGRIMAGE',
    tagColor: '#C4935A',
    cardBg: 'linear-gradient(135deg, #0C0A06 0%, #1C1306 50%, #0C0A06 100%)',
    hoverBorderColor: '#C4935A',
    desc: 'Fourteen centuries of devotion mapped. Camel footprints across the Sahara. Dhow wakes across the Indian Ocean. Then the air age collapsed months into hours. One destination. A thousand roads.',
    stats: [
      { value: '1,400', label: 'Years of Pilgrimage' },
      { value: '2.5M',  label: 'Pilgrims in 2024' },
      { value: '180',   label: 'Countries Today' },
    ],
    status: 'live',
    path: '/maps/hajj-roads',
    Visual: HajjVisual,
  },
]

export const LIVE_COUNT  = MAPS_REGISTRY.filter(m => m.status === 'live').length
export const TOTAL_COUNT = MAPS_REGISTRY.length