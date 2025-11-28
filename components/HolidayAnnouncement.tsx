'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useChristmasSchedule } from '@/hooks/useChristmasSchedule';
import { cn } from '@/lib/utils';
import { getHolidayPathByType } from '@/lib/holidayRoutes';

const gradientByType: Record<string, string> = {
  newyear: 'from-amber-500 via-yellow-400 to-amber-500',
  easter: '', // Solid color, no gradient
  other: 'from-violet-600 via-purple-500 to-indigo-500',
  christmas: '', // Solid color, no gradient
  summer: 'from-sky-500 via-cyan-400 to-amber-400',
  normal: 'from-primary to-primary'
};

const solidColorByType: Record<string, string> = {
  christmas: '#bc4749',
  easter: '#cbf4c6',
};

const patternOverlay =
  "before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.25)_1px,transparent_0)] before:bg-[length:18px_18px] before:opacity-40 before:pointer-events-none";

const formatDate = (value?: string, locale: 'el' | 'en' = 'el') => {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toLocaleDateString(locale === 'en' ? 'en-US' : 'el-GR', {
    day: '2-digit',
    month: '2-digit',
  });
};

const formatRange = (from?: string, to?: string, locale: 'el' | 'en' = 'el') => {
  if (!from && !to) return '';
  if (from && to) {
    return `${formatDate(from, locale)} – ${formatDate(to, locale)}`;
  }
  return formatDate(from ?? to, locale);
};

export function HolidayAnnouncement() {
  const { schedule, isActive, getHolidayStyle } = useChristmasSchedule();
  const holidayStyle = getHolidayStyle();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isActive || !schedule || schedule.showAnnouncement !== true) {
      setIsVisible(false);
      return;
    }

    if (pathname?.includes('-hours')) {
      setIsVisible(false);
      return;
    }

    if (!isClient) {
      return;
    }

    if (schedule.id) {
      const dismissedKey = `holiday-announcement-dismissed-${schedule.id}`;
      const wasDismissed = window.localStorage.getItem(dismissedKey);
      setIsVisible(!wasDismissed);
    } else {
      setIsVisible(true);
    }
  }, [isActive, schedule, pathname, isClient]);

  if (!isClient || !isActive || !schedule || !isVisible) {
    return null;
  }

  const detectedIsEnglish = pathname?.startsWith('/en') ?? false;
  const bannerLink = getHolidayPathByType(schedule.type, detectedIsEnglish ? 'en' : 'el');
  const title =
    detectedIsEnglish
      ? holidayStyle.title?.en ?? 'Special hours'
      : holidayStyle.title?.el ?? 'Ειδικό ωράριο';
  const closures = schedule.closureNotices ?? [];
  const primaryClosure = closures[0];
  const baseDetail = detectedIsEnglish
    ? 'Updated festive hours. Tap to view the detailed schedule.'
    : 'Εορταστικό ωράριο. Πατήστε για να δείτε αναλυτικά τις ώρες.';
  const closureDetail =
    primaryClosure && (primaryClosure.from || primaryClosure.to)
      ? detectedIsEnglish
        ? `Closed ${formatRange(primaryClosure.from, primaryClosure.to, detectedIsEnglish ? 'en' : 'el')}`
        : `Κλειστά ${formatRange(primaryClosure.from, primaryClosure.to, detectedIsEnglish ? 'en' : 'el')}`
      : null;
  const detail = closureDetail ?? baseDetail;

  const buttonLabel = detectedIsEnglish ? 'View schedule' : 'Δείτε το ωράριο';

  const closeAnnouncement = () => {
    if (schedule.id) {
      const dismissedKey = `holiday-announcement-dismissed-${schedule.id}`;
      window.localStorage.setItem(dismissedKey, 'true');
    }
    setIsVisible(false);
  };

  const renderIcon = () => {
    if (!holidayStyle.icon) return null;
    if (typeof holidayStyle.icon === 'string') {
      return <span className="text-xl">{holidayStyle.icon}</span>;
    }
    return (
      <img
        src={holidayStyle.icon.src}
        alt={holidayStyle.icon.alt}
        className="h-8 w-8 object-contain sm:h-9 sm:w-9"
      />
    );
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25 }}
          className="fixed top-0 left-0 right-0 z-[90] pointer-events-none"
        >
          <div className="max-w-4xl px-3 sm:px-6 mx-auto pt-24 sm:pt-28 pointer-events-auto">
            <div
              className={cn(
                'relative overflow-hidden rounded-2xl border px-3 py-2.5 sm:px-6 sm:py-4 shadow-xl text-white flex flex-col gap-2.5 sm:gap-4',
                solidColorByType[holidayStyle.type] ? '' : 'bg-gradient-to-r',
                solidColorByType[holidayStyle.type] ? '' : (gradientByType[holidayStyle.type] ?? gradientByType.normal),
                patternOverlay
              )}
              style={solidColorByType[holidayStyle.type] ? { backgroundColor: solidColorByType[holidayStyle.type] } : undefined}
            >
              <button
                onClick={closeAnnouncement}
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/15 backdrop-blur hover:bg-white/25 transition-all flex items-center justify-center"
                aria-label={detectedIsEnglish ? 'Close announcement' : 'Κλείσιμο ανακοίνωσης'}
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                    {renderIcon()}
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-bold leading-tight">{title}</p>
                    <p className="text-xs sm:text-sm text-white/90">{detail}</p>
                  </div>
                </div>

                <Link
                  href={bannerLink}
                  className="inline-flex items-center justify-center rounded-full border border-white/70 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold tracking-wide gap-2 bg-white/10 hover:bg-white/20 transition-colors"
                >
                  {buttonLabel}
                  <svg
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


