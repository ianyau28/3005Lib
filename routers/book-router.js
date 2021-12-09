const express = require('express');
let bookRouter = express.Router();
const path = require('path');
const pug = require('pug');
const session = require('express-session');
const { deleteBook, getBooksQuery, getBookById, getBookAuthors, getBookGenres, getAuthors,  getPublisher, addBook, addBookAuthors, addGenres, getPublisherByID, addAuthor, addPublisher, addPhonenumbers} = require('../Queries/queries');


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

bookRouter.get("/addBook", function(req,res){
  //checks for the admin
  if (req.session.userid === "owner"){
    res.send(pug.renderFile("views/pages/addBook.pug", {}));
  }else{
    res.redirect("/login.html");
  }
});

bookRouter.post("/addbook", function(req, res){
  //formats the authors and genres into the right format
  req.body.authors = req.body.author_name.split(",");
  req.body.genres = req.body.genre_name.split(",");
  //gets the author ids
  getAuthors(req.body.authors, function(authors){
    //redirect if there are some issues with the query 
    if(authors.length == req.body.authors.length){
      //gets an array of author ids
      let author_ids = []
      for (let i = 0; i < authors.length; i++){
        author_ids.push(authors[i].author_id)
      }
      //queries for the publisher
      getPublisher(req.body.publisher_name, function(publisher){
        //redirect if there are any issues
        if (publisher == "INVALID" || publisher.length == 0){
          console.log("INVLID PUBLISHER")
          res.redirect("/books/addBook")
        }else{
          //creates input and adds book to the book table in the databse
          req.querybody = [req.body.isbn, req.body.title, publisher[0].publisher_id, req.body.pages, req.body.price, req.body.publisher_cut, req.body.cost, req.body.stock]
          addBook(req.querybody, function(book){
            //if there is something wrong, redirect
            if (book == "INVALID"){
              console.log('INVALID ADD')
              res.redirect("/books/addBook")
            }else{
              //adds to the book_authors table i nthe database 
              query = [req.querybody[0]]
              query = query.concat(author_ids)
              addBookAuthors(query, function(book_authors){
                //redirect if there are issues
                if (book_authors == "INVALID"){
                  console.log('INVALID ADD')
                  res.redirect("/books/addBook")
                }else{
                  //adds the genres to the genre table in the database
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
      res.redirect("/books/addBook")
    }
  });
});

bookRouter.post("/deletebook", function(req, res){
  //delete book from the database
  deleteBook(req.body.isbn, function(result){
    //if something is wrong redirect back to that book
    if(result == "INVALID"){
      console.log("INBALID ISBN")
      res.redirect("/books/" + req.body.isbn)
    }else{
      console.log("DELETE BOOK")
      res.redirect("/books");
    }
  });
});

bookRouter.post("/addAuthor", function(req, res){
  //add Author to the database
  addAuthor([req.body.author_name, req.body.author_email], function(result){
    if(result == "INVALID"){
      console.log("INBALID INSERT")
      res.redirect("/books/addBook")
    }else{
      console.log("Good!")
      res.redirect("/books/addBook");
    }
  });
});

bookRouter.post("/addPublisher", function(req, res){
  //add Publisher to the database
  addPublisher([req.body.publisher_name, req.body.publisher_address, req.body.publisher_email, req.body.publisher_bank], function(result){
    if(result == "INVALID"){
      console.log("INBALID INSERT")
      res.redirect("/books/addBook")
    }else{
      req.body.phonenumbers = req.body.publisher_phonenumbers.split(",")
      addPhonenumbers(result, req.body.phonenumbers, function(){
        console.log("Good!");
        res.redirect("/books/addBook");
      })
    }
  });
});

bookRouter.param("bid", function(req, res, next, bid){
  req.isbn = bid;
  //gets the book by the id
  getBookById(req, function(book){
    req.book = book[0];
    //if something is wrong move on
    if (book.length === 0){
      req.isbn = "INVALID"
      next()
    }else{
      //queries for the book authors
      getBookAuthors(req, function(authors){
        req.authors = authors;
        //query to get publisher name
        getPublisherByID(req.book.publisher_id, function(publisher){
          req.publisher = publisher[0].name;
          //queries for the genres
          getBookGenres(req, function(genres){
            req.genres = genres;
            next();
          })
        })
      })
    }
  });
});

bookRouter.get("/:bid", function(req, res, next){
  let admin = false;
  //if there are issues then redirect
  if (req.isbn === "INVALID"){
    res.redirect("/books")
  }else{
    //if you are the admin then set admin as true
    if (req.session.userid === "owner"){
      admin = true;
    }
    let flag = false;
    //checks if this is already in the cart
    if (req.session.cart != null){
      for (let i = 0; i<req.session.cart.length; i++){
        if (req.session.cart[i] === req.book.isbn){
          flag = true
        }
      }
    }
    //create the book page
    res.send(pug.renderFile("views/pages/book.pug", {book: req.book, genres: req.genres, authors: req.authors, publisher: req.publisher, alreadyincart: flag, logged: req.session.loggedIn, admin: admin}));
  }
});

module.exports = bookRouter;