"use client";

import { useState, useEffect, useRef, type TouchEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const heroImages = [
    "/assets/hero-salon.jpg",
    "/assets/tree-background.jpg",
    "/assets/gallery-new-4.jpg",
    "/assets/gallery-new-5.jpg"
];

const servicesBackground = "/assets/salon-interior-bg.jpg";

export default function Home() {
    const { t } = useLanguage();
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
                className="relative min-h-screen flex items-center justify-center overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                    contain: 'layout style paint',
                    willChange: 'auto',
                    transform: 'translateZ(0)',
                }}
            >
                {/* Carousel Background Images */}
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
                                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/30" />
                                {!isLoaded && (
                                    <div className="absolute inset-0 bg-black/20 animate-pulse" />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Navigation Arrows */}
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

                {/* Hero Content - Clean Centered Layout */}
                <div className="relative z-10 container-custom px-4 md:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-col items-center justify-center min-h-[90vh] py-20 text-center space-y-6">
                            
                            {/* Accent Label with Separator */}
                            <div className="inline-flex items-center gap-3 mb-4 animate-fade-in">
                                <div className="h-px w-16 bg-primary/60"></div>
                                <span className="text-xs md:text-sm font-semibold text-primary uppercase tracking-[0.2em]">
                                    {t("home.hero.title1")}
                                </span>
                                <div className="h-px w-16 bg-primary/60"></div>
                            </div>

                            {/* Main Title with Junicode Font */}
                            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-junicode leading-[1.2] text-white mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                                {t("home.hero.title2")}
                            </h1>
                            
                            {/* Subtitle */}
                            <p className="text-lg md:text-xl lg:text-2xl text-white/95 leading-relaxed max-w-2xl mx-auto font-light mb-10 animate-fade-in" style={{ animationDelay: '0.2s', letterSpacing: '0.01em' }}>
                                {t("home.hero.subtitle")}
                            </p>
                            
                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                                <div className="relative group">
                                    <Button 
                                        disabled
                                        className="h-11 px-8 text-sm font-medium rounded-full bg-primary/50 text-white/70 cursor-not-allowed shadow-lg opacity-75"
                                    >
                                        {t("home.hero.bookBtn")}
                                    </Button>
                                    <div className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap z-10 border border-white/20">
                                        Έρχεται σύντομα
                                    </div>
                                </div>
                                <Link href="/services">
                                    <Button variant="outline" className="h-11 px-8 text-sm font-medium rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105">
                                        {t("home.hero.servicesBtn")}
                                    </Button>
                                </Link>
                            </div>

                            {/* Google Rating - Above Medals */}
                            <a
                                href="https://share.google/etcIhjfAjRCxAwAvp"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/8 backdrop-blur-2xl border border-white/20 hover:border-white/35 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20 animate-fade-in mb-4 overflow-hidden"
                                style={{ animationDelay: '0.35s' }}
                            >
                                {/* Animated gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl" />
                                
                                {/* Subtle shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl" />
                                
                                <div className="relative z-10 flex items-center gap-4">
                                    {/* Google Logo Container */}
                                    <div className="relative p-2.5 rounded-xl bg-white/5 group-hover:bg-white/10 transition-all duration-300 group-hover:scale-110">
                                        <svg 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-white"
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
                                    
                                    {/* Stars */}
                                    <div className="flex items-center gap-1.5">
                                        {[...Array(5)].map((_, i) => (
                                            <svg 
                                                key={i}
                                                version="1.0" 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                viewBox="0 0 64 64" 
                                                className="h-5 w-5 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm" 
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

                            {/* Medals - Below Content */}
                            <div className="flex items-center gap-6 pt-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                                <img 
                                    src="/gold_medal_2025.png" 
                                    alt="Gold Medal 2025" 
                                    className="h-14 md:h-16 w-auto opacity-85 drop-shadow-lg"
                                />
                                <img 
                                    src="/laureate_medal_2025.png" 
                                    alt="Laureate Medal 2025" 
                                    className="h-14 md:h-16 w-auto opacity-85 drop-shadow-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Carousel Indicators */}
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
            </section>

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
                                                        alt={service.title}
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
                                                            Έρχεται σύντομα
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

            {/* CTA Section */}
            <section className="section-padding relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background" />
                <div className="container-custom relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="h-12 w-12 mx-auto mb-6 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-2xl">✨</span>
                            </div>
                        </div>
                        <h2 className="heading-secondary mb-6">{t("home.cta.title")}</h2>
                        <p className="text-body text-muted-foreground mb-8 max-w-2xl mx-auto">
                            {t("home.cta.subtitle")}
                        </p>
                        <div className="relative inline-block group">
                            <Button 
                                disabled
                                className="btn-primary opacity-75 cursor-not-allowed bg-primary/50 hover:bg-primary/50"
                            >
                                {t("home.cta.btn")}
                            </Button>
                                        <div className="absolute -top-2 -right-2 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg whitespace-nowrap z-10 border border-white/20">
                                            Έρχεται σύντομα
                                        </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

