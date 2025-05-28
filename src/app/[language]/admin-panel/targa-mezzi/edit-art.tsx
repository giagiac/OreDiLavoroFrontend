"use client";

import FormSelectExtendedInput from "@/components/form/select-extended/form-select-extended";
import { ArtAna } from "@/services/api/types/art-ana";
import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import { SortEnum } from "@/services/api/types/sort-type";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { useCallback, useMemo, useState } from "react";
import { useGetArtAnaQuery } from "./queries/queries-art-ana";

type ArtAnaKeys = keyof ArtAna;

export type EditArtAnaFormData = {
  COD_ART?: string | undefined;
};

function EditArt() {
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
      name={"COD_ART"}
      label="Seleziona un articolo"
      options={result}
      renderSelected={(option) => option.COD_ART}
      renderOption={(option) => option.COD_ART}
      keyExtractor={(option) => option.COD_ART}
      isSearchable={true}
      searchLabel="Search"
      searchPlaceholder="Search options..."
      search={
        String(filters.find((it) => it.columnName === "COD_ART")?.value) || ""
      }
      onSearchChange={(value) => {
        setFilters([{ columnName: "COD_ART", value }]);
      }}
      onEndReached={handleScroll}
      onChangeCallback={(value) => console.log(value)}
    />
  );
}

export default EditArt;
