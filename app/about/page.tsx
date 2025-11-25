"use client";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import SEOPlugin from "@/components/SEOPlugin";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Heart, Users, Sparkles, Calendar, Star, Trophy, Smile } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLocalizedPath } from "@/lib/i18n-routes";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function About() {
    const { t, language } = useLanguage();

    const stats = [
        {
            icon: Calendar,
            number: "10",
            label: language === "el" ? "Χρόνια Εμπειρίας" : "Years of Experience",
            color: "from-primary/20 to-primary/10",
        },
        {
            icon: Star,
            number: "5.0",
            label: language === "el" ? "Google Rating" : "Google Rating",
            color: "from-accent/20 to-accent/10",
        },
        {
            icon: Trophy,
            number: "2",
            label: language === "el" ? "Βραβεία 2025" : "Awards 2025",
            color: "from-primary/20 to-accent/10",
        },
        {
            icon: Smile,
            number: "1000+",
            label: language === "el" ? "Ευχαριστημένοι Πελάτες" : "Happy Clients",
            color: "from-accent/20 to-primary/10",
        },
    ];

    const team = [
        {
            name: "Sarah Johnson",
            role: "Founder & Master Stylist",
            description: "With over 15 years of experience, Sarah brings passion and precision to every cut and color.",
        },
        {
            name: "Emma Martinez",
            role: "Senior Hair Colorist",
            description: "Specializing in balayage and color correction, Emma creates stunning, natural-looking results.",
        },
        {
            name: "Lisa Chen",
            role: "Nail Art Specialist",
            description: "From classic elegance to bold designs, Lisa transforms nails into works of art.",
        },
        {
            name: "Maria Rodriguez",
            role: "Beauty Therapist",
            description: "Expert in waxing and facial treatments, Maria ensures a relaxing and professional experience.",
        },
    ];

    const values = [
        {
            icon: Award,
            title: t("about.value.excellence.title"),
            description: t("about.value.excellence.desc"),
        },
        {
            icon: Heart,
            title: t("about.value.passion.title"),
            description: t("about.value.passion.desc"),
        },
        {
            icon: Users,
            title: t("about.value.community.title"),
            description: t("about.value.community.desc"),
        },
        {
            icon: Sparkles,
            title: t("about.value.innovation.title"),
            description: t("about.value.innovation.desc"),
        },
    ];

    return (
        <div className="min-h-screen">
            <SEOPlugin pageType="about" />
            <Navigation />
            <Breadcrumbs />

            {/* Hero Section */}
            <section className="pt-24 pb-12 md:pt-32 md:pb-16 px-4 md:px-8">
                <div className="container-custom max-w-7xl mx-auto">
                    <PageHeader
                        title={t("about.hero.title")}
                        subtitle={t("about.hero.subtitle")}
                    />
                </div>
            </section>

            {/* Story Section - Branded Premium Design */}
            <section className="relative overflow-hidden py-24 md:py-32 px-4 md:px-8">
                {/* Background Effects - Matching Homepage Branding */}
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/5" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.08),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.06),transparent_50%)]" />
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />

                <div className="container-custom relative z-10 max-w-5xl mx-auto">
                    <div className="text-center mb-16 animate-fade-in">
                            <div className="inline-flex items-center gap-3 mb-6">
                                <div className="h-px w-12 bg-gradient-to-r from-transparent via-primary/60 to-primary/60"></div>
                                <span className="text-xs md:text-sm font-semibold text-primary tracking-[0.3em] uppercase">
                                    {language === "el" ? "Η Ιστορία μας" : "Our Story"}
                                </span>
                                <div className="h-px w-12 bg-gradient-to-l from-transparent via-primary/60 to-primary/60"></div>
                            </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-junicode bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent mb-8">
                            {t("about.story.title")}
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                        {/* Left Column - Story Text */}
                        <div className="space-y-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                            <div className="relative group">
                                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/40 via-primary/60 to-primary/40 rounded-full transition-all duration-300 group-hover:from-primary/60 group-hover:via-primary/80 group-hover:to-primary/60"></div>
                                <p className="text-lg md:text-xl text-foreground/90 dark:text-foreground/80 leading-relaxed pl-6 transition-colors duration-300 group-hover:text-foreground dark:group-hover:text-foreground/90">
                                    {t("about.story.p1")}
                                </p>
                            </div>
                            <div className="relative group">
                                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-accent/40 via-accent/60 to-accent/40 rounded-full transition-all duration-300 group-hover:from-accent/60 group-hover:via-accent/80 group-hover:to-accent/60"></div>
                                <p className="text-lg md:text-xl text-foreground/90 dark:text-foreground/80 leading-relaxed pl-6 transition-colors duration-300 group-hover:text-foreground dark:group-hover:text-foreground/90">
                                    {t("about.story.p2")}
                                </p>
                            </div>
                        </div>

                        {/* Right Column - Visual Element with Logo */}
                        <div className="relative animate-fade-in group" style={{ animationDelay: '0.2s' }}>
                            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border-2 border-primary/20 dark:border-primary/30 shadow-lg shadow-primary/10 dark:shadow-primary/15 p-8 md:p-12 transition-all duration-500 hover:shadow-xl hover:shadow-primary/20 hover:border-primary/30 dark:hover:border-primary/40">
                                {/* Animated Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl" />
                                
                                {/* Decorative Elements */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-accent/20 to-transparent rounded-tr-full opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                {/* Subtle Shine Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-primary/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none rounded-3xl" />
                                
                                {/* Content */}
                                <div className="relative z-10 text-center">
                                    <div className="inline-flex items-center justify-center w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gradient-to-br from-white dark:from-primary/20 to-primary/10 dark:to-accent/20 mb-6 shadow-lg p-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary/20">
                                        <Image
                                            src="/assets/logo.png"
                                            alt="Alexandra Rizou Logo"
                                            width={120}
                                            height={120}
                                            className="w-full h-full object-contain dark:hidden transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <Image
                                            src="/assets/rizou_logo_white.png"
                                            alt="Alexandra Rizou Logo"
                                            width={120}
                                            height={120}
                                            className="w-full h-full object-contain hidden dark:block transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-bold font-junicode text-foreground mb-4 transition-colors duration-300 group-hover:text-primary dark:group-hover:text-primary/90">
                                        {language === "el" ? "Από το 2015" : "Since 2015"}
                                    </h3>
                                    <p className="text-muted-foreground text-base md:text-lg transition-colors duration-300 group-hover:text-foreground/90 dark:group-hover:text-foreground/80">
                                        {language === "el" 
                                            ? "Δημιουργώντας ομορφιά και αυτοπεποίθηση" 
                                            : "Creating beauty and confidence"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section - Branded Design */}
            <section className="relative overflow-hidden py-20 md:py-28 px-4 md:px-8 bg-gradient-to-br from-primary/8 via-primary/5 to-accent/8">
                {/* Background Effects - Matching Branding */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.1),transparent_70%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.08),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.06),transparent_50%)]" />
                <div className="absolute top-10 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s' }} />
                <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '15s', animationDelay: '3s' }} />
                <div className="container-custom relative z-10 max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-white dark:from-[#1a2e1f] to-primary/8 dark:to-primary/20 backdrop-blur-xl border-2 border-primary/20 dark:border-primary/30 shadow-md shadow-primary/10 dark:shadow-primary/15 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1 hover:scale-[1.02] hover:border-primary/40 dark:hover:border-white/30 p-6 md:p-8 text-center"
                                style={{
                                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                                }}
                            >
                                {/* Elegant Glass Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/20 to-transparent dark:from-primary/15 dark:via-primary/8 dark:to-transparent" />
                                
                                {/* Subtle Shine Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 dark:via-primary/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-800 ease-in-out pointer-events-none" />
                                
                                <div className="relative z-10">
                                    <div className={cn(
                                        "inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br mb-4 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg",
                                        stat.color
                                    )}>
                                        <stat.icon className="h-8 w-8 md:h-10 md:w-10 text-primary dark:text-primary/90 transition-transform duration-300 group-hover:scale-110" />
                                    </div>
                                    <div className="text-3xl md:text-4xl lg:text-5xl font-bold font-junicode text-foreground mb-2 group-hover:text-primary dark:group-hover:text-primary/90 transition-all duration-300 group-hover:scale-105">
                                        {stat.number}
                                    </div>
                                    <p className="text-sm md:text-base text-muted-foreground dark:text-foreground/70 font-medium transition-colors duration-300 group-hover:text-foreground/90 dark:group-hover:text-foreground/80">
                                        {stat.label}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section - Branded Premium Design */}
            <section className="relative overflow-hidden py-24 md:py-32 px-4 md:px-8">
                {/* Background Effects - Matching Homepage Branding */}
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/5" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.08),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.06),transparent_50%)]" />
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
                
                <div className="container-custom relative z-10 max-w-7xl mx-auto">
                    <div className="text-center mb-16 animate-fade-in">
                        <div className="inline-flex items-center gap-3 mb-6">
                            <div className="h-px w-12 bg-gradient-to-r from-transparent via-primary/60 to-primary/60"></div>
                            <span className="text-xs md:text-sm font-semibold text-primary tracking-[0.3em] uppercase">
                                {language === "el" ? "Οι Αξίες μας" : "Our Values"}
                            </span>
                            <div className="h-px w-12 bg-gradient-to-l from-transparent via-primary/60 to-primary/60"></div>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-junicode bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent mb-4">
                            {t("about.values.title")}
                        </h2>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            {t("about.values.subtitle")}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {values.map((value, index) => {
                            const colorVariants = [
                                { primary: 'from-white dark:from-[#1a2e1f]', accent: 'to-primary/8 dark:to-primary/20', border: 'border-primary/20 dark:border-primary/30', glow: 'shadow-primary/15 dark:shadow-primary/25', iconBg: 'from-primary/15 to-primary/8' },
                                { primary: 'from-white dark:from-[#1d3221]', accent: 'to-accent/8 dark:to-primary/18', border: 'border-accent/20 dark:border-primary/28', glow: 'shadow-accent/15 dark:shadow-primary/22', iconBg: 'from-accent/15 to-accent/8' },
                                { primary: 'from-white dark:from-[#1b2f20]', accent: 'to-primary/10 dark:to-primary/22', border: 'border-primary/25 dark:border-primary/32', glow: 'shadow-primary/20 dark:shadow-primary/28', iconBg: 'from-primary/18 to-primary/10' },
                                { primary: 'from-white dark:from-[#1c3021]', accent: 'to-accent/10 dark:to-accent/20', border: 'border-accent/25 dark:border-accent/32', glow: 'shadow-accent/20 dark:shadow-accent/28', iconBg: 'from-accent/18 to-accent/10' },
                            ];
                            const colors = colorVariants[index % colorVariants.length];

                            return (
                                <div
                                    key={index}
                                    className="group relative rounded-3xl overflow-hidden bg-gradient-to-br backdrop-blur-xl border-2 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] hover:border-primary/40 dark:hover:border-white/30"
                                    style={{
                                        background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.accent})`,
                                        borderColor: colors.border,
                                        boxShadow: `0 8px 30px ${colors.glow}`,
                                        animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                                    }}
                                >
                                    {/* Elegant Glass Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/20 to-transparent dark:from-primary/15 dark:via-primary/8 dark:to-transparent" />
                                    
                                    {/* Subtle Shine Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 dark:via-primary/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-800 ease-in-out pointer-events-none" />
                                    
                                    {/* Content */}
                                    <div className="relative z-10 p-6 md:p-8 text-center h-full flex flex-col">
                                        <div className="mb-6 flex justify-center">
                                            <div className={cn(
                                                "h-20 w-20 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                                                colors.iconBg
                                            )}>
                                                <value.icon className="h-10 w-10 text-primary dark:text-primary/90" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-bold font-junicode text-foreground mb-4 group-hover:text-primary dark:group-hover:text-primary/90 transition-colors">
                                            {value.title}
                                        </h3>
                                        <p className="text-sm md:text-base text-muted-foreground dark:text-foreground/70 leading-relaxed flex-grow group-hover:text-foreground/90 dark:group-hover:text-foreground/80 transition-colors">
                                            {value.description}
                                        </p>
                                    </div>

                                    {/* Subtle Corner Accents */}
                                    <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-primary/8 to-transparent rounded-br-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-accent/8 to-transparent rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    
                                    {/* Animated Border Glow */}
                                    <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Team Section - Branded Premium Design */}
            <section className="relative overflow-hidden py-24 md:py-32 px-4 md:px-8 bg-gradient-to-br from-muted/30 via-muted/20 to-background">
                {/* Background Effects - Matching Branding */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.05),transparent_70%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.08),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.06),transparent_50%)]" />
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
                <div className="container-custom relative z-10 max-w-7xl mx-auto">
                    <div className="text-center mb-16 animate-fade-in">
                        <div className="inline-flex items-center gap-3 mb-6">
                            <div className="h-px w-12 bg-gradient-to-r from-transparent via-primary/60 to-primary/60"></div>
                            <span className="text-xs md:text-sm font-semibold text-primary tracking-[0.3em] uppercase">
                                {language === "el" ? "Η Ομάδα μας" : "Our Team"}
                            </span>
                            <div className="h-px w-12 bg-gradient-to-l from-transparent via-primary/60 to-primary/60"></div>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-junicode bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent mb-4">
                            {t("about.team.title")}
                        </h2>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            {t("about.team.subtitle")}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {team.map((member, index) => {
                            const colorVariants = [
                                { primary: 'from-white dark:from-[#1a2e1f]', accent: 'to-primary/8 dark:to-primary/20', border: 'border-primary/20 dark:border-primary/30', glow: 'shadow-primary/15' },
                                { primary: 'from-white dark:from-[#1d3221]', accent: 'to-accent/8 dark:to-primary/18', border: 'border-accent/20 dark:border-primary/28', glow: 'shadow-accent/15' },
                                { primary: 'from-white dark:from-[#1b2f20]', accent: 'to-primary/10 dark:to-primary/22', border: 'border-primary/25 dark:border-primary/32', glow: 'shadow-primary/20' },
                                { primary: 'from-white dark:from-[#1c3021]', accent: 'to-accent/10 dark:to-accent/20', border: 'border-accent/25 dark:border-accent/32', glow: 'shadow-accent/20' },
                            ];
                            const colors = colorVariants[index % colorVariants.length];

                            return (
                                <div
                                    key={index}
                                    className="group relative rounded-3xl overflow-hidden bg-gradient-to-br backdrop-blur-xl border-2 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] hover:border-primary/40 dark:hover:border-white/30"
                                    style={{
                                        background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.accent})`,
                                        borderColor: colors.border,
                                        boxShadow: `0 8px 30px ${colors.glow}`,
                                        animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                                    }}
                                >
                                    {/* Elegant Glass Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/20 to-transparent dark:from-primary/15 dark:via-primary/8 dark:to-transparent" />
                                    
                                    {/* Subtle Shine Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 dark:via-primary/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
                                    
                                    {/* Content */}
                                    <div className="relative z-10 p-6 md:p-8 text-center">
                                        <div className="mb-6 mx-auto w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-primary/20 via-primary/15 to-accent/20 flex items-center justify-center overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out rounded-full"></div>
                                            <Sparkles className="h-16 w-16 md:h-20 md:w-20 text-primary/60 dark:text-primary/80 group-hover:text-primary dark:group-hover:text-primary transition-all duration-300 group-hover:scale-110 relative z-10" />
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-bold font-junicode text-foreground mb-2 group-hover:text-primary dark:group-hover:text-primary/90 transition-all duration-300 group-hover:scale-105">
                                            {member.name}
                                        </h3>
                                        <p className="text-primary dark:text-primary/90 text-sm md:text-base font-semibold mb-4 transition-colors duration-300 group-hover:text-primary dark:group-hover:text-primary/80">
                                            {member.role}
                                        </p>
                                        <p className="text-sm md:text-base text-muted-foreground dark:text-foreground/70 leading-relaxed group-hover:text-foreground/90 dark:group-hover:text-foreground/80 transition-colors duration-300">
                                            {member.description}
                                        </p>
                                    </div>

                                    {/* Subtle Corner Accents */}
                                    <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-primary/8 to-transparent rounded-br-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-accent/8 to-transparent rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    
                                    {/* Animated Border Glow */}
                                    <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section - Branded Design */}
            <section className="relative overflow-hidden py-24 md:py-32 px-4 md:px-8">
                {/* Background Effects - Matching Homepage Branding */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.1),transparent_70%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.08),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.06),transparent_50%)]" />
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />

                <div className="container-custom relative z-10 max-w-4xl mx-auto text-center animate-fade-in">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-8 shadow-lg transition-all duration-300 hover:scale-110 hover:rotate-6 hover:shadow-xl">
                        <Sparkles className="h-10 w-10 text-primary transition-transform duration-300 hover:scale-110" />
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-junicode bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent mb-6">
                        {language === "el" 
                            ? "Έτοιμοι να ξεκινήσουμε το ταξίδι σας στην ομορφιά;" 
                            : "Ready to start your beauty journey?"}
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                        {language === "el"
                            ? "Επικοινωνήστε μαζί μας σήμερα και ανακαλύψτε πώς μπορούμε να σας βοηθήσουμε να φαίνεστε και να νιώθετε στο καλύτερό σας."
                            : "Contact us today and discover how we can help you look and feel your best."}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href={getLocalizedPath("/contact", language as 'el' | 'en')}>
                            <Button className="btn-primary h-14 px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                {language === "el" ? "Επικοινωνήστε μαζί μας" : "Contact Us"}
                            </Button>
                        </Link>
                        <Link href={getLocalizedPath("/services", language as 'el' | 'en')}>
                            <Button variant="outline" className="h-14 px-8 text-base font-semibold border-2 hover:bg-primary/10 dark:hover:bg-primary/20 transition-all duration-300 hover:scale-105 hover:border-primary/40 dark:hover:border-primary/50">
                                {language === "el" ? "Δείτε τις Υπηρεσίες μας" : "View Our Services"}
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

