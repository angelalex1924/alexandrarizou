export const enhancedStructuredData = {
  "@context": "https://schema.org",
  "@type": "HairSalon", // Πιο συγκεκριμένο από LocalBusiness
  "@id": "https://www.monalisabarbershop.gr/#business",
  "name": "Monalisa Barbershop",
  "alternateName": [
    "Monalisa Barber Shop",
    "Monalisa Κουρείο", 
    "Monalisa Μπαρμπέρικο",
    "Monalisa Barber Shop Χαλάνδρι",
    "Monalisa Barbershop Χαλάνδρι",
    "Monalisa κουρείο Χαλάνδρι",
    "Monalisa μπαρμπέρικο Χαλάνδρι"
  ],
  "description": "Κορυφαίο barbershop στο Χαλάνδρι με επαγγελματικές υπηρεσίες αντρικού κουρέματος, περιποίησης μούσι, black mask, καθαρισμού με κερί και θεραπειών λουτήρα. Κολοκοτρώνη 15Α, Χαλάνδρι.",
  "url": "https://www.monalisabarbershop.gr",
  "telephone": "+30 210 6829106",
  "email": "monalisabarbershopch@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Κολοκοτρώνη 15Α",
    "addressLocality": "Χαλάνδρι",
    "addressRegion": "Αττική", 
    "addressCountry": "GR",
    "postalCode": "15231"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "38.0186", // Ενιαίες συντεταγμένες
    "longitude": "23.8158"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Monday",
      "opens": "10:00",
      "closes": "18:00"
    },
    {
      "@type": "OpeningHoursSpecification", 
      "dayOfWeek": "Tuesday",
      "opens": "10:00",
      "closes": "20:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Wednesday", 
      "opens": "10:00",
      "closes": "18:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Thursday",
      "opens": "10:00", 
      "closes": "20:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Friday",
      "opens": "10:00",
      "closes": "20:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday", 
      "opens": "10:00",
      "closes": "19:00"
    }
  ],
  "priceRange": "€€",
  "currenciesAccepted": "EUR",
  "paymentAccepted": ["Cash", "Credit Card", "Debit Card"],
  "image": [
    "https://www.monalisabarbershop.gr/monalisa-main.jpg",
    "https://www.monalisabarbershop.gr/monalisa-inside.png",
    "https://www.monalisabarbershop.gr/monalisabarbershop-footer-dark.png"
  ],
  "logo": "https://www.monalisabarbershop.gr/ebarber_logo_new_2020_12.svg",
  "sameAs": [
    "https://www.google.com/maps/place/MONALISA+BARBERSHOP"
  ],
  "areaServed": [
    {
      "@type": "City",
      "name": "Χαλάνδρι"
    },
    {
      "@type": "City", 
      "name": "Αθήνα"
    },
    {
      "@type": "City",
      "name": "Βόρεια Προάστια"
    }
  ],
  "serviceArea": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": "38.0186",
      "longitude": "23.8158"
    },
    "geoRadius": "10000"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Barbershop Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Αντρικό Κούρεμα",
          "description": "Επαγγελματικό αντρικό κούρεμα με premium styling και λούσιμο",
          "provider": {
            "@type": "HairSalon",
            "name": "Monalisa Barbershop"
          }
        },
        "price": "15-25",
        "priceCurrency": "EUR"
      },
      {
        "@type": "Offer", 
        "itemOffered": {
          "@type": "Service",
          "name": "Παιδικό Κούρεμα",
          "description": "Ειδικευμένο κούρεμα για παιδιά έως 12 ετών με φιλικό περιβάλλον",
          "provider": {
            "@type": "HairSalon",
            "name": "Monalisa Barbershop"
          }
        },
        "price": "10-15",
        "priceCurrency": "EUR"
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service", 
          "name": "Κούρεμα & Μούσι",
          "description": "Ολοκληρωμένη υπηρεσία που συνδυάζει κούρεμα και περιποίηση γενειάδας",
          "provider": {
            "@type": "HairSalon",
            "name": "Monalisa Barbershop"
          }
        },
        "price": "20-30",
        "priceCurrency": "EUR"
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Περιποίηση Μούσι", 
          "description": "Εξειδικευμένη υπηρεσία περιποίησης γενειάδας με ειδικά εργαλεία",
          "provider": {
            "@type": "HairSalon",
            "name": "Monalisa Barbershop"
          }
        },
        "price": "8-12",
        "priceCurrency": "EUR"
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Σχηματισμός Φρυδιών",
          "description": "Εξειδικευμένη υπηρεσία για καθαρισμό και σχηματισμό φρυδιών",
          "provider": {
            "@type": "HairSalon", 
            "name": "Monalisa Barbershop"
          }
        },
        "price": "5-8",
        "priceCurrency": "EUR"
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Black Mask Treatment",
          "description": "Εξειδικευμένη θεραπεία προσώπου με black mask για βαθύ καθαρισμό",
          "provider": {
            "@type": "HairSalon",
            "name": "Monalisa Barbershop"
          }
        },
        "price": "15-20",
        "priceCurrency": "EUR"
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Καθαρισμός με Κερί",
          "description": "Φυσική μέθοδος αφαίρεσης ανεπιθύμητης τριχοφυΐας με premium κερί",
          "provider": {
            "@type": "HairSalon",
            "name": "Monalisa Barbershop"
          }
        },
        "price": "10-15",
        "priceCurrency": "EUR"
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Θεραπεία Λουτήρα",
          "description": "Εξειδικευμένη θεραπεία για προβλήματα δέρματος κεφαλιού",
          "provider": {
            "@type": "HairSalon",
            "name": "Monalisa Barbershop"
          }
        },
        "price": "20-25",
        "priceCurrency": "EUR"
      }
    ]
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "150",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Γιάννης Παπαδόπουλος"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "reviewBody": "Εξαιρετική εξυπηρέτηση και επαγγελματίες κουρείς. Το καλύτερο barbershop στο Χαλάνδρι!",
      "datePublished": "2024-12-15"
    },
    {
      "@type": "Review", 
      "author": {
        "@type": "Person",
        "name": "Μιχάλης Κωνσταντίνου"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "reviewBody": "Πολύ καθαρό περιβάλλον και εξαιρετική ποιότητα υπηρεσιών. Συνιστώ ανεπιφύλακτα!",
      "datePublished": "2024-12-10"
    },
    {
      "@type": "Review",
      "author": {
        "@type": "Person", 
        "name": "Αλέξανδρος Νικολάου"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "reviewBody": "Professional service με attention to detail. Το black mask treatment είναι φανταστικό!",
      "datePublished": "2024-12-05"
    }
  ],
  "award": [
    "Laureate Medal 2025",
    "Bronze Medal 2025"
  ],
  "keywords": [
    "κομμωτήριο Χαλάνδρι",
    "κουρείο Χαλάνδρι", 
    "μπαρμπέρικο Χαλάνδρι",
    "αντρικό κούρεμα Χαλάνδρι",
    "περιποίηση μούσι Χαλάνδρι",
    "barber Χαλάνδρι",
    "barber shop Chalandri",
    "barbershop Athens",
    "men's haircut Athens",
    "beard grooming Athens",
    "barber Chalandri",
    "black mask barber",
    "καθαρισμός με κερί",
    "θεραπεία λουτήρα",
    "ανδρική περιποίηση",
    "grooming Χαλάνδρι"
  ],
  "potentialAction": {
    "@type": "ReserveAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://www.monalisabarbershop.gr/booking",
      "actionPlatform": [
        "https://schema.org/DesktopWebPlatform",
        "https://schema.org/MobileWebPlatform"
      ]
    },
    "result": {
      "@type": "Reservation",
      "name": "Barbershop Appointment"
    }
  },
  "hasMap": "https://www.google.com/maps/place/MONALISA+BARBERSHOP",
  "isAccessibleForFree": false,
  "smokingAllowed": false,
  "publicAccess": true
};

