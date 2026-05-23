import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getGarden, deletePlant, updateNickname } from '../storage/garden';
import { PlantAnalysisView } from '../components/PlantAnalysisView';
import type { RootStackParamList, SavedPlant } from '../types';

type Route = RouteProp<RootStackParamList, 'Detail'>;
type Nav = NativeStackNavigationProp<RootStackParamList, 'Detail'>;

export default function DetailScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { plantId } = route.params;

  const [plant, setPlant] = useState<SavedPlant | null>(null);
  const [renameVisible, setRenameVisible] = useState(false);
  const [draftName, setDraftName] = useState('');

  useEffect(() => {
    getGarden().then(garden => {
      const found = garden.find(p => p.id === plantId) ?? null;
      setPlant(found);
      if (found) {
        navigation.setOptions({ title: found.nickname });
      }
    });
  }, [plantId]);

  const handleRename = async () => {
    if (!plant || !draftName.trim()) return;
    await updateNickname(plant.id, draftName.trim());
    setPlant(prev => prev ? { ...prev, nickname: draftName.trim() } : prev);
    navigation.setOptions({ title: draftName.trim() });
    setRenameVisible(false);
  };

  const handleDelete = () => {
    if (!plant) return;
    Alert.alert('Remove plant', `Remove "${plant.nickname}" from your garden?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          await deletePlant(plant.id);
          navigation.goBack();
        },
      },
    ]);
  };

  if (!plant) {
    return (
      <View style={styles.centred}>
        <Text style={styles.notFound}>Plant not found.</Text>
      </View>
    );
  }

  const extras = (
    <View style={styles.extraRow}>
      <TouchableOpacity
        style={styles.extraBtn}
        onPress={() => {
          setDraftName(plant.nickname);
          setRenameVisible(true);
        }}
      >
        <Text style={styles.extraBtnText}>✏️  Rename</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.extraBtn, styles.deleteBtn]} onPress={handleDelete}>
        <Text style={[styles.extraBtnText, styles.deleteBtnText]}>🗑️  Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <PlantAnalysisView
        photoUri={plant.photoUri}
        analysis={plant.analysis}
        extraAction={extras}
      />

      <Modal visible={renameVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Rename plant</Text>
            <TextInput
              style={styles.input}
              value={draftName}
              onChangeText={setDraftName}
              autoFocus
              placeholder="Enter a nickname"
              placeholderTextColor="#AAA"
              returnKeyType="done"
              onSubmitEditing={handleRename}
            />
            <View style={styles.modalRow}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setRenameVisible(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSave} onPress={handleRename}>
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  centred: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0FAF4' },
  notFound: { fontSize: 16, color: '#888' },
  extraRow: { flexDirection: 'row', marginHorizontal: 16, marginTop: 12, gap: 10 },
  extraBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#2D6A4F',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  extraBtnText: { fontSize: 15, fontWeight: '600', color: '#2D6A4F' },
  deleteBtn: { borderColor: '#E63946' },
  deleteBtnText: { color: '#E63946' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1B4332', marginBottom: 16 },
  input: {
    borderWidth: 1.5,
    borderColor: '#D0E8DC',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#222',
    marginBottom: 16,
  },
  modalRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  modalCancel: { paddingHorizontal: 20, paddingVertical: 10 },
  modalCancelText: { fontSize: 15, color: '#888' },
  modalSave: {
    backgroundColor: '#2D6A4F',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  modalSaveText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
