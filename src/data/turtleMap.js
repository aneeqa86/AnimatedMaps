// src/data/turtleMap.js
// World Turtle Day — May 23
// Story: Sea turtle migration routes across the world's oceans

export const CHAPTER_ICONS = {
  intro: '🐢',
  leatherback: '🌊',
  loggerhead: '🧭',
  green_turtle: '🌿',
  hawksbill: '🪸',
  flatback: '🏝️',
  threats: '⚠️',
  hope: '✨',
};

export const CHAPTERS = [
  {
    id: 'intro',
    type: 'migration',
    icon: '🐢',
    year: '100M+ yrs',
    badge: 'WORLD TURTLE DAY',
    title: 'The Oldest Navigators on Earth',
    subtitle: 'They were here before the dinosaurs vanished',
    body: 'Sea turtles have roamed the world\'s oceans for over 100 million years — outlasting every mass extinction, every shifting continent. They navigate thousands of miles across open ocean with magnetic-field precision that no instrument can replicate, returning to the very beach where they were born to lay their own eggs. Today, all seven species face extinction. This is their story.',
    quote: 'The sea turtle carries the ocean on its back, and the memory of every shore it has ever touched.',
    quoteAuthor: 'Ocean proverb',
    stat: 100,
    statLabel: 'million years of migration memory',
    statSuffix: 'M yrs',
  },
  {
    id: 'leatherback',
    type: 'migration',
    icon: '🌊',
    year: '6,000 mi',
    badge: 'LEATHERBACK',
    title: 'The Longest Journey',
    subtitle: 'Pacific Leatherback — nesting in Indonesia, feeding off California',
    body: 'The Pacific Leatherback makes one of the longest animal migrations on Earth: from nesting beaches in Papua New Guinea and Indonesia, across the entire Pacific Ocean, to jellyfish-rich waters off the coast of California and Oregon. A single turtle may swim 6,000 miles each way. They dive to 4,000 feet, survive near-freezing waters, and have been doing this since before humans existed.',
    quote: 'She swims not by compass, not by star — but by the planet\'s own pulse.',
    quoteAuthor: 'Marine biologist field note',
    stat: 6000,
    statLabel: 'miles, one way across the Pacific',
    statSuffix: ' mi',
  },
  {
    id: 'loggerhead',
    type: 'migration',
    icon: '🧭',
    year: '9,000 mi',
    badge: 'LOGGERHEAD',
    title: 'The Atlantic Circuit',
    subtitle: 'Born in Florida, riding the gyre to the Mediterranean and back',
    body: 'Loggerhead hatchlings born on Florida beaches enter the Atlantic, ride the Gulf Stream north, then cross to the Mediterranean — spending their juvenile years foraging off the coasts of Spain, Portugal, and North Africa. Years later, their magnetic compass guides them back across 9,000 miles to nest on the same Florida beach. Some make this round-trip circuit multiple times in a lifetime.',
    quote: 'Every turtle on that beach tonight was born here, and came home.',
    quoteAuthor: 'Sea Turtle Conservancy researcher',
    stat: 9000,
    statLabel: 'miles in the Atlantic gyre circuit',
    statSuffix: ' mi',
  },
  {
    id: 'green_turtle',
    type: 'migration',
    icon: '🌿',
    year: '1,400 mi',
    badge: 'GREEN TURTLE',
    title: 'Ascension Island to Brazil',
    subtitle: 'The most precise navigation in the animal kingdom',
    body: 'Green turtles nesting on tiny Ascension Island in the mid-Atlantic must travel 1,400 miles back to feeding grounds off the coast of Brazil. Ascension Island is only 7 miles wide — a speck in 40 million square miles of ocean. Yet green turtles find it every time, guided by the unique magnetic signature of the island. Scientists still do not fully understand how. It remains one of nature\'s great mysteries.',
    quote: 'A 7-mile target, 1,400 miles away, no GPS. She lands within meters.',
    quoteAuthor: 'Navigation study, Journal of Experimental Biology',
    stat: 1400,
    statLabel: 'miles to a 7-mile-wide island, every time',
    statSuffix: ' mi',
  },
  {
    id: 'hawksbill',
    type: 'nesting',
    icon: '🪸',
    year: 'Critically',
    badge: 'HAWKSBILL',
    title: 'The Reef Gardeners',
    subtitle: 'Caribbean and Indo-Pacific coral reef ecosystems depend on them',
    body: 'Hawksbill turtles are the only species that can digest toxic sponges — keeping reef sponge populations in check and allowing coral to thrive. Without hawksbills, sponges would outcompete coral in the Caribbean within decades. Once numbering in the millions, hawksbills were reduced to near-extinction by the tortoiseshell trade. Today fewer than 25,000 nesting females remain. Their disappearance would change the reef forever.',
    quote: 'Remove the hawksbill, and you begin to lose the reef itself.',
    quoteAuthor: 'Dr. Karen Bjorndal, Archie Carr Center',
    stat: 25000,
    statLabel: 'nesting females remain worldwide',
    statSuffix: ' left',
  },
  {
    id: 'flatback',
    type: 'nesting',
    icon: '🏝️',
    year: 'Endemic',
    badge: 'FLATBACK',
    title: 'Australia\'s Own',
    subtitle: 'The only turtle endemic to Australian waters',
    body: 'The flatback turtle lives only in Australian waters — found nowhere else on Earth. Unlike other species, flatbacks do not undergo long-distance oceanic migrations. They remain in the shallow coastal waters and continental shelf of northern Australia, nesting only on Australian beaches. Their entire existence — birth, life, and death — plays out within sight of the Australian coastline. Indigenous communities have stewarded flatback nesting beaches for tens of thousands of years.',
    quote: 'The flatback belongs to this country in a way no other creature does.',
    quoteAuthor: 'Dhimurru Aboriginal Corporation, Northern Territory',
    stat: 10000,
    statLabel: 'nesting females on Australian shores',
    statSuffix: ' nesting',
  },
  {
    id: 'threats',
    type: 'threat',
    icon: '⚠️',
    year: 'Now',
    badge: 'UNDER THREAT',
    title: 'A Million Years — Undone in Decades',
    subtitle: 'Six of seven species face extinction',
    body: 'In the last 50 years, sea turtle populations have collapsed. Bycatch drowns 250,000 turtles annually in fishing nets. Beach development destroys nesting habitat. Plastic pollution — mistaken for jellyfish — fills their stomachs. Climate change warms sands beyond the temperature that produces balanced hatchling sex ratios; on Florida beaches, 99% of loggerhead hatchlings are now female. The ocean is changing faster than 100 million years of evolution can adapt.',
    quote: 'They have survived five mass extinctions. They may not survive us.',
    quoteAuthor: 'IUCN Sea Turtle Specialist Group, 2023',
    stat: 250000,
    statLabel: 'turtles drowned in fishing nets each year',
    statSuffix: '/yr',
  },
  {
    id: 'hope',
    type: 'migration',
    icon: '✨',
    year: 'May 23',
    badge: 'WORLD TURTLE DAY',
    title: 'Where There Are Beaches, There Is Hope',
    subtitle: 'Recovery is possible — it is happening',
    body: 'Leatherback numbers on Caribbean nesting beaches have tripled since the 1990s due to targeted protection. Florida\'s loggerhead population has doubled in 20 years. In Malaysia, green turtle populations that were nearly gone have begun to recover. Every protected beach, every circle-hook that replaces a J-hook in longline fisheries, every nesting female that makes it back to the sea — it matters. On World Turtle Day, May 23, we remember: they were here before us. They deserve to outlast us.',
    quote: 'When the last sea turtle comes ashore to nest, the ocean has not yet given up.',
    quoteAuthor: 'Sea Turtle Conservancy',
    stat: 3,
    statLabel: 'times leatherback numbers have grown since the 1990s',
    statSuffix: 'x growth',
  },
];

