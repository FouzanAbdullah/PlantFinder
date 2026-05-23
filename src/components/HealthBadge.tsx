import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { HealthStatus } from '../types';

const STATUS: Record<HealthStatus, { bg: string; text: string; label: string }> = {
  healthy: { bg: '#D8F3DC', text: '#1B4332', label: 'Healthy' },
  stressed: { bg: '#FFF3CD', text: '#7D4F00', label: 'Stressed' },
  dying:    { bg: '#FFE0D6', text: '#7D1A00', label: 'Dying' },
  dead:     { bg: '#E0E0E0', text: '#3D3D3D', label: 'Dead' },
  unknown:  { bg: '#EEE', text: '#555', label: 'Unknown' },
};

export function HealthBadge({ status }: { status: HealthStatus }) {
  const s = STATUS[status] ?? STATUS.unknown;
  return (
    <View style={[styles.badge, { backgroundColor: s.bg }]}>
      <Text style={[styles.text, { color: s.text }]}>{s.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
