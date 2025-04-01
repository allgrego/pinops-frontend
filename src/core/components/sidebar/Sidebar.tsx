"use client";

import {
  LayoutDashboard,
  LogOut,
  Menu,
  Package2,
  Ship,
  User,
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

import { useAuth } from "@/modules/auth/lib/auth";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const APP_NAME = "PinOps";

const navItems = [
  {
    name: "Dashboard",
    href: "/app/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Operations",
    href: "/app/operations",
    icon: Package2,
  },
  {
    name: "Clients",
    href: "/app/clients",
    icon: Users,
  },
  {
    name: "Carriers",
    href: "/app/carriers",
    icon: Ship,
  },
  {
    name: "International Agents",
    href: "/app/agents",
    icon: UserCog,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const { user, logout, isAuthenticated } = useAuth();
  const handleLogout = () => {
    logout();
  };

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

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
                <h2 className="text-xl font-bold">{APP_NAME}</h2>
                <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <nav className="space-y-2">
                {!isAuthenticated ? (
                  <Link
                    href={"/auth/login"}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
                      "text-muted-foreground"
                    )}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Home
                  </Link>
                ) : (
                  navItems.map((item) => (
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
                  ))
                )}
              </nav>

              {user && (
                <div className="mt-auto pt-4 border-t">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-2 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-left">
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {user.role}
                            </p>
                          </div>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>My account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/app/profile" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="hidden md:flex flex-col w-64 border-r p-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold">{APP_NAME}</h2>
      </div>
      <nav className="space-y-2">
        {!isAuthenticated ? (
          <Link
            href={"/auth/login"}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
              "text-muted-foreground"
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Home
          </Link>
        ) : (
          navItems.map((item) => (
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
          ))
        )}
      </nav>

      {user && (
        <div className="mt-6 pt-4 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start px-2 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.role}</p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/app/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
