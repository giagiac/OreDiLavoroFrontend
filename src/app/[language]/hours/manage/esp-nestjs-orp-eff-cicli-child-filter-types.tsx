import { EpsNestjsOrpEffCicliEsecChild } from "@/services/api/types/eps-nestjs-orp-eff-cicli-esec-child";
import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import { SortEnum } from "@/services/api/types/sort-type";

export type EpsNestjsOrpEffCicliEsecChildFilterType = {
  filters?: Array<FilterItem<EpsNestjsOrpEffCicliEsecChild>>;
};

export type EpsNestjsOrpEffCicliEsecChildSortType = {
  orderBy: keyof EpsNestjsOrpEffCicliEsecChild;
  order: SortEnum;
};

export type OthersFiltersType = {
  filters?: Array<OthersFiltersItem>;
};
