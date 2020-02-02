import React, { Component } from "react";
import {
  Card,
  CardContent,
  CardActions,
  IconButton
} from "@material-ui/core";
import PlayArrow from "@material-ui/icons/PlayArrow";
import Pause from "@material-ui/icons/Pause";
import Group from "@material-ui/icons/Group";
import Person from "@material-ui/icons/Person";

class AudioCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      play: false,
      seeOthers: false
    };
  }

  componentDidMount() {
    this.setupAudioContext();
  }
  setupAudioContext = () => {
    try{
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = 15;
      this.gainNode.connect(this.audioContext.destination);
    }catch(error){
      console.log(error);
    }

    this.audio = new Audio(this.props.url);
    this.audioSource = this.audioContext.createMediaElementSource(this.audio);
    this.audio.crossOrigin = "anonymous";
    this.audioSource.connect(this.gainNode);
    this.audioContext.resume().then(() => {
      console.log('Playback resumed successfully');
    })
    this.audio.onended = () => {
      this.setState({ play: false });
      this.props.togglePlay(false);
    }
  }

  toggleAudio = () => {
    if (this.state.play === false) {
      try {
        this.setupAudioContext();
      } catch(err) {
        console.log(err);
      }
    }
    this.state.play ? this.audio.pause() : this.audio.play();
    this.setState({ play: !this.state.play });
    this.props.togglePlay(!this.state.play);
  }

  toggleSeeOtherTags = () => {
    this.setState({ seeOthers: !this.state.seeOthers });
  }

  componentWillUnmount() {
    this.gainNode.disconnect();
    this.audioSource.disconnect();
  }
  render() {
    return (
      <Card className="audio-card">
        <CardContent>
          <h5>{this.props.clip}</h5>

          <p>Your tags: {this.props.TAG || 'loading'}</p>

         {this.state.seeOthers ? (
           <p>Other's tags: {this.props.other || 'Loading'} </p>) : ""}
        </CardContent>
        <CardActions style={{ paddingTop: "0" }}>
          <IconButton onClick={this.toggleAudio}>
            {this.state.play ? (<Pause />) : (<PlayArrow />)}
          </IconButton>
          <IconButton onClick={this.toggleSeeOtherTags}>
            {this.state.seeOthers ? (<Person />) : (<Group />)}
          </IconButton>
        </CardActions>
        <h5>birds: 5 times</h5>
      </Card>
    );
  }
}

export default AudioCard;
