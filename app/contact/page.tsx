"use client";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
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
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: t("contact.form.success.title"),
            description: t("contact.form.success.desc"),
        });
        setFormData({ name: "", email: "", phone: "", message: "" });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen">
            <Navigation />

            {/* Hero Section */}
            <section className="pt-32 pb-16 section-padding bg-gradient-to-br from-primary/5 via-background to-accent/5">
                <div className="container-custom text-center">
                    <h1 className="heading-primary mb-6">{t("contact.hero.title")}</h1>
                    <p className="text-body text-muted-foreground max-w-2xl mx-auto">
                        {t("contact.hero.subtitle")}
                    </p>
                </div>
            </section>

            {/* Contact Info & Form */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Information */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="heading-secondary mb-6">{t("contact.info.title")}</h2>
                                <p className="text-body text-muted-foreground mb-8">
                                    {t("contact.info.subtitle")}
                                </p>
                            </div>

                            <Card className="card-service">
                                <div className="flex items-start space-x-4">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-2">{t("contact.visit.title")}</h3>
                                        <p className="text-muted-foreground text-sm">
                                            Ανδρέα Παπανδρέου 52<br />
                                            Χαλάνδρι, 152 32
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            <Card className="card-service">
                                <div className="flex items-start space-x-4">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Phone className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-2">{t("contact.call.title")}</h3>
                                        <p className="text-muted-foreground text-sm">
                                            +3021 0681 8011
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            <Card className="card-service">
                                <div className="flex items-start space-x-4">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Mail className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-2">{t("contact.email.title")}</h3>
                                        <p className="text-muted-foreground text-sm">
                                            ar.hairbeauty.healthservices@gmail.com
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            <Card className="card-service">
                                <div className="flex items-start space-x-4">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Clock className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-2">{t("contact.hours.title")}</h3>
                                        <div className="text-muted-foreground text-sm space-y-1">
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
                            </Card>
                        </div>

                        {/* Contact Form */}
                        <Card className="p-8">
                            <h2 className="heading-tertiary mb-6">{t("contact.form.title")}</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                                        {t("contact.form.name")}
                                    </label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder={t("contact.form.namePlaceholder")}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium mb-2">
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
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                                        {t("contact.form.phone")}
                                    </label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder={t("contact.form.phonePlaceholder")}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                                        {t("contact.form.message")}
                                    </label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        placeholder={t("contact.form.messagePlaceholder")}
                                        rows={5}
                                        className="w-full"
                                    />
                                </div>

                                <Button type="submit" className="btn-primary w-full">
                                    {t("contact.form.submit")}
                                </Button>
                            </form>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="section-padding bg-muted/30">
                <div className="container-custom">
                    <div className="rounded-2xl overflow-hidden shadow-lg h-[500px]">
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

