import React from 'react'

// ─── WORKER VISUAL ────────────────────────────────────────────────────────────
const WorkerVisual = () => (
  <svg viewBox="0 0 500 260" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
    <rect width="500" height="260" fill="#C8A96E"/>
    {Array.from({length:26},(_,i)=>(
      <line key={i} x1="0" y1={i*10} x2="500" y2={i*10} stroke="#B89558" strokeWidth="0.4" opacity="0.4"/>
    ))}
    <rect x="28" y="18" width="444" height="224" fill="#D4B578" stroke="#8B6B2A" strokeWidth="1" strokeDasharray="4,3"/>
    <rect x="34" y="24" width="432" height="212" fill="none" stroke="#8B6B2A" strokeWidth="0.4" opacity="0.5"/>
    <text x="250" y="52" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="11" fill="#3D2800" letterSpacing="5" fontWeight="bold">LABOUR EXPORT BUREAU</text>
    <text x="250" y="66" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="8" fill="#5C3D00" letterSpacing="3" opacity="0.7">KARACHI · ISLAMABAD · LAHORE</text>
    <line x1="48" y1="74" x2="452" y2="74" stroke="#8B6B2A" strokeWidth="0.8"/>
    <text x="110" y="92" fontFamily="'Courier New', monospace" fontSize="8" fill="#5C3D00" letterSpacing="1" opacity="0.7">WORKER ID</text>
    <text x="380" y="92" textAnchor="end" fontFamily="'Courier New', monospace" fontSize="8.5" fill="#3D2800" letterSpacing="1" fontWeight="bold">PKR-1947-MW</text>
    <line x1="106" y1="95" x2="390" y2="95" stroke="#8B6B2A" strokeWidth="0.3" strokeDasharray="2,3" opacity="0.4"/>
    <text x="110" y="110" fontFamily="'Courier New', monospace" fontSize="8" fill="#5C3D00" letterSpacing="1" opacity="0.7">DESTINATION</text>
    <text x="380" y="110" textAnchor="end" fontFamily="'Courier New', monospace" fontSize="8.5" fill="#3D2800" letterSpacing="1" fontWeight="bold">GULF STATES</text>
    <line x1="106" y1="113" x2="390" y2="113" stroke="#8B6B2A" strokeWidth="0.3" strokeDasharray="2,3" opacity="0.4"/>
    <text x="110" y="128" fontFamily="'Courier New', monospace" fontSize="8" fill="#5C3D00" letterSpacing="1" opacity="0.7">OCCUPATION</text>
    <text x="380" y="128" textAnchor="end" fontFamily="'Courier New', monospace" fontSize="8.5" fill="#3D2800" letterSpacing="1" fontWeight="bold">CONSTRUCTION</text>
    <line x1="106" y1="131" x2="390" y2="131" stroke="#8B6B2A" strokeWidth="0.3" strokeDasharray="2,3" opacity="0.4"/>
    <text x="110" y="146" fontFamily="'Courier New', monospace" fontSize="8" fill="#5C3D00" letterSpacing="1" opacity="0.7">MONTHLY WAGE</text>
    <text x="380" y="146" textAnchor="end" fontFamily="'Courier New', monospace" fontSize="8.5" fill="#3D2800" letterSpacing="1" fontWeight="bold">SAR 1,200</text>
    <line x1="106" y1="149" x2="390" y2="149" stroke="#8B6B2A" strokeWidth="0.3" strokeDasharray="2,3" opacity="0.4"/>
    <text x="110" y="164" fontFamily="'Courier New', monospace" fontSize="8" fill="#5C3D00" letterSpacing="1" opacity="0.7">REMITTANCE SENT</text>
    <text x="380" y="164" textAnchor="end" fontFamily="'Courier New', monospace" fontSize="8.5" fill="#3D2800" letterSpacing="1" fontWeight="bold">PKR 42,000</text>
    <rect x="48" y="172" width="404" height="22" fill="#8B6B2A" opacity="0.15"/>
    <text x="110" y="187" fontFamily="'Courier New', monospace" fontSize="9" fill="#3D2800" letterSpacing="2" fontWeight="bold">TOTAL WORKERS ABROAD</text>
    <text x="380" y="187" textAnchor="end" fontFamily="'Courier New', monospace" fontSize="9" fill="#3D2800" letterSpacing="1" fontWeight="bold">14,000,000</text>
    <g transform="translate(390,120) rotate(-22)">
      <rect x="-42" y="-18" width="84" height="36" rx="4" fill="none" stroke="#8B1A1A" strokeWidth="2.5" opacity="0.7"/>
      <text x="0" y="7" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="18" fill="#8B1A1A" letterSpacing="4" fontWeight="bold" opacity="0.65">PAID</text>
    </g>
    <line x1="48" y1="204" x2="452" y2="204" stroke="#8B6B2A" strokeWidth="0.8"/>
    <text x="110" y="220" fontFamily="'Courier New', monospace" fontSize="8" fill="#5C3D00" letterSpacing="1" opacity="0.7">1947 – 2024  ·  77 YEARS</text>
    <text x="380" y="220" textAnchor="end" fontFamily="'Courier New', monospace" fontSize="8" fill="#5C3D00" letterSpacing="1" opacity="0.7">$35B REMITTANCES / YR</text>
    {Array.from({length:50},(_,i)=>(
      <circle key={i} cx={i*10+5} cy="10" r="3.5" fill="#C8A96E"/>
    ))}
  </svg>
)

// ─── PARTITION VISUAL ─────────────────────────────────────────────────────────
const PartitionVisual = () => (
  <svg viewBox="0 0 500 260" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
    <rect width="260" height="260" fill="#1B4332"/>
    <rect x="240" width="260" height="260" fill="#92400E"/>
    {Array.from({length:13},(_,i)=>(
      <line key={`pg${i}`} x1="0" y1={i*20+10} x2="230" y2={i*20+10} stroke="#ffffff" strokeWidth="0.3" opacity="0.06"/>
    ))}
    {Array.from({length:13},(_,i)=>(
      <line key={`ig${i}`} x1="260" y1={i*20+10} x2="500" y2={i*20+10} stroke="#ffffff" strokeWidth="0.3" opacity="0.06"/>
    ))}
    <path d="M 248 0 L 245 18 L 252 32 L 242 48 L 255 60 L 244 76 L 258 88 L 246 102 L 254 116 L 241 130 L 257 144 L 243 158 L 252 172 L 239 186 L 256 200 L 244 214 L 250 228 L 243 244 L 252 260" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="8" opacity="0.4"/>
    <path d="M 248 0 L 245 18 L 252 32 L 242 48 L 255 60 L 244 76 L 258 88 L 246 102 L 254 116 L 241 130 L 257 144 L 243 158 L 252 172 L 239 186 L 256 200 L 244 214 L 250 228 L 243 244 L 252 260" fill="none" stroke="#F5F0E4" strokeWidth="3" opacity="0.9"/>
    <path d="M 248 0 L 245 18 L 252 32 L 242 48 L 255 60 L 244 76 L 258 88 L 246 102 L 254 116 L 241 130 L 257 144 L 243 158 L 252 172 L 239 186 L 256 200 L 244 214 L 250 228 L 243 244 L 252 260" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.6"/>
    <text x="120" y="48" textAnchor="middle" fontFamily="serif" fontSize="28" fill="#FFFFFF" opacity="0.18" fontWeight="bold">پاکستان</text>
    <text x="36" y="110" fontFamily="'Courier New', monospace" fontSize="8" fill="#A7C4A0" opacity="0.7" letterSpacing="2">LAHORE</text>
    <text x="36" y="126" fontFamily="'Courier New', monospace" fontSize="8" fill="#A7C4A0" opacity="0.5" letterSpacing="2">WEST PUNJAB</text>
    <text x="36" y="160" fontFamily="serif" fontSize="10" fill="#D4EAD0" opacity="0.55" fontStyle="italic">"Woh subah kabhi toh aayegi"</text>
    <text x="36" y="174" fontFamily="serif" fontSize="8" fill="#A7C4A0" opacity="0.4" fontStyle="italic">that dawn will come, someday</text>
    <text x="36" y="220" fontFamily="'Courier New', monospace" fontSize="22" fill="#FFFFFF" opacity="0.15" fontWeight="bold">14.5M</text>
    <text x="36" y="236" fontFamily="'Courier New', monospace" fontSize="7" fill="#A7C4A0" opacity="0.5" letterSpacing="2">DISPLACED</text>
    <text x="370" y="48" textAnchor="middle" fontFamily="serif" fontSize="28" fill="#FFFFFF" opacity="0.12" fontWeight="bold">भारत</text>
    <text x="270" y="110" fontFamily="'Courier New', monospace" fontSize="8" fill="#F5CBA0" opacity="0.7" letterSpacing="2">AMRITSAR</text>
    <text x="270" y="126" fontFamily="'Courier New', monospace" fontSize="8" fill="#F5CBA0" opacity="0.5" letterSpacing="2">EAST PUNJAB</text>
    <text x="270" y="160" fontFamily="serif" fontSize="10" fill="#F5DFC0" opacity="0.55" fontStyle="italic">"Yeh daag daag ujala"</text>
    <text x="270" y="174" fontFamily="serif" fontSize="8" fill="#F5CBA0" opacity="0.4" fontStyle="italic">this stained, tarnished light</text>
    <text x="270" y="220" fontFamily="'Courier New', monospace" fontSize="22" fill="#FFFFFF" opacity="0.12" fontWeight="bold">1.3M</text>
    <text x="270" y="236" fontFamily="'Courier New', monospace" fontSize="7" fill="#F5CBA0" opacity="0.5" letterSpacing="2">MISSING</text>
    <text x="250" y="258" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="7" fill="#FFFFFF" opacity="0.3" letterSpacing="3">AUGUST 1947</text>
  </svg>
)

