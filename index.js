const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const bparser = require("body-parser");
const sqlite3 = require("sqlite3");

app.use(bparser.urlencoded({ extended: false }));

app.listen(port, () => {
  console.log(`The server is working at http://localhost:${port}/`);
});

// view engine

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// render pages

// Database connection

const db_name = path.join(__dirname, "data", "fsdapp.db");
const db = new sqlite3.Database(db_name, (err) => {
  if (err) {
    return console.log(err.message);
  }
  console.log("Database Connected");
});

// Create Table

const surveys = `CREATE TABLE IF NOT EXISTS surveys(
    timestamp VARCHAR(100) PRIMARY KEY ,
    gender VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL,
    typeOfInvest VARCHAR(100) NOT NULL,
    interest VARCHAR(100) NOT NULL,
    factors VARCHAR(200) NOT NULL,
    objectives VARCHAR(200) NOT NULL,
    monitering VARCHAR(100) NOT NULL,
    percentage INTEGER NOT NULL,
    source VARCHAR(100) NOT NULL
);`;

db.run(surveys, (err) => {
  if (err) {
    return console.log(err.message);
  }
  console.log("FSD Surveys table created successfully");
});
app.get("/", (req, res) => {
  res.render("form");
});

app.get("/surveys", (req, res) => {
  const sql = "SELECT * FROM surveys ORDER by timestamp DESC";

  db.all(sql, (err, rows) => {
    if (err) {
      return console.log(err.message);
    }
    console.log(rows);
    res.render("surveys", { surveys: rows });
  });
});

app.post("/", (req, res) => {
  const sql =
    "INSERT INTO surveys (timestamp, gender, age, typeOfInvest, interest, factors, objectives, monitering, percentage, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const d = new Date();
  let timestamp = d.toString();
  console.log(
    timestamp,
    req.body.gender,
    req.body.age,
    req.body.typeOfInvest,
    req.body.interest,
    req.body.factors,
    req.body.objectives,
    req.body.monitering,
    req.body.percentage,
    req.body.source
  );
  const values = [
    timestamp,
    req.body.gender,
    req.body.age,
    req.body.typeOfInvest,
    req.body.interest,
    req.body.factors,
    req.body.objectives,
    req.body.monitering,
    req.body.percentage,
    req.body.source,
  ];
  db.run(sql, values, (err) => {
    if (err) {
      console.log(err.message);
    }
    res.redirect("/surveys");
  });
});
