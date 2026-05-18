// ─── chagaiMap.js — Youm-e-Takbir: The Day of Greatness ─────────────────────
// 28 May 1998 · Chagai, Balochistan · Pakistan's nuclear tests

export const CHAPTERS = [
  {
    id: 0,
    year: '1972 – 1998',
    stamp: '26 YEARS IN THE MAKING',
    title: 'The Long Road',
    subtitle: 'From humiliation to sovereignty',
    body: 'After the fall of Dhaka in 1971, Zulfikar Ali Bhutto gathered Pakistan\'s scientists in Multan. His words were simple: "We will eat grass. But we will make the bomb." The programme took 26 years. It survived coups, sanctions, and foreign pressure. It was carried on the backs of men whose names the world would never know.',
    quote: 'If India builds the bomb, we will eat grass or leaves, even go hungry, but we will get one of our own.',
    quoteAuthor: 'Z.A. Bhutto, 1965',
    stat: { value: 26, label: 'Years' },
    focus: { center: [69.3451, 30.1798], zoom: 4.5 },
    fills: [
      { iso: 'PK', color: '#1a1814', opacity: 0.92 },
      { iso: 'IN', color: '#c4a882', opacity: 0.5 },
      { iso: 'AF', color: '#d4c8b4', opacity: 0.2 },
    ],
    type: 'history',
    shockwave: false,
  },
  {
    id: 1,
    year: '11–13 May 1998',
    stamp: 'INDIA TESTS · POKHRAN-II',
    title: 'The Provocation',
    subtitle: 'Operation Shakti — five blasts in Rajasthan',
    body: 'India detonated five devices at Pokhran in the Rajasthan desert. Prime Minister Vajpayee called it India\'s declaration as a nuclear state. The world was stunned. Pakistan\'s response would come from the mountain.',
    quote: 'Today, we have a big bomb. Pokhran is a proof that India can look the world in the eye.',
    quoteAuthor: 'A.B. Vajpayee, May 1998',
    stat: { value: 5, label: 'Indian Tests' },
    focus: { center: [72.5, 27.5], zoom: 5.2 },
    fills: [
      { iso: 'PK', color: '#1a1814', opacity: 0.85 },
      { iso: 'IN', color: '#8B1A1A', opacity: 0.55 },
      { iso: 'AF', color: '#d4c8b4', opacity: 0.15 },
    ],
    type: 'tension',
    shockwave: false,
    pokhranPulse: true,
  },
  {
    id: 2,
    year: '13–27 May 1998',
    stamp: 'SEVENTEEN DAYS',
    title: 'The Decision',
    subtitle: 'The world urged restraint. Pakistan waited.',
    body: 'For 17 days the world held its breath. Clinton called. The IMF threatened. Saudi Arabia offered oil. Pakistan\'s army chief and scientists were ready. The order came from Prime Minister Nawaz Sharif: the mountain would speak.',
    quote: 'The whole nation is united behind this decision. We could not leave our people defenceless.',
    quoteAuthor: 'Nawaz Sharif, 28 May 1998',
    stat: { value: 17, label: 'Days of Tension' },
    focus: { center: [65.5, 29.5], zoom: 4.8 },
    fills: [
      { iso: 'PK', color: '#1a1814', opacity: 0.95 },
      { iso: 'IN', color: '#c4a882', opacity: 0.4 },
      { iso: 'AF', color: '#d4c8b4', opacity: 0.15 },
    ],
    type: 'tension',
    shockwave: false,
  },
  {
    id: 3,
    year: '28 May 1998 · 15:15 PKT',
    stamp: 'KAMBARAN HILL · CHAGAI',
    title: 'The Detonations',
    subtitle: 'Five simultaneous blasts. The mountain turned white.',
    body: 'At 3:15 PM, five nuclear devices detonated simultaneously inside the Ras Koh Hills of Chagai. The mountain visibly turned white from the heat. Dust rose 10,000 feet. Seismographs across Asia registered the event. Pakistan became the seventh nuclear power on Earth — the first in the Muslim world.',
    quote: 'The whole mountain turned white. And then there was silence. And then we knew.',
    quoteAuthor: 'Dr. A.Q. Khan, 28 May 1998',
    stat: { value: 5, label: 'Simultaneous Blasts' },
    focus: { center: [64.9, 28.9], zoom: 6.5 },
    fills: [
      { iso: 'PK', color: '#1a1814', opacity: 0.95 },
      { iso: 'IN', color: '#c4a882', opacity: 0.35 },
      { iso: 'AF', color: '#d4c8b4', opacity: 0.12 },
    ],
    type: 'detonation',
    shockwave: true,
  },
  {
    id: 4,
    year: '30 May – 1998',
    stamp: 'THE WORLD REACTS',
    title: 'Sanctions & Sovereignty',
    subtitle: 'Isolation abroad. Euphoria at home.',
    body: 'The United States, Japan, and others imposed sanctions within hours. Pakistan was cast out of international forums. But on the streets of Lahore, Karachi, and Peshawar, millions celebrated. Youm-e-Takbir — the Day of Greatness — became a national holiday. A second test on 30 May confirmed the capability. Pakistan had spoken.',
    quote: 'Takbir! Allahu Akbar! Pakistan Zindabad!',
    quoteAuthor: 'The streets of Pakistan, 28 May 1998',
    stat: { value: 6, label: 'Total Tests' },
    focus: { center: [69.3451, 30.1798], zoom: 4.2 },
    fills: [
      { iso: 'PK', color: '#1a1814', opacity: 0.9 },
      { iso: 'IN', color: '#c4a882', opacity: 0.35 },
      { iso: 'AF', color: '#d4c8b4', opacity: 0.15 },
      { iso: 'US', color: '#d4c8b4', opacity: 0.18 },
      { iso: 'CN', color: '#d4c8b4', opacity: 0.18 },
    ],
    type: 'aftermath',
    shockwave: false,
  },
]

// Test site coordinates
export const CHAGAI_SITE = [64.9, 28.9]
export const POKHRAN_SITE = [71.74, 27.06]

// For the seismograph bar
export const SEISMIC_EVENTS = [
  { date: 'MAY 11', label: 'Pokhran I', color: '#8B1A1A', intensity: 1.0, x: 0.12 },
  { date: 'MAY 13', label: 'Pokhran II', color: '#8B1A1A', intensity: 0.7, x: 0.20 },
  { date: 'MAY 28', label: 'Chagai ×5', color: '#C9B88A', intensity: 1.0, x: 0.72 },
  { date: 'MAY 30', label: 'Chagai +1', color: '#C9B88A', intensity: 0.65, x: 0.86 },
]

export const CHAPTER_DURATION = 6000 // ms per chapter