// Mock data tailored to the new "off-market deal terminal" marketplace preview.
// Self-contained so we don't touch existing /marketplace data or live functionality.

export const KPI_STATS = [
  {
    key: 'active',
    label: 'Active Deals',
    value: '12,842',
    delta: '+8.7%',
    sub: 'this week',
    icon: 'activity',
  },
  {
    key: 'value',
    label: 'Total Deal Value',
    value: '$42.6M',
    delta: '+12.4%',
    sub: 'this week',
    icon: 'dollar',
  },
  {
    key: 'avg',
    label: 'Avg. Deal Price',
    value: '$18,243',
    delta: '+5.3%',
    sub: 'this week',
    icon: 'tag',
  },
  {
    key: 'new',
    label: 'New Deals',
    value: '2,431',
    delta: '+9.1%',
    sub: 'this week',
    icon: 'sparkles',
  },
  {
    key: 'online',
    label: 'Members Online',
    value: '1,027',
    delta: 'Live',
    sub: 'right now',
    icon: 'users',
    live: true,
  },
  {
    key: 'pulse',
    label: 'Market Pulse',
    value: 'Strong',
    delta: '32 states',
    sub: 'high seller activity',
    icon: 'pulse',
    pulse: true,
  },
];

// Mobile carousel priority order
export const KPI_MOBILE_ORDER = ['new', 'active', 'pulse', 'online', 'value', 'avg'];

export const DEAL_TYPES = [
  { value: 'all',        label: 'All Deals' },
  { value: 'fix-flip',   label: 'Fix & Flip' },
  { value: 'buy-hold',   label: 'Buy & Hold' },
  { value: 'land',       label: 'Land' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'creative',   label: 'Creative Financing' },
  { value: 'lease',      label: 'Lease Option' },
  { value: 'subject-to', label: 'Subject To' },
  { value: 'multi',      label: 'Multi-Family' },
];

export const FILTER_DEAL_TYPES = [
  { value: 'all',        label: 'All Deal Types' },
  { value: 'fix-flip',   label: 'Fix & Flip' },
  { value: 'buy-hold',   label: 'Buy & Hold' },
  { value: 'land',       label: 'Land' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'creative',   label: 'Creative Financing' },
];

export const STATE_DEAL_COUNTS = {
  WA: 512, OR: 164, CA: 626, NV: 138, AZ: 215, UT: 92, ID: 71,
  MT: 38,  WY: 22,  CO: 184, NM: 96,
  ND: 28,  SD: 31,  NE: 64,  KS: 87, OK: 142, TX: 906,
  MN: 121, IA: 76,  MO: 188, AR: 109, LA: 168,
  WI: 142, IL: 299, IN: 174, KY: 138, TN: 256, MS: 96, AL: 184,
  MI: 246, OH: 326, WV: 41,  VA: 188, NC: 412, SC: 222, GA: 501, FL: 653,
  PA: 302, NY: 664, NJ: 198, CT: 88,  RI: 31,  MA: 142, VT: 19, NH: 28, ME: 36,
  MD: 124, DE: 26,  DC: 14,
  AK: 12, HI: 18,
};

export const STATE_NAMES = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
  DC: 'D.C.',
};

export const TOP_STATES_NEW = [
  { abbr: 'FL', name: 'Florida',         count: 842, delta: '+14.2%' },
  { abbr: 'TX', name: 'Texas',           count: 963, delta: '+11.3%' },
  { abbr: 'GA', name: 'Georgia',         count: 531, delta: '+9.2%'  },
  { abbr: 'NY', name: 'New York',        count: 654, delta: '+8.7%'  },
  { abbr: 'NC', name: 'North Carolina',  count: 412, delta: '+7.1%'  },
];

