import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  IconButton,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem
} from "@material-ui/core";
import AccountCircle from '@material-ui/icons/AccountCircle';

class AccountButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  }

  handleClose = event => {
    // if (this.anchorEl.contains(event.target)) {
    //   return;
    // }

    this.setState({ open: false });
  }

  render() {
    const { open } = this.state;
    return (
      <div>
        <IconButton
          buttonRef={node => {
            this.anchorEl = node;
          }}
          aria-owns={open ? "account-menu" : undefined}
          aria-haspopup="true"
          onClick={this.handleToggle}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Popper
          open={open}
          anchorEl={this.anchorEl}
          placement="bottom-end"
          transition
          disablePortal
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps}>
              <Paper>
                <ClickAwayListener onClickAway={this.handleClose}>
                  <MenuList>
                    <MenuItem onClick={this.handleClose}>
                      <Link to="/main">Summary</Link>
                    </MenuItem>
                    <MenuItem onClick={this.handleClose}>
                      Change password
                    </MenuItem>
                    <MenuItem onClick={() => {
                      this.props.logout();
                      this.handleClose();
                    }}>Logout</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    );
  }
}

export default AccountButton;
