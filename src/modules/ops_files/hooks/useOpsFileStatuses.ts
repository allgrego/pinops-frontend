import { useQuery } from "@tanstack/react-query";

import { CustomQueryProps } from "@/core/types/query";
import { getAllOpsFileStatuses } from "@/modules/ops_files/lib/ops_files";
import { OpsStatus } from "@/modules/ops_files/types/ops_files.types";

type Data = OpsStatus[];

type Params = {
  queryProps?: CustomQueryProps<Data>;
};

const useOpsFileStatuses = (params?: Params) => {
  const queryProps = params?.queryProps;

  const query = useQuery<Data>({
    ...queryProps,
    queryKey: ["OpsStatusesQuery", ...(queryProps?.queryKey || [])],
    queryFn: async () => {
      try {
        return await getAllOpsFileStatuses();
      } catch (error) {
        console.error("Failure fetching ops statuses", error);
        return Promise.reject(error);
      }
    },
  });

  const statuses = query.data || [];

  const isLoading = query.isLoading;
  const { isError, error } = query;

  return { statuses, isLoading, isError, error, query };
};

export default useOpsFileStatuses;
