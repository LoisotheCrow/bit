import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import Dialog from "@material-ui/core/Dialog";
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import API from '../services/API';

class ChangeWindow extends Component {
  constructor(props) {
    super(props);
    this.label = 'Новый лимит';
    this.text = 'Введите новый лимит для бота.';
    this.state = {
      newLimit: null,
    };
  }

  handleClose = () => this.setState({ newLimit: null }, () => {
    const { setAppState } = this.props;
    setAppState({ changeWindow: false, changeId: null });
  });

  handleSubmit = () => {
    const { update, appState: { changeId } } = this.props;
    const { newLimit } = this.state;
    if (changeId) {
      update(() => API.changeLimit(changeId, newLimit));
    }
    this.handleClose();
  };

  renderLoginButton = () => {
    const { newLimit } = this.state;
    return (
      <Button
        onClick={this.handleSubmit}
        disabled={!newLimit}
        color="primary"
      >
        Изменить
      </Button>
    );
  };

  handleChange = ({ target: { value } }) => {
    if (/^[0-9]*$/.test(value)) {
      this.setState({ newLimit: value });
    }
  };

  renderPasswordField = () => (
    <TextField
      onChange={this.handleChange}
      autoFocus
      margin="dense"
      id="changeDialogue"
      label={this.label}
      type="number"
      fullWidth
    />
  );

  render() {
    const { appState: { changeWindow }, setAppState } = this.props;
    return (
      <Dialog open={changeWindow} onClose={() => setAppState({ changeWindow: false })} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Изменить лимит</DialogTitle>
        <DialogContent>
          <DialogContentText>{this.text}</DialogContentText>
          {this.renderPasswordField()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAppState({ changeWindow: false })} color="primary">
            Отмена
          </Button>
          {this.renderLoginButton()}
        </DialogActions>
      </Dialog>
    );
  }
}

export default ChangeWindow;