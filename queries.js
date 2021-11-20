const {Client} = require('pg');

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "p0$tgreSqL",
  databse: "postgres"
})
client.connect();

const getInstruc = (request, response) => {
  client.query(`Select * from instructor`, (err, res)=>{
    if(err){
      throw err
    }else{
      response.status(200).json(res.rows)
    }
  })
}

module.exports = {
  getInstruc
}
