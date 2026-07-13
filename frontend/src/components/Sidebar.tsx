"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/AuthContext";
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  User,
  LogOut,
  Landmark,
  Shield,
  FileText
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const citizenLinks = [
    {
      href: "/citizen-dashboard",
      label: "My Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      href: "/report-issue",
      label: "Report Issue",
      icon: <PlusCircle className="w-5 h-5" />,
    },
    {
      href: "/issues",
      label: "Issues Feed",
      icon: <ClipboardList className="w-5 h-5" />,
    },
    {
      href: "/profile",
      label: "My Profile",
      icon: <User className="w-5 h-5" />,
    },
  ];

  const adminLinks = [
    {
      href: "/admin-dashboard",
      label: "Overview",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      href: "/issues",
      label: "Manage Issues",
      icon: <ClipboardList className="w-5 h-5" />,
    },
    {
      href: "/profile",
      label: "Admin Profile",
      icon: <User className="w-5 h-5" />,
    },
  ];

  const links = user?.role === "admin" ? adminLinks : citizenLinks;

  return (
    <aside className="w-64 bg-zinc-50 border-r border-zinc-150 flex flex-col h-[calc(100vh-4rem)] sticky top-16 dark:bg-zinc-950 dark:border-zinc-900 transition-colors shrink-0 hidden md:flex">
      {/* User Info Header */}
      <div className="p-6 border-b border-zinc-150 dark:border-zinc-900 flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 font-bold uppercase shrink-0">
          {user?.fullName.charAt(0)}
        </div>
        <div className="min-w-0">
          <h5 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 truncate leading-none mb-1">
            {user?.fullName}
          </h5>
          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-zinc-200/60 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-350">
            {user?.role === "admin" ? (
              <>
                <Shield className="w-2.5 h-2.5 text-red-500" /> Admin
              </>
            ) : (
              "Citizen"
            )}
          </span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-md shadow-blue-500/10 scale-[1.01]"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900"
              }`}
            >
              <span className={isActive ? "text-white animate-pulse" : "text-zinc-450"}>
                {link.icon}
              </span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer Log Out */}
      <div className="p-4 border-t border-zinc-150 dark:border-zinc-900">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold text-red-650 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 text-left transition-colors"
        >
          <LogOut className="w-5 h-5 text-red-550 dark:text-red-400 shrink-0" />
          Log Out
        </button>
      </div>
    </aside>
  );
};
