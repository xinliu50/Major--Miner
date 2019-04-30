import React, { Component } from "react";
import {
  Card,
  CardContent,
  CardActions,
  IconButton
} from "@material-ui/core";
import PlayArrow from "@material-ui/icons/PlayArrow";
import Group from "@material-ui/icons/Group";
import Person from "@material-ui/icons/Person";

class AudioCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seeOthers: false
    };
  }

  toggleSeeOtherTags = () => {
    this.setState({ seeOthers: !this.state.seeOthers });
  }

  render() {
    return (
      <Card className="audio-card">
        <CardContent>
          <h5>{this.props.clip}</h5>
          <p>Your tags: aaa, bbb</p>
          {this.state.seeOthers ? (
            <p>Other's tags: ccc, ddd</p>
          ) : ""}
        </CardContent>
        <CardActions style={{ paddingTop: "0" }}>
          <IconButton>
            <PlayArrow />
          </IconButton>
          <IconButton onClick={this.toggleSeeOtherTags}>
            {this.state.seeOthers ? (<Person />) : (<Group />)}
          </IconButton>
        </CardActions>
      </Card>
    );
  }
}

export default AudioCard;
