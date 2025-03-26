import { useGetOperatoriService } from "@/services/api/services/operatori";
import { Operatori } from "@/services/api/types/operatori";
import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery } from "@tanstack/react-query";
import { OperatoriFilterType, OperatoriSortType, OthersFiltersType } from "../operatori-filter-types";

export const artAnasQueryKeys = createQueryKeys(["Operatori"], {
  list: () => ({
    key: [],
    sub: {
      by: ({
        sort,
        filter,
        othersFilters,
      }: {
        filter: OperatoriFilterType | undefined;
        sort?: OperatoriSortType | undefined;
        othersFilters?: OthersFiltersType | undefined;
      }) => ({
        key: [sort, filter, othersFilters],
      }),
    },
  }),
});

export const useGetOperatoriQuery = ({
  sort,
  filters,
  othersFilters,
}: {
  sort?: OperatoriSortType | undefined;
  filters?: Array<FilterItem<Operatori>> | undefined;
  othersFilters?: Array<OthersFiltersItem> | undefined;
} = {}) => {
  const fetch = useGetOperatoriService();

  const query = useInfiniteQuery({
    queryKey: artAnasQueryKeys.list().sub.by({
      sort,
      filter: { filters },
      othersFilters: { filters: othersFilters },
    }).key,
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      const { status, data } = await fetch(
        {
          page: pageParam,
          limit: 10,
          filters,
          sort: sort ? [sort] : undefined,
          othersFilters,
        },
        {
          signal,
        }
      );

      if (status === HTTP_CODES_ENUM.OK) {
        return {
          data: data.data,
          nextPage: data.hasNextPage ? pageParam + 1 : undefined,
        };
      }
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.nextPage;
    },
    gcTime: 0,
  });

  return query;
};
