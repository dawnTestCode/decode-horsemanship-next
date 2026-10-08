'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube, Loader2 } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';
import { Horse } from '@/types';

interface ContactSectionProps {
  horses: Horse[];
}

const interestOptions = [
  { value: 'personal', label: 'Personal workshop' },
  { value: 'corporate', label: 'Leadership or team experience' },
  { value: 'organizational-change', label: 'Organizational change work' },
  { value: 'lessons', label: 'Private lessons' },
  { value: 'adoption', label: 'Horse adoption or rescue' },
  { value: 'not-sure', label: 'Not sure yet' },
];

const inputClass =
  'w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-stone-200 focus:border-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 transition-colors';

export default function ContactSection({ horses }: ContactSectionProps) {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'not-sure',
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
          horse_name: (contactForm.inquiryType === 'adoption' && contactForm.horseName) || null,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit');

      setFormSubmitted(true);
      setContactForm({ name: '', email: '', phone: '', inquiryType: 'not-sure', message: '', horseName: '' });
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
          <h2 className="text-3xl md:text-5xl font-bold mb-4 max-w-3xl mx-auto">
            You do not have to know which program you need.
          </h2>
          <p className="text-lg text-stone-400 max-w-2xl mx-auto mb-8">
            Tell us who is coming, what is changing, or what keeps pulling you toward horses. We&rsquo;ll tell you
            the clearest place to start.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact-form"
              className="px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
            >
              Start the conversation
            </a>
            <a
              href={siteConfig.contact.phoneHref}
              className="px-8 py-4 border-2 border-stone-600 hover:border-red-500 text-stone-200 hover:text-red-500 font-semibold rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
            >
              Call {siteConfig.contact.phone}
            </a>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div id="contact-form" className="bg-stone-900/50 p-8 rounded-xl border border-stone-800 scroll-mt-24">
            {formSubmitted ? (
              <div className="text-center py-12" role="status">
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
                  <label htmlFor="contact-name" className="block text-sm text-stone-400 mb-2">Your Name *</label>
                  <input
                    id="contact-name"
                    autoComplete="name"
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className={inputClass}
                    placeholder="John Doe"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-email" className="block text-sm text-stone-400 mb-2">Email *</label>
                    <input
                      id="contact-email"
                      autoComplete="email"
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className={inputClass}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="block text-sm text-stone-400 mb-2">Phone</label>
                    <input
                      id="contact-phone"
                      autoComplete="tel"
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className={inputClass}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className={contactForm.inquiryType === 'adoption' ? '' : 'sm:col-span-2'}>
                    <label htmlFor="contact-interest" className="block text-sm text-stone-400 mb-2">I&rsquo;m interested in</label>
                    <select
                      id="contact-interest"
                      value={contactForm.inquiryType}
                      onChange={(e) => setContactForm({ ...contactForm, inquiryType: e.target.value })}
                      className={inputClass}
                    >
                      {interestOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {contactForm.inquiryType === 'adoption' && (
                  <div>
                    <label htmlFor="contact-horse" className="block text-sm text-stone-400 mb-2">Interested in Horse</label>
                    <select
                      id="contact-horse"
                      value={contactForm.horseName}
                      onChange={(e) => setContactForm({ ...contactForm, horseName: e.target.value })}
                      className={inputClass}
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
                  )}
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-sm text-stone-400 mb-2">Message *</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className={`${inputClass} resize-none`}
                    placeholder="Who is coming, what is changing, or what you're hoping to find..."
                  />
                </div>
                {formError && (
                  <div role="alert" className="p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm">
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
                    'Start the conversation'
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
                    <a href={siteConfig.contact.phoneHref} className="text-stone-400 hover:text-red-500 transition-colors">
                      {siteConfig.contact.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="text-red-500" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-200">Email</h4>
                    <a href={`mailto:${siteConfig.contact.email}`} className="text-stone-400 hover:text-red-500 transition-colors break-all">
                      {siteConfig.contact.email}
                    </a>
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
                    aria-label="Decode Horsemanship on Facebook"
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
                    aria-label="Decode Horsemanship on Instagram"
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
                    aria-label="Decode Horsemanship on YouTube"
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
