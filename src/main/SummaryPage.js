import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Grid
} from "@material-ui/core";
import AudioCard from "./AudioCard";
import firebase from "../base";

class SummaryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clipHistory: {},
      play: false,
      lastClips: ['AAAAAAAAAAAAAAAAAAAAAA', 'BBB', 'CCC', 'DDD', 'EEE', 'FFF', 'GGG', 'HHH'],
      lastScoredClips: ['AAA', 'BBB', 'CCC', 'DDD', 'EEE', 'FFF', 'GGG', 'HHH']
    }
  }

  async componentDidMount() {
    this.user = firebase.auth().currentUser;
    this.db = firebase.firestore();
    this.audioRef = this.db.collection('audios');
    this.userRef = this.db.collection('users').doc(this.user.uid);

    const clipHistorySnapshot = await this.userRef.collection('clipHistory').orderBy('createdAt').limit(10).get();
    const clipHistory = {};
    clipHistorySnapshot.forEach(clip => {
      clipHistory[clip.id] = { score: clip.data().score };
      this.audioRef.doc(clip.id).get().then(audio => {
        clipHistory[clip.id].title = audio.data().Title;
        clipHistory[clip.id].url = audio.data().Url;
        this.setState({ clipHistory });
      })
    });
  }

  togglePlay = play => {
    this.setState({ play });
  }

  render() {
    const { lastClips, lastScoredClips, clipHistory } = this.state;
    console.log('current state of play: ', this.state.play);
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
          {Object.keys(clipHistory).map((clip, i) => (
            <Grid item key={clip}>
              <AudioCard
                url={clipHistory[clip].url}
                clip={clipHistory[clip].title}
                togglePlay={this.togglePlay}
              />
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