import { FC, ReactNode } from "react";

import { Badge } from "@/core/components/ui/badge";
import { OperationStatuses } from "../../types/ops_files.types";

type OpsStatusBadgeProps = {
  statusId: number;
  children: ReactNode;
};

const OpsStatusBadge: FC<OpsStatusBadgeProps> = ({
  statusId,
  children = "undefined",
}) => {
  const getStatusColor = (statusId: number) => {
    switch (statusId) {
      case OperationStatuses.OPENED:
        return "bg-blue-100 text-blue-800";
      case OperationStatuses.IN_TRANSIT:
        return "bg-yellow-100 text-yellow-800";
      case OperationStatuses.ON_DESTINATION:
        return "bg-green-100 text-green-800";
      case OperationStatuses.IN_WAREHOUSE:
        return "bg-purple-100 text-purple-800";
      case OperationStatuses.PREALERTED:
        return "bg-gray-100 text-gray-800";
      case OperationStatuses.CLOSED:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Badge variant="outline" className={getStatusColor(statusId)}>
      {children}
    </Badge>
  );
};

export default OpsStatusBadge;
