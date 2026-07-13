"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { StatsCards } from "@/components/StatsCards";
import { IssueTable } from "@/components/IssueTable";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";
import { Modal } from "@/components/Modal";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useAuth } from "@/features/auth/AuthContext";
import { adminService } from "@/services/admin";
import { issueService } from "@/services/issue";
import { Issue, AdminStats, IssueStatus, IssueCategory, IssuePriority } from "@/types";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Search, SlidersHorizontal, BarChart3, PieChartIcon, Loader2, HelpCircle } from "lucide-react";
import { getImageUrl } from "@/components/IssueCard";

// Dynamically import InteractiveMap to avoid SSR errors
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

// Colors for charts
const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#6B7280"];

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  // Table Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const fetchData = async () => {
    try {
      const statsData = await adminService.getStats();
      const issuesData = await issueService.getIssues();
      setStats(statsData);
      setIssues(issuesData);
      setFilteredIssues(issuesData);
    } catch (error) {
      console.error("Failed to load admin dashboard data", error);
      toast.error("Failed to load statistics or reports");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchData();
    }
  }, [user]);

  // Apply filters to table
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

  const handleStatusChange = async (id: string, newStatus: IssueStatus) => {
    const updatingToast = toast.loading("Updating issue status...");
    try {
      await adminService.updateIssueStatus(id, newStatus);
      toast.success("Issue status updated successfully", { id: updatingToast });
      
      // Refresh local states
      await fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status", { id: updatingToast });
    }
  };

  if (authLoading) {
    return <LoadingSpinner fullPage message="Verifying session..." />;
  }

  // Double check admin role
  if (user && user.role !== "admin") {
    return null; // Route Guard handles redirect to citizen portal
  }

  // Format Recharts data
  const pieData = stats?.categoryDistribution.map((item) => ({
    name: item._id,
    value: item.count,
  })) || [];

  const barData = stats
    ? [
        { status: "Pending", count: stats.pendingIssues, fill: "#F59E0B" },
        { status: "In Progress", count: stats.inProgressIssues, fill: "#F97316" },
        { status: "Resolved", count: stats.resolvedIssues, fill: "#10B981" },
      ]
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <Navbar />

      <div className="flex-1 flex flex-row">
        <Sidebar />

        <main className="flex-1 p-6 sm:p-8 max-w-6xl mx-auto overflow-y-auto w-full">
          <DashboardHeader
            title="Ward Command Center"
            subtitle="Municipal administration panel to review reports, monitor status charts, and manage resolutions."
          />

          {loadingData ? (
            <div className="py-20">
              <LoadingSpinner message="Calculating city analytics..." />
            </div>
          ) : (
            <div className="space-y-10">
              {/* Counters */}
              <StatsCards
                total={stats?.totalIssues}
                pending={stats?.pendingIssues}
                inProgress={stats?.inProgressIssues}
                resolved={stats?.resolvedIssues}
              />

              {/* Visualizations Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Category Pie Chart */}
                <div className="bg-white border border-zinc-150 p-6 rounded-3xl dark:bg-zinc-900 dark:border-zinc-800 shadow-lg">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5 text-blue-600" />
                    Reports Category Distribution
                  </h3>
                  <div className="h-64">
                    {pieData.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-xs text-zinc-400">
                        No category data available
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              background: "#18181b",
                              border: "none",
                              borderRadius: "12px",
                              color: "#fff",
                            }}
                          />
                          <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                {/* Status Bar Chart */}
                <div className="bg-white border border-zinc-150 p-6 rounded-3xl dark:bg-zinc-900 dark:border-zinc-800 shadow-lg">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-emerald-600" />
                    Resolution Lifecycle Metrics
                  </h3>
                  <div className="h-64">
                    {barData.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-xs text-zinc-400">
                        No status data available
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData}>
                          <XAxis dataKey="status" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                          <Tooltip
                            contentStyle={{
                              background: "#18181b",
                              border: "none",
                              borderRadius: "12px",
                              color: "#fff",
                            }}
                            cursor={{ fill: "transparent" }}
                          />
                          <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={40}>
                            {barData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>

              {/* Table section */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                    Citizen Complaints Review Board
                  </h3>

                  <div className="flex items-center gap-3">
                    {/* Search bar */}
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                      <input
                        type="text"
                        placeholder="Search title, description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder-zinc-450 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-150"
                      />
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      leftIcon={<SlidersHorizontal className="w-3.5 h-3.5" />}
                    >
                      Filters
                    </Button>
                  </div>
                </div>

                {/* Filters Drawer */}
                {showFilters && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white border border-zinc-150 p-4 rounded-2xl dark:bg-zinc-900 dark:border-zinc-800 shadow-inner animate-fade-in">
                    <Input
                      label="Category"
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
                      label="Priority"
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
                      label="Status"
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
                  </div>
                )}

                {/* Table Data */}
                {filteredIssues.length === 0 ? (
                  <div className="text-center py-12 text-zinc-450 border border-dashed border-zinc-200 rounded-3xl dark:border-zinc-850 dark:bg-zinc-900/10">
                    <HelpCircle className="w-10 h-10 mx-auto mb-2 text-zinc-400 stroke-[1.5]" />
                    <p className="text-sm font-semibold">No complaints found matching criteria</p>
                  </div>
                ) : (
                  <IssueTable
                    isAdmin
                    issues={filteredIssues}
                    onStatusChange={handleStatusChange}
                    onViewDetails={(issue) => setSelectedIssue(issue)}
                  />
                )}
              </div>
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
                <p className="text-sm font-bold text-zinc-855 dark:text-zinc-200 mt-0.5">{selectedIssue.priority}</p>
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-150 dark:border-zinc-850">
                <span className="text-[10px] uppercase font-bold text-zinc-400">Status</span>
                <p className="text-sm font-bold text-zinc-855 dark:text-zinc-200 mt-0.5">{selectedIssue.status}</p>
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-150 dark:border-zinc-850">
                <span className="text-[10px] uppercase font-bold text-zinc-400">Reported Date</span>
                <p className="text-sm font-bold text-zinc-855 dark:text-zinc-200 mt-0.5">
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
