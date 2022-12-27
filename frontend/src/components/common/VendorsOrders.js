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
import jwt_decode from "jwt-decode";
//import emailjs from "emailjs-com"
//import{ init } from '@emailjs/browser';
import emailjs from "emailjs-com";
var host = window.location.hostname


var token = localStorage.getItem("token");
if (token) {
    var decoded = jwt_decode(token);
}
const VendorOrder = (props) => {
    const [details, setDetails] = useState([]);
    const [orders, setOrders] = useState([]);


    const countMaxOrder = () => {
        let c =0;
     for(let i in orders){
        if(orders[i].status==="ACCEPTED" || orders[i].status==="COOKING"){
          c++;
        }
     }
     return c
   } 
    
   const sendEmail = (order,message) =>{
   
    emailjs.send("service_oloqqc9","template_p801tpl",{from_name:details.vendor.shopName,
        message:message}, 'user_COC3jlIJyPhbwZAzAeK9h')
    .then((result) => {
    console.log(result.text);
    }, (error) => {
    console.log(error.text);
    });
   }

    const handleRejected = (event, order) => {
        event.target.value = "REJECTED"
        sendEmail(order,"your order is Rejected!")
        onChangeStatus(event, order)
    }
    const handleAmmount = (order) => {
        axios
            .put("http://"+host+"/api/user/wallet", { id: order.buyer, amount: order.cost })
            .then((response) => {
                //alert("Added\t" + response.data.vendor.name);
                console.log(response.data);
            }
            )
            .catch(error => {
                console.log(error.response);
            })
    }
    const onChangeStatus = (event, order) => {
        //console.log("works")
        if(countMaxOrder()<10){
        let s = "PLACED"
        if(event.target.value === "REJECTED"){
            s = "REJECTED"
        }
        else if(order.status === "PLACED"){
            s ="ACCEPTED"

            emailjs.send("service_oloqqc9","template_p801tpl",{from_name:details.vendor.shopName,
                message:"your order is accepted"}, 'user_COC3jlIJyPhbwZAzAeK9h')
            .then((result) => {
            console.log(result.text);
            }, (error) => {
            console.log(error.text);
            });
        
        }
        else if (order.status ==="ACCEPTED"){
            s ="COOKING"
        }
        else if (order.status ==="COOKING"){
            s ="READY FOR PICKUP"
        }
        

        axios
            .put("http://"+host+"/api/food/status", {
                order_id: order._id,
                orderStatus: s

            }) // unimplemented
            .then((res) => {
                console.log(res.data);
            })
            .catch(function (error) {
                console.log(error);
            });
        if (event.target.value === "REJECTED") {
            handleAmmount(order)
        }
        window.location.reload();
        }
        else{
            alert("Can't Accept More")
        }
    }

    useEffect(() => {
        axios
            .post("http://"+host+"/api/food/vendorOrder", {
                id: decoded
            }) // unimplemented
            .then((res) => {
                setDetails(res.data);
                console.log(details);
                setOrders(res.data.vendorOrders);
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
                                <TableCell>Time</TableCell>
                                <TableCell> Item</TableCell>
                                <TableCell>
                                    Quantity
                                </TableCell>
                                <TableCell>
                                    AddOn</TableCell>
                                <TableCell>Rating</TableCell>
                                <TableCell>Cost</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {console.log(orders)}
                            {orders && orders.map((order, ind) => (
                                <TableRow key={ind}>
                                    <TableCell>{ind}</TableCell>
                                    <TableCell>{new Date(order.date).getHours() + ":" + new Date(order.date).getMinutes()}</TableCell>
                                    <TableCell>{order.food.name}</TableCell>
                                    <TableCell>{order.quantity}</TableCell>
                                    <TableCell>{order.addOn ? order.addOn.name : "none"}</TableCell>
                                    <TableCell>{order.food.rating}</TableCell>
                                    <TableCell>{order.cost}</TableCell>
                                    <TableCell>{order.status}</TableCell>
                                    <TableCell><Button variant="contained" onClick={(event) => {
                                        onChangeStatus(event, order)

                                    }}
                                        disabled={order.status === "READY FOR PICKUP" ||order.status === "COMPLETED" || order.status === "REJECTED"} >
                                        Next Stage
                                    </Button></TableCell>

                                   <TableCell>
                                        <Button variant="contained" onClick={(event) => {
                                            handleRejected(event, order);
                                        }} 
                                        disabled={order.status === "COMPLETED" || order.status === "REJECTED"} >
                                            REJECT
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>
                </Paper>
            </Grid>
        </div>
    );
};

export default VendorOrder;
