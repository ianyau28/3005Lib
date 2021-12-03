const express = require('express');
const pug = require('pug');
let orderRouter = express.Router();
const { addOrder, addBooksInOrder, getSpecificBooks, getPriceOfSpecificBooks } = require('../queries');
const session = require('express-session');


// orderRouter.get("/", function(req, res){
//     res.send(pug.renderFile("views/pages/browse.pug", {}));
// });

//should be post
orderRouter.post("/", function(req, res){
  //need to be stufff
  req.body = {user_id: req.session.userid, destination: "Some street", status: "warehouse", date_of_order: "2019-10-24"}
  addOrder(req.body, function(order){
    if (order == "INVALID"){
      console.log("INVALID ORDER");
      res.redirect("/users/cart");
    }else{
      req.smallbody = [order];
      req.smallbody = req.smallbody.concat(req.session.cart);
      addBooksInOrder(req.smallbody, function(order_book_list){
        if (order_book_list == "INVALID"){
          console.log("INVALID ORDER");
          res.redirect("/users/cart");
        }else{
          req.session.cart = [];
          res.redirect("/users/me")
        }
      });
    }
  });
});

orderRouter.get("/checkout", function(req, res){
  //need to be stufff
  console.log("WHOOOO")
  if (req.session.loggedIn){
    //alert("Please log in first!");
    if (req.session.cart == null){
      req.session.cart = [];
    }
    getSpecificBooks(req.session.cart, function(books){
      getPriceOfSpecificBooks(req.session.cart, function(price){
        if (price.length == 0){
          price[0] = {total_price: 0.00}
        }
        res.send(pug.renderFile("views/pages/checkout.pug", {cart: books, total: price[0].total_price}));
      });
    });
  }else{
    res.redirect('/login.html');
  }
});





module.exports = orderRouter;
