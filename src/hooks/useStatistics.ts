import { useEffect, useState, useCallback } from 'react';
import { statisticsManager } from '../managers/StatisticsManager';
import { GameStatistics } from '../engines/StatisticsEngine';

export const useStatistics = () => {
  const [stats, setStats] = useState<GameStatistics>(statisticsManager.getStats());
  const [levelInfo, setLevelInfo] = useState(statisticsManager.getLevel());
  const [rank, setRank] = useState(statisticsManager.getRank());

  useEffect(() => {
    const unsubscribe = statisticsManager.subscribe((newStats) => {
      setStats({ ...newStats });
      setLevelInfo(statisticsManager.getLevel());
      setRank(statisticsManager.getRank());
    });
    return unsubscribe;
  }, []);

  const resetStats = useCallback(async () => { await statisticsManager.reset(); }, []);

  return { stats, levelInfo, rank, resetStats };
};