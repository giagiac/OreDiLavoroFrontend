export type FilterItem<T> = {
  columnName: keyof T;
  value: string;
};

export type GenericFilterType<T> = {
  filters?: Array<FilterItem<T>>;
};

export type OthersFiltersItem = {
  key: string;
  value: string;
};