// ─── PALESTINE VISUAL ─────────────────────────────────────────────────────────
const PalestineVisual = () => (
  <svg viewBox="0 0 500 260" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
    <rect width="500" height="260" fill="#1C2410"/>
    {Array.from({length:26},(_,i)=>(
      <line key={i} x1="0" y1={i*10} x2="500" y2={i*10} stroke="#2A3418" strokeWidth="0.6"/>
    ))}
    <circle cx="185" cy="118" r="62" fill="none" stroke="#C9A84A" strokeWidth="8" opacity="0.9"/>
    <circle cx="185" cy="118" r="46" fill="none" stroke="#C9A84A" strokeWidth="2" opacity="0.3"/>
    <rect x="225" y="113" width="140" height="10" rx="2" fill="#C9A84A" opacity="0.9"/>
    <rect x="318" y="123" width="12" height="22" rx="2" fill="#C9A84A" opacity="0.9"/>
    <rect x="338" y="123" width="12" height="16" rx="2" fill="#C9A84A" opacity="0.9"/>
    <rect x="358" y="123" width="12" height="20" rx="2" fill="#C9A84A" opacity="0.9"/>
    <circle cx="185" cy="118" r="18" fill="#1C2410"/>
    <rect x="179" y="118" width="12" height="24" rx="2" fill="#1C2410"/>
    <circle cx="185" cy="118" r="80" fill="#C9A84A" opacity="0.04"/>
    <text x="185" y="30" textAnchor="middle" fontFamily="serif" fontSize="14" fill="#C9A84A" opacity="0.8" letterSpacing="1">حق العودة</text>
    <text x="185" y="48" textAnchor="middle" fontFamily="serif" fontSize="9" fill="#8BAA66" opacity="0.6" fontStyle="italic">The Right of Return</text>
    <text x="420" y="58" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="7.5" fill="#8BAA66" opacity="0.7" letterSpacing="2">LAND LOST</text>
    <text x="445" y="78" textAnchor="end" fontFamily="'Courier New', monospace" fontSize="7" fill="#8BAA66" opacity="0.6">1917</text>
    <rect x="450" y="70" width="42" height="8" rx="1" fill="#4A7C3F" opacity="0.85"/>
    <text x="445" y="98" textAnchor="end" fontFamily="'Courier New', monospace" fontSize="7" fill="#8BAA66" opacity="0.6">1948</text>
    <rect x="450" y="90" width="24" height="8" rx="1" fill="#4A7C3F" opacity="0.75"/>
    <text x="445" y="118" textAnchor="end" fontFamily="'Courier New', monospace" fontSize="7" fill="#8BAA66" opacity="0.6">1967</text>
    <rect x="450" y="110" width="12" height="8" rx="1" fill="#4A7C3F" opacity="0.65"/>
    <text x="445" y="138" textAnchor="end" fontFamily="'Courier New', monospace" fontSize="7" fill="#C9A84A" opacity="0.9">NOW</text>
    <rect x="450" y="130" width="5" height="8" rx="1" fill="#8B1A1A" opacity="0.9"/>
    <text x="456" y="138" fontFamily="'Courier New', monospace" fontSize="7" fill="#8B1A1A" opacity="0.9">13%</text>
    <text x="50" y="215" fontFamily="serif" fontSize="14" fill="#C9A84A" opacity="0.5" direction="rtl">میں نہیں مانتا، میں نہیں مانتا</text>
    <text x="50" y="234" fontFamily="serif" fontSize="8.5" fill="#8BAA66" opacity="0.45" fontStyle="italic">I do not accept it — Habib Jalib, Dastoor</text>
    <text x="50" y="175" fontFamily="'Courier New', monospace" fontSize="28" fill="#C9A84A" opacity="0.1" fontWeight="bold">7M+</text>
    <text x="50" y="192" fontFamily="'Courier New', monospace" fontSize="7" fill="#8BAA66" opacity="0.45" letterSpacing="2">IN DIASPORA</text>
  </svg>
)

// ─── CRICKET VISUAL ──────────────────────────────────────────────────────────
const CricketVisual = () => (
  <svg viewBox="0 0 500 260" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
    <rect width="500" height="260" fill="#1A3A0E"/>
    {Array.from({length:25},(_,i)=>(
      <rect key={i} x={i*20} y="0" width="10" height="260" fill="#1E4010" opacity="0.6"/>
    ))}
    <ellipse cx="250" cy="130" rx="210" ry="110" fill="none" stroke="#2D5A1B" strokeWidth="2" opacity="0.8"/>
    <ellipse cx="250" cy="130" rx="210" ry="110" fill="#1E4410" opacity="0.3"/>
    <rect x="190" y="72" width="120" height="116" rx="2" fill="#4A7A2A" opacity="0.7"/>
    <rect x="190" y="72" width="120" height="116" rx="2" fill="none" stroke="#5A8A3A" strokeWidth="1" opacity="0.6"/>
    <line x1="190" y1="97" x2="310" y2="97" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.7"/>
    <line x1="190" y1="163" x2="310" y2="163" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.7"/>
    <line x1="236" y1="78" x2="236" y2="96" stroke="#D4B570" strokeWidth="2.5"/>
    <line x1="250" y1="78" x2="250" y2="96" stroke="#D4B570" strokeWidth="2.5"/>
    <line x1="264" y1="78" x2="264" y2="96" stroke="#D4B570" strokeWidth="2.5"/>
    <line x1="236" y1="164" x2="236" y2="182" stroke="#D4B570" strokeWidth="2.5"/>
    <line x1="250" y1="164" x2="250" y2="182" stroke="#D4B570" strokeWidth="2.5"/>
    <line x1="264" y1="164" x2="264" y2="182" stroke="#D4B570" strokeWidth="2.5"/>
    <ellipse cx="130" cy="90" rx="90" ry="60" fill="#8B1A1A" opacity="0.22"/>
    <text x="100" y="86" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="8" fill="#FFAAAA" opacity="0.6" letterSpacing="1">LORD'S</text>
    <text x="100" y="98" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="7" fill="#FFAAAA" opacity="0.4" letterSpacing="1">1877</text>
    <path d="M 96 90 Q 250 30 390 150" fill="none" stroke="#C9A84A" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.7"/>
    <polygon points="382,143 396,152 384,158" fill="#C9A84A" opacity="0.7"/>
    <ellipse cx="390" cy="155" rx="75" ry="50" fill="#C9A84A" opacity="0.14"/>
    <text x="390" y="152" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="8" fill="#C9A84A" opacity="0.8" letterSpacing="1">MUMBAI</text>
    <text x="390" y="164" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="7" fill="#C9A84A" opacity="0.5" letterSpacing="1">₹ IPL TODAY</text>
    <circle cx="250" cy="130" r="10" fill="#8B1A1A" opacity="0.85"/>
    <path d="M 244 124 Q 247 130 244 136" fill="none" stroke="#D4B570" strokeWidth="0.8" opacity="0.7"/>
    <path d="M 256 124 Q 253 130 256 136" fill="none" stroke="#D4B570" strokeWidth="0.8" opacity="0.7"/>
    <text x="250" y="248" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="8" fill="#C9A84A" opacity="0.5" letterSpacing="2">1983 · THE COLONIES TOOK IT BACK</text>
  </svg>
)

