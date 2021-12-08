const express = require('express');
const pug = require('pug');
let orderRouter = express.Router();
const { addOrder, addBooksInOrder, getSpecificBooks, getPriceOfSpecificBooks, updateStockAfterOrder, getOrder, getOrderBooks } = require('../Queries/queries');
const session = require('express-session');


orderRouter.post("/", function(req, res){
  //creates date
  let ts = Date.now();
  let date_ob = new Date(ts);
  let order_date = "" + date_ob.getFullYear() + "-" + (date_ob.getMonth() + 1) + "-" +date_ob.getDate();
  req.body = {user_id: req.session.userid, destination: req.body.address, status: "warehouse", date_of_order: order_date}
  //adds order to the database 
  addOrder(req.body, function(order){
    //if there is something wrong redirect
    if (order == "INVALID"){
      console.log("INVALID ORDER CREATION");
      res.redirect("/users/cart");
    }else{
      //adds the books and the order to the book_order table in the database
      req.smallbody = [order];
      req.smallbody = req.smallbody.concat(req.session.cart);
      addBooksInOrder(req.smallbody, function(order_book_list){
        //if there is something wrong redirect
        if (order_book_list == "INVALID"){
          console.log("INVALID ORDER BOOK CREATION");
          res.redirect("/users/cart");
        }else{
          //update the stock of the books after order
          updateStockAfterOrder(req.session.cart, function(err){
            if (err == "INVALID"){
              //if there is something wrong redirect
              console.log("INVALID STOCK");
              res.redirect("/users/cart");
            }else{
              //clear cart and redirect to profile
              req.session.cart = [];
              res.redirect("/users/me")
            }
          })
        }
      });
    }
  });
});

orderRouter.get("/checkout", function(req, res){
  //checks if you are logged in
  if (req.session.loggedIn){
    //checks if the cart is null, if so, give it a value
    if (req.session.cart == null){
      req.session.cart = [];
    }
    //queries for specific books
    getSpecificBooks(req.session.cart, function(books){
      //queries for the price of the specific book
      getPriceOfSpecificBooks(req.session.cart, function(price){
        //if it is nothing, then change that to 0.00
        if (price.length == 0){
          price[0] = {total_price: 0.00}
        }
        //renders the checkout page
        res.send(pug.renderFile("views/pages/checkout.pug", {cart: books, total: price[0].total_price}));
      });
    });
  }else{
    res.redirect('/login.html');
  }
});

orderRouter.param("oid", function(req, res, next, oid){
  //checks if you are logged in, otherwise redirect
  if (req.session.loggedIn){
    //queries for the order using the id
    getOrder(oid, function(order){
      req.order = order;
      //gets the books from the order
      getOrderBooks(oid, function(books){
        req.books = books
        let price_books = []
        //gets the books into an array
        for (let i = 0; i < books.length; i++){
          price_books.push(books[i].isbn)
        }
        //gets the price of the speicfic books
        getPriceOfSpecificBooks(price_books, function(price){
          //checks for the price and gives it a value if it doesn't have one
          if (price.length == 0){
            req.price = 0.00
          }else{
            req.price = price[0].total_price
          }
          //go next
          next();
        });
      });
    });
  }else{
    res.redirect('/login.html');
  }
});


orderRouter.get("/:oid", function(req, res, next){
  //render the orders page
  res.send(pug.renderFile("views/pages/orders.pug", {books: req.books, order: req.order, total: req.price}));
});

module.exports = orderRouter;
