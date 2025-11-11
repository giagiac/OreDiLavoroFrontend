"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";
import { useSnackbar } from "../../hooks/use-snackbar";
import { getTokensInfo, setTokensInfo } from "../auth/auth-tokens-info";
import useLanguage from "../i18n/use-language";
import { AUTH_REFRESH_URL } from "./config";
import { FetchInitType, FetchInputType } from "./types/fetch-params";

function useFetch() {
  const language = useLanguage();

  const { enqueueSnackbar } = useSnackbar();

  return useCallback(
    async (input: FetchInputType, init?: FetchInitType) => {
      const tokens = getTokensInfo();

      let headers: HeadersInit = {
        "x-custom-lang": language,
      };

      if (!(init?.body instanceof FormData)) {
        headers = {
          ...headers,
          "Content-Type": "application/json",
        };
      }

      if (tokens?.token) {
        headers = {
          ...headers,
          Authorization: `Bearer ${tokens.token}`,
        };
      }

      if (tokens?.tokenExpires && tokens.tokenExpires - 60000 <= Date.now()) {
        const newTokens = await fetch(AUTH_REFRESH_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokens.refreshToken}`,
          },
        }).then((res) => res.json());

        if (newTokens.token) {
          setTokensInfo({
            token: newTokens.token,
            refreshToken: newTokens.refreshToken,
            tokenExpires: newTokens.tokenExpires,
          });

          headers = {
            ...headers,
            Authorization: `Bearer ${newTokens.token}`,
          };
        }
      }

      return (
        fetch(input, {
          ...init,
          headers: {
            ...headers,
            ...init?.headers,
          },
        })
          // .catch(async (response) => {
          //   return Promise.resolve({
          //     success: false,
          //     error: {
          //       status: response.status,
          //       message: `Errore HTTP: ${response.statusText || "Errore sconosciuto"}`,
          //     },
          //   });
          //   if("ok" in response && !response.ok)
          //   {
          //     const data = await response.json();
          //     if (data?.errors) {
          //       (Object.keys(data.errors) as Array<keyof any>).forEach(
          //         (key) => {
          //           enqueueSnackbar(`${key.toString()} - ${data.errors[key]}`, {
          //             variant: "error",
          //           });
          //         }
          //       );
          //     } else {
          //       const message = `Errore: ${response.status} Message: ${data.message || "Errore sconosciuto"}`;
          //       enqueueSnackbar(message, {
          //         variant: "error",
          //       });
          //     }
          //   }
          // })
          .then(async (response) => {
            if ("ok" in response && !response.ok) {
              const data = await response.json();
              if (data?.errors) {
                (Object.keys(data.errors) as Array<keyof any>).forEach(
                  (key) => {
                    enqueueSnackbar(`${key.toString()} - ${data.errors[key]}`, {
                      variant: "error",
                    });
                  }
                );
              } else {
                const message = `Errore: ${response.status} Message: ${data.message || "Errore sconosciuto"}`;
                enqueueSnackbar(message, {
                  variant: "error",
                });
              }
            }
            return Promise.resolve(response);
          })
      );
      // .catch((error) => {
      //   enqueueSnackbar(error.message, {
      //     variant: "error",
      //   });
      //   return Promise.reject(error);
      // });
    },
    [language, enqueueSnackbar]
  );
}

export default useFetch;
