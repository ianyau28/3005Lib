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

module.exports = {
  getBooks,
  getBooksQuery,
  getBookById,
  getBookGenres,
  getBookAuthors
}
