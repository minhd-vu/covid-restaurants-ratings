// ################ MYSQL DATABASE ################

const mysql = require('mysql');

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

module.exports = db;