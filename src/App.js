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
import Footer from "./root/Footer";
import FaqPage from "./info/FaqPage";
import ContactPage from "./info/ContactPage";
import PrivacyPage from "./info/PrivacyPage";
import Header from "./root/Header";
import NewGamePage from "./main/NewGamePage";
import SummaryPage from "./main/SummaryPage";
import LeadersPage from "./info/LeadersPage";
import SearchPage from "./search/SearchPage";
import SearchResult from "./search/SearchResult";

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
      <MuiThemeProvider theme={theme} >
        <Router basename="/majorminergame.github.io"> 
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
              <Route path="/info/leaders" component={LeadersPage} />
              <Route path="/seachresult" component={SearchResult} />
              <PrivateRoute
                exact
                path="/main"
                component={SummaryPage}
                authenticated={this.state.authenticated}
              />
              <PrivateRoute
                exact
                path="/main/clip"
                component={NewGamePage}
                authenticated={this.state.authenticated}
              />
              <PrivateRoute
                path="/search"
                component={SearchPage}
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