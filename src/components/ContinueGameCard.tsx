import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { useSave } from '../hooks/useSave';
import { audio } from '../engines/AudioEngine';

interface ContinueGameCardProps {
  onContinue: (state: any, config: any) => void;
  onDiscard: () => void;
}

export const ContinueGameCard: React.FC<ContinueGameCardProps> = ({ onContinue, onDiscard }) => {
  const { hasSave, isLoading, metadata, resume, deleteSave } = useSave();
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (hasSave) {
      scale.value = withTiming(1, { duration: 500, easing: Easing.bezier(0.34, 1.56, 0.64, 1) });
      opacity.value = withTiming(1, { duration: 400 });
    }
  }, [hasSave]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!hasSave || !metadata) return null;

  const handleContinue = async () => {
    audio.play('button_click');
    const result = await resume();
    if (result) onContinue(result.state, result.config);
  };

  const handleDiscard = async () => {
    audio.play('button_click');
    await deleteSave();
    onDiscard();
  };

  const formatTimeAgo = (timestamp: number): string => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    if (days < 7) return `منذ ${days} يوم`;
    return new Date(timestamp).toLocaleDateString('ar');
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>💾</Text>
        <Text style={styles.headerTitle}>لعبة محفوظة</Text>
      </View>
      <View style={styles.infoGrid}>
        <InfoItem label="الجولة" value={`${metadata.roundNumber}`} />
        <InfoItem label="النقاط" value={`${metadata.humanPlayerScore}`} />
        <InfoItem label="القطع" value={`${metadata.humanTilesRemaining}`} />
        <InfoItem label="الحفظ" value={formatTimeAgo(metadata.timestamp)} />
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#000" /> : <Text style={styles.continueText}>▶ استئناف</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.discardBtn} onPress={handleDiscard} disabled={isLoading}>
          <Text style={styles.discardText}>حذف</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoValue}>{value}</Text>
    <Text style={styles.infoLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)', borderRadius: 20, padding: 20,
    marginHorizontal: 24, marginTop: 20, borderWidth: 1.5, borderColor: '#d4af37',
    shadowColor: '#ffd700', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 8,
  },
  header: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 16,
    paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(212, 175, 55, 0.3)',
  },
  headerIcon: { fontSize: 24, marginRight: 10 },
  headerTitle: { color: '#ffd700', fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },
  infoGrid: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  infoItem: { alignItems: 'center' },
  infoValue: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 2 },
  infoLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11 },
  buttons: { flexDirection: 'row', gap: 10 },
  continueBtn: {
    flex: 2, backgroundColor: '#d4af37', paddingVertical: 14,
    borderRadius: 12, alignItems: 'center', justifyContent: 'center',
  },
  continueText: { color: '#000', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  discardBtn: {
    flex: 1, backgroundColor: 'rgba(255, 107, 107, 0.15)', paddingVertical: 14,
    borderRadius: 12, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255, 107, 107, 0.4)',
  },
  discardText: { color: '#ff6b6b', fontSize: 14, fontWeight: '600' },
});