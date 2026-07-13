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

const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Full name is required")
      .min(3, "Full name must be at least 3 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .min(10, "Phone number must be at least 10 digits"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    role: z.enum(["citizen", "admin"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type RegisterFields = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerAuth, loading } = useAuth();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "citizen",
    },
  });

  const onSubmit = async (data: RegisterFields) => {
    try {
      await registerAuth(data);
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
            Join the Civic Alliance Today.
          </h2>
          <p className="text-zinc-300 leading-relaxed text-sm">
            Create an account to pin public issues, tracks live updates, and make your ward clean and safer.
          </p>
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex items-start gap-3.5">
              <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5 border border-white/15">
                <span className="text-xs font-bold">✓</span>
              </div>
              <p className="text-sm text-zinc-205 font-medium">Verify your profile & report issues in under a minute.</p>
            </div>
            <div className="flex items-start gap-3.5">
              <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5 border border-white/15">
                <span className="text-xs font-bold">✓</span>
              </div>
              <p className="text-sm text-zinc-205 font-medium">Add geotags, addresses, and images directly.</p>
            </div>
            <div className="flex items-start gap-3.5">
              <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5 border border-white/15">
                <span className="text-xs font-bold">✓</span>
              </div>
              <p className="text-sm text-zinc-205 font-medium">Track resolution stages on your dashboard.</p>
            </div>
          </div>
        </div>

        <div className="z-10 flex items-center gap-2 text-xs text-zinc-400">
          <Shield className="w-4 h-4 text-emerald-500" />
          Validated & Secure Resident Portal
        </div>
      </div>

      {/* Right panel: Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 md:w-1/2 pt-28 md:pt-12">
        <div className="w-full max-w-md bg-white border border-zinc-150 p-8 sm:p-10 rounded-3xl shadow-xl dark:bg-zinc-900 dark:border-zinc-800 transition-colors my-8">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Create an Account
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">
              Register to start filing reports.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              error={errors.fullName?.message}
              {...formRegister("fullName")}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              error={errors.email?.message}
              {...formRegister("email")}
            />

            <Input
              label="Phone Number"
              type="text"
              placeholder="9876543210"
              error={errors.phone?.message}
              {...formRegister("phone")}
            />

            <Input
              label="Select Role (For Testing)"
              type="select"
              options={[
                { value: "citizen", label: "Citizen" },
                { value: "admin", label: "Ward Admin" },
              ]}
              error={errors.role?.message}
              {...formRegister("role")}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...formRegister("password")}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...formRegister("confirmPassword")}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full h-12 text-sm justify-center rounded-xl"
              isLoading={loading}
            >
              Sign Up
            </Button>
          </form>

          <div className="mt-8 border-t border-zinc-100 dark:border-zinc-850 pt-6 text-center">
            <p className="text-sm text-zinc-650 dark:text-zinc-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
