import { useCallback } from "react";
import { API_URL } from "../config";
import { FileEntity } from "../types/file-entity";
import HTTP_CODES_ENUM from "../types/http-codes";
import useFetch from "../use-fetch";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { RequestConfigType } from "./types/request-config";

export type FileUploadRequest = File;

export type FileUploadResponse = {
  file: FileEntity;
  uploadSignedUrl: string;
};

export function useFileUploadService() {
  const fetchClient = useFetch();

  return useCallback(
    async (data: FileUploadRequest, requestConfig?: RequestConfigType) => {
      if (process.env.NEXT_PUBLIC_FILE_DRIVER === "s3-presigned") {
        const result = await fetchClient(`${API_URL}/v1/files/upload`, {
          method: "POST",
          body: JSON.stringify({
            fileName: data.name,
            fileSize: data.size,
          }),
          ...requestConfig,
        }).then(wrapperFetchJsonResponse<FileUploadResponse>);

        if (result.status === HTTP_CODES_ENUM.CREATED) {
          await fetch(result.data.uploadSignedUrl, {
            method: "PUT",
            body: data,
            headers: {
              "Content-Type": data.type,
            },
          });
        }

        return result;
      } else {
        const formData = new FormData();
        formData.append("file", data);

        return fetchClient(`${API_URL}/v1/files/upload`, {
          method: "POST",
          body: formData,
          ...requestConfig,
        }).then(wrapperFetchJsonResponse<FileUploadResponse>);
      }
    },
    [fetchClient]
  );
}
