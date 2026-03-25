export interface School {
  name: string;
  zipcode: string;
  city: string;
  baseTemp: number;
}

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';

async function geocodeZipcode(zipcode: string): Promise<{
  lat: number;
  lon: number;
  city: string;
  bbox: [string, string, string, string]; // [south, north, west, east]
} | null> {
  const response = await fetch(
    `${NOMINATIM_URL}/search?postalcode=${zipcode}&countrycodes=us&format=json&limit=1`,
    { headers: { 'User-Agent': 'ClimateEducationApp/1.0' } },
  );
  if (!response.ok) return null;
  const data = await response.json();
  if (!data.length) return null;

  const result = data[0];
  const parts = (result.display_name as string).split(', ');
  const city = parts[1] ?? parts[0];

  return {
    lat: parseFloat(result.lat),
    lon: parseFloat(result.lon),
    city,
    bbox: result.boundingbox, // [south, north, west, east]
  };
}

async function fetchBaseTempF(lat: number, lon: number): Promise<number> {
  try {
    const response = await fetch(
      `${OPEN_METEO_URL}?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max&temperature_unit=fahrenheit&forecast_days=1`,
    );
    if (!response.ok) return 88;
    const data = await response.json();
    const temp = data?.daily?.temperature_2m_max?.[0];
    return typeof temp === 'number' ? Math.round(temp) : 88;
  } catch {
    return 88;
  }
}

function isElementaryOrMiddle(name: string): boolean {
  const n = name.toLowerCase();
  if (/\bhigh school\b/.test(n)) return false;
  if (/\bsenior high\b/.test(n)) return false;
  if (/\b(9th|10th|11th|12th) grade\b/.test(n)) return false;
  if (/\bcollege\b/.test(n)) return false;
  if (/\buniversity\b/.test(n)) return false;
  if (/\badult\b/.test(n)) return false;
  if (/\bvocational\b/.test(n)) return false;
  return true;
}

async function fetchOSMSchools(
  bbox: [string, string, string, string],
  zipcode: string,
  city: string,
): Promise<Omit<School, 'baseTemp'>[]> {
  const [south, north, west, east] = bbox;
  const query = `[out:json][timeout:25];
(
  node["amenity"="school"](${south},${west},${north},${east});
  way["amenity"="school"](${south},${west},${north},${east});
  relation["amenity"="school"](${south},${west},${north},${east});
  node["amenity"="kindergarten"](${south},${west},${north},${east});
  way["amenity"="kindergarten"](${south},${west},${north},${east});
  relation["amenity"="kindergarten"](${south},${west},${north},${east});
);
out center;`;

  try {
    const response = await fetch(OVERPASS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`,
    });
    if (!response.ok) return [];
    const data = await response.json();

    return (data.elements ?? [])
      .filter((el: any) => el.tags?.name && isElementaryOrMiddle(el.tags.name))
      .map((el: any) => ({
        name: el.tags.name as string,
        zipcode,
        city: (el.tags['addr:city'] as string | undefined) ?? city,
      }));
  } catch {
    return [];
  }
}

export async function searchSchoolsByZipcode(zipcode: string): Promise<School[]> {
  const location = await geocodeZipcode(zipcode);
  if (!location) return [];

  const { lat, lon, city, bbox } = location;

  const [schools, baseTemp] = await Promise.all([
    fetchOSMSchools(bbox, zipcode, city),
    fetchBaseTempF(lat, lon),
  ]);

  return schools
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((s) => ({ ...s, baseTemp }));
}
