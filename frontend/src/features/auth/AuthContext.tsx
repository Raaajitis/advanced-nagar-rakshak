"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User } from "@/types";
import { authService } from "@/services/auth";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: Record<string, any>) => Promise<void>;
  register: (userData: Record<string, any>) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define pages that do NOT require authentication
const PUBLIC_ROUTES = ["/", "/login", "/register", "/issues"];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchProfile = async () => {
    try {
      const userData = await authService.getProfile();
      setUser(userData);
    } catch (error) {
      // User is not logged in (expected for public pages)
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Route guarding logic
  useEffect(() => {
    if (loading) return;

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    if (!user && !isPublicRoute) {
      // Redirect to login if accessing protected route when not logged in
      toast.error("Please login to access this page");
      router.push("/login");
    } else if (user) {
      if (pathname === "/login" || pathname === "/register") {
        // Redirect logged-in users away from auth pages
        if (user.role === "admin") {
          router.push("/admin-dashboard");
        } else {
          router.push("/citizen-dashboard");
        }
      } else if (pathname.startsWith("/admin-dashboard") && user.role !== "admin") {
        // Prevent citizens from accessing admin dashboard
        toast.error("Access denied. Admin rights required.");
        router.push("/citizen-dashboard");
      } else if (pathname.startsWith("/citizen-dashboard") && user.role === "admin") {
        // Redirect admin away from citizen dashboard to admin dashboard
        router.push("/admin-dashboard");
      }
    }
  }, [user, loading, pathname, router]);

  const login = async (credentials: Record<string, any>) => {
    setLoading(true);
    try {
      const userData = await authService.login(credentials);
      setUser(userData);
      toast.success(`Welcome back, ${userData.fullName}!`);
      
      if (userData.role === "admin") {
        router.push("/admin-dashboard");
      } else {
        router.push("/citizen-dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Record<string, any>) => {
    setLoading(true);
    try {
      const result = await authService.register(userData);
      toast.success("Registration successful! You can now log in.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      const userData = await authService.getProfile();
      setUser(userData);
    } catch (error) {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
