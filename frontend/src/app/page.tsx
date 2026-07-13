"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { CategoryCards } from "@/components/CategoryCards";
import { IssueCard } from "@/components/IssueCard";
import { Footer } from "@/components/Footer";
import { issueService } from "@/services/issue";
import { Issue } from "@/types";
import { Map, ListCollapse, HelpCircle, Loader2 } from "lucide-react";
import { Modal } from "@/components/Modal";
import { getImageUrl } from "@/components/IssueCard";

// Dynamically import map to prevent Next SSR issues
const InteractiveMap = dynamic(
  () => import("@/components/InteractiveMap").then((mod) => mod.InteractiveMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[450px] w-full bg-zinc-100 dark:bg-zinc-900 rounded-3xl flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-650 animate-pulse border border-zinc-150 dark:border-zinc-800">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <span className="text-xs font-semibold uppercase tracking-wider">Loading Map Modules...</span>
      </div>
    ),
  }
);

export default function Home() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const data = await issueService.getIssues();
        setIssues(data);
      } catch (error) {
        console.error("Failed to load issues", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  const recentIssues = issues.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <Navbar />
      <Hero />

      {/* Map Section */}
      <section className="py-12 bg-white dark:bg-zinc-900 border-y border-zinc-150 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight flex items-center justify-center gap-2.5">
              <Map className="w-8 h-8 text-blue-650" />
              Live City Issue Tracker
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm sm:text-base">
              Browse reported problems pinpointed on our interactive map. Red indicates high priority, green represents solved cases. Click pins for summary details.
            </p>
          </div>

          <InteractiveMap
            issues={issues}
            zoom={11}
            onViewIssueDetails={(issue) => setSelectedIssue(issue)}
          />
        </div>
      </section>

      {/* Category Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight flex items-center justify-center gap-2.5">
              <ListCollapse className="w-8 h-8 text-emerald-600" />
              Report Categories
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm sm:text-base">
              We monitor and route reports to specialized municipal divisions. Select a category below to see details.
            </p>
          </div>

          <CategoryCards />
        </div>
      </section>

      {/* Recent Feed Section */}
      <section className="py-16 bg-white dark:bg-zinc-900 border-t border-zinc-150 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                Recent Citizen Reports
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">
                Latest updates submitted by residents to clean and maintain the ward.
              </p>
            </div>
            <a
              href="/issues"
              className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline shrink-0"
            >
              Browse all reports &rarr;
            </a>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-zinc-200 bg-white/70 animate-pulse h-80 dark:border-zinc-800 dark:bg-zinc-900/30"
                />
              ))}
            </div>
          ) : recentIssues.length === 0 ? (
            <div className="text-center py-12 text-zinc-400 dark:text-zinc-650 flex flex-col items-center">
              <HelpCircle className="w-12 h-12 mb-3 stroke-[1.5]" />
              <p className="font-semibold">No issues reported yet. Be the first to file a report!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentIssues.map((issue) => (
                <IssueCard
                  key={issue._id}
                  issue={issue}
                  onViewDetails={(issue) => setSelectedIssue(issue)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* Global Details Modal */}
      {selectedIssue && (
        <Modal
          isOpen={!!selectedIssue}
          onClose={() => setSelectedIssue(null)}
          title={selectedIssue.title}
          size="lg"
        >
          <div className="flex flex-col gap-6">
            {selectedIssue.imageUrl && (
              <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getImageUrl(selectedIssue.imageUrl)}
                  alt={selectedIssue.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-150 dark:border-zinc-850">
                <span className="text-[10px] uppercase font-bold text-zinc-400">Category</span>
                <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{selectedIssue.category}</p>
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-150 dark:border-zinc-850">
                <span className="text-[10px] uppercase font-bold text-zinc-400">Priority</span>
                <p className="text-sm font-bold text-zinc-850 dark:text-zinc-200 mt-0.5">{selectedIssue.priority}</p>
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-150 dark:border-zinc-850">
                <span className="text-[10px] uppercase font-bold text-zinc-400">Status</span>
                <p className="text-sm font-bold text-zinc-850 dark:text-zinc-200 mt-0.5">{selectedIssue.status}</p>
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-150 dark:border-zinc-850">
                <span className="text-[10px] uppercase font-bold text-zinc-400">Reported Date</span>
                <p className="text-sm font-bold text-zinc-850 dark:text-zinc-200 mt-0.5">
                  {new Date(selectedIssue.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>
            </div>

            <div>
              <h5 className="font-extrabold text-zinc-900 dark:text-white mb-1.5">Description</h5>
              <p className="text-sm text-zinc-650 dark:text-zinc-350 leading-relaxed bg-zinc-50 dark:bg-zinc-950/20 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-850">
                {selectedIssue.description}
              </p>
            </div>

            <div>
              <h5 className="font-extrabold text-zinc-900 dark:text-white mb-2">Location Address</h5>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 mb-3">
                <span>{selectedIssue.address}</span>
              </p>
              <div className="h-48 w-full rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-850 relative z-10">
                <InteractiveMap
                  issues={[selectedIssue]}
                  center={[selectedIssue.latitude, selectedIssue.longitude]}
                  zoom={14}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
