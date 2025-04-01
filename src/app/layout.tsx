import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";

import Providers from "@/app/providers";
import { ThemeProvider } from "@/core/components/theme-provider/ThemeProvider";
import { Toaster } from "@/core/components/ui/sonner";

import { AuthGuard } from "@/modules/auth/components/AuthGuard/AuthGuard";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PinOps App",
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
            <AuthGuard>
              {children}
              <Toaster />
            </AuthGuard>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
