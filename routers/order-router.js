const express = require('express');
const pug = require('pug');
let orderRouter = express.Router();
const { addOrder, addBooksInOrder } = require('../queries');
const session = require('express-session');


// orderRouter.get("/", function(req, res){
//     res.send(pug.renderFile("views/pages/browse.pug", {}));
// });

//should be post
orderRouter.get("/", function(req, res){
  //need to be stufff
  req.body = {user_id: req.session.userid, destination: "Some street", current_location: "warehouse", date_of_order: "2019-10-24"}
  addOrder(req.body, function(order){
    if (order == "INVALID"){
      console.log("INVALID ORDER");
      res.redirect("/users/cart");
    }else{
      console.log("YAY");
      req.smallbody = [order];
      req.smallbody = req.smallbody.concat(req.session.cart);
      addBooksInOrder(req.smallbody, function(order_book_list){
        if (order_book_list == "INVALID"){
          console.log("INVALID ORDER");
          res.redirect("/users/cart");
        }else{
          console.log("YEET");
        }
      });
    }
  });
});





module.exports = orderRouter;
