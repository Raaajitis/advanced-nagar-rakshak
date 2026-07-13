import React from "react";
import { ClipboardList, Clock, CheckCircle2, AlertTriangle } from "lucide-react";

interface StatsCardsProps {
  total?: number;
  pending?: number;
  inProgress?: number;
  resolved?: number;
  isLoading?: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  total = 0,
  pending = 0,
  inProgress = 0,
  resolved = 0,
  isLoading = false,
}) => {
  const cards = [
    {
      title: "Total Issues",
      value: total,
      icon: <ClipboardList className="w-5 h-5" />,
      colorClass: "text-blue-600 dark:text-blue-400",
      bgClass: "bg-blue-50/70 border-blue-100 dark:bg-blue-950/15 dark:border-blue-900/30",
      glowClass: "bg-blue-500/10",
    },
    {
      title: "Pending Reviews",
      value: pending,
      icon: <AlertTriangle className="w-5 h-5" />,
      colorClass: "text-yellow-600 dark:text-yellow-400",
      bgClass: "bg-yellow-50/70 border-yellow-100 dark:bg-yellow-950/15 dark:border-yellow-900/30",
      glowClass: "bg-yellow-500/10",
    },
    {
      title: "In Progress",
      value: inProgress,
      icon: <Clock className="w-5 h-5" />,
      colorClass: "text-orange-600 dark:text-orange-400",
      bgClass: "bg-orange-50/70 border-orange-100 dark:bg-orange-950/15 dark:border-orange-900/30",
      glowClass: "bg-orange-500/10",
    },
    {
      title: "Resolved Cases",
      value: resolved,
      icon: <CheckCircle2 className="w-5 h-5" />,
      colorClass: "text-emerald-600 dark:text-emerald-400",
      bgClass: "bg-emerald-50/70 border-emerald-100 dark:bg-emerald-950/15 dark:border-emerald-900/30",
      glowClass: "bg-emerald-500/10",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col p-6 rounded-3xl border border-zinc-150 bg-white dark:border-zinc-800 dark:bg-zinc-900/30 animate-pulse h-32"
          >
            <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800 mb-4"></div>
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3 mb-2"></div>
            <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`relative overflow-hidden flex flex-col p-6 rounded-3xl border bg-white/50 backdrop-blur-sm dark:bg-zinc-900/10 transition-all duration-200 hover:scale-[1.02] shadow-sm hover:shadow-md ${card.bgClass}`}
        >
          {/* Accent glow in corner */}
          <div className={`absolute -top-12 -right-12 w-24 h-24 rounded-full blur-2xl ${card.glowClass}`} />

          <div className={`flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm dark:bg-zinc-900 mb-4 ${card.colorClass}`}>
            {card.icon}
          </div>

          <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-450 tracking-wide uppercase">
            {card.title}
          </span>
          <span className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">
            {card.value}
          </span>
        </div>
      ))}
    </div>
  );
};
