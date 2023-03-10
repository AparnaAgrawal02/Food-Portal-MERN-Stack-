import { useState, useEffect } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import jwt_decode from "jwt-decode";
var token = localStorage.getItem("token");
var host = window.location.hostname

if (token) {
  var decoded = jwt_decode(token);
}
const Favourites = (props) => {
    const [details, setDetails] = useState([]);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [sortedUsers, setSortedUsers] = useState([]);
  const [sortName, setSortName] = useState(true);
  const [searchText, setSearchText] = useState("");


  useEffect(() => {
    axios
      .post("http://"+host+"/api/food/fav", {
        id: decoded
      }) // unimplemented
      .then((res) => {
        setDetails(res.data);
        console.log(details);
        setItems(res.data.items);
        //setRows(response.data.vendor.menu)
        console.log(res.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  

  return (
    <div>
     
        <Grid item xs={12} md={9} lg={9}>
          <Paper>
            <Table size="small">
              <TableHead>
                <TableRow>
                <TableCell> Sr No.</TableCell>
                  <TableCell> Item</TableCell>
                  <TableCell>
                    Price
                  </TableCell>
                  <TableCell>
                    Rating</TableCell>
                  <TableCell>Veg</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                  {console.log(items)}
                {items && items.map((item, ind) => (
                  <TableRow key={ind}>
                    <TableCell>{ind}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>{item.rating}</TableCell>
                    <TableCell>{(item.isVeg) ? "Yes" : "No"}</TableCell>
                </TableRow>
                ))}
                </TableBody>
              
            </Table>
          </Paper>
        </Grid>
    </div>
  );
};

export default Favourites;
