import { useQuery } from "@tanstack/react-query";

import { CustomQueryProps } from "@/core/types/query";
import { getAllAgents } from "../lib/agents";
import { Agent } from "../types/agents";

type Data = Agent[];

type Params = {
  queryProps?: CustomQueryProps<Data>;
};

const useAgents = (params?: Params) => {
  const queryProps = params?.queryProps;

  const query = useQuery<Data>({
    ...queryProps,
    queryKey: ["AgentsQuery", ...(queryProps?.queryKey || [])],
    queryFn: async () => {
      try {
        return await getAllAgents();
      } catch (error) {
        console.error("Failure fetching agents", error);
        return Promise.reject(error);
      }
    },
  });

  const agents = query.data || [];

  const isLoading = query.isLoading;
  const { isError, error } = query;

  return { agents, isLoading, isError, error, query };
};

export default useAgents;
