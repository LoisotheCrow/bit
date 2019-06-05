import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

const Loader = ({ loading }) => loading ? (
  <div>
    <CircularProgress color="secondary" />
  </div>
) : null;

export default Loader;