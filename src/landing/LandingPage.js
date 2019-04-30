import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { Link } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

class LandingPage extends Component {
  render() {
    return (
      <Grid
        container
        className="home-container"
        direction="column"
        alignItems="center"
      >
        <Grid item>
          <h1 style={{ fontSize: "2.5em" }}>Major Miner</h1>
          <p style={{ fontSize: "1.25em" }}>A Sound Labeling Game</p>
        </Grid>
        <Grid item lg={6} md={8} sm={10}>
          <p>
            The goal of the game, besides just listening to interesting
            soundscapes, is to label them with <b>original</b>, yet <b>relevant</b> words and
            phrases that other players <b>agree with</b>. We're going to use your
            descriptions to teach our computers to recognize these same sounds
            in over 100,000 hours of recordings so that we can better understand
            the behavior of animals and how it is affected by human activity.
          </p>
        </Grid>
        {this.props.authenticated ? (
          <Grid item sm={8} md={8} lg={8} container justify="center" spacing={16}>
            <Grid item>
              <Link to="/main">Summary</Link>
            </Grid>
            <Grid item>
              <Link to="/main/clip">Play game!</Link>
            </Grid>
          </Grid>
        ) : (
          <Grid item sm={8} md={8} lg={8} container justify="center" spacing={16}>     
            <LoginForm />
            <RegisterForm />
          </Grid>
        )}
      </Grid>
    );
  }
}

export default LandingPage;
