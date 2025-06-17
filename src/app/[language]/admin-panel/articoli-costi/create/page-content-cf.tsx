"use client";

import FormSelectExtendedInput from "@/components/form/select-extended/form-select-extended";
import { useSnackbar } from "@/hooks/use-snackbar";
import { usePatchArticoliCostiCfService } from "@/services/api/services/articoli-costi-cf";
import { ArtAna } from "@/services/api/types/art-ana";
import {
  ArticoliCostiCf,
  TipoTrasferta,
} from "@/services/api/types/articoli-costi-cf";
import { Cf } from "@/services/api/types/cf";
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

function Label(props: { artAna?: ArtAna | null }) {
  const { artAna } = props;
  if (artAna?.artCosti && artAna.artCosti.length > 0) {
    return (
      <Stack direction="row" spacing={2}>
        {artAna.artCosti?.map((it, index) => (
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
}

// const useValidationSchema = () => {
//   // const { t } = useTranslation("admin-panel-users-create");

//   return yup.object().shape({
//     TIPO_TRASFERTA: yup.string(),
//     COD_ART: yup.string(),
//     in_giornata: yup.string(),
//     in_giornata_dopo_21: yup.string(),
//     fuori_sede_andata: yup.string(),
//     fuori_sede_ritorno: yup.string(),
//   });
// };

export default function FormCreateEdit(props: { cf: Cf }) {
  const [cf, setCf] = useState(props.cf);

  // const router = useRouter();
  const fetchPostArticoliCostiCf = usePatchArticoliCostiCfService();
  const { t } = useTranslation("admin-panel-users-create");
  // const validationSchema = useValidationSchema();

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
    fuori_sede_ritorno: yup.object().shape({
      COD_ART: yup.string().notRequired(),
    }),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      in_giornata: {
        ...cf.articoliCostiCf?.find((it) => it.TIPO_TRASFERTA === "in_giornata")
          ?.artAna,
      },
      in_giornata_dopo_21: {
        ...cf.articoliCostiCf?.find(
          (it) => it.TIPO_TRASFERTA === "in_giornata_dopo_21"
        )?.artAna,
      },
      fuori_sede_andata: {
        ...cf.articoliCostiCf?.find(
          (it) => it.TIPO_TRASFERTA === "fuori_sede_andata"
        )?.artAna,
      },
      fuori_sede_ritorno: {
        ...cf.articoliCostiCf?.find(
          (it) => it.TIPO_TRASFERTA === "fuori_sede_ritorno"
        )?.artAna,
      },
    },
  });

  const { setError } = methods;

  const onChange = async (
    artAna: ArtAna | null,
    TIPO_TRASFERTA: TipoTrasferta
  ) => {
    if (cf !== null) {
      const { data, status } = await fetchPostArticoliCostiCf({
        COD_CF: String(cf.COD_CF),
        data: {
          COD_ART: artAna?.COD_ART || null,
          TIPO_TRASFERTA: TIPO_TRASFERTA,
          COD_CF: String(cf.COD_CF),
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
        setCf((oldCf) => {
          let newArticoliCostiCf: Array<ArticoliCostiCf> = [];
          newArticoliCostiCf =
            oldCf.articoliCostiCf?.filter(
              (it) => it.TIPO_TRASFERTA !== data.TIPO_TRASFERTA
            ) ?? [];
          newArticoliCostiCf?.push(data);

          const newCfComm: Cf = {
            ...cf,
            articoliCostiCf: newArticoliCostiCf,
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

  // Array<ArticoliCostiCfComm>

  const articoliEdit = [
    cf.articoliCostiCf?.find((it) => it.TIPO_TRASFERTA === "in_giornata") || {
      TIPO_TRASFERTA: "in_giornata",
      id: 0,
      COD_ART: null,
      artAna: null,
    },
    cf.articoliCostiCf?.find(
      (it) => it.TIPO_TRASFERTA === "in_giornata_dopo_21"
    ) || {
      TIPO_TRASFERTA: "in_giornata_dopo_21",
      id: 1,
      COD_ART: null,
      artAna: null,
    },
    cf.articoliCostiCf?.find(
      (it) => it.TIPO_TRASFERTA === "fuori_sede_andata"
    ) || {
      TIPO_TRASFERTA: "fuori_sede_andata",
      id: 2,
      COD_ART: null,
      artAna: null,
    },
    cf.articoliCostiCf?.find(
      (it) => it.TIPO_TRASFERTA === "fuori_sede_ritorno"
    ) || {
      TIPO_TRASFERTA: "fuori_sede_ritorno",
      id: 3,
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
                  key={`${it.TIPO_TRASFERTA ?? ""}-${cf.COD_CF ?? ""}`}
                  size={{ xs: 3 }}
                  padding={0.5}
                >
                  <FormSelectExtendedInput<EditArtAnaFormData, ArtAna>
                    name={`${it.TIPO_TRASFERTA}`}
                    label={`${it.TIPO_TRASFERTA ?? ""}`}
                    options={result}
                    renderSelected={(option) => (option ? option.COD_ART : "")}
                    renderOption={(option) =>
                      option?.COD_ART !== undefined && option?.COD_ART !== null
                        ? `${option.COD_ART} ${option.DES_ART ?? ""}`
                        : ""
                    }
                    keyExtractor={(option) => option?.COD_ART ?? ""}
                    isSearchable={true}
                    searchLabel="Search"
                    searchPlaceholder="Search options..."
                    search={
                      filters.find((f) => f.columnName === "COD_ART")?.value ??
                      ""
                    }
                    onSearchChange={(value) => {
                      setFilters([{ columnName: "COD_ART", value }]);
                    }}
                    onEndReached={handleScroll}
                    onChangeCallback={(artAna) => {
                      if (it.TIPO_TRASFERTA) {
                        onChange(artAna, it.TIPO_TRASFERTA);
                      }
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
