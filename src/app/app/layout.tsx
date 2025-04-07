import type React from "react";

import { Sidebar } from "@/core/components/sidebar/Sidebar";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex-1 p-8 mt-6 md:mt-0 ">{children}</div>
    </div>
  );
}
