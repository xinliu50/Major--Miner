import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import app from "./base";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core";
import LandingPage from "./landing/LandingPage";
import Footer from "./Footer";
import FaqPage from "./info/FaqPage";
import ContactPage from "./info/ContactPage";
import PrivacyPage from "./info/PrivacyPage";
import Header from "./Header";
import PrivateRoute from "./main";
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
    this.listener = app.auth().onAuthStateChanged(user => {
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

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Router>
          <div className="App">
            <Header authenticated={this.state.authenticated} />
            <main>
              <Route exact path="/" component={LandingPage} />
              <Route path="/info/faq" component={FaqPage} />
              <Route path="/info/contact" component={ContactPage} />
              <Route path="/info/privacy" component={PrivacyPage} />
              <PrivateRoute exact path="/main" component={SummaryPage} authenticated={this.state.authenticated} />
              <PrivateRoute path="/main/clip" component={GamePage} authenticated={this.state.authenticated} />
            </main>
            <Footer />
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
