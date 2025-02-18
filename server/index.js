// imports here for express and pg
const express = require('express');
const app = express();
const path = require('path');
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://lauraunix:xinu2413@localhost:5432/acme_hr_db');

// static routes here (you only need these for deployment)
app.get('/', (req, res)=> res.sendFile(path.join(__dirname, '../client/dist/index.html')));
app.use(express.static(path.join(__dirname, '../client/dist')));
// app routes here
app.get('/api/employees', async (req, res, next) => {
  try {
    const SQL = `
      SELECT * from employees;
    `
    const response = await client.query(SQL)
    res.send(response.rows)
  } catch (ex) {
    next(ex)
  }
})

// create your init function
const init = async () => {
  await client.connect()
  const SQL = `
    DROP TABLE IF EXISTS employees;
    CREATE TABLE employees(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      is_admin BOOLEAN DEFAULT FALSE
    );
    INSERT INTO employees(name, is_admin) VALUES('Tom Windsor', false);
    INSERT INTO employees(name, is_admin) VALUES('Jen Allen', true);
    INSERT INTO employees(name) VALUES('Vivian Hotelling');
  `
  await client.query(SQL)
  console.log('data seeded')
  const port = process.env.PORT || 3000
  app.listen(port, () => console.log(`listening on port ${port}`))
}

// init function invocation
init()