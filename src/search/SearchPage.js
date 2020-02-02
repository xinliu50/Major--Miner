import React, { Component } from "react";
import { useState } from 'react';
import { Link } from "react-router-dom";
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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import ButtonBase from '@material-ui/core/ButtonBase';

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resultArray: [0,1,2]
    };
  }
  componentDidMount(){

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
  getList = (arr) =>{
    return(
      <List>
        {this.state.resultArray.map(key =>(
          <ListItem button = {true}>
            <ListItemText primary="Single-line item" onClick = {event => this.handleListClick(event, key)}/>
          </ListItem>
        ))}
      </List>
    );
  }
  render() {
    const {resultArray} = this.state;
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
                 {this.getList(resultArray)}                
              </div>
          </Grid>
        <Grid item>
          	<Link to="/seachresult">SearchResult!</Link>
      	</Grid>        
        <Grid item>
          	<Link to="/main/clip">Play game!</Link>
      	 </Grid>
      	  <Grid item> 		
          	<Link to="/main/clip">Play game!</Link>
      	 </Grid>
      	  <Grid item>      		
          	<Link to="/main/clip">Play game!</Link>
      	 </Grid>
      	  <Grid item>
          	<Link to="/main/clip">Play game!</Link>
      	 </Grid>
      	  </Grid>
    )
  }
}

export default SearchPage;