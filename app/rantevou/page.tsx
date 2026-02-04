"use client";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import SEOPlugin from "@/components/SEOPlugin";
import Breadcrumbs from "@/components/Breadcrumbs";
import AppointmentBooking from "@/components/appointment-booking";
import { useLanguage } from "@/contexts/LanguageContext";

export default function RantevouPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-background">
            <SEOPlugin />
            <Navigation />
            <Breadcrumbs />

            <main>
                {/* Hero / Header Section */}
                <section className="relative pt-20 pb-8 md:pt-24 md:pb-12 px-4 md:px-8">
                    <div className="container-custom max-w-7xl mx-auto">
                        <PageHeader
                            title={t("booking.hero.title")}
                            subtitle={t("booking.hero.subtitle")}
                            icon="/event_8286228.png"
                            compact={true}
                        />
                    </div>
                </section>

                {/* Booking Section */}
                <section className="relative overflow-hidden py-16 md:py-24 px-4 md:px-8">
                    {/* Background layers - matching site aesthetic */}
                    <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/5" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.08),transparent_50%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.06),transparent_50%)]" />

                    <div className="container-custom relative z-10 max-w-7xl mx-auto">
                        <AppointmentBooking />
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
