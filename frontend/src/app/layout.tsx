import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/features/auth/AuthContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Advanced Nagar Rakshak | Smart City Civic Reporting",
  description: "Citizen portal to report civic issues, track resolutions and engage with local administration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 transition-colors">
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              className: "dark:bg-zinc-900 dark:text-white dark:border dark:border-zinc-800 rounded-2xl",
              style: {
                borderRadius: "1rem",
              },
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
