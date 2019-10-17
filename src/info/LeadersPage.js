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
import firebase from "../base";
class LeadersPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      todayLeader: [],
      weekLeader: [],
      totalLeader: []
    };
  }
  componentDidMount(){
    this.user = firebase.auth().currentUser;
    this.db = firebase.firestore();
    this.currentId = firebase.auth().currentUser.uid;
    this.getTotal();
    this.getToday();
    this.getWeek();
  }
  month = () => {
     var month = new Array();
      month[0] = "January";
      month[1] = "February";
      month[2] = "March";
      month[3] = "April";
      month[4] = "May";
      month[5] = "June";
      month[6] = "July";
      month[7] = "August";
      month[8] = "September";
      month[9] = "October";
      month[10] = "November";
      month[11] = "December";
      return month;
  }
  handleChange = (event, value) => {
    this.setState({ value });
  };
  oneDayRange = () => {
    var monthArray = this.month();
    var d = new Date();
    var todayDate = d.getDate()+'';
    var month = monthArray[d.getMonth()]+' ';
    var year = d.getFullYear()+'';
    const parseStringToday = month+todayDate+', '+year;
    var today = Date.parse(parseStringToday);//millionSeconds for 00:00:00 today
    console.log("today: ", today);
    return today+ 3600000 * 24;
  }
  firstOfWeekRange = () => {
    var monthArray = this.month();
    var d = new Date();
    var first = d.getDay();
    var todayDate = d.getDate()+'';
    var month = monthArray[d.getMonth()]+' ';
    var year = d.getFullYear()+'';
    const parseStringToday = month+todayDate+', '+year;
    var today = Date.parse(parseStringToday);
    console.log("first day of the week", first);

    var firstOfWeek = today - (first-1)*3600000*24; //Database collection saved a day after current day's millionseconds
    return firstOfWeek;
  }
  //get Total Leaders
  getTotal = async () => {
    const totalLeader = [];
    const userSnapshot = await this.db.collection('users').where("score", ">", 0).get();
    for(const doc of userSnapshot.docs){
      let set = {username: doc.data().username, score: doc.data().score, userId: doc.id};
        totalLeader.push(set);
    } 
    totalLeader.sort((a,b) => {
      return b.score-a.score;
    })
    totalLeader.splice(10,totalLeader.length);//only display first 10th user
    await this.setState({totalLeader: totalLeader});
      console.log(this.state.totalLeader);
  };
  //get Today's leaders
  getToday = async () => {
    const todayLeader = [];
    var todayRange = this.oneDayRange();
    var todayUserSnapshot = await this.db.collection('scoreRecord').where('millis', '==', todayRange).get();
    for(const user of todayUserSnapshot.docs){
      var score = await this.db.collection('scoreRecord').doc(user.id).collection('score').where('millis','==',todayRange).get();
      let set = {username: user.data().username, score: score.docs[0].data().score, userId: user.id};
      todayLeader.push(set);
    }
    todayLeader.sort((a,b) => {
      return b.score-a.score;
    })
    todayLeader.splice(10,todayLeader.length);
    await this.setState({todayLeader: todayLeader});
    console.log("today: ", new Date(todayRange));
    console.log("today!!!leader: ", todayLeader);
  }
  //get this week's leaders
  getWeek = async () => {
    const weekLeader = [];
    var thisWeekRange = this.firstOfWeekRange();
    console.log("thisWeekRange:  ", thisWeekRange);
    console.log("Sunday", new Date(thisWeekRange));
    var weekUserSnapshot = await this.db.collection('scoreRecord').where('millis', '>=', thisWeekRange).get();
    for(const user of weekUserSnapshot.docs){
      var totalScore=0;
      var scoreSnapshot = await this.db.collection('scoreRecord').doc(user.id).collection('score').where('millis', '>=', thisWeekRange).get();
      for(const score of scoreSnapshot.docs){
        totalScore += score.data().score;
      }
      let set = {username: user.data().username, score: totalScore, userId: user.id};
      weekLeader.push(set);
    }
    weekLeader.sort((a,b) => {
      return b.score-a.score;
    })
    weekLeader.splice(10,weekLeader.length);
    await this.setState({weekLeader: weekLeader});
    console.log("weekLeader: ", weekLeader);
  }
  getTabContent = (todayLeader, weekLeader, totalLeader) => {
     
      let content;
      switch(this.state.value){
        case 0: 
          content = todayLeader;//this.todayTable();
          break;
        case 1:
          content = weekLeader;//this.weekTable();
          break;
        case 2:
          content = totalLeader;//this.totalTable();
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
          {content.map((user,i) => (
            <TableRow key={user.userId}>
              <TableCell align="center" >{user.username}</TableCell>
              <TableCell align="center">{user.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  render() {
    const {todayLeader,weekLeader,totalLeader} = this.state;
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
          {this.getTabContent(todayLeader,weekLeader,totalLeader)}
        </div>
      </div>
    )
  }
}

export default LeadersPage;