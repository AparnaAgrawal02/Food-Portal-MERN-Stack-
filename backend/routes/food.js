var express = require("express");
var router = express.Router();

// GET request 
// Just a test API to check if server is working properly or not
const { User, Vendor, Buyer } = require("../models/Users");
const Food = require("../models/Fooditem");
const Order = require("../models/Order");
/* router.get("/", function(req, res) {
  res.send("API is working properly !");
}); */
// Getting all the food
router.get("/", function (req, res) {
  Food.find(function (err, items) {
    if (err) {
      console.log(err);
    } else {
      let x = 0;
      let arr = []
      for (let item of items) {
        let _id = item.seller
        Vendor.findOne({ _id })
          .then(vendor => {
            console.log(vendor)
            if (!vendor) {
              console.log("not Found")
            }
            else {
              x++;
              arr.push({ item: item, vendor: vendor })
              console.log("fffffff", item, "ffffffffff")
              if (x == items.length) {
                res.send(arr)
              }

            }

          })
      }
    }
  })
});

router.put("/order", function (req, res) {
  console.log(req)
  const newOrder = new Order({
    food: req.body.order.food,
      shop: req.body.order.shop,
      quantity: req.body.order.quantity,
      cost: req.body.order.cost,
      date:Date.now(),
      addOn:req.body.order.addOn,
      buyer:req.body.order.buyer
  });
  newOrder.save()
  .then(order => {
    console.log(order)
    Buyer.findOneAndUpdate(
      { _id: req.body.id },
      { "$push": { orders: order._id } },
      { new: true }
    ).then(buyer => {
      console.log(buyer)
      Vendor.findOneAndUpdate(
        { _id: req.body.vendor._id },
        { "$push": { orders: order._id } },
        { new: true }
      ).then(vendor => {
        
        res.send({buyer, vendor})
  
  
      })
        .catch(err => {
          console.log("this happend")
          res.status(400).send(err);
        });
  
    })
      .catch(err => {
        console.log("this happend")
        res.status(400).send(err);
      });
  })
  .catch(err => {

    res.status(400).send(err);
  });
  
});

router.post("/fav", async (req, res) => {
  //console.log(req);
  var _id = req.body.id.id;

  User.findOne({ _id }).then(user => {
    // Check if user exists
    console.log(_id, user);
    if (!user) {
      return res.status(404).json({ idnotfound: "id not found" });
    }
    else {
      //console.log(user);

      _id = user.Buyer
      Buyer.findOne({ _id })
        .then(buyer => {
          //console.log(buyer, "lol")
          const items = []
          var done = 0;
          if (buyer.favourites.length) {
            for (const _id of buyer.favourites) {

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
                  if (done == buyer.favourites.length) {
                    // console.log(items, "hello")

                    return res.json({ buyer, items })
                  }

                }
              })
            }
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

router.post("/BuyOrder", async (req, res) => {
  //console.log(req);
  var _id = req.body.id.id;

  User.findOne({ _id }).then(user => {
    // Check if user exists
    console.log(_id, user);
    if (!user) {
      return res.status(404).json({ idnotfound: "id not found" });
    }
    else {
      //console.log(user);

      _id = user.Buyer
      Buyer.findOne({ _id })
        .then(buyer => {
          //console.log(buyer, "lol")
          const buyOrders = []
          var done = 0;
          if (buyer.orders.length) {
            for (const _id of buyer.orders) {

              Order.findOne({ _id }).then(item => {
                // Check if user exists
                // console.log(item._id, item);
                if (!item) {
                  console.log("not Found")
                }
                else {
                  done++;
                  buyOrders.push(item)
                  // console.log(done, vendor.menu.length,"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
                  if (done == buyer.orders.length) {
                    // console.log(items, "hello")

                    return res.json({buyer, buyOrders })
                  }

                }
              })
            }
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

router.put("/BuyOrder", async (req, res) => {
  console.log(req)
  Food.findByIdAndUpdate(req.body.id,{rating: req.body.rate,numRate:req.body.numRate})
  .then(item => {
    console.log(item);
    if (!item) {
      return res.status(404).json({ idnotfound: "id not found" });
    }
    else {
    Order.findByIdAndUpdate(req.body.order_id,{rate:req.body.orderRate})
  .then(item => {
    console.log(item);
    if (!item) {
      return res.status(404).json({ idnotfound: "id not found" });
    }
    else {
      return res.json({ item })
    }
  })
   
    }
  })
   
})


router.put("/status", async (req, res) => {
  console.log(req)
    Order.findByIdAndUpdate(req.body.order_id,{status:req.body.orderStatus})
  .then(item => {
    console.log(item);
    if (!item) {
      return res.status(404).json({ idnotfound: "id not found" });
    }
    else {
      return res.json({ item })
    }
  })  
})

router.post("/vendorOrder", async (req, res) => {
  //console.log(req);
  var _id = req.body.id.id;

  User.findOne({ _id }).then(user => {
    // Check if user exists
    console.log(_id, user);
    if (!user) {
      return res.status(404).json({ idnotfound: "id not found" });
    }
    else {
      //console.log(user);

      _id = user.Vendor
      Vendor.findOne({ _id })
        .then(vendor => {
          //console.log(buyer, "lol")
          const vendorOrders = []
          var done = 0;
          if (vendor.orders.length) {
            for (const _id of vendor.orders) {

              Order.findOne({ _id }).then(item => {
                // Check if user exists
                // console.log(item._id, item);
                if (!item) {
                  console.log("not Found")
                }
                else {
                  done++;
                  vendorOrders.push(item)
                  // console.log(done, vendor.menu.length,"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
                  if (done == vendor.orders.length) {
                    // console.log(items, "hello")

                    return res.json({ vendor, vendorOrders })
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
module.exports = router;
