import { useCallback } from "react";
import { API_URL } from "../config";
import { EpsNestjsOrpEffCicliEsecChild } from "../types/eps-nestjs-orp-eff-cicli-esec-child";
import { FilterItem, OthersFiltersItem } from "../types/filter";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { SortEnum } from "../types/sort-type";
import useFetch from "../use-fetch";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { RequestConfigType } from "./types/request-config";

export type EpsNestjsOrpEffCicliEsecChildsRequest = {
  page: number;
  limit: number;
  filters?: Array<FilterItem<EpsNestjsOrpEffCicliEsecChild>>;
  sort?: Array<{
    orderBy: keyof EpsNestjsOrpEffCicliEsecChild;
    order: SortEnum;
  }>;
  othersFilters?: Array<OthersFiltersItem>;
};

export type EpsNestjsOrpEffCicliEsecChildsResponse =
  InfinityPaginationType<EpsNestjsOrpEffCicliEsecChild> & {
    totale: String;
    targetDateInizio: String;
  };

export function useGetEpsNestjsOrpEffCicliEsecChildService() {
  const fetch = useFetch();

  return useCallback(
    (
      data: EpsNestjsOrpEffCicliEsecChildsRequest,
      requestConfig?: RequestConfigType
    ) => {
      const requestUrl = new URL(
        `${API_URL}/v1/eps-nestjs-orp-eff-cicli-esecs-children`
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
      }).then(wrapperFetchJsonResponse<EpsNestjsOrpEffCicliEsecChildsResponse>);
    },
    [fetch]
  );
}

export type EpsNestjsOrpEffCicliEsecChildDeleteRequest = {
  id: EpsNestjsOrpEffCicliEsecChild["id"];
};

export type EpsNestjsOrpEffCicliEsecChildDeleteResponse = undefined;

export function useDeleteEpsNestjsOrpEffCicliEsecChildService() {
  const fetch = useFetch();

  return useCallback(
    (
      data: EpsNestjsOrpEffCicliEsecChildDeleteRequest,
      requestConfig?: RequestConfigType
    ) => {
      return fetch(`${API_URL}/v1/eps-nestjs-orp-eff-cicli-esecs/${data.id}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(
        wrapperFetchJsonResponse<EpsNestjsOrpEffCicliEsecChildDeleteResponse>
      );
    },
    [fetch]
  );
}

// -----------------------------------------------------------------------------

export type EpsNestjsOrpEffCicliEsecChildPostRequest = {
  // OBBLIGATORI
  TIPO_TRASFERTA: string;
  TEMPO_OPERATORE: string;
  // Documento
  DOC_RIGA_ID: string;
  DOC_ID: string;
  AZIENDA_ID: number;

  // SEZIONE DEDICATA a KM AUTISTA
  COD_ART?: string | null; // ATT.NE non è il COD_ART delle Esecuzioni (da inserire nei componenti)
  KM?: number | null;

  // EXTRA
  NOTE?: string | null;
};

export type EpsNestjsOrpEffCicliEsecChildPostResponse =
  EpsNestjsOrpEffCicliEsecChild;

export function usePostEpsNestjsOrpEffCicliEsecChildService() {
  const fetch = useFetch();

  return useCallback(
    (
      data: EpsNestjsOrpEffCicliEsecChildPostRequest,
      requestConfig?: RequestConfigType
    ) => {
      return fetch(`${API_URL}/v1/eps-nestjs-orp-eff-cicli-esecs`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(
        wrapperFetchJsonResponse<EpsNestjsOrpEffCicliEsecChildPostResponse>
      );
    },
    [fetch]
  );
}

// -----------------------------------------------------------------------------

export function useGetEpsNestjsOrpEffCicliEsecChildOperatoreService() {
  const fetch = useFetch();

  return useCallback(
    (
      data: EpsNestjsOrpEffCicliEsecChildsRequest,
      requestConfig?: RequestConfigType
    ) => {
      const requestUrl = new URL(
        `${API_URL}/v1/eps-nestjs-orp-eff-cicli-esecs/operatore`
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
      }).then(wrapperFetchJsonResponse<EpsNestjsOrpEffCicliEsecChildsResponse>);
    },
    [fetch]
  );
}
