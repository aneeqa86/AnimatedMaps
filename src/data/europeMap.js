// src/data/europeMap.js
// Europe Rewritten (1938–1945) — Chapters, renamed places, administrative zones

// ─── PALETTE ──────────────────────────────────────────────────────────────────
export const C = {
  paper:      '#F6F1E8',
  land:       '#DDD0B4',
  terrain:    '#BFA58A',
  border:     '#9D8F7A',
  water:      '#CBD5D9',
  annexed:    '#8C4C35',   // deep rust — Austria, Sudetenland, W. Poland
  occupied:   '#C97846',   // burnt orange — France, Belgium, Poland
  puppet:     '#B89561',   // muted amber — Vichy, Slovakia, Croatia
  axis:       '#8D765C',   // dusty brown — Hungary, Romania, Bulgaria
  resistance: '#66768A',   // steel blue — resistance hotspots
  restored:   '#DDD0B4',   // fades back to neutral
  ink:        '#2F2F2F',
  inkMuted:   '#6B6050',
  germanName: '#8A4630',
}

// ─── RENAMED PLACES ───────────────────────────────────────────────────────────
// 60 renamed places across occupied Europe
export const RENAMED_PLACES = [
  // Poland
  { id: 'gdansk',      ll: [18.6466, 54.3520], native: 'Gdańsk',        german: 'Danzig',           changed: '1939', restored: '1945', country: 'Poland' },
  { id: 'wroclaw',     ll: [17.0385, 51.1079], native: 'Wrocław',       german: 'Breslau',          changed: '1939', restored: '1945', country: 'Poland' },
  { id: 'szczecin',    ll: [14.5528, 53.4285], native: 'Szczecin',      german: 'Stettin',          changed: '1939', restored: '1945', country: 'Poland' },
  { id: 'poznan',      ll: [16.9252, 52.4064], native: 'Poznań',        german: 'Posen',            changed: '1939', restored: '1945', country: 'Poland' },
  { id: 'lodz',        ll: [19.4560, 51.7592], native: 'Łódź',          german: 'Litzmannstadt',    changed: '1940', restored: '1945', country: 'Poland' },
  { id: 'torun',       ll: [18.5983, 53.0138], native: 'Toruń',         german: 'Thorn',            changed: '1939', restored: '1945', country: 'Poland' },
  { id: 'bydgoszcz',   ll: [18.0076, 53.1235], native: 'Bydgoszcz',     german: 'Bromberg',         changed: '1939', restored: '1945', country: 'Poland' },
  { id: 'katowice',    ll: [19.0216, 50.2649], native: 'Katowice',      german: 'Kattowitz',        changed: '1939', restored: '1945', country: 'Poland' },
  { id: 'czestochowa', ll: [19.1203, 50.8118], native: 'Częstochowa',   german: 'Tschenstochau',    changed: '1939', restored: '1945', country: 'Poland' },
  { id: 'gdynia',      ll: [18.5353, 54.5189], native: 'Gdynia',        german: 'Gotenhafen',       changed: '1939', restored: '1945', country: 'Poland' },

  // Czech lands
  { id: 'prague',      ll: [14.4378, 50.0755], native: 'Praha',         german: 'Prag',             changed: '1939', restored: '1945', country: 'Bohemia-Moravia' },
  { id: 'brno',        ll: [16.6068, 49.1951], native: 'Brno',          german: 'Brünn',            changed: '1939', restored: '1945', country: 'Bohemia-Moravia' },
  { id: 'olomouc',     ll: [17.2508, 49.5938], native: 'Olomouc',       german: 'Olmütz',           changed: '1939', restored: '1945', country: 'Bohemia-Moravia' },
  { id: 'liberec',     ll: [15.0543, 50.7663], native: 'Liberec',       german: 'Reichenberg',      changed: '1938', restored: '1945', country: 'Sudetenland' },
  { id: 'ostrava',     ll: [18.2923, 49.8209], native: 'Ostrava',       german: 'Mährisch Ostrau',  changed: '1939', restored: '1945', country: 'Bohemia-Moravia' },
  { id: 'karlovy',     ll: [12.8719, 50.2303], native: 'Karlovy Vary',  german: 'Karlsbad',         changed: '1938', restored: '1945', country: 'Sudetenland' },

  // Slovenia / Yugoslavia
  { id: 'ljubljana',   ll: [14.5058, 46.0569], native: 'Ljubljana',     german: 'Laibach',          changed: '1941', restored: '1945', country: 'Slovenia' },
  { id: 'maribor',     ll: [15.6556, 46.5547], native: 'Maribor',       german: 'Marburg an der Drau', changed: '1941', restored: '1945', country: 'Slovenia' },
  { id: 'celje',       ll: [15.2677, 46.2307], native: 'Celje',         german: 'Cilli',            changed: '1941', restored: '1945', country: 'Slovenia' },
  { id: 'klagenfurt',  ll: [14.3050, 46.6228], native: 'Celovec',       german: 'Klagenfurt',       changed: '1938', restored: '1945', country: 'Austria/Carinthia' },

  // Baltics
  { id: 'tallinn',     ll: [24.7536, 59.4370], native: 'Tallinn',       german: 'Reval',            changed: '1941', restored: '1944', country: 'Estonia' },
  { id: 'tartu',       ll: [26.7290, 58.3776], native: 'Tartu',         german: 'Dorpat',           changed: '1941', restored: '1944', country: 'Estonia' },
  { id: 'riga',        ll: [24.1052, 56.9496], native: 'Rīga',          german: 'Riga',             changed: '1941', restored: '1944', country: 'Latvia' },
  { id: 'vilnius',     ll: [25.2799, 54.6872], native: 'Vilnius',       german: 'Wilna',            changed: '1941', restored: '1944', country: 'Lithuania' },
  { id: 'kaunas',      ll: [23.9036, 54.8985], native: 'Kaunas',        german: 'Kauen',            changed: '1941', restored: '1944', country: 'Lithuania' },

  // Alsace-Lorraine / France
  { id: 'strasbourg',  ll: [7.7521, 48.5734],  native: 'Strasbourg',    german: 'Straßburg',        changed: '1940', restored: '1944', country: 'Alsace (France)' },
  { id: 'metz',        ll: [6.1757, 49.1193],  native: 'Metz',          german: 'Metz',             changed: '1940', restored: '1944', country: 'Lorraine (France)' },
  { id: 'colmar',      ll: [7.3590, 48.0793],  native: 'Colmar',        german: 'Kolmar',           changed: '1940', restored: '1944', country: 'Alsace (France)' },
  { id: 'mulhouse',    ll: [7.3397, 47.7508],  native: 'Mulhouse',      german: 'Mülhausen',        changed: '1940', restored: '1944', country: 'Alsace (France)' },
  { id: 'thionville',  ll: [6.1680, 49.3576],  native: 'Thionville',    german: 'Diedenhofen',      changed: '1940', restored: '1944', country: 'Lorraine (France)' },

  // Belgium
  { id: 'liege',       ll: [5.5797, 50.6326],  native: 'Liège',         german: 'Lüttich',          changed: '1940', restored: '1944', country: 'Belgium' },
  { id: 'eupen',       ll: [6.0333, 50.6333],  native: 'Eupen',         german: 'Eupen',            changed: '1940', restored: '1944', country: 'Belgium (annexed)' },
  { id: 'malmedy',     ll: [6.0270, 50.4260],  native: 'Malmedy',       german: 'Malmedy',          changed: '1940', restored: '1944', country: 'Belgium (annexed)' },

  // Netherlands
  { id: 'amsterdam',   ll: [4.9041, 52.3676],  native: 'Amsterdam',     german: 'Amsterdam',        changed: '1940', restored: '1944', country: 'Netherlands' },
  { id: 'rotterdam',   ll: [4.4777, 51.9244],  native: 'Rotterdam',     german: 'Rotterdam',        changed: '1940', restored: '1944', country: 'Netherlands' },
  { id: 'thehague',    ll: [4.3007, 52.0705],  native: "'s-Gravenhage", german: 'Den Haag',         changed: '1940', restored: '1944', country: 'Netherlands' },

  // Greece
  { id: 'thessaloniki',ll: [22.9444, 40.6401], native: 'Θεσσαλονίκη',  german: 'Saloniki',         changed: '1941', restored: '1944', country: 'Greece' },
  { id: 'athens',      ll: [23.7275, 37.9838], native: 'Αθήνα',        german: 'Athen',            changed: '1941', restored: '1944', country: 'Greece' },
  { id: 'kavala',      ll: [24.4135, 40.9396], native: 'Καβάλα',       german: 'Kavala',           changed: '1941', restored: '1944', country: 'Greece' },

  // Ukraine / Belarus (Reichskommissariat)
  { id: 'kyiv',        ll: [30.5238, 50.4501], native: 'Київ',          german: 'Kiew',             changed: '1941', restored: '1943', country: 'Ukraine' },
  { id: 'lviv',        ll: [24.0316, 49.8397], native: 'Львів',         german: 'Lemberg',          changed: '1941', restored: '1944', country: 'Ukraine' },
  { id: 'dnipro',      ll: [35.0452, 48.4647], native: 'Дніпро',        german: 'Dnepropetrowsk',   changed: '1941', restored: '1943', country: 'Ukraine' },
  { id: 'minsk',       ll: [27.5615, 53.9045], native: 'Мінск',         german: 'Minsk',            changed: '1941', restored: '1944', country: 'Belarus' },
  { id: 'brest',       ll: [23.6883, 52.0976], native: 'Брэст',         german: 'Brest-Litowsk',    changed: '1941', restored: '1944', country: 'Belarus' },
  { id: 'kharkiv',     ll: [36.2304, 49.9935], native: 'Харків',        german: 'Charkow',          changed: '1941', restored: '1943', country: 'Ukraine' },

  // Denmark / Norway
  { id: 'oslo',        ll: [10.7522, 59.9139], native: 'Oslo',          german: 'Oslo',             changed: '1940', restored: '1945', country: 'Norway' },
  { id: 'trondheim',   ll: [10.3951, 63.4305], native: 'Trondheim',     german: 'Drontheim',        changed: '1940', restored: '1945', country: 'Norway' },
  { id: 'copenhagen',  ll: [12.5683, 55.6761], native: 'København',     german: 'Kopenhagen',       changed: '1940', restored: '1945', country: 'Denmark' },

  // Austria (Ostmark)
  { id: 'vienna',      ll: [16.3738, 48.2082], native: 'Wien',          german: 'Wien (Ostmark)',   changed: '1938', restored: '1945', country: 'Austria (Ostmark)' },
  { id: 'graz',        ll: [15.4395, 47.0707], native: 'Graz',          german: 'Graz',             changed: '1938', restored: '1945', country: 'Austria (Ostmark)' },
  { id: 'salzburg',    ll: [13.0550, 47.8095], native: 'Salzburg',      german: 'Salzburg',         changed: '1938', restored: '1945', country: 'Austria (Ostmark)' },
  { id: 'innsbruck',   ll: [11.3923, 47.2692], native: 'Innsbruck',     german: 'Innsbruck',        changed: '1938', restored: '1945', country: 'Austria (Ostmark)' },

  // Serbia / Croatia
  { id: 'belgrade',    ll: [20.4651, 44.8176], native: 'Beograd',       german: 'Belgrad',          changed: '1941', restored: '1944', country: 'Serbia' },
  { id: 'sarajevo',    ll: [18.4131, 43.8563], native: 'Sarajevo',      german: 'Sarajevo',         changed: '1941', restored: '1945', country: 'Croatia (puppet)' },
  { id: 'zagreb',      ll: [15.9819, 45.8150], native: 'Zagreb',        german: 'Agram',            changed: '1941', restored: '1945', country: 'Croatia (puppet)' },

  // Romania / Hungary border region
  { id: 'cluj',        ll: [23.5960, 46.7712], native: 'Cluj-Napoca',   german: 'Klausenburg',      changed: '1940', restored: '1945', country: 'Transylvania' },
  { id: 'timisoara',   ll: [21.2087, 45.7489], native: 'Timișoara',     german: 'Temeswar',         changed: '1941', restored: '1945', country: 'Romania' },
]

