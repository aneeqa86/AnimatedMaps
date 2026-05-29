// src/data/hajjMap.js
// The Eternal Road to Mecca — Ancient vs Modern Hajj routes

export const MECCA = { lng: 39.8262, lat: 21.4225 }

// ─── Chapter types ────────────────────────────────────────────────────────────
// 'ancient'  → camel footprint routes
// 'sea'      → ship wake routes
// 'modern'   → air arc routes
// 'reveal'   → dramatic full-screen moment, no routes

export const CHAPTERS = [
  {
    id: 'opening',
    type: 'reveal',
    era: 'eternal',
    year: '',
    badge: 'THE ETERNAL ROAD',
    arabicTitle: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ',
    arabicSub: 'لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ',
    title: 'Here I am, O Allah',
    subtitle: 'Here I am. There is no partner for You. Here I am.',
    body: 'For fourteen centuries, from every corner of the earth, Muslims have answered the same call. Across deserts that swallowed caravans whole. Across oceans that had no charts. Today, across skies that took centuries to conquer. One destination. One devotion. One road — walked in a thousand ways.',
    quote: 'Hajj is the journey that never ends — it begins the moment you hear the call, and finishes only when you return changed.',
    stat: 1400,
    statLabel: 'years of unbroken pilgrimage',
    mapCenter: [39.8262, 21.4225],
    mapZoom: 2.5,
    showRoutes: [],
  },
  {
    id: 'khorasan',
    type: 'ancient',
    era: 'ancient',
    year: '750 – 1258 CE',
    badge: 'THE KHORASAN ROAD',
    arabicTitle: 'طريق خراسان',
    title: 'From the Edge of the Known World',
    subtitle: 'Persia · Central Asia · 90 days by camel',
    body: 'The scholars and sultans of Khorasan — from Nishapur, Samarkand, Bukhara — walked west across the Persian plateau, through Baghdad, down the spine of Arabia. These were the roads of Ibn Battuta, of Al-Biruni. Caravans of 10,000 people. Three months of desert. The footprints still echo.',
    quote: 'I left my homeland with no provisions save trust in God and companionship of the road.',
    quoteAuthor: 'Ibn Battuta, 1325 CE',
    stat: 90,
    statLabel: 'days from Samarkand to Mecca',
    mapCenter: [55.0, 28.0],
    mapZoom: 3.2,
    showRoutes: ['khorasan', 'silkroad'],
  },
  {
    id: 'saharan',
    type: 'ancient',
    era: 'ancient',
    year: '1000 – 1500 CE',
    badge: 'THE SAHARAN CROSSING',
    arabicTitle: 'طريق الصحراء',
    title: 'Across the Great Thirst',
    subtitle: 'West Africa · Sahara · 6 months',
    body: 'Mansa Musa left Mali in 1324 with 60,000 people and 80 camels laden with gold. He was not exceptional — he was the most spectacular of thousands who crossed the Sahara annually to reach Mecca. Through the emptiness of the Sahara, through Sudan, up the Nile. A journey so long that some pilgrims were born and died on the road.',
    quote: 'The pilgrims of the Sahara did not count months. They counted wells.',
    stat: 6,
    statLabel: 'months across the Sahara on foot',
    mapCenter: [15.0, 20.0],
    mapZoom: 3.0,
    showRoutes: ['saharan', 'nile'],
  },
  {
    id: 'nile',
    type: 'ancient',
    era: 'ancient',
    year: '800 – 1900 CE',
    badge: 'THE NILE CORRIDOR',
    arabicTitle: 'درب السلطان',
    title: 'The Sultan\'s Road',
    subtitle: 'Egypt · Sudan · East Africa',
    body: 'Egypt was the gateway of Africa to Mecca. The Darb al-Sultani — the Sultan\'s Road — ran from Cairo south through Sinai into the Hejaz. The Mamluk sultans built forts and water cisterns every day\'s march along this route. Pilgrims from Egypt, Sudan, Ethiopia, Somalia — all funnelled through this ancient corridor. Cairo swelled with pilgrims every Dhul Hijja.',
    quote: 'The dust of Cairo was sacred — for it had been walked by every pilgrim who would walk to God.',
    stat: 1100,
    statLabel: 'kilometres from Cairo to Mecca',
    mapCenter: [32.0, 24.0],
    mapZoom: 3.8,
    showRoutes: ['nile', 'cairo'],
  },
  {
    id: 'sea',
    type: 'sea',
    era: 'ancient',
    year: '900 – 1800 CE',
    badge: 'THE DHOW ROUTES',
    arabicTitle: 'طريق البحر',
    title: 'Across the Indian Ocean',
    subtitle: 'India · Java · East Africa · By Dhow',
    body: 'The monsoon winds were a gift from God — they blew Arab dhows east in winter, back west in summer. Muslim traders from the Malabar Coast, from the Sultanates of Java and Sumatra, from the Swahili ports of Kilwa and Mombasa — they sailed to Aden or Jeddah, then walked to Mecca. The Indian Ocean was not a barrier. It was a highway.',
    quote: 'The sea does not separate the faithful. It carries them.',
    stat: 4500,
    statLabel: 'kilometres across the Indian Ocean by dhow',
    mapCenter: [65.0, 10.0],
    mapZoom: 3.0,
    showRoutes: ['india_sea', 'java_sea', 'africa_sea'],
  },
  {
    id: 'steam',
    type: 'modern',
    era: 'transition',
    year: '1869 – 1950',
    badge: 'THE AGE OF STEAM',
    arabicTitle: 'عصر البخار',
    title: 'The Suez Canal Opens Everything',
    subtitle: 'Steamships collapse the journey from months to weeks',
    body: 'The opening of the Suez Canal in 1869 changed Hajj forever. Steamships could carry thousands of pilgrims from Bombay to Jeddah in two weeks — a journey that once took four months by dhow. Colonial powers ran the first Hajj shipping lines. The British from India. The Dutch from the East Indies. Pilgrims from Southeast Asia could now actually survive the journey.',
    quote: 'The steam engine did more for Hajj than any sultan. Distance became time. Time became money.',
    stat: 14,
    statLabel: 'days Bombay to Jeddah by steamship, 1890',
    mapCenter: [50.0, 15.0],
    mapZoom: 3.0,
    showRoutes: ['steam_india', 'steam_egypt', 'steam_java'],
  },
  {
    id: 'airAge',
    type: 'modern',
    era: 'modern',
    year: '1947 – Today',
    badge: 'THE AIR AGE',
    arabicTitle: 'عصر الطيران',
    title: 'The Sky Becomes a Road',
    subtitle: 'What took 90 days now takes 9 hours',
    body: 'The first commercial Hajj flight landed in Jeddah in 1947 — a converted RAF transport from Pakistan. By 1975, Saudi Arabia had built King Abdulaziz International Airport specifically for the Hajj season. Today, 1.8 million of the 2.5 million pilgrims arrive by air. Every major airline in the Muslim world operates Hajj charters. The journey has not become easier — it has become faster.',
    quote: 'My grandfather walked for three months. My father sailed for three weeks. I flew for three hours. We all wept the same when we saw the Ka\'bah.',
    stat: 9,
    statLabel: 'hours Jakarta to Jeddah today',
    mapCenter: [50.0, 20.0],
    mapZoom: 2.2,
    showRoutes: ['air_pakistan', 'air_indonesia', 'air_nigeria', 'air_turkey', 'air_morocco', 'air_iran', 'air_india', 'air_uk', 'air_usa'],
  },
  {
    id: 'today',
    type: 'modern',
    era: 'modern',
    year: '2026',
    badge: 'THE CONVERGENCE',
    arabicTitle: 'التقاء الطرق',
    title: '11.8 Million. 180 Countries.',
    subtitle: 'The largest annual peaceful gathering in human history',
    body: 'In 2026, pilgrims from 180 nations converge on Mecca in numbers never seen before — 11.8 million souls answering the same call. Saudi Arabia\'s Vision 2030 expansion has transformed the Grand Mosque and its surrounds to receive this tide of devotion. Indonesia leads with over 800,000 pilgrims. Pakistan sends nearly 700,000. Bangladesh, Nigeria, India, and Turkey each dispatch hundreds of thousands more. Every air corridor in the Muslim world pulses during Dhul Hijja.',
    quote: 'In Hajj there is neither Arab nor non-Arab, neither rich nor poor, neither man nor woman — only the pilgrim.',
    stat: 11800000,
    statLabel: 'pilgrims in 2026',
    mapCenter: [39.8262, 21.4225],
    mapZoom: 2.0,
    showRoutes: ['air_pakistan', 'air_indonesia', 'air_nigeria', 'air_turkey', 'air_morocco', 'air_iran', 'air_india', 'air_uk', 'air_usa', 'air_malaysia', 'air_egypt', 'air_senegal'],
  },
  {
    id: 'mecca',
    type: 'reveal',
    era: 'eternal',
    year: 'Eternal',
    badge: 'THE ETERNAL CITY',
    arabicTitle: 'مَكَّةُ الْمُكَرَّمَة',
    title: 'Mecca the Blessed',
    subtitle: 'The center around which the world turns',
    body: 'Every route on this map ends at the same point. Every camel footprint, every ship wake, every flight arc — all converge on a single valley in the Hejaz. The journey changes with every century. The destination never does. The Ka\'bah has stood since before memory, draped in black silk embroidered with gold. In 2026, nearly 12 million hearts from 180 nations turned to face it. Around it, the world still turns.',
    quote: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ — Here I am, O Allah, here I am.',
    stat: 11800000,
    statLabel: 'hearts pointing to one place',
    mapCenter: [39.8262, 21.4225],
    mapZoom: 5.5,
    showRoutes: [],
  },
]

