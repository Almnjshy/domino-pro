import { useEffect, useState, useCallback, useRef } from 'react';
import { saveManager, SaveConfig, SaveManagerState } from '../managers/SaveManager';
import { GameState } from '../core/types';

export const useSave = () => {
  const [state, setState] = useState<SaveManagerState>(saveManager.getState());

  useEffect(() => {
    const unsubscribe = saveManager.subscribe((newState) => {
      setState({ ...newState });
    });
    return unsubscribe;
  }, []);

  const save = useCallback((gameState: GameState, config: SaveConfig) => {
    return saveManager.save(gameState, config);
  }, []);

  const resume = useCallback(() => saveManager.resume(), []);
  const deleteSave = useCallback(() => saveManager.delete(), []);

  return { ...state, save, resume, deleteSave };
};

export const useAutoSave = (
  getState: () => GameState | null,
  getConfig: () => SaveConfig | null
) => {
  const stateRef = useRef(getState);
  const configRef = useRef(getConfig);

  useEffect(() => {
    stateRef.current = getState;
    configRef.current = getConfig;
  }, [getState, getConfig]);

  useEffect(() => {
    saveManager.startAutoSave(
      () => stateRef.current()!,
      () => configRef.current()!
    );
    return () => { saveManager.stopAutoSave(); };
  }, []);
};