"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { IssueCard } from "@/components/IssueCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { useAuth } from "@/features/auth/AuthContext";
import { issueService } from "@/services/issue";
import { Issue, IssueCategory, IssuePriority, IssueStatus } from "@/types";
import { Search, SlidersHorizontal, Map, Grid, Loader2, HelpCircle } from "lucide-react";
import { getImageUrl } from "@/components/IssueCard";

// Dynamically load Map Container to avoid SSR hydration issues
const InteractiveMap = dynamic(
  () => import("@/components/InteractiveMap").then((mod) => mod.InteractiveMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] w-full bg-zinc-100 dark:bg-zinc-900 rounded-3xl flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-650 animate-pulse border border-zinc-150 dark:border-zinc-800">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <span className="text-xs font-semibold uppercase tracking-wider">Loading Map Pins...</span>
      </div>
    ),
  }
);

export default function IssuesFeedPage() {
  const { user, loading: authLoading } = useAuth();
  
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const data = await issueService.getIssues();
        setIssues(data);
        setFilteredIssues(data);
      } catch (error) {
        console.error("Failed to fetch issues in feed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = issues;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (issue) =>
          issue.title.toLowerCase().includes(term) ||
          issue.description.toLowerCase().includes(term) ||
          issue.address.toLowerCase().includes(term)
      );
    }

    if (categoryFilter !== "All") {
      result = result.filter((issue) => issue.category === categoryFilter);
    }

    if (priorityFilter !== "All") {
      result = result.filter((issue) => issue.priority === priorityFilter);
    }

    if (statusFilter !== "All") {
      result = result.filter((issue) => issue.status === statusFilter);
    }

    setFilteredIssues(result);
  }, [searchTerm, categoryFilter, priorityFilter, statusFilter, issues]);

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("All");
    setPriorityFilter("All");
    setStatusFilter("All");
  };

  const getSubTitleText = () => {
    if (user) {
      return `Welcome, ${user.fullName.split(" ")[0]}. Browse, filter, and track public issues posted across the city.`;
    }
    return "Browse public infrastructure and utility complaints reported by citizens.";
  };

  if (authLoading) {
    return <LoadingSpinner fullPage message="Verifying session..." />;
  }

  const renderContent = () => (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-zinc-150 p-4 rounded-3xl dark:bg-zinc-900 dark:border-zinc-800 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by title, description, or landmark..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-zinc-900 placeholder-zinc-450 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Toggle Filters Button */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              leftIcon={<SlidersHorizontal className="w-4 h-4" />}
            >
              Filters
            </Button>

            {/* Toggle View Mode Button (Grid vs Map) */}
            <div className="flex items-center rounded-xl border border-zinc-200 p-1 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-blue-600 shadow-sm dark:bg-zinc-900 dark:text-blue-400"
                    : "text-zinc-450 hover:text-zinc-650"
                }`}
                title="Grid list view"
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
        </div>

        {/* Extended Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-zinc-100 dark:border-zinc-850 pt-4 animate-fade-in">
            <Input
              label="Filter Category"
              type="select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={[
                { value: "All", label: "All Categories" },
                { value: "Pothole", label: "Pothole" },
                { value: "Garbage", label: "Garbage" },
                { value: "Water Logging", label: "Water Logging" },
                { value: "Streetlight", label: "Streetlight" },
                { value: "Road Damage", label: "Road Damage" },
                { value: "Other", label: "Other" },
              ]}
            />

            <Input
              label="Filter Priority"
              type="select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              options={[
                { value: "All", label: "All Priorities" },
                { value: "Low", label: "Low Priority" },
                { value: "Medium", label: "Medium Priority" },
                { value: "High", label: "High Priority" },
              ]}
            />

            <Input
              label="Filter Status"
              type="select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: "All", label: "All Statuses" },
                { value: "Pending", label: "Pending" },
                { value: "In Progress", label: "In Progress" },
                { value: "Resolved", label: "Resolved" },
              ]}
            />

            <div className="sm:col-span-3 flex justify-end">
              <span
                onClick={clearFilters}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
              >
                Reset Filters
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area (Dynamic based on View Mode) */}
      {loading ? (
        <div className="py-20">
          <LoadingSpinner message="Fetching reported issues..." />
        </div>
      ) : filteredIssues.length === 0 ? (
        <div className="text-center py-20 text-zinc-450 dark:text-zinc-650 flex flex-col items-center max-w-sm mx-auto border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 bg-zinc-50/20">
          <HelpCircle className="w-12 h-12 mb-3 stroke-[1.5]" />
          <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">No reports match filter</h4>
          <p className="text-xs mb-4">Try clearing filters or search query to find more issues.</p>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Reset Filters
          </Button>
        </div>
      ) : viewMode === "map" ? (
        <div className="relative z-10">
          <InteractiveMap
            issues={filteredIssues}
            zoom={11}
            onViewIssueDetails={(issue) => setSelectedIssue(issue)}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIssues.map((issue) => (
            <IssueCard
              key={issue._id}
              issue={issue}
              onViewDetails={(issue) => setSelectedIssue(issue)}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <Navbar />

      <div className="flex-1 flex flex-row">
        {/* Only show Sidebar if user is logged in */}
        {user && <Sidebar />}

        {/* Content panel */}
        <main className={`flex-1 p-6 sm:p-8 overflow-y-auto ${user ? "max-w-6xl" : "max-w-7xl"} mx-auto w-full`}>
          <DashboardHeader
            title="Ward Issues Feed"
            subtitle={getSubTitleText()}
          />

          {renderContent()}
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
