import { useCallback } from "react";
import { API_URL } from "../config";
import { CfComm } from "../types/cfComm";
import { FilterItem, OthersFiltersItem } from "../types/filter";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { SortEnum } from "../types/sort-type";
import useFetch from "../use-fetch";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { RequestConfigType } from "./types/request-config";

export type CfCommRequest = {
  page: number;
  limit: number;
  filters?: Array<FilterItem<CfComm>>;
  sort?: Array<{
    orderBy: keyof CfComm;
    order: SortEnum;
  }>;
  othersFilters?: Array<OthersFiltersItem>;
};

export type CfCommResponse = InfinityPaginationType<CfComm>;

export function useGetCfCommService() {
  const fetch = useFetch();

  return useCallback(
    (data: CfCommRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/cf-comms`);
      requestUrl.searchParams.append("page", data.page.toString());
      requestUrl.searchParams.append("limit", data.limit.toString());
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
