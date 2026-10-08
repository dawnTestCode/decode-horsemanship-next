'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Settings, Users, Lock } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';

type NavItem = { label: string; href?: string; section?: string; primary?: boolean };

// Same order on desktop and mobile
const navItems: NavItem[] = [
  { label: 'Experiences', href: '/experiences', primary: true },
  { label: 'Teams & Organizations', href: '/corporate' },
  { label: 'Lessons', href: '/lessons' },
  { label: 'Horses & Rescue', section: 'mission' },
  { label: 'About', href: '/about/dawn' },
  { label: 'Contact', section: 'contact' },
];

interface NavigationProps {
  activeSection: string;
  onSectionClick: (section: string) => void;
}

export default function Navigation({ activeSection, onSectionClick }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

  const handleSectionClick = (section: string) => {
    onSectionClick(section);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button
            type="button"
            className="flex items-center gap-3"
            onClick={() => handleSectionClick('home')}
          >
            <img src={siteConfig.branding.logoUrl} alt="Decode Horsemanship home" className="h-14 w-auto" />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) =>
              item.section ? (
                <a
                  key={item.label}
                  href={`#${item.section}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSectionClick(item.section!);
                  }}
                  className={`text-sm font-medium transition-colors hover:text-red-500 ${
                    activeSection === item.section ? 'text-red-500' : 'text-stone-300'
                  }`}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  href={item.href!}
                  className={
                    item.primary
                      ? 'px-4 py-2 text-sm font-semibold bg-red-700 hover:bg-red-600 text-white rounded-lg transition-colors'
                      : 'text-sm font-medium transition-colors hover:text-red-500 text-stone-300'
                  }
                >
                  {item.label}
                </Link>
              )
            )}
            <div className="relative">
              <button
                onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                className="p-2 text-stone-500 hover:text-red-500 transition-colors"
                title="Portal Access"
                aria-label="Portal access"
              >
                <Settings size={20} />
              </button>
              {showSettingsDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowSettingsDropdown(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-stone-900 border border-stone-700 rounded-lg shadow-xl z-50 overflow-hidden">
                    <Link
                      href="/volunteer"
                      onClick={() => setShowSettingsDropdown(false)}
                      className="w-full px-4 py-3 flex items-center gap-3 text-left text-stone-300 hover:bg-stone-800 hover:text-green-500 transition-colors"
                    >
                      <Users size={18} />
                      <span>Volunteer Portal</span>
                    </Link>
                    <Link
                      href="/admin"
                      onClick={() => setShowSettingsDropdown(false)}
                      className="w-full px-4 py-3 flex items-center gap-3 text-left text-stone-300 hover:bg-stone-800 hover:text-red-500 transition-colors border-t border-stone-700"
                    >
                      <Lock size={18} />
                      <span>Admin Portal</span>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                className="p-2 text-stone-500 hover:text-red-500 transition-colors"
                title="Portal Access"
                aria-label="Portal access"
              >
                <Settings size={20} />
              </button>
              {showSettingsDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowSettingsDropdown(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-stone-900 border border-stone-700 rounded-lg shadow-xl z-50 overflow-hidden">
                    <Link
                      href="/volunteer"
                      onClick={() => setShowSettingsDropdown(false)}
                      className="w-full px-4 py-3 flex items-center gap-3 text-left text-stone-300 hover:bg-stone-800 hover:text-green-500 transition-colors"
                    >
                      <Users size={18} />
                      <span>Volunteer Portal</span>
                    </Link>
                    <Link
                      href="/admin"
                      onClick={() => setShowSettingsDropdown(false)}
                      className="w-full px-4 py-3 flex items-center gap-3 text-left text-stone-300 hover:bg-stone-800 hover:text-red-500 transition-colors border-t border-stone-700"
                    >
                      <Lock size={18} />
                      <span>Admin Portal</span>
                    </Link>
                  </div>
                </>
              )}
            </div>
            <button
              className="p-2 text-stone-300 hover:text-red-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="lg:hidden bg-black/95 border-t border-stone-800">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) =>
              item.section ? (
                <a
                  key={item.label}
                  href={`#${item.section}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSectionClick(item.section!);
                  }}
                  className="block w-full text-left py-2 text-stone-300 hover:text-red-500"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  href={item.href!}
                  onClick={() => setMobileMenuOpen(false)}
                  className={
                    item.primary
                      ? 'block w-full text-center py-3 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg'
                      : 'block w-full text-left py-2 text-stone-300 hover:text-red-500'
                  }
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
