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
import app from "../base";
import staticFirebase from "app";
import GameRuleDialog from "./GameRuleDialog";

//TODO: modify calls to the new collection
//TODO: add randomness to load songs
class GamePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clipId: '2',
      url: '',
      existingTags: {},
      currentTags: {},
      loading: false
    };
  }

  componentDidMount() {
    this.db = app.firestore();
    this.userRef = this.db.collection('users').doc(app.auth().currentUser.uid);
    this.userClipHistoryRef = this.userRef.collection('clipHistory');
    
    this.loadFromDb(this.state.clipId);
  }

  loadFromDb = async clipId => {
    this.audioRef = this.db.collection('audios').doc(clipId);
    this.audioTagRef = this.audioRef.collection('tags');
    try {
      // load url
      const doc = await this.audioRef.get();
      const url = doc.data().Url;
      console.log(url);

      // load existing tags
      const tags = await this.audioTagRef.get();
      const existingTags = {};
      if (tags) {
        tags.forEach(tag => (existingTags[tag.id] = {
          count: tag.data().count,
          userId: tag.data().userId
        }));
      }
      await this.setState({ url, existingTags, loading: false });
    } catch(err) {
      console.log(err);
    }
  }

  handleSubmit = () => {
    const newTags = document.getElementById("tags").value.toLowerCase().replace(/\s/g,'').split(",");
    const filteredTags = newTags.filter(tag => (!Object.keys(this.state.currentTags).includes(tag)));
    filteredTags.forEach(tag => {
      if (Object.keys(this.state.existingTags).includes(tag)) {
        this.setState(prevState => ({ currentTags: {...prevState.currentTags, [tag]: this.state.existingTags[tag].count + 1 }}));
      } else {
        this.setState(prevState => ({ currentTags: {...prevState.currentTags, [tag]: 1 }}));
      }
    })
    document.getElementById("tags").value = "";
  }

  handleKeyPress = event => {
    if (event.key === 'Enter') {
      document.getElementById("submitButton").click();
    }
  }

  saveToDb = () => {
    const { currentTags, existingTags } = this.state;
    const user = app.auth().currentUser;
    try {
      // update tags in DB
      Object.keys(currentTags).forEach(tag => {
        // tag already exists
        if (currentTags[tag] > 1) {
          // user cannot input the same tag one more time
          if (!existingTags[tag].userId.includes(user.uid)) {
            this.audioTagRef.doc(tag).update({
              count: staticFirebase.firestore.FieldValue.increment(1),
              userId: staticFirebase.firestore.FieldValue.arrayUnion(user.uid)
            })
          }
        } else {
          this.audioTagRef.doc(tag).set({
            count: currentTags[tag],
            userId: staticFirebase.firestore.FieldValue.arrayUnion(user.uid)
          })
        }
      })
      console.log('data upload looks good..');

      // update user.score in DB
      const scoreReceived = document.getElementsByClassName("1-point").length;
      this.userRef.update({
        score: staticFirebase.firestore.FieldValue.increment(scoreReceived)
      });
      this.userClipHistoryRef.doc(this.state.clipId).get()
       .then(doc => {
         if (doc.exists) {
          this.userClipHistoryRef.doc(this.state.clipId).update({
            score: staticFirebase.firestore.FieldValue.increment(scoreReceived),
            lastUpdatedAt: staticFirebase.firestore.FieldValue.serverTimestamp()
          });
         } else {
          this.userClipHistoryRef.doc(this.state.clipId).set({
            score: scoreReceived,
            createdAt: staticFirebase.firestore.FieldValue.serverTimestamp(),
            lastUpdatedAt: staticFirebase.firestore.FieldValue.serverTimestamp()
          });
         }
       })
      console.log('user data upload seems good too..');
    } catch(err) {
      console.log(err);
    }
  }

  getNextClip = async () => {
    this.saveToDb();
    await this.setState({
      clipId: '1',
      url: '',
      existingTags: {},
      currentTags: {},
      loading: true
    });
    this.loadFromDb(this.state.clipId);
  }

  componentWillUnmount() {
    this.saveToDb();
  }

  render() {
    const { url, currentTags, existingTags } = this.state;
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
              onKeyPress={this.handleKeyPress}
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