import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import Dialog from "@material-ui/core/Dialog";
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class LoginWindow extends Component {
  constructor(props) {
    super(props);
    this.label = 'Пароль';
    this.text = 'Для доступа к контрольной панели, пожалуйста, введите свой пароль.';
  }

  handleSubmit = () => {
    const { setAppState, submitPassword } = this.props;
    setAppState({ logInWindow: false });
    submitPassword();
  };

  renderLoginButton = () => {
    const { appState: { values: { password } } } = this.props;
    return (
      <Button
        onClick={this.handleSubmit}
        disabled={!password}
        color="primary"
      >
        Войти
      </Button>
    );
  };

  handleChange = ({ target: { value } }) => {
    const { setAppState, appState: { values } } = this.props;
    setAppState({ values: { ...values, password: value } });
  };

  renderPasswordField = () => (
    <TextField
      onChange={this.handleChange}
      autoFocus
      margin="dense"
      id="passDialogue"
      label={this.label}
      type="password"
      fullWidth
    />
  );

  render() {
    const { appState: { logInWindow, values }, setAppState } = this.props;
    return (
      <Dialog open={logInWindow} onClose={() => setAppState({ logInWindow: false })} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Авторизация</DialogTitle>
        <DialogContent>
          <DialogContentText>{this.text}</DialogContentText>
          {this.renderPasswordField()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAppState({ logInWindow: false, values: { ...values, password: null } })} color="primary">
            Отмена
          </Button>
          {this.renderLoginButton()}
        </DialogActions>
      </Dialog>
    );
  }
}

export default LoginWindow;
