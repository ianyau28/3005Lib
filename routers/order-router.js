const express = require('express');
const pug = require('pug');
let orderRouter = express.Router();
const { addOrder, addBooksInOrder } = require('../queries');
const session = require('express-session');


userRouter.get("/", function(req, res){
    res.send(pug.renderFile("views/pages/browse.pug", {}));
});





module.exports = orderRouter;
