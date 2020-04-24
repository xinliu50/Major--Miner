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
      tag: null,
      MyTag: null,
      tagOrderArray: [],
      clipNumber: null,
      play: false
    }
  }
  async componentDidMount() {
    this.user = firebase.auth().currentUser;
    this.db = firebase.firestore();
    this.audioRef = this.db.collection('audios');
    this.userId = this.user.uid;
    this.userRef = this.db.collection('users').doc(this.userId);
    this.getCurrentTarget();
  }
  //retrive informations for each clip has been discribe as this tag
  async getCurrentTarget(){
      var url = window.location.href;
      let index = url.lastIndexOf('/');
      let tag = url.substring(index+1,url.length);
      const tagOrder = await this.db.collection('tagList').doc(tag).collection('clipIDs').orderBy('count','desc').get();
      var tagOrderArray = [];

      this.MyTagMap = {};
      tagOrder.forEach(p => {
         tagOrderArray.push({tag: p.id, count: p.data().count});
          this.MyTagMap[p.id] = {};
          this.MyTagMap[p.id].url = p.data().Url;
          this.MyTagMap[p.id].clip = p.data().Title;
          this.MyTagMap[p.id].count = p.data().count;
      });

       this.setState({
        tag: tag,
        MyTag: this.MyTagMap,
        tagOrderArray: tagOrderArray,
        clipNumber: tagOrder.size
      });
  }
  togglePlay = play => {
    this.setState({ play });
  }
  render() {
    const {MyTag,tag,clipNumber,tagOrderArray} = this.state
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