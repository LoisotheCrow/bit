import React, { Component } from "react";
import ReactDOM from "react-dom";
import AppBar from "./Components/AppBar";
import LoginWindow from "./Components/LoginWindow";
import ErrorSnackbar from './Components/ErrorSnackbar';
import SuccessSnackbar from './Components/SuccessSnackbar';
import BotList from './Components/BotList';
import ChangeWindow from './Components/ChangeWindow';
import API from './services/API';
import "./styles.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      logInWindow: false,
      changeId: null,
      changeWindow: false,
      loading: false,
      errorSnackbar: false,
      successSnackbar: false,
      values: {
        password: null,
      },
      data: {
        bots: [],
      },
    };
  }

  submitPassword = async () => {
    const { values: { password }, values } = this.state;
    this.setState({ loading: true, values: { ...values, password: null } }, async () => {
      const authorized = await API.authorize(password);
      this.setState({ loading: false, loggedIn: authorized }, async () => {
        if (authorized) {
          this.setState({ successSnackbar: true, bots: await API.getBots() });
        } else {
          this.setState({ errorSnackbar: true });
        }
      });
    });
  };

  updateBots = async updater => {
    this.setState({ loading: true }, async () => {
      if (updater) {
        await updater();
      }
      const bots = await API.getBots();
      this.setState({ loading: false, bots });
    });
  };

  logout = () => {
    const { values } = this.state;
    this.setState({ values: { ...values, password: null }, loggedIn: false }, () => {
      API.logout();
    });
  };

  render() {
    const { errorSnackbar, successSnackbar, loggedIn, bots } = this.state;
    return (
      <div>
        <AppBar
          appState={this.state}
          logout={this.logout}
          setAppState={state => this.setState(state)}
        />
        <LoginWindow
          appState={this.state}
          submitPassword={this.submitPassword}
          setAppState={state => this.setState(state)}
        />
        <ErrorSnackbar
          message="Авторизация не удалась"
          open={errorSnackbar}
          onClose={() => this.setState({ errorSnackbar: false })}
        />
        <SuccessSnackbar
          message="Авторизация успешна"
          open={successSnackbar}
          onClose={() => this.setState({ successSnackbar: false })}
        />
        <ChangeWindow
          appState={this.state}
          update={this.updateBots}
          setAppState={state => this.setState(state)}
        />
        {loggedIn && <BotList bots={bots} update={this.updateBots} change={id => { if (id) { this.setState({ changeId: id, changeWindow: true }) } }} />}
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);