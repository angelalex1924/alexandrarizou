"use client";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

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

const categoryLabels = {
  our_space: "Our Space",
  before_after: "Before & After",
  hair_creations: "Hair Creations",
  nails_beauty: "Nails & Beauty",
  team_moments: "Team Moments"
};

export default function Gallery() {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

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
      <img
        src={item.media_url}
        alt={item.title || item.description || 'Gallery item'}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
    );
  };

  const renderBeforeAfter = (item: GalleryItem) => {
    return (
      <div className="grid grid-cols-2 gap-2 w-full h-full">
        <div className="relative">
          <img
            src={item.before_image_url || ''}
            alt="Before"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
            Before
          </div>
        </div>
        <div className="relative">
          <img
            src={item.after_image_url || ''}
            alt="After"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-primary/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-primary-foreground">
            After
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
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 section-padding bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container-custom text-center">
          <h1 className="heading-primary mb-6">{t("gallery.hero.title")}</h1>
          <p className="text-body text-muted-foreground max-w-2xl mx-auto">
            {t("gallery.hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Gallery Tabs */}
      <section className="section-padding">
        <div className="container-custom">
          <Tabs defaultValue="our_space" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-8">
              {Object.entries(categoryLabels).map(([value, label]) => (
                <TabsTrigger key={value} value={value}>
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="our_space" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="heading-secondary mb-4">Our Space</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Take a virtual tour of our beautiful salon interior and atmosphere
                </p>
              </div>
              {renderGalleryGrid(getItemsByCategory('our_space'))}
            </TabsContent>

            <TabsContent value="before_after" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="heading-secondary mb-4">Before & After</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Witness the stunning transformations we create for our clients
                </p>
              </div>
              {renderGalleryGrid(getItemsByCategory('before_after'), true)}
            </TabsContent>

            <TabsContent value="hair_creations" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="heading-secondary mb-4">Hair Creations</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                  Browse our portfolio of hairstyles, coloring techniques, and treatments
                </p>

                {getUniqueTags().length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge
                      variant={selectedTag === null ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setSelectedTag(null)}
                    >
                      All
                    </Badge>
                    {getUniqueTags().map(tag => (
                      <Badge
                        key={tag}
                        variant={selectedTag === tag ? "default" : "outline"}
                        className="cursor-pointer"
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

            <TabsContent value="nails_beauty" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="heading-secondary mb-4">Nails & Beauty</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Explore our manicure, pedicure, and beauty treatment services
                </p>
              </div>
              {renderGalleryGrid(getItemsByCategory('nails_beauty'))}
            </TabsContent>

            <TabsContent value="team_moments" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="heading-secondary mb-4">Team Moments</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Get to know our talented team and see us in action
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
          <img
            src={selectedImage}
            alt="Gallery preview"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}

      <Footer />
    </div>
  );
};




