import { useGetCfsService } from "@/services/api/services/cf";
import { Cf } from "@/services/api/types/cf";
import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  CfFilterType,
  CfSortType,
  OthersFiltersType,
} from "../cf-filter-types";

export const cfsQueryKeys = createQueryKeys(["Cf"], {
  list: () => ({
    key: [],
    sub: {
      by: ({
        sort,
        filter,
        othersFilters,
      }: {
        filter: CfFilterType | undefined;
        sort?: CfSortType | undefined;
        othersFilters?: OthersFiltersType | undefined;
      }) => ({
        key: [sort, filter, othersFilters],
      }),
    },
  }),
});

export const useGetCfQuery = ({
  sort,
  filters,
  othersFilters,
}: {
  sort?: CfSortType | undefined;
  filters?: Array<FilterItem<Cf>> | undefined;
  othersFilters?: Array<OthersFiltersItem> | undefined;
} = {}) => {
  const fetch = useGetCfsService();

  const query = useInfiniteQuery({
    queryKey: cfsQueryKeys.list().sub.by({
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
