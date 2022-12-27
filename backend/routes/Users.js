var express = require("express");
var router = express.Router();
var jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const jwt_decode = require("jwt-decode");


// Load User model
const { User, Vendor, Buyer } = require("../models/Users");
const Food = require("../models/Fooditem");
const generateToken = require("../generateToken");


console.log(User, Vendor, Buyer, Food)
// GET request 
// Getting all the users
router.get("/", function (req, res) {
  User.find(function (err, users) {
    if (err) {
      console.log(err);
    } else {
      res.json(users);
    }
  })
});

// POST request 
// Add a user to db
router.post("/register", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  console.log(req);
  let newVendor = null;

  if (req.body.vendor.shopName != "") {
    newVendor = new Vendor({
      shopName: req.body.vendor.shopName,
      timing: req.body.vendor.timing,
      menu: []
    });

  }
  let newBuyer = null;
  if (req.body.buyer.batch != "") {
    newBuyer = new Buyer({
      age: req.body.buyer.age,
      batchName: req.body.buyer.batch,
      favourites:[],
      orders:[]
    });
  }


  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    contact: req.body.contact,

    password: hashedPassword,

    Vendor: newVendor,
    Buyer: newBuyer
  });

  console.log(newUser, newVendor, newBuyer);
  if (newVendor) {
    newVendor.save()
  }
  if (newBuyer) {
    newBuyer.save()
  }

  newUser.save()
    .then(user => {
      res.status(200).json({ user, token: generateToken(req.body._id) });
    })
    .catch(err => {

      res.status(400).send(err);
    });
});





