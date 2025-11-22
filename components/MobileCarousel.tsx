"use client";

import { useState, useEffect, useRef, type TouchEvent } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileCarouselProps {
    images: string[];
    className?: string;
}

export default function MobileCarousel({ images, className }: MobileCarouselProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);
    const [loadedSlides, setLoadedSlides] = useState(() =>
        images.map((_, index) => index === 0)
    );
    const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Preload images
    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        let isCancelled = false;
        const cleanups: Array<() => void> = [];

        images.forEach((src, index) => {
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
    }, [images]);

    // Auto-play carousel with progress tracking
    useEffect(() => {
        if (!isPlaying || !loadedSlides.every(Boolean) || images.length < 2) {
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

        setProgress(0);

        progressIntervalRef.current = setInterval(() => {
            setProgress((prev) => {
                const next = prev + (100 / (slideDuration / progressUpdateInterval));
                if (next >= 100) {
                    return 0;
                }
                return next;
            });
        }, progressUpdateInterval);

        autoPlayIntervalRef.current = setInterval(() => {
            setCurrentSlide((prev) => {
                const next = (prev + 1) % images.length;
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
    }, [isPlaying, currentSlide, loadedSlides, images.length]);

    const findNextLoadedIndex = (start: number, direction: 1 | -1) => {
        for (let step = 1; step <= images.length; step++) {
            const candidate = (start + direction * step + images.length) % images.length;
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
        setProgress(0);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => findNextLoadedIndex(prev, -1));
        setProgress(0);
    };

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
        <div
            ref={containerRef}
            className={cn(
                "relative w-full",
                className
            )}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
                contain: 'layout style paint',
                willChange: 'auto',
            }}
        >
            {/* Decorative Background Elements */}
            <div className="absolute -inset-4 -z-10">
                <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl" />
            </div>

            {/* Carousel Container - Enhanced Style */}
            <div className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-background/80 via-background/70 to-background/80 dark:from-background/90 dark:via-background/85 dark:to-background/90 border-2 border-primary/25 dark:border-primary/35 shadow-xl shadow-primary/10 dark:shadow-primary/15 backdrop-blur-sm">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 dark:from-primary/10 dark:via-transparent dark:to-primary/10 pointer-events-none" />
                {/* Images Container */}
                <div 
                    className="relative flex transition-transform duration-500 ease-in-out"
                    style={{
                        transform: `translateX(-${currentSlide * 100}%)`,
                        willChange: 'transform',
                    }}
                >
                    {images.map((image, index) => {
                        const isActive = index === currentSlide;
                        const isLoaded = loadedSlides[index];

                        return (
                            <div
                                key={index}
                                className="relative w-full flex-shrink-0"
                            >
                                {/* Image Container - Enhanced with Frame */}
                                <div className="relative m-4 aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-muted/40 via-muted/30 to-muted/40 dark:from-muted/30 dark:via-muted/20 dark:to-muted/30 border border-primary/20 dark:border-primary/30 shadow-lg shadow-primary/5 dark:shadow-primary/10">
                                    {/* Decorative corner accents */}
                                    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/30 dark:border-primary/40 rounded-tl-2xl z-10" />
                                    <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary/30 dark:border-primary/40 rounded-tr-2xl z-10" />
                                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary/20 dark:border-primary/30 rounded-bl-2xl z-10" />
                                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary/20 dark:border-primary/30 rounded-br-2xl z-10" />
                                    {isLoaded ? (
                                        <Image
                                            src={image}
                                            alt={`Slide ${index + 1}`}
                                            fill
                                            className={cn(
                                                "object-cover transition-opacity duration-500",
                                                isActive ? "opacity-100" : "opacity-0"
                                            )}
                                            priority={index === 0}
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            style={{
                                                willChange: 'opacity',
                                            }}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-muted/40 dark:bg-muted/30 animate-pulse" />
                                    )}
                                    
                                    {/* Loading State */}
                                    {!isLoaded && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-6 h-6 border-2 border-primary/20 dark:border-primary/40 border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Navigation Arrows - Enhanced Style */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-gradient-to-br from-background/95 via-background/90 to-background/95 dark:from-background/95 dark:via-background/90 dark:to-background/95 backdrop-blur-md border-2 border-primary/30 dark:border-primary/40 hover:bg-background dark:hover:bg-background hover:border-primary/50 dark:hover:border-primary/60 transition-all duration-300 active:scale-95 shadow-lg shadow-primary/10 dark:shadow-primary/15 hover:shadow-xl hover:shadow-primary/20 group"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-5 h-5 text-primary dark:text-primary/90 group-hover:scale-110 transition-transform duration-300" />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-gradient-to-br from-background/95 via-background/90 to-background/95 dark:from-background/95 dark:via-background/90 dark:to-background/95 backdrop-blur-md border-2 border-primary/30 dark:border-primary/40 hover:bg-background dark:hover:bg-background hover:border-primary/50 dark:hover:border-primary/60 transition-all duration-300 active:scale-95 shadow-lg shadow-primary/10 dark:shadow-primary/15 hover:shadow-xl hover:shadow-primary/20 group"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-5 h-5 text-primary dark:text-primary/90 group-hover:scale-110 transition-transform duration-300" />
                </button>

                {/* Indicators - Enhanced Design */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-background/90 via-background/85 to-background/90 dark:from-background/95 dark:via-background/90 dark:to-background/95 backdrop-blur-md border-2 border-primary/20 dark:border-primary/30 shadow-lg shadow-primary/10 dark:shadow-primary/15">
                    {/* Pause/Play Button */}
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="h-7 w-7 rounded-full bg-gradient-to-br from-primary/15 via-primary/10 to-primary/15 dark:from-primary/25 dark:via-primary/20 dark:to-primary/25 hover:from-primary/20 hover:via-primary/15 hover:to-primary/20 dark:hover:from-primary/30 dark:hover:via-primary/25 dark:hover:to-primary/30 border border-primary/30 dark:border-primary/40 transition-all duration-300 flex items-center justify-center active:scale-95 shadow-sm"
                        aria-label={isPlaying ? "Pause carousel" : "Play carousel"}
                    >
                        {isPlaying ? (
                            <Pause className="h-3.5 w-3.5 text-primary dark:text-primary/90" />
                        ) : (
                            <Play className="h-3.5 w-3.5 text-primary dark:text-primary/90 ml-0.5" />
                        )}
                    </button>

                    {/* Indicator Dots */}
                    <div className="flex gap-2">
                        {images.map((_, index) => {
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
                                    className={cn(
                                        "relative transition-all duration-300 rounded-full overflow-hidden",
                                        isActive
                                            ? "w-10 h-2 bg-gradient-to-r from-primary/50 via-primary/40 to-primary/50 dark:from-primary/60 dark:via-primary/50 dark:to-primary/60 shadow-sm"
                                            : "w-2 h-2 bg-primary/30 dark:bg-primary/40 hover:bg-primary/50 dark:hover:bg-primary/60 hover:scale-110",
                                        !loadedSlides[index] && "opacity-30 cursor-not-allowed"
                                    )}
                                    aria-label={`Go to slide ${index + 1}`}
                                >
                                    {isActive && isPlaying && (
                                        <div
                                            className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary dark:from-primary/90 dark:via-primary dark:to-primary/90 rounded-full transition-all duration-75 ease-linear shadow-sm"
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

            </div>
        </div>
    );
}