// ─── HAJJ VISUAL ─────────────────────────────────────────────────────────────
const HajjVisual = () => (
  <svg viewBox="0 0 500 260" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
    <rect width="500" height="260" fill="#12100A"/>
    {[42,88,130,178,220,290,338,380,420,460,60,112,168,232,295,344,398,448,480,30,85,145,210,265,320,372,432,490,55,118,182,244,308,365,415,465].map((x,i)=>{
      const ys=[22,45,18,34,12,28,15,42,20,35,70,82,58,75,62,78,55,68,80,108,120,95,118,100,115,98,112,125,148,162,140,158,145,160,142,155]
      return <circle key={i} cx={x} cy={ys[i]||30} r={i%5===0?1.2:0.7} fill="#C9B88A" opacity="0.2"/>
    })}
    {[90,76,62,50,38].map((r,i)=>(
      <circle key={i} cx="250" cy="128" r={r} fill="none" stroke="#C9B88A" strokeWidth={0.6-i*0.08} opacity={0.35-i*0.05}/>
    ))}
    <circle r="3" fill="#C9B88A" opacity="0.8">
      <animateMotion dur="6s" repeatCount="indefinite" path="M 340,128 A 90,90 0 1,1 339,128"/>
    </circle>
    <circle r="2.5" fill="#C4935A" opacity="0.7">
      <animateMotion dur="8s" repeatCount="indefinite" path="M 326,128 A 76,76 0 1,0 327,128"/>
    </circle>
    <circle r="2" fill="#FFFFFF" opacity="0.5">
      <animateMotion dur="5s" repeatCount="indefinite" path="M 312,128 A 62,62 0 1,1 311,128"/>
    </circle>
    <rect x="206" y="94" width="88" height="88" fill="#0A0806" stroke="#C9B88A" strokeWidth="1.5"/>
    <polygon points="206,94 250,76 294,94 250,94" fill="#1A1612" stroke="#C9B88A" strokeWidth="1.2"/>
    <polygon points="294,94 338,76 338,140 294,182" fill="#080604" stroke="#C9B88A" strokeWidth="1.2" opacity="0.8"/>
    <rect x="206" y="134" width="88" height="12" fill="none" stroke="#C9B88A" strokeWidth="0.8" opacity="0.6"/>
    <line x1="206" y1="140" x2="294" y2="140" stroke="#C9B88A" strokeWidth="1.5" opacity="0.7"/>
    <text x="250" y="154" textAnchor="middle" fontFamily="serif" fontSize="9" fill="#C9B88A" opacity="0.6">لا إله إلا الله</text>
    <ellipse cx="210" cy="138" rx="6" ry="5" fill="#2A1F14" stroke="#C9B88A" strokeWidth="0.8"/>
    <text x="250" y="234" textAnchor="middle" fontFamily="serif" fontSize="16" fill="#C9B88A" opacity="0.55" letterSpacing="2">لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ</text>
    <text x="250" y="250" textAnchor="middle" fontFamily="serif" fontSize="8" fill="#C9B88A" opacity="0.3" fontStyle="italic">Here I am, O Lord, Here I am</text>
    <text x="50" y="46" fontFamily="'Courier New', monospace" fontSize="24" fill="#C9B88A" opacity="0.1" fontWeight="bold">2.5M</text>
    <text x="50" y="60" fontFamily="'Courier New', monospace" fontSize="7" fill="#C9B88A" opacity="0.4" letterSpacing="2">PILGRIMS · 2024</text>
  </svg>
)

// ─── TURTLE VISUAL ───────────────────────────────────────────────────────────
const TurtleVisual = () => (
  <svg viewBox="0 0 500 260" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
    <rect width="500" height="260" fill="#042218"/>
    {Array.from({length:13},(_,i)=>(
      <line key={`h${i}`} x1="0" y1={i*20} x2="500" y2={i*20} stroke="#0A3828" strokeWidth="0.6"/>
    ))}
    {Array.from({length:25},(_,i)=>(
      <line key={`v${i}`} x1={i*20} y1="0" x2={i*20} y2="260" stroke="#0A3828" strokeWidth="0.6"/>
    ))}
    <ellipse cx="250" cy="130" rx="200" ry="90" fill="none" stroke="#0D4030" strokeWidth="1" opacity="0.6"/>
    <ellipse cx="250" cy="130" rx="155" ry="68" fill="none" stroke="#0D4030" strokeWidth="0.8" opacity="0.5"/>
    <ellipse cx="250" cy="130" rx="110" ry="48" fill="none" stroke="#105038" strokeWidth="0.8" opacity="0.5"/>
    <path d="M 55 195 Q 80 210 110 200 Q 145 188 165 175 Q 190 160 215 145 Q 240 130 260 118 Q 282 108 305 100 Q 330 92 355 88 Q 380 82 410 78 Q 435 74 460 68" fill="none" stroke="#4ade80" strokeWidth="8" strokeLinecap="round" opacity="0.12"/>
    <path d="M 55 195 Q 80 210 110 200 Q 145 188 165 175 Q 190 160 215 145 Q 240 130 260 118 Q 282 108 305 100 Q 330 92 355 88 Q 380 82 410 78 Q 435 74 460 68" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" opacity="0.85"/>
    {[[55,195],[110,200],[165,175],[215,145],[260,118],[305,100],[355,88],[410,78],[460,68]].map(([x,y],i)=>(
      <g key={i}>
        <circle cx={x} cy={y} r="3.5" fill="#4ade80" opacity="0.9"/>
        <circle cx={x} cy={y} r="7" fill="none" stroke="#4ade80" strokeWidth="0.6" opacity="0.3"/>
      </g>
    ))}
    <circle r="6" fill="#16a34a" opacity="0.9">
      <animateMotion dur="8s" repeatCount="indefinite" path="M 55 195 Q 80 210 110 200 Q 145 188 165 175 Q 190 160 215 145 Q 240 130 260 118 Q 282 108 305 100 Q 330 92 355 88 Q 380 82 410 78 Q 435 74 460 68"/>
    </circle>
    <circle r="12" fill="none" stroke="#4ade80" strokeWidth="1" opacity="0.4">
      <animateMotion dur="8s" repeatCount="indefinite" path="M 55 195 Q 80 210 110 200 Q 145 188 165 175 Q 190 160 215 145 Q 240 130 260 118 Q 282 108 305 100 Q 330 92 355 88 Q 380 82 410 78 Q 435 74 460 68"/>
    </circle>
    <circle cx="55" cy="195" r="10" fill="none" stroke="#4ade80" strokeWidth="0.8" opacity="0.3">
      <animate attributeName="r" values="10;35;10" dur="3s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.4;0;0.4" dur="3s" repeatCount="indefinite"/>
    </circle>
    <text x="42" y="215" fontFamily="'Courier New', monospace" fontSize="7" fill="#4ade80" opacity="0.6" letterSpacing="1">NATAL</text>
    <text x="42" y="224" fontFamily="'Courier New', monospace" fontSize="7" fill="#4ade80" opacity="0.4" letterSpacing="1">BEACH</text>
    <text x="448" y="60" fontFamily="'Courier New', monospace" fontSize="7" fill="#4ade80" opacity="0.6" letterSpacing="1">FEED</text>
    <text x="448" y="70" fontFamily="'Courier New', monospace" fontSize="7" fill="#4ade80" opacity="0.4" letterSpacing="1">GROUND</text>
    <rect x="310" y="175" width="175" height="65" rx="3" fill="#020e07" opacity="0.8" stroke="#4ade80" strokeWidth="0.6"/>
    <text x="322" y="191" fontFamily="'Courier New', monospace" fontSize="7" fill="#4ade80" opacity="0.8" letterSpacing="1">TAG: GLF-2024-047</text>
    <text x="322" y="204" fontFamily="'Courier New', monospace" fontSize="7" fill="#4ade80" opacity="0.6" letterSpacing="1">DIST: 6,247 MI</text>
    <text x="322" y="217" fontFamily="'Courier New', monospace" fontSize="7" fill="#4ade80" opacity="0.6" letterSpacing="1">SPP: CARETTA CARETTA</text>
    <text x="322" y="230" fontFamily="'Courier New', monospace" fontSize="7" fill="#4ade80" opacity="0.5" letterSpacing="1">STATUS: ENDANGERED</text>
    <text x="20" y="40" fontFamily="'Courier New', monospace" fontSize="26" fill="#4ade80" opacity="0.08" fontWeight="bold">100M YRS</text>
    <text x="20" y="58" fontFamily="'Courier New', monospace" fontSize="8" fill="#4ade80" opacity="0.4" letterSpacing="2">OF NAVIGATION</text>
  </svg>
)

