'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: '/eal', label: 'Overview' },
    { href: '/eal/about', label: 'About Dawn' },
    { href: '/eal/mustang', label: 'Mustangs' },
    { href: '/eal/corporate', label: 'Corporate' },
    { href: '/eal/no-reins', label: 'Women' },
    { href: '/eal/youth', label: 'Youth' },
    { href: '/summer-camp', label: 'Summer Camp' },
    { href: '/eal/contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen bg-black text-stone-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/eal" className="flex items-center gap-3">
              <img src={siteConfig.branding.logoUrl} alt="Decode Horsemanship" className="h-12 w-auto" />
              <div className="hidden sm:block">
                <span className="text-lg font-bold text-stone-100">Decode</span>
                <span className="block text-xs text-red-500 -mt-1">Equine Assisted Learning</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-red-500 ${
                    isActive(link.href) ? 'text-red-500' : 'text-stone-300'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/"
                className="ml-4 px-4 py-2 text-sm font-medium border border-stone-700 rounded-lg text-stone-400 hover:text-red-500 hover:border-red-500 transition-colors"
              >
                Back to Main Site →
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                className="p-2 text-stone-300 hover:text-red-500"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/95 border-t border-stone-800">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 ${isActive(link.href) ? 'text-red-500' : 'text-stone-300 hover:text-red-500'}`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-stone-800 mt-4">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-stone-400 hover:text-red-500"
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
      <footer className="bg-stone-950 border-t border-stone-800 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src={siteConfig.branding.logoUrl} alt="Decode Horsemanship" className="h-12" />
                <div>
                  <span className="text-lg font-bold text-stone-100">Decode</span>
                  <span className="block text-xs text-red-500 -mt-1">Equine Assisted Learning</span>
                </div>
              </div>
              <p className="text-stone-500 text-sm">
                Transformative experiences through partnership with horses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-stone-200 mb-4">Programs</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/eal/corporate" className="text-stone-500 hover:text-red-500 transition-colors text-sm">
                    Corporate Programs
                  </Link>
                </li>
                <li>
                  <Link href="/eal/no-reins" className="text-stone-500 hover:text-red-500 transition-colors text-sm">
                    No Reins (Women)
                  </Link>
                </li>
                <li>
                  <Link href="/eal/mustang" className="text-stone-500 hover:text-red-500 transition-colors text-sm">
                    Mustang Immersion
                  </Link>
                </li>
                <li>
                  <Link href="/eal/youth" className="text-stone-500 hover:text-red-500 transition-colors text-sm">
                    Youth Programs
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-stone-200 mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/eal" className="text-stone-500 hover:text-red-500 transition-colors text-sm">
                    What is EAL?
                  </Link>
                </li>
                <li>
                  <Link href="/eal/about" className="text-stone-500 hover:text-red-500 transition-colors text-sm">
                    About Dawn
                  </Link>
                </li>
                <li>
                  <Link href="/eal/contact" className="text-stone-500 hover:text-red-500 transition-colors text-sm">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-stone-500 hover:text-red-500 transition-colors text-sm">
                    Horse Rescue & Adoption
                  </Link>
                </li>
                <li>
                  <a
                    href="https://forms.gle/DszFyex1HKBbLDw6A"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-500 hover:text-red-500 transition-colors text-sm"
                  >
                    Liability Waiver
                  </a>
                </li>
                <li>
                  <Link href="/groundwork" className="text-stone-500 hover:text-red-500 transition-colors text-sm">
                    Groundwork
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-stone-200 mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-stone-500">
                <li>
                  <a href={`tel:${siteConfig.contact.phone}`} className="hover:text-red-500 transition-colors flex items-center gap-2">
                    <Phone size={14} />
                    {siteConfig.contact.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-red-500 transition-colors flex items-center gap-2">
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
                  <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-stone-800 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors">
                    <Facebook size={18} />
                  </a>
                )}
                {siteConfig.social.instagram && (
                  <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-stone-800 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors">
                    <Instagram size={18} />
                  </a>
                )}
                {siteConfig.social.youtube && (
                  <a href={siteConfig.social.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-stone-800 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors">
                    <Youtube size={18} />
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-stone-600 text-sm">
              © 2026 Decode Horsemanship. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-stone-600">
              <button className="hover:text-red-500 transition-colors">Privacy Policy</button>
              <button className="hover:text-red-500 transition-colors">Terms of Service</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PageLayout;
