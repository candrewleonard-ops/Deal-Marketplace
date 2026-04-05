// Major US cities with REI discussion data
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

function makeCity(id, name, state, population, memberCount) {
  const over = rand(18, 40);
  const under = rand(15, 35);
  const atAsk = 100 - over - under;
  return {
    id, name, state, population, memberCount,
    stats: {
      avgDaysOnMarket: rand(18, 72),
      medianListPrice: rand(150, 720) * 1000,
      avgYearBuilt: rand(1945, 1995),
      percentOverAsking: over,
      percentAtAsking: atAsk,
      percentUnderAsking: under,
    },
    lastMeetup: {
      date: '2026-03-15',
      location: `Downtown ${name} Co-Work Space`,
      attendees: rand(12, 85),
    },
    nextMeetup: {
      date: '2026-04-19',
      location: `${name} Marriott Conference Room`,
      rsvps: rand(8, 55),
    },
    communityLeaders: [],
  };
}

export const cities = [
  makeCity('atlanta-ga', 'Atlanta', 'GA', 6100000, 1840),
  makeCity('phoenix-az', 'Phoenix', 'AZ', 4950000, 1520),
  makeCity('dallas-tx', 'Dallas', 'TX', 7640000, 2105),
  makeCity('houston-tx', 'Houston', 'TX', 7100000, 1890),
  makeCity('austin-tx', 'Austin', 'TX', 2350000, 1240),
  makeCity('san-antonio-tx', 'San Antonio', 'TX', 2600000, 780),
  makeCity('memphis-tn', 'Memphis', 'TN', 1340000, 650),
  makeCity('nashville-tn', 'Nashville', 'TN', 2010000, 920),
  makeCity('indianapolis-in', 'Indianapolis', 'IN', 2110000, 540),
  makeCity('kansas-city-mo', 'Kansas City', 'MO', 2190000, 490),
  makeCity('birmingham-al', 'Birmingham', 'AL', 1110000, 380),
  makeCity('jacksonville-fl', 'Jacksonville', 'FL', 1610000, 620),
  makeCity('tampa-fl', 'Tampa', 'FL', 3240000, 1120),
  makeCity('orlando-fl', 'Orlando', 'FL', 2670000, 960),
  makeCity('miami-fl', 'Miami', 'FL', 6140000, 1740),
  makeCity('charlotte-nc', 'Charlotte', 'NC', 2660000, 890),
  makeCity('raleigh-nc', 'Raleigh', 'NC', 1460000, 560),
  makeCity('detroit-mi', 'Detroit', 'MI', 4300000, 720),
  makeCity('cleveland-oh', 'Cleveland', 'OH', 2050000, 410),
  makeCity('cincinnati-oh', 'Cincinnati', 'OH', 2260000, 470),
  makeCity('columbus-oh', 'Columbus', 'OH', 2140000, 520),
  makeCity('st-louis-mo', 'St. Louis', 'MO', 2800000, 590),
  makeCity('baltimore-md', 'Baltimore', 'MD', 2840000, 520),
  makeCity('philadelphia-pa', 'Philadelphia', 'PA', 6240000, 1310),
  makeCity('pittsburgh-pa', 'Pittsburgh', 'PA', 2370000, 430),
  makeCity('las-vegas-nv', 'Las Vegas', 'NV', 2270000, 810),
  makeCity('denver-co', 'Denver', 'CO', 2960000, 970),
  makeCity('portland-or', 'Portland', 'OR', 2510000, 680),
  makeCity('seattle-wa', 'Seattle', 'WA', 4020000, 1040),
  makeCity('chicago-il', 'Chicago', 'IL', 9460000, 1980),
  makeCity('minneapolis-mn', 'Minneapolis', 'MN', 3690000, 740),
  makeCity('oklahoma-city-ok', 'Oklahoma City', 'OK', 1440000, 360),
  makeCity('louisville-ky', 'Louisville', 'KY', 1290000, 320),
  makeCity('milwaukee-wi', 'Milwaukee', 'WI', 1570000, 290),
  makeCity('new-orleans-la', 'New Orleans', 'LA', 1270000, 310),
  makeCity('richmond-va', 'Richmond', 'VA', 1320000, 340),
  makeCity('sacramento-ca', 'Sacramento', 'CA', 2400000, 510),
  makeCity('san-diego-ca', 'San Diego', 'CA', 3290000, 880),
  makeCity('los-angeles-ca', 'Los Angeles', 'CA', 12820000, 2140),
  makeCity('boston-ma', 'Boston', 'MA', 4880000, 1060),
  makeCity('new-york-ny', 'New York', 'NY', 19770000, 2890),
  makeCity('washington-dc', 'Washington', 'DC', 6380000, 1180),
];

// Assign Carson as community leader for Atlanta
cities.find(c => c.id === 'atlanta-ga').communityLeaders = ['admin-carson'];

export const getCityById = (id) => cities.find(c => c.id === id);
