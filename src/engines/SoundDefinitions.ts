export type SoundCategory = 'sfx' | 'music' | 'ambient';

export interface SoundDefinition {
  id: string;
  file: any;
  category: SoundCategory;
  volume: number;
  loop: boolean;
  priority: number;
  maxInstances: number;
}

// ملاحظة: استبدل المسارات بملفات صوتية حقيقية
// أو استخدم require وهمي للتطوير الأولي
const PLACEHOLDER = { uri: '' };

export const SOUNDS: Record<string, SoundDefinition> = {
  tile_place: {
    id: 'tile_place', file: PLACEHOLDER, category: 'sfx',
    volume: 0.8, loop: false, priority: 7, maxInstances: 3,
  },
  tile_slide: {
    id: 'tile_slide', file: PLACEHOLDER, category: 'sfx',
    volume: 0.5, loop: false, priority: 4, maxInstances: 2,
  },
  tile_draw: {
    id: 'tile_draw', file: PLACEHOLDER, category: 'sfx',
    volume: 0.7, loop: false, priority: 5, maxInstances: 2,
  },
  tile_select: {
    id: 'tile_select', file: PLACEHOLDER, category: 'sfx',
    volume: 0.4, loop: false, priority: 3, maxInstances: 2,
  },
  turn_notify: {
    id: 'turn_notify', file: PLACEHOLDER, category: 'sfx',
    volume: 0.6, loop: false, priority: 6, maxInstances: 1,
  },
  win: {
    id: 'win', file: PLACEHOLDER, category: 'sfx',
    volume: 0.9, loop: false, priority: 10, maxInstances: 1,
  },
  lose: {
    id: 'lose', file: PLACEHOLDER, category: 'sfx',
    volume: 0.7, loop: false, priority: 9, maxInstances: 1,
  },
  block: {
    id: 'block', file: PLACEHOLDER, category: 'sfx',
    volume: 0.75, loop: false, priority: 8, maxInstances: 1,
  },
  button_click: {
    id: 'button_click', file: PLACEHOLDER, category: 'sfx',
    volume: 0.5, loop: false, priority: 2, maxInstances: 3,
  },
  bg_menu: {
    id: 'bg_menu', file: PLACEHOLDER, category: 'music',
    volume: 0.3, loop: true, priority: 1, maxInstances: 1,
  },
  bg_game: {
    id: 'bg_game', file: PLACEHOLDER, category: 'music',
    volume: 0.25, loop: true, priority: 1, maxInstances: 1,
  },
};

export const MUSIC_TRACKS = [
  { id: 'none', nameAr: 'بدون موسيقى' },
  { id: 'bg_menu', nameAr: 'كلاسيكي هادئ' },
  { id: 'bg_game', nameAr: 'بيانو أنيق' },
];