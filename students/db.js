const mysql = require('mysql');

const con = mysql.createConnection({
    host: "fypdatabase.c3lhoz340eat.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "A987yuBU",
	database: "phd_management"
});

con.connect(function(err) {
    if (err)
        console.log("Database error");
    else
        console.log("Connected to Database");
});

module.exports = con;