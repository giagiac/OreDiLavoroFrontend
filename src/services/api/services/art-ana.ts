import { useCallback } from "react";
import { API_URL } from "../config";
import { ArtAna } from "../types/art-ana";
import { FilterItem, OthersFiltersItem } from "../types/filter";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { SortEnum } from "../types/sort-type";
import useFetch from "../use-fetch";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { RequestConfigType } from "./types/request-config";

export type ArtAnaRequest = {
  page: number;
  limit: number;
  filters?: Array<FilterItem<ArtAna>>;
  sort?: Array<{
    orderBy: keyof ArtAna;
    order: SortEnum;
  }>;
  othersFilters?: Array<OthersFiltersItem>;
};

export type ArtAnaResponse = InfinityPaginationType<ArtAna>;

export function useGetArtAnaService() {
  const fetch = useFetch();

  return useCallback(
    (data: ArtAnaRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/art-ana`);
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
      }).then(wrapperFetchJsonResponse<ArtAnaResponse>);
    },
    [fetch]
  );
}
