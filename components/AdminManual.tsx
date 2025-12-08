'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  ChevronRight, 
  ChevronDown, 
  BarChart3, 
  Mail, 
  FileText, 
  Star, 
  Snowflake, 
  Bell, 
  Activity,
  Calendar,
  Users,
  Settings,
  Search,
  Download,
  Send,
  Edit,
  Save,
  Trash2,
  Plus,
  Eye,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

export default function AdminManual() {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['intro']));

  const toggleSection = (section: string) => {
    const newOpen = new Set(openSections);
    if (newOpen.has(section)) {
      newOpen.delete(section);
    } else {
      newOpen.add(section);
    }
    setOpenSections(newOpen);
  };

  const Section = ({ id, title, icon: Icon, children }: { id: string; title: string; icon: any; children: React.ReactNode }) => {
    const isOpen = openSections.has(id);
    return (
      <div className="mb-4">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border-2 border-slate-200/60 hover:border-blue-300 transition-all duration-200 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Icon className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          </div>
          {isOpen ? (
            <ChevronDown className="w-5 h-5 text-slate-600" />
          ) : (
            <ChevronRight className="w-5 h-5 text-slate-600" />
          )}
        </button>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 p-6 bg-white rounded-xl border-2 border-slate-200/60 shadow-sm"
          >
            {children}
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-5 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-slate-800 via-blue-700 to-slate-800 bg-clip-text text-transparent">
                Οδηγός Χρήσης Admin Panel
              </h1>
              <p className="text-slate-600 text-sm sm:text-base mt-2">
                Alexandra Rizou - Πλήρης Οδηγός Λειτουργίας
              </p>
            </div>
          </div>
        </motion.div>

        {/* Introduction */}
        <Section id="intro" title="Εισαγωγή" icon={Info}>
          <div className="space-y-4 text-slate-700">
            <p className="leading-relaxed">
              Καλώς ήρθατε στον <strong>Οδηγό Χρήσης του Admin Panel</strong> του Alexandra Rizou! 
              Αυτός ο οδηγός σας βοηθάει να κατανοήσετε και να χρησιμοποιήσετε όλες τις λειτουργίες 
              του admin panel με αποτελεσματικότητα.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <p className="font-semibold text-blue-900 mb-2">💡 Συμβουλή:</p>
              <p className="text-blue-800 text-sm">
                Κάντε κλικ σε κάθε ενότητα για να δείτε τις λεπτομερείς οδηγίες. Όλες οι ενότητες 
                μπορούν να ανοίγουν και να κλείνουν ανεξάρτητα.
              </p>
            </div>
          </div>
        </Section>

        {/* Dashboard */}
        <Section id="dashboard" title="Dashboard - Αρχική Σελίδα" icon={BarChart3}>
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Τι είναι το Dashboard;
              </h4>
              <p className="text-slate-700 leading-relaxed mb-4">
                Το Dashboard είναι η κύρια σελίδα του admin panel. Εδώ βλέπετε μια επισκόπηση 
                όλων των στατιστικών και γρήγορες ενέργειες για τις πιο συχνές εργασίες σας.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3">Στατιστικά & Επισκόπηση</h4>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li><strong>Συνδρομητές Newsletter:</strong> Συνολικός αριθμός συνδρομητών</li>
                <li><strong>Templates:</strong> Αριθμός αποθηκευμένων email templates</li>
                <li><strong>Reviews:</strong> Στατιστικά για reviews</li>
                <li><strong>Ανακοινώσεις:</strong> Αριθμός ενεργών ανακοινώσεων</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3">Analytics Dashboard</h4>
              <p className="text-slate-700 leading-relaxed mb-3">
                Το Analytics Dashboard σας δίνει πληροφορίες για:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>Επισκέψεις ιστοσελίδας (views)</li>
                <li>Μοναδικούς επισκέπτες (unique visitors)</li>
                <li>Σελίδες με περισσότερες επισκέψεις</li>
                <li>Χρονικές περιόδους (σήμερα, αυτή την εβδομάδα, αυτό το μήνα, όλο το χρόνο)</li>
              </ul>
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Σημείωση:</strong> Μπορείτε να αλλάξετε την χρονική περίοδο χρησιμοποιώντας 
                  τα κουμπιά "Σήμερα", "Εβδομάδα", "Μήνας", "Όλο το χρόνο" στην κορυφή του Analytics Dashboard.
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3">Γρήγορες Ενέργειες</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <strong className="text-blue-900">Νέο Ραντεβού</strong>
                  </div>
                  <p className="text-sm text-blue-800">
                    Κάντε κλικ για να ανοίξετε τη σελίδα booking σε νέο παράθυρο.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-5 h-5 text-green-600" />
                    <strong className="text-green-900">Newsletter</strong>
                  </div>
                  <p className="text-sm text-green-800">
                    Μεταφέρεστε στο tab Newsletter για διαχείριση συνδρομητών.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <strong className="text-purple-900">Templates</strong>
                  </div>
                  <p className="text-sm text-purple-800">
                    Μεταφέρεστε στο tab Templates για επεξεργασία email templates.
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-orange-600" />
                    <strong className="text-orange-900">Reviews</strong>
                  </div>
                  <p className="text-sm text-orange-800">
                    Μεταφέρεστε στο tab Reviews για αποστολή review requests.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Newsletter */}
        <Section id="newsletter" title="Newsletter - Διαχείριση Συνδρομητών" icon={Mail}>
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-slate-900 mb-3">Τι είναι το Newsletter Dashboard;</h4>
              <p className="text-slate-700 leading-relaxed">
                Το Newsletter Dashboard σας επιτρέπει να διαχειρίζεστε όλους τους συνδρομητές του 
                newsletter σας, να στέλνετε emails και να βλέπετε στατιστικά.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3">Στατιστικά Newsletter</h4>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li><strong>Σύνολο:</strong> Συνολικός αριθμός συνδρομητών</li>
                <li><strong>Ενεργοί:</strong> Αριθμός ενεργών συνδρομητών</li>
                <li><strong>Γλώσσες:</strong> Κατανομή συνδρομητών ανά γλώσσα (Ελληνικά/English)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3">Αναζήτηση & Φιλτράρισμα</h4>
              <p className="text-slate-700 leading-relaxed mb-3">
                Χρησιμοποιήστε το πεδίο αναζήτησης για να βρείτε συγκεκριμένους συνδρομητές:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-slate-700 ml-4">
                <li>Πληκτρολογήστε το email ή μέρος του email στο πεδίο αναζήτησης</li>
                <li>Η λίστα θα φιλτραριστεί αυτόματα</li>
                <li>Μπορείτε να καθαρίσετε την αναζήτηση για να δείτε όλους τους συνδρομητές</li>
              </ol>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3">Διαχείριση Συνδρομητών</h4>
              <div className="space-y-3">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <strong className="text-slate-900 block mb-2">Διαγραφή Συνδρομητή:</strong>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-slate-700 ml-4">
                    <li>Βρείτε τον συνδρομητή στη λίστα</li>
                    <li>Κάντε κλικ στο εικονίδιο <Trash2 className="w-4 h-4 inline text-red-600" /> (κάδος απορριμμάτων)</li>
                    <li>Επιβεβαιώστε τη διαγραφή</li>
                  </ol>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <strong className="text-slate-900 block mb-2">Μαζική Διαγραφή:</strong>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-slate-700 ml-4">
                    <li>Επιλέξτε πολλούς συνδρομητές χρησιμοποιώντας τα checkboxes</li>
                    <li>Κάντε κλικ στο κουμπί "Διαγραφή Επιλεγμένων"</li>
                    <li>Επιβεβαιώστε τη μαζική διαγραφή</li>
                  </ol>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3">Αποστολή Email</h4>
              <ol className="list-decimal list-inside space-y-2 text-slate-700 ml-4">
                <li>Κάντε κλικ στο κουμπί <Send className="w-4 h-4 inline text-green-600" /> "Στείλε Email"</li>
                <li>Συμπληρώστε το θέμα (subject) του email</li>
                <li>Γράψτε το περιεχόμενο (content) του email</li>
                <li>Επιλέξτε γλώσσα (Όλες, Ελληνικά, English) ή αφήστε "Όλες" για να στείλετε σε όλους</li>
                <li>Κάντε κλικ στο "Αποστολή"</li>
                <li>Το σύστημα θα στείλει το email σε όλους τους επιλεγμένους συνδρομητές</li>
              </ol>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Σημαντικό:</strong> Το email θα σταλεί σε όλους τους ενεργούς συνδρομητές 
                  που ταιριάζουν με τα κριτήρια που επιλέξατε (γλώσσα).
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3">Εξαγωγή Δεδομένων</h4>
              <p className="text-slate-700 leading-relaxed mb-3">
                Μπορείτε να εξάγετε τη λίστα συνδρομητών σε CSV:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-slate-700 ml-4">
                <li>Κάντε κλικ στο κουμπί <Download className="w-4 h-4 inline text-blue-600" /> "Εξαγωγή CSV"</li>
                <li>Θα κατεβεί ένα αρχείο CSV με όλους τους συνδρομητές</li>
                <li>Μπορείτε να ανοίξετε το αρχείο στο Excel ή Google Sheets</li>
              </ol>
            </div>
          </div>
        </Section>

        {/* Templates */}
        <Section id="templates" title="Templates - Email Templates" icon={FileText}>
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-slate-900 mb-3">Τι είναι τα Email Templates;</h4>
              <p className="text-slate-700 leading-relaxed">
                Τα Email Templates είναι προ-σχεδιασμένα email που μπορείτε να προσαρμόσετε και να 
                αποθηκεύσετε για μελλοντική χρήση. Υπάρχουν δύο κατηγορίες:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 mt-3 ml-4">
                <li><strong>Base Templates:</strong> Βασικά templates που μπορείτε να επεξεργαστείτε</li>
                <li><strong>Saved Templates:</strong> Templates που έχετε ήδη προσαρμόσει και αποθηκεύσει</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3">Base Email Templates</h4>
              <p className="text-slate-700 leading-relaxed mb-3">
                Διαθέσιμα base templates:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { name: 'Welcome Email', desc: 'Καλώς ήρθατε νέοι συνδρομητές' },
                  { name: 'Promotion Email', desc: 'Προσφορές και εκπτώσεις' },
                  { name: 'Event Email', desc: 'Ειδικές εκδηλώσεις' },
                  { name: 'Review Request', desc: 'Αίτημα για review' },
                  { name: 'Christmas Email', desc: 'Χριστουγεννιάτικα μηνύματα' },
                  { name: 'New Year Email', desc: 'Πρωτοχρονιάτικα μηνύματα' },
                  { name: 'Easter Email', desc: 'Πασχαλινά μηνύματα' },
                  { name: 'Summer Email', desc: 'Καλοκαιρινές προσφορές' },
                  { name: 'Autumn Email', desc: 'Φθινοπωρινές προσφορές' }
                ].map((template) => (
                  <div key={template.name} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <strong className="text-slate-900 text-sm">{template.name}</strong>
                    <p className="text-xs text-slate-600 mt-1">{template.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3">Επεξεργασία Template</h4>
              <ol className="list-decimal list-inside space-y-2 text-slate-700 ml-4">
                <li>Κάντε κλικ στο "Edit Template" σε ένα base template ή saved template</li>
                <li>Θα ανοίξει ο Template Editor με τις ακόλουθες επιλογές:</li>
              </ol>
              <div className="mt-4 space-y-3">
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <strong className="text-purple-900 block mb-2">1. Template Name:</strong>
                  <p className="text-sm text-purple-800">
                    Δώστε ένα όνομα στο template σας (π.χ. "Χριστουγεννιάτικο 2024")
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <strong className="text-purple-900 block mb-2">2. Template Content:</strong>
                  <p className="text-sm text-purple-800 mb-2">
                    Χρησιμοποιήστε τον rich text editor για να γράψετε το περιεχόμενο:
                  </p>
                  <ul className="list-disc list-inside text-xs text-purple-800 ml-4 space-y-1">
                    <li>Κάντε κλικ στο editor για να αρχίσετε να γράφετε</li>
                    <li>Χρησιμοποιήστε τα εργαλεία formatting (bold, italic, lists, κ.λπ.)</li>
                    <li>Μπορείτε να προσθέσετε links, εικόνες, και άλλα στοιχεία</li>
                  </ul>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <strong className="text-purple-900 block mb-2">3. Χρώματα:</strong>
                  <p className="text-sm text-purple-800">
                    Επιλέξτε χρώματα για primary, secondary, accent, background, και text. 
                    Μπορείτε να χρησιμοποιήσετε color pickers ή να εισάγετε hex codes.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <strong className="text-purple-900 block mb-2">4. Γραμματοσειρές:</strong>
                  <p className="text-sm text-purple-800">
                    Επιλέξτε γραμματοσειρές για headings και body text από τις dropdown λίστες.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <strong className="text-purple-900 block mb-2">5. Layout:</strong>
                  <p className="text-sm text-purple-800">
                    Ρυθμίστε border radius, padding, και spacing χρησιμοποιώντας τα sliders.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <strong className="text-purple-900 block mb-2">6. Logo:</strong>
                  <p className="text-sm text-purple-800">
                    Ρυθμίστε το μέγεθος και τη θέση του logo.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3">Preview & Save</h4>
              <ol className="list-decimal list-inside space-y-2 text-slate-700 ml-4">
                <li>Κάντε κλικ στο <Eye className="w-4 h-4 inline text-blue-600" /> "Preview" για να δείτε πώς θα φαίνεται το email</li>
                <li>Αν είστε ικανοποιημένοι, κάντε κλικ στο <Save className="w-4 h-4 inline text-green-600" /> "Save"</li>
                <li>Το template θα αποθηκευτεί και θα εμφανίζεται στη λίστα "Saved Templates"</li>
              </ol>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3">Saved Templates</h4>
              <p className="text-slate-700 leading-relaxed mb-3">
                Στη λίστα "Saved Templates" μπορείτε να:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                <li><strong>Επεξεργαστείτε:</strong> Κάντε κλικ στο template για να το επεξεργαστείτε</li>
                <li><strong>Στείλετε:</strong> Κάντε κλικ στο "Send" για να στείλετε το template απευθείας</li>
                <li><strong>Διαγράψετε:</strong> Χρησιμοποιήστε το κουμπί διαγραφής αν χρειάζεται</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Reviews */}
        <Section id="reviews" title="Reviews - Review Request System" icon={Star}>
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-slate-900 mb-3">Τι είναι το Review Request System;</h4>
              <p className="text-slate-700 leading-relaxed">
                Το Review Request System σας επιτρέπει να στέλνετε emails σε πελάτες που δεν είναι 
                συνδρομητές newsletter, ζητώντας τους να αφήσουν μια κριτική στο Google.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3">Πώς να Στείλετε Review Request</h4>
              <ol className="list-decimal list-inside space-y-2 text-slate-700 ml-4">
                <li>Κάντε κλικ στο κουμπί "Send Review Request"</li>
                <li>Θα ανοίξει ένα modal με φόρμα</li>
                <li>Συμπληρώστε τα παρακάτω πεδία:</li>
              </ol>
              <div className="mt-4 space-y-3">
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <strong className="text-orange-900 block mb-2">Emails:</strong>
                  <p className="text-sm text-orange-800">
                    Εισάγετε τα email addresses των πελατών, χωρισμένα με κόμμα (π.χ. 
                    email1@example.com, email2@example.com)
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <strong className="text-orange-900 block mb-2">Subject:</strong>
                  <p className="text-sm text-orange-800">
                    Το θέμα του email (μπορείτε να το προσαρμόσετε)
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <strong className="text-orange-900 block mb-2">Message:</strong>
                  <p className="text-sm text-orange-800">
                    Το περιεχόμενο του email. Μπορείτε να προσαρμόσετε το μήνυμα όπως θέλετε.
                  </p>
                </div>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-slate-700 ml-4 mt-4" start={4}>
                <li>Ελέγξτε τα δεδομένα</li>
                <li>Κάντε κλικ στο "Send"</li>
                <li>Το σύστημα θα στείλει το email σε όλα τα email addresses που εισάγατε</li>
              </ol>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3">Review Link</h4>
              <p className="text-slate-700 leading-relaxed mb-3">
                Το review link που χρησιμοποιείται είναι:
              </p>
              <div className="p-4 bg-slate-100 rounded-lg border border-slate-300">
                <code className="text-sm text-slate-800 break-all">
                  https://share.google/NTHvLOlobEIU7Ajm4
                </code>
              </div>
              <p className="text-sm text-slate-600 mt-2">
                Αυτός ο σύνδεσμος οδηγεί τους πελάτες απευθείας στη σελίδα Google reviews του Alexandra Rizou.
              </p>
            </div>
          </div>
        </Section>

        {/* Template Emails */}
        <Section id="template-emails" title="Template Emails - Έτοιμα Email Templates" icon={Send}>
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-slate-900 mb-3">Τι είναι το Template Email System;</h4>
              <p className="text-slate-700 leading-relaxed">
                Το Template Email System σας επιτρέπει να στέλνετε έτοιμα email templates για εορτές, 
                προσφορές και ειδικές περιστάσεις χωρίς να χρειάζεται να τα δημιουργήσετε από την αρχή.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3">Πώς να Στείλετε Template Email</h4>
              <ol className="list-decimal list-inside space-y-2 text-slate-700 ml-4">
                <li>Κάντε κλικ στο κουμπί "Send Template Email"</li>
                <li>Θα ανοίξει ένα modal με διαθέσιμα templates</li>
                <li>Επιλέξτε το template που θέλετε (π.χ. Χριστούγεννα 2024, Πάσχα 2024, κ.λπ.)</li>
                <li>Συμπληρώστε τα απαιτούμενα πεδία (email addresses, προσαρμογές, κ.λπ.)</li>
                <li>Κάντε κλικ στο "Send"</li>
              </ol>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3">Διαθέσιμα Templates</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { name: '🎄 Χριστούγεννα 2024', type: 'Εορτές' },
                  { name: '🐣 Πάσχα 2024', type: 'Εορτές' },
                  { name: '☀️ Καλοκαιρινή Προσφορά', type: 'Προσφορές' },
                  { name: '🎊 Πρωτοχρονιά 2024', type: 'Εορτές' },
                  { name: '💕 Αγίου Βαλεντίνου', type: 'Εορτές' }
                ].map((template) => (
                  <div key={template.name} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <strong className="text-slate-900 text-sm block">{template.name}</strong>
                    <span className="text-xs text-slate-600 mt-1 inline-block px-2 py-1 bg-slate-200 rounded">
                      {template.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Holiday Schedule */}
        <Section id="christmas-schedule" title="Ειδικά Ωράρια - Holiday Schedules" icon={Snowflake}>
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-slate-900 mb-3">Τι είναι το Holiday Schedule System;</h4>
              <p className="text-slate-700 leading-relaxed">
                Το Holiday Schedule System σας επιτρέπει να ορίσετε ειδικά ωράρια λειτουργίας 
                για διάφορες εορτές και περιόδους (Χριστούγεννα, Πάσχα, Καλοκαίρι, κ.λπ.).
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3">Δημιουργία Νέου Schedule</h4>
              <ol className="list-decimal list-inside space-y-2 text-slate-700 ml-4">
                <li>Κάντε κλικ στο κουμπί <Plus className="w-4 h-4 inline text-blue-600" /> "Νέο Schedule"</li>
                <li>Συμπληρώστε τα παρακάτω πεδία:</li>
              </ol>
              <div className="mt-4 space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <strong className="text-blue-900 block mb-2">Όνομα:</strong>
                  <p className="text-sm text-blue-800">
                    Δώστε ένα όνομα στο schedule (π.χ. "Χριστουγεννιάτικο 2024")
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <strong className="text-blue-900 block mb-2">Τύπος:</strong>
                  <p className="text-sm text-blue-800">
                    Επιλέξτε τον τύπο (Χριστούγεννα, Πρωτοχρονιά, Πάσχα, Θερινό, Άλλο)
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <strong className="text-blue-900 block mb-2">Ωράρια ανά Ημέρα:</strong>
                  <p className="text-sm text-blue-800 mb-2">
                    Για κάθε ημέρα της εβδομάδας:
                  </p>
                  <ul className="list-disc list-inside text-xs text-blue-800 ml-4 space-y-1">
                    <li>Επιλέξτε ημερομηνία (αν είναι συγκεκριμένη ημέρα)</li>
                    <li>Εισάγετε ώρες (π.χ. "10:00-18:00") ή επιλέξτε από presets</li>
                    <li>Επιλέξτε "Κλειστά" αν το salon είναι κλειστό εκείνη την ημέρα</li>
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <strong className="text-blue-900 block mb-2">Closure Notices:</strong>
                  <p className="text-sm text-blue-800 mb-2">
                    Προσθέστε ειδικές ανακοινώσεις για κλεισίματα:
                  </p>
                  <ul className="list-disc list-inside text-xs text-blue-800 ml-4 space-y-1">
                    <li>Κάντε κλικ στο "Προσθήκη Closure Notice"</li>
                    <li>Συμπληρώστε τίτλο, ημερομηνία έναρξης, και ημερομηνία λήξης</li>
                    <li>Αυτές οι ανακοινώσεις θα εμφανίζονται στους πελάτες</li>
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <strong className="text-blue-900 block mb-2">Ενεργοποίηση:</strong>
                  <p className="text-sm text-blue-800">
                    Επιλέξτε "Ενεργό" για να ενεργοποιήσετε το schedule και "Εμφάνιση Ανακοίνωσης" 
                    αν θέλετε να εμφανίζεται ειδική ανακοίνωση.
                  </p>
                </div>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-slate-700 ml-4 mt-4" start={3}>
                <li>Κάντε κλικ στο <Save className="w-4 h-4 inline text-green-600" /> "Αποθήκευση"</li>
                <li>Το schedule θα αποθηκευτεί και θα είναι διαθέσιμο για χρήση</li>
              </ol>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3">Επεξεργασία & Διαγραφή</h4>
              <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                <li><strong>Επεξεργασία:</strong> Κάντε κλικ σε ένα schedule από τη λίστα για να το επεξεργαστείτε</li>
                <li><strong>Διαγραφή:</strong> Χρησιμοποιήστε το κουμπί <Trash2 className="w-4 h-4 inline text-red-600" /> για διαγραφή</li>
                <li><strong>Ενεργοποίηση/Απενεργοποίηση:</strong> Χρησιμοποιήστε το toggle "Ενεργό" για να ενεργοποιήσετε ή απενεργοποιήσετε ένα schedule</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Announcements */}
        <Section id="announcements" title="Ανακοινώσεις - Announcements" icon={Bell}>
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-slate-900 mb-3">Τι είναι το Announcement System;</h4>
              <p className="text-slate-700 leading-relaxed">
                Το Announcement System σας επιτρέπει να δημιουργείτε και να διαχειρίζεστε ανακοινώσεις 
                που εμφανίζονται στους επισκέπτες της ιστοσελίδας σας.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3">Δημιουργία Νέας Ανακοίνωσης</h4>
              <ol className="list-decimal list-inside space-y-2 text-slate-700 ml-4">
                <li>Κάντε κλικ στο κουμπί <Plus className="w-4 h-4 inline text-blue-600" /> "Νέα Ανακοίνωση"</li>
                <li>Συμπληρώστε τα παρακάτω πεδία:</li>
              </ol>
              <div className="mt-4 space-y-3">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <strong className="text-slate-900 block mb-2">Τύπος:</strong>
                  <p className="text-sm text-slate-700 mb-2">
                    Επιλέξτε τον τύπο της ανακοίνωσης:
                  </p>
                  <ul className="list-disc list-inside text-xs text-slate-700 ml-4 space-y-1">
                    <li><strong>Πληροφορία:</strong> Για γενικές πληροφορίες</li>
                    <li><strong>Προειδοποίηση:</strong> Για προειδοποιήσεις</li>
                    <li><strong>Επιτυχία:</strong> Για επιτυχημένα μηνύματα</li>
                    <li><strong>Σφάλμα:</strong> Για σφάλματα</li>
                    <li><strong>Ανακοίνωση:</strong> Για γενικές ανακοινώσεις</li>
                    <li><strong>Προσφορά:</strong> Για προσφορές</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <strong className="text-slate-900 block mb-2">Προτεραιότητα:</strong>
                  <p className="text-sm text-slate-700">
                    Επιλέξτε προτεραιότητα (Χαμηλή, Μέτρια, Υψηλή) - αυτό καθορίζει πόσο εμφανής 
                    θα είναι η ανακοίνωση.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <strong className="text-slate-900 block mb-2">Τίτλος:</strong>
                  <p className="text-sm text-slate-700">
                    Συμπληρώστε τον τίτλο στα Ελληνικά και στα English (αμφότερα υποχρεωτικά).
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <strong className="text-slate-900 block mb-2">Μήνυμα:</strong>
                  <p className="text-sm text-slate-700">
                    Συμπληρώστε το μήνυμα στα Ελληνικά και στα English (αμφότερα υποχρεωτικά).
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <strong className="text-slate-900 block mb-2">Link (Προαιρετικό):</strong>
                  <p className="text-sm text-slate-700">
                    Μπορείτε να προσθέσετε ένα link URL και link text (στα Ελληνικά και English) 
                    αν θέλετε η ανακοίνωση να οδηγεί κάπου.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <strong className="text-slate-900 block mb-2">Ημερομηνίες:</strong>
                  <p className="text-sm text-slate-700">
                    Ορίστε ημερομηνία έναρξης και λήξης (προαιρετικά). Αν δεν ορίσετε, η ανακοίνωση 
                    θα είναι πάντα ενεργή (αν είναι ενεργοποιημένη).
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <strong className="text-slate-900 block mb-2">Σελίδες Εμφάνισης:</strong>
                  <p className="text-sm text-slate-700 mb-2">
                    Προσθέστε συγκεκριμένες σελίδες όπου θέλετε να εμφανίζεται η ανακοίνωση 
                    (π.χ. "/", "/services", "/about"). Αν δεν προσθέσετε καμία, θα εμφανίζεται 
                    σε όλες τις σελίδες.
                  </p>
                  <p className="text-xs text-slate-600">
                    Πληκτρολογήστε το path (π.χ. "/") και κάντε κλικ στο "Προσθήκη".
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <strong className="text-slate-900 block mb-2">Επιλογές:</strong>
                  <ul className="list-disc list-inside text-xs text-slate-700 ml-4 space-y-1">
                    <li><strong>Ενεργή:</strong> Ενεργοποιεί ή απενεργοποιεί την ανακοίνωση</li>
                    <li><strong>Κλείσιμο από χρήστη:</strong> Επιτρέπει στους χρήστες να κλείσουν την ανακοίνωση</li>
                  </ul>
                </div>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-slate-700 ml-4 mt-4" start={3}>
                <li>Κάντε κλικ στο <Save className="w-4 h-4 inline text-green-600" /> "Αποθήκευση"</li>
                <li>Η ανακοίνωση θα αποθηκευτεί και θα εμφανίζεται στους επισκέπτες (αν είναι ενεργή)</li>
              </ol>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3">Επεξεργασία & Διαγραφή</h4>
              <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                <li><strong>Επεξεργασία:</strong> Κάντε κλικ σε μια ανακοίνωση από τη λίστα για να την επεξεργαστείτε</li>
                <li><strong>Διαγραφή:</strong> Χρησιμοποιήστε το κουμπί <Trash2 className="w-4 h-4 inline text-red-600" /> για διαγραφή</li>
                <li><strong>Ενεργοποίηση/Απενεργοποίηση:</strong> Χρησιμοποιήστε το checkbox "Ενεργή"</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Analytics */}
        <Section id="analytics" title="Analytics - Ανάλυση Δεδομένων" icon={Activity}>
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-slate-900 mb-3">Τι είναι το Analytics Dashboard;</h4>
              <p className="text-slate-700 leading-relaxed">
                Το Analytics Dashboard σας παρέχει αναλυτικά στοιχεία για την επισκεψιμότητα 
                της ιστοσελίδας σας, βοηθώντας σας να κατανοήσετε τη συμπεριφορά των επισκεπτών.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3">Χρονικές Περιόδους</h4>
              <p className="text-slate-700 leading-relaxed mb-3">
                Μπορείτε να επιλέξετε διαφορετικές χρονικές περιόδους:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                <li><strong>Σήμερα:</strong> Στατιστικά για σήμερα</li>
                <li><strong>Εβδομάδα:</strong> Στατιστικά για τις τελευταίες 7 ημέρες</li>
                <li><strong>Μήνας:</strong> Στατιστικά για τον τρέχοντα μήνα</li>
                <li><strong>Όλο το χρόνο:</strong> Στατιστικά για όλο το έτος</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3">Μετρικές</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                  <strong className="text-cyan-900 block mb-2">Σύνολο Επισκέψεων:</strong>
                  <p className="text-sm text-cyan-800">
                    Συνολικός αριθμός επισκέψεων (page views) στην επιλεγμένη περίοδο.
                  </p>
                </div>
                <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                  <strong className="text-cyan-900 block mb-2">Μοναδικοί Επισκέπτες:</strong>
                  <p className="text-sm text-cyan-800">
                    Αριθμός μοναδικών επισκεπτών (unique visitors) στην επιλεγμένη περίοδο.
                  </p>
                </div>
                <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                  <strong className="text-cyan-900 block mb-2">Κορυφαίες Σελίδες:</strong>
                  <p className="text-sm text-cyan-800">
                    Λίστα με τις σελίδες που έχουν τις περισσότερες επισκέψεις.
                  </p>
                </div>
                <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                  <strong className="text-cyan-900 block mb-2">Τάσεις:</strong>
                  <p className="text-sm text-cyan-800">
                    Γραφήματα που δείχνουν τις τάσεις επισκεψιμότητας με την πάροδο του χρόνου.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3">Ανανέωση Δεδομένων</h4>
              <p className="text-slate-700 leading-relaxed">
                Τα analytics ενημερώνονται αυτόματα κάθε 30 δευτερόλεπτα. Μπορείτε επίσης να 
                κάνετε manual refresh χρησιμοποιώντας το κουμπί ανανέωσης.
              </p>
            </div>
          </div>
        </Section>

        {/* Appointments */}
        <Section id="appointments" title="Ραντεβού - Appointments" icon={Calendar}>
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-slate-900 mb-3">Διαχείριση Ραντεβού</h4>
              <p className="text-slate-700 leading-relaxed">
                Η διαχείριση ραντεβού γίνεται μέσω του <strong>AcronFlow CRM</strong>. 
                Στο admin panel υπάρχει ένα banner που σας οδηγεί απευθείας στο CRM.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3">Πώς να Ανοίξετε το CRM</h4>
              <ol className="list-decimal list-inside space-y-2 text-slate-700 ml-4">
                <li>Στο Dashboard, βρείτε το banner "Διαχείριση Ραντεβού"</li>
                <li>Κάντε κλικ στο κουμπί "Άνοιγμα"</li>
                <li>Θα ανοίξει το AcronFlow CRM σε νέο παράθυρο/tab</li>
                <li>Στο CRM μπορείτε να δημιουργήσετε, επεξεργαστείτε, και διαχειριστείτε ραντεβού</li>
              </ol>
            </div>

            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
              <p className="text-sm text-green-800">
                <strong>Σημείωση:</strong> Το AcronFlow CRM είναι ένα ξεχωριστό σύστημα που 
                παρέχει πλήρη διαχείριση ραντεβού, πελατών, και άλλων CRM λειτουργιών.
              </p>
            </div>
          </div>
        </Section>

        {/* Tips & Best Practices */}
        <Section id="tips" title="Συμβουλές & Best Practices" icon={Settings}>
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-slate-900 mb-3">Γενικές Συμβουλές</h4>
              <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                <li>Κάντε regular backups των δεδομένων σας</li>
                <li>Ελέγχετε τα analytics τακτικά για να κατανοήσετε τη συμπεριφορά των επισκεπτών</li>
                <li>Χρησιμοποιήστε τα templates για να εξοικονομήσετε χρόνο</li>
                <li>Δοκιμάστε τα emails σε preview πριν τα στείλετε</li>
                <li>Ενημερώστε τα holiday schedules εκ των προτέρων</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3">Email Best Practices</h4>
              <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                <li>Χρησιμοποιήστε προσωποποιημένα μηνύματα</li>
                <li>Κρατήστε τα emails σύντομα και ευανάγνωστα</li>
                <li>Προσθέστε clear call-to-action (CTA)</li>
                <li>Δοκιμάστε τα emails σε διαφορετικές συσκευές</li>
                <li>Αποφύγετε το spam - μην στέλνετε πολλά emails σε σύντομο χρονικό διάστημα</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3">Announcement Best Practices</h4>
              <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                <li>Χρησιμοποιήστε σαφείς και σύντομους τίτλους</li>
                <li>Ορίστε σωστές ημερομηνίες έναρξης/λήξης</li>
                <li>Επιλέξτε τον σωστό τύπο (info, warning, success, κ.λπ.)</li>
                <li>Χρησιμοποιήστε target pages για να εμφανίζονται μόνο όπου χρειάζεται</li>
                <li>Κάντε τις ανακοινώσεις dismissible αν είναι πληροφορίες που δεν χρειάζονται να είναι πάντα ορατές</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3">Troubleshooting</h4>
              <div className="space-y-3">
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <strong className="text-red-900 block mb-2">Πρόβλημα: Emails δεν αποστέλλονται</strong>
                  <ul className="list-disc list-inside text-sm text-red-800 ml-4 space-y-1">
                    <li>Ελέγξτε αν υπάρχουν συνδρομητές στη λίστα</li>
                    <li>Ελέγξτε αν τα email addresses είναι έγκυρα</li>
                    <li>Ελέγξτε τα console logs για errors</li>
                  </ul>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <strong className="text-red-900 block mb-2">Πρόβλημα: Announcements δεν εμφανίζονται</strong>
                  <ul className="list-disc list-inside text-sm text-red-800 ml-4 space-y-1">
                    <li>Ελέγξτε αν η ανακοίνωση είναι "Ενεργή"</li>
                    <li>Ελέγξτε τις ημερομηνίες έναρξης/λήξης</li>
                    <li>Ελέγξτε αν οι target pages είναι σωστές</li>
                  </ul>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <strong className="text-red-900 block mb-2">Πρόβλημα: Analytics δεν φορτώνουν</strong>
                  <ul className="list-disc list-inside text-sm text-red-800 ml-4 space-y-1">
                    <li>Ελέγξτε τη σύνδεση στο internet</li>
                    <li>Κάντε refresh τη σελίδα</li>
                    <li>Ελέγξτε τα console logs για errors</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Footer */}
        <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Έχετε Ερωτήσεις;
          </h3>
          <p className="text-slate-700 mb-4">
            Αν χρειάζεστε βοήθεια ή έχετε ερωτήσεις, μην διστάσετε να επικοινωνήσετε με την ομάδα υποστήριξης.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
            <Info className="w-4 h-4" />
            <span>Αυτός ο οδηγός ενημερώνεται τακτικά με νέες λειτουργίες</span>
          </div>
        </div>
      </div>
    </div>
  );
}

