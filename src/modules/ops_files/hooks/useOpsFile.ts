import { CustomQueryProps } from "@/core/types/query";
import { useQuery } from "@tanstack/react-query";
import { getOpsFile } from "../lib/ops_files";
import { OpsFile } from "../types/ops_files.types";

type Data = OpsFile | null;

type Params = {
  queryProps?: CustomQueryProps<Data>;
};

const useOpsFile = (opsFileId: string, params?: Params) => {
  const queryProps = params?.queryProps;

  const query = useQuery<Data>({
    ...queryProps,
    queryKey: ["GetOpsFileQuery", opsFileId, ...(queryProps?.queryKey || [])],
    queryFn: async () => {
      try {
        if (!opsFileId) throw new Error("No operation ID found");

        return await getOpsFile(opsFileId);
      } catch (error) {
        console.error("Failure fetching ops file", error);
        return Promise.reject(error);
      }
    },
  });

  const operation = query.data || null;

  const isLoading = query.isLoading;
  const { isError, error } = query;

  return { operation, isLoading, isError, error, query };
};

export default useOpsFile;
