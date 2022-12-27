import axios from "axios";
import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
// Load User model
//const { User, Vendor, Buyer } = require("../models/Users");
var host = window.location.hostname

var token = localStorage.getItem("token");
if (token) {
  var decoded = jwt_decode(token);
}


console.log(decoded);

//console.log(localStorage.getItem("token"));


const Profile = (props) => {
  const [details, setDetails] = useState([]);
  const [orders, setOrders] = useState([]);
 
  /* 
  const resetInputs = () => {
    setName("");

  }; */

  const countPending = () => {
      let c =0;
   for(let i in orders){
      if(orders[i].status!="COMPLETED" && orders[i].status!="REJECTED"){
        c++;
      }
   }
   return c
 } 
 const countCompleted = () => {
    let c =0;
 for(let i in orders){
    if(orders[i].status==="COMPLETED"){
      c++;
    }
 }
 return c
} 
const Top5 = () => {
    let dict = {}
 for(let i in orders){
   if(!(orders[i].food.name in dict)){
       dict[orders[i].food.name]=1
   }
   else{
    dict[orders[i].food.name]+=1
   }
 }
 var items = Object.keys(dict).map(function(key) {
    return [key, dict[key]];
  });
 items.sort(function(first, second) {
    return second[1] - first[1];
  });
  console.log(items)
 return items.slice(0, 5)
} 
 
useEffect(() => {
  axios
    .post("http://"+host+"/api/food/vendorOrder", {
      id: decoded
    }) 
    .then((res) => {
      setDetails(res.data);
      setOrders(res.data.vendorOrders);
      console.log(res.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}, []
);


return <div>
  {details != undefined && token && <Grid container
    spacing={0}
    direction="column"
    alignItems="center"
    justify="center"
    style={{ minHeight: '100vh' }}>
    <Card sx={{ maxWidth: 345 }}>
      {/* <CardMedia
        component="img"
        alt="green iguana"
        height="140"
        image="/static/images/cards/contemplative-reptile.jpg"
      /> */}

      <CardContent>
      <Typography gutterBottom variant="h5" component="div">
          Top Five Item:
          {Top5().map((value) => (
                       <Typography gutterBottom variant="h5" component="div">{value[0]}  </Typography>
                      ))}
        </Typography>
        <Typography gutterBottom variant="h5" component="div">
          Orders Placed: {orders.length}
        </Typography> 
        <Typography gutterBottom variant="h5" component="div">
          Pending Orders:{countPending()}
        </Typography>
        <Typography gutterBottom variant="h5" component="div">
        Completed Orders: {countCompleted()}
        </Typography> 
        
      </CardContent>

    </Card>
    
    </Grid>

  }
 
</div>;
};

export default Profile;
