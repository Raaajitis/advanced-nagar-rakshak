"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { StatsCards } from "@/components/StatsCards";
import { IssueCard } from "@/components/IssueCard";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { useAuth } from "@/features/auth/AuthContext";
import { issueService } from "@/services/issue";
import { Issue } from "@/types";
import { Plus, ListFilter, Map, Grid, Loader2 } from "lucide-react";
import { getImageUrl } from "@/components/IssueCard";

// Dynamically load Map Container to avoid SSR hydration issues
const InteractiveMap = dynamic(
  () => import("@/components/InteractiveMap").then((mod) => mod.InteractiveMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[350px] w-full bg-zinc-100 dark:bg-zinc-900 rounded-3xl flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-650 animate-pulse border border-zinc-150 dark:border-zinc-800">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <span className="text-xs font-semibold uppercase tracking-wider">Loading Map Pins...</span>
      </div>
    ),
  }
);

export default function CitizenDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [myIssues, setMyIssues] = useState<Issue[]>([]);
  const [loadingIssues, setLoadingIssues] = useState<boolean>(true);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  useEffect(() => {
    const fetchMyIssues = async () => {
      if (!user) return;
      try {
        const data = await issueService.getIssues();
        
        // Filter issues created by this user
        const filtered = data.filter((issue) => {
          const creatorId = typeof issue.createdBy === "object" ? issue.createdBy._id : issue.createdBy;
          return creatorId === user.id;
        });

        setMyIssues(filtered);
      } catch (error) {
        console.error("Failed to load user issues", error);
      } finally {
        setLoadingIssues(false);
      }
    };

    fetchMyIssues();
  }, [user]);

  if (authLoading) {
    return <LoadingSpinner fullPage message="Verifying session..." />;
  }

  if (!user) {
    return null; // Route Guard handles redirect
  }

  // Calculate user stats
  const total = myIssues.length;
  const pending = myIssues.filter((i) => i.status === "Pending").length;
  const inProgress = myIssues.filter((i) => i.status === "In Progress").length;
  const resolved = myIssues.filter((i) => i.status === "Resolved").length;

  const navigateToReport = () => router.push("/report-issue");

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <Navbar />

      <div className="flex-1 flex flex-row">
        <Sidebar />

        <main className="flex-1 p-6 sm:p-8 max-w-6xl mx-auto overflow-y-auto w-full">
          {/* Dashboard Title & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <DashboardHeader
              title="Citizen Dashboard"
              subtitle="Track, monitor, and view the progress of all infrastructure reports you have filed."
            />
            <div className="shrink-0 mb-6 sm:mb-0">
              <Button
                variant="primary"
                onClick={navigateToReport}
                leftIcon={<Plus className="w-4.5 h-4.5" />}
              >
                Report New Issue
              </Button>
            </div>
          </div>

          {/* Stats Summary Cards */}
          <div className="mb-10">
            <StatsCards
              total={total}
              pending={pending}
              inProgress={inProgress}
              resolved={resolved}
              isLoading={loadingIssues}
            />
          </div>

          {/* Map / List View Toggle and Title */}
          {loadingIssues ? (
            <div className="py-12">
              <LoadingSpinner message="Loading your reports..." />
            </div>
          ) : myIssues.length === 0 ? (
            <EmptyState
              title="No Issues Reported Yet"
              description="Your dashboard is currently empty. If you spot a pothole, broken streetlight, water leakage, or litter, report it and we will alert the ward office."
              actionLabel="Report Issue Now"
              onAction={navigateToReport}
            />
          ) : (
            <div className="space-y-6">
              {/* Header options */}
              <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-850 pb-4">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  My Reported Cases ({myIssues.length})
                </h3>
                
                {/* Mode Selectors */}
                <div className="flex items-center rounded-xl border border-zinc-200 p-1 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "grid"
                        ? "bg-white text-blue-600 shadow-sm dark:bg-zinc-900 dark:text-blue-400"
                        : "text-zinc-450 hover:text-zinc-650"
                    }`}
                    title="Grid view"
                  >
                    <Grid className="w-4.5 h-4.5" />
                  </button>
                  <button
                    onClick={() => setViewMode("map")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "map"
                        ? "bg-white text-blue-600 shadow-sm dark:bg-zinc-900 dark:text-blue-400"
                        : "text-zinc-450 hover:text-zinc-650"
                    }`}
                    title="Map view"
                  >
                    <Map className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>

              {/* View Content */}
              {viewMode === "map" ? (
                <div className="relative z-10">
                  <InteractiveMap
                    issues={myIssues}
                    zoom={12}
                    onViewIssueDetails={(issue) => setSelectedIssue(issue)}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                  {myIssues.map((issue) => (
                    <IssueCard
                      key={issue._id}
                      issue={issue}
                      onViewDetails={(issue) => setSelectedIssue(issue)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

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
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
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
