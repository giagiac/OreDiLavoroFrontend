import { TargaMezzi } from "@/services/api/types/targa-mezzi";
import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import { SortEnum } from "@/services/api/types/sort-type";

export type EpsNestjsTargaMezziFilterType = {
  filters?: Array<FilterItem<TargaMezzi>>;
};

export type EpsNestjsTargaMezziSortType = {
  orderBy: keyof TargaMezzi;
  order: SortEnum;
};

export type OthersFiltersType = {
  filters?: Array<OthersFiltersItem>;
};
