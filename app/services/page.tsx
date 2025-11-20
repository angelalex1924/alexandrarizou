"use client";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Scissors, Wind } from "lucide-react";
const treeBackground = "/assets/tree-background.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Services() {
    const { t, language } = useLanguage();

    const serviceCategories = [
        {
            id: "hair",
            icon: Scissors,
            title: t("services.hair.title"),
            services: [
                { name: t("service.hairstyling"), price: "14€ - 20€" },
                { name: t("service.womenscut"), price: "25€" },
                { name: t("service.menscut"), price: "15€" },
                { name: t("service.kidscut"), price: "10€" },
                { name: t("service.treatment"), price: "10€" },
                { name: t("service.rootcolor"), price: "28€" },
                { name: t("service.fullcolor"), price: language === "el" ? "Από 38€" : "From 38€" },
                { name: t("service.highlights"), price: language === "el" ? "Από 30€" : "From 30€" },
                { name: t("service.balayage"), price: "55€" },
                { name: t("service.bleach"), price: "30€" },
                { name: t("service.toner"), price: "10€" },
                { name: t("service.ombre"), price: "30€" },
            ],
        },
        {
            id: "waxing",
            icon: Wind,
            title: t("services.waxing.title"),
            services: [
                { name: t("service.waxing"), price: "5€" },
            ],
        },
    ];

    return (
        <div className="min-h-screen">
            <Navigation />

            {/* Hero Section */}
            <section
                className="pt-32 pb-16 section-padding relative overflow-hidden"
                style={{
                    backgroundImage: `linear-gradient(rgba(150, 150, 135, 0.85), rgba(150, 150, 135, 0.85)), url(${treeBackground})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="container-custom text-center relative z-10">
                    <h1 className="heading-primary mb-6 text-white drop-shadow-lg">{t("services.hero.title")}</h1>
                    <p className="text-body max-w-2xl mx-auto text-white/95 drop-shadow">
                        {t("services.hero.subtitle")}
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="section-padding">
                <div className="container-custom space-y-16">
                    {serviceCategories.map((category, index) => (
                        <div key={category.id} id={category.id} className="scroll-mt-32">
                            <div className="flex items-center space-x-4 mb-8">
                                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                                    <category.icon className="h-7 w-7 text-primary" />
                                </div>
                                <h2 className="heading-secondary">{category.title}</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {category.services.map((service, serviceIndex) => (
                                    <Card key={serviceIndex} className="card-service">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold text-lg">{service.name}</h3>
                                            <span className="text-primary font-bold whitespace-nowrap ml-4">{service.price}</span>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-padding bg-muted/30">
                <div className="container-custom">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="heading-secondary mb-6">{t("services.cta.title")}</h2>
                        <p className="text-body text-muted-foreground mb-8 max-w-2xl mx-auto">
                            {t("services.cta.subtitle")}
                        </p>
                        <Link href="/booking">
                            <Button className="btn-primary">{t("services.cta.btn")}</Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

