// ################ APPLICATION ################

const express = require('express');
const session = require('express-session');
const favicon = require('serve-favicon')
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const db = require("./db");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(__dirname + '/public'));

app.use(favicon(__dirname + '/public/res/images/favicon.ico'));

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
    db.getConnection((err, connection) => {
        // Create the users table if it does not exist.
        db.query("CREATE TABLE IF NOT EXISTS users (user VARCHAR(255) UNIQUE, password VARCHAR(255))", (err, result) => {
            if (err) throw err;
            // Create the users table if it does not exist.
            connection.query("CREATE TABLE IF NOT EXISTS users (user VARCHAR(255) UNIQUE, password VARCHAR(255))", function (err, result) {
                if (err) throw err;

                // Insert the username and password into the table.
                const sql = "INSERT INTO users (user, password) VALUES ('" + request.body.user + "','" + request.body.password + "')";
                connection.query(sql, (err, result) => {
                    if (err) {
                        if (err.errno == 1062) {
                            response.status(230).send("Username already exists.");
                            console.log("Username already exists.");
                        } else {
                            throw err;
                        }
                    } else {
                        response.status(200).send("User registered successfully.");
                        console.log("Inserted new user into database.");
                    }
                });
            });
        });
    });
});

app.post("/login", (request, response) => {
    const sql = "SELECT * FROM users WHERE user = '" + request.body.user + "'";

    db.getConnection((err, connection) => {
        if (err) throw err;

        connection.query(sql, (err, result) => {
            connection.release();
            if (err) throw err;
            let message;
            let status;
            if (result.length > 0 && result[0].password === request.body.password) {
                request.session.user = request.body.user;

                status = 200;
                message = request.body.user + " has logged in.";
            } else {
                status = 230;
                message = "Invalid username and password.";
            }

            response.status(status).send(message);
            console.log(message);
        });
    });
});

app.get("/search", (request, response) => {
    response.sendFile(__dirname + "/public/search.html");
});

app.post("/search", (request, response) => {
    const sql = "SELECT * FROM places WHERE place_id = '" + request.body.place_id + "'";
    db.getConnection((err, connection) => {
        if (err) throw err;

        connection.query(sql, (err, result) => {
            connection.release();
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
                response.status(230).send("No Results");
            }
        });
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
    if (request.session.user) {
        db.getConnection((err, connection) => {
            if (err) throw err;

            // Create the places table if it does not exist.
            connection.query("CREATE TABLE IF NOT EXISTS places (place_id VARCHAR(255), user VARCHAR(255), rating INT, comment TEXT)", (err, result) => {
                if (err) throw err;

                // Insert the review into the table.
                const sql = "INSERT INTO places (place_id, user, rating, comment) VALUES ('" + request.body.place_id + "','" + request.session.user + "','" + request.body.rating + "','" + request.body.comment + "')";
                connection.query(sql, (err, result) => {
                    connection.release();
                    if (err) throw err;
                    response.status(200).send("Review entered succesfully.");
                    console.log("Added review by " + request.session.user + " for place " + request.body.place_id + " into database.");
                });
            });
        });
    } else {
        response.status(230).send("Must be logged in to submit a review.");
    }
});

app.get("/map", (request, response) => {
    response.sendFile(__dirname + "/public/map.html");
});

app.get("/user/:username", (request, response) => {
    response.sendFile(__dirname + "/public/userprofile.html");
});

app.post("/user/:username", (request, response) => {
    const sql = "SELECT * FROM places WHERE user = '" + request.params.username + "'";
    db.getConnection((err, connection) => {
        if (err) throw err;

        connection.query(sql, (err, result) => {
            connection.release();
            if (err) throw err;
            else if (result.length > 0) {
                let json = '{ "name":"' + request.params.username + '", "reviews": [';
                for (let i = 0; i < result.length; ++i) {
                    json += '{ "place_id":"' + result[i].place_id + '" , "rating":' + result[i].rating + ' , "comment":"' + result[i].comment + '" }'
                    if (i != result.length - 1) {
                        json += ",";
                    }
                }
                json += ' ]}';

                response.status(200).json(JSON.parse(json));
            } else {
                response.status(230).send("No Results");
            }
        });
    });
});


module.exports = app;