// ─── CHAGAI VISUAL ───────────────────────────────────────────────────────────
const ChagaiVisual = () => (
  <svg viewBox="0 0 500 260" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
    <defs>
      <style>{`
        @keyframes cr1anim { 0% { r: 0; opacity: 0.8; } 100% { r: 55; opacity: 0; } }
        @keyframes cr2anim { 0% { r: 0; opacity: 0.55; } 100% { r: 75; opacity: 0; } }
        @keyframes cr3anim { 0% { r: 0; opacity: 0.35; } 100% { r: 95; opacity: 0; } }
        .cr1 { animation: cr1anim 2.8s ease-out infinite; }
        .cr2 { animation: cr2anim 2.8s ease-out 0.55s infinite; }
        .cr3 { animation: cr3anim 2.8s ease-out 1.1s infinite; }
      `}</style>
    </defs>
    <rect width="500" height="260" fill="#E8DFC8"/>
    {Array.from({length:26},(_,i)=>(
      <line key={i} x1="0" y1={i*10} x2="500" y2={i*10} stroke="#CFC4AC" strokeWidth="0.4" opacity="0.5"/>
    ))}
    {Array.from({length:10},(_,i)=>(
      <line key={`v${i}`} x1={i*50} y1="0" x2={i*50} y2="260" stroke="#CFC4AC" strokeWidth="0.3" opacity="0.3"/>
    ))}
    <rect x="20" y="14" width="460" height="232" fill="none" stroke="#9A8A6A" strokeWidth="0.8" strokeDasharray="5,3" opacity="0.5"/>
    <g transform="translate(250,42) rotate(-4)">
      <rect x="-108" y="-18" width="216" height="36" rx="4" fill="none" stroke="#8B1A1A" strokeWidth="3" opacity="0.8"/>
      <text x="0" y="8" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="18" fill="#8B1A1A" letterSpacing="5" fontWeight="bold" opacity="0.75">DECLASSIFIED</text>
    </g>
    <ellipse cx="185" cy="148" rx="80" ry="72" fill="#2A2520" opacity="0.82"/>
    <ellipse cx="162" cy="162" rx="38" ry="35" fill="#3A3028" opacity="0.65"/>
    <ellipse cx="208" cy="110" rx="20" ry="14" fill="#3A3028" opacity="0.55"/>
    <text x="185" y="145" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="9" fill="#E8DFC8" letterSpacing="3" opacity="0.8">PAK</text>
    <ellipse cx="330" cy="155" rx="65" ry="78" fill="#C4A882" opacity="0.38"/>
    <text x="330" y="157" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="9" fill="#7A5A3A" letterSpacing="3" opacity="0.7">IND</text>
    <circle className="cr1" cx="162" cy="165" fill="none" stroke="#8B6B2A" strokeWidth="2" r="0"/>
    <circle className="cr2" cx="162" cy="165" fill="none" stroke="#8B6B2A" strokeWidth="1.2" r="0"/>
    <circle className="cr3" cx="162" cy="165" fill="none" stroke="#8B6B2A" strokeWidth="0.7" r="0"/>
    <circle cx="162" cy="165" r="6" fill="#8B6B2A"/>
    <line x1="162" y1="155" x2="162" y2="175" stroke="#8B6B2A" strokeWidth="0.8" opacity="0.6"/>
    <line x1="152" y1="165" x2="172" y2="165" stroke="#8B6B2A" strokeWidth="0.8" opacity="0.6"/>
    <circle cx="310" cy="120" r="5" fill="#8B1A1A" opacity="0.9"/>
    <circle cx="310" cy="120" r="5" fill="none" stroke="#8B1A1A" strokeWidth="0.8">
      <animate attributeName="r" values="5;16;5" dur="2.8s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.6;0;0.6" dur="2.8s" repeatCount="indefinite"/>
    </circle>
    <line x1="162" y1="165" x2="110" y2="198" stroke="#8B6B2A" strokeWidth="0.6" strokeDasharray="2,2" opacity="0.6"/>
    <text x="106" y="206" textAnchor="end" fontFamily="'Courier New', monospace" fontSize="7" fill="#8B6B2A" letterSpacing="1">CHAGAI</text>
    <line x1="310" y1="120" x2="368" y2="90" stroke="#8B1A1A" strokeWidth="0.6" strokeDasharray="2,2" opacity="0.6"/>
    <text x="372" y="88" fontFamily="'Courier New', monospace" fontSize="7" fill="#8B1A1A" letterSpacing="1">POKHRAN</text>
    <rect x="0" y="212" width="500" height="48" fill="#1A1814"/>
    <line x1="25" y1="234" x2="475" y2="234" stroke="#3A3830" strokeWidth="0.6"/>
    {Array.from({length:30},(_,i)=>(
      <line key={i} x1={25+i*15} y1="231" x2={25+i*15} y2="237" stroke="#3A3830" strokeWidth="0.4"/>
    ))}
    <polyline points="75,234 77,226 79,213 81,226 83,234" fill="none" stroke="#8B1A1A" strokeWidth="2" strokeLinejoin="round"/>
    <polyline points="105,234 107,229 109,219 111,229 113,234" fill="none" stroke="#8B1A1A" strokeWidth="1.6" strokeLinejoin="round"/>
    <polyline points="280,234 282,226 284,211 286,226 288,234" fill="none" stroke="#C9B88A" strokeWidth="2.5" strokeLinejoin="round"/>
    <polyline points="298,234 300,227 302,214 304,227 306,234" fill="none" stroke="#C9B88A" strokeWidth="2.2" strokeLinejoin="round"/>
    <polyline points="316,234 318,227 320,216 322,227 324,234" fill="none" stroke="#C9B88A" strokeWidth="2" strokeLinejoin="round"/>
    <polyline points="334,234 336,228 338,218 340,228 342,234" fill="none" stroke="#C9B88A" strokeWidth="1.8" strokeLinejoin="round"/>
    <polyline points="352,234 354,228 356,219 358,228 360,234" fill="none" stroke="#C9B88A" strokeWidth="1.6" strokeLinejoin="round"/>
    <text x="89" y="252" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="7" fill="#8B1A1A" opacity="0.8">MAY 11–13</text>
    <text x="320" y="252" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="7" fill="#C9B88A" opacity="0.8">MAY 28–30 · ×6</text>
    <text x="430" y="205" fontFamily="serif" fontSize="52" fontWeight="900" fill="#1A1814" opacity="0.06">1998</text>
  </svg>
)

