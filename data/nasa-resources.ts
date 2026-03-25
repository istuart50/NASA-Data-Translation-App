export type NasaResource = {
  id: string;
  title: string;
  url: string;
  description: string;
  category: 'data' | 'website' | 'article' | 'tool';
  // Kid-friendly search keywords - terms a 12-14 year old might type
  keywords: string[];
};

export const NASA_RESOURCES: NasaResource[] = [
  // Data Portals
  {
    id: 'earthdata',
    title: 'NASA Earthdata',
    url: 'https://earthdata.nasa.gov',
    description: 'Central hub for all of NASA\'s Earth science data, including climate datasets.',
    category: 'data',
    keywords: ['earth', 'data', 'climate', 'science', 'download', 'research', 'planet', 'environment'],
  },
  {
    id: 'gistemp',
    title: 'NASA GISS Surface Temperature (GISTEMP)',
    url: 'https://data.giss.nasa.gov/gistemp/',
    description: 'Global surface temperature data and analysis from the Goddard Institute for Space Studies.',
    category: 'data',
    keywords: ['temperature', 'hot', 'cold', 'warming', 'global warming', 'heat', 'thermometer', 'degrees', 'weather'],
  },
  {
    id: 'power',
    title: 'NASA Power Data Access',
    url: 'https://power.larc.nasa.gov',
    description: 'Solar and meteorological data for energy, agriculture, and sustainability applications.',
    category: 'data',
    keywords: ['solar', 'sun', 'energy', 'power', 'farming', 'agriculture', 'renewable', 'panels', 'wind'],
  },
  {
    id: 'giovanni',
    title: 'NASA Giovanni',
    url: 'https://giovanni.gsfc.nasa.gov/giovanni/',
    description: 'Visualize and analyze NASA Earth science remote sensing data online.',
    category: 'data',
    keywords: ['visualize', 'maps', 'graphs', 'pictures', 'satellite', 'analyze', 'charts'],
  },
  {
    id: 'sealevel',
    title: 'NASA Sea Level Change Portal',
    url: 'https://sealevel.nasa.gov/data',
    description: 'Sea level data from satellite altimetry, tide gauges, and ocean models.',
    category: 'data',
    keywords: ['sea level', 'ocean', 'water', 'rising', 'flood', 'coast', 'beach', 'tide', 'waves', 'underwater'],
  },
  {
    id: 'oco2',
    title: 'NASA Carbon Dioxide Data (OCO-2)',
    url: 'https://ocov2.jpl.nasa.gov',
    description: 'Global atmospheric CO2 measurements from the Orbiting Carbon Observatory.',
    category: 'data',
    keywords: ['co2', 'carbon', 'dioxide', 'greenhouse', 'gas', 'pollution', 'air', 'atmosphere', 'breathing', 'emissions'],
  },
  {
    id: 'modis',
    title: 'MODIS Land Surface Temperature',
    url: 'https://modis.gsfc.nasa.gov/data/dataprod/mod11.php',
    description: 'Land surface temperature and emissivity data from the MODIS satellite instrument.',
    category: 'data',
    keywords: ['land', 'surface', 'temperature', 'ground', 'hot', 'satellite', 'heat map'],
  },
  {
    id: 'seaice',
    title: 'NASA Arctic Sea Ice Data',
    url: 'https://nsidc.org/arcticseaicenews/',
    description: 'Near real-time Arctic sea ice extent data and analysis from NASA-supported NSIDC.',
    category: 'data',
    keywords: ['ice', 'arctic', 'polar', 'melting', 'glacier', 'north pole', 'frozen', 'snow', 'polar bear', 'antarctica'],
  },

  // Websites
  {
    id: 'climate-main',
    title: 'NASA Climate Change',
    url: 'https://climate.nasa.gov',
    description: 'NASA\'s main climate change portal with vital signs, evidence, causes, and effects.',
    category: 'website',
    keywords: ['climate change', 'global warming', 'environment', 'earth', 'planet', 'future', 'crisis'],
  },
  {
    id: 'earth-observatory',
    title: 'NASA Earth Observatory',
    url: 'https://earthobservatory.nasa.gov',
    description: 'Satellite images, articles, and data visualizations about Earth\'s climate and environment.',
    category: 'website',
    keywords: ['pictures', 'photos', 'satellite', 'images', 'earth', 'space', 'view', 'see'],
  },
  {
    id: 'giss',
    title: 'NASA Goddard Institute for Space Studies',
    url: 'https://www.giss.nasa.gov',
    description: 'Research on climate and global change, atmospheric sciences, and planetary atmospheres.',
    category: 'website',
    keywords: ['research', 'study', 'science', 'atmosphere', 'space', 'climate'],
  },
  {
    id: 'jpl-climate',
    title: 'NASA Jet Propulsion Laboratory - Climate',
    url: 'https://climate.jpl.nasa.gov',
    description: 'JPL\'s climate research including ocean monitoring, ice tracking, and atmosphere studies.',
    category: 'website',
    keywords: ['ocean', 'ice', 'tracking', 'monitoring', 'jets', 'lab', 'research'],
  },
  {
    id: 'worldview',
    title: 'NASA Worldview',
    url: 'https://worldview.earthdata.nasa.gov',
    description: 'Interactive satellite imagery browser showing near real-time views of Earth.',
    category: 'website',
    keywords: ['live', 'real time', 'satellite', 'map', 'earth', 'view', 'today', 'now', 'pictures'],
  },
  {
    id: 'climate-kids',
    title: 'NASA Climate Kids',
    url: 'https://climatekids.nasa.gov',
    description: 'Climate science resources designed for kids with games, activities, and simple explanations.',
    category: 'website',
    keywords: ['kids', 'games', 'fun', 'learn', 'easy', 'activities', 'simple', 'play', 'young'],
  },

  // Articles
  {
    id: 'effects',
    title: 'NASA: Effects of Climate Change',
    url: 'https://climate.nasa.gov/effects/',
    description: 'Overview of the current and future effects of climate change on our planet.',
    category: 'article',
    keywords: ['effects', 'what happens', 'consequences', 'impact', 'future', 'bad', 'danger', 'problems'],
  },
  {
    id: 'evidence',
    title: 'NASA: Evidence for Climate Change',
    url: 'https://climate.nasa.gov/evidence/',
    description: 'Scientific evidence for rapid climate change including CO2 levels, temperature, and ice loss.',
    category: 'article',
    keywords: ['evidence', 'proof', 'real', 'true', 'facts', 'data', 'show', 'prove', 'is it real'],
  },
  {
    id: 'causes',
    title: 'NASA: Causes of Climate Change',
    url: 'https://climate.nasa.gov/causes/',
    description: 'The science behind what is driving current climate change on Earth.',
    category: 'article',
    keywords: ['causes', 'why', 'reason', 'how', 'pollution', 'cars', 'factories', 'fossil fuels', 'burning'],
  },
  {
    id: 'solutions',
    title: 'NASA: Climate Solutions',
    url: 'https://climate.nasa.gov/solutions/adaptation-mitigation/',
    description: 'How humans can adapt to and mitigate the effects of climate change.',
    category: 'article',
    keywords: ['solutions', 'fix', 'help', 'stop', 'save', 'what can we do', 'reduce', 'prevent', 'green'],
  },
  {
    id: 'earth-science',
    title: 'NASA Earth Science Research',
    url: 'https://science.nasa.gov/earth-science/',
    description: 'Overview of NASA\'s Earth science missions, research, and discoveries.',
    category: 'article',
    keywords: ['missions', 'research', 'discoveries', 'satellites', 'rockets', 'explore', 'space'],
  },
  {
    id: 'urban-heat',
    title: 'Urban Heat Island Effect - NASA',
    url: 'https://earthobservatory.nasa.gov/features/UrbanRain',
    description: 'How cities create their own weather patterns and increase local temperatures.',
    category: 'article',
    keywords: ['city', 'urban', 'heat', 'hot', 'concrete', 'buildings', 'cool', 'trees', 'shade', 'pavement', 'asphalt'],
  },

  // Tools
  {
    id: 'eyes',
    title: 'NASA Eyes on the Earth',
    url: 'https://eyes.nasa.gov/apps/earth/',
    description: '3D interactive visualization of NASA\'s Earth-observing satellites and their data.',
    category: 'tool',
    keywords: ['3d', 'interactive', 'explore', 'satellites', 'cool', 'visual', 'see', 'spin', 'globe'],
  },
  {
    id: 'time-machine',
    title: 'NASA Climate Time Machine',
    url: 'https://climate.nasa.gov/interactives/climate-time-machine',
    description: 'Interactive tool showing how sea ice, sea level, CO2, and temperature have changed over time.',
    category: 'tool',
    keywords: ['time', 'history', 'past', 'before', 'change', 'years ago', 'old', 'compare', 'then and now'],
  },
  {
    id: 'firms',
    title: 'NASA Fire Information (FIRMS)',
    url: 'https://firms.modaps.eosdis.nasa.gov',
    description: 'Near real-time active fire data from NASA satellites worldwide.',
    category: 'tool',
    keywords: ['fire', 'wildfire', 'burning', 'forest fire', 'smoke', 'flames', 'hot spots'],
  },
  {
    id: 'greenhouse',
    title: 'NASA Greenhouse Gas Explorer',
    url: 'https://climatekids.nasa.gov/review/how-warm/',
    description: 'Interactive tool exploring how greenhouse gases warm the planet.',
    category: 'tool',
    keywords: ['greenhouse', 'gas', 'warm', 'trap', 'heat', 'blanket', 'atmosphere', 'co2', 'methane'],
  },
];

export const CATEGORY_CONFIG = {
  data: { label: 'Data Portal', color: '#2b6cb0', bg: '#ebf8ff' },
  website: { label: 'Website', color: '#2f855a', bg: '#f0fff4' },
  article: { label: 'Article', color: '#9b2c2c', bg: '#fff5f5' },
  tool: { label: 'Interactive Tool', color: '#744210', bg: '#fffff0' },
};

export function searchResources(query: string): NasaResource[] {
  if (!query.trim()) return NASA_RESOURCES;

  const terms = query.toLowerCase().split(/\s+/);

  const scored = NASA_RESOURCES.map((resource) => {
    let score = 0;
    const titleLower = resource.title.toLowerCase();
    const descLower = resource.description.toLowerCase();
    const keywordsJoined = resource.keywords.join(' ').toLowerCase();

    for (const term of terms) {
      if (titleLower.includes(term)) score += 3;
      if (keywordsJoined.includes(term)) score += 2;
      if (descLower.includes(term)) score += 1;
    }

    return { resource, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.resource);
}

export function getResourceById(id: string): NasaResource | undefined {
  return NASA_RESOURCES.find((r) => r.id === id);
}
