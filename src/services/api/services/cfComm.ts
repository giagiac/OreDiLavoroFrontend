import { useCallback } from "react";
import { API_URL } from "../config";
import { RequestConfigType } from "./types/request-config";
import { CfComm } from "../types/cfComm";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { SortEnum } from "../types/sort-type";
import useFetch from "../use-fetch";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { FilterItem } from "../types/filter";

export type CfCommRequest = {
  page: number;
  limit: number;
  filters?: Array<FilterItem<CfComm>>;
  sort?: Array<{
    orderBy: keyof CfComm;
    order: SortEnum;
  }>;
  COD_CF: String;
};

export type CfCommResponse = InfinityPaginationType<CfComm>;

export function useGetCfCommService() {
  const fetch = useFetch();

  return useCallback(
    (data: CfCommRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/cf-comm`);
      requestUrl.searchParams.append("page", data.page.toString());
      requestUrl.searchParams.append("limit", data.limit.toString());
      requestUrl.searchParams.append("COD_CF", data.COD_CF.toString());
      if (data.filters) {
        requestUrl.searchParams.append("filters", JSON.stringify(data.filters));
      }
      if (data.sort) {
        requestUrl.searchParams.append("sort", JSON.stringify(data.sort));
      }

      return fetch(requestUrl, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<CfCommResponse>);
    },
    [fetch]
  );
}

export type UserPostRequest = Pick<CfComm, "COD_CF" | "CF_COMM_ID"> & {
  password: string;
};

export type UserPostResponse = CfComm;

export function usePostUserService() {
  const fetch = useFetch();

  return useCallback(
    (data: UserPostRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/users`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<UserPostResponse>);
    },
    [fetch]
  );
}

export type UserPatchRequest = {
  id: CfComm["CF_COMM_ID"];
  data: Partial<
    Pick<CfComm, "COD_CF" | "CF_COMM_ID"> & {
      password: string;
    }
  >;
};

export type UserPatchResponse = CfComm;

export function usePatchUserService() {
  const fetch = useFetch();

  return useCallback(
    (data: UserPatchRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/users/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data.data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<UserPatchResponse>);
    },
    [fetch]
  );
}

export type CfCommDeleteRequest = {
  id: CfComm["CF_COMM_ID"];
};

export type CfCommDeleteResponse = undefined;

export function useDeleteCfCommService() {
  const fetch = useFetch();

  return useCallback(
    (data: CfCommDeleteRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/users/${data.id}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<CfCommDeleteResponse>);
    },
    [fetch]
  );
}
