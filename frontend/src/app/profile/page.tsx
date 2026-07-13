"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useAuth } from "@/features/auth/AuthContext";
import { issueService } from "@/services/issue";
import { adminService } from "@/services/admin";
import { User as UserIcon, Mail, Phone, Shield, ShieldAlert, Award, FileText, CheckCircle } from "lucide-react";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [personalStats, setPersonalStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchProfileStats = async () => {
      if (!user) return;
      try {
        if (user.role === "admin") {
          const stats = await adminService.getStats();
          setPersonalStats({
            total: stats.totalIssues,
            resolved: stats.resolvedIssues,
            pending: stats.pendingIssues,
          });
        } else {
          // Citizen: fetch all issues and filter by user ID
          const allIssues = await issueService.getIssues();
          const myIssues = allIssues.filter((issue) => {
            const creatorId = typeof issue.createdBy === "object" ? issue.createdBy._id : issue.createdBy;
            const currentUserId = user.id || (user as any)._id;
            return creatorId === currentUserId;
          });
          
          setPersonalStats({
            total: myIssues.length,
            resolved: myIssues.filter((i) => i.status === "Resolved").length,
            pending: myIssues.filter((i) => i.status === "Pending").length,
          });
        }
      } catch (error) {
        console.error("Failed to load profile stats", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchProfileStats();
  }, [user]);

  if (authLoading) {
    return <LoadingSpinner fullPage message="Verifying session..." />;
  }

  if (!user) {
    return null; // Route Guard handles redirect
  }

  const getRoleBadge = (role: string) => {
    if (role === "admin") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30 uppercase">
          <ShieldAlert className="w-3.5 h-3.5" /> Ward Administrator
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30 uppercase">
        <UserIcon className="w-3.5 h-3.5" /> Verified Resident
      </span>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <Navbar />

      <div className="flex-1 flex flex-row">
        <Sidebar />

        <main className="flex-1 p-6 sm:p-8 max-w-5xl mx-auto overflow-y-auto w-full">
          <DashboardHeader
            title="My Profile"
            subtitle="Manage your personal credentials, contact numbers, and view platform metrics."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Card - User Avatar & Badges */}
            <div className="md:col-span-1 bg-white border border-zinc-150 p-6 rounded-3xl dark:bg-zinc-900 dark:border-zinc-800 shadow-xl flex flex-col items-center text-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-3xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 font-black text-3xl uppercase flex items-center justify-center border-2 border-white dark:border-zinc-850 shadow-md">
                  {user.fullName.charAt(0)}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow">
                  <Award className="w-3.5 h-3.5" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mt-4 tracking-tight">
                {user.fullName}
              </h3>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 mb-4 truncate w-full max-w-[200px]">
                {user.email}
              </p>

              <div className="mt-2">{getRoleBadge(user.role)}</div>

              {/* Joined Date */}
              <div className="w-full border-t border-zinc-100 dark:border-zinc-850 pt-5 mt-6 text-left">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Account Information</span>
                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-450 mt-2">
                  <span>Registered Ward</span>
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">Ward #15, Central</span>
                </div>
                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-450 mt-2.5">
                  <span>Portal Status</span>
                  <span className="font-semibold text-emerald-600">Active</span>
                </div>
              </div>
            </div>

            {/* Right Card - Profile Details & Statistics */}
            <div className="md:col-span-2 space-y-6">
              {/* Profile Details Form */}
              <div className="bg-white border border-zinc-150 p-6 sm:p-8 rounded-3xl dark:bg-zinc-900 dark:border-zinc-800 shadow-xl transition-colors">
                <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 pb-2 border-b border-zinc-100 dark:border-zinc-850">
                  Profile Details
                </h4>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center shrink-0 border border-zinc-100 dark:border-zinc-850">
                      <UserIcon className="w-4 h-4 text-zinc-450" />
                    </div>
                    <div>
                      <span className="text-xs text-zinc-400">Full Name</span>
                      <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{user.fullName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center shrink-0 border border-zinc-100 dark:border-zinc-850">
                      <Mail className="w-4 h-4 text-zinc-455" />
                    </div>
                    <div>
                      <span className="text-xs text-zinc-400">Email Address</span>
                      <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center shrink-0 border border-zinc-100 dark:border-zinc-850">
                      <Phone className="w-4 h-4 text-zinc-455" />
                    </div>
                    <div>
                      <span className="text-xs text-zinc-400">Contact Number</span>
                      <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">+91 {user.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center shrink-0 border border-zinc-100 dark:border-zinc-850">
                      <Shield className="w-4 h-4 text-zinc-455" />
                    </div>
                    <div>
                      <span className="text-xs text-zinc-400">Access Permissions</span>
                      <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                        {user.role === "admin" ? "Administrative, Moderation, Analytics" : "Report Incident, View Feed"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Platform Statistics */}
              <div className="bg-white border border-zinc-150 p-6 sm:p-8 rounded-3xl dark:bg-zinc-900 dark:border-zinc-800 shadow-xl transition-colors">
                <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">
                  {user.role === "admin" ? "Municipal Platform Performance" : "My Contribution Stats"}
                </h4>

                {loadingStats ? (
                  <div className="py-4">
                    <LoadingSpinner message="Calculating stats..." />
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-center dark:bg-blue-950/15 dark:border-blue-900/30">
                      <FileText className="w-5 h-5 text-blue-650 mx-auto mb-2" />
                      <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-450 block uppercase">
                        {user.role === "admin" ? "Total Cases" : "Reported"}
                      </span>
                      <span className="text-2xl font-black text-blue-700 dark:text-blue-400 mt-1 block">
                        {personalStats.total}
                      </span>
                    </div>

                    <div className="p-4 bg-yellow-50/50 rounded-2xl border border-yellow-100 text-center dark:bg-yellow-950/15 dark:border-yellow-900/30">
                      <Shield className="w-5 h-5 text-yellow-650 mx-auto mb-2" />
                      <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-450 block uppercase">
                        {user.role === "admin" ? "Unresolved" : "Pending"}
                      </span>
                      <span className="text-2xl font-black text-yellow-700 dark:text-yellow-400 mt-1 block">
                        {personalStats.pending}
                      </span>
                    </div>

                    <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-center dark:bg-emerald-950/15 dark:border-emerald-900/30">
                      <CheckCircle className="w-5 h-5 text-emerald-650 mx-auto mb-2" />
                      <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-455 block uppercase">
                        Resolved
                      </span>
                      <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1 block">
                        {personalStats.resolved}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
