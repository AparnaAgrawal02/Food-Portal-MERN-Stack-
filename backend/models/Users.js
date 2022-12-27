const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require('validator')
const bcrypt = require("bcryptjs");
const food = require("../models/Fooditem");
const order = require("../models/Order");
SALT_WORK_FACTOR = 10;
// Create Schema
mongoose.set('useFindAndModify', false);
let timings = new Schema({
	startTime: Date,
	endTime: Date,

});
let UserSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		validate: [validator.isEmail, "Please provide a valid email"]

	},

	contact: {
		type: String,
		validate: {

			validator: function (v) {

				return /^\d{10}$/.test(v);

			},

		}


	},
	password: {
		type: String,
		required: true,
		minlength: 6
	},
	Vendor: { type: Schema.Types.ObjectId, ref: 'VendorSchema' },
	Buyer: { type: Schema.Types.ObjectId, ref: 'BuyerSchema' }
});

let VendorSchema = new Schema({
	shopName: {
		type: String,
		//required: true,
		unique: true
	},
	timing: timings,
	menu:[{type: Schema.Types.ObjectId, ref: 'food'} ],
	orders:[{type: Schema.Types.ObjectId, ref: 'order'} ],
	placed:{
		type:Number,
		default:0
	},
	pending:{
		type:Number,
		default:0,
		max:10

	},
	completed:{
		type:Number,
		default:0	
	}

})

let BuyerSchema = new Schema({
	age: {
		type: Number,
		min: 1,
		max: 100,
		//required: true
	},
	batchName: {
		type: String,
		enum: ['UG1', 'UG2', 'UG3', 'UG4', 'UG5'],
		//required: true
	},
	favourites:[{type: Schema.Types.ObjectId, ref: 'food'} ],
	orders:[{type: Schema.Types.ObjectId, ref: 'order'} ],
	amount:{
		type: Number,
		min: 0,
		default: 0
	},

})
BuyerSchema.pre('validate', function (next) {
	console.log('2');
	next();
});

BuyerSchema.pre('save', function (next) {
	console.log('3');
	next();
});

VendorSchema.pre('validate', function (next) {
	console.log('2');
	next();
});

VendorSchema.pre('save', function (next) {
	console.log('3');
	next();
});

/* UserSchema.pre('save', async function (next) {
	var user = this;

	// only hash the password if it has been modified (or is new)
	if (!user.isModified('password')) return next();
	try {
		// generate a salt
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(user.password, salt);
		console.log(hash)
		return next();
		} catch (err) {
		return next(err);
	}
});
 */
//console.log(this, lol)

UserSchema.methods.comparePassword = async function (candidatePassword) {
	return bcrypt.compare(candidatePassword, this.password)


};


User = mongoose.model("Users", UserSchema);
Vendor = mongoose.model('Vendor', VendorSchema);
Buyer = mongoose.model('Buyer', BuyerSchema);
module.exports = {
	User, Vendor, Buyer
}