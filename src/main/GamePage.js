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
  constructor(props) {
    super(props);
    this.state = {
      tags: []
    };
  }

  handleSubmit = () => {
    const newTags = document.getElementById("tags").value.split(",");
    const filteredTags = newTags.filter(tag => (!this.state.tags.includes(tag)));
    const tags = this.state.tags.concat(filteredTags);
    this.setState({ tags: tags });
    document.getElementById("tags").value = "";
  }

  handleKeyPress = event => {
    if (event.key === 'Enter') {
      document.getElementById("submitButton").click();
    }
  }

  render() {
    console.log(this.state.tags);
    return (
      <Grid container className="game-container" direction="column" alignItems="center" spacing={16}>
        <Grid item>
          <h1>Describe this clip</h1>
        </Grid>
        <AudioAnalyser />
        <Grid item sm={10} md={6} lg={8}>
          <p>{this.state.tags.map(tag => (tag + " "))}</p>
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
          </FormControl>
        </Grid>
      </Grid>
    );
  }
}

export default GamePage;