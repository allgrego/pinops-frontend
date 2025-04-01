import type React from "react";

export default function NonAuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
