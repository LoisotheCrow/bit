import React, { Component } from 'react';
import ErrorIcon from '@material-ui/icons/Error';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import red from '@material-ui/core/colors/red';
import SnackbarContent from '@material-ui/core/SnackbarContent';

class ErrorSnackbar extends Component {
  render() {
    const { onClose, message, open } = this.props;
    return (
      <Snackbar
        open={open}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        autoHideDuration={6000}
        onClose={onClose}
      >
        <SnackbarContent
          style={{ backgroundColor: red[600] }}
          aria-describedby="client-snackbar"
          message={
            <span id="client-snackbar">
              <ErrorIcon />
              {message}
            </span>
          }
          action={[
            <IconButton key="close" aria-label="Close" color="inherit" onClick={onClose}>
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </Snackbar>
    );
  }
}

export default ErrorSnackbar;
