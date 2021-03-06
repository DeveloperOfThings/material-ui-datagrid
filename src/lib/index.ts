export { default as DataGrid, PaginationState } from "./DataGrid";

export interface IDataGridColumns {
  disablePadding?: boolean;
  id: string;
  label: string;
  numeric?: boolean;
  sortable?: boolean;
}

export interface IMapLike<T> {
    [key: string]: T;
}