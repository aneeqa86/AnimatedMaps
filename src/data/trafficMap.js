// trafficMap.js — Karachi road network, ~90 real segments
// Full city coverage: DHA → Malir → North Karachi → Orangi → Port

export const CITY_CENTER = [67.0350, 24.8700];
export const CITY_NAME   = 'KARACHI';
export const INITIAL_ZOOM = 12;

export const ROAD_SEGMENTS = [

  // ════════════════════════════════════════════════════════
  // EXPRESSWAYS & HIGHWAYS
  // ════════════════════════════════════════════════════════
  {
    id: 'lyari-exp',
    name: 'Lyari Expressway',
    type: 'expressway', speed: 88, congestion: 0.10,
    coords: [
      [66.9400,24.8900],[66.9500,24.8870],[66.9600,24.8840],[66.9700,24.8810],
      [66.9800,24.8780],[66.9900,24.8750],[67.0000,24.8720],[67.0100,24.8700],
      [67.0200,24.8680],[67.0300,24.8660],[67.0400,24.8640],[67.0500,24.8620],
      [67.0600,24.8600],[67.0700,24.8580],[67.0800,24.8560],
    ],
  },
  {
    id: 'northern-bypass',
    name: 'Northern Bypass',
    type: 'expressway', speed: 95, congestion: 0.06,
    coords: [
      [67.1800,24.9600],[67.1650,24.9480],[67.1500,24.9360],[67.1350,24.9240],
      [67.1200,24.9120],[67.1050,24.9000],[67.0900,24.8880],[67.0750,24.8760],
    ],
  },
  {
    id: 'super-highway',
    name: 'Super Highway (M-9)',
    type: 'expressway', speed: 100, congestion: 0.05,
    coords: [
      [67.2800,25.0200],[67.2400,24.9900],[67.2000,24.9600],
      [67.1600,24.9300],[67.1200,24.9000],[67.0900,24.8800],
    ],
  },
  {
    id: 'mpa-bypass',
    name: 'MPA Bypass / Hub River Road',
    type: 'expressway', speed: 82, congestion: 0.14,
    coords: [
      [66.9200,24.9200],[66.9300,24.9100],[66.9400,24.9000],
      [66.9500,24.8900],[66.9600,24.8820],[66.9700,24.8760],
    ],
  },
  {
    id: 'khi-hyderabad-motorway',
    name: 'Karachi–Hyderabad Motorway (M-9)',
    type: 'expressway', speed: 100, congestion: 0.04,
    coords: [
      [67.2200,24.8800],[67.2600,24.8600],[67.3000,24.8400],[67.3400,24.8200],
    ],
  },

  // ════════════════════════════════════════════════════════
  // MAJOR EAST–WEST ARTERIALS
  // ════════════════════════════════════════════════════════
  {
    id: 'sha-e-faisal',
    name: 'Shahrah-e-Faisal',
    type: 'highway', speed: 72, congestion: 0.28,
    coords: [
      [67.1400,24.8900],[67.1200,24.8840],[67.1000,24.8790],[67.0800,24.8750],
      [67.0600,24.8710],[67.0400,24.8670],[67.0200,24.8630],[67.0000,24.8590],
      [66.9800,24.8560],[66.9600,24.8530],
    ],
  },
  {
    id: 'university-road',
    name: 'University Road',
    type: 'highway', speed: 60, congestion: 0.38,
    coords: [
      [67.1400,24.9200],[67.1200,24.9150],[67.1000,24.9100],[67.0800,24.9050],
      [67.0600,24.9000],[67.0400,24.8950],[67.0200,24.8900],[67.0000,24.8850],
    ],
  },
  {
    id: 'ma-jinnah',
    name: 'MA Jinnah Road',
    type: 'arterial', speed: 32, congestion: 0.70,
    coords: [
      [67.0600,24.8780],[67.0500,24.8750],[67.0400,24.8720],[67.0300,24.8690],
      [67.0200,24.8660],[67.0100,24.8630],[67.0000,24.8600],[66.9900,24.8570],
      [66.9800,24.8540],[66.9700,24.8510],[66.9600,24.8480],
    ],
  },
  {
    id: 'mauripur-road',
    name: 'Mauripur Road',
    type: 'arterial', speed: 58, congestion: 0.34,
    coords: [
      [66.9200,24.8900],[66.9300,24.8870],[66.9400,24.8840],[66.9500,24.8810],
      [66.9600,24.8780],[66.9700,24.8750],[66.9800,24.8720],
    ],
  },
  {
    id: 'kda-ave1',
    name: 'KDA Avenue 1',
    type: 'arterial', speed: 54, congestion: 0.42,
    coords: [
      [67.0800,24.9100],[67.0700,24.9050],[67.0600,24.9000],[67.0500,24.8950],
      [67.0400,24.8900],[67.0300,24.8850],[67.0200,24.8800],
    ],
  },
  {
    id: 'shaheed-millat',
    name: 'Shaheed-e-Millat Road',
    type: 'arterial', speed: 50, congestion: 0.46,
    coords: [
      [67.1000,24.8800],[67.0900,24.8780],[67.0800,24.8760],[67.0700,24.8740],
      [67.0600,24.8720],[67.0500,24.8700],[67.0400,24.8680],
    ],
  },
  {
    id: 'korangi-road',
    name: 'Korangi Road',
    type: 'arterial', speed: 62, congestion: 0.33,
    coords: [
      [67.1600,24.8400],[67.1450,24.8460],[67.1300,24.8520],[67.1150,24.8580],
      [67.1000,24.8640],[67.0850,24.8700],[67.0700,24.8740],
    ],
  },
  {
    id: 'national-highway',
    name: 'National Highway (N-5)',
    type: 'highway', speed: 76, congestion: 0.22,
    coords: [
      [67.2200,24.8700],[67.2000,24.8680],[67.1800,24.8660],[67.1600,24.8640],
      [67.1400,24.8620],[67.1200,24.8600],[67.1000,24.8580],[67.0800,24.8560],
    ],
  },
  {
    id: 'nagan-chowrangi',
    name: 'Nagan Chowrangi–SITE Road',
    type: 'arterial', speed: 46, congestion: 0.50,
    coords: [
      [66.9900,24.9400],[67.0000,24.9300],[67.0100,24.9200],[67.0200,24.9100],
      [67.0280,24.9000],[67.0300,24.8900],[67.0280,24.8800],
    ],
  },
  {
    id: 'buffer-zone-road',
    name: 'Buffer Zone Road',
    type: 'arterial', speed: 56, congestion: 0.38,
    coords: [
      [67.0200,24.9600],[67.0400,24.9550],[67.0600,24.9500],[67.0800,24.9450],
      [67.1000,24.9400],[67.1200,24.9350],
    ],
  },
  {
    id: 'malir-link',
    name: 'Malir Road',
    type: 'arterial', speed: 62, congestion: 0.33,
    coords: [
      [67.2000,24.8800],[67.1900,24.8820],[67.1800,24.8840],[67.1700,24.8860],
      [67.1600,24.8880],[67.1500,24.8900],[67.1400,24.8920],
    ],
  },
  {
    id: 'malir-link2',
    name: 'Malir Halt Road',
    type: 'arterial', speed: 58, congestion: 0.37,
    coords: [
      [67.2400,24.9000],[67.2200,24.8950],[67.2000,24.8900],[67.1800,24.8850],
      [67.1600,24.8800],[67.1400,24.8760],
    ],
  },

  // ════════════════════════════════════════════════════════
  // MAJOR NORTH–SOUTH ARTERIALS
  // ════════════════════════════════════════════════════════
  {
    id: 'rashid-minhas',
    name: 'Rashid Minhas Road',
    type: 'arterial', speed: 52, congestion: 0.46,
    coords: [
      [67.0700,24.9600],[67.0720,24.9450],[67.0740,24.9300],[67.0750,24.9150],
      [67.0760,24.9000],[67.0750,24.8850],[67.0730,24.8700],[67.0700,24.8580],
    ],
  },
  {
    id: 'gulshan-iqbal-main',
    name: 'Gulshan-e-Iqbal Main Road',
    type: 'arterial', speed: 44, congestion: 0.56,
    coords: [
      [67.0900,24.9500],[67.0880,24.9350],[67.0860,24.9200],[67.0840,24.9050],
      [67.0820,24.8900],[67.0800,24.8760],
    ],
  },
  {
    id: 'abul-hasan-isphahani',
    name: 'Abul Hasan Isphahani Road',
    type: 'arterial', speed: 48, congestion: 0.50,
    coords: [
      [67.1000,24.9400],[67.0980,24.9250],[67.0960,24.9100],[67.0940,24.8950],
      [67.0920,24.8800],[67.0900,24.8680],
    ],
  },
  {
    id: 'drigh-road',
    name: 'Drigh Road',
    type: 'arterial', speed: 50, congestion: 0.48,
    coords: [
      [67.1200,24.9300],[67.1180,24.9150],[67.1150,24.9000],[67.1120,24.8850],
      [67.1100,24.8700],[67.1080,24.8550],
    ],
  },
  {
    id: 'shahrah-e-pakistan',
    name: 'Shahrah-e-Pakistan',
    type: 'arterial', speed: 40, congestion: 0.60,
    coords: [
      [67.0200,24.9400],[67.0200,24.9250],[67.0200,24.9100],[67.0200,24.8950],
      [67.0200,24.8800],[67.0200,24.8650],[67.0200,24.8500],
    ],
  },
  {
    id: 'new-ma-jinnah',
    name: 'New MA Jinnah Road',
    type: 'arterial', speed: 55, congestion: 0.40,
    coords: [
      [67.0500,24.9200],[67.0480,24.9050],[67.0460,24.8900],[67.0440,24.8750],
      [67.0420,24.8620],[67.0400,24.8500],
    ],
  },
  {
    id: 'karachi-saddar-link',
    name: 'Saddar–Clifton Link',
    type: 'arterial', speed: 30, congestion: 0.72,
    coords: [
      [67.0300,24.8700],[67.0280,24.8620],[67.0260,24.8540],[67.0240,24.8460],
      [67.0220,24.8380],[67.0200,24.8300],
    ],
  },
  {
    id: 'sharae-liaquat',
    name: 'Shahrah-e-Liaquat',
    type: 'urban', speed: 20, congestion: 0.84,
    coords: [
      [67.0100,24.8750],[67.0080,24.8700],[67.0060,24.8650],[67.0040,24.8600],
      [67.0020,24.8550],[67.0000,24.8500],
    ],
  },
  {
    id: 'johar-main',
    name: 'Gulistan-e-Johar Main Blvd',
    type: 'arterial', speed: 45, congestion: 0.54,
    coords: [
      [67.1300,24.9200],[67.1250,24.9100],[67.1200,24.9000],[67.1150,24.8900],
      [67.1100,24.8800],[67.1050,24.8700],
    ],
  },
  {
    id: 'nazimabad-main',
    name: 'Nazimabad Main Road',
    type: 'arterial', speed: 34, congestion: 0.68,
    coords: [
      [67.0100,24.9600],[67.0120,24.9450],[67.0140,24.9300],[67.0160,24.9150],
      [67.0170,24.9000],[67.0160,24.8850],[67.0150,24.8700],
    ],
  },
  {
    id: 'liaquatabad-main',
    name: 'Liaquatabad Road',
    type: 'arterial', speed: 30, congestion: 0.74,
    coords: [
      [67.0400,24.9400],[67.0410,24.9250],[67.0420,24.9100],[67.0430,24.8950],
      [67.0420,24.8800],[67.0400,24.8650],
    ],
  },
  {
    id: 'federal-b-area',
    name: 'Federal B Area Road',
    type: 'arterial', speed: 38, congestion: 0.64,
    coords: [
      [67.0600,24.9400],[67.0590,24.9250],[67.0580,24.9100],[67.0570,24.8950],
      [67.0560,24.8800],[67.0550,24.8650],
    ],
  },
  {
    id: 'kpt-interchange',
    name: 'KPT Interchange Road',
    type: 'highway', speed: 70, congestion: 0.25,
    coords: [
      [66.9900,24.8200],[66.9920,24.8300],[66.9940,24.8400],[66.9960,24.8500],
      [66.9980,24.8600],[67.0000,24.8700],
    ],
  },
  {
    id: 'stadium-road',
    name: 'Stadium Road',
    type: 'arterial', speed: 48, congestion: 0.50,
    coords: [
      [67.0650,24.9100],[67.0670,24.8950],[67.0690,24.8800],[67.0700,24.8650],
      [67.0710,24.8500],
    ],
  },
  {
    id: 'shah-faisal-colony',
    name: 'Shah Faisal Colony Road',
    type: 'arterial', speed: 45, congestion: 0.54,
    coords: [
      [67.1400,24.8700],[67.1380,24.8780],[67.1360,24.8860],[67.1340,24.8940],
      [67.1320,24.9020],[67.1300,24.9100],
    ],
  },

  // ════════════════════════════════════════════════════════
  // CITY CENTRE — SADDAR / DOWNTOWN (very high congestion)
  // ════════════════════════════════════════════════════════
  {
    id: 'bolton-market',
    name: 'Bolton Market',
    type: 'urban', speed: 8, congestion: 0.98,
    coords: [
      [66.9950,24.8600],[66.9970,24.8615],[66.9990,24.8630],[67.0010,24.8640],
      [67.0025,24.8630],[67.0015,24.8615],[66.9995,24.8605],[66.9975,24.8595],
    ],
  },
  {
    id: 'saddar-bazar',
    name: 'Saddar Bazaar',
    type: 'urban', speed: 9, congestion: 0.97,
    coords: [
      [67.0150,24.8680],[67.0170,24.8700],[67.0190,24.8720],[67.0210,24.8735],
      [67.0225,24.8720],[67.0210,24.8700],[67.0190,24.8685],[67.0165,24.8668],
    ],
  },
  {
    id: 'elphinstone-st',
    name: 'Zaibunissa Street',
    type: 'urban', speed: 12, congestion: 0.93,
    coords: [
      [67.0050,24.8660],[67.0070,24.8680],[67.0090,24.8700],[67.0110,24.8715],
      [67.0125,24.8700],[67.0110,24.8685],[67.0090,24.8670],[67.0065,24.8655],
    ],
  },
  {
    id: 'burns-road',
    name: 'Burns Road',
    type: 'urban', speed: 15, congestion: 0.90,
    coords: [
      [67.0000,24.8700],[67.0020,24.8720],[67.0040,24.8740],[67.0060,24.8755],
      [67.0080,24.8740],[67.0060,24.8725],[67.0040,24.8710],[67.0015,24.8695],
    ],
  },
  {
    id: 'napier-mole',
    name: 'Napier Mole Road',
    type: 'urban', speed: 22, congestion: 0.80,
    coords: [
      [66.9850,24.8420],[66.9880,24.8470],[66.9910,24.8520],[66.9940,24.8560],
      [66.9970,24.8590],[67.0000,24.8610],
    ],
  },
  {
    id: 'bunder-road',
    name: 'Bunder Road',
    type: 'urban', speed: 18, congestion: 0.86,
    coords: [
      [66.9940,24.8500],[66.9960,24.8520],[66.9980,24.8540],[67.0000,24.8555],
      [67.0020,24.8545],[67.0010,24.8530],[66.9990,24.8515],[66.9960,24.8505],
    ],
  },
  {
    id: 'lea-market',
    name: 'Lea Market Road',
    type: 'urban', speed: 11, congestion: 0.96,
    coords: [
      [66.9900,24.8600],[66.9920,24.8620],[66.9940,24.8640],[66.9960,24.8650],
      [66.9950,24.8635],[66.9930,24.8620],[66.9910,24.8610],[66.9895,24.8598],
    ],
  },
  {
    id: 'tariq-road',
    name: 'Tariq Road',
    type: 'urban', speed: 20, congestion: 0.84,
    coords: [
      [67.0400,24.8750],[67.0440,24.8760],[67.0480,24.8770],[67.0520,24.8775],
      [67.0560,24.8770],[67.0600,24.8760],[67.0640,24.8750],
    ],
  },
  {
    id: 'bahadurabad-main',
    name: 'Bahadurabad Road',
    type: 'urban', speed: 24, congestion: 0.80,
    coords: [
      [67.0500,24.8800],[67.0520,24.8820],[67.0545,24.8840],[67.0565,24.8855],
      [67.0580,24.8840],[67.0560,24.8820],[67.0535,24.8805],[67.0510,24.8792],
    ],
  },
  {
    id: 'old-city-a',
    name: 'Old City Network A',
    type: 'urban', speed: 10, congestion: 0.97,
    coords: [
      [67.0020,24.8660],[67.0040,24.8680],[67.0060,24.8695],[67.0075,24.8683],
      [67.0060,24.8668],[67.0040,24.8655],[67.0022,24.8645],
    ],
  },
  {
    id: 'old-city-b',
    name: 'Old City Network B',
    type: 'urban', speed: 9, congestion: 0.97,
    coords: [
      [66.9980,24.8560],[67.0000,24.8580],[67.0020,24.8595],[67.0035,24.8582],
      [67.0020,24.8567],[67.0000,24.8552],[66.9982,24.8543],
    ],
  },

  // ════════════════════════════════════════════════════════
  // LYARI / OLD CITY / PORT AREA
  // ════════════════════════════════════════════════════════
  {
    id: 'lyari-main',
    name: 'Lyari Main Road',
    type: 'urban', speed: 16, congestion: 0.90,
    coords: [
      [66.9700,24.8620],[66.9730,24.8640],[66.9760,24.8655],[66.9790,24.8660],
      [66.9820,24.8650],[66.9850,24.8635],[66.9870,24.8618],
    ],
  },
  {
    id: 'west-wharf',
    name: 'West Wharf Road',
    type: 'arterial', speed: 42, congestion: 0.55,
    coords: [
      [66.9800,24.8300],[66.9820,24.8380],[66.9840,24.8460],[66.9860,24.8530],
      [66.9880,24.8580],[66.9900,24.8620],
    ],
  },
  {
    id: 'hawksbay-road',
    name: 'Hawksbay Road',
    type: 'arterial', speed: 68, congestion: 0.26,
    coords: [
      [66.9000,24.8400],[66.9100,24.8380],[66.9200,24.8360],[66.9300,24.8355],
      [66.9400,24.8365],[66.9500,24.8380],[66.9600,24.8400],[66.9700,24.8420],
    ],
  },
  {
    id: 'port-qasim-link',
    name: 'Port Qasim Access Road',
    type: 'arterial', speed: 72, congestion: 0.22,
    coords: [
      [67.1800,24.8000],[67.1900,24.8100],[67.2000,24.8200],[67.2100,24.8300],
      [67.2200,24.8400],[67.2300,24.8500],
    ],
  },
  {
    id: 'bin-qasim-road',
    name: 'Bin Qasim Road',
    type: 'arterial', speed: 70, congestion: 0.23,
    coords: [
      [67.2000,24.7800],[67.2050,24.7900],[67.2100,24.8000],[67.2150,24.8100],
      [67.2200,24.8200],[67.2250,24.8300],[67.2300,24.8400],
    ],
  },

  // ════════════════════════════════════════════════════════
  // CLIFTON / DHA / DEFENCE HOUSING
  // ════════════════════════════════════════════════════════
  {
    id: 'clifton-bridge',
    name: 'Clifton Bridge',
    type: 'highway', speed: 80, congestion: 0.18,
    coords: [
      [67.0300,24.8200],[67.0270,24.8290],[67.0240,24.8380],[67.0210,24.8470],
      [67.0190,24.8560],[67.0180,24.8650],
    ],
  },
  {
    id: 'sea-view-drive',
    name: 'Sea View / Clifton Drive',
    type: 'arterial', speed: 75, congestion: 0.20,
    coords: [
      [66.9700,24.8100],[66.9800,24.8130],[66.9900,24.8150],[67.0000,24.8170],
      [67.0100,24.8190],[67.0200,24.8200],[67.0300,24.8200],[67.0400,24.8190],
    ],
  },
  {
    id: 'do-talwar',
    name: 'Do Talwar / Seaview Blvd',
    type: 'arterial', speed: 70, congestion: 0.22,
    coords: [
      [67.0100,24.8050],[67.0150,24.8080],[67.0200,24.8100],[67.0250,24.8110],
      [67.0300,24.8100],[67.0350,24.8090],[67.0400,24.8080],
    ],
  },
  {
    id: 'dha-main-blvd',
    name: 'DHA Main Boulevard',
    type: 'arterial', speed: 68, congestion: 0.26,
    coords: [
      [67.0800,24.7800],[67.0750,24.7900],[67.0700,24.8000],[67.0660,24.8100],
      [67.0630,24.8200],[67.0610,24.8300],[67.0590,24.8400],[67.0570,24.8500],
    ],
  },
  {
    id: 'khayaban-e-ittehad',
    name: 'Khayaban-e-Ittehad',
    type: 'arterial', speed: 65, congestion: 0.28,
    coords: [
      [67.0800,24.8000],[67.0780,24.8100],[67.0760,24.8200],[67.0740,24.8300],
      [67.0720,24.8400],[67.0700,24.8500],
    ],
  },
  {
    id: 'khayaban-e-shamsheer',
    name: 'Khayaban-e-Shamsheer',
    type: 'arterial', speed: 62, congestion: 0.30,
    coords: [
      [67.0600,24.7900],[67.0620,24.8000],[67.0640,24.8100],[67.0660,24.8200],
      [67.0680,24.8300],[67.0700,24.8400],
    ],
  },
  {
    id: 'khayaban-e-rahat',
    name: 'Khayaban-e-Rahat',
    type: 'arterial', speed: 60, congestion: 0.32,
    coords: [
      [67.0400,24.7900],[67.0440,24.8000],[67.0480,24.8100],[67.0510,24.8200],
      [67.0530,24.8300],[67.0540,24.8400],
    ],
  },
  {
    id: 'zamzama-blvd',
    name: 'Zamzama Boulevard',
    type: 'arterial', speed: 50, congestion: 0.46,
    coords: [
      [67.0500,24.8050],[67.0480,24.8130],[67.0460,24.8210],[67.0445,24.8290],
      [67.0440,24.8370],[67.0445,24.8450],
    ],
  },

  // ════════════════════════════════════════════════════════
  // NORTH KARACHI / ORANGI / BALDIA
  // ════════════════════════════════════════════════════════
  {
    id: 'orangi-main',
    name: 'Orangi Town Main Road',
    type: 'arterial', speed: 28, congestion: 0.76,
    coords: [
      [66.9800,24.9600],[66.9850,24.9500],[66.9900,24.9400],[66.9950,24.9300],
      [67.0000,24.9200],[67.0050,24.9100],[67.0100,24.9000],
    ],
  },
  {
    id: 'manghopir-road',
    name: 'Manghopir Road',
    type: 'arterial', speed: 46, congestion: 0.52,
    coords: [
      [66.9600,24.9800],[66.9650,24.9650],[66.9700,24.9500],[66.9750,24.9350],
      [66.9800,24.9200],[66.9850,24.9050],[66.9900,24.8900],
    ],
  },
  {
    id: 'baldia-road',
    name: 'Baldia Road',
    type: 'arterial', speed: 32, congestion: 0.70,
    coords: [
      [66.9500,24.9200],[66.9550,24.9100],[66.9600,24.9000],[66.9650,24.8900],
      [66.9700,24.8820],[66.9750,24.8760],
    ],
  },
  {
    id: 'north-karachi-link',
    name: 'North Karachi Industrial Link',
    type: 'arterial', speed: 60, congestion: 0.32,
    coords: [
      [67.0400,24.9800],[67.0500,24.9700],[67.0600,24.9600],[67.0700,24.9500],
      [67.0800,24.9400],[67.0900,24.9300],
    ],
  },
  {
    id: 'new-karachi-road',
    name: 'New Karachi Road',
    type: 'arterial', speed: 52, congestion: 0.44,
    coords: [
      [66.9900,24.9500],[67.0000,24.9450],[67.0100,24.9400],[67.0200,24.9350],
      [67.0300,24.9300],[67.0400,24.9250],
    ],
  },
  {
    id: 'sohrab-goth-road',
    name: 'Sohrab Goth Road',
    type: 'arterial', speed: 44, congestion: 0.54,
    coords: [
      [67.0900,24.9700],[67.0920,24.9600],[67.0940,24.9500],[67.0950,24.9400],
      [67.0940,24.9300],[67.0920,24.9200],[67.0900,24.9100],
    ],
  },
  {
    id: 'surjani-road',
    name: 'Surjani Town Road',
    type: 'arterial', speed: 50, congestion: 0.46,
    coords: [
      [67.0200,24.9800],[67.0300,24.9700],[67.0400,24.9600],[67.0500,24.9500],
      [67.0600,24.9400],[67.0700,24.9300],
    ],
  },
  {
    id: 'site-area',
    name: 'SITE Area Road',
    type: 'arterial', speed: 36, congestion: 0.66,
    coords: [
      [66.9600,24.8900],[66.9650,24.8820],[66.9700,24.8740],[66.9750,24.8660],
      [66.9800,24.8600],[66.9850,24.8550],
    ],
  },
  {
    id: 'site-superhighway-link',
    name: 'SITE–Superhighway Link',
    type: 'arterial', speed: 54, congestion: 0.42,
    coords: [
      [66.9700,24.9200],[66.9750,24.9100],[66.9800,24.9000],[66.9850,24.8900],
      [66.9900,24.8820],[66.9950,24.8760],
    ],
  },
  {
    id: 'mauripur-west',
    name: 'Mauripur West Road',
    type: 'arterial', speed: 55, congestion: 0.40,
    coords: [
      [66.8900,24.8800],[66.9000,24.8790],[66.9100,24.8780],[66.9200,24.8775],
      [66.9300,24.8778],[66.9400,24.8785],[66.9500,24.8800],
    ],
  },

  // ════════════════════════════════════════════════════════
  // AIRPORT / KORANGI INDUSTRIAL / EAST KARACHI
  // ════════════════════════════════════════════════════════
  {
    id: 'airport-road',
    name: 'Karachi Airport Road',
    type: 'highway', speed: 70, congestion: 0.28,
    coords: [
      [67.1600,24.9060],[67.1500,24.9050],[67.1400,24.9040],[67.1300,24.9030],
      [67.1200,24.9020],[67.1100,24.9010],[67.1000,24.9000],
    ],
  },
  {
    id: 'airport-link',
    name: 'Airport Link Road',
    type: 'highway', speed: 68, congestion: 0.30,
    coords: [
      [67.1600,24.9060],[67.1580,24.9160],[67.1560,24.9260],[67.1540,24.9360],
      [67.1520,24.9450],
    ],
  },
  {
    id: 'korangi-ind',
    name: 'Korangi Industrial Area',
    type: 'arterial', speed: 58, congestion: 0.35,
    coords: [
      [67.1500,24.8200],[67.1540,24.8300],[67.1570,24.8400],[67.1590,24.8500],
      [67.1580,24.8600],[67.1560,24.8700],[67.1530,24.8780],
    ],
  },
  {
    id: 'landhi-road',
    name: 'Landhi Road',
    type: 'arterial', speed: 55, congestion: 0.40,
    coords: [
      [67.1800,24.8400],[67.1700,24.8460],[67.1600,24.8520],[67.1500,24.8580],
      [67.1400,24.8640],[67.1300,24.8700],[67.1200,24.8760],
    ],
  },
  {
    id: 'gulshan-blvd',
    name: 'Gulshan Boulevard',
    type: 'arterial', speed: 42, congestion: 0.58,
    coords: [
      [67.0900,24.9400],[67.0880,24.9300],[67.0860,24.9200],[67.0840,24.9100],
      [67.0820,24.9000],[67.0800,24.8900],[67.0780,24.8800],
    ],
  },
  {
    id: 'grid-johar-korangi',
    name: 'Johar–Korangi Link',
    type: 'arterial', speed: 55, congestion: 0.40,
    coords: [
      [67.1200,24.9000],[67.1230,24.8900],[67.1260,24.8800],[67.1280,24.8700],
      [67.1290,24.8600],[67.1280,24.8500],
    ],
  },

  // ════════════════════════════════════════════════════════
  // RING CONNECTORS
  // ════════════════════════════════════════════════════════
  {
    id: 'karachi-circular-inner',
    name: 'Inner Ring Road',
    type: 'arterial', speed: 38, congestion: 0.63,
    coords: [
      [67.0200,24.8900],[67.0350,24.8920],[67.0500,24.8910],[67.0650,24.8880],
      [67.0780,24.8830],[67.0860,24.8730],[67.0840,24.8620],[67.0720,24.8550],
      [67.0580,24.8530],[67.0430,24.8540],[67.0280,24.8580],[67.0150,24.8670],
      [67.0130,24.8800],[67.0200,24.8900],
    ],
  },
  {
    id: 'grid-gulshan-connector',
    name: 'Gulshan–Tariq Connector',
    type: 'urban', speed: 28, congestion: 0.76,
    coords: [
      [67.0700,24.9000],[67.0680,24.8900],[67.0660,24.8800],[67.0640,24.8700],
      [67.0620,24.8620],[67.0600,24.8550],
    ],
  },
  {
    id: 'grid-dha-s',
    name: 'DHA Phase 5–6 Connector',
    type: 'arterial', speed: 66, congestion: 0.27,
    coords: [
      [67.0300,24.7900],[67.0400,24.7950],[67.0500,24.8000],[67.0600,24.8050],
      [67.0700,24.8100],[67.0800,24.8150],
    ],
  },
  {
    id: 'grid-east-bin-qasim',
    name: 'Bin Qasim East Link',
    type: 'arterial', speed: 65, congestion: 0.28,
    coords: [
      [67.2400,24.8600],[67.2200,24.8620],[67.2000,24.8640],[67.1800,24.8660],
      [67.1600,24.8680],[67.1400,24.8700],
    ],
  },
  {
    id: 'grid-north-sohrab',
    name: 'Sohrab Goth Connector',
    type: 'arterial', speed: 42, congestion: 0.55,
    coords: [
      [67.0800,24.9800],[67.0850,24.9650],[67.0900,24.9500],[67.0950,24.9350],
      [67.1000,24.9200],[67.1050,24.9050],
    ],
  },
];

