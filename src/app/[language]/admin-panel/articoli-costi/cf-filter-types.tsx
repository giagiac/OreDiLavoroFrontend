import { Cf } from "@/services/api/types/cf";
import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import { SortEnum } from "@/services/api/types/sort-type";

export type CfFilterType = {
  filters?: Array<FilterItem<Cf>>;
};

export type CfSortType = {
  orderBy: keyof Cf;
  order: SortEnum;
};

export type OthersFiltersType = {
  filters?: Array<OthersFiltersItem>;
};
