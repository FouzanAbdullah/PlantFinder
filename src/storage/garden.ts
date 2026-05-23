import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import type { SavedPlant } from '../types';

const GARDEN_KEY = '@plantfinder_garden';
const PLANTS_DIR = FileSystem.documentDirectory + 'plants/';

export async function getGarden(): Promise<SavedPlant[]> {
  const data = await AsyncStorage.getItem(GARDEN_KEY);
  return data ? JSON.parse(data) : [];
}

export async function savePlant(plant: SavedPlant, tempUri: string): Promise<SavedPlant> {
  await FileSystem.makeDirectoryAsync(PLANTS_DIR, { intermediates: true });
  const dest = PLANTS_DIR + plant.id + '.jpg';
  await FileSystem.copyAsync({ from: tempUri, to: dest });

  const saved: SavedPlant = { ...plant, photoUri: dest };
  const garden = await getGarden();
  garden.unshift(saved);
  await AsyncStorage.setItem(GARDEN_KEY, JSON.stringify(garden));
  return saved;
}

export async function deletePlant(id: string): Promise<void> {
  const garden = await getGarden();
  const target = garden.find(p => p.id === id);
  if (target) {
    await FileSystem.deleteAsync(target.photoUri, { idempotent: true });
  }
  const updated = garden.filter(p => p.id !== id);
  await AsyncStorage.setItem(GARDEN_KEY, JSON.stringify(updated));
}

export async function updateNickname(id: string, nickname: string): Promise<void> {
  const garden = await getGarden();
  const updated = garden.map(p => (p.id === id ? { ...p, nickname } : p));
  await AsyncStorage.setItem(GARDEN_KEY, JSON.stringify(updated));
}
