import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core";
import LandingPage from "./landing/LandingPage";
import Footer from "./Footer";
import FaqPage from "./info/FaqPage";
import ContactPage from "./info/ContactPage";
import PrivacyPage from "./info/PrivacyPage";
import Header from "./Header";
import GamePage from "./main/GamePage";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#C6C6CE"
    },
    secondary: {
      main: "#A6A6B2"
    }
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: ""
    };
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Router>
          <div className="App">
            <Header />
            <main>
              <Route exact path="/" component={LandingPage} />
              <Route path="/info/faq" component={FaqPage} />
              <Route path="/info/contact" component={ContactPage} />
              <Route path="/info/privacy" component={PrivacyPage} />
              <Route path="/main/clip" component={GamePage} />
            </main>
            <Footer />
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
