import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";

import Providers from "@/app/providers";
import { Sidebar } from "@/core/components/sidebar/Sidebar";
import { ThemeProvider } from "@/core/components/theme-provider/ThemeProvider";
import { Toaster } from "@/core/components/ui/sonner";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trade Operations Management",
  description: "International Trade Operations Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* Provide the client to your App */}
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex min-h-screen">
              <Sidebar />
              <div className="flex-1 p-8">{children}</div>
            </div>
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