// ─── Ancient Camel Routes (footprint stamps) ───────────────────────────────────
// Each route: array of [lng, lat] coordinates
// The map will animate footprint stamps along these paths

export const ANCIENT_ROUTES = {
  khorasan: {
    id: 'khorasan',
    label: 'Khorasan Road',
    color: '#C4935A',
    coords: [
      [69.2, 41.3],   // Samarkand
      [63.6, 37.9],   // Merv
      [58.4, 37.6],   // Nishapur
      [51.4, 35.7],   // Tehran
      [44.4, 33.3],   // Baghdad
      [43.0, 32.0],   // Kufa
      [42.3, 29.4],   // Basra area
      [41.7, 24.7],   // Medina
      [39.8, 21.4],   // Mecca
    ],
  },
  silkroad: {
    id: 'silkroad',
    label: 'Silk Road Pilgrims',
    color: '#C4935A',
    coords: [
      [87.6, 43.8],   // Urumqi
      [75.0, 40.0],   // Kashgar
      [69.2, 41.3],   // Samarkand
      [63.6, 37.9],   // Merv
      [58.4, 37.6],   // Nishapur
      [51.4, 35.7],   // Tehran
      [44.4, 33.3],   // Baghdad
      [41.7, 24.7],   // Medina
      [39.8, 21.4],   // Mecca
    ],
  },
  saharan: {
    id: 'saharan',
    label: 'Saharan Crossing — Mansa Musa Route',
    color: '#C4935A',
    coords: [
      [-8.0, 12.6],   // Bamako, Mali
      [-4.0, 13.5],   // Segou
      [0.0, 15.0],    // Gao
      [13.5, 15.5],   // Agadez
      [22.0, 16.5],   // Tibesti area
      [30.0, 17.0],   // Kordofan Sudan
      [32.5, 15.5],   // Khartoum
      [34.0, 19.0],   // Kassala
      [37.5, 21.0],   // Taif approach
      [39.8, 21.4],   // Mecca
    ],
  },
  nile: {
    id: 'nile',
    label: 'Nile Corridor — Darb al-Sultani',
    color: '#C4935A',
    coords: [
      [31.2, 30.0],   // Cairo
      [32.3, 27.0],   // Sinai approach
      [34.3, 25.5],   // Aqaba
      [36.5, 23.5],   // Tabuk
      [38.5, 22.5],   // Al-Ula
      [39.6, 22.3],   // Medina outskirts
      [39.8, 21.4],   // Mecca
    ],
  },
  cairo: {
    id: 'cairo',
    label: 'East Africa via Cairo',
    color: '#B08040',
    coords: [
      [36.8, -1.3],   // Nairobi
      [39.7, 4.0],    // Mogadishu region
      [43.1, 11.6],   // Djibouti
      [43.7, 15.3],   // Massawa
      [38.0, 15.4],   // Khartoum upper
      [32.5, 15.5],   // Khartoum
      [31.2, 30.0],   // Cairo
      [32.3, 27.0],   // Sinai
      [39.8, 21.4],   // Mecca
    ],
  },
}

