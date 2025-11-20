import Link from "next/link";
import { Facebook, Instagram, Mail, Phone, MapPin, Clock3 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

const logo = "/assets/logo.png";
const logoWhite = "/assets/rizou_logo_white.png";

const Footer = () => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
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

  const operatingHours = hourKeys.map((key) => {
    const translation = t(key);
    const [day, ...rest] = translation.split(":");
    return {
      day: day.trim(),
      time: formatTimeValue(rest.join(":").trim())
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
                href="/services"
                className="inline-flex items-center justify-center rounded-full bg-primary/80 px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] hover:bg-primary"
              >
                {heroCopy.primaryCta}
              </Link>
              <a
                href="tel:+302106818011"
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-foreground/80 transition-all hover:bg-white/10"
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
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.45em] text-muted-foreground mb-5">
              {t("footer.quicklinks")}
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-3 font-medium transition-all hover:text-foreground"
                  >
                    <span className="h-px w-6 bg-muted-foreground/40 transition-all group-hover:w-10 group-hover:bg-primary" />
                    {link.label}
                  </Link>
                </li>
              ))}
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
            <div className="rounded-[28px] border border-white/15 bg-gradient-to-br from-white/[0.07] via-white/[0.04] to-transparent p-6 shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-foreground">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Clock3 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.45em] text-muted-foreground">
                      {language === "el" ? "Ωράριο" : "Opening Hours"}
                    </p>
                    <p className="text-base font-semibold">{todayLabel}</p>
                  </div>
                </div>
                <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.35em] text-muted-foreground/80">
                  {language === "el" ? "σαλόνι" : "salon"}
                </span>
              </div>
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/5 p-4">
                {operatingHours.map((entry, idx) => {
                  const isToday = idx === todayIndex;
                  return (
                    <div
                      key={entry.day}
                      className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm ${
                        isToday ? "bg-primary/10 text-primary font-semibold" : "text-foreground/80"
                      }`}
                    >
                      <span className="uppercase tracking-wide text-[11px]">{entry.day}</span>
                      <span>{entry.time}</span>
                    </div>
                  );
                })}
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