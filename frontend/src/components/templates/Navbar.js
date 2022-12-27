import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import jwt_decode from "jwt-decode";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import axios from "axios";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
var token = localStorage.getItem("token");
var host = window.location.hostname
if (token) {
  var decoded = jwt_decode(token);
}
const Navbar = () => {
  const navigate = useNavigate();
  const [details, setDetails] = useState([]);

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
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Canteen Portal
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button color="inherit" onClick={() => navigate("/users")}>
            Users
          </Button>
          {!token && <Button color="inherit" onClick={() => navigate("/register")}>
            Register
          </Button>}
          {!token && <Button color="inherit" onClick={() => navigate("/login")}>
            Login
          </Button>}
          {token && <Button color="inherit" onClick={() => {navigate("/")
            localStorage.clear()
            window.location.reload();

            }}>
            Logout
          </Button>}
          {token && details.vendor && <Button color="inherit" onClick={() => navigate("/VendorDashboard")}>
            Menu
          </Button>}
          {token && details.buyer && <Button color="inherit" onClick={() => navigate("/BuyerDashBoard")}>
            Menu
          </Button>}
          {token && details.buyer && <Button color="inherit" onClick={() => navigate("/Favourites")}>
            Favourites
          </Button>}
          {token && details.buyer && <Button color="inherit" onClick={() => navigate("/BuyersOrders")}>
            My Orders
          </Button>}
          {token && details.buyer && <AccountBalanceWalletIcon fontSize="large"  color="inherit" onClick={() => navigate("/wallet")}>
          
          </AccountBalanceWalletIcon>}
          {token && details.vendor && <Button color="inherit" onClick={() => navigate("/VendorsOrders")}>
            My Orders
          </Button>}
          {token && details.vendor && <Button color="inherit" onClick={() => navigate("/Statistics")}>
            Statistics
          </Button>}
          {token && <AccountCircleIcon fontSize="large"  color="inherit" onClick={() => navigate("/profile")}>
            My Profile
          </AccountCircleIcon >}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
