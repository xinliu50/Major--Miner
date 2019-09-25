import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Grid
} from "@material-ui/core";
import AudioCard from "./AudioCard";
import firebase from "../base";
//TODO: load tags from DB
class SummaryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clipHistory: {},
      scoredClipHistory: {},
      play: false
    }
  }

  async componentDidMount() {
    this.user = firebase.auth().currentUser;
    this.db = firebase.firestore();
    this.audioRef = this.db.collection('audios');
    this.userId = this.user.uid;
    this.userRef = this.db.collection('users').doc(this.userId);
    const clipHistorySnapshot = await this.userRef.collection('clipHistory').orderBy('lastUpdatedAt').limit(10).get();
    const clipHistory = {};
    var tempTag = [];
    var tempTag1 = [];
   for (const clip of clipHistorySnapshot.docs){
      clipHistory[clip.id] = { score: clip.data().score };
     /* var audio = await this.audioRef.doc(clip.id).get();
      clipHistory[clip.id].title = audio.data().Title;
      clipHistory[clip.id].url = audio.data().Url;
      clipHistory[clip.id].id = clip.id;*/
      var audio = this.audioRef.doc(clip.id).get();
      
      tempTag = [];
      tempTag1 = [];
      
      /*var tagsSnapshot = await this.audioRef.doc(clip.id).collection('users').doc(this.userId).get();
      tempTag = tagsSnapshot.data().tags;
      clipHistory[clip.id].TAG = tempTag.join(", ");

      var otherTagSnapshot = await this.audioRef.doc(clip.id).collection('tags').get();
      for(const tag of otherTagSnapshot.docs){
         if(!tempTag.includes(tag.id)){
          tempTag1.push(tag.id);
         }
      }
        clipHistory[clip.id].other = tempTag1.join(", ");*/
      var tagsSnapshot = this.audioRef.doc(clip.id).collection('users').doc(this.userId).get();
      var otherTagSnapshot = this.audioRef.doc(clip.id).collection('tags').get();

      const [audio1,tagsSnapshot1,otherTagSnapshot1] = await Promise.all([audio,tagsSnapshot,otherTagSnapshot]);
      clipHistory[clip.id].title = audio1.data().Title;
      clipHistory[clip.id].url = audio1.data().Url;
      clipHistory[clip.id].id = clip.id;

      tempTag = tagsSnapshot1.data().tags;
      clipHistory[clip.id].TAG = tempTag.join(", ");

      for(const tag of otherTagSnapshot1.docs){
         if(!tempTag.includes(tag.id)){
          tempTag1.push(tag.id);
         }
      }
        clipHistory[clip.id].other = tempTag1.join(", ");
      this.setState({ clipHistory });
   }
    const scoredClipHistorySnapshot = await this.userRef.collection('clipHistory').where("score", ">", 0).orderBy("score").limit(10).get();
    const scoredClipHistory = {};
    for(const clip of scoredClipHistorySnapshot.docs){
      scoredClipHistory[clip.id] = { score: clip.data().score };
      var audio = await this.audioRef.doc(clip.id).get();
      scoredClipHistory[clip.id].title = audio.data().Title;
      scoredClipHistory[clip.id].url = audio.data().Url;
      scoredClipHistory[clip.id].id = clip.id;
      tempTag = [];
      var scoreTagsSnapshot = await this.audioRef.doc(clip.id).collection('tags').where("userId", 'array-contains',this.userId).get();
      for(const tag of scoreTagsSnapshot.docs){
         tempTag.push(tag.id);
      }
      scoredClipHistory[clip.id].TAG = tempTag.join(", ");
      this.setState({ scoredClipHistory });
    }


  }
  togglePlay = play => {
    this.setState({ play });
  }

  render() {
    const { clipHistory, scoredClipHistory } = this.state;
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
                clipId={clipHistory[clip].id}
                TAG={clipHistory[clip].TAG}
                togglePlay={this.togglePlay}
                other={clipHistory[clip].other}
              />
            </Grid>
          ))}
          </Grid>
        </Grid>
        <h2>Your last scored clips</h2>
        <Grid item className="card-list-container"> 
          <Grid container className="card-list" spacing={8}>
          {Object.keys(scoredClipHistory).map((clip, i) =>(
            <Grid item key={i}>
              <AudioCard
                url={scoredClipHistory[clip].url}
                clip={scoredClipHistory[clip].title}
                TAG={scoredClipHistory[clip].TAG}
                clipId={scoredClipHistory[clip].id}
                 other={clipHistory[clip].other}
                togglePlay={this.togglePlay}
              />
            </Grid>
          ))}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default SummaryPage;