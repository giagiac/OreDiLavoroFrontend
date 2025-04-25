import { useGetOrpEffCicliService } from "@/services/api/services/orp-eff-cicli";
import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { OrpEffCicli } from "@/services/api/types/orp-eff-cicli";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  OrpEffCicliFilterType,
  OrpEffCicliSortType,
  OthersFiltersType,
} from "../orp-eff-cicli-filter-types";

export const orpEffCicliQueryKeys = createQueryKeys(["OrpEffCicli"], {
  list: () => ({
    key: [],
    sub: {
      by: ({
        sort,
        filter,
        othersFilters,
      }: {
        filter: OrpEffCicliFilterType | undefined;
        sort?: OrpEffCicliSortType | undefined;
        othersFilters?: OthersFiltersType | undefined;
      }) => ({
        key: [sort, filter, othersFilters],
      }),
    },
  }),
});

export const useGetOrpEffCicliQuery = ({
  sort,
  filters,
  othersFilters,
}: {
  sort?: OrpEffCicliSortType | undefined;
  filters?: Array<FilterItem<OrpEffCicli>> | undefined;
  othersFilters?: Array<OthersFiltersItem> | undefined;
} = {}) => {
  const fetch = useGetOrpEffCicliService();

  const query = useInfiniteQuery({
    queryKey: orpEffCicliQueryKeys.list().sub.by({
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
