import { useCallback } from "react";
import { API_URL } from "../config";
import { TargaMezzi } from "../types/targa-mezzi";
import { FilterItem, OthersFiltersItem } from "../types/filter";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { SortEnum } from "../types/sort-type";
import useFetch from "../use-fetch";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { RequestConfigType } from "./types/request-config";

export type TargaMezziRequest = {
  page: number;
  limit: number;
  filters?: Array<FilterItem<TargaMezzi>>;
  sort?: Array<{
    orderBy: keyof TargaMezzi;
    order: SortEnum;
  }>;
  othersFilters?: Array<OthersFiltersItem>;
};

export type TargaMezziResponse = InfinityPaginationType<TargaMezzi>;

export function useGetTargaMezziService() {
  const fetch = useFetch();

  return useCallback(
    (data: TargaMezziRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/eps-nestjs-targa-mezzis`);
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
      }).then(wrapperFetchJsonResponse<TargaMezziResponse>);
    },
    [fetch]
  );
}

export type TargaMezziPatchRequest = {
  COD_ART: TargaMezzi["COD_ART"];
  data: Partial<Pick<TargaMezzi, "COD_ART">>;
};

export type TargaMezziPatchResponse = TargaMezzi;

export function usePatchTargaMezziService() {
  const fetch = useFetch();

  return useCallback(
    (
      data: TargaMezziPatchRequest,
      requestConfig?: RequestConfigType
    ) => {
      return fetch(`${API_URL}/v1/eps-nestjs-targa-mezzis/${data.COD_ART}`, {
        method: "PATCH",
        body: JSON.stringify(data.data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<TargaMezziPatchResponse>);
    },
    [fetch]
  );
}

export type TargaMezziDeleteRequest = {
  id: TargaMezzi["id"];
};

export function useDeleteTargaMezziService() {
  const fetch = useFetch();

  return useCallback(
    (
      data: TargaMezziDeleteRequest,
      requestConfig?: RequestConfigType
    ) => {
      return fetch(`${API_URL}/v1/eps-nestjs-targa-mezzis/${data.id}`, {
        method: "DELETE",
        ...requestConfig,
      })
    },
    [fetch]
  );
}
