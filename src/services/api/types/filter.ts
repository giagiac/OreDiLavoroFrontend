export type FilterItem<T> = {
  columnName: keyof T;
  value: string;
  id: number | null;
};

export type GenericFilterType<T> = {
  filters?: Array<FilterItem<T>>;
};

export type OthersFiltersItem = {
  key: string;
  value: string;
};
