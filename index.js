var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var fs = require('fs');
var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ################ MYSQL DATABASE ################

var db = mysql.createConnection({
  host: "mysqldb",
  user: "root",
  password: "password",
  database: "db"
});

db.connect(function (err) {
  if (err) throw err;
  console.log("Connected to MySQL database.");
});

// ################ EXPRESS SERVER ################

app.use(express.static('public'));

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/index.html");
});

app.get("/login", (request, response) => {
  response.sendFile(__dirname + "/public/login.html");
});

app.get("/register", (request, response) => {
  response.sendFile(__dirname + "/public/register.html");
});

app.post("/register", (request, response) => {
  // Create the users table if it does not exist.
  db.query("CREATE TABLE IF NOT EXISTS users (user VARCHAR(255) UNIQUE, password VARCHAR(255))", function (err, result) {
    if (err) throw err;
    console.log("Table users created.");
  });

  // Insert the username and password into the table.
  var sql = "INSERT INTO users (user, password) VALUES ('" + request.body.user + "','" + request.body.password + "')";
  db.query(sql, (err, result) => {
    if (err) {
      if (err.errno == 1062) {
        console.log("Username already exists.");
        return response.redirect("/register");
      }
      else {
        throw err;
      }
    }

    console.log("Inserted new user into database.");
  });
});

app.post("/login", (request, response) => {
  var sql = "SELECT * FROM users WHERE user = '" + request.body.user + "'";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else if (result.length > 0) {
      if (result[0].password === request.body.password) {

        // response.send({
        //   "code": 200,
        //   "success": "Successfully logged in.",
        // });

        console.log("Sucessfully logged in.");
        return response.redirect("/");
      } else {
        response.send({
          "code": 204,
          "success": "Invalid username and password."
        });
        console.log("Invalid username and password.");
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});