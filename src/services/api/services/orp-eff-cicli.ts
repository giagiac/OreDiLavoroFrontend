import { useCallback } from "react";
import { API_URL } from "../config";
import { OrpEffCicli } from "../types/orp-eff-cicli";
import useFetch from "../use-fetch";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { RequestConfigType } from "./types/request-config";
import { FilterItem, OthersFiltersItem } from "../types/filter";
import { SortEnum } from "../types/sort-type";
import { InfinityPaginationType } from "../types/infinity-pagination";

export type OrpEffCicliRequest = {
  page: number;
  limit: number;
  filters?: Array<FilterItem<OrpEffCicli>>;
  sort?: Array<{
    orderBy: keyof OrpEffCicli;
    order: SortEnum;
  }>;
  othersFilters?: Array<OthersFiltersItem>;
};

export type OrpEffCicliResponse = InfinityPaginationType<OrpEffCicli>;

export function useGetOrpEffCicliService() {
  const fetch = useFetch();

  return useCallback(
    (data: OrpEffCicliRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/orp-eff-ciclis`);
      requestUrl.searchParams.append("page", data.page.toString());
      requestUrl.searchParams.append("limit", data.limit.toString());
      if (data.filters) {
        requestUrl.searchParams.append("filters", JSON.stringify(data.filters));
      }
      if (data.sort) {
        requestUrl.searchParams.append("sort", JSON.stringify(data.sort));
      }

      return fetch(requestUrl, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<OrpEffCicliResponse>);
    },
    [fetch]
  );
}
