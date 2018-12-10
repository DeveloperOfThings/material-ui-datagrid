import IconButton from "@material-ui/core/IconButton";
// import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import { lighten } from "@material-ui/core/styles/colorManipulator";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import Search from "@material-ui/icons/Search";
import classNames from "classnames";
import * as React from "react";
import { IMapLike } from '../index';

const styles = ({ palette, spacing }: Theme) =>
  createStyles({
    actions: {
      color: palette.text.secondary
    },
    highlight:
      palette.type === "light"
        ? {
            backgroundColor: lighten(palette.secondary.light, 0.85),
            color: palette.secondary.main
          }
        : {
            backgroundColor: palette.secondary.dark,
            color: palette.text.primary
          },
    root: {
      paddingRight: spacing.unit
    },
    spacer: {
      flex: "1 1 100%"
    },
    textField: {
      marginLeft: spacing.unit,
      marginRight: spacing.unit,
      width: 200
    },
    title: {
      flex: "0 0 auto"
    }
  });

interface IProps extends WithStyles<typeof styles> {
  filterable?: boolean;
  numSelected: number;
  onSearch: (query: string) => void;
  searchable?: boolean;
  searchTimeout?: number;
  title: string;
}

interface IState extends IMapLike<any> {
  query: string;
  searchTimeoutId?: number;
}

class DataGridToolbar extends React.Component<IProps, IState> {
  public static defaultProps: Partial<IProps> = {
    searchTimeout: 2000
  };
  constructor(props: IProps) {
    super(props);
    this.state = {
      query: ""
    };
  }

  public render() {
    const { classes, filterable, numSelected, searchable, title } = this.props;

    return (
      <Toolbar
        className={classNames(classes.root, {
          [classes.highlight]: numSelected > 0
        })}
      >
        <div className={classes.title}>
          {numSelected > 0 ? (
            <Typography color="inherit" variant="subheading">
              {numSelected} selected
            </Typography>
          ) : (
            <Typography variant="title" id="tableTitle">
              {title}
            </Typography>
          )}
        </div>
        <div className={classes.spacer} />
        <div className={classes.actions}>
          {searchable && (
            <TextField
              id="standard-search"
              label="Search"
              type="search"
              className={classes.textField}
              value={this.state.query}
              onChange={this.handleSearchQueryChange}
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Search"
                      onClick={this.handleClickSearch}
                    >
                      <Search />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          )}
          {numSelected > 0 ? (
            <Tooltip title="Delete">
              <IconButton aria-label="Delete">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ) : (
            filterable && (
              <Tooltip title="Filter list">
                <IconButton aria-label="Filter list">
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
            )
          )}
        </div>
      </Toolbar>
    );
  }

  // private handleChange = (prop: string) => (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   this.setState({ [prop]: event.target.value });
  // };

  private handleClickSearch = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { query } = this.state;
    this.handleSearch(query);
  };

  private handleSearch = (query: string) => {
    const { onSearch } = this.props;
    if (typeof onSearch === "function") {
      onSearch(query);
    }
  };

  private handleSearchQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { searchTimeout=2000 } = this.props;
    const query = event.target.value;
    if (searchTimeout > 0) {
      const { searchTimeoutId } = this.state;
      if (searchTimeoutId) {
        window.clearTimeout(searchTimeoutId);
      }

      const timeoutId = window.setTimeout(() => {
        this.handleSearch(query);
      }, searchTimeout);
      this.setState({ query, searchTimeoutId: timeoutId });
    } else {
      this.setState({ query });
    }
  };
}

export default withStyles(styles)(DataGridToolbar);
