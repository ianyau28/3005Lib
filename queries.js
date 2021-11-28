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

module.exports = {
  getBooks
}
