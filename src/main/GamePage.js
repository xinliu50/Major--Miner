import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Grid,
  FormControl,
  Input,
  InputLabel,
  InputAdornment,
  IconButton,
  FormHelperText
} from "@material-ui/core";
import Send  from "@material-ui/icons/Send";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import AudioAnalyser from "./AudioAnalyser";
import firebase from "../base";

// TODO: firebase.firestore.FieldValue methods not available, why?

class GamePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clipId: '2',
      url: '',
      existingTags: {},
      currentTags: {}
    };
  }

  async componentDidMount() {
    this.db = firebase.firestore();
    this.audioRef = this.db.collection('audios').doc(this.state.clipId);
    this.audioTagRef = this.audioRef.collection('tags');
    // this.increment = firebase.firestore.FieldValue.increment(1);
    try {
      // load url
      const doc = await this.audioRef.get();
      const url = doc.data().Url;
      console.log(url);

      // load existing tags
      const tags = await this.audioTagRef.get();
      const existingTags = {};
      tags.forEach(tag => (existingTags[tag.id] = tag.data().Count));
      await this.setState({ url, existingTags });
    } catch(err) {
      console.log(err);
    }
  }

  handleSubmit = () => {
    const newTags = document.getElementById("tags").value.toLowerCase().replace(/\s/g,'').split(",");
    const filteredTags = newTags.filter(tag => (!Object.keys(this.state.currentTags).includes(tag)));
    filteredTags.forEach(tag => {
      if (Object.keys(this.state.existingTags).includes(tag)) {
        this.setState(prevState => ({ currentTags: {...prevState.currentTags, [tag]: this.state.existingTags[tag] + 1 }}));
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

  // componentWillUnmount() {
  //   Object.keys(this.state.currentTags).forEach(tag => {
  //     if (this.state.currentTags[tag] > 1) {
  //       this.audioTagRef.doc(tag).update({
  //         Count: this.increment,
  //         UserId: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid)
  //       })
  //     } else {
  //       this.audioTagRef.doc(tag).set({
  //         Count: this.state.currentTags[tag],
  //         UserId: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid)
  //       })
  //     }
  //   })
  // }

  render() {
    const { url, currentTags, existingTags } = this.state;
    console.log('existing tags: ', existingTags);
    console.log('current tags: ', currentTags);
    return (
      <Grid container className="game-container" direction="column" alignItems="center" spacing={16}>
        <Grid item>
          <h1>Describe this clip</h1>
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
          <AudioAnalyser url={url} />
          <Grid item sm={3} md={3} lg={3}>
            <IconButton id="nextClip" style={{ "borderRadius": "0" }}>
              Next Clip
              <KeyboardArrowRight />
            </IconButton>
          </Grid>
        </Grid>
        <Grid item sm={10} md={6} lg={8}>
          {Object.keys(currentTags).map((tag, i) => {
            if (currentTags[tag] === 1) {
              return (<span key={i} className="gray">{tag}&nbsp;</span>)
            } else if (currentTags[tag] === 2) {
              return (<i key={i}>{tag}&nbsp;</i>)
            } else if (currentTags[tag] > 2) {
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