// ################ MYSQL DATABASE ################

const mysql = require('mysql');

const db_config_docker = {
    host: 'mysqldb',
    user: 'root',
    password: 'password',
    database: 'db'
};

const db_config_heroku = {
    connectionLimit: 10,
    host: "us-cdbr-east-02.cleardb.com",
    user: "b153d9cfa74121",
    password: "374a66f3",
    database: "heroku_8c4d1456ec24adb"
};

const db = mysql.createPool(db_config_heroku);

module.exports = db;