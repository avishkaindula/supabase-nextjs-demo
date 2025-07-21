"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-white py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold">MediScript</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Making prescription management simple, transparent, and affordable
              for everyone.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-500 dark:text-gray-400">
              <li>
                <Link
                  href="/how-it-works"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/sign-up"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Sign Up
                </Link>
              </li>
              <li>
                <Link
                  href="/sign-in"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-500 dark:text-gray-400">
              <li>
                <Link
                  href="/about"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-500 dark:text-gray-400">
              <li>
                <Link
                  href="/contact"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Contact Support
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@mediscript.com"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  support@mediscript.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 dark:text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} MediScript. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
