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
  for (const [key, value] of Object.entries(request)){
    if (value === ''){
      delete request[key]
    }
  }
  if (Object.keys(request).length === 0){
    callback([])
  }else{
    console.log(request)
    let query_params = [];
    let index = 0;
    let query = 'SELECT DISTINCT Book.name, Book.isbn FROM Book, Book_author, Author, Publisher WHERE Book.isbn = Book_author.isbn AND Book_author.author_id = Author.author_id AND Book.publisher_id = Publisher.publisher_id'

    for (const [key, value] of Object.entries(request)){
      index = index + 1
      switch(key){
        case 'title':
          query = `${query} AND Book.name ILIKE '%' || $${index} || '%'`
          break;
        case 'Title':
          query = `${query} AND Book.name ILIKE '%' || $${index} || '%'`
          break;
        case 'isbn':
          query = `${query} AND Book.isbn = $${index}`
          break;
        case 'author_name':
          query = `${query} AND Author.name ILIKE '%' || $${index} || '%'`
          break;
        case 'publisher_name':
          query = `${query} AND Publisher.name ILIKE '%' || $${index} || '%'`
          break;
      }
      query_params.push(value)
    }
    console.log(query)
    console.log(query_params)
    client.query(query, query_params, (err, res)=>{
      if(err){
        throw err
      }else{
        callback(res.rows)
      }
    })
  }
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

const getOrder = (request, callback) =>{
  client.query(`SELECT * FROM Orders WHERE order_id = $1`, [request], (err, res)=>{
    if(err){
      throw(err)
    }else{
      callback(res.rows[0])
    }
  })
}

const addOrder = (request, callback) =>{
  console.log(request)
  client.query(`INSERT INTO Orders (user_id, destination, status, date_of_order) VALUES ($1, $2, $3, $4) RETURNING order_id`, [request.user_id, request.destination, request.status, request.date_of_order], (err, res)=>{
    if(err){
      callback("INVALID")
    }else{
      callback(res.rows[0].order_id)
    }
  })
}

const getOrderBooks = (request, callback) =>{
  client.query(`SELECT Book.isbn, Book.name, Book.price FROM Orders, Book_order, Book WHERE Orders.order_id = $1 AND Orders.order_id = Book_order.order_id AND Book_order.isbn = Book.isbn`, [request], (err, res)=>{
    if(err){
      throw(err)
    }else{
      callback(res.rows)
    }
  })
}

const addBooksInOrder = (request, callback) =>{
  if (request.length == 1){
    callback([])
  }else{
    console.log(request);
    let query =`INSERT INTO Book_order (order_id, isbn) 
    SELECT $1, isbn FROM book WHERE isbn = $2`;

    for (i = 3; i <= request.length; i++){
      query = `${query} OR isbn = $${i}`
    }

    client.query(query, request, (err, res)=>{
      if(err){
        callback("INVALID")
      }else{
        console.log(res)
        callback(res.order_id)
      }
    })
  }
}

const updateStockAfterOrder = (request, callback) =>{
  if (request.length == 0){
    callback([])
  }else{
    let query =`UPDATE Book SET stock = stock-1 WHERE isbn = $1`

    for (i = 1; i < request.length; i++){
      query = `${query} OR isbn = $${i+1}`
    }
    client.query(query, request, (err, res)=>{
      if(err){
        callback("INVALID")
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
  getPriceOfSpecificBooks,
  getOrder,
  getOrderBooks,
  addOrder,
  addBooksInOrder,
  updateStockAfterOrder
}
