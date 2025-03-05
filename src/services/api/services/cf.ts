import { useCallback } from "react";
import { API_URL } from "../config";
import { Cf } from "../types/cf";
import { FilterItem, OthersFiltersItem } from "../types/filter";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { SortEnum } from "../types/sort-type";
import useFetch from "../use-fetch";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { RequestConfigType } from "./types/request-config";

export type CfsRequest = {
  page: number;
  limit: number;
  filters?: Array<FilterItem<Cf>>;
  sort?: Array<{
    orderBy: keyof Cf;
    order: SortEnum;
  }>;
  othersFilters?: Array<OthersFiltersItem>;
};

export type CfsResponse = InfinityPaginationType<Cf>;

export function useGetCfsService() {
  const fetch = useFetch();

  return useCallback(
    (data: CfsRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/cfs`);
      requestUrl.searchParams.append("page", data.page.toString());
      requestUrl.searchParams.append("limit", data.limit.toString());
      if (data.filters) {
        requestUrl.searchParams.append("filters", JSON.stringify(data.filters));
      }
      if (data.sort) {
        requestUrl.searchParams.append("sort", JSON.stringify(data.sort));
      }
      if (data.othersFilters) {
        requestUrl.searchParams.append(
          "othersFilters",
          JSON.stringify(data.othersFilters)
        );
      }

      return fetch(requestUrl, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<CfsResponse>);
    },
    [fetch]
  );
}