// ─── ADMINISTRATIVE ZONES ─────────────────────────────────────────────────────
export const ADMIN_ZONES = [
  { id: 'bohemia',      label: 'Protectorate of\nBohemia & Moravia', center: [16.0, 49.8],  color: C.annexed,   years: '1939–1945' },
  { id: 'gen_gov',      label: 'General\nGovernment',               center: [21.5, 51.2],  color: C.occupied,  years: '1939–1945' },
  { id: 'rk_ukraine',   label: 'Reichskommissariat\nUkraine',       center: [33.0, 49.5],  color: C.occupied,  years: '1941–1944' },
  { id: 'rk_ostland',   label: 'Reichskommissariat\nOstland',       center: [24.0, 56.0],  color: C.occupied,  years: '1941–1944' },
  { id: 'ostmark',      label: 'Ostmark\n(Austria)',                center: [14.0, 47.5],  color: C.annexed,   years: '1938–1945' },
  { id: 'alsace',       label: 'Gau Baden-\nElsaß',                center: [7.5, 48.3],   color: C.annexed,   years: '1940–1944' },
  { id: 'vichy',        label: 'Zone Libre\n(Vichy)',               center: [3.0, 45.5],   color: C.puppet,    years: '1940–1942' },
  { id: 'ndk',          label: 'Military Adm.\nFrance-Belgium',     center: [4.0, 50.5],   color: C.occupied,  years: '1940–1944' },
]

