/**
 * Keyword database for Alexandra Rizou Coiffure
 * Focused on hair salon and nail services in Chalandri and North Suburbs
 */

export const ULTRA_KEYWORD_DATABASE = {
    brand: "Alexandra Rizou Hair Beauty & Health Services",
    brandShort: "Alexandra Rizou Coiffure",
    brandGreek: "Alexandra Rizou Κομμωτήριο Χαλάνδρι",
    primaryLocation: "Χαλάνδρι",
    primaryServices: [
        "Κομμωτήριο",
        "Κούρεμα",
        "Βαφή Μαλλιών",
        "Balayage",
        "Highlights",
        "Manicure",
        "Pedicure",
        "Nails",
        "Waxing",
        "Θεραπείες Μαλλιών"
    ],
    targetAreas: [
        "Αγία Παρασκευή",
        "Βριλήσσια",
        "Μαρούσι",
        "Χολαργός",
        "Ψυχικό",
        "Γέρακας",
        "Μελίσσια",
        "Πεύκη",
        "Νέα Φιλαδέλφεια",
        "Φιλοθέη"
    ]
};

export function generateUltraKeywords(location: string = ""): string {
    const base = [
        ULTRA_KEYWORD_DATABASE.brandGreek,
        "Κομμωτήριο Χαλάνδρι",
        "Γυναικείο Κούρεμα",
        "Balayage Χαλάνδρι",
        "Νύχια Χαλάνδρι",
        "Manicure Pedicure Χαλάνδρι"
    ];

    if (location && location !== ULTRA_KEYWORD_DATABASE.primaryLocation) {
        base.push(`Κομμωτήριο ${location}`);
        base.push(`Κούρεμα ${location}`);
        base.push(`Nails ${location}`);
        base.push(`Manicure ${location}`);
    }

    return base.join(", ");
}

export function generateHighPriorityKeywords(location: string): string[] {
    const keywords = [
        `Κομμωτήριο ${location}`,
        `Κούρεμα ${location}`,
        `Βαφή μαλλιών ${location}`,
        `Balayage ${location}`,
        `Highlights ${location}`,
        `Manicure ${location}`,
        `Pedicure ${location}`,
        `Nails ${location}`,
        `Beauty Salon ${location}`,
        `Alexandra Rizou ${location}`
    ];

    return keywords;
}
