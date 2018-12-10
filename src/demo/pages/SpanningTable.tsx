import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";

import * as React from "react";
import { IDataGridColumns } from '../../index';
import DataGrid from "../../lib/DataGrid";

// const TAX_RATE = 0.07;

const styles = (theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing.unit * 3,
      overflowX: "auto",
      width: "100%"
    },
    table: {
      minWidth: 700
    }
  });

interface IProps extends WithStyles<typeof styles> {}

const rows = [
  ["Paperclips (Box)", 100, 1.15],
  ["Paper (Case)", 10, 45.99],
  ["Waste Basket", 2, 17.99]
].map((row: [string, number, number], id) => createRow(id, ...row));

// const invoiceSubtotal = subtotal(rows);
// const invoiceTaxes = TAX_RATE * invoiceSubtotal;

function SpanningTable(props: IProps) {
  const {} = props;
  const columns: IDataGridColumns[] = [
    { id: "desc", label: "Desc", sortable: true },
    { id: "qty", numeric: true, label: "Qty.", sortable: true },
    { id: "unit", numeric: true, label: "@", sortable: true },
    { id: "price", numeric: true, label: "Price", sortable: true }
  ];
  return <DataGrid columns={columns} key="id" rows={rows} />;
}

function priceRow(qty: number, unit: number) {
  return qty * unit;
}

function createRow(id: number, desc: string, qty: number, unit: number) {
  const price = priceRow(qty, unit);
  return { id, desc, qty, unit, price };
}

// function subtotal(items: typeof rows) {
//   return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
// }

export default withStyles(styles)(SpanningTable);
