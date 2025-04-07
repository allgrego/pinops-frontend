"use client";

import { AlertCircle, MapPin, Plane, Ship, Truck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import type React from "react";

import { Alert, AlertDescription } from "@/core/components/ui/alert";
import { Button } from "@/core/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import { useAuth } from "@/modules/auth/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await login(email, password);

      const nextUrl = !params.has("url")
        ? "/app/operations"
        : String(params.get("url") || "");

      if (result.success) {
        router.push(nextUrl);
        return;
      }

      setError(result.message || "Login failed");
    } catch (err) {
      setError(`An unexpected error occurred ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold flex gap-2 items-center justify-between">
            <span>PinOps</span>{" "}
            <div className="flex gap-1 text-xs">
              <MapPin /> <Ship /> <Plane /> <Truck />
            </div>
          </CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                disabled={isLoading || isAuthenticated}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {/* <Button
                  variant="link"
                  className="px-0 font-normal h-auto"
                  type="button"
                >
                  Forgot password?
                </Button> */}
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                disabled={isLoading || isAuthenticated}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || isAuthenticated}
            >
              {isLoading || isAuthenticated ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-xs text-muted-foreground mt-2">
            Powered by: GBA Logistics
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
