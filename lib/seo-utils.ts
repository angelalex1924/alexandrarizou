import { generateUltraKeywords, generateHighPriorityKeywords } from './keyword-generator';

export interface SEOData {
    title: string;
    description: string;
    keywords: string;
    image: string;
    url: string;
    type: 'website' | 'article';
    canonical?: string;
    robots?: string;
}

/**
 * Generates SEO metadata for location-based landing pages
 * Optimized for Alexandra Rizou Coiffure
 */
export function generateLocationSEO(
    locationName: string,
    locationAccusative: string,
    slug: string,
    baseUrl: string
): SEOData {
    const brand = "Alexandra Rizou Coiffure";
    const brandFull = "Alexandra Rizou Hair Beauty & Health Services";

    // SEO Optimized Title
    // e.g., Κομμωτήριο Αγία Παρασκευή | Alexandra Rizou Coiffure Χαλάνδρι
    const title = `Κομμωτήριο ${locationName} | ${brand} Χαλάνδρι`;

    // SEO Optimized Description
    const description = `Ψάχνετε κορυφαίο κομμωτήριο ${locationAccusative}; Η Alexandra Rizou Coiffure στο Χαλάνδρι προσφέρει εξειδικευμένες υπηρεσίες κουρέματος, Balayage, Highlights και περιποίησης νυχιών. Μόλις λίγα λεπτά από ${locationAccusative}.`;

    const keywords = generateUltraKeywords(locationName);
    const url = `${baseUrl}/kommotirio/${slug}`;

    return {
        title,
        description,
        keywords,
        image: `${baseUrl}/assets/logo.png`,
        url,
        type: 'website',
        canonical: url,
        robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    };
}
