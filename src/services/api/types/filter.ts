export type FilterItem<T> = {
  columnName: keyof T;
  value: string;
};

export type OthersFiltersItem = {
  key: string;
  value: string;
};
