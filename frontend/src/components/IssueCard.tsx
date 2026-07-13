import React from "react";
import { MapPin, Calendar, User, Info, ArrowUpRight } from "lucide-react";
import { Issue } from "@/types";
import { Button } from "./Button";

interface IssueCardProps {
  issue: Issue;
  onViewDetails: (issue: Issue) => void;
}

export const getImageUrl = (url: string) => {
  if (!url) return "/placeholder-issue.png"; // Fallback placeholder
  if (url.startsWith("http")) return url;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const baseUrl = apiUrl.replace(/\/api$/, "");
  return `${baseUrl}/uploads/${url}`;
};

export const IssueCard: React.FC<IssueCardProps> = ({ issue, onViewDetails }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30";
      case "In Progress":
        return "bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30";
      default:
        return "bg-yellow-50 text-yellow-700 border-yellow-100 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-900/30";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-50 text-red-700 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30";
      case "Medium":
        return "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30";
      default:
        return "bg-zinc-100 text-zinc-650 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700";
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (e) {
      return dateStr;
    }
  };

  const reporterName = typeof issue.createdBy === "object"
    ? issue.createdBy.fullName
    : "Citizen";

  return (
    <div className="flex flex-col rounded-3xl border border-zinc-150 bg-white/70 backdrop-blur-sm dark:border-zinc-850 dark:bg-zinc-900/40 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-950">
        {issue.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={getImageUrl(issue.imageUrl)}
            alt={issue.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 p-4">
            <MapPin className="w-10 h-10 mb-2 stroke-[1.5]" />
            <span className="text-xs font-semibold uppercase tracking-wider">No Image Uploaded</span>
          </div>
        )}

        {/* Priority Badge top left */}
        <span
          className={`absolute top-4 left-4 px-2.5 py-1 rounded-lg text-xs font-bold border ${getPriorityColor(
            issue.priority
          )}`}
        >
          {issue.priority} Priority
        </span>

        {/* Status Badge top right */}
        <span
          className={`absolute top-4 right-4 px-2.5 py-1 rounded-lg text-xs font-bold border ${getStatusColor(
            issue.status
          )}`}
        >
          {issue.status}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col">
        {/* Category & Date */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-md bg-blue-50/50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400">
            {issue.category}
          </span>
          <span className="flex items-center gap-1 text-xs font-medium text-zinc-400 dark:text-zinc-500">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(issue.createdAt)}
          </span>
        </div>

        {/* Title */}
        <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {issue.title}
        </h4>

        {/* Description */}
        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-4 flex-1">
          {issue.description}
        </p>

        {/* Info Rows */}
        <div className="space-y-2 border-t border-zinc-100 dark:border-zinc-850 pt-4 mb-5">
          <div className="flex items-start gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
            <span className="line-clamp-1">{issue.address}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <User className="w-4 h-4 text-zinc-400 shrink-0" />
            <span>Reported by: <span className="font-semibold">{reporterName}</span></span>
          </div>
        </div>

        {/* View Details Button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent transition-all"
          onClick={() => onViewDetails(issue)}
          rightIcon={<ArrowUpRight className="w-4 h-4" />}
        >
          Details & Map Location
        </Button>
      </div>
    </div>
  );
};
