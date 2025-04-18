import { useCallback } from "react";
import { API_URL } from "../config";
import { Operatori } from "../types/operatori";
import { FilterItem, OthersFiltersItem } from "../types/filter";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { SortEnum } from "../types/sort-type";
import useFetch from "../use-fetch";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { RequestConfigType } from "./types/request-config";

export type OperatoriPatchRequest = Pick<Operatori, "COD_OP">;

export type OperatoriPatchResponse = Operatori;

export function usePatchOperatoriService() {
  const fetch = useFetch();

  return useCallback(
    (data: OperatoriPatchRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/operatoris`, {
        method: "PATCH",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<OperatoriPatchResponse>);
    },
    [fetch]
  );
}

export type OperatoriRequest = {
  page: number;
  limit: number;
  filters?: Array<FilterItem<Operatori>>;
  sort?: Array<{
    orderBy: keyof Operatori;
    order: SortEnum;
  }>;
  othersFilters?: Array<OthersFiltersItem>;
};

export type OperatoriResponse = InfinityPaginationType<Operatori>;

export function useGetOperatoriService() {
  const fetch = useFetch();

  return useCallback(
    (data: OperatoriRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/operatoris`);
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
      }).then(wrapperFetchJsonResponse<OperatoriResponse>);
    },
    [fetch]
  );
}

// ---------------------------------------------------------------------

export type OperatoriEsecuzioniRequest = {
  page: number;
  limit: number;
  filters?: Array<FilterItem<Operatori>>;
  sort?: Array<{
    orderBy: keyof Operatori;
    order: SortEnum;
  }>;
  othersFilters?: Array<OthersFiltersItem>;
};

export type OperatoriEsecuzioniResponse = InfinityPaginationType<Operatori>;

export function useGetOperatoriEsecuzioniService() {
  const fetch = useFetch();

  return useCallback(
    (data: OperatoriEsecuzioniRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/operatoris/operatori-esecuzioni`);
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
      }).then(wrapperFetchJsonResponse<OperatoriEsecuzioniResponse>);
    },
    [fetch]
  );
}
