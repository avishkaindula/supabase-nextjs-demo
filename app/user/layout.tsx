"use client";

import { UserMobileHeader } from "@/components/mobile-header";
import { UserSidebar } from "@/components/user-sidebar";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <div className="hidden md:block">
        <UserSidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <UserMobileHeader />
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
