import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import firebase from "./base";
import {
  MuiThemeProvider,
  createMuiTheme,
  CircularProgress
} from "@material-ui/core";
import LandingPage from "./landing/LandingPage";
import Footer from "./Footer";
import FaqPage from "./info/FaqPage";
import ContactPage from "./info/ContactPage";
import PrivacyPage from "./info/PrivacyPage";
import Header from "./Header";
import GamePage from "./main/GamePage";
import SummaryPage from "./main/SummaryPage";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#C6C6CE"
    },
    secondary: {
      main: "#A6A6B2"
    }
  },
  typography: {
    useNextVariants: true
  }
});

function PrivateRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authenticated === true ? (
          <Component {...props} {...rest} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      user: null,
      loading: true
    };
  }

  componentDidMount() {
    this.listener = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          authenticated: true,
          user: user,
          loading: false
        });
      } else {
        this.setState({
          authenticated: false,
          user: null,
          loading: false
        });
      }
    });
  }

  componentWillUnmount() {
    this.listener();
  }

  toggleAuth = auth => {
    this.setState({ authenticated: auth });
  };

  render() {
    if (this.state.loading) {
      return (
        <MuiThemeProvider theme={theme}>
          <div className="loading-container">
            <CircularProgress size={100} thickness={3.6} />
          </div>
        </MuiThemeProvider>
      );
    }
    return (
      <MuiThemeProvider theme={theme}>
        <Router>
          <div className="App">
            <Header
              authenticated={this.state.authenticated}
              toggleAuth={this.toggleAuth}
            />
            <main>
              <Route
                exact
                path="/"
                render={props => (
                  <LandingPage
                    {...props}
                    authenticated={this.state.authenticated}
                  />
                )}
              />
              <Route path="/info/faq" component={FaqPage} />
              <Route path="/info/contact" component={ContactPage} />
              <Route path="/info/privacy" component={PrivacyPage} />
              <PrivateRoute
                exact
                path="/main"
                component={SummaryPage}
                authenticated={this.state.authenticated}
              />
              <PrivateRoute
                path="/main/clip"
                component={GamePage}
                authenticated={this.state.authenticated}
              />
            </main>
            <Footer />
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
