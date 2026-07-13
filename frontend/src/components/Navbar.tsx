"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/AuthContext";
import { Menu, X, Landmark, User, LogOut, LayoutDashboard, Shield, PlusCircle } from "lucide-react";
import { Button } from "./Button";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/issues", label: "Issues Feed" },
  ];

  const getDashboardHref = () => {
    return user?.role === "admin" ? "/admin-dashboard" : "/citizen-dashboard";
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-zinc-100 dark:bg-zinc-950/80 dark:border-zinc-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 shadow-md group-hover:scale-105 transition-transform duration-200">
                <Landmark className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-700 to-emerald-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-emerald-400">
                Nagar Rakshak
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors duration-200 ${
                  pathname === link.href
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-zinc-650 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-150"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl border border-zinc-200 hover:bg-zinc-55 dark:border-zinc-800 dark:hover:bg-zinc-900 transition-all focus:outline-none"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 font-bold text-sm uppercase">
                    {user.fullName.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 max-w-[120px] truncate pr-1">
                    {user.fullName}
                  </span>
                </button>

                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-zinc-100 bg-white p-2 shadow-xl dark:border-zinc-850 dark:bg-zinc-900 z-20 animate-scale-up">
                      <div className="px-3 py-2.5 border-b border-zinc-100 dark:border-zinc-850">
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Logged in as</p>
                        <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 truncate">{user.fullName}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-450 truncate">{user.email}</p>
                        <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                          {user.role === "admin" ? (
                            <>
                              <Shield className="w-3 h-3 text-red-500" /> Admin
                            </>
                          ) : (
                            "Citizen"
                          )}
                        </span>
                      </div>

                      <div className="py-1">
                        <Link
                          href={getDashboardHref()}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-all"
                        >
                          <LayoutDashboard className="w-4 h-4 text-zinc-450" />
                          Dashboard
                        </Link>
                        {user.role === "citizen" && (
                          <Link
                            href="/report-issue"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-all"
                          >
                            <PlusCircle className="w-4 h-4 text-emerald-500" />
                            Report Issue
                          </Link>
                        )}
                        <Link
                          href="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-all"
                        >
                          <User className="w-4 h-4 text-zinc-450" />
                          My Profile
                        </Link>
                      </div>

                      <div className="border-t border-zinc-100 dark:border-zinc-850 pt-1">
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            logout();
                          }}
                          className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-650 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Log Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-xl text-zinc-400 hover:text-zinc-650 hover:bg-zinc-100 focus:outline-none dark:text-zinc-500 dark:hover:text-zinc-300 dark:hover:bg-zinc-900 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-zinc-100 dark:border-zinc-900 px-4 pt-2 pb-4 space-y-1 bg-white dark:bg-zinc-950">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={toggleMenu}
              className={`block px-3 py-2.5 rounded-xl text-base font-semibold ${
                pathname === link.href
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400"
                  : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900 space-y-1">
              <div className="px-3 py-2">
                <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Logged in as</p>
                <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{user.fullName}</p>
                <p className="text-xs text-zinc-500 truncate">{user.email}</p>
              </div>

              <Link
                href={getDashboardHref()}
                onClick={toggleMenu}
                className="block px-3 py-2.5 rounded-xl text-base font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
              >
                Dashboard
              </Link>
              {user.role === "citizen" && (
                <Link
                  href="/report-issue"
                  onClick={toggleMenu}
                  className="block px-3 py-2.5 rounded-xl text-base font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                  Report Issue
                </Link>
              )}
              <Link
                href="/profile"
                onClick={toggleMenu}
                className="block px-3 py-2.5 rounded-xl text-base font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
              >
                My Profile
              </Link>
              <button
                onClick={() => {
                  toggleMenu();
                  logout();
                }}
                className="flex w-full items-center gap-2 px-3 py-2.5 rounded-xl text-base font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-left"
              >
                <LogOut className="w-5 h-5" />
                Log Out
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900 flex flex-col gap-2">
              <Link href="/login" onClick={toggleMenu} className="w-full">
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
              <Link href="/register" onClick={toggleMenu} className="w-full">
                <Button variant="primary" className="w-full">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
