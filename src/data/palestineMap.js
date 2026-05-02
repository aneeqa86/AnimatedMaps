// src/data/palestineMap.js

export const DASTOOR_POEM = [
  { urdu: 'دیپ جس کا محلّات ہی میں جلے',      english: 'A lamp that only lights the palaces of the powerful' },
  { urdu: 'چند لوگوں کی خوشیوں کو لے کر چلے', english: 'They marched forth carrying only the happiness of a few' },
  { urdu: 'وہ جو سائے میں ہر مصلحت کے پلے',    english: 'Those who were raised in the shadow of every compromise' },
  { urdu: 'ایسے دستور کو، صبحِ بے نور کو',     english: 'Such a constitution, such a lightless dawn' },
  { urdu: 'میں نہیں مانتا، میں نہیں جانتا',    english: 'I do not accept this, I do not recognise this' },
  { urdu: 'تم نے لوٹا ہے صدیوں ہمارا سکوں',    english: 'You have plundered our peace for centuries' },
  { urdu: 'اب نہ ہم پر چلے گا تمہارا فسوں',    english: 'Your spell will no longer work on us' },
  { urdu: 'ایسے دستور کو، صبحِ بے نور کو',     english: 'Such a constitution, such a lightless dawn' },
  { urdu: 'میں نہیں مانتا، میں نہیں جانتا',    english: 'I do not accept this, I do not recognise this' },
];

// Palestine flag colors: black, white, green, red
// Israel blue: #0038b8
// Territory fill configs per chapter
// Each chapter specifies which overlay layers to show and their colors
export const CHAPTER_TERRITORY = {
  // 1917: All of historic Palestine — Palestinian flag colors (green fill)
  balfour: {
    showHistoric: true,  historicColor: '#007A3D', historicOpacity: 0.35,  // Palestinian green
    showIsrael:   false,
    showWestBank: false,
    showGaza:     false,
    boundaryColor: '#007A3D', boundaryWidth: 2,
  },
  // 1947: Historic Palestine with partition line suggested
  partition: {
    showHistoric: true,  historicColor: '#007A3D', historicOpacity: 0.28,
    showIsrael:   true,  israelColor: '#0038b8',   israelOpacity: 0.2,
    showWestBank: false,
    showGaza:     false,
    boundaryColor: '#007A3D', boundaryWidth: 2,
  },
  // 1948 Nakba: Historic shrinks, blood red
  nakba: {
    showHistoric: true,  historicColor: '#CE1126', historicOpacity: 0.28, // Palestinian red
    showIsrael:   true,  israelColor: '#0038b8',   israelOpacity: 0.28,
    showWestBank: true,  westBankColor: '#007A3D', westBankOpacity: 0.45,
    showGaza:     true,  gazaColor: '#007A3D',     gazaOpacity: 0.45,
    boundaryColor: '#CE1126', boundaryWidth: 2,
    showFlows: true,
  },
  // 1967: Occupation — WB and Gaza highlighted red (occupied)
  sixday: {
    showHistoric: false,
    showIsrael:   true,  israelColor: '#0038b8',   israelOpacity: 0.22,
    showWestBank: true,  westBankColor: '#CE1126', westBankOpacity: 0.35,
    showGaza:     true,  gazaColor: '#CE1126',     gazaOpacity: 0.35,
    boundaryColor: '#CE1126', boundaryWidth: 2,
  },
  intifada1: {
    showHistoric: false,
    showIsrael:   true,  israelColor: '#0038b8',   israelOpacity: 0.2,
    showWestBank: true,  westBankColor: '#CE1126', westBankOpacity: 0.3,
    showGaza:     true,  gazaColor: '#CE1126',     gazaOpacity: 0.3,
    boundaryColor: '#CE1126', boundaryWidth: 1.5,
  },
  oslo: {
    showHistoric: false,
    showIsrael:   true,  israelColor: '#0038b8',   israelOpacity: 0.18,
    showWestBank: true,  westBankColor: '#007A3D', westBankOpacity: 0.35,
    showGaza:     true,  gazaColor: '#007A3D',     gazaOpacity: 0.35,
    boundaryColor: '#007A3D', boundaryWidth: 1.5,
  },
  settlements: {
    showHistoric: false,
    showIsrael:   true,  israelColor: '#0038b8',   israelOpacity: 0.22,
    showWestBank: true,  westBankColor: '#CE1126', westBankOpacity: 0.25,
    showGaza:     true,  gazaColor: '#007A3D',     gazaOpacity: 0.3,
    boundaryColor: '#CE1126', boundaryWidth: 1.5,
  },
  blockade: {
    showHistoric: false,
    showIsrael:   true,  israelColor: '#0038b8',   israelOpacity: 0.18,
    showWestBank: true,  westBankColor: '#CE1126', westBankOpacity: 0.2,
    showGaza:     true,  gazaColor: '#CE1126',     gazaOpacity: 0.5,
    boundaryColor: '#CE1126', boundaryWidth: 2,
  },
  oct2023: {
    showHistoric: false,
    showIsrael:   true,  israelColor: '#0038b8',   israelOpacity: 0.18,
    showWestBank: true,  westBankColor: '#CE1126', westBankOpacity: 0.25,
    showGaza:     true,  gazaColor: '#CE1126',     gazaOpacity: 0.7,
    boundaryColor: '#CE1126', boundaryWidth: 3,
  },
  memory: {
    showHistoric: true,  historicColor: '#007A3D', historicOpacity: 0.2,
    showIsrael:   false,
    showWestBank: true,  westBankColor: '#007A3D', westBankOpacity: 0.4,
    showGaza:     true,  gazaColor: '#007A3D',     gazaOpacity: 0.4,
    boundaryColor: '#007A3D', boundaryWidth: 2,
  },
};

