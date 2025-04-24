/**
 * - - - - Statistics
 */

// Backend
export interface StatisticsBackend {
  total_clients: number | null;
  total_partners: number | null;
  total_carriers: number | null;
  total_ops_files: number | null;
  total_closed_ops_files: number | null;
  total_open_ops_files: number | null;
}

// Internal
export interface Statistics {
  totalClients: StatisticsBackend["total_clients"];
  totalPartners: StatisticsBackend["total_partners"];
  totalCarriers: StatisticsBackend["total_carriers"];
  totalOpsFiles: StatisticsBackend["total_ops_files"];
  totalClosedOpsFiles: StatisticsBackend["total_closed_ops_files"];
  totalOpenOpsFiles: StatisticsBackend["total_open_ops_files"];
}
