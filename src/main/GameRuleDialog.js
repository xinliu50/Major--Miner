import React, { Component } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  ButtonBase
} from "@material-ui/core";

//TODO: Read from DB to check if user is the first time to play game and pop up the game rule if true
class GameRuleDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      showExample: false
    };
  }

  toggleExample = () => {
    this.setState({ showExample: !this.state.showExample });
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false, showExample: false });
  }

  render() {
    return (
      <div>
        <Button onClick={this.handleClickOpen}>Rules</Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
        >
          <DialogTitle>Game Rules</DialogTitle>
          <DialogContent>
            <ul className="rule-list">
              <li>You will be presented with one randomly selected 10-second sound clip at a time.</li>
              <li>Describe that clip with a word or phrase (we call them "tags", here are some&nbsp;
              <ButtonBase
                onClick={this.toggleExample}
                style={{ "fontSize": "0.9em", "textDecoration": "underline" }}
              >examples</ButtonBase>
              ) and <b>press enter</b>.</li>
              {this.state.showExample ? (
                <div className="example-tags-list">
                <ul>
                  <li>
                    Animals – bird, songbird, sparrow, white-crowned sparrow,
                    gambel's white crowned sparrow
                  </li>
                  <li>
                    Human-generated sounds – airplane, helicopter, drilling,
                    engine, rumbling
                  </li>
                  <li>
                    Weather – wind, rain, thunder, gale, drizzle, dripping,
                    stream, river
                  </li>
                  <li>Scenes – quiet night, dawn chorus</li>
                  <li>
                    Time – summer, winter, june, august afternoon, night, dawn
                  </li>
                  <li>Feelings – calm, busy, soothing, loud, cacophonous</li>
                </ul>
                </div>
              ) :""}
              <li>If you're the first person to describe that clip with that tag, you'll get <b>2 points</b> when the next person tags that clip with that tag.</li>
              <li>If you're the second person to describe that clip with that tag, you'll get <i>1 point</i> immediately.</li>
              <li>If more than two people have already tagged that clip with that tag, you <span className="pink">won't get any points</span>, but you can try another tag.</li>
              <li>Tag each clip as many times as you want, follow one of the "next clip" links to listen to a new one.</li>
            </ul>
          </DialogContent>
          <p style={{ "margin": "0em 2em 2em" }}>You can come back to see the rules by clicking "rules" at the top-left corner.</p>
        </Dialog>
      </div>
    );
  }
}

export default GameRuleDialog;