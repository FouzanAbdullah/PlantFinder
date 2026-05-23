import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { identifyPlant } from '../api/plantnet';
import { analyzePlantHealth } from '../api/gemini';
import { savePlant } from '../storage/garden';
import { PlantAnalysisView } from '../components/PlantAnalysisView';
import type { PlantAnalysis, RootStackParamList, SavedPlant } from '../types';

type Route = RouteProp<RootStackParamList, 'Result'>;
type Nav = NativeStackNavigationProp<RootStackParamList, 'Result'>;

type Phase = 'identifying' | 'analyzing' | 'done' | 'error';

const PHASE_LABELS: Record<Phase, string> = {
  identifying: 'Identifying plant...',
  analyzing: 'Analysing health...',
  done: '',
  error: '',
};

export default function ResultScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { photoUri } = route.params;

  const [phase, setPhase] = useState<Phase>('identifying');
  const [analysis, setAnalysis] = useState<PlantAnalysis | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    run();
  }, []);

  const run = async () => {
    try {
      setPhase('identifying');
      const results = await identifyPlant(photoUri);
      if (results.length === 0) {
        setError("Couldn't identify this plant. Try a clearer photo showing the leaves or flowers.");
        setPhase('error');
        return;
      }

      setPhase('analyzing');
      const result = await analyzePlantHealth(photoUri, results[0]);
      setAnalysis(result);
      setPhase('done');
    } catch (e: any) {
      setError(e?.message ?? 'Something went wrong. Please try again.');
      setPhase('error');
    }
  };

  const handleSave = async () => {
    if (!analysis) return;
    setSaving(true);
    try {
      const plant: SavedPlant = {
        id: Date.now().toString(),
        photoUri,
        analysis,
        nickname: analysis.identification.commonNames[0] ?? analysis.identification.name,
        savedAt: new Date().toISOString(),
      };
      await savePlant(plant, photoUri);
      Alert.alert('Saved!', 'Plant added to your garden.', [
        {
          text: 'View Garden',
          onPress: () => navigation.navigate('MainTabs', { screen: 'GardenTab' } as any),
        },
        { text: 'OK' },
      ]);
    } catch {
      Alert.alert('Error', 'Failed to save plant. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (phase === 'error') {
    return (
      <View style={styles.centred}>
        <Text style={styles.errorIcon}>🌵</Text>
        <Text style={styles.errorTitle}>Identification Failed</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={run}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (phase !== 'done' || !analysis) {
    return (
      <View style={styles.centred}>
        <ActivityIndicator size="large" color="#2D6A4F" />
        <Text style={styles.loadingText}>{PHASE_LABELS[phase]}</Text>
        <Text style={styles.loadingSubtext}>This usually takes 5–10 seconds</Text>
      </View>
    );
  }

  return (
    <PlantAnalysisView
      photoUri={photoUri}
      analysis={analysis}
      actionLabel="Save to Garden"
      onAction={handleSave}
      actionLoading={saving}
    />
  );
}

const styles = StyleSheet.create({
  centred: {
    flex: 1,
    backgroundColor: '#F0FAF4',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: { fontSize: 18, fontWeight: '700', color: '#1B4332', marginTop: 20 },
  loadingSubtext: { fontSize: 14, color: '#888', marginTop: 8 },
  errorIcon: { fontSize: 56, marginBottom: 16 },
  errorTitle: { fontSize: 22, fontWeight: '800', color: '#1B4332', marginBottom: 10 },
  errorText: { fontSize: 15, color: '#555', textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  retryBtn: {
    backgroundColor: '#2D6A4F',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 12,
  },
  retryText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  backBtn: { paddingVertical: 10 },
  backText: { color: '#2D6A4F', fontSize: 15 },
});
