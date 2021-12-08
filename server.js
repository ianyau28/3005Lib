const express = require('express');
const path = require('path');
const pug = require('pug');
const app = express();
const session = require('express-session');

//creating the session here
app.use (express.urlencoded({
    extended: true
  }));
app.use("/", session({secret: 'something here', loggedIn: false, user_id: '', cart: [], cookie:{ maxAge: 3600000 }}))

//creating the routers that we will be using
const bookRouter = require("./routers/book-router");
const userRouter = require("./routers/user-router");
const orderRouter = require('./routers/order-router');

//using the routers based on the url
app.use("/books", bookRouter);
app.use("/users", userRouter);
app.use("/orders", orderRouter);

//using the endpoints in the public file
app.use(express.static("public"));

app.listen(3000);
console.log("Server running at http://127.0.0.1:3000/");