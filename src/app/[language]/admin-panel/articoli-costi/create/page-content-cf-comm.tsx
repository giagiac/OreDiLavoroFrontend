"use client";

import FormSelectExtendedInput from "@/components/form/select-extended/form-select-extended";
import { useSnackbar } from "@/hooks/use-snackbar";
import { usePatchArticoliCostiCfCommService } from "@/services/api/services/articoli-costi-cf-comm";
import { ArtAna } from "@/services/api/types/art-ana";
import {
  ArticoliCostiCfComm,
  TipoCosto,
} from "@/services/api/types/articoli-costi-cf-comm";
import { CfComm } from "@/services/api/types/cfComm";
import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { SortEnum } from "@/services/api/types/sort-type";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { useTranslation } from "@/services/i18n/client";
import useLeavePage from "@/services/leave-page/use-leave-page";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Fragment, useCallback, useMemo, useState } from "react";
import { FormProvider, useForm, useFormState } from "react-hook-form";
import * as yup from "yup";
import { EditArtAnaFormData } from "../edit-art";
import { useGetArtAnaQuery } from "../queries/queries-art-ana";

type ArtAnaKeys = keyof ArtAna;

const useValidationSchema = () => {
  // const { t } = useTranslation("admin-panel-users-create");

  return yup.object().shape({
    TIPO_COSTO: yup.string(),
    COD_ART: yup.string(),
    IN_GIORNATA: yup.string(),
    IN_GIORNATA_DOPO_21: yup.string(),
    PERNOTTO_FUORISEDE_ANDATA: yup.string(),
    PERNOTTO_FUORISEDE_RITORNO: yup.string(),
  });
};

export default function FormCreateEdit(props: { cfComm: CfComm }) {
  const [cfComm, setCfComm] = useState(props.cfComm);

  // const router = useRouter();
  const fetchPostArticoliCostiCfComm = usePatchArticoliCostiCfCommService();
  const { t } = useTranslation("admin-panel-users-create");

  const { enqueueSnackbar } = useSnackbar();

  const [othersFilters, setOthersFilters] = useState<Array<OthersFiltersItem>>(
    []
  );
  const [filters, setFilters] = useState<Array<FilterItem<ArtAna>>>(() => {
    return [];
  });

  const [{ order, orderBy }, setSort] = useState<{
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
    IN_GIORNATA: yup.object().shape({
      COD_ART: yup.string().notRequired(),
    }),
    IN_GIORNATA_DOPO_21: yup.object().shape({
      COD_ART: yup.string().notRequired(),
    }),
    PERNOTTO_FUORISEDE_ANDATA: yup.object().shape({
      COD_ART: yup.string().notRequired(),
    }),
    PERNOTTO_FUORISEDE_RITORNO: yup.object().shape({
      COD_ART: yup.string().notRequired(),
    }),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      IN_GIORNATA: {
        ...cfComm.articoliCostiCfComm?.find(
          (it) => it.TIPO_COSTO == "IN_GIORNATA"
        )?.artAna,
      },
      IN_GIORNATA_DOPO_21: {
        ...cfComm.articoliCostiCfComm?.find(
          (it) => it.TIPO_COSTO == "IN_GIORNATA_DOPO_21"
        )?.artAna,
      },
      PERNOTTO_FUORISEDE_ANDATA: {
        ...cfComm.articoliCostiCfComm?.find(
          (it) => it.TIPO_COSTO == "PERNOTTO_FUORISEDE_ANDATA"
        )?.artAna,
      },
      PERNOTTO_FUORISEDE_RITORNO: {
        ...cfComm.articoliCostiCfComm?.find(
          (it) => it.TIPO_COSTO == "PERNOTTO_FUORISEDE_RITORNO"
        )?.artAna,
      },
    },
  });

  const { handleSubmit, setError } = methods;

  const onChange = async (artAna: ArtAna, TIPO_COSTO: TipoCosto) => {
    const { data, status } = await fetchPostArticoliCostiCfComm({
      CF_COMM_ID: cfComm.CF_COMM_ID,
      data: {
        COD_ART: artAna.COD_ART,
        TIPO_COSTO,
        CF_COMM_ID: cfComm.CF_COMM_ID,
      },
    });
    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      // (Object.keys(data.errors) as Array<keyof EditArtAnaFormData>).forEach(
      //   (key) => {
      //     setError(key, {
      //       type: "manual",
      //       message: t(
      //         `admin-panel-users-create:inputs.${key}.validation.server.${data.errors[key]}`
      //       ),
      //     });
      //   }
      // );
      setError("IN_GIORNATA", {
        type: "manual",
        message: `Errore salvataggio dati...`,
      });
      return;
    }
    if (status === HTTP_CODES_ENUM.CREATED) {
      setCfComm((oldCfComm) => {
        let newArticoliCostiCfComm: Array<ArticoliCostiCfComm> = [];
        if (oldCfComm.articoliCostiCfComm != null) {
          newArticoliCostiCfComm = oldCfComm.articoliCostiCfComm.filter(
            (it) => it.TIPO_COSTO != data.TIPO_COSTO
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
  };

  const articoliEdit = [
    cfComm.articoliCostiCfComm?.find(
      (it) => it.TIPO_COSTO == "IN_GIORNATA"
    ) || { TIPO_COSTO: "IN_GIORNATA", id: 0, COD_ART: null, artAna: null },
    cfComm.articoliCostiCfComm?.find(
      (it) => it.TIPO_COSTO == "IN_GIORNATA_DOPO_21"
    ) || {
      TIPO_COSTO: "IN_GIORNATA_DOPO_21",
      id: 1,
      COD_ART: null,
      artAna: null,
    },
    cfComm.articoliCostiCfComm?.find(
      (it) => it.TIPO_COSTO == "PERNOTTO_FUORISEDE_ANDATA"
    ) || {
      TIPO_COSTO: "PERNOTTO_FUORISEDE_ANDATA",
      id: 2,
      COD_ART: null,
      artAna: null,
    },
    cfComm.articoliCostiCfComm?.find(
      (it) => it.TIPO_COSTO == "PERNOTTO_FUORISEDE_RITORNO"
    ) || {
      TIPO_COSTO: "PERNOTTO_FUORISEDE_RITORNO",
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
                  key={`${it.TIPO_COSTO + cfComm.CF_COMM_ID}`}
                  size={{ xs: 3 }}
                  padding={0.5}
                >
                  <FormSelectExtendedInput<EditArtAnaFormData, ArtAna>
                    name={`${it.TIPO_COSTO}`}
                    label={`${it.TIPO_COSTO}`}
                    options={result}
                    renderSelected={(option) => option.COD_ART}
                    renderOption={(option) =>
                      option.COD_ART != null
                        ? option.COD_ART + " " + option.DES_ART
                        : ""
                    }
                    keyExtractor={(option) => option.COD_ART}
                    isSearchable={true}
                    searchLabel="Search"
                    searchPlaceholder="Search options..."
                    search={
                      filters.find((it) => it.columnName == "COD_ART")?.value ||
                      ""
                    }
                    onSearchChange={(value) => {
                      setFilters([{ columnName: "COD_ART", value, id: 0 }]);
                    }}
                    onEndReached={handleScroll}
                    onChangeCallback={(artAna) =>
                      onChange(artAna, it.TIPO_COSTO)
                    }
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
  if (
    artAna != null &&
    artAna.artCosti?.length != null &&
    artAna.artCosti?.length > 0
  ) {
    return (
      <Stack direction="row" spacing={1}>
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
