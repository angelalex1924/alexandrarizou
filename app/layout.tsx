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
    keywords: [
        "γυναικείο κούρεμα Χαλάνδρι",
        "κομμωτήριο Χαλάνδρι",
        "γυναικείο κομμωτήριο Χαλάνδρι",
        "κούρεμα Χαλάνδρι",
        "Alexandra Rizou Χαλάνδρι",
        "balayage Χαλάνδρι",
        "highlights Χαλάνδρι",
        "χρωματισμός μαλλιών Χαλάνδρι",
        "θεραπεία μαλλιών Χαλάνδρι",
        "γυναικείο κούρεμα",
        "κομμωτήριο γυναικείος Χαλάνδρι",
        "women's haircut Chalandri",
        "hair salon Chalandri",
        "women's hair salon Chalandri",
        "κομμωτήριο Βόρεια Προάστια",
        "γυναικείο κούρεμα Αθήνα",
        "κομμωτήριο Μαρούσι",
        "κομμωτήριο Κηφισιά",
        "manicure Χαλάνδρι",
        "pedicure Χαλάνδρι",
        "waxing Χαλάνδρι"
    ],
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
            <head>
                {/* Hidden SEO Meta Tags */}
                <meta name="application-name" content="Alexandra Rizou Hair-Beauty & Health Services" />
                <meta name="apple-mobile-web-app-title" content="Alexandra Rizou" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="format-detection" content="telephone=yes" />
                <meta name="geo.region" content="GR-ATT" />
                <meta name="geo.placename" content="Χαλάνδρι" />
                <meta name="geo.position" content="38.0193;23.7944" />
                <meta name="ICBM" content="38.0193, 23.7944" />
                <meta name="DC.title" content="Alexandra Rizou Hair-Beauty & Health Services" />
                <meta name="DC.creator" content="Alexandra Rizou" />
                <meta name="DC.subject" content="Γυναικείο Κούρεμα Χαλάνδρι, Κομμωτήριο Χαλάνδρι, Balayage Χαλάνδρι, Highlights Χαλάνδρι" />
                <meta name="DC.description" content="Κορυφαίο γυναικείο κομμωτήριο στο Χαλάνδρι. Εξειδικευμένο γυναικείο κούρεμα, balayage, highlights, χρωματισμός μαλλιών, θεραπείες, manicure, pedicure." />
                <meta name="DC.publisher" content="Alexandra Rizou Hair-Beauty & Health Services" />
                <meta name="DC.contributor" content="Alexandra Rizou" />
                <meta name="DC.type" content="Service" />
                <meta name="DC.format" content="text/html" />
                <meta name="DC.identifier" content="https://alexandrarizoucoiffure.gr" />
                <meta name="DC.language" content="el, en" />
                <meta name="DC.coverage" content="Χαλάνδρι, Αθήνα, Βόρεια Προάστια" />
                <meta name="DC.rights" content="© 2025 Alexandra Rizou Hair-Beauty & Health Services" />
                <meta name="revisit-after" content="7 days" />
                <meta name="distribution" content="global" />
                <meta name="rating" content="general" />
                <meta name="target" content="all" />
                <meta name="audience" content="all" />
                <meta name="coverage" content="worldwide" />
                <meta name="topic" content="Beauty Salon, Hair Salon, Women's Haircut, Chalandri" />
                <meta name="summary" content="Κορυφαίο γυναικείο κομμωτήριο στο Χαλάνδρι με εξειδικευμένες υπηρεσίες γυναικείου κουρέματος, balayage, highlights, χρωματισμού μαλλιών." />
                <meta name="classification" content="Beauty, Hair Salon, Health Services" />
                <meta name="category" content="Beauty Salon" />
                <meta name="subject" content="Γυναικείο Κούρεμα, Κομμωτήριο, Χαλάνδρι, Balayage, Highlights" />
                <meta name="abstract" content="Alexandra Rizou Hair-Beauty & Health Services - Κορυφαίο γυναικείο κομμωτήριο στο Χαλάνδρι" />
                <meta name="designer" content="Alexandra Rizou" />
                <meta name="reply-to" content="ar.hairbeauty.healthservices@gmail.com" />
                <meta name="owner" content="Alexandra Rizou Hair-Beauty & Health Services" />
                <meta name="url" content="https://alexandrarizoucoiffure.gr" />
                <meta name="identifier-URL" content="https://alexandrarizoucoiffure.gr" />
                <meta name="directory" content="submission" />
                <meta name="pagename" content="Alexandra Rizou Hair-Beauty & Health Services" />
                <meta name="category" content="Beauty Salon" />
                <meta name="coverage" content="Worldwide" />
                <meta name="distribution" content="Global" />
                <meta name="rating" content="General" />
                <meta name="HandheldFriendly" content="True" />
                <meta name="MobileOptimized" content="320" />
                <meta name="apple-touch-fullscreen" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                
                {/* Additional SEO Meta Tags */}
                <meta name="language" content="Greek, English" />
                <meta name="content-language" content="el, en" />
                <meta name="audience" content="all" />
                <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
                <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
                <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
                <meta name="slurp" content="index, follow" />
                <meta name="duckduckbot" content="index, follow" />
                <meta name="baiduspider" content="index, follow" />
                <meta name="yandex" content="index, follow" />
                
                {/* Business Information */}
                <meta name="business.contact_data.street_address" content="Ανδρέα Παπανδρέου 52" />
                <meta name="business.contact_data.locality" content="Χαλάνδρι" />
                <meta name="business.contact_data.region" content="Αττική" />
                <meta name="business.contact_data.postal_code" content="152 32" />
                <meta name="business.contact_data.country_name" content="Ελλάδα" />
                <meta name="business.contact_data.phone_number" content="+30 210 6818 011" />
                <meta name="business.contact_data.email" content="ar.hairbeauty.healthservices@gmail.com" />
                
                {/* Service Information */}
                <meta name="service.name" content="Γυναικείο Κούρεμα, Balayage, Highlights, Χρωματισμός Μαλλιών" />
                <meta name="service.type" content="Hair Salon, Beauty Salon, Health Services" />
                <meta name="service.area" content="Χαλάνδρι, Αθήνα, Βόρεια Προάστια" />
                
                {/* Additional Location Tags */}
                <meta name="locality" content="Χαλάνδρι" />
                <meta name="region" content="Αττική" />
                <meta name="postal-code" content="152 32" />
                <meta name="country-name" content="Ελλάδα" />
                <meta name="latitude" content="38.0193" />
                <meta name="longitude" content="23.7944" />
                
                {/* Social Media & Business */}
                <meta name="contact" content="ar.hairbeauty.healthservices@gmail.com" />
                <meta name="copyright" content="© 2025 Alexandra Rizou Hair-Beauty & Health Services" />
                <meta name="author" content="Alexandra Rizou" />
                <meta name="publisher" content="Alexandra Rizou Hair-Beauty & Health Services" />
                <meta name="generator" content="Next.js" />
                
                {/* Additional SEO Enhancements */}
                <meta name="referrer" content="no-referrer-when-downgrade" />
                <meta name="format-detection" content="telephone=yes, address=yes, email=yes" />
                <meta name="theme-color" content="#6B9A7A" />
                <meta name="msapplication-TileColor" content="#6B9A7A" />
                <meta name="msapplication-config" content="/browserconfig.xml" />
                
                {/* Rich Snippets Support */}
                <meta name="rating" content="5" />
                <meta name="rating:value" content="5" />
                <meta name="rating:scale" content="5" />
                <meta name="review:rating" content="5" />
                <meta name="review:count" content="200" />
                
                {/* Local Business Schema Support */}
                <meta name="place:location:latitude" content="38.0193" />
                <meta name="place:location:longitude" content="23.7944" />
                <meta name="place:location:altitude" content="0" />
                
                {/* Additional Keywords Meta (for older browsers) */}
                <meta name="keywords" content="γυναικείο κούρεμα Χαλάνδρι, κομμωτήριο Χαλάνδρι, balayage Χαλάνδρι, highlights Χαλάνδρι, χρωματισμός μαλλιών Χαλάνδρι, θεραπεία μαλλιών Χαλάνδρι, manicure Χαλάνδρι, pedicure Χαλάνδρι, waxing Χαλάνδρι, Alexandra Rizou Χαλάνδρι, women's haircut Chalandri, hair salon Chalandri, balayage Chalandri, highlights Chalandri, hair color Chalandri, hair treatment Chalandri" />
                
                {/* Structured Data for SEO - HairSalon */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(alexandraRizouStructuredData),
                    }}
                />
                {/* Structured Data for SEO - Organization */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(alexandraRizouOrganizationData),
                    }}
                />
                {/* Structured Data for SEO - FAQ */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(alexandraRizouFAQStructuredData),
                    }}
                />
                {/* Structured Data for SEO - Breadcrumb */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(breadcrumbStructuredData),
                    }}
                />
            </head>
            <body className={`${inter.variable} ${playfair.variable} antialiased`}>
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
                        {children}
                    </TooltipProvider>
                </Providers>
            </body>
        </html>
    );
}

