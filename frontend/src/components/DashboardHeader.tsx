"use client";

import React from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { Calendar } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
}) => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getFormattedDate = () => {
    return new Date().toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-100 dark:border-zinc-900 pb-6 mb-8 mt-2">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          {subtitle || `${getGreeting()}, ${user?.fullName.split(" ")[0]}! Here is what's happening.`}
        </p>
      </div>

      {/* Date display badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-zinc-150 bg-white/50 dark:border-zinc-800 dark:bg-zinc-900/30 text-xs font-semibold text-zinc-500 dark:text-zinc-400 shadow-sm shrink-0 w-fit">
        <Calendar className="w-4 h-4 text-blue-500" />
        <span>{getFormattedDate()}</span>
      </div>
    </div>
  );
};
