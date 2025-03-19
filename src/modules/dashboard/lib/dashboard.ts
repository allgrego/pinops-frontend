import { BACKEND_BASE_URL } from "@/core/setup/routes";

import { Statistics, StatisticsBackend } from "@/modules/dashboard/types/dashboard";

export const getGeneralStats = async (): Promise<Statistics> => {
  try {
    const url = `${BACKEND_BASE_URL}/ops/general/statistics`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Invalid response ${response.status}`);
    }

    const jsonResponse: StatisticsBackend | undefined = await response.json();

    if (!jsonResponse) {
      throw new Error("No JSON data obtained");
    }

    // Transform into internal schema

    const stats: Statistics = {
      totalAgents: jsonResponse.total_agents,
      totalCarriers: jsonResponse.total_carriers,
      totalClients: jsonResponse.total_clients,
      totalOpsFiles: jsonResponse.total_ops_files,
    };

    return stats;
  } catch (error) {
    console.error("Failure getting general stats", error);
    return Promise.reject(`${error}`);
  }
};
