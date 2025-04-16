import { useQuery } from "@tanstack/react-query";

import { CustomQueryProps } from "@/core/types/query";
import { Carrier } from "@/modules/carriers/types/carriers.types";
import { getAllCarriers } from "@/modules/carriers/lib/carriers";

type Data = Carrier[];

type Params = {
  queryProps?: CustomQueryProps<Data>;
};

const useCarriers = (params?: Params) => {
  const queryProps = params?.queryProps;

  const query = useQuery<Data>({
    ...queryProps,
    queryKey: ["CarriersQuery", ...(queryProps?.queryKey || [])],
    queryFn: async () => {
      try {
        return await getAllCarriers();
      } catch (error) {
        console.error("Failure fetching carriers", error);
        return Promise.reject(error);
      }
    },
  });

  const carriers = query.data || [];

  const isLoading = query.isLoading;
  const { isError, error } = query;

  return { carriers, isLoading, isError, error, query };
};

export default useCarriers;
