/* Product data + size chart. Plain script (no modules) so the site
   runs by double-clicking index.html — no server needed.
   Replace the colour panels with real product photography for production. */

const SIZE_CHART = [
  { uk: 6, us: 7 },
  { uk: 7, us: 8 },
  { uk: 8, us: 9 },
  { uk: 9, us: 10 },
  { uk: 10, us: 11 },
  { uk: 11, us: 12 },
  { uk: 12, us: 13 }
];

function ukToUs(uk) {
  const e = SIZE_CHART.find(s => s.uk === uk);
  return e ? e.us : uk + 1;
}

const PRODUCTS = [
  {
    id: 'lv-trainer',
    name: 'Louis Vuitton Trainer',
    price: 240,
    description: 'A low-top trainer in white grained calf leather and Monogram denim, set on a signature outsized rubber sole.',
    ukSizes: [6, 7, 8, 9, 10, 11],
    /* Each colourway carries its own photography: image (cards/hero) and
       gallery (product page). Missing files fall back to a placeholder. */
    colors: [
      {
        name: 'Black / White', hex: '#1C1C1C', family: 'Black',
        image: 'images/black-side.jpg',
        gallery: [
          'images/black-side.jpg', 'images/black-angle.jpg', 'images/black-top.jpg',
          'images/black-toe.jpg', 'images/black-heel.jpg', 'images/black-back.jpg',
          'images/black-worn.jpg'
        ]
      },
      {
        name: 'Grey', hex: '#8C9094', family: 'Grey',
        image: 'images/grey-side.jpg',
        gallery: [
          'images/grey-side.jpg', 'images/grey-angle.jpg',
          'images/grey-back.jpg', 'images/grey-worn.jpg'
        ]
      },
      {
        name: 'Blue', hex: '#33538C', family: 'Blue',
        image: 'images/blue-side.jpg',
        gallery: [
          'images/blue-side.jpg', 'images/blue-angle.jpg', 'images/blue-top.jpg',
          'images/blue-toe.jpg', 'images/blue-heel.jpg', 'images/blue-back.jpg',
          'images/blue-worn.jpg'
        ]
      }
    ]
  },
  {
    id: 'linea-low',
    name: 'Linea Low',
    price: 210,
    description: 'A pared-back low-top in full-grain leather, finished by hand and set on a slim cup sole.',
    ukSizes: [6, 7, 8, 9, 10],
    colors: [
      { name: 'Chalk', hex: '#F1EFEA', family: 'White' },
      { name: 'Espresso', hex: '#3A2A22', family: 'Brown' },
      { name: 'Sage', hex: '#9AA38C', family: 'Green' }
    ]
  },
  {
    id: 'corso-trainer',
    name: 'Corso Trainer',
    price: 265,
    description: 'A court-inspired trainer with a structured toe and a tonal rubber outsole — quietly architectural.',
    ukSizes: [7, 8, 9, 10, 11, 12],
    colors: [
      { name: 'Ivory', hex: '#EFE9DD', family: 'White' },
      { name: 'Graphite', hex: '#2B2B2B', family: 'Black' },
      { name: 'Cobalt', hex: '#2E3A66', family: 'Blue' }
    ]
  },
  {
    id: 'vega-knit',
    name: 'Vega Knit',
    price: 190,
    description: 'A sock-fit knit shoe that moves with the foot, knitted in a single piece from recycled yarn.',
    ukSizes: [6, 7, 8, 9],
    colors: [
      { name: 'Mist', hex: '#DCDFE0', family: 'Grey' },
      { name: 'Noir', hex: '#141414', family: 'Black' },
      { name: 'Clay', hex: '#B3725A', family: 'Brown' }
    ]
  },
  {
    id: 'atlas-court',
    name: 'Atlas Court',
    price: 230,
    description: 'A heritage court silhouette remade in soft nubuck with a hand-stitched welt.',
    ukSizes: [8, 9, 10, 11, 12],
    colors: [
      { name: 'Off-White', hex: '#EDEAE3', family: 'White' },
      { name: 'Navy', hex: '#1E2A3A', family: 'Blue' },
      { name: 'Stone', hex: '#9E978A', family: 'Grey' }
    ]
  },
  {
    id: 'pace-lite',
    name: 'Pace Lite',
    price: 175,
    description: 'Our lightest shoe — a minimal trainer under 220g, made for long city days.',
    ukSizes: [6, 7, 8, 9, 10, 11, 12],
    colors: [
      { name: 'Cloud', hex: '#DDE0E1', family: 'Grey' },
      { name: 'Carbon', hex: '#232323', family: 'Black' },
      { name: 'Olive', hex: '#6E6B45', family: 'Green' }
    ]
  }
];

function getProduct(id) {
  return PRODUCTS.find(p => p.id === id) || null;
}
