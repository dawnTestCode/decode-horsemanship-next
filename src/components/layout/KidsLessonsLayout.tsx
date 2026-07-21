'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';

interface KidsLessonsLayoutProps {
  children: React.ReactNode;
}

const KidsLessonsLayout: React.FC<KidsLessonsLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: '/kids-lessons', label: 'Kids & Family' },
    { href: '/kids-lessons/book', label: 'Book' },
  ];

  return (
    <div className="min-h-screen bg-[#0c0a09] text-[#f5f0eb]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0c0a09]/95 backdrop-blur-sm border-b border-[#3a2020]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/kids-lessons" className="flex items-center gap-3">
              <img src={siteConfig.branding.logoUrl} alt="Decode Horsemanship" className="h-12 w-auto" />
              <div className="hidden sm:block">
                <span className="text-lg font-bold text-[#f5f0eb]">Decode</span>
                <span className="block text-xs text-[#dc143c] -mt-1">Kids & Family</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-[#dc143c] ${
                    isActive(link.href) ? 'text-[#dc143c]' : 'text-[#b8a8a0]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/lessons"
                className="text-sm font-medium transition-colors hover:text-[#dc143c] text-[#b8a8a0]"
              >
                Adult Lessons
              </Link>
              <Link
                href="/"
                className="ml-4 px-4 py-2 text-sm font-medium border border-[#3a2020] rounded-lg text-[#a89890] hover:text-[#dc143c] hover:border-[#dc143c] transition-colors"
              >
                Back to Main Site →
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                className="p-2 text-[#b8a8a0] hover:text-[#dc143c]"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0c0a09]/95 border-t border-[#3a2020]">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 ${isActive(link.href) ? 'text-[#dc143c]' : 'text-[#b8a8a0] hover:text-[#dc143c]'}`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/lessons"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-[#b8a8a0] hover:text-[#dc143c]"
              >
                Adult Lessons
              </Link>
              <div className="pt-4 border-t border-[#3a2020] mt-4">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-[#a89890] hover:text-[#dc143c]"
                >
                  ← Back to Main Site
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#0c0a09] border-t border-[#3a2020] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src={siteConfig.branding.logoUrl} alt="Decode Horsemanship" className="h-12" />
                <div>
                  <span className="text-lg font-bold text-[#f5f0eb]">Decode</span>
                  <span className="block text-xs text-[#dc143c] -mt-1">Kids & Family</span>
                </div>
              </div>
              <p className="text-[#a89890] text-sm">
                Kids & family lessons in natural horsemanship. Ages 5–15.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[#f5f0eb] mb-4">Kids Lessons</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/kids-lessons" className="text-[#a89890] hover:text-[#dc143c] transition-colors text-sm">
                    About Kids Lessons
                  </Link>
                </li>
                <li>
                  <Link href="/kids-lessons/book" className="text-[#a89890] hover:text-[#dc143c] transition-colors text-sm">
                    Book a Lesson
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#f5f0eb] mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/lessons" className="text-[#a89890] hover:text-[#dc143c] transition-colors text-sm">
                    Adult Lessons
                  </Link>
                </li>
                <li>
                  <Link href="/experiences" className="text-[#a89890] hover:text-[#dc143c] transition-colors text-sm">
                    Experiences
                  </Link>
                </li>
                <li>
                  <Link href="/no-reins" className="text-[#a89890] hover:text-[#dc143c] transition-colors text-sm">
                    No Reins
                  </Link>
                </li>
                <li>
                  <Link href="/groundwork" className="text-[#a89890] hover:text-[#dc143c] transition-colors text-sm">
                    Groundwork
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-[#a89890] hover:text-[#dc143c] transition-colors text-sm">
                    Horse Rescue & Adoption
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#f5f0eb] mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-[#a89890]">
                <li>
                  <a href={`tel:${siteConfig.contact.phone}`} className="hover:text-[#dc143c] transition-colors flex items-center gap-2">
                    <Phone size={14} />
                    {siteConfig.contact.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-[#dc143c] transition-colors flex items-center gap-2">
                    <Mail size={14} />
                    {siteConfig.contact.email}
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin size={14} className="flex-shrink-0 mt-0.5" />
                  <span>{siteConfig.contact.location}</span>
                </li>
              </ul>
              <div className="flex gap-4 mt-4">
                {siteConfig.social.facebook && (
                  <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#150c0c] hover:bg-[#dc143c] border border-[#3a2020] hover:border-[#dc143c] rounded-full flex items-center justify-center transition-colors">
                    <Facebook size={18} />
                  </a>
                )}
                {siteConfig.social.instagram && (
                  <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#150c0c] hover:bg-[#dc143c] border border-[#3a2020] hover:border-[#dc143c] rounded-full flex items-center justify-center transition-colors">
                    <Instagram size={18} />
                  </a>
                )}
                {siteConfig.social.youtube && (
                  <a href={siteConfig.social.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#150c0c] hover:bg-[#dc143c] border border-[#3a2020] hover:border-[#dc143c] rounded-full flex items-center justify-center transition-colors">
                    <Youtube size={18} />
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-[#3a2020] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#a89890] text-sm">
              © 2026 Decode Horsemanship. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-[#a89890]">
              <button className="hover:text-[#dc143c] transition-colors">Privacy Policy</button>
              <button className="hover:text-[#dc143c] transition-colors">Terms of Service</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default KidsLessonsLayout;
