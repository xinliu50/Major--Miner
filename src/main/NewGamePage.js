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
      //existingTags:{},
      currentTags:{},
      loading: false,
    };

    class GamePage extends Component {
      constructor(props) {
        super(props);
        this.state = {...INITIAL_STATE};
        this.existingTags = {};
      }
      
      componentDidMount(){
        this.user = firebase.auth().currentUser;
        this.db = firebase.firestore();
        this.userRef = this.db.collection('users').doc(firebase.auth().currentUser.uid);

        this.loadUrl();
      }
      loadUrl = async () => {
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
      loadExistingTag = async (tags) => {
        // load existing tags       
       // const tags = await this.audioTagRef.get();
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
      
      getNextClip = async () => {
        await this.setState({loading: true});
        this.loadUrl();
      }
      
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
        //see how many times this tag has been upload
        newTags.forEach(tag => {
          if(Object.keys(this.existingTags).includes(tag)){
            tempCurrentTags[tag] = {
              count: this.existingTags[tag].count,
            }
          }else{
           tempCurrentTags[tag] = {
              count: 0,
            }
          }
        });
        console.log("tempCurrentTags");
        console.log(tempCurrentTags);
       
        console.log("newTags: " + newTags);
        //console.log("filteredTags: " + filteredTags);
  
        document.getElementById("tags").value = "";
       
        //console.log(this.existingTags);
        this.loadTagsToDb(tempCurrentTags);
        await this.setState({currentTags: tempCurrentTags});
      }
      loadTagsToDb = currentTags => {
        try{
          // update tags in DB
          Object.keys(currentTags).forEach(tag => {
          // tag already exists
          if (currentTags[tag].count >= 1) {
            this.audioTagRef.doc(tag).update({
                count: staticFirebase.firestore.FieldValue.increment(1),
                userId: staticFirebase.firestore.FieldValue.arrayUnion(this.user.uid)
                })
          } else { 
            this.audioTagRef.doc(tag).set({
                count: 1,
                userId: staticFirebase.firestore.FieldValue.arrayUnion(this.user.uid)
              })
          }
        })}catch(err){
          console.log("can't upload tags into DB!!:  "+err);
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

    export default GamePage;