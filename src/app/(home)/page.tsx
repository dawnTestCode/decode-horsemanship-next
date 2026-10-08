'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Horse, GalleryItem } from '@/types';
import Navigation from '@/components/home/Navigation';
import HeroSection from '@/components/home/HeroSection';
import AudienceRouter from '@/components/home/AudienceRouter';
import FeaturedEvent from '@/components/home/FeaturedEvent';
import WorkshopsSection from '@/components/home/WorkshopsSection';
import WhyDecode from '@/components/home/WhyDecode';
import OrganizationCTA from '@/components/home/OrganizationCTA';
import LessonsCTA from '@/components/home/LessonsCTA';
import RescueProof from '@/components/home/RescueProof';
import HorsesSection from '@/components/home/HorsesSection';
import Testimonials from '@/components/home/Testimonials';
import GallerySection from '@/components/home/GallerySection';
import ContactSection from '@/components/home/ContactSection';
import Footer from '@/components/home/Footer';

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('home');
  const [horses, setHorses] = useState<Horse[]>([]);
  const [loadingHorses, setLoadingHorses] = useState(true);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
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
      } finally {
        setLoadingGallery(false);
      }
    };

    fetchGallery();
  }, []);

  // Handle URL hash on page load
  useEffect(() => {
    const hash = window.location.hash.slice(1); // Remove the #
    if (hash) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          setActiveSection(hash);
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    // Update URL hash for bookmarking
    window.history.pushState(null, '', `#${sectionId}`);
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
      <main>
        <HeroSection />
        <AudienceRouter />
        <FeaturedEvent />
        <WorkshopsSection />
        <WhyDecode />
        <OrganizationCTA />
        <LessonsCTA />
        <RescueProof />
        <HorsesSection
          horses={horses}
          loading={loadingHorses}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
        <Testimonials />
        <GallerySection galleryItems={galleryItems} loading={loadingGallery} />
        <ContactSection horses={horses} />
      </main>
      <Footer onSectionClick={scrollToSection} />
    </div>
  );
}
