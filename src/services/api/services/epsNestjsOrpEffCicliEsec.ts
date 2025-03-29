import { useCallback } from "react";
import { API_URL } from "../config";
import { EpsNestjsOrpEffCicliEsec } from "../types/eps-nestjs-orp-eff-cicli-esec";
import { FilterItem, OthersFiltersItem } from "../types/filter";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { SortEnum } from "../types/sort-type";
import useFetch from "../use-fetch";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { RequestConfigType } from "./types/request-config";

export type EpsNestjsOrpEffCicliEsecsRequest = {
  page: number;
  limit: number;
  filters?: Array<FilterItem<EpsNestjsOrpEffCicliEsec>>;
  sort?: Array<{
    orderBy: keyof EpsNestjsOrpEffCicliEsec;
    order: SortEnum;
  }>;
  othersFilters?: Array<OthersFiltersItem>;
};

export type EpsNestjsOrpEffCicliEsecsResponse =
  InfinityPaginationType<EpsNestjsOrpEffCicliEsec> & { totale: number };

export function useGetEpsNestjsOrpEffCicliEsecService() {
  const fetch = useFetch();

  return useCallback(
    (
      data: EpsNestjsOrpEffCicliEsecsRequest,
      requestConfig?: RequestConfigType
    ) => {
      const requestUrl = new URL(`${API_URL}/v1/eps-nestjs-orp-eff-cicli-esecs`);
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
      }).then(wrapperFetchJsonResponse<EpsNestjsOrpEffCicliEsecsResponse>);
    },
    [fetch]
  );
}

export function useGetEpsNestjsOrpEffCicliEsecsService() {
  const fetch = useFetch();

  return useCallback(
    (
      data: EpsNestjsOrpEffCicliEsecsRequest,
      requestConfig?: RequestConfigType
    ) => {
      const requestUrl = new URL(`${API_URL}/v1/eps-nestjs-orp-eff-cicli-esecs`);
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
      }).then(wrapperFetchJsonResponse<EpsNestjsOrpEffCicliEsecsResponse>);
    },
    [fetch]
  );
}

export type EpsNestjsOrpEffCicliEsecDeleteRequest = {
  id: EpsNestjsOrpEffCicliEsec["id"];
};

export type EpsNestjsOrpEffCicliEsecDeleteResponse = undefined;

export function useDeleteEpsNestjsOrpEffCicliEsecService() {
  const fetch = useFetch();

  return useCallback(
    (
      data: EpsNestjsOrpEffCicliEsecDeleteRequest,
      requestConfig?: RequestConfigType
    ) => {
      return fetch(`${API_URL}/v1/eps-nestjs-orp-eff-cicli-esecs/${data.id}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<EpsNestjsOrpEffCicliEsecDeleteResponse>);
    },
    [fetch]
  );
}
