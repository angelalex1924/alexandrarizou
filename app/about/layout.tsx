import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Σχετικά",
  description: "Γνωρίστε το κομμωτήριο Alexandra Rizou στο Χαλάνδρι. Εξειδικευμένες υπηρεσίες γυναικείου κουρέματος, balayage, highlights, χρωματισμού μαλλιών. Ανδρέα Παπανδρέου 52, Χαλάνδρι.",
  keywords: [
    "σχετικά κομμωτηρίου Χαλάνδρι",
    "Alexandra Rizou Χαλάνδρι",
    "κομμωτήριο Χαλάνδρι",
    "γυναικείο κούρεμα Χαλάνδρι"
  ],
  openGraph: {
    title: "Σχετικά | Alexandra Rizou",
    description: "Γνωρίστε το κομμωτήριο Alexandra Rizou στο Χαλάνδρι.",
    url: "https://alexandrarizoucoiffure.gr/sxetika",
    type: "website",
  },
  alternates: {
    canonical: "https://alexandrarizoucoiffure.gr/sxetika",
    languages: {
      "el": "https://alexandrarizoucoiffure.gr/sxetika",
      "en": "https://alexandrarizoucoiffure.gr/en/about",
    },
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

