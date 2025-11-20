"use client";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Award, Heart, Users, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function About() {
    const { t } = useLanguage();

    const team = [
        {
            name: "Sarah Johnson",
            role: "Founder & Master Stylist",
            description: "With over 15 years of experience, Sarah brings passion and precision to every cut and color.",
        },
        {
            name: "Emma Martinez",
            role: "Senior Hair Colorist",
            description: "Specializing in balayage and color correction, Emma creates stunning, natural-looking results.",
        },
        {
            name: "Lisa Chen",
            role: "Nail Art Specialist",
            description: "From classic elegance to bold designs, Lisa transforms nails into works of art.",
        },
        {
            name: "Maria Rodriguez",
            role: "Beauty Therapist",
            description: "Expert in waxing and facial treatments, Maria ensures a relaxing and professional experience.",
        },
    ];

    const values = [
        {
            icon: Award,
            title: t("about.value.excellence.title"),
            description: t("about.value.excellence.desc"),
        },
        {
            icon: Heart,
            title: t("about.value.passion.title"),
            description: t("about.value.passion.desc"),
        },
        {
            icon: Users,
            title: t("about.value.community.title"),
            description: t("about.value.community.desc"),
        },
        {
            icon: Sparkles,
            title: t("about.value.innovation.title"),
            description: t("about.value.innovation.desc"),
        },
    ];

    return (
        <div className="min-h-screen">
            <Navigation />

            {/* Hero Section */}
            <section className="pt-32 pb-16 section-padding bg-gradient-to-br from-primary/5 via-background to-accent/5">
                <div className="container-custom text-center">
                    <h1 className="heading-primary mb-6">{t("about.hero.title")}</h1>
                    <p className="text-body text-muted-foreground max-w-2xl mx-auto">
                        {t("about.hero.subtitle")}
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h2 className="heading-secondary mb-6">{t("about.story.title")}</h2>
                        <p className="text-body text-muted-foreground mb-6">
                            {t("about.story.p1")}
                        </p>
                        <p className="text-body text-muted-foreground">
                            {t("about.story.p2")}
                        </p>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="section-padding bg-muted/30">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="heading-secondary mb-4">{t("about.values.title")}</h2>
                        <p className="text-body text-muted-foreground max-w-2xl mx-auto">
                            {t("about.values.subtitle")}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <Card key={index} className="card-service text-center">
                                <div className="mb-4 flex justify-center">
                                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                        <value.icon className="h-8 w-8 text-primary" />
                                    </div>
                                </div>
                                <h3 className="heading-tertiary mb-3 text-xl">{value.title}</h3>
                                <p className="text-muted-foreground text-sm">{value.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="heading-secondary mb-4">{t("about.team.title")}</h2>
                        <p className="text-body text-muted-foreground max-w-2xl mx-auto">
                            {t("about.team.subtitle")}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, index) => (
                            <div key={index} className="text-center group">
                                <div className="mb-4 mx-auto w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
                                    <Sparkles className="h-20 w-20 text-primary/40 group-hover:text-primary/60 transition-colors" />
                                </div>
                                <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                                <p className="text-primary text-sm mb-3">{member.role}</p>
                                <p className="text-muted-foreground text-sm">{member.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

