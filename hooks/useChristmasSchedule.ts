import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface HolidaySchedule {
  id?: string;
  name: string; // e.g., "Χριστουγεννιάτικο Ωράριο 2024", "Πρωτοχρονιάτικο Ωράριο 2025"
  type: 'christmas' | 'newyear' | 'easter' | 'other';
  isActive: boolean; // Which schedule is currently active
  isClosed: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  schedule: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  dates: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  createdAt?: any;
  updatedAt?: any;
}

// Keep old interface for backward compatibility
export interface ChristmasSchedule extends HolidaySchedule {
  enabled?: boolean;
  startDate?: string;
  endDate?: string;
}

export const useChristmasSchedule = () => {
  const [schedule, setSchedule] = useState<HolidaySchedule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const schedulesRef = collection(db, 'holiday_schedules');
    const q = query(schedulesRef, where('isActive', '==', true));
    
    // Use onSnapshot for real-time updates
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        if (!querySnapshot.empty) {
          // Get the first active schedule (should only be one active at a time)
          // Sort by updatedAt client-side if needed
          const schedules = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as HolidaySchedule[];
          
          // Sort by updatedAt descending (most recent first)
          schedules.sort((a, b) => {
            const aTime = a.updatedAt?.toMillis?.() || 0;
            const bTime = b.updatedAt?.toMillis?.() || 0;
            return bTime - aTime;
          });
          
          setSchedule(schedules[0]);
        } else {
          setSchedule(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching holiday schedule:', error);
        setSchedule(null);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Get hours for a specific day
  const getHoursForDay = (dayKey: keyof HolidaySchedule['schedule'], language: 'el' | 'en' = 'el'): string | null => {
    if (!schedule || !schedule.isActive) {
      return null;
    }

    // Check if day is closed
    if (schedule.isClosed[dayKey]) {
      return language === 'en' ? 'Closed' : 'Κλειστά';
    }

    // Return schedule for the day
    return schedule.schedule[dayKey] || null;
  };

  // Check if any holiday schedule is active
  const isActive = schedule?.isActive ?? false;

  // Get holiday style based on type
  const getHolidayStyle = () => {
    if (!schedule || !isActive) {
      return {
        type: 'normal' as const,
        icon: null,
        title: null,
        colors: {
          primary: '',
          secondary: '',
          bg: '',
          border: '',
          text: ''
        }
      };
    }

    if (schedule.type === 'newyear') {
      return {
        type: 'newyear' as const,
        icon: '🎆',
        title: { el: '🎆 Πρωτοχρονιάτικο Ωράριο', en: '🎆 New Year Hours' },
        colors: {
          primary: 'from-yellow-500 to-amber-500',
          secondary: 'from-yellow-400 to-amber-400',
          bg: 'from-yellow-50/10 via-white/[0.07] to-amber-50/10 dark:from-yellow-950/20 dark:via-slate-900/80 dark:to-amber-950/20',
          border: 'border-yellow-300/30 dark:border-yellow-800/30',
          text: 'text-yellow-700 dark:text-yellow-300',
          textDark: 'text-yellow-800 dark:text-yellow-200',
          bgCard: 'bg-yellow-50/20 dark:bg-yellow-950/10',
          bgToday: 'from-yellow-100/50 to-amber-100/50 dark:from-yellow-900/30 dark:to-amber-900/30',
          borderCard: 'border-yellow-200/30 dark:border-yellow-800/30',
          borderBadge: 'border-yellow-300/50 bg-yellow-50/50 dark:bg-yellow-950/30',
          dateColor: 'text-yellow-600 dark:text-yellow-400',
          dateColorToday: 'text-yellow-900 dark:text-yellow-100'
        }
      };
    }

    if (schedule.type === 'easter') {
      return {
        type: 'easter' as const,
        icon: '🐰',
        title: { el: '🐰 Πασχαλινό Ωράριο', en: '🐰 Easter Hours' },
        colors: {
          primary: 'from-green-500 to-pink-500',
          secondary: 'from-green-400 to-pink-400',
          bg: 'from-green-50/10 via-white/[0.07] to-pink-50/10 dark:from-green-950/20 dark:via-slate-900/80 dark:to-pink-950/20',
          border: 'border-green-300/30 dark:border-green-800/30',
          text: 'text-green-700 dark:text-green-300',
          textDark: 'text-green-800 dark:text-green-200',
          bgCard: 'bg-green-50/20 dark:bg-green-950/10',
          bgToday: 'from-green-100/50 to-pink-100/50 dark:from-green-900/30 dark:to-pink-900/30',
          borderCard: 'border-green-200/30 dark:border-green-800/30',
          borderBadge: 'border-green-300/50 bg-green-50/50 dark:bg-green-950/30',
          dateColor: 'text-green-600 dark:text-green-400',
          dateColorToday: 'text-green-900 dark:text-green-100',
          emoji: '🌸'
        }
      };
    }

    if (schedule.type === 'other') {
      return {
        type: 'other' as const,
        icon: '⭐',
        title: { el: '⭐ Ειδικό Ωράριο', en: '⭐ Special Hours' },
        colors: {
          primary: 'from-purple-500 to-indigo-500',
          secondary: 'from-purple-400 to-indigo-400',
          bg: 'from-purple-50/10 via-white/[0.07] to-indigo-50/10 dark:from-purple-950/20 dark:via-slate-900/80 dark:to-indigo-950/20',
          border: 'border-purple-300/30 dark:border-purple-800/30',
          text: 'text-purple-700 dark:text-purple-300',
          textDark: 'text-purple-800 dark:text-purple-200',
          bgCard: 'bg-purple-50/20 dark:bg-purple-950/10',
          bgToday: 'from-purple-100/50 to-indigo-100/50 dark:from-purple-900/30 dark:to-indigo-900/30',
          borderCard: 'border-purple-200/30 dark:border-purple-800/30',
          borderBadge: 'border-purple-300/50 bg-purple-50/50 dark:bg-purple-950/30',
          dateColor: 'text-purple-600 dark:text-purple-400',
          dateColorToday: 'text-purple-900 dark:text-purple-100',
          emoji: '✨'
        }
      };
    }

    // Default to Christmas style
    return {
      type: 'christmas' as const,
      icon: '🎄',
      title: { el: '🎅 Χριστουγεννιάτικο Ωράριο', en: '🎅 Christmas Hours' },
      colors: {
        primary: 'from-red-500 to-green-500',
        secondary: 'from-red-400 to-green-400',
        bg: 'from-red-50/10 via-white/[0.07] to-green-50/10 dark:from-red-950/20 dark:via-slate-900/80 dark:to-green-950/20',
        border: 'border-red-300/30 dark:border-red-800/30',
        text: 'text-red-700 dark:text-red-300',
        textDark: 'text-red-800 dark:text-red-200',
        bgCard: 'bg-red-50/20 dark:bg-red-950/10',
        bgToday: 'from-red-100/50 to-green-100/50 dark:from-red-900/30 dark:to-green-900/30',
        borderCard: 'border-red-200/30 dark:border-red-800/30',
        borderBadge: 'border-red-300/50 bg-red-50/50 dark:bg-red-950/30',
        dateColor: 'text-red-600 dark:text-red-400',
        dateColorToday: 'text-red-900 dark:text-red-100',
        emoji: '❄️'
      }
    };
  };

  return {
    schedule,
    loading,
    isActive,
    getHoursForDay,
    getHolidayStyle
  };
};

