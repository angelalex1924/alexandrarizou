import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "@/contexts/LanguageContext";
import AIChatbot from "@/components/chatbot";
import Providers from "./providers";
import { CookieConsent } from "@/components/cookie-consent";
import ServiceWorkerRegistration from "./sw-register";
import {
    alexandraRizouStructuredData,
    alexandraRizouFAQStructuredData,
    alexandraRizouOrganizationData,
    breadcrumbStructuredData
} from "@/lib/alexandra-rizou-structured-data";
import SEOPlugin from "@/components/SEOPlugin";
import { HolidayAnnouncement } from "@/components/HolidayAnnouncement";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import AcronMetricsTracker from "@/components/AcronMetricsTracker";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    weight: ["300", "400", "500", "600", "700"]
});

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
    weight: ["400", "600", "700"]
});

export const metadata: Metadata = {
    metadataBase: new URL('https://alexandrarizoucoiffure.gr'),
    title: {
        default: "Alexandra Rizou Hair-Beauty & Health Services",
        template: "%s | Alexandra Rizou Hair-Beauty & Health Services"
    },
    description: "Κορυφαίο γυναικείο κομμωτήριο στο Χαλάνδρι. Εξειδικευμένο γυναικείο κούρεμα, balayage, highlights, χρωματισμός μαλλιών, θεραπείες, manicure, pedicure. Ανδρέα Παπανδρέου 52, Χαλάνδρι. Κλείστε ραντεβού: +30 210 6818 011",
    authors: [{ name: "Alexandra Rizou hair-beauty & health services" }],
    manifest: "/manifest.json",
    themeColor: "#6B9A7A",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Alexandra Rizou",
    },
    icons: {
        icon: [
            { url: "/assets/logo.png", sizes: "192x192", type: "image/png" },
            { url: "/assets/logo.png", sizes: "512x512", type: "image/png" },
        ],
        apple: [
            { url: "/assets/logo.png", sizes: "180x180", type: "image/png" },
        ],
    },
    openGraph: {
        type: "website",
        locale: "el_GR",
        alternateLocale: ["en_US"],
        url: "https://alexandrarizoucoiffure.gr",
        siteName: "Alexandra Rizou Hair Beauty & Health Services",
        title: "Γυναικείο Κούρεμα Χαλάνδρι | Alexandra Rizou Κομμωτήριο",
        description: "Κορυφαίο γυναικείο κομμωτήριο στο Χαλάνδρι. Εξειδικευμένο γυναικείο κούρεμα, balayage, highlights, χρωματισμός μαλλιών. Ανδρέα Παπανδρέου 52, Χαλάνδρι.",
        images: [
            {
                url: "/assets/hero-salon.jpg",
                width: 1200,
                height: 630,
                alt: "Alexandra Rizou Κομμωτήριο Χαλάνδρι - Γυναικείο Κούρεμα",
            },
            {
                url: "/assets/logo.png",
                width: 512,
                height: 512,
                alt: "Alexandra Rizou Logo",
            }
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Γυναικείο Κούρεμα Χαλάνδρι | Alexandra Rizou",
        description: "Κορυφαίο γυναικείο κομμωτήριο στο Χαλάνδρι. Εξειδικευμένο γυναικείο κούρεμα, balayage, highlights.",
        images: [
            {
                url: "/assets/hero-salon.jpg",
                alt: "Alexandra Rizou Κομμωτήριο Χαλάνδρι",
            }
        ],
        creator: "@alexandrarizou",
    },
    alternates: {
        canonical: "https://alexandrarizoucoiffure.gr",
        languages: {
            "el": "https://alexandrarizoucoiffure.gr",
            "en": "https://alexandrarizoucoiffure.gr/en",
        },
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    category: "Beauty Salon",
    classification: "Hair Salon",
    other: {
        "geo.region": "GR-ATT",
        "geo.placename": "Χαλάνδρι",
        "geo.position": "38.0193;23.7944",
        "ICBM": "38.0193, 23.7944",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="el" suppressHydrationWarning>
            <body className={`${inter.variable} ${playfair.variable} antialiased`}>
                {/* Structured Data for SEO - HairSalon */}
                <Script
                    id="structured-data-hairsalon"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(alexandraRizouStructuredData),
                    }}
                />
                {/* Structured Data for SEO - Organization */}
                <Script
                    id="structured-data-organization"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(alexandraRizouOrganizationData),
                    }}
                />
                {/* Structured Data for SEO - FAQ */}
                <Script
                    id="structured-data-faq"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(alexandraRizouFAQStructuredData),
                    }}
                />
                {/* Structured Data for SEO - Breadcrumb */}
                <Script
                    id="structured-data-breadcrumb"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(breadcrumbStructuredData),
                    }}
                />
                {/* WebSite Schema for Sitelinks */}
                <Script
                    id="structured-data-website"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebSite",
                            "name": "Alexandra Rizou",
                            "alternateName": ["Alexandra Rizou hair-beauty & health services", "Αλεξάνδρα Ρίζου"],
                            "url": "https://alexandrarizoucoiffure.gr",
                            "description": "Κορυφαίο γυναικείο κομμωτήριο στο Χαλάνδρι",
                            "inLanguage": ["el", "en"],
                            "potentialAction": {
                                "@type": "SearchAction",
                                "target": {
                                    "@type": "EntryPoint",
                                    "urlTemplate": "https://alexandrarizoucoiffure.gr/?s={search_term_string}"
                                },
                                "query-input": "required name=search_term_string"
                            }
                        })
                    }}
                />
                {/* SiteNavigationElement Schema for Sitelinks */}
                <Script
                    id="structured-data-navigation"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@graph": [
                                {
                                    "@type": "SiteNavigationElement",
                                    "name": "Αρχική",
                                    "url": "https://alexandrarizoucoiffure.gr/"
                                },
                                {
                                    "@type": "SiteNavigationElement",
                                    "name": "Υπηρεσίες",
                                    "url": "https://alexandrarizoucoiffure.gr/services"
                                },
                                {
                                    "@type": "SiteNavigationElement",
                                    "name": "Gallery",
                                    "url": "https://alexandrarizoucoiffure.gr/gallery"
                                },
                                {
                                    "@type": "SiteNavigationElement",
                                    "name": "Σχετικά",
                                    "url": "https://alexandrarizoucoiffure.gr/about"
                                },
                                {
                                    "@type": "SiteNavigationElement",
                                    "name": "Επικοινωνία",
                                    "url": "https://alexandrarizoucoiffure.gr/contact"
                                }
                            ]
                        })
                    }}
                />
                <Providers>
                    <SEOPlugin pageType="home" />
                    <TooltipProvider>
                        <ServiceWorkerRegistration />
                        <Toaster />
                        <Sonner />
                        <AIChatbot />
                        <CookieConsent />
                        <AnnouncementBanner />
                        <HolidayAnnouncement />
                        <AnalyticsTracker />
                        <AcronMetricsTracker siteId="alexandra-rizou" />
                        {children}
                    </TooltipProvider>
                </Providers>
            </body>
        </html>
    );
}

