import React from "react";
import { ClipboardList } from "lucide-react";
import { Button } from "./Button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-zinc-200 rounded-3xl bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/20 max-w-md mx-auto my-8">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-100 text-zinc-400 dark:bg-zinc-850 dark:text-zinc-500 mb-5 shadow-inner">
        {icon || <ClipboardList className="w-8 h-8" />}
      </div>
      <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
        {title}
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