// Simplified GeoJSON polygons
// Historic Palestine (full mandate)
export const HISTORIC_PALESTINE_GEOJSON = {
  type: 'Feature',
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [34.21, 29.50], [34.48, 29.50], [34.88, 29.50], [35.00, 29.62],
      [35.15, 29.72], [35.45, 29.76], [35.64, 29.98], [35.78, 30.52],
      [35.90, 31.00], [35.98, 31.22], [35.55, 31.48], [35.58, 31.76],
      [35.57, 32.02], [35.68, 32.46], [35.70, 32.70], [35.63, 33.05],
      [35.10, 33.28], [34.85, 33.10], [34.54, 32.97], [34.29, 32.70],
      [34.06, 32.46], [34.00, 32.08], [34.00, 31.66], [34.07, 31.23],
      [34.18, 30.82], [34.21, 30.40], [34.21, 29.50],
    ]],
  },
};

// West Bank (approximate)
export const WEST_BANK_GEOJSON = {
  type: 'Feature',
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [34.90, 31.35], [35.05, 31.38], [35.20, 31.32], [35.55, 31.48],
      [35.58, 31.76], [35.57, 32.02], [35.50, 32.38], [35.42, 32.52],
      [35.10, 32.58], [34.97, 32.36], [34.92, 32.08], [34.89, 31.78],
      [34.90, 31.35],
    ]],
  },
};

// Gaza Strip (approximate)
export const GAZA_GEOJSON = {
  type: 'Feature',
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [34.22, 31.22], [34.24, 31.20], [34.36, 31.08], [34.49, 31.05],
      [34.56, 31.22], [34.56, 31.42], [34.53, 31.60], [34.50, 31.70],
      [34.24, 31.68], [34.22, 31.50], [34.22, 31.22],
    ]],
  },
};

