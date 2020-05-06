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
      scoredClipHistory: {},
      play: false
    }
  }

   componentDidMount() {
    this.user = firebase.auth().currentUser;
    this.db = firebase.firestore();
    this.audioRef = this.db.collection('audios');
    this.userId = this.user.uid;
    this.userRef = this.db.collection('users').doc(this.userId);
    console.log("Your are " + this.userId);
    this.GetSummary();
  }
 
  //Gather some data and save it to the users collection for optimization
  async gatherData() {
    const users = await this.db.collection('users').get();
    for(const user of users.docs){
      const clipHistory = await this.db.collection('users').doc(user.id).collection('clipHistory').get();
      let clipInfo = {};
      for(const clip of clipHistory.docs){
        const Myclip = await this.db.collection('audios').doc(clip.id).get();
        const MyTag = await this.db.collection('audios').doc(clip.id).collection('users').doc(user.id).get();
        const allTag = [];
        const AllTag = await this.db.collection('audios').doc(clip.id).collection('tags').get();
        
        for(const tag of AllTag.docs)
            allTag.push(tag.id);

         clipInfo = {ID: clip.id, Title: Myclip.data().Title, Url: Myclip.data().Url, myTag: MyTag.data().tags, allTag: allTag};
         console.log(clipInfo);
         this.db.collection('users').doc(user.id).collection('clipHistory').doc(clip.id).update({
            Title: Myclip.data().Title,
            Url: Myclip.data().Url,
            MyTag: MyTag.data().tags,
            AllTag: allTag
         });
      }
    }
  }
  //Optimize GetSummay functions
  async GetSummary(){
    const clipHistory = {};
    const History = await this.userRef.collection('clipHistory').orderBy('lastUpdatedAt', "desc").limit(10).get();
    for(const history of History.docs){
      clipHistory[history.id] = {};
      clipHistory[history.id].title = history.data().Title;
      clipHistory[history.id].url = history.data().Url;
      clipHistory[history.id].TAG = history.data().MyTag.join(', ');
      clipHistory[history.id].other = history.data().AllTag;
      clipHistory[history.id].other = clipHistory[history.id].other.filter(item => {
        return !history.data().MyTag.includes(item);
      });
      clipHistory[history.id].other = clipHistory[history.id].other.join(', ');
    }
    const scoredClipHistory = {};
    const ScoreHistory = await this.userRef.collection('clipHistory').where("score", ">", 0).orderBy("score", "desc").limit(10).get();
    for(const history of ScoreHistory.docs){
      scoredClipHistory[history.id] = {};
      scoredClipHistory[history.id].title = history.data().Title;
      scoredClipHistory[history.id].url = history.data().Url;
      scoredClipHistory[history.id].TAG = history.data().MyTag.join(', ');
      scoredClipHistory[history.id].other = history.data().AllTag;
      scoredClipHistory[history.id].other = scoredClipHistory[history.id].other.filter(item => {
        return !history.data().MyTag.includes(item);
      });
      scoredClipHistory[history.id].other = scoredClipHistory[history.id].other.join(', ');
    }
    this.setState({ clipHistory, scoredClipHistory});
  }
  //Try3: get summary from cloud function. Much better performance, but very slow at first trigger
  async getSummaryFromCloudFunctions(){
   
    const getSummary = firebase.functions().httpsCallable('getSummary_CallFromClient_v1');
    let result = await getSummary({uid: this.userId});
    this.setState({ clipHistory: result.data[0], scoredClipHistory: result.data[1] });
  }
 //Try2: resolve all promise at once, better performance but render page before retrive the data
  async getSummary1() {
    const clipHistorySnapshot = await this.userRef.collection('clipHistory').orderBy('lastUpdatedAt').limit(10).get();
    const clipHistory = {};

    const CurrenUserTagPromise = []
    const InforPromise = []
    var otherTagSnapshot;
    for (const clip of clipHistorySnapshot.docs){
      clipHistory[clip.id] = {}
      var documentRef = this.audioRef.doc(clip.id);
      CurrenUserTagPromise.push(documentRef.collection('users').doc(this.userId).get());
      InforPromise.push(documentRef.get())
      otherTagSnapshot = documentRef.collection('tags').get();
    }
    var [InforPromiseResolve, CurrenUserTagPromiseResolve,otherTagSnapshotPromiseResolve] = await Promise.all([InforPromise,CurrenUserTagPromise,otherTagSnapshot]);

    InforPromiseResolve.forEach(promise => {
      promise.then(p => {
        clipHistory[p.id].title = p.data().Title;
        clipHistory[p.id].url = p.data().Url;
        clipHistory[p.id].id = p.id;
      })
    })
    CurrenUserTagPromiseResolve.forEach(promise => {
      promise.then(p => {
          let id = p.ref.parent.parent.id
          clipHistory[id].TAG = p.data().tags.join(", ");
      })
    })
    this.setState({ clipHistory });
    
    const scoredClipHistorySnapshot = await this.userRef.collection('clipHistory').where("score", ">", 0).orderBy("score").limit(10).get();
    const scoredClipHistory = {};
    const CurrenUserScoreTagPromise = []
    const ScoreInforPromise = []
    var ScoreOtherTag;
    for(const clip of scoredClipHistorySnapshot.docs){
      scoredClipHistory[clip.id] = { score: clip.data().score };
      let documentRef = this.audioRef.doc(clip.id);
      CurrenUserScoreTagPromise.push(documentRef.collection('users').doc(this.userId).get());
      ScoreInforPromise.push(documentRef.get())
      ScoreOtherTag = documentRef.collection('tags').get();
    }
    var [ScoreInforPromiseResolve, CurrenUserScoreTagPromiseResolve,ScoreOtherTagPromiseResolve] = await Promise.all([ScoreInforPromise,CurrenUserScoreTagPromise,ScoreOtherTag]);
    
    ScoreInforPromiseResolve.forEach(promise => {
      promise.then(p => {
        scoredClipHistory[p.id].title = p.data().Title;
        scoredClipHistory[p.id].url = p.data().Url;
        scoredClipHistory[p.id].id = p.id;
      })
    })
    CurrenUserScoreTagPromiseResolve.forEach(promise => {
      promise.then(p => {
          let id = p.ref.parent.parent.id
          scoredClipHistory[id].TAG = p.data().tags.join(", ");
      })
    })
    this.setState({ scoredClipHistory });
 }
