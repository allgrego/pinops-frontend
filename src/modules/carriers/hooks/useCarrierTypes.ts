import { useQuery } from "@tanstack/react-query";

import { CustomQueryProps } from "@/core/types/query";
import { getAllCarrierTypes } from "@/modules/carriers/lib/carriers";
import { CarrierType } from "@/modules/carriers/types/carriers.types";

type Data = CarrierType[];

type Params = {
  queryProps?: CustomQueryProps<Data>;
};

const useCarrierTypes = (params?: Params) => {
  const queryProps = params?.queryProps;

  const query = useQuery<Data>({
    ...queryProps,
    queryKey: ["CarrierTypesQuery", ...(queryProps?.queryKey || [])],
    queryFn: async () => {
      try {
        return await getAllCarrierTypes();
      } catch (error) {
        console.error("Failure fetching carrier types", error);
        return Promise.reject(error);
      }
    },
  });

  const carrierTypes = query.data || [];

  const isLoading = query.isLoading;
  const { isError, error } = query;

  return { carrierTypes, isLoading, isError, error, query };
};

export default useCarrierTypes;
