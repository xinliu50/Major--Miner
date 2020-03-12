import React, { Component } from "react";
import {
  Grid,
  DialogActions,
  Button,
  Input,
  InputLabel
} from "@material-ui/core";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import firebase from "../base";
import { Link } from "react-router-dom";


class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {  
      topTags: []
    };

  }
  
  async componentDidMount(){
     this.user = firebase.auth().currentUser;
     this.db = firebase.firestore();
     this.currentId = firebase.auth().currentUser.uid;
     this.userRef = this.db.collection('users');
     this.setState({
       topTags: await this.getTagList()
     })
  }
   getTagList = async () => {
      var tagList = [];
      var index = 0;
      const myPromise = await this.db.collection('tagList').orderBy("count","desc").limit(10).get();
      for(const p of myPromise.docs){
         tagList.push({tag: p.id, count: p.data().count});
          console.log(p.id + " ->" + p.data().count)
          index ++;
      }
     return tagList;
  }
  handleKeyPress = event => {
    if (event.key === 'Enter') {
      document.getElementById("searchButton").click();
    }
  }
  handleSubmit = () => {
     var searchItem = document.getElementById("searchItem").value;
     this.handleListClick(null,searchItem);
  }
  
  handleListClick = async (event,tag) => {
    const tagPromise = await this.db.collection('tagList').doc(tag).collection('clipIDs').get();
    const tagOrder = await this.db.collection('tagList').doc(tag).collection('clipIDs').orderBy('count','desc').get();
    var tagOrderArray = [];
    for(const p of tagOrder.docs){
       tagOrderArray.push({tag: p.id, count: p.data().count});
       console.log(p.id + " ->" + p.data().count)
   }
  
    this.MyTagMap = {};
    for(const p of tagPromise.docs){
        this.MyTagMap[p.id] = {};
        const tagObject = await this.db.collection('tagList').doc(tag).collection('clipIDs').doc(p.id).get();
        this.MyTagMap[p.id].url = tagObject.data().Url;
        this.MyTagMap[p.id].clip = tagObject.data().Title;
        this.MyTagMap[p.id].count = tagObject.data().count;
    }
    console.log(typeof(this.MyTagMap));
    
    console.log(this.MyTagMap);
    this.props.history.push({
      pathname: '/seachresult',
      state: {
        tag: tag,
        MyTag: this.MyTagMap,
        tagOrderArray: tagOrderArray,
        clipNumber: tagPromise.size
      }
    })
    console.log("tag:  " + tag);
  }
  getList = (topTags) =>{
    return(
      <List>
        {topTags.map( (item,tag) =>(
          <ListItem button = {true} key={item.tag}>
            <ListItemText primary= {item.tag} onClick = {event => this.handleListClick(event, item.tag)}/>
          </ListItem>
        ))}
      </List>
    );
  }
  render() {
    const{topTags} = this.state;
    return (
    	 <Grid container
          className="search-container"
          direction="column"
          alignItems="center">
        	 <Grid item>
          		<h1>Search Page</h1>
           </Grid>  
          <Grid item >
              <label>Search by tag: </label>
              <input
                id="searchItem"
                type="text"  
                onKeyPress={this.handleKeyPress}/>             
                <Button id="searchButton" onClick={this.handleSubmit}>search</Button>
          </Grid>
         <Grid item xs={12} md={6}>              
              <div >
                 {this.getList(topTags)}                
              </div>
          </Grid>
      </Grid>
    )
  }
}

export default SearchPage;