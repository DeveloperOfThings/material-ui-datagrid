import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination, {
  TablePaginationBaseProps
} from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import * as React from "react";

import { IDataGridColumns, IMapLike } from '../index';
import DataGridHead from "./DataGridHead";
import DataGridToolbar from "./DataGridToolbar";

// Theme-dependent styles
const styles = ({ spacing }: Theme) =>
  createStyles({
    root: {
      marginTop: spacing.unit * 3,
      width: "100%"
    },
    table: {
      minWidth: 1020
    },
    tableWrapper: {
      overflowX: "auto"
    }
  });

export type PaginationState = Pick<
  IState & IProps,
  "order" | "orderBy" | "page" | "rowsPerPage" | "loading" | "pagination"
>;

interface IProps extends WithStyles<typeof styles> {
  columns: IDataGridColumns[];
  DataGridActionsComponent?: React.ReactType<TablePaginationBaseProps>;
  filterable?: boolean;
  key?: string | number;
  loading?: boolean;
  nestedKey?: boolean;
  nesting?: boolean;
  numSelected?: number;
  onCurrentPageChange?: (
    {
      page,
      ...paginationState
    }: PaginationState
  ) => void;
  onPageSizeChange?: (
    {
      rowsPerPage,
      ...paginationState
    }: PaginationState
  ) => void;
  onRowSelect?: (selectedRow: IMapLike<any>) => void;
  onSearch?: (query: string) => void;
  onSortingChange?: (
    {
      order,
      orderBy,
      ...sortingState
    }: PaginationState
  ) => void;
  pagination?: boolean;
  pageSize?: number;
  remote?: boolean;
  rows: Array<IMapLike<any>>;
  rowsPerPageOptions?: number[];
  searchable?: boolean;
  selectable?: boolean;
  title: string;
  toolbar?: boolean;
  totalCount?: number;
}

interface IState {
  data: Array<IMapLike<any>>;
  filteredData?: Array<IMapLike<any>>;
  order: "asc" | "desc" | undefined;
  orderBy: string;
  page: number;
  paginatedData?: Array<IMapLike<any>>;
  rows: Array<IMapLike<any>>;
  rowsPerPage: number;
  selected: Array<number | string>;
}

class DataGrid extends React.Component<IProps, IState> {
  public static defaultProps: Partial<IProps> = {
    columns: [],
    filterable: false,
    loading: false,
    nestedKey: false,
    nesting: false,
    numSelected: 0,
    pageSize: 10,
    pagination: false,
    remote: false,
    rows: [],
    searchable: false,
    selectable: false,
    toolbar: true,
    totalCount: 0
  };

  public static getDerivedStateFromProps(props: IProps, state: IState) {
    if (props.rows !== state.rows) {
      return DataGrid.transformData(props, state);
    }
    return null;
  }

  private static getPaginatedData({
    data,
    page,
    pagination,
    remote,
    rowsPerPage
  }: Pick<
    IProps & IState,
    "data" | "page" | "pagination" | "remote" | "rowsPerPage"
  >) {
    return pagination
      ? remote
        ? data
        : data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : data;
  }

  private static transformData(props: IProps, state: IState) {
    const { columns, key = "id", nestedKey, rows } = props;
    let data;
    if (nestedKey) {
      data = rows.map(row => {
        const trow: IMapLike<any> = { [key]: row[key] };
        for (const tcol of columns) {
          trow[tcol.id] = tcol.id.split(".").reduce((o, i) => o[i], row);
        }
        return trow;
      });
    } else {
      data = rows;
    }
    return this.transformState({ data }, props, state);
  }

  private static transformState(
    { data, order, orderBy, page, rowsPerPage }: Partial<IState>,
    props: IProps,
    state: IState
  ) {
    const { loading, pagination } = props;
    data = data || state.data;
    page = page || state.page;
    rowsPerPage = rowsPerPage || state.rowsPerPage;
    if (!loading) {
      const sortedData = stableSort(
        data,
        getSorting(order, orderBy || state.orderBy)
      );
      return {
        data: sortedData,
        paginatedData: this.getPaginatedData({
          data: sortedData,
          page,
          pagination,
          remote: props.remote,
          rowsPerPage
        })
      };
    }
    return {
      data,
      paginatedData: this.getPaginatedData({
        data,
        page,
        pagination,
        remote: props.remote,
        rowsPerPage
      })
    };
  }

  constructor(public props: IProps) {
    super(props);
    const { pageSize } = props;
    this.state = {
      data: [],
      order: "asc",
      orderBy: "",
      page: 0,
      rows: [],
      rowsPerPage: pageSize || 10,
      selected: []
    };
  }

  public componentDidMount() {
    DataGrid.transformData(this.props, this.state);
  }