// FAQ Schema για συχνές ερωτήσεις
export const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Ποια είναι τα ωράρια λειτουργίας του Monalisa Barbershop;",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Το Monalisa Barbershop λειτουργεί Δευτέρα-Τετάρτη 10:00-18:00, Τρίτη-Παρασκευή 10:00-20:00 και Σάββατο 10:00-19:00. Κλειστό την Κυριακή."
      }
    },
    {
      "@type": "Question", 
      "name": "Ποια υπηρεσίες προσφέρετε;",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Προσφέρουμε αντρικό κούρεμα, παιδικό κούρεμα, περιποίηση μούσι, σχηματισμό φρυδιών, black mask treatment, καθαρισμό με κερί και θεραπεία λουτήρα."
      }
    },
    {
      "@type": "Question",
      "name": "Αποδέχεστε κρατήσεις;",
      "acceptedAnswer": {
        "@type": "Answer", 
        "text": "Ναι, μπορείτε να κλείσετε ραντεβού μέσω του website μας ή τηλεφωνικά στο +30 210 6829106."
      }
    },
    {
      "@type": "Question",
      "name": "Ποια μέσα πληρωμής αποδέχεστε;",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Αποδέχεστε μετρητά, πιστωτική και χρεωστική κάρτα."
      }
    }
  ]
};

// Event Schema για ειδικές προσφορές
export const eventStructuredData = {
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Ειδική Προσφορά - Black Mask Treatment",
  "description": "Εξειδικευμένη θεραπεία προσώπου με black mask για βαθύ καθαρισμό",
  "startDate": "2024-12-20T10:00:00+02:00",
  "endDate": "2024-12-31T18:00:00+02:00",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": {
    "@type": "Place",
    "name": "Monalisa Barbershop",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Κολοκοτρώνη 15Α",
      "addressLocality": "Χαλάνδρι",
      "addressRegion": "Αττική",
      "addressCountry": "GR"
    }
  },
  "organizer": {
    "@type": "HairSalon",
    "name": "Monalisa Barbershop",
    "url": "https://www.monalisabarbershop.gr"
  },
  "offers": {
    "@type": "Offer",
    "price": "15",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock",
    "validFrom": "2024-12-20",
    "validThrough": "2024-12-31"
  }
};
