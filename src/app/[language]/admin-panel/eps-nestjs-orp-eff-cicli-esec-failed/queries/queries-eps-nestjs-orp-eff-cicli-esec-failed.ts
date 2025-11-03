import { useGetEpsNestjsOrpEffCicliEsecFailedService } from "@/services/api/services/eps-nestjs-orp-eff-cicli-esec-failed";
import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { EpsNestjsOrpEffCicliEsecFailed } from "@/services/api/types/eps-nestjs-orp-eff-cicli-esec-failed";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  EpsNestjsOrpEffCicliEsecFailedFilterType,
  EpsNestjsOrpEffCicliEsecFailedSortType,
  OthersFiltersType,
} from "../eps-nestjs-orp-eff-cicli-esec-failed-filter-types";

export const operatoriQueryKeys = createQueryKeys(
  ["EpsNestjsOrpEffCicliEsecFailed"],
  {
    list: () => ({
      key: [],
      sub: {
        by: ({
          sort,
          filter,
          othersFilters,
        }: {
          filter: EpsNestjsOrpEffCicliEsecFailedFilterType | undefined;
          sort?: EpsNestjsOrpEffCicliEsecFailedSortType | undefined;
          othersFilters?: OthersFiltersType | undefined;
        }) => ({
          key: [sort, filter, othersFilters],
        }),
      },
    }),
  }
);

export const useGetEpsNestjsOrpEffCicliEsecFailedQuery = ({
  sort,
  filters,
  othersFilters,
}: {
  sort?: EpsNestjsOrpEffCicliEsecFailedSortType | undefined;
  filters?: Array<FilterItem<EpsNestjsOrpEffCicliEsecFailed>> | undefined;
  othersFilters?: Array<OthersFiltersItem> | undefined;
} = {}) => {
  const fetch = useGetEpsNestjsOrpEffCicliEsecFailedService();

  const query = useInfiniteQuery({
    queryKey: operatoriQueryKeys.list().sub.by({
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
