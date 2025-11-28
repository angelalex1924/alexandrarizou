"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getLocalizedPath, getBasePath, detectLocaleFromPath } from "@/lib/i18n-routes";

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
    "nav.home.subtitle": "Κεντρική Σελίδα",
    "nav.home.action": "πηγαίνετε",
    "nav.services": "Υπηρεσίες",
    "nav.services.subtitle": "Οι Υπηρεσίες μας",
    "nav.services.action": "δείτε",
    "nav.gallery": "Γκαλερί",
    "nav.gallery.subtitle": "Δείτε το Έργο μας",
    "nav.gallery.action": "μπείτε",
    "nav.about": "Σχετικά",
    "nav.about.subtitle": "Γνωρίστε μας",
    "nav.about.action": "διαβάστε",
    "nav.contact": "Επικοινωνία",
    "nav.contact.subtitle": "Επικοινωνήστε μαζί μας",
    "nav.contact.action": "ελάτε",
    "nav.bookNow": "Κλείστε Ραντεβού",
    "comingSoon": "Έρχεται σύντομα!",
    
    // Home Page
    "home.hero.title1": "Εκεί που η Ομορφιά",
    "home.hero.title2": "Συναντά την Αριστεία",
    "home.hero.subtitle": "Εδώ, η περιποίηση είναι προσωπική. Κάθε κούρεμα, κάθε θεραπεία, κάθε στιγμή είναι για εσάς. Σας ακούμε, καταλαβαίνουμε τι θέλετε και δημιουργούμε μαζί σας το look που σας ταιριάζει. Γιατί η ομορφιά ξεκινάει όταν νιώθετε εσείς καλά.",
    "home.hero.bookBtn": "Κλείστε το Ραντεβού σας",
    "home.hero.servicesBtn": "Δείτε τις Υπηρεσίες",
    "home.hero.awards": "Βραβεύσεις",
    "home.services.title": "Οι Υπηρεσίες Μας",
    "home.services.subtitle": "Από μεταμορφώσεις μαλλιών μέχρι θεραπείες νυχιών, προσφέρουμε ολοκληρωμένη γκάμα υπηρεσιών ομορφιάς.",
    "home.service.hair.title": "Υπηρεσίες Μαλλιών",
    "home.service.hair.desc": "Εξειδικευμένο γυναικείο κούρεμα στο Χαλάνδρι, styling, χρωματισμός μαλλιών, balayage, highlights και θεραπείες για όλους τους τύπους μαλλιών.",
    "home.service.nails.title": "Φροντίδα Νυχιών",
    "home.service.nails.desc": "Manicure και pedicure στο Χαλάνδρι, gel polish και nail art από ειδικούς τεχνικούς.",
    "home.service.waxing.title": "Αποτρίχωση",
    "home.service.waxing.desc": "Επαγγελματικές υπηρεσίες αποτρίχωσης στο Χαλάνδρι για λείο, όμορφο δέρμα.",
    "home.service.booking.title": "Εύκολη Κράτηση",
    "home.service.booking.desc": "Κλείστε το ραντεβού σας online 24/7 με το βολικό μας σύστημα.",
    "home.service.learnMore": "Μάθετε Περισσότερα →",
    "home.cta.title": "Έτοιμοι να Μεταμορφώσετε την Εμφάνισή σας;",
    "home.cta.subtitle": "Ανακαλύψτε την τέχνη της ομορφιάς με προσωποποιημένες υπηρεσίες που αναδεικνύουν το μοναδικό σας στυλ. Η εμπειρία μας και η προσοχή στη λεπτομέρεια είναι εδώ για εσάς.",
    "home.cta.btn": "Κλείστε το Ραντεβού σας Τώρα",
    "home.cta.phone": "Κλείστε Ραντεβού Τηλεφωνικά",
    "home.choose.badge": "Γιατί εμάς",
    "home.choose.title": "Επιλέξτε εμπειρία & φροντίδα",
    "home.choose.subtitle": "Το καλύτερο γυναικείο κομμωτήριο στο Χαλάνδρι. Συνδυάζουμε τεχνική αρτιότητα, σύγχρονη αισθητική και αυθεντική φιλοξενία για να ζήσετε μια εμπειρία ομορφιάς που διαρκεί.",
    "home.choose.signature.title": "Signature Styling",
    "home.choose.signature.desc": "Προσωποποιημένες τεχνικές χρωματισμού και styling που αναδεικνύουν το φυσικό σας στυλ.",
    "home.choose.tailored.title": "Εξατομικευμένες συνεδρίες",
    "home.choose.tailored.desc": "Ξεκινάμε κάθε υπηρεσία με διάγνωση αναγκών για να δημιουργήσουμε το ιδανικό πλάνο περιποίησης.",
    "home.choose.clean.title": "Premium υγεία & καθαριότητα",
    "home.choose.clean.desc": "Προϊόντα υψηλής ποιότητας, αποστείρωση εργαλείων και αυστηρά πρότυπα υγιεινής.",
    "home.choose.community.title": "Ζεστή κοινότητα",
    "home.choose.community.desc": "Μια ομάδα που σας γνωρίζει με το μικρό σας όνομα και φροντίζει για κάθε λεπτομέρεια.",
    "home.choose.stats.clients": "Επαναλαμβανόμενοι πελάτες",
    "home.choose.stats.reviews": "Κριτικές 5 αστέρων",
    "home.choose.stats.experience": "Χρόνια εμπιστοσύνης",
    "home.choose.cta.title": "Θέλετε να ζήσετε την εμπειρία;",
    "home.choose.cta.subtitle": "Κλείστε μια προσωπική συνάντηση ή περάστε από τον χώρο μας για μια γρήγορη ξενάγηση.",
    "home.choose.cta.primary": "Κλείστε επικοινωνία",
    "home.choose.cta.secondary": "Δείτε τη γκαλερί μας",
    
    // Services Page
    "services.hero.title": "Οι Υπηρεσίες Μας",
    "services.hero.subtitle": "Ανακαλύψτε την πλήρη γκάμα των υπηρεσιών ομορφιάς μας. Κάθε υπηρεσία είναι σχεδιασμένη για να σας κάνει να νιώθετε και να φαίνεστε υπέροχα.",
    "services.hair.title": "Υπηρεσίες Μαλλιών",
    "services.waxing.title": "Αποτρίχωση",
    "services.cta.title": "Έτοιμοι για Κράτηση;",
    "services.cta.subtitle": "Επιλέξτε την υπηρεσία που επιθυμείτε και κλείστε ραντεβού σε μια ώρα που σας εξυπηρετεί. Η επαγγελματική μας ομάδα είναι έτοιμη να σας προσφέρει μια εξαιρετική εμπειρία.",
    "services.cta.btn": "Κλείστε Ραντεβού",
    
    // Gallery Page
    "gallery.hero.title": "Η Γκαλερί μας",
    "gallery.hero.subtitle": "Εξερευνήστε το χαρτοφυλάκιο μας με εκπληκτικές μεταμορφώσεις και δείτε την τέχνη που υπάρχει πίσω από κάθε υπηρεσία που παρέχουμε.",
    "gallery.empty": "Δεν υπάρχουν ακόμα φωτογραφίες σε αυτή την κατηγορία.",
    "gallery.category.our_space": "Ο Χώρος μας",
    "gallery.category.before_after": "Πριν & Μετά",
    "gallery.category.hair_creations": "Δημιουργίες Μαλλιών",
    "gallery.category.nails_beauty": "Νύχια & Ομορφιά",
    "gallery.category.team_moments": "Στιγμές Ομάδας",
    "gallery.section.our_space.title": "Ο Χώρος μας",
    "gallery.section.our_space.desc": "Κάντε μια εικονική περιήγηση στο όμορφο εσωτερικό και την ατμόσφαιρα του κομμωτηρίου μας",
    "gallery.section.before_after.title": "Πριν & Μετά",
    "gallery.section.before_after.desc": "Δείτε τις εκπληκτικές μεταμορφώσεις που δημιουργούμε για τους πελάτες μας",
    "gallery.section.hair_creations.title": "Δημιουργίες Μαλλιών",
    "gallery.section.hair_creations.desc": "Εξερευνήστε το χαρτοφυλάκιο μας με χτενίσματα, τεχνικές βαφής και θεραπείες",
    "gallery.section.nails_beauty.title": "Νύχια & Ομορφιά",
    "gallery.section.nails_beauty.desc": "Ανακαλύψτε τις υπηρεσίες μας για μανικιούρ, πεντικιούρ και θεραπείες ομορφιάς",
    "gallery.section.team_moments.title": "Στιγμές Ομάδας",
    "gallery.section.team_moments.desc": "Γνωρίστε την ταλαντούχα ομάδα μας και δείτε μας σε δράση",
    "gallery.before": "Πριν",
    "gallery.after": "Μετά",
    "gallery.all": "Όλα",
    "gallery.instagram.title": "Ακολουθήστε μας στο Instagram",
    "gallery.instagram.subtitle": "Μείνετε ενημερωμένοι με την τελευταία μας δουλειά, συμβουλές ομορφιάς και αποκλειστικές προσφορές. Ακολουθήστε @alexandrarizou για καθημερινή έμπνευση!",
    "gallery.instagram.handle": "@alexandrarizou",
    
    // About Page
    "about.hero.title": "Σχετικά με εμάς",
    "about.hero.subtitle": "Περισσότερα από ένα κομμωτήριο – είμαστε οι συνεργάτες σας στην ομορφιά, την αυτοπεποίθηση και την έκφραση του εαυτού σας.",
    "about.story.title": "Η Ιστορία μας",
    "about.story.p1": "Το Alexandra Rizou - Hair Beauty & Health Services ιδρύθηκε το 2022 με ένα απλό όραμα: να δημιουργήσει έναν φιλόξενο χώρο όπου η ομορφιά συναντά την αριστεία. Αυτό που ξεκίνησε ως ένα μικρό boutique salon έχει εξελιχθεί σε έναν αγαπημένο προορισμό για όσους αναζητούν premium υπηρεσίες μαλλιών και ομορφιάς.",
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
    "contact.hero.title": "Επικοινωνήστε με εμάς",
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
    "contact.form.subject": "Θέμα *",
    "contact.form.subjectPlaceholder": "Επιλέξτε θέμα",
    "contact.form.subject.appointment": "Κλείσιμο Ραντεβού",
    "contact.form.subject.services": "Ερώτηση για Υπηρεσίες",
    "contact.form.subject.pricing": "Ερώτηση για Τιμές",
    "contact.form.subject.hours": "Ερώτηση για Ωράριο",
    "contact.form.subject.location": "Ερώτηση για Τοποθεσία",
    "contact.form.subject.complaint": "Παράπονο",
    "contact.form.subject.compliment": "Επαίνος",
    "contact.form.subject.other": "Άλλο",
    "contact.form.message": "Μήνυμα *",
    "contact.form.messagePlaceholder": "Πείτε μας πως μπορούμε να σας βοηθήσουμε...",
    "contact.form.submit": "Αποστολή Μηνύματος",
    "contact.form.success.title": "Το Μήνυμα Στάλθηκε!",
    "contact.form.success.desc": "Θα επικοινωνήσουμε μαζί σας το συντομότερο δυνατόν.",
    "contact.map.title": "Η Τοποθεσία μας",
    "contact.map.subtitle": "Ελάτε να μας επισκεφτείτε στο σαλόνι μας",
    "contact.form.subtitle": "Συμπληρώστε τη φόρμα παρακάτω και θα επικοινωνήσουμε μαζί σας σύντομα.",
    "contact.info.section.title": "Πληροφορίες Κράτησης",
    "contact.info.cancellation": "Πολιτική Ακύρωσης: Παρακαλούμε ενημερώστε μας τουλάχιστον 24 ώρες νωρίτερα αν χρειάζεται να ακυρώσετε ή να αλλάξετε το ραντεβού σας.",
    "contact.info.late": "Καθυστερημένες Αφίξεις: Σας παρακαλούμε να φτάσετε 10 λεπτά πριν το ραντεβού σας. Οι καθυστερημένες αφίξεις μπορεί να οδηγήσουν σε μειωμένο χρόνο εξυπηρέτησης.",
    "contact.info.payment": "Πληρωμή: Δεχόμαστε μετρητά, πιστωτικές κάρτες και ψηφιακές πληρωμές. Η πληρωμή γίνεται κατά την παροχή της υπηρεσίας.",
    
    // 404 Page
    "404.title": "Η Σελίδα Δεν Βρέθηκε",
    "404.description": "Λυπάμαι, αλλά η σελίδα που αναζητάτε δεν υπάρχει ή έχει μετακινηθεί. Επιστρέψτε στην αρχική σελίδα για να συνεχίσετε.",
    "404.homeButton": "Επιστροφή στην Αρχική",
    "404.backButton": "Πίσω",
    "404.quickLinks": "Γρήγοροι Σύνδεσμοι:",
    
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
    
    // Privacy Policy
    "privacy.title": "Πολιτική Απορρήτου",
    "privacy.subtitle": "Η προστασία των προσωπικών σας δεδομένων είναι προτεραιότητα για εμάς.",
    "privacy.lastUpdated": "Τελευταία ενημέρωση: Ιανουάριος 2025",
    "privacy.compliance": "Συμμόρφωση με GDPR",
    "privacy.navigation.tableOfContents": "Περιεχόμενα",
    "privacy.navigation.currentSection": "Τρέχουσα ενότητα",
    "privacy.navigation.progress": "Πρόοδος ανάγνωσης",
    "privacy.importantNotice": "Σημαντική Ειδοποίηση",
    "privacy.importantText": "Η πολιτική απορρήτου μας εξηγεί πώς συλλέγουμε, χρησιμοποιούμε και προστατεύουμε τα προσωπικά σας δεδομένα.",
    "privacy.contact": "Επικοινωνία",
    "privacy.contactText": "Για οποιαδήποτε ερώτηση σχετικά με την πολιτική απορρήτου μας, επικοινωνήστε μαζί μας:",
    "privacy.introduction.title": "Εισαγωγή",
    "privacy.introduction.summary": "Καλώς ήρθατε στην Πολιτική Απορρήτου μας",
    "privacy.introduction.content": "Η Alexandra Rizou Hair Beauty & Health Services (εφεξής «εμείς», «μας», «μας») σέβεται την ιδιωτικότητά σας και δεσμεύεται να προστατεύει τα προσωπικά σας δεδομένα. Αυτή η πολιτική απορρήτου εξηγεί πώς συλλέγουμε, χρησιμοποιούμε, αποθηκεύουμε και προστατεύουμε τα προσωπικά σας δεδομένα όταν επισκέπτεστε τον ιστότοπό μας ή χρησιμοποιείτε τις υπηρεσίες μας.",
    "privacy.introduction.legal": "GDPR & Νόμος 4624/2019",
    "privacy.dataCollection.title": "Συλλογή Δεδομένων",
    "privacy.dataCollection.summary": "Ποια δεδομένα συλλέγουμε",
    "privacy.dataCollection.content": "Συλλέγουμε τα ακόλουθα τύπους προσωπικών δεδομένων: • Όνομα και επωνυμία • Διεύθυνση email • Αριθμός τηλεφώνου • Διεύθυνση • Πληροφορίες ραντεβού • Προτιμήσεις υπηρεσιών",
    "privacy.dataCollection.legal": "Άρθρο 6 GDPR",
    "privacy.dataUsage.title": "Χρήση Δεδομένων",
    "privacy.dataUsage.summary": "Πώς χρησιμοποιούμε τα δεδομένα σας",
    "privacy.dataUsage.content": "Χρησιμοποιούμε τα προσωπικά σας δεδομένα για: • Παροχή και βελτίωση των υπηρεσιών μας • Επικοινωνία μαζί σας σχετικά με ραντεβού • Αποστολή ενημερώσεων και προσφορών • Συμμόρφωση με νομικές υποχρεώσεις",
    "privacy.dataUsage.legal": "Άρθρο 5 GDPR",
    "privacy.dataSharing.title": "Κοινοποίηση Δεδομένων",
    "privacy.dataSharing.summary": "Με ποιους μοιραζόμαστε τα δεδομένα",
    "privacy.dataSharing.content": "Δεν πουλάμε τα προσωπικά σας δεδομένα. Μπορούμε να κοινοποιήσουμε τα δεδομένα σας μόνο με: • Πάροχους υπηρεσιών που μας βοηθούν να λειτουργήσουμε (π.χ. hosting, email) • Όταν απαιτείται από το νόμο",
    "privacy.dataSharing.legal": "Άρθρο 26 GDPR",
    "privacy.dataRights.title": "Δικαιώματα σας",
    "privacy.dataRights.summary": "Τα δικαιώματά σας βάσει GDPR",
    "privacy.dataRights.content": "Έχετε το δικαίωμα να: • Ζητήσετε πρόσβαση στα προσωπικά σας δεδομένα • Ζητήσετε διόρθωση ανακριβών δεδομένων • Ζητήσετε διαγραφή των δεδομένων σας • Αντιταχθείτε στην επεξεργασία • Ζητήσετε περιορισμό της επεξεργασίας • Ζητήσετε φορητότητα δεδομένων",
    "privacy.dataRights.legal": "Κεφάλαιο III GDPR",
    "privacy.dataSecurity.title": "Ασφάλεια Δεδομένων",
    "privacy.dataSecurity.summary": "Πώς προστατεύουμε τα δεδομένα σας",
    "privacy.dataSecurity.content": "Χρησιμοποιούμε κατάλληλα τεχνικά και οργανωτικά μέτρα για να προστατέψουμε τα προσωπικά σας δεδομένα, συμπεριλαμβανομένων: • Κρυπτογράφησης • Πρόσβασης με κωδικό • Κανονικών ελέγχων ασφαλείας",
    "privacy.dataSecurity.legal": "Άρθρο 32 GDPR",
    "privacy.dataRetention.title": "Διατήρηση Δεδομένων",
    "privacy.dataRetention.summary": "Πόσο διατηρούμε τα δεδομένα",
    "privacy.dataRetention.content": "Διατηρούμε τα προσωπικά σας δεδομένα μόνο για όσο χρόνο είναι απαραίτητο για τους σκοπούς που συλλέχθηκαν, εκτός εάν ο νόμος απαιτεί διατήρηση για μεγαλύτερη περίοδο.",
    "privacy.dataRetention.legal": "Άρθρο 5(1)(e) GDPR",
    "privacy.cookies.title": "Cookies",
    "privacy.cookies.summary": "Χρήση cookies στον ιστότοπό μας",
    "privacy.cookies.content": "Ο ιστότοπός μας χρησιμοποιεί cookies για να βελτιώσει την εμπειρία σας. Μπορείτε να διαχειριστείτε τις προτιμήσεις cookies σας από τις ρυθμίσεις του περιηγητή σας.",
    "privacy.cookies.legal": "Ευρωπαϊκή Οδηγία Cookies",
    "privacy.contact.title": "Επικοινωνία",
    "privacy.contact.summary": "Επικοινωνήστε μαζί μας",
    "privacy.contact.content": "Για οποιαδήποτε ερώτηση σχετικά με την πολιτική απορρήτου μας, μπορείτε να επικοινωνήσετε μαζί μας στο: ar.hairbeauty.healthservices@gmail.com ή στο τηλέφωνο +3021 0681 8011.",
    "privacy.contact.legal": "Άρθρο 77 GDPR",
    "privacy.modifications.title": "Τροποποιήσεις",
    "privacy.modifications.summary": "Αλλαγές στην πολιτική",
    "privacy.modifications.content": "Διατηρούμε το δικαίωμα να τροποποιούμε αυτή την πολιτική απορρήτου ανά πάσα στιγμή. Οι αλλαγές θα δημοσιεύονται σε αυτή τη σελίδα με ενημέρωση της ημερομηνίας τελευταίας ενημέρωσης.",
    "privacy.modifications.legal": "Εσωτερικός Κανονισμός",
    
    // Terms of Service
    "terms.title": "Όροι Χρήσης",
    "terms.subtitle": "Οι όροι και προϋποθέσεις χρήσης των υπηρεσιών μας",
    "terms.lastUpdated": "Τελευταία ενημέρωση: Ιανουάριος 2025",
    "terms.compliance": "Νόμιμη Συμμόρφωση",
    "terms.navigation.tableOfContents": "Περιεχόμενα",
    "terms.navigation.currentSection": "Τρέχουσα ενότητα",
    "terms.navigation.progress": "Πρόοδος ανάγνωσης",
    "terms.importantNotice": "Σημαντική Ειδοποίηση",
    "terms.importantText": "Παρακαλούμε διαβάστε προσεκτικά τους όρους χρήσης πριν από τη χρήση των υπηρεσιών μας.",
    "terms.contact": "Επικοινωνία",
    "terms.contactText": "Για οποιαδήποτε ερώτηση σχετικά με τους όρους χρήσης, επικοινωνήστε μαζί μας:",
    "terms.introduction.title": "Εισαγωγή",
    "terms.introduction.summary": "Καλώς ήρθατε στους Όρους Χρήσης",
    "terms.introduction.content": "Καλώς ήρθατε στην Alexandra Rizou Hair Beauty & Health Services. Με την πρόσβαση και τη χρήση του ιστότοπού μας και των υπηρεσιών μας, αποδέχεστε και συμφωνείτε να δεσμεύεστε από τους παρόντες όρους και προϋποθέσεις χρήσης.",
    "terms.introduction.legal": "Νόμος 2251/1994",
    "terms.services.title": "Υπηρεσίες",
    "terms.services.summary": "Περιγραφή των υπηρεσιών μας",
    "terms.services.content": "Προσφέρουμε μια ποικιλία υπηρεσιών ομορφιάς, συμπεριλαμβανομένων: • Κουρέματα • Χρωματισμός μαλλιών • Θεραπείες νυχιών • Αποτρίχωση • Άλλες υπηρεσίες ομορφιάς",
    "terms.services.legal": "Κώδικας Καταναλωτή",
    "terms.booking.title": "Κράτηση Ραντεβού",
    "terms.booking.summary": "Πώς λειτουργεί η κράτηση",
    "terms.booking.content": "Για να κλείσετε ραντεβού, μπορείτε να επικοινωνήσετε μαζί μας τηλεφωνικά ή μέσω email. Θα επιβεβαιώσουμε το ραντεβού σας το συντομότερο δυνατόν.",
    "terms.booking.legal": "Νόμος 2251/1994",
    "terms.cancellation.title": "Πολιτική Ακύρωσης",
    "terms.cancellation.summary": "Κανόνες ακύρωσης ραντεβού",
    "terms.cancellation.content": "Παρακαλούμε ενημερώστε μας τουλάχιστον 24 ώρες νωρίτερα αν χρειάζεται να ακυρώσετε ή να αλλάξετε το ραντεβού σας. Οι ακυρώσεις που γίνονται λιγότερο από 24 ώρες πριν το ραντεβού μπορεί να επιβαρυνθούν με χρέωση.",
    "terms.cancellation.legal": "Κώδικας Καταναλωτή",
    "terms.lateArrivals.title": "Καθυστερημένες Αφίξεις",
    "terms.lateArrivals.summary": "Πολιτική καθυστερημένων αφίξεων",
    "terms.lateArrivals.content": "Σας παρακαλούμε να φτάσετε 10 λεπτά πριν το ραντεβού σας. Οι καθυστερημένες αφίξεις μπορεί να οδηγήσουν σε μειωμένο χρόνο εξυπηρέτησης, καθώς πρέπει να σέβονται τα ραντεβού των άλλων πελατών.",
    "terms.lateArrivals.legal": "Κώδικας Καταναλωτή",
    "terms.payment.title": "Πληρωμή",
    "terms.payment.summary": "Μέθοδοι πληρωμής",
    "terms.payment.content": "Δεχόμαστε μετρητά, πιστωτικές κάρτες και ψηφιακές πληρωμές. Η πληρωμή γίνεται κατά την παροχή της υπηρεσίας. Όλες οι τιμές είναι σε ευρώ και περιλαμβάνουν ΦΠΑ όπου ισχύει.",
    "terms.payment.legal": "Νόμος 4174/2013",
    "terms.liability.title": "Ευθύνη",
    "terms.liability.summary": "Περιορισμός ευθύνης",
    "terms.liability.content": "Δεν φέρουμε ευθύνη για τυχόν αλλεργικές αντιδράσεις ή προβλήματα που προκύπτουν από τη χρήση των προϊόντων μας. Παρακαλούμε ενημερώστε μας για οποιαδήποτε αλλεργίες πριν από την παροχή της υπηρεσίας.",
    "terms.liability.legal": "Νόμος 2251/1994",
    "terms.modifications.title": "Τροποποιήσεις",
    "terms.modifications.summary": "Αλλαγές στους όρους",
    "terms.modifications.content": "Διατηρούμε το δικαίωμα να τροποποιούμε αυτούς τους όρους χρήσης ανά πάσα στιγμή. Οι αλλαγές θα δημοσιεύονται σε αυτή τη σελίδα.",
    "terms.modifications.legal": "Εσωτερικός Κανονισμός",
    "booking.error.title": "Ελλιπείς Πληροφορίες",
    "booking.error.desc": "Παρακαλώ συμπληρώστε όλα τα απαιτούμενα πεδία.",
    
    // Services
    "service.hairstyling": "Χτένισμα",
    "service.hairstyling.desc": "Επαγγελματικό styling και σχηματισμός μαλλιών με σύγχρονες τεχνικές. Προσαρμοσμένο στο στυλ και την προσωπικότητά σας, με χρήση premium προϊόντων για μακροχρόνια ανάδειξη.",
    "service.womenscut": "Κούρεμα Γυναικείο",
    "service.womenscut.desc": "Σύγχρονα γυναικεία κουρέματα που αναδεικνύουν τα χαρακτηριστικά του προσώπου σας. Από κλασικά μέχρι trendy styles, δημιουργούμε το ιδανικό look για κάθε τύπο μαλλιού και προσωπικότητα.",
    "service.menscut": "Κούρεμα Ανδρικό",
    "service.menscut.desc": "Ακριβή και προσεγμένα ανδρικά κουρέματα με σύγχρονες τεχνικές. Κλασικά ή μοντέρνα styles που ταιριάζουν στο προσωπικό σας στυλ και lifestyle.",
    "service.kidscut": "Κούρεμα Παιδικό",
    "service.kidscut.desc": "Φιλικές και ασφαλείς υπηρεσίες για τα μικρά μας φίλα. Ειδικές τεχνικές για παιδικά μαλλιά με προσοχή και υπομονή, για να νιώθουν άνετα και χαρούμενα.",
    "service.treatment": "Θεραπεία",
    "service.treatment.desc": "Εντατικές θεραπείες για υγιή, λάμπουσα τρίχα. Προσαρμοσμένες ανάλογα με τις ανάγκες του μαλλιού σας - από ενυδάτωση και αναζωογόνηση μέχρι αποκατάσταση ζημιών.",
    "service.rootcolor": "Βαφή Ρίζα/Κοντά",
    "service.rootcolor.desc": "Ακριβής βαφή στις ρίζες ή σε κοντά μαλλιά. Ιδανική για συντήρηση του χρώματος και κάλυψη λευκών τριχών, με φυσικά αποτελέσματα που συγχωνεύονται άψογα με το υπάρχον χρώμα.",
    "service.fullcolor": "Βαφή Ολο",
    "service.fullcolor.desc": "Πλήρης μεταμόρφωση με βαφή σε όλο το μήκος. Προσαρμοσμένη τεχνική για το επιθυμητό αποτέλεσμα, με premium χρώματα που διατηρούν τη λάμψη και την υγεία της τρίχας.",
    "service.highlights": "Ανταύγειες",
    "service.highlights.desc": "Φυσικές ανταύγειες που προσθέτουν βάθος και λάμψη. Τεχνικές foil highlighting για ακριβή τοποθέτηση και φυσικό αποτέλεσμα που αναδεικνύει το φυσικό σας χρώμα.",
    "service.balayage": "Μπαλαγιάζ",
    "service.balayage.desc": "Η τέχνη του hand-painted balayage για φυσικό, sun-kissed αποτέλεσμα. Προσαρμοσμένη τεχνική που δημιουργεί ομαλές μεταβάσεις και dimension, ιδανική για low-maintenance styling.",
    "service.bleach": "Ντεκαπάζ",
    "service.bleach.desc": "Επαγγελματική αποχρωματισμός με προστατευτικές τεχνικές. Ασφαλής διαδικασία που προστατεύει την υγεία της τρίχας, ιδανική για φωτεινά αποτελέσματα και creative coloring.",
    "service.toner": "Ρεφλέ",
    "service.toner.desc": "Τελική ρύθμιση του χρώματος με toner για το επιθυμητό tone. Απομακρύνει ανεπιθύμητες αποχρώσεις και δημιουργεί το τέλειο balance, προσθέτοντας λάμψη και βάθος.",
    "service.ombre": "Ρανσάζ",
    "service.ombre.desc": "Ομαλή μετάβαση από σκούρο σε φωτεινό, με gradient effect που δημιουργεί βάθος και movement. Προσαρμοσμένη τεχνική για φυσικό, trendy αποτέλεσμα.",
    "service.waxing": "Αποτρίχωση Άνω Χείλος/Φρύδια",
    "service.waxing.desc": "Επαγγελματική αποτρίχωση με premium κερί για λείο, καθαρό αποτέλεσμα. Προσεκτική τεχνική που σέβεται το δέρμα και προσφέρει μακροχρόνια λείανση με ελάχιστο discomfort.",
    
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
    "nav.home.subtitle": "Main Page",
    "nav.home.action": "go",
    "nav.services": "Services",
    "nav.services.subtitle": "Our Services",
    "nav.services.action": "view",
    "nav.gallery": "Gallery",
    "nav.gallery.subtitle": "View Our Work",
    "nav.gallery.action": "enter",
    "nav.about": "About",
    "nav.about.subtitle": "Get to Know Us",
    "nav.about.action": "read",
    "nav.contact": "Contact",
    "nav.contact.subtitle": "Get in Touch",
    "nav.contact.action": "visit",
    "nav.bookNow": "Book Now",
    "comingSoon": "Coming Soon",
    
    // Home Page
    "home.hero.title1": "Where Beauty",
    "home.hero.title2": "Meets Excellence",
    "home.hero.subtitle": "Experience luxury beauty services in an elegant, relaxing atmosphere. Our expert team is dedicated to making you look and feel your absolute best.",
    "home.hero.bookBtn": "Book Your Appointment",
    "home.hero.servicesBtn": "View Services",
    "home.hero.awards": "Awards",
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
    "home.cta.subtitle": "Discover the art of beauty with personalized services that enhance your unique style. Our expertise and attention to detail are here for you.",
    "home.cta.btn": "Book Your Appointment Now",
    "home.cta.phone": "Book by Phone",
    "home.choose.badge": "Why choose us",
    "home.choose.title": "Choose expertise & genuine care",
    "home.choose.subtitle": "We combine technical excellence, modern aesthetics, and authentic hospitality to offer you a lasting beauty experience.",
    "home.choose.signature.title": "Signature Styling",
    "home.choose.signature.desc": "Personalized coloring techniques and styling that highlight your natural style.",
    "home.choose.tailored.title": "Tailored Sessions",
    "home.choose.tailored.desc": "We start each service with a needs diagnosis to create the ideal treatment plan.",
    "home.choose.clean.title": "Premium Health & Cleanliness",
    "home.choose.clean.desc": "High-quality products, tool sterilization, and strict hygiene standards.",
    "home.choose.community.title": "Warm Community",
    "home.choose.community.desc": "A team that knows you by your first name and takes care of every detail.",
    "home.choose.stats.clients": "Returning Clients",
    "home.choose.stats.reviews": "5-Star Reviews",
    "home.choose.stats.experience": "Years of Trust",
    "home.choose.cta.title": "Want to experience it?",
    "home.choose.cta.subtitle": "Book a personal appointment or visit our space for a quick tour.",
    "home.choose.cta.primary": "Get in Touch",
    "home.choose.cta.secondary": "View Our Gallery",
    
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
    "gallery.category.our_space": "Our Space",
    "gallery.category.before_after": "Before & After",
    "gallery.category.hair_creations": "Hair Creations",
    "gallery.category.nails_beauty": "Nails & Beauty",
    "gallery.category.team_moments": "Team Moments",
    "gallery.section.our_space.title": "Our Space",
    "gallery.section.our_space.desc": "Take a virtual tour of our beautiful salon interior and atmosphere",
    "gallery.section.before_after.title": "Before & After",
    "gallery.section.before_after.desc": "Witness the stunning transformations we create for our clients",
    "gallery.section.hair_creations.title": "Hair Creations",
    "gallery.section.hair_creations.desc": "Browse our portfolio of hairstyles, coloring techniques, and treatments",
    "gallery.section.nails_beauty.title": "Nails & Beauty",
    "gallery.section.nails_beauty.desc": "Explore our manicure, pedicure, and beauty treatment services",
    "gallery.section.team_moments.title": "Team Moments",
    "gallery.section.team_moments.desc": "Get to know our talented team and see us in action",
    "gallery.before": "Before",
    "gallery.after": "After",
    "gallery.all": "All",
    "gallery.instagram.title": "Follow Us on Instagram",
    "gallery.instagram.subtitle": "Stay updated with our latest work, beauty tips, and exclusive offers. Follow @alexandrarizou for daily inspiration!",
    "gallery.instagram.handle": "@alexandrarizou",
    
    // About Page
    "about.hero.title": "About Us",
    "about.hero.subtitle": "More than just a salon – we're your partners in beauty, confidence, and self-expression.",
    "about.story.title": "Our Story",
    "about.story.p1": "Alexandra Rizou - Hair Beauty & Health Services was founded in 2022 with a simple vision: to create a welcoming space where beauty meets excellence. What started as a small boutique salon has grown into a beloved destination for those seeking premium hair and beauty services.",
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
    "contact.form.subject": "Subject *",
    "contact.form.subjectPlaceholder": "Select a subject",
    "contact.form.subject.appointment": "Book Appointment",
    "contact.form.subject.services": "Question about Services",
    "contact.form.subject.pricing": "Question about Prices",
    "contact.form.subject.hours": "Question about Hours",
    "contact.form.subject.location": "Question about Location",
    "contact.form.subject.complaint": "Complaint",
    "contact.form.subject.compliment": "Compliment",
    "contact.form.subject.other": "Other",
    "contact.form.message": "Message *",
    "contact.form.messagePlaceholder": "Tell us how we can help you...",
    "contact.form.submit": "Send Message",
    "contact.form.success.title": "Message Sent!",
    "contact.form.success.desc": "We'll get back to you as soon as possible.",
    "contact.map.title": "Our Location",
    "contact.map.subtitle": "Visit us at our salon",
    "contact.form.subtitle": "Fill out the form below and we'll get back to you soon.",
    "contact.info.section.title": "Booking Information",
    "contact.info.cancellation": "Cancellation Policy: Please notify us at least 24 hours in advance if you need to cancel or reschedule your appointment.",
    "contact.info.late": "Late Arrivals: We kindly ask that you arrive 10 minutes before your appointment. Late arrivals may result in reduced service time.",
    "contact.info.payment": "Payment: We accept cash, credit cards, and digital payments. Payment is due at the time of service.",
    
    // 404 Page
    "404.title": "Page Not Found",
    "404.description": "Sorry, but the page you're looking for doesn't exist or has been moved. Return to the home page to continue.",
    "404.homeButton": "Return to Home",
    "404.backButton": "Go Back",
    "404.quickLinks": "Quick Links:",
    
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
    "service.hairstyling.desc": "Professional styling and hair shaping with modern techniques. Tailored to your style and personality, using premium products for long-lasting results.",
    "service.womenscut": "Women's Haircut",
    "service.womenscut.desc": "Contemporary women's haircuts that enhance your facial features. From classic to trendy styles, we create the perfect look for every hair type and personality.",
    "service.menscut": "Men's Haircut",
    "service.menscut.desc": "Precise and well-groomed men's haircuts with modern techniques. Classic or contemporary styles that match your personal style and lifestyle.",
    "service.kidscut": "Kids Haircut",
    "service.kidscut.desc": "Friendly and safe services for our little friends. Special techniques for children's hair with care and patience, ensuring they feel comfortable and happy.",
    "service.treatment": "Hair Treatment",
    "service.treatment.desc": "Intensive treatments for healthy, shiny hair. Customized according to your hair's needs - from hydration and revitalization to damage repair.",
    "service.rootcolor": "Root/Short Color",
    "service.rootcolor.desc": "Precise coloring at the roots or on short hair. Ideal for color maintenance and gray coverage, with natural results that blend seamlessly with existing color.",
    "service.fullcolor": "Full Color",
    "service.fullcolor.desc": "Complete transformation with full-length coloring. Customized technique for your desired result, using premium colors that maintain shine and hair health.",
    "service.highlights": "Highlights",
    "service.highlights.desc": "Natural highlights that add depth and shine. Foil highlighting techniques for precise placement and natural results that enhance your natural color.",
    "service.balayage": "Balayage",
    "service.balayage.desc": "The art of hand-painted balayage for a natural, sun-kissed effect. Customized technique that creates smooth transitions and dimension, ideal for low-maintenance styling.",
    "service.bleach": "Bleaching",
    "service.bleach.desc": "Professional lightening with protective techniques. Safe process that protects hair health, ideal for bright results and creative coloring.",
    "service.toner": "Toner",
    "service.toner.desc": "Final color adjustment with toner for the desired tone. Removes unwanted tones and creates perfect balance, adding shine and depth.",
    "service.ombre": "Ombre",
    "service.ombre.desc": "Smooth transition from dark to light, with gradient effect that creates depth and movement. Customized technique for a natural, trendy result.",
    "service.waxing": "Upper Lip/Eyebrow Waxing",
    "service.waxing.desc": "Professional waxing with premium wax for smooth, clean results. Careful technique that respects the skin and offers long-lasting smoothness with minimal discomfort.",
    
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
    
    // Privacy Policy
    "privacy.title": "Privacy Policy",
    "privacy.subtitle": "Protecting your personal data is our priority.",
    "privacy.lastUpdated": "Last updated: January 2025",
    "privacy.compliance": "GDPR Compliant",
    "privacy.navigation.tableOfContents": "Table of Contents",
    "privacy.navigation.currentSection": "Current section",
    "privacy.navigation.progress": "Reading progress",
    "privacy.importantNotice": "Important Notice",
    "privacy.importantText": "Our privacy policy explains how we collect, use, and protect your personal data.",
    "privacy.contact": "Contact",
    "privacy.contactText": "For any questions regarding our privacy policy, please contact us:",
    "privacy.introduction.title": "Introduction",
    "privacy.introduction.summary": "Welcome to our Privacy Policy",
    "privacy.introduction.content": "Alexandra Rizou Hair Beauty & Health Services (\"we\", \"us\", \"our\") respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, store, and protect your personal data when you visit our website or use our services.",
    "privacy.introduction.legal": "GDPR & Law 4624/2019",
    "privacy.dataCollection.title": "Data Collection",
    "privacy.dataCollection.summary": "What data we collect",
    "privacy.dataCollection.content": "We collect the following types of personal data: • Name and surname • Email address • Phone number • Address • Appointment information • Service preferences",
    "privacy.dataCollection.legal": "Article 6 GDPR",
    "privacy.dataUsage.title": "Data Usage",
    "privacy.dataUsage.summary": "How we use your data",
    "privacy.dataUsage.content": "We use your personal data to: • Provide and improve our services • Communicate with you about appointments • Send updates and offers • Comply with legal obligations",
    "privacy.dataUsage.legal": "Article 5 GDPR",
    "privacy.dataSharing.title": "Data Sharing",
    "privacy.dataSharing.summary": "Who we share data with",
    "privacy.dataSharing.content": "We do not sell your personal data. We may only share your data with: • Service providers who help us operate (e.g., hosting, email) • When required by law",
    "privacy.dataSharing.legal": "Article 26 GDPR",
    "privacy.dataRights.title": "Your Rights",
    "privacy.dataRights.summary": "Your rights under GDPR",
    "privacy.dataRights.content": "You have the right to: • Request access to your personal data • Request correction of inaccurate data • Request deletion of your data • Object to processing • Request restriction of processing • Request data portability",
    "privacy.dataRights.legal": "Chapter III GDPR",
    "privacy.dataSecurity.title": "Data Security",
    "privacy.dataSecurity.summary": "How we protect your data",
    "privacy.dataSecurity.content": "We use appropriate technical and organizational measures to protect your personal data, including: • Encryption • Password protection • Regular security checks",
    "privacy.dataSecurity.legal": "Article 32 GDPR",
    "privacy.dataRetention.title": "Data Retention",
    "privacy.dataRetention.summary": "How long we keep data",
    "privacy.dataRetention.content": "We retain your personal data only for as long as necessary for the purposes for which it was collected, unless the law requires retention for a longer period.",
    "privacy.dataRetention.legal": "Article 5(1)(e) GDPR",
    "privacy.cookies.title": "Cookies",
    "privacy.cookies.summary": "Use of cookies on our website",
    "privacy.cookies.content": "Our website uses cookies to improve your experience. You can manage your cookie preferences from your browser settings.",
    "privacy.cookies.legal": "EU Cookie Directive",
    "privacy.contact.title": "Contact",
    "privacy.contact.summary": "Contact us",
    "privacy.contact.content": "For any questions regarding our privacy policy, you can contact us at: ar.hairbeauty.healthservices@gmail.com or by phone at +3021 0681 8011.",
    "privacy.contact.legal": "Article 77 GDPR",
    "privacy.modifications.title": "Modifications",
    "privacy.modifications.summary": "Changes to the policy",
    "privacy.modifications.content": "We reserve the right to modify this privacy policy at any time. Changes will be posted on this page with an update to the last updated date.",
    "privacy.modifications.legal": "Internal Regulation",
    
    // Terms of Service
    "terms.title": "Terms of Service",
    "terms.subtitle": "Terms and conditions for using our services",
    "terms.lastUpdated": "Last updated: January 2025",
    "terms.compliance": "Legal Compliance",
    "terms.navigation.tableOfContents": "Table of Contents",
    "terms.navigation.currentSection": "Current section",
    "terms.navigation.progress": "Reading progress",
    "terms.importantNotice": "Important Notice",
    "terms.importantText": "Please read these terms of service carefully before using our services.",
    "terms.contact": "Contact",
    "terms.contactText": "For any questions regarding our terms of service, please contact us:",
    "terms.introduction.title": "Introduction",
    "terms.introduction.summary": "Welcome to our Terms of Service",
    "terms.introduction.content": "Welcome to Alexandra Rizou Hair Beauty & Health Services. By accessing and using our website and services, you accept and agree to be bound by these terms and conditions of use.",
    "terms.introduction.legal": "Law 2251/1994",
    "terms.services.title": "Services",
    "terms.services.summary": "Description of our services",
    "terms.services.content": "We offer a variety of beauty services, including: • Haircuts • Hair coloring • Nail treatments • Waxing • Other beauty services",
    "terms.services.legal": "Consumer Code",
    "terms.booking.title": "Appointment Booking",
    "terms.booking.summary": "How booking works",
    "terms.booking.content": "To book an appointment, you can contact us by phone or email. We will confirm your appointment as soon as possible.",
    "terms.booking.legal": "Law 2251/1994",
    "terms.cancellation.title": "Cancellation Policy",
    "terms.cancellation.summary": "Appointment cancellation rules",
    "terms.cancellation.content": "Please notify us at least 24 hours in advance if you need to cancel or reschedule your appointment. Cancellations made less than 24 hours before the appointment may be subject to a charge.",
    "terms.cancellation.legal": "Consumer Code",
    "terms.lateArrivals.title": "Late Arrivals",
    "terms.lateArrivals.summary": "Late arrival policy",
    "terms.lateArrivals.content": "We kindly ask that you arrive 10 minutes before your appointment. Late arrivals may result in reduced service time, as we must respect other clients' appointments.",
    "terms.lateArrivals.legal": "Consumer Code",
    "terms.payment.title": "Payment",
    "terms.payment.summary": "Payment methods",
    "terms.payment.content": "We accept cash, credit cards, and digital payments. Payment is due at the time of service. All prices are in euros and include VAT where applicable.",
    "terms.payment.legal": "Law 4174/2013",
    "terms.liability.title": "Liability",
    "terms.liability.summary": "Limitation of liability",
    "terms.liability.content": "We are not liable for any allergic reactions or problems arising from the use of our products. Please inform us of any allergies before receiving service.",
    "terms.liability.legal": "Law 2251/1994",
    "terms.modifications.title": "Modifications",
    "terms.modifications.summary": "Changes to terms",
    "terms.modifications.content": "We reserve the right to modify these terms of service at any time. Changes will be posted on this page.",
    "terms.modifications.legal": "Internal Regulation",
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const isTogglingRef = useRef(false);
  
  // Detect initial language from actual URL pathname (before rewrite)
  const getActualPathname = () => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return pathname;
  };

  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return detectLocaleFromPath(window.location.pathname);
    }
    return detectLocaleFromPath(pathname);
  });

  const hasCheckedInitialRedirect = useRef(false);

  // Initial redirect to /en if needed (only once, not during toggles)
  useEffect(() => {
    if (hasCheckedInitialRedirect.current || isTogglingRef.current) {
      return;
    }

    if (typeof window !== 'undefined' && language === 'en') {
      const actualPath = window.location.pathname;
      // Only redirect if we're on / and the actual URL is also / (not /en)
      // This ensures we redirect to /en on initial load, but don't interfere with toggles
      if (pathname === '/' && actualPath === '/') {
        hasCheckedInitialRedirect.current = true;
        router.replace('/en');
      } else {
        // Mark as checked if we're already on the correct path
        hasCheckedInitialRedirect.current = true;
      }
    } else {
      // Mark as checked if language is not English
      hasCheckedInitialRedirect.current = true;
    }
  }, [language, pathname, router]);

  // Update language when pathname changes (e.g., on refresh or navigation)
  // But skip if we're in the middle of a manual toggle
  useEffect(() => {
    if (isTogglingRef.current) {
      return; // Skip during manual toggle
    }

    const actualPath = getActualPathname();
    const newLocale = detectLocaleFromPath(actualPath);
    
    if (newLocale !== language) {
      setLanguage(newLocale);
    }
  }, [pathname, language]);

  const toggleLanguage = () => {
    isTogglingRef.current = true;
    
    const newLanguage: Language = language === "el" ? "en" : "el";
    
    // Get actual pathname (before rewrite) to properly detect base path
    const actualPath = typeof window !== 'undefined' ? window.location.pathname : pathname;
    const basePath = getBasePath(actualPath);
    
    // Special handling for privacy and terms - keep the same path but add /en prefix for English
    let newPath: string;
    if (basePath === '/privacy' || basePath === '/terms') {
      newPath = newLanguage === 'en' ? `/en${basePath}` : basePath;
    } else {
      // Get localized path for new language
      newPath = getLocalizedPath(basePath, newLanguage);
    }
    
    // Set language first
    setLanguage(newLanguage);
    
    // Navigate to new path
    router.push(newPath);
    
    // Reset toggle flag after navigation completes (longer timeout to ensure navigation is done)
    setTimeout(() => {
      isTogglingRef.current = false;
    }, 1000);
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
