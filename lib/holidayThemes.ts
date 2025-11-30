export type HolidayType = 'christmas' | 'newyear' | 'easter' | 'summer' | 'other';

export interface HolidayTheme {
  type: HolidayType;
  icon: string;
  title: { el: string; en: string };
  subtitle: { el: string; en: string };
  description: { el: string; en: string };
  colors: {
    gradient: string;
    border: string;
    badge: string;
    badgeText: string;
    card: string;
    cardBorder: string;
    itemBg: string;
    itemBorder: string;
    text: string;
    accent: string;
    glow: string;
    pattern: string;
  };
}

export const HOLIDAY_THEMES: Record<HolidayType, HolidayTheme> = {
  christmas: {
    type: 'christmas',
    icon: '/christmas-tree.png',
    title: { el: 'Χριστουγεννιάτικο Ωράριο', en: 'Christmas Schedule' },
    subtitle: { el: 'Ειδικές ώρες λειτουργίας', en: 'Special operating hours' },
    description: { el: 'Ατμόσφαιρα champagne με navy & χρυσές λάμψεις.', en: 'Champagne atmosphere with navy & golden sparkles.' },
    colors: {
      gradient: 'from-[#7B1E28] via-[#351C29] to-[#0F4E45]',
      border: '#bc4749',
      badge: 'linear-gradient(135deg, #bc4749, #a03d3f)',
      badgeText: '#ffffff',
      card: 'rgba(255,255,255,0.95)',
      cardBorder: '#bc4749',
      itemBg: 'rgba(188,71,73,0.08)',
      itemBorder: '#bc4749',
      text: '#1e293b',
      accent: '#bc4749',
      glow: '0 20px 45px rgba(188,71,73,0.35)',
      pattern: 'rgba(188,71,73,0.1)',
    },
  },
  newyear: {
    type: 'newyear',
    icon: '/decoration.png',
    title: { el: 'Πρωτοχρονιάτικο Ωράριο', en: 'New Year Schedule' },
    subtitle: { el: 'Ειδικές ώρες λειτουργίας', en: 'Special operating hours' },
    description: { el: 'Γιορτάστε τη νέα χρονιά μαζί μας!', en: 'Celebrate the new year with us!' },
    colors: {
      gradient: 'from-[#0F172A] via-[#1F2937] to-[#C084FC]',
      border: '#fbbf24',
      badge: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
      badgeText: '#1e293b',
      card: 'rgba(255,255,255,0.95)',
      cardBorder: '#fde68a',
      itemBg: 'rgba(251,191,36,0.08)',
      itemBorder: '#fcd34d',
      text: '#1e293b',
      accent: '#fbbf24',
      glow: '0 20px 45px rgba(251,191,36,0.35)',
      pattern: 'rgba(251,191,36,0.1)',
    },
  },
  easter: {
    type: 'easter',
    icon: '/easter.png',
    title: { el: 'Πασχαλινό Ωράριο', en: 'Easter Schedule' },
    subtitle: { el: 'Ειδικές ώρες λειτουργίας', en: 'Special operating hours' },
    description: { el: 'Χρόνια πολλά με ανοιξιάτικα χρώματα!', en: 'Happy Easter with spring colors!' },
    colors: {
      gradient: 'from-[#F9A8D4] via-[#FDF2F8] to-[#6EE7B7]',
      border: '#cbf4c6',
      badge: 'linear-gradient(135deg, #cbf4c6, #b8e8b0)',
      badgeText: '#1e293b',
      card: 'rgba(255,255,255,0.95)',
      cardBorder: '#cbf4c6',
      itemBg: 'rgba(203,244,198,0.08)',
      itemBorder: '#cbf4c6',
      text: '#1e293b',
      accent: '#cbf4c6',
      glow: '0 20px 45px rgba(203,244,198,0.25)',
      pattern: 'rgba(203,244,198,0.1)',
    },
  },
  summer: {
    type: 'summer',
    icon: '/resort.png',
    title: { el: 'Θερινό Ωράριο', en: 'Summer Schedule' },
    subtitle: { el: 'Ειδικές ώρες λειτουργίας', en: 'Special operating hours' },
    description: { el: 'Καλοκαιρινές διακοπές και ειδικό πρόγραμμα', en: 'Summer vacation and special schedule' },
    colors: {
      gradient: 'from-[#0EA5E9] via-[#06B6D4] to-[#14B8A6]',
      border: '#06b6d4',
      badge: 'linear-gradient(135deg, #06b6d4, #0ea5e9)',
      badgeText: '#ffffff',
      card: 'rgba(255,255,255,0.95)',
      cardBorder: '#67e8f9',
      itemBg: 'rgba(6,182,212,0.08)',
      itemBorder: '#67e8f9',
      text: '#1e293b',
      accent: '#06b6d4',
      glow: '0 20px 45px rgba(6,182,212,0.35)',
      pattern: 'rgba(6,182,212,0.1)',
    },
  },
  other: {
    type: 'other',
    icon: '📅',
    title: { el: 'Ειδικό Ωράριο', en: 'Special Schedule' },
    subtitle: { el: 'Ειδικές ώρες λειτουργίας', en: 'Special operating hours' },
    description: { el: 'Ειδικό ωράριο λειτουργίας', en: 'Special operating schedule' },
    colors: {
      gradient: 'from-[#581C87] via-[#312E81] to-[#9D174D]',
      border: '#a78bfa',
      badge: 'linear-gradient(135deg, #a78bfa, #8b5cf6)',
      badgeText: '#ffffff',
      card: 'rgba(255,255,255,0.95)',
      cardBorder: '#c4b5fd',
      itemBg: 'rgba(167,139,250,0.08)',
      itemBorder: '#c4b5fd',
      text: '#1e293b',
      accent: '#a78bfa',
      glow: '0 20px 45px rgba(167,139,250,0.35)',
      pattern: 'rgba(167,139,250,0.1)',
    },
  },
};

export const getHolidayTheme = (type: HolidayType = 'christmas'): HolidayTheme => {
  return HOLIDAY_THEMES[type] ?? HOLIDAY_THEMES.christmas;
};
