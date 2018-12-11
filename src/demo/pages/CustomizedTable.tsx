import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";

import * as React from "react";
import { IDataGridColumns } from '../../lib';
import DataGrid from "../../lib/DataGrid";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing.unit * 3,
      overflowX: "auto",
      width: "100%"
    },
    row: {
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.background.default
      }
    },
    table: {
      minWidth: 700
    }
  });

interface IProps extends WithStyles<typeof styles> {}

let id = 0;
function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  id += 1;
  return { id, name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9)
];

function CustomizedTable(props: IProps) {
  const {} = props;
  const columns: IDataGridColumns[] = [
    { id: "name", label: "Dessert (100g serving)", sortable: true },
    { id: "calories", numeric: true, label: "Calories (g)", sortable: true },
    { id: "fat", numeric: true, label: "Fat (g)", sortable: true },
    { id: "carbs", numeric: true, label: "Carbs (g)", sortable: true },
    {
      id: "protein",
      label: "Protein (g)",
      numeric: true,
      sortable: true
    }
  ];
  return <DataGrid columns={columns} key="id" rows={rows} />;
}

export default withStyles(styles)(CustomizedTable);
