import { useCallback } from "react";
import { API_URL } from "../config";
import { EpsNestjsOrpEffCicliEsecFailed } from "../types/eps-nestjs-orp-eff-cicli-esec-failed";
import { FilterItem, OthersFiltersItem } from "../types/filter";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { SortEnum } from "../types/sort-type";
import useFetch from "../use-fetch";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { RequestConfigType } from "./types/request-config";
import { EpsNestjsOrpEffCicliEsec } from "../types/eps-nestjs-orp-eff-cicli-esec";
import { EpsNestjsOrpEffCicliEsecChild } from "../types/eps-nestjs-orp-eff-cicli-esec-child";
import { EpsNestjsOrpEffCicliEsecPostResponse } from "./eps-nestjs-orp-eff-cicli-esec";

export type EpsNestjsOrpEffCicliEsecsFailedRequest = {
  page: number;
  limit: number;
  filters?: Array<FilterItem<EpsNestjsOrpEffCicliEsecFailed>>;
  sort?: Array<{
    orderBy: keyof EpsNestjsOrpEffCicliEsecFailed;
    order: SortEnum;
  }>;
  othersFilters?: Array<OthersFiltersItem>;
};

export type EpsNestjsOrpEffCicliEsecsFailedResponse =
  InfinityPaginationType<EpsNestjsOrpEffCicliEsecFailed> & {
    totale: String;
    targetDateInizio: String;
    dateInizio: Date;
  };

export function useGetEpsNestjsOrpEffCicliEsecFailedService() {
  const fetch = useFetch();

  return useCallback(
    (
      data: EpsNestjsOrpEffCicliEsecsFailedRequest,
      requestConfig?: RequestConfigType
    ) => {
      const requestUrl = new URL(
        `${API_URL}/v1/eps-nestjs-orp-eff-cicli-esecs/failed`
      );
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
      }).then(wrapperFetchJsonResponse<EpsNestjsOrpEffCicliEsecsFailedResponse>);
    },
    [fetch]
  );
}

// -----------------------------------------------------------------------------

export type EpsNestjsOrpEffCicliEsecPatchRequest = {
  id: EpsNestjsOrpEffCicliEsec["id"];
};

export function usePatchEpsNestjsOrpEffCicliEsecFailedService() {
  const fetch = useFetch();

  return useCallback(
    (
      data: EpsNestjsOrpEffCicliEsecPatchRequest,
      requestConfig?: RequestConfigType
    ) => {
      return fetch(`${API_URL}/v1/eps-nestjs-orp-eff-cicli-esecs/failed/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<EpsNestjsOrpEffCicliEsecPostResponse>);
    },
    [fetch]
  );
}

// -----------------------------------------------------------------------------

export type EpsNestjsOrpEffCicliEsecDeleteRequest = {
  id?: EpsNestjsOrpEffCicliEsecFailed["id"];
  HYPSERV_REQ2_COD_CHIAVE?: EpsNestjsOrpEffCicliEsecFailed["HYPSERV_REQ2_COD_CHIAVE"];
  APP_REQ3_HYPSERV_COD_CHIAVE_COSTO_KM?: EpsNestjsOrpEffCicliEsecFailed["APP_REQ3_HYPSERV_COD_CHIAVE_COSTO_KM"];
  APP_REQ3_HYPSERV_COD_CHIAVE_COSTO_OPERATORE_TRASFERTA?: EpsNestjsOrpEffCicliEsecFailed["APP_REQ3_HYPSERV_COD_CHIAVE_COSTO_OPERATORE_TRASFERTA"]
};

export type EpsNestjsOrpEffCicliEsecDeleteResponse = undefined;

export function useDeleteEpsNestjsOrpEffCicliEsecFailedService() {
  const fetch = useFetch();

  return useCallback(
    (
      data: EpsNestjsOrpEffCicliEsecDeleteRequest,
      requestConfig?: RequestConfigType
    ) => {
      const query = new URLSearchParams();
      if(data.HYPSERV_REQ2_COD_CHIAVE){
        query.append("HYPSERV_REQ2_COD_CHIAVE", data.HYPSERV_REQ2_COD_CHIAVE);
      }else if(data.APP_REQ3_HYPSERV_COD_CHIAVE_COSTO_KM){
        query.append("APP_REQ3_HYPSERV_COD_CHIAVE_COSTO_KM", data.APP_REQ3_HYPSERV_COD_CHIAVE_COSTO_KM);
      } else if(data.APP_REQ3_HYPSERV_COD_CHIAVE_COSTO_OPERATORE_TRASFERTA){
        query.append("APP_REQ3_HYPSERV_COD_CHIAVE_COSTO_OPERATORE_TRASFERTA", data.APP_REQ3_HYPSERV_COD_CHIAVE_COSTO_OPERATORE_TRASFERTA);
      } else if(data.id){
        query.append("id", data.id);
      }
      return fetch(`${API_URL}/v1/eps-nestjs-orp-eff-cicli-esecs/failed?${query.toString()}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<EpsNestjsOrpEffCicliEsecDeleteResponse>);
    },
    [fetch]
  );
}

// -----------------------------------------------------------------------------
