import React, { Component } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  Grid
} from "@material-ui/core";
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Link, withRouter } from "react-router-dom";
import firebase from "./base";
import LoginForm from "./landing/LoginForm";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      score: 0
    };
  }

  componentDidMount() {
    this.db = firebase.firestore();
    this.user = firebase.auth().currentUser;
    this.userRef = this.db.collection('users').doc(this.user.uid);

    this.userDocListener = this.userRef.onSnapshot(user => {
      this.setState({ score: user.data().score });
    })
  }

  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleClose = event => {
    // if (this.props.authenticated && this.anchorEl.contains(event.target)) {
    //   return;
    // }

    this.setState({ open: false });
  };

  logout = () => {
    firebase.auth().signOut().then(() => {
      this.props.toggleAuth(false);
    }).catch(err => {
      console.log(err);
    })
    this.props.history.push('/');
    this.handleClose();
  }

  componentWillUnmount() {
    this.userDocListener();
  }

  render() {
    const { open } = this.state;
    return (
      <AppBar position="sticky">
        <Toolbar>
          <Grid container spacing={8} wrap="nowrap" alignItems="center">
            <Grid item lg={2} md={2} sm={3}><Link to="/"><h2>Major Miner</h2></Link></Grid>
          {this.props.authenticated ? (
            <Grid item lg={10} md={10} sm={9} container justify="flex-end" alignItems="center" spacing={16}>
              <Grid item lg={3} md={3} sm={4} xs={6}><h4>Score: {this.state.score}</h4></Grid>
              <Grid item lg={3} md={3} sm={4} xs={6} className="account-button">
                <IconButton
                  buttonRef={node => {
                    this.anchorEl = node;
                  }}
                  aria-owns={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  onClick={this.handleToggle}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Popper open={open} anchorEl={this.anchorEl} placement="bottom-end" transition disablePortal>
                  {({ TransitionProps }) => (
                    <Grow
                      {...TransitionProps}
                    >
                      <Paper>
                        <ClickAwayListener onClickAway={this.handleClose}>
                          <MenuList>
                            <MenuItem onClick={this.handleClose}><Link to="/main">Summary</Link></MenuItem>
                            <MenuItem onClick={this.handleClose}>Change password</MenuItem>
                            <MenuItem onClick={this.logout}>Logout</MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </Grid>
            </Grid>
          ) : (
            <Grid item className="account-button">
              {/* <Button color="inherit">Login</Button> */}
              <LoginForm />
            </Grid>
          )}
          </Grid>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withRouter(Header);