const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { User, Vendor, Buyer } = require("../models/Users");
// Create Schema
let OrderSchema = new Schema({
    date:Date,
  food: {
    type: Object,
    required: true
  },
  //image:imgSchema,
  shop: {
    type: String,
    required: true
  },

  quantity: {
    type: Number,
    required: true
  },
  status:{
    type: String,
enum: ['PLACED', 'ACCEPTED', 'COOKING', 'READY FOR PICKUP', 'COMPLETED','REJECTED'],
default: 'PLACED',
},
cost:{type:Number,
      min:0,
      required:true
    },
addOn:{
    type:Object,
},
rate:{
  type: Number,
  default:0
},
buyer :{type: Schema.Types.ObjectId, ref: 'Buyer'} 
});



module.exports = Order = mongoose.model("order", OrderSchema);
