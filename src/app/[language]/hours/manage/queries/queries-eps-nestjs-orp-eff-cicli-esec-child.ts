import { useGetEpsNestjsOrpEffCicliEsecChildService } from "@/services/api/services/eps-nestjs-orp-eff-cicli-esec-child";
import { EpsNestjsOrpEffCicliEsecChild } from "@/services/api/types/eps-nestjs-orp-eff-cicli-esec-child";
import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  EpsNestjsOrpEffCicliEsecChildFilterType,
  EpsNestjsOrpEffCicliEsecChildSortType,
  OthersFiltersType,
} from "../esp-nestjs-orp-eff-cicli-child-filter-types";

export const orpEffCicliQueryKeys = createQueryKeys(
  ["EpsNestjsOrpEffCicliEsecChild"],
  {
    list: () => ({
      key: [],
      sub: {
        by: ({
          sort,
          filter,
          othersFilters,
        }: {
          filter: EpsNestjsOrpEffCicliEsecChildFilterType | undefined;
          sort?: EpsNestjsOrpEffCicliEsecChildSortType | undefined;
          othersFilters?: OthersFiltersType | undefined;
        }) => ({
          key: [sort, filter, othersFilters],
        }),
      },
    }),
  }
);

export const useGetEpsNestjsOrpEffCicliEsecChildQuery = ({
  sort,
  filters,
  othersFilters,
}: {
  sort?: EpsNestjsOrpEffCicliEsecChildSortType | undefined;
  filters?: Array<FilterItem<EpsNestjsOrpEffCicliEsecChild>> | undefined;
  othersFilters?: Array<OthersFiltersItem> | undefined;
} = {}) => {
  const fetch = useGetEpsNestjsOrpEffCicliEsecChildService();

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
