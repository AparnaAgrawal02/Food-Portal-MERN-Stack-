const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4000;
const DB = "mongodb+srv://aparna:aparna10401@cluster0.dow6m.mongodb.net/FoodOrderingPortal?retryWrites=true&w=majority"
const DB_NAME = "FoodOrderingPortal"
mongoose.set('useFindAndModify', false);
// routes
var testAPIRouter = require("./routes/testAPI");
var UserRouter = require("./routes/Users");
var FoodRouter = require("./routes/food");
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connection to MongoDB
mongoose.connect(DB, { useNewUrlParser: true 
       
    }).then(() => console.log("Database connected!"))
    .catch(err => console.log(err));
   
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully !");
})

// setup API endpoints
app.use("/testAPI", testAPIRouter);
app.use("/user", UserRouter);
app.use("/food", FoodRouter);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});
