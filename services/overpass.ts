export interface School {
  name: string;
  zipcode: string;
  city: string;
  baseTemp: number;
}

type SchoolEntry = Omit<School, 'baseTemp'>;

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';
const EDUCATION_DATA_URL = 'https://educationdata.urban.org/api/v1/schools';

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

async function fetchOSMSchools(
  lat: number,
  lon: number,
  zipcode: string,
  city: string,
): Promise<SchoolEntry[]> {
  const query = `[out:json][timeout:25];
(
  node["amenity"="school"](around:5000,${lat},${lon});
  way["amenity"="school"](around:5000,${lat},${lon});
  relation["amenity"="school"](around:5000,${lat},${lon});
  node["amenity"="kindergarten"](around:5000,${lat},${lon});
  way["amenity"="kindergarten"](around:5000,${lat},${lon});
  relation["amenity"="kindergarten"](around:5000,${lat},${lon});
);
out center;`;

  try {
    const response = await fetch(OVERPASS_URL, { method: 'POST', body: query });
    if (!response.ok) return [];
    const data = await response.json();

    return (data.elements ?? [])
      .filter((el: any) => el.tags?.name)
      .map((el: any) => ({
        name: el.tags.name as string,
        zipcode,
        city: (el.tags['addr:city'] as string | undefined) ?? city,
      }));
  } catch {
    return [];
  }
}

async function fetchNCESSchools(zipcode: string, city: string): Promise<SchoolEntry[]> {
  const [ccdResult, pssResult] = await Promise.allSettled([
    fetch(`${EDUCATION_DATA_URL}/ccd/directory/?zip_location=${zipcode}&per_page=200`),
    fetch(`${EDUCATION_DATA_URL}/pss/directory/?zip=${zipcode}&per_page=200`),
  ]);

  const schools: SchoolEntry[] = [];

  if (ccdResult.status === 'fulfilled' && ccdResult.value.ok) {
    const data = await ccdResult.value.json();
    for (const s of data.results ?? []) {
      if (s.school_name) {
        schools.push({
          name: s.school_name as string,
          zipcode,
          city: (s.city_location as string | undefined) ?? city,
        });
      }
    }
  }

  if (pssResult.status === 'fulfilled' && pssResult.value.ok) {
    const data = await pssResult.value.json();
    for (const s of data.results ?? []) {
      if (s.school_name) {
        schools.push({
          name: s.school_name as string,
          zipcode,
          city: (s.city as string | undefined) ?? city,
        });
      }
    }
  }

  return schools;
}

function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function mergeSchools(osm: SchoolEntry[], nces: SchoolEntry[]): SchoolEntry[] {
  const seen = new Set(osm.map((s) => normalizeName(s.name)));
  const merged = [...osm];

  for (const school of nces) {
    const key = normalizeName(school.name);
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(school);
    }
  }

  return merged.sort((a, b) => a.name.localeCompare(b.name));
}

export async function searchSchoolsByZipcode(zipcode: string): Promise<School[]> {
  const location = await geocodeZipcode(zipcode);
  if (!location) return [];

  const { lat, lon, city } = location;

  const [osmSchools, ncesSchools, baseTemp] = await Promise.all([
    fetchOSMSchools(lat, lon, zipcode, city),
    fetchNCESSchools(zipcode, city),
    fetchBaseTempF(lat, lon),
  ]);

  return mergeSchools(osmSchools, ncesSchools).map((s) => ({ ...s, baseTemp }));
}
