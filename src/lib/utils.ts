import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a price string. If it's a number (or parseable as one),
 * format with $ and commas. Otherwise, return as-is (e.g., "low fours").
 */
export function formatPrice(price: string | null | undefined): string {
  if (!price) return '';

  // Remove any existing $ or commas to check if it's a number
  const cleaned = price.replace(/[$,]/g, '').trim();
  const num = parseFloat(cleaned);

  // If it's a valid number, format it
  if (!isNaN(num) && isFinite(num) && cleaned === num.toString()) {
    return '$' + num.toLocaleString('en-US');
  }

  // Otherwise return the original string (e.g., "low fours", "contact for price")
  return price;
}
