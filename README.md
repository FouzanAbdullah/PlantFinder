# 🌿 PlantFinder

A free, open-source Android app that identifies plants using your camera and analyses their health using AI.

## Features

- **Plant identification** — point your camera at any plant and get the species name, common name, and family
- **Health analysis** — AI detects issues like yellowing, wilting, root rot, and pests
- **Care guide** — watering, sunlight, and soil requirements for every identified plant
- **Revival steps** — step-by-step recovery instructions if your plant is stressed or dying
- **Toxicity warnings** — flags plants that are toxic to pets or humans
- **My Garden** — save and track your plants over time
- **Rename & delete** — manage your saved plants with nicknames

## Screenshots

> Coming soon

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo SDK 54 |
| Plant ID | [PlantNet API](https://my.plantnet.org) |
| Health analysis | [Google Gemini API](https://aistudio.google.com) |
| Navigation | React Navigation v7 |
| Storage | AsyncStorage + expo-file-system |

## Free API Limits

Each scan uses one PlantNet call and one Gemini call.

| API | Free limit |
|---|---|
| PlantNet | 500 scans / day |
| Gemini 2.5 Flash-Lite | 1,000 calls / day |

Effective limit: **500 full scans per day** shared across all users of your instance.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- [Expo Go](https://expo.dev/go) installed on your Android phone
- A free [PlantNet API key](https://my.plantnet.org)
- A free [Gemini API key](https://aistudio.google.com)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/PlantFinder.git
cd PlantFinder

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Add your API keys
cp src/config.example.ts src/config.ts
```

Open `src/config.ts` and paste in your API keys:

```ts
export const CONFIG = {
  PLANTNET_API_KEY: 'your-plantnet-key-here',
  GEMINI_API_KEY:   'your-gemini-key-here',
  GEMINI_MODEL:     'gemini-2.5-flash-lite',
};
```

```bash
# 4. Start the dev server
npx expo start
```

Scan the QR code with Expo Go on your phone. Make sure your phone and PC are on the same WiFi network. If that doesn't work, use:

```bash
npx expo start --tunnel
```

## Project Structure

```
src/
├── api/
│   ├── plantnet.ts       # PlantNet species identification
│   └── gemini.ts         # Gemini health analysis
├── components/
│   ├── HealthBadge.tsx   # Coloured health status pill
│   └── PlantAnalysisView.tsx  # Shared results UI
├── navigation/
│   └── AppNavigator.tsx  # Stack + tab navigation
├── screens/
│   ├── HomeScreen.tsx    # Camera + gallery picker
│   ├── ResultScreen.tsx  # Analysis results + save
│   ├── GardenScreen.tsx  # Saved plants list
│   └── DetailScreen.tsx  # Individual plant detail
├── storage/
│   └── garden.ts         # AsyncStorage CRUD
├── types/
│   └── index.ts          # TypeScript types
└── config.example.ts     # API key template
```

## Building for the Play Store

This app uses [Expo EAS](https://docs.expo.dev/build/introduction/) for cloud builds.

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile production
```

Upload the generated `.aab` file to the [Google Play Console](https://play.google.com/console).

## Security Note

`src/config.ts` is listed in `.gitignore` and will never be committed. Never share or commit your API keys. For a production app with many users, move the API calls to a backend server so keys are not bundled in the APK.

## Contributing

Pull requests are welcome. For major changes, open an issue first.

## License

[MIT](LICENSE)
