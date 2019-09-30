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


    const INITIAL_STATE = {
      currentTags:{},
      loading: false,
    };

    export default class GamePage extends Component {
      constructor(props) {
        super(props);
        this.state = {...INITIAL_STATE};
      }  
      componentDidMount = async() =>{
        this.user = firebase.auth().currentUser;
        this.db = firebase.firestore();
        this.currentId = firebase.auth().currentUser.uid;
        this.userRef = this.db.collection('users').doc(this.currentId);
        this.firstUserId = '';
        this.randomizeId();
        this.loadUrl();

        var d = Date.parse('March 21, 2012');
        console.log("d...", d);
        // const doc = await this.db.collection('Randomize').doc('0').get();
        //const doc = await this.db.collection('users').doc('gg5TmIHz2AZkFyRgaUdELkT80Xl2').collection('clipHistory').doc('0').get();
        //this.time = await doc.data().updated;
        //this.time = await doc.data().lastUpdatedAt;
        //this.compareTime(this.time);
       
        
        
      }
      //random loading Url
      loadUrl = async () => {
        console.log("currentUser: " + firebase.auth().currentUser.uid);
        this.existingTags = {};
        var querySnapshot = await this.db.collection('audios').get();
        //var id = Math.floor((Math.random()*querySnapshot.size)) + '';
        //this.clipId = id;
        this.clipId = await this.randomizeId();
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
      //compare timeStamps
      compareTime = async timeStamp => {
        var month = new Array();
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";
       
        const thatTime = timeStamp.toMillis();
        console.log("that time: ", thatTime);
        
        var d = new Date();
        var day = d.getDay()+'';
        var todayDate = d.getDate()+'';
        var month = month[d.getMonth()]+' ';
        var year = d.getFullYear()+'';
        console.log("day", day);
        console.log("date ", todayDate);
        console.log("month", month);
        console.log("year", year);
        const parseStringToday = month+todayDate+', '+year;

        console.log(parseStringToday);
        var today = Date.parse(parseStringToday);
        console.log("today: ", today);

        const now = Date.now();
        console.log("now: ", now);
        
        var compare = now - thatTime;
        if(compare <= 3600000){
          console.log("within an hour", compare);
          return 1;
        }
        else if(thatTime <= today+3600000 * 24){
          console.log("it's today");
          return 2;
        }
        else if(thatTime <= today+3600000 * 24 * 7){
          console.log("this week");
          return 3;
        }
        else{
          console.log("long time ago");
          return 4;
        }
      }

      oneDayRange = () => {
        var month = new Array();
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";
       
        var d = new Date();
        var day = d.getDay()+'';
        var todayDate = d.getDate()+'';
        var month = month[d.getMonth()]+' ';
        var year = d.getFullYear()+'';
        const parseStringToday = month+todayDate+', '+year;
        var today = Date.parse(parseStringToday);//millionSeconds for 00:00:00 today
        console.log("today: ", today);

        return today+ 3600000 * 24;
      }
      //Randomize clipID
      randomizeId = async () => {
         var ID = [];
         var clipIdSnapshot = await this.db.collection('Randomize').where('count', '>', 0).get();
         var size = clipIdSnapshot.size;
         console.log("size ", size);
         var userHasSeen = {};
         var oneHourNoSeen = [];
         if(size === 0){//initially all clips has not yet been seen
          return '0';
         }else{
             var noSeenSnapshot = await this.db.collection('Randomize').where('count', '==', 0).get();
             if(noSeenSnapshot.size != 0) //if some clips have been seen, choose the one has not been seen 
                return noSeenSnapshot.docs[0].id+'';
             else{
               var now = Date.now(); //if all clips have been seen, pick the one has not been seen in the last hour && current user has no seen yet
               var time = now - 3600000;
               var milliSnapshot = await this.db.collection('Randomize').where('millis', '<', time).get();//has no seen past hour
               var currentUserSeen = await this.db.collection('Randomize').where('userId', 'array-contains', this.currentId).get();
               for(const userSeen of currentUserSeen.docs){
                  userHasSeen[userSeen.id] = {count: userSeen.data().count};
               }
               for(const millis of milliSnapshot.docs){
                  oneHourNoSeen.push(millis.id);
               }
               console.log("oneHourNoSeen:" , oneHourNoSeen);
               console.log("userHasSeen:" , userHasSeen);
               var userHasNoSeen = oneHourNoSeen.filter(id => (!Object.keys(userHasSeen).includes(id)));
               console.log("userHasNoSeen:" , userHasNoSeen.length);
               if(userHasNoSeen.length != 0)
                return userHasNoSeen[0]+'';
             }
          }
         return Math.floor((Math.random()*5))+'';
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
        this.audioUsersRef = await this.audioRef.collection('users');
        
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
      
        this.loadTagsToDb(tempCurrentTags).then(tempCurrentTags => {
          tempCurrentTags = tempCurrentTags;
          this.setState({currentTags: tempCurrentTags});
          console.log("currentTags:");
        
          console.log(this.state.currentTags);
        })
       
        
      }
      //get first user Id 
      getUserId = async tag => {
       /* var doc = await this.audioTagRef.doc(tag).get();
        var userIdArray = await doc.get('userId');
        this.firstUserId = userIdArray[0];
        console.log("userIdArray.length" + userIdArray.length);
        console.log("userIdArray[0]"+userIdArray[0]);
        console.log("userIdArray[1]"+userIdArray[1]);
        console.log("firstUserId"+this.firstUserId );
        console.log("getUserId CLIPID", this.clipId);
        return this.firstUserId;*/
        var firstUser = await this.db.collection('audios').doc(this.clipId).collection('users').where('tags', 'array-contains', tag).get();
        console.log("firstUser:  ", firstUser.docs[0].id);
        return firstUser.docs[0].id;
      }
      //laoding tags into DB
      loadTagsToDb = async (currentTags) => {
        try{
          for(const tag of Object.keys(currentTags)){ 
            await this.addUser(tag);
            this.History(this.userRef,this.currentId,0);
            if (currentTags[tag].count === 1) {
              //if this user is the second person describe the tag, add 2 points to the first user
              var firstUserId = await this.getUserId(tag);
              var firstUserRef = await this.db.collection('users').doc(firstUserId);
              console.log("!!firstUserId: " + firstUserId);
              if(firstUserId !== this.currentId){//if the first user is not current user 
                   this.History(firstUserRef,firstUserId,2);
                  // this.refreshTotalScore(firstUserRef,2);
                  //get 1 point if current user is the second person describe this tag
                   currentTags[tag].score = 1;
                   this.History(this.userRef,this.currentId,1);
                  // this.refreshTotalScore(this.userRef,1);
              }          
            } else if(currentTags[tag].count === 0){ //if the user is the first person, 0 score for now, count = 1
             // this.isFrist(tag);
              this.History(this.userRef,this.currentId,0);
            }else{//if the user is the third or more than third person, no points
              this.History(this.userRef,this.currentId,0);
            }
            await this.audioUsersRef.doc(this.currentId).set({
              tags: staticFirebase.firestore.FieldValue.arrayUnion(tag)//add the user to "users" collection,save the tags as array
            },{ merge: true });
           }
          }catch(err){
          console.log("can't upload tags into DB!!:  "+ err);
        }
        return currentTags;
      }
      addUser = tag => {
        try{
          this.audioTagRef.doc(tag).set({
            count: staticFirebase.firestore.FieldValue.increment(1),
            userId: staticFirebase.firestore.FieldValue.arrayUnion(this.currentId)
          },{merge: true});
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
          userId: staticFirebase.firestore.FieldValue.arrayUnion(this.currentId)
        })
       // this.audioUsersRef.doc(this.user.uid).set(tag);
      }
      History = async (userRef, userId, score) => {
        try{
        var userClipHistoryRef = await userRef.collection('clipHistory');
         userClipHistoryRef.doc(this.clipId).get()
            .then(doc => {
               if (doc.exists) {
                 this.updateHistory(userClipHistoryRef,score);
               } else {
                 this.createHistory(userClipHistoryRef,score);
               }
                this.refreshTotalScore(userRef,score);
            });
        }catch(err){
          console.log("Can't create clipHistory!! " + err);
        }
        if(score != 0){//if this user gained scores, save it to the scoreRecord collection
          var oneDayRangeMillis = this.oneDayRange();
          try{
            var scoreRecordRef = this.db.collection('scoreRecord').doc(userId);
            var scoreRef = await this.db.collection('scoreRecord').doc(userId).collection('score');
            scoreRef.doc(oneDayRangeMillis+'').get()
              .then(doc => {
                if(doc.exists){
                  scoreRef.doc(oneDayRangeMillis+'').update({
                    score: staticFirebase.firestore.FieldValue.increment(score)
                 });
                }else{
                  scoreRef.doc(oneDayRangeMillis+'').set({
                    score: score,
                    millis: oneDayRangeMillis,
                    createdAt: staticFirebase.firestore.FieldValue.serverTimestamp()
                  })
                }
              });
            scoreRecordRef.set({
              updated: staticFirebase.firestore.FieldValue.serverTimestamp(),
              millis: oneDayRangeMillis
            });
          }catch(e){
            console.log("Can't add score scoreRecord!");
          }
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
       const clipId = this.clipId;
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
                <AudioAnalyser url={url} clipId={clipId}/>
              )}
              <Grid item sm={3} md={3} lg={3}>
                <IconButton id="nextClip" style={{ "borderRadius": "0" }} onClick={this.getNextClip}>
                  Next Clip
                  <KeyboardArrowRight />
                </IconButton>
              </Grid>
            </Grid>
           <Grid item id="listTag" sm={10} md={6} lg={8}>
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
   