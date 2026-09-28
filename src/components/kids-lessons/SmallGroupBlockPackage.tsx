'use client';

import Link from 'next/link';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { ArrowRight, X } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';

// Kids Small Group Block package details, shown in a modal from the Small Group format card.
// Radix Dialog handles focus trapping, Escape to close, and focus return to the trigger.
export default function SmallGroupBlockPackage() {
  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger className="inline-flex items-center gap-1 text-[#dc143c] hover:text-[#b01030] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc143c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#150c0c] rounded">
        View Block Package <ArrowRight size={14} />
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#0c0a09]/85 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-y-auto bg-[#150c0c] border-t-2 border-[#dc143c] rounded-t-xl p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl sm:border-2 sm:p-8 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
          <DialogPrimitive.Close className="absolute right-4 top-4 p-2 rounded text-[#b8a8a0] hover:text-[#dc143c] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc143c]">
            <X size={20} />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>

          <span className="inline-block text-[10px] font-semibold tracking-wide text-[#dc143c] bg-[#dc143c]/10 border border-[#dc143c]/40 px-2 py-1 rounded mb-4">
            Save $20
          </span>
          <DialogPrimitive.Title className="text-2xl md:text-3xl font-serif text-[#f5f0eb] leading-tight mb-4 pr-8">
            Kids Small Group Block Package
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="text-[#b8a8a0] mb-4">
            Save 10% by booking your child&apos;s Kids Small Group Block sessions four at a time. This package covers 4 sessions ($45/session instead of $50, a $20 savings over single bookings). After purchase, you&apos;ll receive a redemption code by email. Use it to reserve each spot individually as your schedule allows. Sessions don&apos;t need to be used consecutively, but we recommend booking your first slot right away to hold your child&apos;s place in the block.
          </DialogPrimitive.Description>
          <p className="text-sm text-[#f5f0eb] mb-6">
            Kids Small Group meets Tuesdays and Thursdays at 5:00 PM. Each session is 45 minutes.
          </p>

          <div className="border-t border-[#3a2020] pt-6">
            <a
              href={siteConfig.acuity.kidsSmallGroupPackageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full sm:inline-flex sm:w-auto items-center justify-center gap-2 px-8 py-4 bg-[#dc143c] hover:bg-[#b01030] text-white font-semibold rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5f0eb] focus-visible:ring-offset-2 focus-visible:ring-offset-[#150c0c]"
            >
              Buy the 4-Session Block ($180)
              <ArrowRight size={20} />
            </a>
            <p className="text-xs text-[#8a7a70] mt-3">
              Your redemption code arrives by email right after purchase.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
              <p className="text-sm text-[#b8a8a0]">Already have a code?</p>
              <Link
                href="/kids-lessons/book/small-group"
                className="flex w-full sm:inline-flex sm:w-auto items-center justify-center gap-2 px-6 py-3 border-2 border-[#3a2020] hover:border-[#dc143c] text-[#f5f0eb] hover:text-[#dc143c] font-semibold rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc143c]"
              >
                Reserve a Session
              </Link>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
