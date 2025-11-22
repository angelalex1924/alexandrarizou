"use client";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLocalizedPath } from "@/lib/i18n-routes";

// Service Icon Component
const ServiceIcon = ({ iconType }: { iconType: string }) => {
    const iconSize = "w-8 h-8 md:w-10 md:h-10";
    
    switch (iconType) {
        case "hairstyling":
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 48 48" fill="currentColor" className={iconSize}>
                    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4">
                        <path d="M18.197 31.424c3.124 3.124 10.722.592 16.97-5.657c6.249-6.248 8.781-13.846 5.657-16.97M27.389 6.675l1.414 1.415m-6.363 3.535l1.414 1.414m-5.658 4.243l1.414 1.414m-2.828 5.657l1.414 1.414M35.167 4.554l1.414 1.414m-2.828 7.072l2.828 2.828m-7.777 2.122l2.828 2.828m-8.486 1.414l2.829 2.828"/>
                        <rect width="6" height="14" x="16.075" y="29.303" rx="3" transform="rotate(45 16.075 29.303)"/>
                    </g>
                </svg>
            );
        case "menscut":
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={iconSize}>
                    <g clipPath="url(#clip0_4418_9192)">
                        <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8.41998 10.8996C9.48037 10.8996 10.34 10.04 10.34 8.97957C10.34 7.91918 9.48037 7.05957 8.41998 7.05957C7.3596 7.05957 6.5 7.91918 6.5 8.97957C6.5 10.04 7.3596 10.8996 8.41998 10.8996Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8.41998 16.9396C9.48037 16.9396 10.34 16.08 10.34 15.0196C10.34 13.9592 9.48037 13.0996 8.41998 13.0996C7.3596 13.0996 6.5 13.9592 6.5 15.0196C6.5 16.08 7.3596 16.9396 8.41998 16.9396Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M17.4999 8.69922L10.1599 14.1892" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M17.4999 15.28L10.1599 9.79004" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                    <defs>
                        <clipPath id="clip0_4418_9192">
                            <rect width="24" height="24" fill="white"/>
                        </clipPath>
                    </defs>
                </svg>
            );
        case "womenscut":
            return <Image src="/hair-cut_18074401.png" alt="Women's Cut" width={40} height={40} className={`${iconSize} object-contain dark:brightness-0 dark:invert`} />;
        case "kidscut":
            return (
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 2122 2122" className={iconSize} xmlSpace="preserve">
                    <g>
                        <path style={{ fill: "#91A9D8" }} d="M809.446,1224.667c-10.28-20.243-26.041-41.598-39.552-63.893 c-117.091,138.042-211.927,310.679-281.676,467.488c-29.023,65.325-53.091,133.077-68.424,202.938 c-7.445,34.007-43.035,158.772,29.213,114.879l0.176-0.088c60.019-36.619,103.805-98.212,150.869-150.353 c52.96-58.641,105.871-117.257,158.83-175.893c40.326-44.662,80.663-89.359,120.989-134.017 c-4.867-24.068-7.191-48.867-10.904-73.232C859.093,1347.547,839.22,1283.328,809.446,1224.667z"/>
                        <path style={{ fill: "#7594C6" }} d="M975.643,1223.386c-11.24,2.943-22.611,3.235-33.481-0.969 c-13.179-5.077-25.174-13.613-36.312-24.151c-32.526-30.772-41.403-77.252-64.75-114.027 c-24.57,23.951-48.321,49.568-71.206,76.536c13.51,22.295,29.271,43.649,39.552,63.893c29.773,58.661,49.647,122.879,59.523,187.83 c3.712,24.365,6.036,49.164,10.904,73.232c54.095-59.907,108.19-119.815,162.28-179.722 c-12.365-15.099-24.736-30.198-37.101-45.296C995.77,1249.374,985.66,1236.819,975.643,1223.386z"/>
                        <path style={{ fill: "#C11833" }} d="M1767.093,400.834c-25.843-94.243-104.968-163.191-190.58-203.752 c-73.838-35.023-162.443-38.266-237.029-8.731c-86.51,34.275-150.12,109.06-185.392,192.676 c-35.323,83.616-44.952,175.813-46.698,266.863c-0.698,38.914-0.25,78.927-14.668,114.897 c-8.581,21.403-21.703,39.812-37.168,56.725c41.009,46.298,97.436,83.816,126.821,138.396c8.033,14.867,13.969,31.83,10.626,48.493 c-1.446,7.134-4.49,13.77-8.231,20.106c9.43,7.833,18.509,16.065,27.29,24.446c14.669,14.069,28.987,28.787,42.956,44.053 c30.682-38.964,122.78-118.539,163.691-138.595C1611.885,861.721,1832.999,641.256,1767.093,400.834z M1220.346,601.293 c-8.233-76.532,9.129-160.198,56.126-220.315c59.169-75.484,167.033-96.438,254.191-61.465 c112.951,45.25,145.33,168.729,102.175,277.141c-26.692,67.003-83.566,135.602-153.163,159.898 C1356.595,799.557,1232.019,709.406,1220.346,601.293z"/>
                        <path style={{ fill: "#B5C5E7" }} d="M1575.292,1648.964c-62.105-159.985-148.506-336.993-258.806-480.521 c-14.568,21.617-31.338,42.183-42.587,61.91c-32.57,57.154-55.512,120.346-68.511,184.74c-4.882,24.156-8.4,48.818-14.421,72.619 c38.129,46.558,76.263,93.145,114.387,139.697c50.07,61.126,100.098,122.222,150.168,183.347 c44.497,54.349,85.262,117.983,143.44,157.457l0.171,0.092c70.051,47.328,40.516-79.011,34.723-113.335 C1621.908,1784.448,1601.133,1715.619,1575.292,1648.964z"/>
                        <path style={{ fill: "#91A9D8" }} d="M1273.899,1230.353c11.25-19.727,28.019-40.292,42.587-61.91 c-19.718-25.642-40.205-50.192-61.447-73.413c-13.997-15.294-28.307-30.022-42.971-44.051 c-8.794-8.412-17.886-16.619-27.279-24.453c-2.543,4.358-5.389,8.587-8.273,12.726c-42.168,60.392-94.388,114.375-153.997,159.135 c-13.929,10.456-30.256,20.648-46.874,24.999c10.017,13.432,20.127,25.988,29.408,37.325 c12.365,15.098,24.736,30.197,37.101,45.296c49.608,60.57,99.211,121.14,148.814,181.705c6.022-23.801,9.54-48.463,14.421-72.619 C1218.386,1350.699,1241.329,1287.508,1273.899,1230.353z"/>
                        <path style={{ fill: "#E51C37" }} d="M1182.379,957.909c-29.385-54.58-85.811-92.098-126.821-138.396 c-17.412-19.657-32.03-40.91-40.612-65.755c-12.672-36.57-10.277-76.532-9.129-115.446c2.693-91.05-2.495-183.596-33.726-268.809 c-31.231-85.213-91.2-162.992-175.913-201.357c-73.09-33.127-161.695-34.175-237.179-2.794 c-87.458,36.42-169.827,101.527-200.21,194.373C281.41,596.703,491.647,827.546,680.033,931.468 c41.06,22.65,133.207,110.856,159.15,149.771c0.7,0.948,1.298,1.996,1.897,2.993c23.348,36.769,32.229,83.267,64.757,114.049 c11.175,10.527,23.149,19.058,36.321,24.147c10.876,4.191,22.251,3.891,33.476,0.948c16.614-4.34,32.977-14.518,46.896-24.995 c59.62-44.752,111.805-98.733,153.962-159.15c2.893-4.141,5.737-8.332,8.282-12.722c3.742-6.336,6.786-12.971,8.231-20.106 C1196.348,989.739,1190.412,972.777,1182.379,957.909z M895.26,586.326C878.448,693.74,749.63,777.755,628.746,728.913 c-68.299-27.639-121.832-98.883-145.231-167.133c-37.916-110.357,0.35-232.14,115.347-271.902 c88.755-30.683,195.52-4.59,250.949,73.688C893.913,425.879,907.184,510.293,895.26,586.326z"/>
                        <path style={{ fill: "#577FBD" }} d="M922.956,1007.813c11.435,39.6,52.804,62.429,92.404,50.994 c39.601-11.435,62.431-52.806,50.991-92.404c-11.435-39.6-52.804-62.431-92.404-50.993 C934.347,926.843,911.517,968.215,922.956,1007.813z"/>
                    </g>
                </svg>
            );
        case "treatment":
            return <Image src="/hair-treatment.png" alt="Treatment" width={40} height={40} className={`${iconSize} object-contain dark:brightness-0 dark:invert`} />;
        case "rootcolor":
            return <Image src="/hair-dye.png" alt="Root Color" width={40} height={40} className={`${iconSize} object-contain`} />;
        case "fullcolor":
            return <Image src="/hair-color_9054660.png" alt="Full Color" width={40} height={40} className={`${iconSize} object-contain`} />;
        case "highlights":
            return <Image src="/hair-highlights.png" alt="Highlights" width={40} height={40} className={`${iconSize} object-contain`} />;
        case "balayage":
            return <Image src="/balayage.png" alt="Balayage" width={40} height={40} className={`${iconSize} object-contain`} />;
        case "bleach":
            return <Image src="/bleaching.png" alt="Bleaching" width={40} height={40} className={`${iconSize} object-contain`} />;
        case "toner":
            return <Image src="/reflex.png" alt="Toner" width={40} height={40} className={`${iconSize} object-contain`} />;
        case "ombre":
            return <Image src="/wig_1053035.png" alt="Ombre" width={40} height={40} className={`${iconSize} object-contain`} />;
        case "eyelashes":
            return <Image src="/eyelashes.png" alt="Eyelashes" width={40} height={40} className={`${iconSize} object-contain dark:brightness-0 dark:invert`} />;
        default:
            return null;
    }
};

