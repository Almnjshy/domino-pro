import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useAudio } from '../hooks/useAudio';
import { MenuBackground } from '../assets/MenuBackground';
import { MUSIC_TRACKS } from '../engines/SoundDefinitions';
import { audio } from '../engines/AudioEngine';

interface SettingsScreenProps { onBack: () => void; }

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const { settings, toggleMute, setMasterVolume, setSfxVolume, setMusicVolume, changeMusic } = useAudio();

  return (
    <View style={styles.container}>
      <MenuBackground />
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backText}>← رجوع</Text>
          </TouchableOpacity>
          <Text style={styles.title}>الإعدادات</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.row}>
            <Text style={styles.label}>كتم الصوت</Text>
            <Switch
              value={settings.isMuted}
              onValueChange={toggleMute}
              trackColor={{ true: '#d4af37', false: '#555' }}
              thumbColor="#fff"
            />
          </View>

          <SliderRow label="الصوت الرئيسي" value={settings.masterVolume}
            onChange={setMasterVolume} color="#d4af37" />
          <SliderRow label="المؤثرات الصوتية" value={settings.sfxVolume}
            onChange={setSfxVolume} color="#4CAF50" />
          <SliderRow label="الموسيقى" value={settings.musicVolume}
            onChange={setMusicVolume} color="#2196F3" />

          <View style={styles.section}>
            <Text style={styles.label}>المقطوعة الموسيقية</Text>
            {MUSIC_TRACKS.map(track => (
              <TouchableOpacity
                key={track.id}
                style={[styles.trackBtn, settings.currentTrackId === track.id && styles.trackActive]}
                onPress={() => changeMusic(track.id)}
              >
                <Text style={[styles.trackText, settings.currentTrackId === track.id && styles.trackTextActive]}>
                  {track.nameAr}
                </Text>
                {settings.currentTrackId === track.id && <Text style={styles.playingIcon}>♫</Text>}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>اختبار الأصوات</Text>
            <View style={styles.testRow}>
              {[
                { id: 'tile_place', label: 'وضع قطعة' },
                { id: 'tile_draw', label: 'سحب' },
                { id: 'turn_notify', label: 'الدور' },
                { id: 'win', label: 'فوز' },
                { id: 'lose', label: 'خسارة' },
              ].map(s => (
                <TouchableOpacity
                  key={s.id}
                  style={styles.testBtn}
                  onPress={() => audio.play(s.id)}
                >
                  <Text style={styles.testText}>{s.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const SliderRow: React.FC<{
  label: string; value: number; onChange: (v: number) => void; color: string;
}> = ({ label, value, onChange, color }) => (
  <View style={styles.sliderRow}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.sliderContainer}>
      <View style={styles.sliderTrack}>
        <View style={[styles.sliderFill, { width: `${value * 100}%`, backgroundColor: color }]} />
      </View>
    </View>
    <Text style={[styles.value, { color }]}>{Math.round(value * 100)}%</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 50, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backBtn: { padding: 8 },
  backText: { color: '#d4af37', fontSize: 16, fontWeight: '600' },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  content: { padding: 24 },
  row: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  sliderRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  label: { color: '#fff', fontSize: 16, fontWeight: '600', minWidth: 140 },
  sliderContainer: { flex: 1, marginHorizontal: 12 },
  sliderTrack: { height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, overflow: 'hidden' },
  sliderFill: { height: '100%' },
  value: { fontSize: 14, fontWeight: 'bold', width: 45, textAlign: 'right' },
  section: { marginTop: 24 },
  trackBtn: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 14, paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10,
    marginBottom: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  trackActive: { backgroundColor: 'rgba(212,175,55,0.2)', borderColor: '#d4af37' },
  trackText: { color: '#fff', fontSize: 15 },
  trackTextActive: { color: '#ffd700', fontWeight: '600' },
  playingIcon: { color: '#d4af37', fontSize: 18 },
  testRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  testBtn: {
    paddingVertical: 10, paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  testText: { color: '#fff', fontSize: 13 },
});