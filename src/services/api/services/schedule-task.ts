import { useCallback } from "react";
import { API_URL } from "../config";
import { ScheduleTask } from "../types/schedule-task";
import useFetch from "../use-fetch";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { RequestConfigType } from "./types/request-config";

export type ScheduleTaskRequest = {
  id: ScheduleTask["id"];
};

export type ScheduleTaskResponse = undefined;

export function useScheduleTaskService() {
  const fetch = useFetch();

  return useCallback(
    (data: ScheduleTaskRequest, requestConfig?: RequestConfigType) => {
      return fetch(
        `${API_URL}/v1/schedule-tasks/find-all-esec-by-id/${data.id}`,
        {
          method: "GET",
          ...requestConfig,
        }
      ).then(wrapperFetchJsonResponse<ScheduleTaskResponse>);
    },
    [fetch]
  );
}
