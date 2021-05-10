const mysql = require('mysql');
const fs = require('fs');
const { DB_HOST, DB_USERNAME, DB_NAME, DB_PASSWORD } = require('./config');

const con = mysql.createConnection({
    host: DB_HOST,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    multipleStatements: true
});

var connectWithRetry = function(attempt) {
    con.connect(function(err) {
        if (err)
        {
            console.log("Database error");
            if(attempt>0)
            {
                setTimeout(()=>{connectWithRetry(attempt-1)},2000);
            }
        }
        else
            console.log("Connected to Database");
    });
};
connectWithRetry(10);

module.exports = con;