// ─── INFRASTRUCTURE HUBS ──────────────────────────────────────────────────────
export const HUBS = [
  { id: 'berlin',   ll: [13.4050, 52.5200], label: 'Berlin',   role: 'Administrative Centre' },
  { id: 'warsaw',   ll: [21.0122, 52.2297], label: 'Warsaw',   role: 'Logistics Hub — Eastern Front' },
  { id: 'prague',   ll: [14.4378, 50.0755], label: 'Prague',   role: 'Protectorate Capital' },
  { id: 'vienna',   ll: [16.3738, 48.2082], label: 'Vienna',   role: 'Southern Gateway' },
  { id: 'paris',    ll: [2.3522, 48.8566],  label: 'Paris',    role: 'Western Occupation HQ' },
  { id: 'brussels', ll: [4.3517, 50.8503],  label: 'Brussels', role: 'Belgian Military Admin.' },
  { id: 'riga',     ll: [24.1052, 56.9496], label: 'Riga',     role: 'Ostland Rail Junction' },
  { id: 'kyiv',     ll: [30.5238, 50.4501], label: 'Kyiv',     role: 'Ukraine Admin. Centre' },
]

// ─── RESISTANCE HOTSPOTS ──────────────────────────────────────────────────────
export const RESISTANCE = [
  { id: 'warsaw_uprising', ll: [21.0122, 52.2297], label: 'Warsaw Uprising',     year: '1944', desc: '63 days. 200,000 civilian deaths. The city razed.' },
  { id: 'french_maquis',   ll: [3.8767, 43.6119],  label: 'French Maquis',       year: '1943', desc: 'Rural guerrilla networks across southern France.' },
  { id: 'yugoslav',        ll: [19.8335, 43.8563],  label: 'Yugoslav Partisans',  year: '1941', desc: 'Tito\'s forces held the Nazis in a four-year campaign.' },
  { id: 'prague_spring',   ll: [14.4378, 50.0755],  label: 'Prague Resistance',   year: '1942', desc: 'Operation Anthropoid — assassination of Heydrich.' },
  { id: 'amsterdam',       ll: [4.9041, 52.3676],   label: 'Dutch Resistance',    year: '1941', desc: 'Feb. Strike and underground networks protecting Jews.' },
  { id: 'greek_elas',      ll: [22.4341, 39.3665],  label: 'Greek ELAS',          year: '1942', desc: 'Largest resistance movement in the Mediterranean.' },
  { id: 'belarusian',      ll: [27.5615, 53.9045],  label: 'Soviet Partisans',    year: '1941', desc: 'Forest-based partisan warfare behind German lines.' },
]

