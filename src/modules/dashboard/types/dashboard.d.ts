/**
 * - - - - Statistics
 */

// Backend
export interface StatisticsBackend {
  total_clients: number;
  total_agents: number;
  total_carriers: number;
  total_ops_files: number;
}

// Internal
export interface Statistics {
  totalClients: StatisticsBackend["total_clients"];
  totalAgents: StatisticsBackend["total_agents"];
  totalCarriers: StatisticsBackend["total_carriers"];
  totalOpsFiles: StatisticsBackend["total_ops_files"];
}
