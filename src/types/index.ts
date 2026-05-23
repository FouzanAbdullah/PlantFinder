import type { NavigatorScreenParams } from '@react-navigation/native';

export type HealthStatus = 'healthy' | 'stressed' | 'dying' | 'dead' | 'unknown';

export interface PlantIdentification {
  name: string;
  commonNames: string[];
  family: string;
  confidence: number;
}

export interface PlantHealth {
  status: HealthStatus;
  issues: string[];
  confidence: number;
}

export interface CareTips {
  revival: string[];
  watering: string;
  sunlight: string;
  soil: string;
  generalTips: string[];
}

export interface PlantAnalysis {
  identification: PlantIdentification;
  health: PlantHealth;
  careTips: CareTips;
  toxicity: string | null;
  analyzedAt: string;
}

export interface SavedPlant {
  id: string;
  photoUri: string;
  analysis: PlantAnalysis;
  nickname: string;
  savedAt: string;
}

export type TabParamList = {
  HomeTab: undefined;
  GardenTab: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
  Result: { photoUri: string };
  Detail: { plantId: string };
};
