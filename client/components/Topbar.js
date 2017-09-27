import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { withRouter, Link } from 'react-router-dom';
import { logout } from '../store';
import { AppBar, Toolbar, Typography, Button, IconButton, MenuIcon } from 'material-ui';

const styles = (theme) => ({
  flex: {
    flex: 1,
  },
  topbar: {
    height: '5em',
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
});

class Topbar extends Component {
  render() {
    const classes = this.props.classes;
    const { children, handleClick, isLoggedIn } = this.props;
    return (
      <AppBar position="absolute">
        <Toolbar elevation={0} className={classes.topbar}>
          <Typography type="title" color="inherit" className={classes.flex}>
            getaway
          </Typography>
          <Button color="contrast">Login</Button>
        </Toolbar>
      </AppBar>
    );
  }
}

const mapState = (state) => {
  return {
    isLoggedIn: !!state.user.id,
  };
};

const mapDispatch = (dispatch) => {
  return {
    handleClick() {
      dispatch(logout());
    },
  };
};

export default withRouter(connect(mapState, mapDispatch)(withStyles(styles)(Topbar)));
