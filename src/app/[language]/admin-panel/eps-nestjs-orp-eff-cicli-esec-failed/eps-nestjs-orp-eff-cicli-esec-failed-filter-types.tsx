import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import { EpsNestjsOrpEffCicliEsecFailed } from "@/services/api/types/eps-nestjs-orp-eff-cicli-esec-failed";
import { SortEnum } from "@/services/api/types/sort-type";

export type EpsNestjsOrpEffCicliEsecFailedFilterType = {
  filters?: Array<FilterItem<EpsNestjsOrpEffCicliEsecFailed>>;
};

export type EpsNestjsOrpEffCicliEsecFailedSortType = {
  orderBy: keyof EpsNestjsOrpEffCicliEsecFailed;
  order: SortEnum;
};

export type OthersFiltersType = {
  filters?: Array<OthersFiltersItem>;
};
