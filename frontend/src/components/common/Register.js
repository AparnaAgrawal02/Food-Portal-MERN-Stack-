import { useState } from "react";
import axios from "axios";
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
var host = window.location.hostname





const Register = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [usertype, setuser] = useState('');
  const [shopName, setshopName] = useState('');
  const [batch, setBatch] = useState('');
  const [VendorField, setVendorField] = useState(-1);
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
 // const [showpassword, setshowPassword] = useState(false);
  const [start, setStart] = React.useState(new Date('2018-01-01T00:00:00.000Z'));
  const [end, setEnd] = React.useState(new Date('2018-01-01T00:00:00.000Z'));
 

  const handleChange = (event) => {
    setuser(event.target.value);
    if (event.target.value === "Vendor") setVendorField(1);
    else setVendorField(0);
  };
 /*  const handleShowPassword = (event) => {
    setshowPassword(event =>!event);
    
  }; */
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



  const onSubmit = (event) => {
    event.preventDefault();

    const newUser = {
      name: name,
      email: email,
      contact: contact,
      password:password


    };
    newUser.vendor={
      shopName:shopName
    };
    newUser.vendor.timing={
      startTime: start,
      endTime: end,
    }
    newUser.buyer={
      batch : batch,
      age :age,
    };

    
    axios
      .post("http://"+host+"/api/user/register", newUser)
      .then((response) => {
        alert("Created\t" + response.data.name);
        console.log(response.data);
        
      }
      )
      .catch(error => {
        console.log(error.response);})

    resetInputs();
    
  };

  return (

    <Grid container align={"center"} spacing={2}>


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
          type = "email"
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

      <Grid item xs={12} >
      <FormControl sx={{ m: 1, minWidth: 230 }}>
        <Select 
          variant="outlined"
          value={usertype}
          onChange={handleChange}
          label=""
        
        >
          <MenuItem value={"Vendor"}>Vendor</MenuItem>
          <MenuItem value={"Buyer"}>Buyer</MenuItem>

        </Select>
        </FormControl>
      </Grid>
      {!VendorField && <Grid item xs={12}>
        <TextField
          label="Age"
          variant="outlined"
          value={age}
          onChange={onChangeAge}
        />
      </Grid>}
      {!VendorField && <Grid item xs={12}>
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


      {VendorField === 1 && <Grid item xs={12}>
        <TextField
          label="shopName"
          variant="outlined"
          value={shopName}
          onChange={onChangeShopname}
        />
      </Grid>}

      {VendorField === 1 && <Grid item xs={12}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TimePicker
        label="Opening time"
        value={start}
        onChange={onChangeStartTime}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
      </Grid>}
      {VendorField === 1 && <Grid item xs={12 }>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TimePicker
      timeFormat= 'h:mm p'
        label="Closing time"
        value={end}
        onChange={onChangeEndTime}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
      </Grid>}

      <Grid item xs={12}>
        <Button variant="contained" onClick={onSubmit}>
          Register
        </Button>
      </Grid>
    </Grid>

  );
};

export default Register;




