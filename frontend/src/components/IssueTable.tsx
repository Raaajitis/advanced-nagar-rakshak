import React from "react";
import { Eye, ArrowUpRight, Calendar } from "lucide-react";
import { Issue, IssueStatus } from "@/types";
import { Button } from "./Button";
import { getImageUrl } from "./IssueCard";

interface IssueTableProps {
  issues: Issue[];
  onViewDetails: (issue: Issue) => void;
  onStatusChange?: (id: string, newStatus: IssueStatus) => void;
  isAdmin?: boolean;
}

export const IssueTable: React.FC<IssueTableProps> = ({
  issues,
  onViewDetails,
  onStatusChange,
  isAdmin = false,
}) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30";
      case "In Progress":
        return "bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30";
      default:
        return "bg-yellow-50 text-yellow-700 border-yellow-100 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-900/30";
    }
  };

  const getPriorityStyle = (priority: string) => {
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

  return (
    <div className="w-full overflow-x-auto rounded-3xl border border-zinc-150 bg-white/70 backdrop-blur-sm dark:border-zinc-850 dark:bg-zinc-900/40 shadow-xl">
      <table className="w-full border-collapse text-left text-sm text-zinc-500 dark:text-zinc-400">
        <thead className="bg-zinc-50/50 text-xs font-bold uppercase tracking-wider text-zinc-700 border-b border-zinc-100 dark:bg-zinc-950/40 dark:text-zinc-350 dark:border-zinc-850">
          <tr>
            <th className="px-6 py-4">Issue</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">Priority</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Reported By</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850">
          {issues.map((issue) => {
            const reporterName = typeof issue.createdBy === "object"
              ? issue.createdBy.fullName
              : "Citizen";

            return (
              <tr key={issue._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20 transition-colors">
                <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white max-w-xs">
                  <div className="flex items-center gap-3">
                    {issue.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={getImageUrl(issue.imageUrl)}
                        alt={issue.title}
                        className="w-10 h-10 rounded-lg object-cover bg-zinc-100 dark:bg-zinc-950 shrink-0"
                      />
                    )}
                    <span className="truncate block" title={issue.title}>
                      {issue.title}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold uppercase bg-blue-50/50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400">
                    {issue.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border ${getPriorityStyle(issue.priority)}`}>
                    {issue.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {isAdmin && onStatusChange ? (
                    <select
                      value={issue.status}
                      onChange={(e) => onStatusChange(issue._id, e.target.value as IssueStatus)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none focus:ring-2 focus:ring-blue-550/20 cursor-pointer ${getStatusStyle(issue.status)}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  ) : (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border ${getStatusStyle(issue.status)}`}>
                      {issue.status}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-zinc-700 dark:text-zinc-350">
                  {reporterName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-zinc-450" />
                    {formatDate(issue.createdAt)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-3"
                    onClick={() => onViewDetails(issue)}
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                  >
                    View
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