// ─── EUROPE REWRITTEN VISUAL ──────────────────────────────────────────────────
const EuropeVisual = () => (
  <svg viewBox="0 0 500 260" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
    <rect width="500" height="260" fill="#E4DDD0"/>
    {Array.from({length:26},(_,i)=>(
      <line key={i} x1="0" y1={i*10} x2="500" y2={i*10} stroke="#CFC6B5" strokeWidth="0.4" opacity="0.5"/>
    ))}
    <text x="250" y="26" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="8" fill="#3A3020" letterSpacing="4" opacity="0.5">VERWALTUNGSDOKUMENT — EUROPA 1942</text>
    <line x1="30" y1="32" x2="470" y2="32" stroke="#8A7A5A" strokeWidth="0.6" opacity="0.4"/>
    {[
      ['Praha','Prag',60,60],
      ['Brno','Brünn',60,90],
      ['Bratislava','Pressburg',60,120],
      ['Gdańsk','Danzig',60,150],
      ['Łódź','Litzmannstadt',60,180],
    ].map(([orig,nw,x,y])=>(
      <g key={orig}>
        <text x={x} y={y} fontFamily="'Courier New', monospace" fontSize="13" fill="#3A3020" opacity="0.55">{orig}</text>
        <line x1={x} y1={y-3} x2={x+orig.length*8} y2={y-3} stroke="#8B1A1A" strokeWidth="1.8" opacity="0.7"/>
        <text x={x} y={y+16} fontFamily="'Courier New', monospace" fontSize="11" fill="#8B1A1A" opacity="0.85" fontWeight="bold">{nw}</text>
      </g>
    ))}
    {[
      ['Vilnius','Wilna',270,60],
      ['Kraków','Krakau',270,90],
      ['Tallinn','Reval',270,120],
      ['Ljubljana','Laibach',270,150],
      ['Chernivtsi','Czernowitz',270,180],
    ].map(([orig,nw,x,y])=>(
      <g key={orig}>
        <text x={x} y={y} fontFamily="'Courier New', monospace" fontSize="13" fill="#3A3020" opacity="0.55">{orig}</text>
        <line x1={x} y1={y-3} x2={x+orig.length*8} y2={y-3} stroke="#8B1A1A" strokeWidth="1.8" opacity="0.7"/>
        <text x={x} y={y+16} fontFamily="'Courier New', monospace" fontSize="11" fill="#8B1A1A" opacity="0.85" fontWeight="bold">{nw}</text>
      </g>
    ))}
    <line x1="245" y1="40" x2="245" y2="208" stroke="#8A7A5A" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.3"/>
    <text x="250" y="180" textAnchor="middle" fontFamily="serif" fontSize="120" fill="#3A3020" opacity="0.04" fontWeight="bold">✠</text>
    <line x1="30" y1="210" x2="470" y2="210" stroke="#8A7A5A" strokeWidth="0.6" opacity="0.4"/>
    <text x="50" y="226" fontFamily="'Courier New', monospace" fontSize="8" fill="#3A3020" opacity="0.45" letterSpacing="1">60+ PLACES RENAMED</text>
    <text x="50" y="240" fontFamily="'Courier New', monospace" fontSize="8" fill="#3A3020" opacity="0.35" letterSpacing="1">17 COUNTRIES · 1938–1945</text>
    <text x="450" y="240" textAnchor="end" fontFamily="'Courier New', monospace" fontSize="8" fill="#8B1A1A" opacity="0.45" letterSpacing="1">11 CHAPTERS</text>
  </svg>
)

// ─── POLITICAL DNA VISUAL ─────────────────────────────────────────────────────
const PoliticalVisual = () => (
  <svg viewBox="0 0 500 260" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
    <rect width="500" height="260" fill="#1A1E14"/>
    {Array.from({length:26},(_,i)=>(
      <line key={i} x1="0" y1={i*10} x2="500" y2={i*10} stroke="#242C1C" strokeWidth="0.5"/>
    ))}
    {Array.from({length:25},(_,i)=>(
      <line key={`v${i}`} x1={i*20} y1="0" x2={i*20} y2="260" stroke="#242C1C" strokeWidth="0.4"/>
    ))}
    <ellipse cx="125" cy="118" rx="52" ry="38" fill="#5A8A7A" opacity="0.08"/>
    <ellipse cx="158" cy="168" rx="28" ry="40" fill="#8AAF7A" opacity="0.07"/>
    <ellipse cx="258" cy="108" rx="44" ry="30" fill="#5A8A7A" opacity="0.08"/>
    <ellipse cx="272" cy="158" rx="32" ry="44" fill="#B85C3A" opacity="0.07"/>
    <ellipse cx="325" cy="118" rx="22" ry="16" fill="#7A5A8A" opacity="0.08"/>
    <ellipse cx="342" cy="95" rx="58" ry="22" fill="#8A2A2A" opacity="0.07"/>
    <ellipse cx="398" cy="125" rx="52" ry="34" fill="#8A2A2A" opacity="0.06"/>
    <ellipse cx="425" cy="185" rx="28" ry="18" fill="#5A8A7A" opacity="0.08"/>
    <text x="24" y="28" fontFamily="'Courier New', monospace" fontSize="7" fill="#6A7A5A" letterSpacing="3" opacity="0.8">POLITICAL SYSTEM INDEX — CLASSIFIED</text>
    <line x1="20" y1="33" x2="480" y2="33" stroke="#3A4A2A" strokeWidth="0.6" opacity="0.6"/>
    {[
      ['LIBERAL DEMOCRACY',    '#5A8A7A', 80, 48],
      ['ELECTORAL DEMOCRACY',  '#8AAF7A', 68, 63],
      ['HYBRID REGIME',        '#C4A84A', 52, 78],
      ['AUTHORITARIAN',        '#B85C3A', 65, 93],
      ['COMMUNIST STATE',      '#8A2A2A', 28, 108],
      ['CONST. MONARCHY',      '#4A6A9A', 44, 123],
      ['MILITARY GOVT',        '#7A8A8A', 22, 138],
      ['THEOCRATIC',           '#7A5A8A', 14, 153],
    ].map(([label, color, pct, y]) => (
      <g key={label}>
        <text x="24" y={y} fontFamily="'Courier New', monospace" fontSize="7" fill="#8A9A7A" opacity="0.65" letterSpacing="0.5">{label}</text>
        <rect x="200" y={y-9} width="240" height="8" rx="1" fill="#2A3020" opacity="0.6"/>
        <rect x="200" y={y-9} width={pct*2.4} height="8" rx="1" fill={color} opacity="0.75"/>
        <text x={200+pct*2.4+5} y={y} fontFamily="'Courier New', monospace" fontSize="7" fill={color} opacity="0.8">{pct}</text>
      </g>
    ))}
    <line x1="20" y1="163" x2="480" y2="163" stroke="#3A4A2A" strokeWidth="0.5" opacity="0.5"/>
    <text x="24" y="188" fontFamily="'Courier New', monospace" fontSize="7" fill="#6A7A5A" opacity="0.6" letterSpacing="2">CURRENT YEAR</text>
    <text x="140" y="188" fontFamily="'Courier New', monospace" fontSize="7" fill="#8AAF7A" opacity="0.9" letterSpacing="2">
      1900
      <animate attributeName="textContent" values="1900;1920;1938;1950;1965;1980;1995;2010;2026" dur="8s" repeatCount="indefinite"/>
    </text>
    <text x="24" y="208" fontFamily="'Courier New', monospace" fontSize="7" fill="#6A7A5A" opacity="0.6" letterSpacing="2">DEMOCRACIES</text>
    <rect x="140" y="199" width="320" height="7" rx="1" fill="#2A3020"/>
    <rect x="140" y="199" width="170" height="7" rx="1" fill="#5A8A7A" opacity="0.8">
      <animate attributeName="width" values="40;90;50;100;130;150;250;270;230" dur="8s" repeatCount="indefinite"/>
    </rect>
    <text x="24" y="224" fontFamily="'Courier New', monospace" fontSize="7" fill="#6A7A5A" opacity="0.6" letterSpacing="2">AUTOCRACIES</text>
    <rect x="140" y="215" width="320" height="7" rx="1" fill="#2A3020"/>
    <rect x="140" y="215" width="200" height="7" rx="1" fill="#B85C3A" opacity="0.7">
      <animate attributeName="width" values="180;140;180;160;250;280;200;210;240" dur="8s" repeatCount="indefinite"/>
    </rect>
    <text x="24" y="244" fontFamily="'Courier New', monospace" fontSize="26" fill="#5A8A7A" opacity="0.07" fontWeight="bold">195</text>
    <text x="24" y="254" fontFamily="'Courier New', monospace" fontSize="7" fill="#6A7A5A" opacity="0.4" letterSpacing="2">COUNTRIES · 126 YEARS</text>
    <text x="470" y="254" textAnchor="end" fontFamily="'Courier New', monospace" fontSize="7" fill="#B85C3A" opacity="0.4" letterSpacing="1">5 CHAPTERS</text>
  </svg>
)

