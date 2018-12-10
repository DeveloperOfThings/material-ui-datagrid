import Checkbox from "@material-ui/core/Checkbox";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Tooltip from "@material-ui/core/Tooltip";
import * as React from "react";

interface IProps {
  columns: IDataGridColumns[];
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<HTMLElement>, property: string) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: "asc" | "desc" | undefined;
  orderBy: string;
  rowCount: number;
  selectable?: boolean;
}

// interface IState {}

class DataGridHead extends React.Component<IProps> {
  constructor(public props: IProps) {
    super(props);
    this.state = {};
  }

  public render() {
    const {
      columns,
      numSelected,
      onSelectAllClick,
      order,
      orderBy,
      rowCount,
      selectable
    } = this.props;

    return (
      <TableHead>
        <TableRow>
          {selectable && (
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={numSelected === rowCount}
                onChange={onSelectAllClick}
              />
            </TableCell>
          )}
          {columns.map(row => {
            return (
              <TableCell
                key={row.id}
                numeric={row.numeric}
                padding={row.disablePadding ? "none" : "default"}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? "bottom-end" : "bottom-start"}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }

  private createSortHandler = ({id, sortable}: IDataGridColumns) => (event: React.MouseEvent<HTMLElement>) => {
    if (sortable) {
      this.props.onRequestSort(event, id);
    }
  };
}

export default DataGridHead;
