import { useGetTargaMezziService } from "@/services/api/services/targa-mezzi";
import { TargaMezzi } from "@/services/api/types/targa-mezzi";
import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  TargaMezziFilterType,
  TargaMezziSortType,
  OthersFiltersType,
} from "../targa-mezzi-filter-types";

export const cfsQueryKeys = createQueryKeys(["TargaMezzi"], {
  list: () => ({
    key: [],
    sub: {
      by: ({
        sort,
        filter,
        othersFilters,
      }: {
        filter: TargaMezziFilterType | undefined;
        sort?: TargaMezziSortType | undefined;
        othersFilters?: OthersFiltersType | undefined;
      }) => ({
        key: [sort, filter, othersFilters],
      }),
    },
  }),
});

export const 
useGetTargaMezziQuery = ({
  sort,
  filters,
  othersFilters,
}: {
  sort?: TargaMezziSortType | undefined;
  filters?: Array<FilterItem<TargaMezzi>> | undefined;
  othersFilters?: Array<OthersFiltersItem> | undefined;
} = {}) => {
  const fetch = useGetTargaMezziService();

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
