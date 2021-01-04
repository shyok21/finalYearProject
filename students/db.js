const mysql = require('mysql');

const con = mysql.createConnection({
    host: "sql12.freemysqlhosting.net",
    user: "sql12384616",
    password: "yWJQsReUSE",
    database: "sql12384616"
});

con.connect(function(err) {
    if (err)
        console.log("Database error");
    else
        console.log("Connected to Database");
});

module.exports = con;