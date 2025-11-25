"use client";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import SEOPlugin from "@/components/SEOPlugin";
import Breadcrumbs from "@/components/Breadcrumbs";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type GalleryCategory = 'our_space' | 'before_after' | 'hair_creations' | 'nails_beauty' | 'team_moments';

interface GalleryItem {
  id: string;
  category: GalleryCategory;
  media_type: 'image' | 'video';
  media_url: string;
  before_image_url?: string;
  after_image_url?: string;
  title?: string;
  description?: string;
  tags?: string[];
  display_order: number;
}

const getCategoryLabel = (category: GalleryCategory, t: (key: string) => string) => {
  return t(`gallery.category.${category}`);
};

export default function Gallery() {
  const { t, language } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Hide navbar when lightbox is open
  useEffect(() => {
    const nav = document.querySelector('nav');
    if (selectedImage) {
      if (nav) nav.style.display = 'none';
      document.body.style.overflow = 'hidden';
    } else {
      if (nav) nav.style.display = '';
      document.body.style.overflow = '';
    }
    return () => {
      if (nav) nav.style.display = '';
      document.body.style.overflow = '';
    };
  }, [selectedImage]);

  const { data: items = [] } = useQuery({
    queryKey: ['gallery-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as GalleryItem[];
    }
  });

  const getItemsByCategory = (category: GalleryCategory) => {
    return items.filter(item => item.category === category);
  };

  const getUniqueTags = () => {
    const allTags = items
      .filter(item => item.category === 'hair_creations' && item.tags)
      .flatMap(item => item.tags || []);
    return [...new Set(allTags)];
  };

  const filteredHairCreations = selectedTag
    ? items.filter(item =>
      item.category === 'hair_creations' &&
      item.tags?.includes(selectedTag)
    )
    : items.filter(item => item.category === 'hair_creations');

  const renderMediaItem = (item: GalleryItem) => {
    if (item.media_type === 'video') {
      return (
        <video
          src={item.media_url}
          className="w-full h-full object-cover"
          controls
          onClick={(e) => e.stopPropagation()}
        />
      );
    }
    return (
      <Image
        src={item.media_url}
        alt={item.title || item.description || 'Gallery item'}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        unoptimized
      />
    );
  };

  const renderBeforeAfter = (item: GalleryItem) => {
    return (
      <div className="grid grid-cols-2 gap-2 w-full h-full">
        <div className="relative">
          <Image
            src={item.before_image_url || ''}
            alt={t("gallery.before")}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute bottom-2 left-2 bg-background/90 dark:bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold border border-primary/20 shadow-md">
            {t("gallery.before")}
          </div>
        </div>
        <div className="relative">
          <Image
            src={item.after_image_url || ''}
            alt={t("gallery.after")}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute bottom-2 right-2 bg-primary/90 dark:bg-primary/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold text-primary-foreground shadow-md border border-primary-foreground/20">
            {t("gallery.after")}
          </div>
        </div>
      </div>
    );
  };

  const renderGalleryGrid = (categoryItems: GalleryItem[], isBeforeAfter = false) => {
    if (categoryItems.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <p>{t("gallery.empty")}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categoryItems.map((item) => (
          <div
            key={item.id}
            className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
            onClick={() => !isBeforeAfter && setSelectedImage(item.media_url)}
          >
            {isBeforeAfter ? renderBeforeAfter(item) : renderMediaItem(item)}

            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {item.title && (
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                  {item.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <SEOPlugin pageType="gallery" />
      <Navigation />
      <Breadcrumbs />

      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 px-4 md:px-8">
        <div className="container-custom max-w-7xl mx-auto">
          <PageHeader
            title={t("gallery.hero.title")}
            subtitle={t("gallery.hero.subtitle")}
            icon="/images_5225097.png"
          />
        </div>
      </section>

      {/* Gallery Tabs */}
      <section className="section-padding">
        <div className="container-custom">
          <Tabs defaultValue="our_space" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-12 p-1.5 bg-muted/50 dark:bg-muted/30 rounded-2xl border border-primary/10">
              {(['our_space', 'before_after', 'hair_creations', 'nails_beauty', 'team_moments'] as GalleryCategory[]).map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-xl font-medium transition-all duration-300"
                >
                  {getCategoryLabel(category, t)}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="our_space" className="space-y-6 mt-16 md:mt-12">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-3 mb-6">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent via-primary/60 to-primary/60"></div>
                  <span className="text-xs md:text-sm font-semibold text-primary tracking-[0.3em] uppercase">
                    {t("gallery.section.our_space.title")}
                  </span>
                  <div className="h-px w-12 bg-gradient-to-l from-transparent via-primary/60 to-primary/60"></div>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-junicode bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent mb-4">
                  {t("gallery.section.our_space.title")}
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  {t("gallery.section.our_space.desc")}
                </p>
              </div>
              {renderGalleryGrid(getItemsByCategory('our_space'))}
            </TabsContent>

            <TabsContent value="before_after" className="space-y-6 mt-16 md:mt-12">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-3 mb-6">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent via-primary/60 to-primary/60"></div>
                  <span className="text-xs md:text-sm font-semibold text-primary tracking-[0.3em] uppercase">
                    {t("gallery.section.before_after.title")}
                  </span>
                  <div className="h-px w-12 bg-gradient-to-l from-transparent via-primary/60 to-primary/60"></div>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-junicode bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent mb-4">
                  {t("gallery.section.before_after.title")}
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  {t("gallery.section.before_after.desc")}
                </p>
              </div>
              {renderGalleryGrid(getItemsByCategory('before_after'), true)}
            </TabsContent>

            <TabsContent value="hair_creations" className="space-y-6 mt-16 md:mt-12">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-3 mb-6">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent via-primary/60 to-primary/60"></div>
                  <span className="text-xs md:text-sm font-semibold text-primary tracking-[0.3em] uppercase">
                    {t("gallery.section.hair_creations.title")}
                  </span>
                  <div className="h-px w-12 bg-gradient-to-l from-transparent via-primary/60 to-primary/60"></div>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-junicode bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent mb-4">
                  {t("gallery.section.hair_creations.title")}
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
                  {t("gallery.section.hair_creations.desc")}
                </p>

                {getUniqueTags().length > 0 && (
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Badge
                      variant={selectedTag === null ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer px-4 py-1.5 text-sm font-semibold transition-all duration-300 hover:scale-105",
                        selectedTag === null 
                          ? "bg-primary text-primary-foreground shadow-md hover:shadow-lg" 
                          : "border-2 hover:border-primary/50 hover:bg-primary/10 dark:hover:bg-primary/20"
                      )}
                      onClick={() => setSelectedTag(null)}
                    >
                      {t("gallery.all")}
                    </Badge>
                    {getUniqueTags().map(tag => (
                      <Badge
                        key={tag}
                        variant={selectedTag === tag ? "default" : "outline"}
                        className={cn(
                          "cursor-pointer px-4 py-1.5 text-sm font-semibold transition-all duration-300 hover:scale-105",
                          selectedTag === tag
                            ? "bg-primary text-primary-foreground shadow-md hover:shadow-lg"
                            : "border-2 hover:border-primary/50 hover:bg-primary/10 dark:hover:bg-primary/20"
                        )}
                        onClick={() => setSelectedTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              {renderGalleryGrid(filteredHairCreations)}
            </TabsContent>

            <TabsContent value="nails_beauty" className="space-y-6 mt-16 md:mt-12">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-3 mb-6">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent via-primary/60 to-primary/60"></div>
                  <span className="text-xs md:text-sm font-semibold text-primary tracking-[0.3em] uppercase">
                    {t("gallery.section.nails_beauty.title")}
                  </span>
                  <div className="h-px w-12 bg-gradient-to-l from-transparent via-primary/60 to-primary/60"></div>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-junicode bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent mb-4">
                  {t("gallery.section.nails_beauty.title")}
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  {t("gallery.section.nails_beauty.desc")}
                </p>
              </div>
              {renderGalleryGrid(getItemsByCategory('nails_beauty'))}
            </TabsContent>

            <TabsContent value="team_moments" className="space-y-6 mt-16 md:mt-12">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-3 mb-6">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent via-primary/60 to-primary/60"></div>
                  <span className="text-xs md:text-sm font-semibold text-primary tracking-[0.3em] uppercase">
                    {t("gallery.section.team_moments.title")}
                  </span>
                  <div className="h-px w-12 bg-gradient-to-l from-transparent via-primary/60 to-primary/60"></div>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-junicode bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent mb-4">
                  {t("gallery.section.team_moments.title")}
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  {t("gallery.section.team_moments.desc")}
                </p>
              </div>
              {renderGalleryGrid(getItemsByCategory('team_moments'))}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom text-center">
          <h2 className="heading-secondary mb-6">{t("gallery.instagram.title")}</h2>
          <p className="text-body text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t("gallery.instagram.subtitle")}
          </p>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-primary hover:text-accent transition-colors font-medium"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <span>{t("gallery.instagram.handle")}</span>
          </a>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-foreground hover:text-primary transition-colors text-4xl"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
          <div className="relative w-[90vw] h-[90vh] max-w-[90vw] max-h-[90vh]">
            <Image
            src={selectedImage}
            alt="Gallery preview"
              fill
              className="object-contain rounded-2xl shadow-2xl"
              unoptimized
          />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};




