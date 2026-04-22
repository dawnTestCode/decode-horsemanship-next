'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Settings, Users, Lock } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';

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
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => handleSectionClick('home')}
          >
            <img src={siteConfig.branding.logoUrl} alt="Decode Horsemanship" className="h-14 w-auto" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {['home', 'horses', 'mission', 'gallery', 'contact'].map((section) => (
              <button
                key={section}
                onClick={() => handleSectionClick(section)}
                className={`capitalize text-sm font-medium transition-colors hover:text-red-500 ${
                  activeSection === section ? 'text-red-500' : 'text-stone-300'
                }`}
              >
                {section === 'horses' ? 'Horses' : section}
              </button>
            ))}
            <Link
              href="/eal"
              className="text-sm font-medium transition-colors hover:text-red-500 text-stone-300"
            >
              EAL Programs
            </Link>
            <Link
              href="/summer-camp"
              className="text-sm font-medium transition-colors hover:text-amber-400 text-stone-300"
            >
              Summer Camp
            </Link>
            <a
              href="https://forms.gle/DszFyex1HKBbLDw6A"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium transition-colors hover:text-red-500 text-stone-300"
            >
              Waiver
            </a>
            <div className="relative">
              <button
                onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                className="p-2 text-stone-500 hover:text-red-500 transition-colors"
                title="Portal Access"
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
          <div className="md:hidden flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                className="p-2 text-stone-500 hover:text-red-500 transition-colors"
                title="Portal Access"
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
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 border-t border-stone-800">
          <div className="px-4 py-4 space-y-3">
            {['home', 'horses', 'mission', 'gallery', 'contact'].map((section) => (
              <button
                key={section}
                onClick={() => handleSectionClick(section)}
                className="block w-full text-left capitalize py-2 text-stone-300 hover:text-red-500"
              >
                {section === 'horses' ? 'Horses' : section}
              </button>
            ))}
            <Link
              href="/eal"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-left py-2 text-stone-300 hover:text-red-500"
            >
              EAL Programs
            </Link>
            <Link
              href="/summer-camp"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-left py-2 text-stone-300 hover:text-amber-400"
            >
              Summer Camp
            </Link>
            <a
              href="https://forms.gle/DszFyex1HKBbLDw6A"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-left py-2 text-stone-300 hover:text-red-500"
            >
              Waiver
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
