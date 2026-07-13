import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  fullPage?: boolean;
  size?: "sm" | "md" | "lg";
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  fullPage = false,
  size = "md",
  message = "Loading...",
}) => {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  const containerStyles = fullPage
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/70 backdrop-blur-md dark:bg-black/75"
    : "flex flex-col items-center justify-center p-8 w-full h-full min-h-[200px]";

  return (
    <div className={containerStyles}>
      <div className="relative flex items-center justify-center">
        {/* Glow behind the spinner */}
        <div className="absolute w-12 h-12 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <Loader2 className={`${sizes[size]} text-blue-600 animate-spin relative z-10 dark:text-emerald-500`} />
      </div>
      {message && (
        <p className="mt-4 text-sm font-medium text-zinc-600 dark:text-zinc-400 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};
