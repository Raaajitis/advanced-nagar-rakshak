"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/features/auth/AuthContext";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Landmark, ArrowLeft, Shield } from "lucide-react";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type LoginFields = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFields) => {
    try {
      await login(data);
    } catch (e) {
      // Handled in AuthContext toast
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-zinc-50 dark:bg-zinc-950 transition-colors">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-25">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-2xl bg-white hover:bg-zinc-50 border border-zinc-150 text-zinc-650 hover:text-zinc-900 shadow-sm dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Left panel: Info & Branding (hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-750 via-blue-900 to-emerald-950 flex-col justify-between p-12 text-white relative overflow-hidden">
        {/* Glow circles */}
        <div className="absolute -bottom-48 -left-48 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl animate-pulse" />
        <div className="absolute -top-48 -right-48 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl animate-pulse" />

        <div className="flex items-center gap-2.5 z-10">
          <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
            <Landmark className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight">Nagar Rakshak</span>
        </div>

        <div className="max-w-md my-auto flex flex-col gap-6 z-10">
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
            Empowering Citizens, Fixing Wards.
          </h2>
          <p className="text-zinc-300 leading-relaxed text-sm">
            Sign in to report public utility issues, view resolution stats, check live maps, and communicate directly with ward administrators.
          </p>
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex items-start gap-3.5">
              <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5 border border-white/15">
                <span className="text-xs font-bold">1</span>
              </div>
              <p className="text-sm text-zinc-205 font-medium">Pinpoint problems instantly using Geotagging.</p>
            </div>
            <div className="flex items-start gap-3.5">
              <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5 border border-white/15">
                <span className="text-xs font-bold">2</span>
              </div>
              <p className="text-sm text-zinc-205 font-medium">Receive real-time progress alerts on reported cases.</p>
            </div>
            <div className="flex items-start gap-3.5">
              <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5 border border-white/15">
                <span className="text-xs font-bold">3</span>
              </div>
              <p className="text-sm text-zinc-205 font-medium">Join hands with administration for clean neighborhoods.</p>
            </div>
          </div>
        </div>

        <div className="z-10 flex items-center gap-2 text-xs text-zinc-400">
          <Shield className="w-4 h-4 text-emerald-500" />
          Secure SSL Protected Administration Login
        </div>
      </div>

      {/* Right panel: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 md:w-1/2 pt-28 md:pt-12">
        <div className="w-full max-w-md bg-white border border-zinc-150 p-8 sm:p-10 rounded-3xl shadow-xl dark:bg-zinc-900 dark:border-zinc-800 transition-colors">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Welcome Back
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">
              Sign in to access your dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4.5 w-4.5 rounded border-zinc-300 text-blue-650 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300 select-none">
                  Remember me
                </label>
              </div>
              <span className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer hover:underline">
                Forgot password?
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full h-12 text-sm justify-center rounded-xl"
              isLoading={loading}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-8 border-t border-zinc-100 dark:border-zinc-850 pt-6 text-center">
            <p className="text-sm text-zinc-650 dark:text-zinc-400">
              New to the platform?{" "}
              <Link
                href="/register"
                className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Register a new account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
