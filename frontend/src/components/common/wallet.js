import axios from "axios";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import jwt_decode from "jwt-decode";
import { useState, useEffect } from "react";
import FormControl from "@mui/material/FormControl";
var host = window.location.hostname

var token = localStorage.getItem("token");
if (token) {
  var decoded = jwt_decode(token);
}





const Wallet = (props) => {
  const [amount, setAmount] = useState(0);
  const [details, setDetails] = useState([]);

  const onChangeAmount = (event) => {
    setAmount(event.target.value);
  };
  const addMoney = (event) => {
    axios
    .put("http://"+host+"/api/user/wallet", { id: details.buyer._id, amount:amount})
    .then((response) => {
      //alert("Added\t" + response.data.vendor.name);
      console.log(response.data);
    }
    )
    .catch(error => {
      console.log(error.response);
    })
  window.location.reload();
    
  };

  const resetInputs = () => {
    setAmount(0);
  };

  useEffect(() => {
    axios
      .post("http://"+host+"/api/user/wallet", {
        id: decoded
      }) // unimplemented
      .then((response) => {
        setDetails(response.data);
  
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [])  


  


  return (

    <Grid container align={"center"} spacing={2}>
        <Grid item xs={12}>
        <h2>HI {details.user && details.user.name }!<br/>Your Current Balance: {details.buyer && details.buyer.amount} </h2>
        </Grid>
     
    

      <Grid item xs={12}>
        <TextField
          label="Amount"
          variant="outlined"
          value={amount}
          onChange={onChangeAmount}
        />
      </Grid>

      <Grid item xs={12}>
        <Button variant="contained" onClick={addMoney}>
          Add Money
        </Button>
      </Grid>
    </Grid>

  );
};

export default Wallet;




