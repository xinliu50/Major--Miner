import React, { Component } from "react";
import { Grid, IconButton } from "@material-ui/core";
import PlayArrow from "@material-ui/icons/PlayArrow";
import Pause from "@material-ui/icons/Pause";
import AudioVisualizer from "./AudioVisualizer";
import firebase from "../base";
import staticFirebase from "firebase";

class AudioAnalyser extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      audioData: new Uint8Array(0),
      play: false,
      url: '',
      firstPlay: 0
    };
    this.tick = this.tick.bind(this);
  }

  setupAudioContext = () => {
    // set up audioContext
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 15;
    this.gainNode.connect(this.audioContext.destination);

    // set up audio
    this.audio = new Audio(this.props.url);
    this.audioSource = this.audioContext.createMediaElementSource(this.audio);
    this.audio.crossOrigin = "anonymous";
    this.audioSource.connect(this.gainNode);

    // set up audio analyser
    this.analyser = this.audioContext.createAnalyser();
    this.gainNode.connect(this.analyser);
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.rafId = requestAnimationFrame(this.tick);

    // put 'play' state to false when the sound ends
    this.audio.onended = () => {
      if (this._isMounted) {
        this.setState({ play: false, firstPlay: 0});
      }
    }
  }

  componentDidMount() {
    this._isMounted = true;
    this.setupAudioContext();
    this.user = firebase.auth().currentUser;
    this.db = firebase.firestore();
    this.currentId = firebase.auth().currentUser.uid;
  }

  tick() {
    this.analyser.getByteTimeDomainData(this.dataArray);
    if (this._isMounted) {
      this.setState({ audioData: this.dataArray });
    }
    this.rafId = requestAnimationFrame(this.tick);
  }

  toggleAudio = () => {
    this.audioContext.resume().then(()=>{
      console.log('Playback resumed successfully');
      if (this.state.firstPlay === 0) {
        try {
          this.setupAudioContext();//first time hit play, set up audio context
          console.log("props!" , this.props.clipId);
          var d = Date.now();
          this.db.collection('Randomize').doc(this.props.clipId).set({//this clip has been seen once by this user
            count:  staticFirebase.firestore.FieldValue.increment(1),
            updated: staticFirebase.firestore.FieldValue.serverTimestamp(),
            millis: d,
            userId: staticFirebase.firestore.FieldValue.arrayUnion(this.currentId)
          },{merge:true});
        } catch(err) {
          console.log(err);
        }
    }
    this.state.play ? this.audio.pause() : this.audio.play();
    if (this._isMounted) {
      this.setState({ play: !this.state.play });
    }
    this.state.firstPlay ++;
    });
  };

  componentWillUnmount() {
    cancelAnimationFrame(this.rafId);
    this.analyser.disconnect();
    this.gainNode.disconnect();
    this.audioSource.disconnect();
    this._isMounted = false;
  }

  render() {
    return (
      <Grid item sm={6} md={6} lg={6} className="canvas-container">
        <IconButton
          className="play-button"
          onClick={this.toggleAudio}
          disableRipple
          disableTouchRipple
        >
          {this.state.play ? (
            <Pause style={{ fontSize: "180px" }} />
          ) : (
            <PlayArrow style={{ fontSize: "180px" }} />
          )}
        </IconButton>
        {this.state.play ? (
          <AudioVisualizer audioData={this.state.audioData} />
        ) : (
          <canvas width="300" height="300" className="audio-canvas" />
        )}
      </Grid>
    );
  }
}

export default AudioAnalyser;