// POST request 
// Login
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {

        // Sign token
        const token = generateToken(user._id);
        //const token = user.token;
        // console.log(token);
        return res.json({ token: token, buyer: user.Buyer })
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

router.post("/profile", async (req, res) => {
  console.log(req);
  var _id = req.body.id.id;
  User.findOne({ _id }).then(user => {
    // Check if user exists
    console.log(_id, user);
    if (!user) {
      return res.status(404).json({ idnotfound: "id not found" });
    }
    else {
      console.log(user);
      if (user.Vendor) {
        _id = user.Vendor
        Vendor.findOne({ _id }).then(vendor => {
          console.log(vendor)
          return res.json({ user, vendor })
        })
      }
      else {
        _id = user.Buyer
        Buyer.findOne({ _id }).then(buyer => {
          console.log(buyer)
          return res.json({ user, buyer })

        })
      }
    }
  });
})

router.post("/buyer", async (req, res) => {
  //console.log(req);
  var _id = req.body.id.id;

  User.findOne({ _id }).then(user => {
    // Check if user exists
    //console.log(_id, user);
    if (!user) {
      return res.status(404).json({ idnotfound: "id not found" });
    }
    else {
    
      _id = user.Buyer
      Buyer.findOne({ _id })
        .then(buyer => {
          console.log(buyer)
          if (!buyer) {
            return res.status(404).json({ idnotfound: "id not found" });
          }
          else {
            return res.json({ buyer })
          }

          //console.log(items, "hi")

        })
        .catch(err => {

          res.status(400).send(err);
        });
    }
  })
})

router.put("/buyer", async (req, res) => {
  Buyer.findOneAndUpdate(
    { _id: req.body.id },
    { "$push": { favourites: req.body.fav_id } },
    { new: true }
  ).then(buyer => {console.log(buyer)
     res.send(buyer) })
    .catch(err => {
      console.log("this happend")
      res.status(400).send(err);
    });
   
})

router.delete("/buyer", async (req, res) => {
  console.log( req )
  Buyer.findOneAndUpdate(
    { _id: req.body.id },
    { "$pull": { favourites: req.body.fav_id } },
    { new: true }
  ).then(buyer => {console.log(buyer,"FF")
     res.send(buyer) })
    .catch(err => {
      console.log("this happend")
      res.status(400).send(err);
    });

})

router.delete("/VendorDashboard", (req, res) => {
  console.log(req);
  Food.findOneAndDelete({ _id: req.body._id }, function (err) {
    if (err) console.log(err);
    console.log("Successful deletion");
  });
  Vendor.findOneAndUpdate(
    { _id: req.body.seller },
    { "$pull": { menu: req.body._id } },
    { new: true }
  ).then(ve => { console.log("deleted") })
    .catch(err => {
      console.log("this happend")
      res.status(400).send(err);
    });
  res.send("DELETE Request Called")

})

router.post("/VendorDashboard", async (req, res) => {
  //console.log(req);
  var _id = req.body.id.id;

  User.findOne({ _id }).then(user => {
    // Check if user exists
    console.log(_id, user);
    if (!user) {
      return res.status(404).json({ idnotfound: "id not found" });
    }
    else {
      console.log(user);

      _id = user.Vendor
      Vendor.findOne({ _id })
        .then(vendor => {
          console.log(vendor)
          const items = []
          var done = 0;
          if (vendor.menu.length) {
            for (const _id of vendor.menu) {

              Food.findOne({ _id }).then(item => {
                // Check if user exists
                // console.log(item._id, item);
                if (!item) {
                  console.log("not Found")
                }
                else {
                  done++;
                  items.push(item)
                  // console.log(done, vendor.menu.length,"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
                  if (done == vendor.menu.length) {
                   // console.log(items, "hello")

                    return res.json({ vendor, items })
                  }

                }
              })
            }
          }
          else {
            return res.json({ vendor })
          }

          //console.log(items, "hi")

        })
        .catch(err => {

          res.status(400).send(err);
        });
    }
  })
})

router.put("/VendorDashboard", async (req, res) => {
  console.log(req.body);
  const newItem = new Food({
    name: req.body.item.name,
    price: req.body.item.price,
    rating: req.body.item.rating,
    isVeg: req.body.item.isVeg,
    addOn: req.body.item.addOn,
    seller: req.body.item.id,
    tags:req.body.item.tags
  })

  newItem.save()
    .then(vendor => {
      console.log(newItem, 'hellloooooooo')
      Vendor.findOneAndUpdate(
        { _id: req.body.item.id },
        { "$push": { menu: newItem._id } },
        { new: true }
      ).then(ve => { console.log("added") })
        .catch(err => {
          console.log("this happend")
          res.status(400).send(err);
        });
      console.log(vendor)
      res.status(200).json({ vendor });
    })
    .catch(err => {
      console.log("this happend")
      res.status(400).send(err);
    });

})

router.put("/profile", async (req, res) => {
   //console.log(req,"ffffffffffffffffffffffffffff");
  User.findByIdAndUpdate(req.body.id, req.body.user)
    .then(user => {
      //console.log(user,"sssssssss");
      if (!user) {
        return res.status(404).json({ idnotfound: "id not found" });
      }
      else {
        if(req.body.buyer){
        Buyer.findByIdAndUpdate(req.body.buyer_id, req.body.buyer)
        .then(buyer => {
          //console.log(buyer);
          if (!buyer) {
            return res.status(404).json({ idnotfound: "id not found" });
          }
          else {
           return res.send({buyer})
          }
        })
      }
      else{
        Vendor.findByIdAndUpdate(req.body.vendor_id, req.body.vendor)
        .then(vendor => {
          //console.log(vendor);
          if (!vendor) {
            return res.status(404).json({ idnotfound: "id not found" });
          }
          else {
           return res.send({vendor})
          }
        })

      }
    }
    })
});
router.put("/editItem", async (req, res) => {
  // console.log(req,"ffffffffffffffffffffffffffff");
  Food.findByIdAndUpdate(req.body.item._id, req.body.item)
    .then(item => {
      console.log(item);
      if (!item) {
        return res.status(404).json({ idnotfound: "id not found" });
      }
      else {
        return res.json({ item })
      }
    })
});

router.post("/wallet", async (req, res) => {
  //console.log(req);
  var _id = req.body.id.id;

  User.findOne({ _id }).then(user => {
    // Check if user exists
    //console.log(_id, user);
    if (!user) {
      return res.status(404).json({ idnotfound: "id not found" });
    }
    else {
    
      _id = user.Buyer
      Buyer.findOne({ _id })
        .then(buyer => {
          console.log(buyer)
          if (!buyer) {
            return res.status(404).json({ idnotfound: "id not found" });
          }
          else {
            return res.json({ user,buyer })
          }

          //console.log(items, "hi")

        })
        .catch(err => {

          res.status(400).send(err);
        });
    }
  })
})

router.put("/wallet", async (req, res) => {
  Buyer.findOneAndUpdate(
    { _id: req.body.id },
    { "$inc": { amount: req.body.amount } },
    { new: true },
    
  ).then(buyer => {console.log(buyer)
     res.send(buyer) })
    .catch(err => {
      console.log("this happend")
      res.status(400).send(err);
    });
   
})
router.put("/buyer", async (req, res) => {
  Buyer.findOneAndUpdate(
    { _id: req.body.id },
    { "$push": { favourites: req.body.fav_id } },
    { new: true }
  ).then(buyer => {console.log(buyer)
     res.send(buyer) })
    .catch(err => {
      console.log("this happend")
      res.status(400).send(err);
    });
   
})


/*   router.get('/logout', (req, res) => {
    res.clearCookie(COOKIE_NAME)
})
 */
module.exports = router;

