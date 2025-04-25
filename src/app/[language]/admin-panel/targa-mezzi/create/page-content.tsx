"use client";

import FormSelectExtendedInput from "@/components/form/select-extended/form-select-extended";
import { useSnackbar } from "@/hooks/use-snackbar";
import { usePatchTargaMezziService } from "@/services/api/services/targa-mezzi";
import { ArtAna } from "@/services/api/types/art-ana";
import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { SortEnum } from "@/services/api/types/sort-type";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { EditArtAnaFormData } from "../edit-art";
import { useGetArtAnaQuery } from "../queries/queries-art-ana";

type ArtAnaKeys = keyof ArtAna;

// const useValidationSchema = () => {
//   // const { t } = useTranslation("admin-panel-users-create");

//   return yup.object().shape({
//     targaMezzi: yup.object().shape({
//       COD_ART: yup.string().notRequired(),
//     }),
//   });
// };

// function CreateUserFormActions() {
//   const { t } = useTranslation("admin-panel-users-create");
//   const { isSubmitting, isDirty } = useFormState();
//   useLeavePage(isDirty);

//   return (
//     <Button
//       variant="contained"
//       color="primary"
//       type="submit"
//       disabled={isSubmitting}
//     >
//       {t("admin-panel-users-create:actions.submit")}
//     </Button>
//   );
// }

export default function FormCreateEdit({
  onChangeCallback,
}: {
  onChangeCallback: (artAna: ArtAna) => void;
}) {
  const fetchPostTargaMezzi = usePatchTargaMezziService();

  const { enqueueSnackbar } = useSnackbar();

  const [othersFilters] = useState<Array<OthersFiltersItem>>([]);
  const [filters, setFilters] = useState<Array<FilterItem<ArtAna>>>(() => {
    return [];
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
    targaMezzi: yup.object().shape({
      COD_ART: yup.string().notRequired(),
    }),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      targaMezzi: {
        COD_ART: "",
      },
    },
  });

  const { setError } = methods;

  const onChange = async (artAna: ArtAna) => {
    const { status } = await fetchPostTargaMezzi({
      COD_ART: artAna.COD_ART,
      data: {
        COD_ART: artAna.COD_ART,
      },
    });
    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      setError("targaMezzi", {
        type: "manual",
        message: `Errore salvataggio dati...`,
      });
      return;
    }
    if (status === HTTP_CODES_ENUM.OK) {
      enqueueSnackbar("Articolo inserito correttamente", {
        variant: "success",
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <form>
        <FormSelectExtendedInput<EditArtAnaFormData, ArtAna>
          name={`COD_ART`}
          label={`Targa Mezzo`}
          options={result}
          renderSelected={(option) => option.COD_ART}
          renderOption={(option) =>
            option?.COD_ART !== null
              ? option.COD_ART + " " + option.DES_ART
              : ""
          }
          keyExtractor={(option) => option.COD_ART}
          isSearchable={true}
          searchLabel="Search"
          searchPlaceholder="Search options..."
          search={
            filters.find((it) => it.columnName === "COD_ART")?.value || ""
          }
          onSearchChange={(value) => {
            setFilters([{ columnName: "COD_ART", value }]);
          }}
          onEndReached={handleScroll}
          onChangeCallback={async (artAna) => {
            const result = await onChange(artAna);
            console.log(result);
            onChangeCallback(artAna);
          }}
        />
      </form>
    </FormProvider>
  );
}
