"use client";

import {
  LayoutDashboard,
  Menu,
  Package2,
  Ship,
  UserCog,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/core/components/ui/button";
import { useMobile } from "@/core/hooks/useMobile";
import { cn } from "@/core/lib/utils";

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Operations",
    href: "/operations",
    icon: Package2,
  },
  {
    name: "Clients",
    href: "/clients",
    icon: Users,
  },
  {
    name: "Carriers",
    href: "/carriers",
    icon: Ship,
  },
  {
    name: "International Agents",
    href: "/agents",
    icon: UserCog,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  if (isMobile) {
    return (
      <>
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 left-4 z-50"
          onClick={toggleSidebar}
        >
          <Menu className="h-4 w-4" />
        </Button>

        {isOpen && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={toggleSidebar}
          >
            <div
              className="fixed left-0 top-0 h-full w-64 bg-background border-r p-4 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Trade Ops</h2>
                <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={toggleSidebar}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
                      pathname.startsWith(item.href)
                        ? "bg-muted font-medium text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="hidden md:flex flex-col w-64 border-r p-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Trade Ops</h2>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
              pathname.startsWith(item.href)
                ? "bg-muted font-medium text-primary"
                : "text-muted-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
