import AppBar from "@material-ui/core/AppBar";
import Badge from "@material-ui/core/Badge";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import MenuIcon from "@material-ui/icons/Menu";
import NotificationsIcon from "@material-ui/icons/Notifications";

import classNames from "classnames";
import { History } from "history";
// import * as PropTypes from "prop-types";
import * as React from "react";
import { Route, withRouter } from "react-router-dom";

import { MainListItems } from "./listItems";
import CustomizedTable from "./pages/CustomizedTable";
import EnhancedTable from "./pages/EnhancedTable";
import GithubRepositoryTable from "./pages/GithubRepositoryTable";
import SimpleTable from "./pages/SimpleTable";
import SpanningTable from "./pages/SpanningTable";

const drawerWidth = 240;

const styles = (theme: Theme) =>
  createStyles({
    appBar: {
      transition: theme.transitions.create(["width", "margin"], {
        duration: theme.transitions.duration.leavingScreen,
        easing: theme.transitions.easing.sharp
      }),
      zIndex: theme.zIndex.drawer + 1
    },
    appBarShift: {
      marginLeft: drawerWidth,
      transition: theme.transitions.create(["width", "margin"], {
        duration: theme.transitions.duration.enteringScreen,
        easing: theme.transitions.easing.sharp
      }),
      width: `calc(100% - ${drawerWidth}px)`
    },
    appBarSpacer: theme.mixins.toolbar,
    chartContainer: {
      marginLeft: -22
    },
    content: {
      flexGrow: 1,
      height: "100vh",
      overflow: "auto",
      padding: theme.spacing.unit * 3
    },
    drawerPaper: {
      position: "relative",
      transition: theme.transitions.create("width", {
        duration: theme.transitions.duration.enteringScreen,
        easing: theme.transitions.easing.sharp
      }),
      whiteSpace: "nowrap",
      width: drawerWidth
    },
    drawerPaperClose: {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        duration: theme.transitions.duration.leavingScreen,
        easing: theme.transitions.easing.sharp
      }),
      width: theme.spacing.unit * 7,
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing.unit * 9
      }
    },
    h5: {
      marginBottom: theme.spacing.unit * 2
    },
    menuButton: {
      marginLeft: 12,
      marginRight: 36
    },
    menuButtonHidden: {
      display: "none"
    },
    root: {
      display: "flex"
    },
    tableContainer: {
      height: 320
    },
    title: {
      flexGrow: 1
    },
    toolbar: {
      paddingRight: 24 // keep right padding when drawer closed
    },
    toolbarIcon: {
      alignItems: "center",
      display: "flex",
      justifyContent: "flex-end",
      padding: "0 8px",
      ...theme.mixins.toolbar
    }
  });

interface IProps extends WithStyles<typeof styles> {
  history: History;
  location: any;
  match: any;
}

interface IState {
  open: boolean;
}

class Dashboard extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      open: true
    };
  }

  public render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="absolute"
          className={classNames(
            classes.appBar,
            this.state.open && classes.appBarShift
          )}
        >
          <Toolbar
            disableGutters={!this.state.open}
            className={classes.toolbar}
          >
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(
                classes.menuButton,
                this.state.open && classes.menuButtonHidden
              )}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap={true}
              className={classes.title}
            >
              Dashboard
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(
              classes.drawerPaper,
              !this.state.open && classes.drawerPaperClose
            )
          }}
          open={this.state.open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>
            <MainListItems onMenuItemClick={this.handleMenuItemClick} />
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Typography variant="h4" gutterBottom={true} component="h2">
            Table Demo
          </Typography>
          <div className={classes.tableContainer}>
            <Route exact={true} path="/" component={SimpleTable} />
            <Route
              exact={true}
              path="/enhanced-table"
              component={EnhancedTable}
            />
            <Route
              exact={true}
              path="/customized-table"
              component={CustomizedTable}
            />
            <Route
              exact={true}
              path="/spanning-table"
              component={SpanningTable}
            />
            <Route
              exact={true}
              path="/api-integration"
              component={GithubRepositoryTable}
            />
          </div>
        </main>
      </div>
    );
  }

  private handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  private handleDrawerClose = () => {
    this.setState({ open: false });
  };

  private handleMenuItemClick = (itemId: string) => {
    const { history } = this.props;
    switch (itemId) {
      case "simple":
        history.push("/");
        break;
      case "enhanced":
        history.push("/enhanced-table");
        break;
      case "customized":
        history.push("/customized-table");
        break;
      case "spanning":
        history.push("/spanning-table");
        break;
      case "api":
        history.push("/api-integration");
        break;

      default:
        history.push("/");
        break;
    }
  };
}

export default withRouter(withStyles(styles)(Dashboard));
