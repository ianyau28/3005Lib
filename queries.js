const {Client} = require('pg');

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "p0$tgreSqL",
  databse: "postgres"
})
client.connect();

const getBooks = (request, response) => {
  client.query(`Select * from Book`, (err, res)=>{
    if(err){
      throw err
    }else{
      response.status(200).json(res.rows)
    }
  })
}


const getBooksQuery = (request, callback) => {
  client.query(`SELECT * FROM Book WHERE name ILIKE '%' || $1 || '%'`, [request.Title], (err, res)=>{
    if(err){
      throw err
    }else{
      callback(res.rows)
    }
  })
}

const getBookById = (request, callback) => {
  client.query(`SELECT * FROM Book WHERE isbn = $1`, [request.isbn], (err, res)=>{
    if(err){
      throw err
    }else{
      callback(res.rows)
    }
  })
}
const getBookGenres = (request, callback) => {
  client.query(`SELECT Genre.name FROM Genre WHERE isbn = $1`, [request.book.isbn], (err, res)=>{
    if(err){
      throw err
    }else{
      callback(res.rows)
    }
  })
}
const getBookAuthors = (request, callback) => {
  client.query(`SELECT Author.name FROM Book, Author, Book_author WHERE Book.isbn = Book_author.isbn AND Author.author_id = Book_author.author_id AND Book.isbn = $1`, [request.book.isbn], (err, res)=>{
    if(err){
      throw err
    }else{
      callback(res.rows)
    }
  })
}

const addUser = (request, callback) =>{
  client.query(`INSERT INTO Users (user_id, email_address, phone_number, password) VALUES ($1, $2, $3, $4)`, [request.username, request.email, request.phonenumber, request.password], (err, res)=>{
    if(err){
      callback("INVALID")
    }else{
      console.log("YOYOYO")
      callback(request.username)
    }
  })
}

const login = (request, callback) =>{
  client.query(`SELECT user_id FROM Users WHERE user_id = $1 AND password = $2`, [request.username, request.password], (err, res)=>{
    if(err){
      throw(err)
    }else{
      if (res.rows.length > 0){
        callback(res.rows[0].user_id)
      }else{
        callback("")
      }
    }
  })
}

const getUser = (request, callback) =>{
  client.query(`SELECT * FROM Users WHERE user_id = $1`, [request], (err, res)=>{
    if(err){
      throw(err)
    }else{
      callback(res.rows[0])
    }
  })
}

const getUserOrders = (request, callback) =>{
  client.query(`SELECT * FROM Orders WHERE user_id = $1`, [request], (err, res)=>{
    if(err){
      throw(err)
    }else{
      callback(res.rows)
    }
  })
}

const getSpecificBooks = (request, callback) =>{
  if (request.length == 0){
    callback([])
  }else{
    let query = `SELECT * FROM Book WHERE isbn = $1`;
    for (i = 2; i <= request.length; i++){
      query = `${query} OR isbn = $${i}`
    }
    // console.log(query);
    client.query(query, request, (err, res)=>{
      if(err){
        throw(err)
      }else{
        callback(res.rows)
      }
    })
  }
}

const getPriceOfSpecificBooks = (request, callback) =>{
  if (request.length == 0){
    callback([])
  }else{
    let query = `SELECT sum(price) AS total_price FROM Book WHERE isbn = $1`;
    for (i = 2; i <= request.length; i++){
      query = `${query} OR isbn = $${i}`
    }
    // console.log(query);
    client.query(query, request, (err, res)=>{
      if(err){
        throw(err)
      }else{
        callback(res.rows)
      }
    })
  }
}

module.exports = {
  getBooks,
  getBooksQuery,
  getBookById,
  getBookGenres,
  getBookAuthors,
  addUser,
  login,
  getUser,
  getUserOrders,
  getSpecificBooks,
  getPriceOfSpecificBooks
}
