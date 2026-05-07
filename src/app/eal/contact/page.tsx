'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Loader2 } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    program: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          inquiry_type: formData.program || 'general',
          message: formData.message,
          horse_name: null
        }),
      });

      if (!response.ok) throw new Error('Failed to submit');

      setFormSubmitted(true);
      setFormData({ name: '', email: '', phone: '', program: '', message: '' });
    } catch (err: unknown) {
      console.error('Error submitting form:', err);
      setFormError('There was an error sending your message. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-stone-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Get In <span className="text-red-500">Touch</span>
          </h1>
          <p className="text-xl text-stone-400 mb-8 max-w-2xl mx-auto">
            Have questions about our programs? Ready to schedule an experience?
            We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-stone-900/50 p-8 rounded-xl border border-stone-800">
              <h2 className="text-2xl font-bold text-stone-100 mb-6">Send Us a Message</h2>

              {formSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-stone-200 mb-2">Message Sent!</h3>
                  <p className="text-stone-400 mb-6">We&apos;ll get back to you within 24-48 hours.</p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="text-red-500 hover:text-red-400 transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm text-stone-400 mb-2">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-stone-200 focus:border-red-500 focus:outline-none transition-colors"
                      placeholder="Jane Smith"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-stone-400 mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-stone-200 focus:border-red-500 focus:outline-none transition-colors"
                        placeholder="jane@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-stone-400 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-stone-200 focus:border-red-500 focus:outline-none transition-colors"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-stone-400 mb-2">I&apos;m Interested In</label>
                    <select
                      value={formData.program}
                      onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                      className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-stone-200 focus:border-red-500 focus:outline-none transition-colors"
                    >
                      <option value="">Select a program (optional)</option>
                      <option value="corporate">Corporate Programs</option>
                      <option value="personal">Personal Development</option>
                      <option value="mustang">Mustang Immersion</option>
                      <option value="youth">Youth Programs</option>
                      <option value="adoption">Horse Adoption</option>
                      <option value="boarding">Boarding Inquiry</option>
                      <option value="general">General Question</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-stone-400 mb-2">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-stone-200 focus:border-red-500 focus:outline-none transition-colors resize-none"
                      placeholder="Tell us about what you're looking for..."
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
                <h2 className="text-2xl font-bold text-stone-200 mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="text-red-500" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-stone-200">Phone</h4>
                      <a href={`tel:${siteConfig.contact.phone}`} className="text-stone-400 hover:text-red-500 transition-colors">
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
                      <a href={`mailto:${siteConfig.contact.email}`} className="text-stone-400 hover:text-red-500 transition-colors">
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
                      <p className="text-stone-400">{siteConfig.contact.location}</p>
                      <p className="text-stone-500 text-sm">{siteConfig.contact.locationNote}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="text-red-500" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-stone-200">Visiting Hours</h4>
                      <p className="text-stone-400">{siteConfig.hours.weekends}</p>
                      <p className="text-stone-400">{siteConfig.hours.weekdays}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Preview */}
              <div className="bg-stone-900/50 p-8 rounded-xl border border-stone-800">
                <h3 className="text-xl font-bold text-stone-200 mb-4">Common Questions</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-stone-300 mb-1">Do I need horse experience?</h4>
                    <p className="text-stone-500 text-sm">
                      No! All our EAL activities are on the ground and designed for participants
                      of all experience levels.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-300 mb-1">What should I wear?</h4>
                    <p className="text-stone-500 text-sm">
                      Closed-toe shoes are required. Dress comfortably and weather-appropriately—we&apos;re
                      outdoors!
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-300 mb-1">How do I schedule a program?</h4>
                    <p className="text-stone-500 text-sm">
                      Fill out the form or give us a call. We&apos;ll have a brief discovery conversation
                      to understand your goals, then propose dates.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
