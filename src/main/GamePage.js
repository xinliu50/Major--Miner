import React, { Component } from "react";
import {
  Grid,
  FormControl,
  Input,
  InputLabel,
  InputAdornment,
  IconButton
} from "@material-ui/core";
import Send  from "@material-ui/icons/Send";
import AudioAnalyser from "./AudioAnalyser";

class GamePage extends Component {
  handleSubmit = () => {
    console.log(document.getElementById("tags").value);
    document.getElementById("tags").value = "";
  }

  render() {
    return (
      <Grid container className="game-container" direction="column" alignItems="center" spacing={16}>
        <Grid item>
          <h1>Describe this clip</h1>
        </Grid>
        <AudioAnalyser />
        <Grid item sm={10} md={6} lg={8}>
          <FormControl margin="normal" fullWidth>
            <InputLabel>Input your tags...</InputLabel>
            <Input
              id="tags"
              type="text" 
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={this.handleSubmit}>
                    <Send />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Grid>
      </Grid>
    );
  }
}

export default GamePage;

// https://www.twilio.com/blog/audio-visualisation-web-audio-api--react
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API#Creating_a_waveformoscilloscope
// https://code.tutsplus.com/tutorials/how-to-create-an-audio-oscillator-with-web-audio-api--cms-29943