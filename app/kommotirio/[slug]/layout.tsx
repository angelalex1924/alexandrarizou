import { Metadata } from 'next';
import { generateLocationSEO } from '@/lib/seo-utils';

const locations: Record<string, { name: string, nameAccusative: string }> = {
    'agia-paraskevi': { name: 'Αγία Παρασκευή', nameAccusative: 'την Αγία Παρασκευή' },
    'vrilissia': { name: 'Βριλήσσια', nameAccusative: 'τα Βριλήσσια' },
    'marousi': { name: 'Μαρούσι', nameAccusative: 'το Μαρούσι' },
    'cholargos': { name: 'Χολαργός', nameAccusative: 'τον Χολαργό' },
    'psychiko': { name: 'Ψυχικό', nameAccusative: 'το Ψυχικό' },
    'gerakas': { name: 'Γέρακας', nameAccusative: 'τον Γέρακα' },
    'melissia': { name: 'Μελίσσια', nameAccusative: 'τα Μελίσσια' },
    'pefki': { name: 'Πεύκη', nameAccusative: 'την Πεύκη' },
    'nea-filadelfeia': { name: 'Νέα Φιλαδέλφεια', nameAccusative: 'τη Νέα Φιλαδέλφεια' },
    'filothei': { name: 'Φιλοθέη', nameAccusative: 'τη Φιλοθέη' },
    'chalandri': { name: 'Χαλάνδρι', nameAccusative: 'το Χαλάνδρι' }
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const location = locations[slug] || { name: 'Χαλάνδρι', nameAccusative: 'το Χαλάνδρι' };
    const baseUrl = 'https://alexandrarizoucoiffure.gr';

    const seoData = generateLocationSEO(location.name, location.nameAccusative, slug, baseUrl);

    return {
        title: seoData.title,
        description: seoData.description,
        keywords: seoData.keywords,
        alternates: {
            canonical: seoData.canonical,
        },
        openGraph: {
            title: seoData.title,
            description: seoData.description,
            url: seoData.url,
            siteName: 'Alexandra Rizou Coiffure',
            locale: 'el_GR',
            type: 'website',
            images: [
                {
                    url: `${baseUrl}/assets/logo.png`,
                    width: 1200,
                    height: 630,
                    alt: `Alexandra Rizou Coiffure | ${location.name} & Χαλάνδρι`,
                }
            ]
        }
    };
}

export default function LocationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
