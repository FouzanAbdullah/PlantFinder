import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { HealthBadge } from './HealthBadge';
import type { PlantAnalysis } from '../types';

interface Props {
  photoUri: string;
  analysis: PlantAnalysis;
  actionLabel?: string;
  onAction?: () => void;
  actionLoading?: boolean;
  extraAction?: React.ReactNode;
}

export function PlantAnalysisView({
  photoUri,
  analysis,
  actionLabel,
  onAction,
  actionLoading,
  extraAction,
}: Props) {
  const { identification: id, health, careTips, toxicity } = analysis;
  const commonName = id.commonNames[0] ?? null;
  const isDying = health.status === 'dying' || health.status === 'dead' || health.status === 'stressed';

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Image source={{ uri: photoUri }} style={styles.photo} resizeMode="cover" />

      {/* Identification */}
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.flex}>
            <Text style={styles.scientificName}>{id.name}</Text>
            {commonName && <Text style={styles.commonName}>{commonName}</Text>}
            <Text style={styles.family}>Family: {id.family}</Text>
          </View>
          <View style={styles.confidencePill}>
            <Text style={styles.confidenceText}>{id.confidence}%</Text>
            <Text style={styles.confidenceLabel}>match</Text>
          </View>
        </View>
      </View>

      {/* Health */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Plant Health</Text>
        <HealthBadge status={health.status} />
        {health.issues.length > 0 && (
          <View style={styles.issueList}>
            {health.issues.map((issue, i) => (
              <View key={i} style={styles.issueRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.issueText}>{issue}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Toxicity warning */}
      {toxicity && (
        <View style={[styles.card, styles.toxicCard]}>
          <Text style={styles.toxicTitle}>Toxicity Warning</Text>
          <Text style={styles.toxicText}>{toxicity}</Text>
        </View>
      )}

      {/* Revival tips */}
      {isDying && careTips.revival.length > 0 && (
        <View style={[styles.card, styles.revivalCard]}>
          <Text style={styles.sectionTitle}>Revival Steps</Text>
          {careTips.revival.map((step, i) => (
            <View key={i} style={styles.numberedRow}>
              <Text style={styles.stepNumber}>{i + 1}</Text>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Care guide */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Care Guide</Text>
        <CareRow icon="💧" label="Watering" value={careTips.watering} />
        <CareRow icon="☀️" label="Sunlight" value={careTips.sunlight} />
        <CareRow icon="🪴" label="Soil" value={careTips.soil} />
        {careTips.generalTips.length > 0 && (
          <>
            <Text style={styles.subTitle}>Tips</Text>
            {careTips.generalTips.map((tip, i) => (
              <View key={i} style={styles.issueRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.issueText}>{tip}</Text>
              </View>
            ))}
          </>
        )}
      </View>

      {extraAction}

      {actionLabel && onAction && (
        <TouchableOpacity
          style={[styles.actionBtn, actionLoading && styles.actionBtnDisabled]}
          onPress={onAction}
          disabled={actionLoading}
        >
          <Text style={styles.actionBtnText}>
            {actionLoading ? 'Saving...' : actionLabel}
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.bottomPad} />
    </ScrollView>
  );
}

function CareRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.careRow}>
      <Text style={styles.careIcon}>{icon}</Text>
      <View style={styles.flex}>
        <Text style={styles.careLabel}>{label}</Text>
        <Text style={styles.careValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#F0FAF4' },
  content: { paddingBottom: 32 },
  photo: { width: '100%', height: 280 },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  flex: { flex: 1 },
  scientificName: { fontSize: 18, fontWeight: '700', color: '#1B4332', fontStyle: 'italic' },
  commonName: { fontSize: 15, color: '#2D6A4F', marginTop: 2 },
  family: { fontSize: 13, color: '#888', marginTop: 4 },
  confidencePill: {
    backgroundColor: '#D8F3DC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    marginLeft: 12,
  },
  confidenceText: { fontSize: 20, fontWeight: '800', color: '#1B4332' },
  confidenceLabel: { fontSize: 11, color: '#2D6A4F' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1B4332', marginBottom: 10 },
  subTitle: { fontSize: 14, fontWeight: '600', color: '#2D6A4F', marginTop: 12, marginBottom: 6 },
  issueList: { marginTop: 10 },
  issueRow: { flexDirection: 'row', marginTop: 4 },
  bullet: { color: '#40916C', fontSize: 16, marginRight: 6 },
  issueText: { flex: 1, fontSize: 14, color: '#444', lineHeight: 20 },
  toxicCard: { borderLeftWidth: 4, borderLeftColor: '#E76F51' },
  toxicTitle: { fontSize: 15, fontWeight: '700', color: '#C1440E', marginBottom: 6 },
  toxicText: { fontSize: 14, color: '#444', lineHeight: 20 },
  revivalCard: { borderLeftWidth: 4, borderLeftColor: '#F4A261' },
  numberedRow: { flexDirection: 'row', marginTop: 8, alignItems: 'flex-start' },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F4A261',
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 10,
  },
  stepText: { flex: 1, fontSize: 14, color: '#444', lineHeight: 20 },
  careRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 10 },
  careIcon: { fontSize: 22, marginRight: 10, marginTop: 2 },
  careLabel: { fontSize: 13, fontWeight: '600', color: '#2D6A4F' },
  careValue: { fontSize: 14, color: '#444', lineHeight: 20, marginTop: 2 },
  actionBtn: {
    backgroundColor: '#2D6A4F',
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  actionBtnDisabled: { opacity: 0.6 },
  actionBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  bottomPad: { height: 20 },
});
