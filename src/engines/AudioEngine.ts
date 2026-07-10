import Sound from 'react-native-sound';

// Enable playback in silence mode (iOS)
Sound.setCategory('Playback');

type SoundId = 'button_click' | 'domino_place' | 'win' | 'lose' | 'draw' | 'music_classic' | 'music_modern';

interface SoundSettings {
  isMuted: boolean;
  musicVolume: number;
  sfxVolume: number;
  currentTrackId: string;
}

class AudioEngine {
  private sounds: Map<string, Sound> = new Map();
  private music: Sound | null = null;
  private settings: SoundSettings = {
    isMuted: false,
    musicVolume: 0.7,
    sfxVolume: 1.0,
    currentTrackId: 'music_classic',
  };

  init = async (): Promise<void> => {
    // Preload sound effects
    const soundFiles: Record<string, string> = {
      button_click: 'button_click.mp3',
      domino_place: 'domino_place.mp3',
      win: 'win.mp3',
      lose: 'lose.mp3',
      draw: 'draw.mp3',
    };

    for (const [id, file] of Object.entries(soundFiles)) {
      const sound = new Sound(file, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log(`Failed to load sound ${id}:`, error);
        }
      });
      this.sounds.set(id, sound);
    }
  };

  play = (soundId: SoundId): void => {
    if (this.settings.isMuted) return;
    
    const sound = this.sounds.get(soundId);
    if (sound) {
      sound.setVolume(this.settings.sfxVolume);
      sound.stop(() => {
        sound.play();
      });
    }
  };

  playMusic = async (trackId: string): Promise<void> => {
    if (this.settings.isMuted) return;
    
    this.stopMusic();
    
    const musicFile = `${trackId}.mp3`;
    this.music = new Sound(musicFile, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load music:', error);
        return;
      }
      this.music?.setNumberOfLoops(-1);
      this.music?.setVolume(this.settings.musicVolume);
      this.music?.play();
    });
    
    this.settings.currentTrackId = trackId;
  };

  stopMusic = (): void => {
    if (this.music) {
      this.music.stop();
      this.music.release();
      this.music = null;
    }
  };

  getSettings = (): SoundSettings => {
    return this.settings;
  };

  setSettings = (settings: Partial<SoundSettings>): void => {
    this.settings = { ...this.settings, ...settings };
    
    if (this.music) {
      this.music.setVolume(this.settings.musicVolume);
    }
    
    if (settings.isMuted && this.music) {
      this.stopMusic();
    }
  };

  dispose = (): void => {
    this.sounds.forEach((sound) => sound.release());
    this.sounds.clear();
    this.stopMusic();
  };
}

export const audio = new AudioEngine();