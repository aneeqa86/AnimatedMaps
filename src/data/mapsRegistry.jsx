import React from 'react'

// ─── Visual Components ────────────────────────────────────────────────────────
// Each map defines its own SVG visual here. Add a new one when adding a map.

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
      <linearGradient id="palFade" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#4A5C3A" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#8B1A1A" stopOpacity="0.6" />
      </linearGradient>
    </defs>
 
    {/* bg */}
    <rect width="280" height="160" fill="#0E0D0B" />
    <rect width="280" height="160" fill="url(#palGlow)" />
 
    {/* grid */}
    {[0,1,2,3,4,5,6].map(i => (
      <line key={`h${i}`} x1="0" y1={i*28} x2="280" y2={i*28} stroke="rgba(212,197,160,0.04)" strokeWidth="0.5" />
    ))}
    {[0,1,2,3,4,5,6,7,8,9].map(i => (
      <line key={`v${i}`} x1={i*32} y1="0" x2={i*32} y2="160" stroke="rgba(212,197,160,0.04)" strokeWidth="0.5" />
    ))}
 
    {/* Palestine silhouette (simplified West Bank + Gaza) */}
    {/* West Bank */}
    <ellipse cx="145" cy="72" rx="18" ry="30" fill="#4A5C3A" fillOpacity="0.7" />
    {/* Gaza strip */}
    <rect x="118" y="90" width="9" height="28" rx="2" fill="#8B1A1A" fillOpacity="0.75" />
 
    {/* border glow */}
    <ellipse cx="145" cy="72" rx="18" ry="30" fill="none" stroke="#6B7F55" strokeWidth="1" strokeOpacity="0.8" />
 
    {/* displacement flow lines — outward from center */}
    {[
      { x1: 150, y1: 75, x2: 195, y2: 68 }, // to Jordan
      { x1: 148, y1: 55, x2: 152, y2: 28 }, // to Lebanon
      { x1: 118, y1: 95, x2: 82,  y2: 90 }, // into Gaza
    ].map((l, i) => (
      <g key={i}>
        <line {...l} stroke="#8B1A1A" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="3 3" />
        <line {...l} stroke="#C9A84A" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="2 4" />
      </g>
    ))}
 
    {/* city dots */}
    <circle cx="145" cy="76" r="2.5" fill="#D4C5A0" fillOpacity="0.9" />
    <circle cx="127" cy="96" r="2" fill="#8B1A1A" fillOpacity="0.9" />
    <circle cx="143" cy="52" r="1.5" fill="#C9A84A" fillOpacity="0.8" />
 
    {/* mosque dome icon — Jerusalem */}
    <g transform="translate(136, 62)">
      <ellipse cx="0" cy="0" rx="4" ry="3" fill="#C9A84A" fillOpacity="0.7" />
      <rect x="-2.5" y="0" width="5" height="4" fill="#C9A84A" fillOpacity="0.5" />
      <line x1="0" y1="-5" x2="0" y2="-3" stroke="#C9A84A" strokeWidth="0.8" strokeOpacity="0.8" />
    </g>
 
    {/* poem text */}
    <text x="22" y="32" fontFamily="serif" fontSize="9" fill="#D4C5A0" fillOpacity="0.6" direction="rtl">میں نہیں مانتا</text>
    <text x="22" y="44" fontFamily="serif" fontSize="7" fill="#6B7F55" fillOpacity="0.7" fontStyle="italic">I do not accept this</text>
 
    {/* olive branch */}
    <g transform="translate(220, 48)" opacity="0.5">
      <path d="M0,20 Q-8,10 -4,0" stroke="#4A5C3A" strokeWidth="1.5" fill="none" />
      <ellipse cx="-6" cy="5" rx="4" ry="2.5" fill="#4A5C3A" transform="rotate(-30,-6,5)" />
      <ellipse cx="-2" cy="12" rx="3.5" ry="2" fill="#4A5C3A" transform="rotate(-15,-2,12)" />
      <ellipse cx="-1" cy="18" rx="3" ry="2" fill="#4A5C3A" transform="rotate(10,-1,18)" />
    </g>
 
    {/* territory bar */}
    <text x="22" y="128" fontFamily="monospace" fontSize="7" fill="#4a4840" letterSpacing="1">LAND REMAINING</text>
    <rect x="22" y="133" width="100" height="3" fill="#1c1b18" rx="1" />
    <rect x="22" y="133" width="13" height="3" fill="#8B1A1A" rx="1" />
    <text x="138" y="137" fontFamily="monospace" fontSize="7" fill="#8B1A1A">13%</text>
 
    {/* year labels */}
    <text x="22" y="150" fontFamily="monospace" fontSize="7" fill="#333">1917</text>
    <text x="60" y="150" fontFamily="monospace" fontSize="7" fill="#333">1948</text>
    <text x="100" y="150" fontFamily="monospace" fontSize="7" fill="#333">1967</text>
    <text x="140" y="150" fontFamily="monospace" fontSize="7" fill="#4a4840">TODAY</text>
 
    {/* pulse ring on Gaza */}
    <circle cx="127" cy="96" r="6" fill="none" stroke="#8B1A1A" strokeWidth="0.8" strokeOpacity="0.4" />
    <circle cx="127" cy="96" r="10" fill="none" stroke="#8B1A1A" strokeWidth="0.5" strokeOpacity="0.2" />
  </svg>
);

// ─── THE REGISTRY ─────────────────────────────────────────────────────────────
// To add a new map:
//   1. Create your Visual component above
//   2. Add an entry to this array — set status: 'live' when ready
//   3. Add the route in App.jsx
//   MapsPage and HomePage will update automatically.

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
    status: 'live',           // 'live' | 'soon'
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
    desc: 'Watch Palestinian land disappear across a century — narrated chapter by chapter through Habib Jalib\'s poem دستور. From the Balfour Declaration to Gaza 2023.',
    stats: [
      { value: '530', label: 'Villages Destroyed' },
      { value: '7M+', label: 'In Diaspora' },
      { value: '13%', label: 'Land Remaining' },
    ],
    status: 'live',
    path: '/maps/palestine-dastoor',
    Visual: PalestineVisual,
  },
]

// Derived counts — used in MapsPage header, HomePage strip, etc.
export const LIVE_COUNT   = MAPS_REGISTRY.filter(m => m.status === 'live').length
export const TOTAL_COUNT  = MAPS_REGISTRY.length