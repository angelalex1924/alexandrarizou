"use client";

import { useState, useEffect, useRef, type TouchEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { HolidayHeroBanner } from "@/components/HolidayHeroBanner";
import Footer from "@/components/Footer";
import HoverExpandGallery from "@/components/HoverExpandGallery";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles, ShieldCheck, HeartHandshake, Stars, SunMoon, Phone, MapPin, Calendar, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useChristmasSchedule } from "@/hooks/useChristmasSchedule";
import { getLocalizedPath } from "@/lib/i18n-routes";
import { cn } from "@/lib/utils";
import { Highlighter } from "@/components/ui/highlighter";

const heroImages = [
    "/assets/hero-salon.jpg",
    "/assets/tree-background.jpg",
    "/assets/gallery-new-4.jpg",
    "/assets/gallery-new-5.jpg"
];

const servicesBackground = "/assets/salon-interior-bg.jpg";

export default function Home() {
    const { t, language } = useLanguage();
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
    const renderHolidayIcon = (emojiClass = "text-4xl", imageClass = "h-12 w-12") => {
      if (!holidayStyle.icon) return null;
      if (typeof holidayStyle.icon === "string") {
        return <span className={emojiClass}>{holidayStyle.icon}</span>;
      }
      return (
        <img
          src={holidayStyle.icon.src}
          alt={holidayStyle.icon.alt}
          className={cn("object-contain", imageClass)}
        />
      );
    };
    const isMobile = useIsMobile();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);
    const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const [loadedSlides, setLoadedSlides] = useState(() =>
        heroImages.map((_, index) => index === 0)
    );

    const services = [
        {
            image: "/hair-styling_17828281.png",
            title: t("home.service.hair.title"),
            description: t("home.service.hair.desc"),
            link: "/services#hair"
        },
        {
            image: "/nail_452757.png",
            title: t("home.service.nails.title"),
            description: t("home.service.nails.desc"),
            link: "/services#nails"
        },
        {
            image: "/waxing_17368167.png",
            title: t("home.service.waxing.title"),
            description: t("home.service.waxing.desc"),
            link: "/services#waxing"
        },
        {
            image: "/event_8286228.png",
            title: t("home.service.booking.title"),
            description: t("home.service.booking.desc"),
            link: "/booking"
        }
    ];

    const chooseFeatures = [
        {
            icon: Sparkles,
            title: t("home.choose.signature.title"),
            description: t("home.choose.signature.desc"),
            accent: "from-primary/30 via-transparent to-transparent"
        },
        {
            icon: SunMoon,
            title: t("home.choose.tailored.title"),
            description: t("home.choose.tailored.desc"),
            accent: "from-muted/40 via-transparent to-transparent"
        },
        {
            icon: ShieldCheck,
            title: t("home.choose.clean.title"),
            description: t("home.choose.clean.desc"),
            accent: "from-accent/30 via-transparent to-transparent"
        },
        {
            icon: HeartHandshake,
            title: t("home.choose.community.title"),
            description: t("home.choose.community.desc"),
            accent: "from-foreground/20 via-transparent to-transparent"
        }
    ];

    const chooseStats = [
        { value: "∞", label: t("home.choose.stats.clients") },
        { value: "5★", label: t("home.choose.stats.reviews") },
        { value: "4", label: t("home.choose.stats.experience") }
    ];

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        let isCancelled = false;
        const cleanups: Array<() => void> = [];

        heroImages.forEach((src, index) => {
            const image = new window.Image();
            const markLoaded = () => {
                if (isCancelled) {
                    return;
                }
                setLoadedSlides((prev) => {
                    if (prev[index]) {
                        return prev;
                    }
                    const next = [...prev];
                    next[index] = true;
                    return next;
                });
            };

            image.src = src;

            if (image.complete) {
                markLoaded();
                return;
            }

            const handleLoad = () => markLoaded();
            const handleError = () => markLoaded();

            image.addEventListener("load", handleLoad);
            image.addEventListener("error", handleError);

            cleanups.push(() => {
                image.removeEventListener("load", handleLoad);
                image.removeEventListener("error", handleError);
            });
        });

        return () => {
            isCancelled = true;
            cleanups.forEach((cleanup) => cleanup());
        };
    }, []);

    // Auto-play carousel with progress tracking
    useEffect(() => {
        if (!isPlaying || !loadedSlides.every(Boolean) || heroImages.length < 2) {
            if (autoPlayIntervalRef.current) {
                clearInterval(autoPlayIntervalRef.current);
                autoPlayIntervalRef.current = null;
            }
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
                progressIntervalRef.current = null;
            }
            if (!isPlaying) {
                setProgress(0);
            }
            return;
        }

        const slideDuration = 5000; // 5 seconds per slide
        const progressUpdateInterval = 50; // Update progress every 50ms

        // Reset progress when slide changes
        setProgress(0);

        // Progress animation
        progressIntervalRef.current = setInterval(() => {
            setProgress((prev) => {
                const next = prev + (100 / (slideDuration / progressUpdateInterval));
                if (next >= 100) {
                    return 0;
                }
                return next;
            });
        }, progressUpdateInterval);

        // Auto-play interval
        autoPlayIntervalRef.current = setInterval(() => {
            setCurrentSlide((prev) => {
                const next = (prev + 1) % heroImages.length;
                setProgress(0);
                return next;
            });
        }, slideDuration);

        return () => {
            if (autoPlayIntervalRef.current) {
                clearInterval(autoPlayIntervalRef.current);
            }
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
        };
    }, [isPlaying, currentSlide, loadedSlides]);

    const findNextLoadedIndex = (start: number, direction: 1 | -1) => {
        for (let step = 1; step <= heroImages.length; step++) {
            const candidate = (start + direction * step + heroImages.length) % heroImages.length;
            if (loadedSlides[candidate]) {
                return candidate;
            }
        }
        return start;
    };

    const goToSlide = (index: number) => {
        if (!loadedSlides[index]) {
            return;
        }
        setCurrentSlide(index);
        setProgress(0);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => findNextLoadedIndex(prev, 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => findNextLoadedIndex(prev, -1));
    };

    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);

    const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
        touchStartX.current = e.touches[0].clientX;
        touchEndX.current = null;
    };

    const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (touchStartX.current === null || touchEndX.current === null) {
            return;
        }
        const distance = touchStartX.current - touchEndX.current;
        const threshold = 50;
        if (distance > threshold) {
            nextSlide();
        } else if (distance < -threshold) {
            prevSlide();
        }
        touchStartX.current = null;
        touchEndX.current = null;
    };

    return (
        <div className="min-h-screen">
            <Navigation />

            {/* Hero Section with Carousel */}
            <section
                className={cn(
                    "relative flex items-center justify-center overflow-hidden",
                    isMobile ? "min-h-auto py-8 pt-24 bg-gradient-to-b from-primary/20 via-primary/15 to-primary/22 dark:from-background dark:via-background/98 dark:to-background" : "min-h-screen"
                )}
                onTouchStart={!isMobile ? handleTouchStart : undefined}
                onTouchMove={!isMobile ? handleTouchMove : undefined}
                onTouchEnd={!isMobile ? handleTouchEnd : undefined}
                style={{
                    contain: 'layout style paint',
                    willChange: 'auto',
                    transform: 'translateZ(0)',
                }}
            >
                {/* Desktop: Carousel Background Images */}
                {!isMobile && (
                    <>
                        <div 
                            className="absolute inset-0"
                            style={{
                                contain: 'layout style paint',
                                willChange: 'auto',
                                transform: 'translateZ(0)',
                            }}
                        >
                            {heroImages.map((image, index) => {
                                const isActive = index === currentSlide;
                                const isLoaded = loadedSlides[index];

                                return (
                                    <div
                                        key={index}
                                        aria-hidden={!isActive}
                                        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                                            isActive && isLoaded ? 'opacity-100 z-0' : 'opacity-0 z-0'
                                        }`}
                                        style={{
                                            backgroundImage: `url(${image})`,
                                            backgroundPosition: 'center',
                                            backgroundSize: 'cover',
                                            filter: 'blur(3px)',
                                            transform: 'scale(1.0) translateZ(0)',
                                            willChange: 'opacity',
                                            backfaceVisibility: 'hidden',
                                            WebkitBackfaceVisibility: 'hidden',
                                            contain: 'layout style paint',
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/50" />
                                        {!isLoaded && (
                                            <div className="absolute inset-0 bg-black/20 animate-pulse" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Navigation Arrows - Desktop Only */}
                        <button
                            onClick={prevSlide}
                            className="hidden md:flex absolute left-4 md:left-8 z-20 p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 group"
                            aria-label="Previous slide"
                        >
                            <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="hidden md:flex absolute right-4 md:right-8 z-20 p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 group"
                            aria-label="Next slide"
                        >
                            <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                        </button>

                        {/* Decorative Glows - Desktop Only */}
                        <div className="absolute inset-0 z-5 pointer-events-none">
                            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
                            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
                        </div>
                    </>
                )}

                {/* Hero Content - Premium Centered Layout */}
                <div className={cn(
                    "relative z-10 container-custom px-4 md:px-8",
                    isMobile && "w-full"
                )}>
                    <div className="max-w-5xl mx-auto">
                        <div className={cn(
                            "flex flex-col items-center justify-center text-center",
                            isMobile ? "py-12 space-y-6" : "min-h-[90vh] py-20 space-y-8"
                        )}>
                            
                            {/* Accent Label with Enhanced Separator - Mobile: Beautiful Design */}
                            <div className={cn(
                                "inline-flex items-center gap-3 animate-fade-in",
                                isMobile && "mb-3"
                            )}>
                                {!isMobile && (
                                    <>
                                        <div className="h-px w-20 bg-gradient-to-r from-transparent via-white/90 to-white/90 drop-shadow-lg"></div>
                                        <span className="text-xs md:text-sm font-semibold tracking-[0.25em] drop-shadow-2xl px-4 py-1.5 rounded-full backdrop-blur-sm border text-white bg-white/5 border-white/20" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
                                            {t("home.hero.title1")}
                                        </span>
                                        <div className="h-px w-20 bg-gradient-to-l from-transparent via-white/90 to-white/90 drop-shadow-lg"></div>
                                    </>
                                )}
                                {isMobile && (
                                    <span className="text-sm font-medium tracking-[0.15em] text-primary/90 dark:text-primary/80">
                                        {t("home.hero.title1")}
                                    </span>
                                )}
                            </div>

                            {/* Main Title with Enhanced Styling */}
                            <h1 className={cn(
                                "font-junicode leading-[1.1] mb-8 animate-fade-in relative",
                                isMobile 
                                    ? "text-4xl text-foreground dark:text-white px-4" 
                                    : "text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white"
                            )} style={!isMobile ? { animationDelay: '0.1s', textShadow: '0 8px 40px rgba(0,0,0,0.9), 0 4px 20px rgba(0,0,0,0.7), 0 2px 10px rgba(0,0,0,0.5)' } : {}}>
                                {isMobile ? (
                                    <span className="relative z-10">
                                        {(() => {
                                            const titleText = t("home.hero.title2");
                                            // Find the word to highlight (Αριστεία or Excellence)
                                            const highlightWords = ["Αριστεία", "Excellence"];
                                            const words = titleText.split(" ");
                                            
                                            return words.map((word, index, array) => {
                                                // Check if word contains highlight word (with or without punctuation)
                                                const cleanWord = word.replace(/[.,!?;:]/g, '');
                                                const isHighlight = highlightWords.some(hw => cleanWord.includes(hw) || hw.includes(cleanWord));
                                                
                                                return (
                                                    <span key={index}>
                                                        {isHighlight ? (
                                                            <Highlighter 
                                                                action="underline" 
                                                                color="hsl(var(--primary))"
                                                                strokeWidth={3}
                                                                animationDuration={800}
                                                            >
                                                                {word}
                                                            </Highlighter>
                                                        ) : (
                                                            word
                                                        )}
                                                        {index < array.length - 1 && " "}
                                                    </span>
                                                );
                                            });
                                        })()}
                                    </span>
                                ) : (
                                    <span className="relative z-10">
                                        {(() => {
                                            const titleText = t("home.hero.title2");
                                            // Find the word to highlight (Αριστεία or Excellence)
                                            const highlightWords = ["Αριστεία", "Excellence"];
                                            const words = titleText.split(" ");
                                            
                                            return words.map((word, index, array) => {
                                                // Check if word contains highlight word (with or without punctuation)
                                                const cleanWord = word.replace(/[.,!?;:]/g, '');
                                                const isHighlight = highlightWords.some(hw => cleanWord.includes(hw) || hw.includes(cleanWord));
                                                
                                                return (
                                                    <span key={index}>
                                                        {isHighlight ? (
                                                            <Highlighter 
                                                                action="underline" 
                                                                color="hsl(var(--primary))"
                                                                strokeWidth={3}
                                                                animationDuration={800}
                                                            >
                                                                {word}
                                                            </Highlighter>
                                                        ) : (
                                                            word
                                                        )}
                                                        {index < array.length - 1 && " "}
                                                    </span>
                                                );
                                            });
                                        })()}
                                    </span>
                                )}
                                {!isMobile && (
                                    <span className="absolute inset-0 blur-2xl opacity-30 bg-white/20" style={{ transform: 'scale(1.1)' }}></span>
                                )}
                            </h1>
                            
                            {/* Subtitle with Enhanced Styling - Mobile: More Chill */}
                            <p className={cn(
                                "leading-relaxed max-w-3xl mx-auto font-light animate-fade-in",
                                isMobile 
                                    ? "text-sm text-foreground/80 dark:text-foreground/70 px-6 mb-6" 
                                    : "text-lg md:text-xl lg:text-2xl text-white/95 mb-12 px-4"
                            )} style={!isMobile ? { animationDelay: '0.2s', letterSpacing: '0.02em', textShadow: '0 4px 25px rgba(0,0,0,0.8), 0 2px 12px rgba(0,0,0,0.6)' } : {}}>
                                {t("home.hero.subtitle")}
                            </p>

                            
                            {/* CTA Buttons with Enhanced Styling - Mobile: Beautiful with Custom Icons */}
                            <div className={cn(
                                "flex flex-col sm:flex-row gap-4 animate-fade-in",
                                isMobile && "w-full px-4"
                            )} style={{ animationDelay: '0.3s' }}>
                                {/* Book Appointment Button - Disabled with Custom Calendar Icon */}
                                <div className="relative group w-full sm:w-auto">
                                    <Button 
                                        disabled
                                        className={cn(
                                            "h-14 px-8 text-sm font-bold rounded-2xl cursor-not-allowed shadow-2xl backdrop-blur-md border-2 w-full sm:w-auto flex items-center justify-center gap-3 relative overflow-hidden",
                                            isMobile
                                                ? "bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground border-primary/40 dark:border-primary/50 shadow-primary/30 opacity-90"
                                                : "bg-primary/70 text-white border-white/20 shadow-primary/25"
                                        )}
                                    >
                                        {/* Shine effect overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                        
                                        {/* Custom Calendar Icon */}
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            width="20" 
                                            height="20" 
                                            viewBox="0 0 24 24" 
                                            fill="none"
                                            className="relative z-10"
                                        >
                                            <g clipPath="url(#clip0_4418_6314)">
                                                <path 
                                                    d="M8 2V5" 
                                                    stroke="currentColor" 
                                                    strokeWidth="1.5" 
                                                    strokeMiterlimit="10" 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                />
                                                <path 
                                                    d="M16 2V5" 
                                                    stroke="currentColor" 
                                                    strokeWidth="1.5" 
                                                    strokeMiterlimit="10" 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                />
                                                <path 
                                                    opacity="0.4" 
                                                    d="M3.5 9.08984H20.5" 
                                                    stroke="currentColor" 
                                                    strokeWidth="1.5" 
                                                    strokeMiterlimit="10" 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                />
                                                <path 
                                                    d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" 
                                                    stroke="currentColor" 
                                                    strokeWidth="1.5" 
                                                    strokeMiterlimit="10" 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                />
                                                <path 
                                                    opacity="0.4" 
                                                    d="M11.9955 13.6992H12.0045" 
                                                    stroke="currentColor" 
                                                    strokeWidth="2" 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                />
                                                <path 
                                                    opacity="0.4" 
                                                    d="M8.29431 13.6992H8.30329" 
                                                    stroke="currentColor" 
                                                    strokeWidth="2" 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                />
                                                <path 
                                                    opacity="0.4" 
                                                    d="M8.29443 16.6992H8.30342" 
                                                    stroke="currentColor" 
                                                    strokeWidth="2" 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_4418_6314">
                                                    <rect width="24" height="24" fill="white"/>
                                                </clipPath>
                                            </defs>
                                        </svg>
                                        
                                        <span className="relative z-10">{t("home.hero.bookBtn")}</span>
                                    </Button>
                                    <div className={cn(
                                        "absolute -top-2.5 -right-2.5 bg-primary text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-2xl whitespace-nowrap z-20 backdrop-blur-md animate-pulse border-2",
                                        isMobile 
                                            ? "border-primary/60 dark:border-primary/70" 
                                            : "border-white/40"
                                    )}>
                                        {t("comingSoon")}
                                    </div>
                                </div>
                                
                                {/* Services Button - Active with Custom Services Icon */}
                                <Link href={getLocalizedPath("/services", language as 'el' | 'en')} className={cn("w-full sm:w-auto", isMobile && "w-full")}>
                                    <Button 
                                        variant="outline" 
                                        className={cn(
                                            "h-14 px-8 text-sm font-bold rounded-2xl backdrop-blur-md border-2 transition-all duration-300 hover:scale-[1.02] shadow-xl hover:shadow-2xl w-full sm:w-auto flex items-center justify-center gap-3 group/btn relative overflow-hidden",
                                            isMobile
                                                ? "bg-gradient-to-br from-background via-background/98 to-background dark:from-background/90 dark:via-background/85 dark:to-background/90 border-primary/50 dark:border-primary/60 text-primary hover:bg-gradient-to-br hover:from-primary/15 hover:via-primary/12 hover:to-primary/15 dark:hover:from-primary/25 dark:hover:via-primary/22 dark:hover:to-primary/25 hover:border-primary/70 dark:hover:border-primary/80 hover:shadow-primary/30"
                                                : "bg-white/15 border-white/50 text-white hover:bg-white/25 hover:border-white/70"
                                        )}
                                    >
                                        {/* Shine effect overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                                        
                                        <span className="relative z-10">{t("home.hero.servicesBtn")}</span>
                                        
                                        {/* Custom Services Icon */}
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            width="20" 
                                            height="20" 
                                            viewBox="0 0 26 26" 
                                            fill="none"
                                            className="relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1"
                                        >
                                            <g fill="currentColor">
                                                <path 
                                                    d="M26 14c0 6.627-5.373 12-12 12S2 20.627 2 14S7.373 2 14 2s12 5.373 12 12Z" 
                                                    opacity=".2"
                                                />
                                                <path 
                                                    fillRule="evenodd" 
                                                    d="M8.5 11.5a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm0-5a2 2 0 1 1 0 4a2 2 0 0 1 0-4Zm0 15a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm0-5a2 2 0 1 1 0 4a2 2 0 0 1 0-4Z" 
                                                    clipRule="evenodd"
                                                />
                                                <path 
                                                    d="M19.978 18.782a.5.5 0 0 1-.697.718l-8.876-8.627a.5.5 0 1 1 .697-.717l8.876 8.626Z"
                                                />
                                                <path 
                                                    d="M10.146 16.146a.5.5 0 0 0 .708.708l9-9a.5.5 0 0 0-.708-.708l-9 9Z"
                                                />
                                                <path 
                                                    fillRule="evenodd" 
                                                    d="M13 24.5c6.351 0 11.5-5.149 11.5-11.5S19.351 1.5 13 1.5S1.5 6.649 1.5 13S6.649 24.5 13 24.5Zm0 1c6.904 0 12.5-5.596 12.5-12.5S19.904.5 13 .5S.5 6.096.5 13S6.096 25.5 13 25.5Z" 
                                                    clipRule="evenodd"
                                                />
                                            </g>
                                        </svg>
                                    </Button>
                                </Link>
                            </div>

                            {/* Google Rating - Above Medals - Mobile: Beautiful Design */}
                            <a
                                href="https://share.google/etcIhjfAjRCxAwAvp"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                    "group relative inline-flex items-center gap-3 px-4 py-3 rounded-2xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl animate-fade-in overflow-hidden",
                                    isMobile
                                        ? "bg-transparent border-2 border-primary/30 dark:border-primary/40 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-primary/20 mb-3"
                                        : "bg-white/8 border border-white/20 hover:border-white/35 hover:shadow-black/20 mb-4"
                                )}
                                style={{ animationDelay: '0.35s' }}
                            >
                                {/* Animated gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl" />
                                
                                {/* Subtle shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl" />
                                
                                <div className="relative z-10 flex items-center gap-3">
                                    {/* Google Logo Container - Enhanced */}
                                    <div className={cn(
                                        "relative p-3 rounded-xl transition-all duration-300 group-hover:scale-110 shadow-md",
                                        isMobile
                                            ? "bg-gradient-to-br from-primary/15 via-primary/12 to-primary/10 dark:from-primary/20 dark:via-primary/18 dark:to-primary/15 group-hover:from-primary/20 group-hover:via-primary/17 group-hover:to-primary/15 dark:group-hover:from-primary/25 dark:group-hover:via-primary/23 dark:group-hover:to-primary/20"
                                            : "bg-white/5 group-hover:bg-white/10"
                                    )}>
                                        <svg 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={cn(
                                                "h-6 w-6",
                                                isMobile ? "text-primary dark:text-primary/90" : "text-white"
                                            )}
                                        >
                                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                            <g id="SVGRepo_iconCarrier">
                                                <path 
                                                    d="M17.1891 14.1152C16.4619 16.6256 12.6694 18.8144 9.19027 16.6256C6.37273 14.853 6.27434 11.5944 7.27665 9.62754C8.27897 7.66072 11.3889 5.41688 15.6856 7.99314L18.3308 5.41688C16.7993 3.71784 11.4349 1.40171 6.97039 4.58582C1.66738 8.368 2.56578 14.1917 4.56819 17.2425C5.80223 19.1226 9.30789 22.1457 15.1844 20.5513C19.5527 19.366 21.2253 14.4945 20.9759 10.6802H12.1771V14.2814H15.1844" 
                                                    stroke="currentColor" 
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round"
                                                ></path>
                                            </g>
                                        </svg>
                                    </div>
                                    
                                    {/* Rating Number - Enhanced */}
                                    <div className="flex flex-col">
                                        <span className={cn(
                                            "text-xl font-bold leading-tight",
                                            isMobile ? "text-primary dark:text-primary/90" : "text-white"
                                        )}>
                                            5.0
                                        </span>
                                        <span className={cn(
                                            "text-[10px] leading-tight",
                                            isMobile ? "text-primary/70 dark:text-primary-foreground/60" : "text-white/70"
                                        )}>
                                            {language === "el" ? "Google" : "Google"}
                                        </span>
                                    </div>
                                    
                                    {/* Stars - Enhanced */}
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <svg 
                                                key={i}
                                                version="1.0" 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                viewBox="0 0 64 64" 
                                                className={cn(
                                                    "group-hover:scale-110 transition-transform duration-300 drop-shadow-sm",
                                                    isMobile ? "h-5 w-5" : "h-5 w-5"
                                                )}
                                                style={{ transitionDelay: `${i * 40}ms` }}
                                            >
                                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                                <g id="SVGRepo_iconCarrier">
                                                    <g>
                                                        <path fill="#394240" d="M31.998,2.478c0.279,0,0.463,0.509,0.463,0.509l8.806,18.759l20.729,3.167l-14.999,15.38l3.541,21.701 l-18.54-10.254l-18.54,10.254l3.541-21.701L2,24.912l20.729-3.167l8.798-18.743C31.527,3.002,31.719,2.478,31.998,2.478 M31.998,0 c-0.775,0-1.48,0.448-1.811,1.15l-8.815,18.778L1.698,22.935c-0.741,0.113-1.356,0.632-1.595,1.343 c-0.238,0.71-0.059,1.494,0.465,2.031l14.294,14.657L11.484,61.67c-0.124,0.756,0.195,1.517,0.822,1.957 c0.344,0.243,0.747,0.366,1.151,0.366c0.332,0,0.666-0.084,0.968-0.25l17.572-9.719l17.572,9.719 c0.302,0.166,0.636,0.25,0.968,0.25c0.404,0,0.808-0.123,1.151-0.366c0.627-0.44,0.946-1.201,0.822-1.957l-3.378-20.704 l14.294-14.657c0.523-0.537,0.703-1.321,0.465-2.031c-0.238-0.711-0.854-1.229-1.595-1.343l-19.674-3.006L33.809,1.15 C33.479,0.448,32.773,0,31.998,0L31.998,0z"></path>
                                                        <path fill="#ffcc00" d="M31.998,2.478c0.279,0,0.463,0.509,0.463,0.509l8.806,18.759l20.729,3.167l-14.999,15.38l3.541,21.701 l-18.54-10.254l-18.54,10.254l3.541-21.701L2,24.912l20.729-3.167l8.798-18.743C31.527,3.002,31.719,2.478,31.998,2.478"></path>
                                                    </g>
                                                </g>
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            </a>

                            {/* Awards Section - Elegant Design - Mobile: More Chill */}
                            <div className={cn("animate-fade-in", isMobile ? "mt-6" : "mt-10")} style={{ animationDelay: '0.4s' }}>
                                <div className="flex flex-col items-center gap-4">
                                    {/* Awards Title - Elegant Typography */}
                                    <div className="relative">
                                        <h3 className={cn(
                                            "font-junicode font-bold tracking-wider drop-shadow-2xl",
                                            isMobile 
                                                ? "text-base text-foreground/90 dark:text-foreground/80" 
                                                : "text-lg md:text-xl text-white"
                                        )} style={!isMobile ? { textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 2px 10px rgba(0,0,0,0.6)' } : {}}>
                                            {t("home.hero.awards")}
                                        </h3>
                                        {/* Decorative underline */}
                                        <div className={cn(
                                            "absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 h-px bg-gradient-to-r from-transparent to-transparent",
                                            isMobile 
                                                ? "w-12 via-primary/50 dark:via-primary/40" 
                                                : "w-16 via-white/80"
                                        )}></div>
                                    </div>
                                    
                                    {/* Medals - Horizontal Layout */}
                                    <div className="flex items-center gap-5">
                                        <div className="relative group">
                                            <div className={cn(
                                                "absolute inset-0 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500",
                                                isMobile ? "bg-primary/5" : "bg-white/5"
                                            )}></div>
                                <Image 
                                    src="/gold_medal_2025.png" 
                                    alt="Gold beauty award for Alexandra Rizou Coiffure 2025" 
                                    width={64}
                                    height={64}
                                                className={cn(
                                                    "relative w-auto drop-shadow-2xl group-hover:scale-110 transition-transform duration-300",
                                                    isMobile ? "h-12" : "h-14 md:h-16"
                                                )}
                                                style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.5))' }}
                                />
                                        </div>
                                        <div className="relative group">
                                            <div className={cn(
                                                "absolute inset-0 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500",
                                                isMobile ? "bg-primary/5" : "bg-white/5"
                                            )}></div>
                                            <Image
                                    src="/laureate_medal_2025.png" 
                                                alt="Award-winning Alexandra Rizou Coiffure salon in Chalandri"
                                                width={64}
                                                height={64}
                                                className={cn(
                                                    "relative w-auto drop-shadow-2xl group-hover:scale-110 transition-transform duration-300",
                                                    isMobile ? "h-12" : "h-14 md:h-16"
                                                )}
                                                style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.5))' }}
                                />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Address & Phone Section - Mobile Only - Beautiful Design */}
                            {isMobile && (
                                <div className="mt-8 space-y-3 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                                    {/* Address Card */}
                                    <a
                                        href="https://maps.app.goo.gl/AcJighrwrX1hkXwV8"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative rounded-2xl border border-primary/20 dark:border-white/10 bg-gradient-to-br from-accent/30 via-accent/15 to-transparent dark:from-accent/30 dark:via-accent/15 dark:to-transparent px-4 py-3.5 flex flex-col gap-1.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/20 dark:hover:shadow-accent/10 overflow-hidden"
                                    >
                                        {/* Subtle shine effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                        
                                        <div className="relative z-10 flex items-center gap-2.5 text-xs tracking-[0.3em] text-primary/80 dark:text-accent-foreground/80 font-medium">
                                            {/* Custom Location Icon - Better Colors for Light Mode */}
                                            <svg 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                width="16" 
                                                height="16" 
                                                viewBox="0 0 24 24" 
                                                fill="none"
                                                className="h-4 w-4 text-primary dark:text-accent-foreground"
                                            >
                                                <g clipPath="url(#clip0_4418_4559)">
                                                    <path 
                                                        opacity="0.4" 
                                                        d="M19.8801 20.9406C18.9301 21.6406 17.6801 22.0005 16.1901 22.0005H7.81009C7.57009 22.0005 7.3301 21.9905 7.1001 21.9605L14.0001 15.0605L19.8801 20.9406Z" 
                                                        fill="currentColor"
                                                    />
                                                    <path 
                                                        opacity="0.4" 
                                                        d="M22.0001 7.80961V16.1896C22.0001 17.6796 21.6401 18.9296 20.9401 19.8796L15.0601 13.9996L21.9601 7.09961C21.9901 7.32961 22.0001 7.56961 22.0001 7.80961Z" 
                                                        fill="currentColor"
                                                    />
                                                    <path 
                                                        opacity="0.4" 
                                                        d="M15.06 14L20.94 19.88C20.65 20.3 20.3 20.65 19.88 20.94L14 15.06L7.10001 21.96C6.46001 21.92 5.88001 21.79 5.35001 21.59C3.21001 20.81 2 18.91 2 16.19V7.81C2 4.17 4.17 2 7.81 2H16.19C18.91 2 20.81 3.21 21.59 5.35C21.79 5.88 21.92 6.46 21.96 7.1L15.06 14Z" 
                                                        fill="currentColor"
                                                    />
                                                    <path 
                                                        d="M15.0601 13.9996L20.9401 19.8796C20.6501 20.2996 20.3001 20.6496 19.8801 20.9396L14.0001 15.0596L7.1001 21.9596C6.4601 21.9196 5.8801 21.7896 5.3501 21.5896L5.74008 21.1996L21.5901 5.34961C21.7901 5.87961 21.9201 6.45961 21.9601 7.09961L15.0601 13.9996Z" 
                                                        fill="currentColor"
                                                    />
                                                    <path 
                                                        d="M12.2398 7.9293C11.8598 6.2793 10.3998 5.5393 9.11981 5.5293C7.83981 5.5293 6.37981 6.2693 5.99981 7.9193C5.57981 9.7493 6.6998 11.2793 7.7098 12.2393C8.1098 12.6193 8.60981 12.7993 9.11981 12.7993C9.62981 12.7993 10.1298 12.6093 10.5298 12.2393C11.5398 11.2793 12.6598 9.7493 12.2398 7.9293ZM9.14981 9.4893C8.59981 9.4893 8.14981 9.0393 8.14981 8.4893C8.14981 7.9393 8.58981 7.4893 9.14981 7.4893H9.15982C9.70982 7.4893 10.1598 7.9393 10.1598 8.4893C10.1598 9.0393 9.69981 9.4893 9.14981 9.4893Z" 
                                                        fill="currentColor"
                                                    />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_4418_4559">
                                                        <rect width="24" height="24" fill="white"/>
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                            <span className="text-primary/90 dark:text-accent-foreground/90">{language === "el" ? "τοποθεσία" : "visit"}</span>
                                        </div>
                                        <span className="relative z-10 text-lg font-semibold text-foreground dark:text-foreground leading-tight group-hover:text-primary dark:group-hover:text-accent-foreground transition-colors">
                                            {language === "el" ? "Ανδρέα Παπανδρέου 52" : "Andrea Papandreou 52"}
                                        </span>
                                        <span className="relative z-10 text-[11px] text-muted-foreground/80 dark:text-muted-foreground/70 leading-relaxed group-hover:text-foreground/90 dark:group-hover:text-foreground/80 transition-colors">
                                            {language === "el" ? "Χαλάνδρι, 152 32" : "Chalandri, 152 32"}
                                        </span>
                                    </a>

                                    {/* Phone Card */}
                                    <a
                                        href="tel:+302106818011"
                                        className="group relative rounded-2xl border border-primary/20 dark:border-white/10 bg-gradient-to-br from-primary/30 via-primary/15 to-transparent dark:from-primary/30 dark:via-primary/15 dark:to-transparent px-4 py-3.5 flex flex-col gap-1.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20 dark:hover:shadow-primary/10 overflow-hidden"
                                    >
                                        {/* Subtle shine effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                        
                                        <div className="relative z-10 flex items-center gap-2.5 text-xs tracking-[0.3em] text-primary/80 dark:text-primary-foreground/80 font-medium">
                                            <Phone className="h-4 w-4 text-primary dark:text-primary-foreground" />
                                            <span className="text-primary/90 dark:text-primary-foreground/90">{language === "el" ? "τηλέφωνο" : "call us"}</span>
                                        </div>
                                        <span className="relative z-10 text-sm sm:text-base font-semibold tracking-tight text-primary leading-tight group-hover:text-primary dark:group-hover:text-primary-foreground transition-colors">
                                            +30 210 6818 011
                                        </span>
                                        <span className="relative z-10 text-[11px] text-primary/70 dark:text-primary-foreground/70 leading-relaxed group-hover:text-primary/90 dark:group-hover:text-primary-foreground/80 transition-colors">
                                            {language === "el" ? "Άμεση κλήση" : "Tap to call"}
                                        </span>
                                    </a>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                {/* Carousel Indicators - Desktop Only */}
                {!isMobile && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
                        {/* Pause/Play Button */}
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 flex items-center justify-center hover:scale-110"
                            aria-label={isPlaying ? "Pause carousel" : "Play carousel"}
                        >
                            {isPlaying ? (
                                <Pause className="h-4 w-4 text-white" />
                            ) : (
                                <Play className="h-4 w-4 text-white ml-0.5" />
                            )}
                        </button>

                        {/* Indicators */}
                        <div className="flex gap-3">
                            {heroImages.map((_, index) => {
                                const isActive = index === currentSlide;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            goToSlide(index);
                                            setProgress(0);
                                        }}
                                        disabled={!loadedSlides[index]}
                                        aria-disabled={!loadedSlides[index]}
                                        className={`relative transition-all duration-300 rounded-full overflow-hidden ${
                                            isActive
                                                ? 'w-12 h-2 bg-white/20 shadow-lg'
                                                : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                                        } ${!loadedSlides[index] ? 'opacity-40 cursor-not-allowed' : ''}`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    >
                                        {isActive && isPlaying && (
                                            <div
                                                className="absolute inset-0 bg-white rounded-full transition-all duration-75 ease-linear"
                                                style={{
                                                    width: `${progress}%`,
                                                }}
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </section>

            {/* Mobile Carousel Section - Separate from Hero */}
            {isMobile && (
                <section 
                    className="relative py-12 px-4 bg-gradient-to-b from-primary/20 via-primary/15 to-primary/22 dark:from-background dark:via-background/98 dark:to-background"
                    style={{ overscrollBehavior: 'contain', touchAction: 'pan-y' }}
                >
                    <div className="container-custom max-w-4xl mx-auto" style={{ overscrollBehavior: 'contain' }}>
                        <div className="mb-6 text-center">
                            <h2 className="text-2xl font-junicode font-bold text-foreground dark:text-white mb-2">
                                {t("gallery.hero.title")}
                            </h2>
                            <p className="text-sm text-foreground/70 dark:text-foreground/60">
                                {t("gallery.hero.subtitle")}
                            </p>
                        </div>
                        <HoverExpandGallery images={heroImages} />
                    </div>
                </section>
            )}

            <HolidayHeroBanner />

            {/* Services Preview - Premium Modern Design */}
            <section className="relative overflow-hidden py-24 md:py-32 px-4 md:px-8">
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.08),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.06),transparent_50%)]" />
                
                {/* Floating Orbs Animation */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />

                <div className="container-custom relative z-10 max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-16 md:mb-20">
                        <div className="inline-flex items-center gap-3 mb-6">
                            <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/60"></div>
                            <span className="text-xs md:text-sm font-semibold text-primary uppercase tracking-[0.3em]">
                                Premium Services
                            </span>
                            <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/60"></div>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-junicode bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
                            {t("home.services.title")}
                        </h2>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            {t("home.services.subtitle")}
                        </p>
                    </div>

                    {/* Premium Services Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {services.map((service, index) => {
                            const isBooking = service.link === "/booking";
                            
                            // Subtle color schemes for each service
                            const colorSchemes = [
                                { primary: 'from-primary/8', accent: 'to-accent/6', border: 'border-primary/20', shadow: 'shadow-primary/10', iconBg: 'from-primary/10 to-accent/8', overlay: 'from-primary/5 to-accent/4' },
                                { primary: 'from-accent/8', accent: 'to-primary/6', border: 'border-accent/20', shadow: 'shadow-accent/10', iconBg: 'from-accent/10 to-primary/8', overlay: 'from-accent/5 to-primary/4' },
                                { primary: 'from-primary/10', accent: 'to-accent/8', border: 'border-primary/25', shadow: 'shadow-primary/12', iconBg: 'from-primary/12 to-accent/10', overlay: 'from-primary/6 to-accent/5' },
                                { primary: 'from-accent/10', accent: 'to-primary/8', border: 'border-accent/25', shadow: 'shadow-accent/12', iconBg: 'from-accent/12 to-primary/10', overlay: 'from-accent/6 to-primary/5' },
                            ];
                            const colors = colorSchemes[index % colorSchemes.length];
                            
                            return (
                                <div
                                    key={index}
                                    className="group relative"
                                    style={{
                                        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                                    }}
                                >
                                    {/* Premium Card with Subtle Colors */}
                                    <div className={`
                                        relative h-full rounded-3xl overflow-hidden
                                        bg-gradient-to-br ${colors.primary} via-card/98 ${colors.accent}
                                        backdrop-blur-xl
                                        border ${colors.border}
                                        shadow-lg ${colors.shadow}
                                        transition-all duration-700 ease-out
                                        ${isBooking 
                                            ? 'opacity-75 cursor-not-allowed' 
                                            : 'hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-2 hover:scale-[1.02] hover:border-primary/40'
                                        }
                                    `}>
                                        {/* Subtle Gradient Overlay */}
                                        <div className={`
                                            absolute inset-0 transition-opacity duration-700
                                            bg-gradient-to-br ${colors.overlay} via-transparent
                                            ${!isBooking ? 'opacity-100' : 'opacity-50'}
                                        `} />

                                        {/* Shine Effect */}
                                        {!isBooking && (
                                            <div className="absolute inset-0 shimmer-on-hover bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                        )}

                                        {/* Content */}
                                        <div className="relative z-10 p-8 md:p-10 flex flex-col h-full">
                                            {/* Image Container */}
                                            <div className={`
                                                relative mb-6
                                                ${isBooking ? 'opacity-60' : ''}
                                            `}>
                                                <div className={`
                                                    relative w-20 h-20 rounded-2xl
                                                    bg-gradient-to-br ${colors.iconBg}
                                                    flex items-center justify-center
                                                    shadow-md shadow-primary/15
                                                    transition-all duration-500
                                                    overflow-hidden
                                                    ${!isBooking && 'group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg group-hover:shadow-primary/25'}
                                                `}>
                                                    {/* Subtle Glow Effect */}
                                                    <div className={`
                                                        absolute inset-0 rounded-2xl
                                                        bg-primary/15 blur-xl
                                                        transition-opacity duration-500
                                                        ${!isBooking ? 'opacity-100 group-hover:opacity-100' : 'opacity-50'}
                                                    `} />
                                                    
                                                    <Image
                                                        src={service.image}
                                                        alt={`${service.title} - Alexandra Rizou Coiffure Chalandri`}
                                                        width={48}
                                                        height={48}
                                                        className={`
                                                            relative z-10
                                                            object-contain
                                                            transition-all duration-500
                                                            ${!isBooking && 'group-hover:scale-110'}
                                                            ${isBooking ? 'opacity-60' : ''}
                                                            ${service.image === '/hair-styling_17828281.png' ? 'dark:brightness-0 dark:invert' : ''}
                                                        `}
                                                    />
                                                </div>
                                                
                                                {/* Decorative Corner Elements */}
                                                <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-primary/20 rounded-tr-2xl opacity-40 group-hover:opacity-100 transition-opacity duration-500" />
                                                <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-accent/20 rounded-bl-2xl opacity-40 group-hover:opacity-100 transition-opacity duration-500" />
                                            </div>

                                            {/* Title */}
                                            <h3 className={`
                                                text-2xl md:text-3xl font-bold mb-4
                                                transition-all duration-500
                                                ${isBooking 
                                                    ? 'opacity-70 text-foreground/70' 
                                                    : 'text-foreground group-hover:text-primary'
                                                }
                                            `}>
                                                {service.title}
                                            </h3>

                                            {/* Description */}
                                            <p className={`
                                                text-foreground/80 mb-6 flex-grow
                                                leading-relaxed text-base
                                                transition-colors duration-500
                                                ${!isBooking && 'group-hover:text-foreground'}
                                                ${isBooking ? 'opacity-70' : ''}
                                            `}>
                                                {service.description}
                                            </p>

                                            {/* CTA Link */}
                                            <div className="mt-auto">
                                                {isBooking ? (
                                                    <div className="relative">
                                                        <span className="text-primary/50 font-semibold text-sm cursor-not-allowed inline-flex items-center gap-2 opacity-70">
                                                            {t("home.service.learnMore")}
                                                        </span>
                                                        <div className="absolute -top-3 -right-3 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap z-20 border-2 border-white/30 animate-pulse">
                                                            {t("comingSoon")}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <Link 
                                                        href={service.link}
                                                        className="inline-flex items-center gap-2 text-primary font-semibold text-sm
                                                            transition-all duration-500
                                                            hover:gap-3 hover:text-accent
                                                            group/link
                                                        "
                                                    >
                                                        <span>{t("home.service.learnMore")}</span>
                                                        <span className="transition-transform duration-500 group-hover/link:translate-x-1">
                                                            →
                                                        </span>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>

                                        {/* Subtle Border Glow */}
                                        <div className={`
                                            absolute inset-0 rounded-3xl
                                            transition-opacity duration-700
                                            bg-gradient-to-r from-primary/8 via-accent/8 to-primary/8
                                            blur-sm -z-10
                                            ${!isBooking ? 'opacity-50 group-hover:opacity-80' : 'opacity-30'}
                                        `} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="relative overflow-hidden py-24 md:py-32 px-4 md:px-8">
                <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-primary/5 dark:from-[#0c0c0d] dark:via-[#111113] dark:to-primary/10" />
                <div className="absolute inset-x-0 top-10 h-64 bg-[radial-gradient(circle_at_top,rgba(255,225,210,0.45),transparent_70%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,200,180,0.2),transparent_70%)]" />
                <div className="absolute inset-x-0 bottom-0 h-40 bg-[radial-gradient(circle_at_bottom,rgba(255,255,255,0.6),transparent_65%)] dark:bg-[radial-gradient(circle_at_bottom,rgba(30,30,30,0.5),transparent_65%)]" />

                <div className="container-custom relative z-10 max-w-7xl mx-auto">
                    <div className="grid gap-16 lg:gap-24 xl:gap-32 lg:grid-cols-2 items-start">
                        <div className="space-y-10">
                            <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary dark:text-primary/90">
                                <span className="h-px w-6 bg-primary/60 dark:bg-primary/50" />
                                {t("home.choose.badge")}
                                <span className="h-px w-6 bg-primary/60 dark:bg-primary/50" />
                            </span>

                            <div className="space-y-6">
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-junicode text-foreground dark:text-white leading-tight">
                                    {t("home.choose.title")}
                                </h2>
                                <p className="text-lg md:text-xl text-muted-foreground dark:text-white/70 leading-relaxed max-w-2xl">
                                    {t("home.choose.subtitle")}
                                </p>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                {chooseFeatures.map((feature) => {
                                    const Icon = feature.icon;
                                    return (
                                        <Card
                                            key={feature.title}
                                            className="relative h-full border-primary/10 dark:border-white/10 bg-white/80 dark:bg-[#121214]/80 backdrop-blur-md p-6 shadow-sm hover:shadow-xl transition-all duration-500"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <div className="space-y-2">
                                                    <h3 className="text-xl font-semibold text-foreground dark:text-white">
                                                        {feature.title}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground dark:text-white/70 leading-relaxed">
                                                        {feature.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="lg:sticky lg:top-24">
                            <div className="rounded-[32px] border border-primary/10 dark:border-white/10 bg-white/85 dark:bg-[#111114]/80 backdrop-blur-md p-8 lg:p-10 shadow-[0_20px_80px_rgba(15,15,20,0.08)] dark:shadow-[0_25px_80px_rgba(0,0,0,0.55)] space-y-10">
                                <div className="grid grid-cols-3 gap-6">
                                    {chooseStats.map((stat) => (
                                        <div key={stat.label} className="text-center">
                                            <div className="text-3xl lg:text-4xl font-bold text-foreground dark:text-white">{stat.value}</div>
                                            <p className="text-xs font-medium text-muted-foreground dark:text-white/60 mt-2">
                                                {stat.label}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="rounded-[28px] border border-primary/10 dark:border-white/5 bg-gradient-to-br from-primary/10 via-white to-white/90 dark:from-primary/10 dark:via-[#111113] dark:to-[#111114] p-8 space-y-6">
                                    <h3 className="text-2xl font-semibold text-foreground dark:text-white">
                                        {t("home.choose.cta.title")}
                                    </h3>
                                    <p className="text-base text-muted-foreground dark:text-white/70 leading-relaxed">
                                        {t("home.choose.cta.subtitle")}
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Link href={getLocalizedPath("/contact", language as 'el' | 'en')} className="flex-1">
                                            <Button className="w-full h-12 rounded-full text-sm font-semibold shadow-md shadow-primary/20 dark:shadow-primary/40">
                                                {t("home.choose.cta.primary")}
                                            </Button>
                                        </Link>
                                        <Link href={getLocalizedPath("/gallery", language as 'el' | 'en')} className="flex-1">
                                            <Button
                                                variant="outline"
                                                className="w-full h-12 rounded-full text-sm font-semibold border-primary/30 text-primary hover:text-primary dark:text-white dark:border-white/20 dark:hover:bg-white/10"
                                            >
                                                {t("home.choose.cta.secondary")}
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section - Premium Design */}
            <section className="relative py-20 md:py-28 px-4 md:px-8 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/3 to-background" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.08),transparent_70%)]" />
                
                <div className="container-custom relative z-10 max-w-5xl mx-auto">
                    <div className="relative rounded-3xl border border-primary/10 dark:border-white/10 bg-white/80 dark:bg-[#1a2e1f]/80 backdrop-blur-xl p-10 md:p-12 shadow-2xl">
                        {/* Decorative Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-3xl" />
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />
                        
                        <div className="relative z-10 text-center">
                            {/* Icon */}
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 dark:bg-primary/20 mb-6">
                                <Sparkles className="h-8 w-8 text-primary" />
                            </div>
                            
                            {/* Title */}
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-junicode font-bold text-foreground dark:text-white mb-4 leading-tight">
                                {t("home.cta.title")}
                            </h2>
                            
                            {/* Subtitle */}
                            <p className="text-base md:text-lg text-muted-foreground dark:text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
                            {t("home.cta.subtitle")}
                        </p>
                            
                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                {/* Disabled Book Now Button */}
                        <div className="relative inline-block group">
                            <Button 
                                disabled
                                        className="h-12 px-8 rounded-lg bg-primary/50 text-white cursor-not-allowed opacity-75"
                            >
                                {t("home.cta.btn")}
                            </Button>
                                        <div className="absolute -top-2 -right-2 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg whitespace-nowrap z-10 border border-white/20">
                                        {t("comingSoon")}
                                    </div>
                                </div>
                                
                                {/* Phone Booking Button */}
                                <a href="tel:+302106818011">
                                    <Button 
                                        className="h-12 px-8 rounded-lg bg-accent hover:bg-accent/90 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                                    >
                                        <Phone className="h-4 w-4 mr-2" />
                                        {t("home.cta.phone")}
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map & Hours Section */}
            <section className="relative py-20 md:py-28 px-4 md:px-8">
                <div className="absolute inset-0 bg-gradient-to-b from-background to-primary/3 dark:to-primary/8" />
                <div className="container-custom relative z-10 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                        {/* Opening Hours */}
                        <div className="order-2 lg:order-1">
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    {isChristmasActive && renderHolidayIcon("text-4xl", "h-12 w-12")}
                                    <h2 className={`text-3xl md:text-4xl lg:text-5xl font-junicode font-bold leading-tight ${
                                        isChristmasActive
                                            ? getHolidayClass(
                                                "bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent",
                                                "bg-gradient-to-r from-green-600 to-pink-600 bg-clip-text text-transparent",
                                                "bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent",
                                                "bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent"
                                              )
                                            : "text-foreground dark:text-white"
                                    }`}>
                                        {isChristmasActive
                                            ? (language === "el" ? holidayStyle.title?.el : holidayStyle.title?.en) || t("contact.hours.title")
                                            : t("contact.hours.title")
                                        }
                                </h2>
                                </div>
                                <p className={`text-base ${
                                    isChristmasActive
                                        ? getHolidayClass(
                                            "text-yellow-700 dark:text-yellow-300",
                                            "text-green-700 dark:text-green-300",
                                            "text-purple-700 dark:text-purple-300",
                                            "text-red-700 dark:text-red-300"
                                          )
                                        : "text-muted-foreground dark:text-white/70"
                                }`}>
                                    {isChristmasActive
                                        ? (language === "el" ? "Ειδικό ωράριο για τις γιορτές" : "Special holiday hours")
                                        : t("contact.info.subtitle")
                                    }
                                </p>
                            </div>
                            
                            <div className="space-y-2">
                                {[
                                    { key: "contact.hours.monday", day: language === "el" ? "Δευτέρα" : "Monday" },
                                    { key: "contact.hours.tuesday", day: language === "el" ? "Τρίτη" : "Tuesday" },
                                    { key: "contact.hours.wednesday", day: language === "el" ? "Τετάρτη" : "Wednesday" },
                                    { key: "contact.hours.thursday", day: language === "el" ? "Πέμπτη" : "Thursday" },
                                    { key: "contact.hours.friday", day: language === "el" ? "Παρασκευή" : "Friday" },
                                    { key: "contact.hours.saturday", day: language === "el" ? "Σάββατο" : "Saturday" },
                                    { key: "contact.hours.sunday", day: language === "el" ? "Κυριακή" : "Sunday" }
                                ].map((item, idx) => {
                                    const hourText = t(item.key);
                                    // Extract time part after the colon (e.g., "Τρίτη: 10:00 - 20:00" -> "10:00 - 20:00")
                                    let time = hourText.includes(":") ? hourText.substring(hourText.indexOf(":") + 1).trim() : hourText;
                                    
                                    const todayIndex = ((new Date().getDay() + 6) % 7);
                                    const isToday = idx === todayIndex;
                                    
                                    // If Christmas schedule is active, use it
                                    const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
                                    const dayKey = dayKeys[idx];
                                    
                                    if (isChristmasActive && christmasSchedule && dayKey) {
                                        const christmasHours = getHoursForDay(dayKey, language as 'el' | 'en');
                                        if (christmasHours) {
                                            time = christmasHours;
                                        }
                                    }
                                    
                                    const christmasDate = isChristmasActive && christmasSchedule?.dates?.[dayKey];
                                    const formattedDate = christmasDate ? new Date(christmasDate).toLocaleDateString('el-GR', { day: 'numeric', month: 'numeric' }) : null;
                                    
                                    return (
                                        <div
                                            key={item.key}
                                            className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                                                isToday
                                                    ? isChristmasActive
                                                        ? getHolidayClass(
                                                            "bg-gradient-to-r from-yellow-100/80 to-amber-100/80 dark:from-yellow-900/40 dark:to-amber-900/40 border-yellow-300/50 dark:border-yellow-700/50 shadow-md shadow-yellow-500/20",
                                                            "bg-gradient-to-r from-green-100/80 to-pink-100/80 dark:from-green-900/40 dark:to-pink-900/40 border-green-300/50 dark:border-green-700/50 shadow-md shadow-green-500/20",
                                                            "bg-gradient-to-r from-purple-100/80 to-indigo-100/80 dark:from-purple-900/40 dark:to-indigo-900/40 border-purple-300/50 dark:border-purple-700/50 shadow-md shadow-purple-500/20",
                                                            "bg-gradient-to-r from-red-100/80 to-green-100/80 dark:from-red-900/40 dark:to-green-900/40 border-red-300/50 dark:border-red-700/50 shadow-md shadow-red-500/20"
                                                          )
                                                        : "bg-primary/10 dark:bg-primary/20 border-primary/30 dark:border-primary/40 shadow-md shadow-primary/10"
                                                    : isChristmasActive
                                                        ? getHolidayClass(
                                                            "border-yellow-200/30 dark:border-yellow-800/30 bg-gradient-to-br from-yellow-50/40 to-amber-50/40 dark:from-yellow-950/20 dark:to-amber-950/20 backdrop-blur-sm hover:from-yellow-50/60 hover:to-amber-50/60",
                                                            "border-green-200/30 dark:border-green-800/30 bg-gradient-to-br from-green-50/40 to-pink-50/40 dark:from-green-950/20 dark:to-pink-950/20 backdrop-blur-sm hover:from-green-50/60 hover:to-pink-50/60",
                                                            "border-purple-200/30 dark:border-purple-800/30 bg-gradient-to-br from-purple-50/40 to-indigo-50/40 dark:from-purple-950/20 dark:to-indigo-950/20 backdrop-blur-sm hover:from-purple-50/60 hover:to-indigo-50/60",
                                                            "border-red-200/30 dark:border-red-800/30 bg-gradient-to-br from-red-50/40 to-green-50/40 dark:from-red-950/20 dark:to-green-950/20 backdrop-blur-sm hover:from-red-50/60 hover:to-green-50/60"
                                                          )
                                                    : "border-primary/10 dark:border-white/10 bg-white/60 dark:bg-[#1a2e1f]/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-[#1a2e1f]/80 hover:border-primary/20 dark:hover:border-white/20"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                {isChristmasActive && renderHolidayIcon("text-sm", "h-4 w-4")}
                                                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                    isToday 
                                                        ? isChristmasActive
                                                            ? getHolidayClass(
                                                                "bg-gradient-to-r from-yellow-500 to-amber-500 shadow-lg shadow-yellow-500/50",
                                                                "",
                                                                "bg-gradient-to-r from-purple-500 to-indigo-500 shadow-lg shadow-purple-500/50",
                                                                ""
                                                              )
                                                            : "bg-primary shadow-lg shadow-primary/50"
                                                        : isChristmasActive
                                                            ? getHolidayClass(
                                                                "bg-yellow-400/40 group-hover:bg-yellow-400/60",
                                                                "",
                                                                "bg-purple-400/40 group-hover:bg-purple-400/60",
                                                                ""
                                                              )
                                                        : "bg-primary/20 group-hover:bg-primary/40"
                                                }`}
                                                style={isToday && isChristmasActive && (holidayStyle.type === 'christmas' || holidayStyle.type === 'easter') ? {
                                                  backgroundColor: holidayStyle.colors.accent,
                                                  boxShadow: `0 10px 40px ${holidayStyle.colors.accent}80`
                                                } : !isToday && isChristmasActive && (holidayStyle.type === 'christmas' || holidayStyle.type === 'easter') ? {
                                                  backgroundColor: `${holidayStyle.colors.accent}66`,
                                                } : undefined}
                                                />
                                                <span className={`text-sm md:text-base font-medium flex items-center gap-2 ${
                                                    isToday 
                                                        ? isChristmasActive
                                                            ? getHolidayClass(
                                                                "text-yellow-800 dark:text-yellow-200",
                                                                "text-green-800 dark:text-green-200",
                                                                "text-purple-800 dark:text-purple-200",
                                                                "text-red-800 dark:text-red-200"
                                                              )
                                                            : "text-primary dark:text-primary/90"
                                                        : isChristmasActive
                                                            ? getHolidayClass(
                                                                "text-yellow-700 dark:text-yellow-300",
                                                                "text-green-700 dark:text-green-300",
                                                                "text-purple-700 dark:text-purple-300",
                                                                "text-red-700 dark:text-red-300"
                                                              )
                                                        : "text-foreground dark:text-white"
                                                }`}>
                                                    {item.day}
                                                    {formattedDate && (
                                                        <span className={`text-xs font-semibold ${
                                                            isToday && isChristmasActive
                                                                ? getHolidayClass(
                                                                    "text-yellow-900 dark:text-yellow-100",
                                                                    "text-green-900 dark:text-green-100",
                                                                    "text-purple-900 dark:text-purple-100",
                                                                    "text-red-900 dark:text-red-100"
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
                                            </div>
                                            <span className={`text-sm md:text-base font-semibold ${
                                                isToday 
                                                    ? isChristmasActive
                                                        ? getHolidayClass(
                                                            "text-yellow-800 dark:text-yellow-200",
                                                            "text-green-800 dark:text-green-200",
                                                            "text-purple-800 dark:text-purple-200",
                                                            "text-red-800 dark:text-red-200"
                                                          )
                                                        : "text-primary dark:text-primary/90"
                                                    : isChristmasActive
                                                        ? getHolidayClass(
                                                            "text-yellow-700 dark:text-yellow-300",
                                                            "text-green-700 dark:text-green-300",
                                                            "text-purple-700 dark:text-purple-300",
                                                            "text-red-700 dark:text-red-300"
                                                          )
                                                    : "text-muted-foreground dark:text-white/70"
                                            }`}>
                                                {time}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Closure Notices */}
                            {isChristmasActive && christmasSchedule?.closureNotices && christmasSchedule.closureNotices.length > 0 && (
                              <div 
                                className={`mt-4 rounded-xl border p-3 space-y-2 ${
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
                                  {language === "en" ? 'The salon will remain closed:' : 'Το κατάστημα θα παραμείνει κλειστό:'}
                                </p>
                                {christmasSchedule.closureNotices.map((notice) => {
                                  if (!notice.from && !notice.to) return null;
                                  const formatDate = (value?: string, locale: 'el' | 'en' = 'el') => {
                                    if (!value) return '';
                                    const parsed = new Date(value);
                                    if (Number.isNaN(parsed.getTime())) return '';
                                    return parsed.toLocaleDateString(locale === 'en' ? 'en-US' : 'el-GR', { day: '2-digit', month: '2-digit' });
                                  };
                                  const fromDate = notice.from ? formatDate(notice.from, language as 'el' | 'en') : '';
                                  const toDate = notice.to ? formatDate(notice.to, language as 'el' | 'en') : '';
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
                                        ? language === "en"
                                          ? `From ${fromDate} to ${toDate}`
                                          : `Από ${fromDate} έως ${toDate}`
                                        : fromDate || toDate}
                                    </p>
                                  );
                                })}
                              </div>
                            )}

                            {/* Contact Info */}
                            <div className="mt-8 space-y-4">
                                <div className="flex items-start gap-4 p-4 rounded-lg border border-primary/10 dark:border-white/10 bg-white/60 dark:bg-[#1a2e1f]/60 backdrop-blur-sm">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                                        <Phone className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground dark:text-white mb-1">
                                            {t("contact.call.title")}
                                        </p>
                                        <a href="tel:+302106818011" className="text-sm text-muted-foreground dark:text-white/70 hover:text-primary dark:hover:text-primary/90 transition-colors">
                                            +3021 0681 8011
                                        </a>
                                    </div>
                                </div>
                                <a 
                                    href="https://www.google.com/maps/search/?api=1&query=Ανδρέα+Παπανδρέου+52,+Χαλάνδρι,+152+32"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-4 p-4 rounded-lg border border-primary/10 dark:border-white/10 bg-white/60 dark:bg-[#1a2e1f]/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-[#1a2e1f]/80 hover:border-primary/20 dark:hover:border-white/20 transition-all duration-300 cursor-pointer group"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 dark:group-hover:bg-primary/25 transition-colors">
                                        <MapPin className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground dark:text-white mb-1 group-hover:text-primary dark:group-hover:text-primary/90 transition-colors">
                                            {t("contact.visit.title")}
                                        </p>
                                        <p className="text-sm text-muted-foreground dark:text-white/70 group-hover:text-primary dark:group-hover:text-primary/90 transition-colors">
                                            Ανδρέα Παπανδρέου 52<br />
                                            Χαλάνδρι, 152 32
                                        </p>
                                    </div>
                                </a>
                            </div>
                        </div>

                        {/* Map */}
                        <div className="order-1 lg:order-2">
                            <div className="mb-8">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-junicode font-bold text-foreground dark:text-white mb-4 leading-tight">
                                    {t("contact.map.title")}
                                </h2>
                                <p className="text-base text-muted-foreground dark:text-white/70">
                                    {t("contact.map.subtitle")}
                                </p>
                            </div>
                            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-primary/10 dark:border-white/10 h-[450px] md:h-[550px]">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3143.192450149765!2d23.794442777303292!3d38.01929267192462!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a1993309bc2919%3A0x646730b994f8ba01!2zzpHOu861zr7OrM69zrTPgc6xIM6hzq_Ots6_z4UgLSBIYWlyIEJlYXV0eSAmIEhlYWx0aCBTZXJ2aWNlcw!5e0!3m2!1sen!2sgr!4v1763749353683!5m2!1sen!2sgr"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Alexandra Rizou - Hair Beauty & Health Services"
                                />
                                        </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEO Hidden Content - Keywords for Search Engines */}
            <div className="sr-only" aria-hidden="true">
                <h1>Alexandra Rizou Hair-Beauty & Health Services - Γυναικείο Κούρεμα Χαλάνδρι</h1>
                <h2>Κορυφαίο Γυναικείο Κομμωτήριο στο Χαλάνδρι</h2>
                <h3>Εξειδικευμένο Γυναικείο Κούρεμα Χαλάνδρι</h3>
                <p>
                    Το <strong>Alexandra Rizou Hair-Beauty & Health Services</strong> είναι το <strong>καλύτερο γυναικείο κομμωτήριο στο Χαλάνδρι</strong>, 
                    εξειδικευμένο σε <strong>γυναικείο κούρεμα</strong>, <strong>balayage Χαλάνδρι</strong>, <strong>highlights Χαλάνδρι</strong>, 
                    <strong>χρωματισμό μαλλιών Χαλάνδρι</strong>, <strong>θεραπείες μαλλιών</strong>, <strong>manicure Χαλάνδρι</strong>, 
                    <strong>pedicure Χαλάνδρι</strong> και <strong>waxing Χαλάνδρι</strong>. 
                    Βρίσκεται στην <strong>Ανδρέα Παπανδρέου 52, Χαλάνδρι 152 32</strong>. 
                    Κλείστε ραντεβού στο <strong>+30 210 6818 011</strong>.
                </p>
                <p>
                    <strong>Κομμωτήριο Χαλάνδρι</strong>, <strong>γυναικείο κούρεμα Χαλάνδρι</strong>, 
                    <strong>κομμωτήριο γυναικείος Χαλάνδρι</strong>, <strong>κούρεμα Χαλάνδρι</strong>, 
                    <strong>Alexandra Rizou Χαλάνδρι</strong>, <strong>balayage Χαλάνδρι</strong>, 
                    <strong>highlights Χαλάνδρι</strong>, <strong>χρωματισμός μαλλιών Χαλάνδρι</strong>, 
                    <strong>θεραπεία μαλλιών Χαλάνδρι</strong>, <strong>manicure Χαλάνδρι</strong>, 
                    <strong>pedicure Χαλάνδρι</strong>, <strong>waxing Χαλάνδρι</strong>, 
                    <strong>κομμωτήριο Βόρεια Προάστια</strong>, <strong>γυναικείο κούρεμα Αθήνα</strong>, 
                    <strong>κομμωτήριο Μαρούσι</strong>, <strong>κομμωτήριο Κηφισιά</strong>, 
                    <strong>women's haircut Chalandri</strong>, <strong>hair salon Chalandri</strong>, 
                    <strong>women's hair salon Chalandri</strong>, <strong>haircut Chalandri</strong>, 
                    <strong>hair color Chalandri</strong>, <strong>balayage Chalandri</strong>, 
                    <strong>highlights Chalandri</strong>, <strong>hair treatment Chalandri</strong>.
                </p>
                <ul>
                    <li>Γυναικείο Κούρεμα Χαλάνδρι - 25€</li>
                    <li>Balayage Χαλάνδρι - 55€</li>
                    <li>Highlights Χαλάνδρι - Από 30€</li>
                    <li>Χρωματισμός Μαλλιών Χαλάνδρι - Από 38€</li>
                    <li>Θεραπεία Μαλλιών Χαλάνδρι - 10€</li>
                    <li>Manicure Χαλάνδρι - 5€</li>
                    <li>Pedicure Χαλάνδρι - 5€</li>
                    <li>Waxing Χαλάνδρι - 5€</li>
                </ul>
                <address>
                    Alexandra Rizou Hair-Beauty & Health Services<br />
                    Ανδρέα Παπανδρέου 52<br />
                    Χαλάνδρι, 152 32<br />
                    Αττική, Ελλάδα<br />
                    Τηλέφωνο: +30 210 6818 011<br />
                    Email: ar.hairbeauty.healthservices@gmail.com
                </address>
            </div>

            <Footer />
        </div>
    );
}

