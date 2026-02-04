"use client"

import { useParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Scissors, Sparkles, Star, MapPin, Phone, Calendar, ArrowRight, CheckCircle2, Heart, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const locations: Record<string, { name: string, nameEn: string, nameAccusative: string, prep: string }> = {
    'agia-paraskevi': { name: 'Αγία Παρασκευή', nameEn: 'Agia Paraskevi', nameAccusative: 'την Αγία Παρασκευή', prep: 'στην' },
    'vrilissia': { name: 'Βριλήσσια', nameEn: 'Vrilissia', nameAccusative: 'τα Βριλήσσια', prep: 'στα' },
    'marousi': { name: 'Μαρούσι', nameEn: 'Marousi', nameAccusative: 'το Μαρούσι', prep: 'στο' },
    'cholargos': { name: 'Χολαργός', nameEn: 'Cholargos', nameAccusative: 'τον Χολαργό', prep: 'στον' },
    'psychiko': { name: 'Ψυχικό', nameEn: 'Psychiko', nameAccusative: 'το Ψυχικό', prep: 'στο' },
    'gerakas': { name: 'Γέρακας', nameEn: 'Gerakas', nameAccusative: 'τον Γέρακα', prep: 'στον' },
    'melissia': { name: 'Μελίσσια', nameEn: 'Melissia', nameAccusative: 'τα Μελίσσια', prep: 'στα' },
    'pefki': { name: 'Πεύκη', nameEn: 'Pefki', nameAccusative: 'την Πεύκη', prep: 'στην' },
    'nea-filadelfeia': { name: 'Νέα Φιλαδέλφεια', nameEn: 'Nea Filadelfeia', nameAccusative: 'τη Νέα Φιλαδέλφεια', prep: 'στη' },
    'filothei': { name: 'Φιλοθέη', nameEn: 'Filothei', nameAccusative: 'τη Φιλοθέη', prep: 'στη' },
    'chalandri': { name: 'Χαλάνδρι', nameEn: 'Chalandri', nameAccusative: 'το Χαλάνδρι', prep: 'στο' }
};

export default function LocationPage() {
    const params = useParams();
    const slug = params.slug as string;
    const { t, language } = useLanguage();

    // Default to Chalandri if slug not found
    const location = locations[slug] || locations['chalandri'];
    const isEn = language === 'en';

    const features = [
        {
            icon: Scissors,
            title: isEn ? "Expert Hair Styling" : "Εξειδικευμένο Styling",
            desc: isEn ? "Award-winning techniques for the perfect look." : "Βραβευμένες τεχνικές για το τέλειο αποτέλεσμα."
        },
        {
            icon: Sparkles,
            title: isEn ? "Premium Balayage" : "Premium Balayage",
            desc: isEn ? "Natural-looking highlights and color transitions." : "Φυσικές ανταύγειες και μεταβάσεις χρώματος."
        },
        {
            icon: Heart,
            title: isEn ? "Nails & Beauty" : "Νύχια & Ομορφιά",
            desc: isEn ? "Professional manicure, pedicure, and waxing." : "Επαγγελματικό μανικιούρ, πεντικιούρ και αποτρίχωση."
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5 -z-10" />
                <div className="container-custom px-4 md:px-8 max-w-7xl mx-auto">
                    <div className="flex flex-col items-center text-center space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20"
                        >
                            <MapPin className="w-4 h-4" />
                            {isEn ? `Serving ${location.nameEn}` : `Εξυπηρετούμε ${location.nameAccusative}`}
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl lg:text-7xl font-bold font-junicode leading-tight"
                        >
                            {isEn ? (
                                <>Premier Hair Salon Near <span className="text-primary">{location.nameEn}</span></>
                            ) : (
                                <>Κρυμμένο Διαμάντι στο Χαλάνδρι για {location.nameAccusative}</>
                            )}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg md:text-xl text-muted-foreground max-w-3xl"
                        >
                            {isEn ? (
                                `Alexandra Rizou Coiffure brings high-end hair and beauty services to ${location.nameEn}. Discover award-winning styling, professional coloring, and premium nail care just minutes away in Chalandri.`
                            ) : (
                                `Η Alexandra Rizou Coiffure προσφέρει υπηρεσίες υψηλής αισθητικής για τα μαλλιά και τα άκρα σας. Ανακαλύψτε το βραβευμένο μας κομμωτήριο στο Χαλάνδρι, σε απόσταση αναπνοής από ${location.nameAccusative}.`
                            )}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Link href="/contact">
                                <Button size="lg" className="h-14 px-8 text-base font-bold rounded-2xl gap-2">
                                    <Calendar className="w-5 h-5" />
                                    {isEn ? "Book Your Appointment" : "Κλείστε Ραντεβού"}
                                </Button>
                            </Link>
                            <Link href="/services">
                                <Button size="lg" variant="outline" className="h-14 px-8 text-base font-bold rounded-2xl gap-2">
                                    {isEn ? "View Services" : "Δείτε τις Υπηρεσίες"}
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse" />
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '2s' }} />
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-muted/30">
                <div className="container-custom px-4 md:px-8 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-8 rounded-3xl bg-background border-2 border-primary/10 shadow-lg hover:shadow-xl transition-all"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 font-junicode">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Us Section */}
            <section className="py-24">
                <div className="container-custom px-4 md:px-8 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <h2 className="text-4xl md:text-5xl font-bold font-junicode leading-tight">
                                {isEn ? (
                                    <>Why Choose Alexandra Rizou Near <span className="text-primary">{location.nameEn}</span></>
                                ) : (
                                    <>Γιατί να επιλέξετε την Alexandra Rizou {location.prep} {location.name}</>
                                )}
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {isEn ? (
                                    `Located in the heart of Chalandri, our salon is easily accessible from ${location.nameEn}. We provide a unique blend of artistry and technical expertise, ensuring every client leaves feeling their absolute best.`
                                ) : (
                                    `Βρισκόμαστε στην καρδιά του Χαλανδρίου, σε ένα σημείο με εύκολη πρόσβαση από ${location.nameAccusative}. Συνδυάζουμε την καλλιτεχνική δημιουργία με την τεχνική εξειδίκευση, προσφέροντας ένα αποτέλεσμα που αναδεικνύει την προσωπικότητά σας.`
                                )}
                            </p>
                            <ul className="space-y-4">
                                {[
                                    isEn ? "Gold Medal Beauty Awards 2025" : "Χρυσό Μετάλλιο Beauty Awards 2025",
                                    isEn ? "Specialized Balayage & Highlights" : "Εξειδίκευση σε Balayage & Ανταύγειες",
                                    isEn ? "Premium Hair Care Products" : "Premium Προϊόντα Περιποίησης",
                                    isEn ? "Manicure, Pedicure & Waxing" : "Μανικιούρ, Πεντικιούρ & Αποτρίχωση"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3 font-medium">
                                        <CheckCircle2 className="w-5 h-5 text-primary" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative group"
                        >
                            <div className="absolute -inset-4 bg-primary/10 rounded-[2rem] blur-2xl group-hover:bg-primary/20 transition-all duration-500" />
                            <div className="relative rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl">
                                <Image
                                    src="/assets/hero-salon.jpg"
                                    alt="Alexandra Rizou Salon Interior"
                                    width={600}
                                    height={800}
                                    className="w-full h-auto"
                                />
                            </div>
                            <div className="absolute -bottom-6 -left-6 p-6 bg-white rounded-3xl shadow-xl border border-primary/20 animate-bounce-slow">
                                <Award className="w-10 h-10 text-primary mb-2" />
                                <div className="text-sm font-bold">{isEn ? "Top Rated" : "Κορυφαία Αξιολόγηση"}</div>
                                <div className="text-xs text-muted-foreground">Google Maps 5.0 ★</div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Map/Contact Sneak Peek */}
            <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_70%)]" />
                <div className="container-custom px-4 md:px-8 max-w-7xl mx-auto relative z-10 text-center space-y-8">
                    <h2 className="text-3xl md:text-5xl font-bold font-junicode">
                        {isEn ? (
                            `Visit Us Today from ${location.nameEn}`
                        ) : (
                            `Ελάτε να μας γνωρίσετε από ${location.nameAccusative}`
                        )}
                    </h2>
                    <p className="text-xl opacity-90 max-w-2xl mx-auto">
                        {isEn ? (
                            "We are located at Andrea Papandreou 52, Chalandri. Just a short drive or public transport ride away."
                        ) : (
                            "Θα μας βρείτε στην Ανδρέα Παπανδρέου 52, στο Χαλάνδρι. Εύκολη πρόσβαση και άνετο περιβάλλον."
                        )}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                        <a href="tel:+302106818011" className="flex items-center gap-3 px-8 py-4 bg-white text-primary rounded-2xl font-bold text-lg hover:scale-105 transition-all">
                            <Phone className="w-6 h-6" />
                            210 6818 011
                        </a>
                        <Link href="/contact" className="flex items-center gap-3 px-8 py-4 bg-primary-foreground/10 border-2 border-primary-foreground/20 text-white rounded-2xl font-bold text-lg hover:bg-primary-foreground/20 transition-all">
                            <MapPin className="w-6 h-6" />
                            {isEn ? "Get Directions" : "Οδηγίες Χάρτη"}
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
