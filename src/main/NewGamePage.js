    import React, { Component } from "react";
    import { Link } from "react-router-dom";
    import {
      Grid,
      FormControl,
      Input,
      InputLabel,
      InputAdornment,
      Icon,
      IconButton,
      FormHelperText,
      CircularProgress,
      Tooltip
    } from "@material-ui/core";
    import Send from "@material-ui/icons/Send";
    import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
    import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
    import Help from "@material-ui/icons/HelpOutline";
    import AudioAnalyser from "./AudioAnalyser";
    import firebase from "../base";
    import staticFirebase from "firebase";
    import GameRuleDialog from "./GameRuleDialog";
    //import {SFC} from 'react';
    //import fire from "../fire"

    const INITIAL_STATE = {
      currentTags:{},
      loading: false,
    };

    export default class GamePage extends Component {
      constructor(props) {
        super(props);
        this.state = {...INITIAL_STATE};
      }  
      componentDidMount(){
        this.user = firebase.auth().currentUser;
        this.db = firebase.firestore();
        this.currentId = firebase.auth().currentUser.uid;
        this.userRef = this.db.collection('users').doc(this.currentId);
        this.firstUserId = '';
        this.loadUrl();
        term();
      }
      //random loading Url
      loadUrl = async () => {
        console.log("currentUser: " + firebase.auth().currentUser.uid);
        this.existingTags = {};
        var querySnapshot = await this.db.collection('audios').get();
        var id = Math.floor((Math.random()*querySnapshot.size)) + '';
        this.clipId = id;
        console.log(this.clipId);
       
        this.audioRef = await this.db.collection('audios').doc(this.clipId);
        try {
          // load url
          const doc = await this.audioRef.get();
          this.url = doc.data().Url;
          console.log(this.clipId);
          console.log(this.url);
        }catch(err){
          console.log(err);
        } 
        await this.setState({ loading: false });
      }
      //getting existing tags from database
      loadExistingTag = tags => {
        // load existing tags       
        try{
          if (tags) {
          tags.forEach(tag => (this.existingTags[tag.id] = {
            count: tag.data().count,
          }));
         }
        }catch(err){
          console.log("loadExistingTagError: " + err);
        }
        return this.existingTags;
      }      
      //getting next clips
      getNextClip = async () => {
        await this.setState({currentTags:{}, loading: true});
        this.loadUrl();
      }  
      //submit tags
      handleSubmit = async () => {
        const newTags = document.getElementById("tags").value.toLowerCase().replace(/\s/g,'').split(",");
        //generate temporatyTags set from new Tags
        var tempCurrentTags = {};
        this.audioTagRef = await this.audioRef.collection('tags');
        const tags = await this.audioTagRef.get();
        //generate exitingTags from DB
        this.existingTags = await this.loadExistingTag(tags);
       
        console.log("existingTags");
        console.log(this.existingTags);
      
        newTags.forEach(tag => {
          if(Object.keys(this.existingTags).includes(tag)){
            tempCurrentTags[tag] = {
              count: this.existingTags[tag].count,
              score: 0,
            }
          }else{
           tempCurrentTags[tag] = {
              count: 0,
              score: 0,
            }
          }
        });
        console.log("tempCurrentTags");
        console.log(tempCurrentTags);
       
        console.log("newTags: " + newTags);
        document.getElementById("tags").value = "";
        //tempCurrentTags = Promise.resolve(this.loadTagsToDb(tempCurrentTags));
        //this.createHistory(tempCurrentTags);
        this.loadTagsToDb(tempCurrentTags).then(tempCurrentTags => {
          tempCurrentTags = tempCurrentTags;
        })
        await this.setState({currentTags: tempCurrentTags});
        console.log("currentTags:");
        
        console.log(this.state.currentTags);
        
      }
      //get first user Id 
      getUserId = async tag => {
        var doc = await this.audioTagRef.doc(tag).get();
        var userIdArray = await doc.get('userId');
        this.firstUserId = userIdArray[0];
        console.log("userIdArray.length" + userIdArray.length);
        console.log("userIdArray[0]"+userIdArray[0]);
        console.log("userIdArray[1]"+userIdArray[1]);
        console.log("firstUserId"+this.firstUserId );
        return this.firstUserId;
      }
      //laoding tags into DB
      loadTagsToDb = async (currentTags) => {
        try{
          for(const tag of Object.keys(currentTags)){ 
            if( currentTags[tag].count !== 0)
              this.addUser(tag);
            if (currentTags[tag].count === 1) {
              //if this user is the second person describe the tag, add 2 points to the first user
              var firstUserId = await this.getUserId(tag);
              var firstUserRef = await this.db.collection('users').doc(firstUserId);
              console.log("!!firstUserId: " + firstUserId);
              if(firstUserId !== this.currentId){//if the first user is not current user 
                   this.History(firstUserRef,2);
                   this.refreshTotalScore(firstUserRef,2);
                  //get 1 point if current user is the second person describe this tag
                   currentTags[tag].score = 1;
                   this.History(this.userRef,1);
                   this.refreshTotalScore(this.userRef,1);
              }          
            } else if(currentTags[tag].count === 0){ //if the user is the first person, 0 score for now, count = 1
              this.isFrist(tag);
              this.History(this.userRef,0);
            }else{//if the user is the third or more than third person, only increment count but not saving userID
              this.History(this.userRef,0);
            }
           }
          }catch(err){
          console.log("can't upload tags into DB!!:  "+ err);
        }
        return currentTags;
      }
      addUser = tag => {
        try{
          this.audioTagRef.doc(tag).update({
            count: staticFirebase.firestore.FieldValue.increment(1),
            userId: staticFirebase.firestore.FieldValue.arrayUnion(this.user.uid)
          })
        }catch(err){
          console.log("can't add user: " + err);
        }
      }
      refreshTotalScore = (userRef,score) => {
        userRef.update({
          score: staticFirebase.firestore.FieldValue.increment(score)
        })
      }
      isFrist = tag => {
        this.audioTagRef.doc(tag).set({
          count: 1,
          userId: staticFirebase.firestore.FieldValue.arrayUnion(this.user.uid)
        })
      }
      incrementCount = tag => {
        this.audioTagRef.doc(tag).update({
          count: staticFirebase.firestore.FieldValue.increment(1),
        })
      }  
      History = (userRef, score) => {
        try{
        var userClipHistoryRef = userRef.collection('clipHistory');
         userClipHistoryRef.doc(this.clipId).get()
            .then(doc => {
               if (doc.exists) {
                 this.updateHistory(userClipHistoryRef,score);
               } else {
                 this.createHistory(userClipHistoryRef,score);
                 this.refreshTotalScore(userRef,0);
               }
            });
        }catch(err){
          console.log("Can't create clipHistory!! " + err);
        }

      }
      updateHistory = (userClipHistoryRef,score) => {
        try{
          userClipHistoryRef.doc(this.clipId).update({
            score: staticFirebase.firestore.FieldValue.increment(score),
            lastUpdatedAt: staticFirebase.firestore.FieldValue.serverTimestamp()
          });
        }catch(err){
          console.log("Can't update clipHistory: " + err);
        }
      }
      createHistory = (userClipHistoryRef,score) => {
        try{
          userClipHistoryRef.doc(this.clipId).set({
            score: staticFirebase.firestore.FieldValue.increment(score),
            createdAt: staticFirebase.firestore.FieldValue.serverTimestamp(),
            lastUpdatedAt: staticFirebase.firestore.FieldValue.serverTimestamp()
          });
        }catch(err){
          console.log("Can't create clipHistory: " + err);
        }
      }
  
      
      render() {
       const url = this.url;
       const {currentTags,existingTags} = this.state;
        return (
          <Grid container className="game-container" direction="column" alignItems="center" spacing={16}>
            <Grid item container alignItems="center">
              <Grid item sm={1} md={1} lg={1}><GameRuleDialog /></Grid>
              <Grid item sm={10} md={10} lg={10}>
                <h1>Describe this clip</h1>
              </Grid>
              <Grid item sm={1} md={1} lg={1}></Grid>
            </Grid>
            <Grid item container alignItems="center">
              <Grid item sm={3} md={3} lg={3}>
                <Link to="/main" style={{ "textDecoration": "none" }}>
                  <IconButton id="gameSummary" style={{ "borderRadius": "0" }}>
                    <KeyboardArrowLeft />
                    Summary
                  </IconButton>
                </Link>
              </Grid>
              {this.state.loading ? (
                <Grid item sm={6} md={6} lg={6} className="canvas-container">
                  <CircularProgress size={100} thickness={3.6} />
                </Grid>
              ) : (
                <AudioAnalyser url={url} />
              )}
              <Grid item sm={3} md={3} lg={3}>
                <IconButton id="nextClip" style={{ "borderRadius": "0" }} onClick={this.getNextClip}>
                  Next Clip
                  <KeyboardArrowRight />
                </IconButton>
              </Grid>
            </Grid>
           <Grid item sm={10} md={6} lg={8}>
              {Object.keys(currentTags).map((tag, i) => {
                if (currentTags[tag].count === 0) {
                  return (<span key={i} className="gray">{tag}&nbsp;</span>)
                } else if (currentTags[tag].count === 1) {
                  return (<i key={i} className="1-point">{tag}&nbsp;</i>)
                } else if (currentTags[tag].count > 1) {
                  return (<span key={i} className="pink">{tag}&nbsp;</span>)
                } else {
                  return (<b key={i}>{tag}&nbsp;</b>)
                }
              })}
            </Grid>
            <Grid item sm={10} md={6} lg={8}>
              <FormControl margin="normal" fullWidth>
                <InputLabel>Input your tags...</InputLabel>
                <Input
                  id="tags"
                  type="text"
                  //onKeyPress={this.handleKeyPress}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton id="submitButton" onClick={this.handleSubmit}>
                        <Send />
                      </IconButton>
                      <Tooltip
                        title={
                          <p>You can input more than one tag <br />by using commas to separate.</p>
                        }
                        placement="right"
                      >
                        <Icon>
                          <Help />
                        </Icon>
                      </Tooltip>
                    </InputAdornment>
                  }
                />
                <FormHelperText>
                  Tag colors: <b>2 points</b>, <i>1 point</i>, <span className="gray">no points yet (but could be 2)</span>, <span className="pink">0 points</span>.
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        );
      }
    }
    const term = (x,y) => {
        return x+y;
    }
    export {term}