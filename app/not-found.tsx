"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Scissors } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLocalizedPath } from "@/lib/i18n-routes";

export default function NotFound() {
    const { t, language } = useLanguage();

    useEffect(() => {
        // Hide chatbot, navigation and footer on 404 page
        const style = document.createElement('style');
        style.id = 'hide-404-elements';
        style.textContent = `
            .chatbot-container,
            nav,
            [class*="Navigation"],
            footer,
            [class*="Footer"] {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
            }
        `;
        document.head.appendChild(style);

        return () => {
            // Remove style on unmount
            const styleElement = document.getElementById('hide-404-elements');
            if (styleElement) {
                styleElement.remove();
            }
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            {/* 404 Hero Section */}
            <section className="flex-1 relative overflow-hidden flex items-center justify-center py-20 md:py-32 px-4 md:px-8 min-h-screen">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.1),transparent_70%)]" />
                
                {/* Floating Orbs */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />

                <div className="container-custom relative z-10 max-w-4xl mx-auto text-center">
                    {/* Decorative Elements */}
                    <div className="inline-flex items-center gap-3 mb-8">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/60"></div>
                        <span className="text-xs md:text-sm font-semibold text-primary uppercase tracking-[0.3em]">
                            Error 404
                        </span>
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/60"></div>
                    </div>

                    {/* Main 404 Title with Junicode Font */}
                    <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-bold mb-6 font-junicode text-primary/20 dark:text-primary/10 animate-fade-in">
                        404
                    </h1>

                    {/* Subtitle */}
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        {t("404.title") || "Η Σελίδα Δεν Βρέθηκε"}
                    </h2>

                    {/* Description */}
                    <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        {t("404.description") || "Λυπάμαι, αλλά η σελίδα που αναζητάτε δεν υπάρχει ή έχει μετακινηθεί. Επιστρέψτε στην αρχική σελίδα για να συνεχίσετε."}
                    </p>

                    {/* Decorative Icon */}
                    <div className="flex justify-center mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
                            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-primary/30">
                                <Scissors className="h-12 w-12 text-primary" />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        <Link href="/">
                            <Button className="btn-primary group">
                                <Home className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                                {t("404.homeButton") || "Επιστροφή στην Αρχική"}
                            </Button>
                        </Link>
                        <Button 
                            variant="outline" 
                            onClick={() => window.history.back()}
                            className="group"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            {t("404.backButton") || "Πίσω"}
                        </Button>
                    </div>

                    {/* Quick Links */}
                    <div className="mt-16 pt-8 border-t border-border/50 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                        <p className="text-sm text-muted-foreground mb-4">
                            {t("404.quickLinks") || "Γρήγοροι Σύνδεσμοι:"}
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href={getLocalizedPath("/services", language as 'el' | 'en')} className="text-primary hover:text-accent transition-colors text-sm font-medium">
                                {t("nav.services") || "Υπηρεσίες"}
                            </Link>
                            <span className="text-muted-foreground">•</span>
                            <Link href={getLocalizedPath("/gallery", language as 'el' | 'en')} className="text-primary hover:text-accent transition-colors text-sm font-medium">
                                {t("nav.gallery") || "Γκαλερί"}
                            </Link>
                            <span className="text-muted-foreground">•</span>
                            <Link href={getLocalizedPath("/about", language as 'el' | 'en')} className="text-primary hover:text-accent transition-colors text-sm font-medium">
                                {t("nav.about") || "Σχετικά"}
                            </Link>
                            <span className="text-muted-foreground">•</span>
                            <Link href={getLocalizedPath("/contact", language as 'el' | 'en')} className="text-primary hover:text-accent transition-colors text-sm font-medium">
                                {t("nav.contact") || "Επικοινωνία"}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
