'use client';

import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

interface SEOPluginProps {
  pageType?: 'home' | 'services' | 'about' | 'contact' | 'gallery';
}

export default function SEOPlugin({ pageType = 'home' }: SEOPluginProps) {
  const pathname = usePathname();
  const { language } = useLanguage();
  
  // Get language from context, fallback to pathname detection
  const currentLang: 'el' | 'en' = (language || (pathname.startsWith('/en') ? 'en' : 'el')) as 'el' | 'en';
  
  const getKeywords = () => {
    const baseKeywords = [
      // ΓΕΝΙΚΑ KEYWORDS ΧΩΡΙΣ ΤΟΠΟΘΕΣΙΑ - ΠΡΩΤΗ ΠΡΟΤΕΡΑΙΟΤΗΤΑ
      "γυναικείο κούρεμα", "γυναικείο κομμωτήριο", "κομμωτήριο", "κομμωτήριο γυναικείος",
      "κούρεμα", "κούρεμα γυναικείος", "κούρεμα γυναίκας", "γυναικείο κούρεμα κοντά μου",
      "κομμωτήριο κοντά μου", "γυναικείο κομμωτήριο κοντά μου", "women's haircut", "women's hair salon",
      "hair salon", "haircut", "women's haircut near me", "hair salon near me",
      
      // Domain & brand authority
      "alexandrarizoucoiffure.gr", "www.alexandrarizoucoiffure.gr",
      "https://alexandrarizoucoiffure.gr", "Alexandra Rizou Coiffure",
      "AlexandraRizouCoiffure", "Alexandra Rizou Coiffure site",
      
      // Βαφή & Χρωματισμός Μαλλιών (ΧΩΡΙΣ ΤΟΠΟΘΕΣΙΑ)
      "βαφή μαλλιών", "χρωματισμός μαλλιών", "χρωματισμός", "βαφή", "hair color", "hair coloring",
      "hair dye", "hair color near me", "χρωματισμός μαλλιών κοντά μου", "βαφή μαλλιών κοντά μου",
      "full color", "root color", "βαφή ρίζας", "βαφή ρίζα", "root touch up", "root coloring",
      "toner", "toning", "bleaching", "άσπρισμα μαλλιών", "άσπρισμα", "bleach", "lightening",
      "ombre", "ombre hair", "ombre coloring", "ombre κομμωτήριο", "ombre hair salon",
      "balayage", "μπαλαγιάζ", "μπαλαγιάζ κομμωτήριο", "balayage hair", "balayage near me",
      "μπαλαγιάζ κοντά μου", "balayage hair salon", "balayage coloring", "balayage technique",
      "highlights", "χαϊλάιτ", "χαϊλάιτ κομμωτήριο", "highlights hair", "highlights near me",
      "χαϊλάιτ κοντά μου", "highlights hair salon", "babylights", "babylights hair",
      "foils", "foil highlights", "foil coloring", "lowlights", "lowlights hair",
      "color correction", "διόρθωση χρώματος", "color correction hair", "color correction near me",
      "hair color correction", "color correction salon", "hair color correction near me",
      
      // Θεραπείες Μαλλιών (ΧΩΡΙΣ ΤΟΠΟΘΕΣΙΑ)
      "θεραπεία μαλλιών", "θεραπεία μαλλιών κοντά μου", "hair treatment", "hair treatment near me",
      "hair spa", "hair spa near me", "θεραπεία κομμωτήριο", "hair treatment salon",
      "hair mask", "hair conditioning", "hair conditioning treatment", "deep conditioning",
      "keratin treatment", "keratin", "keratin treatment near me", "keratin hair treatment",
      "hair repair", "επισκευή μαλλιών", "hair repair treatment", "damaged hair treatment",
      "hair restoration", "αποκατάσταση μαλλιών", "hair restoration treatment",
      "scalp treatment", "θεραπεία λουτήρα", "scalp treatment near me", "scalp care",
      "hair care", "περιποίηση μαλλιών", "hair care treatment", "hair care salon",
      "hair strengthening", "ενίσχυση μαλλιών", "hair strengthening treatment",
      "hair moisturizing", "ενυδάτωση μαλλιών", "hair moisturizing treatment",
      "anti-frizz treatment", "θεραπεία κατά της ξηρότητας", "anti-frizz hair treatment",
      "smoothing treatment", "ομαλοποίηση μαλλιών", "smoothing hair treatment",
      "hair gloss", "gloss treatment", "gloss hair", "hair gloss treatment",
      
      // Manicure & Pedicure (ΧΩΡΙΣ ΤΟΠΟΘΕΣΙΑ)
      "manicure", "manicure κοντά μου", "manicure near me", "nail care", "nail care near me",
      "nail art", "nail art near me", "nail art κοντά μου", "nail design", "nail design near me",
      "gel polish", "gel nails", "gel polish near me", "gel nails near me", "gel κοντά μου",
      "nail salon", "nail salon near me", "nail salon κοντά μου", "nail salon κομμωτήριο",
      "manicure pedicure", "manicure pedicure near me", "manicure pedicure κοντά μου",
      "pedicure", "pedicure near me", "pedicure κοντά μου", "foot care", "foot care near me",
      "nail extension", "nail extensions", "nail extension near me", "nail extensions near me",
      "acrylic nails", "acrylic nails near me", "acrylic nails κοντά μου",
      "nail polish", "nail polish κοντά μου", "nail polish near me", "nail painting",
      "nail painting near me", "nail decoration", "nail decoration near me",
      
      // Waxing & Αποτρίχωση (ΧΩΡΙΣ ΤΟΠΟΘΕΣΙΑ)
      "waxing", "waxing near me", "waxing κοντά μου", "αποτρίχωση", "αποτρίχωση κοντά μου",
      "hair removal", "hair removal near me", "hair removal κοντά μου", "waxing κομμωτήριο",
      "waxing salon", "waxing salon near me", "waxing salon κοντά μου", "body waxing",
      "body waxing near me", "facial waxing", "facial waxing near me", "bikini waxing",
      "bikini waxing near me", "leg waxing", "leg waxing near me", "arm waxing",
      "arm waxing near me", "underarm waxing", "underarm waxing near me",
      "eyebrow waxing", "eyebrow waxing near me", "eyebrow shaping", "eyebrow shaping near me",
      "upper lip waxing", "upper lip waxing near me", "chin waxing", "chin waxing near me",
      "brazilian waxing", "brazilian waxing near me", "full body waxing", "full body waxing near me",
      "sugar waxing", "sugar waxing near me", "sugar hair removal", "sugar hair removal near me",
      "hot wax", "hot wax near me", "cold wax", "cold wax near me", "strip waxing",
      "strip waxing near me", "hard wax", "hard wax near me", "soft wax", "soft wax near me",
      
      // Κομμωτήριο & Υπηρεσίες (ΓΕΝΙΚΑ)
      "κομμωτήριο", "κομμωτήριο κοντά μου", "hair salon", "hair salon near me",
      "beauty salon", "beauty salon near me", "beauty salon κοντά μου", "beauty center",
      "beauty center near me", "beauty center κοντά μου", "salon", "salon near me",
      "hair stylist", "hair stylist near me", "κομμωτής", "κομμωτής κοντά μου",
      "hair dresser", "hair dresser near me", "stylist", "stylist near me",
      "haircut appointment", "ραντεβού κομμωτήριο", "haircut booking", "haircut booking near me",
      "salon appointment", "salon booking", "salon booking near me", "haircut reservation",
      "haircut reservation near me", "salon reservation", "salon reservation near me",
      
      // Κύριες λέξεις-κλειδιά - Γυναικείο Κομμωτήριο (ΜΕ ΤΟΠΟΘΕΣΙΑ)
      "γυναικείο κούρεμα Χαλάνδρι", "γυναικείο κομμωτήριο Χαλάνδρι", "κομμωτήριο Χαλάνδρι",
      "κομμωτήριο γυναικείος Χαλάνδρι", "κούρεμα Χαλάνδρι", "Alexandra Rizou Χαλάνδρι",
      "Alexandra Rizou κομμωτήριο", "Alexandra Rizou κούρεμα", "κομμωτήριο για γυναίκες Χαλάνδρι",
      "γυναικείο κούρεμα Αθήνα", "γυναικείο κομμωτήριο Αθήνα", "κομμωτήριο Αθήνα",
      "κομμωτήριο κοντά μου", "γυναικείο κούρεμα κοντά μου", "κομμωτήριο κοντά μου",
      "women's haircut Chalandri", "women's hair salon Chalandri", "hair salon Chalandri",
      "haircut Chalandri", "Alexandra Rizou Chalandri", "hair salon Athens",
      "women's haircut Athens", "hair salon near me", "women's hair salon near me",
      
      // Balayage & Highlights
      "balayage Χαλάνδρι", "highlights Χαλάνδρι", "balayage Αθήνα", "highlights Αθήνα",
      "balayage κομμωτήριο Χαλάνδρι", "highlights κομμωτήριο Χαλάνδρι", "balayage κοντά μου",
      "highlights κοντά μου", "balayage Chalandri", "highlights Chalandri",
      "balayage Athens", "highlights Athens", "ombre Χαλάνδρι", "ombre Αθήνα",
      "babylights Χαλάνδρι", "babylights Αθήνα", "balayage κομμωτήριο",
      "highlights κομμωτήριο", "ombre κομμωτήριο", "balayage hair salon",
      "highlights hair salon", "ombre hair salon",
      
      // Χρωματισμός Μαλλιών
      "χρωματισμός μαλλιών Χαλάνδρι", "χρωματισμός μαλλιών Αθήνα", "χρωματισμός μαλλιών κοντά μου",
      "hair color Chalandri", "hair color Athens", "hair coloring Chalandri",
      "hair coloring Athens", "χρωματισμός κομμωτήριο Χαλάνδρι", "χρωματισμός κομμωτήριο Αθήνα",
      "full color Χαλάνδρι", "root color Χαλάνδρι", "toner Χαλάνδρι",
      "bleaching Χαλάνδρι", "full color Αθήνα", "root color Αθήνα",
      
      // Θεραπείες Μαλλιών
      "θεραπεία μαλλιών Χαλάνδρι", "θεραπεία μαλλιών Αθήνα", "θεραπεία μαλλιών κοντά μου",
      "hair treatment Chalandri", "hair treatment Athens", "hair spa Chalandri",
      "hair spa Athens", "θεραπεία κομμωτήριο Χαλάνδρι", "θεραπεία κομμωτήριο Αθήνα",
      "hair mask Χαλάνδρι", "hair mask Αθήνα", "keratin treatment Χαλάνδρι",
      "keratin treatment Αθήνα", "hair conditioning Χαλάνδρι",
      
      // Manicure & Pedicure
      "manicure Χαλάνδρι", "pedicure Χαλάνδρι", "manicure Αθήνα", "pedicure Αθήνα",
      "manicure κοντά μου", "pedicure κοντά μου", "nail care Χαλάνδρι",
      "nail care Αθήνα", "nail art Χαλάνδρι", "nail art Αθήνα",
      "gel polish Χαλάνδρι", "gel polish Αθήνα", "nail salon Χαλάνδρι",
      "nail salon Αθήνα", "manicure pedicure Χαλάνδρι", "manicure pedicure Αθήνα",
      
      // Waxing
      "waxing Χαλάνδρι", "waxing Αθήνα", "waxing κοντά μου", "αποτρίχωση Χαλάνδρι",
      "αποτρίχωση Αθήνα", "αποτρίχωση κοντά μου", "waxing κομμωτήριο Χαλάνδρι",
      "waxing κομμωτήριο Αθήνα", "hair removal Χαλάνδρι", "hair removal Αθήνα",
      
      // Χαλάνδρι Variations (Greek & English)
      "κομμωτήριο Χαλάνδρι", "κομμωτήριο Χαλανδρι", "κομμωτήριο Χαλανδρίου", "κομμωτήριο Χαλανδριου",
      "κομμωτήριο Chalandri", "κομμωτήριο Khalandri", "κομμωτήριο Khalandrion", "κομμωτήριο Khalandriou",
      "κομμωτήριο Halandri", "κομμωτήριο Halandry", "κομμωτήριο Halandrion", "κομμωτήριο Halandriou",
      "κομμωτήριο Xalandri", "κομμωτήριο Xalandry", "κομμωτήριο Xalandrion", "κομμωτήριο Xalandriou",
      
      "γυναικείο κούρεμα Χαλάνδρι", "γυναικείο κούρεμα Χαλανδρι", "γυναικείο κούρεμα Χαλανδρίου",
      "γυναικείο κούρεμα Chalandri", "γυναικείο κούρεμα Khalandri", "γυναικείο κούρεμα Halandri",
      "γυναικείο κούρεμα Xalandri", "women's haircut Chalandri", "women's haircut Khalandri",
      "women's haircut Halandri", "women's haircut Xalandri",
      
      "balayage Χαλάνδρι", "balayage Χαλανδρι", "balayage Χαλανδρίου",
      "balayage Chalandri", "balayage Khalandri", "balayage Halandri",
      "highlights Χαλάνδρι", "highlights Χαλανδρι", "highlights Χαλανδρίου",
      "highlights Chalandri", "highlights Khalandri", "highlights Halandri",
      
      // Αθήνα Variations (Greek & English)
      "κομμωτήριο Αθήνα", "κομμωτήριο Αθηνα", "κομμωτήριο Αθηνων",
      "κομμωτήριο Athens", "κομμωτήριο Athina", "κομμωτήριο Athinai", "κομμωτήριο Athinon",
      "κομμωτήριο Αττική", "κομμωτήριο Αττικη", "κομμωτήριο Αττικης",
      "κομμωτήριο Attica", "κομμωτήριο Attiki", "κομμωτήριο Attikis",
      
      "γυναικείο κούρεμα Αθήνα", "γυναικείο κούρεμα Αθηνα", "γυναικείο κούρεμα Αθηνων",
      "γυναικείο κούρεμα Athens", "γυναικείο κούρεμα Athina", "γυναικείο κούρεμα Attica",
      "women's haircut Athens", "women's haircut Athina", "women's haircut Attica",
      
      // Βόρεια Προάστια Variations
      "κομμωτήριο Βόρεια Προάστια", "κομμωτήριο Βορεια Προαστια",
      "κομμωτήριο Βόρειας Αττικής", "κομμωτήριο Βορειας Αττικης",
      "κομμωτήριο Northern Suburbs", "κομμωτήριο North Suburbs", "κομμωτήριο North Athens",
      "κομμωτήριο North Attica", "κομμωτήριο North Attiki",
      "γυναικείο κούρεμα Βόρεια Προάστια", "γυναικείο κούρεμα Βορεια Προαστια",
      "women's haircut Northern Suburbs", "women's haircut North Suburbs",
      
      // Μαρούσι & Κηφισιά
      "κομμωτήριο Μαρούσι", "κομμωτήριο Μαρούσι", "κομμωτήριο Marousi",
      "γυναικείο κούρεμα Μαρούσι", "women's haircut Marousi",
      "κομμωτήριο Κηφισιά", "κομμωτήριο Κηφισια", "κομμωτήριο Kifisia",
      "γυναικείο κούρεμα Κηφισιά", "women's haircut Kifisia",
      "balayage Μαρούσι", "highlights Μαρούσι", "balayage Κηφισιά",
      "highlights Κηφισιά", "balayage Marousi", "highlights Marousi",
      
      // Street-specific Combinations
      "κομμωτήριο Ανδρέα Παπανδρέου Χαλάνδρι", "κομμωτήριο Ανδρέα Παπανδρέου 52 Χαλάνδρι",
      "κομμωτήριο Andrea Papandreou Chalandri", "κομμωτήριο Andrea Papandreou 52 Chalandri",
      "γυναικείο κούρεμα Ανδρέα Παπανδρέου Χαλάνδρι", "women's haircut Andrea Papandreou Chalandri",
      
      // Quality-based Combinations
      "καλύτερο κομμωτήριο Χαλάνδρι", "καλύτερο γυναικείο κούρεμα Χαλάνδρι", "καλύτερο κομμωτήριο Αθήνα",
      "καλύτερο γυναικείο κούρεμα Αθήνα", "καλύτερο κομμωτήριο κοντά μου",
      "best hair salon Chalandri", "best women's haircut Chalandri", "best hair salon Athens",
      "best women's haircut Athens", "best hair salon near me",
      
      // Professional-based Combinations
      "επαγγελματικό κομμωτήριο Χαλάνδρι", "επαγγελματικό γυναικείο κούρεμα Χαλάνδρι",
      "επαγγελματικό κομμωτήριο Αθήνα", "professional hair salon Chalandri",
      "professional women's haircut Chalandri", "professional hair salon Athens",
      
      // Modern-based Combinations
      "σύγχρονο κομμωτήριο Χαλάνδρι", "σύγχρονο γυναικείο κούρεμα Χαλάνδρι",
      "modern hair salon Chalandri", "modern women's haircut Chalandri",
      "σύγχρονο balayage Χαλάνδρι", "modern balayage Chalandri",
      
      // Price-based Combinations
      "κομμωτήριο Χαλάνδρι τιμές", "γυναικείο κούρεμα Χαλάνδρι τιμή",
      "hair salon Chalandri prices", "women's haircut Chalandri price",
      "balayage Χαλάνδρι τιμή", "highlights Χαλάνδρι τιμή",
      
      // Time-based Combinations
      "κομμωτήριο Χαλάνδρι ανοιχτό", "γυναικείο κούρεμα Χαλάνδρι ανοιχτό",
      "hair salon Chalandri open", "women's haircut Chalandri open now",
      "κομμωτήριο Χαλάνδρι τώρα", "κομμωτήριο Χαλάνδρι σήμερα",
      
      // Service-specific Combinations
      "γυναικείο κούρεμα και balayage Χαλάνδρι", "γυναικείο κούρεμα και highlights Χαλάνδρι",
      "γυναικείο κούρεμα και χρωματισμός Χαλάνδρι", "women's haircut and balayage Chalandri",
      "women's haircut and highlights Chalandri", "women's haircut and color Chalandri",
      
      // Age-specific Combinations
      "κομμωτήριο γυναίκες Χαλάνδρι", "κομμωτήριο για γυναίκες Χαλάνδρι",
      "hair salon for women Chalandri", "women's hair salon Chalandri",
      
      // Style-specific Combinations
      "κομμωτήριο μοντέρνο Χαλάνδρι", "γυναικείο κούρεμα μοντέρνο Χαλάνδρι",
      "modern hair salon Chalandri", "modern women's haircut Chalandri",
      "κομμωτήριο κλασικό Χαλάνδρι", "γυναικείο κούρεμα κλασικό Χαλάνδρι",
      
      // Experience-based Combinations
      "κομμωτήριο εμπειρία Χαλάνδρι", "γυναικείο κούρεμα εμπειρία Χαλάνδρι",
      "experienced hair salon Chalandri", "experienced women's haircut Chalandri",
      "κομμωτήριο έμπειρο Χαλάνδρι", "κομμωτήριο με εμπειρία Χαλάνδρι",
      
      // Quality-based Combinations
      "κομμωτήριο ποιότητα Χαλάνδρι", "γυναικείο κούρεμα ποιότητα Χαλάνδρι",
      "high quality hair salon Chalandri", "high quality women's haircut Chalandri",
      "κομμωτήριο υψηλή ποιότητα Χαλάνδρι", "κομμωτήριο καλή ποιότητα Χαλάνδρι",
      
      // Recommendation-based Combinations
      "κομμωτήριο προτεινόμενο Χαλάνδρι", "γυναικείο κούρεμα προτεινόμενο Χαλάνδρι",
      "recommended hair salon Chalandri", "recommended women's haircut Chalandri",
      "κομμωτήριο συστάσεις Χαλάνδρι", "κομμωτήριο συστάσεις Χαλάνδρι",
      
      // Review-based Combinations
      "κομμωτήριο αξιολογήσεις Χαλάνδρι", "γυναικείο κούρεμα αξιολογήσεις Χαλάνδρι",
      "hair salon reviews Chalandri", "women's haircut reviews Chalandri",
      "κομμωτήριο κριτικές Χαλάνδρι", "κομμωτήριο 5 αστέρια Χαλάνδρι",
      "5 star hair salon Chalandri", "5 star women's haircut Chalandri",
      
      // Rating-based Combinations
      "κομμωτήριο 5 αστέρια Χαλάνδρι", "γυναικείο κούρεμα 5 αστέρια Χαλάνδρι",
      "5 stars hair salon Chalandri", "5 stars women's haircut Chalandri",
      "top rated hair salon Chalandri", "best rated women's haircut Chalandri",
      
      // Popular Combinations
      "κομμωτήριο δημοφιλές Χαλάνδρι", "γυναικείο κούρεμα δημοφιλές Χαλάνδρι",
      "popular hair salon Chalandri", "popular women's haircut Chalandri",
      
      // New Combinations
      "κομμωτήριο νέο Χαλάνδρι", "γυναικείο κούρεμα νέο Χαλάνδρι",
      "new hair salon Chalandri", "new women's haircut Chalandri",
      "κομμωτήριο καινούριο Χαλάνδρι",
      
      // Clean Combinations
      "κομμωτήριο καθαρό Χαλάνδρι", "γυναικείο κούρεμα καθαρό Χαλάνδρι",
      "clean hair salon Chalandri", "clean women's haircut Chalandri",
      "κομμωτήριο καθαριότητα Χαλάνδρι",
      
      // Friendly Combinations
      "κομμωτήριο φιλικό Χαλάνδρι", "γυναικείο κούρεμα φιλικό Χαλάνδρι",
      "friendly hair salon Chalandri", "friendly women's haircut Chalandri",
      
      // Comfortable Combinations
      "κομμωτήριο άνετο Χαλάνδρι", "γυναικείο κούρεμα άνετο Χαλάνδρι",
      "comfortable hair salon Chalandri", "comfortable women's haircut Chalandri",
      "κομμωτήριο άνεση Χαλάνδρι",
      
      // Fast Combinations
      "κομμωτήριο γρήγορο Χαλάνδρι", "γυναικείο κούρεμα γρήγορο Χαλάνδρι",
      "fast hair salon Chalandri", "quick women's haircut Chalandri",
      "κομμωτήριο γρήγορα Χαλάνδρι",
      
      // Easy Combinations
      "κομμωτήριο εύκολο Χαλάνδρι", "γυναικείο κούρεμα εύκολο Χαλάνδρι",
      "easy hair salon Chalandri", "easy women's haircut Chalandri",
      
      // Convenient Combinations
      "κομμωτήριο βολικό Χαλάνδρι", "γυναικείο κούρεμα βολικό Χαλάνδρι",
      "convenient hair salon Chalandri", "convenient women's haircut Chalandri",
      
      // Accessible Combinations
      "κομμωτήριο προσβάσιμο Χαλάνδρι", "γυναικείο κούρεμα προσβάσιμο Χαλάνδρι",
      "accessible hair salon Chalandri", "accessible women's haircut Chalandri",
      
      // Reliable Combinations
      "κομμωτήριο αξιόπιστο Χαλάνδρι", "γυναικείο κούρεμα αξιόπιστο Χαλάνδρι",
      "reliable hair salon Chalandri", "reliable women's haircut Chalandri",
      
      // Trusted Combinations
      "κομμωτήριο αξιόπιστο Χαλάνδρι", "γυναικείο κούρεμα αξιόπιστο Χαλάνδρι",
      "trusted hair salon Chalandri", "trusted women's haircut Chalandri",
      
      // Alexandra Rizou-specific Combinations
      "Alexandra Rizou κομμωτήριο Χαλάνδρι", "Alexandra Rizou κούρεμα Χαλάνδρι",
      "Alexandra Rizou balayage Χαλάνδρι", "Alexandra Rizou highlights Χαλάνδρι",
      "Alexandra Rizou hair salon Chalandri", "Alexandra Rizou haircut Chalandri",
      "Alexandra Rizou balayage Chalandri", "Alexandra Rizou highlights Chalandri",
      "Alexandra Rizou κομμωτήριο Αθήνα", "Alexandra Rizou κούρεμα Αθήνα",
      "Alexandra Rizou κομμωτήριο κοντά μου", "Alexandra Rizou κούρεμα κοντά μου",
      
      // ΓΕΝΙΚΑ KEYWORDS - ΧΩΡΙΣ ΤΟΠΟΘΕΣΙΑ (ΣΥΝΕΧΕΙΑ)
      "κούρεμα γυναικείος", "κούρεμα γυναίκας", "γυναικείο κούρεμα τιμή", "γυναικείο κούρεμα τιμές",
      "κομμωτήριο τιμές", "κομμωτήριο τιμή", "haircut price", "haircut prices", "hair salon prices",
      "hair salon price", "women's haircut price", "women's haircut prices",
      "κούρεμα online", "haircut online", "online haircut booking", "online salon booking",
      "ραντεβού κομμωτήριο", "haircut appointment", "salon appointment", "haircut booking",
      "salon booking", "haircut reservation", "salon reservation",
      "κομμωτήριο ανοιχτό", "hair salon open", "salon open", "hair salon open now",
      "κομμωτήριο τώρα", "hair salon now", "salon now", "hair salon today",
      "κομμωτήριο σήμερα", "hair salon today", "salon today",
      
      // Βαφή & Χρωματισμός - ΓΕΝΙΚΑ
      "βαφή μαλλιών τιμή", "βαφή μαλλιών τιμές", "hair color price", "hair color prices",
      "hair coloring price", "hair coloring prices", "hair dye price", "hair dye prices",
      "full color price", "full color prices", "root color price", "root color prices",
      "βαφή ρίζας τιμή", "βαφή ρίζας τιμές", "root touch up price", "root touch up prices",
      "toner price", "toner prices", "toning price", "toning prices",
      "bleaching price", "bleaching prices", "άσπρισμα τιμή", "άσπρισμα τιμές",
      "lightening price", "lightening prices", "color correction price", "color correction prices",
      "διόρθωση χρώματος τιμή", "διόρθωση χρώματος τιμές",
      
      // Balayage & Highlights - ΓΕΝΙΚΑ
      "μπαλαγιάζ", "μπαλαγιάζ τιμή", "μπαλαγιάζ τιμές", "balayage", "balayage price",
      "balayage prices", "balayage hair", "balayage technique", "balayage coloring",
      "balayage hair salon", "balayage κομμωτήριο", "balayage appointment", "balayage booking",
      "highlights", "highlights price", "highlights prices", "highlights hair",
      "highlights hair salon", "highlights κομμωτήριο", "highlights appointment", "highlights booking",
      "χαϊλάιτ", "χαϊλάιτ τιμή", "χαϊλάιτ τιμές", "babylights", "babylights price",
      "babylights prices", "foils", "foil highlights", "foil coloring", "lowlights",
      "lowlights price", "lowlights prices", "ombre", "ombre price", "ombre prices",
      "ombre hair", "ombre coloring", "ombre hair salon", "ombre κομμωτήριο",
      
      // Θεραπείες - ΓΕΝΙΚΑ
      "θεραπεία μαλλιών τιμή", "θεραπεία μαλλιών τιμές", "hair treatment price",
      "hair treatment prices", "hair spa price", "hair spa prices", "hair mask price",
      "hair mask prices", "hair conditioning price", "hair conditioning prices",
      "deep conditioning price", "deep conditioning prices", "keratin treatment price",
      "keratin treatment prices", "keratin price", "keratin prices", "hair repair price",
      "hair repair prices", "επισκευή μαλλιών τιμή", "επισκευή μαλλιών τιμές",
      "hair restoration price", "hair restoration prices", "αποκατάσταση μαλλιών τιμή",
      "scalp treatment price", "scalp treatment prices", "θεραπεία λουτήρα τιμή",
      "scalp care price", "scalp care prices", "hair care price", "hair care prices",
      "περιποίηση μαλλιών τιμή", "hair strengthening price", "hair strengthening prices",
      "ενίσχυση μαλλιών τιμή", "hair moisturizing price", "hair moisturizing prices",
      "ενυδάτωση μαλλιών τιμή", "anti-frizz treatment price", "anti-frizz treatment prices",
      "θεραπεία κατά της ξηρότητας τιμή", "smoothing treatment price", "smoothing treatment prices",
      "ομαλοποίηση μαλλιών τιμή", "hair gloss price", "hair gloss prices",
      "gloss treatment price", "gloss treatment prices",
      
      // Manicure & Pedicure - ΓΕΝΙΚΑ
      "manicure τιμή", "manicure τιμές", "manicure price", "manicure prices",
      "nail care price", "nail care prices", "nail art price", "nail art prices",
      "nail design price", "nail design prices", "gel polish price", "gel polish prices",
      "gel nails price", "gel nails prices", "nail salon price", "nail salon prices",
      "manicure pedicure price", "manicure pedicure prices", "pedicure price",
      "pedicure prices", "foot care price", "foot care prices", "nail extension price",
      "nail extension prices", "nail extensions price", "nail extensions prices",
      "acrylic nails price", "acrylic nails prices", "nail polish price", "nail polish prices",
      "nail painting price", "nail painting prices", "nail decoration price",
      "nail decoration prices",
      
      // Waxing - ΓΕΝΙΚΑ
      "waxing τιμή", "waxing τιμές", "waxing price", "waxing prices",
      "αποτρίχωση τιμή", "αποτρίχωση τιμές", "hair removal price", "hair removal prices",
      "waxing salon price", "waxing salon prices", "body waxing price", "body waxing prices",
      "facial waxing price", "facial waxing prices", "bikini waxing price",
      "bikini waxing prices", "leg waxing price", "leg waxing prices", "arm waxing price",
      "arm waxing prices", "underarm waxing price", "underarm waxing prices",
      "eyebrow waxing price", "eyebrow waxing prices", "eyebrow shaping price",
      "eyebrow shaping prices", "upper lip waxing price", "upper lip waxing prices",
      "chin waxing price", "chin waxing prices", "brazilian waxing price",
      "brazilian waxing prices", "full body waxing price", "full body waxing prices",
      "sugar waxing price", "sugar waxing prices", "sugar hair removal price",
      "sugar hair removal prices", "hot wax price", "hot wax prices", "cold wax price",
      "cold wax prices", "strip waxing price", "strip waxing prices", "hard wax price",
      "hard wax prices", "soft wax price", "soft wax prices",
      
      // Long-tail keywords
      "καλύτερο γυναικείο κούρεμα στο Χαλάνδρι", "ποιο είναι το καλύτερο κομμωτήριο στην Αθήνα",
      "γυναικείο κούρεμα κοντά μου", "balayage κοντά μου", "highlights κοντά μου",
      "χρωματισμός μαλλιών κοντά μου", "θεραπεία μαλλιών κοντά μου",
      "best women's haircut in Chalandri", "best hair salon in Athens",
      "women's haircut near me", "balayage near me", "highlights near me",
      
      // ΓΕΝΙΚΑ LONG-TAIL KEYWORDS - ΧΩΡΙΣ ΤΟΠΟΘΕΣΙΑ
      "ποιο είναι το καλύτερο κομμωτήριο", "καλύτερο γυναικείο κούρεμα",
      "ποιο είναι το καλύτερο γυναικείο κούρεμα", "καλύτερο κομμωτήριο",
      "best hair salon", "best women's haircut", "what is the best hair salon",
      "what is the best women's haircut", "ποιο είναι το καλύτερο balayage",
      "καλύτερο balayage", "best balayage", "ποιο είναι το καλύτερο highlights",
      "καλύτερο highlights", "best highlights", "ποιο είναι ο καλύτερος χρωματισμός",
      "καλύτερος χρωματισμός μαλλιών", "best hair color", "best hair coloring",
      "ποια είναι η καλύτερη θεραπεία μαλλιών", "καλύτερη θεραπεία μαλλιών",
      "best hair treatment", "best hair spa", "ποιο είναι το καλύτερο manicure",
      "καλύτερο manicure", "best manicure", "ποιο είναι το καλύτερο pedicure",
      "καλύτερο pedicure", "best pedicure", "ποιο είναι το καλύτερο waxing",
      "καλύτερο waxing", "best waxing", "ποια είναι η καλύτερη αποτρίχωση",
      "καλύτερη αποτρίχωση", "best hair removal",
      
      // Πόσο κοστίζει - ΓΕΝΙΚΑ
      "πόσο κοστίζει γυναικείο κούρεμα", "πόσο κοστίζει κομμωτήριο",
      "how much does a women's haircut cost", "how much does a haircut cost",
      "how much does hair salon cost", "πόσο κοστίζει βαφή μαλλιών",
      "how much does hair color cost", "how much does hair coloring cost",
      "πόσο κοστίζει balayage", "how much does balayage cost",
      "πόσο κοστίζει highlights", "how much does highlights cost",
      "πόσο κοστίζει χρωματισμός μαλλιών", "how much does hair coloring cost",
      "πόσο κοστίζει θεραπεία μαλλιών", "how much does hair treatment cost",
      "πόσο κοστίζει manicure", "how much does manicure cost",
      "πόσο κοστίζει pedicure", "how much does pedicure cost",
      "πόσο κοστίζει waxing", "how much does waxing cost",
      "πόσο κοστίζει αποτρίχωση", "how much does hair removal cost",
      
      // Πώς - ΓΕΝΙΚΑ
      "πώς να κάνω balayage", "how to do balayage", "πώς να κάνω highlights",
      "how to do highlights", "πώς να χρωματίσω τα μαλλιά μου",
      "how to color my hair", "πώς να φροντίσω τα μαλλιά μου",
      "how to care for my hair", "πώς να κάνω θεραπεία μαλλιών",
      "how to do hair treatment", "πώς να κάνω manicure", "how to do manicure",
      "πώς να κάνω pedicure", "how to do pedicure", "πώς να κάνω waxing",
      "how to do waxing", "πώς να κάνω αποτρίχωση", "how to do hair removal",
      
      // Πού - ΓΕΝΙΚΑ
      "πού να κάνω γυναικείο κούρεμα", "where to get women's haircut",
      "πού να κάνω κομμωτήριο", "where to go to hair salon",
      "πού να κάνω βαφή μαλλιών", "where to get hair color",
      "πού να κάνω balayage", "where to get balayage",
      "πού να κάνω highlights", "where to get highlights",
      "πού να κάνω χρωματισμό μαλλιών", "where to get hair coloring",
      "πού να κάνω θεραπεία μαλλιών", "where to get hair treatment",
      "πού να κάνω manicure", "where to get manicure",
      "πού να κάνω pedicure", "where to get pedicure",
      "πού να κάνω waxing", "where to get waxing",
      "πού να κάνω αποτρίχωση", "where to get hair removal",
      
      // Alexandra Rizou prices & booking
      "Alexandra Rizou Χαλάνδρι τιμές", "Alexandra Rizou κομμωτήριο ραντεβού",
      "Alexandra Rizou hair salon booking", "Alexandra Rizou Chalandri prices",
      "γυναικείο κούρεμα Χαλάνδρι online booking", "hair salon Chalandri online booking",
      
      // 5 Αστέρια Keywords - Google Reviews
      "5 αστέρια κομμωτήριο Χαλάνδρι", "5 αστέρια γυναικείο κούρεμα Χαλάνδρι",
      "5 αστέρια Alexandra Rizou", "5 αστέρια κομμωτήριο Αθήνα",
      "5 stars hair salon Chalandri", "5 stars women's haircut Chalandri",
      "5 stars Alexandra Rizou", "5 stars hair salon Athens",
      "top rated hair salon Chalandri", "top rated women's haircut Chalandri",
      "best rated hair salon Chalandri", "best rated women's haircut Chalandri",
      
      // ΕΠΙΠΛΕΟΝ ΓΕΝΙΚΑ KEYWORDS - ΧΩΡΙΣ ΤΟΠΟΘΕΣΙΑ
      "κούρεμα", "κούρεμα γυναίκας", "κούρεμα γυναικείος", "γυναικείο κούρεμα online",
      "γυναικείο κούρεμα ραντεβού", "γυναικείο κούρεμα booking", "γυναικείο κούρεμα appointment",
      "haircut", "haircut women", "women's haircut online", "women's haircut booking",
      "women's haircut appointment", "haircut reservation", "haircut online booking",
      
      // Βαφή - ΕΠΙΠΛΕΟΝ
      "βαφή", "βαφή μαλλιών online", "βαφή μαλλιών ραντεβού", "βαφή μαλλιών booking",
      "hair color online", "hair color booking", "hair color appointment",
      "hair coloring online", "hair coloring booking", "hair coloring appointment",
      "hair dye online", "hair dye booking", "hair dye appointment",
      "full color online", "full color booking", "root color online", "root color booking",
      "βαφή ρίζας online", "βαφή ρίζας booking", "root touch up online", "root touch up booking",
      "toner online", "toner booking", "toning online", "toning booking",
      "bleaching online", "bleaching booking", "άσπρισμα online", "άσπρισμα booking",
      "lightening online", "lightening booking", "color correction online",
      "color correction booking", "διόρθωση χρώματος online", "διόρθωση χρώματος booking",
      
      // Balayage & Highlights - ΕΠΙΠΛΕΟΝ
      "μπαλαγιάζ online", "μπαλαγιάζ ραντεβού", "μπαλαγιάζ booking", "μπαλαγιάζ appointment",
      "balayage online", "balayage booking", "balayage appointment", "balayage reservation",
      "highlights online", "highlights booking", "highlights appointment", "highlights reservation",
      "χαϊλάιτ online", "χαϊλάιτ booking", "χαϊλάιτ appointment", "babylights online",
      "babylights booking", "foils online", "foils booking", "lowlights online",
      "lowlights booking", "ombre online", "ombre booking", "ombre appointment",
      
      // Θεραπείες - ΕΠΙΠΛΕΟΝ
      "θεραπεία μαλλιών online", "θεραπεία μαλλιών ραντεβού", "θεραπεία μαλλιών booking",
      "hair treatment online", "hair treatment booking", "hair treatment appointment",
      "hair spa online", "hair spa booking", "hair spa appointment",
      "hair mask online", "hair mask booking", "hair conditioning online",
      "hair conditioning booking", "deep conditioning online", "deep conditioning booking",
      "keratin treatment online", "keratin treatment booking", "keratin online",
      "keratin booking", "hair repair online", "hair repair booking",
      "επισκευή μαλλιών online", "επισκευή μαλλιών booking", "hair restoration online",
      "hair restoration booking", "αποκατάσταση μαλλιών online", "αποκατάσταση μαλλιών booking",
      "scalp treatment online", "scalp treatment booking", "θεραπεία λουτήρα online",
      "θεραπεία λουτήρα booking", "scalp care online", "scalp care booking",
      "hair care online", "hair care booking", "περιποίηση μαλλιών online",
      "περιποίηση μαλλιών booking", "hair strengthening online", "hair strengthening booking",
      "ενίσχυση μαλλιών online", "ενίσχυση μαλλιών booking", "hair moisturizing online",
      "hair moisturizing booking", "ενυδάτωση μαλλιών online", "ενυδάτωση μαλλιών booking",
      "anti-frizz treatment online", "anti-frizz treatment booking",
      "θεραπεία κατά της ξηρότητας online", "θεραπεία κατά της ξηρότητας booking",
      "smoothing treatment online", "smoothing treatment booking",
      "ομαλοποίηση μαλλιών online", "ομαλοποίηση μαλλιών booking",
      "hair gloss online", "hair gloss booking", "gloss treatment online",
      "gloss treatment booking",
      
      // Manicure & Pedicure - ΕΠΙΠΛΕΟΝ
      "manicure online", "manicure booking", "manicure appointment", "nail care online",
      "nail care booking", "nail art online", "nail art booking", "nail design online",
      "nail design booking", "gel polish online", "gel polish booking",
      "gel nails online", "gel nails booking", "nail salon online", "nail salon booking",
      "manicure pedicure online", "manicure pedicure booking", "pedicure online",
      "pedicure booking", "foot care online", "foot care booking",
      "nail extension online", "nail extension booking", "nail extensions online",
      "nail extensions booking", "acrylic nails online", "acrylic nails booking",
      "nail polish online", "nail polish booking", "nail painting online",
      "nail painting booking", "nail decoration online", "nail decoration booking",
      
      // Waxing - ΕΠΙΠΛΕΟΝ
      "waxing online", "waxing booking", "waxing appointment", "αποτρίχωση online",
      "αποτρίχωση booking", "αποτρίχωση appointment", "hair removal online",
      "hair removal booking", "waxing salon online", "waxing salon booking",
      "body waxing online", "body waxing booking", "facial waxing online",
      "facial waxing booking", "bikini waxing online", "bikini waxing booking",
      "leg waxing online", "leg waxing booking", "arm waxing online",
      "arm waxing booking", "underarm waxing online", "underarm waxing booking",
      "eyebrow waxing online", "eyebrow waxing booking", "eyebrow shaping online",
      "eyebrow shaping booking", "upper lip waxing online", "upper lip waxing booking",
      "chin waxing online", "chin waxing booking", "brazilian waxing online",
      "brazilian waxing booking", "full body waxing online", "full body waxing booking",
      "sugar waxing online", "sugar waxing booking", "sugar hair removal online",
      "sugar hair removal booking", "hot wax online", "hot wax booking",
      "cold wax online", "cold wax booking", "strip waxing online",
      "strip waxing booking", "hard wax online", "hard wax booking",
      "soft wax online", "soft wax booking",
      
      // Greeklish keywords
      "kommotirio halandri", "kommotirio xalandri", "kommotirio chalandri",
      "gynaikeio koyrema halandri", "gynaikeio koyrema xalandri",
      "alexandra rizou kommotirio", "alexandra rizou koyrema",
      "balayage halandri", "highlights halandri", "xromatismos mallion halandri",
      "hair salon halandri", "women's haircut halandri", "hair salon xalandri",
      
      // Greeklish - ΓΕΝΙΚΑ (ΧΩΡΙΣ ΤΟΠΟΘΕΣΙΑ)
      "kommotirio", "gynaikeio koyrema", "gynaikeio kommotirio", "koyrema",
      "vafi mallion", "xromatismos mallion", "balayage", "highlights", "xailait",
      "therapeia mallion", "manicure", "pedicure", "waxing", "apotrixosi",
      "hair salon", "haircut", "hair color", "hair coloring", "hair treatment",
      "nail salon", "nail care", "hair removal", "beauty salon",
      
      // Λάθος ελληνικά
      "κομμωτηριο", "κομμωτηριό", "κομμωτηριω", "γυναικειο κουρεμα",
      "γυναικείο κουρεμα", "γυναικειο κούρεμα", "κομμωτηριο γυναικειος",
      "κομμωτηριο γυναικείος", "κομμωτηριο γυναικεος",
      "βαφη μαλλιων", "βαφή μαλλιών", "βαφη", "χρωματισμος μαλλιων",
      "χρωματισμός μαλλιών", "χρωματισμος", "μπαλαγιαζ", "μπαλαγιάζ",
      "χαϊλαιτ", "χαϊλάιτ", "θεραπεια μαλλιων", "θεραπεία μαλλιών",
      "θεραπεια", "μανικιουρ", "μανικιούρ", "πεδικιουρ", "πεδικιούρ",
      "ουαξινγκ", "ουάξινγκ", "αποτριχωση", "αποτρίχωση",
      
      // Αγγλικά/μιξ παραλλαγές
      "women's haircut halandri", "best hair salon halandri", "halandri hair salon open",
      "greek hair salon athens", "hair salon for women halandri", "modern hair salon athens",
      "classic women's hair salon halandri", "haircut & color halandri",
      "hair color halandri", "hair treatment halandri", "hair spa halandri",
      "women's hair care halandri", "hair salon athens greece", "hair salon near halandri metro",
      
      // Λάθος πληκτρολόγηση
      "komotirio", "kommotirio halandri", "kommotirio halanri", "kommotirio halanrdi",
      "kommotirio halndri", "kommotirio halandr", "alexandra rizou komotirio",
      "alexandra rizou kommotirio", "gynaikeio koyrema halandri", "balayage halandri"
    ];

    if (currentLang === 'en') {
      return [
        ...baseKeywords,
        "women's haircut Chalandri", "women's hair salon Chalandri", 
        "hair salon Chalandri", "haircut Chalandri", "Alexandra Rizou Chalandri",
        "hair salon Athens", "women's haircut Athens", "hair salon near me",
        "women's hair salon near me", "balayage Chalandri", "highlights Chalandri",
        "hair color Chalandri", "hair treatment Chalandri", "manicure Chalandri",
        "pedicure Chalandri", "waxing Chalandri", "best hair salon Chalandri",
        "best women's haircut Chalandri", "professional hair salon Chalandri",
        "modern hair salon Chalandri", "5 star hair salon Chalandri"
      ];
    }

    return baseKeywords;
  };

  const keywords = getKeywords();

  return (
    <>
      {/* Hidden SEO Keywords - Screen Reader Only */}
      <div className="sr-only" aria-hidden="true">
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
          {keywords.map((keyword, index) => (
            <span key={index} style={{ marginRight: '10px', whiteSpace: 'nowrap' }}>
              {keyword}
            </span>
          ))}
        </div>
      </div>
      
      {/* Additional Hidden SEO Content */}
      <div className="sr-only" aria-hidden="true">
        <h1>Alexandra Rizou Hair-Beauty & Health Services - {pageType === 'home' ? 'Γυναικείο Κούρεμα Χαλάνδρι' : 
          pageType === 'services' ? 'Υπηρεσίες Κομμωτηρίου Χαλάνδρι' :
          pageType === 'contact' ? 'Επικοινωνία Κομμωτηρίου Χαλάνδρι' :
          pageType === 'gallery' ? 'Γκαλερί Κομμωτηρίου Χαλάνδρι' :
          'Σχετικά με το Κομμωτήριο Alexandra Rizou Χαλάνδρι'}</h1>
        <p>
          {keywords.slice(0, 50).join(', ')}
        </p>
      </div>
    </>
  );
}

