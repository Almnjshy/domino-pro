import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { usePerformanceMonitor } from '../hooks/useObjectPool';
import { getDominoPool } from '../engines/DominoPool';
import { getEffectsPool } from '../engines/EffectsPool';

interface PerformanceOverlayProps {
  visible?: boolean;
}

export const PerformanceOverlay: React.FC<PerformanceOverlayProps> = ({ visible = false }) => {
  const [expanded, setExpanded] = useState(false);
  const stats = usePerformanceMonitor();

  if (!visible || !stats) return null;

  const dominoStats = getDominoPool().getStats();
  const effectsStats = getEffectsPool().getStats();
  const fpsColor = stats.fps >= 55 ? '#4ecdc4' : stats.fps >= 30 ? '#f9ca24' : '#ff6b6b';

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.toggleBtn} onPress={() => setExpanded(!expanded)}>
        <Text style={[styles.fps, { color: fpsColor }]}>{stats.fps} FPS</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.details}>
          <Text style={styles.title}>📊 Performance Monitor</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Frame Time:</Text>
            <Text style={styles.value}>{stats.frameTime.toFixed(2)}ms</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 Domino Pool</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Pool Size:</Text>
              <Text style={styles.value}>{dominoStats.poolSize}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Active:</Text>
              <Text style={styles.value}>{dominoStats.currentActive}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Reuse Rate:</Text>
              <Text style={styles.value}>{dominoStats.reuseRate}%</Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✨ Effects Pool</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Pool Size:</Text>
              <Text style={styles.value}>{effectsStats.poolSize}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Active:</Text>
              <Text style={styles.value}>{effectsStats.currentActive}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: 'absolute', top: 50, right: 10, zIndex: 9999 },
  toggleBtn: {
    backgroundColor: 'rgba(0,0,0,0.8)', paddingHorizontal: 12,
    paddingVertical: 6, borderRadius: 8, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  fps: { fontSize: 14, fontWeight: 'bold' },
  details: {
    marginTop: 8, backgroundColor: 'rgba(0,0,0,0.9)', borderRadius: 12,
    padding: 12, minWidth: 200, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  title: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  section: { marginTop: 12, paddingTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  sectionTitle: { color: '#d4af37', fontSize: 12, fontWeight: '600', marginBottom: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  label: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
  value: { color: '#fff', fontSize: 11, fontWeight: '600' },
});