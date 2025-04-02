"use client";

import FormSelectExtendedInput from "@/components/form/select-extended/form-select-extended";
import { useSnackbar } from "@/hooks/use-snackbar";
import { usePatchArticoliCostiCfService } from "@/services/api/services/articoli-costi-cf";
import { ArtAna } from "@/services/api/types/art-ana";
import {
  ArticoliCostiCf,
  TipoCosto,
} from "@/services/api/types/articoli-costi-cf";
import { Cf } from "@/services/api/types/cf";
import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { SortEnum } from "@/services/api/types/sort-type";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { useTranslation } from "@/services/i18n/client";
import useLeavePage from "@/services/leave-page/use-leave-page";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stack, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
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

function CreateUserFormActions() {
  const { t } = useTranslation("admin-panel-users-create");
  const { isSubmitting, isDirty } = useFormState();
  useLeavePage(isDirty);

  return (
    <Button
      variant="contained"
      color="primary"
      type="submit"
      disabled={isSubmitting}
    >
      {t("admin-panel-users-create:actions.submit")}
    </Button>
  );
}

export default function FormCreateEdit(props: { cf: Cf }) {
  const [cf, setCf] = useState(props.cf);

  // const router = useRouter();
  const fetchPostArticoliCostiCf = usePatchArticoliCostiCfService();
  const { t } = useTranslation("admin-panel-users-create");
  const validationSchema = useValidationSchema();

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
        ...cf.articoliCostiCf?.find((it) => it.TIPO_COSTO == "IN_GIORNATA")
          ?.artAna,
      },
      IN_GIORNATA_DOPO_21: {
        ...cf.articoliCostiCf?.find(
          (it) => it.TIPO_COSTO == "IN_GIORNATA_DOPO_21"
        )?.artAna,
      },
      PERNOTTO_FUORISEDE_ANDATA: {
        ...cf.articoliCostiCf?.find(
          (it) => it.TIPO_COSTO == "PERNOTTO_FUORISEDE_ANDATA"
        )?.artAna,
      },
      PERNOTTO_FUORISEDE_RITORNO: {
        ...cf.articoliCostiCf?.find(
          (it) => it.TIPO_COSTO == "PERNOTTO_FUORISEDE_RITORNO"
        )?.artAna,
      },
    },
  });

  const { handleSubmit, setError, reset } = methods;

  const onChange = async (artAna: ArtAna, TIPO_COSTO: TipoCosto) => {
    const { data, status } = await fetchPostArticoliCostiCf({
      COD_CF: cf.COD_CF,
      data: {
        COD_ART: artAna.COD_ART,
        TIPO_COSTO,
        COD_CF: cf.COD_CF,
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
      setCf((oldCf) => {
        let newArticoliCostiCf: Array<ArticoliCostiCf> = [];
        if (oldCf.articoliCostiCf != null) {
          newArticoliCostiCf = oldCf.articoliCostiCf.filter(
            (it) => it.TIPO_COSTO != data.TIPO_COSTO
          );
        }
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
      // router.push("/admin-panel/users");
    }
  };

  // Array<ArticoliCostiCfComm>

  const articoliEdit = [
    cf.articoliCostiCf?.find((it) => it.TIPO_COSTO == "IN_GIORNATA") || {
      TIPO_COSTO: "IN_GIORNATA",
      id: 0,
      COD_ART: null,
      artAna: null,
    },
    cf.articoliCostiCf?.find(
      (it) => it.TIPO_COSTO == "IN_GIORNATA_DOPO_21"
    ) || {
      TIPO_COSTO: "IN_GIORNATA_DOPO_21",
      id: 1,
      COD_ART: null,
      artAna: null,
    },
    cf.articoliCostiCf?.find(
      (it) => it.TIPO_COSTO == "PERNOTTO_FUORISEDE_ANDATA"
    ) || {
      TIPO_COSTO: "PERNOTTO_FUORISEDE_ANDATA",
      id: 2,
      COD_ART: null,
      artAna: null,
    },
    cf.articoliCostiCf?.find(
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
                  key={`${it.TIPO_COSTO + cf.COD_CF}`}
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
                      setFilters([
                        { columnName: "COD_ART", value, id: Math.random() },
                      ]);
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
