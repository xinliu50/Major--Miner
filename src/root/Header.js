import React, { Component } from "react";
import {
  AppBar,
  Toolbar,
  ButtonBase
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
      score: null
    };
  }

  componentDidMount() {
    this.db = firebase.firestore();
    this.user = firebase.auth().currentUser;
   // this.userRef = this.db.collection('users').doc(this.user.uid);
    if (this.user) {
      //this.userRef = 
      this.db.collection('users').doc(this.user.uid).get().then(user => {
          this.setState({ score: user.data().score });
      });
    }
  }

  logout = () => {
    if (this.userDocListener) {
      this.userDocListener();
    }
    firebase.auth().signOut().then(() => {
      this.props.toggleAuth(false);
    }).catch(err => {
      console.log(err);
    })
    this.props.history.push('/');
    this.setState({ score: 0});
  }

  componentWillUnmount() {
    if (this.userDocListener) {
      this.userDocListener();
    }
  }

  render() {
  
    return (
      <AppBar position="sticky">
        <Toolbar>
          <div className="nav-container">
            <ButtonBase component={Link} to="/" className="nav-item"><b style={{ "fontSize": "1.5em" }}>Major Miner</b></ButtonBase>
            {/* <Link to="/" className="nav-item"><h2>Major Miner</h2></Link> */}
            {this.props.authenticated ? (
              <ButtonBase component={Link} to="/main/clip" className="nav-item">Game</ButtonBase>
            ) : ""}
            {this.props.authenticated ? (
              <ButtonBase component={Link} to="/info/leaders" className="nav-item">Leaders</ButtonBase>
             ) : ""} 
            <ButtonBase component={Link} to="/search" className="nav-item">Search</ButtonBase>
            {this.props.authenticated ? (
              <div className="account-button">
                <h4 style={{ "margin": "0 0.5em", "padding": "0 0.5em" }}>Score: {this.state.score}</h4>
                <AccountButton logout={this.logout} />
              </div>
            ) : (
              <div className="account-button">
                <LoginForm />
              </div>
            )}
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withRouter(Header);