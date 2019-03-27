import React, { Component } from "react";
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
    this.state = {
      open: false
    };
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSubmit = event => {
    event.preventDefault();
    console.log(document.getElementById("username").value);
    console.log(document.getElementById("password").value);
    this.handleClose();
  }

  render() {
    return (
      <Grid item>
        <Button color="default" variant="contained" onClick={this.handleClickOpen}>Login</Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Login</DialogTitle>
          <DialogContent>
            <Grid container direction="column" spacing="16">
              <Grid item>
                <FormControl margin="normal" fullWidth>
                  <InputLabel>Username</InputLabel>
                  <Input id="username" />
                </FormControl>
              </Grid>
              <Grid item>
                <FormControl margin="normal" fullWidth>
                  <InputLabel>Password</InputLabel>
                  <Input id="password" type="password" />
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleSubmit}>Submit</Button>
          </DialogActions>
        </Dialog>
      </Grid>
    );
  }
}

export default LoginForm;