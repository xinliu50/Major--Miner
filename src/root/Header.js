import React, { Component } from "react";
import {
  AppBar,
  Toolbar,
  Grid
} from "@material-ui/core";
import { Link, withRouter } from "react-router-dom";
import firebase from "../base";
import LoginForm from "../landing/LoginForm";
import AccountButton from "./AccountButton";

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
    if (this.user) {
      this.userRef = this.db.collection('users').doc(this.user.uid);
    
      this.userDocListener = this.userRef.onSnapshot(user => {
        this.setState({ score: user.data().score });
      });
    }
  }

  logout = () => {
    firebase.auth().signOut().then(() => {
      this.props.toggleAuth(false);
    }).catch(err => {
      console.log(err);
    })
    this.props.history.push('/');
  }

  componentWillUnmount() {
    this.userDocListener();
  }

  render() {
    return (
      <AppBar position="sticky">
        <Toolbar>
          <Grid container spacing={8} wrap="nowrap" alignItems="center">
            <Grid item lg={2} md={2} sm={3}><Link to="/"><h2>Major Miner</h2></Link></Grid>
            {this.props.authenticated ? (
              <Grid item lg={1} md={1} sm={1}><Link to="/main/clip">Game</Link></Grid>
            ) : ""}
            <Grid item lg={1} md={1} sm={1}><Link to="/info/leaders">Leaders</Link></Grid>
            <Grid item lg={1} md={1} sm={1}><Link to="/search">Search</Link></Grid>
          {this.props.authenticated ? (
            <Grid item lg={8} md={8} sm={7} container justify="flex-end" alignItems="center" spacing={8}>
              <Grid item lg={6} md={6} sm={4} xs={6}><h4>Score: {this.state.score}</h4></Grid>
              <Grid item lg={6} md={6} sm={4} xs={6} className="account-button">
                <AccountButton logout={this.logout} />
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