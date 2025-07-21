"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Pill, Menu } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

export default function Header() {
  // Only use state on client
  const [open, setOpen] = useState(false);
  return (
    <nav className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Link
              href="/"
              className="flex items-center space-x-2 group"
              prefetch={false}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <Pill className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent group-hover:underline">
                MediScript
              </span>
            </Link>
          </div>
          {/* Desktop actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up/user">
              <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                Get Started
              </Button>
            </Link>
            <Link href="/sign-up/pharmacy">
              <Button variant="outline">Pharmacy Sign Up</Button>
            </Link>
          </div>
          {/* Mobile menu */}
          <div className="md:hidden flex items-center">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="p-0 w-64 h-full flex flex-col"
              >
                <VisuallyHidden>
                  <SheetTitle>Mobile Menu</SheetTitle>
                </VisuallyHidden>
                <div className="flex items-center space-x-2 p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                    <Pill className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    MediScript
                  </span>
                </div>
                <nav className="flex flex-col gap-2 p-4">
                  <Link href="/sign-in" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up/user" onClick={() => setOpen(false)}>
                    <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/sign-up/pharmacy" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full justify-start">
                      Pharmacy Sign Up
                    </Button>
                  </Link>
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Theme
                    </span>
                    <ThemeToggle />
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
