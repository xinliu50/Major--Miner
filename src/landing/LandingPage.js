import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { Link } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import firebase from "../base";

class LandingPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      clipHistory: {},
      scoredClipHistory: {}
    }
  };
  // componentDidMount (){
    
  // }
  Summary = async () => {
    this.user = firebase.auth().currentUser;
    this.db = firebase.firestore();
    this.currentId = this.user.uid;
    this.userId = this.user.uid;
    this.userRef = this.db.collection('users').doc(this.currentId);
    this.audioRef = this.db.collection('audios');
    var tempTag = [];
    var tempTag1 = [];
    const clipHistorySnapshot = await this.userRef.collection('clipHistory').orderBy('lastUpdatedAt').limit(10).get();
    const clipHistory = {};
    
  for (const clip of clipHistorySnapshot.docs){
      clipHistory[clip.id] = { score: clip.data().score };
      var audio = this.db.collection('audios').doc(clip.id).get();
      tempTag = [];
      tempTag1 = [];
      var tagsSnapshot = this.db.collection('audios').doc(clip.id).collection('users').doc(this.userId).get();
      var otherTagSnapshot = this.db.collection('audios').doc(clip.id).collection('tags').get();
      
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
      var audioSnapshot = this.db.collection('audios').doc(clip.id).get();
      var scoreTagsSnapshot = this.db.collection('audios').doc(clip.id).collection('tags').where("userId", 'array-contains',this.userId).get();
      var otherScoreTagSnapshot = this.db.collection('audios').doc(clip.id).collection('tags').get();
    
    const [audio1,scoreTagsSnapshot1,otherScoreTagSnapshot1] = await Promise.all([audioSnapshot,scoreTagsSnapshot,otherScoreTagSnapshot]);
      scoredClipHistory[clip.id].title = audio1.data().Title;
      scoredClipHistory[clip.id].url = audio1.data().Url;
      scoredClipHistory[clip.id].id = clip.id;
      tempTag = [];
      tempTag1 = [];

      for(const tag of scoreTagsSnapshot1.docs){
        tempTag.push(tag.id);
      }
      scoredClipHistory[clip.id].TAG = tempTag.join(", ");

      for(const tag of otherScoreTagSnapshot1.docs){
        if(!tempTag.includes(tag.id)){
          tempTag1.push(tag.id);
        }
      }
      scoredClipHistory[clip.id].other = tempTag1.join(", ");
      this.setState({ scoredClipHistory });
    }
    console.log(this.state.scoredClipHistory)
    console.log(this.state.clipHistory)
    // <Link to={{
    //   pathname: "/main",
    //   clipHistory: clipHistory,
    //   scoredClipHistory: scoredClipHistory
    // }}
    this.props.history.push({
      pathname: '/main',
      state: {
       clipHistory: this.state.clipHistory,
       scoredClipHistory: this.state.scoredClipHistory
      }
    })
  }
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
            <Grid item onClick={this.Summary}>
              Summary
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