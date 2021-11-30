const express = require('express');
let bookRouter = express.Router();
const path = require('path');
const pug = require('pug');
const session = require('express-session');
const { getBooks } = require('../queries');

bookRouter.get("/", function(req,res){
  res.send(pug.renderFile("views/pages/browse.pug", {}));
    //checks for query
    // console.log(req.session);
    // if (Object.keys(req.query).length === 0){
    //     res.send(pug.renderFile("views/pages/browse.pug", {}));
    // }else{
    //     //res.send(pug.renderFile("views/pages/browse.pug", {search: data.getMovies()}));
    //     let page = parseInt(req.query.page)
    //     data.browseMovies(req.query, function(movies){
    //         //console.log(movies);
    //         let prev = false;
    //         let next= false;
    //         console.log(page);
    //         if (page > 1 && movies.length != 0){
    //             prev = true;
    //         }
    //         if (movies.length == 6){
    //             next = true;
    //             movies.pop();
    //         }
    //         res.send(pug.renderFile("views/pages/browse.pug", {search: movies, prev: prev, next: next}));
    //     });
        
    //     //res.send(pug.renderFile("views/pages/browse.pug", {search: movies}));
    // }
});

module.exports = bookRouter;