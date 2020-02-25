import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Grid
} from "@material-ui/core";
import AudioCard from "../main/AudioCard";
import firebase from "../base";

//TODO: load tags from DB
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
    
   
    // var tempTag = [];
    // var tempTag1 = [];
    // const clipHistorySnapshot = await this.userRef.collection('clipHistory').orderBy('lastUpdatedAt').limit(10).get();
   
    
   // const clipHistory = {};
    
  //  for (const clip of clipHistorySnapshot.docs){
  //     clipHistory[clip.id] = { score: clip.data().score };
  //     var audio = this.audioRef.doc(clip.id).get();
  //     tempTag = [];
  //     tempTag1 = [];
  //     var tagsSnapshot = this.audioRef.doc(clip.id).collection('users').doc(this.userId).get();
  //     var otherTagSnapshot = this.audioRef.doc(clip.id).collection('tags').get();
      
  //     const [audio1,tagsSnapshot1,otherTagSnapshot1] = await Promise.all([audio,tagsSnapshot,otherTagSnapshot]);
  //     clipHistory[clip.id].title = audio1.data().Title;
  //     clipHistory[clip.id].url = audio1.data().Url;
  //     clipHistory[clip.id].id = clip.id;

  //     tempTag = tagsSnapshot1.data().tags;
  //     clipHistory[clip.id].TAG = tempTag.join(", ");

  //     for(const tag of otherTagSnapshot1.docs){
  //        if(!tempTag.includes(tag.id)){
  //         tempTag1.push(tag.id);
  //        }
  //     }
  //       clipHistory[clip.id].other = tempTag1.join(", ");
  //     this.setState({ clipHistory });
  //  }
 
    // const scoredClipHistorySnapshot = await this.userRef.collection('clipHistory').where("score", ">", 0).orderBy("score").limit(10).get();
    // const scoredClipHistory = {};
    // for(const clip of scoredClipHistorySnapshot.docs){
    //   scoredClipHistory[clip.id] = { score: clip.data().score };
    //   var audioSnapshot = this.audioRef.doc(clip.id).get();
    //   var scoreTagsSnapshot = this.audioRef.doc(clip.id).collection('tags').where("userId", 'array-contains',this.userId).get();
    //   var otherScoreTagSnapshot = this.audioRef.doc(clip.id).collection('tags').get();
     
    //  const [audio1,scoreTagsSnapshot1,otherScoreTagSnapshot1] = await Promise.all([audioSnapshot,scoreTagsSnapshot,otherScoreTagSnapshot]);
    //   scoredClipHistory[clip.id].title = audio1.data().Title;
    //   scoredClipHistory[clip.id].url = audio1.data().Url;
    //   scoredClipHistory[clip.id].id = clip.id;
    //   tempTag = [];
    //   tempTag1 = [];

    //   for(const tag of scoreTagsSnapshot1.docs){
    //     tempTag.push(tag.id);
    //   }
    //   scoredClipHistory[clip.id].TAG = tempTag.join(", ");

    //   for(const tag of otherScoreTagSnapshot1.docs){
    //      if(!tempTag.includes(tag.id)){
    //       tempTag1.push(tag.id);
    //      }
    //   }
    //   scoredClipHistory[clip.id].other = tempTag1.join(", ");
    //   this.setState({ scoredClipHistory });
    // }


  }
  togglePlay = play => {
    this.setState({ play });
  }

  render() {
    //const { clipHistory, scoredClipHistory } = this.state;
    //const {MyTag} = this.state
    const {MyTag,tag} = this.props.location.state
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
    <h2>Here are 2 clip have been describe as {tag}</h2>
        <Grid item className="card-list-container"> 
          <Grid container className="card-list" spacing={8}>
          {Object.keys(MyTag).map((clip, i) => (
            <Grid item key={clip}>
              <AudioCard
                tag={tag}
                clip={MyTag[clip].clip}
                url={MyTag[clip].url}
                count={MyTag[clip].count}
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