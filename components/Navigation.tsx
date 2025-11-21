"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Facebook, Instagram, MapPin, Clock3, X, Mail, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useMobileNav } from "@/hooks/useMobileNav";

const logo = "/assets/logo.png";
const logoWhite = "/assets/rizou_logo_white.png";

// SVG Icons Components
const ServicesIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 26 26" fill="currentColor" className={className}>
    <g fill="currentColor">
      <path d="M26 14c0 6.627-5.373 12-12 12S2 20.627 2 14S7.373 2 14 2s12 5.373 12 12Z" opacity=".2"/>
      <path fillRule="evenodd" d="M8.5 11.5a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm0-5a2 2 0 1 1 0 4a2 2 0 0 1 0-4Zm0 15a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm0-5a2 2 0 1 1 0 4a2 2 0 0 1 0-4Z" clipRule="evenodd"/>
      <path d="M19.978 18.782a.5.5 0 0 1-.697.718l-8.876-8.627a.5.5 0 1 1 .697-.717l8.876 8.626Z"/>
      <path d="M10.146 16.146a.5.5 0 0 0 .708.708l9-9a.5.5 0 0 0-.708-.708l-9 9Z"/>
      <path fillRule="evenodd" d="M13 24.5c6.351 0 11.5-5.149 11.5-11.5S19.351 1.5 13 1.5S1.5 6.649 1.5 13S6.649 24.5 13 24.5Zm0 1c6.904 0 12.5-5.596 12.5-12.5S19.904.5 13 .5S.5 6.096.5 13S6.096 25.5 13 25.5Z" clipRule="evenodd"/>
    </g>
  </svg>
);

const GalleryIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <g fill="currentColor">
      <path d="M18 8a2 2 0 1 1-4 0a2 2 0 0 1 4 0Z"/>
      <path fillRule="evenodd" d="M11.943 1.25h.114c2.309 0 4.118 0 5.53.19c1.444.194 2.584.6 3.479 1.494c.895.895 1.3 2.035 1.494 3.48c.19 1.411.19 3.22.19 5.529v.088c0 1.909 0 3.471-.104 4.743c-.104 1.28-.317 2.347-.795 3.235c-.21.391-.47.742-.785 1.057c-.895.895-2.035 1.3-3.48 1.494c-1.411.19-3.22.19-5.529.19h-.114c-2.309 0-4.118 0-5.53-.19c-1.444-.194-2.584-.6-3.479-1.494c-.793-.793-1.203-1.78-1.42-3.006c-.215-1.203-.254-2.7-.262-4.558c-.002-.473-.002-.973-.002-1.501v-.058c0-2.309 0-4.118.19-5.53c.194-1.444.6-2.584 1.494-3.479c.895-.895 2.035-1.3 3.48-1.494c1.411-.19 3.22-.19 5.529-.19Zm-5.33 1.676c-1.278.172-2.049.5-2.618 1.069c-.57.57-.897 1.34-1.069 2.619c-.174 1.3-.176 3.008-.176 5.386c0 .529 0 1.026.002 1.495c.008 1.874.05 3.246.238 4.303c.184 1.035.498 1.7 1.005 2.207c.57.57 1.34.897 2.619 1.069c1.3.174 3.008.176 5.386.176s4.086-.002 5.386-.176c1.279-.172 2.05-.5 2.62-1.069c.21-.21.381-.442.524-.707c.332-.616.523-1.44.621-2.645c.098-1.205.099-2.707.099-4.653c0-2.378-.002-4.086-.176-5.386c-.172-1.279-.5-2.05-1.069-2.62c-.57-.569-1.34-.896-2.619-1.068c-1.3-.174-3.008-.176-5.386-.176s-4.086.002-5.386.176Z" clipRule="evenodd"/>
      <path d="m20.607 19.146l-2.83-2.547a3 3 0 0 0-3.732-.225l-.299.21a2 2 0 0 1-2.564-.222l-4.29-4.29a2.3 2.3 0 0 0-3.14-.104l-1.002.876l.002.65c.008 1.875.05 3.247.238 4.304c.185 1.035.498 1.7 1.005 2.207c.57.57 1.34.897 2.619 1.069c1.3.174 3.008.176 5.386.176s4.087-.002 5.387-.176c1.278-.172 2.049-.5 2.618-1.069a2.995 2.995 0 0 0 .602-.859Z" opacity=".4"/>
    </g>
  </svg>
);

const AboutIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 26 26" fill="currentColor" className={className}>
    <g fill="currentColor">
      <path fillRule="evenodd" d="M13.5 26C20.404 26 26 20.404 26 13.5S20.404 1 13.5 1S1 6.596 1 13.5S6.596 26 13.5 26Zm0-2C19.299 24 24 19.299 24 13.5S19.299 3 13.5 3S3 7.701 3 13.5S7.701 24 13.5 24Z" clipRule="evenodd" opacity=".2"/>
      <g opacity=".2">
        <path d="M15.739 20.213a2 2 0 1 1-4 0a2 2 0 0 1 4 0Z"/>
        <path fillRule="evenodd" d="M13.71 8.765c-.67 0-1.245.2-1.65.486c-.39.276-.583.597-.639.874a1.45 1.45 0 0 1-2.842-.574c.227-1.126.925-2.045 1.809-2.67c.92-.65 2.086-1.016 3.322-1.016c2.557 0 5.208 1.71 5.208 4.456c0 1.59-.945 2.876-2.169 3.626a1.45 1.45 0 1 1-1.514-2.474c.57-.349.783-.794.783-1.152c0-.574-.715-1.556-2.308-1.556Z" clipRule="evenodd"/>
        <path fillRule="evenodd" d="M13.71 12.63c.8 0 1.45.648 1.45 1.45v1.502a1.45 1.45 0 1 1-2.9 0V14.08c0-.8.649-1.45 1.45-1.45Z" clipRule="evenodd"/>
        <path fillRule="evenodd" d="M17.239 11.966a1.45 1.45 0 0 1-.5 1.99l-2.284 1.367a1.45 1.45 0 0 1-1.49-2.488l2.285-1.368a1.45 1.45 0 0 1 1.989.5Z" clipRule="evenodd"/>
      </g>
      <path d="M14 19.25a1.25 1.25 0 1 1-2.5 0a1.25 1.25 0 0 1 2.5 0Z"/>
      <path fillRule="evenodd" d="M12.71 7.065c-.807 0-1.524.24-2.053.614c-.51.36-.825.826-.922 1.308a.75.75 0 1 1-1.47-.297c.186-.922.762-1.696 1.526-2.236c.796-.562 1.82-.89 2.919-.89c2.325 0 4.508 1.535 4.508 3.757c0 1.292-.768 2.376-1.834 3.029a.75.75 0 0 1-.784-1.28c.729-.446 1.118-1.093 1.118-1.749c0-1.099-1.182-2.256-3.008-2.256Zm0 5.265a.75.75 0 0 1 .75.75v1.502a.75.75 0 1 1-1.5 0V13.08a.75.75 0 0 1 .75-.75Z" clipRule="evenodd"/>
      <path fillRule="evenodd" d="M15.638 11.326a.75.75 0 0 1-.258 1.029l-2.285 1.368a.75.75 0 1 1-.77-1.287l2.285-1.368a.75.75 0 0 1 1.028.258Z" clipRule="evenodd"/>
      <path fillRule="evenodd" d="M13 24.5c6.351 0 11.5-5.149 11.5-11.5S19.351 1.5 13 1.5S1.5 6.649 1.5 13S6.649 24.5 13 24.5Zm0 1c6.904 0 12.5-5.596 12.5-12.5S19.904.5 13 .5S.5 6.096.5 13S6.096 25.5 13 25.5Z" clipRule="evenodd"/>
    </g>
  </svg>
);

const ContactIcon = ({ className }: { className?: string }) => (
  <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="M7.5 12.5h1m2.5 0h1m2.5 0h1m-8 3h1m2.5 0h1m2.5 0h1m-8 3h1m2.5 0h1m2.5 0h1m4-6v8.387l-8 1.613l-8-1.613V12.5m10-6l2 3H19L22.5 6L19 2.5H4L.5 6L4 9.5h3.5l2-3z"/>
  </svg>
);

