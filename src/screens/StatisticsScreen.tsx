import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MenuBackground } from '../assets/MenuBackground';
import { StatCard } from '../components/StatCard';
import { ProgressBar } from '../components/ProgressBar';
import { MedalBadge } from '../components/MedalBadge';
import { useStatistics } from '../hooks/useStatistics';
import { StatisticsEngine } from '../engines/StatisticsEngine';
import { audio } from '../engines/AudioEngine';

interface StatisticsScreenProps { onBack: () => void; }

export const StatisticsScreen: React.FC<StatisticsScreenProps> = ({ onBack }) => {
  const { stats, levelInfo, rank, resetStats } = useStatistics();
  const [activeTab, setActiveTab] = useState<'overview' | 'records' | 'modes'>('overview');

  const handleReset = () => {
    Alert.alert('إعادة تعيين الإحصائيات', 'سيتم حذف جميع إحصائياتك نهائياً. هل أنت متأكد؟', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'حذف', style: 'destructive', onPress: async () => { await resetStats(); audio.play('button_click'); } },
    ]);
  };

  return (
    <View style={styles.container}>
      <MenuBackground />
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backText}>← رجوع</Text>
          </TouchableOpacity>
          <Text style={styles.title}>الإحصائيات</Text>
          <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
            <Text style={styles.resetText}>🗑</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.levelCard}>
            <MedalBadge icon={rank.icon} name={rank.name} color={rank.color} level={levelInfo.level} />
            <View style={styles.xpContainer}>
              <ProgressBar
                value={levelInfo.progress}
                label={`XP: ${levelInfo.currentXP} / ${levelInfo.nextLevelXP}`}
                color={rank.color} height={8} showPercentage={false}
              />
            </View>
          </View>

          <View style={styles.tabs}>
            {[
              { id: 'overview', label: 'نظرة عامة' },
              { id: 'records', label: 'الأرقام القياسية' },
              { id: 'modes', label: 'الأنماط' },
            ].map(tab => (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tab, activeTab === tab.id && styles.tabActive]}
                onPress={() => { setActiveTab(tab.id as any); audio.play('button_click'); }}
              >
                <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>{tab.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {activeTab === 'overview' && (
            <View style={styles.tabContent}>
              <View style={styles.cardsRow}>
                <StatCard icon="🎮" label="مباريات" value={stats.totalGames} delay={0} />
                <StatCard icon="🔄" label="جولات" value={stats.totalRounds} delay={100} />
                <StatCard icon="⏱" label="وقت اللعب"
                  value={StatisticsEngine.formatPlayTime(stats.totalPlayTime)} delay={200} />
              </View>
              <View style={styles.cardsRow}>
                <StatCard icon="🏆" label="انتصارات" value={stats.wins} color="#4ecdc4" delay={300} />
                <StatCard icon="💔" label="خسائر" value={stats.losses} color="#ff6b6b" delay={400} />
                <StatCard icon="📊" label="نسبة الفوز"
                  value={`${stats.winRate.toFixed(1)}%`} color="#ffd700" delay={500} />
              </View>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>سلسلة الانتصارات</Text>
                <ProgressBar
                  value={(stats.currentWinStreak / Math.max(stats.bestWinStreak, 1)) * 100}
                  label={`الحالية: ${stats.currentWinStreak} | الأفضل: ${stats.bestWinStreak}`}
                  color="#ffd700" delay={600}
                />
              </View>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>النقاط</Text>
                <View style={styles.cardsRow}>
                  <StatCard icon="⭐" label="مكتسبة" value={stats.totalPointsEarned} color="#4ecdc4" delay={700} />
                  <StatCard icon="💫" label="أفضل جولة" value={stats.bestRoundScore} color="#ffd700" delay={800} />
                  <StatCard icon="📈" label="المجموع الأعلى" value={stats.highestTotalScore} color="#f9ca24" delay={900} />
                </View>
              </View>
            </View>
          )}

          {activeTab === 'records' && (
            <View style={styles.tabContent}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🏅 الأرقام القياسية</Text>
                <RecordRow icon="⚡" label="أسرع فوز (بالأدوار)"
                  value={stats.fastestWin !== null ? `${stats.fastestWin} دور` : '—'} />
                <RecordRow icon="⏱" label="أسرع فوز (بالوقت)"
                  value={stats.records.shortestWin !== Infinity ? `${Math.round(stats.records.shortestWin)}ث` : '—'} />
                <RecordRow icon="🎯" label="أكبر فرق نقاط" value={`${stats.biggestWinMargin} نقطة`} />
                <RecordRow icon="🔥" label="أفضل سلسلة انتصارات" value={`${stats.bestWinStreak}`} />
                <RecordRow icon="⏳" label="أطول جلسة لعب"
                  value={StatisticsEngine.formatPlayTime(stats.records.longestSession)} />
              </View>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>✨ إنجازات خاصة</Text>
                <View style={styles.cardsRow}>
                  <StatCard icon="💎" label="فوز مثالي" value={stats.perfectGames} color="#4ecdc4" delay={0} />
                  <StatCard icon="🔥" label="عادات" value={stats.comebacks} color="#ff6b6b" delay={100} />
                </View>
                <View style={styles.cardsRow}>
                  <StatCard icon="🚧" label="إغلاق سببته" value={stats.blocksCaused} color="#f9ca24" delay={200} />
                  <StatCard icon="🛡" label="إغلاق وقع عليك" value={stats.blocksSuffered} color="#a29bfe" delay={300} />
                </View>
              </View>
            </View>
          )}

          {activeTab === 'modes' && (
            <View style={styles.tabContent}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>📊 المباريات حسب النمط</Text>
                <ProgressBar
                  value={stats.totalGames > 0 ? (stats.gamesByMode.classic / stats.totalGames) * 100 : 0}
                  label={`كلاسيكي: ${stats.gamesByMode.classic}`} color="#4ecdc4" delay={0}
                />
                <ProgressBar
                  value={stats.totalGames > 0 ? (stats.gamesByMode.draw / stats.totalGames) * 100 : 0}
                  label={`سحب: ${stats.gamesByMode.draw}`} color="#f9ca24" delay={100}
                />
                <ProgressBar
                  value={stats.totalGames > 0 ? (stats.gamesByMode.block / stats.totalGames) * 100 : 0}
                  label={`إغلاق: ${stats.gamesByMode.block}`} color="#ff6b6b" delay={200}
                />
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const RecordRow: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => (
  <View style={styles.recordRow}>
    <Text style={styles.recordIcon}>{icon}</Text>
    <View style={styles.recordInfo}>
      <Text style={styles.recordLabel}>{label}</Text>
      <Text style={styles.recordValue}>{value}</Text>
    </View>
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
  resetBtn: { padding: 8 },
  resetText: { fontSize: 20 },
  content: { padding: 20 },
  levelCard: {
    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20,
    padding: 20, marginBottom: 20, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center',
  },
  xpContainer: { width: '100%', marginTop: 16 },
  tabs: {
    flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12, padding: 4, marginBottom: 20,
  },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  tabActive: { backgroundColor: 'rgba(212,175,55,0.2)' },
  tabText: { color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: '600' },
  tabTextActive: { color: '#ffd700' },
  tabContent: {},
  section: { marginTop: 20 },
  sectionTitle: { color: '#d4af37', fontSize: 14, fontWeight: '600', letterSpacing: 1, marginBottom: 12 },
  cardsRow: { flexDirection: 'row', marginBottom: 8, gap: 8 },
  recordRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12,
    padding: 14, marginBottom: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  recordIcon: { fontSize: 28, marginRight: 14 },
  recordInfo: { flex: 1 },
  recordLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 2 },
  recordValue: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});