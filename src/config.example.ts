// Copy this file to src/config.ts and fill in your own API keys.
// NEVER commit src/config.ts — it is listed in .gitignore.

export const CONFIG = {
  // Get a free key at https://my.plantnet.org (500 identifications/day free)
  PLANTNET_API_KEY: 'YOUR_PLANTNET_API_KEY_HERE',

  // Get a free key at https://aistudio.google.com (1,000 calls/day free on Flash-Lite)
  GEMINI_API_KEY: 'YOUR_GEMINI_API_KEY_HERE',

  // Free Gemini models: gemini-2.5-flash-lite (1000/day), gemini-2.5-flash (250/day)
  GEMINI_MODEL: 'gemini-2.5-flash-lite',
};