const Navigation = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const {
    isOpen,
    isMenuRendered,
    isMenuVisible,
    closeMenu,
    setIsOpen
  } = useMobileNav();
  const [isScrolled, setIsScrolled] = useState(() => !isHomePage);
  const heroHeightRef = useRef(0);
  const scrollFrame = useRef<number | null>(null);
  const {
    language,
    toggleLanguage,
    t
  } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  // Detect scroll position only on home page
  useEffect(() => {
    if (!isHomePage) {
      setIsScrolled(true);
      return;
    }

    heroHeightRef.current = window.innerHeight;

    const updateScrollState = () => {
      const threshold = heroHeightRef.current || window.innerHeight;
      const next = window.scrollY > threshold * 0.8;
      setIsScrolled((prev) => (prev === next ? prev : next));
    };

    const handleScroll = () => {
      if (scrollFrame.current !== null) {
        cancelAnimationFrame(scrollFrame.current);
      }
      scrollFrame.current = window.requestAnimationFrame(updateScrollState);
    };

    const handleResize = () => {
      heroHeightRef.current = window.innerHeight;
      updateScrollState();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    updateScrollState();

    return () => {
      if (scrollFrame.current !== null) {
        cancelAnimationFrame(scrollFrame.current);
        scrollFrame.current = null;
      }
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [isHomePage]);

  const navLinks = [
    {
      name: t("nav.services"),
      path: "/services",
      icon: ServicesIcon
    },
    {
      name: t("nav.gallery"),
      path: "/gallery",
      icon: GalleryIcon
    },
    {
      name: t("nav.about"),
      path: "/about",
      icon: AboutIcon
    },
    {
      name: t("nav.contact"),
      path: "/contact",
      icon: ContactIcon
    }
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

  const operatingHours = hourKeys.map((key) => {
    const translation = t(key);
    const [day, ...rest] = translation.split(":");
    return {
      day: day.trim(),
      time: rest.join(":").trim() || ""
    };
  });

  const todayIndex = ((new Date().getDay() + 6) % 7);
  const todayLabel = language === "el" ? "Σήμερα" : "Today";
  const year = new Date().getFullYear();
  const rightsMessage = "All Rights Reserved.";

  const isActive = (path: string) => pathname === path;


  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-4 pt-4">
      {/* Floating Glass Container */}
      <div className="max-w-7xl mx-auto">
        <div
          className="relative transition-all duration-300"
          style={{
            background: "rgba(255, 255, 255, 0.16)",
            borderRadius: "16px",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(10.3px)",
            WebkitBackdropFilter: "blur(10.3px)",
            ...(theme === "dark" && {
              background: "rgba(0, 0, 0, 0.4)",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
            }),
          }}
        >

          <div className="relative px-6 py-1"> {/* Slim padding - reduced from py-2 */}
            <div className="flex items-center justify-between h-12 md:h-14"> {/* Reduced height on mobile */}
              {/* Logo */}
              <Link href="/" className="relative flex items-center justify-center md:justify-center justify-start w-24 h-full group z-50 -ml-6 md:ml-0">
                <img
                  src={theme === "dark" || (isHomePage && !isScrolled) ? logoWhite : logo}
                  alt="Alexandra Rizou"
                  className="absolute h-16 md:h-20 w-auto max-w-none object-contain transition-all duration-500 group-hover:scale-105 drop-shadow-lg left-0 md:left-auto"
                />
              </Link>

              {/* Desktop Navigation - Luxury Minimal */}
              <div className="hidden md:flex items-center gap-6">
                {navLinks.map(link => {
                  const Icon = link.icon;
                  const active = isActive(link.path);
                  const isWhiteNav = isHomePage && !isScrolled;
                  return (
                    <Link
                      key={link.path}
                      href={link.path}
                      className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-500 ease-out ${
                        active
                          ? isWhiteNav 
                            ? "bg-white/10 text-white"
                            : "bg-primary/10 text-primary"
                          : isWhiteNav
                            ? "text-white/70 hover:text-white hover:bg-white/5"
                            : "text-foreground/70 hover:text-foreground hover:bg-primary/5"
                      }`}
                    >
                      {/* Animated Background */}
                      <div className={`absolute inset-0 rounded-lg transition-all duration-500 ease-out ${
                        active
                          ? isWhiteNav
                            ? "bg-white/10 opacity-100 scale-100"
                            : "bg-primary/10 opacity-100 scale-100"
                          : isWhiteNav
                            ? "bg-white/5 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100"
                            : "bg-primary/10 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100"
                      }`} />
                      
                      <Icon className={`relative z-10 w-4 h-4 transition-all duration-500 ease-out ${
                        active
                          ? isWhiteNav
                            ? "text-white scale-110 rotate-0"
                            : "text-primary scale-110 rotate-0"
                          : isWhiteNav
                            ? "text-white/60 group-hover:text-white group-hover:scale-110 group-hover:rotate-12"
                            : "text-foreground/60 group-hover:text-primary group-hover:scale-110 group-hover:rotate-12"
                      }`} />
                      <span className={`
                        relative z-10 text-sm font-semibold tracking-wide transition-all duration-500 ease-out
                        ${active
                          ? isWhiteNav
                            ? "text-white translate-x-0"
                            : "text-primary translate-x-0"
                          : isWhiteNav
                            ? "text-white/70 group-hover:text-white group-hover:translate-x-0.5"
                            : "text-foreground/70 group-hover:text-foreground group-hover:translate-x-0.5"
                        }
                      `}>
                        {link.name}
                      </span>

                      {/* Animated Active Indicator Line */}
                      <span className={`absolute -bottom-0.5 left-1/2 h-0.5 rounded-full -translate-x-1/2 transition-all duration-500 ease-in-out ${
                        active
                          ? isWhiteNav
                            ? "w-8 opacity-100 bg-white"
                            : "w-8 opacity-100 bg-primary"
                          : "w-0 opacity-0"
                      }`} />
                    </Link>
                  );
                })}
              </div>

              {/* Desktop Actions */}
              <div className="hidden md:flex items-center space-x-2">
                {/* Phone Bubble */}
                <a 
                  href="tel:+302106818011"
                  className={`group relative flex items-center gap-2 h-9 px-3 rounded-full backdrop-blur-md border transition-all duration-300 hover:scale-105 ${
                    isScrolled 
                      ? 'bg-foreground/10 border-foreground/20 hover:bg-foreground/20 hover:border-foreground/30' 
                      : 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30'
                  }`}
                >
                  <Phone className={`h-4 w-4 transition-colors ${
                    isScrolled 
                      ? 'text-foreground group-hover:text-primary' 
                      : 'text-white group-hover:text-primary'
                  }`} />
                  <span className={`text-[10px] tracking-tight leading-none whitespace-nowrap font-medium transition-colors hidden lg:inline ${
                    isScrolled 
                      ? 'text-foreground group-hover:text-primary' 
                      : 'text-white group-hover:text-primary'
                  }`}>
                    +30 210 6818 011
                  </span>
                </a>

                {/* Email Bubble */}
                <a 
                  href="mailto:ar.hairbeauty.healthservices@gmail.com"
                  className={`group relative h-9 w-9 rounded-full backdrop-blur-md border transition-all duration-300 hover:scale-110 flex items-center justify-center ${
                    isScrolled 
                      ? 'bg-foreground/10 border-foreground/20 hover:bg-foreground/20 hover:border-foreground/30' 
                      : 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30'
                  }`}
                >
                  <Mail className={`h-4 w-4 transition-colors ${
                    isScrolled 
                      ? 'text-foreground group-hover:text-primary' 
                      : 'text-white group-hover:text-primary'
                  }`} />
                </a>

                {/* Social Media Bubbles */}
                <a 
                  href="https://www.facebook.com/p/AR-Hair-Beauty-Health-Services-100087760983195/?locale=el_GR" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`group h-9 w-9 rounded-full backdrop-blur-md border transition-all duration-300 hover:scale-110 flex items-center justify-center ${
                    isScrolled 
                      ? 'bg-foreground/10 border-foreground/20 hover:bg-blue-500/20 hover:border-blue-400/40' 
                      : 'bg-white/10 border-white/20 hover:bg-blue-500/20 hover:border-blue-400/40'
                  }`}
                >
                  <Facebook className={`h-4 w-4 transition-colors ${
                    isScrolled 
                      ? 'text-foreground group-hover:text-blue-400' 
                      : 'text-white group-hover:text-blue-400'
                  }`} />
                </a>

                <a 
                  href="https://www.instagram.com/ar_hairbeauty_healthservices/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`group h-9 w-9 rounded-full backdrop-blur-md border transition-all duration-300 hover:scale-110 flex items-center justify-center ${
                    isScrolled 
                      ? 'bg-foreground/10 border-foreground/20 hover:bg-pink-500/20 hover:border-pink-400/40' 
                      : 'bg-white/10 border-white/20 hover:bg-pink-500/20 hover:border-pink-400/40'
                  }`}
                >
                  <Instagram className={`h-4 w-4 transition-colors ${
                    isScrolled 
                      ? 'text-foreground group-hover:text-pink-400' 
                      : 'text-white group-hover:text-pink-400'
                  }`} />
                </a>

                <div className={`h-6 w-px mx-1 transition-colors ${
                  isScrolled ? 'bg-foreground/20' : 'bg-white/20'
                }`} />

                {/* Dark Mode Toggle */}
                <div className="relative">
                  <button
                    onClick={toggleTheme}
                    className={`group relative h-9 w-9 rounded-full backdrop-blur-md border transition-all duration-300 hover:scale-110 flex items-center justify-center overflow-hidden ${
                      isScrolled 
                        ? 'bg-foreground/10 border-foreground/30 hover:bg-primary/20 hover:border-primary/50' 
                        : 'bg-white/10 border-white/30 hover:bg-primary/20 hover:border-primary/50'
                    } ${theme === "dark" ? 'bg-primary/15 border-primary/40' : ''}`}
                    aria-label="Toggle dark mode"
                  >
                    <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                      theme === "dark" 
                        ? 'bg-primary/20 group-hover:bg-primary/30' 
                        : 'bg-primary/0 group-hover:bg-primary/10'
                    }`} />
                    <div className="relative z-10 flex items-center justify-center">
                      {theme === "dark" ? (
                        <Sun className={`h-4 w-4 transition-all duration-500 rotate-0 ${
                          isScrolled 
                            ? 'text-primary group-hover:text-primary group-hover:rotate-180' 
                            : 'text-white group-hover:text-primary group-hover:rotate-180'
                        }`} />
                      ) : (
                        <Moon className={`h-4 w-4 transition-all duration-500 rotate-0 ${
                          isScrolled 
                            ? 'text-foreground group-hover:text-primary group-hover:rotate-12' 
                            : 'text-white group-hover:text-primary group-hover:rotate-12'
                        }`} />
                      )}
                    </div>
                  </button>
                </div>

                <div className="relative">
                  <button
                    onClick={toggleLanguage}
                    className={`group relative h-9 w-9 rounded-full backdrop-blur-md border transition-all duration-300 hover:scale-110 flex items-center justify-center overflow-hidden ${
                      isScrolled 
                        ? 'bg-foreground/10 border-foreground/30 hover:bg-primary/20 hover:border-primary/50' 
                        : 'bg-white/10 border-white/30 hover:bg-primary/20 hover:border-primary/50'
                    }`}
                    aria-label="Toggle language"
                  >
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 rounded-full transition-colors duration-300" />
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="relative z-10">
                      <path fill="currentColor" d="M21.056 12h-2a1 1 0 0 0 0 2v2H17.87a2.965 2.965 0 0 0 .185-1a3 3 0 0 0-5.598-1.5a1 1 0 1 0 1.732 1a1 1 0 0 1 .866-.5a1 1 0 0 1 0 2a1 1 0 0 0 0 2a1 1 0 1 1 0 2a1 1 0 0 1-.866-.5a1 1 0 1 0-1.732 1a3 3 0 0 0 5.598-1.5a2.965 2.965 0 0 0-.185-1h1.185v3a1 1 0 0 0 2 0v-7a1 1 0 1 0 0-2Zm-11.97-.757a1 1 0 1 0 1.94-.486l-1.757-7.03a2.28 2.28 0 0 0-4.425 0l-1.758 7.03a1 1 0 1 0 1.94.486L5.585 9h2.94ZM6.086 7l.697-2.787a.292.292 0 0 1 .546 0L8.026 7Zm7.97 0h1a1.001 1.001 0 0 1 1 1v1a1 1 0 0 0 2 0V8a3.003 3.003 0 0 0-3-3h-1a1 1 0 0 0 0 2Zm-4 9h-1a1.001 1.001 0 0 1-1-1v-1a1 1 0 0 0-2 0v1a3.003 3.003 0 0 0 3 3h1a1 1 0 0 0 0-2Z" className={`transition-colors ${
                      isScrolled 
                        ? 'text-foreground group-hover:text-primary' 
                        : 'text-white group-hover:text-primary'
                    }`} />
                    </svg>
                  </button>
                  <div className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-primary text-white text-[8px] font-bold flex items-center justify-center border border-white/30 shadow-md">
                    {language === "el" ? "EN" : "ΕΛ"}
                  </div>
                </div>
                <div className="relative group">
                  <Button 
                    disabled 
                    className="h-9 px-5 text-sm font-medium rounded-full bg-primary/50 text-primary-foreground/70 cursor-not-allowed shadow-md opacity-75"
                  >
                    {t("nav.bookNow")}
                  </Button>
                  <div className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap border border-white/20">
                    Έρχεται σύντομα
                  </div>
                </div>
              </div>

              {/* Mobile Menu & Language Button */}
              <div className="md:hidden flex items-center space-x-2">
                {/* Social Media Bubbles */}
                <a 
                  href="https://www.facebook.com/p/AR-Hair-Beauty-Health-Services-100087760983195/?locale=el_GR" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`group h-9 w-9 rounded-full backdrop-blur-sm border transition-all duration-300 hover:scale-110 flex items-center justify-center ${
                    isScrolled 
                      ? 'bg-foreground/10 border-foreground/20 hover:bg-blue-500/20 hover:border-blue-400/40' 
                      : 'bg-white/10 border-white/20 hover:bg-blue-500/20 hover:border-blue-400/40'
                  }`}
                >
                  <Facebook className={`h-4 w-4 transition-colors ${
                    isScrolled 
                      ? 'text-foreground group-hover:text-blue-400' 
                      : 'text-white group-hover:text-blue-400'
                  }`} />
                </a>

                <a 
                  href="https://www.instagram.com/ar_hairbeauty_healthservices/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`group h-9 w-9 rounded-full backdrop-blur-sm border transition-all duration-300 hover:scale-110 flex items-center justify-center ${
                    isScrolled 
                      ? 'bg-foreground/10 border-foreground/20 hover:bg-pink-500/20 hover:border-pink-400/40' 
                      : 'bg-white/10 border-white/20 hover:bg-pink-500/20 hover:border-pink-400/40'
                  }`}
                >
                  <Instagram className={`h-4 w-4 transition-colors ${
                    isScrolled 
                      ? 'text-foreground group-hover:text-pink-400' 
                      : 'text-white group-hover:text-pink-400'
                  }`} />
                </a>

                <div className={`h-6 w-px mx-1 transition-colors ${
                  isScrolled ? 'bg-foreground/20' : 'bg-white/20'
                }`} />

                {/* Dark Mode Toggle */}
                <div className="relative">
                  <button
                    onClick={toggleTheme}
                    className={`group relative h-9 w-9 rounded-full backdrop-blur-sm border transition-all duration-300 hover:scale-110 flex items-center justify-center overflow-hidden ${
                      isScrolled 
                        ? 'bg-foreground/10 border-foreground/30 hover:bg-primary/20 hover:border-primary/50' 
                        : 'bg-white/10 border-white/30 hover:bg-primary/20 hover:border-primary/50'
                    } ${theme === "dark" ? 'bg-primary/15 border-primary/40' : ''}`}
                    aria-label="Toggle dark mode"
                  >
                    <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                      theme === "dark" 
                        ? 'bg-primary/20 group-hover:bg-primary/30' 
                        : 'bg-primary/0 group-hover:bg-primary/10'
                    }`} />
                    <div className="relative z-10 flex items-center justify-center">
                      {theme === "dark" ? (
                        <Sun className={`h-4 w-4 transition-all duration-500 rotate-0 ${
                          isScrolled 
                            ? 'text-primary group-hover:text-primary group-hover:rotate-180' 
                            : 'text-white group-hover:text-primary group-hover:rotate-180'
                        }`} />
                      ) : (
                        <Moon className={`h-4 w-4 transition-all duration-500 rotate-0 ${
                          isScrolled 
                            ? 'text-foreground group-hover:text-primary group-hover:rotate-12' 
                            : 'text-white group-hover:text-primary group-hover:rotate-12'
                        }`} />
                      )}
                    </div>
                  </button>
                </div>
                <div className="relative">
                  <button
                    onClick={toggleLanguage}
                    className={`group relative h-9 w-9 rounded-full backdrop-blur-sm border transition-all duration-300 hover:scale-110 flex items-center justify-center overflow-hidden ${
                      isScrolled 
                        ? 'bg-foreground/10 border-foreground/30 hover:bg-primary/20 hover:border-primary/50' 
                        : 'bg-white/10 border-white/30 hover:bg-primary/20 hover:border-primary/50'
                    }`}
                    aria-label="Toggle language"
                  >
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 rounded-full transition-colors duration-300" />
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="relative z-10">
                      <path fill="currentColor" d="M21.056 12h-2a1 1 0 0 0 0 2v2H17.87a2.965 2.965 0 0 0 .185-1a3 3 0 0 0-5.598-1.5a1 1 0 1 0 1.732 1a1 1 0 0 1 .866-.5a1 1 0 0 1 0 2a1 1 0 0 0 0 2a1 1 0 1 1 0 2a1 1 0 0 1-.866-.5a1 1 0 1 0-1.732 1a3 3 0 0 0 5.598-1.5a2.965 2.965 0 0 0-.185-1h1.185v3a1 1 0 0 0 2 0v-7a1 1 0 1 0 0-2Zm-11.97-.757a1 1 0 1 0 1.94-.486l-1.757-7.03a2.28 2.28 0 0 0-4.425 0l-1.758 7.03a1 1 0 1 0 1.94.486L5.585 9h2.94ZM6.086 7l.697-2.787a.292.292 0 0 1 .546 0L8.026 7Zm7.97 0h1a1.001 1.001 0 0 1 1 1v1a1 1 0 0 0 2 0V8a3.003 3.003 0 0 0-3-3h-1a1 1 0 0 0 0 2Zm-4 9h-1a1.001 1.001 0 0 1-1-1v-1a1 1 0 0 0-2 0v1a3.003 3.003 0 0 0 3 3h1a1 1 0 0 0 0-2Z" className={`transition-colors ${
                        isScrolled 
                          ? 'text-foreground group-hover:text-primary' 
                          : 'text-white group-hover:text-primary'
                      }`} />
                    </svg>
                  </button>
                  <div className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-primary text-white text-[8px] font-bold flex items-center justify-center border border-white/30 shadow-md">
                    {language === "el" ? "EN" : "ΕΛ"}
                  </div>
                </div>
                <div className="relative z-[110]">
                  <input 
                    id="mobile-menu-checkbox" 
                    type="checkbox"
                    checked={isOpen}
                    onChange={(e) => setIsOpen(e.target.checked)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`group relative h-9 w-9 rounded-lg backdrop-blur-sm border transition-all duration-300 hover:scale-110 flex items-center justify-center overflow-hidden ${
                      isScrolled 
                        ? 'bg-foreground/10 border-foreground/30 hover:bg-primary/20 hover:border-primary/50' 
                        : 'bg-white/10 border-white/30 hover:bg-primary/20 hover:border-primary/50'
                    } ${isOpen ? 'bg-primary/20 border-primary/50' : ''}`}
                    aria-label="Toggle menu"
                  >
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 rounded-lg transition-colors duration-300" />
                    <div className="relative z-10 flex flex-col items-center justify-center gap-1 w-5 h-5">
                      <div 
                        className={`h-1 w-full rounded-full bg-current transition-all duration-300 ease-in-out ${
                          isScrolled 
                            ? 'text-foreground group-hover:text-primary' 
                            : 'text-white group-hover:text-primary'
                        } ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}
                        style={{ 
                          transformOrigin: 'center',
                        }}
                      />
                      <div 
                        className={`h-1 w-full rounded-full bg-current transition-all duration-300 ease-in-out ${
                          isScrolled 
                            ? 'text-foreground group-hover:text-primary' 
                            : 'text-white group-hover:text-primary'
                        } ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}
                        style={{ 
                          transformOrigin: 'center',
                        }}
                      />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ultra-Modern Mobile Menu - Ανεξάρτητο Component */}
      {isMenuRendered && (
        <div
          className={`fixed inset-0 z-[99999] md:hidden ${
            isMenuVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          style={{
            willChange: isMenuVisible ? 'opacity' : 'auto',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            isolation: 'isolate',
            contain: 'layout style paint',
            // Εξασφάλιση ότι είναι πάνω από όλα
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
          aria-hidden={!isOpen}
        >
          {/* Solid Backdrop Overlay - Κρύβει ΤΕΛΕΙΩΣ όλα τα πάνω από πίσω */}
          <div 
            className="absolute inset-0 bg-background"
            onClick={closeMenu}
            aria-hidden="true"
            style={{
              transform: 'translateZ(0)',
              willChange: 'auto',
              backfaceVisibility: 'hidden',
              // 100% opacity για να κρύβει πλήρως
              opacity: 1,
              zIndex: 0
            }}
          />

          {/* Content */}
          <div
            className={`relative h-full flex flex-col p-6 z-10 overflow-y-auto ${
              isMenuVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            style={{
              transition: isMenuVisible ? 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1), opacity 300ms cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
              willChange: isMenuVisible ? 'transform, opacity' : 'auto',
              transform: 'translateZ(0)',
              WebkitOverflowScrolling: 'touch',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <button
              type="button"
              onClick={closeMenu}
              aria-label={language === "el" ? "Κλείσιμο μενού" : "Close menu"}
              className="absolute top-6 right-6 z-20 h-11 w-11 rounded-full border border-white/25 bg-white text-gray-900 flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              <X className="h-4 w-4 text-gray-900" />
            </button>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-y-0 left-6 w-px bg-white/5" />
              <div className="absolute inset-y-0 right-8 w-px bg-white/5" />
            </div>

            <div className="relative flex-1 overflow-y-auto space-y-10 pb-10">
              {/* Hero */}
              <div className="flex flex-col items-center text-center gap-4 pt-6">
                <span className="text-[11px] tracking-[0.6em] text-muted-foreground/70">
                  {language === "el" ? "Hair Beauty & Health" : "Hair Beauty & Health"}
                </span>
                <img
                  src={theme === "dark" ? logoWhite : logo}
                  alt="Alexandra Rizou"
                  className="h-28 w-auto drop-shadow-2xl"
                  style={{ 
                    animation: isMenuVisible ? "fadeIn 0.5s ease-out 0.1s both" : 'none',
                    willChange: isMenuVisible ? 'opacity, transform' : 'auto',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                />
                <p className="text-base text-muted-foreground/80 max-w-sm">
                  {language === "el"
                    ? "Ένας επιμελημένος χώρος ομορφιάς με signature τελετουργίες για σύγχρονες γυναίκες."
                    : "A curated beauty lounge with signature rituals for modern women."}
                </p>
              </div>

              {/* Menu Items */}
              <nav className="flex flex-col space-y-2 max-w-md mx-auto w-full">
                {navLinks.map((link, index) => {
                  const Icon = link.icon;
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.path}
                      href={link.path}
                      onClick={closeMenu}
                      className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl"
                      style={{
                        animation: isMenuVisible ? `slideInLeft 0.45s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.07}s both` : 'none',
                        willChange: isMenuVisible ? 'transform, opacity' : 'auto',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                      }}
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent translate-x-[-30%] group-hover:translate-x-0 transition-all duration-700" />
                      <div className="relative flex items-center justify-between px-5 py-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/5 group-hover:bg-primary/15 transition-all duration-300">
                            <Icon className={`w-5 h-5 ${active ? "text-primary" : "text-foreground/70 group-hover:text-primary"}`} />
                          </div>
                          <div>
                            <span className={`text-2xl font-light tracking-tight ${active ? "text-primary" : "text-foreground"}`}>
                              {link.name}
                            </span>
                            <p className="text-xs tracking-[0.3em] text-muted-foreground/60 mt-1">
                              {language === "el" ? "ανακαλύψτε" : "explore"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
                          <span className="h-px w-6 bg-muted-foreground/40" />
                          <span>{language === "el" ? "μπείτε" : "view"}</span>
                        </div>
                      </div>
                      {active && <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-1 rounded-full bg-primary" />}
                    </Link>
                  );
                })}
              </nav>

              <div className="space-y-6 max-w-md mx-auto w-full">
                {/* Quick actions */}
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs tracking-[0.35em] text-muted-foreground/60">
                        {language === "el" ? "άμεση επαφή" : "instant contact"}
                      </p>
                      <p className="text-lg font-medium text-foreground mt-1">
                        {language === "el" ? "Είμαστε πάντα διαθέσιμοι" : "Always within reach"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
                      <span className="h-px w-6 bg-muted-foreground/40" />
                      <span>{language === "el" ? "σαλόνι" : "salon"}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href="tel:+302106818011"
                      className="group rounded-2xl border border-white/10 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent px-4 py-3 flex flex-col gap-1 transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      <div className="flex items-center gap-2 text-xs tracking-[0.3em] text-primary/80">
                        <Phone className="h-4 w-4" />
                        <span>{language === "el" ? "τηλέφωνο" : "call us"}</span>
                      </div>
                      <span className="text-sm sm:text-base font-semibold tracking-tight text-primary leading-tight">
                        +30 210 6818 011
                      </span>
                      <span className="text-[11px] text-primary/70">{language === "el" ? "Άμεση κλήση" : "Tap to call"}</span>
                    </a>
                    <a
                      href="https://maps.app.goo.gl/AcJighrwrX1hkXwV8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group rounded-2xl border border-white/10 bg-gradient-to-br from-accent/30 via-accent/15 to-transparent px-4 py-3 flex flex-col gap-1 transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      <div className="flex items-center gap-2 text-xs tracking-[0.3em] text-accent-foreground/80">
                        <MapPin className="h-4 w-4" />
                        <span>{language === "el" ? "τοποθεσία" : "visit"}</span>
                      </div>
                        <span className="text-lg font-semibold text-foreground">
                          {language === "el" ? "Χαλάνδρι" : "Chalandri"}
                      </span>
                      <span className="text-[11px] text-muted-foreground/70">
                        {language === "el" ? "Ανδρέα Παπανδρέου 52" : "Andrea Papandreou 52"}
                      </span>
                    </a>
                  </div>
                </div>

                {/* Book now */}
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-primary/30 via-primary/15 to-background/70 p-5 backdrop-blur-2xl">
                  <div className="absolute inset-y-0 right-0 w-1/2 opacity-30 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.4),_transparent_65%)]" />
                  <div className="relative flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs tracking-[0.4em] text-white/70">
                          {language === "el" ? "ραντεβού" : "appointments"}
                        </p>
                        <h3 className="text-2xl font-light text-white mt-1">
                          {language === "el" ? "Ερχόμαστε σύντομα online" : "Online booking opens soon"}
                        </h3>
                      </div>
                      <span className="text-[10px] tracking-[0.3em] text-white/80 border border-white/30 rounded-full px-3 py-1">
                        {language === "el" ? "σύντομα" : "soon"}
                      </span>
                    </div>
                    <button
                      disabled
                      className="relative w-full h-14 rounded-2xl border border-white/40 text-white/80 text-sm font-semibold tracking-wide cursor-not-allowed"
                    >
                      {t("nav.bookNow")}
                    </button>
                  </div>
                </div>
                {/* Operating hours */}
                <div className="rounded-3xl border border-white/10 bg-background/80 backdrop-blur-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Clock3 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{language === "el" ? "Ωράριο Λειτουργίας" : "Operating Hours"}</p>
                      </div>
                    </div>
                    <span className="text-[11px] tracking-[0.3em] text-muted-foreground border border-white/15 rounded-full px-3 py-1">
                      {todayLabel}
                    </span>
                  </div>
                  <div className="rounded-2xl border border-white/8 overflow-hidden divide-y divide-white/5">
                    {operatingHours.map((entry, idx) => {
                      const isToday = idx === todayIndex;
                      return (
                        <div
                          key={entry.day}
                          className={`flex items-center justify-between px-3 py-2 text-[13px] ${
                            isToday ? "bg-primary/10 text-primary font-semibold" : "text-foreground/80"
                          }`}
                        >
                          <span className="tracking-wide text-[11px]">
                            {entry.day}
                          </span>
                          <span className="text-right text-sm font-medium">
                            {entry.time}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Contact & socials */}
                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] via-white/[0.03] to-transparent backdrop-blur-xl p-6 space-y-5 shadow-sm">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] tracking-[0.5em] text-muted-foreground/70 font-semibold">
                        {language === "el" ? "σαλόνι" : "the salon"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-semibold text-foreground tracking-tight">Alexandra Rizou</p>
                      <a
                        href="https://maps.app.goo.gl/AcJighrwrX1hkXwV8"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-2.5 text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-0.5"
                      >
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary/60 group-hover:text-primary transition-colors" />
                        <span className="leading-relaxed">
                          {language === "el"
                            ? "Ανδρέα Παπανδρέου 52, Χαλάνδρι 152 32"
                            : "52 Andrea Papandreou, Chalandri 152 32"}
                        </span>
                      </a>
                      <a
                        href="mailto:ar.hairbeauty.healthservices@gmail.com"
                        className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-0.5"
                      >
                        <Mail className="h-4 w-4 flex-shrink-0 text-primary/60 group-hover:text-primary transition-colors" />
                        <span className="break-all">ar.hairbeauty.healthservices@gmail.com</span>
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                    <a
                      href="https://www.facebook.com/p/AR-Hair-Beauty-Health-Services-100087760983195/?locale=el_GR"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-11 w-11 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all duration-300 hover:scale-110"
                    >
                      <Facebook className="h-4 w-4" />
                    </a>
                    <a
                      href="https://www.instagram.com/ar_hairbeauty_healthservices/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-11 w-11 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all duration-300 hover:scale-110"
                    >
                      <Instagram className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                {/* Mobile footer lockup */}
                <div className="flex flex-col items-center gap-1.5 pt-2 text-center">
                  <div className="flex flex-wrap items-center justify-center gap-1 text-[11px] font-semibold tracking-[0.2em] text-muted-foreground/80 leading-none">
                    <span
                      className="text-xs font-black text-foreground/80 leading-none relative"
                      style={{ top: "0.08rem" }}
                    >
                      ©
                    </span>
                    <span
                      className="acronweb-text-footer inline-flex items-baseline gap-[0.08rem] relative"
                      style={{ top: "0.08rem" }}
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
                  <div className="flex items-center justify-center gap-1.5 text-[10px] tracking-[0.2em] text-muted-foreground/70 leading-none flex-wrap">
                    <span className="footer-year-pill rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[9px] tracking-[0.15em] text-muted-foreground/90 leading-none">
                      {year}
                    </span>
                    <span className="inline-block h-3 w-px bg-muted-foreground/40 hidden md:block" />
                    <span className="whitespace-nowrap">{rightsMessage}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;