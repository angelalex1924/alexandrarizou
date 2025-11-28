'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Info, AlertTriangle, CheckCircle, AlertCircle, Megaphone, ExternalLink } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Announcement, AnnouncementType } from '@/types/announcements';
import { cn } from '@/lib/utils';

const typeConfig: Record<AnnouncementType, { icon: React.ReactNode; gradient: string; solidColor?: string }> = {
  info: {
    icon: <Info className="w-5 h-5" />,
    gradient: 'from-blue-500 via-blue-400 to-indigo-500',
    solidColor: '#3b82f6',
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5" />,
    gradient: 'from-orange-500 via-amber-400 to-orange-500',
    solidColor: '#f97316',
  },
  success: {
    icon: <CheckCircle className="w-5 h-5" />,
    gradient: 'from-green-500 via-emerald-400 to-green-500',
    solidColor: '#10b981',
  },
  error: {
    icon: <AlertCircle className="w-5 h-5" />,
    gradient: 'from-red-500 via-rose-400 to-red-500',
    solidColor: '#ef4444',
  },
  announcement: {
    icon: <Megaphone className="w-5 h-5" />,
    gradient: 'from-purple-500 via-violet-400 to-purple-500',
    solidColor: '#a855f7',
  },
};

export function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const pathname = usePathname();
  const isEnglish = pathname.startsWith('/en');

  useEffect(() => {
    void loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const announcementsRef = collection(db, 'announcements');
      const q = query(announcementsRef, where('isActive', '==', true));
      const snapshot = await getDocs(q);
      
      const loadedAnnouncements = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Announcement))
        .filter(announcement => {
          // Check if announcement is within date range
          const now = new Date();
          if (announcement.startDate) {
            const start = new Date(announcement.startDate);
            if (now < start) return false;
          }
          if (announcement.endDate) {
            const end = new Date(announcement.endDate);
            end.setHours(23, 59, 59, 999);
            if (now > end) return false;
          }

          // Check if announcement should be shown on current page
          if (announcement.targetPages && announcement.targetPages.length > 0) {
            const normalizedPath = pathname.replace(/^\/en/, '') || '/';
            return announcement.targetPages.includes(normalizedPath);
          }

          return true;
        })
        .sort((a, b) => {
          // Sort by priority: high > medium > low
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        });

      setAnnouncements(loadedAnnouncements);
    } catch (error) {
      console.error('Error loading announcements:', error);
    }
  };

  const handleDismiss = (id: string) => {
    setDismissedIds([...dismissedIds, id]);
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      const stored = JSON.parse(localStorage.getItem('dismissedAnnouncements') || '[]');
      localStorage.setItem('dismissedAnnouncements', JSON.stringify([...stored, id]));
    }
  };

  useEffect(() => {
    // Load dismissed IDs from localStorage
    if (typeof window !== 'undefined') {
      const stored = JSON.parse(localStorage.getItem('dismissedAnnouncements') || '[]');
      setDismissedIds(stored);
    }
  }, []);

  const visibleAnnouncements = announcements.filter(
    ann => ann.id && !dismissedIds.includes(ann.id)
  );

  if (visibleAnnouncements.length === 0) return null;

  return (
    <div className="fixed top-[80px] left-0 right-0 z-40 pointer-events-none">
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <AnimatePresence>
          {visibleAnnouncements.map((announcement, index) => {
            const config = typeConfig[announcement.type];
            const title = isEnglish ? announcement.title.en : announcement.title.el;
            const message = isEnglish ? announcement.message.en : announcement.message.el;
            const linkText = isEnglish 
              ? (announcement.linkText?.en || 'Learn more')
              : (announcement.linkText?.el || 'Μάθετε περισσότερα');

            return (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ delay: index * 0.1 }}
                className="pointer-events-auto mb-3"
              >
                <div
                  className={cn(
                    'relative overflow-hidden rounded-2xl border shadow-xl text-white flex items-center gap-4 px-4 py-3 sm:px-6 sm:py-4',
                    'bg-gradient-to-r',
                    config.gradient
                  )}
                  style={{
                    background: config.solidColor 
                      ? `linear-gradient(to right, ${config.solidColor}, ${config.solidColor})`
                      : undefined,
                  }}
                >
                  {/* Pattern overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:18px_18px] opacity-40 pointer-events-none" />

                  {/* Icon */}
                  <div className="relative z-10 flex-shrink-0">
                    {config.icon}
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-bold leading-tight mb-1">{title}</h3>
                    <p className="text-xs sm:text-sm text-white/90 leading-relaxed">{message}</p>
                    {announcement.linkUrl && (
                      <a
                        href={announcement.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-2 text-xs sm:text-sm font-semibold text-white hover:text-white/80 underline"
                      >
                        {linkText}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* Dismiss button */}
                  {announcement.isDismissible && (
                    <button
                      onClick={() => announcement.id && handleDismiss(announcement.id)}
                      className="relative z-10 flex-shrink-0 p-1 hover:bg-white/20 rounded-lg transition-colors"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