// Migration flow lines — sea turtle routes across the world's oceans
export const MIGRATION_FLOWS = [
  // Pacific Leatherback: Papua New Guinea → California
  {
    id: 'leatherback_pacific',
    chapter: 'leatherback',
    species: 'Leatherback',
    color: '#4ade80', // bright emerald
    coords: [
      [141.0, -6.0],   // Papua New Guinea coast
      [160.0, 5.0],    // Western Pacific
      [180.0, 15.0],   // International Date Line
      [-160.0, 25.0],  // Central Pacific
      [-140.0, 35.0],  // North Pacific
      [-125.0, 38.0],  // Off California coast
      [-122.4, 37.8],  // San Francisco Bay area
    ],
  },
  // Atlantic Loggerhead: Florida → Mediterranean
  {
    id: 'loggerhead_atlantic',
    chapter: 'loggerhead',
    species: 'Loggerhead',
    color: '#86efac', // medium green
    coords: [
      [-80.5, 26.0],  // South Florida
      [-75.0, 35.0],  // Cape Hatteras
      [-60.0, 40.0],  // Mid-Atlantic
      [-40.0, 42.0],  // Central Atlantic
      [-20.0, 38.0],  // Eastern Atlantic
      [-10.0, 36.0],  // Off Portugal
      [-5.0, 36.1],   // Strait of Gibraltar
      [14.0, 37.0],   // Mediterranean
    ],
  },
  // Return: Mediterranean → Florida
  {
    id: 'loggerhead_return',
    chapter: 'loggerhead',
    species: 'Loggerhead return',
    color: '#bbf7d0',
    coords: [
      [14.0, 37.0],
      [-5.0, 36.1],
      [-20.0, 25.0],
      [-40.0, 20.0],
      [-60.0, 22.0],
      [-75.0, 24.0],
      [-80.5, 26.0],
    ],
  },
  // Green Turtle: Brazil → Ascension Island
  {
    id: 'green_ascension',
    chapter: 'green_turtle',
    species: 'Green Turtle',
    color: '#34d399', // teal-green
    coords: [
      [-35.0, -8.0],  // Brazilian coast
      [-25.0, -8.5],  // Mid-Atlantic
      [-14.4, -7.9],  // Ascension Island
    ],
  },
  // Green Turtle: Ascension → Brazil (return)
  {
    id: 'green_return',
    chapter: 'green_turtle',
    species: 'Green Turtle return',
    color: '#6ee7b7',
    coords: [
      [-14.4, -7.9],
      [-25.0, -9.0],
      [-35.0, -8.0],
    ],
  },
  // Hawksbill: Caribbean reefs circuit
  {
    id: 'hawksbill_caribbean',
    chapter: 'hawksbill',
    species: 'Hawksbill',
    color: '#10b981',
    coords: [
      [-72.0, 18.0],  // Haiti
      [-65.0, 17.0],  // Eastern Caribbean
      [-60.0, 15.0],  // Lesser Antilles
      [-63.0, 10.0],  // Trinidad area
      [-68.0, 12.0],  // Venezuelan coast
      [-72.0, 18.0],  // Back to Haiti
    ],
  },
  // Flatback: Northern Australia coastal
  {
    id: 'flatback_australia',
    chapter: 'flatback',
    species: 'Flatback',
    color: '#059669',
    coords: [
      [130.0, -12.0], // NT coast
      [136.0, -13.0], // Gulf of Carpentaria
      [143.0, -14.0], // Cape York
      [148.0, -18.0], // QLD coast
      [148.0, -23.0], // Southern QLD
    ],
  },
];

