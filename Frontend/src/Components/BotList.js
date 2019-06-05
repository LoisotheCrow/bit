import React, { Component } from 'react';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import BotIcon from '@material-ui/icons/Android';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import AdList from './AdList';
import BotInfo from './BotInfo';

class BotList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      id: null,
    };
  }

  toggleOpen = id => {
    const { open, id: lastId } = this.state;
    if (lastId === id) {
      this.setState({ open: !open });
    } else {
      this.setState({ id });
    }
  };

  renderBots = () => {
    const { bots = [], update, change } = this.props;
    const { open, id: openId } = this.state;
    return bots.map(bot => {
      const { id, ads, paused } = bot;
      if (!id) {
        return null;
      }
      return [
        <ListItem button onClick={() => this.toggleOpen(id)}>
          <ListItemIcon><BotIcon /></ListItemIcon>
          <ListItemText primary={id} />
          {paused ? <PauseIcon /> : <PlayIcon />}
          {open && openId === id ? <ExpandLess /> : <ExpandMore />}
        </ListItem>,
        <Collapse in={open && openId === id} timeout="auto" unmountOnExit>
          <BotInfo {...bot} update={update} change={change} />
          <AdList ads={ads} />
        </Collapse>
      ];
    });
  };

  render() {
    const { bots = [] } = this.props;
    return (
      <List
        component="nav"
        subheader={<ListSubheader component="div">Мои боты</ListSubheader>}
      >
        {bots.length > 0 ? this.renderBots() : null}
      </List>
    );
  }
}

export default BotList;