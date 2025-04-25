"use client";

import FormSelectExtendedInput from "@/components/form/select-extended/form-select-extended";
import { ArtAna } from "@/services/api/types/art-ana";
import {
  ArticoliCostiCfComm,
  TipoTrasferta,
} from "@/services/api/types/articoli-costi-cf-comm";
import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import { SortEnum } from "@/services/api/types/sort-type";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { useCallback, useMemo, useState } from "react";
import { useGetArtAnaQuery } from "./queries/queries-art-ana";

type ArtAnaKeys = keyof ArtAna;

export type EditArtAnaFormData = {
  COD_ART?: string | undefined;
  TIPO_TRASFERTA?: TipoTrasferta | string | undefined;

  in_giornata?: string | undefined;
  in_giornata_dopo_21?: string | undefined;
  fuori_sede_andata?: string | undefined;
  fuori_sede_ritorno?: string | undefined;
};

function EditArt(props: {
  articoliCostiCfComm: ArticoliCostiCfComm;
  onSubmit: () => void;
}) {
  const { articoliCostiCfComm } = props;

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

  return (
    <FormSelectExtendedInput<EditArtAnaFormData, ArtAna>
      // defaultValue={result.find(it=>it.COD_ART == articoliCostiCfComm.COD_ART)?.COD_ART}
      name={articoliCostiCfComm.TIPO_TRASFERTA}
      label="Seleziona un articolo"
      options={result}
      renderSelected={(option) => option.COD_ART}
      renderOption={(option) => option.COD_ART}
      keyExtractor={(option) => option.COD_ART}
      isSearchable={true}
      searchLabel="Search"
      searchPlaceholder="Search options..."
      search={filters.find((it) => it.columnName === "COD_ART")?.value || ""}
      onSearchChange={(value) => {
        setFilters([{ columnName: "COD_ART", value }]);
      }}
      onEndReached={handleScroll}
      onChangeCallback={(value) => console.log(value)}
    />
  );
}

export default EditArt;

{
  /* <Test1<
        { artAna: ArticoliCostiCfComm },
        Pick<ArticoliCostiCfComm, "COD_ART">
      >
        name="artAna"
        testId="artAna"
        options={result}
        keyValue="COD_ART"
        label={""}
        renderOption={function (
          option: Pick<ArtCosti, "COD_ART">
        ): React.ReactNode {
          return option.COD_ART;
        }}
      /> */
}

{
  /* <FormSelectInput<{ artAna: ArtAna }, ArtAna, "artAna">
        size="small"
        label={""}
        keyValue={"COD_ART"}
        options={result}
        defaultValue={result[0]}
        renderOption={function (option: ArtAna): React.ReactNode {
          return option.COD_ART;
        }}
        name={"artAna"}
      /> */
}

{
  /* <FormSelectInput<EditArtAnaFormData, Pick<ArtAna, "COD_ART">>
        name="COD_ART"
        testId="role"
        label={articoliCostiCfComm.COD_ART}
        options={result}
        keyValue="COD_ART"
        renderOption={(option) => option.COD_ART}
      /> */
}
