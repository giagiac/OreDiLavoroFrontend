import { EpsNestjsOrpEffCicliEsec } from "@/services/api/types/eps-nestjs-orp-eff-cicli-esec";
import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import { SortEnum } from "@/services/api/types/sort-type";

export type EpsNestjsOrpEffCicliEsecFilterType = {
  filters?: Array<FilterItem<EpsNestjsOrpEffCicliEsec>>;
};

export type EpsNestjsOrpEffCicliEsecSortType = {
  orderBy: keyof EpsNestjsOrpEffCicliEsec;
  order: SortEnum;
};

export type OthersFiltersType = {
  filters?: Array<OthersFiltersItem>;
};