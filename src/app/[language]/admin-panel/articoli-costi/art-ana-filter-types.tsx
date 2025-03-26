import { ArtAna } from "@/services/api/types/art-ana";
import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import { SortEnum } from "@/services/api/types/sort-type";

export type ArtAnaFilterType = {
  filters?: Array<FilterItem<ArtAna>>;
};

export type ArtAnaSortType = {
  orderBy: keyof ArtAna;
  order: SortEnum;
};

export type OthersFiltersType = {
  filters?: Array<OthersFiltersItem>;
};
