import { useCallback } from "react";
import { API_URL } from "../config";
import { ArticoliCostiCf } from "../types/articoli-costi-cf";
import useFetch from "../use-fetch";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { RequestConfigType } from "./types/request-config";

export type ArticoliCostiCfPostRequest = {
  CF_COMM_ID: ArticoliCostiCf["COD_CF"];
  //data: Partial<Pick<ArticoliCosti, "costo1" | "costo2">>;
  COD_ART: ArticoliCostiCf["COD_ART"];
  TIPO_COSTO: ArticoliCostiCf["TIPO_COSTO"];
};

export type ArticoliCostiCfPostResponse = ArticoliCostiCf;

export function usePostArticoliCostiCfService() {
  const fetch = useFetch();

  return useCallback(
    (data: ArticoliCostiCfPostRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/articoli-costi-cf`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ArticoliCostiCfPostResponse>);
    },
    [fetch]
  );
}

export type ArticoliCostiCfPatchRequest = {
  COD_CF: ArticoliCostiCf["COD_CF"];
  data: Partial<Pick<ArticoliCostiCf, "COD_ART" | "TIPO_COSTO" | "COD_CF">>;
};

export type ArticoliCostiCfPatchResponse = ArticoliCostiCf;

export function usePatchArticoliCostiCfService() {
  const fetch = useFetch();

  return useCallback(
    (data: ArticoliCostiCfPatchRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/articoli-costi-cf`, {
        method: "PATCH",
        body: JSON.stringify(data.data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ArticoliCostiCfPatchResponse>);
    },
    [fetch]
  );
}

export type ArticoliCostiCfDeleteRequest = {
  CF_COMM_ID: ArticoliCostiCf["COD_CF"];
};

export type ArticoliCostiCfDeleteResponse = undefined;

export function useDeleteArticoliCostiCfService() {
  const fetch = useFetch();

  return useCallback(
    (data: ArticoliCostiCfDeleteRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/articoli-costi-cf/${data.CF_COMM_ID}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ArticoliCostiCfDeleteResponse>);
    },
    [fetch]
  );
}
