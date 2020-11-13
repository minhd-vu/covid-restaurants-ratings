const express = require('express');
const session = require('express-session')
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const fs = require('fs');
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ################ MYSQL DATABASE ################

const db_config_docker = {
  host: 'mysqldb',
  user: 'root',
  password: 'password',
  database: 'db'
};

const db_config_heroku = {
  connectionLimit: 1,
  host: "us-cdbr-east-02.cleardb.com",
  user: "b153d9cfa74121",
  password: "374a66f3",
  database: "heroku_8c4d1456ec24adb"
};

let db;
function handleDisconnect() {
  db = mysql.createConnection(db_config_docker);
  db.connect(function onConnect(err) {
    if (err) {
      console.log(err);
      setTimeout(handleDisconnect, 10000);
    }
  });
  db.on("error", function onError(err) {
    console.log(err);
    if (err.code == 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}
handleDisconnect();

// ################ EXPRESS SERVER ################

app.use(express.static('public'));

app.use(session({
  secret: 'keyboard cat',
  cookie: { secure: true }
}))

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/home.html");
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
  const sql = "INSERT INTO users (user, password) VALUES ('" + request.body.user + "','" + request.body.password + "')";
  db.query(sql, (err, result) => {
    if (err) {
      if (err.errno == 1062) {
        console.log("Username already exists.");
      } else if (err) {
        throw err;
      }
    } else {
      response.status(200).send("User registered successfully.");
      console.log("Inserted new user into database.");
    }
  });
});

app.post("/login", (request, response) => {
  const sql = "SELECT * FROM users WHERE user = '" + request.body.user + "'";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else if (result.length > 0) {
      if (result[0].password === request.body.password) {
        request.session.user_id = 0;
        response.status(200).send("Succesfully logged in.");
        console.log("Sucessfully logged in.");
      } else {
        response.status(204).send("Invalid username and password.");
        console.log("Invalid username and password.");
      }
    }
  });
});

app.get("/search", (request, response) => {
  // console.log(request.param('id'));
  response.sendFile(__dirname + "/public/search.html");
});

app.post("/search", (request, response) => {
  const sql = "SELECT * FROM places WHERE place_id = '" + request.body.place_id + "'";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else if (result.length > 0) {
      console.log(result);

      let text = '{ "reviews" : [';
      for (let i = 0; i < result.length; ++i) {
        text += '{ "user":"' + result[i].user + '" , "rating":' + result[i].rating + ' , "comment":"' + result[i].comment + '" }'
        if (i != result.length - 1) {
          text += ",";
        }
      }
      text += ' ]}';

      let jsonRes = JSON.parse(text);
      console.log(jsonRes);

      response.status(200).json(jsonRes);
    } else {
      response.status(204).send("No covid reviews.");
    }
  });
});

app.get("/review", (request, response) => {
  response.sendFile(__dirname + "/public/review.html");
});

app.post("/review", (request, response) => {

  // Create the places table if it does not exist.
  db.query("CREATE TABLE IF NOT EXISTS places (place_id VARCHAR(255), user VARCHAR(255), rating INT, comment TEXT)", (err, result) => {
    if (err) throw err;
    console.log("Table places created.");
  });

  // Insert the review into the table.
  const sql = "INSERT INTO places (place_id, user, rating, comment) VALUES ('" + request.body.place_id + "','" + request.body.user + "','" + request.body.rating + "','" + request.body.comment + "')";
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    } else {
      response.status(200).send("Review entered succesfully.");
      console.log("Inserted new review into database.");
    }
  });
});

app.listen(port, () => {
  console.log("Server running on http://localhost:%s/", port);
});