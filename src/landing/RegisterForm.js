import React, { Component } from "react";
import firebase from "../base";
import {
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Input,
  InputLabel,
  Link
} from "@material-ui/core";
import PrivacyPage from "../info/PrivacyPage";
import { withRouter } from "react-router-dom";

class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openForm: false,
      agreePolicy: false,
      openPolicy: false,
      policyError: false,
      emailError: false,
      passwordError: false,
      password2Error: false,
      usernameError:false
    };
  }

  handleClickOpenForm = () => {
    this.setState({ openForm: true });
  };

  handleCloseForm = () => {
    this.setState({ openForm: false, agreePolicy: false });
  };

  handleAgreePolicy = event => {
    this.setState({ agreePolicy: event.target.checked });
    if (event.target.checked) {
      this.setState({ policyError: false });
    }
  }

  handleClickOpenPolicy = () => {
    this.setState({ openPolicy: true });
  };

  handleClosePolicy = () => {
    this.setState({ openPolicy: false });
  };

  handleKeyPress = event => {
    if (event.key === 'Enter') {
      document.getElementById("submitButton").click();
    }
  }

  validateForm = () => {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const password2 = document.getElementById("password2").value;
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    if (re.test(email)) {
      this.setState({ emailError: false });
    } else {
      this.setState({ emailError: true });
    }

    if (password.length < 6) {
      this.setState({ passwordError: true });
    } else {
      this.setState({ passwordError: false });
    }

    if (password !== password2) {
      this.setState({ password2Error: true });
    } else {
      this.setState({ password2Error: false });
    }

    if(username == ''){
      this.setState({usernameError: true});
    }else{
      this.setState({usernameError: false});
    }
    
    if (!this.state.agreePolicy) {
      this.setState({ policyError: true });
    }

    return ({ email, password, username });
  }

  handleSubmit = async event => {
    const { history } = this.props;
    event.preventDefault();
    // validation part
    const { email, password, username } = await this.validateForm();
    const db = firebase.firestore();

    if (!this.state.policyError && !this.state.emailError && !this.state.passwordError && !this.state.password2Error && !this.state.usernameError) {
      // create User in firebase
      try {
        const user = await firebase
          .auth()
          .createUserWithEmailAndPassword(email, password);
        console.log(user);
        if (user) {
          // to create a new user document
          db.collection('users').doc(firebase.auth().currentUser.uid).set({
            username: username,
            score: 0
          });
          this.handleCloseForm();
          history.push("/main");
        }
      } catch(err) {
        alert(err);
      }
    }
  }

  render() {
    return (
      <Grid item>
        <Button
          color="default"
          variant="outlined"
          onClick={this.handleClickOpenForm}
        >Register</Button>
        <Dialog
          open={this.state.openForm}
          onClose={this.handleCloseForm}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Register</DialogTitle>
          <DialogContent>
            <Grid container direction="column" spacing={16}>
              {/* <Grid item sm={12} md={12} lg={12}>
                <FormControl margin="normal" fullWidth>
                  <InputLabel>Username</InputLabel>
                  <Input id="username" />
                </FormControl>
              </Grid> */}
              <Grid item>
                <FormControl margin="normal" fullWidth>
                  <InputLabel>Username</InputLabel>
                  <Input id="username" type="text" onKeyPress={this.handleKeyPress} />
                </FormControl>
                 {this.state.usernameError ? (
                  <FormHelperText error={true}>Must Enter Your Username.</FormHelperText>
                ) : ""}
              </Grid>
              <Grid item>
                <FormControl margin="normal" fullWidth>
                  <InputLabel>Email</InputLabel>
                  <Input id="email" type="email" onKeyPress={this.handleKeyPress} />
                </FormControl>
                {this.state.emailError ? (
                  <FormHelperText error={true}>Invalid email.</FormHelperText>
                ) : ""}
              </Grid>
              <Grid item>
                <FormControl margin="normal" fullWidth>
                  <InputLabel>Password</InputLabel>
                  <Input id="password" type="password" onKeyPress={this.handleKeyPress} />
                </FormControl>
                {this.state.passwordError ? (
                  <FormHelperText error={true}>Password should be more than 6 characters.</FormHelperText>
                ) : ""}
              </Grid>
              <Grid item>
                <FormControl margin="normal" fullWidth>
                  <InputLabel>Reenter password</InputLabel>
                  <Input id="password2" type="password" onKeyPress={this.handleKeyPress} />
                </FormControl>
                {this.state.password2Error ? (
                  <FormHelperText error={true}>Passwords didn't match.</FormHelperText>
                ) : ""}
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.agreePolicy}
                      onChange={this.handleAgreePolicy}
                    />
                  }
                  label={
                    <p>I accept the&nbsp;
                      <Link
                        component="button"
                        onClick={this.handleClickOpenPolicy}
                        style={{ fontSize: "1em" }}
                      >
                        Privacy Policy
                      </Link>
                    </p>
                  }
                />
                {this.state.policyError ? (
                  <FormHelperText error={true}>You have to accept the privacy policy.</FormHelperText>
                ) : ""}
                <Dialog
                  open={this.state.openPolicy}
                  onClose={this.handleClosePolicy}
                  maxWidth="md"
                  fullWidth
                  
                >
                  <DialogContent className="privacy-in-dialog">
                    <PrivacyPage />
                  </DialogContent>
                </Dialog>
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

export default withRouter(RegisterForm);