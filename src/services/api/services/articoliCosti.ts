import { useCallback } from "react";
import { API_URL } from "../config";
import { ArticoliCosti } from "../types/articoliCosti";
import useFetch from "../use-fetch";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { RequestConfigType } from "./types/request-config";

export type ArticoliCostiPostRequest = {
  CF_COMM_ID: ArticoliCosti["CF_COMM_ID"];
  //data: Partial<Pick<ArticoliCosti, "costo1" | "costo2">>;
  costo1: ArticoliCosti["costo1"];
  costo2: ArticoliCosti["costo2"];
};

export type ArticoliCostiPostResponse = ArticoliCosti;

export function usePostArticoliCostiService() {
  const fetch = useFetch();

  return useCallback(
    (data: ArticoliCostiPostRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/articoli-costis`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ArticoliCostiPostResponse>);
    },
    [fetch]
  );
}

export type ArticoliCostiPatchRequest = {
  CF_COMM_ID: ArticoliCosti["CF_COMM_ID"];
  data: Partial<Pick<ArticoliCosti, "costo1" | "costo2">>;
};

export type ArticoliCostiPatchResponse = ArticoliCosti;

export function usePatchArticoliCostiService() {
  const fetch = useFetch();

  return useCallback(
    (data: ArticoliCostiPatchRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/articoli-costis/${data.CF_COMM_ID}`, {
        method: "PATCH",
        body: JSON.stringify(data.data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ArticoliCostiPatchResponse>);
    },
    [fetch]
  );
}

export type ArticoliCostiDeleteRequest = {
  CF_COMM_ID: ArticoliCosti["CF_COMM_ID"];
};

export type ArticoliCostiDeleteResponse = undefined;

export function useDeleteArticoliCostiService() {
  const fetch = useFetch();

  return useCallback(
    (data: ArticoliCostiDeleteRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/articolicosti/${data.CF_COMM_ID}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ArticoliCostiDeleteResponse>);
    },
    [fetch]
  );
}
