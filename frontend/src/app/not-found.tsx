"use client";

import React from "react";
import Link from "next/link";
import { Landmark, ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
      {/* Top logo */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 shadow-md">
            <Landmark className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-blue-700 to-emerald-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-emerald-400">
            Nagar Rakshak
          </span>
        </Link>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-12">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl animate-pulse w-32 h-32 mx-auto"></div>
          <div className="relative flex items-center justify-center w-24 h-24 rounded-3xl bg-zinc-150 text-zinc-400 dark:bg-zinc-900 dark:text-zinc-650 mx-auto shadow-inner border border-zinc-200 dark:border-zinc-800">
            <AlertTriangle className="w-12 h-12 text-yellow-500 stroke-[1.5]" />
          </div>
        </div>

        <h1 className="text-6xl sm:text-8xl font-black text-zinc-900 dark:text-white tracking-tighter mb-4">
          404
        </h1>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-850 dark:text-zinc-100 tracking-tight mb-3">
          Page Not Found
        </h2>

        <p className="text-zinc-550 dark:text-zinc-400 max-w-md mx-auto mb-10 leading-relaxed text-sm sm:text-base">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let's get you back on track.
        </p>

        <Link href="/">
          <Button
            variant="primary"
            size="lg"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Safety
          </Button>
        </Link>
      </main>

      {/* Footer copyright */}
      <footer className="py-6 text-center text-xs text-zinc-400 dark:text-zinc-600 border-t border-zinc-100 dark:border-zinc-900">
        &copy; {new Date().getFullYear()} Advanced Nagar Rakshak. All Rights Reserved.
      </footer>
    </div>
  );
}
