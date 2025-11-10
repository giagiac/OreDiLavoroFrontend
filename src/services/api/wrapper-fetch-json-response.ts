import { FetchJsonResponse } from "./types/fetch-json-response";
import HTTP_CODES_ENUM from "./types/http-codes";

async function wrapperFetchJsonResponse<T>(
  response: Response
): Promise<FetchJsonResponse<T>> {
  if (response?.status != null) {
    const status = response.status as FetchJsonResponse<T>["status"];

    if (status === HTTP_CODES_ENUM.OK || status === HTTP_CODES_ENUM.CREATED) {
      try {
        const data = await response.json();
        return { status, data } as FetchJsonResponse<T>;
      } catch (error) {
        return { status, data: undefined } as FetchJsonResponse<T>;
      }
    }

    return { status, data: undefined } as FetchJsonResponse<T>;
  }

  return {
    status: HTTP_CODES_ENUM.NO_CONTENT,
    data: undefined,
  } as FetchJsonResponse<T>;
}

export default wrapperFetchJsonResponse;
