"use client";

import FormSelectExtendedInput from "@/components/form/select-extended/form-select-extended";
import { ArticoliCostiCfComm } from "@/services/api/types/articoli-costi-cf-comm";
import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import { Operatori } from "@/services/api/types/operatori";
import { SortEnum } from "@/services/api/types/sort-type";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { useCallback, useMemo, useState } from "react";
import { useGetOperatoriQuery } from "./quieries/queries-operatori";
import { EditOperatoreFormData } from "./create-operatori/page-content";

type OperatoriKeys = keyof Operatori;

function EditOperatori(props: { onSubmit: (operatori: Operatori) => void }) {
  // const { articoliCostiCfComm } = props;

  const [othersFilters, setOthersFilters] = useState<Array<OthersFiltersItem>>(
    []
  );
  const [filters, setFilters] = useState<Array<FilterItem<Operatori>>>(() => {
    return [];
  });

  const [{ order, orderBy }, setSort] = useState<{
    order: SortEnum;
    orderBy: OperatoriKeys;
  }>({ order: SortEnum.ASC, orderBy: "NOME_OP" });

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetOperatoriQuery({ sort: { order, orderBy }, filters, othersFilters });

  const handleScroll = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const result = useMemo(() => {
    const result =
      (data?.pages.flatMap((page) => page?.data) as Operatori[]) ??
      ([] as Operatori[]);

    return removeDuplicatesFromArrayObjects(result, "COD_OP");
  }, [data]);

  return (
    <FormSelectExtendedInput<EditOperatoreFormData, Operatori>
      name={"operatori"}
      label="Seleziona un operatore"
      options={result}
      renderSelected={(option) => option.COD_OP}
      renderOption={(option) => `${option.NOME_OP} (${option.COD_OP})`}
      keyExtractor={(option) => option.COD_OP}
      isSearchable={true}
      searchLabel="Search"
      searchPlaceholder="Search options..."
      search={filters.find((it) => it.columnName == "NOME_OP")?.value || ""}
      onSearchChange={(value) => {
        setFilters([{ columnName: "NOME_OP", value }]);
      }}
      onEndReached={handleScroll}
      onChangeCallback={(value) => props.onSubmit(value)}
    />
  );
}

export default EditOperatori;
