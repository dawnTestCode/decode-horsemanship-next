"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface PackagePricing {
  "day-pass": number;
  "stay-for-fire": number;
}

export function InquiryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pricing, setPricing] = useState<PackagePricing>({
    "day-pass": 72500,
    "stay-for-fire": 89500,
  });

  useEffect(() => {
    const fetchPricing = async () => {
      const { data } = await supabase
        .from("dust_leather_packages")
        .select("slug, price")
        .eq("active", true);

      if (data && data.length > 0) {
        const newPricing: PackagePricing = { "day-pass": 72500, "stay-for-fire": 89500 };
        data.forEach((pkg) => {
          if (pkg.slug === "day-pass") {
            newPricing["day-pass"] = pkg.price;
          } else if (pkg.slug === "stay-for-fire") {
            newPricing["stay-for-fire"] = pkg.price;
          }
        });
        setPricing(newPricing);
      }
    };

    fetchPricing();
  }, []);

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(0)}`;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/dust-and-leather/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          partySize: formData.get("partySize"),
          packageType: formData.get("package"),
          message: formData.get("message"),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="text-left space-y-6">
      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block font-mono-old uppercase tracking-[0.3em] text-sage text-xs mb-2"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full bg-char border border-tobacco/40 text-bone font-body px-4 py-3 focus:outline-none focus:border-sage transition-colors"
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block font-mono-old uppercase tracking-[0.3em] text-sage text-xs mb-2"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full bg-char border border-tobacco/40 text-bone font-body px-4 py-3 focus:outline-none focus:border-sage transition-colors"
        />
      </div>

      {/* Phone (optional) */}
      <div>
        <label
          htmlFor="phone"
          className="block font-mono-old uppercase tracking-[0.3em] text-sage text-xs mb-2"
        >
          Phone <span className="text-tobacco">(optional)</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          className="w-full bg-char border border-tobacco/40 text-bone font-body px-4 py-3 focus:outline-none focus:border-sage transition-colors"
        />
      </div>

      {/* Party size */}
      <div>
        <label
          htmlFor="partySize"
          className="block font-mono-old uppercase tracking-[0.3em] text-sage text-xs mb-2"
        >
          How many men
        </label>
        <select
          id="partySize"
          name="partySize"
          required
          defaultValue=""
          className="w-full bg-char border border-tobacco/40 text-bone font-body px-4 py-3 focus:outline-none focus:border-sage transition-colors appearance-none cursor-pointer"
        >
          <option value="" disabled>Select</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </div>

      {/* Package selection */}
      <fieldset>
        <legend className="block font-mono-old uppercase tracking-[0.3em] text-sage text-xs mb-3">
          Day Pass or Stay for the Fire
        </legend>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="package"
              value="day-pass"
              required
              className="w-4 h-4 accent-field"
            />
            <span className="font-body text-bone group-hover:text-dust transition-colors">
              Day Pass — {formatPrice(pricing["day-pass"])}
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="package"
              value="stay-for-fire"
              className="w-4 h-4 accent-field"
            />
            <span className="font-body text-bone group-hover:text-dust transition-colors">
              Stay for the Fire — {formatPrice(pricing["stay-for-fire"])}
            </span>
          </label>
        </div>
      </fieldset>

      {/* Message (optional) */}
      <div>
        <label
          htmlFor="message"
          className="block font-mono-old uppercase tracking-[0.3em] text-sage text-xs mb-2"
        >
          Tell us about the day you have in mind{" "}
          <span className="text-tobacco">(optional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="w-full bg-char border border-tobacco/40 text-bone font-body px-4 py-3 focus:outline-none focus:border-sage transition-colors resize-none"
        />
      </div>

      {/* Error message */}
      {error && (
        <p className="font-body text-ember text-sm">{error}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full font-mono-old uppercase tracking-[0.3em] text-sm bg-field hover:bg-field-deep disabled:bg-tobacco disabled:cursor-not-allowed text-bone px-8 py-4 transition-colors"
      >
        {isSubmitting ? "Redirecting to payment..." : "Book & Pay"}
      </button>

      <p className="font-voice italic text-dust/80 text-sm text-center">
        You&apos;ll be redirected to Stripe to complete payment.
      </p>
    </form>
  );
}
