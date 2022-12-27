import { useState, useEffect } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Button from "@mui/material/Button";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import jwt_decode from "jwt-decode";
var host = window.location.hostname

var token = localStorage.getItem("token");
if (token) {
  var decoded = jwt_decode(token);
}
const BuyerOrder = (props) => {
  const [details, setDetails] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [rate, setRating] = useState(0);
  const [sortName, setSortName] = useState(true);
  const [searchText, setSearchText] = useState("");


const handlePicked= (event, order) => {
  //console.log("works")
  axios
      .put("http://"+host+"/api/food/status", {
          order_id: order._id,
          orderStatus: "COMPLETED"

      }) // unimplemented
      .then((res) => {
          console.log(res.data);
      })
      .catch(function (error) {
          console.log(error);
      });
  //window.location.reload();
}
  const updateRating = (rating, order) => {
    let food = order.food
    console.log("works")
    axios
      .put("http://"+host+"/api/food/BuyOrder", {
        rate: (food.rating + rating) * 1.0 / (food.numRate + 1),
        numRate: food.numRate + 1,
        id: food._id,
        order_id: order._id,
        orderRate: rating,

      }) // unimplemented
      .then((res) => {
        console.log(res.data);
      })
      .catch(function (error) {
        console.log(error);
      });
    window.location.reload();

  }
  useEffect(() => {
    axios
      .post("http://"+host+"/api/food/BuyOrder", {
        id: decoded
      }) // unimplemented
      .then((res) => {
        setDetails(res.data);
        console.log(details);
        setOrders(res.data.buyOrders);
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
                  Quantity
                </TableCell>
                <TableCell>
                  AddOn</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Cost</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Rate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {console.log(orders)}
              {orders && orders.map((order, ind) => (
                <TableRow key={ind}>
                  <TableCell>{ind}</TableCell>
                  <TableCell>{order.food.name}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>{order.addOn ? order.addOn.name : "none"}</TableCell>
                  <TableCell>{order.food.rating}</TableCell>
                  <TableCell>{order.cost}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell><Rating
                    name="simple-controlled"
                    value={order.rate}
                    disabled={order.rate !== 0 || order.status != "COMPLETED"}
                    onChange={(event, newValue) => {
                      setRating(newValue);
                      updateRating(newValue, order);

                    }}
                  /></TableCell>
                  {order.status === "READY FOR PICKUP" && <TableCell>
                    <Button variant="contained" onClick={(event) => {
                      handlePicked(event, order);
                    }} >
                      Picked UP
                    </Button>
                  </TableCell>}
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </Paper>
      </Grid>
    </div>
  );
};

export default BuyerOrder;