// ─── DINOSAUR VISUAL ─────────────────────────────────────────────────────────
const DinosaurVisual = () => (
  <svg viewBox="0 0 500 260" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
    <defs>
      <style>{`
        @keyframes dinoImpact { 0% { r: 0; opacity: 0.7; } 100% { r: 70; opacity: 0; } }
        @keyframes dinoImpact2 { 0% { r: 0; opacity: 0.45; } 100% { r: 100; opacity: 0; } }
        @keyframes dinoFloat { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-5px); } }
        .dino-cr1 { animation: dinoImpact  3.2s ease-out infinite; }
        .dino-cr2 { animation: dinoImpact2 3.2s ease-out 0.7s infinite; }
      `}</style>
      <radialGradient id="dinoGlow" cx="50%" cy="55%" r="60%">
        <stop offset="0%" stopColor="#6B2A0A" stopOpacity="0.45"/>
        <stop offset="100%" stopColor="#0C0804" stopOpacity="0"/>
      </radialGradient>
    </defs>
    <rect width="500" height="260" fill="#0C0804"/>
    {Array.from({length:26},(_,i)=>(
      <line key={i} x1="0" y1={i*10} x2="500" y2={i*10} stroke="#1A1008" strokeWidth="0.5"/>
    ))}
    {Array.from({length:25},(_,i)=>(
      <line key={`v${i}`} x1={i*20} y1="0" x2={i*20} y2="260" stroke="#1A1008" strokeWidth="0.4"/>
    ))}
    <rect width="500" height="260" fill="url(#dinoGlow)"/>
    <ellipse cx="210" cy="145" rx="100" ry="72" fill="#2A1E0E" opacity="0.9"/>
    <ellipse cx="240" cy="118" rx="68" ry="50" fill="#352818" opacity="0.75"/>
    <ellipse cx="175" cy="162" rx="52" ry="36" fill="#2A1E0E" opacity="0.65"/>
    <ellipse cx="268" cy="150" rx="38" ry="28" fill="#2A1E0E" opacity="0.6"/>
    <path d="M 140 130 Q 180 110 230 120 Q 270 128 300 145" fill="none" stroke="#3A2818" strokeWidth="1" opacity="0.5"/>
    <path d="M 160 160 Q 195 148 235 155 Q 262 160 282 170" fill="none" stroke="#3A2818" strokeWidth="0.8" opacity="0.4"/>
    <g transform="translate(348, 108)">
      <ellipse cx="0" cy="18" rx="22" ry="13" fill="#8B2A1A" opacity="0.9"/>
      <ellipse cx="21" cy="8"  rx="14" ry="8"  fill="#8B2A1A" opacity="0.95"/>
      <path d="M 12 12 L 35 12 L 31 17 L 16 17 Z" fill="#7A1A0A" opacity="0.9"/>
      <circle cx="27" cy="6.5" r="2.5" fill="#1a0505"/>
      <circle cx="27.8" cy="6"   r="1"   fill="#E8A040" opacity="0.85"/>
      <path d="M -21 22 Q -40 28 -48 20" fill="none" stroke="#8B2A1A" strokeWidth="7" strokeLinecap="round"/>
      <line x1="-4" y1="30" x2="-8"  y2="48" stroke="#8B2A1A" strokeWidth="5" strokeLinecap="round"/>
      <line x1=" 8" y1="30" x2="12"  y2="48" stroke="#8B2A1A" strokeWidth="5" strokeLinecap="round"/>
      <line x1="12" y1="13" x2="18"  y2="19" stroke="#8B2A1A" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="0" cy="14" r="28" fill="none" stroke="#8B2A1A" strokeWidth="1" opacity="0">
        <animate attributeName="r"       values="28;56;28"   dur="3.2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.25;0;0.25" dur="3.2s" repeatCount="indefinite"/>
      </circle>
    </g>
    <g transform="translate(108, 155)" opacity="0.55">
      <ellipse cx="0" cy="0"    rx="28" ry="13" fill="#6B8A4A"/>
      <ellipse cx="-22" cy="-4" rx="11" ry="7"  fill="#6B8A4A"/>
      <path d="M 26 -6 Q 50 -22 58 -40" fill="none" stroke="#6B8A4A" strokeWidth="7" strokeLinecap="round"/>
      <ellipse cx="58" cy="-42" rx="6" ry="4" fill="#6B8A4A"/>
      <path d="M -34 -2 Q -50 4 -56 0" fill="none" stroke="#6B8A4A" strokeWidth="5" strokeLinecap="round"/>
      <line x1="-12" y1="12" x2="-16" y2="26" stroke="#6B8A4A" strokeWidth="4" strokeLinecap="round"/>
      <line x1="  2" y1="12" x2="  4" y2="26" stroke="#6B8A4A" strokeWidth="4" strokeLinecap="round"/>
      <line x1=" 14" y1="12" x2=" 17" y2="26" stroke="#6B8A4A" strokeWidth="4" strokeLinecap="round"/>
    </g>
    <g transform="translate(430, 168)" opacity="0.6">
      <ellipse cx="0" cy="10" rx="12" ry="7" fill="#8B2A1A"/>
      <ellipse cx="11" cy="4" rx="8"  ry="5" fill="#8B2A1A"/>
      <path d="M 6 8 L 20 8 L 18 12 L 8 12 Z" fill="#7A1A0A" opacity="0.85"/>
      <path d="M -12 12 Q -22 16 -26 12" fill="none" stroke="#8B2A1A" strokeWidth="4" strokeLinecap="round"/>
      <line x1="-4" y1="16" x2="-6" y2="26" stroke="#8B2A1A" strokeWidth="3" strokeLinecap="round"/>
      <line x1=" 2" y1="16" x2=" 4" y2="26" stroke="#8B2A1A" strokeWidth="3" strokeLinecap="round"/>
    </g>
    {[[48,195],[92,180],[135,172],[390,205],[448,192],[470,172],[32,148]].map(([x,y],i)=>(
      <g key={i}>
        <circle cx={x} cy={y} r="2" fill="#C8A840" opacity="0.55"/>
        <circle cx={x} cy={y} r="2" fill="none" stroke="#C8A840" strokeWidth="0.8">
          <animate attributeName="r"       values={`4;${7+i%3};4`}    dur={`${2.4+i*0.35}s`} repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.4;0;0.4"           dur={`${2.4+i*0.35}s`} repeatCount="indefinite"/>
        </circle>
      </g>
    ))}
    <circle className="dino-cr1" cx="64" cy="210" fill="none" stroke="#E84820" strokeWidth="1.5" r="0"/>
    <circle className="dino-cr2" cx="64" cy="210" fill="none" stroke="#E84820" strokeWidth="0.8" r="0"/>
    <circle cx="64" cy="210" r="4" fill="#E84820" opacity="0.8"/>
    <line x1="64" y1="200" x2="64" y2="220" stroke="#E84820" strokeWidth="0.7" opacity="0.5"/>
    <line x1="54" y1="210" x2="74" y2="210" stroke="#E84820" strokeWidth="0.7" opacity="0.5"/>
    <line x1="300" y1="138" x2="270" y2="155" stroke="#8B2A1A" strokeWidth="0.5" strokeDasharray="2,3" opacity="0.4"/>
    <text x="268" y="162" textAnchor="end" fontFamily="'Courier New', monospace" fontSize="6.5" fill="#8B2A1A" opacity="0.65" letterSpacing="1">T. REX</text>
    <line x1="64" y1="206" x2="88" y2="190" stroke="#E84820" strokeWidth="0.5" strokeDasharray="2,3" opacity="0.4"/>
    <text x="90" y="188" fontFamily="'Courier New', monospace" fontSize="6.5" fill="#E84820" opacity="0.7" letterSpacing="1">K–PG 66Ma</text>
    <text x="250" y="38" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="7" fill="#C8A840" opacity="0.25" letterSpacing="4">PALEOGEOGRAPHIC RECORD</text>
    <line x1="30" y1="44" x2="470" y2="44" stroke="#C8A840" strokeWidth="0.4" opacity="0.12"/>
    <rect x="30" y="230" width="440" height="4" rx="1" fill="#1A1008" opacity="0.9"/>
    <rect x="30" y="230" width="110" height="4" rx="1" fill="#C17A3A" opacity="0.7"/>
    <rect x="140" y="230" width="165" height="4" fill="#8FA860" opacity="0.7"/>
    <rect x="305" y="230" width="165" height="4" rx="1" fill="#5A8C6E" opacity="0.7"/>
    <text x="85"  y="244" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="6" fill="#C17A3A" opacity="0.8" letterSpacing="1">TRIASSIC</text>
    <text x="222" y="244" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="6" fill="#8FA860" opacity="0.8" letterSpacing="1">JURASSIC</text>
    <text x="387" y="244" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="6" fill="#5A8C6E" opacity="0.8" letterSpacing="1">CRETACEOUS</text>
    <text x="30"  y="256" fontFamily="'Courier New', monospace" fontSize="6" fill="#C8A840" opacity="0.3" letterSpacing="1">252 Ma</text>
    <text x="470" y="256" textAnchor="end" fontFamily="'Courier New', monospace" fontSize="6" fill="#E84820" opacity="0.5" letterSpacing="1">66 Ma · IMPACT</text>
    <text x="250" y="200" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="52" fill="#8B2A1A" opacity="0.05" fontWeight="bold">160M</text>
    <text x="250" y="214" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="7" fill="#8B2A1A" opacity="0.3" letterSpacing="3">YEARS RULED</text>
  </svg>
)

