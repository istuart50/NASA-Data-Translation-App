export interface School {
  name: string;
  zipcode: string;
  city: string;
  baseTemp: number;
}

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';

async function geocodeZipcode(
  zipcode: string,
): Promise<{ lat: number; lon: number; city: string } | null> {
  const response = await fetch(
    `${NOMINATIM_URL}/search?postalcode=${zipcode}&countrycodes=us&format=json&limit=1`,
    { headers: { 'User-Agent': 'ClimateEducationApp/1.0' } },
  );
  if (!response.ok) return null;
  const data = await response.json();
  if (!data.length) return null;

  const result = data[0];
  // display_name format: "ZipCode, City, County, State, Country"
  const parts = (result.display_name as string).split(', ');
  const city = parts[1] ?? parts[0];

  return {
    lat: parseFloat(result.lat),
    lon: parseFloat(result.lon),
    city,
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

export async function searchSchoolsByZipcode(zipcode: string): Promise<School[]> {
  const location = await geocodeZipcode(zipcode);
  if (!location) return [];

  const { lat, lon, city } = location;

  const query = `[out:json][timeout:25];
(
  node["amenity"="school"](around:4000,${lat},${lon});
  way["amenity"="school"](around:4000,${lat},${lon});
  relation["amenity"="school"](around:4000,${lat},${lon});
);
out center;`;

  const [overpassResponse, baseTemp] = await Promise.all([
    fetch(OVERPASS_URL, { method: 'POST', body: query }),
    fetchBaseTempF(lat, lon),
  ]);

  if (!overpassResponse.ok) return [];
  const data = await overpassResponse.json();

  return (data.elements ?? [])
    .filter((el: any) => el.tags?.name)
    .map((el: any) => ({
      name: el.tags.name as string,
      zipcode,
      city: (el.tags['addr:city'] as string | undefined) ?? city,
      baseTemp,
    }))
    .slice(0, 25);
}
