"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Separator } from "@/core/components/ui/separator";
import { numberOrNull } from "@/core/lib/numbers";
import { getGeneralStats } from "@/modules/dashboard/lib/dashboard";
import { Statistics } from "@/modules/dashboard/types/dashboard";
import { useQuery } from "@tanstack/react-query";
import { Package2, Truck, UserCog, Users } from "lucide-react";

export default function DashboardPage() {
  /**
   * - - - stats fetching
   */
  const statisticsQuery = useQuery<Statistics>({
    queryKey: ["statisticsQuery"],
    queryFn: async () => {
      try {
        return await getGeneralStats();
      } catch (error) {
        console.error("Failure fetching stats", error);
        return Promise.reject(`${error}`);
      }
    },
  });

  const data = statisticsQuery.data;

  const isLoading = statisticsQuery.isLoading;

  const stats = {
    operations: numberOrNull(data?.totalOpsFiles),
    activeOperations: numberOrNull(data?.totalOpenOpsFiles),
    closedOperations: numberOrNull(data?.totalClosedOpsFiles),
    clients: numberOrNull(data?.totalClients),
    carriers: numberOrNull(data?.totalCarriers),
    partners: numberOrNull(data?.totalPartners),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your operations system
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Operations
            </CardTitle>
            <Package2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "-" : stats.activeOperations}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Closed Operations
            </CardTitle>
            <Package2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "-" : stats.closedOperations}
            </div>
          </CardContent>
        </Card> */}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Operations
            </CardTitle>
            <Package2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "-" : stats.operations}
            </div>
          </CardContent>
        </Card>

        <Separator className="col-span-1 md:col-span-2 lg:col-span-3" />

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "-" : stats.clients}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carriers</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "-" : stats.carriers}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partners</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "-" : stats.partners}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
