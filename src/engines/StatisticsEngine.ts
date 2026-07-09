export interface GameStatistics {
  totalGames: number;
  totalRounds: number;
  totalPlayTime: number;
  firstPlayedAt: number | null;
  lastPlayedAt: number | null;
  wins: number;
  losses: number;
  currentWinStreak: number;
  bestWinStreak: number;
  winRate: number;
  totalPointsEarned: number;
  totalPointsConceded: number;
  bestRoundScore: number;
  averageRoundScore: number;
  highestTotalScore: number;
  totalTilesPlayed: number;
  totalDoublesPlayed: number;
  fastestWin: number | null;
  biggestWinMargin: number;
  gamesByMode: { classic: number; draw: number; block: number };
  winsByMode: { classic: number; draw: number; block: number };
  themeUsage: Record<string, number>;
  perfectGames: number;
  comebacks: number;
  blocksCaused: number;
  blocksSuffered: number;
  records: {
    longestSession: number;
    mostTilesInHand: number;
    shortestWin: number;
  };
}

export const DEFAULT_STATISTICS: GameStatistics = {
  totalGames: 0, totalRounds: 0, totalPlayTime: 0,
  firstPlayedAt: null, lastPlayedAt: null,
  wins: 0, losses: 0, currentWinStreak: 0, bestWinStreak: 0, winRate: 0,
  totalPointsEarned: 0, totalPointsConceded: 0,
  bestRoundScore: 0, averageRoundScore: 0, highestTotalScore: 0,
  totalTilesPlayed: 0, totalDoublesPlayed: 0,
  fastestWin: null, biggestWinMargin: 0,
  gamesByMode: { classic: 0, draw: 0, block: 0 },
  winsByMode: { classic: 0, draw: 0, block: 0 },
  themeUsage: {},
  perfectGames: 0, comebacks: 0, blocksCaused: 0, blocksSuffered: 0,
  records: { longestSession: 0, mostTilesInHand: 0, shortestWin: Infinity },
};

export interface RoundResult {
  winnerId: string;
  humanPlayerId: string;
  humanScore: number;
  roundPointsEarned: number;
  humanTilesRemaining: number;
  opponentTilesRemaining: number[];
  mode: 'classic' | 'draw' | 'block';
  themeId: string;
  turnCount: number;
  gameDuration: number;
  isBlock: boolean;
  tilesPlayedThisRound: number;
  doublesPlayedThisRound: number;
  humanTotalScore: number;
  wasBehind: boolean;
}

export class StatisticsEngine {
  static updateAfterRound(stats: GameStatistics, result: RoundResult): GameStatistics {
    const s = { ...stats };
    const now = Date.now();

    s.totalRounds++;
    s.totalPlayTime += result.gameDuration;
    s.lastPlayedAt = now;
    if (!s.firstPlayedAt) s.firstPlayedAt = now;

    s.gamesByMode[result.mode]++;
    s.themeUsage[result.themeId] = (s.themeUsage[result.themeId] || 0) + 1;
    s.totalTilesPlayed += result.tilesPlayedThisRound;
    s.totalDoublesPlayed += result.doublesPlayedThisRound;

    const humanWon = result.winnerId === result.humanPlayerId;

    if (humanWon) {
      s.wins++;
      s.winsByMode[result.mode]++;
      s.currentWinStreak++;
      s.bestWinStreak = Math.max(s.bestWinStreak, s.currentWinStreak);
      s.totalPointsEarned += result.roundPointsEarned;
      s.bestRoundScore = Math.max(s.bestRoundScore, result.roundPointsEarned);
      if (s.fastestWin === null || result.turnCount < s.fastestWin) s.fastestWin = result.turnCount;
      const durationSeconds = result.gameDuration / 1000;
      if (s.records.shortestWin === Infinity || durationSeconds < s.records.shortestWin) {
        s.records.shortestWin = durationSeconds;
      }
      const totalOpponentTiles = result.opponentTilesRemaining.reduce((a, b) => a + b, 0);
      s.biggestWinMargin = Math.max(s.biggestWinMargin, totalOpponentTiles - result.humanTilesRemaining);
      if (result.roundPointsEarned > 0 && result.humanTilesRemaining === 0) s.perfectGames++;
      if (result.wasBehind) s.comebacks++;
      if (result.isBlock) s.blocksCaused++;
    } else {
      s.losses++;
      s.currentWinStreak = 0;
      s.totalPointsConceded += result.roundPointsEarned;
      s.records.mostTilesInHand = Math.max(s.records.mostTilesInHand, result.humanTilesRemaining);
      if (result.isBlock) s.blocksSuffered++;
    }

    const totalDecided = s.wins + s.losses;
    s.winRate = totalDecided > 0 ? (s.wins / totalDecided) * 100 : 0;
    if (s.totalRounds > 0) s.averageRoundScore = s.totalPointsEarned / s.totalRounds;
    s.highestTotalScore = Math.max(s.highestTotalScore, result.humanTotalScore);
    s.records.longestSession = Math.max(s.records.longestSession, result.gameDuration);

    return s;
  }

  static updateOnGameStart(stats: GameStatistics): GameStatistics {
    return { ...stats, totalGames: stats.totalGames + 1 };
  }

  static reset(): GameStatistics {
    return { ...DEFAULT_STATISTICS };
  }

  static calculateLevel(stats: GameStatistics) {
    const xpFromWins = stats.wins * 100;
    const xpFromRounds = stats.totalRounds * 10;
    const xpFromStreak = stats.bestWinStreak * 50;
    const xpFromPerfect = stats.perfectGames * 200;
    const xpFromComebacks = stats.comebacks * 150;
    const totalXP = xpFromWins + xpFromRounds + xpFromStreak + xpFromPerfect + xpFromComebacks;

    const level = Math.floor(Math.sqrt(totalXP / 100)) + 1;
    const currentLevelXP = (level - 1) * (level - 1) * 100;
    const nextLevelXP = level * level * 100;
    const currentXP = totalXP - currentLevelXP;
    const progress = ((totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

    return {
      level, currentXP,
      nextLevelXP: nextLevelXP - currentLevelXP,
      progress: Math.min(100, Math.max(0, progress)),
    };
  }

  static calculateRank(level: number) {
    if (level >= 50) return { name: 'أسطورة', icon: '👑', color: '#ff00ff' };
    if (level >= 40) return { name: 'بطل خرافي', icon: '🏆', color: '#ffd700' };
    if (level >= 30) return { name: 'محترف', icon: '⭐', color: '#ff6b6b' };
    if (level >= 20) return { name: 'خبير', icon: '💎', color: '#4ecdc4' };
    if (level >= 15) return { name: 'متقدم', icon: '🎯', color: '#45b7d1' };
    if (level >= 10) return { name: 'متمرس', icon: '🔥', color: '#f9ca24' };
    if (level >= 5) return { name: 'لاعب جيد', icon: '🎲', color: '#a29bfe' };
    return { name: 'مبتدئ', icon: '🌱', color: '#55efc4' };
  }

  static formatPlayTime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) return `${hours}س ${minutes % 60}د`;
    if (minutes > 0) return `${minutes}د ${seconds % 60}ث`;
    return `${seconds}ث`;
  }
}