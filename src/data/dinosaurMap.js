// src/data/dinosaurMap.js
// "When Giants Ruled the Earth" — Paleogeographic GIS Story Map

// ─── Impact site ──────────────────────────────────────────────────────────────
export const IMPACT_SITE = { lng: -89.5, lat: 21.3 }

// ─── Geological Periods ───────────────────────────────────────────────────────
export const PERIODS = {
  TRIASSIC:   { name: 'Triassic',   start: 252, end: 201, color: '#C17A3A' },
  JURASSIC:   { name: 'Jurassic',   start: 201, end: 145, color: '#8FA860' },
  CRETACEOUS: { name: 'Cretaceous', start: 145, end: 66,  color: '#5A8C6E' },
  EXTINCTION: { name: 'K–Pg',       start: 66,  end: 66,  color: '#2A1A0A' },
  MODERN:     { name: 'Modern',     start: 0,   end: 0,   color: '#4A6B8A' },
}

// ─── Chapters ─────────────────────────────────────────────────────────────────
// mapCenter: [lng, lat] — note lng first for Mapbox
// mapZoom: increased from original values so continent is clearly visible
export const CHAPTERS = [
  {
    id: 'before-giants',
    index: 0,
    period: 'Triassic',
    mya: '252 Ma',
    badge: 'CHAPTER I',
    era: 'triassic',
    title: 'Before the Giants',
    subtitle: 'Pangaea · Triassic Period · 252 Million Years Ago',
    body: 'The world is one. Pangaea — a single supercontinent stretching pole to pole — bakes under a monsoonal sun too vast for rain to reach its interior. Oxygen is thin. Reptiles scramble through volcanic scrubland. Dinosaurs do not yet exist. But evolution is restless, and the stage is being laid for something extraordinary.',
    quote: 'Before the giants, the earth itself was extraordinary.',
    stat: '252',
    statLabel: 'Million Years Ago',
    // Global view centred on Pangaea's landmass
    mapCenter: [20.0, 10.0],
    mapZoom: 2.0,
    atmosphere: 'volcanic',
    showSpecies: [],
    showImpact: false,
    showModern: false,
  },
  {
    id: 'rise-of-dinosaurs',
    index: 1,
    period: 'Triassic',
    mya: '230 Ma',
    badge: 'CHAPTER II',
    era: 'triassic',
    title: 'Rise of the Dinosaurs',
    subtitle: 'First Emergence · Late Triassic · 230 Million Years Ago',
    body: 'They appear first in what will become South America and southern Africa — small, bipedal, and hungry. Eoraptor. Herrerasaurus. Not yet the dominant life forms; crocodilians and large archosaurs still rule the food chain. But dinosaurs are adaptable where others are rigid. When the mass extinction of 201 Ma clears the board, they will inherit every niche.',
    quote: 'The first footprints were small. The shadow they would cast was immense.',
    stat: '230',
    statLabel: 'Million Years Ago',
    // Zoom into South America / southern Africa where the earliest species lived
    mapCenter: [-40.0, -20.0],
    mapZoom: 3.2,
    atmosphere: 'hazy',
    showSpecies: ['eoraptor', 'herrerasaurus', 'plateosaurus'],
    showImpact: false,
    showModern: false,
  },
  {
    id: 'expansion',
    index: 2,
    period: 'Jurassic',
    mya: '175 Ma',
    badge: 'CHAPTER III',
    era: 'jurassic',
    title: 'Expansion of Life',
    subtitle: 'Continental Breakup · Early Jurassic · 175 Million Years Ago',
    body: 'Pangaea fractures. Gondwana drifts south; Laurasia stretches north. New oceans open, climates diversify, and dinosaurs pour into every ecological niche with staggering speed. Vast fern savannahs. Dense cycad forests. River deltas wide as modern continents. In the Morrison Formation of North America, giants walk. The planet belongs to them.',
    quote: 'As the land divided, life multiplied.',
    stat: '175',
    statLabel: 'Million Years Ago',
    // North America — Morrison Formation
    mapCenter: [-107.0, 40.0],
    mapZoom: 3.8,
    atmosphere: 'lush',
    showSpecies: ['brachiosaurus', 'stegosaurus', 'allosaurus', 'diplodocus'],
    showImpact: false,
    showModern: false,
  },
  {
    id: 'age-of-giants',
    index: 3,
    period: 'Cretaceous',
    mya: '90 Ma',
    badge: 'CHAPTER IV',
    era: 'cretaceous',
    title: 'Age of Giants',
    subtitle: 'Peak Dominance · Late Cretaceous · 90 Million Years Ago',
    body: 'One hundred and sixty million years of unbroken dominance. Tyrannosaurus rex commands the North American floodplains. Triceratops grazes in vast herds. Spinosaurus hunts the shallow rivers of Africa. In South America, Argentinosaurus — the heaviest land animal ever to exist — moves like a slow earthquake through the forest canopy. Every continent, every biome. They have no equals.',
    quote: '160 million years. Mammals would manage 66. We have managed 0.3.',
    stat: '160M',
    statLabel: 'Years of Dinosaur Dominance',
    // Wide view centred on North America / Atlantic showing multiple continents
    mapCenter: [-60.0, 25.0],
    mapZoom: 2.6,
    atmosphere: 'golden',
    showSpecies: ['trex', 'triceratops', 'spinosaurus', 'argentinosaurus', 'velociraptor', 'ankylosaurus'],
    showImpact: false,
    showModern: false,
  },
  {
    id: 'last-day',
    index: 4,
    period: 'K–Pg',
    mya: '66 Ma',
    badge: 'CHAPTER V',
    era: 'extinction',
    title: 'The Last Day',
    subtitle: 'K–Pg Extinction Event · Chicxulub Impact · 66 Million Years Ago',
    body: "It arrives from the southeast sky. A rock ten kilometres wide, travelling at twenty kilometres per second. The Chicxulub impactor strikes the shallow seas of what will become Mexico's Yucatán Peninsula. Energy released: five billion Hiroshima bombs. The sky ignites. Then goes dark for years. In the darkness that follows, three-quarters of all species on Earth — including every non-avian dinosaur — go silent forever.",
    quote: '66 million years ago… the world changed in a single afternoon.',
    stat: '75%',
    statLabel: 'Of All Species Erased',
    // Tight zoom on Yucatán / Gulf of Mexico — the impact site
    mapCenter: [-89.5, 21.3],
    mapZoom: 5.5,
    atmosphere: 'impact',
    showSpecies: [],
    showImpact: true,
    showModern: false,
  },
  {
    id: 'what-remains',
    index: 5,
    period: 'Modern',
    mya: 'Today',
    badge: 'CHAPTER VI',
    era: 'modern',
    title: 'What Remains',
    subtitle: 'Modern Earth · Fossil Record · Present Day',
    body: "The continents have settled into shapes we recognise. And scattered across them — in the red rock of the Badlands, in the limestone of Patagonia, in the mudstone of Mongolia's Gobi — their bones remain. Frozen mid-step. But they are not gone. Every bird crossing the sky is a living dinosaur. Ten thousand species. Their descendants inherited the earth they surrendered.",
    quote: 'Their footprints still shape our understanding of Earth.',
    stat: '10,000+',
    statLabel: 'Living Dinosaur Species (Birds)',
    // Global view showing all fossil sites
    mapCenter: [10.0, 20.0],
    mapZoom: 2.0,
    atmosphere: 'dawn',
    showSpecies: [],
    showImpact: false,
    showModern: true,
  },
]

