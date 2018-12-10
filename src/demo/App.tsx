import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";

import * as React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import Layout from "./Layout";
import withRoot from "./withRoot";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      paddingTop: theme.spacing.unit * 20,
      textAlign: "center"
    }
  });

// interface IState {}

class App extends React.Component<WithStyles<typeof styles>> {
  public render() {
    return (
      <Router>
        <Layout />
      </Router>
    );
  }
}

export default withRoot(withStyles(styles)(App));