// Nesting beach markers
export const NESTING_BEACHES = [
  { id: 'png', name: 'Jamursba-Medi, PNG', coords: [132.5, -1.5], species: 'Leatherback', chapter: 'leatherback', population: '6,000 nests/yr' },
  { id: 'florida', name: 'Archie Carr Refuge, Florida', coords: [-80.5, 27.8], species: 'Loggerhead', chapter: 'loggerhead', population: '40,000+ nests/yr' },
  { id: 'ascension', name: 'Ascension Island', coords: [-14.4, -7.9], species: 'Green Turtle', chapter: 'green_turtle', population: '5,000 nests/yr' },
  { id: 'mexico', name: 'Playa del Carmen, Mexico', coords: [-87.1, 20.6], species: 'Hawksbill', chapter: 'hawksbill', population: '1,200 nests/yr' },
  { id: 'australia', name: 'Crab Island, Australia', coords: [141.8, -10.9], species: 'Flatback', chapter: 'flatback', population: '5,000 nests/yr' },
  { id: 'malaysia', name: 'Rantau Abang, Malaysia', coords: [103.3, 4.8], species: 'Leatherback', chapter: 'hope', population: 'Recovering' },
];

// Countries to highlight on the map
export const HIGHLIGHTED_COUNTRIES = {
  migration: ['United States', 'Mexico', 'Brazil', 'Indonesia', 'Papua New Guinea', 'Australia', 'Malaysia'],
  nesting: ['Australia', 'Costa Rica', 'United States'],
  threat: [],
};
