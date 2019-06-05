import React, { Component } from 'react';
import SuccessIcon from '@material-ui/icons/CheckCircle';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import green from '@material-ui/core/colors/green';
import SnackbarContent from '@material-ui/core/SnackbarContent';

class SuccessSnackbar extends Component {
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
          style={{ backgroundColor: green[600] }}
          aria-describedby="client-snackbar"
          message={
            <span id="client-snackbar">
              <SuccessIcon />
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

export default SuccessSnackbar;