// ─── CHAPTERS ─────────────────────────────────────────────────────────────────
export const CHAPTERS = [
  {
    id: 'before',
    type: 'calm',
    year: '1938',
    badge: 'BEFORE OCCUPATION',
    title: 'Europe Before Transformation',
    subtitle: 'A continent of many names',
    body: 'Before occupation, Europe spoke in many names. Languages shaped the land. Cities carried centuries of identity. What you called a place said everything about who you were.',
    quote: 'Geography is identity. To rename a place is to begin erasing a people.',
    mapCenter: [15.0, 50.5],
    mapZoom: 4.2,
    showOccupation: false,
    showNames: 'native',
    showAdminZones: false,
    showInfrastructure: false,
    showResistance: false,
  },
  {
    id: 'annexation_38',
    type: 'spread',
    year: '1938',
    badge: 'ANSCHLUSS & SUDETENLAND',
    title: 'The First Absorptions',
    subtitle: '1938 — Austria and the Sudetenland annexed',
    body: 'Austria is absorbed into the Reich. The Sudetenland is ceded by international agreement. Neither population was fully consulted. Borders begin to redraw themselves.',
    quote: 'The map changed before anyone had time to mourn.',
    mapCenter: [14.0, 48.5],
    mapZoom: 5.5,
    showOccupation: ['annexed_1938'],
    showNames: 'native',
    showAdminZones: false,
    showInfrastructure: false,
    showResistance: false,
    highlight: ['vienna', 'salzburg', 'liberec', 'karlovy'],
  },
  {
    id: 'poland_39',
    type: 'spread',
    year: '1939',
    badge: 'POLAND DIVIDED',
    title: 'Two Invasions, One Erasure',
    subtitle: '1939 — Poland invaded from west and east',
    body: 'In seventeen days, Poland ceases to exist as a state. Its western cities are annexed into the Reich. Its language is banned in schools. Its place names begin to change overnight.',
    quote: 'Borders changed faster than identities.',
    mapCenter: [19.5, 52.0],
    mapZoom: 5.8,
    showOccupation: ['annexed_1938', 'poland_1939'],
    showNames: 'transitioning',
    showAdminZones: false,
    showInfrastructure: false,
    showResistance: false,
    highlight: ['gdansk', 'wroclaw', 'poznan', 'lodz', 'torun'],
  },
  {
    id: 'west_1940',
    type: 'spread',
    year: '1940',
    badge: 'THE WESTERN SWEEP',
    title: 'France, Belgium, the North',
    subtitle: '1940 — Western Europe under occupation',
    body: 'France falls in six weeks. Belgium, the Netherlands, Denmark, Norway follow. The map of occupied Europe nearly doubles in six months. Vichy France becomes a collaboration state.',
    quote: 'Occupation moved faster than any map could record.',
    mapCenter: [8.0, 50.0],
    mapZoom: 4.8,
    showOccupation: ['annexed_1938', 'poland_1939', 'west_1940'],
    showNames: 'transitioning',
    showAdminZones: false,
    showInfrastructure: false,
    showResistance: false,
    highlight: ['strasbourg', 'metz', 'paris', 'liege', 'copenhagen'],
  },
  {
    id: 'east_1941',
    type: 'spread',
    year: '1941',
    badge: 'OPERATION BARBAROSSA',
    title: 'The Eastern Turn',
    subtitle: '1941 — Balkans and Soviet territories',
    body: 'The Reich turns east. Yugoslavia falls. Greece is occupied. Three million soldiers enter Soviet territory. The Reichskommissariats extend Nazi administration across Ukraine and the Baltic states.',
    quote: 'Every city that fell was renamed within weeks.',
    mapCenter: [22.0, 50.0],
    mapZoom: 4.0,
    showOccupation: ['annexed_1938', 'poland_1939', 'west_1940', 'east_1941'],
    showNames: 'transitioning',
    showAdminZones: false,
    showInfrastructure: false,
    showResistance: false,
    highlight: ['ljubljana', 'tallinn', 'riga', 'vilnius', 'kyiv', 'lviv'],
  },
  {
    id: 'peak_1942',
    type: 'peak',
    year: '1942',
    badge: 'PEAK OCCUPATION',
    title: 'Europe at Maximum Control',
    subtitle: '1942 — The furthest extent of Reich territory',
    body: 'At its peak, the Reich controls or influences nearly all of continental Europe. Seventeen countries. Hundreds of millions of people. Thousands of places renamed. An entire continent administered under a foreign grammar.',
    quote: 'The German language was made to sound like the future. It was not.',
    mapCenter: [18.0, 50.0],
    mapZoom: 3.8,
    showOccupation: 'all',
    showNames: 'german',
    showAdminZones: false,
    showInfrastructure: false,
    showResistance: false,
    highlight: null,
  },
  {
    id: 'renamed',
    type: 'renaming',
    year: '1939–1944',
    badge: 'THE RENAMED CONTINENT',
    title: 'The Geography of Renaming',
    subtitle: 'Cities speak a foreign tongue',
    body: 'Across occupied Europe, thousands of places were given German names by administrative decree. Street signs changed. Maps were reprinted. School textbooks replaced. To speak the native name became an act of defiance.',
    quote: 'To rename a city is to claim its memory.',
    mapCenter: [16.0, 50.5],
    mapZoom: 4.0,
    showOccupation: 'all',
    showNames: 'german',
    showAdminZones: false,
    showInfrastructure: false,
    showResistance: false,
    showAllRenamed: true,
    highlight: null,
  },
  {
    id: 'admin',
    type: 'administrative',
    year: '1939–1944',
    badge: 'ADMINISTRATIVE REORGANIZATION',
    title: 'Europe Reorganized',
    subtitle: 'New borders, new governors, new grammar',
    body: 'The Reich did not simply conquer — it restructured. Poland became the General Government. Ukraine became a Reichskommissariat. Bohemia became a Protectorate. A new administrative vocabulary replaced centuries of sovereignty.',
    quote: 'Governance followed geography. Control followed names.',
    mapCenter: [18.0, 50.5],
    mapZoom: 4.0,
    showOccupation: 'all',
    showNames: 'german',
    showAdminZones: true,
    showInfrastructure: false,
    showResistance: false,
    highlight: null,
  },
  {
    id: 'infrastructure',
    type: 'infrastructure',
    year: '1940–1944',
    badge: 'CONTROL & MOVEMENT',
    title: 'Occupation Followed Infrastructure',
    subtitle: 'Rail, road, and administrative corridors',
    body: 'Every occupied city became a node in a system designed for extraction and control. Trains carried administrators, soldiers, goods — and people to their deaths. The railways were the nervous system of occupation.',
    quote: 'Occupation depended on movement.',
    mapCenter: [16.0, 50.5],
    mapZoom: 4.0,
    showOccupation: 'all',
    showNames: 'german',
    showAdminZones: false,
    showInfrastructure: true,
    showResistance: false,
    highlight: null,
  },
  {
    id: 'resistance',
    type: 'resistance',
    year: '1941–1944',
    badge: 'NOT ALL MAPS STAYED QUIET',
    title: 'The Maps That Refused',
    subtitle: 'Resistance across occupied Europe',
    body: 'Underground presses printed banned maps using native names. Forest fighters named their camps in their own languages. Resistance was, in part, an act of cartographic defiance — insisting that a place still had its true name.',
    quote: 'They could change the signs. They could not change what people whispered.',
    mapCenter: [16.0, 50.0],
    mapZoom: 4.0,
    showOccupation: 'all',
    showNames: 'german',
    showAdminZones: false,
    showInfrastructure: false,
    showResistance: true,
    highlight: null,
  },
  {
    id: 'restoration',
    type: 'restoration',
    year: '1944–1945',
    badge: 'NAMES RETURN',
    title: 'The Geography Remembers',
    subtitle: 'Occupation retreats. Native names return.',
    body: 'As Allied forces moved across Europe, the first act in many cities was to restore street signs. To say the old name aloud again. Prag became Praha. Danzig became Gdańsk. Laibach became Ljubljana. Occupation changed maps. Memory restored them.',
    quote: 'Occupation changed maps.\nMemory restored them.',
    mapCenter: [16.0, 50.0],
    mapZoom: 4.0,
    showOccupation: 'retreating',
    showNames: 'restoring',
    showAdminZones: false,
    showInfrastructure: false,
    showResistance: false,
    highlight: null,
  },
]

export const DUR = 9000 // ms per chapter in autoplay