import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Επικοινωνία",
  description: "Επικοινωνήστε με το κομμωτήριο Alexandra Rizou στο Χαλάνδρι. Ανδρέα Παπανδρέου 52, Χαλάνδρι 152 32. Τηλέφωνο: +30 210 6818 011. Κλείστε ραντεβού για γυναικείο κούρεμα, balayage, highlights.",
  keywords: [
    "επικοινωνία κομμωτηρίου Χαλάνδρι",
    "κομμωτήριο Χαλάνδρι τηλέφωνο",
    "ραντεβού κομμωτηρίου Χαλάνδρι",
    "γυναικείο κούρεμα Χαλάνδρι",
    "Alexandra Rizou Χαλάνδρι"
  ],
  openGraph: {
    title: "Επικοινωνία Κομμωτηρίου Χαλάνδρι | Alexandra Rizou",
    description: "Επικοινωνήστε με το κομμωτήριο Alexandra Rizou στο Χαλάνδρι. Κλείστε ραντεβού: +30 210 6818 011",
    url: "https://alexandrarizoucoiffure.gr/epikoinonia",
    type: "website",
  },
  alternates: {
    canonical: "https://alexandrarizoucoiffure.gr/epikoinonia",
    languages: {
      "el": "https://alexandrarizoucoiffure.gr/epikoinonia",
      "en": "https://alexandrarizoucoiffure.gr/en/contact",
    },
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

