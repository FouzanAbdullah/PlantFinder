import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getGarden, deletePlant } from '../storage/garden';
import { HealthBadge } from '../components/HealthBadge';
import type { RootStackParamList, SavedPlant } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function GardenScreen() {
  const [plants, setPlants] = useState<SavedPlant[]>([]);
  const navigation = useNavigation<Nav>();

  useFocusEffect(
    useCallback(() => {
      getGarden().then(setPlants);
    }, [])
  );

  const handleDelete = (plant: SavedPlant) => {
    Alert.alert(
      'Remove plant',
      `Remove "${plant.nickname}" from your garden?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await deletePlant(plant.id);
            setPlants(prev => prev.filter(p => p.id !== plant.id));
          },
        },
      ]
    );
  };

  if (plants.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>🌿</Text>
        <Text style={styles.emptyTitle}>Your garden is empty</Text>
        <Text style={styles.emptyText}>
          Scan a plant on the camera tab and save it here to track it over time.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={plants}
        keyExtractor={p => p.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Detail', { plantId: item.id })}
            onLongPress={() => handleDelete(item)}
          >
            <Image source={{ uri: item.photoUri }} style={styles.thumb} resizeMode="cover" />
            <View style={styles.info}>
              <Text style={styles.nickname} numberOfLines={1}>{item.nickname}</Text>
              <Text style={styles.sciName} numberOfLines={1}>{item.analysis.identification.name}</Text>
              <HealthBadge status={item.analysis.health.status} />
              <Text style={styles.date}>{formatDate(item.savedAt)}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FAF4' },
  list: { padding: 16, gap: 12 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  thumb: { width: 100, height: 110 },
  info: { flex: 1, padding: 14, justifyContent: 'space-between' },
  nickname: { fontSize: 17, fontWeight: '700', color: '#1B4332' },
  sciName: { fontSize: 13, color: '#888', fontStyle: 'italic', marginTop: 2 },
  date: { fontSize: 12, color: '#AAA', marginTop: 6 },
  empty: {
    flex: 1,
    backgroundColor: '#F0FAF4',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '800', color: '#1B4332', marginBottom: 10 },
  emptyText: { fontSize: 15, color: '#666', textAlign: 'center', lineHeight: 22 },
});
