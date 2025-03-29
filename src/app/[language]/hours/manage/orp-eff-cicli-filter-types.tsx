import { OrpEffCicli } from "@/services/api/types/orp-eff-cicli";
import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import { SortEnum } from "@/services/api/types/sort-type";

export type OrpEffCicliFilterType = {
  filters?: Array<FilterItem<OrpEffCicli>>;
};

export type OrpEffCicliSortType = {
  orderBy: keyof OrpEffCicli;
  order: SortEnum;
};

export type OthersFiltersType = {
  filters?: Array<OthersFiltersItem>;
};
