"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Menu,
  Home,
  FileText,
  BarChart3,
  LogOut,
  Pill,
  Upload,
  User as UserIcon,
  ClipboardList,
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOutAction } from "@/app/actions";

// Pharmacy navigation
const pharmacyNavigation = [
  { name: "Dashboard", href: "/pharmacy/dashboard", icon: Home },
  { name: "Prescriptions", href: "/pharmacy/prescriptions", icon: FileText },
  { name: "Quotations", href: "/pharmacy/quotations", icon: BarChart3 },
  { name: "Profile", href: "/pharmacy/profile", icon: UserIcon },
];

// User navigation
const userNavigation = [
  { name: "Dashboard", href: "/user/dashboard", icon: Home },
  { name: "Upload Prescription", href: "/user/upload", icon: Upload },
  { name: "Prescriptions", href: "/user/prescriptions", icon: ClipboardList },
  { name: "Quotations", href: "/user/quotations", icon: FileText },
  { name: "Profile", href: "/user/profile", icon: UserIcon },
];

function MobileSidebarContent({
  navigation,
  onNavigate,
}: {
  navigation: any[];
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  return (
    <div className="flex flex-col w-64 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Logo */}
      <div className="flex items-center space-x-2 p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
          <Pill className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          MediScript
        </span>
      </div>
      {/* Navigation */}
      <nav className="flex-grow p-4 space-y-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === item.href
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            onClick={onNavigate}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Theme
          </span>
          <ThemeToggle />
        </div>
        <form action={signOutAction}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  );
}

export function UserMobileHeader() {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden bg-white dark:bg-gray-800 shadow-sm border-b">
      <div className="flex items-center px-4 py-4">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={() => setOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </Button>
        <div className="flex-1 flex justify-center">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            MediScript
          </span>
        </div>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-64 h-full">
          <VisuallyHidden>
            <SheetTitle>Sidebar Navigation</SheetTitle>
          </VisuallyHidden>
          <MobileSidebarContent
            navigation={userNavigation}
            onNavigate={() => setOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function PharmacyMobileHeader() {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden bg-white dark:bg-gray-800 shadow-sm border-b">
      <div className="flex items-center px-4 py-4">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={() => setOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </Button>
        <div className="flex-1 flex justify-center">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            MediScript
          </span>
        </div>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-64 h-full">
          <VisuallyHidden>
            <SheetTitle>Sidebar Navigation</SheetTitle>
          </VisuallyHidden>
          <MobileSidebarContent
            navigation={pharmacyNavigation}
            onNavigate={() => setOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
