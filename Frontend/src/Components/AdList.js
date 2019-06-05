import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

class AdList extends Component {
  render() {
    const { ads = [] } = this.props;
    return (
      <List component="div" disablePadding>
        {ads.map(ad => {
          const { data } = ad;
          if (!data) {
            return null;
          }
          const { ad_id, temp_price, price_equation } = data;
          return (
            <ListItem button style={{ paddingLeft: '40px' }}>
              <ListItemText primary={ad_id} secondary={`Цена: ${temp_price} (уравнение ${price_equation}).`} />
            </ListItem>
          );
        })}
      </List>
    );
  }
}

export default AdList;