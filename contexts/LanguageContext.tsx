import { createContext, useContext, useState, ReactNode } from "react";

type Language = "el" | "en";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};

const translations = {
  el: {
    // Navigation
    "nav.home": "Αρχική",
    "nav.services": "Υπηρεσίες",
    "nav.gallery": "Γκαλερί",
    "nav.about": "Σχετικά",
    "nav.contact": "Επικοινωνία",
    "nav.bookNow": "Κλείστε Ραντεβού",
    
    // Home Page
    "home.hero.title1": "Εκεί που η Ομορφιά",
    "home.hero.title2": "Συναντά την Αριστεία",
    "home.hero.subtitle": "Απολαύστε υπηρεσίες ομορφιάς πολυτελείας σε μια κομψή, χαλαρωτική ατμόσφαιρα. Η ειδική μας ομάδα είναι αφοσιωμένη να σας κάνει να φαίνεστε και να νιώθετε υπέροχα.",
    "home.hero.bookBtn": "Κλείστε το Ραντεβού σας",
    "home.hero.servicesBtn": "Δείτε τις Υπηρεσίες",
    "home.services.title": "Οι Υπηρεσίες Μας",
    "home.services.subtitle": "Από μεταμορφώσεις μαλλιών μέχρι θεραπείες νυχιών, προσφέρουμε ολοκληρωμένη γκάμα υπηρεσιών ομορφιάς.",
    "home.service.hair.title": "Υπηρεσίες Μαλλιών",
    "home.service.hair.desc": "Κουρέματα, styling, χρωματισμός και θεραπείες για όλους τους τύπους μαλλιών.",
    "home.service.nails.title": "Φροντίδα Νυχιών",
    "home.service.nails.desc": "Manicure, pedicure, gel polish και nail art από ειδικούς τεχνικούς.",
    "home.service.waxing.title": "Αποτρίχωση",
    "home.service.waxing.desc": "Επαγγελματικές υπηρεσίες αποτρίχωσης για λείο, όμορφο δέρμα.",
    "home.service.booking.title": "Εύκολη Κράτηση",
    "home.service.booking.desc": "Κλείστε το ραντεβού σας online 24/7 με το βολικό μας σύστημα.",
    "home.service.learnMore": "Μάθετε Περισσότερα →",
    "home.cta.title": "Έτοιμοι να Μεταμορφώσετε την Εμφάνισή σας;",
    "home.cta.subtitle": "Κλείστε το ραντεβού σας σήμερα και ζήστε τη διαφορά Alexandra Rizou. Η ομάδα μας από έμπειρους stylists και επαγγελματίες ομορφιάς είναι έτοιμη να σας βοηθήσει να λάμψετε.",
    "home.cta.btn": "Κλείστε το Ραντεβού σας Τώρα",
    
    // Services Page
    "services.hero.title": "Οι Υπηρεσίες Μας",
    "services.hero.subtitle": "Ανακαλύψτε την πλήρη γκάμα των premium υπηρεσιών ομορφιάς μας, σχεδιασμένες για να σας κάνουν να νιώθετε και να φαίνεστε υπέροχα.",
    "services.hair.title": "Υπηρεσίες Μαλλιών",
    "services.waxing.title": "Αποτρίχωση",
    "services.cta.title": "Έτοιμοι για Κράτηση;",
    "services.cta.subtitle": "Επιλέξτε την υπηρεσία που επιθυμείτε και κλείστε ραντεβού σε μια ώρα που σας εξυπηρετεί. Η επαγγελματική μας ομάδα είναι έτοιμη να σας προσφέρει μια εξαιρετική εμπειρία.",
    "services.cta.btn": "Κλείστε Ραντεβού",
    
    // Gallery Page
    "gallery.hero.title": "Η Γκαλερί μας",
    "gallery.hero.subtitle": "Εξερευνήστε το χαρτοφυλάκιο μας με εκπληκτικές μεταμορφώσεις και δείτε την τέχνη που υπάρχει πίσω από κάθε υπηρεσία που παρέχουμε.",
    "gallery.empty": "Δεν υπάρχουν ακόμα φωτογραφίες σε αυτή την κατηγορία.",
    "gallery.instagram.title": "Ακολουθήστε μας στο Instagram",
    "gallery.instagram.subtitle": "Μείνετε ενημερωμένοι με την τελευταία μας δουλειά, συμβουλές ομορφιάς και αποκλειστικές προσφορές. Ακολουθήστε @alexandrarizou για καθημερινή έμπνευση!",
    "gallery.instagram.handle": "@alexandrarizou",
    
    // About Page
    "about.hero.title": "Σχετικά με την Alexandra Rizou",
    "about.hero.subtitle": "Περισσότερα από ένα κομμωτήριο – είμαστε οι συνεργάτες σας στην ομορφιά, την αυτοπεποίθηση και την έκφραση του εαυτού σας.",
    "about.story.title": "Η Ιστορία μας",
    "about.story.p1": "Το Alexandra Rizou - Hair Beauty & Health Services ιδρύθηκε το 2015 με ένα απλό όραμα: να δημιουργήσει έναν φιλόξενο χώρο όπου η ομορφιά συναντά την αριστεία. Αυτό που ξεκίνησε ως ένα μικρό boutique salon έχει εξελιχθεί σε έναν αγαπημένο προορισμό για όσους αναζητούν premium υπηρεσίες μαλλιών και ομορφιάς.",
    "about.story.p2": "Η ομάδα μας από έμπειρους επαγγελματίες είναι αφοσιωμένη να κάνει κάθε επίσκεψη ξεχωριστή. Πιστεύουμε ότι η ομορφιά είναι προσωπική και αφιερώνουμε χρόνο να κατανοήσουμε το μοναδικό σας στυλ και τις προτιμήσεις σας. Είτε είστε εδώ για μια γρήγορη ανανέωση είτε για μια πλήρη μεταμόρφωση, δεσμευόμαστε να σας βοηθήσουμε να φαίνεστε και να νιώθετε στο καλύτερό σας.",
    "about.values.title": "Οι Αξίες μας",
    "about.values.subtitle": "Αυτές οι βασικές αρχές καθοδηγούν όλα όσα κάνουμε στο Alexandra Rizou.",
    "about.value.excellence.title": "Αριστεία",
    "about.value.excellence.desc": "Δεσμευόμαστε να παρέχουμε υπηρεσίες υψηλότερης ποιότητας χρησιμοποιώντας premium προϊόντα.",
    "about.value.passion.title": "Πάθος",
    "about.value.passion.desc": "Η ομάδα μας αγαπά αυτό που κάνει και φαίνεται σε κάθε υπηρεσία που παρέχουμε.",
    "about.value.community.title": "Κοινότητα",
    "about.value.community.desc": "Η δημιουργία διαρκών σχέσεων με τους πελάτες μας είναι στην καρδιά όλων όσων κάνουμε.",
    "about.value.innovation.title": "Καινοτομία",
    "about.value.innovation.desc": "Παραμένουμε μπροστά από τις τάσεις και ενημερώνουμε συνεχώς τις δεξιότητες και τις τεχνικές μας.",
    "about.team.title": "Γνωρίστε την Ομάδα μας",
    "about.team.subtitle": "Η ταλαντούχα ομάδα μας από επαγγελματίες ομορφιάς είναι εδώ για να σας βοηθήσει να επιτύχετε την τέλεια εμφάνιση.",
    
    // Contact Page
    "contact.hero.title": "Επικοινωνήστε",
    "contact.hero.subtitle": "Έχετε ερωτήσεις ή θέλετε να κλείσετε ραντεβού; Θα χαρούμε να σας ακούσουμε.",
    "contact.info.title": "Στοιχεία Επικοινωνίας",
    "contact.info.subtitle": "Επικοινωνήστε μαζί μας μέσω οποιουδήποτε από αυτά τα κανάλια. Είμαστε εδώ για να βοηθήσουμε!",
    "contact.visit.title": "Επισκεφθείτε μας",
    "contact.call.title": "Τηλεφωνήστε μας",
    "contact.email.title": "Στείλτε Email",
    "contact.hours.title": "Ωράριο Λειτουργίας",
    "contact.hours.monday": "Δευτέρα: Κλειστά",
    "contact.hours.tuesday": "Τρίτη: 10:00 - 20:00",
    "contact.hours.wednesday": "Τετάρτη: 10:00 - 16:00",
    "contact.hours.thursday": "Πέμπτη: 10:00 - 20:00",
    "contact.hours.friday": "Παρασκευή: 10:00 - 20:00",
    "contact.hours.saturday": "Σάββατο: 10:00 - 16:00",
    "contact.hours.sunday": "Κυριακή: Κλειστά",
    "contact.form.title": "Στείλτε μας Μήνυμα",
    "contact.form.name": "Το Όνομά σας *",
    "contact.form.namePlaceholder": "Γιάννης Παπαδόπουλος",
    "contact.form.email": "Email *",
    "contact.form.emailPlaceholder": "giannis@example.com",
    "contact.form.phone": "Τηλέφωνο",
    "contact.form.phonePlaceholder": "+30 210 123 4567",
    "contact.form.message": "Μήνυμα *",
    "contact.form.messagePlaceholder": "Πείτε μας πως μπορούμε να σας βοηθήσουμε...",
    "contact.form.submit": "Αποστολή Μηνύματος",
    "contact.form.success.title": "Το Μήνυμα Στάλθηκε!",
    "contact.form.success.desc": "Θα επικοινωνήσουμε μαζί σας το συντομότερο δυνατόν.",
    "contact.info.section.title": "Πληροφορίες Κράτησης",
    "contact.info.cancellation": "Πολιτική Ακύρωσης: Παρακαλούμε ενημερώστε μας τουλάχιστον 24 ώρες νωρίτερα αν χρειάζεται να ακυρώσετε ή να αλλάξετε το ραντεβού σας.",
    "contact.info.late": "Καθυστερημένες Αφίξεις: Σας παρακαλούμε να φτάσετε 10 λεπτά πριν το ραντεβού σας. Οι καθυστερημένες αφίξεις μπορεί να οδηγήσουν σε μειωμένο χρόνο εξυπηρέτησης.",
    "contact.info.payment": "Πληρωμή: Δεχόμαστε μετρητά, πιστωτικές κάρτες και ψηφιακές πληρωμές. Η πληρωμή γίνεται κατά την παροχή της υπηρεσίας.",
    
    // Booking Page
    "booking.hero.title": "Κλείστε το Ραντεβού σας",
    "booking.hero.subtitle": "Επιλέξτε την υπηρεσία, ημερομηνία και ώρα που προτιμάτε. Εμείς θα αναλάβουμε τα υπόλοιπα!",
    "booking.calendar.title": "Επιλέξτε Ημερομηνία & Ώρα",
    "booking.service.label": "Υπηρεσία *",
    "booking.service.placeholder": "Επιλέξτε υπηρεσία",
    "booking.time.label": "Ώρα *",
    "booking.time.placeholder": "Επιλέξτε ώρα",
    "booking.info.title": "Τα Στοιχεία σας",
    "booking.name.label": "Ονοματεπώνυμο *",
    "booking.name.placeholder": "Μαρία Παπαδοπούλου",
    "booking.email.label": "Email *",
    "booking.email.placeholder": "maria@example.com",
    "booking.phone.label": "Τηλέφωνο *",
    "booking.phone.placeholder": "+30 210 123 4567",
    "booking.submit": "Επιβεβαίωση Ραντεβού",
    "booking.disclaimer": "Κλείνοντας ραντεβού, συμφωνείτε να λαμβάνετε επιβεβαιώσεις και υπενθυμίσεις μέσω email και SMS.",
    "booking.info.section.title": "Πληροφορίες Κράτησης",
    "booking.success.title": "Το Ραντεβού Κλείστηκε!",
    "booking.error.title": "Ελλιπείς Πληροφορίες",
    "booking.error.desc": "Παρακαλώ συμπληρώστε όλα τα απαιτούμενα πεδία.",
    
    // Services
    "service.hairstyling": "Κτένισμα",
    "service.womenscut": "Κούρεμα Γυναικείο",
    "service.menscut": "Κούρεμα Ανδρικό",
    "service.kidscut": "Κούρεμα Παιδικό",
    "service.treatment": "Θεραπεία",
    "service.rootcolor": "Βαφή Ρίζα/Κοντά",
    "service.fullcolor": "Βαφή Ολο",
    "service.highlights": "Ανταύγειες",
    "service.balayage": "Μπαλαγιάζ",
    "service.bleach": "Ντεκάπας",
    "service.toner": "Ρεφλέ",
    "service.ombre": "Ρανσάζ",
    "service.waxing": "Αποτρίχωση Άνω Χείλος/Φρύδια",
    
    // Chatbot
    "chatbot.title": "Βοηθός Alexandra Rizou",
    "chatbot.placeholder": "Ρωτήστε μας οτιδήποτε...",
    "chatbot.welcome": "Γεια σας! Πώς μπορώ να σας βοηθήσω σήμερα;",
    "chatbot.button.open": "Ρωτήστε μας",
    "chatbot.button.close": "Κλείσιμο",
    
    // Footer
    "footer.brand.desc": "Ο προορισμός σας για premium υπηρεσίες μαλλιών και ομορφιάς. Όπου η κομψότητα συναντά την εμπειρία.",
    "footer.quicklinks": "Γρήγοροι Σύνδεσμοι",
    "footer.services": "Υπηρεσίες",
    "footer.gallery": "Γκαλερί",
    "footer.about": "Σχετικά",
    "footer.booking": "Κλείστε Ραντεβού",
    "footer.services.list": "Υπηρεσίες",
    "footer.services.hair": "Styling & Χρωματισμός Μαλλιών",
    "footer.services.nails": "Manicure & Pedicure",
    "footer.services.waxing": "Υπηρεσίες Αποτρίχωσης",
    "footer.services.facial": "Θεραπείες Προσώπου",
    "footer.contact": "Επικοινωνήστε μαζί μας",
    "footer.rights": "Όλα τα δικαιώματα διατηρούνται.",
    "footer.privacy": "Πολιτική Απορρήτου",
    "footer.terms": "Όροι Χρήσης",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.gallery": "Gallery",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.bookNow": "Book Now",
    
    // Home Page
    "home.hero.title1": "Where Beauty",
    "home.hero.title2": "Meets Excellence",
    "home.hero.subtitle": "Experience luxury beauty services in an elegant, relaxing atmosphere. Our expert team is dedicated to making you look and feel your absolute best.",
    "home.hero.bookBtn": "Book Your Appointment",
    "home.hero.servicesBtn": "View Services",
    "home.services.title": "Our Services",
    "home.services.subtitle": "From hair transformations to pampering nail treatments, we offer a complete range of beauty services.",
    "home.service.hair.title": "Hair Services",
    "home.service.hair.desc": "Expert cuts, styling, coloring, and treatments for all hair types.",
    "home.service.nails.title": "Nail Care",
    "home.service.nails.desc": "Manicures, pedicures, gel polish, and nail art by skilled technicians.",
    "home.service.waxing.title": "Waxing",
    "home.service.waxing.desc": "Professional waxing services for smooth, beautiful skin.",
    "home.service.booking.title": "Easy Booking",
    "home.service.booking.desc": "Book your appointment online 24/7 with our convenient system.",
    "home.service.learnMore": "Learn More →",
    "home.cta.title": "Ready to Transform Your Look?",
    "home.cta.subtitle": "Book your appointment today and experience the Alexandra Rizou difference. Our team of expert stylists and beauty professionals is ready to help you shine.",
    "home.cta.btn": "Book Your Appointment Now",
    
    // Services Page
    "services.hero.title": "Our Services",
    "services.hero.subtitle": "Discover our complete range of premium beauty services, designed to make you feel and look amazing.",
    "services.hair.title": "Hair Services",
    "services.waxing.title": "Waxing",
    "services.cta.title": "Ready to Book?",
    "services.cta.subtitle": "Choose your desired service and book an appointment at a time that works for you. Our professional team is ready to provide you with an exceptional experience.",
    "services.cta.btn": "Book Appointment",
    
    // Gallery Page
    "gallery.hero.title": "Our Gallery",
    "gallery.hero.subtitle": "Explore our portfolio of stunning transformations and see the artistry that goes into every service we provide.",
    "gallery.empty": "No photos in this category yet.",
    "gallery.instagram.title": "Follow Us on Instagram",
    "gallery.instagram.subtitle": "Stay updated with our latest work, beauty tips, and exclusive offers. Follow @alexandrarizou for daily inspiration!",
    "gallery.instagram.handle": "@alexandrarizou",
    
    // About Page
    "about.hero.title": "About Alexandra Rizou",
    "about.hero.subtitle": "More than just a salon – we're your partners in beauty, confidence, and self-expression.",
    "about.story.title": "Our Story",
    "about.story.p1": "Alexandra Rizou - Hair Beauty & Health Services was founded in 2015 with a simple vision: to create a welcoming space where beauty meets excellence. What started as a small boutique salon has grown into a beloved destination for those seeking premium hair and beauty services.",
    "about.story.p2": "Our team of experienced professionals is dedicated to making every visit special. We believe that beauty is personal, and we take the time to understand your unique style and preferences. Whether you're here for a quick refresh or a complete transformation, we're committed to helping you look and feel your best.",
    "about.values.title": "Our Values",
    "about.values.subtitle": "These core principles guide everything we do at Alexandra Rizou.",
    "about.value.excellence.title": "Excellence",
    "about.value.excellence.desc": "We're committed to delivering the highest quality services using premium products.",
    "about.value.passion.title": "Passion",
    "about.value.passion.desc": "Our team loves what they do, and it shows in every service we provide.",
    "about.value.community.title": "Community",
    "about.value.community.desc": "Building lasting relationships with our clients is at the heart of everything we do.",
    "about.value.innovation.title": "Innovation",
    "about.value.innovation.desc": "We stay ahead of trends and continuously update our skills and techniques.",
    "about.team.title": "Meet Our Team",
    "about.team.subtitle": "Our talented team of beauty professionals is here to help you achieve your perfect look.",
    
    // Contact Page
    "contact.hero.title": "Get In Touch",
    "contact.hero.subtitle": "Have questions or want to book an appointment? We'd love to hear from you.",
    "contact.info.title": "Contact Information",
    "contact.info.subtitle": "Reach out to us through any of these channels. We're here to help!",
    "contact.visit.title": "Visit Us",
    "contact.call.title": "Call Us",
    "contact.email.title": "Email Us",
    "contact.hours.title": "Opening Hours",
    "contact.hours.monday": "Monday: Closed",
    "contact.hours.tuesday": "Tuesday: 10:00 AM - 8:00 PM",
    "contact.hours.wednesday": "Wednesday: 10:00 AM - 4:00 PM",
    "contact.hours.thursday": "Thursday: 10:00 AM - 8:00 PM",
    "contact.hours.friday": "Friday: 10:00 AM - 8:00 PM",
    "contact.hours.saturday": "Saturday: 10:00 AM - 4:00 PM",
    "contact.hours.sunday": "Sunday: Closed",
    "contact.form.title": "Send Us a Message",
    "contact.form.name": "Your Name *",
    "contact.form.namePlaceholder": "John Doe",
    "contact.form.email": "Email Address *",
    "contact.form.emailPlaceholder": "john@example.com",
    "contact.form.phone": "Phone Number",
    "contact.form.phonePlaceholder": "+1 (555) 123-4567",
    "contact.form.message": "Message *",
    "contact.form.messagePlaceholder": "Tell us how we can help you...",
    "contact.form.submit": "Send Message",
    "contact.form.success.title": "Message Sent!",
    "contact.form.success.desc": "We'll get back to you as soon as possible.",
    "contact.info.section.title": "Booking Information",
    "contact.info.cancellation": "Cancellation Policy: Please notify us at least 24 hours in advance if you need to cancel or reschedule your appointment.",
    "contact.info.late": "Late Arrivals: We kindly ask that you arrive 10 minutes before your appointment. Late arrivals may result in reduced service time.",
    "contact.info.payment": "Payment: We accept cash, credit cards, and digital payments. Payment is due at the time of service.",
    
    // Booking Page
    "booking.hero.title": "Book Your Appointment",
    "booking.hero.subtitle": "Select your preferred service, date, and time. We'll take care of the rest!",
    "booking.calendar.title": "Select Date & Time",
    "booking.service.label": "Service *",
    "booking.service.placeholder": "Choose a service",
    "booking.time.label": "Time Slot *",
    "booking.time.placeholder": "Select a time",
    "booking.info.title": "Your Information",
    "booking.name.label": "Full Name *",
    "booking.name.placeholder": "Jane Doe",
    "booking.email.label": "Email Address *",
    "booking.email.placeholder": "jane@example.com",
    "booking.phone.label": "Phone Number *",
    "booking.phone.placeholder": "+1 (555) 123-4567",
    "booking.submit": "Confirm Appointment",
    "booking.disclaimer": "By booking, you agree to receive appointment confirmations and reminders via email and SMS.",
    "booking.info.section.title": "Booking Information",
    "booking.success.title": "Appointment Booked!",
    "booking.error.title": "Incomplete Information",
    "booking.error.desc": "Please fill in all required fields.",
    
    // Services
    "service.hairstyling": "Hair Styling",
    "service.womenscut": "Women's Haircut",
    "service.menscut": "Men's Haircut",
    "service.kidscut": "Kids Haircut",
    "service.treatment": "Hair Treatment",
    "service.rootcolor": "Root/Short Color",
    "service.fullcolor": "Full Color",
    "service.highlights": "Highlights",
    "service.balayage": "Balayage",
    "service.bleach": "Bleaching",
    "service.toner": "Toner",
    "service.ombre": "Ombre",
    "service.waxing": "Upper Lip/Eyebrow Waxing",
    
    // Chatbot
    "chatbot.title": "Alexandra Rizou Assistant",
    "chatbot.placeholder": "Ask us anything...",
    "chatbot.welcome": "Hello! How can I help you today?",
    "chatbot.button.open": "Ask us",
    "chatbot.button.close": "Close",
    
    // Footer
    "footer.brand.desc": "Your destination for premium hair and beauty services. Where elegance meets expertise.",
    "footer.quicklinks": "Quick Links",
    "footer.services": "Services",
    "footer.gallery": "Gallery",
    "footer.about": "About Us",
    "footer.booking": "Book Appointment",
    "footer.services.list": "Services",
    "footer.services.hair": "Hair Styling & Coloring",
    "footer.services.nails": "Manicure & Pedicure",
    "footer.services.waxing": "Waxing Services",
    "footer.services.facial": "Facial Treatments",
    "footer.contact": "Contact Us",
    "footer.rights": "All rights reserved.",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("el");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "el" ? "en" : "el"));
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.el] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