// ─── TRAFFIC VISUAL ───────────────────────────────────────────────────────────
const TrafficVisual = () => (
  <svg viewBox="0 0 500 260" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
    <defs>
      <radialGradient id="tg1" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stopColor="#1B6EF3" stopOpacity="0.18"/>
        <stop offset="100%" stopColor="#0B1020" stopOpacity="0"/>
      </radialGradient>
      <radialGradient id="tgCongestion" cx="44%" cy="58%" r="18%">
        <stop offset="0%" stopColor="#FF3B3B" stopOpacity="0.18"/>
        <stop offset="100%" stopColor="#FF3B3B" stopOpacity="0"/>
      </radialGradient>
      <filter id="tglow">
        <feGaussianBlur stdDeviation="2.5" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>

    {/* Background */}
    <rect width="500" height="260" fill="#0B1020"/>
    <rect width="500" height="260" fill="url(#tg1)"/>

    {/* Subtle grid */}
    {[40,80,120,160,200,240].map(y => (
      <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="rgba(45,226,230,0.04)" strokeWidth="0.5"/>
    ))}
    {[60,120,180,240,300,360,420].map(x => (
      <line key={x} x1={x} y1="0" x2={x} y2="260" stroke="rgba(45,226,230,0.04)" strokeWidth="0.5"/>
    ))}

    {/* Road geometries — static base */}
    <path d="M 20 120 Q 120 90 220 110 Q 320 130 420 100 L 500 95"
      fill="none" stroke="rgba(42,52,70,0.45)" strokeWidth="6"/>
    <path d="M 20 160 Q 100 165 180 150 Q 260 135 340 155 L 480 158"
      fill="none" stroke="rgba(42,52,70,0.4)" strokeWidth="5"/>
    <path d="M 50 80 Q 150 70 250 85 Q 350 100 460 78"
      fill="none" stroke="rgba(42,52,70,0.35)" strokeWidth="4"/>
    <path d="M 0 195 L 500 192"
      fill="none" stroke="rgba(42,52,70,0.3)" strokeWidth="7"/>
    <path d="M 60 30 Q 80 80 100 130 Q 120 180 130 230"
      fill="none" stroke="rgba(42,52,70,0.3)" strokeWidth="4"/>
    <path d="M 220 20 Q 230 80 225 140 Q 218 190 215 240"
      fill="none" stroke="rgba(42,52,70,0.28)" strokeWidth="3.5"/>
    <path d="M 380 15 Q 370 70 365 130 Q 360 185 355 245"
      fill="none" stroke="rgba(42,52,70,0.28)" strokeWidth="3.5"/>

    {/* Congestion zone glow */}
    <rect width="500" height="260" fill="url(#tgCongestion)"/>
    <ellipse cx="220" cy="152" rx="55" ry="28" fill="#FF3B3B" opacity="0.05">
      <animate attributeName="opacity" values="0.03;0.10;0.03" dur="2.5s" repeatCount="indefinite"/>
    </ellipse>

    {/* ── FREEFLOW road — cyan fast streaks ── */}
    {[0, 0.14, 0.28, 0.42, 0.57, 0.72, 0.86].map((offset, i) => (
      <g key={`fast${i}`}>
        <ellipse rx="9" ry="1.8" fill="#2DE2E6" opacity="0.82" filter="url(#tglow)">
          <animateMotion dur={`${1.5 + (i%3)*0.2}s`} repeatCount="indefinite"
            begin={`${-offset * 1.5}s`}
            path="M 20 120 Q 120 90 220 110 Q 320 130 420 100 L 500 95"/>
          <animate attributeName="opacity" values="0;0.85;0.85;0" dur={`${1.5 + (i%3)*0.2}s`} repeatCount="indefinite" begin={`${-offset * 1.5}s`}/>
        </ellipse>
      </g>
    ))}

    {/* ── EXPRESSWAY — very fast long cyan streaks ── */}
    {[0, 0.12, 0.24, 0.36, 0.48, 0.60, 0.72, 0.84, 0.96].map((offset, i) => (
      <ellipse key={`exp${i}`} rx="14" ry="2" fill="#2DE2E6" opacity="0.7" filter="url(#tglow)">
        <animateMotion dur="1.1s" repeatCount="indefinite"
          begin={`${-offset * 1.1}s`}
          path="M 0 195 L 500 192"/>
        <animate attributeName="opacity" values="0;0.75;0.75;0" dur="1.1s" repeatCount="indefinite" begin={`${-offset * 1.1}s`}/>
      </ellipse>
    ))}

    {/* ── MODERATE flow — amber ── */}
    {[0, 0.25, 0.5, 0.75].map((offset, i) => (
      <circle key={`mod${i}`} r="2.8" fill="#FFB703" opacity="0.8" filter="url(#tglow)">
        <animateMotion dur={`${2.8 + i * 0.3}s`} repeatCount="indefinite"
          begin={`${-offset * 2.8}s`}
          path="M 50 80 Q 150 70 250 85 Q 350 100 460 78"/>
        <animate attributeName="opacity" values="0;0.85;0.85;0" dur={`${2.8 + i * 0.3}s`} repeatCount="indefinite" begin={`${-offset * 2.8}s`}/>
      </circle>
    ))}

    {/* ── CONGESTED — slow red particles, slight jitter ── */}
    {[0, 0.22, 0.44, 0.66, 0.88].map((offset, i) => (
      <circle key={`cong${i}`} r="3.5" fill="#FF3B3B" opacity="0.75" filter="url(#tglow)">
        <animateMotion dur={`${5.5 + i * 0.6}s`} repeatCount="indefinite"
          begin={`${-offset * 5.5}s`}
          path="M 20 160 Q 100 165 180 150 Q 260 135 340 155 L 480 158"/>
        <animate attributeName="opacity" values="0;0.7;0.8;0.6;0" dur={`${5.5 + i * 0.6}s`} repeatCount="indefinite" begin={`${-offset * 5.5}s`}/>
      </circle>
    ))}

    {/* ── VERTICAL arterials — amber/moderate ── */}
    {[0, 0.5].map((offset, i) => (
      <circle key={`vert1${i}`} r="2.2" fill="#FFB703" opacity="0.65" filter="url(#tglow)">
        <animateMotion dur={`${3.2 + i * 0.4}s`} repeatCount="indefinite"
          begin={`${-offset * 3.2}s`}
          path="M 60 30 Q 80 80 100 130 Q 120 180 130 230"/>
        <animate attributeName="opacity" values="0;0.7;0.7;0" dur={`${3.2 + i * 0.4}s`} repeatCount="indefinite" begin={`${-offset * 3.2}s`}/>
      </circle>
    ))}
    {[0, 0.5].map((offset, i) => (
      <circle key={`vert2${i}`} r="2" fill="#4FC3F7" opacity="0.65" filter="url(#tglow)">
        <animateMotion dur={`${2.6 + i * 0.3}s`} repeatCount="indefinite"
          begin={`${-offset * 2.6}s`}
          path="M 220 20 Q 230 80 225 140 Q 218 190 215 240"/>
        <animate attributeName="opacity" values="0;0.7;0.7;0" dur={`${2.6 + i * 0.3}s`} repeatCount="indefinite" begin={`${-offset * 2.6}s`}/>
      </circle>
    ))}
    {[0, 0.5].map((offset, i) => (
      <circle key={`vert3${i}`} r="2" fill="#2DE2E6" opacity="0.6" filter="url(#tglow)">
        <animateMotion dur={`${2.2 + i * 0.3}s`} repeatCount="indefinite"
          begin={`${-offset * 2.2}s`}
          path="M 380 15 Q 370 70 365 130 Q 360 185 355 245"/>
        <animate attributeName="opacity" values="0;0.65;0.65;0" dur={`${2.2 + i * 0.3}s`} repeatCount="indefinite" begin={`${-offset * 2.2}s`}/>
      </circle>
    ))}

    {/* Corner brackets */}
    <path d="M 12 12 L 12 26 M 12 12 L 26 12" stroke="rgba(45,226,230,0.35)" strokeWidth="1.5" fill="none"/>
    <path d="M 488 12 L 488 26 M 488 12 L 474 12" stroke="rgba(45,226,230,0.35)" strokeWidth="1.5" fill="none"/>
    <path d="M 12 248 L 12 234 M 12 248 L 26 248" stroke="rgba(45,226,230,0.35)" strokeWidth="1.5" fill="none"/>
    <path d="M 488 248 L 488 234 M 488 248 L 474 248" stroke="rgba(45,226,230,0.35)" strokeWidth="1.5" fill="none"/>

    {/* Live dot */}
    <circle cx="466" cy="20" r="3" fill="#FF3B3B" opacity="0.9">
      <animate attributeName="opacity" values="0.9;0.2;0.9" dur="1s" repeatCount="indefinite"/>
    </circle>
    <text x="458" y="24" textAnchor="end" fontFamily="monospace" fontSize="7"
      fill="#FF3B3B" opacity="0.8" letterSpacing="2">LIVE</text>

    {/* Label */}
    <text x="250" y="246" textAnchor="middle" fontFamily="monospace" fontSize="7.5"
      fill="rgba(45,226,230,0.4)" letterSpacing="3">KARACHI · FLUID DYNAMICS</text>

    {/* Particle count watermark */}
    <text x="26" y="245" fontFamily="monospace" fontSize="18" fill="rgba(45,226,230,0.06)"
      fontWeight="bold">2,800</text>
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
    tagColor: '#3D2800',
    cardBg: '#C8A96E',
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
    tagColor: '#D4EAD0',
    cardBg: '#1B4332',
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
    tagColor: '#8BAA66',
    cardBg: '#1C2410',
    hoverBorderColor: '#C9A84A',
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
    tagColor: '#C9A84A',
    cardBg: '#1A3A0E',
    hoverBorderColor: '#C9A84A',
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
    tagColor: '#C9B88A',
    cardBg: '#12100A',
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
  {
    id: 'turtle-day',
    title: 'The Ancient Navigators',
    eyebrow: 'Ocean · Migration · Conservation',
    year: '100M yrs → Today',
    tag: 'WORLD TURTLE DAY',
    tagColor: '#4ade80',
    cardBg: '#042218',
    hoverBorderColor: '#4ade80',
    desc: "Sea turtles have navigated the world's oceans for 100 million years. They cross entire ocean basins, find 7-mile islands in 40 million square miles of sea, and return to the exact beach where they were born. Six of seven species now face extinction.",
    stats: [
      { value: '100M', label: 'years of navigation' },
      { value: '6,000', label: 'miles per journey' },
      { value: 'May 23', label: 'World Turtle Day' },
    ],
    status: 'live',
    path: '/maps/turtle-day',
    Visual: TurtleVisual,
  },
  {
    id: 'chagai-1998',
    title: 'Youm-e-Takbir',
    eyebrow: 'Chagai · Balochistan · Pakistan',
    year: '28 May 1998',
    tag: 'NUCLEAR HISTORY',
    tagColor: '#8B6B2A',
    cardBg: '#E8DFC8',
    hoverBorderColor: '#C9B88A',
    desc: "Pakistan detonated five nuclear devices at Chagai, 17 days after India's Pokhran-II tests. The mountain turned white. A nation announced itself to the world. Six blasts. One Day of Greatness.",
    stats: [
      { value: '6', label: 'Total Tests' },
      { value: '17', label: 'Days After India' },
      { value: '7th', label: 'Nuclear Power' },
    ],
    status: 'live',
    path: '/maps/chagai-1998',
    Visual: ChagaiVisual,
  },
  {
    id: 'europe-rewritten',
    title: 'Europe Rewritten',
    eyebrow: 'Occupation · Identity · Renamed Places',
    year: '1938–1945',
    tag: 'HISTORICAL ATLAS',
    tagColor: '#8B1A1A',
    cardBg: '#E4DDD0',
    hoverBorderColor: '#8C4C35',
    desc: 'How Nazi occupation transformed the geography of Europe. Seventeen countries. Thousands of places renamed. An entire continent administered under a foreign grammar — told through cartography.',
    stats: [
      { value: '60+', label: 'Renamed Places' },
      { value: '11',  label: 'Chapters' },
      { value: '1938', label: 'to 1945' },
    ],
    status: 'live',
    path: '/maps/europe-rewritten',
    Visual: EuropeVisual,
  },
  {
    id: 'political-dna',
    title: 'The Political DNA of the World',
    eyebrow: 'Governments · Regimes · Power',
    year: '1900–2026',
    tag: 'POLITICAL ATLAS',
    tagColor: '#8AAF7A',
    cardBg: '#1A1E14',
    hoverBorderColor: '#5A8A7A',
    desc: 'Watch how governments evolved across 126 years. Empires collapsed, democracies spread, communism rose and fell, strongmen returned. Every country. Every regime. One living map.',
    stats: [
      { value: '195',  label: 'Countries' },
      { value: '126',  label: 'Years' },
      { value: '5',    label: 'Chapters' },
    ],
    status: 'live',
    path: '/maps/political-dna',
    Visual: PoliticalVisual,
  },
  {
    id: 'dinosaur-deep-time',
    title: 'When Giants Ruled the Earth',
    eyebrow: 'Pangaea → Extinction → Modern Earth',
    year: '252 Ma – 66 Ma',
    tag: 'DEEP TIME',
    tagColor: '#C17A3A',
    cardBg: '#0C0804',
    hoverBorderColor: '#8B2A1A',
    desc: 'A cinematic journey through 186 million years of dinosaur dominance. Watch Pangaea fracture, giants rise continent by continent, and one rock end it all. Six chapters. One extinction. The footprints remain.',
    stats: [
      { value: '252Ma', label: 'Story Begins' },
      { value: '160M',  label: 'Years Ruled' },
      { value: '66Ma',  label: 'K–Pg Impact' },
    ],
    status: 'live',
    path: '/maps/dinosaur-deep-time',
    Visual: DinosaurVisual,
  },
  {
    id: 'karachi-traffic',
    title: 'Karachi Traffic Fluid',
    eyebrow: 'Urban Flow · Particle Dynamics',
    year: 'Live',
    tag: 'FLUID SIMULATION',
    tagColor: '#2DE2E6',
    cardBg: 'linear-gradient(135deg, #0B1020 0%, #111827 50%, #0B1020 100%)',
    hoverBorderColor: '#2DE2E6',
    desc: "City roads become living rivers of motion. 2,800 particles flow through Karachi's arteries — from expressway freeflow to Saddar congestion. A cinematic fluid dynamics visualization of urban movement.",
    stats: [
      { value: '2,800', label: 'Live Particles' },
      { value: '19',    label: 'Road Segments' },
      { value: '60fps', label: 'Real-time' },
    ],
    status: 'live',
    path: '/maps/karachi-traffic',
    Visual: TrafficVisual,
  },
]

export const LIVE_COUNT  = MAPS_REGISTRY.filter(m => m.status === 'live').length
export const TOTAL_COUNT = MAPS_REGISTRY.length