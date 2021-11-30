const express = require('express');
const path = require('path');
const pug = require('pug');
const app = express();
const session = require('express-session');
const { getBooks } = require('./queries');


app.use (express.urlencoded({
    extended: true
  }));
app.use("/", session({secret: 'something here', loggedIn: false, cookie:{ maxAge: 3600000 }}))


const bookRouter = require("./routers/book-router");
// const reviewRouter = require("./routers/review-router");
// const personRouter = require("./routers/person-router");
// const userRouter = require("./routers/user-router");

// app.use("/movies", movieRouter);
app.use("/books", bookRouter);
app.get("/dude", getBooks);

app.use(express.static("public"));

app.get("/", function(req, res){
  res.json({info: 'Node.js, Express, and Postgres API'})
});
app.listen(3000);
console.log("Server running at http://127.0.0.1:3000/");