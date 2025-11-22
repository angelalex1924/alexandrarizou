'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Sparkles, Scissors } from 'lucide-react';
import Image from 'next/image';

const logo = "/assets/logo.png";
const logoWhite = "/assets/rizou_logo_white.png";

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  className?: string;
  icon?: string; // Path to icon image
}

export default function PageHeader({ 
  title, 
  subtitle,
  className = "",
  icon
}: PageHeaderProps) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const [isAnimated, setIsAnimated] = useState(false);

  // Animate text on mount - Optimized to prevent flickering
  useEffect(() => {
    if (typeof window === 'undefined' || isAnimated) return;

    const animateText = async () => {
      const { gsap } = await import('gsap');
      
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        if (titleRef.current && !titleRef.current.querySelector('span')) {
          const chars = titleRef.current.textContent?.split('') || [];
          titleRef.current.innerHTML = chars.map(char => 
            char === ' ' ? ' ' : `<span class="inline-block" style="opacity: 0;">${char}</span>`
          ).join('');
          
          const spans = titleRef.current.querySelectorAll('span');
          if (spans.length > 0) {
            gsap.to(spans, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.02,
              ease: 'power2.out',
              force3D: true
            });
          }
        }

        if (subtitleRef.current) {
          gsap.fromTo(
            subtitleRef.current,
            { opacity: 0, y: 10 },
            { 
              opacity: 1, 
              y: 0, 
              duration: 0.6,
              delay: 0.15,
              ease: 'power2.out',
              force3D: true
            }
          );
        }
        
        setIsAnimated(true);
      });
    };

    // Small delay to prevent flickering on initial render
    const timer = setTimeout(animateText, 50);
    return () => clearTimeout(timer);
  }, [title, subtitle, isAnimated]);

  const displayTitle = title || '';
  const displaySubtitle = subtitle || '';

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Organic Background Pattern */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat blur-[3px] scale-110 opacity-30 dark:opacity-15"
          style={{
            backgroundImage: 'url(/assets/tree-background.jpg)'
          }}
        ></div>
      </div>
      
      {/* Background Gradient - Different approach */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-primary/8 to-accent/8 dark:from-slate-900/40 dark:via-primary/15 dark:to-accent/12 rounded-3xl"></div>
      
      {/* Circular accent glows - Different positioning - Reduced animations */}
      <div className="absolute inset-0 opacity-25 dark:opacity-35">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-radial from-primary/25 via-primary/8 to-transparent blur-3xl" style={{ animationDuration: '12s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-gradient-radial from-accent/18 via-transparent to-transparent blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-radial from-primary/15 via-accent/10 to-transparent blur-2xl"></div>
      </div>

      {/* Circular dot pattern instead of grid */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]" style={{
        backgroundImage: 'radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>

      {/* Curved accent lines instead of diagonal */}
      <div className="absolute inset-0 opacity-8 dark:opacity-4">
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent transform -rotate-12"></div>
        <div className="absolute bottom-1/3 right-0 w-full h-px bg-gradient-to-l from-transparent via-accent/30 to-transparent transform rotate-12"></div>
      </div>
      
      {/* Content Container - Compact Layout */}
      <div className="relative z-10 p-6 sm:p-8 md:p-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Icon Container - Smaller */}
          {icon && (
            <div className="flex justify-center mb-4 md:mb-5">
              <div className="relative group">
                {/* Glow rings - Reduced */}
                <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-primary/20 via-accent/15 to-primary/20 dark:from-primary/15 dark:via-accent/10 dark:to-primary/15 blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-700"></div>
                
                {/* Circular icon container - Smaller */}
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-white/98 via-white/95 to-primary/5 dark:from-card/98 dark:via-card/95 dark:to-primary/10 backdrop-blur-2xl border-2 border-primary/30 dark:border-primary/40 shadow-xl shadow-primary/20 dark:shadow-primary/10 p-3 md:p-4 transition-all duration-700 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-primary/30 group-hover:border-primary/50 flex items-center justify-center">
                  <Image
                    src={icon}
                    alt=""
                    width={48}
                    height={48}
                    className={`object-contain transition-transform duration-700 group-hover:scale-110 ${icon === '/hair-styling_17828281.png' ? 'dark:brightness-0 dark:invert' : ''}`}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Title - Compact spacing */}
          <div className="mb-4 md:mb-5">
            <h1
              ref={titleRef}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-junicode font-bold text-foreground dark:text-white tracking-tight drop-shadow-lg leading-[1.1]"
            >
              {displayTitle}
            </h1>
          </div>
          
          {/* Subtitle - Compact layout */}
          <div className="flex flex-col items-center gap-3 mb-5">
            <div className="flex items-center justify-center w-full gap-3">
              <div className="w-10 md:w-16 h-px bg-gradient-to-r from-transparent via-primary/50 to-primary"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
              <div className="w-10 md:w-16 h-px bg-gradient-to-l from-transparent via-primary/50 to-primary"></div>
            </div>
            <p
              ref={subtitleRef}
              className="text-sm md:text-base lg:text-lg text-primary dark:text-primary/90 font-semibold tracking-wide leading-relaxed max-w-3xl px-4 text-center"
            >
              {displaySubtitle}
            </p>
            <div className="flex items-center justify-center w-full gap-3">
              <div className="w-10 md:w-16 h-px bg-gradient-to-r from-transparent via-accent/40 to-accent"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
              <div className="w-10 md:w-16 h-px bg-gradient-to-l from-transparent via-accent/40 to-accent"></div>
            </div>
          </div>

          {/* Tagline - Compact */}
          <div className="flex items-center justify-center gap-2.5 mb-6">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <p className="text-xs text-muted-foreground dark:text-white/70 font-semibold tracking-wider uppercase">
              Premium Beauty Experience
            </p>
            <div className="w-2 h-2 rounded-full bg-accent"></div>
          </div>
        </div>

        {/* Bottom accent - Logo */}
        <div className="flex items-center justify-center gap-4 md:gap-6 mt-6 md:mt-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/15 to-primary/5 border-2 border-primary/30 dark:border-primary/40 flex items-center justify-center shadow-lg shadow-primary/10 group/icon hover:scale-110 transition-transform duration-500">
              <Sparkles className="w-4 h-4 text-primary dark:text-primary/90 group-hover/icon:rotate-180 transition-transform duration-500" />
            </div>
            <div className="w-16 md:w-24 h-px bg-gradient-to-r from-primary/60 via-primary/40 to-transparent"></div>
          </div>
          <div className="px-3">
            <Image
              src={theme === "dark" ? logoWhite : logo}
              alt="Alexandra Rizou"
              width={180}
              height={60}
              className="h-12 md:h-14 w-auto object-contain"
              priority
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-16 md:w-24 h-px bg-gradient-to-l from-accent/60 via-accent/40 to-transparent"></div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/15 to-accent/5 border-2 border-accent/30 dark:border-accent/40 flex items-center justify-center shadow-lg shadow-accent/10 group/icon hover:scale-110 transition-transform duration-500">
              <Scissors className="w-4 h-4 text-accent dark:text-accent/90 group-hover/icon:rotate-12 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Single border with glow */}
      <div className="absolute inset-0 rounded-3xl border border-primary/25 dark:border-primary/35"></div>
      <div className="absolute inset-0 rounded-3xl shadow-xl shadow-primary/8 dark:shadow-primary/4"></div>
      
      {/* Circular corner accents instead of square */}
      <div className="absolute top-6 left-6 w-16 h-16 rounded-full border-2 border-primary/40 dark:border-primary/50"></div>
      <div className="absolute bottom-6 right-6 w-16 h-16 rounded-full border-2 border-accent/40 dark:border-accent/50"></div>
      
      {/* Decorative dots in corners */}
      <div className="absolute top-12 left-12 w-3 h-3 rounded-full bg-primary shadow-lg shadow-primary/30"></div>
      <div className="absolute bottom-12 right-12 w-3 h-3 rounded-full bg-accent shadow-lg shadow-accent/30"></div>
      <div className="absolute top-12 right-12 w-2 h-2 rounded-full bg-primary/60"></div>
      <div className="absolute bottom-12 left-12 w-2 h-2 rounded-full bg-accent/60"></div>
    </div>
  );
}

