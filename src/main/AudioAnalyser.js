import React, { Component } from "react";
import { Grid, IconButton } from "@material-ui/core";
import PlayArrow from "@material-ui/icons/PlayArrow";
import Pause from "@material-ui/icons/Pause";
import AudioVisualizer from "./AudioVisualizer";
// import testAudio from "../test-audio.mp3";
import firebase from "../base";

// TODO: get audio from firebase storage

class AudioAnalyser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioData: new Uint8Array(0),
      play: false,
      url: ''
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
    this.audio = new Audio(this.state.url);
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
      this.setState({ play: false });
    }
  }

  componentDidMount() {
    // get audio file from firebase storage
    const storage = firebase.storage();
    const storageRef = storage.ref();
    const filename = "USGS_20160613_234225_2820m_00s__2880m_00s_28m_00s__30m_00s_01m_10s__01m_20s.mp3";
    storageRef.child("Audios").child(filename).getDownloadURL().then(url => {
      this.setState({ url: url });
      this.setupAudioContext();
    })    
  }

  tick() {
    this.analyser.getByteTimeDomainData(this.dataArray);
    this.setState({ audioData: this.dataArray });
    this.rafId = requestAnimationFrame(this.tick);
  }

  toggleAudio = async () => {
    if (this.state.play === false) {
      this.setupAudioContext();
    }
    this.state.play ? this.audio.pause() : this.audio.play();
    await this.setState({ play: !this.state.play });
  };

  componentWillUnmount() {
    cancelAnimationFrame(this.rafId);
    this.analyser.disconnect();
    this.gainNode.disconnect();
    this.audioSource.disconnect();
  }

  render() {
    return (
      <Grid item className="canvas-container">
        <IconButton
          className="play-button"
          onClick={this.toggleAudio}
          disableRipple
          disableTouchRipple
        >
          {this.state.play ? (
            <Pause style={{ fontSize: "7em" }} />
          ) : (
            <PlayArrow style={{ fontSize: "7em" }} />
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