// ─── Sea Routes (ship wake stamps) ────────────────────────────────────────────
export const SEA_ROUTES = {
  india_sea: {
    id: 'india_sea',
    label: 'Malabar Coast Dhows',
    color: '#3A7A8C',
    coords: [
      [76.2, 11.0],   // Kozhikode (Calicut)
      [72.0, 12.0],   // Goa
      [66.0, 14.0],   // Mid Indian Ocean
      [58.0, 14.5],   // Arabian Sea
      [50.0, 15.0],   // Gulf of Aden
      [45.0, 13.0],   // Aden
      [43.0, 15.0],   // Bab-el-Mandeb
      [42.0, 17.0],   // Red Sea
      [39.2, 21.5],   // Jeddah
    ],
  },
  java_sea: {
    id: 'java_sea',
    label: 'Java & Sumatra Pilgrim Ships',
    color: '#3A7A8C',
    coords: [
      [107.0, -6.2],  // Batavia (Jakarta)
      [103.8, 1.3],   // Singapore
      [95.3, 5.5],    // Banda Aceh
      [80.0, 8.0],    // Sri Lanka
      [72.0, 14.0],   // Arabian Sea mid
      [58.0, 15.0],   // Socotra area
      [45.0, 13.0],   // Aden
      [42.0, 16.0],   // Red Sea
      [39.2, 21.5],   // Jeddah
    ],
  },
  africa_sea: {
    id: 'africa_sea',
    label: 'Swahili Coast Dhows',
    color: '#2A6070',
    coords: [
      [40.1, -3.2],   // Mombasa
      [39.7, 6.0],    // Mogadishu
      [43.1, 11.6],   // Djibouti
      [43.7, 13.5],   // Bab-el-Mandeb approach
      [43.0, 15.0],   // Bab-el-Mandeb strait
      [42.5, 16.5],   // Red Sea
      [41.5, 19.0],   // Red Sea mid
      [39.2, 21.5],   // Jeddah
    ],
  },
  // ─── Steam-era routes ────────────────────────────────────────────────────────
  steam_india: {
    id: 'steam_india',
    label: 'Bombay to Jeddah — P&O Steamship',
    color: '#7A9FAA',
    coords: [
      [72.8, 18.9],   // Bombay
      [62.0, 17.0],   // Mid Arabian Sea
      [55.0, 16.0],   // Gulf of Aden
      [48.0, 13.5],   // Aden
      [43.0, 15.5],   // Bab-el-Mandeb
      [39.2, 21.5],   // Jeddah
    ],
  },
  steam_egypt: {
    id: 'steam_egypt',
    label: 'Suez to Jeddah — Canal Route',
    color: '#7A9FAA',
    coords: [
      [2.3, 48.9],    // Paris
      [13.0, 37.5],   // Mediterranean
      [32.3, 31.2],   // Suez
      [38.0, 27.0],   // Red Sea north
      [39.2, 21.5],   // Jeddah
    ],
  },
  steam_java: {
    id: 'steam_java',
    label: 'Batavia to Jeddah — Dutch Line',
    color: '#5A8A9A',
    coords: [
      [106.8, -6.2],  // Jakarta
      [103.8, 1.3],   // Singapore
      [80.0, 8.0],    // Indian Ocean
      [58.0, 15.0],   // Arabian Sea
      [48.0, 13.5],   // Aden
      [39.2, 21.5],   // Jeddah
    ],
  },
}

