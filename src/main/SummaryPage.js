import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Grid
} from "@material-ui/core";
import AudioCard from "./AudioCard";

class SummaryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastClips: ['AAAAAAAAAAAAAAAAAAAAAA', 'BBB', 'CCC', 'DDD', 'EEE', 'FFF', 'GGG', 'HHH'],
      lastScoredClips: ['AAA', 'BBB', 'CCC', 'DDD', 'EEE', 'FFF', 'GGG', 'HHH']
    }
  }

  render() {
    const { lastClips, lastScoredClips } = this.state;
    return (
      <Grid container className="summary-container" direction="column" alignItems="center">
        <Grid item>
          <h1>Summary Page</h1>
        </Grid>
        <Grid item>
          <Link to="/main/clip">Play game!</Link>
        </Grid>
        <h2>Your last 10 clips</h2>
        <Grid item className="card-list-container"> 
          <Grid container className="card-list" spacing={8}>
          {lastClips.map((clip, i) =>(
            <Grid item key={i}>
              <AudioCard clip={clip} />
            </Grid>
          ))}
          </Grid>
        </Grid>
        <h2>Your last scored clips</h2>
        <Grid item className="card-list-container"> 
          <Grid container className="card-list" spacing={8}>
          {lastScoredClips.map((clip, i) =>(
            <Grid item key={i}>
              <AudioCard clip={clip} />
            </Grid>
          ))}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default SummaryPage;