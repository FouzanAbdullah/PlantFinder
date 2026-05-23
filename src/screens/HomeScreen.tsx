import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

export default function HomeScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const cameraRef = useRef<CameraView>(null);
  const navigation = useNavigation<Nav>();

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.85 });
      if (photo?.uri) navigation.navigate('Result', { photoUri: photo.uri });
    } catch {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handleGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      navigation.navigate('Result', { photoUri: result.assets[0].uri });
    }
  };

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>Camera Access</Text>
        <Text style={styles.permissionText}>
          PlantFinder needs camera access to identify plants.
        </Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>Grant Access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        flash={flash}
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <Text style={styles.appTitle}>PlantFinder</Text>
          <TouchableOpacity
            style={styles.flashBtn}
            onPress={() => setFlash(f => (f === 'off' ? 'on' : 'off'))}
          >
            <Text style={styles.flashIcon}>{flash === 'on' ? '⚡' : '🔦'}</Text>
          </TouchableOpacity>
        </View>

        {/* Viewfinder hint */}
        <View style={styles.hintContainer}>
          <View style={styles.hintBubble}>
            <Text style={styles.hintText}>Point camera at a plant</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.sideBtn} onPress={handleGallery}>
            <Text style={styles.sideBtnIcon}>🖼️</Text>
            <Text style={styles.sideBtnLabel}>Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.captureBtn} onPress={handleCapture} activeOpacity={0.8}>
            <View style={styles.captureInner} />
          </TouchableOpacity>

          <View style={styles.sideBtn} />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 48 : 60,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  appTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  flashBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flashIcon: { fontSize: 20 },
  hintContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  hintBubble: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  hintText: { color: '#fff', fontSize: 14 },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingBottom: 48,
    paddingTop: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sideBtn: { width: 60, alignItems: 'center' },
  sideBtnIcon: { fontSize: 28 },
  sideBtnLabel: { color: '#fff', fontSize: 12, marginTop: 4 },
  captureBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#F0FAF4',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  permissionTitle: { fontSize: 24, fontWeight: '800', color: '#1B4332', marginBottom: 12 },
  permissionText: { fontSize: 15, color: '#555', textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  permissionBtn: {
    backgroundColor: '#2D6A4F',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 14,
  },
  permissionBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
