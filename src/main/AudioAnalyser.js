import React, { Component } from "react";
import { Grid, IconButton } from "@material-ui/core";
import PlayArrow from "@material-ui/icons/PlayArrow";
import Pause from "@material-ui/icons/Pause";
import AudioVisualizer from "./AudioVisualizer";
import testAudio from "../test-audio.mp3";

// TODO: audio play only after recompile, no sound after refresh

class AudioAnalyser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioData: new Uint8Array(0),
      play: false
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
    this.audio = new Audio(testAudio);
    this.audioSource = this.audioContext.createMediaElementSource(this.audio);
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
    this.setupAudioContext();
  }

  tick() {
    this.analyser.getByteTimeDomainData(this.dataArray);
    this.setState({ audioData: this.dataArray });
    this.rafId = requestAnimationFrame(this.tick);
  }

  toggleAudio = () => {
    if (this.state.play === false) {
      this.setupAudioContext();
    }
    this.setState({ play: !this.state.play });
    this.state.play ? this.audio.pause() : this.audio.play();
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
