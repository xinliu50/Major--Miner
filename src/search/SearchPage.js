import React, { Component } from "react";
import {
  Grid,
  Button
} from "@material-ui/core";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import firebase from "../base";

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
      let tagList = [];
      const myPromise = await this.db.collection('tagList').orderBy("count","desc").limit(10).get();
      for(const p of myPromise.docs)
         tagList.push({tag: p.id, count: p.data().count});
     return tagList;
  }
  handleKeyPress = event => {
    if (event.key === 'Enter') {
      document.getElementById("searchButton").click();
    }
  }
  handleSubmit = () => {
     let searchItem = document.getElementById("searchItem").value;
     this.handleListClick(null,searchItem);
  }
  //when each tag has been clicked..
  handleListClick = async (event,tag) => {
    this.props.history.push({
        pathname: '/searchresult/'+ tag
    })
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