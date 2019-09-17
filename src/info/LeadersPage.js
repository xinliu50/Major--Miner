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
import staticFirebase from "firebase";
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
    //this.userRef = this.db.collection('users').doc(this.currentId);
    //this.todayLeader = [];
    //this.weekLeader = [];
    //this.totalLeader = [];
    this.getTotal();
    this.getDate();
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };
  getDate = async () => {
    const today = new Date();
    const todayTime = today.getMilliseconds();
    //console.log(todayTime);
    const withinAday = todayTime - 86400000;
    //console.log(withinAday);
   /* this.db.collection("users").doc('ZA0NiS6bWLU29qwV5Uzj2roh8P53').collection("clipHistory").where('lastUpdatedAt','>',0).get()
      .then(time => {
        time.forEach(day => {
           console.log(day.id);
        });
       

      })*/
      this.db.collection("users").doc('ZA0NiS6bWLU29qwV5Uzj2roh8P53').collection("clipHistory").doc('2').get()
        .then(time => {
          console.log(time.data().lastUpdatedAt.toDate());
           console.log(time.data().lastUpdatedAt.toMillis());
            console.log(time.data().lastUpdatedAt);
        })
       
     
      //for(const documentsnapshot of time.docs){

        //console.log(documentsnapshot.id);
      //}
   // const day = time.data().lastUpdatedAt.toDate();
    //console.log(day);
    //console.log(time.lastUpdatedAt);
  }
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
    await this.setState({totalLeader: totalLeader});
      console.log(this.state.totalLeader);
  };
 /* getTabContent = () => {
    let content;
    switch(this.state.value) {
      case 0://TODAY
        content = [{ id: 'aaa', score: 25 }, { id: 'bbb', score: 14 }, { id: 'ccc', score: 10 }, { id: 'ddd', score: 4 }];
        break;
      case 1://THIS WEEK
        content = [{ id: 'aaa', score: 25 }, { id: 'bbb', score: 18 }, { id: 'ddd', score: 12 }, { id: 'ccc', score: 10 }];
        break; 
      case 2://TOTAL
        content = [{ id: 'aaa', score: 32 }, { id: 'bbb', score: 23 }, { id: 'ddd', score: 16 }, { id: 'ddd', score: 10 }];
        break;
      default:
        content = [];
    }*/
    getTabContent = totalLeader => {
     
      let content;
      switch(this.state.value){
        case 0: 
          content = totalLeader;//this.todayTable();
          break;
        case 1:
          content = [{ id: 'aaa', score: 25 }, { id: 'bbb', score: 18 }, { id: 'ddd', score: 12 }, { id: 'ccc', score: 10 }];//this.weekTable();
          break;
        case 2:
          content = [{ id: 'aaa', score: 25 }, { id: 'bbb', score: 18 }, { id: 'ddd', score: 12 }, { id: 'ccc', score: 10 }];//this.totalTable();
          break;
        default:
          content = [];
      }
    
    
  /*totalTable = () => {
    return(



    );
  }*/
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
    const {totalLeader} = this.state;
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
          {this.getTabContent(totalLeader)}
        </div>
      </div>
    )
  }
}

export default LeadersPage;