import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Loader from './Loader';
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

const styles = {
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
};

class AppBarCustom extends Component {
  renderLoginButton = () => {
    const { appState: { loggedIn, logInWindow }, setAppState } = this.props;
    if (!loggedIn && !logInWindow) {
      return (
        <Button
          onClick={() => setAppState({ logInWindow: true })}
          color="inherit"
        >
          Войти
        </Button>
      );
    }
    return null;
  };

  renderLogoutButton = () => {
    const { logout, appState: { loggedIn } } = this.props;
    if (loggedIn) {
      return (
        <Button
          onClick={logout}
          color="inherit"
        >
          Выйти
        </Button>
      );
    }
    return null;
  };

  render() {
    const { classes: { root, grow }, appState: { loading } } = this.props;
    return (
      <div className={root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit" className={grow}>
              Контрольная панель
            </Typography>
            {this.renderLoginButton()}
            {this.renderLogoutButton()}
            <Loader loading={loading} />
          </Toolbar>
        </AppBar>
      </div>
    );
  };
}



export default withStyles(styles)(AppBarCustom);
