import { useQuery } from "@tanstack/react-query";

import { CustomQueryProps } from "@/core/types/query";
import { getAllCountries } from "@/modules/geodata/lib/countries";
import { Country } from "@/modules/geodata/types/countries";

type Data = Country[];

type Params = {
  queryProps?: CustomQueryProps<Data>;
};

const useCountries = (params?: Params) => {
  const queryProps = params?.queryProps;

  const query = useQuery<Data>({
    ...queryProps,
    queryKey: ["CountriesQuery", ...(queryProps?.queryKey || [])],
    queryFn: async () => {
      try {
        return await getAllCountries();
      } catch (error) {
        console.error("Failure fetching countries", error);
        return Promise.reject(error);
      }
    },
  });

  const countries = query.data || [];

  const isLoading = query.isLoading;
  const { isError, error } = query;

  return { countries, isLoading, isError, error, query };
};

export default useCountries;
