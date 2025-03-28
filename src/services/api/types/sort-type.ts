export enum SortEnum {
  ASC = "asc",
  DESC = "desc",
}

export type SortGeneric<T> = {
  orderBy: keyof T;
  order: SortEnum;
};