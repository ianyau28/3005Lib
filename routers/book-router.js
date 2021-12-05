const express = require('express');
let bookRouter = express.Router();
const path = require('path');
const pug = require('pug');
const session = require('express-session');
const { getBooksQuery, getBookById, getBookAuthors, getBookGenres, getAuthors,  getPublisher, addBook, addBookAuthors, addGenres} = require('../queries');

bookRouter.get("/", function(req,res){
    //checks for query
    if (Object.keys(req.query).length === 0){
        res.send(pug.renderFile("views/pages/browse.pug", {}));
    }else{
      console.log(req.query)
        getBooksQuery(req.query, function(books){
            res.send(pug.renderFile("views/pages/browse.pug", {search: books}));
        });
    }
});

bookRouter.get("/genres", function(req,res){
  //checks for query
  genres = ["hello there", "goodbye", "yeeter"]
  addGenres(1, genres, function(yay){
    console.log(yay);
    console.log("we DID IT")
  })
});

bookRouter.post("/addbook", function(req, res){
  //need to be stufff
  console.log(req.body)
  req.body.authors = req.body.author_name.split(",");
  req.body.genres = req.body.genre_name.split(",");
  getAuthors(req.body.authors, function(authors){
    if(authors.length == req.body.authors.length){
      console.log(authors)
      let author_ids = []
      for (let i = 0; i < authors.length; i++){
        author_ids.push(authors[i].author_id)
      }
      getPublisher(req.body.publisher_name, function(publisher){
        if (publisher == "INVALID" || publisher.length == 0){
          console.log("INVLID PUBLISHER")
        }else{
          req.querybody = [req.body.isbn, req.body.title, publisher[0].publisher_id, req.body.pages, req.body.price, req.body.publisher_cut, req.body.cost, req.body.stock]
          addBook(req.querybody, function(book){
            if (book == "INVALID"){
              console.log('INVALID ADD')
            }else{
              query = [req.querybody[0]]
              query = query.concat(author_ids)
              console.log(query)
              addBookAuthors(query, function(book_authors){
                if (book_authors == "INVALID"){
                  console.log('INVALID ADD')
                }else{
                  addGenres(req.body.isbn, req.body.genres, function(yay){
                    res.redirect("/books/" + req.querybody[0])
                  })
                  
                }
              });
            }
          });
        }
      });
    }else{
      console.log("INVALID AUTHORS")
    }
  });
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
  //instead we could let them add to cart before log in. then make them log in later
  res.send(pug.renderFile("views/pages/book.pug", {book: req.book, genres: req.genres, authors: req.authors, alreadyincart: flag, logged: req.session.loggedIn}));
});

module.exports = bookRouter;