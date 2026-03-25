export interface School {
  name: string;
  zipcode: string;
  city: string;
  baseTemp: number; // base temperature in °F on a hot day
}

export const bayAreaSchools: School[] = [
  // San Francisco
  { name: 'Balboa High School', zipcode: '94112', city: 'San Francisco', baseTemp: 82 },
  { name: 'Lincoln High School', zipcode: '94122', city: 'San Francisco', baseTemp: 78 },
  { name: 'Mission High School', zipcode: '94110', city: 'San Francisco', baseTemp: 84 },
  { name: 'Galileo Academy', zipcode: '94133', city: 'San Francisco', baseTemp: 76 },
  { name: 'Lowell High School', zipcode: '94132', city: 'San Francisco', baseTemp: 80 },
  { name: 'Washington High School', zipcode: '94121', city: 'San Francisco', baseTemp: 77 },
  { name: 'Burton High School', zipcode: '94112', city: 'San Francisco', baseTemp: 83 },

  // Oakland
  { name: 'Oakland Technical High School', zipcode: '94609', city: 'Oakland', baseTemp: 90 },
  { name: 'Skyline High School', zipcode: '94619', city: 'Oakland', baseTemp: 88 },
  { name: 'Oakland High School', zipcode: '94606', city: 'Oakland', baseTemp: 92 },
  { name: 'Castlemont High School', zipcode: '94621', city: 'Oakland', baseTemp: 93 },
  { name: 'Fremont High School', zipcode: '94621', city: 'Oakland', baseTemp: 91 },
  { name: 'McClymonds High School', zipcode: '94607', city: 'Oakland', baseTemp: 89 },

  // San Jose
  { name: 'San Jose High School', zipcode: '95112', city: 'San Jose', baseTemp: 95 },
  { name: 'Lincoln High School', zipcode: '95125', city: 'San Jose', baseTemp: 94 },
  { name: 'Pioneer High School', zipcode: '95124', city: 'San Jose', baseTemp: 93 },
  { name: 'Willow Glen High School', zipcode: '95125', city: 'San Jose', baseTemp: 92 },
  { name: 'Gunderson High School', zipcode: '95136', city: 'San Jose', baseTemp: 94 },
  { name: 'Independence High School', zipcode: '95127', city: 'San Jose', baseTemp: 96 },
  { name: 'Yerba Buena High School', zipcode: '95111', city: 'San Jose', baseTemp: 95 },

  // Berkeley
  { name: 'Berkeley High School', zipcode: '94704', city: 'Berkeley', baseTemp: 86 },
  { name: 'Berkeley Technology Academy', zipcode: '94702', city: 'Berkeley', baseTemp: 87 },

  // Palo Alto
  { name: 'Palo Alto High School', zipcode: '94301', city: 'Palo Alto', baseTemp: 88 },
  { name: 'Henry M. Gunn High School', zipcode: '94306', city: 'Palo Alto', baseTemp: 87 },

  // Fremont
  { name: 'Mission San Jose High School', zipcode: '94539', city: 'Fremont', baseTemp: 92 },
  { name: 'Irvington High School', zipcode: '94538', city: 'Fremont', baseTemp: 91 },
  { name: 'American High School', zipcode: '94536', city: 'Fremont', baseTemp: 90 },
  { name: 'Washington High School', zipcode: '94536', city: 'Fremont', baseTemp: 91 },

  // Richmond
  { name: 'Richmond High School', zipcode: '94801', city: 'Richmond', baseTemp: 85 },
  { name: 'Kennedy High School', zipcode: '94806', city: 'Richmond', baseTemp: 86 },
  { name: 'De Anza High School', zipcode: '94806', city: 'Richmond', baseTemp: 84 },

  // Hayward
  { name: 'Hayward High School', zipcode: '94541', city: 'Hayward', baseTemp: 89 },
  { name: 'Tennyson High School', zipcode: '94544', city: 'Hayward', baseTemp: 90 },
  { name: 'Mt. Eden High School', zipcode: '94541', city: 'Hayward', baseTemp: 88 },

  // Concord
  { name: 'Concord High School', zipcode: '94520', city: 'Concord', baseTemp: 96 },
  { name: 'Mt. Diablo High School', zipcode: '94520', city: 'Concord', baseTemp: 97 },
  { name: 'Ygnacio Valley High School', zipcode: '94521', city: 'Concord', baseTemp: 95 },

  // Santa Clara
  { name: 'Santa Clara High School', zipcode: '95050', city: 'Santa Clara', baseTemp: 91 },
  { name: 'Wilcox High School', zipcode: '95054', city: 'Santa Clara', baseTemp: 92 },

  // Sunnyvale
  { name: 'Fremont High School', zipcode: '94087', city: 'Sunnyvale', baseTemp: 90 },
  { name: 'Homestead High School', zipcode: '95014', city: 'Cupertino', baseTemp: 89 },

  // Daly City
  { name: 'Jefferson High School', zipcode: '94015', city: 'Daly City', baseTemp: 75 },
  { name: 'Westmoor High School', zipcode: '94015', city: 'Daly City', baseTemp: 76 },
  { name: 'Serramonte High School', zipcode: '94015', city: 'Daly City', baseTemp: 74 },

  // San Mateo
  { name: 'San Mateo High School', zipcode: '94401', city: 'San Mateo', baseTemp: 80 },
  { name: 'Aragon High School', zipcode: '94402', city: 'San Mateo', baseTemp: 81 },
  { name: 'Hillsdale High School', zipcode: '94403', city: 'San Mateo', baseTemp: 82 },

  // Redwood City
  { name: 'Sequoia High School', zipcode: '94062', city: 'Redwood City', baseTemp: 84 },
  { name: 'Woodside High School', zipcode: '94061', city: 'Woodside', baseTemp: 83 },

  // Vallejo
  { name: 'Vallejo High School', zipcode: '94590', city: 'Vallejo', baseTemp: 88 },
  { name: 'Jesse Bethel High School', zipcode: '94589', city: 'Vallejo', baseTemp: 89 },
  { name: 'Hogan High School', zipcode: '94589', city: 'Vallejo', baseTemp: 87 },

  // San Rafael
  { name: 'San Rafael High School', zipcode: '94901', city: 'San Rafael', baseTemp: 85 },
  { name: 'Terra Linda High School', zipcode: '94903', city: 'San Rafael', baseTemp: 84 },

  // Antioch
  { name: 'Antioch High School', zipcode: '94509', city: 'Antioch', baseTemp: 98 },
  { name: 'Deer Valley High School', zipcode: '94531', city: 'Antioch', baseTemp: 97 },

  // Pittsburg
  { name: 'Pittsburg High School', zipcode: '94565', city: 'Pittsburg', baseTemp: 97 },

  // Livermore
  { name: 'Livermore High School', zipcode: '94550', city: 'Livermore', baseTemp: 96 },
  { name: 'Granada High School', zipcode: '94550', city: 'Livermore', baseTemp: 95 },

  // Pleasanton
  { name: 'Amador Valley High School', zipcode: '94566', city: 'Pleasanton', baseTemp: 93 },
  { name: 'Foothill High School', zipcode: '94566', city: 'Pleasanton', baseTemp: 92 },

  // Mountain View
  { name: 'Mountain View High School', zipcode: '94040', city: 'Mountain View', baseTemp: 88 },
  { name: 'Los Altos High School', zipcode: '94022', city: 'Los Altos', baseTemp: 87 },

  // Milpitas
  { name: 'Milpitas High School', zipcode: '95035', city: 'Milpitas', baseTemp: 91 },

  // Newark
  { name: 'Newark Memorial High School', zipcode: '94560', city: 'Newark', baseTemp: 88 },

  // Union City
  { name: 'James Logan High School', zipcode: '94587', city: 'Union City', baseTemp: 87 },

  // South San Francisco
  { name: 'South San Francisco High School', zipcode: '94080', city: 'South San Francisco', baseTemp: 78 },
  { name: 'El Camino High School', zipcode: '94080', city: 'South San Francisco', baseTemp: 79 },
];

export function getZipcodes(): string[] {
  const zipcodes = new Set(bayAreaSchools.map((s) => s.zipcode));
  return Array.from(zipcodes).sort();
}

export function getSchoolsByZipcode(zipcode: string): School[] {
  return bayAreaSchools.filter((s) => s.zipcode === zipcode);
}

export function searchZipcodes(query: string): string[] {
  if (!query) return [];
  return getZipcodes().filter((z) => z.startsWith(query));
}
