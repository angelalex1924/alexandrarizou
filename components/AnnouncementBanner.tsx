'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Info, AlertTriangle, CheckCircle, AlertCircle, Megaphone, ExternalLink } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Announcement, AnnouncementType } from '@/types/announcements';
import { cn } from '@/lib/utils';

// Offer Icon Component for Alexandra Rizou Banner
const OfferIconAlexandraBanner = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <g fill="currentColor">
      <path fillRule="evenodd" d="M10.594 2.319a3.261 3.261 0 0 1 2.812 0c.387.185.74.487 1.231.905l.078.066c.238.203.313.265.389.316c.193.13.41.219.637.264c.09.018.187.027.499.051l.101.008c.642.051 1.106.088 1.51.23a3.27 3.27 0 0 1 1.99 1.99c.142.404.178.868.23 1.51l.008.101c.024.312.033.41.051.499c.045.228.135.445.264.638c.051.075.113.15.316.388l.066.078c.419.49.72.844.905 1.23c.425.89.425 1.924 0 2.813c-.184.387-.486.74-.905 1.231l-.066.078a4.758 4.758 0 0 0-.316.389c-.13.193-.219.41-.264.637c-.018.09-.026.187-.051.499l-.009.101c-.05.642-.087 1.106-.23 1.51a3.26 3.26 0 0 1-1.989 1.99c-.404.142-.868.178-1.51.23l-.101.008a4.757 4.757 0 0 0-.499.051a1.755 1.755 0 0 0-.637.264a4.83 4.83 0 0 0-.39.316l-.077.066c-.49.419-.844.72-1.23.905a3.261 3.261 0 0 1-2.813 0c-.387-.184-.74-.486-1.231-.905a95.175 95.175 0 0 0-.078-.066a4.779 4.779 0 0 0-.388-.316a1.746 1.746 0 0 0-.638-.264a4.759 4.759 0 0 0-.499-.051l-.101-.009c-.642-.05-1.106-.087-1.51-.23a3.261 3.261 0 0 1-1.99-1.989c-.142-.404-.179-.868-.23-1.51l-.008-.101a4.76 4.76 0 0 0-.051-.499a1.756 1.756 0 0 0-.264-.637a4.74 4.74 0 0 0-.316-.39l-.066-.077c-.418-.49-.72-.844-.905-1.23a3.261 3.261 0 0 1 0-2.813c.185-.387.487-.74.905-1.231l.066-.078a4.76 4.76 0 0 0 .316-.388c.13-.193.219-.41.264-.638c.018-.09.027-.187.051-.499l.008-.101c.051-.642.088-1.106.23-1.51a3.261 3.261 0 0 1 1.99-1.99c.404-.142.868-.179 1.51-.23l.101-.008a4.47 4.47 0 0 0 .499-.051c.228-.045.445-.135.638-.264c.075-.051.15-.113.388-.316l.078-.066c.49-.418.844-.72 1.23-.905Zm2.163 1.358a1.756 1.756 0 0 0-1.514 0c-.185.088-.38.247-.981.758l-.03.025c-.197.168-.34.291-.497.396c-.359.24-.761.407-1.185.49c-.185.037-.373.052-.632.073l-.038.003c-.787.063-1.036.089-1.23.157c-.5.177-.894.57-1.07 1.071c-.07.194-.095.443-.158 1.23l-.003.038c-.02.259-.036.447-.072.632c-.084.424-.25.826-.49 1.185c-.106.157-.229.3-.397.498l-.025.029c-.511.6-.67.796-.758.98a1.756 1.756 0 0 0 0 1.515c.088.185.247.38.758.981l.025.03c.168.197.291.34.396.497c.24.359.407.761.49 1.184c.037.186.052.374.073.633l.003.038c.063.787.089 1.036.157 1.23c.177.5.57.894 1.071 1.07c.194.07.443.095 1.23.158l.038.003c.259.02.447.036.632.072c.424.084.826.25 1.185.49c.157.106.3.229.498.397l.029.025c.6.511.796.67.98.758a1.756 1.756 0 0 0 1.515 0c.185-.088.38-.247.981-.758l.03-.025c.197-.168.34-.291.497-.396a3.26 3.26 0 0 1 1.184-.49a5.53 5.53 0 0 1 .633-.073l.038-.003c.787-.063 1.036-.089 1.23-.157c.5-.177.894-.57 1.07-1.071c.07-.194.095-.444.158-1.23l.003-.038a5.53 5.53 0 0 1 .072-.633c.084-.423.25-.825.49-1.184c.106-.157.229-.3.397-.498l.025-.029c.511-.6.67-.796.758-.98a1.756 1.756 0 0 0 0-1.515c-.088-.185-.247-.38-.758-.981l-.025-.03c-.168-.197-.291-.34-.396-.497a3.262 3.262 0 0 1-.49-1.185a5.531 5.531 0 0 1-.073-.632l-.003-.038c-.063-.787-.089-1.036-.157-1.23c-.177-.5-.57-.894-1.071-1.07c-.194-.07-.444-.095-1.23-.158l-.038-.003a5.568 5.568 0 0 1-.633-.072a3.262 3.262 0 0 1-1.184-.49c-.157-.106-.3-.229-.498-.397l-.029-.025c-.6-.511-.796-.67-.98-.758Z" clipRule="evenodd"/>
      <path fillRule="evenodd" d="M15.543 8.457a.753.753 0 0 1 0 1.065l-6.021 6.02a.753.753 0 0 1-1.065-1.064l6.021-6.02a.753.753 0 0 1 1.065 0Z" clipRule="evenodd"/>
      <path d="M15.512 14.509a1.004 1.004 0 1 1-2.007 0a1.004 1.004 0 0 1 2.007 0Zm-5.017-5.018a1.004 1.004 0 1 1-2.007 0a1.004 1.004 0 0 1 2.007 0Z"/>
    </g>
  </svg>
);

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
  offer: {
    icon: <OfferIconAlexandraBanner className="w-6 h-6" />,
    gradient: 'from-amber-500 via-yellow-400 to-amber-500',
    solidColor: '#f59e0b',
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

