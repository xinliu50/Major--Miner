import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Grid
} from "@material-ui/core";
import AudioCard from "../main/AudioCard";
import firebase from "../base";

class SearchResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      play: false
    }
  }
  async componentDidMount() {
    this.user = firebase.auth().currentUser;
    this.db = firebase.firestore();
    this.audioRef = this.db.collection('audios');
    this.userId = this.user.uid;
    this.userRef = this.db.collection('users').doc(this.userId);
  }
  togglePlay = play => {
    this.setState({ play });
  }
  render() {
    const {MyTag,tag,clipNumber,tagOrderArray} = this.props.location.state
    return (
      <Grid container className="summary-container" direction="column" alignItems="center">
        <Grid item>
          <h1>Search Result</h1>
        </Grid>
        <Grid item>
          <Link to="/search">Search more!</Link>
        </Grid>
        <Grid item>
          <Link to="/main/clip">Play game!</Link>
        </Grid>
    <h2>Here are {clipNumber} clips have been describe as {tag}</h2>
        <Grid item className="card-list-container"> 
          <Grid container className="card-list" spacing={8}>
          {tagOrderArray.map((clip, i) => (
            <Grid item key={clip.tag}>
              <AudioCard
                tag={tag}
                clip={MyTag[clip.tag].clip}
                url={MyTag[clip.tag].url}
                count={MyTag[clip.tag].count}
                togglePlay={this.togglePlay}
                fromSummary={false}
              />
            </Grid>
          ))}
          </Grid>
        </Grid>     
      </Grid>
    );
  }
}

export default SearchResult;