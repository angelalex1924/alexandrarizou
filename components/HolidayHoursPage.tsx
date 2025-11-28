'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { ArrowLeft, Calendar, Clock3, Sparkles } from 'lucide-react';
import { useChristmasSchedule, type HolidaySchedule } from '@/hooks/useChristmasSchedule';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getHolidayPathByType, type HolidayType } from '@/lib/holidayRoutes';

const gradientByType: Record<string, string> = {
  newyear: 'from-amber-400 via-yellow-300 to-amber-500',
  easter: 'from-emerald-400 via-rose-300 to-emerald-500',
  other: 'from-violet-500 via-purple-500 to-indigo-500',
  christmas: 'from-rose-500 via-red-500 to-emerald-500',
  summer: 'from-sky-400 via-cyan-300 to-amber-400',
  normal: 'from-primary/80 to-primary',
};

type DayKey = keyof HolidaySchedule['schedule'];

const dayConfigs: { key: DayKey; label: { el: string; en: string }; short: string }[] = [
  { key: 'monday', label: { el: 'Δευτέρα', en: 'Monday' }, short: 'Mon' },
  { key: 'tuesday', label: { el: 'Τρίτη', en: 'Tuesday' }, short: 'Tue' },
  { key: 'wednesday', label: { el: 'Τετάρτη', en: 'Wednesday' }, short: 'Wed' },
  { key: 'thursday', label: { el: 'Πέμπτη', en: 'Thursday' }, short: 'Thu' },
  { key: 'friday', label: { el: 'Παρασκευή', en: 'Friday' }, short: 'Fri' },
  { key: 'saturday', label: { el: 'Σάββατο', en: 'Saturday' }, short: 'Sat' },
  { key: 'sunday', label: { el: 'Κυριακή', en: 'Sunday' }, short: 'Sun' },
];

const formatDate = (value?: string, locale: 'el' | 'en' = 'el') => {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toLocaleDateString(locale === 'en' ? 'en-US' : 'el-GR', {
    day: '2-digit',
    month: '2-digit',
  });
};

const formatDayLabel = (value: Date, locale: 'el' | 'en') => {
  const weekday = value.toLocaleDateString(locale === 'en' ? 'en-US' : 'el-GR', {
    weekday: 'long',
  });
  const datePart = value.toLocaleDateString(locale === 'en' ? 'en-US' : 'el-GR', {
    day: '2-digit',
    month: '2-digit',
  });
  const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  return `${capitalizedWeekday} ${datePart}`;
};

const generateClosureDays = (closures: HolidaySchedule['closureNotices'] | undefined, locale: 'el' | 'en') => {
  const result: string[] = [];
  const seen = new Set<string>();
  if (!closures) return result;

  closures.forEach((notice) => {
    const start = notice?.from ? new Date(notice.from) : notice?.to ? new Date(notice.to) : null;
    if (!start || Number.isNaN(start.getTime())) return;
    const end = notice?.to ? new Date(notice.to) : start;

    const current = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const final = new Date(end.getFullYear(), end.getMonth(), end.getDate());

    while (current.getTime() <= final.getTime()) {
      const key = current.toISOString().split('T')[0];
      if (!seen.has(key)) {
        result.push(formatDayLabel(current, locale));
        seen.add(key);
      }
      current.setDate(current.getDate() + 1);
    }
  });

  return result;
};

const copyByType: Record<HolidayType, { title: { el: string; en: string }; subtitle: { el: string; en: string } }> = {
  christmas: {
    title: { el: 'Χριστουγεννιάτικο Ωράριο', en: 'Christmas Hours' },
    subtitle: {
      el: 'Οι ημέρες λειτουργίας για την περίοδο των Χριστουγέννων',
      en: 'Operating schedule for the Christmas period',
    },
  },
  newyear: {
    title: { el: 'Πρωτοχρονιάτικο Ωράριο', en: 'New Year Hours' },
    subtitle: {
      el: 'Ειδικό πρόγραμμα για την αλλαγή του χρόνου',
      en: 'Special timetable for the New Year celebrations',
    },
  },
  easter: {
    title: { el: 'Πασχαλινό Ωράριο', en: 'Easter Hours' },
    subtitle: {
      el: 'Ωράριο λειτουργίας για την περίοδο του Πάσχα',
      en: 'Operating hours during the Easter season',
    },
  },
  other: {
    title: { el: 'Ειδικό Ωράριο', en: 'Special Hours' },
    subtitle: {
      el: 'Προσωρινό πρόγραμμα λειτουργίας',
      en: 'Temporary operating schedule',
    },
  },
  summer: {
    title: { el: 'Θερινό Ωράριο', en: 'Summer Hours' },
    subtitle: {
      el: 'Περίοδος διακοπών και καλοκαιρινές άδειες',
      en: 'Vacation period and summer closures',
    },
  },
};

