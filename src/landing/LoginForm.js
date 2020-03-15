import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import firebase from "../base";
import {
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  Input,
  InputLabel
} from "@material-ui/core";

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      open: false
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  handleClickOpen = () => {
    if (this._isMounted) {
      this.setState({ open: true });
    }
  };

  handleClose = () => {
    if (this._isMounted) {
      this.setState({ open: false });
    }
  };

  handleKeyPress = event => {
    if (event.key === 'Enter') {
      document.getElementById("submitButton").click();
    }
  }

  handleSubmit = async event => {
    event.preventDefault();
    try {
      const user = await firebase
        .auth()
        .signInWithEmailAndPassword(document.getElementById("email").value, document.getElementById("password").value);
        console.log(user);
        if (user) {
          this.handleClose();
          this.props.history.push("/main/clip");
        }
    } catch (err) {
      alert(err);
    }
  }
  
  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <Grid item>
        <Button color="default" variant="outlined" onClick={this.handleClickOpen}>Login</Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Login</DialogTitle>
          <DialogContent>
            <Grid container direction="column" spacing={16}>
              <Grid item>
                <FormControl margin="normal" fullWidth>
                  <InputLabel>Email</InputLabel>
                  <Input id="email" onKeyPress={this.handleKeyPress} />
                </FormControl>
              </Grid>
              <Grid item>
                <FormControl margin="normal" fullWidth>
                  <InputLabel>Password</InputLabel>
                  <Input id="password" type="password" onKeyPress={this.handleKeyPress} />
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button id="submitButton" onClick={this.handleSubmit}>Submit</Button>
          </DialogActions>
        </Dialog>
      </Grid>
    );
  }
}

export default withRouter(LoginForm);