import { CfComm } from "@/services/api/types/cfComm";
import { SortEnum } from "@/services/api/types/sort-type";
import { FilterItem as FilterCfComm } from "./page-content-cf-comm";

export type CfCommFilterType = {
  filters?: Array<FilterCfComm>;
};

export type CfCommSortType = {
  orderBy: keyof CfComm;
  order: SortEnum;
};
