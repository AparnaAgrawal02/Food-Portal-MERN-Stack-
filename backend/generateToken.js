var jwt = require('jsonwebtoken')
require("dotenv").config();
const generateToken = (id)=>{
    return jwt.sign({id},process.env.PRIVATEKEY, {
        expiresIn: "50d",
    })
}
module.exports = generateToken;