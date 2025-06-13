"use client";

import FormSelectExtendedInput from "@/components/form/select-extended/form-select-extended";
import { Cf } from "@/services/api/types/cf";
import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import { SortEnum } from "@/services/api/types/sort-type";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { useCallback, useMemo, useState } from "react";
import { EditCfFormData } from "./create-cf-origin-default/page-content";
import { useGetCfQuery } from "./quieries/queries-cf";

type CfKeys = keyof Cf;

function EditCf(props: { onSubmit: (cf: Cf | null) => void }) {
  // const { articoliCostiCfComm } = props;

  const [othersFilters] = useState<Array<OthersFiltersItem>>([]);
  const [filters, setFilters] = useState<Array<FilterItem<Cf>>>(() => {
    return [];
  });

  const [{ order, orderBy }] = useState<{
    order: SortEnum;
    orderBy: CfKeys;
  }>({ order: SortEnum.ASC, orderBy: "RAG_SOC_CF" });

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetCfQuery({ sort: { order, orderBy }, filters, othersFilters });

  const handleScroll = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const result = useMemo(() => {
    const result =
      (data?.pages.flatMap((page) => page?.data) as Cf[]) ?? ([] as Cf[]);

    return removeDuplicatesFromArrayObjects(result, "COD_CF");
  }, [data]);

  return (
    <FormSelectExtendedInput<EditCfFormData, Cf>
      name={"cf"}
      label="Seleziona un cliente origine"
      options={result}
      renderSelected={(option) => option.COD_CF}
      renderOption={(option) => `${option.RAG_SOC_CF} (${option.COD_CF})`}
      keyExtractor={(option) => option.COD_CF}
      isSearchable={true}
      searchLabel="Search"
      searchPlaceholder="Search options..."
      search={filters.find((it) => it.columnName === "RAG_SOC_CF")?.value || ""}
      onSearchChange={(value) => {
        setFilters([{ columnName: "RAG_SOC_CF", value }]);
      }}
      onEndReached={handleScroll}
      onChangeCallback={(value) => props.onSubmit(value)}
    />
  );
}

export default EditCf;
