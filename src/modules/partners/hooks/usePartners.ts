import { useQuery } from "@tanstack/react-query";

import { CustomQueryProps } from "@/core/types/query";
import { getAllPartners } from "@/modules/partners/lib/partners";
import { Partner } from "@/modules/partners/types/partners.types";

type Data = Partner[];

type Params = {
  queryProps?: CustomQueryProps<Data>;
};

const usePartners = (params?: Params) => {
  const queryProps = params?.queryProps;

  const query = useQuery<Data>({
    ...queryProps,
    queryKey: ["PartnersQuery", ...(queryProps?.queryKey || [])],
    queryFn: async () => {
      try {
        return await getAllPartners();
      } catch (error) {
        console.error("Failure fetching partners", error);
        return Promise.reject(error);
      }
    },
  });

  const partners = query.data || [];

  const isLoading = query.isLoading;
  const { isError, error } = query;

  return { partners, isLoading, isError, error, query };
};

export default usePartners;