// Property images — Unsplash IDs picked for quality property exterior shots.
const IMG = (id, w = 900, h = 600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=70`;

export const DEALS = [
  {
    id: 'p1',
    badge: 'FEATURED',
    dealType: 'fix-flip',
    dealTypeLabel: 'Fix & Flip',
    price: 245000,
    arv: 360000,
    address: '123 Peachtree Rd NE, Atlanta, GA 30309',
    city: 'Atlanta', state: 'GA',
    estProfit: 115000,
    estRehab: 75000,
    beds: 3, baths: 2, sqft: 1480, yearBuilt: 1978,
    sellerName: 'Marcus J.', sellerBadge: 'Pro Seller',
    sellerAvatar: 'https://i.pravatar.cc/80?img=12',
    roi: 32, daysListed: 3,
    image: IMG('1564013799919-ab600027ffc6'),
    velocity: 'High',
    heat: 89,
    aiMatch: 94,
  },
  {
    id: 'p2',
    badge: 'HOT',
    dealType: 'buy-hold',
    dealTypeLabel: 'Buy & Hold',
    price: 178500,
    capRate: 8.2,
    address: '842 McDowell Rd, Phoenix, AZ 85006',
    city: 'Phoenix', state: 'AZ',
    estRent: 1225,
    cashFlow: 392,
    beds: 4, baths: 2, sqft: 1620, yearBuilt: 1962,
    sellerName: 'Diana C.', sellerBadge: 'Top Seller',
    sellerAvatar: 'https://i.pravatar.cc/80?img=47',
    roi: 28, daysListed: 5,
    image: IMG('1568605114967-8130f3a36994'),
    velocity: 'Very High',
    heat: 76,
    aiMatch: 88,
  },
  {
    id: 'p3',
    badge: 'NEW',
    dealType: 'land',
    dealTypeLabel: 'Land',
    price: 89900,
    acres: 2.45,
    address: '0 Highway 290, Austin, TX 78737',
    city: 'Austin', state: 'TX',
    zoning: 'None',
    topography: 'Flat',
    sellerName: 'LandSource', sellerBadge: 'Pro Seller',
    sellerAvatar: 'https://i.pravatar.cc/80?img=33',
    daysListed: 1,
    image: IMG('1500382017468-9049fed747ef'),
    velocity: 'Medium',
    heat: 62,
  },
  {
    id: 'p4',
    badge: 'PRICE DROP',
    dealType: 'fix-flip',
    dealTypeLabel: 'Fix & Flip',
    price: 219000,
    arv: 305000,
    address: '4421 Maple Ridge Dr, Charlotte, NC 28210',
    city: 'Charlotte', state: 'NC',
    estProfit: 64000,
    estRehab: 42000,
    priceDrop: 18500,
    beds: 4, baths: 3, sqft: 2010, yearBuilt: 1996,
    sellerName: 'Kevin R.', sellerBadge: 'Pro Seller',
    sellerAvatar: 'https://i.pravatar.cc/80?img=15',
    roi: 22, daysListed: 12,
    image: IMG('1576941089067-2de3c901e126'),
    velocity: 'Medium',
    heat: 71,
  },
  {
    id: 'p5',
    badge: 'NEW',
    dealType: 'multi',
    dealTypeLabel: 'Multi-Family',
    price: 1240000,
    capRate: 6.8,
    address: '218 Brickell Bay Blvd, Miami, FL 33131',
    city: 'Miami', state: 'FL',
    estRent: 9800,
    cashFlow: 2940,
    units: 8, beds: 16, baths: 8, sqft: 6420, yearBuilt: 1984,
    sellerName: 'Andrea M.', sellerBadge: 'Top Seller',
    sellerAvatar: 'https://i.pravatar.cc/80?img=23',
    roi: 24, daysListed: 2,
    image: IMG('1545324418-cc1a3fa10c00'),
    velocity: 'High',
    heat: 84,
    aiMatch: 91,
  },
  {
    id: 'p6',
    badge: 'FEATURED',
    dealType: 'commercial',
    dealTypeLabel: 'Commercial',
    price: 2850000,
    capRate: 7.4,
    address: '1180 W Loop S, Houston, TX 77027',
    city: 'Houston', state: 'TX',
    noi: 211000,
    occupancy: 92,
    sqft: 14800, yearBuilt: 2004,
    sellerName: 'Vertex CRE', sellerBadge: 'Pro Seller',
    sellerAvatar: 'https://i.pravatar.cc/80?img=58',
    roi: 19, daysListed: 6,
    image: IMG('1486406146926-c627a92ad1ab'),
    velocity: 'High',
    heat: 78,
  },
];

export const MARKET_INSIGHTS = [
  {
    key: 'cashflow',
    title: 'Best Cash Flow Markets',
    desc: 'See top 10 markets',
    icon: 'cashflow',
  },
  {
    key: 'flipping',
    title: 'Hot Flipping Markets',
    desc: 'Where profits are rising',
    icon: 'flame',
  },
  {
    key: 'new-build',
    title: 'New Construction Map',
    desc: 'Explore new builds',
    icon: 'hammer',
  },
];

export const MOBILE_PULSE = {
  hotMarket: 'Florida',
  hotMarketDelta: '+14.2%',
  buyerDemand: 'High',
  newDealsToday: 312,
};

export const TRUSTED_REVIEW = {
  rating: 4.9,
  reviews: '2,300+',
  quote: 'TREIM is my go-to marketplace. The deals are legit and the community is on fire.',
  author: 'Kevin R., Real Estate Investor',
  avatars: [
    'https://i.pravatar.cc/64?img=10',
    'https://i.pravatar.cc/64?img=22',
    'https://i.pravatar.cc/64?img=31',
    'https://i.pravatar.cc/64?img=44',
    'https://i.pravatar.cc/64?img=51',
  ],
};
