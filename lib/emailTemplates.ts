export interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  subject: string;
  content: string;
  description: string;
}

// Helper function to get current year
const getCurrentYear = () => new Date().getFullYear();

// Pre-made Email Templates (Client-side safe)
export const emailTemplates: EmailTemplate[] = [
  {
    id: 'christmas-2024',
    name: `Χριστούγεννα ${getCurrentYear()}`,
    category: 'Εορτές',
    subject: '🎄 Καλά Χριστούγεννα από το Alexandra Rizou hair-beauty & health services!',
    description: 'Χριστουγεννιάτικο email με ευχές και προσφορές',
    content: `Αγαπητέ/ή πελάτη,

🎄 Καλά Χριστούγεννα και Καλή Χρονιά! 🎄

Ευχαριστούμε που επιλέξατε το Alexandra Rizou hair-beauty & health services για την περιποίηση σας φέτος! 

🎁 Ειδικές Χριστουγεννιάτικες Προσφορές:
• 20% έκπτωση σε όλες τις υπηρεσίες (15-31 Δεκεμβρίου)
• Δωρεάν styling με κάθε κούρεμα
• Χριστουγεννιάτικο gift set με κάθε ραντεβού

⏰ Ειδικό Χριστουγεννιάτικο Ωράριο:
• 23 Δεκεμβρίου: 10:00-16:00
• 24 Δεκεμβρίου: 10:00-14:00
• 25-26 Δεκεμβρίου: Κλειστά
• 27-30 Δεκεμβρίου: Κανονικό ωράριο

Κλείστε το ραντεβού σας για τα Χριστούγεννα:
📞 +30 210 6818 011

Ευχόμαστε υγεία, χαρά και ευτυχία σε εσάς και την οικογένειά σας!

Με αγάπη,
Η ομάδα του Alexandra Rizou hair-beauty & health services 💇‍♂️🎄`
  },
  {
    id: 'easter-2024',
    name: `Πάσχα ${getCurrentYear()}`,
    category: 'Εορτές',
    subject: '🐣 Καλό Πάσχα από το Alexandra Rizou hair-beauty & health services!',
    description: 'Πασχαλινό email με ευχές και προσφορές',
    content: `Αγαπητέ/ή πελάτη,

🐣 Καλό Πάσχα! 🐣

Ευχαριστούμε που είστε μέλος της οικογένειας του Alexandra Rizou hair-beauty & health services!

🌸 Ειδικές Πασχαλινές Προσφορές:
• 15% έκπτωση σε όλες τις υπηρεσίες (1-15 Απριλίου)
• Δωρεάν beard trim με κάθε κούρεμα
• Πασχαλινό gift set με κάθε ραντεβού

⏰ Ειδικό Πασχαλινό Ωράριο:
• Μεγάλη Παρασκευή: 10:00-14:00
• Μεγάλο Σάββατο: Κλειστά
• Κυριακή του Πάσχα: Κλειστά
• Δευτέρα του Πάσχα: Κλειστά

Κλείστε το ραντεβού σας για το Πάσχα:
📞 +30 210 6818 011

Ευχόμαστε υγεία, ευτυχία και ανανέωση!

Με αγάπη,
Η ομάδα του Alexandra Rizou hair-beauty & health services 💇‍♂️🐣`
  },
  {
    id: 'summer-offer-2024',
    name: `Καλοκαιρινή Προσφορά ${getCurrentYear()}`,
    category: 'Προσφορές',
    subject: '☀️ Καλοκαιρινή Προσφορά - Alexandra Rizou hair-beauty & health services!',
    description: 'Καλοκαιρινή προσφορά με εκπτώσεις',
    content: `Αγαπητέ/ή πελάτη,

☀️ Καλοκαίρι = Νέο Look! ☀️

Το καλοκαίρι είναι η τέλεια ευκαιρία για ανανέωση! 

🏖️ Καλοκαιρινές Προσφορές:
• 25% έκπτωση σε όλες τις υπηρεσίες (Ιούνιος-Αύγουστος)
• Δωρεάν styling και grooming tips
• Summer care package με κάθε ραντεβού
• Ειδικές προσφορές για νέους πελάτες

🎯 Τι περιλαμβάνει η προσφορά:
• Κούρεμα + styling
• Beard trim και shaping
• Face care και moisturizing
• Summer styling tips

Κλείστε το ραντεβού σας τώρα:
📞 +30 210 6818 011

Ετοιμαστείτε για ένα καλοκαίρι full of style! 

Με εκτίμηση,
Η ομάδα του Alexandra Rizou hair-beauty & health services 💇‍♂️☀️`
  },
  {
    id: 'new-year-2024',
    name: `Πρωτοχρονιά ${getCurrentYear()}`,
    category: 'Εορτές',
    subject: `🎊 Καλή Χρονιά ${getCurrentYear()} από το Alexandra Rizou hair-beauty & health services!`,
    description: 'Πρωτοχρονιάτικο email με ευχές και νέες προσφορές',
    content: `Αγαπητέ/ή πελάτη,

🎊 Καλή Χρονιά ${getCurrentYear()}! 🎊

Ευχαριστούμε που είστε μέλος της οικογένειας του Alexandra Rizou hair-beauty & health services!

✨ Νέες Προσφορές για το ${getCurrentYear()}:
• 30% έκπτωση σε όλες τις υπηρεσίες (1-31 Ιανουαρίου)
• Δωρεάν consultation για νέο look
• New Year gift set με κάθε ραντεβού
• Loyalty program με bonus points

🎯 Νέες Υπηρεσίες ${getCurrentYear()}:
• Advanced beard styling
• Premium hair treatments
• Personal grooming consultation
• VIP appointment slots

Κλείστε το πρώτο ραντεβού σας για το ${getCurrentYear()}:
📞 +30 210 6818 011

Ευχόμαστε υγεία, ευτυχία και επιτυχία στο νέο έτος!

Με αγάπη,
Η ομάδα του Alexandra Rizou hair-beauty & health services 💇‍♂️🎊`
  },
  {
    id: 'valentine-2024',
    name: `Αγίου Βαλεντίνου ${getCurrentYear()}`,
    category: 'Εορτές',
    subject: '💕 Αγίου Βαλεντίνου - Special Offer!',
    description: 'Αγίου Βαλεντίνου email με ειδικές προσφορές',
    content: `Αγαπητέ/ή πελάτη,

💕 Αγίου Βαλεντίνου - Special Offer! 💕

Ετοιμαστείτε για την πιο ρομαντική μέρα του χρόνου!

💝 Ειδικές Προσφορές Αγίου Βαλεντίνου:
• 20% έκπτωση για couples (10-14 Φεβρουαρίου)
• Δωρεάν styling για την ειδική μέρα
• Romantic grooming package
• Gift certificates διαθέσιμα

🎯 Couple's Package:
• Κούρεμα + styling για τον άντρα
• Hair styling για την γυναίκα
• Δωρεάν consultation
• Professional photoshoot

Κλείστε το ρομαντικό ραντεβού σας:
📞 +30 210 6818 011

Κάντε την ειδική μέρα ακόμα πιο ειδική! 

Με αγάπη,
Η ομάδα του Alexandra Rizou hair-beauty & health services 💇‍♂️💕`
  }
];
