import { useEffect, useState, useCallback } from 'react';
import { audio, AudioSettings } from '../engines/AudioEngine';

export const useAudio = () => {
  const [settings, setSettings] = useState<AudioSettings>(audio.getSettings());

  useEffect(() => {
    const unsubscribe = audio.subscribe((newSettings) => {
      setSettings({ ...newSettings });
    });
    return unsubscribe;
  }, []);

  const play = useCallback((soundId: string, options?: any) => {
    audio.play(soundId, options);
  }, []);

  const toggleMute = useCallback(() => { audio.toggleMute(); }, []);
  const setMasterVolume = useCallback((v: number) => { audio.updateSettings({ masterVolume: v }); }, []);
  const setSfxVolume = useCallback((v: number) => { audio.updateSettings({ sfxVolume: v }); }, []);
  const setMusicVolume = useCallback((v: number) => { audio.updateSettings({ musicVolume: v }); }, []);
  const changeMusic = useCallback((trackId: string) => { audio.playMusic(trackId); }, []);

  return { settings, play, toggleMute, setMasterVolume, setSfxVolume, setMusicVolume, changeMusic };
};

export const useGameAudio = () => {
  const { play } = useAudio();
  return {
    onTilePlace: () => play('tile_place'),
    onTileSlide: () => play('tile_slide'),
    onTileDraw: () => play('tile_draw'),
    onTileSelect: () => play('tile_select'),
    onTurnNotify: () => play('turn_notify'),
    onWin: () => play('win'),
    onLose: () => play('lose'),
    onBlock: () => play('block'),
    onButtonClick: () => play('button_click'),
  };
};