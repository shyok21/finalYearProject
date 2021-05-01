const mysql = require('mysql');
const fs = require('fs');
//Change Cred in database.txt
var Db_data_cred = fs.readFileSync('database.txt','utf-8');
var data_cred = Db_data_cred.split("\n");
const con = mysql.createConnection({
    host: data_cred[0].split(": ")[1],
    user: data_cred[1].split(": ")[1],
    password: data_cred[3].split(": ")[1],
    database: data_cred[2].split(": ")[1],
    multipleStatements: true
});

con.connect(function(err) {
    if (err)
        console.log("Database error");
    else
        console.log("Connected to Database");
});

module.exports = con;
