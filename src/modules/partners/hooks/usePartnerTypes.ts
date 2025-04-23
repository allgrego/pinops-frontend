import { useQuery } from "@tanstack/react-query";

import { CustomQueryProps } from "@/core/types/query";
import { getAllPartnerTypes } from "@/modules/partners/lib/partners";
import { PartnerType } from "@/modules/partners/types/partners.types";

type Data = PartnerType[];

type Params = {
  queryProps?: CustomQueryProps<Data>;
};

const usePartnerTypes = (params?: Params) => {
  const queryProps = params?.queryProps;

  const query = useQuery<Data>({
    ...queryProps,
    queryKey: ["PartnerTypesQuery", ...(queryProps?.queryKey || [])],
    queryFn: async () => {
      try {
        return await getAllPartnerTypes();
      } catch (error) {
        console.error("Failure fetching partner types", error);
        return Promise.reject(error);
      }
    },
  });

  const partnerTypes = query.data || [];

  const isLoading = query.isLoading;
  const { isError, error } = query;

  return { partnerTypes, isLoading, isError, error, query };
};

export default usePartnerTypes;
