import { API_URL } from "@/services/api/config";
import { useGetEpsNestjsOrpEffCicliEsecService } from "@/services/api/services/eps-nestjs-orp-eff-cicli-esec";
import { RequestConfigType } from "@/services/api/services/types/request-config";
import { EpsNestjsOrpEffCicliEsec } from "@/services/api/types/eps-nestjs-orp-eff-cicli-esec";
import { EpsNestjsOrpEffCicliEsecChild } from "@/services/api/types/eps-nestjs-orp-eff-cicli-esec-child";
import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { User } from "@/services/api/types/user";
import useFetch from "@/services/api/use-fetch";
import wrapperFetchJsonResponse from "@/services/api/wrapper-fetch-json-response";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  EpsNestjsOrpEffCicliEsecFilterType,
  EpsNestjsOrpEffCicliEsecSortType,
  OthersFiltersType,
} from "../esp-nestjs-orp-eff-cicli-filter-types";
import { useSnackbar } from "@/hooks/use-snackbar";

export const epsNestjsOrpEffCicliEsecQueryKeys = createQueryKeys(
  ["EpsNestjsOrpEffCicliEsec"],
  {
    list: () => ({
      key: [],
      sub: {
        by: ({
          sort,
          filter,
          othersFilters,
        }: {
          filter: EpsNestjsOrpEffCicliEsecFilterType | undefined;
          sort?: EpsNestjsOrpEffCicliEsecSortType | undefined;
          othersFilters?: OthersFiltersType | undefined;
        }) => ({
          key: [sort, filter, othersFilters],
        }),
      },
    }),
  }
);

export const useGetEpsNestjsOrpEffCicliEsecQuery = ({
  sort,
  filters,
  othersFilters,
}: {
  sort?: EpsNestjsOrpEffCicliEsecSortType | undefined;
  filters?: Array<FilterItem<EpsNestjsOrpEffCicliEsec>> | undefined;
  othersFilters?: Array<OthersFiltersItem> | undefined;
} = {}) => {
  const fetch = useGetEpsNestjsOrpEffCicliEsecService();
  const { enqueueSnackbar } = useSnackbar();

  const query = useInfiniteQuery({
    queryKey: epsNestjsOrpEffCicliEsecQueryKeys.list().sub.by({
      sort,
      filter: { filters },
      othersFilters: { filters: othersFilters },
    }).key,
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      const { status, data } = await fetch(
        {
          page: pageParam,
          limit: 10,
          filters,
          sort: sort ? [sort] : undefined,
          othersFilters,
        },
        {
          signal,
        }
      );

      if (status === HTTP_CODES_ENUM.OK) {
        return {
          data: data.data,
          nextPage: data.hasNextPage ? pageParam + 1 : undefined,
          totale: data.totale,
          targetDateInizio: data.targetDateInizio,
          dateInizio: data.dateInizio,
        };
      } else {
        enqueueSnackbar("Codice operatore non trovato!", {
          variant: "error",
        });
        return {
          data: [],
          nextPage: 0,
          totale: 0,
          targetDateInizio: "",
          dateInizio: "",
        };
      }
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.nextPage;
    },
    gcTime: 0,
    select: (data) => {
      // Trasforma i dati per includere informazioni aggiuntive
      const totale = data.pages[0]?.totale;
      const targetDateInizio = data.pages[0]?.targetDateInizio;
      const dateInizio = data.pages[0]?.dateInizio;
      return {
        ...data,
        totale,
        targetDateInizio,
        dateInizio,
      };
    },
  });

  return query;
};

// -----------------------------------------------------------------------------

export type MeRequest = {
  COD_OP?: String | undefined;
};
export const useGetMeQuery = () => {
  const fetch = useFetch();

  return useCallback(
    (data: MeRequest, requestConfig?: RequestConfigType) => {
      return fetch(
        data.COD_OP
          ? `${API_URL}/v1/auth/me_by_cod_op?COD_OP=${data.COD_OP}`
          : `${API_URL}/v1/auth/me`,
        {
          method: "GET",
          ...requestConfig,
        }
      ).then(wrapperFetchJsonResponse<User>);
    },
    [fetch]
  );
};

// -----------------------------------------------------------------------------

export type EpsNestjsOrpEffCicliEsecChildPostRequest = {
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

export type EpsNestjsOrpEffCicliEsecChildPostResponse =
  EpsNestjsOrpEffCicliEsecChild;

export function usePostEpsNestjsOrpEffCicliEsecChildService() {
  const fetch = useFetch();

  return useCallback(
    (
      data: EpsNestjsOrpEffCicliEsecChildPostRequest,
      requestConfig?: RequestConfigType
    ) => {
      return fetch(`${API_URL}/v1/eps-nestjs-orp-eff-cicli-esec-children`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(
        wrapperFetchJsonResponse<EpsNestjsOrpEffCicliEsecChildPostResponse>
      );
    },
    [fetch]
  );
}
