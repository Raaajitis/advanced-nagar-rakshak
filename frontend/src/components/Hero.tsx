import React from "react";
import Link from "next/link";
import { ArrowRight, MapPin, CheckCircle, ShieldAlert } from "lucide-react";
import { Button } from "./Button";

export const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-white dark:from-zinc-950/30 dark:via-zinc-950 dark:to-zinc-950 py-20 lg:py-28 transition-colors">
      {/* Decorative Gradients */}
      <div className="absolute top-0 right-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
        <div className="aspect-[1155/678] w-[36rem] bg-gradient-to-tr from-emerald-400 to-blue-600 opacity-20 dark:opacity-10 sm:w-[72rem]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            Active Citizen Reporting & Monitoring System
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.1] mb-6">
            Building a Smarter, Clean City with{" "}
            <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-emerald-400">
              Nagar Rakshak
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-zinc-500 dark:text-zinc-405 max-w-2xl mb-10 leading-relaxed">
            Report local public utility problems like broken streetlights, road damage, potholes, and waste disposal delays. Track progress on live maps and hold administration accountable.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16 justify-center">
            <Link href="/report-issue">
              <Button variant="primary" size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Report an Issue
              </Button>
            </Link>
            <Link href="/issues">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Explore Issues Feed
              </Button>
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl border border-zinc-150/70 p-6 rounded-3xl bg-white/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/30 shadow-xl">
            <div className="flex flex-col items-center p-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-650 flex items-center justify-center dark:bg-blue-950/20 dark:text-blue-400 mb-2">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-zinc-900 dark:text-white">100%</span>
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-450 uppercase tracking-wider mt-1">
                Geotagged Pinpoints
              </span>
            </div>

            <div className="flex flex-col items-center p-4 sm:border-x border-zinc-150 dark:border-zinc-800">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-650 flex items-center justify-center dark:bg-emerald-950/20 dark:text-emerald-400 mb-2">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-zinc-900 dark:text-white">85%+</span>
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-450 uppercase tracking-wider mt-1">
                Resolution Rate
              </span>
            </div>

            <div className="flex flex-col items-center p-4">
              <div className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-650 flex items-center justify-center dark:bg-yellow-950/20 dark:text-yellow-400 mb-2">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-zinc-900 dark:text-white">&lt; 48 Hrs</span>
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-450 uppercase tracking-wider mt-1">
                Avg Response Time
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
