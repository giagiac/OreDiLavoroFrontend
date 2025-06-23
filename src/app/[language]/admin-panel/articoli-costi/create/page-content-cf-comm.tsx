"use client";

import FormSelectExtendedInput from "@/components/form/select-extended/form-select-extended";
import { useSnackbar } from "@/hooks/use-snackbar";
import { usePatchArticoliCostiCfCommService } from "@/services/api/services/articoli-costi-cf-comm";
import { ArtAna } from "@/services/api/types/art-ana";
import {
  ArticoliCostiCfComm,
  TipoTrasferta,
} from "@/services/api/types/articoli-costi-cf-comm";
import { CfComm } from "@/services/api/types/cfComm";
import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { SortEnum } from "@/services/api/types/sort-type";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { useTranslation } from "@/services/i18n/client";
import { yupResolver } from "@hookform/resolvers/yup";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Fragment, useCallback, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { EditArtAnaFormData } from "../edit-art";
import { useGetArtAnaQuery } from "../queries/queries-art-ana";

type ArtAnaKeys = keyof ArtAna;

const DEFAULT_START_FILTER = "PR14";

export default function FormCreateEdit(props: { cfComm: CfComm }) {
  const [cfComm, setCfComm] = useState(props.cfComm);

  // const router = useRouter();
  const fetchPostArticoliCostiCfComm = usePatchArticoliCostiCfCommService();
  const { t } = useTranslation("admin-panel-users-create");

  const { enqueueSnackbar } = useSnackbar();

  const [othersFilters] = useState<Array<OthersFiltersItem>>([]);
  const [filters, setFilters] = useState<Array<FilterItem<ArtAna>>>(() => {
    return [{ columnName: "COD_ART", value: DEFAULT_START_FILTER }];
  });

  const [{ order, orderBy }] = useState<{
    order: SortEnum;
    orderBy: ArtAnaKeys;
  }>({ order: SortEnum.ASC, orderBy: "COD_ART" });

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetArtAnaQuery({ sort: { order, orderBy }, filters, othersFilters });

  const handleScroll = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const result = useMemo(() => {
    const result =
      (data?.pages.flatMap((page) => page?.data) as ArtAna[]) ??
      ([] as ArtAna[]);

    return removeDuplicatesFromArrayObjects(result, "COD_ART");
  }, [data]);

  const schema = yup.object().shape({
    // hobbies: yup.array().of(
    //   yup.object().shape({
    //     name: yup.string().required('Hobby is required')
    //   })
    // ),
    in_giornata: yup.object().shape({
      COD_ART: yup.string().notRequired(),
    }),
    in_giornata_dopo_21: yup.object().shape({
      COD_ART: yup.string().notRequired(),
    }),
    fuori_sede_andata: yup.object().shape({
      COD_ART: yup.string().notRequired(),
    }),
    fuori_sede_ritorno_in_giornata: yup.object().shape({
      COD_ART: yup.string().notRequired(),
    }),
    fuori_sede_ritorno_dopo_21: yup.object().shape({
      COD_ART: yup.string().notRequired(),
    }),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      in_giornata: {
        ...cfComm.articoliCostiCfComm?.find(
          (it) => it.TIPO_TRASFERTA === "in_giornata"
        )?.artAna,
      },
      in_giornata_dopo_21: {
        ...cfComm.articoliCostiCfComm?.find(
          (it) => it.TIPO_TRASFERTA === "in_giornata_dopo_21"
        )?.artAna,
      },
      fuori_sede_andata: {
        ...cfComm.articoliCostiCfComm?.find(
          (it) => it.TIPO_TRASFERTA === "fuori_sede_andata"
        )?.artAna,
      },
      fuori_sede_ritorno_in_giornata: {
        ...cfComm.articoliCostiCfComm?.find(
          (it) => it.TIPO_TRASFERTA === "fuori_sede_ritorno_in_giornata"
        )?.artAna,
      },
      fuori_sede_ritorno_dopo_21: {
        ...cfComm.articoliCostiCfComm?.find(
          (it) => it.TIPO_TRASFERTA === "fuori_sede_ritorno_dopo_21"
        )?.artAna,
      },
    },
  });

  const { setError } = methods;

  const onChange = async (
    artAna: ArtAna | null,
    TIPO_TRASFERTA: TipoTrasferta
  ) => {
    if (cfComm !== null) {
      const { data, status } = await fetchPostArticoliCostiCfComm({
        CF_COMM_ID: cfComm.CF_COMM_ID,
        data: {
          COD_ART: artAna?.COD_ART || null,
          TIPO_TRASFERTA: TIPO_TRASFERTA,
          CF_COMM_ID: cfComm.CF_COMM_ID,
        },
      });
      if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
        setError("in_giornata", {
          type: "manual",
          message: `Errore salvataggio dati...`,
        });
        return;
      }
      if (status === HTTP_CODES_ENUM.CREATED) {
        setCfComm((oldCfComm) => {
          let newArticoliCostiCfComm: Array<ArticoliCostiCfComm> = [];
          if (
            oldCfComm.articoliCostiCfComm !== undefined &&
            oldCfComm.articoliCostiCfComm !== null
          ) {
            newArticoliCostiCfComm = oldCfComm.articoliCostiCfComm.filter(
              (it) => it.TIPO_TRASFERTA !== data.TIPO_TRASFERTA
            );
          }
          newArticoliCostiCfComm?.push(data);

          const newCfComm: CfComm = {
            ...cfComm,
            articoliCostiCfComm: newArticoliCostiCfComm,
          };

          return newCfComm;
        });
        enqueueSnackbar(
          t("admin-panel-articoli-costi:alerts.articolicosti.success"),
          {
            variant: "success",
          }
        );
      }
    }
  };

  const articoliEdit = [
    cfComm.articoliCostiCfComm?.find(
      (it) => it.TIPO_TRASFERTA === "in_giornata"
    ) || { TIPO_TRASFERTA: "in_giornata", COD_ART: null, artAna: null },
    cfComm.articoliCostiCfComm?.find(
      (it) => it.TIPO_TRASFERTA === "in_giornata_dopo_21"
    ) || {
      TIPO_TRASFERTA: "in_giornata_dopo_21",
      id: 1,
      COD_ART: null,
      artAna: null,
    },
    cfComm.articoliCostiCfComm?.find(
      (it) => it.TIPO_TRASFERTA === "fuori_sede_andata"
    ) || {
      TIPO_TRASFERTA: "fuori_sede_andata",
      id: 2,
      COD_ART: null,
      artAna: null,
    },
    cfComm.articoliCostiCfComm?.find(
      (it) => it.TIPO_TRASFERTA === "fuori_sede_ritorno_in_giornata"
    ) || {
      TIPO_TRASFERTA: "fuori_sede_ritorno_in_giornata",
      id: 3,
      COD_ART: null,
      artAna: null,
    },
    cfComm.articoliCostiCfComm?.find(
      (it) => it.TIPO_TRASFERTA === "fuori_sede_ritorno_dopo_21"
    ) || {
      TIPO_TRASFERTA: "fuori_sede_ritorno_dopo_21",
      id: 4,
      COD_ART: null,
      artAna: null,
    },
  ];

  return (
    <FormProvider {...methods}>
      <form>
        <Grid container>
          <Grid size={{ xs: 12 }}>
            <Grid container>
              {articoliEdit.map((it) => (
                <Grid
                  key={`${it.TIPO_TRASFERTA + cfComm.CF_COMM_ID}`}
                  size={{ xs: 3 }}
                  pr={0.1}
                >
                  <FormSelectExtendedInput<EditArtAnaFormData, ArtAna>
                    name={`${it.TIPO_TRASFERTA}`}
                    label={`${it.TIPO_TRASFERTA}`}
                    options={result}
                    renderSelected={(option) => option?.COD_ART ?? ""}
                    renderOption={(option) =>
                      option?.COD_ART
                        ? `${option.COD_ART} ${option.DES_ART ?? ""}`
                        : ""
                    }
                    keyExtractor={(option) => option?.COD_ART ?? ""}
                    isSearchable={true}
                    searchLabel="Search"
                    searchPlaceholder="Search options..."
                    search={
                      String(
                        filters.find(
                          (filter) => filter.columnName === "COD_ART"
                        )?.value
                      ) || ""
                    }
                    onSearchChange={(value) => {
                      setFilters([{ columnName: "COD_ART", value }]);
                    }}
                    onEndReached={handleScroll}
                    onChangeCallback={(artAna) => {
                      if (it.TIPO_TRASFERTA) {
                        onChange(artAna, it.TIPO_TRASFERTA);
                      }
                      // Consider handling deselection if needed
                    }}
                  />
                  <Label artAna={it.artAna} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
}

function Label(props: { artAna?: ArtAna | null }) {
  const { artAna } = props;
  if (artAna?.artCosti?.length) {
    return (
      <Stack direction="row" spacing={1}>
        {artAna.artCosti.map((it, index) => (
          <Fragment key={index}>
            <Typography
              fontSize={11}
              variant="subtitle1"
            >{`${it.COD_TIPO_COST}:${it.COSTO_ART}`}</Typography>
          </Fragment>
        ))}
      </Stack>
    );
  }
  return null; // Or return an empty Fragment or default content
}
