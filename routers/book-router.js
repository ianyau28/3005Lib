const express = require('express');
let bookRouter = express.Router();
const path = require('path');
const pug = require('pug');
const session = require('express-session');
const { getBooksQuery, getBookById, getBookAuthors, getBookGenres } = require('../queries');

bookRouter.get("/", function(req,res){
    //checks for query
    if (Object.keys(req.query).length === 0){
        res.send(pug.renderFile("views/pages/browse.pug", {}));
    }else{
        console.log(req.query);

        getBooksQuery(req.query, function(books){
            res.send(pug.renderFile("views/pages/browse.pug", {search: books}));
        });
    }
});

bookRouter.param("bid", function(req, res, next, bid){
  req.isbn = bid;
  getBookById(req, function(book){
    req.book = book[0];
    getBookAuthors(req, function(authors){
      req.authors = authors;
      getBookGenres(req, function(genres){
        req.genres = genres;
        next();
      })
    })
  });
});


bookRouter.get("/:bid", function(req, res, next){
  // res.send("GET /movie/" + req.params.mid);
  console.log("HEY");
  console.log(req.book);
  console.log(req.authors);
  console.log(req.genres);
  res.send(pug.renderFile("views/pages/book.pug", {book: req.book, genres: req.genres, authors: req.authors}));
});

module.exports = bookRouter;