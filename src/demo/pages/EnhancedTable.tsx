import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";

import * as React from "react";
import DataGrid, { PaginationState } from "../../lib/DataGrid";

let counter = 0;
function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  counter += 1;
  return { id: counter, name, calories, fat, carbs, protein };
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing.unit * 3,
      width: "100%"
    },
    table: {
      minWidth: 1020
    },
    tableWrapper: {
      overflowX: "auto"
    }
  });

interface IProps extends WithStyles<typeof styles> {}

class EnhancedTable extends React.Component<IProps> {
  public state = {
    data: [
      createData("Cupcake", 305, 3.7, 67, 4.3),
      createData("Donut", 452, 25.0, 51, 4.9),
      createData("Eclair", 262, 16.0, 24, 6.0),
      createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
      createData("Gingerbread", 356, 16.0, 49, 3.9),
      createData("Honeycomb", 408, 3.2, 87, 6.5),
      createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
      createData("Jelly Bean", 375, 0.0, 94, 0.0),
      createData("KitKat", 518, 26.0, 65, 7.0),
      createData("Lollipop", 392, 0.2, 98, 0.0),
      createData("Marshmallow", 318, 0, 81, 2.0),
      createData("Nougat", 360, 19.0, 9, 37.0),
      createData("Oreo", 437, 18.0, 63, 4.0)
    ],
    order: "asc",
    orderBy: "calories",
    page: 0,
    rowsPerPage: 5,
    selected: []
  };

  public render() {
    const {} = this.props;
    const { data, rowsPerPage } = this.state;
    const columns: IDataGridColumns[] = [
      {
        id: "name",
        label: "Dessert (100g serving)",
        numeric: true,
        sortable: true
      },
      { id: "calories", label: "Calories (g)", numeric: true, sortable: true },
      { id: "fat", label: "Fat (g)", numeric: true, sortable: true },
      { id: "carbs", label: "Carbs (g)", numeric: true, sortable: true },
      {
        id: "protein",
        label: "Protein (g)",
        numeric: true,
        sortable: true
      }
    ];

    return (
      <DataGrid
        columns={columns}
        key="id"
        onCurrentPageChange={this.handleChangePage}
        onPageSizeChange={this.handleChangeRowsPerPage}
        onRowSelect={this.handleRowSelect}
        onSortingChange={this.handleRequestSort}
        pagination={true}
        pageSize={rowsPerPage}
        rows={data}
        searchable={true}
        title="Nutrition"
        totalCount={15}
      />
    );
  }

  private handleChangePage = ({ page }: PaginationState) => {
    this.setState({ page });
  };

  private handleChangeRowsPerPage = ({ rowsPerPage }: PaginationState) => {
    this.setState({ rowsPerPage });
  };

  private handleRequestSort = ({ order, orderBy }: PaginationState) => {
    this.setState({ order, orderBy });
  };

  private handleRowSelect = ({ id }: MapLike<any>) => {
    this.setState({ selected: [id] });
  };
}

export default withStyles(styles)(EnhancedTable);