interface HolidayHoursPageProps {
  expectedType: HolidayType;
}

export function HolidayHoursPage({ expectedType }: HolidayHoursPageProps) {
  const { schedule, loading, isActive, getHolidayStyle, getHoursForDay } = useChristmasSchedule();
  const { language } = useLanguage();
  const holidayStyle = getHolidayStyle();

  const todayIndex = (new Date().getDay() + 6) % 7;
  const isEnglish = language === 'en';

  const contentCopy = copyByType[expectedType];

  const currentIcon = useMemo(() => {
    if (!holidayStyle.icon) return null;
    if (typeof holidayStyle.icon === 'string') {
      return <span className="text-4xl">{holidayStyle.icon}</span>;
    }
    return <img src={holidayStyle.icon.src} alt={holidayStyle.icon.alt} className="h-12 w-12 object-contain" />;
  }, [holidayStyle.icon]);

  const renderScheduleGrid = () => {
    if (!schedule) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dayConfigs.map((day, index) => {
          const hours = getHoursForDay(day.key, language);
          const isToday = index === todayIndex;
          const isClosed = schedule.isClosed?.[day.key] ?? hours?.toLowerCase().includes('κλειστά') ?? false;
          const dateText = schedule.dates?.[day.key];
          const formattedDate =
            dateText && !isNaN(Date.parse(dateText))
              ? new Date(dateText).toLocaleDateString(isEnglish ? 'en-US' : 'el-GR', {
                  day: '2-digit',
                  month: '2-digit',
                })
              : undefined;

          return (
            <div
              key={day.key}
              className={cn(
                'rounded-2xl border px-5 py-4 shadow-sm transition-all',
                isToday
                  ? 'border-white/40 bg-white/10 dark:bg-white/5 shadow-lg'
                  : 'border-white/15 bg-white/5 dark:bg-white/5/50',
                isClosed && 'border-red-400/40 bg-red-50/30 dark:bg-red-900/20'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground/80">{day.short}</p>
                  <p className="text-lg font-semibold">
                    {isEnglish ? day.label.en : day.label.el}
                    {formattedDate && (
                      <span className="ml-2 text-xs font-medium text-muted-foreground">({formattedDate})</span>
                    )}
                  </p>
                </div>
                {isToday && (
                  <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-primary">
                    {isEnglish ? 'Today' : 'Σήμερα'}
                  </span>
                )}
              </div>
              <p
                className={cn(
                  'text-base font-semibold',
                  isClosed ? 'text-red-600 dark:text-red-200' : 'text-foreground dark:text-white'
                )}
              >
                {hours || (isEnglish ? '—' : '—')}
              </p>
              {isClosed && (
                <p className="text-xs text-muted-foreground mt-2">
                  {isEnglish
                    ? 'Salon closed for this day.'
                    : 'Το σαλόνι παραμένει κλειστό για αυτή την ημέρα.'}
                </p>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const closureDays = useMemo(
    () => generateClosureDays(schedule?.closureNotices, isEnglish ? 'en' : 'el'),
    [schedule?.closureNotices, isEnglish],
  );

  const renderClosureDaysSection = () => {
    if (!closureDays.length) return null;

    return (
      <div className="rounded-3xl border border-muted-foreground/10 p-6 bg-card shadow-sm space-y-3">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          {isEnglish
            ? 'The salon will remain closed on the following dates'
            : 'Το κατάστημα θα παραμείνει κλειστό στις ακόλουθες ημερομηνίες'}
        </h2>
        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
          {closureDays.map((label) => (
            <li key={label} className="capitalize">
              {label}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const loadingState = (
    <div className="w-full py-32 flex flex-col items-center gap-4">
      <div className="h-10 w-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-muted-foreground text-sm">{isEnglish ? 'Loading schedule...' : 'Φόρτωση ωραρίου...'}</p>
    </div>
  );

  if (loading) {
    return loadingState;
  }

  if (!isActive || !schedule) {
    return (
      <section className="pt-32 pb-24 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <Sparkles className="h-10 w-10 text-primary mx-auto" />
          <h1 className="text-3xl font-bold">{isEnglish ? 'No special hours available' : 'Δεν υπάρχει ειδικό ωράριο'}</h1>
          <p className="text-muted-foreground">
            {isEnglish
              ? 'The salon is currently operating with its regular timetable. Please check back closer to the holiday period.'
              : 'Αυτή τη στιγμή το σαλόνι λειτουργεί με το κανονικό ωράριο. Επιστρέψτε πιο κοντά στην εορταστική περίοδο.'}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={isEnglish ? '/en' : '/'}>
              <Button variant="default">{isEnglish ? 'Back to home' : 'Επιστροφή στην αρχική'}</Button>
            </Link>
            <a href="tel:+302106818011">
              <Button variant="outline">{isEnglish ? 'Call the salon' : 'Καλέστε το σαλόνι'}</Button>
            </a>
          </div>
        </div>
      </section>
    );
  }

  const isMatchingType = schedule.type === expectedType;

  if (!isMatchingType) {
    const activePath = getHolidayPathByType(schedule.type, isEnglish ? 'en' : 'el');
    return (
      <section className="pt-32 pb-24 px-4">
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          <Sparkles className="h-10 w-10 text-primary mx-auto" />
          <h1 className="text-3xl font-bold">
            {isEnglish ? 'Different schedule active' : 'Ενεργό διαφορετικό ωράριο'}
          </h1>
          <p className="text-muted-foreground">
            {isEnglish
              ? 'At the moment another festive schedule is active. Follow the link below to view it.'
              : 'Αυτή τη στιγμή είναι ενεργό διαφορετικό εορταστικό ωράριο. Ακολουθήστε τον παρακάτω σύνδεσμο για να το δείτε.'}
          </p>
          <Link href={activePath}>
            <Button>{isEnglish ? 'View active holiday hours' : 'Δείτε το ενεργό ωράριο'}</Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-32 pb-24 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href={isEnglish ? '/en' : '/'} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            {isEnglish ? 'Back to home' : 'Επιστροφή στην αρχική'}
          </Link>
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <Clock3 className="h-4 w-4" />
            {isEnglish ? schedule.name || 'Holiday schedule' : schedule.name || 'Εορταστικό ωράριο'}
          </span>
        </div>

        <div
          className={cn(
            'relative rounded-3xl border overflow-hidden text-white shadow-2xl',
            'bg-gradient-to-r',
            gradientByType[schedule.type] ?? gradientByType.normal,
            "before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.25)_1px,transparent_0)] before:bg-[length:20px_20px] before:opacity-40 before:pointer-events-none"
          )}
        >
          <div className="relative px-6 py-8 md:px-10 md:py-12 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                  {currentIcon}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/80">
                    {isEnglish ? 'Holiday announcement' : 'Εορταστική ενημέρωση'}
                  </p>
                  <h1 className="text-3xl md:text-4xl font-bold leading-tight">{isEnglish ? contentCopy.title.en : contentCopy.title.el}</h1>
                  <p className="text-white/90">
                    {isEnglish ? contentCopy.subtitle.en : contentCopy.subtitle.el}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href="tel:+302106818011"
                  className="inline-flex items-center justify-center rounded-2xl bg-white/90 text-primary px-4 py-2.5 font-semibold shadow-md hover:bg-white transition-colors"
                >
                  {isEnglish ? 'Call salon' : 'Καλέστε το σαλόνι'}
                </a>
                <Link
                  href={getHolidayPathByType(schedule.type, isEnglish ? 'en' : 'el')}
                  className="inline-flex items-center justify-center rounded-2xl border border-white/70 px-4 py-2.5 font-semibold tracking-wide text-white hover:bg-white/10 transition-colors"
                >
                  {isEnglish ? 'Share hours' : 'Κοινοποίηση ωραρίου'}
                </Link>
              </div>
            </div>
            <div className="text-sm text-white/80">
              {isEnglish ? 'Last updated:' : 'Τελευταία ενημέρωση:'}{' '}
              {schedule.updatedAt?.toDate?.()
                ? schedule.updatedAt.toDate().toLocaleDateString(isEnglish ? 'en-US' : 'el-GR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })
                : '-'}
            </div>
          </div>
        </div>

        {renderScheduleGrid()}
        {renderClosureDaysSection()}

        <div className="rounded-3xl border border-muted-foreground/10 p-6 bg-card shadow-sm space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {isEnglish ? 'Notes & best practices' : 'Σημειώσεις & οδηγίες'}
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
            <li>
              {isEnglish
                ? 'Please arrive 5-10 minutes earlier to keep the schedule running smoothly.'
                : 'Παρακαλούμε φτάστε 5-10 λεπτά νωρίτερα για να τηρείται το πρόγραμμα.'}
            </li>
            <li>
              {isEnglish
                ? 'Call us if you need to adjust or confirm your appointment during the festive period.'
                : 'Καλέστε μας αν χρειάζεστε αλλαγή ή επιβεβαίωση ραντεβού στην εορταστική περίοδο.'}
            </li>
            <li>
              {isEnglish
                ? 'Follow our Instagram stories for live updates when the salon is full.'
                : 'Δείτε τα Instagram stories για ζωντανές ενημερώσεις όταν το σαλόνι είναι γεμάτο.'}
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}


