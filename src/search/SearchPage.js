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

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //resultArray: [0,1,2]
      //tagMap: {},
       topTags: [],
    };
  }
  componentDidMount(){
     // this.tagIDSet = new Set();

     this.topTags = [];
     this.tagMap = {};
     this.user = firebase.auth().currentUser;
     this.db = firebase.firestore();
     this.currentId = firebase.auth().currentUser.uid;
     //this.userRef = this.db.collection('users').doc(this.currentId);
     this.userRef = this.db.collection('users');
     
     this.getAllTag();
    
    
  }

  getAllTag = async () => {
    var userIdSnapshot = await this.userRef.get();
    for(const id of userIdSnapshot.docs){
       var IDsnapshot = await this.db.collection('users').doc(id.id).collection('clipHistory').get();
       for(const clipID of IDsnapshot.docs){
          if(!Object.keys(this.tagMap).includes(clipID.id)){
                      this.tagMap[clipID.id] = {
                         //ID: clipID.id,
                         innerMap: {},
                      } 
                      var tagsnapshot = await this.db.collection("audios").doc(clipID.id).collection("tags").get();
                      for(const doc of tagsnapshot.docs){
                          if(Object.keys(this.tagMap[clipID.id].innerMap).includes(doc.id)){
                              (this.tagMap[clipID.id].innerMap)[doc.id] = //{
                                ///count: 
                                (this.tagMap[clipID.id].innerMap.count + doc.data().count);
                              //}
                          }else{
                             (this.tagMap[clipID.id].innerMap)[doc.id] = // {
                                //count: 
                                doc.data().count;
                              //}
                          }
                      }           
                  }
               }
       }

       for (let key in this.tagMap["0"]) {
          console.log(key);
        }
        var id = this.tagMap["0"].innerMap;
        console.log(id);
       console.log(this.tagMap);
        this.getTagList(this.tagMap);
    }

    getTagList = async tagMap => {
      var tempmap = new Map();
      var ls = [];
        for(let clipId in tagMap){
           ls.push(clipId);
            for(let map in tagMap[clipId].innerMap){
                //for(let tag in map){
                  if(tempmap.has(map)){
                    tempmap.set(map,tempmap.get(map)+tagMap[clipId].innerMap[map]);
                  }else{
                     tempmap.set(map,tagMap[clipId].innerMap[map]);
                  }
                   //let set = {tag: map, count: tagMap[clipId].innerMap[map], ls};
                   //this.topTags.push(set);
                //}
            }
        }
        console.log(this.topTags);
        console.log(tempmap);
        await this.setState({topTags: this.topTags});
    }
  
  getTagHistory =  async ()  => {
     this.userRef.get().then(useIdSnapshot => {
      // id => users have clipHistories
         useIdSnapshot.forEach(id =>{
           this.db.collection('users').doc(id.id).collection('clipHistory').get().then(IDsnapshot => {
               //clipIDs from clipHistories of all users
               IDsnapshot.forEach(clipID =>{
                  if(!Object.keys(this.tagMap).includes(clipID.id)){
                      // console.log(typeof clipID.id);
                      this.tagMap[clipID.id] = {
                         // ID: clipID.id,
                         innerMap: {},
                      }            
                      this.db.collection("audios").doc(clipID.id).collection("tags").get().then(tagsnapshot => {
                        tagsnapshot.forEach(doc =>{
                          if(Object.keys(this.tagMap[clipID.id].innerMap).includes(doc.id)){
                              (this.tagMap[clipID.id].innerMap)[doc.id] = {
                                count: (this.tagMap[clipID.id].innerMap.count + doc.data().count),
                              }
                          }else{
                             (this.tagMap[clipID.id].innerMap)[doc.id] = {
                                count: doc.data().count,
                              }
                          }
                        });
                      })
                  }
               })
           })
           console.log(this.tagMap);

        })
     })
     


  }
  
  handleKeyPress = event => {
    if (event.key === 'Enter') {
      document.getElementById("searchButton").click();
    }
  }
  handleSubmit = () => {
      console.log("click");
  }

  handleListClick = (event,index) => {
     if(index == 0)
        this.props.history.push("/seachresult");
  }
  getList = (topTags) =>{
    return(
      <List>
        {topTags.map( (item,i) =>(
          <ListItem button = {true} key={i}>
            <ListItemText primary= {item.tag} onClick = {event => this.handleListClick(event, i)}/>
          </ListItem>
        ))}
      </List>
    );
  }
  render() {
    const {topTags} = this.state;
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