// ─── Species ──────────────────────────────────────────────────────────────────
export const SPECIES = [
  // Triassic
  { id: 'eoraptor',       name: 'Eoraptor',        diet: 'omnivore',  period: 'triassic',   mya: 231, lengthM: 1,  massKg: 10,    location: { lng: -68.5,  lat: -29.5 }, region: 'South America', desc: 'One of the earliest known dinosaurs' },
  { id: 'herrerasaurus',  name: 'Herrerasaurus',   diet: 'carnivore', period: 'triassic',   mya: 228, lengthM: 6,  massKg: 210,   location: { lng: -67.8,  lat: -30.2 }, region: 'South America', desc: 'An early predator from Argentina' },
  { id: 'plateosaurus',   name: 'Plateosaurus',    diet: 'herbivore', period: 'triassic',   mya: 214, lengthM: 8,  massKg: 600,   location: { lng: 9.0,    lat: 48.5  }, region: 'Europe',        desc: 'Large prosauropod of late Triassic Europe' },
  // Jurassic
  { id: 'brachiosaurus',  name: 'Brachiosaurus',   diet: 'herbivore', period: 'jurassic',   mya: 154, lengthM: 26, massKg: 56000, location: { lng: -107.0, lat: 39.0  }, region: 'North America', desc: 'Towering sauropod of the Morrison Formation' },
  { id: 'stegosaurus',    name: 'Stegosaurus',     diet: 'herbivore', period: 'jurassic',   mya: 155, lengthM: 9,  massKg: 2300,  location: { lng: -105.5, lat: 40.2  }, region: 'North America', desc: 'Iconic plated dinosaur of the Jurassic' },
  { id: 'allosaurus',     name: 'Allosaurus',      diet: 'carnivore', period: 'jurassic',   mya: 150, lengthM: 12, massKg: 1500,  location: { lng: -109.0, lat: 38.5  }, region: 'North America', desc: 'Apex predator of the Late Jurassic' },
  { id: 'diplodocus',     name: 'Diplodocus',      diet: 'herbivore', period: 'jurassic',   mya: 153, lengthM: 27, massKg: 12000, location: { lng: -106.8, lat: 41.0  }, region: 'North America', desc: 'The longest known dinosaur of the Jurassic' },
  // Cretaceous
  { id: 'trex',           name: 'Tyrannosaurus rex', diet: 'carnivore', period: 'cretaceous', mya: 68, lengthM: 13, massKg: 8000,  location: { lng: -103.0, lat: 46.0  }, region: 'North America', desc: 'The most iconic predator in evolutionary history', spotlight: true },
  { id: 'triceratops',    name: 'Triceratops',     diet: 'herbivore', period: 'cretaceous', mya: 68,  lengthM: 9,  massKg: 12000, location: { lng: -105.0, lat: 44.5  }, region: 'North America', desc: 'Three-horned giant of the Late Cretaceous', spotlight: true },
  { id: 'spinosaurus',    name: 'Spinosaurus',     diet: 'carnivore', period: 'cretaceous', mya: 97,  lengthM: 15, massKg: 9000,  location: { lng: 28.0,   lat: 28.5  }, region: 'Africa',        desc: 'Largest predatory dinosaur ever discovered', spotlight: true },
  { id: 'argentinosaurus',name: 'Argentinosaurus', diet: 'herbivore', period: 'cretaceous', mya: 95,  lengthM: 35, massKg: 80000, location: { lng: -70.0,  lat: -40.0 }, region: 'South America', desc: 'The heaviest land animal to have ever lived', spotlight: true },
  { id: 'velociraptor',   name: 'Velociraptor',    diet: 'carnivore', period: 'cretaceous', mya: 74,  lengthM: 2,  massKg: 15,    location: { lng: 103.0,  lat: 43.5  }, region: 'Asia',          desc: 'Feathered pack hunter of the Mongolian Gobi', spotlight: true },
  { id: 'ankylosaurus',   name: 'Ankylosaurus',    diet: 'herbivore', period: 'cretaceous', mya: 68,  lengthM: 9,  massKg: 6000,  location: { lng: -108.0, lat: 47.0  }, region: 'North America', desc: 'Armored titan with a bone-crushing club tail' },
]

