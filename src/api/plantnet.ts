import { CONFIG } from '../config';
import type { PlantIdentification } from '../types';

const BASE_URL = 'https://my-api.plantnet.org/v2/identify/all';

export async function identifyPlant(imageUri: string): Promise<PlantIdentification[]> {
  const formData = new FormData();
  formData.append('images', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'plant.jpg',
  } as any);
  formData.append('organs', 'auto');

  const response = await fetch(
    `${BASE_URL}?api-key=${CONFIG.PLANTNET_API_KEY}&nb-results=3&lang=en`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const text = await response.text().catch(() => response.statusText);
    throw new Error(`PlantNet error ${response.status}: ${text}`);
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    return [];
  }

  return data.results.map((r: any) => ({
    name: r.species.scientificNameWithoutAuthor ?? r.species.scientificName,
    commonNames: r.species.commonNames ?? [],
    family:
      r.species.family?.scientificNameWithoutAuthor ??
      r.species.family?.scientificName ??
      'Unknown',
    confidence: Math.round(r.score * 100),
  }));
}
