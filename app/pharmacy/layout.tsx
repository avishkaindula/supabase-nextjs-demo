"use client";

import { PharmacyMobileHeader } from "@/components/mobile-header";
import { PharmacySidebar } from "@/components/pharmacy-sidebar";

export default function PharmacyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <div className="hidden md:block">
        <PharmacySidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <PharmacyMobileHeader />
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
