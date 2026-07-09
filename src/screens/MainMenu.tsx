import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MenuBackground } from '../assets/MenuBackground';
import { ContinueGameCard } from '../components/ContinueGameCard';
import { audio } from '../engines/AudioEngine';

interface MainMenuProps {
  onStartGame: (playerCount: number, mode: 'classic' | 'draw' | 'block', themeId: string) => void;
  onSettings: () => void;
  onStatistics: () => void;
  onContinueGame: (state: any, config: any) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame, onSettings, onStatistics, onContinueGame
}) => {
  const [playerCount, setPlayerCount] = useState(2);
  const [mode, setMode] = useState<'classic' | 'draw' | 'block'>('classic');
  const [themeId, setThemeId] = useState('classic');

  return (
    <View style={styles.container}>
      <MenuBackground />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>🎲 الدومينو</Text>
        <Text style={styles.subtitle}>PROFESSIONAL EDITION</Text>

        <ContinueGameCard onContinue={onContinueGame} onDiscard={() => {}} />

        <View style={styles.section}>
          <Text style={styles.label}>عدد اللاعبين</Text>
          <View style={styles.optionsRow}>
            {[2, 3, 4].map(n => (
              <TouchableOpacity
                key={n}
                style={[styles.optionBtn, playerCount === n && styles.optionActive]}
                onPress={() => { setPlayerCount(n); audio.play('button_click'); }}
              >
                <Text style={[styles.optionText, playerCount === n && styles.optionTextActive]}>
                  {n}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>نمط اللعب</Text>
          <View style={styles.optionsRow}>
            {[
              { key: 'classic', label: 'كلاسيكي' },
              { key: 'draw', label: 'سحب' },
              { key: 'block', label: 'إغلاق' },
            ].map(m => (
              <TouchableOpacity
                key={m.key}
                style={[styles.optionBtn, mode === m.key && styles.optionActive]}
                onPress={() => { setMode(m.key as any); audio.play('button_click'); }}
              >
                <Text style={[styles.optionText, mode === m.key && styles.optionTextActive]}>
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => { audio.play('button_click'); onStartGame(playerCount, mode, themeId); }}
        >
          <Text style={styles.startText}>▶ ابدأ المباراة</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => { audio.play('button_click'); onStatistics(); }}
        >
          <Text style={styles.secondaryText}>📊 الإحصائيات</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => { audio.play('button_click'); onSettings(); }}
        >
          <Text style={styles.secondaryText}>⚙ الإعدادات</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingTop: 80 },
  title: {
    fontSize: 52, fontWeight: 'bold', color: '#ffd700', textAlign: 'center',
    textShadowColor: '#000', textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6, marginBottom: 4,
  },
  subtitle: {
    fontSize: 14, color: '#d4af37', textAlign: 'center',
    marginBottom: 40, letterSpacing: 4, fontWeight: '600',
  },
  section: { marginBottom: 24 },
  label: { color: '#fff', fontSize: 16, marginBottom: 12, fontWeight: '600', letterSpacing: 1 },
  optionsRow: { flexDirection: 'row', gap: 10 },
  optionBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  optionActive: { backgroundColor: 'rgba(212,175,55,0.25)', borderColor: '#d4af37' },
  optionText: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: '600' },
  optionTextActive: { color: '#ffd700' },
  startBtn: {
    marginTop: 32, backgroundColor: '#d4af37', paddingVertical: 18,
    borderRadius: 30, alignItems: 'center',
    shadowColor: '#ffd700', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5, shadowRadius: 10, elevation: 12,
  },
  startText: { color: '#000', fontSize: 20, fontWeight: 'bold', letterSpacing: 1 },
  secondaryBtn: {
    marginTop: 12, paddingVertical: 14, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  secondaryText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});