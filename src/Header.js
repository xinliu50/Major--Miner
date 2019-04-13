import React, { Component } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Grid
} from "@material-ui/core";
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Link } from "react-router-dom";
import firebase from "./base";
import LoginForm from "./landing/LoginForm";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null
    };
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  logout = () => {
    firebase.auth().signOut().then(() => {
      this.props.toggleAuth(false);
    }).catch(err => {
      console.log(err);
    })
    this.handleClose();
  }

  render() {
    const open = Boolean(this.state.anchorEl);
    return (
      <AppBar position="sticky">
        <Toolbar>
          <Grid container spacing={8} wrap="nowrap" alignItems="center">
            <Grid item lg={2} md={2} sm={3}><Link to="/"><h2>Major Miner</h2></Link></Grid>
          {this.props.authenticated ? (
            <Grid item lg={10} md={10} sm={9} container justify="flex-end" alignItems="center" spacing={16}>
              <Grid item lg={3} md={3} sm={4} xs={6}><h4>Score: XX</h4></Grid>
              <Grid item lg={3} md={3} sm={4} xs={6} className="account-button">
                <IconButton
                  aria-owns={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                    id="account-menu"
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{
                      vertical: 'center',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={open}
                    onClose={this.handleClose}
                  >
                  <MenuItem onClick={this.handleClose}>Change password</MenuItem>
                  <MenuItem onClick={this.logout}>Logout</MenuItem>
                </Menu>
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

export default Header;