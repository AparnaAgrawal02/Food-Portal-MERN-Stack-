import { useState } from "react";
import axios from "axios";
import FacebookLogin from 'react-facebook-login';
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import GoogleLogin from 'react-google-login';
//var jwt = require('jsonwebtoken');
var host = window.location.hostname
if(host !== "canteen.com"){
    host += ":4000"
  }
const responseGoogle = (response) => {
    console.log(response);
}
const Login = (props) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [data, setData] = useState({});
    const onChangeEmail = (event) => {
        setEmail(event.target.value);
    };
    const onChangePassword = (event) => {
        setPassword(event.target.value);
    };

    const resetInputs = () => {
        setEmail("");
        setPassword("");
    }

    const onSubmit = (event) => {
        event.preventDefault();

        const newUser = {
            email: email,
            password: password
        };
        axios
            .post("http://"+host+"/api/user/login", newUser)
            .then((response) => {
                //alert("Created\t" + response.data.name);
                console.log(response.data);
                if (response.data) {
                    alert("login Successfull")
                    if (response.data.buyer) {
                        window.location.href = '/BuyerDashboard'
                    }
                    else {
                        window.location.href = '/VendorDashboard'
                    }
                    localStorage.setItem("token",response.data.token)
                    console.log(  localStorage.getItem("token"))
                   /*  var decoded = jwt.decode(localStorage.getItem);
                    console.log(decoded) */
                }
                else {
                    alert("please check username and password")
                }
            }
            )
            .catch(error => {
                console.log(error.response);
            })
        resetInputs();
    }
    const responseFacebook = (response) => {
        console.log(response);
        setData(response);
        /* if (response.accessToken) {
          setLogin(true);
        } else {
          setLogin(false);
        } */
    }
    return (

        <Grid container align={"center"} spacing={2}>


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
                    label="Password"
                    variant="outlined"
                    value={password}
                    onChange={onChangePassword}
                />
            </Grid>
            {/* <Grid item xs={12}>

                <FacebookLogin
                    width='1'
                    appId="266160758920779"
                    autoLoad={true}
                    fields="name,email,picture"
                    callback={responseFacebook}
                    icon="fa-facebook"
                    cssClass="my-facebook-button-class"
                    scope="public_profile,user_friends"
                />
            </Grid> */}
            {/* <Grid item xs={12}>
                <GoogleLogin
                    clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
                    buttonText="Login"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                />
               
            </Grid> */}
            <Grid item xs={12}>
                <Button variant="contained" onClick={onSubmit}>
                    Login
                </Button>
            </Grid>
        </Grid>
    );
}
export default Login;
