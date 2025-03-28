import { useQuery } from "@tanstack/react-query";

import { CustomQueryProps } from "@/core/types/query";
import { getAllClients } from "../clients/lib/clients";
import { Client } from "../clients/types/clients";

type Data = Client[];

type Params = {
  queryProps?: CustomQueryProps<Data>;
};

const useClients = (params?: Params) => {
  const queryProps = params?.queryProps;

  /**
   * - - - Clients fetching
   */
  const clientsQuery = useQuery<Data>({
    ...queryProps,
    queryKey: ["ClientsQuery", ...(queryProps?.queryKey || [])],
    queryFn: async () => {
      try {
        return await getAllClients();
      } catch (error) {
        console.error("Failure fetching clients", error);
        return Promise.reject(error);
      }
    },
  });

  const clients = clientsQuery.data || [];

  const isLoading = clientsQuery.isLoading;
  const { isError, error } = clientsQuery;

  return { clients, isLoading, isError, error, query: clientsQuery };
};

export default useClients;
