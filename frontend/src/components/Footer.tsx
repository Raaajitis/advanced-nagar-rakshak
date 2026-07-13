import React from "react";
import Link from "next/link";
import { Landmark, Mail, Phone, MapPin, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-zinc-50 border-t border-zinc-150 py-12 dark:bg-zinc-950 dark:border-zinc-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 shadow-md">
                <Landmark className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-blue-700 to-emerald-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-emerald-400">
                Nagar Rakshak
              </span>
            </Link>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Empowering citizens to report issues, track resolutions, and collaborate directly with local municipal bodies to build cleaner, safer neighborhoods.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/"
                  className="text-sm text-zinc-650 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/issues"
                  className="text-sm text-zinc-650 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors"
                >
                  Reported Issues
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm text-zinc-650 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors"
                >
                  Citizen Portal
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm text-zinc-650 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors"
                >
                  Administrative Access
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Info */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5">
              <li>
                <span className="text-sm text-zinc-650 dark:text-zinc-400 cursor-pointer hover:text-blue-500">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-sm text-zinc-650 dark:text-zinc-400 cursor-pointer hover:text-blue-500">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="text-sm text-zinc-650 dark:text-zinc-400 cursor-pointer hover:text-blue-500">
                  Municipal Guidelines
                </span>
              </li>
              <li>
                <span className="text-sm text-zinc-650 dark:text-zinc-400 cursor-pointer hover:text-blue-500">
                  API Documentation
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-4">
              Contact Support
            </h4>
            <div className="flex items-start gap-2.5 text-zinc-500 dark:text-zinc-400 text-sm">
              <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <span>Municipal Office Building, Civic Center Area, City Road, IN</span>
            </div>
            <div className="flex items-center gap-2.5 text-zinc-500 dark:text-zinc-400 text-sm">
              <Phone className="w-4 h-4 text-blue-500 shrink-0" />
              <span>+91 1800-CIVIC-CARE</span>
            </div>
            <div className="flex items-center gap-2.5 text-zinc-500 dark:text-zinc-400 text-sm">
              <Mail className="w-4 h-4 text-blue-500 shrink-0" />
              <span>support@nagarrakshak.gov.in</span>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-zinc-200 dark:border-zinc-900 pt-8 mt-8 text-xs text-zinc-500 dark:text-zinc-400">
          <p>© {new Date().getFullYear()} Advanced Nagar Rakshak. All Rights Reserved.</p>
          <p className="flex items-center gap-1.5 mt-2 sm:mt-0">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> for a cleaner tomorrow.
          </p>
        </div>
      </div>
    </footer>
  );
};
