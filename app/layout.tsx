import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "@/contexts/LanguageContext";
import AIChatbot from "@/components/chatbot";
import Providers from "./providers";

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
    title: "Elegance Hair & Beauty Salon | Premium Hair, Nails & Beauty Services",
    description: "Experience luxury beauty services at Elegance Salon. Expert hair styling, coloring, manicures, pedicures, and waxing. Book your appointment online today.",
    authors: [{ name: "Elegance Hair & Beauty Salon" }],
    openGraph: {
        title: "Elegance Hair & Beauty Salon | Premium Hair, Nails & Beauty Services",
        description: "Experience luxury beauty services at Elegance Salon. Expert hair styling, coloring, manicures, pedicures, and waxing.",
        type: "website",
        images: ["https://lovable.dev/opengraph-image-p98pqg.png"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Elegance Hair & Beauty Salon",
        description: "Premium hair, nails, and beauty services. Book your appointment today.",
        images: ["https://lovable.dev/opengraph-image-p98pqg.png"],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} ${playfair.variable} antialiased`}>
                <Providers>
                    <TooltipProvider>
                        <Toaster />
                        <Sonner />
                        <AIChatbot />
                        {children}
                    </TooltipProvider>
                </Providers>
            </body>
        </html>
    );
}

