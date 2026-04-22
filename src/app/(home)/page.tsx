'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Horse, GalleryItem } from '@/types';
import Navigation from '@/components/home/Navigation';
import HeroSection from '@/components/home/HeroSection';
import StatsBar from '@/components/home/StatsBar';
import HorsesSection from '@/components/home/HorsesSection';
import MissionSection from '@/components/home/MissionSection';
import GallerySection from '@/components/home/GallerySection';
import ContactSection from '@/components/home/ContactSection';
import Footer from '@/components/home/Footer';

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('home');
  const [horses, setHorses] = useState<Horse[]>([]);
  const [loadingHorses, setLoadingHorses] = useState(true);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  // Fetch horses from database
  useEffect(() => {
    const fetchHorses = async () => {
      setLoadingHorses(true);
      try {
        const { data, error } = await supabase
          .from('horses')
          .select('*')
          .eq('show_in_listing', true)
          .order('featured', { ascending: false })
          .order('created_at', { ascending: false });

        if (error) throw error;
        setHorses(data || []);
      } catch (err) {
        console.error('Error fetching horses:', err);
      } finally {
        setLoadingHorses(false);
      }
    };

    fetchHorses();
  }, []);

  // Fetch gallery items from database
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data, error } = await supabase
          .from('gallery')
          .select('*')
          .eq('show_in_gallery', true)
          .order('sort_order', { ascending: true });

        if (error) throw error;
        setGalleryItems(data || []);
      } catch (err) {
        console.error('Error fetching gallery:', err);
      }
    };

    fetchGallery();
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleFavorite = (id: string) => {
    const updated = favorites.includes(id)
      ? favorites.filter((fId) => fId !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-black text-stone-100">
      <Navigation activeSection={activeSection} onSectionClick={scrollToSection} />
      <HeroSection onSectionClick={scrollToSection} />
      <StatsBar />
      <HorsesSection
        horses={horses}
        loading={loadingHorses}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
      />
      <MissionSection />
      <GallerySection galleryItems={galleryItems} />
      <ContactSection horses={horses} />
      <Footer onSectionClick={scrollToSection} />
    </div>
  );
}
