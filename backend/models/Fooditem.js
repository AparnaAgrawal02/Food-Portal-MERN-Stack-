const mongoose = require("mongoose");
const Schema = mongoose.Schema;


let add_on ={
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
}

// Create Schema
let foodSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  //image:imgSchema,
  price: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,

  },
  numRate:{
    type: Number,
    min: 0,
    default: 0,
  },
  isVeg: {
    type: Boolean,
    default: true
  },
  addOn: [add_on],
  tags: [String],
  seller: { type: Schema.Types.ObjectId, ref: 'VendorSchema' },
  sold:{
    type: Number,
    min: 0,
    default: 0,
  }

});

/* let imgSchema = mongoose.Schema({
    img:{data:Buffer,contentType: String}
}); */

/* let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
let upload = multer({ storage: storage }) */

module.exports = food = mongoose.model("food", foodSchema);
