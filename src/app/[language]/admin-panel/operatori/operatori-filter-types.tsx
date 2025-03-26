import { Operatori } from "@/services/api/types/operatori";
import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import { SortEnum } from "@/services/api/types/sort-type";

export type OperatoriFilterType = {
  filters?: Array<FilterItem<Operatori>>;
};

export type OperatoriSortType = {
  orderBy: keyof Operatori;
  order: SortEnum;
};

export type OthersFiltersType = {
  filters?: Array<OthersFiltersItem>;
};
