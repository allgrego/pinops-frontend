"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useEffect } from "react";

import { useAuth } from "@/modules/auth/lib/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const isPublicRoute = !pathname.startsWith("/app");
  const nextUrlParam = decodeURIComponent(
    String(params.get("url") || "") || ""
  );

  const nextUrlParamIsPulic = !nextUrlParam.startsWith("/app");

  useEffect(() => {
    const nextUrl = params.has("url")
      ? nextUrlParam
      : !isPublicRoute
      ? pathname
      : "";

    const queryParams = new URLSearchParams();

    if (!!nextUrl) {
      queryParams.set("url", nextUrl);
    }

    // If not authenticated and not on a public route, redirect to login
    if (!isAuthenticated) {
      router.push(`/auth/login?${queryParams.toString()}`);
      return;
    }

    // If authenticated and on not restricted page (e.g. login), redirect to dashboard
    if (isAuthenticated && isPublicRoute) {
      router.push(nextUrlParamIsPulic ? `/app/operations` : nextUrl);
      return;
    }
  }, [
    isAuthenticated,
    isPublicRoute,
    nextUrlParam,
    nextUrlParamIsPulic,
    params,
    pathname,
    router,
  ]);

  // If on a protected route and not authenticated, don't render children
  if (!isAuthenticated && !isPublicRoute) {
    return null;
  }

  return <>{children}</>;
}
