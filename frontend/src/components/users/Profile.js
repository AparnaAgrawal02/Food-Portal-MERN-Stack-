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
  const [edit, setEdit] = useState(0);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [contact, setContact] = useState(null);
  const [usertype, setuser] = useState(null);
  const [shopName, setshopName] = useState(null);
  const [batch, setBatch] = useState("");
  const [VendorField, setVendorField] = useState(-1);
  const [age, setAge] = useState(-1);
  const [password, setPassword] = useState(null);
  // const [showpassword, setshowPassword] = useState(false);
  const [start, setStart] = React.useState(null);
  const [end, setEnd] = React.useState(null);

  const onChangeUsername = (event) => {
    setName(event.target.value);
  };

  const onChangePassword = (event) => {
    setPassword(event.target.value);
  };
  const onChangeEmail = (event) => {
    setEmail(event.target.value);
  };
  const onChangeContact = (event) => {
    setContact(event.target.value);
  };
  const onChangeAge = (event) => {
    setAge(event.target.value);
  };
  const onChangeShopname = (event) => {
    setshopName(event.target.value);
  };
  const onChangeBatch = (event) => {
    setBatch(event.target.value);
  };
  const onChangeStartTime = (event) => {
    setStart(event);
  };
  const onChangeEndTime = (event) => {
    setEnd(event);
  };
  const resetInputs = () => {
    setName("");
    setEmail("");
    setuser("");
    setContact("");
    setVendorField(-1);
    setshopName("");
    setStart(null);
    setEnd(null);
    setBatch("");
    setAge("");
    setPassword("");

  };
  const onChangeEdit = (event) => {
    setEdit(1);

  }
   
  const onChangeSave = (event) => {
    
    event.preventDefault();
  
    const editUser = {
      id: details.user._id,
      vendor_id:details.vendor ? details.vendor._id: null,
      buyer_id: details.user.Buyer!=null ? details.buyer._id: null ,
      user: {
  
        name: (name ==null || name== "")? details.user.name:name,
        email: (email == null || email== "") ? details.user.email:email,
        contact: (contact ==null||contact =="") ? details.user.contact:contact,
        password: (password ==null||password == "") ? details.user.password:password
      }
    };
    console.log(isNaN(new Date(start).getHours()))
    editUser.vendor = !details.vendor ? null :{
      shopName: shopName  ==null ? details.vendor.shopName :shopName,
      
    timing :{
      startTime: (isNaN(new Date(start).getHours()))? details.vendor.timing.start:start,
      endTime: (isNaN(new Date(end).getHours()))? details.vendor.timing.end:end,
    }
  };
    editUser.buyer = !details.buyer ? null: {
      batch: batch=="" ? details.buyer.batch: batch,
      age: age==-1 ? details.buyer.age:age,
    };
    try {
      console.log("Data for  update : ", editUser);
      const response = axios.put("http://"+host+"/api/user/profile", editUser);
    } catch (error) {
      console.log(error);
    }
    resetInputs();
    setEdit(0);
    window. location. reload();
  }


/*  const resetInputs = () => {
   setEdit(0);
 } */
useEffect(() => {
  axios
    .post("http://"+host+"/api/user/profile", {
      id: decoded
    }) // unimplemented
    .then((response) => {
      setDetails(response.data);

      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}, []

);


return <div>
  {details != undefined && token && !edit && <Grid container
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
        {details.user ? <Typography gutterBottom variant="h3" component="div">
          {details.user.name}
        </Typography> : null}
        {details.user ? <Typography gutterBottom variant="h5" component="div">
          Email: {details.user.email}
        </Typography> : null}
        {details.user ? <Typography gutterBottom variant="h5" component="div">
          Contact: {details.user.contact}
        </Typography> : null}
        {details.buyer ? <Typography gutterBottom variant="h5" component="div">
          Age: {details.buyer.age}
        </Typography> : null}
        {details.buyer ? <Typography gutterBottom variant="h5" component="div">
          Batch: {details.buyer.batchName}
        </Typography> : null}
        {details.vendor ? <Typography gutterBottom variant="h5" component="div">
          ShopName: {details.vendor.shopName}
        </Typography> : null}
        {details.vendor ? <Typography gutterBottom variant="h5" component="div">
          Opening Time: {new Date(details.vendor.timing.startTime).getHours() + ":" + new Date(details.vendor.timing.startTime).getMinutes()}
        </Typography> : null}{details.vendor ? <Typography gutterBottom variant="h5" component="div">
          Closing Time: {new Date(details.vendor.timing.endTime).getHours() + ":" + new Date(details.vendor.timing.endTime).getMinutes()}
        </Typography> : null}

      </CardContent>

    </Card>
    {!edit && <Grid item xs={12} sx={{ margin: 3 }}>
      <Button variant="contained" onClick={onChangeEdit}>
        Edit
      </Button>
    </Grid>
    }
  </Grid>

  }
  {edit && <Grid container align={"center"} spacing={2}>


    <Grid item xs={12}>
      <TextField
        label="Name"
        variant="outlined"
        value={name}
        onChange={onChangeUsername}
      />
    </Grid>


    <Grid item xs={12}>
      <TextField
        label="Email"
        variant="outlined"
        value={email}
        onChange={onChangeEmail}
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        label="Contact"
        type="email"
        variant="outlined"
        value={contact}
        onChange={onChangeContact}

      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        label="Password"
        variant="outlined"
        //type = {showpassword ? "text" :"password"}
        //handleShowPassword = { handleShowPassword}
        value={password}
        onChange={onChangePassword}

      />
    </Grid>
    {!details.user.Vendor && <Grid item xs={12}>
      <TextField
        label="Age"
        variant="outlined"
        value={age}
        onChange={onChangeAge}
      />
    </Grid>}
    {!details.user.Vendor && <Grid item xs={12}>
      <FormControl sx={{ m: 1, minWidth: 230 }}>
        <InputLabel id="demo-simple-select-autowidth-label"> Batch</InputLabel>
        <Select
          variant="outlined"
          value={batch}
          onChange={onChangeBatch}
          autoWidth
          label="Batch"
        >
          <MenuItem value={"UG1"}>UG1</MenuItem>
          <MenuItem value={"UG2"}>UG2</MenuItem>
          <MenuItem value={"UG3"}>UG3</MenuItem>
          <MenuItem value={"UG4"}>UG4</MenuItem>
          <MenuItem value={"UG4"}>UG5</MenuItem>
        </Select>
      </FormControl>
    </Grid>}


    {!details.user.Buyer && <Grid item xs={12}>
      <TextField
        label="shopName"
        variant="outlined"
        value={shopName}
        onChange={onChangeShopname}
      />
    </Grid>}

    {!details.user.Buyer && <Grid item xs={12}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <TimePicker
          label="Opening time"
          value={start}
          onChange={onChangeStartTime}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </Grid>}
    {!details.user.Buyer && <Grid item xs={12}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <TimePicker
          timeFormat='h:mm p'
          label="Closing time"
          value={end}
          onChange={onChangeEndTime}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </Grid>}


  </Grid>
  }
  <Grid container align={"center"} spacing={5}>
    {
      edit && <Grid item xs={12} sx={{ margin: 3 }}>
        <Button variant="contained" onClick={onChangeSave}>
          Save
        </Button>

      </Grid>
    }
  </Grid>

</div>;
};

export default Profile;
