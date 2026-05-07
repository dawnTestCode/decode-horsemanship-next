'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube, Loader2 } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';
import { Horse } from '@/types';

interface ContactSectionProps {
  horses: Horse[];
}

export default function ContactSection({ horses }: ContactSectionProps) {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'adoption',
    message: '',
    horseName: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          phone: contactForm.phone || null,
          inquiry_type: contactForm.inquiryType,
          message: contactForm.message,
          horse_name: contactForm.horseName || null,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit');

      setFormSubmitted(true);
      setContactForm({ name: '', email: '', phone: '', inquiryType: 'adoption', message: '', horseName: '' });
      setTimeout(() => setFormSubmitted(false), 5000);
    } catch (err: unknown) {
      console.error('Error submitting form:', err);
      setFormError('There was an error sending your message. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Get In <span className="text-red-500">Touch</span>
          </h2>
          <p className="text-stone-400 max-w-2xl mx-auto">
            Ready to meet your new partner? Have questions about our horses or services? We&apos;d love to hear from
            you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-stone-900/50 p-8 rounded-xl border border-stone-800">
            {formSubmitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-stone-200 mb-2">Message Sent!</h3>
                <p className="text-stone-400">We&apos;ll get back to you within 24-48 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm text-stone-400 mb-2">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-stone-200 focus:border-red-500 focus:outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-stone-400 mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-stone-200 focus:border-red-500 focus:outline-none transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-stone-400 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-stone-200 focus:border-red-500 focus:outline-none transition-colors"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-stone-400 mb-2">Inquiry Type</label>
                    <select
                      value={contactForm.inquiryType}
                      onChange={(e) => setContactForm({ ...contactForm, inquiryType: e.target.value })}
                      className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-stone-200 focus:border-red-500 focus:outline-none transition-colors"
                    >
                      <option value="adoption">Interested in Adopting</option>
                      <option value="boarding">Boarding Inquiry</option>
                      <option value="general">General Question</option>
                      <option value="volunteer">Volunteer/Support</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-stone-400 mb-2">Interested in Horse</label>
                    <select
                      value={contactForm.horseName}
                      onChange={(e) => setContactForm({ ...contactForm, horseName: e.target.value })}
                      className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-stone-200 focus:border-red-500 focus:outline-none transition-colors"
                    >
                      <option value="">Select a horse (optional)</option>
                      {horses
                        .filter((h) => h.status !== 'sold')
                        .map((horse) => (
                          <option key={horse.id} value={horse.name}>
                            {horse.name} - {horse.breed}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-stone-400 mb-2">Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-stone-200 focus:border-red-500 focus:outline-none transition-colors resize-none"
                    placeholder="Tell us about yourself and what you're looking for..."
                  />
                </div>
                {formError && (
                  <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm">
                    {formError}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-4 bg-red-700 hover:bg-red-600 disabled:bg-red-900 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-stone-200 mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="text-red-500" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-200">Phone</h4>
                    <p className="text-stone-400">{siteConfig.contact.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="text-red-500" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-200">Email</h4>
                    <p className="text-stone-400">{siteConfig.contact.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-red-500" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-200">Location</h4>
                    <p className="text-stone-400">
                      {siteConfig.contact.location}
                      <br />
                      {siteConfig.contact.locationNote}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="text-red-500" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-200">Visiting Hours</h4>
                    <p className="text-stone-400">
                      {siteConfig.hours.weekends}
                      <br />
                      {siteConfig.hours.weekdays}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-stone-200 mb-4">Follow Our Journey</h3>
              <div className="flex gap-4">
                {siteConfig.social.facebook && (
                  <a
                    href={siteConfig.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-stone-800 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Facebook size={20} />
                  </a>
                )}
                {siteConfig.social.instagram && (
                  <a
                    href={siteConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-stone-800 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Instagram size={20} />
                  </a>
                )}
                {siteConfig.social.youtube && (
                  <a
                    href={siteConfig.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-stone-800 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Youtube size={20} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
