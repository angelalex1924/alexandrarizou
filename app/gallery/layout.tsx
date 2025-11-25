import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Γκαλερί",
  description: "Δείτε τις δημιουργίες μας στο κομμωτήριο Alexandra Rizou Χαλάνδρι. Γυναικείο κούρεμα, balayage, highlights, χρωματισμός μαλλιών, manicure, pedicure. Ανδρέα Παπανδρέου 52, Χαλάνδρι.",
  keywords: [
    "γκαλερί κομμωτηρίου Χαλάνδρι",
    "κομμωτήριο Χαλάνδρι",
    "γυναικείο κούρεμα Χαλάνδρι",
    "balayage Χαλάνδρι",
    "highlights Χαλάνδρι",
    "χρωματισμός μαλλιών Χαλάνδρι"
  ],
  openGraph: {
    title: "Γκαλερί Κομμωτηρίου Χαλάνδρι | Alexandra Rizou",
    description: "Δείτε τις δημιουργίες μας στο κομμωτήριο Alexandra Rizou Χαλάνδρι.",
    url: "https://alexandrarizoucoiffure.gr/galeri",
    type: "website",
  },
  alternates: {
    canonical: "https://alexandrarizoucoiffure.gr/galeri",
    languages: {
      "el": "https://alexandrarizoucoiffure.gr/galeri",
      "en": "https://alexandrarizoucoiffure.gr/en/gallery",
    },
  },
}

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