  public render() {
    const {
      columns,
      classes,
      DataGridActionsComponent,
      filterable,
      key = "id",
      pagination,
      rowsPerPageOptions,
      searchable,
      selectable,
      title,
      toolbar,
      totalCount
    } = this.props;
    const {
      data,
      filteredData,
      order,
      orderBy,
      paginatedData,
      selected,
      rowsPerPage,
      page
    } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, (totalCount || data.length) - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        {toolbar && (
          <DataGridToolbar
            filterable={filterable}
            numSelected={selected.length}
            onSearch={this.handleSearch}
            title={title}
            searchable={searchable}
          />
        )}
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <DataGridHead
              columns={columns}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
              selectable={selectable}
            />
            <TableBody>
              {(paginatedData || filteredData || data).map(n => {
                const isSelected = this.isSelected(n[key]);
                return (
                  <TableRow
                    hover={true}
                    onClick={this.createRowClickHandler(n)}
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={-1}
                    key={n[key]}
                    selected={isSelected}
                  >
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} />
                      </TableCell>
                    )}
                    {columns.map(col => {
                      return (
                        <TableCell key={col.id} numeric={col.numeric}>
                          {n[col.id]}
                        </TableCell>
                      );
                    }, this)}
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={columns.length} />
                </TableRow>
              )}
            </TableBody>
            {pagination && (
              <TableFooter>
                <TableRow>
                  <TablePagination
                    colSpan={columns.length}
                    count={totalCount || data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{
                      "aria-label": "Previous Page"
                    }}
                    nextIconButtonProps={{
                      "aria-label": "Next Page"
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    rowsPerPageOptions={rowsPerPageOptions}
                    ActionsComponent={DataGridActionsComponent}
                  />
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </div>
      </Paper>
    );
  }

  private createRowClickHandler = (selectedRow: IMapLike<any>) => (
    event: React.MouseEvent<HTMLTableRowElement>
  ) => {
    const { key = "id", selectable } = this.props;
    if (selectable) {
      const id = selectedRow[key];
      if (typeof id !== "number" && typeof id !== "string") {
        event.stopPropagation();
        return;
      }
      const { selected } = this.state;
      const selectedIndex = selected.indexOf(id);
      let newSelected: Array<number | string> = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        );
      }

      this.setState({ selected: newSelected });
    }
    const { onRowSelect } = this.props;
    if (typeof onRowSelect === "function") {
      onRowSelect(selectedRow);
    }
  };

  private handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement>,
    page: number
  ) => {
    const { loading, onCurrentPageChange, pagination } = this.props;
    const { order, orderBy, rowsPerPage } = this.state;
    this.setState({ page });
    const { data, paginatedData } = DataGrid.transformState(
      { page },
      this.props,
      this.state
    );
    this.setState({ data, page, paginatedData });
    if (typeof onCurrentPageChange === "function") {
      onCurrentPageChange({
        loading,
        order,
        orderBy,
        page,
        pagination,
        rowsPerPage
      });
    }
  };

  private handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { loading, onPageSizeChange, pagination } = this.props;
    const { order, orderBy, page } = this.state;
    const rowsPerPage = parseInt(event.target.value, 10);
    const { data, paginatedData } = DataGrid.transformState(
      { page },
      this.props,
      this.state
    );
    this.setState({ data, rowsPerPage, paginatedData });
    if (typeof onPageSizeChange === "function") {
      onPageSizeChange({
        loading,
        order,
        orderBy,
        page,
        pagination,
        rowsPerPage
      });
    }
  };

  private handleRequestSort = (
    event: React.MouseEvent<HTMLElement>,
    property: string
  ) => {
    const { loading, onSortingChange, pagination } = this.props;
    const { page, rowsPerPage } = this.state;
    const orderBy = property;
    let order: "asc" | "desc" | undefined = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }
    const { data, paginatedData } = DataGrid.transformState(
      { page },
      this.props,
      this.state
    );
    this.setState({ data, order, orderBy, paginatedData });
    if (typeof onSortingChange === "function") {
      onSortingChange({
        loading,
        order,
        orderBy,
        page,
        pagination,
        rowsPerPage
      });
    }
  };

  private handleSearch = (query: string) => {
    const { pagination, remote } = this.props;
    if (!remote) {
      const pattern = new RegExp(query, "i");
      const { data, page, rowsPerPage } = this.state;
      const filteredData = data.filter(item =>
        pattern.test(Object.values(item).join(","))
      );
      const paginatedData = DataGrid.getPaginatedData({
        data: filteredData,
        page,
        pagination,
        remote,
        rowsPerPage
      });
      this.setState({ filteredData, paginatedData });
    }

    const { onSearch } = this.props;
    if (typeof onSearch === "function") {
      onSearch(query);
    }
  };

  private handleSelectAllClick = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      this.setState((state: IState) => ({
        selected: state.data.map(n => n.id)
      }));
      return;
    }
    this.setState({ selected: [] });
  };

  private isSelected = (id: number | string) =>
    this.state.selected.indexOf(id) !== -1;
}

function stableSort(array: any[], callback: (a: any[], b: any[]) => number) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = callback(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function desc(a: any[], b: any[], orderBy: string) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getSorting(order: "asc" | "desc" | undefined, orderBy: string) {
  return order === "desc"
    ? (a: any[], b: any[]) => desc(a, b, orderBy)
    : (a: any[], b: any[]) => -desc(a, b, orderBy);
}

export default withStyles(styles)(DataGrid);
