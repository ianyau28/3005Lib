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
  let flag = false;
  if (req.session.cart != null){
    for (let i = 0; i<req.session.cart.length; i++){
      if (req.session.cart[i] === req.book.isbn){
        flag = true
      }
    }
  }
  res.send(pug.renderFile("views/pages/book.pug", {book: req.book, genres: req.genres, authors: req.authors, alreadyincart: flag}));
});

module.exports = bookRouter;