// ─── Major fossil regions ─────────────────────────────────────────────────────
export const FOSSIL_REGIONS = [
  { id: 'hell-creek',    name: 'Hell Creek Formation',   lng: -104.8, lat: 47.2,  label: 'HELL CREEK, USA' },
  { id: 'morrison',      name: 'Morrison Formation',      lng: -107.5, lat: 39.8,  label: 'MORRISON, USA' },
  { id: 'gobi',          name: 'Gobi Desert Beds',        lng: 103.5,  lat: 43.8,  label: 'GOBI DESERT' },
  { id: 'patagonia',     name: 'Neuquén Basin',           lng: -70.2,  lat: -38.5, label: 'PATAGONIA' },
  { id: 'ischigualasto', name: 'Ischigualasto Formation', lng: -67.5,  lat: -29.8, label: 'ISCHIGUALASTO' },
  { id: 'tendaguru',     name: 'Tendaguru Beds',          lng: 39.2,   lat: -9.8,  label: 'TENDAGURU, TANZANIA' },
  { id: 'kem-kem',       name: 'Kem Kem Beds',            lng: -4.2,   lat: 30.5,  label: 'KEM KEM, MOROCCO' },
  { id: 'yixian',        name: 'Yixian Formation',        lng: 120.8,  lat: 41.5,  label: 'YIXIAN, CHINA' },
]

// ─── Diet colors ──────────────────────────────────────────────────────────────
export const DIET_COLORS = {
  carnivore: '#8B2A1A',
  herbivore: '#6B8A4A',
  omnivore:  '#A87840',
}

// ─── Era palettes ─────────────────────────────────────────────────────────────
export const ERA_PALETTES = {
  triassic:   { bg: '#1C1208', fog: 'rgba(180,120,60,0.3)',  text: '#E8C88A', accent: '#C8783A' },
  jurassic:   { bg: '#081810', fog: 'rgba(80,140,60,0.2)',   text: '#C8E890', accent: '#78B848' },
  cretaceous: { bg: '#100C04', fog: 'rgba(160,130,60,0.2)',  text: '#E8D890', accent: '#C8A840' },
  extinction: { bg: '#0A0402', fog: 'rgba(180,60,20,0.4)',   text: '#E89060', accent: '#E84820' },
  modern:     { bg: '#04080C', fog: 'rgba(80,120,180,0.15)', text: '#90C8E8', accent: '#4890C8' },
}