export const CHAPTER_MARKERS = {
  balfour: [],
  partition: [
    { id: 'm-jerusalem', coords: [35.2332, 31.7683], label: 'Jerusalem / القدس', icon: '🕌' },
    { id: 'm-haifa',     coords: [34.9896, 32.7940], label: 'Haifa / حيفا',       icon: '🕊️' },
    { id: 'm-jaffa',     coords: [34.7532, 32.0505], label: 'Jaffa / يافا',       icon: '🕊️' },
  ],
  nakba: [
    { id: 'm-haifa',       coords: [34.9896, 32.7940], label: 'Haifa — expelled',       icon: '🩸', pulse: true  },
    { id: 'm-jaffa',       coords: [34.7532, 32.0505], label: 'Jaffa — expelled',       icon: '🩸', pulse: true  },
    { id: 'm-deir-yassin', coords: [35.1650, 31.8000], label: 'Deir Yassin — massacre', icon: '🩸', pulse: true  },
    { id: 'm-jerusalem',   coords: [35.2332, 31.7683], label: 'Jerusalem / القدس',      icon: '🕌', pulse: false },
  ],
  sixday: [
    { id: 'm-jerusalem', coords: [35.2332, 31.7683], label: 'Jerusalem — occupied', icon: '⚔️', pulse: false },
    { id: 'm-gaza',      coords: [34.4667, 31.5000], label: 'Gaza — occupied',      icon: '⚔️', pulse: false },
    { id: 'm-ramallah',  coords: [35.2057, 31.9038], label: 'Ramallah — occupied',  icon: '⚔️', pulse: false },
    { id: 'm-hebron',    coords: [35.0998, 31.5326], label: 'Hebron — occupied',    icon: '⚔️', pulse: false },
    { id: 'm-nablus',    coords: [35.2636, 32.2211], label: 'Nablus — occupied',    icon: '⚔️', pulse: false },
  ],
  intifada1: [
    { id: 'm-gaza',   coords: [34.4667, 31.5000], label: 'Gaza — uprising',   icon: '✊', pulse: false },
    { id: 'm-nablus', coords: [35.2636, 32.2211], label: 'Nablus — uprising', icon: '✊', pulse: false },
    { id: 'm-jenin',  coords: [35.2960, 32.4647], label: 'Jenin — uprising',  icon: '✊', pulse: false },
    { id: 'm-hebron', coords: [35.0998, 31.5326], label: 'Hebron — uprising', icon: '✊', pulse: false },
  ],
  oslo: [
    { id: 'm-ramallah',  coords: [35.2057, 31.9038], label: 'Ramallah — PA HQ',    icon: '📜', pulse: false },
    { id: 'm-jerusalem', coords: [35.2332, 31.7683], label: 'Jerusalem — disputed', icon: '🕌', pulse: false },
  ],
  settlements: [
    { id: 'm-nablus',   coords: [35.2636, 32.2211], label: 'Nablus — settlements',  icon: '🏗️', pulse: false },
    { id: 'm-hebron',   coords: [35.0998, 31.5326], label: 'Hebron — settlements',  icon: '🏗️', pulse: false },
    { id: 'm-jenin',    coords: [35.2960, 32.4647], label: 'Jenin — settlements',   icon: '🏗️', pulse: false },
    { id: 'm-ramallah', coords: [35.2057, 31.9038], label: 'Ramallah',              icon: '🏛️', pulse: false },
  ],
  blockade: [
    { id: 'm-gaza',  coords: [34.4667, 31.5000], label: 'Gaza — blockaded', icon: '🔒', pulse: true  },
    { id: 'm-rafah', coords: [34.2553, 31.2867], label: 'Rafah — sealed',   icon: '🔒', pulse: false },
  ],
  oct2023: [
    { id: 'm-gaza',       coords: [34.4667, 31.5000], label: 'Gaza City — bombed',  icon: '🔥', pulse: true  },
    { id: 'm-rafah',      coords: [34.2553, 31.2867], label: 'Rafah — bombed',      icon: '🔥', pulse: true  },
    { id: 'm-khan-yunis', coords: [34.3067, 31.3414], label: 'Khan Yunis — bombed', icon: '🩸', pulse: true  },
    { id: 'm-jabalia',    coords: [34.4997, 31.5308], label: 'Jabalia — bombed',    icon: '🩸', pulse: true  },
    { id: 'm-nablus',     coords: [35.2636, 32.2211], label: 'Nablus — raids',      icon: '🩸', pulse: false },
    { id: 'm-jenin',      coords: [35.2960, 32.4647], label: 'Jenin — raids',       icon: '🩸', pulse: false },
  ],
  memory: [
    { id: 'm-jerusalem', coords: [35.2332, 31.7683], label: 'Jerusalem', icon: '🫒', pulse: false },
    { id: 'm-gaza',      coords: [34.4667, 31.5000], label: 'Gaza',      icon: '🫒', pulse: false },
    { id: 'm-ramallah',  coords: [35.2057, 31.9038], label: 'Ramallah',  icon: '🫒', pulse: false },
    { id: 'm-haifa',     coords: [34.9896, 32.7940], label: 'Haifa',     icon: '🫒', pulse: false },
    { id: 'm-jaffa',     coords: [34.7532, 32.0505], label: 'Jaffa',     icon: '🫒', pulse: false },
    { id: 'm-hebron',    coords: [35.0998, 31.5326], label: 'Hebron',    icon: '🫒', pulse: false },
    { id: 'm-nablus',    coords: [35.2636, 32.2211], label: 'Nablus',    icon: '🫒', pulse: false },
  ],
};

