'use client';

import Link from 'next/link';
import { siteConfig } from '@/config/siteConfig';

interface FooterProps {
  onSectionClick: (section: string) => void;
}

export default function Footer({ onSectionClick }: FooterProps) {
  return (
    <footer className="bg-stone-950 border-t border-stone-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <img src={siteConfig.branding.logoUrl} alt="Decode Horsemanship" className="h-16 mb-4" />
            <p className="text-stone-500 text-sm">
              {siteConfig.branding.tagline}. Giving horses a second chance at life.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-stone-200 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'Horses', 'Mission', 'Gallery', 'Contact'].map((link) => (
                <li key={link}>
                  <button
                    onClick={() => onSectionClick(link.toLowerCase())}
                    className="text-stone-500 hover:text-red-500 transition-colors text-sm"
                  >
                    {link}
                  </button>
                </li>
              ))}
              <li>
                <Link href="/volunteer" className="text-stone-500 hover:text-green-500 transition-colors text-sm">
                  Volunteer Portal
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-stone-200 mb-4">Programs</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/groundwork" className="text-stone-500 hover:text-red-500 transition-colors text-sm">
                  Groundwork
                </Link>
              </li>
              <li>
                <Link href="/eal" className="text-stone-500 hover:text-red-500 transition-colors text-sm">
                  What is EAL?
                </Link>
              </li>
              <li>
                <Link href="/eal/corporate" className="text-stone-500 hover:text-red-500 transition-colors text-sm">
                  Corporate Programs
                </Link>
              </li>
              <li>
                <Link href="/eal/personal" className="text-stone-500 hover:text-red-500 transition-colors text-sm">
                  Personal Development
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
            <h4 className="font-semibold text-stone-200 mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-stone-500">
              <li>
                <a href={`tel:${siteConfig.contact.phone}`} className="hover:text-red-500 transition-colors">
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-red-500 transition-colors">
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <a
                  href="https://www.google.com/maps/@35.8514978,-79.0178807,15z?entry=ttu&g_ep=EgoyMDI2MDIwNC4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-500 transition-colors"
                >
                  {siteConfig.contact.location}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-stone-600 text-sm">&copy; 2026 Decode Horsemanship. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-stone-600">
            <button className="hover:text-red-500 transition-colors">Privacy Policy</button>
            <button className="hover:text-red-500 transition-colors">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
