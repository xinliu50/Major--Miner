import React, { Component } from "react";
import {
  AppBar,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from "@material-ui/core";

class LeadersPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  getTabContent = () => {
    let content;
    switch(this.state.value) {
      case 0:
        content = [{ id: 'aaa', score: 25 }, { id: 'bbb', score: 14 }, { id: 'ccc', score: 10 }, { id: 'ddd', score: 4 }];
        break;
      case 1:
        content = [{ id: 'aaa', score: 25 }, { id: 'bbb', score: 18 }, { id: 'ddd', score: 12 }, { id: 'ccc', score: 10 }];
        break; 
      case 2:
        content = [{ id: 'aaa', score: 32 }, { id: 'bbb', score: 23 }, { id: 'ddd', score: 16 }, { id: 'ddd', score: 10 }];
        break;
      default:
        content = [];
    }
    return (
      <Table className="leaderboard">
        <TableHead>
          <TableRow>
            <TableCell align="center">User</TableCell>
            <TableCell align="center">Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {content.map(user => (
            <TableRow>
              <TableCell align="center">{user.id}</TableCell>
              <TableCell align="center">{user.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  render() {
    return (
      <div>
        <h1>Leaders</h1>
        <div className="table-container">
          <AppBar position="static">
            <Tabs
              value={this.state.value}
              onChange={this.handleChange}
              centered
            >
              <Tab label="Today" />
              <Tab label="This week" />
              <Tab label="Total" />
            </Tabs>
          </AppBar>
          {this.getTabContent()}
          </div>
      </div>
    )
  }
}

export default LeadersPage;