export const CHAPTERS = [
  {
    id: 'balfour', type: 'mandate', icon: '🏛️',
    year: '1917', badge: 'BALFOUR DECLARATION',
    title: 'A Promise Not Theirs to Give',
    subtitle: 'Britain pledges Palestine to Zionist settlers — without asking Palestinians',
    body: 'On November 2, 1917, British Foreign Secretary Arthur Balfour wrote a letter promising a "national home" for Jewish people in Palestine — a land where 700,000 Arabs already lived.',
    coupletIndex: 0,
    stat: 700000, statLabel: 'Palestinians in mandate Palestine', statSuffix: '',
    quote: 'His Majesty\'s Government view with favour the establishment in Palestine of a national home for the Jewish people.',
    quoteAuthor: 'Balfour Declaration, 1917',
    mapFocus: { center: [35.2, 31.8], zoom: 6.5 },
  },
  {
    id: 'partition', type: 'partition', icon: '✂️',
    year: '1947', badge: 'UN PARTITION PLAN',
    title: 'The Map That Broke a People',
    subtitle: 'UN Resolution 181 divides Palestine — 56% to Jewish state, 44% to Arab state',
    body: 'The UN General Assembly voted to partition Palestine. Jewish population owned 6% of the land but received 56% under the plan. Palestinian Arabs — the majority — rejected it entirely.',
    coupletIndex: 1,
    stat: 56, statLabel: '% of land allocated to Jewish state', statSuffix: '%',
    quote: 'The Arab people of Palestine will never submit or yield to any power going to impose partition upon them.',
    quoteAuthor: 'Arab League, 1947',
    mapFocus: { center: [35.2, 31.8], zoom: 7 },
  },
  {
    id: 'nakba', type: 'nakba', icon: '🕊️',
    year: '1948', badge: 'AL-NAKBA — THE CATASTROPHE',
    title: 'The Villages That Vanished',
    subtitle: '750,000 Palestinians expelled. 530 villages destroyed.',
    body: 'Between 1947 and 1949, Zionist militias and Israeli forces expelled 750,000 Palestinians. Over 530 villages were depopulated and destroyed.',
    coupletIndex: 2,
    stat: 530, statLabel: 'Palestinian villages destroyed', statSuffix: '',
    quote: 'We did not take a foreign land. We returned to our homeland.',
    quoteAuthor: 'David Ben-Gurion, 1948',
    mapFocus: { center: [35.0, 31.5], zoom: 7 },
  },
  {
    id: 'sixday', type: 'occupation', icon: '⚔️',
    year: '1967', badge: 'SIX-DAY WAR',
    title: 'The Occupation Begins',
    subtitle: 'Israel captures West Bank, Gaza, Sinai, and Golan Heights in six days',
    body: 'In June 1967, Israel captured the West Bank, Gaza Strip, Sinai and Golan Heights. The remaining 22% of historic Palestine fell under military occupation.',
    coupletIndex: 3,
    stat: 22, statLabel: '% of historic Palestine remaining', statSuffix: '%',
    quote: 'We intend to remain. Period.',
    quoteAuthor: 'Israeli Defense Minister Moshe Dayan, 1967',
    mapFocus: { center: [35.3, 31.9], zoom: 7 },
  },
  {
    id: 'intifada1', type: 'resistance', icon: '✊',
    year: '1987', badge: 'FIRST INTIFADA',
    title: 'The Stone Uprising',
    subtitle: 'Palestinian mass uprising erupts across Gaza and the West Bank',
    body: 'Two decades of occupation boiled over in December 1987. Palestinians launched a mass uprising — strikes, boycotts, stone-throwing against tanks.',
    coupletIndex: 4,
    stat: 1162, statLabel: 'Palestinians killed in First Intifada', statSuffix: '',
    quote: 'ہم پتھر اٹھائیں گے — We will pick up stones.',
    quoteAuthor: 'Palestinian proverb, Intifada era',
    mapFocus: { center: [35.2, 31.9], zoom: 8 },
  },
  {
    id: 'oslo', type: 'accords', icon: '📜',
    year: '1993', badge: 'OSLO ACCORDS',
    title: "Peace That Wasn't",
    subtitle: 'A handshake on the White House lawn. Settlements kept growing.',
    body: 'The Oslo Accords created the Palestinian Authority and divided the West Bank into Areas A, B, and C — Israel retaining full control of C (60%). Settlements continued to expand.',
    coupletIndex: 5,
    stat: 60, statLabel: '% of West Bank under full Israeli control', statSuffix: '%',
    quote: 'Oslo created a Palestinian police force to police Palestinians on behalf of the occupation.',
    quoteAuthor: 'Edward Said, 1993',
    mapFocus: { center: [35.3, 32.0], zoom: 8 },
  },
  {
    id: 'settlements', type: 'occupation', icon: '🏗️',
    year: '2000s', badge: 'SETTLEMENT EXPANSION',
    title: 'The Slow Erasure',
    subtitle: 'Illegal settlements carve the West Bank into disconnected fragments',
    body: 'Israeli settlements — illegal under international law — spread across the West Bank. The settler population grew from 200,000 to over 700,000.',
    coupletIndex: 6,
    stat: 700000, statLabel: 'Israeli settlers in occupied West Bank', statSuffix: '+',
    quote: 'Every new settlement is a nail in the coffin of the two-state solution.',
    quoteAuthor: 'UN Special Rapporteur, 2023',
    mapFocus: { center: [35.3, 31.9], zoom: 8 },
  },
  {
    id: 'blockade', type: 'siege', icon: '🔒',
    year: '2007', badge: 'GAZA BLOCKADE',
    title: "The World's Largest Open-Air Prison",
    subtitle: 'Gaza sealed by land, air, and sea. 2.3 million people enclosed.',
    body: 'After Hamas won Palestinian elections in 2006, Israel imposed a total blockade on Gaza. 2.3 million people enclosed in 365 km².',
    coupletIndex: 7,
    stat: 365, statLabel: "square kilometers — Gaza's total area", statSuffix: 'km²',
    quote: 'We will put the Palestinians on a diet, but not make them die of hunger.',
    quoteAuthor: 'Israeli official Dov Weissglass, 2006',
    mapFocus: { center: [34.4, 31.5], zoom: 10 },
  },
  {
    id: 'oct2023', type: 'war', icon: '🔥',
    year: '2023–2024', badge: 'GENOCIDE IN GAZA',
    title: 'Gaza Burns',
    subtitle: '45,000+ killed. 90% displaced. Most of Gaza destroyed.',
    body: 'On October 7, 2023, Hamas launched an attack killing 1,200 Israelis. Israel\'s response was total war on Gaza. Over 45,000 Palestinians killed, 75% of buildings destroyed.',
    coupletIndex: 8,
    stat: 45000, statLabel: 'Palestinians killed (2023–2024)', statSuffix: '+',
    quote: 'There are no innocent civilians in Gaza.',
    quoteAuthor: 'Israeli President Isaac Herzog, October 2023',
    mapFocus: { center: [34.45, 31.42], zoom: 10 },
  },
  {
    id: 'memory', type: 'memory', icon: '🫒',
    year: 'Since 1917', badge: 'SUMUD — صمود',
    title: 'We Remain',
    subtitle: 'Sumud: steadfast resistance through the act of remaining',
    body: 'Through every displacement, wall, checkpoint, and bomb — Palestinians remain. Sumud (صمود) means steadfastness: insisting on existence.',
    coupletIndex: 4, isRefrain: true,
    stat: 7, statLabel: 'million Palestinians in diaspora', statSuffix: 'M',
    quote: 'On this earth is what makes life worth living.',
    quoteAuthor: 'Mahmoud Darwish — On This Earth',
    mapFocus: { center: [35.2, 31.8], zoom: 6.5 },
  },
];

export const DISPLACEMENT_FLOWS = [
  { id: 'f-jordan',  from: [35.1, 31.9], to: [36.8, 31.9], color: '#CE1126' },
  { id: 'f-lebanon', from: [35.2, 32.5], to: [35.5, 33.8], color: '#CE1126' },
  { id: 'f-syria',   from: [35.3, 32.8], to: [36.3, 33.5], color: '#CE1126' },
  { id: 'f-gaza',    from: [34.9, 31.5], to: [34.4, 31.5], color: '#007A3D' },
  { id: 'f-wb',      from: [35.1, 31.7], to: [35.3, 32.1], color: '#007A3D' },
];

export const TERRITORY_TIMELINE = [
  { year: 1917, palestinianPct: 100 },
  { year: 1947, palestinianPct: 44  },
  { year: 1949, palestinianPct: 22  },
  { year: 1967, palestinianPct: 22  },
  { year: 1995, palestinianPct: 18  },
  { year: 2024, palestinianPct: 13  },
];

export const CHAPTER_TIMELINE_SNAP = {
  balfour: 0, partition: 1, nakba: 2, sixday: 3,
  intifada1: 3, oslo: 4, settlements: 4, blockade: 4,
  oct2023: 5, memory: 5,
};