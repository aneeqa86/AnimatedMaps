// src/data/partitionMap.js
// 1947 Partition of India — Data File
// Chapters, flows, markers, quotes, poetry

// ─── CHAPTER ICONS ────────────────────────────────────────────────────────────
// SVG strings keyed by chapter id

export const CHAPTER_ICONS = {
  one_land: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <ellipse cx="20" cy="20" rx="16" ry="6" fill="none" stroke="currentColor" stroke-width="1" opacity="0.5"/>
    <ellipse cx="20" cy="20" rx="6" ry="16" fill="none" stroke="currentColor" stroke-width="1" opacity="0.5"/>
    <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.6"/>
  </svg>`,

  the_line: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <line x1="4" y1="20" x2="36" y2="20" stroke="currentColor" stroke-width="2" stroke-dasharray="4 3"/>
    <circle cx="4" cy="20" r="3" fill="#FF8F00"/>
    <circle cx="36" cy="20" r="3" fill="#1B5E20"/>
    <path d="M14 8 L14 32" stroke="currentColor" stroke-width="1" opacity="0.3"/>
    <path d="M26 8 L26 32" stroke="currentColor" stroke-width="1" opacity="0.3"/>
  </svg>`,

  punjab_burns: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="8" fill="#8B1A1A" opacity="0.3"/>
    <circle cx="20" cy="20" r="4" fill="#8B1A1A" opacity="0.6"/>
    <circle cx="20" cy="20" r="2" fill="#8B1A1A"/>
    <circle cx="20" cy="20" r="14" fill="none" stroke="#8B1A1A" stroke-width="1" opacity="0.2" stroke-dasharray="3 3"/>
  </svg>`,

  great_crossing: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 15 Q20 10 34 15" fill="none" stroke="#1B5E20" stroke-width="2" stroke-linecap="round"/>
    <path d="M34 25 Q20 30 6 25" fill="none" stroke="#FF8F00" stroke-width="2" stroke-linecap="round"/>
    <polygon points="34,12 38,15 34,18" fill="#1B5E20"/>
    <polygon points="6,22 2,25 6,28" fill="#FF8F00"/>
  </svg>`,

  bengal_divides: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="8" width="32" height="24" rx="2" fill="none" stroke="currentColor" stroke-width="1" opacity="0.4"/>
    <line x1="20" y1="8" x2="20" y2="32" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 2"/>
    <circle cx="12" cy="20" r="4" fill="#FF8F00" opacity="0.6"/>
    <circle cx="28" cy="20" r="4" fill="#1B5E20" opacity="0.6"/>
    <path d="M14 20 Q20 16 26 20" fill="none" stroke="currentColor" stroke-width="1" opacity="0.5"/>
  </svg>`,

  the_missing: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <text x="20" y="26" text-anchor="middle" font-size="22" font-family="serif" fill="currentColor">?</text>
    <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" stroke-width="1" opacity="0.4"/>
  </svg>`,

  two_nations: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="10" width="14" height="20" rx="2" fill="none" stroke="#FF8F00" stroke-width="1.5"/>
    <rect x="22" y="10" width="14" height="20" rx="2" fill="none" stroke="#1B5E20" stroke-width="1.5"/>
    <line x1="18" y1="20" x2="22" y2="20" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2" opacity="0.5"/>
  </svg>`,
}


// ─── CHAPTERS ─────────────────────────────────────────────────────────────────

export const CHAPTERS = [
  {
    id: 'one_land',
    year: '1941',
    title: 'One Land',
    subtitle: '390 Million People. One Administration.',
    body: 'Before the line existed, Punjab was home to Muslims, Hindus, and Sikhs in the same villages, on the same streets. Bengal stretched from Calcutta to Dhaka, a single province of 62 million. Two hundred years of British rule were ending. No one knew yet what the ending would cost.',
    type: 'context',

    // Quote: Faiz — pre-partition, in Urdu + English
    quote: {
      original: 'یہ وطن تمہارا ہے',
      originalScript: 'urdu',
      translation: '"This homeland is yours"',
      attribution: '— Faiz Ahmed Faiz',
    },

    // No survivor voice for Ch 1
    survivor: null,

    stats: [
      { label: 'Total Population', value: 390, suffix: 'M', decimals: 0 },
      { label: 'Punjab — Muslim', value: 53.2, suffix: '%', decimals: 1 },
      { label: 'Bengal — Muslim', value: 53.4, suffix: '%', decimals: 1 },
    ],

    // Map camera
    location: { center: [78.0, 22.0], zoom: 3.8 },

    // Province fill colors for this chapter
    // 'unified' = warm gold wash, no partition line
    mapMode: 'unified',
  },

  {
    id: 'the_line',
    year: '1947',
    title: 'The Line Is Drawn',
    subtitle: 'Five Weeks. Two Provinces. Millions of Lives.',
    body: 'Sir Cyril Radcliffe, a British barrister who had never set foot in India, was given five weeks to divide Punjab and Bengal. The Radcliffe Line was announced on August 17th — two days after independence. People had already celebrated. They did not yet know which country they were in.',
    type: 'boundary',

    quote: {
      original: null,
      originalScript: null,
      translation: '"The date I chose came out of the blue. I think it was already in my mind. It was not an arbitrary date."',
      attribution: '— Lord Mountbatten, on choosing August 15th',
    },

    survivor: null,

    stats: [
      { label: 'Weeks to Draw the Line', value: 5, suffix: '', decimals: 0 },
      { label: 'Days After Independence', value: 2, suffix: '', decimals: 0 },
      { label: 'People Displaced', value: 14.5, suffix: 'M', decimals: 1 },
    ],

    location: { center: [74.0, 28.0], zoom: 4.2 },
    mapMode: 'partition_line', // line animates, colors split
  },

  {
    id: 'punjab_burns',
    year: 'March 1947',
    title: 'Punjab Burns First',
    subtitle: 'The Violence Came Before the Border.',
    body: 'Five months before independence, Rawalpindi erupted. Muslim mobs attacked Sikh and Hindu villages across the division — burning homes, killing thousands. The massacres in Rawalpindi, Sheikhupura, and Amritsar were not a response to partition. They came first. They made partition feel inevitable.',
    type: 'violence',

    quote: {
      original: 'ਅੱਜ ਆਖਾਂ ਵਾਰਸ ਸ਼ਾਹ ਨੂੰ, ਕਿੱਤੋਂ ਕਬਰਾਂ ਵਿੱਚੋਂ ਬੋਲ',
      originalScript: 'gurmukhi',
      translation: '"Today I call to Waris Shah — speak from your grave"',
      attribution: '— Amrita Pritam, written on a train fleeing Lahore, 1947',
    },

    survivor: {
      text: '"I cried a lot. Now I think of it, I feel that something happened to all of us. It\'s as if humanity had died. Everybody became a devil."',
      attribution: '— Sardar Joginder Singh Kholi, Sikh survivor, Punjab, 1947',
    },

    stats: [
      { label: 'Killed in Rawalpindi', value: 8000, suffix: '+', decimals: 0 },
      { label: 'Fled the Division by April', value: 80000, suffix: '+', decimals: 0 },
      { label: 'Killed in Sheikhupura', value: 13500, suffix: '+', decimals: 0 },
    ],

    location: { center: [73.5, 31.8], zoom: 6.0 },
    mapMode: 'violence_punjab',
  },

  {
    id: 'great_crossing',
    year: 'Aug–Dec 1947',
    title: 'The Great Crossing',
    subtitle: 'Two Floods. Moving Through Each Other.',
    body: 'Eleven million people crossed in Punjab in a matter of months. Muslims moved west. Hindus and Sikhs moved east. They passed each other on the same roads, on the same trains — sometimes on the same day. Trains arrived full of bodies. The word for what happened had not yet been invented.',
    type: 'migration',

    quote: {
      original: null,
      originalScript: null,
      translation: '"I am told the situation in Punjab is very bad. I have wept today for the first time after many years."',
      attribution: '— Jawaharlal Nehru, August 1947',
    },

    survivor: {
      text: '"The only solace we had was that we were in this together."',
      attribution: '— Unnamed refugee, 1947 Partition Archive oral history',
    },

    stats: [
      { label: 'Crossed in Punjab', value: 11, suffix: 'M', decimals: 0 },
      { label: 'Left & Never Arrived', value: 1.3, suffix: 'M', decimals: 1 },
      { label: 'Train Massacre — Amritsar', value: 3000, suffix: 'killed', decimals: 0 },
    ],

    location: { center: [74.5, 31.0], zoom: 5.5 },
    mapMode: 'flows_punjab',
  },

  {
    id: 'bengal_divides',
    year: '1947–1950',
    title: 'Bengal Divides Differently',
    subtitle: 'Slower. Quieter. Lasting Decades.',
    body: 'Unlike Punjab — where the exchange was near-total and brutal — Bengal\'s partition was slower, messier, and never finished. Most Bengali Muslims stayed in West Bengal. Most Bengali Hindus eventually left East Bengal, but not all at once. Calcutta\'s Sealdah station became a city unto itself — tens of thousands sleeping on the platform, waiting for a country to take them in.',
    type: 'migration',

    quote: {
      original: null,
      originalScript: null,
      translation: '"A city of hunger with no doors to close."',
      attribution: '— Unnamed refugee woman, Sealdah Station, Calcutta, 1947',
    },

    survivor: null,

    stats: [
      { label: 'Hindus Left East Bengal', value: 2.04, suffix: 'M', decimals: 2 },
      { label: 'Muslims Stayed in W. Bengal', value: 5.3, suffix: 'M', decimals: 1 },
      { label: 'Calcutta Population — Refugees', value: 27, suffix: '%', decimals: 0 },
    ],

    location: { center: [89.5, 23.5], zoom: 5.8 },
    mapMode: 'flows_bengal',
  },

  {
    id: 'the_missing',
    year: '1947',
    title: 'The Missing',
    subtitle: 'How Many Died? We Still Don\'t Know.',
    body: 'The death toll has never been established. Estimates range from 200,000 to 2,000,000. Entire villages were wiped out. Families had no one left to file a report. The Pakistani census counted 1.3 million Muslims who left India but never arrived. The Indian census found a similar number of Hindus and Sikhs who disappeared on the other side. The uncertainty is not a gap in the record. It is the record.',
    type: 'violence',

    // Faiz — Subh-e-Azadi — the centrepiece, in Urdu Nastaliq + English
    quote: {
      original: 'یہ داغ داغ اُجالا، یہ شب گزیدہ سحر\nوہ انتظار تھا جس کا، یہ وہ سحر تو نہیں',
      originalScript: 'urdu',
      translation: '"This stained light, this night-bitten dawn —\nThis is not that dawn we had set out to find."',
      attribution: '— Faiz Ahmed Faiz, Subh-e-Azadi, written August 14, 1947, Lahore',
    },

    survivor: null,

    // Special: stat counter stops mid-way and shows range
    stats: [
      { label: 'Estimated Dead', value: null, suffix: '', decimals: 0, isRange: true, range: '200,000 — 2,000,000', rangeNote: 'The range is the record.' },
      { label: 'Missing from Pakistan Census', value: 1.3, suffix: 'M', decimals: 1 },
      { label: 'Missing from Indian Census', value: 0.8, suffix: 'M', decimals: 1 },
    ],

    location: { center: [74.0, 29.0], zoom: 4.8 },
    mapMode: 'violence_both', // both Punjabs darken, red markers
  },

  {
    id: 'two_nations',
    year: '1951',
    title: 'Two Nations, Unmade Neighbours',
    subtitle: 'The Line That Took Five Weeks Is Now 77 Years Old.',
    body: 'By 1951, Punjab was near-monochrome on both sides. Indian Punjab\'s Muslim population had dropped from 38% to almost zero. Pakistani Punjab\'s Hindu and Sikh population had vanished entirely. Bengal remained complex — as it always had. The man who drew the line, Cyril Radcliffe, burned his papers and left India before the announcement was made. He never returned.',
    type: 'aftermath',

    // Jinnah — August 11, 1947 — the supreme irony
    quote: {
      original: null,
      originalScript: null,
      translation: '"You are free to go to your temples. You are free to go to your mosques... that has nothing to do with the business of the state."',
      attribution: '— Muhammad Ali Jinnah, Constituent Assembly of Pakistan, August 11, 1947\n(Two days before Pakistan existed)',
    },

    survivor: null,

    stats: [
      { label: 'Muslim % in Indian Punjab — 1941', value: 38.4, suffix: '%', decimals: 1 },
      { label: 'Muslim % in Indian Punjab — 1951', value: 0.5, suffix: '%', decimals: 1 },
      { label: 'Years the Line Has Stood', value: 77, suffix: '', decimals: 0 },
    ],

    location: { center: [78.0, 25.0], zoom: 3.8 },
    mapMode: 'aftermath', // 1951 demographic fills, settled
  },
]


// ─── MIGRATION FLOWS ──────────────────────────────────────────────────────────
// Bidirectional — green = westward (Muslims to Pakistan), saffron = eastward (Hindus/Sikhs to India)

export const MIGRATION_FLOWS = [
  // Punjab — westward (Muslims → Pakistan)
  {
    id: 'lahore_west',
    from: [76.78, 30.90],   // Ludhiana / East Punjab
    to:   [74.35, 31.55],   // Lahore
    direction: 'west',
    color: '#1B5E20',
    label: 'Muslims → West Punjab',
    volume: '5.5M',
    chapter: 'great_crossing',
  },
  {
    id: 'amritsar_west',
    from: [76.40, 31.63],   // Amritsar
    to:   [73.06, 33.72],   // Rawalpindi
    direction: 'west',
    color: '#1B5E20',
    label: 'Muslims → Rawalpindi',
    volume: '1.8M',
    chapter: 'great_crossing',
  },

  // Punjab — eastward (Hindus/Sikhs → India)
  {
    id: 'lahore_east',
    from: [74.35, 31.55],   // Lahore
    to:   [76.78, 30.90],   // Ludhiana / East Punjab
    direction: 'east',
    color: '#FF8F00',
    label: 'Hindus/Sikhs → East Punjab',
    volume: '3.9M',
    chapter: 'great_crossing',
  },
  {
    id: 'rawalpindi_east',
    from: [73.06, 33.72],   // Rawalpindi
    to:   [77.10, 28.70],   // Delhi
    direction: 'east',
    color: '#FF8F00',
    label: 'Sikhs/Hindus → Delhi',
    volume: '0.5M',
    chapter: 'great_crossing',
  },

  // Bengal — westward (Hindus → West Bengal/Calcutta)
  {
    id: 'dhaka_west',
    from: [90.41, 23.81],   // Dhaka (East Bengal)
    to:   [88.36, 22.57],   // Calcutta
    direction: 'west',
    color: '#FF8F00',
    label: 'Hindus → West Bengal',
    volume: '2.04M',
    chapter: 'bengal_divides',
  },

  // Bengal — eastward (Muslims → East Bengal)
  {
    id: 'calcutta_east',
    from: [88.36, 22.57],   // Calcutta
    to:   [90.41, 23.81],   // Dhaka
    direction: 'east',
    color: '#1B5E20',
    label: 'Muslims → East Bengal',
    volume: '1.72M',
    chapter: 'bengal_divides',
  },
]


// ─── VIOLENCE MARKERS ─────────────────────────────────────────────────────────
// Appear in chapters: punjab_burns, the_missing

export const VIOLENCE_MARKERS = [
  {
    id: 'rawalpindi',
    coords: [73.06, 33.72],
    name: 'Rawalpindi',
    date: 'March 1947',
    deaths: '7,000–8,000',
    note: 'First major massacre — 5 months before independence. Hindus and Sikhs killed by Muslim mobs. 80,000 fled by April.',
    chapter: ['punjab_burns', 'the_missing'],
  },
  {
    id: 'sheikhupura',
    coords: [73.98, 31.71],
    name: 'Sheikhupura',
    date: 'August 26, 1947',
    deaths: '13,500+',
    note: 'Of 15,000 non-Muslims, only 1,500 survived. Violence lasted three days.',
    chapter: ['punjab_burns', 'the_missing'],
  },
  {
    id: 'amritsar_train',
    coords: [74.87, 31.63],
    name: 'Amritsar — Train Massacre',
    date: 'September 22, 1947',
    deaths: '3,000',
    note: 'Muslim refugee train attacked. 3,000 killed. Only 100 passengers uninjured.',
    chapter: ['great_crossing', 'the_missing'],
  },
  {
    id: 'kamoke_train',
    coords: [73.99, 31.98],
    name: 'Kamoke Station',
    date: 'September 24, 1947',
    deaths: '3,350+',
    note: 'Refugee train attacked. Of 3,500 passengers, only 150 survived. 600 women abducted.',
    chapter: ['great_crossing', 'the_missing'],
  },
  {
    id: 'noakhali',
    coords: [91.10, 22.86],
    name: 'Noakhali',
    date: 'October 1946',
    deaths: 'Thousands',
    note: 'Anti-Hindu riots in Bengal. One of the earliest major episodes of communal violence before partition.',
    chapter: ['punjab_burns', 'the_missing'],
  },
  {
    id: 'calcutta_1946',
    coords: [88.36, 22.57],
    name: 'Calcutta',
    date: 'August 1946',
    deaths: '4,000–10,000',
    note: 'Direct Action Day riots. Muslims and Hindus killed each other for four days. The violence that unraveled everything.',
    chapter: ['punjab_burns', 'the_missing'],
  },
]


// ─── CITY MARKERS ─────────────────────────────────────────────────────────────
// Key cities for context — shown in Ch 1 and Ch 7

export const CITY_MARKERS = [
  // Punjab — key cities
  { id: 'lahore',    coords: [74.35, 31.55], name: 'Lahore',     side: 'pakistan', role: 'Divided city — stayed in Pakistan' },
  { id: 'amritsar',  coords: [74.87, 31.63], name: 'Amritsar',   side: 'india',    role: 'Divided city — stayed in India' },
  { id: 'rawalpindi',coords: [73.06, 33.72], name: 'Rawalpindi', side: 'pakistan', role: 'Site of first massacres, March 1947' },
  { id: 'delhi',     coords: [77.10, 28.70], name: 'Delhi',      side: 'india',    role: 'Received largest single-city refugee influx' },
  { id: 'ludhiana',  coords: [75.85, 30.90], name: 'Ludhiana',   side: 'india',    role: 'East Punjab — received Sikh refugees' },

  // Bengal — key cities
  { id: 'calcutta',  coords: [88.36, 22.57], name: 'Calcutta',   side: 'india',    role: 'Sealdah Station — city of refugees. 27% of population displaced by 1951.' },
  { id: 'dhaka',     coords: [90.41, 23.81], name: 'Dhaka',      side: 'pakistan', role: 'Capital of East Bengal — 61% Hindu in 1941, became Pakistan' },
  { id: 'sylhet',    coords: [91.87, 24.90], name: 'Sylhet',     side: 'pakistan', role: 'Joined East Bengal by referendum, July 7, 1947' },
]


// ─── PROVINCE DATA ────────────────────────────────────────────────────────────
// For choropleth fills — 1941 vs 1951 demographics
// Used to drive map layer paint properties

export const PROVINCE_DATA = {
  // 1941 — pre-partition
  before: {
    punjab: {
      muslim: 53.2,
      hindu: 29.1,
      sikh: 14.9,
      total_population: 28000000,
      mapbox_iso: 'IN-PB', // approximate — used for boundary lookup
    },
    bengal: {
      muslim: 53.4,
      hindu: 41.7,
      other: 4.8,
      total_population: 62000000,
      mapbox_iso: 'IN-WB',
    },
  },

  // 1951 — post-partition
  after: {
    indian_punjab: {
      muslim: 0.5,   // from 38.4%
      sikh: 60.62,   // from 33.7% — massive Sikh refugee influx
      hindu: 37.66,
      mapbox_iso: 'IN-PB',
    },
    west_punjab_pakistan: {
      muslim: 97.2,  // from ~55% in the west
      hindu: 0.1,    // near zero
      sikh: 0.0,     // near zero
    },
    west_bengal_india: {
      muslim: 19.5,  // stayed — did not fully leave
      hindu: 80.0,
    },
    east_bengal_pakistan: {
      muslim: 76.9,
      hindu: 22.0,  // still significant — did not fully leave
    },
  },
}


// ─── RADCLIFFE LINE ───────────────────────────────────────────────────────────
// Approximate GeoJSON coordinates for the Radcliffe Line animation
// Punjab segment first, then gap, then Bengal segment

export const RADCLIFFE_LINE = {
  punjab: [
    // Approximate — west to east across Punjab
    [73.9, 34.6],  // North — near Pathankot / Gurdaspur area
    [74.3, 32.5],
    [74.6, 31.9],
    [74.9, 31.5],  // Near Wagah / Lahore-Amritsar corridor
    [75.1, 30.8],
    [75.3, 29.9],
    [74.8, 28.4],  // South — Rajasthan border
  ],
  bengal: [
    // Approximate — north to south across Bengal
    [88.8, 26.3],  // North Bengal — Jalpaiguri area
    [88.9, 25.4],
    [88.7, 24.5],
    [88.5, 23.8],
    [88.9, 23.0],
    [89.3, 22.4],
    [89.8, 21.7],  // South — Bay of Bengal
  ],
}


// ─── MAP MODES ────────────────────────────────────────────────────────────────
// Each chapter's mapMode key maps to layer/color configuration
// Used in the page component to drive Mapbox layer paint

export const MAP_MODES = {
  unified: {
    description: 'Pre-partition — warm gold wash over undivided India',
    showRadcliffeLine: false,
    showFlows: false,
    showViolence: false,
    indiaFill: '#C9B88A',      // unified gold
    indiaOpacity: 0.25,
    pakistanFill: '#C9B88A',   // same — not yet divided
    pakistanOpacity: 0.25,
    bengalFill: '#C9B88A',
    bengalOpacity: 0.25,
  },
  partition_line: {
    description: 'Line animates — colors split as it draws',
    showRadcliffeLine: true,   // animated draw
    showFlows: false,
    showViolence: false,
    indiaFill: '#FF8F00',      // saffron
    indiaOpacity: 0.3,
    pakistanFill: '#1B5E20',   // green
    pakistanOpacity: 0.3,
  },
  violence_punjab: {
    description: 'Punjab darkens — red violence markers appear',
    showRadcliffeLine: true,
    showFlows: false,
    showViolence: true,
    violenceFilter: ['punjab_burns'],
    punjabFill: '#8B1A1A',
    punjabOpacity: 0.4,
    indiaFill: '#FF8F00',
    indiaOpacity: 0.15,
    pakistanFill: '#1B5E20',
    pakistanOpacity: 0.15,
  },
  flows_punjab: {
    description: 'Bidirectional flow lines across Punjab',
    showRadcliffeLine: true,
    showFlows: true,
    flowFilter: 'great_crossing',
    showViolence: true,
    violenceFilter: ['great_crossing'],
    indiaFill: '#FF8F00',
    indiaOpacity: 0.2,
    pakistanFill: '#1B5E20',
    pakistanOpacity: 0.2,
  },
  flows_bengal: {
    description: 'Flow lines shift to Bengal — Punjab fades',
    showRadcliffeLine: true,
    showFlows: true,
    flowFilter: 'bengal_divides',
    showViolence: false,
    bengalIndiaFill: '#FF8F00',
    bengalIndiaOpacity: 0.25,
    bengalPakistanFill: '#1B5E20',
    bengalPakistanOpacity: 0.25,
    indiaFill: '#FF8F00',
    indiaOpacity: 0.08,
    pakistanFill: '#1B5E20',
    pakistanOpacity: 0.08,
  },
  violence_both: {
    description: 'Both provinces darken — all violence markers — map nearly black',
    showRadcliffeLine: true,
    showFlows: false,
    showViolence: true,
    violenceFilter: ['punjab_burns', 'great_crossing', 'the_missing'],
    indiaFill: '#1a0a0a',
    indiaOpacity: 0.6,
    pakistanFill: '#0a1a0a',
    pakistanOpacity: 0.6,
    overlayDark: true,         // extra dark overlay on map
  },
  aftermath: {
    description: '1951 demographic fills — near-monochrome Punjab, complex Bengal',
    showRadcliffeLine: true,
    showFlows: false,
    showViolence: false,
    indiaFill: '#FF8F00',
    indiaOpacity: 0.3,
    pakistanFill: '#1B5E20',
    pakistanOpacity: 0.3,
    // special: Punjab fills are near-solid (exchange complete)
    // Bengal fills are lighter (exchange incomplete)
    punjabIndiaMonochrome: true,
    punjabPakistanMonochrome: true,
  },
}


// ─── FONT IMPORTS ─────────────────────────────────────────────────────────────
// These go in index.html or a global CSS — documented here for reference
//
// <link rel="preconnect" href="https://fonts.googleapis.com">
// <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
// <link href="https://fonts.googleapis.com/css2?
//   family=Noto+Nastaliq+Urdu:wght@400;700&
//   family=Noto+Sans+Gurmukhi:wght@400;600&
//   family=Noto+Sans+Bengali:wght@400;600&
//   display=swap" rel="stylesheet">
//
// Usage in inline styles:
//   urdu:    fontFamily: "'Noto Nastaliq Urdu', serif"
//   punjabi: fontFamily: "'Noto Sans Gurmukhi', sans-serif"
//   bengali: fontFamily: "'Noto Sans Bengali', sans-serif"

export const SCRIPT_FONTS = {
  urdu:     "'Noto Nastaliq Urdu', serif",
  gurmukhi: "'Noto Sans Gurmukhi', sans-serif",
  bengali:  "'Noto Sans Bengali', sans-serif",
  default:  "'Lato', sans-serif",
}


// ─── COLOR PALETTE ────────────────────────────────────────────────────────────
// Extend the project design system for this map

export const COLORS = {
  // Base design system
  bg:        '#0D0D0D',
  gold:      '#C9B88A',
  red:       '#8B1A1A',
  text:      '#F0E8D8',
  muted:     '#aaa',
  mutedDark: '#666',

  // Partition-specific
  indiaOrange:    '#FF8F00',   // India flag saffron
  indiaSaffron:   '#FF8F00',
  indiaGreen:     '#138808',
  indiaBlue:      '#000080',   // Ashoka wheel
  pakistanGreen:  '#1B5E20',   // Pakistan flag green
  violence:       '#8B1A1A',   // same as design system red
  unified:        '#C9B88A',   // pre-partition gold

  // Chapter type colors (for timeline scrubber)
  context:   '#C9B88A',
  boundary:  '#888',
  migration: '#FF8F00',
  violence:  '#8B1A1A',
  aftermath: '#C9B88A',
}