"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback } from "@/core/components/ui/avatar";
import { Button } from "@/core/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { useAuth } from "@/modules/auth/lib/auth";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/app/operations">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
      </div>

      <Card>
        <CardHeader className="flex flex-col items-center">
          <Avatar className="h-24 w-24">
            <AvatarFallback className="text-2xl">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="mt-4">{user.name}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Name
                </h3>
                <p className="capitalize">{user.name}</p>
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Role
                </h3>
                <p className="capitalize">{user.role.roleName}</p>
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Email
                </h3>
                <p className="lowercase">{user.email}</p>
              </div>
            </div>

            <div className="flex justify-end">
              {/* <Button asChild>
                <Link href="/settings">Edit Settings</Link>
              </Button> */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
