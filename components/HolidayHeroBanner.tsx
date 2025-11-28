'use client';

import Link from 'next/link';
import { useChristmasSchedule } from '@/hooks/useChristmasSchedule';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { getHolidayPathByType } from '@/lib/holidayRoutes';

const gradientByType: Record<string, string> = {
  newyear: 'from-amber-400 via-yellow-300 to-amber-500',
  easter: '', // Solid color, no gradient
  other: 'from-violet-500 via-purple-500 to-indigo-500',
  christmas: '', // Solid color, no gradient
  summer: 'from-sky-400 via-cyan-300 to-amber-300',
  normal: 'from-primary/80 to-primary',
};

const solidColorByType: Record<string, string> = {
  christmas: '#bc4749',
  easter: '#cbf4c6',
};

const patternOverlay =
  "before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] before:bg-[length:16px_16px] before:opacity-30 before:pointer-events-none";

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

export function HolidayHeroBanner() {
  const { schedule, isActive, getHolidayStyle } = useChristmasSchedule();
  const { language } = useLanguage();
  const holidayStyle = getHolidayStyle();

  if (!isActive || !schedule || schedule.showAnnouncement !== true) {
    return null;
  }

  const isEnglish = language === 'en';
  const closures = schedule.closureNotices ?? [];
  const primaryClosure = closures[0];
  const icon =
    typeof holidayStyle.icon === 'string' ? (
      <span className="text-3xl">{holidayStyle.icon}</span>
    ) : holidayStyle.icon ? (
      <img
        src={holidayStyle.icon.src}
        alt={holidayStyle.icon.alt}
        className="h-10 w-10 object-contain"
      />
    ) : null;

  const title = isEnglish ? holidayStyle.title?.en ?? 'Special hours' : holidayStyle.title?.el ?? 'Ειδικό ωράριο';
  
  // Get greeting message based on holiday type
  const getGreeting = () => {
    if (isEnglish) {
      switch (schedule.type) {
        case 'christmas': return 'Merry Christmas';
        case 'easter': return 'Happy Easter';
        case 'newyear': return 'Happy New Year';
        case 'summer': return 'Happy Summer';
        default: return 'Our salon operates with a festive schedule. See the exact days and hours.';
      }
    } else {
      switch (schedule.type) {
        case 'christmas': return 'Καλά χριστούγεννα';
        case 'easter': return 'Καλό Πάσχα';
        case 'newyear': return 'Καλή χρονιά';
        case 'summer': return 'Καλό καλοκαίρι';
        default: return 'Το σαλόνι λειτουργεί με εορταστικό ωράριο. Δείτε τις ακριβείς ημέρες και ώρες.';
      }
    }
  };
  
  const detail = getGreeting();
  const cta = isEnglish ? 'View holiday hours' : 'Δείτε το Ωράριο';
  const secondaryCta = isEnglish ? 'Contact us' : 'Επικοινωνήστε';
  const link = getHolidayPathByType(schedule.type, isEnglish ? 'en' : 'el');

  return (
    <section className="relative px-4 md:px-8 mt-4 md:mt-16 mb-12 md:mb-20">
      <div
        className={cn(
          'max-w-5xl mx-auto rounded-3xl border shadow-2xl overflow-hidden text-white relative',
          solidColorByType[holidayStyle.type] ? '' : 'bg-gradient-to-r',
          solidColorByType[holidayStyle.type] ? '' : (gradientByType[holidayStyle.type] ?? gradientByType.normal),
          patternOverlay
        )}
        style={solidColorByType[holidayStyle.type] ? { backgroundColor: solidColorByType[holidayStyle.type] } : undefined}
      >
        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 px-6 py-6 md:px-10 md:py-8">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              {icon}
            </div>
            <div className="space-y-2">
              <div className="space-y-1">
                <p className="text-2xl md:text-3xl font-bold">{title}</p>
                <p className="text-sm md:text-base text-white/90">{detail}</p>
                {closures.length > 0 && (
                  <div className="text-xs md:text-sm text-white/80 space-y-1">
                    {closures.map((notice) => (
                      <p key={notice.id} className="flex flex-wrap gap-2">
                        {(notice.from || notice.to) && (
                          <span>
                            {isEnglish ? 'Closed' : 'Κλειστά'}: {formatRange(notice.from, notice.to, language)}
                          </span>
                        )}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <Link
              href={link}
              className="flex-1 lg:flex-none inline-flex items-center justify-center rounded-2xl bg-white/90 text-primary px-4 py-2.5 font-semibold shadow-md hover:bg-white transition-colors"
            >
              {cta}
            </Link>
            <a
              href="tel:+302106818011"
              className="flex-1 lg:flex-none inline-flex items-center justify-center rounded-2xl border border-white/60 px-4 py-2.5 font-semibold tracking-wide text-white hover:bg-white/15 transition-colors"
            >
              {secondaryCta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}


