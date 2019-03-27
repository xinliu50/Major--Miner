import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { Link } from "react-router-dom";

class Footer extends Component {
  render() {
    return (
      <Grid container className="footer" justify="center" spacing="8">
        <Grid item>
          <Link to="/">Home</Link>
        </Grid>
        <Grid item>
          <Link to="/info/faq">FAQ</Link>
        </Grid>
        <Grid item>
          <Link to="/info/contact">Contact us</Link>
        </Grid>
        <Grid item>
          <Link to="/info/privacy">Privacy policy</Link>
        </Grid>
      </Grid>
    );
  }
}

export default Footer;