// ─── Modern Air Routes (sharp arcs) ──────────────────────────────────────────
export const AIR_ROUTES = {
  air_pakistan: {
    id: 'air_pakistan',
    label: 'Pakistan',
    origin: [67.0, 24.9],    // Karachi
    dest: [39.2, 21.5],      // Jeddah
    color: '#E8DFC0',
    pilgrims: 700000,
  },
  air_indonesia: {
    id: 'air_indonesia',
    label: 'Indonesia',
    origin: [107.0, -6.2],   // Jakarta
    dest: [39.2, 21.5],
    color: '#E8DFC0',
    pilgrims: 840000,
  },
  air_nigeria: {
    id: 'air_nigeria',
    label: 'Nigeria',
    origin: [3.4, 6.5],      // Lagos
    dest: [39.2, 21.5],
    color: '#E8DFC0',
    pilgrims: 400000,
  },
  air_turkey: {
    id: 'air_turkey',
    label: 'Turkey',
    origin: [28.9, 41.0],    // Istanbul
    dest: [39.2, 21.5],
    color: '#E8DFC0',
    pilgrims: 350000,
  },
  air_morocco: {
    id: 'air_morocco',
    label: 'Morocco',
    origin: [-7.6, 33.6],    // Casablanca
    dest: [39.2, 21.5],
    color: '#E8DFC0',
    pilgrims: 180000,
  },
  air_iran: {
    id: 'air_iran',
    label: 'Iran',
    origin: [51.4, 35.7],    // Tehran
    dest: [39.2, 21.5],
    color: '#E8DFC0',
    pilgrims: 360000,
  },
  air_india: {
    id: 'air_india',
    label: 'India',
    origin: [72.8, 19.0],    // Mumbai
    dest: [39.2, 21.5],
    color: '#E8DFC0',
    pilgrims: 680000,
  },
  air_uk: {
    id: 'air_uk',
    label: 'United Kingdom',
    origin: [-0.1, 51.5],    // London
    dest: [39.2, 21.5],
    color: '#D4C8A8',
    pilgrims: 110000,
  },
  air_usa: {
    id: 'air_usa',
    label: 'United States',
    origin: [-87.6, 41.8],   // Chicago
    dest: [39.2, 21.5],
    color: '#D4C8A8',
    pilgrims: 55000,
  },
  air_malaysia: {
    id: 'air_malaysia',
    label: 'Malaysia',
    origin: [101.7, 3.1],    // Kuala Lumpur
    dest: [39.2, 21.5],
    color: '#E8DFC0',
    pilgrims: 130000,
  },
  air_egypt: {
    id: 'air_egypt',
    label: 'Egypt',
    origin: [31.2, 30.0],    // Cairo
    dest: [39.2, 21.5],
    color: '#E8DFC0',
    pilgrims: 380000,
  },
  air_senegal: {
    id: 'air_senegal',
    label: 'Senegal',
    origin: [-17.4, 14.7],   // Dakar
    dest: [39.2, 21.5],
    color: '#D4C8A8',
    pilgrims: 60000,
  },
}

