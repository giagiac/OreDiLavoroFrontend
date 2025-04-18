import { CfComm } from "@/services/api/types/cfComm";
import { FilterItem } from "@/services/api/types/filter";
import { SortEnum } from "@/services/api/types/sort-type";

export type CfCommFilterType = {
  filters?: Array<FilterItem<CfComm>>;
};

export type CfCommSortType = {
  orderBy: keyof CfComm;
  order: SortEnum;
};
