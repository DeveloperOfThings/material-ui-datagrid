interface IDataGridColumns {
  disablePadding?: boolean;
  id: string;
  label: string;
  numeric?: boolean;
  sortable?: boolean;
}

interface MapLike<T> {
    [key: string]: T;
}
