import Link from "next/link";
import { Facebook, Instagram, Mail, Phone, MapPin, Clock3 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useChristmasSchedule } from "@/hooks/useChristmasSchedule";
import { getLocalizedPath } from "@/lib/i18n-routes";
import { CookieSettingsButton } from "@/components/cookies-settings-button";
import NewsletterForm from "@/components/NewsletterForm";

const logo = "/assets/logo.png";
const logoWhite = "/assets/rizou_logo_white.png";

const Footer = () => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const { schedule: christmasSchedule, isActive: isChristmasActive, getHoursForDay, getHolidayStyle } = useChristmasSchedule();
  const holidayStyle = getHolidayStyle();
  
  // Helper to get style based on holiday type
  const getHolidayClass = (
    newyearClass: string,
    easterClass: string,
    otherClass: string,
    christmasClass: string,
    summerClass?: string,
  ) => {
    if (holidayStyle.type === 'newyear') return newyearClass;
    if (holidayStyle.type === 'easter') return easterClass;
    if (holidayStyle.type === 'other') return otherClass;
    if (holidayStyle.type === 'summer') return summerClass ?? otherClass;
    return christmasClass;
  };
  const renderHolidayIcon = (emojiClass = "text-xl", imageClass = "h-6 w-6") => {
    if (!holidayStyle.icon) return null;
    if (typeof holidayStyle.icon === "string") {
      return <span className={emojiClass}>{holidayStyle.icon}</span>;
    }
    return (
      <img
        src={holidayStyle.icon.src}
        alt={holidayStyle.icon.alt}
        className={`${imageClass} object-contain`}
      />
    );
  };
  const year = new Date().getFullYear();
  const isEnglish = language === "en";
  const rightsMessage = "All Rights Reserved.";
  const termsHref = isEnglish ? "/en/terms" : "/terms";
  const privacyHref = isEnglish ? "/en/privacy" : "/privacy";
  const termsLabel = isEnglish ? "Terms of Service" : "Όροι Χρήσης";
  const privacyLabel = isEnglish ? "Privacy Policy" : "Πολιτική Απορρήτου";

  const heroCopy =
    language === "el"
      ? {
          badge: "SIGNATURE CARE",
          title: "Ομορφιά με τελετουργία",
          subtitle:
            "Δημιουργούμε εμπειρίες ηρεμίας και high-touch περιποίησης με βάση την αυθεντική φιλοξενία.",
          primaryCta: "Ανακάλυψε τις υπηρεσίες",
          secondaryCta: "Κάλεσέ μας"
        }
      : {
          badge: "SIGNATURE CARE",
          title: "Beauty with ritual",
          subtitle:
            "We craft calming, high-touch experiences rooted in genuine hospitality.",
          primaryCta: "Explore services",
          secondaryCta: "Call the salon"
        };

  const navLinks = [
    { label: t("footer.services"), href: "/services" },
    { label: t("footer.gallery"), href: "/gallery" },
    { label: t("footer.about"), href: "/about" },
    { label: t("footer.booking"), href: "/booking" }
  ];

  const socials = [
    { label: "Facebook", href: "https://www.facebook.com", icon: Facebook },
    { label: "Instagram", href: "https://www.instagram.com", icon: Instagram }
  ];

  const hourKeys = [
    "contact.hours.monday",
    "contact.hours.tuesday",
    "contact.hours.wednesday",
    "contact.hours.thursday",
    "contact.hours.friday",
    "contact.hours.saturday",
    "contact.hours.sunday"
  ];

  const formatTimeValue = (value: string) => {
    if (!value) return value;
    if (language === "el") {
      return value;
    }

    const normalized = value.toLowerCase();
    if (normalized.includes("closed")) {
      return "Closed";
    }

    const [startRaw, endRaw] = value.split("-");
    const to24h = (segment?: string) => {
      if (!segment) return "";
      const match = segment.trim().match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
      if (!match) {
        return segment.trim();
      }
      let hours = parseInt(match[1], 10);
      const minutes = match[2] ?? "00";
      const meridiem = match[3]?.toLowerCase();

      if (meridiem === "pm" && hours < 12) {
        hours += 12;
      } else if (meridiem === "am" && hours === 12) {
        hours = 0;
      }

      return `${hours.toString().padStart(2, "0")}:${minutes}`;
    };

    const start = to24h(startRaw);
    const end = to24h(endRaw);

    if (!start && !end) {
      return value;
    }

    if (!start || !end) {
      return start || end;
    }

    return `${start} - ${end}`;
  };

    // Get operating hours - use Christmas schedule if active, otherwise use regular hours
    const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
    const operatingHours = hourKeys.map((key, index) => {
    const translation = t(key);
    const [day, ...rest] = translation.split(":");
      const dayKey = dayKeys[index];
      
      // If Christmas schedule is active, use it
      let time = formatTimeValue(rest.join(":").trim());
      if (isChristmasActive && christmasSchedule && dayKey) {
        const christmasHours = getHoursForDay(dayKey, language as 'el' | 'en');
        if (christmasHours) {
          time = christmasHours;
        }
      }
      
    return {
      day: day.trim(),
        time: time
    };
  });

  const todayIndex = (new Date().getDay() + 6) % 7;
  const todayLabel = language === "el" ? "Σήμερα" : "Today";

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-white/10 bg-gradient-to-b from-background via-background/96 to-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-0 h-80 w-80 rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute -bottom-40 left-6 h-96 w-96 rounded-full bg-accent/20 blur-[170px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.22),_transparent_55%)]" />
      </div>

      <div className="relative container-custom px-4 py-16 space-y-14">
        {/* Signature Card */}
        <div className="rounded-[32px] border border-white/20 bg-white/[0.05] p-8 md:p-10 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <span className="text-[11px] uppercase tracking-[0.6em] text-muted-foreground/80">
                {heroCopy.badge}
              </span>
              <h2 className="text-3xl md:text-4xl font-light text-foreground">
                {heroCopy.title}
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                {heroCopy.subtitle}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={getLocalizedPath("/services", language as 'el' | 'en')}
                className="inline-flex items-center justify-center rounded-lg bg-primary/90 hover:bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                {heroCopy.primaryCta}
              </Link>
              <a
                href="tel:+302106818011"
                className="inline-flex items-center justify-center rounded-lg border border-white/20 hover:border-white/30 px-5 py-2.5 text-sm font-medium text-foreground/90 dark:text-white/90 transition-all duration-300 hover:bg-white/5 dark:hover:bg-white/5 hover:scale-[1.02]"
              >
                {heroCopy.secondaryCta}
              </a>
            </div>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.2fr,1fr,1fr,1.1fr]">
          {/* Brand */}
          <div className="space-y-6">
            <div className="w-36">
              <img
                src={theme === "dark" ? logoWhite : logo}
                alt="Alexandra Rizou"
                className="w-full drop-shadow-2xl"
              />
            </div>
            <p className="text-base text-muted-foreground leading-relaxed max-w-sm">
              {t("footer.brand.desc")}
            </p>
            <div className="flex gap-3">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 backdrop-blur-lg transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/15"
                >
                  <Icon className="h-5 w-5 text-foreground/70 group-hover:text-primary" />
                </a>
              ))}
            </div>
            {/* Newsletter Form */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <NewsletterForm />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.45em] text-muted-foreground mb-5">
              {t("footer.quicklinks")}
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {navLinks.map((link) => {
                const isBooking = link.href === "/booking";
                return (
                <li key={link.href}>
                    {isBooking ? (
                      <div className="relative inline-block group">
                        <span className="group inline-flex items-center gap-3 font-medium opacity-75 cursor-not-allowed">
                          <span className="h-px w-6 bg-muted-foreground/40" />
                          {link.label}
                        </span>
                        <div className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap z-10 border border-white/20">
                          {t("comingSoon")}
                        </div>
                      </div>
                    ) : (
                  <Link
                        href={getLocalizedPath(link.href, language as 'el' | 'en')}
                    className="group inline-flex items-center gap-3 font-medium transition-all hover:text-foreground"
                  >
                    <span className="h-px w-6 bg-muted-foreground/40 transition-all group-hover:w-10 group-hover:bg-primary" />
                    {link.label}
                  </Link>
                    )}
                </li>
                );
              })}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.45em] text-muted-foreground mb-5">
              {t("footer.services.list")}
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>{t("footer.services.hair")}</li>
              <li>{t("footer.services.nails")}</li>
              <li>{t("footer.services.waxing")}</li>
              <li>{t("footer.services.facial")}</li>
            </ul>
          </div>

          {/* Contact + Hours */}
          <div className="space-y-5">
            <h3 className="text-xs uppercase tracking-[0.45em] text-muted-foreground">
              {t("footer.contact")}
            </h3>
            <div className="space-y-4 rounded-3xl border border-white/15 bg-white/[0.03] p-5 backdrop-blur-xl">
              <div className="flex items-start gap-3 text-sm text-foreground">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>Ανδρέα Παπανδρέου 52, Χαλάνδρι 152 32</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Phone className="h-4 w-4" />
                </div>
                <a href="tel:+302106818011" className="hover:text-primary transition-colors">
                  +30 210 6818 011
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Mail className="h-4 w-4" />
                </div>
                <a
                  href="mailto:ar.hairbeauty.healthservices@gmail.com"
                  className="break-all hover:text-primary transition-colors"
                >
                  ar.hairbeauty.healthservices@gmail.com
                </a>
              </div>
            </div>
            <div className={`rounded-[28px] border p-6 shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-2xl ${
              isChristmasActive
                ? getHolidayClass(
                    "border-yellow-300/30 bg-gradient-to-br from-yellow-50/10 via-white/[0.07] to-amber-50/10 dark:from-yellow-950/20 dark:via-slate-900/80 dark:to-amber-950/20 shadow-yellow-500/10",
                    "border-green-300/30 bg-gradient-to-br from-green-50/10 via-white/[0.07] to-pink-50/10 dark:from-green-950/20 dark:via-slate-900/80 dark:to-pink-950/20 shadow-green-500/10",
                    "border-purple-300/30 bg-gradient-to-br from-purple-50/10 via-white/[0.07] to-indigo-50/10 dark:from-purple-950/20 dark:via-slate-900/80 dark:to-indigo-950/20 shadow-purple-500/10",
                    "border-red-300/30 bg-gradient-to-br from-red-50/10 via-white/[0.07] to-green-50/10 dark:from-red-950/20 dark:via-slate-900/80 dark:to-green-950/20 shadow-red-500/10"
                  )
                : "border-white/15 bg-gradient-to-br from-white/[0.07] via-white/[0.04] to-transparent"
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-foreground">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                    isChristmasActive
                      ? getHolidayClass(
                          "bg-gradient-to-br from-yellow-500 to-amber-500 shadow-lg",
                          "bg-gradient-to-br from-green-500 to-pink-500 shadow-lg",
                          "bg-gradient-to-br from-purple-500 to-indigo-500 shadow-lg",
                          "bg-gradient-to-br from-red-500 to-green-500 shadow-lg"
                        )
                      : "bg-primary/10 text-primary"
                  }`}>
                    {isChristmasActive ? (
                      renderHolidayIcon("text-xl", "h-7 w-7")
                    ) : (
                      <Clock3 className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className={`text-[11px] uppercase tracking-[0.45em] ${
                      isChristmasActive
                        ? getHolidayClass(
                            "text-yellow-700 dark:text-yellow-300",
                            "text-green-700 dark:text-green-300",
                            "text-purple-700 dark:text-purple-300",
                            "text-red-700 dark:text-red-300"
                          )
                        : "text-muted-foreground"
                    }`}>
                      {isChristmasActive
                        ? (language === "el" ? holidayStyle.title?.el : holidayStyle.title?.en) || (language === "el" ? "Ωράριο" : "Opening Hours")
                        : (language === "el" ? "Ωράριο" : "Opening Hours")
                      }
                    </p>
                    <p className={`text-base font-semibold ${
                      isChristmasActive 
                        ? getHolidayClass(
                            "text-yellow-800 dark:text-yellow-200",
                            "text-green-800 dark:text-green-200",
                            "text-purple-800 dark:text-purple-200",
                            "text-red-800 dark:text-red-200"
                          )
                        : ""
                    }`}>
                      {todayLabel}
                    </p>
                  </div>
                </div>
                <span className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.35em] ${
                  isChristmasActive
                    ? getHolidayClass(
                        "border-yellow-300/50 bg-yellow-50/50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300",
                        "border-green-300/50 bg-green-50/50 dark:bg-green-950/30 text-green-700 dark:text-green-300",
                        "border-purple-300/50 bg-purple-50/50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300",
                        "border-red-300/50 bg-red-50/50 dark:bg-red-950/30 text-red-700 dark:text-red-300"
                      )
                    : "border-white/20 bg-white/5 text-muted-foreground/80"
                }`}>
                  {language === "el" ? "σαλόνι" : "salon"}
                </span>
              </div>
              <div className={`mt-4 rounded-2xl border p-4 ${
                isChristmasActive
                  ? getHolidayClass(
                      "border-yellow-200/30 dark:border-yellow-800/30 bg-yellow-50/20 dark:bg-yellow-950/10",
                      "border-green-200/30 dark:border-green-800/30 bg-green-50/20 dark:bg-green-950/10",
                      "border-purple-200/30 dark:border-purple-800/30 bg-purple-50/20 dark:bg-purple-950/10",
                      "border-red-200/30 dark:border-red-800/30 bg-red-50/20 dark:bg-red-950/10"
                    )
                  : "border-white/10 bg-black/5"
              }`}>
                {operatingHours.map((entry, idx) => {
                  const isToday = idx === todayIndex;
                  const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
                  const dayKey = dayKeys[idx];
                  const christmasDate = isChristmasActive && christmasSchedule?.dates?.[dayKey];
                  const formattedDate = christmasDate ? new Date(christmasDate).toLocaleDateString('el-GR', { day: 'numeric', month: 'numeric' }) : null;
                  
                  return (
                    <div
                      key={entry.day}
                      className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm gap-2 ${
                        isToday 
                          ? isChristmasActive
                            ? getHolidayClass(
                                "bg-gradient-to-r from-yellow-100/50 to-amber-100/50 dark:from-yellow-900/30 dark:to-amber-900/30 text-yellow-700 dark:text-yellow-300 font-semibold",
                                "font-semibold",
                                "bg-gradient-to-r from-purple-100/50 to-indigo-100/50 dark:from-purple-900/30 dark:to-indigo-900/30 text-purple-700 dark:text-purple-300 font-semibold",
                                "font-semibold"
                              )
                            : "bg-primary/10 text-primary font-semibold"
                          : isChristmasActive
                            ? getHolidayClass(
                                "text-yellow-800/90 dark:text-yellow-200/90",
                                "",
                                "text-purple-800/90 dark:text-purple-200/90",
                                ""
                              )
                            : "text-foreground/80"
                      }`}
                      style={isToday && isChristmasActive && (holidayStyle.type === 'christmas' || holidayStyle.type === 'easter') ? {
                        backgroundColor: `${holidayStyle.colors.accent}33`,
                        color: holidayStyle.colors.accent
                      } : !isToday && isChristmasActive && (holidayStyle.type === 'christmas' || holidayStyle.type === 'easter') ? {
                        color: `${holidayStyle.colors.accent}E6`
                      } : undefined}
                    >
                      <span className="uppercase tracking-wide text-[11px] flex items-center gap-1.5 flex-shrink-0 min-w-0">
                        {isChristmasActive && renderHolidayIcon("text-xs flex-shrink-0", "h-4 w-4 flex-shrink-0")}
                        <span className="whitespace-nowrap">{entry.day}</span>
                        {formattedDate && (
                          <span className={`text-[10px] font-semibold whitespace-nowrap flex-shrink-0 ${
                            isToday && isChristmasActive
                              ? getHolidayClass(
                                  "text-yellow-900 dark:text-yellow-100",
                                  "text-green-900 dark:text-green-100",
                                  "text-purple-900 dark:text-purple-100",
                                  "text-red-800 dark:text-red-200"
                                )
                              : getHolidayClass(
                                  "text-yellow-600 dark:text-yellow-400",
                                  "text-green-600 dark:text-green-400",
                                  "text-purple-600 dark:text-purple-400",
                                  "text-red-600 dark:text-red-400"
                                )
                          }`}>
                            {formattedDate}
                          </span>
                        )}
                      </span>
                      <span className={`whitespace-nowrap flex-shrink-0 ${
                        isChristmasActive && isToday 
                          ? getHolidayClass(
                              "text-yellow-800 dark:text-yellow-200",
                              "text-green-800 dark:text-green-200",
                              "text-purple-800 dark:text-purple-200",
                              "text-red-800 dark:text-red-200"
                            )
                          : ""
                      }`}>
                        {entry.time}
                      </span>
                    </div>
                  );
                })}

                {/* Closure Notices */}
                {isChristmasActive && christmasSchedule?.closureNotices && christmasSchedule.closureNotices.length > 0 && (
                  <div 
                    className={`mt-3 rounded-xl border p-3 space-y-2 ${
                      getHolidayClass(
                        "border-yellow-200/30 dark:border-yellow-800/30 bg-yellow-50/20 dark:bg-yellow-950/10",
                        "border-green-200/30 dark:border-green-800/30 bg-green-50/20 dark:bg-green-950/10",
                        "border-purple-200/30 dark:border-purple-800/30 bg-purple-50/20 dark:bg-purple-950/10",
                        "border-red-200/30 dark:border-red-800/30 bg-red-50/20 dark:bg-red-950/10"
                      )
                    }`}
                  >
                    <p 
                      className={`text-xs font-semibold ${
                        getHolidayClass(
                          "text-yellow-800 dark:text-yellow-200",
                          "text-green-800 dark:text-green-200",
                          "text-purple-800 dark:text-purple-200",
                          "text-red-800 dark:text-red-200"
                        )
                      }`}
                    >
                      {isEnglish ? 'The salon will remain closed:' : 'Το κατάστημα θα παραμείνει κλειστό:'}
                    </p>
                    {christmasSchedule.closureNotices.map((notice) => {
                      if (!notice.from && !notice.to) return null;
                      const formatDate = (value?: string, locale: 'el' | 'en' = 'el') => {
                        if (!value) return '';
                        const parsed = new Date(value);
                        if (Number.isNaN(parsed.getTime())) return '';
                        return parsed.toLocaleDateString(locale === 'en' ? 'en-US' : 'el-GR', { day: '2-digit', month: '2-digit' });
                      };
                      const fromDate = notice.from ? formatDate(notice.from, isEnglish ? 'en' : 'el') : '';
                      const toDate = notice.to ? formatDate(notice.to, isEnglish ? 'en' : 'el') : '';
                      if (!fromDate && !toDate) return null;
                      
                      return (
                        <p 
                          key={notice.id} 
                          className={`text-xs ${
                            getHolidayClass(
                              "text-yellow-700 dark:text-yellow-300",
                              "text-green-700 dark:text-green-300",
                              "text-purple-700 dark:text-purple-300",
                              "text-red-700 dark:text-red-300"
                            )
                          }`}
                        >
                          {fromDate && toDate
                            ? isEnglish
                              ? `From ${fromDate} to ${toDate}`
                              : `Από ${fromDate} έως ${toDate}`
                            : fromDate || toDate}
                        </p>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="footer-bottom flex flex-col gap-6 text-sm text-muted-foreground">
          <div className="footer-copyright w-full">
            <div className="flex flex-col items-center gap-1 text-center md:flex-row md:items-center md:justify-center md:gap-3 md:text-left">
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold tracking-[0.2em] text-muted-foreground/80 leading-none">
                <span
                  className="text-xs font-black text-foreground/80 leading-none relative"
                  style={{ top: "-0.02rem" }}
                >
                  ©
                </span>
                <span
                  className="acronweb-text-footer inline-flex items-baseline gap-[0.08rem] relative"
                  style={{ top: "-0.02rem" }}
                >
                  <span
                    className="acron-text-footer font-bold tracking-tight"
                    style={{
                      fontFamily: "'Quizlo', 'Paytone One', 'Outfit', 'Space Grotesk', 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                      fontWeight: 400,
                      letterSpacing: "-0.02em",
                      lineHeight: "1",
                      display: "inline-block",
                      verticalAlign: "baseline",
                      color: "#60a5fa"
                    }}
                  >
                    ACRON
                  </span>
                  <span
                    className="web-text-footer bg-gradient-to-br from-slate-900 via-slate-700 to-slate-800 dark:from-slate-50 dark:via-white dark:to-slate-100 bg-clip-text text-transparent"
                    style={{
                      fontFamily: "'Geogola', 'Gegola DEMO', 'Outfit', 'Space Grotesk', 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                      fontWeight: 800,
                      letterSpacing: "-0.02em",
                      lineHeight: "1",
                      display: "inline-block",
                      verticalAlign: "baseline",
                      textShadow: "0 2px 4px rgba(0,0,0,0.15)"
                    }}
                  >
                    WEB
                  </span>
                </span>
                <span
                  className="footer-separator text-lg font-light tracking-[0.2em]"
                  style={{
                    color: "hsl(var(--primary) / 0.7)",
                    fontFamily: "'Junicode', serif",
                    fontStyle: "italic",
                    lineHeight: "1"
                  }}
                >
                  ×
                </span>
                <span
                  className="tracking-[0.2em]"
                  style={{
                    fontFamily: "'Junicode', serif",
                    fontStyle: "italic",
                    fontWeight: 400,
                    color: "hsl(var(--primary))",
                    textTransform: "none"
                  }}
                >
                  Alexandra Rizou
                </span>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-[10px] tracking-[0.2em] text-muted-foreground/70 leading-none">
                <span className="footer-year-pill rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[9px] tracking-[0.15em] text-muted-foreground/90 leading-none">
                  {year}
                </span>
                <span className="inline-block h-3 w-px bg-muted-foreground/40 hidden md:block" />
                <span className="whitespace-nowrap">{rightsMessage}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center justify-center gap-4 text-sm flex-wrap">
              <Link
                href={termsHref}
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                {termsLabel}
              </Link>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <Link
                href={privacyHref}
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                {privacyLabel}
              </Link>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <CookieSettingsButton language={language} />
            </div>

            <div className="flex flex-col items-center gap-4 md:flex-row">
              <div className="footer-logo-group relative overflow-hidden rounded-lg border border-gray-200/80 bg-gradient-to-r from-white/95 via-white/90 to-gray-50/95 px-3 py-2 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-md dark:border-gray-600/80 dark:from-gray-800/95 dark:via-gray-800/90 dark:to-gray-700/95">
                <div className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-r from-blue-50/30 via-transparent to-blue-50/30 dark:from-blue-900/20 dark:via-transparent dark:to-blue-900/20" />
                <div className="relative z-10 flex items-center gap-2">
                  <span
                    className="text-[0.65rem] font-semibold text-gray-600 dark:text-gray-300"
                    style={{
                      fontFamily: "'Chillax', 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                      letterSpacing: "0.04em",
                      textTransform: "none"
                    }}
                  >
                    Powered and developed by
                  </span>
                  <div className="hidden h-4 w-px bg-gray-300 dark:bg-gray-600 md:block" />
                  <a
                    href="https://www.acronweb.gr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 transition-all duration-300 hover:opacity-80"
                  >
                    <svg
                      data-logo="logo"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 41 41"
                      className="h-4 w-4 flex-shrink-0 transition-all duration-300"
                    >
                      <defs>
                        <linearGradient id="footerBlueGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#0284c7" />
                          <stop offset="50%" stopColor="#0ea5e9" />
                          <stop offset="100%" stopColor="#38bdf8" />
                        </linearGradient>
                        <linearGradient id="footerBlueGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#38bdf8" />
                          <stop offset="50%" stopColor="#0ea5e9" />
                          <stop offset="100%" stopColor="#0369a1" />
                        </linearGradient>
                      </defs>
                      <g id="logogram" transform="translate(0, 0) rotate(0)">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M20.9053 40.0799C31.951 40.0799 40.9053 31.1256 40.9053 20.0799C40.9053 9.03427 31.951 0.0799561 20.9053 0.0799561C9.85956 0.0799561 0.905273 9.03427 0.905273 20.0799C0.905273 31.1256 9.85956 40.0799 20.9053 40.0799ZM27.1446 9.3968C27.4483 8.31801 26.4014 7.68008 25.4453 8.36125L12.0984 17.8695C11.0615 18.6082 11.2246 20.0799 12.3434 20.0799H15.858V20.0527H22.7078L17.1265 22.022L14.666 30.7631C14.3623 31.8419 15.4091 32.4798 16.3653 31.7986L29.7122 22.2904C30.7491 21.5517 30.5859 20.0799 29.4672 20.0799H24.1374L27.1446 9.3968Z"
                          className="fill-[url(#footerBlueGradientLight)] dark:fill-[url(#footerBlueGradientDark)]"
                        />
                      </g>
                    </svg>
                    <span className="acronweb-text-footer inline-flex items-baseline gap-[0.1rem]">
                      <span
                        className="acron-text-footer font-bold tracking-tight"
                        style={{
                          fontFamily: "'Quizlo', 'Paytone One', 'Outfit', 'Space Grotesk', 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                          fontWeight: 400,
                          letterSpacing: "-0.02em",
                          lineHeight: "1",
                          display: "inline-block",
                          verticalAlign: "baseline",
                          color: "#60a5fa"
                        }}
                      >
                        ACRON
                      </span>
                      <span
                        className="web-text-footer bg-gradient-to-br from-slate-900 via-slate-700 to-slate-800 dark:from-slate-50 dark:via-white dark:to-slate-100 bg-clip-text text-transparent"
                        style={{
                          fontFamily: "'Geogola', 'Gegola DEMO', 'Outfit', 'Space Grotesk', 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                          fontWeight: 800,
                          letterSpacing: "-0.02em",
                          lineHeight: "1",
                          display: "inline-block",
                          verticalAlign: "baseline",
                          textShadow: "0 2px 4px rgba(0,0,0,0.15)"
                        }}
                      >
                        WEB
                      </span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;