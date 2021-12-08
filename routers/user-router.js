const express = require('express');
const pug = require('pug');
let userRouter = express.Router();
const { addUser, login, getUser, getUserOrders, getSpecificBooks, getPriceOfSpecificBooks, getSalesByAuthor, getSalesByPublisher, getSalesByGenre, getTotalSales } = require('../Queries/queries');
const session = require('express-session');

//renders the browse file
userRouter.get("/", function(req, res){
    res.send(pug.renderFile("views/pages/browse.pug", {}));
});

userRouter.post("/", function(req, res){
  //adds the user to the user table in the database
    addUser(req.body, function(user){
      //if there is an error redirect
      if (user == "INVALID"){
        console.log("INVALID USERNAME");
        res.redirect("/signup.html");
      }else{
        //if things are fine then update the session and redirect to profile
        console.log(user);
        req.session.userid = user;
        req.session.loggedIn = true;
        res.redirect("/users/me");
      }
    });
});

userRouter.get("/log", function(req, res){
  //checks if you are logged in
  if (req.session.loggedIn){
    //if logged in then update session and log out then redirect to homepage
    req.session.loggedIn = false;
    req.session.userid = '';
    req.session.cart = [];
    console.log("Logged Out");
    res.redirect("/");
  }else{
    //if not then go to login page
    res.redirect("/login.html");
  }
});

userRouter.get("/login", function(req, res){
  //use the login query and query for that user
  login(req.query, function(user){
      if (user.length > 0){
        //if they do, update session, login and redirect to profile
        console.log("LOGGING IN...");
        req.session.loggedIn = true;
        req.session.userid = user;
        res.redirect("/users/me");
      }else{
        //if that user doesn't exist then redirect back to login
        res.redirect("/login.html")
      }
  });
});

userRouter.get("/me", function(req, res){
  //checks if you are logged in 
  if (req.session.loggedIn){
    //if so, query for the user from the database
    getUser(req.session.userid, function(user){
      //gets the oders from this user
      getUserOrders(req.session.userid, function(orders){
        //if your user_id is owner then set admin to true
        let admin = false
        if (user.user_id === 'owner'){
          admin = true
        }
        //render the profile
        res.send(pug.renderFile("views/pages/ownprofile.pug", {user: user, orders: orders, admin: admin}));
      })
    });
  }else{
    res.redirect('/login.html');
  }
});

userRouter.param("cid", function(req, res, next, cid){
  req.cartBook = cid;
  next()
});

userRouter.get("/addcart/:cid", function(req, res){
  let flag = true;
  //checks if the cart is null
  if (req.session.cart == null){
    //if it is then just create an array with that book id
    req.session.cart  = [req.cartBook]
  }else{
    //otherwise, check if that book is already there
    for (let i = 0; i < req.session.cart.length; i++){
      if (req.session.cart[i].isbn === req.cartBook){
        //if so break and set the flag to false
        flag = false;
        break;
      }
    }
    //if the flag is there then push
    if (flag){
      req.session.cart.push(req.cartBook)
    }
  }
  //redirect
  res.redirect('/books/' + req.cartBook);
});

userRouter.get("/removecart/:cid", function(req, res){
  //checks if cart is null
  if (req.session.cart != null){
    //if there is, then loop and remove that element from the cart array if found
    for (let i = 0; i < req.session.cart.length; i++){
      if (req.session.cart[i] === req.cartBook){
        req.session.cart.splice(i, 1);
        break;
      }
    }
  }
  //redirect to that book that you removed
  res.redirect('/books/' + req.cartBook);
});

userRouter.get("/cart", function(req, res){
  //checks if you are logged in if not redirect to login page
  if (req.session.loggedIn){
    //checks if your cart is null if so, set cart to empty arry
    if (req.session.cart == null){
      req.session.cart = [];
    }
    //queries to all the books in the cart
    getSpecificBooks(req.session.cart, function(books){
      //queries for all the prices of the books
      getPriceOfSpecificBooks(req.session.cart, function(price){
        //if price doesn't exist then set to 0.00
        if (price.length == 0){
          price[0] = {total_price: 0.00}
        }
        //render the cart
        res.send(pug.renderFile("views/pages/cart.pug", {cart: books, total: price[0].total_price}));
      });
    });
  }else{
    res.redirect('/login.html');
  }
});

userRouter.get("/reports", function(req, res){
  //checks if you are an owner, if not redirect
  if (req.session.userid === "owner"){
    //checks if the query is null, if so then redirect to profile
    if (Object.keys(req.query).length === 0){
      res.redirect("/users/me");
    }else{
      //switch statement with the query types
      switch(req.query.type){
        case 'Publisher Report':
          //queries for the publisher report using the two days
          getSalesByPublisher([req.query.start_date, req.query.end_date], function(values){
            //parse to 2 decimals for all the values
            for (let i =0; i < values.length; i++){
              values[i].profit = parseFloat(values[i].profit).toFixed(2)
            }
            //renders the publisher report page
            res.send(pug.renderFile("views/pages/Reports.pug", {report: values, title: req.query.type, topic: "Publisher"}));
          })
          break;
        case 'Author Report':
          //queries for the author report using the two days
          getSalesByAuthor([req.query.start_date, req.query.end_date], function(values){
            //parse to 2 decimals for all the values
            for (let i =0; i < values.length; i++){
              values[i].profit = parseFloat(values[i].profit).toFixed(2)
            }
            //renders the author report page
            res.send(pug.renderFile("views/pages/Reports.pug", {report: values, title: req.query.type, topic: "Author"}));
          })
          break;
        case 'Genre Report':
          getSalesByGenre([req.query.start_date, req.query.end_date], function(values){
            //parse to 2 decimals for all the values
            for (let i =0; i < values.length; i++){
              values[i].profit = parseFloat(values[i].profit).toFixed(2)
            }
            //renders the genre report page
            res.send(pug.renderFile("views/pages/Reports.pug", {report: values, title: req.query.type, topic: "Genre"}));
          })
          break;
        case 'Total Report':
          //queries for the values of the total sales report
          getTotalSales([req.query.start_date, req.query.end_date], function(values){
            //give default values if it has none
            if (values.length === 0){
              values[0].sales = 0.00
              values[0].expensise = 0.00
              values[0].profit = 0.00
            }
            //parse to 2 decimals for all the values
            values[0].sales = parseFloat(values[0].sales).toFixed(2)
            values[0].expensise = parseFloat(values[0].expensise).toFixed(2)
            values[0].profit = parseFloat(values[0].profit).toFixed(2)
            //render the total report
            res.send(pug.renderFile("views/pages/Reports.pug", {report: values, title: req.query.type, topic: "Total"}));
          })
          break;
        default:
          //if none match, just redirect to profile page
          res.redirect("/users/me");
      }
    }
  }else{
    res.redirect("/users/me");
  }
});

module.exports = userRouter;
