const axios = require('axios');
require('dotenv').config();
const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
const port = 6969;
app.use(express.json());
app.use(cors());
const sql = require('mssql');


const config = ({
  user: CloudSA28c4ede7,
  password: Jaco4200,
  server: bronx.database.windows.net,
  database: bronxkunder,
  port: 1433,
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    }
})

app.post("/kunder", async function(request, response){
  navn = request.body.navn;
  efternavn = request.body.efternavn;
  email = request.body.email;
  password = request.body.password;
  medlem = request.body.medlemsskab;
  try{
    var poolConnection = await sql.connect(config)
  insertQuery = `INSERT INTO kunder (fornavn, efternavn, email, password, medlem) VALUES ('${navn}', '${efternavn}', '${email}', '${password}', '${medlem}')`;
  await poolConnection.request().query(insertQuery)
  response.send(`user with username ${navn} created.`)
  }
  catch (error) {
    console.log(error);
  }
});
app.delete("/kunde", async function(request, response) {
  try{
    var poolConnection = await sql.connect(config)
  insertQuery = `DELETE FROM kunder WHERE fornavn = '${request.body}'`;
  await poolConnection.request().query(insertQuery, (res, err) => {
    if (err) {
      console.log('Error deleting users:', err);
      response.send(console.log('Error deleting users:', err))
    } else {
      console.log('Users with name "Jacob" deleted successfully.');
    }
  })
  }
  catch(error){
    console.log(error)
  }
});
app.get('/kunder', async function(req, res) {
  try{
    var poolConnection = await sql.connect(config)
  insertQuery = `SELECT * FROM kunder;`;
  await poolConnection.request().query(insertQuery, (result, err) => {
    if (err) {
      console.log('Error deleting users:', err);
      res.json(err)
    } else {
      console.log('Users with name "Jacob" deleted successfully.');
    }
  })
  }
  catch(error){
    console.log(error)
  }
})
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('username', sql.NVarChar, username)
      .input('password', sql.NVarChar, password)
      .query('SELECT * FROM kunder WHERE email = @username AND password = @password');

    if (result.recordset.length > 0) {
      res.json({ message: 'Login successful' } && result);
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to perform login' });
  }
});
app.put('/users/:email', async (req, res) => {
    const email = req.params.email;
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query(`UPDATE kunder SET medlem = 'true' WHERE email = @email`);
    res.json({ message: 'Column updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update column' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
