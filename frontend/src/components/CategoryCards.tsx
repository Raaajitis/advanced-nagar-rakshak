import React from "react";
import { AlertCircle, Trash2, Droplets, Lightbulb, HardHat, HelpCircle } from "lucide-react";

export interface CategoryItem {
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgClass: string;
}

interface CategoryCardsProps {
  onSelectCategory?: (category: string) => void;
  selectedCategory?: string;
  interactive?: boolean;
}

export const CategoryCards: React.FC<CategoryCardsProps> = ({
  onSelectCategory,
  selectedCategory,
  interactive = false,
}) => {
  const categories: CategoryItem[] = [
    {
      name: "Pothole",
      description: "Potholes, craters, and structural degradation on streets.",
      icon: <AlertCircle className="w-6 h-6" />,
      color: "text-amber-600 dark:text-amber-400",
      bgClass: "bg-amber-50 hover:bg-amber-100/70 border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/30",
    },
    {
      name: "Garbage",
      description: "Overflowing municipal dustbins, littering, and dump yards.",
      icon: <Trash2 className="w-6 h-6" />,
      color: "text-emerald-600 dark:text-emerald-400",
      bgClass: "bg-emerald-50 hover:bg-emerald-100/70 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30",
    },
    {
      name: "Water Logging",
      description: "Flooding, clogged drains, sewers overflow and standing water.",
      icon: <Droplets className="w-6 h-6" />,
      color: "text-blue-600 dark:text-blue-400",
      bgClass: "bg-blue-50 hover:bg-blue-100/70 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/30",
    },
    {
      name: "Streetlight",
      description: "Dark street lamps, flickering lights, and wiring problems.",
      icon: <Lightbulb className="w-6 h-6" />,
      color: "text-yellow-600 dark:text-yellow-400",
      bgClass: "bg-yellow-50 hover:bg-yellow-100/70 border-yellow-100 dark:bg-yellow-950/20 dark:border-yellow-900/30",
    },
    {
      name: "Road Damage",
      description: "Missing road dividers, major cracks, or uneven pavements.",
      icon: <HardHat className="w-6 h-6" />,
      color: "text-purple-600 dark:text-purple-400",
      bgClass: "bg-purple-50 hover:bg-purple-100/70 border-purple-100 dark:bg-purple-950/20 dark:border-purple-900/30",
    },
    {
      name: "Other",
      description: "Other local civic issues not matching the above categories.",
      icon: <HelpCircle className="w-6 h-6" />,
      color: "text-zinc-650 dark:text-zinc-400",
      bgClass: "bg-zinc-100 hover:bg-zinc-200 border-zinc-200 dark:bg-zinc-800/40 dark:border-zinc-700/60",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.name;
        const clickHandler = interactive && onSelectCategory ? () => onSelectCategory(cat.name) : undefined;

        return (
          <div
            key={cat.name}
            onClick={clickHandler}
            className={`flex flex-col p-6 rounded-3xl border transition-all duration-250 cursor-pointer ${cat.bgClass} ${
              interactive ? "hover:scale-[1.02] active:scale-98 shadow-sm hover:shadow-md" : ""
            } ${
              isSelected ? "ring-2 ring-blue-500 border-transparent scale-[1.02] shadow-md shadow-blue-500/10" : ""
            }`}
          >
            <div className={`flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow-sm dark:bg-zinc-900 mb-4 ${cat.color}`}>
              {cat.icon}
            </div>
            <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
              {cat.name}
            </h4>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed flex-1">
              {cat.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};
