import { useCallback } from "react";
import { API_URL } from "../config";
import { EpsNestjsOrpEffCicliEsec } from "../types/eps-nestjs-orp-eff-cicli-esec";
import { EpsNestjsOrpEffCicliEsecChild } from "../types/eps-nestjs-orp-eff-cicli-esec-child";
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
  InfinityPaginationType<EpsNestjsOrpEffCicliEsec> & {
    totale: String;
    targetDateInizio: String;
    dateInizio: Date;
  };

export function useGetEpsNestjsOrpEffCicliEsecService() {
  const fetch = useFetch();

  return useCallback(
    (
      data: EpsNestjsOrpEffCicliEsecsRequest,
      requestConfig?: RequestConfigType
    ) => {
      const requestUrl = new URL(
        `${API_URL}/v1/eps-nestjs-orp-eff-cicli-esecs`
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
      }).then(wrapperFetchJsonResponse<EpsNestjsOrpEffCicliEsecsResponse>);
    },
    [fetch]
  );
}

// -----------------------------------------------------------------------------

export function useGetEpsNestjsOrpEffCicliEsecFindByIdService() {
  const fetch = useFetch();

  return useCallback(
    (
      data: EpsNestjsOrpEffCicliEsecsRequest,
      requestConfig?: RequestConfigType
    ) => {
      const requestUrl = new URL(
        `${API_URL}/v1/eps-nestjs-orp-eff-cicli-esecs/find-by-id`
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
      }).then(wrapperFetchJsonResponse<EpsNestjsOrpEffCicliEsecsResponse>);
    },
    [fetch]
  );
}

// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------

export type EpsNestjsOrpEffCicliEsecPostRequest = {
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

export type EpsNestjsOrpEffCicliEsecPatchRequest = {
  id: EpsNestjsOrpEffCicliEsec["id"];
  idfk?: EpsNestjsOrpEffCicliEsecChild["idfk"];
  COD_OP?: EpsNestjsOrpEffCicliEsec["COD_OP"];
  TEMPO_OPERATORE?: string;
  DATA_INIZIO?: EpsNestjsOrpEffCicliEsec["DATA_INIZIO"];
  DATA_FINE?: EpsNestjsOrpEffCicliEsec["DATA_FINE"];

  HYPSERV_REQ2_COD_CHIAVE_DELETED?: EpsNestjsOrpEffCicliEsec["HYPSERV_REQ2_COD_CHIAVE_DELETED"];
  APP_REQ3_HYPSERV_COD_CHIAVE_COSTO_KM_DELETED?: EpsNestjsOrpEffCicliEsec["APP_REQ3_HYPSERV_COD_CHIAVE_COSTO_KM_DELETED"];
  APP_REQ3_HYPSERV_COD_CHIAVE_COSTO_OPERATORE_TRASFERTA_DELETED?: EpsNestjsOrpEffCicliEsec["APP_REQ3_HYPSERV_COD_CHIAVE_COSTO_OPERATORE_TRASFERTA_DELETED"];

  APP_REQ3_HYPSERV_COD_CHIAVE_COSTO_KM?: EpsNestjsOrpEffCicliEsec["APP_REQ3_HYPSERV_COD_CHIAVE_COSTO_KM"];
  APP_REQ3_HYPSERV_COD_CHIAVE_COSTO_OPERATORE_TRASFERTA?: EpsNestjsOrpEffCicliEsec["APP_REQ3_HYPSERV_COD_CHIAVE_COSTO_OPERATORE_TRASFERTA"];
  HYPSERV_REQ2_COD_CHIAVE?: EpsNestjsOrpEffCicliEsec["HYPSERV_REQ2_COD_CHIAVE"];
};

export type EpsNestjsOrpEffCicliEsecPostResponse = EpsNestjsOrpEffCicliEsec;

export function usePostEpsNestjsOrpEffCicliEsecService() {
  const fetch = useFetch();

  return useCallback(
    (
      data: EpsNestjsOrpEffCicliEsecPostRequest,
      requestConfig?: RequestConfigType
    ) => {
      return fetch(`${API_URL}/v1/eps-nestjs-orp-eff-cicli-esecs`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<EpsNestjsOrpEffCicliEsecPostResponse>);
    },
    [fetch]
  );
}

export function usePatchEpsNestjsOrpEffCicliEsecService() {
  const fetch = useFetch();

  return useCallback(
    (
      data: EpsNestjsOrpEffCicliEsecPatchRequest,
      requestConfig?: RequestConfigType
    ) => {
      return fetch(`${API_URL}/v1/eps-nestjs-orp-eff-cicli-esecs/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<EpsNestjsOrpEffCicliEsecPostResponse>);
    },
    [fetch]
  );
}

export function usePatchEpsNestjsOrpEffCicliEsecChildService() {
  const fetch = useFetch();

  return useCallback(
    (
      data: EpsNestjsOrpEffCicliEsecPatchRequest,
      requestConfig?: RequestConfigType
    ) => {
      return fetch(
        `${API_URL}/v1/eps-nestjs-orp-eff-cicli-esec-children/${data.id}`,
        {
          method: "PATCH",
          body: JSON.stringify(data),
          ...requestConfig,
        }
      ).then(wrapperFetchJsonResponse<EpsNestjsOrpEffCicliEsecPostResponse>);
    },
    [fetch]
  );
}

// -----------------------------------------------------------------------------

export function useGetEpsNestjsOrpEffCicliEsecOperatoreService() {
  const fetch = useFetch();

  return useCallback(
    (
      data: EpsNestjsOrpEffCicliEsecsRequest,
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
      }).then(wrapperFetchJsonResponse<EpsNestjsOrpEffCicliEsecsResponse>);
    },
    [fetch]
  );
}

// -----------------------------------------------------------------------------

export function useGetEpsNestjsOrpEffCicliEsecByIdOperatoreService() {
  const fetch = useFetch();

  return useCallback(
    (
      data: EpsNestjsOrpEffCicliEsecsRequest,
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
      }).then(wrapperFetchJsonResponse<EpsNestjsOrpEffCicliEsecsResponse>);
    },
    [fetch]
  );
}

// -----------------------------------------------------------------------------

export function useGetEpsNestjsOrpEffCicliEsecsByIdService() {
  const fetch = useFetch();

  return useCallback(
    (id: string, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(
        `${API_URL}/v1/eps-nestjs-orp-eff-cicli-esecs`
      );
      requestUrl.searchParams.append("id", id);

      return fetch(requestUrl, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<EpsNestjsOrpEffCicliEsec>);
    },
    [fetch]
  );
}
