import { useGetCfCommService } from "@/services/api/services/cfComm";
import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery } from "@tanstack/react-query";
import { CfCommFilterType, CfCommSortType } from "../cf-comm-filter-types";
import { OthersFiltersType } from "../cf-filter-types";
import { CfComm } from "@/services/api/types/cfComm";

export const cfCommQueryKeys = createQueryKeys(["CfComm"], {
  list: () => ({
    key: [],
    sub: {
      by: ({
        sort,
        filter,
        othersFilters,
      }: {
        filter: CfCommFilterType | undefined;
        sort?: CfCommSortType | undefined;
        othersFilters?: OthersFiltersType | undefined;
      }) => ({
        key: [sort, filter, othersFilters],
      }),
    },
  }),
});

export const useGetCfCommQuery = ({
  sort,
  filters,
  othersFilters,
}: {
  sort?: CfCommSortType | undefined;
  filters?: Array<FilterItem<CfComm>> | undefined;
  othersFilters?: Array<OthersFiltersItem> | undefined;
} = {}) => {
  const fetch = useGetCfCommService();

  const query = useInfiniteQuery({
    queryKey: cfCommQueryKeys.list().sub.by({
      sort,
      filter: { filters },
      othersFilters: { filters: othersFilters },
    }).key,
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      const { status, data } = await fetch(
        {
          page: pageParam,
          limit: 50,
          sort: sort ? [sort] : undefined,
          filters,
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
