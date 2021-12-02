const express = require('express');
const pug = require('pug');
let userRouter = express.Router();
const { addUser, login, getUser, getUserOrders } = require('../queries');
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
        console.log(user)
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
            console.log(user)
            res.send(pug.renderFile("views/pages/ownprofile.pug", {user: user, orders: orders}));
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

userRouter.get("/cart/:cid", function(req, res){
    console.log(req.session)
    if (req.session.cart == null){
      req.session.cart  = [req.cartBook]
    }else{
      req.session.cart.push(req.cartBook)
    }
    res.redirect('/books/' + req.cartBook);
});


// userRouter.post("/me/:mid", function(req, res){
//     //console.log(req.session.userid);
//     //console.log(req.params.mid);
//     data.addToWatchlist(req.session.userid, req.params.mid, function(user){
//         //console.log(user);
//         res.redirect("/users/me");
//     });
    
// });


// userRouter.param("uid", function(req, res, next, uid){
//     //here we should parse and also figure out if that person exists
//     req.uid = uid;
//     next();
    
// });
// userRouter.get("/:uid", function(req, res, next){
//     data.getUser(req.uid, function(user){
//         req.user = user;
//         let reviews = [];
//         req.people = {};
//         req.watch = {};
//         req.users = {};
//         console.log(req.user);
//         console.log(req.user.Reviews);
//         data.getListReview(req.user.Reviews, function(reviews){
//             req.reviews = reviews;
//             console.log(req.user.Following_People);
//             data.getListPerson(req.user.Following_People, function(people){
//                 req.people = people;
//                 console.log(req.user.Watchlist);
//                 data.getListMovie(req.user.Watchlist, function(watch){
//                     req.watch = watch;
//                     console.log(req.user.Following_Users);
//                     data.getListUser(req.user.Following_Users, function(user){
//                         req.users = user;
//                         res.send(pug.renderFile("views/pages/profile.pug", {user: req.user, followuser: req.users, followpeople: req.people, watchlist: req.watch, reviews: req.reviews}));
//                     })
//                 })
//             })
//         });
//     })

// });


module.exports = userRouter;
