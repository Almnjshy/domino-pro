import { TableTheme } from '../assets/TableBackground';

export interface GameTheme {
  id: string;
  name: string;
  nameAr: string;
  tableTheme: TableTheme;
  tileTheme: 'classic' | 'wood' | 'marble' | 'black';
  accentColor: string;
  preview: { primary: string; secondary: string };
}

export const GAME_THEMES: GameTheme[] = [
  {
    id: 'classic',
    name: 'Classic Green',
    nameAr: 'الأخضر الكلاسيكي',
    tableTheme: 'green-felt',
    tileTheme: 'classic',
    accentColor: '#d4af37',
    preview: { primary: '#0a5c2e', secondary: '#d4af37' },
  },
  {
    id: 'wooden',
    name: 'Royal Wood',
    nameAr: 'الخشب الملكي',
    tableTheme: 'classic-wood',
    tileTheme: 'wood',
    accentColor: '#d4af37',
    preview: { primary: '#6b4423', secondary: '#d4af37' },
  },
  {
    id: 'marble',
    name: 'Elegant Marble',
    nameAr: 'الرخام الأنيق',
    tableTheme: 'marble',
    tileTheme: 'marble',
    accentColor: '#8b7355',
    preview: { primary: '#e8e8e0', secondary: '#8b7355' },
  },
  {
    id: 'noir',
    name: 'Black Leather',
    nameAr: 'الجلد الأسود',
    tableTheme: 'leather',
    tileTheme: 'black',
    accentColor: '#ffd700',
    preview: { primary: '#1a1a1a', secondary: '#ffd700' },
  },
  {
    id: 'royal',
    name: 'Royal Blue',
    nameAr: 'الأزرق الملكي',
    tableTheme: 'royal-blue',
    tileTheme: 'classic',
    accentColor: '#c9a961',
    preview: { primary: '#1a2f5c', secondary: '#c9a961' },
  },
];

export const getThemeById = (id: string): GameTheme => {
  return GAME_THEMES.find(t => t.id === id) || GAME_THEMES[0];
};