// ─── Traffic zones ────────────────────────────────────────────────────────────
export const TRAFFIC_ZONES = [
  { id: 'saddar',     center: [67.0100, 24.8660], radius: 700,  density: 0.97, label: 'SADDAR'        },
  { id: 'lyari',      center: [66.9830, 24.8640], radius: 600,  density: 0.92, label: 'LYARI'         },
  { id: 'clifton',    center: [67.0250, 24.8200], radius: 900,  density: 0.28, label: 'CLIFTON'       },
  { id: 'dha',        center: [67.0650, 24.8150], radius: 1000, density: 0.24, label: 'DHA'           },
  { id: 'gulshan',    center: [67.0850, 24.9100], radius: 1000, density: 0.56, label: 'GULSHAN'       },
  { id: 'johar',      center: [67.1250, 24.9100], radius: 900,  density: 0.52, label: 'GULISTAN JOHAR'},
  { id: 'korangi',    center: [67.1550, 24.8500], radius: 800,  density: 0.40, label: 'KORANGI'       },
  { id: 'nazimabad',  center: [67.0160, 24.9300], radius: 800,  density: 0.72, label: 'NAZIMABAD'     },
  { id: 'orangi',     center: [66.9950, 24.9350], radius: 900,  density: 0.78, label: 'ORANGI'        },
  { id: 'site',       center: [66.9700, 24.8800], radius: 700,  density: 0.66, label: 'SITE'          },
  { id: 'malir',      center: [67.1900, 24.8900], radius: 800,  density: 0.38, label: 'MALIR'         },
  { id: 'north-khi',  center: [67.0600, 24.9700], radius: 700,  density: 0.44, label: 'NORTH KHI'     },
];

// ─── Color by speed ───────────────────────────────────────────────────────────
export function getTrafficColor(speed) {
  if (speed >= 80)  return { primary: '#2DE2E6', secondary: '#1B6EF3', glow: '#00e5ff' };
  if (speed >= 60)  return { primary: '#4FC3F7', secondary: '#0288D1', glow: '#29b6f6' };
  if (speed >= 40)  return { primary: '#FFB703', secondary: '#F48C06', glow: '#ffd54f' };
  if (speed >= 20)  return { primary: '#FF7043', secondary: '#E64A19', glow: '#ff8a65' };
  if (speed >= 8)   return { primary: '#FF3B3B', secondary: '#8B0000', glow: '#ef5350' };
  return                   { primary: '#A7B0C0', secondary: '#607D8B', glow: '#90a4ae' };
}