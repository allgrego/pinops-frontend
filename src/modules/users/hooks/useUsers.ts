import { useQuery } from "@tanstack/react-query";

import { CustomQueryProps } from "@/core/types/query";
import { getAllUsers } from "@/modules/users/lib/users";
import { User } from "@/modules/users/types/users.types";

type Data = User[];

type Params = {
  queryProps?: CustomQueryProps<Data>;
};

const useUsers = (params?: Params) => {
  const queryProps = params?.queryProps;

  /**
   * - - - Users fetching
   */
  const usersQuery = useQuery<Data>({
    ...queryProps,
    queryKey: ["usersQuery", ...(queryProps?.queryKey || [])],
    queryFn: async () => {
      try {
        return await getAllUsers();
      } catch (error) {
        console.error("Failure fetching users", error);
        return Promise.reject(error);
      }
    },
  });

  const users = usersQuery.data || [];

  const isLoading = usersQuery.isLoading;
  const { isError, error } = usersQuery;

  return { users, isLoading, isError, error, query: usersQuery };
};

export default useUsers;
