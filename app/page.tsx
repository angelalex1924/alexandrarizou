"use client";

import { useState, useEffect, useRef, type TouchEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Scissors, Sparkles, Star, Clock, ChevronLeft, ChevronRight } from "lucide-react";
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
    const [loadedSlides, setLoadedSlides] = useState(() =>
        heroImages.map((_, index) => index === 0)
    );

    const services = [
        {
            icon: Scissors,
            title: t("home.service.hair.title"),
            description: t("home.service.hair.desc"),
            link: "/services#hair"
        },
        {
            icon: Sparkles,
            title: t("home.service.nails.title"),
            description: t("home.service.nails.desc"),
            link: "/services#nails"
        },
        {
            icon: Star,
            title: t("home.service.waxing.title"),
            description: t("home.service.waxing.desc"),
            link: "/services#waxing"
        },
        {
            icon: Clock,
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

    // Auto-play carousel after slides are ready
    useEffect(() => {
        if (!loadedSlides.every(Boolean) || heroImages.length < 2) {
            return;
        }

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroImages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [loadedSlides]);

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
                                    <div className="absolute inset-0 bg-background/30 animate-pulse" />
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
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                    {heroImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            disabled={!loadedSlides[index]}
                            aria-disabled={!loadedSlides[index]}
                            className={`transition-all duration-300 rounded-full ${
                                index === currentSlide
                                    ? 'w-12 h-2 bg-white shadow-lg'
                                    : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                            } ${!loadedSlides[index] ? 'opacity-40 cursor-not-allowed' : ''}`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </section>

            {/* Services Preview */}
            <section className="section-padding relative overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{
                    backgroundImage: `url(${servicesBackground})`
                }} />
                <div className="absolute inset-0 bg-background/80" />
                <div className="container-custom relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="heading-secondary mb-4">{t("home.services.title")}</h2>
                        <p className="text-body text-muted-foreground max-w-2xl mx-auto">
                            {t("home.services.subtitle")}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((service, index) => {
                            const isBooking = service.link === "/booking";
                            return (
                                <Card key={index} className={`card-service group ${isBooking ? 'relative' : ''}`}>
                                    {isBooking && (
                                        <div className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap z-10 border border-white/20">
                                            Έρχεται σύντομα
                                        </div>
                                    )}
                                    <div className="mb-4">
                                        <div className={`h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center transition-colors ${isBooking ? 'opacity-50' : 'group-hover:bg-primary/20'}`}>
                                            <service.icon className={`h-6 w-6 text-primary ${isBooking ? 'opacity-50' : ''}`} />
                                        </div>
                                    </div>
                                    <h3 className={`heading-tertiary mb-2 text-xl ${isBooking ? 'opacity-70' : ''}`}>{service.title}</h3>
                                    <p className={`text-muted-foreground mb-4 text-sm ${isBooking ? 'opacity-70' : ''}`}>{service.description}</p>
                                    {isBooking ? (
                                        <span className="text-primary/50 font-medium text-sm cursor-not-allowed inline-flex items-center opacity-70">
                                            {t("home.service.learnMore")}
                                        </span>
                                    ) : (
                                        <Link href={service.link} className="text-primary font-medium text-sm hover:text-accent transition-colors inline-flex items-center">
                                            {t("home.service.learnMore")}
                                        </Link>
                                    )}
                                </Card>
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
                        <Sparkles className="h-12 w-12 text-primary mx-auto mb-6" />
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