//Try1: original version of getsummary functions
 async getSummary() {
  var tempTag = [];
  var tempTag1 = [];
  const clipHistorySnapshot = await this.userRef.collection('clipHistory').orderBy('lastUpdatedAt').limit(10).get();
  const clipHistory = {};
 for (const clip of clipHistorySnapshot.docs){
    clipHistory[clip.id] = {};
    var audio = this.audioRef.doc(clip.id).get();
    tempTag = [];
    tempTag1 = [];
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
 }
  this.setState({ clipHistory });
  
  const scoredClipHistorySnapshot = await this.userRef.collection('clipHistory').where("score", ">", 0).orderBy("score").limit(10).get();
  const scoredClipHistory = {};
  for(const clip of scoredClipHistorySnapshot.docs){
    scoredClipHistory[clip.id] = {};
    var audioSnapshot = this.audioRef.doc(clip.id).get();
    var scoreTagsSnapshot = this.audioRef.doc(clip.id).collection('users').doc(this.userId).get();
    var otherScoreTagSnapshot = this.audioRef.doc(clip.id).collection('tags').get();
   
   const [audio1,scoreTagsSnapshot1,otherScoreTagSnapshot1] = await Promise.all([audioSnapshot,scoreTagsSnapshot,otherScoreTagSnapshot]);
    scoredClipHistory[clip.id].title = audio1.data().Title;
    scoredClipHistory[clip.id].url = audio1.data().Url;
    scoredClipHistory[clip.id].id = clip.id;
    tempTag = [];
    tempTag1 = [];
    tempTag = scoreTagsSnapshot1.data().tags;
    scoredClipHistory[clip.id].TAG = tempTag.join(", ");

    for(const tag of otherScoreTagSnapshot1.docs){
       if(!tempTag.includes(tag.id)){
        tempTag1.push(tag.id);
       }
    }
    scoredClipHistory[clip.id].other = tempTag1.join(", ");
 }
 this.setState({ scoredClipHistory });
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
                fromSummary={true}
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
                other={scoredClipHistory[clip].other}
                togglePlay={this.togglePlay}
                fromSummary={true}
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