// ─── Notable Waypoints ────────────────────────────────────────────────────────
export const WAYPOINTS = [
  { id: 'mecca',    lng: 39.8262, lat: 21.4225, label: 'Mecca',    type: 'destination', size: 'large' },
  { id: 'medina',   lng: 39.6142, lat: 24.4686, label: 'Medina',   type: 'holy',        size: 'medium' },
  { id: 'jeddah',   lng: 39.1728, lat: 21.4858, label: 'Jeddah',   type: 'port',        size: 'medium' },
  { id: 'baghdad',  lng: 44.4009, lat: 33.3152, label: 'Baghdad',  type: 'waypoint',    size: 'small' },
  { id: 'cairo',    lng: 31.2357, lat: 30.0444, label: 'Cairo',    type: 'waypoint',    size: 'small' },
  { id: 'aden',     lng: 45.0,    lat: 12.8,    label: 'Aden',     type: 'port',        size: 'small' },
  { id: 'samarkand',lng: 66.9,    lat: 39.6,    label: 'Samarkand',type: 'waypoint',    size: 'small' },
  { id: 'timbuktu', lng: -3.0,    lat: 16.8,    label: 'Timbuktu', type: 'waypoint',    size: 'small' },
  { id: 'calicut',  lng: 75.8,    lat: 11.3,    label: 'Calicut',  type: 'port',        size: 'small' },
  { id: 'jakarta',  lng: 106.8,   lat: -6.2,    label: 'Jakarta',  type: 'waypoint',    size: 'small' },
]