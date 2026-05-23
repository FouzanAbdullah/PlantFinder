import axios from 'axios';
import * as FileSystem from 'expo-file-system/legacy';
import { CONFIG } from '../config';
import type { PlantAnalysis, PlantIdentification } from '../types';

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.GEMINI_MODEL}:generateContent`;

const buildPrompt = (name: string, commonName: string, family: string) => `
You are an expert botanist and plant health specialist. I have identified this plant as:
- Scientific name: ${name}
- Common name: ${commonName}
- Family: ${family}

Analyze the plant's health from this image and return ONLY a valid JSON object in this exact format:
{
  "health": {
    "status": "healthy",
    "issues": [],
    "confidence": 85
  },
  "careTips": {
    "revival": [],
    "watering": "Water once a week, allowing soil to dry between waterings.",
    "sunlight": "Bright indirect light.",
    "soil": "Well-draining potting mix.",
    "generalTips": ["Fertilise monthly in spring/summer", "Wipe leaves to remove dust"]
  },
  "toxicity": null
}

Rules:
- status must be exactly one of: healthy, stressed, dying, dead, unknown
- issues: visible problems (yellowing, wilting, spots, root rot, pests). Empty array if healthy.
- revival: step-by-step recovery steps. Empty array if healthy.
- toxicity: one sentence if toxic to pets/humans, or null if safe.
- confidence: 0-100 integer.
Return ONLY the JSON. No markdown, no extra text.
`.trim();

export async function analyzePlantHealth(
  imageUri: string,
  match: PlantIdentification
): Promise<PlantAnalysis> {
  const base64 = await FileSystem.readAsStringAsync(imageUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const commonName = match.commonNames[0] ?? 'unknown';
  const prompt = buildPrompt(match.name, commonName, match.family);

  const body = {
    contents: [
      {
        parts: [
          { inline_data: { mime_type: 'image/jpeg', data: base64 } },
          { text: prompt },
        ],
      },
    ],
    generationConfig: { temperature: 0.3 },
  };

  let response;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      response = await axios.post(
        `${GEMINI_URL}?key=${CONFIG.GEMINI_API_KEY}`,
        body,
        { headers: { 'Content-Type': 'application/json' } }
      );
      break;
    } catch (err: any) {
      const status = err?.response?.status;
      if ((status === 503 || status === 429) && attempt < 2) {
        await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
        continue;
      }
      throw new Error(`Gemini error ${status ?? 'network'}: ${err?.response?.data?.error?.message ?? err.message}`);
    }
  }

  const raw: string =
    response!.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  const cleaned = raw.replace(/^```(?:json)?\n?|\n?```$/g, '').trim();
  const parsed = JSON.parse(cleaned);

  return {
    identification: match,
    health: parsed.health,
    careTips: parsed.careTips,
    toxicity: parsed.toxicity ?? null,
    analyzedAt: new Date().toISOString(),
  };
}
