"use client";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import SEOPlugin from "@/components/SEOPlugin";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Contact() {
    const { toast } = useToast();
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast({
                    title: t("contact.form.success.title"),
                    description: t("contact.form.success.desc"),
                });
                setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
            } else {
                toast({
                    title: "Σφάλμα",
                    description: data.error || "Προέκυψε σφάλμα κατά την αποστολή του μηνύματος. Παρακαλώ δοκιμάστε ξανά.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Error submitting contact form:', error);
            toast({
                title: "Σφάλμα",
                description: "Προέκυψε σφάλμα κατά την αποστολή του μηνύματος. Παρακαλώ δοκιμάστε ξανά.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen">
            <SEOPlugin pageType="contact" />
            <Navigation />
            <Breadcrumbs />

            {/* Hero Section */}
            <section className="pt-24 pb-12 md:pt-32 md:pb-16 px-4 md:px-8">
                <div className="container-custom max-w-7xl mx-auto">
                    <PageHeader
                        title={t("contact.hero.title")}
                        subtitle={t("contact.hero.subtitle")}
                        icon="/telephone_3988115.png"
                    />
                </div>
            </section>

            {/* Contact Info & Form - Elegant Minimal Design */}
            <section className="relative py-20 md:py-28 px-4 md:px-8">
                {/* Subtle Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-primary/3 dark:to-primary/8" />
                
                <div className="container-custom relative z-10 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
                        {/* Contact Information - Clean & Elegant */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-junicode font-bold text-foreground dark:text-white mb-4 leading-tight">
                                    {t("contact.info.title")}
                                </h2>
                                <p className="text-base md:text-lg text-muted-foreground dark:text-white/70 leading-relaxed">
                                    {t("contact.info.subtitle")}
                                </p>
                            </div>

                            {/* Elegant Contact Items */}
                            <div className="space-y-6">
                                {/* Address */}
                                <div className="group flex items-start gap-5 p-6 rounded-2xl border border-primary/10 dark:border-white/10 bg-white/60 dark:bg-[#1a2e1f]/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-[#1a2e1f]/80 hover:border-primary/20 dark:hover:border-white/20 transition-all duration-300">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 dark:group-hover:bg-primary/25 transition-colors duration-300">
                                        <MapPin className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-foreground dark:text-white mb-2">
                                            {t("contact.visit.title")}
                                        </h3>
                                        <p className="text-sm md:text-base text-muted-foreground dark:text-white/70 leading-relaxed">
                                            Ανδρέα Παπανδρέου 52<br />
                                            Χαλάνδρι, 152 32
                                        </p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="group flex items-start gap-5 p-6 rounded-2xl border border-primary/10 dark:border-white/10 bg-white/60 dark:bg-[#1a2e1f]/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-[#1a2e1f]/80 hover:border-primary/20 dark:hover:border-white/20 transition-all duration-300">
                                    <div className="w-12 h-12 rounded-xl bg-accent/10 dark:bg-accent/20 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/15 dark:group-hover:bg-accent/25 transition-colors duration-300">
                                        <Phone className="h-5 w-5 text-accent" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-foreground dark:text-white mb-2">
                                            {t("contact.call.title")}
                                        </h3>
                                        <a href="tel:+302106818011" className="text-sm md:text-base text-muted-foreground dark:text-white/70 hover:text-primary dark:hover:text-primary/90 transition-colors duration-300">
                                            +3021 0681 8011
                                        </a>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="group flex items-start gap-5 p-6 rounded-2xl border border-primary/10 dark:border-white/10 bg-white/60 dark:bg-[#1a2e1f]/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-[#1a2e1f]/80 hover:border-primary/20 dark:hover:border-white/20 transition-all duration-300">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 dark:group-hover:bg-primary/25 transition-colors duration-300">
                                        <Mail className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-foreground dark:text-white mb-2">
                                            {t("contact.email.title")}
                                        </h3>
                                        <a href="mailto:ar.hairbeauty.healthservices@gmail.com" className="text-sm md:text-base text-muted-foreground dark:text-white/70 hover:text-primary dark:hover:text-primary/90 transition-colors duration-300 break-all">
                                            ar.hairbeauty.healthservices@gmail.com
                                        </a>
                                    </div>
                                </div>

                                {/* Hours */}
                                <div className="group flex items-start gap-5 p-6 rounded-2xl border border-primary/10 dark:border-white/10 bg-white/60 dark:bg-[#1a2e1f]/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-[#1a2e1f]/80 hover:border-primary/20 dark:hover:border-white/20 transition-all duration-300">
                                    <div className="w-12 h-12 rounded-xl bg-accent/10 dark:bg-accent/20 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/15 dark:group-hover:bg-accent/25 transition-colors duration-300">
                                        <Clock className="h-5 w-5 text-accent" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-foreground dark:text-white mb-3">
                                            {t("contact.hours.title")}
                                        </h3>
                                        <div className="text-sm md:text-base text-muted-foreground dark:text-white/70 space-y-1.5">
                                            <p>{t("contact.hours.monday")}</p>
                                            <p>{t("contact.hours.tuesday")}</p>
                                            <p>{t("contact.hours.wednesday")}</p>
                                            <p>{t("contact.hours.thursday")}</p>
                                            <p>{t("contact.hours.friday")}</p>
                                            <p>{t("contact.hours.saturday")}</p>
                                            <p>{t("contact.hours.sunday")}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form - Clean & Elegant */}
                        <div className="lg:sticky lg:top-24">
                            <div className="relative rounded-3xl border border-primary/10 dark:border-white/10 bg-white/80 dark:bg-[#1a2e1f]/80 backdrop-blur-xl p-8 md:p-10 shadow-lg">
                                <div className="mb-8">
                                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-junicode font-bold text-foreground dark:text-white mb-2">
                                        {t("contact.form.title")}
                                    </h2>
                                    <p className="text-sm text-muted-foreground dark:text-white/60">
                                        {t("contact.form.subtitle") || "Fill out the form below and we'll get back to you soon."}
                                    </p>
                                </div>
                                
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="block text-sm font-medium text-foreground dark:text-white">
                                            {t("contact.form.name")}
                                        </label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder={t("contact.form.namePlaceholder")}
                                            className="w-full h-11 rounded-lg border border-primary/20 dark:border-white/10 bg-white dark:bg-[#1a2e1f] focus:border-primary/40 dark:focus:border-primary/40 transition-colors duration-300"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="email" className="block text-sm font-medium text-foreground dark:text-white">
                                            {t("contact.form.email")}
                                        </label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder={t("contact.form.emailPlaceholder")}
                                            className="w-full h-11 rounded-lg border border-primary/20 dark:border-white/10 bg-white dark:bg-[#1a2e1f] focus:border-primary/40 dark:focus:border-primary/40 transition-colors duration-300"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="block text-sm font-medium text-foreground dark:text-white">
                                            {t("contact.form.phone")}
                                        </label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder={t("contact.form.phonePlaceholder")}
                                            className="w-full h-11 rounded-lg border border-primary/20 dark:border-white/10 bg-white dark:bg-[#1a2e1f] focus:border-primary/40 dark:focus:border-primary/40 transition-colors duration-300"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="subject" className="block text-sm font-medium text-foreground dark:text-white">
                                            {t("contact.form.subject")}
                                        </label>
                                        <select
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="w-full h-11 rounded-lg border border-primary/20 dark:border-white/10 bg-white dark:bg-[#1a2e1f] focus:border-primary/40 dark:focus:border-primary/40 transition-colors duration-300 px-3 text-sm text-foreground dark:text-white"
                                        >
                                            <option value="">{t("contact.form.subjectPlaceholder")}</option>
                                            <option value="appointment">{t("contact.form.subject.appointment")}</option>
                                            <option value="services">{t("contact.form.subject.services")}</option>
                                            <option value="pricing">{t("contact.form.subject.pricing")}</option>
                                            <option value="hours">{t("contact.form.subject.hours")}</option>
                                            <option value="location">{t("contact.form.subject.location")}</option>
                                            <option value="complaint">{t("contact.form.subject.complaint")}</option>
                                            <option value="compliment">{t("contact.form.subject.compliment")}</option>
                                            <option value="other">{t("contact.form.subject.other")}</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="message" className="block text-sm font-medium text-foreground dark:text-white">
                                            {t("contact.form.message")}
                                        </label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            placeholder={t("contact.form.messagePlaceholder")}
                                            rows={6}
                                            className="w-full rounded-lg border border-primary/20 dark:border-white/10 bg-white dark:bg-[#1a2e1f] focus:border-primary/40 dark:focus:border-primary/40 transition-colors duration-300 resize-none"
                                        />
                                    </div>

                                    <Button 
                                        type="submit" 
                                        disabled={isLoading}
                                        className="w-full h-12 rounded-lg text-base font-semibold bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? "Αποστολή..." : t("contact.form.submit")}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section - Clean Design */}
            <section className="relative py-20 md:py-28 px-4 md:px-8">
                <div className="absolute inset-0 bg-gradient-to-b from-background to-primary/3 dark:to-primary/8" />
                <div className="container-custom relative z-10 max-w-7xl mx-auto">
                    <div className="mb-10 text-center">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-junicode font-bold text-foreground dark:text-white mb-3">
                            {t("contact.map.title") || "Η Τοποθεσία μας"}
                        </h2>
                        <p className="text-base text-muted-foreground dark:text-white/70">
                            {t("contact.map.subtitle") || "Ελάτε να μας επισκεφτείτε στο σαλόνι μας"}
                        </p>
                    </div>
                    <div className="relative rounded-2xl overflow-hidden shadow-xl border border-primary/10 dark:border-white/10 h-[450px] md:h-[550px]">
                        <iframe
                            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Αλεξάνδρα+Ρίζου+-+Hair+Beauty+%26+Health+Services,Ανδρέα+Παπανδρέου+52,Χαλάνδρι&zoom=16"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            title="Αλεξάνδρα Ρίζου - Hair Beauty & Health Services"
                        />
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

