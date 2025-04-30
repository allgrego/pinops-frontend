import { FC, ReactNode } from "react";

import { Badge } from "@/core/components/ui/badge";
import { OperationStatusIds } from "@/modules/ops_files/setup/ops_file_statuses";

type OpsStatusBadgeProps = {
  statusId: number;
  children: ReactNode;
};

const OpsStatusBadge: FC<OpsStatusBadgeProps> = ({ statusId, children }) => {
  const getStatusColor = (statusId: number) => {
    switch (statusId) {
      case OperationStatusIds.OPENED:
        return "bg-blue-100 text-blue-800";
      case OperationStatusIds.IN_TRANSIT:
        return "bg-yellow-100 text-yellow-800";
      case OperationStatusIds.ON_DESTINATION:
        return "bg-green-100 text-green-800";
      case OperationStatusIds.IN_WAREHOUSE:
        return "bg-purple-100 text-purple-800";
      case OperationStatusIds.PREALERTED:
        return "bg-gray-100 text-gray-800";
      case OperationStatusIds.CLOSED:
        return "bg-gray-100 text-gray-800";
      // Others here
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Badge variant="outline" className={getStatusColor(statusId)}>
      {children || "undefined"}
    </Badge>
  );
};

export default OpsStatusBadge;
