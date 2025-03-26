import { useCallback } from "react";
import { API_URL } from "../config";
import { ArticoliCostiCfComm } from "../types/articoli-costi-cf-comm";
import useFetch from "../use-fetch";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { RequestConfigType } from "./types/request-config";

export type ArticoliCostiCfCommPostRequest = {
  CF_COMM_ID: ArticoliCostiCfComm["CF_COMM_ID"];
  //data: Partial<Pick<ArticoliCosti, "costo1" | "costo2">>;
  COD_ART: ArticoliCostiCfComm["COD_ART"];
  TIPO_COSTO: ArticoliCostiCfComm["TIPO_COSTO"];
};

export type ArticoliCostiCfCommPostResponse = ArticoliCostiCfComm;

export function usePostArticoliCostiCfCommService() {
  const fetch = useFetch();

  return useCallback(
    (
      data: ArticoliCostiCfCommPostRequest,
      requestConfig?: RequestConfigType
    ) => {
      return fetch(`${API_URL}/v1/articoli-costi-cf-comm`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ArticoliCostiCfCommPostResponse>);
    },
    [fetch]
  );
}

export type ArticoliCostiCfCommPatchRequest = {
  CF_COMM_ID: ArticoliCostiCfComm["CF_COMM_ID"];
  data: Partial<Pick<ArticoliCostiCfComm, "COD_ART" | "TIPO_COSTO" | "CF_COMM_ID">>;
};

export type ArticoliCostiCfCommPatchResponse = ArticoliCostiCfComm;

export function usePatchArticoliCostiCfCommService() {
  const fetch = useFetch();

  return useCallback(
    (
      data: ArticoliCostiCfCommPatchRequest,
      requestConfig?: RequestConfigType
    ) => {
      return fetch(`${API_URL}/v1/articoli-costi-cf-comm/${data.CF_COMM_ID}`, {
        method: "PATCH",
        body: JSON.stringify(data.data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ArticoliCostiCfCommPatchResponse>);
    },
    [fetch]
  );
}

export type ArticoliCostiCfCommDeleteRequest = {
  CF_COMM_ID: ArticoliCostiCfComm["CF_COMM_ID"];
};

export type ArticoliCostiCfCommDeleteResponse = undefined;

export function useDeleteArticoliCostiCfCommService() {
  const fetch = useFetch();

  return useCallback(
    (
      data: ArticoliCostiCfCommDeleteRequest,
      requestConfig?: RequestConfigType
    ) => {
      return fetch(`${API_URL}/v1/articoli-costi-cf-comm/${data.CF_COMM_ID}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ArticoliCostiCfCommDeleteResponse>);
    },
    [fetch]
  );
}
