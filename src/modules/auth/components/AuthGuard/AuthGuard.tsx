"use client";

import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import { useEffect } from "react";

import { useAuth } from "@/modules/auth/lib/auth";

// List of public routes that don't require authentication
const publicRoutes = ["/auth/login"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If not authenticated and not on a public route, redirect to login
    // if (!isAuthenticated && !publicRoutes.includes(pathname)) {
    //   router.push("/auth/login");
    // }

    if (!isAuthenticated) {
      router.push("/auth/login");
    }

    // If authenticated and on login page, redirect to dashboard
    if (isAuthenticated && pathname === "/auth/login") {
      router.push("/app/operations");
    }
  }, [isAuthenticated, pathname, router]);

  // If on a protected route and not authenticated, don't render children
  if (!isAuthenticated && !publicRoutes.includes(pathname)) {
    return null;
  }

  return <>{children}</>;
}
