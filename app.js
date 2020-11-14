const express = require('express');
const session = require('express-session');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 3000;

// ################ MYSQL DATABASE ################

const db_config_docker = {
  host: 'mysqldb',
  user: 'root',
  password: 'password',
  database: 'db'
};

const db_config_heroku = {
  host: "us-cdbr-east-02.cleardb.com",
  user: "b153d9cfa74121",
  password: "374a66f3",
  database: "heroku_8c4d1456ec24adb"
};

let db;
function handleDisconnect() {
  db = mysql.createConnection(db_config_heroku);
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static('public'));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new session.MemoryStore,
  cookie: {
    path: '/',
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});

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
        request.session.user = request.body.user;

        console.log(request.sessionID + " " + request.session.user);

        response.status(200).send(request.body.user + " has logged in.");
        console.log(request.body.user + " has logged in.");
      } else {
        response.status(204).send("Invalid username and password.");
        console.log("Invalid username and password.");
      }
    }
  });
});

app.get("/search", (request, response) => {
  response.sendFile(__dirname + "/public/search.html");
});

app.post("/search", (request, response) => {
  const sql = "SELECT * FROM places WHERE place_id = '" + request.body.place_id + "'";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else if (result.length > 0) {
      let json = '{ "reviews" : [';
      for (let i = 0; i < result.length; ++i) {
        json += '{ "user":"' + result[i].user + '" , "rating":' + result[i].rating + ' , "comment":"' + result[i].comment + '" }'
        if (i != result.length - 1) {
          json += ",";
        }
      }
      json += ' ]}';

      response.status(200).json(JSON.parse(json));
    } else {
      response.status(204).send("No covid reviews.");
    }
  });
});

app.get("/review", (request, response) => {
  if (request.session.user) {
    response.sendFile(__dirname + "/public/review.html");
  }
  else {
    return response.redirect("/login");
  }
});

app.post("/review", (request, response) => {
  console.log(request.sessionID + " " + request.session.user);
  if (request.session.user) {
    // Create the places table if it does not exist.
    db.query("CREATE TABLE IF NOT EXISTS places (place_id VARCHAR(255), user VARCHAR(255), rating INT, comment TEXT)", (err, result) => {
      if (err) {
        throw err;
      }
    });

    // Insert the review into the table.
    const sql = "INSERT INTO places (place_id, user, rating, comment) VALUES ('" + request.body.place_id + "','" + request.session.user + "','" + request.body.rating + "','" + request.body.comment + "')";
    db.query(sql, (err, result) => {
      if (err) {
        throw err;
      } else {
        response.status(200).send("Review entered succesfully.");
        console.log("Added review by " + request.session.user + " for place " + request.body.place_id + " into database.");
      }
    });
  } else {
    response.status(204).send("Must be logged in to submit a review.");
  }
});

app.listen(port, () => {
  console.log("Server running on http://localhost:%s/", port);
});