export default function Services() {
    const { t, language } = useLanguage();

    const serviceCategories = [
        {
            id: "hair",
            image: "/hair-styling_17828281.png",
            title: t("services.hair.title"),
            description: t("home.service.hair.desc"),
            services: [
                { 
                    name: t("service.hairstyling"), 
                    price: "14€ - 20€",
                    description: t("service.hairstyling.desc"),
                    icon: "hairstyling"
                },
                { 
                    name: t("service.womenscut"), 
                    price: "25€",
                    description: t("service.womenscut.desc"),
                    icon: "womenscut"
                },
                { 
                    name: t("service.menscut"), 
                    price: "15€",
                    description: t("service.menscut.desc"),
                    icon: "menscut"
                },
                { 
                    name: t("service.kidscut"), 
                    price: "10€",
                    description: t("service.kidscut.desc"),
                    icon: "kidscut"
                },
                { 
                    name: t("service.treatment"), 
                    price: "10€",
                    description: t("service.treatment.desc"),
                    icon: "treatment"
                },
                { 
                    name: t("service.rootcolor"), 
                    price: "28€",
                    description: t("service.rootcolor.desc"),
                    icon: "rootcolor"
                },
                { 
                    name: t("service.fullcolor"), 
                    price: language === "el" ? "Από 38€" : "From 38€",
                    description: t("service.fullcolor.desc"),
                    icon: "fullcolor"
                },
                { 
                    name: t("service.highlights"), 
                    price: language === "el" ? "Από 30€" : "From 30€",
                    description: t("service.highlights.desc"),
                    icon: "highlights"
                },
                { 
                    name: t("service.balayage"), 
                    price: "55€",
                    description: t("service.balayage.desc"),
                    icon: "balayage"
                },
                { 
                    name: t("service.bleach"), 
                    price: "30€",
                    description: t("service.bleach.desc"),
                    icon: "bleach"
                },
                { 
                    name: t("service.toner"), 
                    price: "10€",
                    description: t("service.toner.desc"),
                    icon: "toner"
                },
                { 
                    name: t("service.ombre"), 
                    price: "30€",
                    description: t("service.ombre.desc"),
                    icon: "ombre"
                },
            ],
        },
        {
            id: "waxing",
            image: "/waxing_17368167.png",
            title: t("services.waxing.title"),
            description: t("home.service.waxing.desc"),
            services: [
                { 
                    name: t("service.waxing"), 
                    price: "5€",
                    description: t("service.waxing.desc"),
                    icon: "eyelashes"
                },
            ],
        },
    ];

    return (
        <div className="min-h-screen">
            <Navigation />

            {/* Hero Section */}
            <section className="pt-32 pb-12 md:pt-40 md:pb-16 px-4 md:px-8">
                <div className="container-custom max-w-7xl mx-auto">
                    <PageHeader
                        title={t("services.hero.title")}
                        subtitle={t("services.hero.subtitle")}
                        icon="/hair-styling_17828281.png"
                    />
                </div>
            </section>

            {/* Services Categories */}
            <section className="relative overflow-hidden py-24 md:py-32 px-4 md:px-8">
                {/* Background - matching home page style */}
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/5" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.08),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.06),transparent_50%)]" />
                
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />

                <div className="container-custom relative z-10 max-w-7xl mx-auto space-y-24 md:space-y-32">
                    {serviceCategories.map((category, categoryIndex) => {
                        const colorSchemes = [
                            { primary: 'from-primary/8', accent: 'to-accent/6', border: 'border-primary/20', shadow: 'shadow-primary/10', iconBg: 'from-primary/10 to-accent/8', overlay: 'from-primary/5 to-accent/4' },
                            { primary: 'from-accent/8', accent: 'to-primary/6', border: 'border-accent/20', shadow: 'shadow-accent/10', iconBg: 'from-accent/10 to-primary/8', overlay: 'from-accent/5 to-primary/4' },
                        ];
                        const colors = colorSchemes[categoryIndex % colorSchemes.length];

                        return (
                            <div 
                                key={category.id} 
                                id={category.id} 
                                className="scroll-mt-32"
                            >
                                {/* Category Header - matching home page style */}
                                <div className="text-center mb-16 md:mb-20">
                                    <div className="inline-flex items-center gap-3 mb-6">
                                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/60"></div>
                                        <span className="text-xs md:text-sm font-semibold text-primary tracking-[0.3em]">
                                            Premium Services
                                        </span>
                                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/60"></div>
                                    </div>
                                    <div className="flex items-center justify-center gap-6 mb-6">
                                        <div className={`
                                            relative w-24 h-24 rounded-2xl
                                            bg-gradient-to-br ${colors.iconBg}
                                            flex items-center justify-center
                                            shadow-md shadow-primary/15
                                        `}>
                                            <Image
                                                src={category.image}
                                                alt={category.title}
                                                width={56}
                                                height={56}
                                                className={`object-contain ${category.image === '/hair-styling_17828281.png' ? 'dark:brightness-0 dark:invert' : ''}`}
                                            />
                                        </div>
                                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-junicode bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
                                            {category.title}
                                        </h2>
                                    </div>
                                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                                        {category.description}
                                    </p>
                                </div>

                                {/* Services Grid - Enhanced Premium Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                    {category.services.map((service, serviceIndex) => {
                                        const colorVariants = [
                                            { 
                                                primary: 'from-white dark:from-[#1a2e1f]', 
                                                accent: 'to-primary/8 dark:to-primary/20', 
                                                border: 'border-primary/20 dark:border-primary/30', 
                                                glow: 'shadow-primary/15 dark:shadow-primary/25',
                                                badge: 'from-primary/95 to-primary/85 dark:from-primary/90 dark:to-primary/80'
                                            },
                                            { 
                                                primary: 'from-white dark:from-[#1d3221]', 
                                                accent: 'to-accent/8 dark:to-primary/18', 
                                                border: 'border-accent/20 dark:border-primary/28', 
                                                glow: 'shadow-accent/15 dark:shadow-primary/22',
                                                badge: 'from-accent/95 to-accent/85 dark:from-primary/88 dark:to-primary/78'
                                            },
                                            { 
                                                primary: 'from-white dark:from-[#1b2f20]', 
                                                accent: 'to-primary/10 dark:to-primary/22', 
                                                border: 'border-primary/25 dark:border-primary/32', 
                                                glow: 'shadow-primary/20 dark:shadow-primary/28',
                                                badge: 'from-primary/95 to-primary/85 dark:from-primary/92 dark:to-primary/82'
                                            },
                                        ];
                                        const colors = colorVariants[serviceIndex % colorVariants.length];

                                        return (
                                            <div
                                                key={serviceIndex}
                                                className="group relative"
                                                style={{
                                                    animation: `fadeInUp 0.5s ease-out ${(categoryIndex * 0.08) + (serviceIndex * 0.04)}s both`
                                                }}
                                            >
                                                {/* Enhanced Premium Card */}
                                                <div className={`
                                                    relative h-full rounded-3xl overflow-hidden
                                                    bg-gradient-to-br ${colors.primary} ${colors.accent}
                                                    backdrop-blur-xl
                                                    border-2 ${colors.border}
                                                    shadow-lg ${colors.glow}
                                                    transition-all duration-300 ease-out
                                                    md:hover:shadow-2xl md:hover:shadow-primary/30
                                                    md:hover:-translate-y-1 md:hover:scale-[1.01]
                                                    md:hover:border-primary/40 dark:md:hover:border-white/30
                                                `}>
                                                    {/* Elegant Glass Effect */}
                                                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/20 to-transparent dark:from-primary/15 dark:via-primary/8 dark:to-transparent" />
                                                    
                                                    {/* Subtle Shine Effect - Only on Desktop */}
                                                    <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent via-white/15 dark:via-primary/20 to-transparent -translate-x-full md:group-hover:translate-x-full transition-transform duration-800 ease-in-out pointer-events-none" />
                                                    
                                                    {/* Subtle Glow Border - Only on Desktop */}
                                                    <div className="hidden md:block absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-primary/15 via-accent/15 to-primary/15 opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />

                                                    {/* Content */}
                                                    <div className="relative z-10 p-6 md:p-8 lg:p-10 flex flex-col h-full">
                                                        {/* Enhanced Price Badge */}
                                                        <div className="absolute top-4 right-4 md:top-6 md:right-6">
                                                            <div className="relative">
                                                                <div className="absolute inset-0 bg-primary/25 blur-lg rounded-full" />
                                                                <div className={`relative px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-gradient-to-r ${colors.badge} backdrop-blur-sm border border-primary/40 dark:border-primary/50 shadow-md`}>
                                                                    <span className="text-sm md:text-base font-bold text-white">
                                                                        {service.price}
                                                                    </span>
                                                                </div>
                                                            </div>
                                </div>

                                                        {/* Service Icon and Title */}
                                                        <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-5 pr-16 md:pr-24">
                                                            {service.icon && (
                                                                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary/15 to-primary/8 dark:from-primary/20 dark:to-primary/12 flex items-center justify-center text-primary dark:text-primary/90 shadow-md shadow-primary/10 group-hover:scale-110 transition-transform duration-300">
                                                                    <ServiceIcon iconType={service.icon} />
                                                                </div>
                                                            )}
                                                            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground dark:text-white md:group-hover:text-primary dark:md:group-hover:text-primary/90 transition-colors duration-300 leading-tight">
                                                                {service.name}
                                                            </h3>
                                                        </div>

                                                        {/* Service Description */}
                                                        <p className="text-sm md:text-base text-muted-foreground dark:text-white/70 leading-relaxed flex-grow mb-4 md:mb-5 md:group-hover:text-foreground/90 dark:md:group-hover:text-white/85 transition-colors duration-300">
                                                            {service.description}
                                                        </p>

                                                        {/* Elegant Decorative Line */}
                                                        <div className="h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent md:group-hover:via-primary/70 transition-colors duration-300" />
                            </div>

                                                    {/* Subtle Corner Accents - Only on Desktop */}
                                                    <div className="hidden md:block absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-primary/8 to-transparent rounded-br-3xl opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />
                                                    <div className="hidden md:block absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-accent/8 to-transparent rounded-tl-3xl opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />
                                                </div>
                                        </div>
                                        );
                                    })}
                            </div>
                        </div>
                        );
                    })}
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-padding relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background" />
                <div className="container-custom relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="h-12 w-12 mx-auto mb-6 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-2xl">✨</span>
                            </div>
                        </div>
                        <h2 className="heading-secondary mb-6">{t("services.cta.title")}</h2>
                        <p className="text-body text-muted-foreground mb-8 max-w-2xl mx-auto">
                            {t("services.cta.subtitle")}
                        </p>
                        <Link href={getLocalizedPath("/contact", language as 'el' | 'en')}>
                            <Button className="btn-primary">{t("services.cta.btn")}</Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
