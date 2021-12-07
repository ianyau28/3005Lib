const express = require('express');
const pug = require('pug');
let userRouter = express.Router();
const { addUser, login, getUser, getUserOrders, getSpecificBooks, getPriceOfSpecificBooks, getSalesByAuthor, getSalesByPublisher, getSalesByGenre, getTotalSales } = require('../queries');
const session = require('express-session');


userRouter.get("/", function(req, res){
    res.send(pug.renderFile("views/pages/browse.pug", {}));
});

userRouter.post("/", function(req, res){
    res.redirect("/users/me")
});

userRouter.post("/", function(req, res){
    console.log(req);
    //will also need to check if someone already has that username

        addUser(req.body, function(user){
          if (user == "INVALID"){
            console.log("INVALID USERNAME");
            res.redirect("/signup.html");
          }else{
            console.log(user);
            req.session.userid = user;
            req.session.loggedIn = true;
            res.redirect("/users/me");
          }
        });
});

userRouter.get("/log", function(req, res){
    if (req.session.loggedIn){
        req.session.loggedIn = false;
        req.session.userid = '';
        req.session.cart = [];
        console.log("Logged Out");
        res.redirect("/");
    }else{
        res.redirect("/login.html");
    }
});

// userRouter.get("/admin", function(req, res){
//     console.log(req.session);
//     req.session.admin = !req.session.admin;
//     res.redirect("/users/me");
// });

userRouter.get("/login", function(req, res){

    login(req.query, function(user){
        if (user.length > 0){
            console.log("LOGGING IN...");
            req.session.loggedIn = true;
            req.session.userid = user;
            res.redirect("/users/me");
        }else{
            res.redirect("/login.html")
        }
    });
});

userRouter.get("/me", function(req, res){
    if (req.session.loggedIn){
        getUser(req.session.userid, function(user){
          getUserOrders(req.session.userid, function(orders){
            let admin = false
            if (user.user_id === 'owner'){
              admin = true
            }
            res.send(pug.renderFile("views/pages/ownprofile.pug", {user: user, orders: orders, admin: admin}));
          })
        });
    }else{
        //alert("Please log in first!");
        res.redirect('/login.html');
    }
});

userRouter.param("cid", function(req, res, next, cid){
  req.cartBook = cid;
  next()
});

userRouter.get("/addcart/:cid", function(req, res){
    let flag = true;
    if (req.session.cart == null){
      req.session.cart  = [req.cartBook]
    }else{
      for (let i = 0; i < req.session.cart.length; i++){
        if (req.session.cart[i].isbn === req.cartBook){
          flag = false;
          break;
        }
      }
      if (flag){
        req.session.cart.push(req.cartBook)
      }
    }
    console.log(req.session.cart)
    res.redirect('/books/' + req.cartBook);
});

userRouter.get("/removecart/:cid", function(req, res){
  console.log("HERE")
  if (req.session.cart != null){
    for (let i = 0; i < req.session.cart.length; i++){
      if (req.session.cart[i] === req.cartBook){

        req.session.cart.splice(i, 1);
        break;
      }
    }
  }
  console.log(req.session.cart)
  res.redirect('/books/' + req.cartBook);
});

userRouter.get("/cart", function(req, res){
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
        res.send(pug.renderFile("views/pages/cart.pug", {cart: books, total: price[0].total_price}));
      });
    });
  }else{
    res.redirect('/login.html');
  }
});

userRouter.get("/reports", function(req, res){
  if (req.session.userid === "owner"){
    if (Object.keys(req.query).length === 0){
      res.redirect("/users/me");
    }else{
      console.log(req.query)
      switch(req.query.type){
        case 'Publisher Report':
          getSalesByPublisher([req.query.start_date, req.query.end_date], function(values){
            for (let i =0; i < values.length; i++){
              values[i].profit = parseFloat(values[i].profit).toFixed(2)
            }
            res.send(pug.renderFile("views/pages/Reports.pug", {report: values, title: req.query.type, topic: "Publisher"}));
          })
          break;
        case 'Author Report':
          getSalesByAuthor([req.query.start_date, req.query.end_date], function(values){
            for (let i =0; i < values.length; i++){
              values[i].profit = parseFloat(values[i].profit).toFixed(2)
            }
            res.send(pug.renderFile("views/pages/Reports.pug", {report: values, title: req.query.type, topic: "Author"}));
          })
          break;
        case 'Genre Report':
          getSalesByGenre([req.query.start_date, req.query.end_date], function(values){
            for (let i =0; i < values.length; i++){
              values[i].profit = parseFloat(values[i].profit).toFixed(2)
            }
            res.send(pug.renderFile("views/pages/Reports.pug", {report: values, title: req.query.type, topic: "Genre"}));
          })
          break;
        case 'Total Report':
          getTotalSales([req.query.start_date, req.query.end_date], function(values){
            if (values.length === 0){
              values[0].sales = 0.00
              values[0].expensise = 0.00
              values[0].profit = 0.00
            }
            values[0].sales = parseFloat(values[0].sales).toFixed(2)
            values[0].expensise = parseFloat(values[0].expensise).toFixed(2)
            values[0].profit = parseFloat(values[0].profit).toFixed(2)
            res.send(pug.renderFile("views/pages/Reports.pug", {report: values, title: req.query.type, topic: "Total"}));
          })
          break;
        default:
          res.redirect("/users/me");
      }
    }
  }else{
    res.redirect("/users/me");
  }
});

module.exports = userRouter;
