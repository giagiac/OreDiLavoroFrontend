import { useGetEpsNestjsOrpEffCicliEsecService } from "@/services/api/services/eps-nestjs-orp-eff-cicli-esec";
import { EpsNestjsOrpEffCicliEsec } from "@/services/api/types/eps-nestjs-orp-eff-cicli-esec";
import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  EpsNestjsOrpEffCicliEsecFilterType,
  EpsNestjsOrpEffCicliEsecSortType,
  OthersFiltersType,
} from "../esp-nestjs-orp-eff-cicli-filter-types";

export const epsNestjsOrpEffCicliEsecQueryKeys = createQueryKeys(
  ["EpsNestjsOrpEffCicliEsec"],
  {
    list: () => ({
      key: [],
      sub: {
        by: ({
          sort,
          filter,
          othersFilters,
        }: {
          filter: EpsNestjsOrpEffCicliEsecFilterType | undefined;
          sort?: EpsNestjsOrpEffCicliEsecSortType | undefined;
          othersFilters?: OthersFiltersType | undefined;
        }) => ({
          key: [sort, filter, othersFilters],
        }),
      },
    }),
  }
);

export const useGetEpsNestjsOrpEffCicliEsecQuery = ({
  sort,
  filters,
  othersFilters,
}: {
  sort?: EpsNestjsOrpEffCicliEsecSortType | undefined;
  filters?: Array<FilterItem<EpsNestjsOrpEffCicliEsec>> | undefined;
  othersFilters?: Array<OthersFiltersItem> | undefined;
} = {}) => {
  const fetch = useGetEpsNestjsOrpEffCicliEsecService();

  const query = useInfiniteQuery({
    retry: 3,
    queryKey: epsNestjsOrpEffCicliEsecQueryKeys.list().sub.by({
      sort,
      filter: { filters },
      othersFilters: { filters: othersFilters },
    }).key,
    initialPageParam: 1,
    // select: (data) => ({
    //   pages: [...data.pages].reverse(),
    //   pageParams: [...data.pageParams].reverse()
    // }),
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
          totale: data.totale,
          targetDateInizio: data.targetDateInizio,
        };
      }
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.nextPage;
    },
    gcTime: 0,
    select: (data) => {
      // Trasforma i dati per includere informazioni aggiuntive
      const totale = data.pages[0]?.totale;
      const targetDateInizio = data.pages[0]?.targetDateInizio;
      return {
        ...data,
        totale,
        targetDateInizio,
      };
    },
  });

  return query;
};
